// Accessibility & Internationalization System for Atlas Sanctum

import React from 'react';

// WCAG 2.1 AA Compliance utilities
export class AccessibilityManager {
  private announcements: HTMLElement | null = null;
  private focusTrap: HTMLElement | null = null;
  private highContrastMode = false;
  private reducedMotion = false;
  private screenReader = false;

  constructor() {
    this.init();
  }

  private init(): void {
    this.createAriaLiveRegion();
    this.detectPreferences();
    this.setupKeyboardNavigation();
    this.setupFocusManagement();
  }

  // ARIA Live Region for screen readers
  private createAriaLiveRegion(): void {
    this.announcements = document.createElement('div');
    this.announcements.setAttribute('aria-live', 'polite');
    this.announcements.setAttribute('aria-atomic', 'true');
    this.announcements.style.position = 'absolute';
    this.announcements.style.left = '-10000px';
    this.announcements.style.width = '1px';
    this.announcements.style.height = '1px';
    this.announcements.style.overflow = 'hidden';
    document.body.appendChild(this.announcements);
  }

  // Announce messages to screen readers
  announce(message: string, priority: 'polite' | 'assertive' = 'polite'): void {
    if (this.announcements) {
      this.announcements.setAttribute('aria-live', priority);
      this.announcements.textContent = message;
      
      // Clear after announcement
      setTimeout(() => {
        if (this.announcements) {
          this.announcements.textContent = '';
        }
      }, 1000);
    }
  }

  // Detect user accessibility preferences
  private detectPreferences(): void {
    // High contrast
    this.highContrastMode = window.matchMedia('(prefers-contrast: high)').matches;
    
    // Reduced motion
    this.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    // Screen reader detection (heuristic)
    this.screenReader = window.navigator.userAgent.includes('NVDA') || 
                       window.navigator.userAgent.includes('JAWS') ||
                       window.speechSynthesis?.speaking || false;

    // Apply preferences
    if (this.highContrastMode) {
      document.documentElement.classList.add('high-contrast');
    }
    
    if (this.reducedMotion) {
      document.documentElement.classList.add('reduced-motion');
    }

    if (this.screenReader) {
      document.documentElement.classList.add('screen-reader');
    }
  }

  // Keyboard navigation setup
  private setupKeyboardNavigation(): void {
    document.addEventListener('keydown', (event) => {
      // Skip links navigation
      if (event.key === 'Tab' && event.ctrlKey) {
        this.showSkipLinks();
      }

      // Escape key handling
      if (event.key === 'Escape') {
        this.handleEscape();
      }

      // Arrow key navigation for custom components
      this.handleArrowNavigation(event);
    });

    // Show focus indicators for keyboard users
    document.addEventListener('keydown', () => {
      document.body.classList.add('keyboard-navigation');
    });

    document.addEventListener('mousedown', () => {
      document.body.classList.remove('keyboard-navigation');
    });
  }

  private showSkipLinks(): void {
    const skipLinks = document.querySelector('.skip-links') as HTMLElement;
    if (skipLinks) {
      skipLinks.style.display = 'block';
      const firstLink = skipLinks.querySelector('a') as HTMLAnchorElement;
      firstLink?.focus();
    }
  }

  private handleEscape(): void {
    // Close any open modals, dropdowns, etc.
    const openModal = document.querySelector('[role="dialog"][aria-hidden="false"]');
    if (openModal) {
      const closeButton = openModal.querySelector('[aria-label*="close"], [aria-label*="Close"]') as HTMLButtonElement;
      closeButton?.click();
    }
  }

