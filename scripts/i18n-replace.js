/**
 * 自动化国际化文本替换脚本
 * 用于批量替换 Vue 文件中的硬编码中文文本为 i18n 函数调用
 */

const fs = require("fs");
const path = require("path");

// 定义替换规则映射
const replacementRules = {
  // LotteryDetail.vue 的替换规则
  "LotteryDetail.vue": [
    // 顶部导航
    {
      pattern: /分享\n/g,
      replacement: `{{ t("lottery.lotteryDetail.share") }}\n`,
    },
    {
      pattern: /连接钱包\n/g,
      replacement: `{{ t("lottery.lotteryDetail.connectWallet") }}\n`,
    },
    {
      pattern: /我的记录\n/g,
      replacement: `{{ t("lottery.lotteryDetail.myRecord") }}\n`,
    },

    // 抽奖按钮和文本
    {
      pattern: /抽奖\n/g,
      replacement: `{{ t("lottery.lotteryDetail.draw") }}\n`,
    },
    {
      pattern: /">抽奖</g,
      replacement: `>{{ t("lottery.lotteryDetail.draw") }}<`,
    },
    {
      pattern: /今日可抽次数/g,
      replacement: `{{ t("lottery.lotteryDetail.remainingDrawsToday") }}`,
    },
    {
      pattern: /剩余可抽总数/g,
      replacement: `{{ t("lottery.lotteryDetail.remainingDraws") }}`,
    },
    {
      pattern: /获得助力次数/g,
      replacement: `{{ t("lottery.lotteryDetail.helpDraws") }}`,
    },
    {
      pattern: /今日剩余次数/g,
      replacement: `{{ t("lottery.lotteryDetail.todayRemaining") }}`,
    },
    {
      pattern: /总剩余次数/g,
      replacement: `{{ t("lottery.lotteryDetail.totalRemaining") }}`,
    },
    {
      pattern: /助力抽奖次数/g,
      replacement: `{{ t("lottery.lotteryDetail.helpAssistDraws") }}`,
    },

    // 盲盒相关
    {
      pattern: /神秘盲盒/g,
      replacement: `{{ t("lottery.lotteryDetail.boxTitle") }}`,
    },
    {
      pattern: /点击盲盒，开启链上奇遇/g,
      replacement: `{{ t("lottery.lotteryDetail.boxDesc") }}`,
    },
    {
      pattern: /点击开启神秘礼物/g,
      replacement: `{{ t("lottery.lotteryDetail.clickToOpen") }}`,
    },

    // 连接钱包按钮
    {
      pattern: /连接Web3钱包\n/g,
      replacement: `{{ t("lottery.lotteryDetail.connectWallet") }}\n`,
    },

    // 邀请好友助力（需要更精确的匹配）
    {
      pattern: /邀请好友助力\n              <\/button>/g,
      replacement: `{{ t("lottery.lotteryDetail.inviteFriends") }}\n              </button>`,
    },

    // 错误提示
    {
      pattern: /星际通讯受阻/g,
      replacement: `{{ t("lottery.lotteryDetail.error") }}`,
    },
    {
      pattern: /重新连接\n/g,
      replacement: `{{ t("lottery.lotteryDetail.reconnect") }}\n`,
    },
    {
      pattern: /返回抽奖\n/g,
      replacement: `{{ t("lottery.lotteryDetail.backToList") }}\n`,
    },
    {
      pattern: /星域已坍缩/g,
      replacement: `{{ t("lottery.lotteryDetail.notFound") }}`,
    },
    {
      pattern: /该活动已消失于宇宙尘埃，或从未存在/g,
      replacement: `{{ t("lottery.lotteryDetail.notFoundDesc") }}`,
    },
    {
      pattern: /星际定位中\.\.\./g,
      replacement: `{{ t("lottery.common.loading") }}`,
    },

    // 刷新按钮
    {
      pattern: /刷新次数/g,
      replacement: `{{ t("lottery.lotteryDetail.refreshDraws") }}`,
    },
  ],

  // MyLottery.vue 的替换规则
  "MyLottery.vue": [
    // 标题
    {
      pattern: /我的记录\n          <\/h1>/g,
      replacement: `{{ t("lottery.myLottery.title") }}\n          </h1>`,
    },

    // Tab 按钮
    {
      pattern: /我的奖品\n          <\/button>/g,
      replacement: `{{ t("lottery.myLottery.myPrizes") }}\n          </button>`,
    },
    {
      pattern: /参与记录\n          <\/button>/g,
      replacement: `{{ t("lottery.myLottery.participationRecords") }}\n          </button>`,
    },

    // 空状态
    {
      pattern: /暂无中奖记录<\/h3>/g,
      replacement: `{{ t("lottery.myLottery.noPrizes") }}</h3>`,
    },
    {
      pattern: /参与更多抽奖活动，赢取web3代币/g,
      replacement: `{{ t("lottery.myLottery.noPrizesDesc") }}`,
    },
    {
      pattern: /暂无参与记录<\/h3>/g,
      replacement: `{{ t("lottery.myLottery.noParticipation") }}</h3>`,
    },
    {
      pattern: /参与抽奖活动，探索Web3代币/g,
      replacement: `{{ t("lottery.myLottery.noParticipationDesc") }}`,
    },
    {
      pattern: /浏览抽奖活动\n/g,
      replacement: `{{ t("lottery.myLottery.browseActivities") }}\n`,
    },

    // 状态标签
    {
      pattern: /待领取/g,
      replacement: `{{ t("lottery.myLottery.unclaimed") }}`,
    },
    { pattern: /已领取/g, replacement: `{{ t("lottery.myLottery.claimed") }}` },
    {
      pattern: /立即领取\n/g,
      replacement: `{{ t("lottery.myLottery.claimNow") }}\n`,
    },

    // 表格和记录
    {
      pattern: /抽奖活动：/g,
      replacement: `{{ t("lottery.myLottery.lotteryActivity") }}:`,
    },
    {
      pattern: /中奖时间：/g,
      replacement: `{{ t("lottery.myLottery.winTime") }}:`,
    },
    {
      pattern: /领取时间：/g,
      replacement: `{{ t("lottery.myLottery.claimTime") }}:`,
    },
    {
      pattern: /活动名称\n/g,
      replacement: `{{ t("lottery.myLottery.activityName") }}\n`,
    },
    {
      pattern: /参与时间\n/g,
      replacement: `{{ t("lottery.myLottery.participationTime") }}\n`,
    },
    {
      pattern: /类型\n/g,
      replacement: `{{ t("lottery.myLottery.lotteryType") }}\n`,
    },
    {
      pattern: /结果\n/g,
      replacement: `{{ t("lottery.myLottery.result") }}\n`,
    },
    { pattern: /大转盘/g, replacement: `{{ t("lottery.myLottery.wheel") }}` },
    { pattern: /中奖 \(/g, replacement: `{{ t("lottery.myLottery.won") }} (` },
    { pattern: /未中奖/g, replacement: `{{ t("lottery.myLottery.notWon") }}` },

    // 领奖弹窗
    {
      pattern: /填写您的钱包地址<\/h3>/g,
      replacement: `{{ t("lottery.myLottery.claimModal.title") }}</h3>`,
    },
    {
      pattern: /请准确提供您的链上钱包地址，我们将按照此地址划转/g,
      replacement: `{{ t("lottery.myLottery.claimModal.desc") }}`,
    },
    {
      pattern: /钱包地址<\/label>/g,
      replacement: `{{ t("lottery.myLottery.claimModal.walletAddress") }}</label>`,
    },
    {
      pattern: /请输入您的链上钱包地址/g,
      replacement: `{{ t("lottery.myLottery.claimModal.walletPlaceholder") }}`,
    },
    {
      pattern: /提交钱包地址\n/g,
      replacement: `{{ t("lottery.myLottery.claimModal.submit") }}\n`,
    },
    {
      pattern: /提交中\.\.\./g,
      replacement: `{{ t("lottery.myLottery.claimModal.submitting") }}`,
    },

    // 登录提示
    {
      pattern: /请先连接钱包<\/h2>/g,
      replacement: `{{ t("lottery.myLottery.loginRequired") }}</h2>`,
    },
    {
      pattern: /连接Web3钱包后方可查看您的NFT资产/g,
      replacement: `{{ t("lottery.myLottery.loginDesc") }}`,
    },
    {
      pattern: /连接钱包\n          <\/span>/g,
      replacement: `{{ t("lottery.myLottery.connectWallet") }}\n          </span>`,
    },

    // 错误和加载
    {
      pattern: /星际通讯受阻/g,
      replacement: `{{ t("lottery.myLottery.error") }}`,
    },
    {
      pattern: /重新连接\n/g,
      replacement: `{{ t("lottery.myLottery.reconnect") }}\n`,
    },
    {
      pattern: /返回星际港\n/g,
      replacement: `{{ t("lottery.myLottery.backToList") }}\n`,
    },
    {
      pattern: /星际记忆检索中\.\.\./g,
      replacement: `{{ t("lottery.myLottery.loading") }}`,
    },
  ],

  // HelpAssist.vue 的替换规则
  "HelpAssist.vue": [
    // 标题
    {
      pattern: /好友助力\n          <\/h1>/g,
      replacement: `{{ t("lottery.helpAssist.title") }}\n          </h1>`,
    },

    // 按钮
    {
      pattern: /连接钱包\n            <\/button>/g,
      replacement: `{{ t("lottery.helpAssist.connectWallet") }}\n            </button>`,
    },
    {
      pattern: /立即助力/g,
      replacement: `{{ t("lottery.helpAssist.assist") }}`,
    },
    {
      pattern: /助力中\.\.\./g,
      replacement: `{{ t("lottery.helpAssist.assisting") }}`,
    },
    {
      pattern: /无法助力/g,
      replacement: `{{ t("lottery.helpAssist.cannotAssist") }}`,
    },

    // 成功状态
    {
      pattern: /助力成功！<\/h2>/g,
      replacement: `{{ t("lottery.helpAssist.assistSuccess") }}</h2>`,
    },
    {
      pattern: /您已成功为好友助力，获得额外抽奖机会！/g,
      replacement: `{{ t("lottery.helpAssist.assistSuccessDesc") }}`,
    },
    {
      pattern: /助力详情<\/div>/g,
      replacement: `{{ t("lottery.helpAssist.assistDetails") }}</div>`,
    },
    {
      pattern: /邀请人: /g,
      replacement: `{{ t("lottery.helpAssist.inviter") }}: `,
    },
    {
      pattern: /抽奖活动: /g,
      replacement: `{{ t("lottery.helpAssist.lotteryActivity") }}: `,
    },
    {
      pattern: /助力时间: /g,
      replacement: `{{ t("lottery.helpAssist.assistTime") }}: `,
    },
    {
      pattern: /参与抽奖\n/g,
      replacement: `{{ t("lottery.helpAssist.participateLottery") }}\n`,
    },
    {
      pattern: /浏览活动\n/g,
      replacement: `{{ t("lottery.helpAssist.browseActivities") }}\n`,
    },

    // 邀请详情
    {
      pattern: /好友助力邀请<\/h1>/g,
      replacement: `{{ t("lottery.helpAssist.inviteTitle") }}</h1>`,
    },
    {
      pattern: /邀请码: /g,
      replacement: `{{ t("lottery.helpAssist.inviteCode") }}: `,
    },
    {
      pattern: /助力进度: /g,
      replacement: `{{ t("lottery.helpAssist.assistProgress") }}: `,
    },
    {
      pattern: /您的朋友邀请您助力抽奖，点击下方按钮即可助力！/g,
      replacement: `{{ t("lottery.helpAssist.inviteDesc") }}`,
    },
    {
      pattern: /有效期: /g,
      replacement: `{{ t("lottery.helpAssist.validPeriod") }}: `,
    },
    {
      pattern: /永不过期/g,
      replacement: `{{ t("lottery.helpAssist.neverExpire") }}`,
    },

    // 助力说明
    {
      pattern: /为好友助力<\/h3>/g,
      replacement: `{{ t("lottery.helpAssist.assistTitle") }}</h3>`,
    },
    {
      pattern: /每次助力可获得额外抽奖机会，让好友的抽奖之旅更加精彩！/g,
      replacement: `{{ t("lottery.helpAssist.assistDesc") }}`,
    },
    {
      pattern: /助力奖励<\/div>/g,
      replacement: `{{ t("lottery.helpAssist.assistRewards") }}</div>`,
    },
    {
      pattern: /• 为好友增加 1 次抽奖机会/g,
      replacement: `• {{ t("lottery.helpAssist.rewardsList.extraDraw", { count: 1 }) }}`,
    },
    {
      pattern: /• 助力记录永久保存/g,
      replacement: `• {{ t("lottery.helpAssist.rewardsList.permanent") }}`,
    },
    {
      pattern: /• 参与好友的抽奖旅程/g,
      replacement: `• {{ t("lottery.helpAssist.rewardsList.participate") }}`,
    },

    // 规则说明
    {
      pattern: /助力规则说明<\/h4>/g,
      replacement: `{{ t("lottery.helpAssist.rulesTitle") }}</h4>`,
    },

    // 错误状态
    {
      pattern: /助力失败<\/h2>/g,
      replacement: `{{ t("lottery.helpAssist.assistFailed") }}</h2>`,
    },
    {
      pattern: /重试\n/g,
      replacement: `{{ t("lottery.helpAssist.retry") }}\n`,
    },
    {
      pattern: /返回抽奖\n/g,
      replacement: `{{ t("lottery.helpAssist.backToList") }}\n`,
    },

    // 禁用原因
    {
      pattern: /邀请已失效/g,
      replacement: `{{ t("lottery.helpAssist.inviteInvalid") }}`,
    },
    {
      pattern: /助力次数已达上限/g,
      replacement: `{{ t("lottery.helpAssist.limitReached") }}`,
    },

    // 加载状态
    {
      pattern: /正在验证邀请\.\.\./g,
      replacement: `{{ t("lottery.helpAssist.loading") }}`,
    },
  ],

  // TestHelp.vue 的替换规则
  "TestHelp.vue": [
    {
      pattern: /好友助力功能测试/g,
      replacement: `{{ t("lottery.testHelp.title") }}`,
    },
    {
      pattern: /测试创建邀请<\/h2>/g,
      replacement: `{{ t("lottery.testHelp.testCreate") }}</h2>`,
    },
    {
      pattern: /测试获取邀请详情<\/h2>/g,
      replacement: `{{ t("lottery.testHelp.testGetDetail") }}</h2>`,
    },
    {
      pattern: /测试助力操作<\/h2>/g,
      replacement: `{{ t("lottery.testHelp.testAssist") }}</h2>`,
    },
    {
      pattern: /测试获取统计<\/h2>/g,
      replacement: `{{ t("lottery.testHelp.testGetStats") }}</h2>`,
    },
    {
      pattern: /测试获取助力配置<\/h2>/g,
      replacement: `{{ t("lottery.testHelp.testGetConfig") }}</h2>`,
    },

    {
      pattern: /抽奖活动ID<\/label>/g,
      replacement: `{{ t("lottery.testHelp.lotteryId") }}</label>`,
    },
    {
      pattern: /邀请人UID<\/label>/g,
      replacement: `{{ t("lottery.testHelp.inviterUid") }}</label>`,
    },
    {
      pattern: /邀请码<\/label>/g,
      replacement: `{{ t("lottery.testHelp.inviteCode") }}</label>`,
    },
    {
      pattern: /助力人UID<\/label>/g,
      replacement: `{{ t("lottery.testHelp.helperUid") }}</label>`,
    },
    {
      pattern: /用户UID<\/label>/g,
      replacement: `{{ t("lottery.testHelp.userUid") }}</label>`,
    },

    {
      pattern: /测试中\.\.\./g,
      replacement: `{{ t("lottery.testHelp.testing") }}`,
    },
    {
      pattern: /运行所有测试\n/g,
      replacement: `{{ t("lottery.testHelp.runAllTests") }}\n`,
    },

    {
      pattern: /测试结果汇总<\/h2>/g,
      replacement: `{{ t("lottery.testHelp.results") }}</h2>`,
    },
    {
      pattern: /创建成功<\/div>/g,
      replacement: `{{ t("lottery.testHelp.createSuccess") }}</div>`,
    },
    {
      pattern: /详情成功<\/div>/g,
      replacement: `{{ t("lottery.testHelp.detailSuccess") }}</div>`,
    },
    {
      pattern: /助力成功<\/div>/g,
      replacement: `{{ t("lottery.testHelp.assistSuccess") }}</div>`,
    },
    {
      pattern: /统计成功<\/div>/g,
      replacement: `{{ t("lottery.testHelp.statsSuccess") }}</div>`,
    },
    {
      pattern: /配置成功<\/div>/g,
      replacement: `{{ t("lottery.testHelp.configSuccess") }}</div>`,
    },
  ],
};

// 执行替换的函数
function replaceInFile(filePath, rules) {
  console.log(`\n处理文件: ${filePath}`);

  // 读取文件内容
  let content = fs.readFileSync(filePath, "utf8");
  let changeCount = 0;

  // 应用所有替换规则
  rules.forEach((rule, index) => {
    const before = content;
    content = content.replace(rule.pattern, rule.replacement);
    if (before !== content) {
      changeCount++;
      console.log(`  ✓ 规则 ${index + 1} 已应用`);
    }
  });

  // 写回文件
  if (changeCount > 0) {
    fs.writeFileSync(filePath, content, "utf8");
    console.log(`✅ 完成! 应用了 ${changeCount} 个替换规则`);
  } else {
    console.log(`⚠️  没有找到需要替换的内容`);
  }

  return changeCount;
}

// 主执行函数
function main() {
  console.log("=".repeat(60));
  console.log("🚀 开始自动化国际化文本替换");
  console.log("=".repeat(60));

  const baseDir = path.join(__dirname, "../src/views/lottery");
  let totalChanges = 0;

  // 遍历所有需要处理的文件
  for (const [fileName, rules] of Object.entries(replacementRules)) {
    const filePath = path.join(baseDir, fileName);

    if (!fs.existsSync(filePath)) {
      console.log(`❌ 文件不存在: ${filePath}`);
      continue;
    }

    const changes = replaceInFile(filePath, rules);
    totalChanges += changes;
  }

  console.log("\n" + "=".repeat(60));
  console.log(`✨ 替换完成! 总共应用了 ${totalChanges} 个替换`);
  console.log("=".repeat(60));
  console.log("\n📝 下一步建议:");
  console.log("  1. 运行 pnpm dev 启动开发服务器");
  console.log("  2. 访问 http://localhost:3000/h5/lottery?locale=en 测试英文");
  console.log(
    "  3. 访问 http://localhost:3000/h5/lottery?locale=zh-Hant 测试繁体中文"
  );
  console.log("  4. 检查所有页面的文本显示是否正确\n");
}

// 运行脚本
try {
  main();
} catch (error) {
  console.error("❌ 脚本执行出错:", error);
  process.exit(1);
}
