# Dao Game 抽奖活动 API 文档

版本：v1.3.2  
更新时间：2025-01-15

## 基础信息

- **基础 URL**: `/api`
- **认证方式**: 除明确说明外，所有接口都需要在请求头中携带 `Authorization: Bearer {token}`。

## 通用响应格式

所有接口统一返回以下格式：

```json
{
  "code": 0,         // 状态码，0表示成功，其他表示失败
  "msg": "success",  // 提示信息
  "data": { ... }      // 业务数据，成功时可能为 null 或具体数据对象/列表
}
```

**通用错误码：**

- `400`: 参数校验失败 (msg 会包含具体错误信息)
- `401`: 未授权 (Token 无效或过期)
- `403`: 无权限
- `404`: 资源未找到
- `500`: 服务器内部错误

---

## 🎯 抽奖活动接口

### 国际化支持

所有抽奖活动相关接口都支持国际化，通过 `locale` 参数控制返回语言：

- **参数名**: `locale`
- **类型**: String
- **默认值**: `zh-CN`
- **可选值**:
  - `en`: 英文
  - `zh-CN`: 简体中文 (默认)
  - `zh-HK`: 繁体中文
  - `zh-Hans`: 简体中文 (兼容)
  - `zh-Hant`: 繁体中文 (兼容)

**注意**: 不传递 `locale` 参数时默认使用简体中文 (`zh-CN`)。接口返回的错误信息和成功消息会根据 `locale` 参数返回对应语言。

### 管理端接口

**(需要管理员 Token 认证)**

#### 创建抽奖活动

- **接口地址**: `POST /v1/admin/lottery/create`
- **说明**: 创建一个新的抽奖活动。
- **查询参数**:
  - `locale`: (String) 语言代码，可选值：en/zh-CN/zh-HK，默认 zh-CN
- **请求体** (`application/json`):
  ```json
  {
    "name": "新年大抽奖", // 活动名称 (必填)
    "sponsor": "某赞助商", // 赞助方 (可选)
    "icon": "https://example.com/lottery-icon.png", // 活动图标路径 (可选)
    "background": "https://example.com/lottery-bg.png", // 活动背景图路径 (可选)
    "description": "参与新年抽奖，赢取精美礼品", // 活动描述 (可选)
    "lotteryType": "wheel", // 抽奖形式 (必填, wheel:大转盘, box:盲盒)
    "startTime": "2025-01-01T00:00:00", // 活动开始时间 (必填)
    "endTime": "2025-01-15T23:59:59", // 活动结束时间 (可选)
    "startNow": false, // 是否立即开始 (可选，默认false)
    "activityId": 1001, // 活动ID (可选)
    "activityName": "春节活动" // 活动名称 (可选)
  }
  ```
- **成功响应** (`200 OK`):
  ```json
  {
    "code": 0,
    "msg": "success",
    "data": {
      "lotteryId": 1
    }
  }
  ```

#### 更新抽奖活动

- **接口地址**: `PUT /v1/admin/lottery/update`
- **说明**: 更新指定抽奖活动的信息。根据活动状态不同，允许修改的字段也不同。当活动状态设置为"ended"时，如果奖项中包含代币类型奖项，系统会自动调用第三方 API 退回所有冻结的代币。代币退回时需要提供用户认证信息（uid、uuid、token）。
- **查询参数**:
  - `locale`: (String) 语言代码，可选值：en/zh-CN/zh-HK，默认 zh-CN
- **请求体** (`application/json`):
  ```json
  {
    "id": 1, // 抽奖活动ID (必填)
    "name": "新年大抽奖", // 活动名称 (必填)
    "sponsor": "某赞助商", // 赞助方 (可选)
    "icon": "https://example.com/lottery-icon.png", // 活动图标路径 (可选)
    "background": "https://example.com/lottery-bg.png", // 活动背景图路径 (可选)
    "description": "参与新年抽奖，赢取精美礼品", // 活动描述 (可选)
    "lotteryType": "wheel", // 抽奖形式 (必填, wheel:大转盘, box:盲盒)
    "startTime": "2025-01-01T00:00:00", // 活动开始时间 (必填)
    "endTime": "2025-01-15T23:59:59", // 活动结束时间 (可选)
    "status": "draft", // 活动状态 (可选, draft:草稿, published:已发布, ended:已结束)
    "activityId": 1001, // 活动ID (可选)
    "activityName": "春节活动", // 活动名称 (可选)
    "uid": "user123", // 用户UID (代币奖励时必填)
    "uuid": "uuid-123-456", // 用户UUID (代币奖励时必填)
    "token": "jwt-token-here" // JWT Token (代币奖励时必填)
  }
  ```