  private handleArrowNavigation(event: KeyboardEvent): void {
    const target = event.target as HTMLElement;
    
    // Tab list navigation
    if (target.getAttribute('role') === 'tab') {
      const tabList = target.closest('[role="tablist"]');
      if (tabList) {
        const tabs = Array.from(tabList.querySelectorAll('[role="tab"]')) as HTMLElement[];
        const currentIndex = tabs.indexOf(target);
        
        let nextIndex = currentIndex;
        if (event.key === 'ArrowRight') {
          nextIndex = (currentIndex + 1) % tabs.length;
        } else if (event.key === 'ArrowLeft') {
          nextIndex = (currentIndex - 1 + tabs.length) % tabs.length;
        }
        
        if (nextIndex !== currentIndex) {
          event.preventDefault();
          tabs[nextIndex].focus();
          tabs[nextIndex].click();
        }
      }
    }

    // Menu navigation
    if (target.getAttribute('role') === 'menuitem') {
      const menu = target.closest('[role="menu"]');
      if (menu) {
        const items = Array.from(menu.querySelectorAll('[role="menuitem"]')) as HTMLElement[];
        const currentIndex = items.indexOf(target);
        
        let nextIndex = currentIndex;
        if (event.key === 'ArrowDown') {
          nextIndex = (currentIndex + 1) % items.length;
        } else if (event.key === 'ArrowUp') {
          nextIndex = (currentIndex - 1 + items.length) % items.length;
        }
        
        if (nextIndex !== currentIndex) {
          event.preventDefault();
          items[nextIndex].focus();
        }
      }
    }
  }

  // Focus management
  private setupFocusManagement(): void {
    // Focus trap for modals
    document.addEventListener('focusin', (event) => {
      if (this.focusTrap && !this.focusTrap.contains(event.target as Node)) {
        const firstFocusable = this.getFirstFocusableElement(this.focusTrap);
        firstFocusable?.focus();
      }
    });
  }

  trapFocus(element: HTMLElement): void {
    this.focusTrap = element;
    const firstFocusable = this.getFirstFocusableElement(element);
    firstFocusable?.focus();
  }

  releaseFocusTrap(): void {
    this.focusTrap = null;
  }

  private getFirstFocusableElement(container: HTMLElement): HTMLElement | null {
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    return focusableElements[0] as HTMLElement || null;
  }

  // Color contrast checking
  checkContrast(foreground: string, background: string): {
    ratio: number;
    aa: boolean;
    aaa: boolean;
  } {
    const getRGB = (color: string) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d')!;
      ctx.fillStyle = color;
      ctx.fillRect(0, 0, 1, 1);
      const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;
      return [r, g, b];
    };

    const getLuminance = (rgb: number[]) => {
      const [r, g, b] = rgb.map(val => {
        val = val / 255;
        return val <= 0.03928 ? val / 12.92 : Math.pow((val + 0.055) / 1.055, 2.4);
      });
      return 0.2126 * r + 0.7152 * g + 0.0722 * b;
    };

    const fgRGB = getRGB(foreground);
    const bgRGB = getRGB(background);
    const fgLuminance = getLuminance(fgRGB);
    const bgLuminance = getLuminance(bgRGB);
    
    const ratio = (Math.max(fgLuminance, bgLuminance) + 0.05) / (Math.min(fgLuminance, bgLuminance) + 0.05);
    
    return {
      ratio,
      aa: ratio >= 4.5,
      aaa: ratio >= 7,
    };
  }

  // Get accessibility preferences
  getPreferences(): {
    highContrast: boolean;
    reducedMotion: boolean;
    screenReader: boolean;
  } {
    return {
      highContrast: this.highContrastMode,
      reducedMotion: this.reducedMotion,
      screenReader: this.screenReader,
    };
  }
}

// Internationalization System
interface TranslationMap {
  [key: string]: string | TranslationMap;
}

interface Language {
  code: string;
  name: string;
  rtl: boolean;
  translations: TranslationMap;
}

export class InternationalizationManager {
  private currentLanguage = 'en';
  private languages: Map<string, Language> = new Map();
  private fallbackLanguage = 'en';
  private numberFormatter: Intl.NumberFormat | null = null;
  private dateFormatter: Intl.DateTimeFormat | null = null;
  private currencyFormatter: Intl.NumberFormat | null = null;

