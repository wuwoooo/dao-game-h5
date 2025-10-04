<template>
  <div
    class="min-h-screen bg-white relative overflow-hidden w-full max-w-full"
    :class="appTopOffsetClass"
  >
    <!-- 头部背景图片 -->
    <div
      class="relative h-48 overflow-hidden"
      :style="{
        backgroundImage: `url(${baseUrl}lotterylist_bg.png)`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }"
    >
      <img
        :src="`${baseUrl}lotterylist_top.png`"
        alt="抽奖活动顶部图"
        class="w-full h-full object-cover"
      />
    </div>

    <!-- 标题栏 -->
    <div
      class="bg-white px-4 py-3 flex justify-between items-center border-b border-gray-100 rounded-t-2xl -mt-2 relative z-10"
      style="margin-top: -2rem; background-color: #feedea"
    >
      <h1
        class="text-lg font-bold text-gray-900 flex items-center"
        style="height: 2rem; line-height: 2rem"
      >
        {{ t("lottery.lotteryList.title") }}
      </h1>
      <div class="flex items-center space-x-2">
        <button
          @click="goToPublishLottery"
          class="px-3 py-1.5 bg-white border border-orange-300 rounded-lg text-orange-600 text-xs whitespace-nowrap flex items-center hover:bg-orange-50 transition-colors"
          style="min-height: 2rem"
        >
          <svg
            class="w-4 h-4 mr-1"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
            />
          </svg>
          {{ t("lottery.lotteryList.publishBtn") }}
        </button>
        <button
          @click="goToMyLottery"
          class="px-3 py-1.5 bg-white border border-orange-300 rounded-lg text-orange-600 text-xs whitespace-nowrap flex items-center hover:bg-orange-50 transition-colors"
          style="min-height: 2rem"
        >
          <svg
            class="w-4 h-4 mr-1"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <path
              d="M16 4h2a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2h2"
            ></path>
            <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
            <path d="M12 11v6"></path>
            <path d="M9 14h6"></path>
          </svg>
          {{ t("lottery.lotteryList.myRecordBtn") }}
        </button>
      </div>
    </div>

    <!-- 主内容区 -->
    <main
      class="px-4 py-4 pb-8 z-10 relative"
      style="
        background: linear-gradient(to bottom, #feedea, #fafafa);
        min-height: calc(100vh - 12rem);
      "
    >
      <!-- 错误提示 -->
      <div
        v-if="error"
        class="mb-10 bg-red-50 border border-red-200 rounded-lg p-4 text-center"
      >
        <svg
          class="w-10 h-10 mx-auto mb-3 text-red-500"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1.5"
        >
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
        <p class="text-red-700 mb-1">{{ error }}</p>
        <button
          @click="retryFetch"
          class="mt-3 px-5 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-all"
        >
          {{ t("lottery.lotteryList.retry") }}
        </button>
      </div>

      <!-- 加载中 -->
      <div v-else-if="loading" class="flex justify-center py-24">
        <div class="cosmos-loader">
          <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
            <circle
              cx="30"
              cy="30"
              r="25"
              stroke="#3b82f6"
              stroke-width="2"
              stroke-dasharray="70,50"
              stroke-linecap="round"
            >
              <animateTransform
                attributeName="transform"
                type="rotate"
                from="0 30 30"
                to="360 30 30"
                dur="1.5s"
                repeatCount="indefinite"
              />
            </circle>
            <circle
              cx="30"
              cy="30"
              r="15"
              stroke="#60a5fa"
              stroke-width="2"
              stroke-dasharray="40,30"
              stroke-linecap="round"
            >
              <animateTransform
                attributeName="transform"
                type="rotate"
                from="360 30 30"
                to="0 30 30"
                dur="1.2s"
                repeatCount="indefinite"
              />
            </circle>
          </svg>
          <p class="text-gray-600 mt-4 animate-pulse">
            {{ t("lottery.lotteryList.loading") }}
          </p>
        </div>
      </div>

      <!-- 暂无活动 -->
      <div
        v-else-if="lotteryList.length === 0 && !loading"
        class="flex flex-col items-center justify-center py-24"
      >
        <div class="empty-state-illustration">
          <svg width="120" height="120" viewBox="0 0 24 24" fill="none">
            <path
              opacity="0.2"
              d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              fill="#3b82f6"
            />
            <path
              d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              stroke="#3b82f6"
              stroke-width="1.5"
            />
            <path
              d="M9 10h.01M15 10h.01M9.5 15a3.5 3.5 0 005.5 0"
              stroke="#3b82f6"
              stroke-width="1.5"
              stroke-linecap="round"
            />
          </svg>
        </div>
        <div class="text-2xl text-gray-700 mt-6 mb-2">
          {{ t("lottery.lotteryList.noActivity") }}
        </div>
        <p class="text-gray-500 mb-8">
          {{ t("lottery.lotteryList.noActivityDesc") }}
        </p>
        <button
          @click="retryFetch"
          class="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-all flex items-center"
        >
          <svg
            class="w-5 h-5 mr-2"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <path d="M23 4v6h-6" />
            <path d="M1 20v-6h6" />
            <path
              d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15"
            />
          </svg>
          {{ t("lottery.lotteryList.refresh") }}
        </button>
      </div>

      <!-- 活动卡片组 -->
      <div v-else class="relative">
        <div class="space-y-3">
          <router-link
            v-for="lottery in lotteryList"
            :key="lottery.id"
            :to="`/lottery/${lottery.id}`"
            class="block bg-white rounded-lg border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer"
          >
            <div class="flex p-3 items-start" style="min-height: 6rem">
              <!-- 活动图片 -->
              <div
                class="relative flex-shrink-0 overflow-hidden bg-gray-100 rounded-lg"
                style="
                  width: 9rem;
                  min-width: 9rem;
                  height: 6rem;
                  min-height: 6rem;
                "
              >
                <img
                  :src="getSafeImageUrl(lottery.background)"
                  alt="抽奖活动背景"
                  class="w-full h-full object-cover rounded-lg"
                />
                <!-- 抽奖形式标签 -->
                <div class="absolute top-2 left-2">
                  <span
                    class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
                    :class="
                      lottery.lotteryType === 'wheel'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-purple-100 text-purple-800'
                    "
                  >
                    {{
                      lottery.lotteryType === "wheel"
                        ? t("lottery.lotteryList.wheel")
                        : t("lottery.lotteryList.blindbox")
                    }}
                  </span>
                </div>
              </div>

              <!-- 活动信息 -->
              <div
                class="flex-1 ml-3 flex flex-col justify-between"
                style="height: 6rem; min-height: 6rem"
              >
                <div>
                  <h3
                    class="text-base font-semibold text-gray-900 mb-1 line-clamp-2 text-left leading-tight"
                  >
                    {{ lottery.name }}
                  </h3>

                  <!-- 时间信息 -->
                  <div class="flex items-center text-xs text-gray-600 mb-2">
                    <svg
                      class="w-3 h-3 mr-1.5 text-orange-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      stroke-width="2"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span class="font-medium text-gray-700">
                      {{ formatDateRange(lottery.startTime, lottery.endTime) }}
                    </span>
                  </div>

                  <p class="text-sm text-gray-500 mb-1 text-left">
                    {{ t("lottery.lotteryList.sponsor") }}:
                    {{ lottery.sponsor || "Aiskymeetup" }}
                  </p>
                </div>

                <div class="flex justify-start">
                  <div
                    class="px-6 py-1.5 bg-gradient-to-r from-orange-500 to-red-500 text-white text-sm hover:from-orange-600 hover:to-red-600 transition-all flex items-center font-medium shadow-sm"
                    style="height: 1.6rem; border-radius: 50px"
                  >
                    Open
                  </div>
                </div>
              </div>
            </div>
          </router-link>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed, inject } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useI18n } from "vue-i18n";
