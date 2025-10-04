<template>
  <div
    class="help-invite bg-white/5 backdrop-blur-sm rounded-xl p-6 mb-8 border border-indigo-500/20"
  >
    <div class="flex items-center justify-between mb-6">
      <h3 class="text-xl font-bold text-white flex items-center">
        <svg
          class="w-5 h-5 mr-2 text-indigo-400"
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
        {{ t("lottery.components.helpInvite.title") }}
        <div class="flex items-center space-x-2 ml-2">
          <button
            @click="showHelpRules = true"
            class="w-7 h-7 bg-indigo-500/30 hover:bg-indigo-500/50 rounded-full flex items-center justify-center text-indigo-200 hover:text-white transition-all cursor-pointer"
            :title="t('lottery.components.helpInvite.rulesTooltip')"
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
                d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </button>
          <button
            @click="refreshHelpData"
            :disabled="refreshing"
            class="w-7 h-7 bg-indigo-500/30 hover:bg-indigo-500/50 rounded-full flex items-center justify-center text-indigo-200 hover:text-white transition-all cursor-pointer disabled:opacity-50"
            :title="t('lottery.components.helpInvite.refreshTooltip')"
          >
            <svg
              v-if="refreshing"
              class="w-4 h-4 animate-spin"
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
            <svg
              v-else
              class="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
          </button>
        </div>
      </h3>
    </div>

    <!-- 助力统计 -->
    <div v-if="helpStats" class="mb-6">
      <div class="grid grid-cols-3 gap-4">
        <div class="text-center">
          <div class="text-2xl font-bold text-yellow-400">
            {{ helpStats.totalHelpDraws || 0 }}
          </div>
          <div class="text-xs text-indigo-300">
            {{ t("lottery.components.helpInvite.totalAssists") }}
          </div>
        </div>
        <div class="text-center">
          <div class="text-2xl font-bold text-purple-400">
            {{ helpStats.usedHelpDraws || 0 }}
          </div>
          <div class="text-xs text-indigo-300">
            {{ t("lottery.components.helpInvite.usedAssists") }}
          </div>
        </div>
        <div class="text-center">
          <div class="text-2xl font-bold text-green-400">
            {{ (myInvite?.maxHelpCount || 0) - (myInvite?.helpCount || 0) }}
          </div>
          <div class="text-xs text-indigo-300">
            {{ t("lottery.components.helpInvite.availableAssists") }}
          </div>
        </div>
      </div>
    </div>

    <!-- 自动创建提示 -->
    <div v-if="!myInvite && autoCreating" class="mb-6">
      <div
        class="text-center p-4 bg-gradient-to-r from-blue-900/30 to-indigo-900/30 rounded-lg border border-blue-500/20"
      >
        <div class="flex items-center justify-center mb-2">
          <svg
            class="w-5 h-5 mr-2 text-blue-400 animate-spin"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
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
          <span class="text-blue-300 text-sm">正在自动创建助力邀请...</span>
        </div>
      </div>
    </div>

    <!-- 邀请信息展示 -->
    <div v-if="myInvite" class="mb-6">
      <div
        class="bg-gradient-to-r from-green-900/30 to-blue-900/30 rounded-lg border border-green-500/20 p-4"
      >
        <div class="flex items-center justify-between mb-3">
          <h4 class="text-lg font-semibold text-white">
            {{ t("lottery.components.helpInvite.myInvite") }}
          </h4>
          <!--span
            class="px-2 py-1 bg-green-600/50 text-green-200 text-xs rounded-full"
          >
            已获得 {{ myInvite.helpCount }}/{{ myInvite.maxHelpCount }} 次助力
          </span-->
        </div>

        <div class="space-y-3">
          <!-- 邀请码暂时隐藏 -->
          <!-- <div class="flex items-center justify-between">
            <span class="text-indigo-300 text-sm">{{ t("lottery.components.helpInvite.inviteCode") }}:</span>
            <div class="flex items-center space-x-2">
              <code
                class="px-3 py-1 bg-indigo-900/50 text-indigo-200 text-sm rounded font-mono"
              >
                {{ myInvite.inviteCode }}
              </code>
              <button
                @click="copyInviteCode"
                class="px-2 py-1 bg-indigo-600/50 hover:bg-indigo-600/70 text-indigo-200 text-xs rounded transition-all"
              >
                {{ t("lottery.components.shareModal.copy") }}
              </button>
            </div>
          </div> -->

          <div class="flex flex-col">
            <span class="text-indigo-300 text-sm text-left"
              >{{ t("lottery.components.helpInvite.inviteLink") }}:</span
            >
            <div class="flex items-center space-x-2 mt-2">
              <input
                :value="displayInviteUrl"
                readonly
                class="px-3 py-1 bg-indigo-900/50 text-indigo-200 text-sm rounded flex-1 min-w-0 max-w-48"
              />
              <button
                @click="copyInviteUrl"
                :disabled="isGeneratingInviteShortUrl"
                class="px-2 py-1 bg-indigo-600/50 hover:bg-indigo-600/70 text-indigo-200 text-xs rounded transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {{
                  isGeneratingInviteShortUrl
                    ? t("lottery.components.shareModal.generating")
                    : t("lottery.components.shareModal.copy")
                }}
              </button>
            </div>
          </div>

          <!-- 有效期暂时隐藏 -->
          <!-- <div class="flex items-center justify-between">
            <span class="text-indigo-300 text-sm">{{ t("lottery.components.helpInvite.validPeriod") }}:</span>
            <span class="text-green-400 text-sm font-medium">永不过期</span>
          </div> -->
        </div>

        <div class="mt-4 space-y-3">
          <button
            @click="copyAndOpenShare"
            class="w-full py-2 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-lg hover:from-green-700 hover:to-blue-700 transition-all flex items-center justify-center"
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
            {{ t("lottery.components.helpInvite.shareInvite") }}
          </button>

          <button
            @click="openHelpRecordsModal"
            class="w-full py-2 bg-indigo-600/50 hover:bg-indigo-600/70 text-indigo-200 rounded-lg transition-all flex items-center justify-center"
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
                d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
            {{ t("lottery.components.helpInvite.viewRecords") }}
          </button>
        </div>
      </div>
    </div>

    <!-- 助力排行榜 -->
    <div v-if="limitedHelpRanking.length > 0" class="mb-6">
      <h4 class="text-lg font-semibold text-white mb-4 flex items-center">
        <svg
          class="w-5 h-5 mr-2 text-indigo-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
          />
        </svg>
        {{ t("lottery.components.helpInvite.popularityKing") }}
      </h4>
      <div class="space-y-2">
        <div
          v-for="(rank, index) in limitedHelpRanking"
          :key="rank.id"
          class="flex items-center justify-between p-3 bg-indigo-900/20 rounded-lg border border-indigo-500/20"
        >
          <div class="flex items-center space-x-3">
            <div
              class="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold"
              :class="{
                'bg-yellow-500 text-yellow-900': index === 0,
                'bg-gray-400 text-gray-900': index === 1,
                'bg-orange-500 text-orange-900': index === 2,
                'bg-indigo-500 text-white': index > 2,
              }"
            >
              {{ index + 1 }}
            </div>
            <div>
              <div class="text-white text-sm font-medium">
                {{ truncateUsername(rank.userName) }}
              </div>
              <div class="text-indigo-300 text-xs">{{ rank.lotteryName }}</div>
            </div>
          </div>
          <div class="text-right">
            <div class="text-yellow-400 text-sm font-medium">
              {{ rank.totalHelpDraws }}
              {{ t("lottery.components.helpInvite.times") }}
            </div>
            <!-- 隐藏剩余次数显示 -->
            <!-- <div class="text-indigo-300 text-xs">
              {{ rank.remainingHelpDraws }} 剩余
            </div> -->
          </div>
        </div>
      </div>
    </div>

    <!-- 助力说明 -->
  </div>

  <!-- 分享弹窗 -->
  <ShareModal
    :visible="showShareModal"
    :share-url="shareUrl"
    :share-title="shareTitle"
    :share-text="shareText"
    :user-info="shareUserInfo"
    :is-help-invite="true"
    @close="closeShareModal"
  />

  <!-- 助力记录弹窗 -->
  <div
    v-if="showHelpRecordsModal"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
    @click="showHelpRecordsModal = false"
  >
    <div
      class="bg-gradient-to-br from-indigo-900/95 to-purple-900/95 backdrop-blur-sm rounded-xl p-6 w-[90vw] max-w-4xl mx-4 border border-indigo-500/30 max-h-[80vh] overflow-hidden flex flex-col"
      @click.stop
    >
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-bold text-white flex items-center">
          <svg
            class="w-5 h-5 mr-2 text-indigo-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
            />
          </svg>
          {{ t("lottery.components.helpInvite.allHelpRecords") }} ({{
            helpRecords.length
          }})
        </h3>
        <button
          @click="showHelpRecordsModal = false"
          class="text-indigo-300 hover:text-white transition-colors"
        >
          <svg
            class="w-6 h-6"
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

      <div class="flex-1 overflow-y-auto space-y-3 pr-2">
        <!-- Loading状态 -->
        <div
          v-if="loadingHelpRecords"
          class="flex items-center justify-center py-8"
        >
          <div class="flex items-center space-x-3 text-indigo-300">
            <svg class="w-6 h-6 animate-spin" fill="none" viewBox="0 0 24 24">
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
            <span>{{ t("lottery.components.helpInvite.loadingRecords") }}</span>
          </div>
        </div>

        <!-- 助力记录列表 -->
        <div
          v-else-if="helpRecords.length > 0"
          v-for="record in helpRecords"
          :key="record.id"
          class="flex items-center justify-between p-4 bg-indigo-900/20 rounded-lg border border-indigo-500/20"
        >
          <div class="flex items-center space-x-4 flex-1">
            <div
              class="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0"
            >
              <span class="text-white text-base font-medium">
                {{ record.helperName?.charAt(0) || "?" }}
              </span>
            </div>
            <div class="text-left flex-1 min-w-0">
              <div class="text-white text-base font-medium text-left truncate">
                {{ truncateUsername(record.helperName) }}
              </div>
              <div class="text-indigo-300 text-sm text-left">
                {{ formatDate(record.helpTime) }}
              </div>
            </div>
          </div>
          <div class="text-right flex-shrink-0 ml-4">
            <div class="text-green-400 text-sm font-medium"></div>
          </div>
        </div>

        <!-- 空状态 -->
        <div
          v-else-if="!loadingHelpRecords && helpRecords.length === 0"
          class="flex items-center justify-center py-8"
        >
          <div class="text-center text-indigo-300">
            <svg
              class="w-12 h-12 mx-auto mb-3 text-indigo-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
            <p class="text-lg font-medium">
              {{ t("lottery.components.helpInvite.noHelpRecords") }}
            </p>
            <p class="text-sm">
              {{ t("lottery.components.helpInvite.noRecords") }}
            </p>
          </div>
        </div>
      </div>

      <div class="mt-4 flex justify-end">
        <button
          @click="showHelpRecordsModal = false"
          class="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
        >
          {{ t("lottery.components.shareModal.cancel") }}
        </button>
      </div>
    </div>
  </div>

  <!-- 助力规则说明弹窗 -->
  <div
    v-if="showHelpRules"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
    @click="showHelpRules = false"
  >
    <div
      class="bg-gradient-to-br from-indigo-900/95 to-purple-900/95 backdrop-blur-sm rounded-xl p-6 max-w-md mx-4 border border-indigo-500/30"
      @click.stop
    >
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-bold text-white flex items-center">
          <svg
            class="w-5 h-5 mr-2 text-indigo-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          {{ t("lottery.components.helpInvite.rulesTitle") }}
        </h3>
        <button
          @click="showHelpRules = false"
          class="text-indigo-300 hover:text-white transition-colors"
        >
          <svg
            class="w-6 h-6"
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

      <div class="space-y-3">
        <div class="text-indigo-200 text-sm">
          <p class="mb-2">{{ t("lottery.components.helpInvite.rulesDesc") }}</p>
          <ul class="space-y-1">
            <!--li class="flex items-start">
              <span class="text-indigo-400 mr-2">•</span>
              <span
                >每个邀请最多可获得
                <span class="text-yellow-400 font-semibold">{{
                  helpConfig?.helpLimit || myInvite?.maxHelpCount || 5
                }}</span>
                次助力</span
              >
            </li-->
            <li class="flex items-start">
              <span class="text-indigo-400 mr-2">•</span>
              <span
                >每次助力可获得
                <span class="text-green-400 font-semibold">{{
                  helpConfig?.helpRewardDraws || 1
                }}</span>
                次额外抽奖机会</span
              >
            </li>
            <li class="flex items-start">
              <span class="text-indigo-400 mr-2">•</span>
              <span>助力邀请永不过期，可长期使用</span>
            </li>
            <li class="flex items-start">
              <span class="text-indigo-400 mr-2">•</span>
              <span
                >助力抽奖次数上限为
                <span class="text-purple-400 font-semibold">{{
                  helpConfig?.helpLimit || myInvite?.maxHelpCount || 5
                }}</span>
                次</span
              >
            </li>
            <li class="flex items-start">
              <span class="text-indigo-400 mr-2">•</span>
              <span>同一IP和设备在短时间内只能助力有限次数</span>
            </li>
          </ul>
        </div>

        <div
          v-if="helpConfig?.helpRuleDesc"
          class="mt-4 p-3 bg-indigo-800/30 rounded-lg border border-indigo-500/20"
        >
          <p class="text-indigo-200 text-xs">{{ helpConfig.helpRuleDesc }}</p>
        </div>
      </div>

      <div class="mt-6 flex justify-end">
        <button
          @click="showHelpRules = false"
          class="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
        >
          我知道了
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, computed } from "vue";
import { useI18n } from "vue-i18n";
import {
  createHelpInvite,
  getMyHelpInvite,
  getHelpStats,
  getHelpRecords,
  getHelpRanking,
  getHelpConfig,
} from "../api/lottery";
import { getUserInfoFromCache } from "../utils/auth";