- **权限说明**:
  - 只有抽奖活动的创建者可以更新
  - 草稿状态：允许修改所有字段
  - 已发布/已结束状态：只允许修改名称、赞助方、图标、背景图、描述、活动 ID、活动名称，不允许修改抽奖形式、开始时间、结束时间
- **代币退回说明**:
  - 当活动状态从非"ended"变为"ended"时，系统会自动检查该活动是否包含代币类型奖项
  - 如果包含代币类型奖项，系统会自动调用第三方 API `POST /open/act/prepay/return` 退回所有冻结的代币
  - 代币退回失败不会影响活动状态的更新，但会在日志中记录错误信息
- **成功响应** (`200 OK`):
  ```json
  {
    "code": 0,
    "msg": "success",
    "data": "更新成功"
  }
  ```

#### 获取抽奖活动详情

- **接口地址**: `GET /v1/admin/lottery/{id}`
- **说明**: 获取指定抽奖活动的详细信息。
- **路径参数**:
  - `id`: (Integer) 抽奖活动 ID (必填)
- **查询参数**:
  - `locale`: (String) 语言代码，可选值：en/zh-CN/zh-HK，默认 zh-CN
- **成功响应** (`200 OK`):
  ```json
  {
    "code": 0,
    "msg": "success",
    "data": {
      "id": 1,
      "name": "新年大抽奖",
      "sponsor": "某赞助商",
      "icon": "https://example.com/lottery-icon.png",
      "background": "https://example.com/lottery-bg.png",
      "description": "参与新年抽奖，赢取精美礼品",
      "lotteryType": "wheel",
      "startTime": "2025-01-01T00:00:00",
      "endTime": "2025-01-15T23:59:59",
      "status": "draft",
      "createdBy": 1,
      "createdByUsername": "admin",
      "activityId": 1001,
      "activityName": "春节活动",
      "createdAt": "2025-05-07T10:00:00",
      "prizes": [
        {
          "id": 1,
          "lotteryId": 1,
          "level": "特等奖",
          "name": "iPhone 15",
          "image": "https://example.com/iphone.png",
          "probability": 0.1,
          "totalQuantity": 1,
          "remainQuantity": 1
        }
        // ... 更多奖项
      ],
      "rule": {
        "id": 1,
        "lotteryId": 1,
        "drawLimit": 3,
        "dailyLimit": 1,
        "additionalInfo": "每人总共3次机会，每天限1次"
      }
    }
  }
  ```

#### 分页查询抽奖活动列表

- **接口地址**: `GET /v1/admin/lottery/list`
- **说明**: 按条件分页查询抽奖活动列表。
- **查询参数**:
  - `current`: (Integer) 当前页码，默认 1
  - `size`: (Integer) 每页数量，默认 10
  - `name`: (String) 活动名称，模糊查询 (可选)
  - `status`: (String) 状态 (可选)
  - `adminUserId`: (Integer) 管理员用户 ID (可选)，如果提供，则只返回该管理员创建的抽奖活动
  - `locale`: (String) 语言代码，可选值：en/zh-CN/zh-HK，默认 zh-CN
- **成功响应** (`200 OK`):
  ```json
  {
    "code": 0,
    "msg": "success",
    "data": {
      "records": [
        {
          "id": 1,
          "name": "新年大抽奖",
          "sponsor": "某赞助商",
          "icon": "https://example.com/lottery-icon.png",
          "description": "参与新年抽奖，赢取精美礼品",
          "lotteryType": "wheel",
          "startTime": "2025-01-01T00:00:00",
          "endTime": "2025-01-15T23:59:59",
          "status": "published",
          "createdBy": 1,
          "createdByUsername": "admin",
          "createdAt": "2025-05-07T10:00:00"
        }
        // ... 更多活动
      ],
      "total": 100,
      "size": 10,
      "current": 1,
      "pages": 10
    }
  }
  ```

#### 更新抽奖活动状态

