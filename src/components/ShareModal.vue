<template>
  <Transition
    name="modal"
    enter-active-class="transition-all duration-300 ease-out"
    leave-active-class="transition-all duration-300 ease-in"
    enter-from-class="opacity-0"
    enter-to-class="opacity-100"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div
      v-if="visible"
      class="fixed inset-0 z-50 flex items-end justify-center bg-black bg-opacity-50 backdrop-blur-sm"
      @click="closeModal"
      @touchmove.prevent
    >
      <Transition
        name="panel"
        enter-active-class="transition-transform duration-300 ease-out"
        leave-active-class="transition-transform duration-300 ease-in"
        enter-from-class="translate-y-full"
        enter-to-class="translate-y-0"
        leave-from-class="translate-y-0"
        leave-to-class="translate-y-full"
      >
        <!-- 分享面板 -->
        <div
          v-if="showPanel"
          class="bg-white rounded-t-3xl w-full max-w-md"
          @click.stop
        >
          <!-- 拖拽指示器 -->
          <div class="flex justify-center pt-3 pb-2">
            <div class="w-12 h-1 bg-gray-300 rounded-full"></div>
          </div>

          <!-- 标题栏 -->
          <div
            class="flex items-center justify-between px-6 py-2 border-b border-gray-100"
          >
            <h3 class="text-lg font-semibold text-gray-900">
              {{ t("lottery.components.shareModal.title") }}
            </h3>
            <button
              @click="closeModal"
              class="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 hover:text-gray-700 hover:bg-gray-300 transition-colors"
            >
              <svg
                class="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <!-- 分享选项 -->
          <div class="px-6 py-6">
            <div class="grid grid-cols-5 gap-4 mb-6">
              <!-- Facebook -->
              <button
                @click="handleShareToFacebook"
                :disabled="isGeneratingShortUrl"
                class="flex flex-col items-center space-y-2 p-3 rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div
                  class="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center"
                >
                  <svg
                    class="w-6 h-6 text-white"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
                    />
                  </svg>
                </div>
                <span class="text-xs text-gray-600">FaceBook</span>
              </button>

              <!-- Telegram -->
              <button
                @click="handleShareToTelegram"
                :disabled="isGeneratingShortUrl"
                class="flex flex-col items-center space-y-2 p-3 rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div
                  class="w-12 h-12 bg-sky-400 rounded-full flex items-center justify-center"
                >
                  <svg
                    class="w-6 h-6 text-white"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"
                    />
                  </svg>
                </div>
                <span class="text-xs text-gray-600">Telegram</span>
              </button>

              <!-- X.com (Twitter) -->
              <button
                @click="handleShareToX"
                :disabled="isGeneratingShortUrl"
                class="flex flex-col items-center space-y-2 p-3 rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div
                  class="w-12 h-12 bg-black rounded-full flex items-center justify-center"
                >
                  <svg
                    class="w-6 h-6 text-white"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"
                    />
                  </svg>
                </div>
                <span class="text-xs text-gray-600">Twitter</span>
              </button>

              <!-- 邮箱 -->
              <button
                @click="handleShareToEmail"
                :disabled="isGeneratingShortUrl"
                class="flex flex-col items-center space-y-2 p-3 rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div
                  class="w-12 h-12 bg-white border-2 border-gray-300 rounded-full flex items-center justify-center"
                >
                  <svg
                    class="w-6 h-6 text-gray-500"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"
                    />
                  </svg>
                </div>
                <span class="text-xs text-gray-600">{{
                  t("lottery.components.shareModal.email")
                }}</span>
              </button>

              <!-- 微信分享 -->
              <button
                @click="handleShareToWeChat"
                :disabled="isGeneratingShortUrl"
                class="flex flex-col items-center space-y-2 p-3 rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div
                  class="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center"
                >
                  <svg
                    class="w-6 h-6 text-white"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      d="M8.5 12.5c0-.8-.7-1.5-1.5-1.5s-1.5.7-1.5 1.5.7 1.5 1.5 1.5 1.5-.7 1.5-1.5zm7 0c0-.8-.7-1.5-1.5-1.5s-1.5.7-1.5 1.5.7 1.5 1.5 1.5 1.5-.7 1.5-1.5zM12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm0 18c-4.4 0-8-3.6-8-8s3.6-8 8-8 8 3.6 8 8-3.6 8-8 8z"
                    />
                  </svg>
                </div>
                <span class="text-xs text-gray-600">{{
                  t("lottery.components.shareModal.wechat")
                }}</span>
              </button>
            </div>

            <!-- 分享链接 -->
            <div class="space-y-3">
              <div class="text-left">
                <label class="text-sm font-medium text-gray-700">{{
                  t("lottery.components.shareModal.copyLink")
                }}</label>
              </div>
              <div class="flex items-center space-x-3">
                <input
                  :value="displayUrl"
                  readonly
                  class="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  style="color: #000"
                />
                <button
                  @click="handleCopyLink"
                  :disabled="isGeneratingShortUrl"
                  class="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {{
                    isGeneratingShortUrl
                      ? t("lottery.components.shareModal.generating")
                      : t("lottery.components.shareModal.copy")
                  }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, watch, computed, onUnmounted } from "vue";