const { t } = useI18n();
import { getNicknames } from "../api/user";
import ShareModal from "./ShareModal.vue";
import message from "../utils/message";
import {
  getShareUrl,
  copyToClipboard,
  showCopySuccess,
  showCopyError,
  generateShortUrl,
  getRandomShareSlogan,
} from "../utils/share";

const props = defineProps<{
  lotteryId: number;
  activityId?: number;
  autoCreate?: boolean; // 是否自动创建邀请
}>();

const emit = defineEmits<{
  "invite-created": [invite: any];
}>();

const myInvite = ref<any>(null);
const helpStats = ref<any>(null);
const helpRecords = ref<any[]>([]);
const helpRanking = ref<any[]>([]);
const helpConfig = ref<any>(null);
const refreshing = ref(false);
const checking = ref(false);
const autoCreating = ref(false);
const loadingHelpRecords = ref(false);

// 分享弹窗状态
const showShareModal = ref(false);

// 助力规则说明弹窗状态
const showHelpRules = ref(false);

// 显示的邀请链接（优先显示短链）
const displayInviteUrl = ref("");
// 短链生成状态
const isGeneratingInviteShortUrl = ref(false);

// 获取用户信息用于短链生成
const shareUserInfo = computed(() => {
  const userInfo = getUserInfoFromCache();
  if (userInfo && userInfo.uuid && userInfo.token && userInfo.uid) {
    return {
      uuid: userInfo.uuid,
      token: userInfo.token,
      uid: userInfo.uid,
    };
  }
  return undefined;
});