- **接口地址**: `PUT /v1/admin/lottery/{id}/status`
- **说明**: 更新指定抽奖活动的状态。当活动状态设置为"ended"时，如果奖项中包含代币类型奖项，系统会自动调用第三方 API 退回所有冻结的代币。代币退回时建议提供用户认证信息（uid、uuid、token）。
- **路径参数**:
  - `id`: (Integer) 抽奖活动 ID (必填)
- **查询参数**:
  - `status`: (String) 新状态 (必填，draft/published/ended)
  - `uid`: (String) 用户 UID (可选，代币奖励时建议提供)
  - `uuid`: (String) 用户 UUID (可选，代币奖励时建议提供)
  - `token`: (String) JWT Token (可选，代币奖励时建议提供)
  - `locale`: (String) 语言代码，可选值：en/zh-CN/zh-HK，默认 zh-CN
- **成功响应** (`200 OK`):
  ```json
  {
    "code": 0,
    "msg": "success",
    "data": "状态更新成功"
  }
  ```

### 用户端接口

#### 获取活动列表

- **接口地址**: `GET /v1/lottery/active`
- **说明**: 获取所有正在进行中的抽奖活动。
- **查询参数**:
  - `locale`: (String) 语言代码，可选值：en/zh-CN/zh-HK，默认 zh-CN
- **成功响应** (`200 OK`):
  ```json
  {
    "code": 0,
    "msg": "success",
    "data": [
      {
        "id": 1,
        "name": "新年大抽奖",
        "sponsor": "某赞助商",
        "icon": "https://example.com/lottery-icon.png",
        "background": "https://example.com/lottery-bg.png",
        "description": "参与新年抽奖，赢取精美礼品",
        "lotteryType": "wheel",
        "startTime": "2025-01-01T00:00:00",
        "endTime": "2025-01-15T23:59:59",
        "status": "published",
        "activityId": 1001,
        "activityName": "春节活动"
      }
      // ... 更多活动
    ]
  }
  ```

#### 获取活动详情

- **接口地址**: `GET /v1/lottery/{id}`
- **说明**: 获取指定抽奖活动的详细信息。
- **路径参数**:
  - `id`: (Integer) 抽奖活动 ID (必填)
- **查询参数**:
  - `uid`: (String) 用户 ID (可选，传入后返回用户剩余抽奖次数)
  - `locale`: (String) 语言代码，可选值：en/zh-CN/zh-HK，默认 zh-CN
- **成功响应** (`200 OK`):
  ```json
  {
    "code": 0,
    "msg": "success",
    "data": {
      "id": 1,
      "name": "新年大抽奖",
      "sponsor": "某赞助商",
      "icon": "https://example.com/lottery-icon.png",
      "background": "https://example.com/lottery-bg.png",
      "description": "参与新年抽奖，赢取精美礼品",
      "lotteryType": "wheel",
      "startTime": "2025-01-01T00:00:00",
      "endTime": "2025-01-15T23:59:59",
      "status": "published",
      "activityId": 1001,
      "activityName": "春节活动",
      "prizes": [
        {
          "id": 1,
          "lotteryId": 1,
          "level": "特等奖",
          "name": "iPhone 15",
          "image": "https://example.com/iphone.png",
          "probability": 0.1
        }
        // ... 更多奖项
      ],
      "rule": {
        "drawLimit": 3,
        "dailyLimit": 1,
        "additionalInfo": "每人总共3次机会，每天限1次"
      },
      "remainingDraws": 0, //此用户的总剩余次数，包含助力获得的次数，传入uid后返回此字段
      "remainingDrawsToday": 0 //此用户的今日剩余次数，传入uid后返回此字段
    }
  }
  ```

#### 参与抽奖

- **接口地址**: `POST /v1/lottery/participate`
- **说明**: 用户参与指定抽奖活动。如果中奖的是代币类型奖项，系统会自动发放代币奖励。当抽奖活动包含代币类型奖项时，uuid 和 token 参数为必填项。
- **查询参数**:
  - `locale`: (String) 语言代码，可选值：en/zh-CN/zh-HK，默认 zh-CN
- **请求体** (`application/json`):
  ```json
  {
    "lotteryId": 1, // 抽奖活动ID (必填)
    "uid": "user123", // 用户ID (必填)
    "uuid": "user-uuid-123", // 用户UUID (代币奖励时必填)
    "token": "jwt-token-here" // JWT Token (代币奖励时必填)
  }
  ```