import { useI18n } from "vue-i18n";
import {
  shareToFacebook,
  shareToTelegram,
  shareToX,
  shareToEmail,
  shareToWeChat,
  copyToClipboard,
  showCopySuccess,
  showCopyError,
  getShareUrl,
  getRandomShareSlogan,
  type ShareConfig,
} from "../utils/share";
import message from "../utils/message";

// 导入缓存函数（需要从内部导入，因为不是导出的函数）
import { generateShortUrl } from "../utils/share";

const { t } = useI18n();

interface Props {
  visible: boolean;
  shareUrl: string;
  shareTitle?: string;
  shareText?: string;
  shareImage?: string;
  userInfo?: {
    uuid: string;
    token: string;
    uid: string;
  };
  isHelpInvite?: boolean; // 是否为好友助力邀请场景
}

const props = withDefaults(defineProps<Props>(), {
  shareTitle: "分享活动",
  shareText: "快来参与这个精彩活动！",
});

const emit = defineEmits<{
  close: [];
}>();

// 内部状态控制面板显示
const showPanel = ref(false);

// 滚动锁定相关变量
let scrollY = 0;
let isScrollLocked = false;

// 锁定页面滚动
function lockScroll() {
  if (isScrollLocked) return;

  scrollY = window.scrollY;
  document.body.style.position = "fixed";
  document.body.style.top = `-${scrollY}px`;
  document.body.style.width = "100%";
  document.body.style.overflow = "hidden";
  document.body.classList.add("scroll-locked");
  isScrollLocked = true;
}

// 解锁页面滚动
function unlockScroll() {
  if (!isScrollLocked) return;

  document.body.style.position = "";
  document.body.style.top = "";
  document.body.style.width = "";
  document.body.style.overflow = "";
  document.body.classList.remove("scroll-locked");
  window.scrollTo(0, scrollY);
  isScrollLocked = false;
}

// 监听 visible 变化
watch(
  () => props.visible,
  (newVal) => {
    if (newVal) {
      // 显示时，先锁定滚动，然后显示面板
      lockScroll();
      setTimeout(() => {
        showPanel.value = true;
      }, 50);
    } else {
      // 隐藏时，解锁滚动
      unlockScroll();
    }
    // 注意：隐藏逻辑在 closeModal 函数中处理，避免重复
  }
);

// 关闭弹窗
function closeModal() {
  // 先隐藏面板，等待滑动动画完成后再关闭整个弹窗
  showPanel.value = false;
  setTimeout(() => {
    emit("close");
  }, 300); // 等待动画完成
}

// 复制链接
async function handleCopyLink() {
  // 如果正在生成短链，直接返回
  if (isGeneratingShortUrl.value) {
    return;
  }

  try {
    console.log("开始复制链接:", displayUrl.value);
    console.log("链接类型:", typeof displayUrl.value);
    console.log("链接长度:", displayUrl.value?.length);

    // 检查URL是否有效
    if (
      !displayUrl.value ||
      displayUrl.value === "undefined" ||
      displayUrl.value === "null" ||
      displayUrl.value === "生成中..."
    ) {
      throw new Error(t("lottery.components.shareModal.copyError"));
    }

    // 如果是好友助力邀请场景，在链接前面加上随机选择的分享文案
    let textToCopy = displayUrl.value;
    if (props.isHelpInvite) {
      const randomSlogan = getRandomShareSlogan();
      textToCopy = `${randomSlogan}${displayUrl.value}`;
    }

    await copyToClipboard(textToCopy);
    console.log(t("lottery.components.shareModal.copySuccess"));
    showCopySuccess(t);
  } catch (error) {
    console.error("复制失败:", error);
    showCopyError(t);
  }
}

