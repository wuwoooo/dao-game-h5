<template>
  <div
    class="help-assist min-h-screen bg-gradient-to-b from-[#0f172a] via-[#1e293b] to-[#334155] relative overflow-hidden w-full max-w-full"
    :class="appTopOffsetClass"
  >
    <!-- 宇宙星空背景 -->
    <div class="stars-container absolute inset-0 z-0 overflow-hidden">
      <div
        v-for="i in 50"
        :key="`star-${i}`"
        class="star absolute rounded-full"
        :style="{
          width: `${Math.random() * 3 + 1}px`,
          height: `${Math.random() * 3 + 1}px`,
          top: `${Math.random() * 100}%`,
          left: `${Math.random() * 100}%`,
          animationDelay: `${Math.random() * 10}s`,
          animationDuration: `${Math.random() * 10 + 10}s`,
        }"
      ></div>
    </div>

    <!-- 顶部导航 -->
    <header
      class="sticky top-0 z-30 backdrop-blur-md bg-[#0f172a]/70 border-b border-indigo-500/20 w-full"
    >
      <div
        class="max-w-7xl mx-auto px-2 sm:px-4 py-4 flex justify-between items-center"
      >
        <div class="flex items-center">
          <div
            @click="$router.back()"
            class="text-indigo-300 mr-3 hover:text-indigo-200 transition-colors flex items-center cursor-pointer"
          >
            <svg
              class="w-5 h-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
          </div>
          <h1
            class="text-lg sm:text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-300 to-indigo-300"
          >
            {{ t("lottery.helpAssist.title") }}
          </h1>
        </div>
        <div class="flex items-center space-x-3">
          <button
            v-if="!isLoggedIn()"
            @click="openLoginReminder"
            class="px-4 py-2 bg-gradient-to-r from-purple-500/20 to-indigo-500/20 backdrop-blur-sm rounded-lg text-indigo-100 hover:from-purple-500/30 hover:to-indigo-500/30 transition-all border border-indigo-400/20 flex items-center"
          >
            <svg
              class="w-4 h-4 mr-1"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <path d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4"></path>
              <polyline points="10 17 15 12 10 7"></polyline>
              <line x1="15" y1="12" x2="3" y2="12"></line>
            </svg>
            连接钱包
          </button>
        </div>
      </div>
    </header>

    <!-- 错误提示 -->
    <div
      v-if="error"
      class="max-w-7xl mx-auto px-2 sm:px-4 py-24 z-10 relative"
    >
      <div
        class="bg-red-900/20 backdrop-blur-sm border border-red-500/20 rounded-lg p-6 text-center max-w-md mx-auto"
      >
        <svg
          class="w-16 h-16 mx-auto mb-4 text-red-400"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1.5"
        >
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
        <h2 class="text-xl font-bold text-red-200 mb-2">
          {{ t("lottery.helpAssist.assistFailed") }}
        </h2>
        <p class="text-red-300 mb-4">{{ error }}</p>
        <div class="flex justify-center space-x-4">
          <button
            @click="retryFetch"
            class="px-5 py-2 bg-red-600/30 hover:bg-red-600/50 text-red-100 rounded-lg transition-all flex items-center"
          >
            <svg
              class="w-4 h-4 mr-2"
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
            {{ t("lottery.helpAssist.retry") }}
          </button>
          <router-link
            to="/lottery"
            class="px-5 py-2 bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-100 rounded-lg transition-all flex items-center"
          >
            <svg
              class="w-4 h-4 mr-2"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
            {{ t("lottery.helpAssist.backToList") }}
          </router-link>
        </div>
      </div>
    </div>

    <!-- 加载中 -->
    <div
      v-else-if="loading"
      class="flex justify-center items-center min-h-[70vh] z-10 relative"
    >
      <div class="cosmos-loader text-center">
        <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
          <circle
            cx="40"
            cy="40"
            r="32"
            stroke="#8b5cf6"
            stroke-width="2"
            stroke-dasharray="80,60"
            stroke-linecap="round"
          >
            <animateTransform
              attributeName="transform"
              type="rotate"
              from="0 40 40"
              to="360 40 40"
              dur="1.5s"
              repeatCount="indefinite"
            />
          </circle>
          <circle
            cx="40"
            cy="40"
            r="20"
            stroke="#a78bfa"
            stroke-width="2"
            stroke-dasharray="50,40"
            stroke-linecap="round"
          >
            <animateTransform
              attributeName="transform"
              type="rotate"
              from="360 40 40"
              to="0 40 40"
              dur="1.2s"
              repeatCount="indefinite"
            />
          </circle>
        </svg>
        <p class="text-indigo-300 mt-4 animate-pulse">
          {{ t("lottery.helpAssist.loading") }}
        </p>
      </div>
    </div>

    <!-- 助力成功 -->
    <div
      v-else-if="assistSuccess"
      class="max-w-7xl mx-auto px-2 sm:px-4 py-24 z-10 relative"
    >
      <div
        class="max-w-md mx-auto bg-gradient-to-br from-green-900/30 to-blue-900/30 backdrop-blur-sm p-8 rounded-xl text-center border border-green-500/20"
      >
        <div
          class="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center animate-bounce"
        >
          <svg
            class="w-12 h-12 text-white"
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
        </div>
        <h2 class="text-3xl font-bold text-white mb-4">
          {{ t("lottery.helpAssist.assistSuccess") }}
        </h2>
        <p class="text-green-200 mb-6">
          {{ t("lottery.helpAssist.assistSuccessDesc") }}
        </p>

        <div class="bg-white/10 rounded-lg p-4 mb-6 border border-white/20">
          <div class="text-white font-medium mb-2">
            {{ t("lottery.helpAssist.assistDetails") }}
          </div>
          <div class="text-sm text-green-200 space-y-1">
            <div>
              {{ t("lottery.helpAssist.inviter") }}:
              {{ inviteDetail?.inviterUid || "未知" }}
            </div>
            <div>
              {{ t("lottery.helpAssist.lotteryActivity") }}:
              {{ inviteDetail?.lotteryName || "未知活动" }}
            </div>
            <div>
              {{ t("lottery.helpAssist.assistTime") }}:
              {{ formatDate(new Date().toISOString()) }}
            </div>
          </div>
        </div>

        <div class="flex justify-center space-x-4">
          <router-link
            :to="`/lottery/${inviteDetail?.lotteryId}`"
            class="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all"
          >
            {{ t("lottery.helpAssist.participateLottery") }}
          </router-link>
          <router-link
            to="/lottery"
            class="px-6 py-3 bg-gray-600/50 hover:bg-gray-600/70 text-white rounded-lg transition-all"
          >
            {{ t("lottery.helpAssist.browseActivities") }}
          </router-link>
        </div>
      </div>
    </div>

    <!-- 助力邀请详情 -->
    <div
      v-else-if="inviteDetail"
      class="max-w-7xl mx-auto px-2 sm:px-4 py-8 z-10 relative"
    >
      <!-- 邀请详情头部 -->
      <div class="relative mb-10 overflow-hidden rounded-xl">
        <div
          class="absolute inset-0"
          :style="{
            backgroundImage: `url(https://source.unsplash.com/random/800x400/?crypto,nft)`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'blur(6px)',
            transform: 'scale(1.1)',
            zIndex: 0,
          }"
        ></div>
        <div class="absolute inset-0 bg-black/40 z-[1]"></div>
        <div
          class="relative z-[2] p-6 md:p-8 flex flex-col md:flex-row items-center backdrop-blur-md bg-white/10 border border-white/20 rounded-xl shadow-lg ring-1 ring-white/10"
        >
          <div
            class="w-24 h-24 md:w-32 md:h-32 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mb-4 md:mb-0 md:mr-6"
          >
            <svg
              class="w-16 h-16 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
          </div>

          <div class="flex-1 text-center md:text-left text-white">
            <h1 class="text-3xl md:text-4xl font-bold mb-2">
              {{ t("lottery.helpAssist.inviteTitle") }}
            </h1>
            <div
              class="mb-2 flex flex-wrap justify-center md:justify-start gap-2"
            >
              <span class="text-xs px-3 py-1 rounded-full bg-indigo-600">
                {{ t("lottery.helpAssist.inviteCode") }}:
                {{ inviteDetail.inviteCode }}
              </span>
              <span class="text-xs px-3 py-1 rounded-full bg-purple-600">
                {{ t("lottery.helpAssist.assistProgress") }}:
                {{ inviteDetail.helpCount }}/{{ inviteDetail.maxHelpCount }}
              </span>
            </div>
            <p class="opacity-80 mb-4">
              {{ t("lottery.helpAssist.inviteDesc") }}
            </p>
            <div class="opacity-60 text-sm">
              <div>
                {{ t("lottery.helpAssist.inviter") }}:
                {{ inviteDetail.inviterUid }}
              </div>
              <div>
                {{ t("lottery.helpAssist.validPeriod") }}:
                <span class="text-green-400 font-medium">{{
                  t("lottery.helpAssist.neverExpire")
                }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 助力操作区域 -->
      <div class="max-w-lg mx-auto">
        <div
          class="text-center p-8 bg-gradient-to-r from-green-900/30 to-blue-900/30 rounded-xl border border-green-500/20"
        >
          <div
            class="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center animate-pulse"
          >
            <svg
              class="w-10 h-10 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
          </div>

          <h3 class="text-2xl font-bold text-white mb-4">
            {{ t("lottery.helpAssist.assistTitle") }}
          </h3>
          <p class="text-green-200 mb-6">
            {{ t("lottery.helpAssist.assistDesc") }}
          </p>

          <div class="bg-white/10 rounded-lg p-4 mb-6 border border-white/20">
            <div class="text-white font-medium mb-2">
              {{ t("lottery.helpAssist.assistRewards") }}
            </div>
            <div class="text-sm text-green-200 space-y-1">
              <div>
                •
                {{
                  t("lottery.helpAssist.rewardsList.extraDraw", { count: 1 })
                }}
              </div>
              <div>• {{ t("lottery.helpAssist.rewardsList.permanent") }}</div>
              <div>• {{ t("lottery.helpAssist.rewardsList.participate") }}</div>
            </div>
          </div>

          <button
            @click="performAssist"
            :disabled="assisting || !canAssist"
            class="w-full py-4 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-lg hover:from-green-700 hover:to-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-xl font-bold flex items-center justify-center"
          >
            <svg
              v-if="assisting"
              class="w-6 h-6 mr-2 animate-spin"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                class="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                stroke-width="4"
              ></circle>
              <path
                class="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            {{
              assisting
                ? t("lottery.helpAssist.assisting")
                : canAssist
                ? t("lottery.helpAssist.assist")
                : t("lottery.helpAssist.cannotAssist")
            }}
          </button>

          <div v-if="!canAssist" class="mt-4 text-sm text-red-300">
            {{ assistDisabledReason }}
          </div>
        </div>
      </div>

      <!-- 助力说明 -->
      <div class="max-w-2xl mx-auto mt-10">
        <div
          class="bg-indigo-900/20 rounded-xl p-6 border border-indigo-500/20"
        >
          <h4 class="text-white font-medium mb-4 text-lg">
            {{ t("lottery.helpAssist.rulesTitle") }}
          </h4>
          <ul class="text-indigo-300 text-sm space-y-2">
            <!--li class="flex items-start">
              <span
                class="w-2 h-2 bg-indigo-400 rounded-full mt-2 mr-3 flex-shrink-0"
              ></span>
              每个邀请最多可获得
              {{ helpConfig?.helpLimit || inviteDetail.maxHelpCount || 5 }}
              次助力
            </li-->
            <li class="flex items-start">
              <span
                class="w-2 h-2 bg-indigo-400 rounded-full mt-2 mr-3 flex-shrink-0"
              ></span>
              每次助力可获得
              {{ helpConfig?.helpRewardDraws || 1 }} 次额外抽奖机会
            </li>
            <li class="flex items-start">
              <span
                class="w-2 h-2 bg-indigo-400 rounded-full mt-2 mr-3 flex-shrink-0"
              ></span>
              助力邀请有效期为 {{ helpConfig?.helpExpireHours || 24 }} 小时
            </li>
            <li class="flex items-start">
              <span
                class="w-2 h-2 bg-indigo-400 rounded-full mt-2 mr-3 flex-shrink-0"
              ></span>
              助力抽奖次数上限为 {{ helpConfig?.helpDrawsLimit || 10 }} 次
            </li>
            <li class="flex items-start">
              <span
                class="w-2 h-2 bg-indigo-400 rounded-full mt-2 mr-3 flex-shrink-0"
              ></span>
              同一IP和设备在短时间内只能助力有限次数
            </li>
            <li class="flex items-start">
              <span
                class="w-2 h-2 bg-indigo-400 rounded-full mt-2 mr-3 flex-shrink-0"
              ></span>
              助力成功后，邀请人将立即获得额外抽奖次数
            </li>
          </ul>
          <div
            v-if="helpConfig?.helpRuleDesc"
            class="mt-4 p-3 bg-indigo-800/30 rounded text-indigo-200 text-xs"
          >
            {{ helpConfig.helpRuleDesc }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, inject } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import {
  getHelpInviteDetail,
  assistLottery,
  getHelpConfig,
} from "../../api/lottery";
import { getUserInfoFromCache } from "../../utils/auth";
import { getAppTopOffsetClass } from "../../utils/app";
import message from "../../utils/message";