- **成功响应** (`200 OK`):
  ```json
  {
    "code": 0,
    "msg": "success",
    "data": {
      "isWin": true,
      "prizeId": 1,
      "prizeName": "iPhone 15",
      "prizeLevel": "特等奖",
      "prizeImage": "https://example.com/iphone.png",
      "prizeType": "physical", // physical:实物, token:代币
      "tokenAmount": null, // 代币数量(仅代币类型奖项时返回)
      "tokenSymbol": null // 代币符号(仅代币类型奖项时返回)
    }
  }
  ```

---

## 🌐 好友助力功能接口

好友助力功能允许用户邀请好友助力，每成功助力一次，用户就能获得额外的抽奖次数。

### 国际化支持

所有好友助力功能相关接口都支持国际化，通过 `locale` 参数控制返回语言：

- **参数名**: `locale`
- **类型**: String
- **默认值**: `zh-CN`
- **可选值**:
  - `en`: 英文
  - `zh-CN`: 简体中文 (默认)
  - `zh-HK`: 繁体中文
  - `zh-Hans`: 简体中文 (兼容)
  - `zh-Hant`: 繁体中文 (兼容)

**注意**: 不传递 `locale` 参数时默认使用简体中文 (`zh-CN`)。接口返回的错误信息和成功消息会根据 `locale` 参数返回对应语言。

### 管理端助力管理接口

#### 创建或更新助力配置

- **接口地址**: `POST /v1/admin/lottery/help/config`
- **说明**: 为指定抽奖活动创建或更新好友助力配置（注意：助力邀请现在永不过期）
- **查询参数**:
  - `locale`: (String) 语言代码，可选值：en/zh-CN/zh-HK，默认 zh-CN
- **请求体** (`application/json`):
  ```json
  {
    "lotteryId": 1, // 抽奖活动ID (必填)
    "helpEnabled": true, // 是否启用助力功能 (必填)
    "helpLimit": 5, // 每个用户最多可获得的助力次数 (必填)
    "helpRewardDraws": 2, // 每次助力获得的抽奖次数 (必填)
    "helpDrawsLimit": 20, // 助力抽奖次数上限 (必填)
    "helpRuleDesc": "邀请好友助力，每次助力可获得2次抽奖机会" // 助力规则说明 (可选)
  }
  ```
- **成功响应** (`200 OK`):
  ```json
  {
    "code": 0,
    "msg": "success",
    "data": "配置成功"
  }
  ```

#### 获取助力配置

- **接口地址**: `GET /v1/admin/lottery/help/{lotteryId}/config`
- **说明**: 获取指定抽奖活动的好友助力配置
- **路径参数**:
  - `lotteryId`: (Integer) 抽奖活动 ID (必填)
- **查询参数**:
  - `locale`: (String) 语言代码，可选值：en/zh-CN/zh-HK，默认 zh-CN
- **成功响应** (`200 OK`):
  ```json
  {
    "code": 0,
    "msg": "success",
    "data": {
      "id": 1,
      "lotteryId": 1,
      "helpEnabled": true,
      "helpLimit": 5,
      "helpRewardDraws": 2,
      "helpDrawsLimit": 20,
      "helpExpireHours": 24, // 已弃用，助力邀请永不过期
      "helpRuleDesc": "邀请好友助力，每次助力可获得2次抽奖机会",
      "createdAt": "2025-01-01T10:00:00",
      "updatedAt": "2025-01-01T10:00:00"
    }
  }
  ```

#### 获取助力记录列表

- **接口地址**: `GET /v1/admin/lottery/help/records`
- **说明**: 分页查询助力记录
- **查询参数**:
  - `current`: (Integer) 当前页码，默认 1
  - `size`: (Integer) 每页数量，默认 10
  - `lotteryId`: (Integer) 抽奖活动 ID (可选)
  - `inviterUid`: (String) 邀请人用户 ID (可选)
  - `helperUid`: (String) 助力人用户 ID (可选)
  - `locale`: (String) 语言代码，可选值：en/zh-CN/zh-HK，默认 zh-CN
- **成功响应** (`200 OK`):
  ```json
  {
    "code": 0,
    "msg": "success",
    "data": {
      "records": [
        {
          "id": 1,
          "lotteryId": 1,
          "lotteryName": "新年大抽奖",
          "inviterUid": "user123",
          "helperUid": "friend456",
          "helpTime": "2025-01-01T12:30:00",
          "rewardDraws": 2,
          "status": "valid"
        }
        // ... 更多记录
      ],
      "total": 100,
      "size": 10,
      "current": 1,
      "pages": 10
    }
  }
  ```

