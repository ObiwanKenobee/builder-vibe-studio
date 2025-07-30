const CACHE_NAME = "atlas-sanctum-v1.0.0";
const STATIC_CACHE_NAME = "atlas-sanctum-static-v1.0.0";
const DYNAMIC_CACHE_NAME = "atlas-sanctum-dynamic-v1.0.0";

// Core app shell resources
const STATIC_ASSETS = [
  "/",
  "/manifest.json",
  "/favicon.ico",
  "/apple-touch-icon.png",
  "/android-chrome-192x192.png",
  "/android-chrome-512x512.png",
];

// API and dynamic content patterns
const DYNAMIC_PATTERNS = [
  /^https:\/\/api\.atlassanctum\.com\//,
  /^https:\/\/fonts\.googleapis\.com\//,
  /^https:\/\/fonts\.gstatic\.com\//,
];

// Install event - cache static assets
self.addEventListener("install", (event) => {
  console.log("[SW] Installing Service Worker...");

  event.waitUntil(
    caches
      .open(STATIC_CACHE_NAME)
      .then((cache) => {
        console.log("[SW] Caching static assets");
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        console.log("[SW] Static assets cached successfully");
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error("[SW] Failed to cache static assets:", error);
      }),
  );
});

// Activate event - clean up old caches
self.addEventListener("activate", (event) => {
  console.log("[SW] Activating Service Worker...");

  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (
              cacheName !== STATIC_CACHE_NAME &&
              cacheName !== DYNAMIC_CACHE_NAME &&
              cacheName !== CACHE_NAME
            ) {
              console.log("[SW] Deleting old cache:", cacheName);
              return caches.delete(cacheName);
            }
          }),
        );
      })
      .then(() => {
        console.log("[SW] Service Worker activated");
        return self.clients.claim();
      }),
  );
});

// Fetch event - implement caching strategies
self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== "GET") {
    return;
  }

  // Skip chrome-extension and other protocols
  if (!url.protocol.startsWith("http")) {
    return;
  }

  // Strategy 1: Network First for API calls (fresh data priority)
  if (DYNAMIC_PATTERNS.some((pattern) => pattern.test(request.url))) {
    event.respondWith(networkFirst(request, DYNAMIC_CACHE_NAME));
    return;
  }

  // Strategy 2: Cache First for static assets (performance priority)
  if (
    request.destination === "image" ||
    request.destination === "font" ||
    request.destination === "style" ||
    request.destination === "script"
  ) {
    event.respondWith(cacheFirst(request, STATIC_CACHE_NAME));
    return;
  }

  // Strategy 3: Stale While Revalidate for HTML (balance of speed and freshness)
  if (request.destination === "document") {
    event.respondWith(staleWhileRevalidate(request, DYNAMIC_CACHE_NAME));
    return;
  }

  // Default: Network First
  event.respondWith(networkFirst(request, DYNAMIC_CACHE_NAME));
});

// Caching Strategies

// Cache First - Use cache, fallback to network
async function cacheFirst(request, cacheName) {
  try {
    const cache = await caches.open(cacheName);
    const cachedResponse = await cache.match(request);

    if (cachedResponse) {
      return cachedResponse;
    }

    const networkResponse = await fetch(request);

    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }

    return networkResponse;
  } catch (error) {
    console.error("[SW] Cache First strategy failed:", error);
    return new Response("Offline content not available", {
      status: 503,
      headers: { "Content-Type": "text/plain" },
    });
  }
}

// Network First - Use network, fallback to cache
async function networkFirst(request, cacheName) {
  try {
    const networkResponse = await fetch(request);

    if (networkResponse.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, networkResponse.clone());
    }

    return networkResponse;
  } catch (error) {
    console.log("[SW] Network failed, trying cache:", error.message);

    const cache = await caches.open(cacheName);
    const cachedResponse = await cache.match(request);

    if (cachedResponse) {
      return cachedResponse;
    }

    return new Response("Content unavailable offline", {
      status: 503,
      headers: { "Content-Type": "text/plain" },
    });
  }
}

// Stale While Revalidate - Return cache immediately, update in background
async function staleWhileRevalidate(request, cacheName) {
  try {
    const cache = await caches.open(cacheName);
    const cachedResponse = await cache.match(request);

    // Always try to update in background
    const networkPromise = fetch(request)
      .then((networkResponse) => {
        if (networkResponse.ok) {
          cache.put(request, networkResponse.clone());
        }
        return networkResponse;
      })
      .catch((error) => {
        console.log("[SW] Background update failed:", error.message);
      });

    // Return cached version immediately if available
    if (cachedResponse) {
      return cachedResponse;
    }

    // If no cache, wait for network
    return networkPromise;
  } catch (error) {
    console.error("[SW] Stale While Revalidate strategy failed:", error);
    return new Response("Content unavailable", {
      status: 503,
      headers: { "Content-Type": "text/plain" },
    });
  }
}

// Background Sync for offline actions
self.addEventListener("sync", (event) => {
  console.log("[SW] Background sync triggered:", event.tag);

  if (event.tag === "transmutation-sync") {
    event.waitUntil(syncTransmutations());
  }

  if (event.tag === "analytics-sync") {
    event.waitUntil(syncAnalytics());
  }
});

// Sync offline transmutations when online
async function syncTransmutations() {
  try {
    const cache = await caches.open(DYNAMIC_CACHE_NAME);
    const offlineTransmutations = await cache.match("/offline-transmutations");

    if (offlineTransmutations) {
      const data = await offlineTransmutations.json();

      // Send to server when online
      for (const transmutation of data) {
        await fetch("/api/transmutations", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(transmutation),
        });
      }

      // Clear offline storage
      await cache.delete("/offline-transmutations");
      console.log("[SW] Offline transmutations synced successfully");
    }
  } catch (error) {
    console.error("[SW] Failed to sync transmutations:", error);
  }
}

// Sync analytics data
async function syncAnalytics() {
  try {
    const cache = await caches.open(DYNAMIC_CACHE_NAME);
    const offlineAnalytics = await cache.match("/offline-analytics");

    if (offlineAnalytics) {
      const data = await offlineAnalytics.json();

      // Send to analytics endpoint
      await fetch("/api/analytics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      await cache.delete("/offline-analytics");
      console.log("[SW] Offline analytics synced successfully");
    }
  } catch (error) {
    console.error("[SW] Failed to sync analytics:", error);
  }
}

// Push notification handling
self.addEventListener("push", (event) => {
  console.log("[SW] Push received:", event);

  const options = {
    body: event.data
      ? event.data.text()
      : "New content available in Atlas Sanctum",
    icon: "/android-chrome-192x192.png",
    badge: "/favicon-32x32.png",
    vibrate: [200, 100, 200],
    tag: "atlas-sanctum-notification",
    actions: [
      {
        action: "open",
        title: "Open Atlas Sanctum",
        icon: "/android-chrome-192x192.png",
      },
      {
        action: "close",
        title: "Dismiss",
        icon: "/favicon-32x32.png",
      },
    ],
  };

  event.waitUntil(self.registration.showNotification("Atlas Sanctum", options));
});

// Notification click handling
self.addEventListener("notificationclick", (event) => {
  console.log("[SW] Notification clicked:", event);

  event.notification.close();

  if (event.action === "open") {
    event.waitUntil(clients.openWindow("/"));
  }
});

console.log("[SW] Service Worker script loaded");
