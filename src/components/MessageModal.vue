<template>
  <div
    v-if="visible"
    class="message-modal-overlay fixed inset-0 z-[99999] flex items-center justify-center bg-black/50 backdrop-blur-sm"
    @click="handleBackdropClick"
    @touchmove.prevent
  >
    <div
      class="message-modal-content bg-white rounded-2xl w-full max-w-md mx-4 flex flex-col border border-gray-200 shadow-xl relative z-[100000]"
      :style="{
        maxHeight: isKeyboardOpen
          ? 'calc(100vh - 100px)'
          : 'calc(100vh - 2rem)',
        height: isKeyboardOpen ? 'calc(100vh - 100px)' : 'auto',
        minHeight: '300px',
        position: isKeyboardOpen ? 'fixed' : 'relative',
        top: isKeyboardOpen ? '1rem' : 'auto',
        bottom: isKeyboardOpen ? 'auto' : 'auto',
      }"
      @click.stop
      @touchmove.stop
    >
      <!-- 头部 -->
      <div
        class="flex items-center justify-between p-4 border-b border-gray-200"
      >
        <div class="flex items-center space-x-3">
          <div
            class="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center"
          >
            <span class="text-white font-bold text-sm">
              {{ targetUser.nickname?.charAt(0) || "U" }}
            </span>
          </div>
          <div>
            <h3 class="font-semibold text-gray-900">
              {{ targetUser.nickname || "用户" }}
            </h3>
          </div>
        </div>
        <button
          @click="close"
          class="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <svg
            class="w-5 h-5 text-gray-500"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>

      <!-- 消息列表 -->
      <div
        ref="messagesContainer"
        class="flex-1 overflow-y-auto p-4 space-y-4"
        :style="{
          maxHeight: isKeyboardOpen
            ? 'calc(100vh - 300px)'
            : 'calc(100vh - 200px)',
          minHeight: isKeyboardOpen ? '150px' : '200px',
        }"
      >
        <div v-if="loading" class="flex justify-center py-8">
          <div
            class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"
          ></div>
        </div>

        <div
          v-else-if="messages.length === 0"
          class="text-center py-8 text-gray-500"
        >
          <svg
            class="w-12 h-12 mx-auto mb-3 text-gray-300"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1"
          >
            <path
              d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"
            ></path>
          </svg>
          <p>{{ t("lottery.message.noMessages") }}</p>
        </div>

        <div v-else class="space-y-3">
          <div
            v-for="message in messages"
            :key="message.id"
            class="flex"
            :class="
              message.senderUid === currentUser?.uid
                ? 'justify-end'
                : 'justify-start'
            "
          >
            <div
              class="max-w-[70%] rounded-lg px-3 py-2"
              :class="
                message.senderUid === currentUser?.uid
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-900'
              "
            >
              <p class="text-sm">{{ message.content }}</p>
              <p
                class="text-xs mt-1 opacity-70"
                :class="
                  message.senderUid === currentUser?.uid
                    ? 'text-right'
                    : 'text-left'
                "
              >
                {{ formatTime(message.createdTime) }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- 输入框 -->
      <div class="p-4 border-t border-gray-200">
        <div class="flex space-x-2">
          <input
            v-model="newMessage"
            @keyup.enter="sendMessage"
            :placeholder="t('lottery.message.inputPlaceholder')"
            class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500 bg-white"
            :disabled="sending"
          />
          <button
            @click="sendMessage"
            :disabled="!newMessage.trim() || sending"
            class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <svg
              v-if="sending"
              class="w-4 h-4 animate-spin"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <path
                d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                stroke-dasharray="60"
                stroke-dashoffset="60"
              >
                <animateTransform
                  attributeName="transform"
                  type="rotate"
                  values="0 12 12;360 12 12"
                  dur="1s"
                  repeatCount="indefinite"
                />
              </path>
            </svg>
            <svg
              v-else
              class="w-4 h-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <line x1="22" y1="2" x2="11" y2="13"></line>
              <polygon points="22,2 15,22 11,13 2,9 22,2"></polygon>
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick, watch, onUnmounted } from "vue";
import { useI18n } from "vue-i18n";
import { getUserInfoFromCache } from "../utils/auth";
import {
  getConversationDetail,
  sendUserMessage,
  markMessagesAsRead,
} from "../api/message";

const { t } = useI18n();

interface TargetUser {
  uid: string;
  nickname: string;
  avatar?: string;
}

interface Message {
  id: number;
  senderUid: string;
  senderNickname: string;
  senderAvatar?: string;
  receiverUid: string;
  receiverNickname: string;
  receiverAvatar?: string;
  content: string;
  messageType: string;
  messageStatus: string;
  createdTime: string;
  readTime?: string;
}

const props = defineProps<{
  visible: boolean;
  targetUser: TargetUser;
}>();

const emit = defineEmits<{
  close: [];
}>();