import { getLotteryList, clearTempToken } from "../../api/lottery";
import {
  getUserInfoFromCache,
  getQueryParams,
  saveUserInfo,
  clearUserInfo,
} from "../../utils/auth";
import { getUserInfo } from "../../api/user";
import { getAppTopOffsetClass } from "../../utils/app";
import message from "../../utils/message";
import { getCurrentLocale, convertLocaleForApi } from "../../utils/locale";

const { t } = useI18n();

const router = useRouter();
const route = useRoute();
const openLoginReminder = inject("openLoginReminder") as () => void;
const isLoggedIn = inject("isLoggedIn") as () => boolean;

const userInfo = ref(getUserInfoFromCache());
const lotteryList = ref<any[]>([]);
const loading = ref(true);
const error = ref("");

// App模式下的顶部偏移
const appTopOffsetClass = computed(() => getAppTopOffsetClass());

// 获取base URL
const baseUrl = import.meta.env.BASE_URL;

// 检查URL参数并获取用户信息
async function checkUrlParamsAndGetUserInfo() {
  const queryParams = getQueryParams();
  const { uid, uuid, token } = queryParams;

  // 检查是否接收到空值参数（uid=&uuid=&token=）
  const hasEmptyParams =
    (uid === "" || uuid === "" || token === "") &&
    (uid !== undefined || uuid !== undefined || token !== undefined);

  if (hasEmptyParams) {
    console.log("检测到空值参数，清除本地用户缓存...", { uid, uuid, token });
    clearUserInfo();
    userInfo.value = null;
    return;
  }

  // 如果URL中包含这三个参数，则清除现有缓存并执行自动登录
  if (uid && uuid && token) {
    try {
      console.log("检测到URL参数，清除现有缓存并执行自动登录...", {
        uid,
        uuid,
        token,
      });

      // 清除现有缓存
      clearUserInfo();
      console.log("已清除现有用户缓存");

      // 调用接口获取用户信息
      const response = await getUserInfo({ uid, uuid, token });

      if (
        response.data &&
        response.data.status === 200 &&
        response.data.attachment
      ) {
        const userData = response.data.attachment;
        console.log("获取用户信息成功:", userData);

        // 保存用户信息到本地缓存
        saveUserInfo({
          uuid: userData.uuid,
          token: token,
          uid: userData.uid,
          openName: userData.openName || "用户",
        });

        // 更新当前页面的用户信息
        userInfo.value = getUserInfoFromCache();

        // 强制更新页面状态，确保登录状态检查正确
        setTimeout(() => {
          // 触发响应式更新
          userInfo.value = getUserInfoFromCache();
        }, 100);

        console.log("用户信息已保存到本地缓存");
      } else {
        console.error("获取用户信息失败:", response.data);
      }
    } catch (error) {
      console.error("调用用户信息接口失败:", error);
    }
  }
}