// 计算分享相关数据
const shareUrl = computed(() => {
  return myInvite.value?.inviteUrl || "";
});

const shareTitle = computed(() => {
  return "邀请您助力抽奖";
});

const shareText = computed(() => {
  return "点击链接为我助力，获得额外抽奖机会！";
});

// 截取用户名，只显示前12位
function truncateUsername(name: string | undefined | null): string {
  if (!name) return "未知用户";
  return name.length > 12 ? name.substring(0, 12) + "..." : name;
}

// 限制助力记录只显示前3名
const limitedHelpRecords = computed(() => {
  return helpRecords.value.slice(0, 3);
});

// 检查是否有更多助力记录
const hasMoreHelpRecords = computed(() => {
  return helpRecords.value.length > 3;
});

// 助力记录弹窗状态
const showHelpRecordsModal = ref(false);

// 限制助力排行榜只显示前10名
const limitedHelpRanking = computed(() => {
  return helpRanking.value.slice(0, 10);
});

// 监听邀请链接变化，生成短链
watch(
  () => myInvite.value?.inviteUrl,
  async (newUrl) => {
    if (newUrl && shareUserInfo.value) {
      // 先检查是否有缓存，如果有缓存则不需要显示"生成中"
      const cacheKey = `${shareUserInfo.value.uuid}_${
        shareUserInfo.value.uid
      }_${btoa(newUrl)}`;
      const cached = localStorage.getItem(`shortUrl_${cacheKey}`);
      let hasValidCache = false;

      if (cached) {
        try {
          const cacheData = JSON.parse(cached);
          const now = Date.now();
          if (now < cacheData.expiresAt) {
            hasValidCache = true;
            displayInviteUrl.value = cacheData.shortUrl;
          }
        } catch (error) {
          console.warn("解析邀请链接缓存失败:", error);
        }
      }

      // 如果没有有效缓存，显示"生成中"并获取短链
      if (!hasValidCache) {
        isGeneratingInviteShortUrl.value = true;
        displayInviteUrl.value =
          t("lottery.components.shareModal.generating") + "...";

        try {
          const shortUrl = await generateShortUrl({
            uuid: shareUserInfo.value.uuid,
            token: shareUserInfo.value.token,
            uid: shareUserInfo.value.uid,
            oriUrl: newUrl,
          });
          displayInviteUrl.value = shortUrl;
        } catch (error) {
          console.warn("获取邀请短链失败，使用原始URL:", error);
          displayInviteUrl.value = newUrl;
        } finally {
          isGeneratingInviteShortUrl.value = false;
        }
      }
    } else if (newUrl) {
      displayInviteUrl.value = newUrl;
    } else {
      displayInviteUrl.value = "";
    }
  },
  { immediate: true }
);