const { t } = useI18n();
const route = useRoute();
const router = useRouter();
const openLoginReminder = inject("openLoginReminder") as () => void;
const isLoggedIn = inject("isLoggedIn") as () => boolean;

const inviteCode = ref("");
const inviteDetail = ref<any>(null);
const helpConfig = ref<any>(null);
const loading = ref(true);
const error = ref("");
const assisting = ref(false);
const assistSuccess = ref(false);

// App模式下的顶部偏移
const appTopOffsetClass = computed(() => getAppTopOffsetClass());

// 计算是否可以助力
const canAssist = computed(() => {
  if (!inviteDetail.value) return false;
  if (inviteDetail.value.status !== "active") return false;
  if (inviteDetail.value.helpCount >= inviteDetail.value.maxHelpCount)
    return false;

  // 助力邀请{{ t("lottery.helpAssist.neverExpire") }}，移除过期检查
  // const now = new Date();
  // const expireTime = new Date(inviteDetail.value.expireTime);
  // if (now > expireTime) return false;

  return true;
});

// 助力被禁用的原因
const assistDisabledReason = computed(() => {
  if (!inviteDetail.value) return "";

  if (inviteDetail.value.status !== "active") {
    return t("lottery.helpAssist.inviteInvalid");
  }

  if (inviteDetail.value.helpCount >= inviteDetail.value.maxHelpCount) {
    return t("lottery.helpAssist.limitReached");
  }

  // 助力邀请永不过期，移除过期检查
  // const now = new Date();
  // const expireTime = new Date(inviteDetail.value.expireTime);
  // if (now > expireTime) {
  //   return "邀请已过期";
  // }

  return "";
});