  constructor() {
    this.initializeLanguages();
    this.detectLanguage();
    this.setupFormatters();
  }

  private initializeLanguages(): void {
    const languages: Language[] = [
      {
        code: 'en',
        name: 'English',
        rtl: false,
        translations: {
          common: {
            welcome: 'Welcome to Atlas Sanctum',
            dashboard: 'Dashboard',
            analytics: 'Analytics',
            loading: 'Loading...',
            error: 'An error occurred',
            save: 'Save',
            cancel: 'Cancel',
            confirm: 'Confirm',
            delete: 'Delete',
            edit: 'Edit',
            view: 'View',
            close: 'Close',
          },
          navigation: {
            home: 'Home',
            sanctumMap: 'Sanctum Map',
            library: 'Library',
            fellowship: 'Fellowship',
            dignityCoin: 'Dignity Coin',
            painTransmutation: 'Pain Transmutation',
          },
          accessibility: {
            skipToMain: 'Skip to main content',
            skipToNavigation: 'Skip to navigation',
            openMenu: 'Open menu',
            closeMenu: 'Close menu',
            previousPage: 'Previous page',
            nextPage: 'Next page',
            sortAscending: 'Sort ascending',
            sortDescending: 'Sort descending',
          }
        }
      },
      {
        code: 'es',
        name: 'Español',
        rtl: false,
        translations: {
          common: {
            welcome: 'Bienvenido a Atlas Sanctum',
            dashboard: 'Panel de Control',
            analytics: 'Análisis',
            loading: 'Cargando...',
            error: 'Ocurrió un error',
            save: 'Guardar',
            cancel: 'Cancelar',
            confirm: 'Confirmar',
            delete: 'Eliminar',
            edit: 'Editar',
            view: 'Ver',
            close: 'Cerrar',
          },
          navigation: {
            home: 'Inicio',
            sanctumMap: 'Mapa del Santuario',
            library: 'Biblioteca',
            fellowship: 'Comunidad',
            dignityCoin: 'Moneda Dignidad',
            painTransmutation: 'Transmutación del Dolor',
          },
          accessibility: {
            skipToMain: 'Saltar al contenido principal',
            skipToNavigation: 'Saltar a la navegación',
            openMenu: 'Abrir menú',
            closeMenu: 'Cerrar menú',
            previousPage: 'Página anterior',
            nextPage: 'Página siguiente',
            sortAscending: 'Ordenar ascendente',
            sortDescending: 'Ordenar descendente',
          }
        }
      },
      {
        code: 'fr',
        name: 'Français',
        rtl: false,
        translations: {
          common: {
            welcome: 'Bienvenue à Atlas Sanctum',
            dashboard: 'Tableau de Bord',
            analytics: 'Analytique',
            loading: 'Chargement...',
            error: 'Une erreur s\'est produite',
            save: 'Sauvegarder',
            cancel: 'Annuler',
            confirm: 'Confirmer',
            delete: 'Supprimer',
            edit: 'Modifier',
            view: 'Voir',
            close: 'Fermer',
          },
          navigation: {
            home: 'Accueil',
            sanctumMap: 'Carte du Sanctuaire',
            library: 'Bibliothèque',
            fellowship: 'Communauté',
            dignityCoin: 'Pièce Dignité',
            painTransmutation: 'Transmutation de la Douleur',
          },
          accessibility: {
            skipToMain: 'Aller au contenu principal',
            skipToNavigation: 'Aller à la navigation',
            openMenu: 'Ouvrir le menu',
            closeMenu: 'Fermer le menu',
            previousPage: 'Page précédente',
            nextPage: 'Page suivante',
            sortAscending: 'Tri croissant',
            sortDescending: 'Tri décroissant',
          }
        }
      },
      {
        code: 'zh',
        name: '中文',
        rtl: false,
        translations: {
          common: {
            welcome: '欢迎来到 Atlas Sanctum',
            dashboard: '仪表板',
            analytics: '分析',
            loading: '加载中...',
            error: '发生错误',
            save: '保存',
            cancel: '取消',
            confirm: '确认',
            delete: '删除',
            edit: '编辑',
            view: '查看',
            close: '关闭',
          },
          navigation: {
            home: '首页',
            sanctumMap: '圣域地图',
            library: '图书馆',
            fellowship: '社区',
            dignityCoin: '尊严币',
            painTransmutation: '痛苦转化',
          },
          accessibility: {
            skipToMain: '跳转到主要内容',
            skipToNavigation: '跳转到导航',
            openMenu: '打开菜单',
            closeMenu: '关闭菜单',
            previousPage: '上一页',
            nextPage: '下一页',
            sortAscending: '升序排列',
            sortDescending: '降序排列',
          }
        }
      },
      {
        code: 'ar',
        name: 'العربية',
        rtl: true,
        translations: {
          common: {
            welcome: 'مرحباً بك في Atlas Sanctum',
            dashboard: 'لوحة التحكم',
            analytics: 'التحليلات',
            loading: 'جاري التحميل...',
            error: 'حدث خطأ',
            save: 'حفظ',
            cancel: 'إلغاء',
            confirm: 'تأكيد',
            delete: 'حذف',
            edit: 'تعديل',
            view: 'عرض',
            close: 'إغلاق',
          },
          navigation: {
            home: 'الرئيسية',
            sanctumMap: 'خريطة الحرم',
            library: 'المكتبة',
            fellowship: 'الزمالة',
            dignityCoin: 'عملة الكرامة',
            painTransmutation: 'تحويل الألم',
          },
          accessibility: {
            skipToMain: 'انتقل إلى المحتوى الرئيسي',
            skipToNavigation: 'انتقل إلى التنقل',
            openMenu: 'فتح القائمة',
            closeMenu: 'إغلاق القائمة',
            previousPage: 'الصفحة السابقة',
            nextPage: 'الصفحة التالية',
            sortAscending: 'ترتيب تصاعدي',
            sortDescending: 'ترتيب تنازلي',
          }
        }
      },
      {
        code: 'hi',
        name: 'हिन्दी',
        rtl: false,
        translations: {
          common: {
            welcome: 'Atlas Sanctum में आपका स्वागत है',
            dashboard: 'डैशबोर्ड',
            analytics: 'विश्लेषण',
            loading: 'लोड हो रहा है...',
            error: 'एक त्रुटि हुई',
            save: 'सेव करें',
            cancel: 'रद्द करें',
            confirm: 'पुष्टि करें',
            delete: 'हटाएं',
            edit: 'संपादित करें',
            view: 'देखें',
            close: 'बंद करें',
          },
          navigation: {
            home: 'होम',
            sanctumMap: 'सैंक्टम मैप',
            library: 'पुस्तकालय',
            fellowship: 'फैलोशिप',
            dignityCoin: 'डिग्निटी कॉइन',
            painTransmutation: 'दर्द का रूपांतरण',
          },
          accessibility: {
            skipToMain: 'मुख्य सामग्री पर जाएं',
            skipToNavigation: 'नेवीगेशन पर जाएं',
            openMenu: 'मेनू खोलें',
            closeMenu: 'मेनू बंद करें',
            previousPage: 'पिछला पृष्ठ',
            nextPage: 'अगला पृष्ठ',
            sortAscending: 'आरोही क्रम',
            sortDescending: 'अवरोही क्रम',
          }
        }
      }
    ];

    languages.forEach(lang => this.languages.set(lang.code, lang));
  }