// 创建助力邀请
async function createInvite() {
  console.log("createInvite 函数开始执行");
  console.log("checking.value:", checking.value);

  if (checking.value) {
    console.log("正在检查中，跳过本次创建");
    return;
  }

  console.log("开始创建助力邀请");

  try {
    const userInfo = getUserInfoFromCache();
    console.log("获取用户信息:", userInfo);

    if (!userInfo?.uid) {
      // 如果是自动创建，静默处理登录错误
      if (props.autoCreate) {
        console.log("自动创建邀请时用户未登录，跳过创建");
        return;
      }
      message.error("请先登录");
      return;
    }

    // 构建自定义邀请链接
    let customInviteUrl = undefined;
    const aiskyUrl = import.meta.env.VITE_Aisky_URL;
    if (aiskyUrl) {
      // 使用新的邀请链接格式
      customInviteUrl = `${aiskyUrl}pages/lottery/index?page=h5/lottery/${props.lotteryId}&helpcode={code}`;
    }

    console.log("创建邀请参数:", {
      lotteryId: props.lotteryId,
      inviterUid: userInfo.uid,
      inviteUrl: customInviteUrl,
      activityId: props.activityId,
    });

    console.log("开始调用 createHelpInvite API");
    const res = await createHelpInvite(
      props.lotteryId,
      userInfo.uid,
      customInviteUrl
    );
    console.log("createHelpInvite API 响应:", res);
    if (res.data?.code === 0) {
      myInvite.value = res.data.data;
      console.log("创建成功，后端返回的邀请信息:", myInvite.value);

      await fetchHelpData();
      // 触发父组件更新助力抽奖次数
      emit("invite-created", res.data.data);
    } else {
      // 如果是自动创建，静默处理创建失败
      if (props.autoCreate) {
        console.log("自动创建邀请失败:", res.data?.msg || "创建邀请失败");
      } else {
        message.error(res.data?.msg || "创建邀请失败");
      }
    }
  } catch (error) {
    console.error("创建邀请失败:", error);
    // 如果是自动创建，静默处理网络错误
    if (props.autoCreate) {
      console.log("自动创建邀请网络错误，跳过创建");
    } else {
      message.error("网络错误，请稍后再试");
    }
  } finally {
    // 创建完成，重置自动创建状态
    autoCreating.value = false;
  }
}

