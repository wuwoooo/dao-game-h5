// 分享文案配置表
const SHARE_SLOGANS = [
  "好兄弟，有币一起薅！",
  "兄弟来战，空投管饱！",
  "有链同薅，有福同享！",
  "币圈不孤单，抽奖更好玩！",
  "拉上好兄弟，奖励翻倍起！",
  "兄弟有币，咱们一起撸！",
  "抽奖不独享，空投更疯狂！",
  "链上狂欢，一起薅羊毛！",
  "好兄弟，链起来抽奖！",
  "分币不分心，薅毛要齐心！",
  "兄弟齐薅，奖励必高！",
  "链上有福，兄弟同步！",
  "币来就薅，奖来就捞！",
  "抽奖要拼，薅毛要狠，兄弟跟上才是真！",
  "薅就薅到爽，抽就抽到爆！",
  "空投在手，大奖开口！",
  "不薅就亏，不拉兄弟更亏！",
  "抽奖不独行，羊毛更带劲！",
  "撸币趁早，大奖更好！",
  "一键召唤，兄弟来战！",
  "不拉兄弟怎么薅？大奖等你来搞！",
  "一个人抽奖很孤单，一起薅才更爽！",
  "链上狂欢，兄弟开团！",
  "羊毛到手，兄弟同享！",
  "有空投，今晚不薅明天亏！",
  "空投已到站，兄弟快上车！",
  "空投一到，兄弟必报！",
  "链上空投，兄弟同薅！",
  "好兄弟，空投不等人！",
  "抢空投，喊兄弟！",
  "兄弟拉满，空投翻番！",
  "空投雨要来了，兄弟快举碗！",
];

// 随机选择分享文案
export function getRandomShareSlogan(): string {
  const randomIndex = Math.floor(Math.random() * SHARE_SLOGANS.length);
  return SHARE_SLOGANS[randomIndex];
}

// 分享配置接口
export interface ShareConfig {
  url: string;
  title: string;
  text: string;
  image?: string;
  // 用户信息，用于生成短链
  userInfo?: {
    uuid: string;
    token: string;
    uid: string;
  };
}

// 短链生成配置接口
export interface ShortUrlConfig {
  uuid: string;
  token: string;
  uid: string;
  oriUrl: string;
}

// 短链缓存接口
interface ShortUrlCache {
  [key: string]: {
    shortUrl: string;
    timestamp: number;
    expiresAt: number;
  };
}

// 缓存键生成函数
function generateCacheKey(config: ShortUrlConfig): string {
  return `${config.uuid}_${config.uid}_${btoa(config.oriUrl)}`;
}

// 获取缓存的短链
function getCachedShortUrl(config: ShortUrlConfig): string | null {
  try {
    const cacheKey = generateCacheKey(config);
    const cached = localStorage.getItem(`shortUrl_${cacheKey}`);

    if (cached) {
      const cacheData: ShortUrlCache[string] = JSON.parse(cached);
      const now = Date.now();

      // 检查是否过期（24小时过期）
      if (now < cacheData.expiresAt) {
        console.log("使用缓存的短链:", cacheData.shortUrl);
        return cacheData.shortUrl;
      } else {
        // 过期则删除缓存
        localStorage.removeItem(`shortUrl_${cacheKey}`);
        console.log("短链缓存已过期，删除缓存");
      }
    }
  } catch (error) {
    console.warn("读取短链缓存失败:", error);
  }

  return null;
}

// 保存短链到缓存
function setCachedShortUrl(config: ShortUrlConfig, shortUrl: string): void {
  try {
    const cacheKey = generateCacheKey(config);
    const now = Date.now();
    const expiresAt = now + 24 * 60 * 60 * 1000; // 24小时后过期

    const cacheData: ShortUrlCache[string] = {
      shortUrl,
      timestamp: now,
      expiresAt,
    };

    localStorage.setItem(`shortUrl_${cacheKey}`, JSON.stringify(cacheData));
    console.log("短链已缓存:", shortUrl);
  } catch (error) {
    console.warn("保存短链缓存失败:", error);
  }
}

