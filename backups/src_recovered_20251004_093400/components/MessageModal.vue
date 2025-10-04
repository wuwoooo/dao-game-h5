<template>
  <div
    v-if="visible"
    class="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm"
    @click="handleBackdropClick"
  >
    <div
      class="relative bg-white rounded-xl shadow-2xl max-w-sm w-full mx-4 transform transition-all duration-300"
      :class="modalClasses"
      @click.stop
    >
      <!-- 图标 -->
      <div class="flex justify-center pt-6 pb-2">
        <div
          class="w-16 h-16 rounded-full flex items-center justify-center"
          :class="iconClasses"
        >
          <svg
            v-if="type === 'success'"
            class="w-8 h-8 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M5 13l4 4L19 7"
            />
          </svg>
          <svg
            v-else-if="type === 'error'"
            class="w-8 h-8 text-white"
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
          <svg
            v-else-if="type === 'warning'"
            class="w-8 h-8 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 18.5c-.77.833.192 2.5 1.732 2.5z"
            />
          </svg>
          <svg
            v-else
            class="w-8 h-8 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
      </div>

      <!-- 内容 -->
      <div class="px-6 pb-6 text-center">
        <h3 class="text-lg font-semibold text-gray-900 mb-2">
          {{ title }}
        </h3>
        <p class="text-gray-600 text-sm leading-relaxed">
          {{ message }}
        </p>
      </div>

      <!-- 按钮 -->
      <div class="px-6 pb-6">
        <button
          @click="handleConfirm"
          class="w-full py-3 px-4 rounded-lg font-medium transition-all duration-200"
          :class="buttonClasses"
        >
          {{ confirmText }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

interface Props {
  visible: boolean;
  type?: "success" | "error" | "warning" | "info";
  title?: string;
  message: string;
  confirmText?: string;
  closable?: boolean;
}

interface Emits {
  (e: "close"): void;
  (e: "confirm"): void;
}

const props = withDefaults(defineProps<Props>(), {
  type: "info",
  title: "",
  confirmText: "确定",
  closable: true,
});

const emit = defineEmits<Emits>();

// 计算样式类
const modalClasses = computed(() => {
  const baseClasses = "scale-100 opacity-100";
  return baseClasses;
});

const iconClasses = computed(() => {
  const classes = {
    success: "bg-green-500",
    error: "bg-red-500",
    warning: "bg-yellow-500",
    info: "bg-blue-500",
  };
  return classes[props.type];
});

const buttonClasses = computed(() => {
  const classes = {
    success: "bg-green-500 hover:bg-green-600 text-white",
    error: "bg-red-500 hover:bg-red-600 text-white",
    warning: "bg-yellow-500 hover:bg-yellow-600 text-white",
    info: "bg-blue-500 hover:bg-blue-600 text-white",
  };
  return classes[props.type];
});

// 处理确认按钮点击
function handleConfirm() {
  emit("confirm");
  emit("close");
}

// 处理背景点击
function handleBackdropClick() {
  if (props.closable) {
    emit("close");
  }
}
</script>