const messages = ref<Message[]>([]);
const newMessage = ref("");
const loading = ref(false);
const sending = ref(false);
const messagesContainer = ref<HTMLElement>();
const isKeyboardOpen = ref(false);
const initialViewportHeight = ref(0);

const currentUser = getUserInfoFromCache();

// 检测键盘是否打开
function detectKeyboard() {
  const currentHeight = window.innerHeight;
  const heightDiff = initialViewportHeight.value - currentHeight;

  // 如果高度差超过150px，认为键盘已打开
  if (heightDiff > 150) {
    isKeyboardOpen.value = true;
  } else {
    isKeyboardOpen.value = false;
  }
}

// 键盘检测
function handleResize() {
  detectKeyboard();
}

// 格式化时间
function formatTime(timeStr: string) {
  const date = new Date(timeStr);
  const now = new Date();
  const diff = now.getTime() - date.getTime();

  if (diff < 60000) {
    // 1分钟内
    return t("lottery.message.justNow");
  } else if (diff < 3600000) {
    // 1小时内
    return Math.floor(diff / 60000) + t("lottery.message.minutesAgo");
  } else if (diff < 86400000) {
    // 24小时内
    return Math.floor(diff / 3600000) + t("lottery.message.hoursAgo");
  } else {
    return (
      date.toLocaleDateString() + " " + date.toLocaleTimeString().slice(0, 5)
    );
  }
}

// 加载对话历史
async function loadMessages() {
  if (!currentUser || !props.targetUser.uid) return;

  loading.value = true;
  try {
    const response = await getConversationDetail(
      props.targetUser.uid,
      "user",
      1,
      50
    );

    if (response.data && response.data.messages) {
      messages.value = response.data.messages.reverse(); // 按时间正序显示

      // 标记消息为已读
      const unreadMessages = messages.value.filter(
        (msg) =>
          msg.messageStatus === "unread" && msg.senderUid !== currentUser?.uid
      );
      if (unreadMessages.length > 0) {
        const messageIds = unreadMessages.map((msg) => msg.id);
        await markMessagesAsRead(messageIds);
      }
    }
  } catch (error) {
    console.error("加载消息失败:", error);
  } finally {
    loading.value = false;
  }
}

// 发送消息
async function sendMessage() {
  if (
    !newMessage.value.trim() ||
    !currentUser ||
    !props.targetUser.uid ||
    sending.value
  )
    return;

  sending.value = true;
  const content = newMessage.value.trim();
  newMessage.value = "";

  try {
    await sendUserMessage({
      receiverUid: props.targetUser.uid,
      receiverNickname: props.targetUser.nickname,
      receiverAvatar: props.targetUser.avatar,
      content,
    });

    // 重新加载消息
    await loadMessages();

    // 滚动到底部
    await nextTick();
    scrollToBottom();
  } catch (error) {
    console.error("发送消息失败:", error);
    // 恢复输入内容
    newMessage.value = content;
  } finally {
    sending.value = false;
  }
}

// 滚动到底部
function scrollToBottom() {
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
  }
}

// 处理背景点击
function handleBackdropClick() {
  close();
}

// 关闭弹窗
function close() {
  emit("close");
}

// 监听弹窗显示状态
watch(
  () => props.visible,
  (newVisible) => {
    if (newVisible) {
      loadMessages();
    }
  }
);

onMounted(() => {
  if (props.visible) {
    loadMessages();
  }

  // 记录初始视口高度
  initialViewportHeight.value = window.innerHeight;

  // 添加键盘检测事件监听
  window.addEventListener("resize", handleResize);
  window.addEventListener("orientationchange", handleResize);
});

onUnmounted(() => {
  // 清理事件监听
  window.removeEventListener("resize", handleResize);
  window.removeEventListener("orientationchange", handleResize);
});
</script>

<style scoped>
/* 自定义滚动条 */
.messages-container::-webkit-scrollbar {
  width: 4px;
}

.messages-container::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 2px;
}

.messages-container::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 2px;
}

.messages-container::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

/* 确保输入框在暗夜模式下文字可见 */
input[type="text"] {
  color: #1f2937 !important;
  background-color: #ffffff !important;
}

input[type="text"]::placeholder {
  color: #6b7280 !important;
}

/* 防止弹窗穿透 */
.message-modal-overlay {
  position: fixed !important;
  top: 0 !important;
  left: 0 !important;
  right: 0 !important;
  bottom: 0 !important;
  z-index: 99999 !important;
  background-color: rgba(0, 0, 0, 0.5) !important;
}

.message-modal-content {
  position: relative !important;
  z-index: 100000 !important;
  background-color: white !important;
}

/* 移动端键盘适配 */
@media (max-width: 768px) {
  .message-modal-content {
    transition: all 0.3s ease;
  }

  .message-modal-content.keyboard-open {
    position: fixed !important;
    top: 1rem !important;
    left: 1rem !important;
    right: 1rem !important;
    bottom: auto !important;
    max-height: calc(100vh - 100px) !important;
    height: calc(100vh - 100px) !important;
  }
}
</style>