// 清理过期的短链缓存
export function clearExpiredShortUrlCache(): void {
  try {
    const now = Date.now();
    const keysToRemove: string[] = [];

    // 遍历所有短链缓存
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith("shortUrl_")) {
        try {
          const cached = localStorage.getItem(key);
          if (cached) {
            const cacheData: ShortUrlCache[string] = JSON.parse(cached);
            if (now >= cacheData.expiresAt) {
              keysToRemove.push(key);
            }
          }
        } catch (error) {
          // 如果解析失败，也删除这个缓存
          keysToRemove.push(key);
        }
      }
    }

    // 删除过期的缓存
    keysToRemove.forEach((key) => {
      localStorage.removeItem(key);
    });

    if (keysToRemove.length > 0) {
      console.log(`清理了 ${keysToRemove.length} 个过期的短链缓存`);
    }
  } catch (error) {
    console.warn("清理短链缓存失败:", error);
  }
}

// 清理所有短链缓存
export function clearAllShortUrlCache(): void {
  try {
    const keysToRemove: string[] = [];

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith("shortUrl_")) {
        keysToRemove.push(key);
      }
    }

    keysToRemove.forEach((key) => {
      localStorage.removeItem(key);
    });

    console.log(`清理了 ${keysToRemove.length} 个短链缓存`);
  } catch (error) {
    console.warn("清理所有短链缓存失败:", error);
  }
}

// 生成短链
export async function generateShortUrl(
  config: ShortUrlConfig
): Promise<string> {
  // 先检查缓存
  const cachedShortUrl = getCachedShortUrl(config);
  if (cachedShortUrl) {
    return cachedShortUrl;
  }

  try {
    const { getShortUrl } = await import("../api/user");
    const response = await getShortUrl(config);

    if (response.data.status === 200) {
      const shortCode = response.data.attachment;
      const shortLinkBaseUrl =
        import.meta.env.VITE_ShortLink_Url || "https://t-dao.aisky.io/";
      const shortUrl = `${shortLinkBaseUrl}${shortCode}`;

      // 保存到缓存
      setCachedShortUrl(config, shortUrl);

      return shortUrl;
    } else {
      throw new Error(response.data.message || "生成短链失败");
    }
  } catch (error) {
    console.error("生成短链失败:", error);
    // 如果短链生成失败，返回原始URL
    return config.oriUrl;
  }
}

// 获取分享URL（优先使用短链）
export async function getShareUrl(config: ShareConfig): Promise<string> {
  // 如果有用户信息，尝试生成短链
  if (config.userInfo) {
    try {
      const shortUrl = await generateShortUrl({
        uuid: config.userInfo.uuid,
        token: config.userInfo.token,
        uid: config.userInfo.uid,
        oriUrl: config.url,
      });
      return shortUrl;
    } catch (error) {
      console.warn("生成短链失败，使用原始URL:", error);
    }
  }

  // 降级到原始URL
  return config.url;
}

// 检测是否在APP内嵌环境
export function isInApp(): boolean {
  const userAgent = navigator.userAgent.toLowerCase();
  return (
    userAgent.includes("aisky") ||
    userAgent.includes("webview") ||
    window.navigator.standalone === true
  );
}

// 检测设备类型
export function getDeviceType(): "ios" | "android" | "unknown" {
  const userAgent = navigator.userAgent.toLowerCase();
  if (/iphone|ipad|ipod/.test(userAgent)) {
    return "ios";
  } else if (/android/.test(userAgent)) {
    return "android";
  }
  return "unknown";
}