  private detectLanguage(): void {
    // Check localStorage first
    const savedLanguage = localStorage.getItem('atlas-language');
    if (savedLanguage && this.languages.has(savedLanguage)) {
      this.currentLanguage = savedLanguage;
      return;
    }

    // Detect from browser
    const browserLanguages = navigator.languages || [navigator.language];
    for (const lang of browserLanguages) {
      const langCode = lang.split('-')[0];
      if (this.languages.has(langCode)) {
        this.currentLanguage = langCode;
        break;
      }
    }
  }

  private setupFormatters(): void {
    const locale = this.getCurrentLanguage()?.code || this.fallbackLanguage;
    
    this.numberFormatter = new Intl.NumberFormat(locale);
    this.dateFormatter = new Intl.DateTimeFormat(locale, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    this.currencyFormatter = new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: 'EUR', // Atlas Sanctum uses EUR as base currency
    });
  }

  setLanguage(languageCode: string): void {
    if (this.languages.has(languageCode)) {
      this.currentLanguage = languageCode;
      localStorage.setItem('atlas-language', languageCode);
      this.setupFormatters();
      this.updateDocumentLanguage();
    }
  }

  private updateDocumentLanguage(): void {
    const language = this.getCurrentLanguage();
    if (language) {
      document.documentElement.lang = language.code;
      document.documentElement.dir = language.rtl ? 'rtl' : 'ltr';
    }
  }

  getCurrentLanguage(): Language | undefined {
    return this.languages.get(this.currentLanguage);
  }

  getAvailableLanguages(): Language[] {
    return Array.from(this.languages.values());
  }

  translate(key: string, params?: Record<string, string>): string {
    const language = this.getCurrentLanguage() || this.languages.get(this.fallbackLanguage)!;
    const translation = this.getNestedTranslation(language.translations, key);
    
    if (typeof translation !== 'string') {
      return key; // Return key if translation not found
    }

    // Replace parameters
    if (params) {
      return Object.entries(params).reduce(
        (text, [param, value]) => text.replace(`{{${param}}}`, value),
        translation
      );
    }

    return translation;
  }

  private getNestedTranslation(obj: TranslationMap, key: string): string | TranslationMap {
    const keys = key.split('.');
    let current: string | TranslationMap = obj;
    
    for (const k of keys) {
      if (typeof current === 'object' && current[k]) {
        current = current[k];
      } else {
        return key; // Return original key if not found
      }
    }
    
    return current;
  }

  formatNumber(number: number): string {
    return this.numberFormatter?.format(number) || number.toString();
  }

  formatDate(date: Date): string {
    return this.dateFormatter?.format(date) || date.toLocaleDateString();
  }

  formatCurrency(amount: number): string {
    return this.currencyFormatter?.format(amount) || `€${amount}`;
  }

  isRTL(): boolean {
    return this.getCurrentLanguage()?.rtl || false;
  }
}