// 处理help参数
function handleHelpParam() {
  const helpParam = route.query.help as string;
  if (helpParam) {
    console.log("检测到help参数:", helpParam);

    if (helpParam === "ok") {
      message.success("助力成功！", undefined, t);
    } else {
      message.info(helpParam, undefined, t);
    }

    // 清除URL中的help参数，避免刷新页面时重复显示
    const newQuery = { ...route.query };
    delete newQuery.help;
    router.replace({ query: newQuery });
  }
}

// 跳转到发布抽奖页面
function goToPublishLottery() {
  console.log("=== 点击发布抽奖按钮 ===");

  const currentUserInfo = getUserInfoFromCache();
  console.log("从缓存获取的用户信息:", currentUserInfo);

  if (!currentUserInfo || !currentUserInfo.uid) {
    console.log("用户未登录，无法跳转到发布抽奖页面");
    // 触发登录提醒
    openLoginReminder();
    return;
  }

  // 检查token是否存在，如果不存在则尝试从localStorage获取
  let token = currentUserInfo.token;
  if (!token) {
    console.log("缓存中没有token，尝试从localStorage获取");
    const localStorageToken = localStorage.getItem("token");
    token = localStorageToken || "";
    console.log("从localStorage获取的token:", token);
  }

  if (!token) {
    console.error("无法获取token，请重新登录");
    // 可以在这里触发登录弹窗
    return;
  }

  // 获取管理后台基础URL
  const adminBaseUrl = import.meta.env.VITE_Admin_BASE_URL;

  // 获取当前locale并转换为API格式
  const currentLocale = getCurrentLocale();
  const apiLocale = convertLocaleForApi(currentLocale);
  console.log("当前locale:", currentLocale, "API格式:", apiLocale);

  // 构建跳转URL，添加locale参数
  const publishUrl = `${adminBaseUrl}/mobile.html?uid=${currentUserInfo.uid}&uuid=${currentUserInfo.uuid}&token=${token}&locale=${apiLocale}#/lottery/mobile`;

  console.log("跳转到发布抽奖页面:", publishUrl);

  // 在当前页面内跳转
  window.location.href = publishUrl;
}

