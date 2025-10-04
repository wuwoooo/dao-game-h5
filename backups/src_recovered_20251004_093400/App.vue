<script setup lang="ts">
import { ref, onMounted, provide, onUnmounted } from "vue";
import { useRouter } from "vue-router";
import { getUserInfo as getUserInfoApi } from "./api/user";
import LoginReminder from "./components/LoginReminder.vue";
import LoginModal from "./components/LoginModal.vue";
import { getQueryParams } from "./utils/auth";
import message from "./utils/message";
import {
  saveUserInfo,
  getUserInfoFromCache,
  clearUserInfo,
} from "./utils/auth";

const router = useRouter();
const showLoginReminder = ref(false);
const loginReminderMessage = ref("");
const isHelpMode = ref(false);
const showLoginModal = ref(false);
const userInfo = ref<any>(null);

// 提供给子组件的方法
provide("openLoginReminder", (message?: string, helpMode?: boolean) => {
  if (message) {
    loginReminderMessage.value = message;
  } else {
    loginReminderMessage.value = "";
  }
  isHelpMode.value = helpMode || false;
  showLoginReminder.value = true;
});
provide("closeLoginReminder", () => {
  showLoginReminder.value = false;
});
provide("openLoginModal", () => {
  showLoginModal.value = true;
});
provide("closeLoginModal", () => {
  showLoginModal.value = false;
});
provide("isLoggedIn", () => checkLogin());
provide("userInfo", userInfo);
provide("logout", logout);

function logout() {
  clearUserInfo();
  userInfo.value = null;
  // 如果当前页面需要登录，则重定向到首页
  if (router.currentRoute.value.meta.requiresAuth) {
    router.push("/");
  }
}

function checkLogin() {
  // 首先检查缓存中的用户信息
  const cachedUserInfo = getUserInfoFromCache();
  console.log("=== App checkLogin 执行 ===");
  console.log("App - 缓存用户信息:", cachedUserInfo);

  if (
    cachedUserInfo &&
    cachedUserInfo.token &&
    cachedUserInfo.uuid &&
    cachedUserInfo.uid
  ) {
    console.log("App - 通过缓存检查登录状态: true");
    return true;
  }

  // 如果没有缓存，检查单独的localStorage字段
  const token = localStorage.getItem("token");
  const uuid = localStorage.getItem("uuid");
  const uid = localStorage.getItem("uid");
  console.log("App - localStorage字段:", {
    token: !!token,
    uuid: !!uuid,
    uid: !!uid,
  });

  if (!token || !uuid || !uid) {
    console.log("App - 通过localStorage检查登录状态: false");
    return false;
  }
  console.log("App - 通过localStorage检查登录状态: true");
  return true;
}

async function getUserInfo() {
  try {
    const token = localStorage.getItem("token");
    const uuid = localStorage.getItem("uuid");
    const uid = localStorage.getItem("uid");

    console.log("App - getUserInfo 开始，参数:", {
      token: !!token,
      uuid: !!uuid,
      uid: !!uid,
    });

    if (!token || !uuid || !uid) {
      console.log("App - getUserInfo 缺少必要参数，退出");
      return;
    }

    const res = await getUserInfoApi({ token, uuid, uid });
    console.log("App - getUserInfo API响应:", res.data);

    if (res.data && res.data.status === 200 && res.data.attachment) {
      userInfo.value = res.data.attachment;
      console.log("App - 保存用户信息到缓存:", userInfo.value);
      console.log("App - openName 字段:", userInfo.value.openName);
      console.log("App - 所有用户字段:", Object.keys(userInfo.value));
      saveUserInfo({
        uuid: userInfo.value.uuid,
        token: token, // 使用从localStorage读取的token，而不是API返回的
        uid: userInfo.value.uid,
        openName: userInfo.value.openName,
      });

      console.log("App - 准备刷新页面");
      // 刷新页面
      window.location.reload();
    } else {
      console.error("获取用户信息失败:", res.data?.message || "未知错误");
      //此时表明token已过期，需要重新登录
      clearUserInfo();
      // 添加错误提示
      message.error("获取用户信息失败，请重新登录");
    }
  } catch (e: any) {
    console.error("获取用户信息失败:", e?.response?.data?.message || e);
    //此时表明token已过期，需要重新登录
    clearUserInfo();
    // 添加错误提示
    message.error("获取用户信息失败，请重新登录");
  }
}

// 打开登录提醒的处理函数
const handleOpenLoginReminder = () => {
  showLoginReminder.value = true;
};

onMounted(async () => {
  userInfo.value = getUserInfoFromCache();

  if (!userInfo.value) {
    if (checkLogin()) {
      await getUserInfo();
    }
  }

  // 监听全局事件，打开登录提醒
  window.addEventListener("open-login-reminder", handleOpenLoginReminder);
  // 监听全局事件，打开登录弹窗（开发环境使用）
  window.addEventListener("open-login-modal", () => {
    showLoginModal.value = true;
  });
});

onUnmounted(() => {
  // 清理事件监听
  window.removeEventListener("open-login-reminder", handleOpenLoginReminder);
  window.removeEventListener("open-login-modal", () => {
    showLoginModal.value = true;
  });
});

function handleLoginSuccess(data: {
  token: string;
  uuid: string;
  uid: string;
}) {
  console.log("App - 登录成功，保存数据:", data);
  localStorage.setItem("token", data.token);
  localStorage.setItem("uuid", data.uuid);
  localStorage.setItem("uid", data.uid);
  showLoginReminder.value = false;
  console.log("App - 调用getUserInfo获取完整用户信息");
  getUserInfo();

  // 触发全局登录成功事件，通知其他组件
  window.dispatchEvent(
    new CustomEvent("login-success", {
      detail: { token: data.token, uuid: data.uuid, uid: data.uid },
    })
  );
}

// 处理前往登录
function handleGoToLogin() {
  showLoginReminder.value = false;
  console.log("用户选择前往登录");
}
</script>

<template>
  <div class="min-h-screen bg-slate-100 w-full max-w-full overflow-x-hidden">
    <!-- 全局登录提醒 -->
    <LoginReminder
      :visible="showLoginReminder"
      :message="loginReminderMessage"
      :isHelpMode="isHelpMode"
      @close="showLoginReminder = false"
      @goToLogin="handleGoToLogin"
    />

    <!-- 全局登录弹窗（开发环境使用） -->
    <LoginModal
      :visible="showLoginModal"
      @close="showLoginModal = false"
      @success="handleLoginSuccess"
    />

    <router-view v-slot="{ Component }">
      <transition name="fade" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>
  </div>
</template>

<style>
/* 页面切换动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
