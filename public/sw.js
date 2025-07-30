// Atlas Sanctum Service Worker - Production-Ready PWA Implementation

const CACHE_NAME = 'atlas-sanctum-v1.0.0';
const CACHE_VERSION = '1.0.0';

// Cache strategies configuration
const CACHE_STRATEGIES = {
  images: { strategy: 'cacheFirst', maxAge: 7 * 24 * 60 * 60 * 1000 }, // 7 days
  api: { strategy: 'networkFirst', maxAge: 60 * 1000 }, // 1 minute
  static: { strategy: 'staleWhileRevalidate', maxAge: 24 * 60 * 60 * 1000 }, // 1 day
  fonts: { strategy: 'cacheFirst', maxAge: 30 * 24 * 60 * 60 * 1000 }, // 30 days
  analytics: { strategy: 'networkOnly' },
};

// Resources to cache on install
const PRECACHE_RESOURCES = [
  '/',
  '/dashboard',
  '/sanctum-map',
  '/analytics',
  '/library',
  '/fellowship',
  '/dignity-coin',
  '/pain-transmutation',
  '/manifest.json',
  '/offline.html',
  // Add critical CSS and JS files
  '/client/global.css',
];

// API endpoints for background sync
const SYNC_ENDPOINTS = [
  '/api/user/profile',
  '/api/metrics/dashboard',
  '/api/notifications',
];

// Notification configurations
const NOTIFICATION_CONFIG = {
  badge: '/icons/badge-72x72.png',
  icon: '/icons/icon-192x192.png',
  vibrate: [100, 50, 100],
  requireInteraction: false,
  silent: false,
};

class CacheManager {
  constructor() {
    this.strategies = CACHE_STRATEGIES;
  }

  async cacheFirst(request, cacheName) {
    const cache = await caches.open(cacheName);
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse) {
      // Check if cache is still valid
      const cacheTime = new Date(cachedResponse.headers.get('sw-cache-time') || 0);
      const strategy = this.getStrategy(request.url);
      
      if (Date.now() - cacheTime.getTime() < strategy.maxAge) {
        return cachedResponse;
      }
    }

    try {
      const networkResponse = await fetch(request);
      if (networkResponse.ok) {
        const responseClone = networkResponse.clone();
        const headers = new Headers(responseClone.headers);
        headers.set('sw-cache-time', new Date().toISOString());
        
        const modifiedResponse = new Response(responseClone.body, {
          status: responseClone.status,
          statusText: responseClone.statusText,
          headers: headers,
        });
        
        cache.put(request, modifiedResponse);
      }
      return networkResponse;
    } catch (error) {
      return cachedResponse || this.getOfflineFallback(request);
    }
  }

  async networkFirst(request, cacheName) {
    const cache = await caches.open(cacheName);
    
    try {
      const networkResponse = await fetch(request);
      if (networkResponse.ok) {
        cache.put(request, networkResponse.clone());
      }
      return networkResponse;
    } catch (error) {
      const cachedResponse = await cache.match(request);
      return cachedResponse || this.getOfflineFallback(request);
    }
  }

  async staleWhileRevalidate(request, cacheName) {
    const cache = await caches.open(cacheName);
    const cachedResponse = await cache.match(request);

    // Always try to update cache in background
    fetch(request)
      .then(networkResponse => {
        if (networkResponse.ok) {
          cache.put(request, networkResponse.clone());
        }
      })
      .catch(() => {}); // Ignore network errors in background

    return cachedResponse || fetch(request).catch(() => this.getOfflineFallback(request));
  }

  async networkOnly(request) {
    return fetch(request).catch(() => this.getOfflineFallback(request));
  }

  getStrategy(url) {
    if (url.includes('/api/')) return this.strategies.api;
    if (url.match(/\.(png|jpg|jpeg|gif|webp|svg)$/)) return this.strategies.images;
    if (url.match(/\.(woff|woff2|ttf|otf)$/)) return this.strategies.fonts;
    if (url.includes('analytics') || url.includes('metrics')) return this.strategies.analytics;
    return this.strategies.static;
  }

  async getOfflineFallback(request) {
    if (request.destination === 'document') {
      return caches.match('/offline.html');
    }
    
    if (request.destination === 'image') {
      return new Response(
        '<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200"><rect width="200" height="200" fill="#f0f0f0"/><text x="50%" y="50%" text-anchor="middle" fill="#666">Offline</text></svg>',
        { headers: { 'Content-Type': 'image/svg+xml' } }
      );
    }

    return new Response('Offline', { status: 503 });
  }
}