#### 获取助力排行榜

- **接口地址**: `GET /v1/admin/lottery/help/{lotteryId}/ranking`
- **说明**: 获取指定抽奖活动的好友助力排行榜
- **路径参数**:
  - `lotteryId`: (Integer) 抽奖活动 ID (必填)
- **查询参数**:
  - `limit`: (Integer) 排行榜数量限制，默认 10
- **成功响应** (`200 OK`):
  ```json
  {
    "code": 0,
    "msg": "success",
    "data": [
      {
        "id": 1,
        "lotteryId": 1,
        "uid": "user123",
        "totalHelpReceived": 15,
        "totalHelpDraws": 15,
        "usedHelpDraws": 5,
        "remainingHelpDraws": 10,
        "lastHelpTime": "2025-01-01T12:30:00",
        "lotteryName": "新年大抽奖",
        "userName": "用户123"
      }
    ]
  }
  ```

### 用户端助力接口

> **重要提醒**：助力邀请现在永不过期！用户创建的邀请链接可以长期使用，直到达到最大助力次数。

#### 获取助力配置

- **接口地址**: `GET /v1/lottery/help/{lotteryId}/config`
- **说明**: 获取指定抽奖活动的好友助力配置（无需认证）
- **路径参数**:
  - `lotteryId`: (Integer) 抽奖活动 ID (必填)
- **查询参数**:
  - `locale`: (String) 语言代码，可选值：en/zh-CN/zh-HK，默认 zh-CN
- **成功响应** (`200 OK`):
  ```json
  {
    "code": 0,
    "msg": "success",
    "data": {
      "id": 1,
      "lotteryId": 1,
      "helpEnabled": true,
      "helpLimit": 5,
      "helpRewardDraws": 2,
      "helpDrawsLimit": 20,
      "helpExpireHours": 24, // 已弃用，助力邀请永不过期
      "helpRuleDesc": "邀请好友助力，每次助力可获得2次抽奖机会",
      "createdAt": "2025-01-01T10:00:00",
      "updatedAt": "2025-01-01T10:00:00"
    }
  }
  ```

#### 创建助力邀请

- **接口地址**: `POST /v1/lottery/help/invite`
- **说明**: 用户创建好友助力邀请
- **查询参数**:
  - `locale`: (String) 语言代码，可选值：en/zh-CN/zh-HK，默认 zh-CN
- **请求体** (`application/json`):
  ```json
  {
    "lotteryId": 1, // 抽奖活动ID (必填)
    "inviterUid": "user123" // 邀请人用户ID (必填)
  }
  ```
- **成功响应** (`200 OK`):
  ```json
  {
    "code": 0,
    "msg": "success",
    "data": {
      "id": 1,
      "lotteryId": 1,
      "inviterUid": "user123",
      "inviteCode": "abc123def456ghi789",
      "inviteUrl": "http://localhost:8081/api/v1/lottery/help/invite/abc123def456ghi789",
      "status": "active",
      "expireTime": null, // 助力邀请永不过期
      "helpCount": 0,
      "maxHelpCount": 5,
      "createdAt": "2025-01-01T12:00:00",
      "updatedAt": "2025-01-01T12:00:00"
    }
  }
  ```

#### 获取我的助力邀请

- **接口地址**: `GET /v1/lottery/help/{lotteryId}/my-invite`
- **说明**: 获取指定用户在指定抽奖活动中的助力邀请
- **路径参数**:
  - `lotteryId`: (Integer) 抽奖活动 ID (必填)
- **查询参数**:
  - `inviterUid`: (String) 邀请人用户 ID (必填)
- **成功响应** (`200 OK`):
  ```json
  {
    "code": 0,
    "msg": "success",
    "data": {
      "id": 1,
      "lotteryId": 1,
      "inviterUid": "user123",
      "inviteCode": "abc123def456ghi789",
      "inviteUrl": "http://localhost:8081/api/v1/lottery/help/invite/abc123def456ghi789",
      "status": "active",
      "expireTime": null, // 助力邀请永不过期
      "helpCount": 3,
      "maxHelpCount": 5,
      "createdAt": "2025-01-01T12:00:00",
      "updatedAt": "2025-01-01T12:00:00"
    }
  }
  ```

#### 获取助力邀请详情

