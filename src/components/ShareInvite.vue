<template>
  <div class="share-invite">
    <div
      class="bg-gradient-to-r from-green-900/30 to-blue-900/30 rounded-lg border border-green-500/20 p-4"
    >
      <h4 class="text-white font-medium mb-3">分享邀请</h4>

      <div class="space-y-3 mb-4">
        <div class="flex items-center justify-between">
          <span class="text-indigo-300 text-sm">邀请码:</span>
          <div class="flex items-center space-x-2">
            <code
              class="px-3 py-1 bg-indigo-900/50 text-indigo-200 text-sm rounded font-mono"
            >
              {{ inviteCode }}
            </code>
            <button
              @click="copyCode"
              class="px-2 py-1 bg-indigo-600/50 hover:bg-indigo-600/70 text-indigo-200 text-xs rounded transition-all"
            >
              复制
            </button>
          </div>
        </div>

        <div class="flex items-center justify-between">
          <span class="text-indigo-300 text-sm">邀请链接:</span>
          <div class="flex items-center space-x-2">
            <input
              :value="inviteUrl"
              readonly
              class="px-3 py-1 bg-indigo-900/50 text-indigo-200 text-sm rounded flex-1 min-w-0 max-w-48"
            />
            <button
              @click="copyUrl"
              class="px-2 py-1 bg-indigo-600/50 hover:bg-indigo-600/70 text-indigo-200 text-xs rounded transition-all"
            >
              复制
            </button>
          </div>
        </div>
      </div>

      <div class="flex space-x-3">
        <button
          @click="share"
          class="flex-1 py-2 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-lg hover:from-green-700 hover:to-blue-700 transition-all flex items-center justify-center"
        >
          <svg
            class="w-4 h-4 mr-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"
            />
          </svg>
          分享邀请
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import message from "../utils/message";

const props = defineProps<{
  inviteCode: string;
  inviteUrl: string;
}>();

function copyCode() {
  navigator.clipboard.writeText(props.inviteCode);
  message.success("邀请码已复制到剪贴板");
}

function copyUrl() {
  navigator.clipboard.writeText(props.inviteUrl);
  message.success("邀请链接已复制到剪贴板");
}

function share() {
  if (navigator.share) {
    navigator.share({
      title: "邀请您助力抽奖",
      text: "点击链接为我助力，获得额外抽奖机会！",
      url: props.inviteUrl,
    });
  } else {
    copyUrl();
  }
}
</script>