class BackgroundSyncManager {
  constructor() {
    this.syncQueue = [];
    this.isOnline = navigator.onLine;
  }

  async addToQueue(data) {
    this.syncQueue.push({
      id: Date.now() + Math.random(),
      data,
      timestamp: Date.now(),
      retries: 0,
    });
    
    await this.saveQueue();
    
    if (this.isOnline) {
      this.processSyncQueue();
    }
  }

  async saveQueue() {
    try {
      const cache = await caches.open('sync-queue');
      await cache.put('/sync-queue', new Response(JSON.stringify(this.syncQueue)));
    } catch (error) {
      console.warn('Failed to save sync queue:', error);
    }
  }

  async loadQueue() {
    try {
      const cache = await caches.open('sync-queue');
      const response = await cache.match('/sync-queue');
      if (response) {
        this.syncQueue = await response.json();
      }
    } catch (error) {
      console.warn('Failed to load sync queue:', error);
    }
  }

  async processSyncQueue() {
    const processedItems = [];
    
    for (const item of this.syncQueue) {
      try {
        await this.processQueueItem(item);
        processedItems.push(item.id);
      } catch (error) {
        item.retries++;
        if (item.retries >= 3) {
          processedItems.push(item.id);
          console.warn('Max retries reached for sync item:', item);
        }
      }
    }
    
    this.syncQueue = this.syncQueue.filter(item => !processedItems.includes(item.id));
    await this.saveQueue();
  }

  async processQueueItem(item) {
    const { endpoint, method = 'POST', data } = item.data;
    
    const response = await fetch(endpoint, {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      throw new Error(`Sync failed: ${response.status}`);
    }
  }
}

class NotificationManager {
  constructor() {
    this.config = NOTIFICATION_CONFIG;
  }

  async showNotification(title, options = {}) {
    const finalOptions = {
      ...this.config,
      ...options,
      tag: options.tag || 'atlas-sanctum',
      timestamp: Date.now(),
    };

    return self.registration.showNotification(title, finalOptions);
  }

  async handleNotificationClick(event) {
    event.notification.close();
    
    const { action, data } = event.notification;
    let targetUrl = '/';
    
    if (data?.url) {
      targetUrl = data.url;
    } else if (action) {
      targetUrl = this.getActionUrl(action);
    }

    event.waitUntil(
      clients.matchAll().then(clientList => {
        // Check if app is already open
        for (const client of clientList) {
          if (client.url.includes(targetUrl) && 'focus' in client) {
            return client.focus();
          }
        }
        
        // Open new window/tab
        if (clients.openWindow) {
          return clients.openWindow(targetUrl);
        }
      })
    );
  }

  getActionUrl(action) {
    const actionUrls = {
      'view-dashboard': '/dashboard',
      'view-analytics': '/analytics',
      'view-map': '/sanctum-map',
      'view-fellowship': '/fellowship',
    };
    
    return actionUrls[action] || '/';
  }

  async schedulePeriodicNotifications() {
    // Schedule daily engagement notifications
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(9, 0, 0, 0); // 9 AM next day
    
    const delay = tomorrow.getTime() - now.getTime();
    
    setTimeout(() => {
      this.showNotification('Atlas Sanctum Daily Update', {
        body: 'Check your regenerative impact metrics and global flow updates',
        icon: '/icons/icon-192x192.png',
        badge: '/icons/badge-72x72.png',
        actions: [
          {
            action: 'view-dashboard',
            title: 'View Dashboard',
            icon: '/icons/dashboard-32x32.png',
          },
          {
            action: 'view-analytics',
            title: 'View Analytics',
            icon: '/icons/analytics-32x32.png',
          },
        ],
        data: { url: '/dashboard' },
      });
    }, delay);
  }
}

// Initialize managers
const cacheManager = new CacheManager();
const syncManager = new BackgroundSyncManager();
const notificationManager = new NotificationManager();

// Service Worker Event Listeners
self.addEventListener('install', event => {
  console.log('Atlas Sanctum SW: Installing version', CACHE_VERSION);
  
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(PRECACHE_RESOURCES);
    }).then(() => {
      return self.skipWaiting();
    })
  );
});

