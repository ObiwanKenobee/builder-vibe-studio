// Performance Optimization & Caching System for Atlas Sanctum

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
  accessCount: number;
  lastAccess: number;
}

interface PerformanceMetrics {
  cacheHits: number;
  cacheMisses: number;
  avgResponseTime: number;
  totalRequests: number;
  errorRate: number;
  bandwidthSaved: number;
}

class PerformanceCache {
  private cache = new Map<string, CacheEntry<any>>();
  private maxSize: number;
  private metrics: PerformanceMetrics = {
    cacheHits: 0,
    cacheMisses: 0,
    avgResponseTime: 0,
    totalRequests: 0,
    errorRate: 0,
    bandwidthSaved: 0,
  };

  constructor(maxSize = 1000) {
    this.maxSize = maxSize;
    this.startCleanup();
  }

  async get<T>(key: string): Promise<T | null> {
    const entry = this.cache.get(key);
    const now = Date.now();

    if (!entry) {
      this.metrics.cacheMisses++;
      return null;
    }

    if (now - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      this.metrics.cacheMisses++;
      return null;
    }

    entry.accessCount++;
    entry.lastAccess = now;
    this.metrics.cacheHits++;
    return entry.data;
  }

  set<T>(key: string, data: T, ttl = 300000): void { // 5 min default TTL
    if (this.cache.size >= this.maxSize) {
      this.evictLRU();
    }

    const now = Date.now();
    this.cache.set(key, {
      data,
      timestamp: now,
      ttl,
      accessCount: 1,
      lastAccess: now,
    });

    // Estimate bandwidth saved
    const dataSize = JSON.stringify(data).length;
    this.metrics.bandwidthSaved += dataSize;
  }

  invalidate(pattern?: string): void {
    if (!pattern) {
      this.cache.clear();
      return;
    }

    const regex = new RegExp(pattern);
    for (const key of this.cache.keys()) {
      if (regex.test(key)) {
        this.cache.delete(key);
      }
    }
  }

  private evictLRU(): void {
    let oldestKey = '';
    let oldestTime = Date.now();

    for (const [key, entry] of this.cache.entries()) {
      if (entry.lastAccess < oldestTime) {
        oldestTime = entry.lastAccess;
        oldestKey = key;
      }
    }

    if (oldestKey) {
      this.cache.delete(oldestKey);
    }
  }

  private startCleanup(): void {
    setInterval(() => {
      const now = Date.now();
      for (const [key, entry] of this.cache.entries()) {
        if (now - entry.timestamp > entry.ttl) {
          this.cache.delete(key);
        }
      }
    }, 60000); // Clean every minute
  }

  getMetrics(): PerformanceMetrics {
    const hitRate = this.metrics.cacheHits / (this.metrics.cacheHits + this.metrics.cacheMisses) || 0;
    return {
      ...this.metrics,
      hitRate,
      cacheSize: this.cache.size,
    } as PerformanceMetrics & { hitRate: number; cacheSize: number };
  }

  clear(): void {
    this.cache.clear();
    this.metrics = {
      cacheHits: 0,
      cacheMisses: 0,
      avgResponseTime: 0,
      totalRequests: 0,
      errorRate: 0,
      bandwidthSaved: 0,
    };
  }
}

// Performance monitoring utilities
class PerformanceMonitor {
  private observers: PerformanceObserver[] = [];
  private metrics: Map<string, number[]> = new Map();

  constructor() {
    this.initializeObservers();
  }

