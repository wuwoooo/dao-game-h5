# 🚀 国际化快速开始指南

## 立即测试

### 1. 启动开发服务器

```bash
pnpm dev
```

### 2. 在浏览器中测试不同语言

#### 英文版本

```
http://localhost:3000/h5/lottery?locale=en
```

#### 简体中文版本（默认）

```
http://localhost:3000/h5/lottery?locale=zh-Hans
```

#### 繁体中文版本

```
http://localhost:3000/h5/lottery?locale=zh-Hant
```

---

## 在代码中使用国际化

### 1. 在 Vue 组件中使用

```vue
<script setup lang="ts">
import { useI18n } from "vue-i18n";

const { t } = useI18n();
</script>

<template>
  <!-- 基本用法 -->
  <h1>{{ t("lottery.lotteryList.title") }}</h1>

  <!-- 带参数 -->
  <div>{{ t("lottery.helpAssist.rules.rewardDraws", { count: 5 }) }}</div>

  <!-- 在属性中使用 -->
  <input :placeholder="t('lottery.myLottery.claimModal.walletPlaceholder')" />
</template>
```

### 2. 在 JavaScript/TypeScript 中使用

```typescript
import { t } from "@/i18n";

// 在函数中
function showMessage() {
  const message = t("lottery.common.success");
  console.log(message);
}

// 在computed中
const errorMessage = computed(() => {
  return t("lottery.lotteryDetail.error");
});
```

---

## 翻译文件位置

所有翻译文件在 `src/i18n/lottery/` 目录：

```
src/i18n/lottery/
├── zh-Hans.ts    # 简体中文
├── zh-Hant.ts    # 繁体中文
└── en.ts         # 英文
```

---

## 常用翻译键

### 抽奖列表 (`lottery.lotteryList`)

- `title` - 页面标题
- `publishBtn` - 发布按钮
- `myRecordBtn` - 我的记录
- `loading` - 加载中
- `noActivity` - 暂无活动

### 抽奖详情 (`lottery.lotteryDetail`)

- `draw` - 抽奖
- `drawing` - 抽奖中
- `remainingDraws` - 剩余次数
- `inviteFriends` - 邀请好友
- `connectWallet` - 连接钱包

### 我的记录 (`lottery.myLottery`)

- `title` - 我的记录
- `myPrizes` - 我的奖品
- `noPrizes` - 暂无中奖记录
- `claimNow` - 立即领取

### 通用文本 (`lottery.common`)

- `confirm` - 确认
- `cancel` - 取消
- `submit` - 提交
- `loading` - 加载中
- `success` - 成功
- `error` - 错误

---

## 添加新翻译

### 步骤 1: 编辑翻译文件

在 `src/i18n/lottery/zh-Hans.ts` 中添加：

```typescript
export default {
  lotteryList: {
    newFeature: "新功能",
    // ...
  },
};
```

### 步骤 2: 同步到其他语言

在 `en.ts` 和 `zh-Hant.ts` 中添加对应翻译。

### 步骤 3: 在组件中使用

```vue
<div>{{ t('lottery.lotteryList.newFeature') }}</div>
```

---

## 切换语言

### 方式 1: URL 参数（推荐）

```
?locale=en
?locale=zh-Hans
?locale=zh-Hant
```

### 方式 2: 程序切换

```typescript
import { setLocale } from "@/i18n";

// 切换到英文
setLocale("en");

// 切换到繁体中文
setLocale("zh-Hant");
```

---

## 常见问题

### Q: 如何确认当前语言？

A: 查看浏览器控制台或 localStorage 中的 `user_locale`

### Q: 语言没有切换？

A: 检查 URL 参数是否正确，并清除浏览器缓存

### Q: 翻译文本没有显示？

A: 确认翻译键路径正确，检查是否导入了 `useI18n`

---

## 需要帮助？

查看完整文档：[INTERNATIONALIZATION_COMPLETE.md](./INTERNATIONALIZATION_COMPLETE.md)