// 刷新助力数据（包括统计和排行榜）
async function refreshHelpData() {
  if (refreshing.value) return;

  refreshing.value = true;
  try {
    const userInfo = getUserInfoFromCache();
    if (!userInfo?.uid) return;

    // 获取助力统计
    const statsRes = await getHelpStats(props.lotteryId, userInfo.uid);
    if (statsRes.data?.code === 0) {
      helpStats.value = statsRes.data.data;
    }

    // 获取助力排行榜
    const rankingRes = await getHelpRanking(props.lotteryId, 10);
    if (rankingRes.data?.code === 0) {
      helpRanking.value = rankingRes.data.data || [];
      // 按照 totalHelpDraws 字段进行倒序排序
      helpRanking.value.sort(
        (a, b) => (b.totalHelpDraws || 0) - (a.totalHelpDraws || 0)
      );

      // 获取排行榜中的用户昵称
      if (helpRanking.value.length > 0) {
        const userUids = helpRanking.value
          .map((rank) => rank.uid)
          .filter((uid) => uid);

        if (userUids.length > 0) {
          const nicknames = await fetchUserNicknames(userUids);
          // 更新排行榜中的用户昵称
          helpRanking.value.forEach((rank) => {
            if (rank.uid && nicknames[rank.uid]) {
              rank.userName = nicknames[rank.uid];
            }
          });
        }
      }
    }
  } catch (error) {
    console.error(t("lottery.components.helpInvite.refreshError"), error);
  } finally {
    refreshing.value = false;
  }
}