// 分享到Facebook
export async function shareToFacebook(config: ShareConfig) {
  const { title, text } = config;
  const shareUrl = await getShareUrl(config);

  // 添加随机分享文案
  const randomSlogan = getRandomShareSlogan();
  const shareText = `${randomSlogan}${text}`;

  if (isInApp()) {
    // 在APP内嵌环境中，尝试使用URL Scheme唤起Facebook
    const fbUrl = `fb://share?link=${encodeURIComponent(
      shareUrl
    )}&quote=${encodeURIComponent(shareText)}`;
    window.location.href = fbUrl;

    // 如果Facebook未安装，降级到网页版
    setTimeout(() => {
      const webUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
        shareUrl
      )}`;
      window.open(webUrl, "_blank", "width=600,height=400");
    }, 1000);
  } else {
    // 在浏览器环境中，直接打开网页版
    const webUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
      shareUrl
    )}`;
    window.open(webUrl, "_blank", "width=600,height=400");
  }
}

// 分享到Telegram
export async function shareToTelegram(config: ShareConfig) {
  const { text } = config;
  const shareUrl = await getShareUrl(config);

  // 添加随机分享文案
  const randomSlogan = getRandomShareSlogan();
  const shareText = `${randomSlogan}${text}`;

  if (isInApp()) {
    // 在APP内嵌环境中，尝试使用URL Scheme唤起Telegram
    const tgUrl = `tg://msg?text=${encodeURIComponent(
      shareText + " " + shareUrl
    )}`;
    window.location.href = tgUrl;

    // 如果Telegram未安装，降级到网页版
    setTimeout(() => {
      const webUrl = `https://t.me/share/url?url=${encodeURIComponent(
        shareUrl
      )}&text=${encodeURIComponent(shareText)}`;
      window.open(webUrl, "_blank", "width=600,height=400");
    }, 1000);
  } else {
    // 在浏览器环境中，直接打开网页版
    const webUrl = `https://t.me/share/url?url=${encodeURIComponent(
      shareUrl
    )}&text=${encodeURIComponent(shareText)}`;
    window.open(webUrl, "_blank", "width=600,height=400");
  }
}