self.addEventListener('activate', event => {
  console.log('Atlas Sanctum SW: Activating version', CACHE_VERSION);
  
  event.waitUntil(
    Promise.all([
      // Clean up old caches
      caches.keys().then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            if (cacheName !== CACHE_NAME && cacheName.startsWith('atlas-sanctum-')) {
              console.log('Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      }),
      // Load sync queue
      syncManager.loadQueue(),
      // Take control of all clients
      self.clients.claim(),
    ])
  );
});

self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Skip non-GET requests and external URLs
  if (request.method !== 'GET' || !url.origin.includes(self.location.origin)) {
    return;
  }

  const strategy = cacheManager.getStrategy(request.url);
  
  event.respondWith(
    (async () => {
      switch (strategy.strategy) {
        case 'cacheFirst':
          return cacheManager.cacheFirst(request, CACHE_NAME);
        case 'networkFirst':
          return cacheManager.networkFirst(request, CACHE_NAME);
        case 'staleWhileRevalidate':
          return cacheManager.staleWhileRevalidate(request, CACHE_NAME);
        case 'networkOnly':
          return cacheManager.networkOnly(request);
        default:
          return cacheManager.staleWhileRevalidate(request, CACHE_NAME);
      }
    })()
  );
});

// Background Sync
self.addEventListener('sync', event => {
  console.log('Background sync triggered:', event.tag);
  
  if (event.tag === 'atlas-sync') {
    event.waitUntil(syncManager.processSyncQueue());
  }
});

// Push Notifications
self.addEventListener('push', event => {
  let data = {};
  
  if (event.data) {
    try {
      data = event.data.json();
    } catch (error) {
      data = { title: event.data.text() };
    }
  }
  
  const title = data.title || 'Atlas Sanctum';
  const options = {
    body: data.body || 'New update available',
    icon: data.icon || '/icons/icon-192x192.png',
    badge: data.badge || '/icons/badge-72x72.png',
    data: data.data || {},
    actions: data.actions || [],
    tag: data.tag || 'atlas-update',
  };
  
  event.waitUntil(
    notificationManager.showNotification(title, options)
  );
});

// Notification Clicks
self.addEventListener('notificationclick', event => {
  notificationManager.handleNotificationClick(event);
});

// Notification Close
self.addEventListener('notificationclose', event => {
  console.log('Notification closed:', event.notification.tag);
  
  // Track notification engagement
  if (event.notification.data?.trackClose) {
    syncManager.addToQueue({
      endpoint: '/api/analytics/notification-close',
      data: {
        tag: event.notification.tag,
        timestamp: Date.now(),
      },
    });
  }
});

// Online/Offline Status
self.addEventListener('online', () => {
  console.log('Back online - processing sync queue');
  syncManager.isOnline = true;
  syncManager.processSyncQueue();
});

self.addEventListener('offline', () => {
  console.log('Gone offline');
  syncManager.isOnline = false;
});

// Message handling from main thread
self.addEventListener('message', event => {
  const { type, data } = event.data;
  
  switch (type) {
    case 'SKIP_WAITING':
      self.skipWaiting();
      break;
      
    case 'CACHE_STRATEGY':
      if (data.strategy) {
        Object.assign(cacheManager.strategies, data.strategy);
      }
      break;
      
    case 'ADD_TO_SYNC_QUEUE':
      syncManager.addToQueue(data);
      break;
      
    case 'SHOW_NOTIFICATION':
      notificationManager.showNotification(data.title, data.options);
      break;
      
    case 'GET_CACHE_SIZE':
      caches.open(CACHE_NAME).then(cache => {
        return cache.keys();
      }).then(keys => {
        event.ports[0].postMessage({ cacheSize: keys.length });
      });
      break;
      
    case 'CLEAR_CACHE':
      caches.delete(CACHE_NAME).then(() => {
        event.ports[0].postMessage({ cleared: true });
      });
      break;
  }
});

// Periodic Background Sync (if supported)
if ('periodicSync' in self.registration) {
  self.addEventListener('periodicsync', event => {
    if (event.tag === 'atlas-sync') {
      event.waitUntil(
        Promise.all([
          syncManager.processSyncQueue(),
          // Update critical data
          fetch('/api/user/sync').catch(() => {}),
          fetch('/api/metrics/sync').catch(() => {}),
        ])
      );
    }
  });
}

// Initialize periodic notifications
notificationManager.schedulePeriodicNotifications();

console.log('Atlas Sanctum Service Worker loaded successfully');
