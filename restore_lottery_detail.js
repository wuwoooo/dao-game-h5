const fs = require("fs");
const path = require("path");

const filePath = path.join(__dirname, "src/views/lottery/LotteryDetail.vue");
let content = fs.readFileSync(filePath, "utf-8");

console.log("开始恢复 LotteryDetail.vue 的完整功能...");

// 1. 在导入部分添加 ShareModal 和 HelpInvite 组件
const importMatch = content.match(
  /import \{[^}]+\} from ["']\.\.\/\.\.\/api\/lottery["'];/
);
if (importMatch) {
  const afterImports = content.split(importMatch[0])[1];
  if (
    !afterImports.includes("import ShareModal") &&
    !afterImports.includes("import HelpInvite")
  ) {
    content = content.replace(
      importMatch[0],
      importMatch[0] +
        `
import ShareModal from "../../components/ShareModal.vue";
import HelpInvite from "../../components/HelpInvite.vue";`
    );
    console.log("✅ 添加 ShareModal 和 HelpInvite 组件导入");
  }
}

// 2. 在<script setup>后添加组件引用状态
const scriptMatch = content.match(/<script setup lang="ts">/);
if (scriptMatch) {
  // 查找 drawInfo 定义的位置
  const drawInfoMatch = content.match(
    /const drawInfo = reactive\(\{[\s\S]*?\}\);/
  );
  if (drawInfoMatch && !content.includes("const showShareModal")) {
    content = content.replace(
      drawInfoMatch[0],
      drawInfoMatch[0] +
        `

// 分享和助力相关状态
const showShareModal = ref(false);
const shareUrl = ref("");
const shareTitle = ref("");
const shareText = ref("");

// 助力相关函数
function handleInviteCreated(inviteData: any) {
  console.log("助力邀请已创建:", inviteData);
}

function openShareModal() {
  if (!lottery.value) return;
  
  shareTitle.value = lottery.value.name || "精彩抽奖活动";
  shareText.value = \`\${lottery.value.name} - 快来参与抽奖赢取精美数字藏品！\`;
  shareUrl.value = window.location.href;
  showShareModal.value = true;
}

function closeShareModal() {
  showShareModal.value = false;
}`
    );
    console.log("✅ 添加分享和助力相关状态和函数");
  }
}

// 3. 在顶部导航添加分享按钮 (在<div class="flex space-x-3">后面)
const navMatch = content.match(/<div class="flex space-x-3">\s*<router-link/);
if (
  navMatch &&
  !content.includes("分享") &&
  !content.includes('@click="openShareModal"')
) {
  content = content.replace(
    /<div class="flex space-x-3">/,
    `<div class="flex space-x-3">
          <!-- 分享按钮 -->
          <button
            @click="openShareModal"
            class="px-3 py-1.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white text-sm rounded-lg transition-all flex items-center shadow-lg hover:shadow-purple-500/50"
          >
            <svg
              class="w-4 h-4 mr-1.5"
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
            <span>分享</span>
          </button>
`
  );
  console.log("✅ 添加顶部分享按钮");
}

// 4. 在转盘下方添加 HelpInvite 组件（查找转盘容器结束的位置）
const wheelEndMatch = content.match(
  /<!-- 转盘容器结束 -->[\s\S]*?<\/div>\s*<\/div>/
);
if (wheelEndMatch && !content.includes("<HelpInvite")) {
  content = content.replace(
    wheelEndMatch[0],
    wheelEndMatch[0] +
      `

    <!-- 好友助力模块 -->
    <HelpInvite
      v-if="lottery"
      :lottery-id="lottery.id"
      :activity-id="lottery.id"
      :auto-create="true"
      @invite-created="handleInviteCreated"
    />`
  );
  console.log("✅ 添加好友助力模块");
}

// 5. 在模板结束前添加 ShareModal 组件
if (!content.includes("<ShareModal")) {
  content = content.replace(
    /<\/template>/,
    `
    <!-- 分享弹窗 -->
    <ShareModal
      :visible="showShareModal"
      :share-url="shareUrl"
      :share-title="shareTitle"
      :share-text="shareText"
      :user-info="userInfo"
      @close="closeShareModal"
    />
  </template>`
  );
  console.log("✅ 添加分享弹窗组件");
}

// 6. 在 script 中添加 userInfo 计算属性
if (!content.includes("const userInfo = computed")) {
  const computedMatch = content.match(/const lottery = ref<any>\(null\);/);
  if (computedMatch) {
    content = content.replace(
      computedMatch[0],
      computedMatch[0] +
        `

const userInfo = computed(() => {
  const user = getUserInfoFromCache();
  if (user && user.uuid && user.token && user.uid) {
    return {
      uuid: user.uuid,
      token: user.token,
      uid: user.uid
    };
  }
  return null;
});`
    );
    console.log("✅ 添加 userInfo 计算属性");
  }
}

// 写回文件
fs.writeFileSync(filePath, content, "utf-8");
console.log("\n✅ 恢复完成！");
console.log("已添加的功能：");
console.log("  1. ShareModal 和 HelpInvite 组件导入");
console.log("  2. 顶部分享按钮");
console.log("  3. 好友助力模块");
console.log("  4. 分享弹窗");
console.log("  5. 相关状态和函数");
