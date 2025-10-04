# 聊天室模块 API 文档

## 基础信息

- **基础路径**: `/api/chat`
- **测试路径**: `/api/chat/test` (无需认证)
- **认证方式**: HMAC-SHA256 签名认证
- **WebSocket**: `/api/ws/chat`

## 认证机制

正式 API 需要 HMAC-SHA256 签名认证：

### 认证说明

接口需要在请求头中包含以下认证信息：

```
X-App-Id: your_app_id
X-Timestamp: 1716621925（秒时间戳）
X-Signature: calculated_hmac_sha256_signature
```

**签名计算方式**：

```
signature = HMAC-SHA256(app_secret, app_id + timestamp)
```

-- app_id 和 app_secret 单独提供

**签名计算步骤**：

1. 将 `app_id`、`timestamp` 按顺序拼接成字符串
2. 使用 `app_secret` 作为密钥，对拼接字符串进行 HMAC-SHA256 计算
3. 将结果转换为小写十六进制字符串

**示例**：

```javascript
// JavaScript 示例
const crypto = require("crypto");

const appId = "test_app";
const appSecret = "test_secret_123456";
const timestamp = Math.floor(Date.now() / 1000).toString();

const data = appId + timestamp;
const signature = crypto
  .createHmac("sha256", appSecret)
  .update(data)
  .digest("hex");

// 请求头
const headers = {
  "X-App-Id": appId,
  "X-Timestamp": timestamp,
  "X-Signature": signature,
  "Content-Type": "application/json",
};
```

## 错误代码

| 代码 | 说明           |
| ---- | -------------- |
| 0    | 成功           |
| 400  | 请求参数错误   |
| 401  | 认证失败       |
| 403  | 权限不足       |
| 404  | 资源不存在     |
| 500  | 服务器内部错误 |

## API 接口

### 1. 房间管理

#### 1.1 创建聊天室

- **URL**: `POST /chat/room/create`
- **描述**: 创建新的聊天室
- **请求参数**:

```json
{
  "creatorUid": "user001",
  "creatorName": "张三",
  "creatorAvatar": "https://example.com/avatar.jpg",
  "roomName": "我的聊天室",
  "roomNumber": "10001",
  "description": "这是一个技术交流群"
}
```

**字段说明**:

- `roomNumber`: 群号（可选）
- `description`: 群介绍（可选）

- **响应示例**:

```json
{
  "code": 0,
  "msg": "success",
  "data": {
    "roomId": "room_abc123...",
    "roomName": "我的聊天室"
  }
}
```

#### 1.2 加入聊天室

- **URL**: `POST /chat/room/join`
- **描述**: 用户加入指定聊天室
- **请求参数**:

```json
{
  "uid": "user002",
  "name": "李四",
  "avatar": "https://example.com/avatar2.jpg",
  "roomId": "room_abc123...",
  "isMuted": 0
}
```

- **响应示例**:

```json
{
  "code": 0,
  "msg": "success",
  "data": {
    "roomId": "room_abc123...",
    "roomName": "我的聊天室"
  }
}
```

#### 1.3 获取聊天室成员列表

- **URL**: `GET /chat/room/{roomId}/members`
- **描述**: 获取指定聊天室的所有成员信息（不分页）
- **路径参数**:
  - `roomId`: 聊天室 ID
- **响应示例**:

```json
{
  "code": 0,
  "msg": "success",
  "data": [
    {
      "uid": "user001",
      "name": "张三",
      "avatar": "https://example.com/avatar.jpg",
      "joinedAt": "2025-05-29T20:30:00",
      "isMuted": 0
    },
    {
      "uid": "user002",
      "name": "李四",
      "avatar": "https://example.com/avatar2.jpg",
      "joinedAt": "2025-05-29T20:35:00",
      "isMuted": 0
    }
  ]
}
```

#### 1.3.1 分页获取聊天室成员列表

- **URL**: `GET /chat/room/{roomId}/members/paged?pageNum={pageNum}&pageSize={pageSize}`
- **描述**: 分页获取指定聊天室的成员信息
- **路径参数**:
  - `roomId`: 聊天室 ID
- **查询参数**:
  - `pageNum`: 页码 (默认: 1)
  - `pageSize`: 每页大小 (默认: 20)
- **响应示例**:

```json
{
  "code": 0,
  "msg": "success",
  "data": {
    "records": [
      {
        "uid": "user001",
        "name": "张三",
        "avatar": "https://example.com/avatar.jpg",
        "joinedAt": "2025-05-29T20:30:00",
        "isMuted": 0
      }
    ],
    "total": 100,
    "size": 20,
    "current": 1,
    "pages": 5
  }
}
```

#### 1.4 获取聊天室消息记录

- **URL**: `GET /chat/room/{roomId}/messages?count={count}&msgId={msgId}&uid={uid}&clearUnread={clearUnread}`
- **描述**: 获取指定聊天室的最近消息记录
- **路径参数**:
  - `roomId`: 聊天室 ID
- **查询参数**:
  - `count`: 获取消息数量 (默认: 20, 最大: 100)
  - `msgId`: 消息 ID (可选)
    - 如果不传此参数，返回最新的 count 条消息
    - 如果传入此参数，返回距离此消息 ID 之前最近的 count 条消息（用于历史消息翻页）
  - `uid`: 用户 ID (可选)
  - `clearUnread`: 是否清除未读消息 (默认: false)
    - true: 查看消息时自动清除该用户在此房间的未读消息
    - false: 只查看消息，不清除未读消息（推荐默认行为）
- **响应示例**:

```json
{
  "code": 0,
  "msg": "success",
  "data": [
    {
      "id": 1001,
      "roomId": "room_abc123...",
      "senderUid": "user001",
      "senderName": "张三",
      "senderAvatar": "https://example.com/avatar.jpg",
      "content": "大家好！",
      "sentAt": "2025-05-29T20:45:30"
    },
    {
      "id": 1002,
      "roomId": "room_abc123...",
      "senderUid": "user002",
      "senderName": "李四",
      "senderAvatar": "https://example.com/avatar2.jpg",
      "content": "你好！",
      "sentAt": "2025-05-29T20:46:15"
    }
  ]
}
```

#### 1.5 获取聊天室列表

- **URL**: `GET /chat/rooms?uid={uid}`
- **描述**: 获取聊天室列表
- **查询参数**:
  - `uid`: 用户 ID (可选)
    - 当 uid 不为空时：返回该用户所在的聊天室列表
    - 当 uid 为空或不传时：返回所有聊天室列表
- **响应示例**:

```json
{
  "code": 0,
  "msg": "success",
  "data": [
    {
      "roomId": "room_abc123...",
      "roomName": "技术交流群",
      "creatorUid": "user001",
      "creatorName": "张三",
      "creatorAvatar": "https://example.com/avatar.jpg",
      "createdAt": "2025-05-29T20:30:00",
      "memberCount": 15,
      "lastMessage": "今天的技术分享很棒！",
      "lastMessageTime": "2025-05-29T21:15:30",
      "isMember": true
    },
    {
      "roomId": "room_def456...",
      "roomName": "产品讨论组",
      "creatorUid": "user003",
      "creatorName": "王五",
      "creatorAvatar": "https://example.com/avatar3.jpg",
      "createdAt": "2025-05-29T19:45:00",
      "memberCount": 8,
      "lastMessage": "新功能需求已收到",
      "lastMessageTime": "2025-05-29T20:58:45",
      "isMember": false
    }
  ]
}
```

#### 1.6 获取聊天群详情

- **URL**: `GET /chat/room/{roomId}/detail`
- **描述**: 获取指定聊天室的详细信息
- **路径参数**:
  - `roomId`: 聊天室 ID
- **响应示例**:

```json
{
  "code": 0,
  "msg": "success",
  "data": {
    "roomId": "room_abc123...",
    "roomName": "技术交流群",
    "roomNumber": "10001",
    "description": "这是一个专门讨论技术问题的群聊",
    "announcement": "<h3>欢迎大家</h3><p>这里是技术交流群的群公告，支持富文本格式</p>",
    "announcementUpdatedAt": "2025-01-20T14:30:00",
    "creatorUid": "user001",
    "creatorName": "张三",
    "creatorAvatar": "https://example.com/avatar.jpg",
    "createdAt": "2025-05-29T20:30:00",
    "memberCount": 15
  }
}
```

**字段说明**：