// 打开助力记录弹窗
async function openHelpRecordsModal() {
  if (loadingHelpRecords.value) return;

  loadingHelpRecords.value = true;
  showHelpRecordsModal.value = true;

  // 只有在打开弹窗时才获取助力记录
  try {
    const userInfo = getUserInfoFromCache();
    if (!userInfo?.uid) {
      loadingHelpRecords.value = false;
      return;
    }

    // 获取助力记录
    const recordsRes = await getHelpRecords(props.lotteryId, userInfo.uid);
    if (recordsRes.data?.code === 0) {
      helpRecords.value = recordsRes.data.data || [];

      // 获取助力记录中的用户昵称
      if (helpRecords.value.length > 0) {
        const helperUids = helpRecords.value
          .map((record) => record.helperUid)
          .filter((uid) => uid);

        if (helperUids.length > 0) {
          const nicknames = await fetchUserNicknames(helperUids);
          // 更新助力记录中的用户昵称
          helpRecords.value.forEach((record) => {
            if (record.helperUid && nicknames[record.helperUid]) {
              record.helperName = nicknames[record.helperUid];
            }
          });
        }
      }
    }
  } catch (error) {
    console.error("获取助力记录失败:", error);
  } finally {
    loadingHelpRecords.value = false;
  }
}

// 复制邀请码
function copyInviteCode() {
  if (myInvite.value?.inviteCode) {
    navigator.clipboard.writeText(myInvite.value.inviteCode);
    message.success(
      t("lottery.components.helpInvite.copySuccess"),
      undefined,
      t
    );
  }
}

// 复制邀请链接
async function copyInviteUrl() {
  // 如果正在生成短链，直接返回
  if (isGeneratingInviteShortUrl.value) {
    return;
  }

  if (
    !displayInviteUrl.value ||
    displayInviteUrl.value ===
      t("lottery.components.shareModal.generating") + "..."
  ) {
    message.error(
      t("lottery.components.helpInvite.inviteLinkNotReady"),
      undefined,
      t
    );
    return;
  }

  try {
    // 在链接前面加上随机选择的分享文案
    const randomSlogan = getRandomShareSlogan();
    const textToCopy = `${randomSlogan}${displayInviteUrl.value}`;
    await copyToClipboard(textToCopy);
    showCopySuccess(t);
  } catch (error) {
    console.error("复制邀请链接失败:", error);
    showCopyError(t);
  }
}

// 复制邀请链接并打开分享弹窗（静默复制，不显示提示）
async function copyAndOpenShare() {
  // 如果正在生成短链，直接返回
  if (isGeneratingInviteShortUrl.value) {
    return;
  }

  if (
    !displayInviteUrl.value ||
    displayInviteUrl.value ===
      t("lottery.components.shareModal.generating") + "..."
  ) {
    message.error(
      t("lottery.components.helpInvite.inviteLinkNotReady"),
      undefined,
      t
    );
    return;
  }

  try {
    // 在链接前面加上随机选择的分享文案
    const randomSlogan = getRandomShareSlogan();
    const textToCopy = `${randomSlogan}${displayInviteUrl.value}`;
    await copyToClipboard(textToCopy);
    // 静默复制，不显示成功提示
  } catch (error) {
    console.error("复制邀请链接失败:", error);
    // 复制失败时显示错误提示
    showCopyError(t);
    return;
  }

  // 复制成功后打开分享弹窗
  openShareModal();
}

