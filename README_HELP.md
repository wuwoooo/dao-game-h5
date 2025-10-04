# 好友助力功能说明

## 功能概述

好友助力功能允许用户在抽奖活动中邀请好友助力，获得额外的抽奖次数。这是一个社交化的功能，可以增加用户参与度和活动传播性。

## 主要特性

### 1. 创建助力邀请

- 用户可以在抽奖详情页面创建助力邀请
- 系统生成唯一的邀请码和邀请链接
- 每个邀请最多可获得 5 次助力
- 邀请有效期为 24 小时

### 2. 助力操作

- 好友通过邀请链接进入助力页面
- 点击助力按钮为好友增加抽奖次数
- 每次助力可获得 1 次额外抽奖机会
- 支持防刷机制（IP 限制、设备指纹等）

### 3. 助力统计

- 显示总助力次数
- 显示剩余助力抽奖次数
- 显示已使用助力抽奖次数
- 实时更新助力进度

### 4. 助力记录

- 记录每次助力的详细信息
- 显示助力人信息
- 记录助力时间和状态
- 支持助力历史查询

### 5. 助力排行榜

- 显示助力次数排行榜
- 支持多活动排行榜
- 实时更新排名信息

## 技术实现

### API 接口

#### 创建助力邀请

```typescript
POST /v1/lottery/help/invite
{
  "lotteryId": 1,
  "inviterUid": "user123"
}
```

#### 获取助力邀请详情

```typescript
GET / v1 / lottery / help / invite / { inviteCode };
```

#### 执行助力操作

```typescript
POST /v1/lottery/help/assist
{
  "inviteCode": "abc123def456ghi789",
  "helperUid": "friend456"
}
```

#### 获取助力统计

```typescript
GET /v1/lottery/help/{lotteryId}/my-stats?uid={uid}
```

#### 获取助力记录

```typescript
GET /v1/lottery/help/{lotteryId}/my-records?uid={uid}
```

#### 获取助力排行榜

```typescript
GET /v1/lottery/help/{lotteryId}/ranking?limit=10
```

### 组件结构

1. **HelpInvite.vue** - 主要的助力功能组件

   - 创建邀请
   - 显示邀请信息
   - 助力统计
   - 助力记录
   - 助力排行榜

2. **HelpAssist.vue** - 助力操作页面

   - 显示邀请详情
   - 执行助力操作
   - 助力成功反馈

3. **ShareInvite.vue** - 邀请分享组件
   - 复制邀请码
   - 复制邀请链接
   - 分享邀请

### 路由配置

```typescript
{
  path: "/lottery/help/invite/:code",
  name: "help-assist",
  component: () => import("../views/lottery/HelpAssist.vue"),
  meta: {
    title: "好友助力",
  },
}
```

## 使用流程

### 1. 创建邀请

1. 用户在抽奖详情页面点击"创建助力邀请"
2. 系统生成邀请码和邀请链接
3. 用户可以复制邀请码或分享邀请链接

### 2. 好友助力

1. 好友通过邀请链接进入助力页面
2. 查看邀请详情和助力说明
3. 点击"立即助力"按钮
4. 系统验证并记录助力操作
5. 显示助力成功页面

### 3. 获得奖励

1. 邀请人立即获得额外抽奖次数
2. 可以在抽奖页面看到助力抽奖次数
3. 使用助力抽奖次数参与抽奖

## 防刷机制

### 1. IP 地址限制

- 同一 IP 在短时间内只能助力有限次数
- 防止恶意刷助力

### 2. 设备指纹

- 记录用户设备信息
- 防止同一设备多次助力

### 3. 时间间隔

- 限制助力操作的时间间隔
- 防止快速连续助力

### 4. 助力上限

- 每个邀请最多只能获得指定次数的助力
- 防止无限助力

## 数据模型

### 助力邀请表

```typescript
interface HelpInvite {
  id: number;
  lotteryId: number;
  inviterUid: string;
  inviteCode: string;
  inviteUrl: string;
  status: "active" | "expired" | "completed";
  expireTime: string | null; // 助力邀请永不过期，此字段为null
  helpCount: number;
  maxHelpCount: number;
  createdAt: string;
  updatedAt: string;
}
```

### 助力记录表

```typescript
interface HelpRecord {
  id: number;
  invitationId: number;
  lotteryId: number;
  inviterUid: string;
  helperUid: string;
  helperIp: string;
  helperUserAgent: string;
  helpTime: string;
  rewardDraws: number;
  status: "valid" | "invalid";
  lotteryName: string;
  inviterName: string;
  helperName: string;
}
```

### 助力统计表

```typescript
interface HelpStats {
  id: number;
  lotteryId: number;
  uid: string;
  totalHelpReceived: number;
  totalHelpDraws: number;
  usedHelpDraws: number;
  remainingHelpDraws: number;
  lastHelpTime: string;
  createdAt: string;
  updatedAt: string;
}
```

## 注意事项

1. **邀请有效期**：邀请链接 24 小时后自动失效
2. **助力次数限制**：每个邀请最多 5 次助力
3. **防刷机制**：系统会自动检测和阻止恶意助力
4. **实时更新**：助力成功后立即更新抽奖次数
5. **数据安全**：所有助力操作都会记录详细日志

## 扩展功能

### 1. 助力奖励升级

- 根据助力次数提供不同等级的奖励
- 支持助力里程碑奖励

### 2. 助力团队

- 支持团队助力模式
- 团队助力获得额外奖励

### 3. 助力活动

- 定期举办助力活动
- 助力排行榜奖励

### 4. 社交分享

- 集成社交媒体分享
- 支持微信、QQ 等平台分享

## 测试建议

1. **功能测试**

   - 创建邀请功能
   - 助力操作流程
   - 助力统计更新
   - 防刷机制验证

2. **性能测试**

   - 大量用户同时助力
   - 数据库查询性能
   - 缓存机制效果

3. **安全测试**

   - 邀请码安全性
   - 防刷机制有效性
   - 数据完整性验证

4. **用户体验测试**
   - 操作流程流畅性
   - 界面友好性
   - 错误处理合理性