- `roomId`: 聊天室 ID
- `roomName`: 聊天室名称
- `roomNumber`: 群号
- `description`: 群介绍
- `announcement`: 群公告（富文本格式，可能为空）
- `announcementUpdatedAt`: 公告修改时间（当公告被修改时自动更新，可能为空）
- `creatorUid`: 创建者用户 ID
- `creatorName`: 创建者用户名
- `creatorAvatar`: 创建者头像 URL
- `createdAt`: 聊天室创建时间
- `memberCount`: 群成员数量

#### 1.6.1 批量获取聊天群详情

- **URL**: `POST /chat/rooms/details`
- **描述**: 批量获取多个聊天室的详细信息
- **请求体**: 字符串数组，包含要查询的聊天室 ID

```json
["room_abc123...", "room_def456...", "room_ghi789..."]
```

- **限制**:

  - 最多支持一次查询 100 个房间
  - roomIds 数组不能为空

- **响应示例**:

```json
{
  "code": 0,
  "msg": "success",
  "data": [
    {
      "roomId": "room_abc123...",
      "roomName": "技术交流群",
      "roomNumber": "10001",
      "description": "这是一个专门讨论技术问题的群聊",
      "announcement": "<h3>欢迎大家</h3><p>这里是技术交流群的群公告，支持富文本格式</p>",
      "announcementUpdatedAt": "2025-01-20T14:30:00",
      "creatorUid": "user001",
      "creatorName": "张三",
      "creatorAvatar": "https://example.com/avatar.jpg",
      "createdAt": "2025-05-29T20:30:00",
      "memberCount": 15
    },
    {
      "roomId": "room_def456...",
      "roomName": "产品讨论组",
      "roomNumber": "10002",
      "description": "产品相关讨论",
      "announcement": "<h3>欢迎大家</h3><p>这里是产品讨论组的群公告，支持富文本格式</p>",
      "announcementUpdatedAt": "2025-01-20T14:30:00",
      "creatorUid": "user002",
      "creatorName": "李四",
      "creatorAvatar": "https://example.com/avatar2.jpg",
      "createdAt": "2025-05-29T19:45:00",
      "memberCount": 8
    }
  ]
}
```

**注意事项**:

- 如果某个 roomId 对应的聊天室不存在，该 roomId 将不会出现在返回结果中
- 返回结果的顺序与请求中 roomIds 的顺序保持一致
- 支持单次查询 1-100 个房间

#### 1.7 更新群信息

- **URL**: `POST /chat/room/update`
- **描述**: 更新聊天室的基本信息（群名称、群号、群介绍）
- **请求参数**:

```json
{
  "roomId": "room_abc123...",
  "roomName": "新的群名称",
  "roomNumber": "10002",
  "description": "更新后的群介绍",
  "announcement": "<h3>欢迎大家</h3><p>这里是技术交流群的群公告，支持富文本格式</p>"
}
```

**字段说明**:

- `roomId`: 群 ID（必填）
- `roomName`: 群名称（可选，不传则不更新）
- `roomNumber`: 群号（可选，不传则不更新）
- `description`: 群介绍（可选，不传则不更新）
- `announcement`：群公告（可选，不传则不更新，富文本格式，更新时会自动更新公告修改时间）

**特别说明**：

- 当更新 `announcement` 字段时，系统会自动更新 `announcementUpdatedAt` 字段为当前时间
- 只更新其他字段时，`announcementUpdatedAt` 字段保持不变

- **响应示例**:

```json
{
  "code": 0,
  "msg": "success",
  "data": "群信息更新成功"
}
```

#### 1.8 移除群成员

- **URL**: `POST /chat/room/remove-members`
- **描述**: 从聊天室中移除一个或多个成员
- **请求参数**:

```json
{
  "roomId": "room_abc123...",
  "uids": ["user002", "user003", "user004"]
}
```

**字段说明**:

- `roomId`: 群 ID（必填）
- `uids`: 要移除的用户 ID 列表（必填，支持批量操作）

- **响应示例**:

```json
{
  "code": 0,
  "msg": "success",
  "data": "成员移除成功"
}
```

### 2. 用户管理

#### 2.1 更新禁言状态

- **URL**: `POST /chat/room/mute`
- **描述**: 更新用户在聊天室中的禁言状态
- **请求参数**:

```json
{
  "roomId": "room_abc123...",
  "uid": "user002",
  "isMuted": 1
}
```

- **响应示例**:

```json
{
  "code": 0,
  "msg": "success",
  "data": "禁言状态更新成功"
}
```

