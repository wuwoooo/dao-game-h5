<template>
  <div
    v-if="visible"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm"
    @click="handleOverlayClick"
  >
    <div
      class="bg-white rounded-xl w-full max-w-sm mx-4 transform transition-all duration-300 ease-out shadow-lg"
      :class="
        visible ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
      "
      @click.stop
    >
      <!-- 弹窗内容 -->
      <div class="p-6">
        <!-- 标题 -->
        <h3 class="text-lg font-semibold text-gray-900 text-center mb-4">
          温馨提示
        </h3>

        <!-- 消息内容 -->
        <p class="text-gray-600 text-center mb-8 leading-relaxed">
          {{ props.message || "欢迎使用Aisky meetup, 请登录系统" }}
        </p>

        <!-- 按钮组 -->
        <div class="flex" :class="{ 'justify-center': props.isHelpMode }">
          <!-- 取消按钮 - 只在非助力模式下显示 -->
          <button
            v-if="!props.isHelpMode"
            @click="handleCancel"
            class="flex-1 py-3 px-4 text-gray-600 font-medium rounded-lg border border-gray-300 bg-white hover:bg-gray-50 transition-colors"
          >
            取消
          </button>

          <!-- 分割线 - 只在非助力模式下显示 -->
          <div v-if="!props.isHelpMode" class="w-px bg-gray-200 mx-1"></div>

          <!-- 前往登录/助力按钮 -->
          <button
            @click="handleGoToLogin"
            :class="props.isHelpMode ? 'w-full' : 'flex-1'"
            class="py-3 px-4 text-blue-600 font-medium rounded-lg hover:bg-blue-50 transition-colors bg-transparent"
          >
            {{ props.isHelpMode ? "前往助力" : "前往登录" }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  visible: boolean;
  message?: string;
  isHelpMode?: boolean; // 是否为助力模式
}

interface Emits {
  (e: "close"): void;
  (e: "goToLogin"): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

// 处理遮罩层点击
function handleOverlayClick() {
  emit("close");
}

// 处理取消按钮点击
function handleCancel() {
  emit("close");
}

// 处理前往登录按钮点击
function handleGoToLogin() {
  // 判断当前环境
  const isDevelopment = import.meta.env.DEV;

  if (isDevelopment) {
    // 开发环境：关闭当前弹窗，触发原有的登录弹窗
    console.log("开发环境：触发原有登录弹窗");
    emit("close");
    // 触发全局事件打开原有登录弹窗
    window.dispatchEvent(new CustomEvent("open-login-modal"));
    emit("goToLogin");
  } else {
    // 生产环境：使用uni.navigateTo跳转
    try {
      if (typeof uni !== "undefined" && uni.navigateTo) {
        uni.navigateTo({
          url: "/pages/user/login/index",
        });
      } else {
        console.warn("uni.navigateTo 不可用，请确保已正确引入 uni.webview.js");
        // 降级处理：可以打开新窗口或显示提示
        window.open("/pages/user/login/index", "_blank");
      }
      emit("goToLogin");
    } catch (error) {
      console.error("跳转到登录页失败:", error);
      // 降级处理
      window.open("/pages/user/login/index", "_blank");
      emit("goToLogin");
    }
  }
}
</script>

<style scoped>
/* 确保弹窗动画流畅 */
.transform {
  transform: translateZ(0);
}

/* 按钮悬停效果 */
button:hover {
  transform: translateY(-1px);
}

button:active {
  transform: translateY(0);
}
</style>