// 跳转到我的抽奖记录页面
function goToMyLottery() {
  console.log("=== 点击我的记录按钮 ===");
  console.log("当前用户信息:", userInfo.value);
  console.log("本地缓存用户信息:", getUserInfoFromCache());
  console.log("isLoggedIn() 结果:", isLoggedIn());

  router.push("/my-lottery");
}

// 截取地址显示
function truncateAddress(address?: string): string {
  if (!address) return "";
  if (address.length <= 10) return address;
  return address.substring(address.length - 6);
}

// 初始化数据
async function fetchLotteryList() {
  loading.value = true;
  error.value = "";

  try {
    const res = await getLotteryList();
    if (res.data && res.data.code === 0) {
      lotteryList.value = res.data.data || [];
    } else {
      throw new Error(res.data?.msg || "获取抽奖活动失败");
    }
  } catch (err: any) {
    console.error("获取抽奖活动列表失败:", err);

    // 处理临时token错误
    if (err.message.includes("临时授权")) {
      error.value = "无法获取临时授权，请刷新页面重试";
      clearTempToken(); // 清除可能失效的token
    } else {
      error.value = err.message || "网络错误，请稍后再试";
    }
  } finally {
    loading.value = false;
  }
}

// 重试获取数据
function retryFetch() {
  clearTempToken(); // 清除可能失效的token
  fetchLotteryList();
}

// 日期格式化
function formatDate(dateStr: string) {
  const date = new Date(dateStr);
  return `${date.getFullYear()}-${(date.getMonth() + 1)
    .toString()
    .padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`;
}

// 日期时间格式化（用于显示开始和结束时间）
function formatDateTime(dateStr: string) {
  if (!dateStr) return "未设置";
  const date = new Date(dateStr);
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  return `${month}-${day}`;
}

// 格式化日期范围显示
function formatDateRange(startTime: string, endTime: string) {
  if (!startTime || !endTime) return "时间待定";

  const startDate = new Date(startTime);
  const endDate = new Date(endTime);

  const startMonth = (startDate.getMonth() + 1).toString().padStart(2, "0");
  const startDay = startDate.getDate().toString().padStart(2, "0");
  const endMonth = (endDate.getMonth() + 1).toString().padStart(2, "0");
  const endDay = endDate.getDate().toString().padStart(2, "0");

  return `${startMonth}-${startDay}～${endMonth}-${endDay}`;

  // 如果是同一个月，只显示一次月份
  if (startMonth === endMonth) {
    return `${startMonth}-${startDay}～${endDay}`;
  } else {
    return `${startMonth}-${startDay}～${endMonth}-${endDay}`;
  }
}

// 随机图标（用于API没有返回图标时）
function randomIcon(id: number) {
  return `https://source.unsplash.com/random/100x100/?logo,emblem&${id}`;
}

// 检查URL是否有效
function isValidUrl(url: string): boolean {
  if (!url) return false;

  try {
    const urlObj = new URL(url);
    // 检查协议是否为http或https
    return urlObj.protocol === "http:" || urlObj.protocol === "https:";
  } catch {
    return false;
  }
}

// 获取安全的图片URL
function getSafeImageUrl(url: string | null | undefined): string {
  if (!url || !isValidUrl(url)) {
    return "https://img.aisky.io/api/aQAdzWGNitaaleNn.png";
  }
  return url;
}

onMounted(async () => {
  // 首先检查URL参数并获取用户信息
  await checkUrlParamsAndGetUserInfo();

  // 处理help参数
  handleHelpParam();

  // 然后获取抽奖列表
  fetchLotteryList();
});
</script>

<style scoped>
.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.cosmos-loader {
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* 动画效果 */
@keyframes bounce {
  0%,
  20%,
  53%,
  80%,
  100% {
    animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
    transform: translate3d(0, 0, 0);
  }
  40%,
  43% {
    animation-timing-function: cubic-bezier(0.755, 0.05, 0.855, 0.06);
    transform: translate3d(0, -8px, 0);
  }
  70% {
    animation-timing-function: cubic-bezier(0.755, 0.05, 0.855, 0.06);
    transform: translate3d(0, -4px, 0);
  }
  90% {
    transform: translate3d(0, -2px, 0);
  }
}

.animate-bounce {
  animation: bounce 2s infinite;
}
</style>