### 3. 消息管理

#### 3.1 查询未读消息

- **URL**: `GET /chat/unread?uid={uid}`
- **描述**: 查询用户的未读消息统计
- **查询参数**:
  - `uid`: 用户 ID
- **响应示例**:

```json
{
  "code": 0,
  "msg": "success",
  "data": {
    "unreadCount": 5,
    "roomList": [
      {
        "roomId": "room_abc123...",
        "unread": 3
      },
      {
        "roomId": "room_def456...",
        "unread": 2
      }
    ]
  }
}
```

#### 3.2 清除未读消息

- **URL**: `POST /chat/unread/clear`
- **描述**: 清除用户在指定聊天室的未读消息
- **请求参数**:
  - `uid`: 用户 ID (查询参数)
  - `roomId`: 聊天室 ID (查询参数)

**示例请求**:

```
POST /chat/unread/clear?uid=user001&roomId=room_abc123...
```

- **响应示例**:

```json
{
  "code": 0,
  "msg": "success",
  "data": "未读消息清除成功"
}
```

## WebSocket 实时通信

### 连接

#### 正式用户连接

```javascript
const ws = new WebSocket(
  "ws://localhost:8081/api/ws/chat?uid=user001&name=张三&avatar=avatar.jpg"
);
```

#### 临时用户连接（访客模式）

```javascript
// 临时用户ID必须以"temp_"开头
const ws = new WebSocket(
  "ws://localhost:8081/api/ws/chat?uid=temp_" + Date.now() + "&name=访客"
);
```

**说明**:

- 临时用户 ID 必须以 `temp_` 开头
- 临时用户的 `name` 和 `avatar` 参数是可选的，如果不提供会使用默认值
- 临时用户只能接收消息，不能发送消息
- 临时用户不需要加入聊天室成员列表，但可以接收实时消息广播
- 临时用户同样需要进行心跳检测

### 加入房间

```javascript
ws.send(
  JSON.stringify({
    action: "join",
    roomId: "room_abc123...",
  })
);
```

### 发送消息

```javascript
ws.send(
  JSON.stringify({
    action: "message",
    roomId: "room_abc123...",
    text: "你好，大家！",
  })
);
```

### 接收消息类型

#### 操作响应

```json
{
  "type": "response",
  "action": "join",
  "status": "success",
  "message": "成功加入房间: room_abc123...",
  "timestamp": "2025-05-29T20:45:30"
}
```

#### 广播消息

```json
{
  "type": "broadcast",
  "action": "newMessage",
  "roomId": "room_abc123...",
  "senderUid": "user002",
  "senderName": "李四",
  "senderAvatar": "https://example.com/avatar2.jpg",
  "content": "你好，大家！",
  "timestamp": "2025-05-29T20:45:30"
}
```

## 配置说明

### WebSocket 配置

- 连接超时: 90 秒（3 个心跳周期）
- 心跳间隔: 20 秒（服务器主动检测）
- 客户端心跳: 支持 "ping"/"pong" 和 JSON 格式心跳
- 消息大小限制: 64KB
- 支持跨域: 是
- **临时用户支持**: 支持以 `temp_` 开头的用户 ID 连接（访客模式）

### 临时用户特性

- **连接方式**: 使用 `temp_` 前缀的用户 ID
- **参数要求**: `uid` 必需，`name` 和 `avatar` 可选
- **功能限制**:
  - ✅ 可以连接 WebSocket
  - ✅ 可以加入聊天室（访客模式）
  - ✅ 可以接收实时消息广播
  - ✅ 需要进行心跳检测
  - ❌ 不能发送消息
  - ❌ 不会被加入聊天室成员列表
  - ❌ 不进行数据库操作（权限检查、未读消息等）
- **日志标识**: 系统日志中会标识为"临时用户"

**客户端心跳示例**:

1. 简单字符串心跳:

```javascript
// 发送
ws.send("ping");
// 收到回复: "pong"
```

2. JSON 格式心跳:

```javascript
// 发送
ws.send(JSON.stringify({ action: "heartbeat" }));
// 收到回复: {"type":"response","action":"heartbeat","status":"success","message":"心跳响应","timestamp":"..."}
```

3. WebSocket Ping/Pong (自动):

```javascript
// 浏览器会自动响应服务器的 Ping 帧
// 建议客户端也主动发送 ping 消息
```