// 分享配置 - 使用计算属性确保实时更新
const shareConfig = computed(
  (): ShareConfig => ({
    url: props.shareUrl,
    title: props.shareTitle,
    text: props.shareText,
    image: props.shareImage,
    userInfo: props.userInfo,
  })
);

// 显示在输入框中的URL（优先显示短链）
const displayUrl = ref(props.shareUrl);
// 短链生成状态
const isGeneratingShortUrl = ref(false);

// 初始化时尝试获取短链
watch(
  () => props.visible,
  async (newVal) => {
    if (newVal && props.userInfo) {
      // 先检查是否有缓存，如果有缓存则不需要显示"生成中"
      const cacheKey = `${props.userInfo.uuid}_${props.userInfo.uid}_${btoa(
        props.shareUrl
      )}`;
      const cached = localStorage.getItem(`shortUrl_${cacheKey}`);
      let hasValidCache = false;

      if (cached) {
        try {
          const cacheData = JSON.parse(cached);
          const now = Date.now();
          if (now < cacheData.expiresAt) {
            hasValidCache = true;
            displayUrl.value = cacheData.shortUrl;
          }
        } catch (error) {
          console.warn("解析缓存失败:", error);
        }
      }

      // 如果没有有效缓存，显示"生成中"并获取短链
      if (!hasValidCache) {
        isGeneratingShortUrl.value = true;
        displayUrl.value = "生成中...";

        try {
          const shortUrl = await generateShortUrl({
            uuid: props.userInfo.uuid,
            token: props.userInfo.token,
            uid: props.userInfo.uid,
            oriUrl: props.shareUrl,
          });
          displayUrl.value = shortUrl;
        } catch (error) {
          console.warn("获取短链失败，使用原始URL:", error);
          displayUrl.value = props.shareUrl;
        } finally {
          isGeneratingShortUrl.value = false;
        }
      }
    } else if (newVal) {
      displayUrl.value = props.shareUrl;
    }
  },
  { immediate: true }
);

// 各种分享方法
const handleShareToFacebook = async () => {
  if (isGeneratingShortUrl.value) return;
  await shareToFacebook(shareConfig.value);
  closeModal();
};

const handleShareToTelegram = async () => {
  if (isGeneratingShortUrl.value) return;
  await shareToTelegram(shareConfig.value);
  closeModal();
};

const handleShareToX = async () => {
  if (isGeneratingShortUrl.value) return;
  await shareToX(shareConfig.value);
  closeModal();
};

const handleShareToEmail = async () => {
  if (isGeneratingShortUrl.value) return;
  await shareToEmail(shareConfig.value);
  closeModal();
};

const handleShareToWeChat = async () => {
  if (isGeneratingShortUrl.value) return;
  await shareToWeChat(shareConfig.value);
  closeModal();
};

// 组件卸载时恢复页面滚动
onUnmounted(() => {
  unlockScroll();
});
</script>

<style scoped>
/* 确保弹窗动画流畅 */
.transition-all {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 300ms;
}

/* 按钮悬停效果 */
button:hover {
  transform: translateY(-1px);
}

/* 输入框样式优化 */
input:focus {
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

/* 移动端触摸优化 */
@media (max-width: 768px) {
  /* 防止弹窗背景滚动 */
  .fixed {
    touch-action: none;
    -webkit-overflow-scrolling: touch;
  }

  /* 允许弹窗内容滚动 */
  .bg-white {
    touch-action: auto;
    -webkit-overflow-scrolling: touch;
    max-height: 80vh;
    overflow-y: auto;
  }

  /* 改善移动端按钮触摸体验 */
  button {
    -webkit-tap-highlight-color: transparent;
    touch-action: manipulation;
  }
}

/* 全局滚动锁定样式 */
body.scroll-locked {
  position: fixed !important;
  width: 100% !important;
  overflow: hidden !important;
}
</style>