- **接口地址**: `GET /v1/lottery/help/invite/{inviteCode}`
- **说明**: 根据邀请码获取助力邀请详情
- **路径参数**:
  - `inviteCode`: (String) 邀请码 (必填)
- **成功响应** (`200 OK`):
  ```json
  {
    "code": 0,
    "msg": "success",
    "data": {
      "id": 1,
      "lotteryId": 1,
      "inviterUid": "user123",
      "inviteCode": "abc123def456ghi789",
      "inviteUrl": "http://localhost:8081/api/v1/lottery/help/invite/abc123def456ghi789",
      "status": "active",
      "expireTime": null, // 助力邀请永不过期
      "helpCount": 3,
      "maxHelpCount": 5,
      "createdAt": "2025-01-01T12:00:00",
      "updatedAt": "2025-01-01T12:00:00"
    }
  }
  ```

#### 执行助力操作

- **接口地址**: `POST /v1/lottery/help/assist`
- **说明**: 用户通过邀请码为好友助力（无需认证，助力邀请永不过期）
- **查询参数**:
  - `locale`: (String) 语言代码，可选值：en/zh-CN/zh-HK，默认 zh-CN
- **请求体** (`application/json`):
  ```json
  {
    "inviteCode": "abc123def456ghi789", // 邀请码 (必填)
    "helperUid": "friend456", // 助力人用户ID (必填)
    "helperIp": "192.168.1.100", // 助力人IP地址 (可选，系统会自动填充)
    "helperUserAgent": "Mozilla/5.0..." // 助力人用户代理 (可选，系统会自动填充)
  }
  ```
- **成功响应** (`200 OK`):
  ```json
  {
    "code": 0,
    "msg": "success",
    "data": {
      "message": "助力成功！",
      "lotteryId": 12
    }
  }
  ```

#### 获取用户助力统计

- **接口地址**: `GET /v1/lottery/help/{lotteryId}/my-stats`
- **说明**: 获取指定用户在指定抽奖活动中的助力统计
- **路径参数**:
  - `lotteryId`: (Integer) 抽奖活动 ID (必填)
- **查询参数**:
  - `uid`: (String) 用户 ID (必填)
  - `locale`: (String) 语言代码，可选值：en/zh-CN/zh-HK，默认 zh-CN
- **成功响应** (`200 OK`):
  ```json
  {
    "code": 0,
    "msg": "success",
    "data": {
      "lotteryId": 1,
      "uid": "user123",
      "totalHelpReceived": 15,
      "totalHelpDraws": 15,
      "usedHelpDraws": 5,
      "remainingHelpDraws": 10,
      "lastHelpTime": "2025-01-01T12:30:00"
    }
  }
  ```

#### 获取助力排行榜

- **接口地址**: `GET /v1/lottery/help/{lotteryId}/ranking`
- **说明**: 获取指定抽奖活动的好友助力排行榜（无需认证）
- **路径参数**:
  - `lotteryId`: (Integer) 抽奖活动 ID (必填)
- **查询参数**:
  - `limit`: (Integer) 排行榜数量限制，默认 10
- **成功响应** (`200 OK`):
  ```json
  {
    "code": 0,
    "msg": "success",
    "data": [
      {
        "id": 1,
        "lotteryId": 1,
        "uid": "user123",
        "totalHelpReceived": 15,
        "totalHelpDraws": 15,
        "usedHelpDraws": 5,
        "remainingHelpDraws": 10,
        "lastHelpTime": "2025-01-01T12:30:00",
        "lotteryName": "新年大抽奖",
        "userName": "用户123"
      }
    ]
  }
  ```

---

## 🏆 人气王奖励功能接口

人气王奖励功能允许活动创建者为助力排行榜的前几名用户设置奖励，由创建者在活动结束后与人气王中奖者直接联系发放。

### 管理端接口

**(需要管理员 Token 认证，使用现有的 `lottery_manage` 权限)**

#### 创建人气王奖励配置

- **接口地址**: `POST /v1/admin/lottery/popularity-reward/create`
- **说明**: 为指定抽奖活动的指定排名位置创建奖励配置
- **查询参数**:
  - `locale`: (String) 语言代码，可选值：en/zh-CN/zh-HK，默认 zh-CN