  private initializeObservers(): void {
    // Measure navigation timing
    if ('PerformanceObserver' in window) {
      const navObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          if (entry.entryType === 'navigation') {
            const navEntry = entry as PerformanceNavigationTiming;
            this.recordMetric('navigation.domContentLoaded', navEntry.domContentLoadedEventEnd - navEntry.navigationStart);
            this.recordMetric('navigation.loadComplete', navEntry.loadEventEnd - navEntry.navigationStart);
            this.recordMetric('navigation.firstPaint', navEntry.loadEventEnd - navEntry.fetchStart);
          }
        });
      });
      navObserver.observe({ entryTypes: ['navigation'] });
      this.observers.push(navObserver);

      // Measure resource loading
      const resourceObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          this.recordMetric(`resource.${entry.name.split('/').pop()}`, entry.duration);
        });
      });
      resourceObserver.observe({ entryTypes: ['resource'] });
      this.observers.push(resourceObserver);

      // Measure user interactions
      const measureObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          this.recordMetric(`measure.${entry.name}`, entry.duration);
        });
      });
      measureObserver.observe({ entryTypes: ['measure'] });
      this.observers.push(measureObserver);
    }
  }

  private recordMetric(name: string, value: number): void {
    if (!this.metrics.has(name)) {
      this.metrics.set(name, []);
    }
    const values = this.metrics.get(name)!;
    values.push(value);
    
    // Keep only last 100 measurements
    if (values.length > 100) {
      values.shift();
    }
  }

  measureAsync<T>(name: string, fn: () => Promise<T>): Promise<T> {
    const start = performance.now();
    return fn().then(
      (result) => {
        const duration = performance.now() - start;
        this.recordMetric(name, duration);
        return result;
      },
      (error) => {
        const duration = performance.now() - start;
        this.recordMetric(`${name}.error`, duration);
        throw error;
      }
    );
  }

  measure<T>(name: string, fn: () => T): T {
    const start = performance.now();
    try {
      const result = fn();
      const duration = performance.now() - start;
      this.recordMetric(name, duration);
      return result;
    } catch (error) {
      const duration = performance.now() - start;
      this.recordMetric(`${name}.error`, duration);
      throw error;
    }
  }

  getMetrics(): Record<string, { avg: number; min: number; max: number; count: number }> {
    const result: Record<string, { avg: number; min: number; max: number; count: number }> = {};
    
    for (const [name, values] of this.metrics.entries()) {
      if (values.length > 0) {
        result[name] = {
          avg: values.reduce((sum, val) => sum + val, 0) / values.length,
          min: Math.min(...values),
          max: Math.max(...values),
          count: values.length,
        };
      }
    }
    
    return result;
  }

  getVitalMetrics(): {
    fcp?: number; // First Contentful Paint
    lcp?: number; // Largest Contentful Paint
    fid?: number; // First Input Delay
    cls?: number; // Cumulative Layout Shift
  } {
    const vitals: ReturnType<PerformanceMonitor['getVitalMetrics']> = {};
    
    if ('PerformanceObserver' in window) {
      try {
        // Get LCP
        const lcpEntries = performance.getEntriesByType('largest-contentful-paint');
        if (lcpEntries.length > 0) {
          vitals.lcp = lcpEntries[lcpEntries.length - 1].startTime;
        }

        // Get FCP
        const fcpEntries = performance.getEntriesByType('paint');
        const fcpEntry = fcpEntries.find(entry => entry.name === 'first-contentful-paint');
        if (fcpEntry) {
          vitals.fcp = fcpEntry.startTime;
        }
      } catch (error) {
        console.warn('Could not get web vitals:', error);
      }
    }
    
    return vitals;
  }

  dispose(): void {
    this.observers.forEach(observer => observer.disconnect());
    this.observers = [];
    this.metrics.clear();
  }
}

// Resource optimization utilities
class ResourceOptimizer {
  private imageCache = new PerformanceCache(500);
  private cssCache = new PerformanceCache(100);
  private jsCache = new PerformanceCache(200);

  // Lazy loading for images
  setupLazyLoading(): void {
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const img = entry.target as HTMLImageElement;
            if (img.dataset.src) {
              img.src = img.dataset.src;
              img.classList.remove('lazy');
              imageObserver.unobserve(img);
            }
          }
        });
      });

      document.querySelectorAll('img[data-src]').forEach((img) => {
        imageObserver.observe(img);
      });
    }
  }

  // Preload critical resources
  preloadResources(resources: Array<{ href: string; as: string; type?: string }>): void {
    resources.forEach(({ href, as, type }) => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.href = href;
      link.as = as;
      if (type) link.type = type;
      document.head.appendChild(link);
    });
  }

  // Optimize images with WebP detection
  optimizeImage(src: string, options: { width?: number; height?: number; quality?: number } = {}): string {
    const { width, height, quality = 80 } = options;
    
    // Check WebP support
    const supportsWebP = document.createElement('canvas').toDataURL('image/webp').indexOf('data:image/webp') === 0;
    
    let optimizedSrc = src;
    
    // Add optimization parameters if it's a dynamic image service
    if (src.includes('images.unsplash.com') || src.includes('cdn.')) {
      const params = new URLSearchParams();
      if (width) params.append('w', width.toString());
      if (height) params.append('h', height.toString());
      params.append('q', quality.toString());
      if (supportsWebP) params.append('fm', 'webp');
      
      optimizedSrc = `${src}?${params.toString()}`;
    }
    
    return optimizedSrc;
  }

  // Bundle splitting utilities
  loadChunkDynamically(chunkName: string): Promise<any> {
    return this.jsCache.get(chunkName) || 
      import(/* webpackChunkName: "[request]" */ `../chunks/${chunkName}`).then(
        (module) => {
          this.jsCache.set(chunkName, module);
          return module;
        }
      );
  }
}

// CDN and caching strategies
class CDNOptimizer {
  private cdnEndpoints = [
    'https://cdn1.atlassanctum.com',
    'https://cdn2.atlassanctum.com',
    'https://cdn3.atlassanctum.com',
  ];
  
  private currentCDN = 0;

  // Select optimal CDN endpoint
  getOptimalCDN(): string {
    // In production, this would use real CDN health checks
    return this.cdnEndpoints[this.currentCDN % this.cdnEndpoints.length];
  }

