/**
 * 国际化Locale工具函数
 * 支持的语言：en (英文), zh-CN (简体中文), zh-HK (繁体中文), zh-Hans (简体中文), zh-Hant (繁体中文)
 * 兼容格式：zh_CN, zh_HK
 */

const VALID_LOCALES = ["en", "zh-CN", "zh-HK", "zh-Hans", "zh-Hant"] as const;
export type Locale = (typeof VALID_LOCALES)[number];

// 兼容的locale格式映射
const COMPATIBLE_LOCALES = ["zh_CN", "zh_HK"] as const;
type CompatibleLocale = (typeof COMPATIBLE_LOCALES)[number];

const LOCALE_STORAGE_KEY = "user_locale";

/**
 * 将兼容格式的locale转换为标准格式
 */
function normalizeLocale(locale: string): Locale | null {
  // 检查是否为合法格式（包括兼容格式）
  if (!isValidLocaleString(locale)) return null;

  // 如果是兼容格式，转换为标准格式
  if (locale === "zh_CN") return "zh-CN";
  if (locale === "zh_HK") return "zh-HK";

  // 如果是标准格式，直接返回
  return locale as Locale;
}

/**
 * 从URL参数获取locale
 */
export function getLocaleFromUrl(): Locale | null {
  const params = new URLSearchParams(window.location.search);
  const locale = params.get("locale");
  return locale ? normalizeLocale(locale) : null;
}

/**
 * 从localStorage获取locale
 */
export function getLocaleFromStorage(): Locale | null {
  try {
    const locale = localStorage.getItem(LOCALE_STORAGE_KEY);
    return locale ? normalizeLocale(locale) : null;
  } catch (error) {
    console.error("读取localStorage失败:", error);
    return null;
  }
}

/**
 * 保存locale到localStorage
 */
export function saveLocale(locale: Locale): void {
  try {
    localStorage.setItem(LOCALE_STORAGE_KEY, locale);
  } catch (error) {
    console.error("保存locale到localStorage失败:", error);
  }
}

/**
 * 检查locale是否合法（包括兼容格式）
 */
function isValidLocaleString(locale: any): boolean {
  return (
    VALID_LOCALES.includes(locale) ||
    COMPATIBLE_LOCALES.includes(locale as CompatibleLocale)
  );
}

/**
 * 验证locale是否合法（标准格式）
 */
export function isValidLocale(locale: any): locale is Locale {
  return VALID_LOCALES.includes(locale);
}

/**
 * 获取浏览器语言偏好
 */
export function getBrowserLocale(): Locale | null {
  const browserLang = navigator.language || (navigator as any).userLanguage;

  if (browserLang.startsWith("zh")) {
    // 判断是繁体还是简体
    return browserLang.includes("TW") ||
      browserLang.includes("HK") ||
      browserLang.includes("Hant")
      ? "zh-HK"
      : "zh-CN";
  }

  if (browserLang.startsWith("en")) {
    return "en";
  }

  return null;
}

/**
 * 获取当前locale（按优先级：URL > localStorage > 浏览器 > 默认值）
 */
export function getCurrentLocale(): Locale {
  return (
    getLocaleFromUrl() ||
    getLocaleFromStorage() ||
    getBrowserLocale() ||
    "zh-CN"
  );
}

/**
 * 为URL添加locale参数
 */
export function addLocaleToUrl(url: string, locale?: Locale): string {
  const currentLocale = locale || getCurrentLocale();
  const urlObj = new URL(url, window.location.origin);
  urlObj.searchParams.set("locale", currentLocale);
  return urlObj.toString();
}

/**
 * 转换locale格式为API所需格式（如有需要）
 * 例如：zh-CN -> zh_CN, zh-HK -> zh_HK
 */
export function convertLocaleForApi(locale: Locale): string {
  const localeMap: Record<Locale, string> = {
    en: "en",
    "zh-CN": "zh_CN",
    "zh-HK": "zh_HK",
    "zh-Hans": "zh_CN",
    "zh-Hant": "zh_HK",
  };
  return localeMap[locale] || locale;
}

/**
 * 获取语言显示名称
 */
export function getLocaleDisplayName(locale: Locale): string {
  const displayNames: Record<Locale, string> = {
    en: "English",
    "zh-CN": "简体中文",
    "zh-HK": "繁體中文",
    "zh-Hans": "简体中文",
    "zh-Hant": "繁體中文",
  };
  return displayNames[locale] || locale;
}

/**
 * 将locale映射到实际的翻译文件key
 * zh-CN -> zh-Hans, zh-HK -> zh-Hant
 */
export function mapLocaleToTranslationKey(locale: Locale): string {
  const localeMap: Record<Locale, string> = {
    en: "en",
    "zh-CN": "zh-Hans",
    "zh-HK": "zh-Hant",
    "zh-Hans": "zh-Hans",
    "zh-Hant": "zh-Hant",
  };
  return localeMap[locale] || locale;
}
