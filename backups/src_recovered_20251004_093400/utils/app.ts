// App相关工具函数

// 检查是否为App环境
export function isAppMode(): boolean {
  // 首先检查URL参数
  const urlParams = new URLSearchParams(window.location.search);
  const isAppParam = urlParams.get("isApp");

  if (isAppParam === "1") {
    // 将参数存储到sessionStorage中
    sessionStorage.setItem("isApp", "1");
    return true;
  }

  // 检查sessionStorage中是否已存储
  return sessionStorage.getItem("isApp") === "1";
}

// 获取App模式下的顶部偏移样式
export function getAppTopOffset(): string {
  return isAppMode() ? "pt-14" : ""; // 56px = 14 * 4px (Tailwind的pt-14)
}

// 获取App模式下的顶部偏移CSS类
export function getAppTopOffsetClass(): string {
  return isAppMode() ? "pt-14" : "";
}