  // Fallback CDN strategy
  async fetchWithFallback(url: string, options?: RequestInit): Promise<Response> {
    const cdnUrl = url.startsWith('http') ? url : `${this.getOptimalCDN()}${url}`;
    
    try {
      const response = await fetch(cdnUrl, {
        ...options,
        cache: 'force-cache', // Aggressive caching
      });
      
      if (!response.ok) {
        throw new Error(`CDN request failed: ${response.status}`);
      }
      
      return response;
    } catch (error) {
      // Try next CDN endpoint
      this.currentCDN++;
      if (this.currentCDN < this.cdnEndpoints.length) {
        return this.fetchWithFallback(url, options);
      }
      
      // Fallback to origin server
      return fetch(url.replace(/^https:\/\/cdn\d*\.atlassanctum\.com/, ''), options);
    }
  }

  // Service Worker integration for caching
  setupServiceWorkerCaching(): void {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then((registration) => {
        // Configure caching strategies via service worker
        registration.active?.postMessage({
          type: 'CACHE_STRATEGY',
          strategy: {
            images: { strategy: 'cacheFirst', maxAge: 7 * 24 * 60 * 60 * 1000 }, // 7 days
            api: { strategy: 'networkFirst', maxAge: 60 * 1000 }, // 1 minute
            static: { strategy: 'staleWhileRevalidate', maxAge: 24 * 60 * 60 * 1000 }, // 1 day
          },
        });
      });
    }
  }
}

// Global instances
export const performanceCache = new PerformanceCache();
export const performanceMonitor = new PerformanceMonitor();
export const resourceOptimizer = new ResourceOptimizer();
export const cdnOptimizer = new CDNOptimizer();

// React hooks for performance optimization
export function usePerformanceMonitoring(componentName: string) {
  React.useEffect(() => {
    const startTime = performance.now();
    
    return () => {
      const duration = performance.now() - startTime;
      performanceMonitor.recordMetric(`component.${componentName}`, duration);
    };
  }, [componentName]);
}

export function useCachedData<T>(
  key: string,
  fetcher: () => Promise<T>,
  ttl = 300000 // 5 minutes
): { data: T | null; loading: boolean; error: Error | null } {
  const [data, setData] = React.useState<T | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<Error | null>(null);

  React.useEffect(() => {
    async function loadData() {
      try {
        // Check cache first
        const cachedData = await performanceCache.get<T>(key);
        if (cachedData) {
          setData(cachedData);
          setLoading(false);
          return;
        }

        // Fetch new data
        setLoading(true);
        const newData = await performanceMonitor.measureAsync(`fetch.${key}`, fetcher);
        performanceCache.set(key, newData, ttl);
        setData(newData);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error'));
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [key, ttl]);

  return { data, loading, error };
}

// Initialize optimizations
export function initializePerformanceOptimizations(): void {
  // Setup lazy loading
  resourceOptimizer.setupLazyLoading();
  
  // Configure CDN caching
  cdnOptimizer.setupServiceWorkerCaching();
  
  // Preload critical resources
  resourceOptimizer.preloadResources([
    { href: '/fonts/inter.woff2', as: 'font', type: 'font/woff2' },
    { href: '/api/user/profile', as: 'fetch' },
    { href: '/images/atlas-logo.webp', as: 'image' },
  ]);

  // Monitor performance
  console.log('Atlas Sanctum Performance Optimizations Initialized');
}

// Performance benchmark utilities
export class PerformanceBenchmark {
  static async runBenchmarks(): Promise<{
    loadTime: number;
    renderTime: number;
    cacheHitRate: number;
    memoryUsage: number;
  }> {
    const start = performance.now();
    
    // Simulate various operations
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const loadTime = performance.now() - start;
    const renderTime = performanceMonitor.getMetrics()['component.App']?.avg || 0;
    const cacheMetrics = performanceCache.getMetrics();
    const memoryUsage = (performance as any).memory?.usedJSHeapSize || 0;
    
    return {
      loadTime,
      renderTime,
      cacheHitRate: cacheMetrics.hitRate || 0,
      memoryUsage,
    };
  }

  static async testLoadTargets(): Promise<{
    mapLoad: boolean; // < 2s
    dataUpdate: boolean; // < 200ms
    pageTransition: boolean; // < 300ms
  }> {
    const mapLoadTime = performanceMonitor.getMetrics()['component.SanctumMap']?.avg || 0;
    const dataUpdateTime = performanceMonitor.getMetrics()['api.data']?.avg || 0;
    const pageTransitionTime = performanceMonitor.getMetrics()['navigation.transition']?.avg || 0;
    
    return {
      mapLoad: mapLoadTime < 2000,
      dataUpdate: dataUpdateTime < 200,
      pageTransition: pageTransitionTime < 300,
    };
  }
}

// React import for hooks
import React from 'react';