// 获取邀请详情
async function fetchInviteDetail() {
  loading.value = true;
  error.value = "";

  try {
    const code = route.params.code as string;
    if (!code) {
      error.value = "邀请码无效";
      return;
    }

    inviteCode.value = code;
    const res = await getHelpInviteDetail(code);

    if (res.data && res.data.code === 0) {
      inviteDetail.value = res.data.data;

      // 获取助力配置
      if (inviteDetail.value?.lotteryId) {
        try {
          const configRes = await getHelpConfig(inviteDetail.value.lotteryId);
          if (configRes.data?.code === 0) {
            helpConfig.value = configRes.data.data;
          }
        } catch (configError) {
          console.error("获取助力配置失败:", configError);
        }
      }
    } else {
      throw new Error(res.data?.msg || "获取邀请详情失败");
    }
  } catch (err: any) {
    console.error("获取邀请详情失败:", err);
    error.value = err.message || "网络错误，请稍后再试";
  } finally {
    loading.value = false;
  }
}

// 执行助力操作
async function performAssist() {
  if (assisting.value || !canAssist.value) return;

  if (!isLoggedIn()) {
    openLoginReminder();
    return;
  }

  assisting.value = true;
  try {
    const userInfo = getUserInfoFromCache();
    if (!userInfo?.uid) {
      message.error("请先登录", undefined, t);
      return;
    }

    const res = await assistLottery(inviteCode.value, userInfo.uid);

    if (res.data && res.data.code === 0) {
      assistSuccess.value = true;
      // 播放成功音效
      const audio = new Audio();
      audio.src =
        "https://assets.mixkit.co/sfx/preview/mixkit-winning-chimes-2015.mp3";
      audio.volume = 0.6;
      audio.play();
    } else {
      throw new Error(res.data?.msg || "助力失败");
    }
  } catch (error: any) {
    console.error("助力失败:", error);
    message.error(error.message || "网络错误，请稍后再试", undefined, t);
  } finally {
    assisting.value = false;
  }
}

// 重试获取数据
function retryFetch() {
  fetchInviteDetail();
}

// 格式化日期
function formatDate(dateStr: string) {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  return `${date.getFullYear()}-${(date.getMonth() + 1)
    .toString()
    .padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")} ${date
    .getHours()
    .toString()
    .padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}`;
}

onMounted(() => {
  fetchInviteDetail();
});
</script>

<style scoped>
/* 星空背景动画 */
.stars-container {
  background: radial-gradient(ellipse at bottom, #1b2735 0%, #090a0f 100%);
}

.star {
  background: white;
  animation: twinkle linear infinite;
}

@keyframes twinkle {
  0% {
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}

.cosmos-loader {
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* 助力成功动画 */
@keyframes bounce {
  0%,
  20%,
  53%,
  80%,
  100% {
    transform: translate3d(0, 0, 0);
  }
  40%,
  43% {
    transform: translate3d(0, -30px, 0);
  }
  70% {
    transform: translate3d(0, -15px, 0);
  }
  90% {
    transform: translate3d(0, -4px, 0);
  }
}

.animate-bounce {
  animation: bounce 1s infinite;
}
</style>