// 打开分享弹窗
function openShareModal() {
  if (myInvite.value?.inviteUrl) {
    showShareModal.value = true;
  } else {
    message.warning("请先创建邀请链接");
  }
}

// 关闭分享弹窗
function closeShareModal() {
  showShareModal.value = false;
}

// 获取用户昵称
async function fetchUserNicknames(uids: string[]) {
  if (!uids.length) return {};

  try {
    const uidsStr = uids.join(",");
    const res = await getNicknames(uidsStr);
    if (res.data && res.data.status === 200 && res.data.attachment) {
      return res.data.attachment;
    }
  } catch (error) {
    console.error("获取用户昵称失败:", error);
  }
  return {};
}

// 获取助力相关数据
async function fetchHelpData() {
  try {
    const userInfo = getUserInfoFromCache();
    if (!userInfo?.uid) return;

    // 获取助力配置
    const configRes = await getHelpConfig(props.lotteryId);
    if (configRes.data?.code === 0) {
      helpConfig.value = configRes.data.data;
    }

    // 获取我的邀请
    if (myInvite.value) {
      const inviteRes = await getMyHelpInvite(props.lotteryId, userInfo.uid);
      if (inviteRes.data?.code === 0) {
        myInvite.value = inviteRes.data.data;
      }
    }

    // 获取助力统计
    const statsRes = await getHelpStats(props.lotteryId, userInfo.uid);
    if (statsRes.data?.code === 0) {
      helpStats.value = statsRes.data.data;
    }

    // 获取助力排行榜
    const rankingRes = await getHelpRanking(props.lotteryId, 10);
    if (rankingRes.data?.code === 0) {
      helpRanking.value = rankingRes.data.data || [];

      // 按照 totalHelpDraws 字段进行倒序排序
      helpRanking.value.sort(
        (a, b) => (b.totalHelpDraws || 0) - (a.totalHelpDraws || 0)
      );

      // 获取排行榜中的用户昵称
      if (helpRanking.value.length > 0) {
        const userUids = helpRanking.value
          .map((rank) => rank.uid)
          .filter((uid) => uid);

        if (userUids.length > 0) {
          const nicknames = await fetchUserNicknames(userUids);
          // 更新排行榜中的用户昵称
          helpRanking.value.forEach((rank) => {
            if (rank.uid && nicknames[rank.uid]) {
              rank.userName = nicknames[rank.uid];
            }
          });
        }
      }
    }
  } catch (error) {
    console.error("获取助力数据失败:", error);
  }
}

// 检查是否已有邀请
async function checkExistingInvite() {
  if (checking.value) return;

  checking.value = true;
  try {
    const userInfo = getUserInfoFromCache();
    if (!userInfo?.uid) return;

    // 先获取助力配置
    const configRes = await getHelpConfig(props.lotteryId);
    if (configRes.data?.code === 0) {
      helpConfig.value = configRes.data.data;
    }

    const res = await getMyHelpInvite(props.lotteryId, userInfo.uid);
    if (res.data?.code === 0 && res.data.data) {
      myInvite.value = res.data.data;
      await fetchHelpData();
    } else {
      console.log("没有现有邀请，检查自动创建条件");
      console.log("autoCreate:", props.autoCreate);
      console.log("helpConfig:", helpConfig.value);
      console.log("helpEnabled:", helpConfig.value?.helpEnabled);

      // 先获取助力数据
      await fetchHelpData();

      // 如果没有现有邀请且设置了自动创建且助力功能开启，则自动创建邀请
      if (props.autoCreate && helpConfig.value?.helpEnabled) {
        console.log("满足自动创建条件，开始创建助力邀请");
        // 设置自动创建状态
        autoCreating.value = true;
        checking.value = false;
        await createInvite();
        autoCreating.value = false;
      } else {
        console.log("不满足自动创建条件，跳过创建");
      }
    }
  } catch (error) {
    console.error("检查邀请失败:", error);
  } finally {
    checking.value = false;
  }
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
  checkExistingInvite();
});

// 监听lotteryId变化
watch(
  () => props.lotteryId,
  () => {
    myInvite.value = null;
    helpStats.value = null;
    helpRecords.value = [];
    helpRanking.value = [];
    helpConfig.value = null;
    checkExistingInvite();
  }
);
</script>

<style scoped>
.help-invite {
  animation: fadeInUp 0.5s ease-out;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