- **请求体** (`application/json`):
  ```json
  {
    "lotteryId": 1, // 抽奖活动ID (必填)
    "rankPosition": 1, // 排名位置(1,2,3...) (必填)
    "rewardTitle": "冠军奖励", // 奖励标题 (必填)
    "rewardImage": "https://example.com/reward1.png" // 奖励图片URL (可选)
  }
  ```
- **成功响应** (`200 OK`):
  ```json
  {
    "code": 0,
    "msg": "success",
    "data": {
      "rewardId": 1
    }
  }
  ```

#### 更新人气王奖励配置

- **接口地址**: `PUT /v1/admin/lottery/popularity-reward/update`
- **说明**: 更新指定人气王奖励配置的信息
- **查询参数**:
  - `locale`: (String) 语言代码，可选值：en/zh-CN/zh-HK，默认 zh-CN
- **请求体** (`application/json`):
  ```json
  {
    "id": 1, // 奖励ID (必填)
    "rewardTitle": "冠军奖励", // 奖励标题 (可选)
    "rewardImage": "https://example.com/reward1.png" // 奖励图片URL (可选)
  }
  ```
- **成功响应** (`200 OK`):
  ```json
  {
    "code": 0,
    "msg": "success",
    "data": "更新成功"
  }
  ```

#### 获取奖励配置列表

- **接口地址**: `GET /v1/admin/lottery/popularity-reward/list/{lotteryId}`
- **说明**: 获取指定抽奖活动的所有人气王奖励配置
- **路径参数**:
  - `lotteryId`: (Integer) 抽奖活动 ID (必填)
- **查询参数**:
  - `locale`: (String) 语言代码，可选值：en/zh-CN/zh-HK，默认 zh-CN
- **成功响应** (`200 OK`):
  ```json
  {
    "code": 0,
    "msg": "success",
    "data": [
      {
        "id": 1,
        "lotteryId": 1,
        "rankPosition": 1,
        "rewardTitle": "冠军奖励",
        "rewardImage": "https://example.com/reward1.png"
      },
      {
        "id": 2,
        "lotteryId": 1,
        "rankPosition": 2,
        "rewardTitle": "亚军奖励",
        "rewardImage": "https://example.com/reward2.png"
      }
    ]
  }
  ```

#### 删除人气王奖励配置

- **接口地址**: `DELETE /v1/admin/lottery/popularity-reward/{id}`
- **说明**: 删除指定的人气王奖励配置
- **路径参数**:
  - `id`: (Integer) 奖励配置 ID (必填)
- **查询参数**:
  - `locale`: (String) 语言代码，可选值：en/zh-CN/zh-HK，默认 zh-CN
- **成功响应** (`200 OK`):
  ```json
  {
    "code": 0,
    "msg": "success",
    "data": "删除成功"
  }
  ```

### 用户端接口

#### 获取奖励配置列表

- **接口地址**: `GET /v1/lottery/popularity-reward/list/{lotteryId}`
- **说明**: 获取指定抽奖活动的所有人气王奖励配置（无需认证）
- **路径参数**:
  - `lotteryId`: (Integer) 抽奖活动 ID (必填)
- **查询参数**:
  - `locale`: (String) 语言代码，可选值：en/zh-CN/zh-HK，默认 zh-CN
- **成功响应** (`200 OK`):
  ```json
  {
    "code": 0,
    "msg": "success",
    "data": [
      {
        "id": 1,
        "lotteryId": 1,
        "rankPosition": 1,
        "rewardTitle": "冠军奖励",
        "rewardImage": "https://example.com/reward1.png"
      },
      {
        "id": 2,
        "lotteryId": 1,
        "rankPosition": 2,
        "rewardTitle": "亚军奖励",
        "rewardImage": "https://example.com/reward2.png"
      }
    ]
  }
  ```

### 功能说明

1. **奖励配置管理**：创建者可以为每个排名位置设置对应的奖励
2. **排行榜展示**：配合现有的 `GET /v1/lottery/help/{lotteryId}/ranking` 接口展示助力排行榜
3. **奖励发放**：由创建者根据排行榜联系获奖者进行奖励发放
4. **权限控制**：使用现有的 `lottery_manage` 权限，无需新增权限

### 业务流程

1. **配置阶段**：活动创建者为每个排名位置设置奖励配置
2. **展示阶段**：用户查看奖励配置和助力排行榜
3. **活动结束后**：创建者根据最终排行榜联系获奖者
4. **奖励发放**：创建者与获奖者直接联系进行奖励发放