// React Hooks for accessibility and i18n
export function useAccessibility() {
  const [manager] = React.useState(() => new AccessibilityManager());
  
  const announce = React.useCallback((message: string, priority?: 'polite' | 'assertive') => {
    manager.announce(message, priority);
  }, [manager]);

  const preferences = React.useMemo(() => manager.getPreferences(), [manager]);

  return { announce, preferences, manager };
}

export function useTranslation() {
  const [i18n] = React.useState(() => new InternationalizationManager());
  const [currentLanguage, setCurrentLanguage] = React.useState(i18n.getCurrentLanguage());

  const changeLanguage = React.useCallback((languageCode: string) => {
    i18n.setLanguage(languageCode);
    setCurrentLanguage(i18n.getCurrentLanguage());
  }, [i18n]);

  const t = React.useCallback((key: string, params?: Record<string, string>) => {
    return i18n.translate(key, params);
  }, [i18n]);

  return {
    t,
    currentLanguage,
    availableLanguages: i18n.getAvailableLanguages(),
    changeLanguage,
    formatNumber: i18n.formatNumber.bind(i18n),
    formatDate: i18n.formatDate.bind(i18n),
    formatCurrency: i18n.formatCurrency.bind(i18n),
    isRTL: i18n.isRTL(),
  };
}

// Global instances
export const accessibilityManager = new AccessibilityManager();
export const i18nManager = new InternationalizationManager();