// 分享到X.com (Twitter)
export async function shareToX(config: ShareConfig) {
  const { text } = config;
  const shareUrl = await getShareUrl(config);

  // 添加随机分享文案
  const randomSlogan = getRandomShareSlogan();
  const shareText = `${randomSlogan}${text}`;

  if (isInApp()) {
    // 在APP内嵌环境中，尝试使用URL Scheme唤起X
    const twitterUrl = `twitter://post?message=${encodeURIComponent(
      shareText + " " + shareUrl
    )}`;
    window.location.href = twitterUrl;

    // 如果X未安装，降级到网页版
    setTimeout(() => {
      const webUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(
        shareUrl
      )}&text=${encodeURIComponent(shareText)}`;
      window.open(webUrl, "_blank", "width=600,height=400");
    }, 1000);
  } else {
    // 在浏览器环境中，直接打开网页版
    const webUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(
      shareUrl
    )}&text=${encodeURIComponent(shareText)}`;
    window.open(webUrl, "_blank", "width=600,height=400");
  }
}

// 分享到邮箱
export async function shareToEmail(config: ShareConfig) {
  const { title, text } = config;
  const shareUrl = await getShareUrl(config);

  // 添加随机分享文案
  const randomSlogan = getRandomShareSlogan();
  const shareText = `${randomSlogan}${text}`;

  const subject = encodeURIComponent(title);
  const body = encodeURIComponent(`${shareText}\n\n${shareUrl}`);
  const mailtoUrl = `mailto:?subject=${subject}&body=${body}`;

  // 直接打开邮件客户端
  window.location.href = mailtoUrl;
}

// 系统分享（调用原生分享面板）
export async function shareToSystem(config: ShareConfig) {
  const shareUrl = await getShareUrl(config);

  if (navigator.share) {
    return navigator
      .share({
        title: config.title,
        text: config.text,
        url: shareUrl,
      })
      .catch((err) => {
        console.log("系统分享失败:", err);
        copyToClipboard(shareUrl); // 降级到复制链接
      });
  } else {
    // 在APP内嵌环境中，可以调用原生分享
    if (isInApp() && window.webkit?.messageHandlers?.share) {
      // iOS WebView
      window.webkit.messageHandlers.share.postMessage({
        ...config,
        url: shareUrl,
      });
    } else if (isInApp() && window.Android?.share) {
      // Android WebView
      window.Android.share(
        JSON.stringify({
          ...config,
          url: shareUrl,
        })
      );
    } else {
      copyToClipboard(shareUrl);
    }
  }
}

// 分享到微信
export async function shareToWeChat(config: ShareConfig) {
  const shareUrl = await getShareUrl(config);

  try {
    // 使用新的微信打开逻辑
    openWeChat();
  } catch (error) {
    console.error("打开微信失败:", error);
    // 降级处理：复制链接到剪贴板，添加随机分享文案
    try {
      const randomSlogan = getRandomShareSlogan();
      const textToCopy = `${randomSlogan}${shareUrl}`;
      await copyToClipboard(textToCopy);
      showCopySuccess();
    } catch (copyError) {
      console.error("复制链接失败:", copyError);
      showCopyError();
    }
  }
}

// 打开微信APP
function openWeChat() {
  var ua = navigator.userAgent.toLowerCase();
  if (/iphone|ipad|ipod/.test(ua)) {
    window.location.href = "https://apps.apple.com/cn/app/wechat/id414478124";
  } else if (/android/.test(ua)) {
    window.location.href = "weixin://";
  } else {
    window.location.href = "weixin://";
  }
}

// 复制到剪贴板
export function copyToClipboard(text: string): Promise<void> {
  return new Promise((resolve, reject) => {
    // 检查文本是否有效
    if (!text || text === "undefined" || text === "null") {
      reject(new Error("无效的复制内容"));
      return;
    }

    // 优先使用现代 Clipboard API
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard
        .writeText(text)
        .then(() => {
          console.log("使用 Clipboard API 复制成功");
          resolve();
        })
        .catch((err) => {
          console.warn("Clipboard API 失败，尝试降级方案:", err);
          fallbackCopy(text).then(resolve).catch(reject);
        });
    } else {
      // 降级方案
      fallbackCopy(text).then(resolve).catch(reject);
    }
  });
}

// 降级复制方案
function fallbackCopy(text: string): Promise<void> {
  return new Promise((resolve, reject) => {
    try {
      const textArea = document.createElement("textarea");
      textArea.value = text;
      textArea.style.position = "fixed";
      textArea.style.left = "-999999px";
      textArea.style.top = "-999999px";
      textArea.style.opacity = "0";
      textArea.setAttribute("readonly", "");

      document.body.appendChild(textArea);

      // 选择文本
      textArea.select();
      textArea.setSelectionRange(0, 99999); // 移动端兼容

      // 执行复制
      const successful = document.execCommand("copy");

      // 清理
      document.body.removeChild(textArea);

      if (successful) {
        console.log("使用 execCommand 复制成功");
        resolve();
      } else {
        reject(new Error("execCommand 复制失败"));
      }
    } catch (err) {
      console.error("降级复制方案失败:", err);
      reject(err);
    }
  });
}

// 显示复制成功提示
import message from "./message";

// 扩展Window接口以支持APP内嵌环境的特定属性
declare global {
  interface Window {
    webkit?: {
      messageHandlers?: {
        share?: {
          postMessage: (data: any) => void;
        };
      };
    };
    Android?: {
      share: (data: string) => void;
    };
  }
  interface Navigator {
    standalone?: boolean;
  }
}

export function showCopySuccess(t?: (key: string) => string) {
  const successMessage = t
    ? t("lottery.components.shareModal.copySuccessMessage")
    : "链接已复制到剪贴板";
  message.success(successMessage, undefined, t);
}

// 显示复制失败提示
export function showCopyError(t?: (key: string) => string) {
  const errorMessage = t
    ? t("lottery.components.shareModal.copyErrorMessage")
    : "复制失败，请手动复制链接";
  message.error(errorMessage, undefined, t);
}
