/**
 * Vue I18n 国际化配置
 */

import { createI18n } from "vue-i18n";
import {
  getCurrentLocale,
  saveLocale,
  mapLocaleToTranslationKey,
} from "../utils/locale";
import type { Locale } from "../utils/locale";

// 导入抽奖模块翻译
import lotteryZhHans from "./lottery/zh-Hans";
import lotteryZhHant from "./lottery/zh-Hant";
import lotteryEn from "./lottery/en";

// 组织翻译消息
const messages = {
  "zh-Hans": {
    lottery: lotteryZhHans,
  },
  "zh-Hant": {
    lottery: lotteryZhHant,
  },
  "zh-CN": {
    lottery: lotteryZhHans, // zh-CN 使用简体中文翻译
  },
  "zh-HK": {
    lottery: lotteryZhHant, // zh-HK 使用繁体中文翻译
  },
  en: {
    lottery: lotteryEn,
  },
};

// 创建i18n实例
const i18n = createI18n({
  legacy: false, // 使用 Composition API 模式
  locale: getCurrentLocale(), // 设置初始语言
  fallbackLocale: "zh-CN", // 回退语言
  messages,
  globalInjection: true, // 全局注入 $t 函数
  missingWarn: false, // 关闭缺失翻译警告（生产环境）
  fallbackWarn: false, // 关闭回退警告（生产环境）
});

// 切换语言的辅助函数
export function setLocale(locale: Locale) {
  i18n.global.locale.value = locale;
  saveLocale(locale);

  // 更新HTML lang属性（SEO优化）
  document.documentElement.lang = locale;

  // 如果有需要，可以在这里触发全局事件通知其他组件
  window.dispatchEvent(
    new CustomEvent("locale-changed", { detail: { locale } })
  );
}

// 获取当前语言
export function getLocale(): Locale {
  return i18n.global.locale.value as Locale;
}

// 导出翻译函数供非组件文件使用
export const t = i18n.global.t;

export default i18n;
