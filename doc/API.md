# Dao Game 平台后台服务 API 文档

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

## 🧩 模块目录

1. [认证接口](#%EF%B8%8F-1-%E8%AE%A4%E8%AF%81%E6%8E%A5%E5%8F%A3)
2. [应用上架接口 (所有者)](#%EF%B8%8F-2-%E5%BA%94%E7%94%A8%E4%B8%8A%E6%9E%B6%E6%8E%A5%E5%8F%A3-%E6%89%80%E6%9C%89%E8%80%85)
3. [SKY 代币接口 (所有者)](#-3-sky-%E4%BB%A3%E5%B8%81%E6%8E%A5%E5%8F%A3-%E6%89%80%E6%9C%89%E8%80%85)
4. [数据追踪接口](#-4-%E6%95%B0%E6%8D%AE%E8%BF%BD%E8%B8%AA%E6%8E%A5%E5%8F%A3)
5. [用户信息接口 (第三方)](#-5-%E7%94%A8%E6%88%B7%E4%BF%A1%E6%81%AF%E6%8E%A5%E5%8F%A3-%E7%AC%AC%E4%B8%89%E6%96%B9)
6. [后台管理接口 (管理员)](#-6-%E5%90%8E%E5%8F%B0%E7%AE%A1%E7%90%86%E6%8E%A5%E5%8F%A3-%E7%AE%A1%E7%90%86%E5%91%98)
   - [用户管理](#%E7%94%A8%E6%88%B7%E7%AE%A1%E7%90%86)
   - [角色管理](#%E8%A7%92%E8%89%B2%E7%AE%A1%E7%90%86)
   - [权限管理](#%E6%9D%83%E9%99%90%E7%AE%A1%E7%90%86)
   - [应用管理](#%E5%BA%94%E7%94%A8%E7%AE%A1%E7%90%86)
   - [所有者管理](#%E6%89%80%E6%9C%89%E8%80%85%E7%AE%A1%E7%90%86)
7. [审核接口 (管理员)](#-7-%E5%AE%A1%E6%A0%B8%E6%8E%A5%E5%8F%A3-%E7%AE%A1%E7%90%86%E5%91%98)
8. [推广管理接口 (管理员)](#-8-%E6%8E%A8%E5%B9%BF%E7%AE%A1%E7%90%86%E6%8E%A5%E5%8F%A3-%E7%AE%A1%E7%90%86%E5%91%98)
9. [财务管理接口 (管理员)](#-9-%E8%B4%A2%E5%8A%A1%E7%AE%A1%E7%90%86%E6%8E%A5%E5%8F%A3-%E7%AE%A1%E7%90%86%E5%91%98)
10. [H5 接口]
11. [抽奖活动接口](#-11-%E6%8A%BD%E5%A5%96%E6%B4%BB%E5%8A%A8%E6%8E%A5%E5%8F%A3)
    - [管理端接口](#%E7%AE%A1%E7%90%86%E7%AB%AF%E6%8E%A5%E5%8F%A3)
    - [用户端接口](#%E7%94%A8%E6%88%B7%E7%AB%AF%E6%8E%A5%E5%8F%A3)
    - [好友助力功能](#%E5%A5%BD%E5%8F%8B%E5%8A%A9%E5%8A%9B%E5%8A%9F%E8%83%BD)

---

## 👤 1. 认证接口

### 所有者登录

- **接口地址**: `POST /v1/auth/login`
- **说明**: 游戏/应用所有者登录接口。
- **请求体** (`application/json`):
  ```json
  {
    "email": "owner@example.com", // 邮箱 (必填, 格式需正确)
    "password": "password123" // 密码 (必填)
  }
  ```
- **成功响应** (`200 OK`):
  ```json
  {
    "code": 0,
    "msg": "success",
    "data": {
      "token": "jwt.token.string",
      "owner": {
        "id": 1,
        "name": "示例所有者",
        "email": "owner@example.com",
        "balance": 100.0,
        "createdAt": "2025-05-07 10:00:00",
        "isDeleted": 0
      }
    }
  }
  ```
- **失败响应** (示例: 邮箱或密码错误):
  ```json
  {
    "code": 400,
    "msg": "邮箱或密码错误",
    "data": null
  }
  ```

### 所有者注册

- **接口地址**: `POST /v1/auth/register`
- **说明**: 游戏/应用所有者注册接口。
- **请求体** (`application/json`):
  ```json
  {
    "name": "新所有者", // 名称 (必填, 2-50字符)
    "email": "newowner@example.com", // 邮箱 (必填, 格式需正确, 且未被注册)
    "password": "newpassword123" // 密码 (必填, 6-20字符)
  }
  ```
- **成功响应** (`200 OK`):
  ```json
  {
    "code": 0,
    "msg": "注册成功",
    "data": "注册成功"
  }
  ```
- **失败响应** (示例: 邮箱已被注册):
  ```json
  {
    "code": 400,
    "msg": "该邮箱已被注册",
    "data": null
  }
  ```

### 管理员登录

- **接口地址**: `POST /v1/auth/admin/login`
- **说明**: 后台管理员登录接口。
- **请求体** (`application/json`):
  ```json
  {
    "username": "admin", // 用户名 (必填)
    "password": "admin123" // 密码 (必填)
  }
  ```
- **成功响应** (`200 OK`):
  ```json
  {
    "code": 0,
    "msg": "success",
    "data": {
      "token": "jwt.admin.token.string",
      "admin": {
        "id": 1,
        "username": "admin",
        "realName": "系统管理员",
        "roleId": 1,
        "lastLoginTime": "2025-05-07 10:05:00",
        "status": 1,
        "createdAt": "2025-05-07 09:00:00",
        "updatedAt": "2025-05-07 10:05:00",
        "isDeleted": 0
      }
    }
  }
  ```
- **失败响应** (示例: 用户名或密码错误):
  ```json
  {
    "code": 400,
    "msg": "用户名或密码错误",
    "data": null
  }
  ```

---

## 📦 2. 应用上架接口 (所有者)

**(需要所有者 Token 认证)**

### 提交上架申请

- **接口地址**: `POST /v1/apply/submit`
- **说明**: 开发者提交游戏/应用的上架信息。
- **请求体** (`application/json`):
  ```json
  {
    "name": "开心消消乐 H5", // 应用名称 (必填, 最多100字符)
    "type": "Game", // 类型 (必填, Game/应用)
    "url": "https://game.example.com/xxl", // 链接 (必填, 最多255字符)
    "icon": "https://icon.example.com/xxl.png", // 图标 URL (可选)
    "description": "一款经典的消除类休闲游戏", // 描述 (可选, 最多1000字符)
    "tags": "休闲,消除,益智", // 标签 (可选, 逗号分隔, 最多255字符)
    "embedUrl": "https://game.example.com/embed/xxl", // 嵌入URL (可选, 最多255字符)
    "coverImage": "https://img.example.com/cover/xxl.jpg" // 封面图片 (可选, 最多255字符)
  }
  ```
- **成功响应** (`200 OK`):
  ```json
  {
    "code": 0,
    "msg": "申请成功",
    "data": "申请成功"
  }
  ```

### 获取开发者的游戏/应用列表

- **接口地址**: `GET /v1/apply/my`
- **说明**: 开发者获取自己提交的游戏/应用列表。
- **请求参数**: 无
- **成功响应** (`200 OK`):
  ```json
  {
    "code": 0,
    "msg": "success",
    "data": [
      {
        "id": 123,
        "ownerId": 1,
        "name": "开心消消乐 H5",
        "type": "Game",
        "url": "https://game.example.com/xxl",
        "icon": "https://icon.example.com/xxl.png",
        "description": "一款经典的消除类休闲游戏",
        "tags": "休闲,消除,益智",
        "status": "Pending", // Pending, Approved, Rejected
        "visible": 0, // 0 不可见, 1 可见
        "createdAt": "2025-05-07 10:10:00",
        "reviewedAt": null,
        "reviewRemark": null,
        "isDeleted": 0
      }
      // ...更多应用
    ]
  }
  ```

### 获取游戏/应用详情

- **接口地址**: `GET /v1/apply/{id}`
- **说明**: 获取指定 ID 的游戏/应用详情，包含所有者名称。
- **路径参数**:
  - `id`: (Integer) 应用 ID (必填)
- **成功响应** (`200 OK`):
  ```json
  {
    "code": 0,
    "msg": "success",
    "data": {
      "id": 123,
      "ownerId": 1,
      "ownerName": "示例所有者",
      "name": "开心消消乐 H5",
      "type": "Game",
      "url": "https://game.example.com/xxl",
      "icon": "https://icon.example.com/xxl.png",
      "description": "一款经典的消除类休闲游戏",
      "tags": "休闲,消除,益智",
      "status": "Approved",
      "visible": 1,
      "isRecommend": 1,
      "clickCount": 1234,
      "createdAt": "2025-05-07 10:10:00",
      "reviewedAt": "2025-05-07 11:30:00",
      "reviewRemark": "内容合规",
      "isDeleted": 0,
      "isRecommend": 0,
      "coverImage": "https://picsum.photos/400/300?random=103",
      "embedUrl": "https://game.example.com/embedurl/xxl",
      "externalUrl": null,
      "views": 3,
      "category": null,
      "updatedAt": "2025-05-12T15:16:07"
    }
  }
  ```
- **失败响应** (示例: 应用不存在):
  ```json
  {
    "code": 404,
    "msg": "应用不存在",
    "data": null
  }
  ```

---

## 💰 3. SKY 代币接口 (所有者)

**(需要所有者 Token 认证)**

### 获取 SKY 代币余额

- **接口地址**: `GET /v1/sky/balance`
- **说明**: 获取当前登录所有者的 SKY 代币余额。
- **请求参数**: 无
- **成功响应** (`200 OK`):
  ```json
  {
    "code": 0,
    "msg": "success",
    "data": {
      "balance": 100.0
    }
  }
  ```

### 获取充值记录

- **接口地址**: `GET /v1/sky/recharges`
- **说明**: 获取当前登录所有者的 SKY 代币充值记录 (只返回成功的记录)。
- **请求参数**: 无
- **成功响应** (`200 OK`):
  ```json
  {
    "code": 0,
    "msg": "success",
    "data": [
      {
        "id": 1,
        "ownerId": 1,
        "amount": 50.0,
        "transactionId": "tx123456",
        "status": 1,
        "timestamp": "2025-05-07 11:00:00",
        "isDeleted": 0
      }
      // ...更多记录
    ]
  }
  ```

### 获取消耗记录

- **接口地址**: `GET /v1/sky/consumptions`
- **说明**: 获取当前登录所有者的 SKY 代币消耗记录。
- **查询参数**:
  - `startDate`: (String) 开始日期 (可选, 格式: yyyy-MM-dd)
  - `endDate`: (String) 结束日期 (可选, 格式: yyyy-MM-dd)
- **成功响应** (`200 OK`):
  ```json
  {
    "code": 0,
    "msg": "success",
    "data": [
      {
        "id": 1,
        "ownerId": 1,
        "gameappId": 123,
        "costType": "CPA",
        "amount": 0.01,
        "count": 1,
        "date": "2025-05-07",
        "isDeleted": 0
      }
      // ...更多记录
    ]
  }
  ```

### 充值 SKY 代币 (模拟)

- **接口地址**: `POST /v1/sky/recharge`
- **说明**: 模拟为当前登录所有者充值 SKY 代币。
- **查询参数**:
  - `amount`: (BigDecimal) 充值金额 (必填, 需大于 0)
  - `transactionId`: (String) 第三方交易单号 (可选)
- **成功响应** (`200 OK`):
  ```json
  {
    "code": 0,
    "msg": "充值成功",
    "data": "充值成功"
  }
  ```

---

## 📊 4. 数据追踪接口

**(此章节已移动，相关接口现在位于 H5 接口部分)**

---

## 🔌 5. 用户信息接口 (第三方)

**(无 Token 认证, 用于第三方平台验证和获取用户信息)**

### 获取用户信息

- **接口地址**: `GET /open/redpacket/my/info`
- **说明**: 第三方平台根据提供的所有者 Token 获取用户基础信息。
- **查询参数**:
  - `uuid`: (String) 用户 (必填)
  - `token`: (String) 所有者登录后获取的 JWT Token (必填)
  - `uid`: (String) 用户 UID (必填)
- **成功响应** (`200 OK`):
  ```json
  {
    "attachment": {
      "openid": null,
      "uid": "149819",
      "uuid": "56acd6473ba04257958c1d8817204137",
      "openName": "zjh",
      "avatar": null,
      "ref": "9D2A4I9R",
      "channel": null
    },
    "message": null,
    "status": 200
  }
  ```
- **失败响应** (示例: Token 无效或过期):
  ```json
  {
    "attachment": null,
    "status": 9999,
    "message": "token验证失败"
  }
  ```

### 用户登录

- **接口地址**: `POST /user/signin`
- **说明**: 此接口可以让用户通过邮箱和密码来登陆。
- **查询参数**:
  - `uuid`: (String) 用户 (选填)
  - `token`: (String) 所有者登录后获取的 JWT Token (选填)
  - `uid`: (String) 用户 UID (选填)
  - `phone`: (String) 邮箱 (必填)
  - `password`: (String) 密码 (必填)
  - `source`: (String) 来源 1web 2app (必填)
- **成功响应** (`200 OK`):
  ```json
  {
    "attachment": {
      "uid": 149911,
      "uuid": "533997066ee2405f838c1a6a0b6d1f1e",
      "token": "VI3cNhrpdpVVnloT9voEDwrFxPC4Jbdz",
      "uname": null,
      "phone": null,
      "email": "4****@qq.com",
      "point": null,
      "isShow": null
    },
    "message": null,
    "status": 200
  }
  ```
- **失败响应** (示例: 用户名或密码错误):
  ```json
  {
    "attachment": null,
    "message": "用戶名或密碼錯誤",
    "status": 405
  }
  ```

### 根据链 id 获取资产

- **接口地址**: `GET /wallet/assets`
- **说明**: 此接口可以将用户创建的活动奖项预缴 token 进行冻结
- **查询参数（Query）**:
  - `uuid`: (String) 用户
  - `token`: (String) 所有者登录后获取的 JWT Token
  - `uid`: (String) 用户 UID
  - `chainId`: (string) 链 ID,TON 链 322，BSC 链 201
  - `local`: (string) 地区，默认使用“zh_CN”
  - `pageIndex`: (int) 页码
  - `pageSize`: (int) 每页记录数
- **成功响应** (`200 OK`):
  ```json
  {
    "attachment": {
      "total": 1451148.73,
      "assets": [
        {
          "currencyId": 4,
          "currencyType": 2,
          "currencyName": "泰达币",
          "currencyNameEn": "USDT",
          "icoUrl": "https://t-img.aisky.vip/mgr/USDT.png",
          "point_num": 4,
          "point_price": 4,
          "status": 1,
          "price": 7.2562,
          "priceUsdt": 1,
          "initPrice": 7.11,
          "actions": "充币,提币,买入,卖出,转账",
          "actionStatus": "1,1,1,1,1",
          "recharge": 1,
          "withdraw": 1,
          "trade": 1,
          "transfer": 1,
          "amount": 199987.4218,
          "cashAmount": 199987.4218,
          "freezeCashAmount": 0,
          "prepareSubAmount": 0,
          "freezeAmount": 0,
          "valuations": 1451148.73,
          "valuationsUsdt": 199987.4218,
          "selected": true,
          "redPacketFeeType": 0,
          "redPacketFee": 0.02
        },
        {
          "currencyId": 300,
          "currencyType": 2,
          "currencyName": "USDC",
          "currencyNameEn": "USDC",
          "icoUrl": "https://t-api.aisky.vip/mgr/下载.png",
          "point_num": 2,
          "point_price": 2,
          "status": 1,
          "price": 0,
          "priceUsdt": 0,
          "initPrice": 0,
          "actions": "充币,提币,买入,卖出,转账",
          "actionStatus": "1,1,1,1,1",
          "recharge": 1,
          "withdraw": 1,
          "trade": 1,
          "transfer": 1,
          "amount": 1,
          "cashAmount": 1,
          "freezeCashAmount": 0,
          "prepareSubAmount": 0,
          "freezeAmount": 0,
          "valuations": 0,
          "valuationsUsdt": 0,
          "selected": false,
          "redPacketFeeType": 0,
          "redPacketFee": 0.02
        },
        {
          "currencyId": 301,
          "currencyType": 2,
          "currencyName": "BSC-USDT",
          "currencyNameEn": "BSC-USDT",
          "icoUrl": "http://t-api.aisky.vip/mgr/USDT.png",
          "point_num": 2,
          "point_price": 2,
          "status": 1,
          "price": 0,
          "priceUsdt": 0,
          "initPrice": 0,
          "actions": "充币,提币,买入,卖出,转账",
          "actionStatus": "1,1,1,1,1",
          "recharge": 1,
          "withdraw": 1,
          "trade": 1,
          "transfer": 1,
          "amount": 4.99212,
          "cashAmount": 4.99212,
          "freezeCashAmount": 0,
          "prepareSubAmount": 0,
          "freezeAmount": 0,
          "valuations": 0,
          "valuationsUsdt": 0,
          "selected": true,
          "redPacketFeeType": 0,
          "redPacketFee": 0.02
        }
      ],
      "totalUsdt": 199987.4218,
      "baseCurrency": "CNY",
      "base": "CNY"
    },
    "message": null,
    "status": 200
  }
  ```

### 活动预缴 TOKEN

- **接口地址**: `POST /open/act/prepay`
- **说明**: 此接口可以将用户创建的活动奖项预缴 token 进行冻结
- **查询参数（Query）**:
  - `uuid`: (String) 用户
  - `token`: (String) 所有者登录后获取的 JWT Token
  - `uid`: (String) 用户 UID
  - `activityId`: (Int) 活动 id
  - `title`: (String) 活动标题
  - `detail`: (String) 详细信息
  - `currencyId`: (int) 币种 id
  - `amount`: (string) 数量
  - `endTime`: (DateTime) 冻结截止时间
- **成功响应** (`200 OK`):
  ```json
  {
    "attachment": {
      "id": 57,
      "uuid": "56acd6473ba04257958c1d8817204137",
      "activityId": 275,
      "title": "这是一个预缴",
      "icon": null,
      "ad": null,
      "currencyId": 308,
      "amount": 100,
      "remain": 100,
      "detail": "详细信息",
      "status": 0,
      "type": 0,
      "createTime": "2025-09-12 03:45:59",
      "endTime": "2025-09-12 03:50:59",
      "ktTime": "2025-09-12 03:45:59",
      "ktRules": null,
      "tpInfo": null,
      "tpUrl": null
    },
    "message": null,
    "status": 200
  }
  ```

### 活动预缴 TOKEN - 退回

- **接口地址**: `POST /open/act/prepay/returnTokenById`
- **说明**: 此接口可以退回用户创建的活动奖项预缴 token 冻结
- **查询参数（Query）**:
  - `uuid`: (String) 用户
  - `token`: (String) 所有者登录后获取的 JWT Token
  - `uid`: (String) 用户 UID
  - `prepayid`: (Int) 预缴 id
- **成功响应** (`200 OK`):
  ```json
  {
    "attachment": {},
    "message": null,
    "status": 200
  }
  ```

### 添加预缴活动定向空投

- **接口地址**: `POST /open/act/prepay/add`
- **说明**: 此接口可以在用户中奖后进行发放奖励
- **查询参数（Query）**:
  - `uuid`: (String) 用户 UUID
  - `token`: (String) 所有者登录后获取的 JWT Token
  - `uid`: (String) 用户 UID
  - `activityId`: (Int) 活动 id
  - `prepayid`: (Int) 预缴 id
  - `title`: (String) 活动标题
  - `currencyId`: (int) 币种 id
  - `amount`: (string) 数量
  - `ktTime`: (DateTime) 指定的发放时间
  - `note`: (String) 显示在用户钱包交易记录里的备注
  - `signCode`:(String) 通过 MD5 加密，MD5Util.encrypt("kwowemm@lsloa" + prepayid + currencyId + amount)
- **Body 参数** (`application/json`):
  - 用户 UID 数组，如：`["user123", "user456"]`，对应发放奖励的用户 uid
- **成功响应** (`200 OK`):
  ```json
  {
    "attachment": {},
    "message": null,
    "status": 200
  }
  ```

### 文件上传 base64(图片上传)

- **接口地址**: `POST /system/upload/base64`
- **说明**: 实现图片上传
- **查询参数（Query）**:
  - `uuid`: (String) 用户 UUID
  - `token`: (String) 所有者登录后获取的 JWT Token
  - `uid`: (String) 用户 UID
- **Body 参数** (`form-data`):
  - `data`: (Base64) 图片文件
- **成功响应** (`200 OK`):
  ```json
  {
    "status": 200,
    "message": "操作成功",
    "attachment": {
      "url": "http://example.com/images/abcd1234.png",
      "text": ""
    }
  }
  ```

### 将链接转成短链

- **接口地址**: `GET /open/getShortUrl`
- **说明**: 将链接转成短链
- **查询参数（Query）**:
  - `uuid`: (String) 用户 UUID
  - `token`: (String) 所有者登录后获取的 JWT Token
  - `uid`: (String) 用户 UID
  - `oriUrl`: (String) 原始链接
- **成功响应** (`200 OK`):
  ```json
  {
    "status": 200,
    "message": "操作成功",
    "attachment": "9BF1E3C647"
  }
  ```

### 根据 UID 查询用户昵称

- **接口地址**: `GET /user/getNicknames?uids={uids}`
- **说明**: 将链接转成短链
- **查询参数（Query）**:
  - `uids`: (String) 用户 UID 列表，多个以`,`分开，如：`149907,149908,149909`
- **成功响应** (`200 OK`):
  ```json
  {
    "attachment": {
      "149907": "名字",
      "149908": "x-dee2025.",
      "149909": "小号-泽"
    },
    "message": null,
    "status": 200
  }
  ```

### 根据活动 ID 查询聊天群 ID

- **接口地址**: `GET /open/activity/details`
- **说明**: 将链接转成短链
- **查询参数（Query）**:
  - `uuid`: (String) 用户 UUID
  - `token`: (String) 所有者登录后获取的 JWT Token
  - `uid`: (String) 用户 UID
  - `activityId`: (String) 活动 ID
  - `locale`:(String)默认使用 zh_HK
- **成功响应** (`200 OK`):
  ```json
  {
    "attachment": {
      "chatroomId": 123
    },
    "message": null,
    "status": 200
  }
  ```

---

## 🛠️ 6. 后台管理接口 (管理员)

**(需要管理员 Token 认证)**

### 用户管理

#### 获取管理员用户列表

- **接口地址**: `GET /v1/admin/users`
- **说明**: 分页查询后台管理员用户。
- **查询参数**:
  - `current`: (Integer) 当前页码 (可选, 默认 1)
  - `size`: (Integer) 每页数量 (可选, 默认 10)
- **成功响应** (`200 OK`):
  ```json
  {
    "code": 0,
    "msg": "success",
    "data": {
      "records": [
        {
          "id": 1,
          "username": "admin",
          "realName": "系统管理员",
          "roleId": 1,
          "lastLoginTime": "2025-05-07 10:05:00",
          "status": 1,
          "createdAt": "2025-05-07 09:00:00",
          "updatedAt": "2025-05-07 10:05:00",
          "isDeleted": 0
        }
        // ...其他管理员用户
      ],
      "total": 5,
      "size": 10,
      "current": 1,
      "pages": 1
    }
  }
  ```

#### 添加管理员用户

- **接口地址**: `POST /v1/admin/users`
- **说明**: 创建一个新的后台管理员用户。
- **请求体** (`application/json`):
  ```json
  {
    "username": "operator01", // 用户名 (必填, 3-20字符, 且唯一)
    "uid": "operator_001", // 用户唯一标识 (必填, 最多50字符)
    "password": "operator123", // 密码 (必填, 6-20字符)
    "realName": "运维专员", // 姓名 (可选, 最多50字符)
    "roleId": 3, // 角色ID (必填)
    "status": 1 // 状态 (可选, 0禁用, 1启用, 默认1)
  }
  ```
- **成功响应** (`200 OK`):
  ```json
  {
    "code": 0,
    "msg": "添加成功",
    "data": "添加成功"
  }
  ```
- **失败响应** (示例: 用户名已存在):
  ```json
  {
    "code": 400,
    "msg": "用户名已存在或创建失败",
    "data": null
  }
  ```

#### 更新管理员用户

- **接口地址**: `PUT /v1/admin/users/{id}`
- **说明**: 更新指定 ID 的后台管理员用户信息。
- **路径参数**:
  - `id`: (Integer) 管理员用户 ID (必填)
- **请求体** (`application/json`):
  ```json
  {
    "id": 2, // 用户ID (必填, 需与路径ID一致)
    "uid": "operator_002", // 用户唯一标识 (可选, 最多50字符)
    "password": "newPassword456", // 新密码 (可选, 不为空时更新, 6-20字符)
    "realName": "高级运维专员", // 姓名 (可选, 最多50字符)
    "roleId": 3, // 角色ID (必填)
    "status": 1 // 状态 (可选, 0禁用, 1启用)
  }
  ```
- **成功响应** (`200 OK`):
  ```json
  {
    "code": 0,
    "msg": "更新成功",
    "data": "更新成功"
  }
  ```
- **失败响应** (示例: 用户不存在):
  ```json
  {
    "code": 404,
    "msg": "用户不存在",
    "data": null
  }
  ```

#### 删除管理员用户

- **接口地址**: `DELETE /v1/admin/users/{id}`
- **说明**: 逻辑删除指定 ID 的后台管理员用户。
- **路径参数**:
  - `id`: (Integer) 管理员用户 ID (必填)
- **成功响应** (`200 OK`):
  ```json
  {
    "code": 0,
    "msg": "删除成功",
    "data": "删除成功"
  }
  ```
- **失败响应** (示例: 用户不存在):
  ```json
  {
    "code": 404,
    "msg": "用户不存在或删除失败",
    "data": null
  }
  ```

#### 获取指定用户的权限列表

- **接口地址**: `GET /v1/admin/users/{id}/permissions`
- **说明**: 获取指定管理员用户的权限编码列表。
- **路径参数**:
  - `id`: (Integer) 管理员用户 ID (必填)
- **成功响应** (`200 OK`):
  ```json
  {
    "code": 0,
    "msg": "success",
    "data": [
      "app_review",
      "data_stats"
      // ...更多权限编码
    ]
  }
  ```

#### 根据 uid 查询管理员信息

- **接口地址**: `GET /v1/public/admin/users/uid/{uid}`
- **说明**: 根据用户唯一标识查询管理员信息，不需要认证头。接口会调用第三方 API 验证用户，如果验证成功但 admin 表中没有对应记录，会自动创建新记录。
- **路径参数**:
  - `uid`: (String) 用户唯一标识 (必填)
- **查询参数**:
  - `uuid`: (String) 用户 UUID (必填)
  - `token`: (String) 第三方 Token (必填)
- **成功响应** (`200 OK`):
  ```json
  {
    "code": 0,
    "msg": "success",
    "data": {
      "token": "jwt.admin.token.string",
      "admin": {
        "id": 5,
        "username": "149819",
        "uid": "149819",
        "realName": "合作伙伴_149819",
        "roleId": 4,
        "lastLoginTime": null,
        "status": 1,
        "createdAt": "2025-01-01 12:00:00",
        "updatedAt": "2025-01-01 12:00:00",
        "isDeleted": 0
      }
    }
  }
  ```
- **失败响应** (示例: 第三方 API 验证失败):
  ```json
  {
    "code": 500,
    "msg": "操作失败: 调用第三方API失败",
    "data": null
  }
  ```

#### 修改当前管理员信息

- **接口地址**: `PUT /v1/admin/me/profile`
- **说明**: 当前登录的管理员修改自己的密码或姓名。
- **请求体** (`application/json`):
  ```json
  {
    "password": "newStrongPassword123", // 新密码 (可选, 6-20字符)
    "realName": "管理员新名称" // 姓名 (可选, 最多50字符)
  }
  ```
- **成功响应** (`200 OK`):
  ```json
  {
    "code": 0,
    "msg": "个人信息更新成功",
    "data": "个人信息更新成功"
  }
  ```
- **失败响应** (示例: 更新失败):
  ```json
  {
    "code": 500,
    "msg": "个人信息更新失败",
    "data": null
  }
  ```

### 角色管理

#### 获取所有角色列表

- **接口地址**: `GET /v1/admin/roles`
- **说明**: 查询系统中的所有角色。
- **请求参数**: 无
- **成功响应** (`200 OK`):
  ```json
  {
    "code": 0,
    "msg": "success",
    "data": [
      {
        "id": 1,
        "name": "超级管理员",
        "code": "super_admin",
        "description": "拥有全部权限",
        "isDeleted": 0
      },
      {
        "id": 2,
        "name": "审核管理员",
        "code": "reviewer",
        "description": "负责管理上架流程，审核游戏/应用上架申请",
        "isDeleted": 0
      }
      // ...其他角色
    ]
  }
  ```

#### 获取角色权限 ID 列表

- **接口地址**: `GET /v1/admin/roles/{roleId}/permissions`
- **说明**: 获取指定角色关联的权限 ID 列表。
- **路径参数**:
  - `roleId`: (Integer) 角色 ID (必填)
- **成功响应** (`200 OK`):
  ```json
  {
    "code": 0,
    "msg": "success",
    "data": [1, 2, 3, 4] // 权限ID列表
  }
  ```

#### 获取角色权限 ID 列表

- **接口地址**: `GET /v1/admin/roles/{roleId}/permissions`
- **说明**: 获取指定角色关联的权限 ID 列表。
- **路径参数**:
  - `roleId`: (Integer) 角色 ID (必填)
- **成功响应** (`200 OK`):
  ```json
  {
    "code": 0,
    "msg": "success",
    "data": [1, 2, 3, 4] // 权限ID列表
  }
  ```

#### 更新角色权限

- **接口地址**: `PUT /v1/admin/roles/{roleId}/permissions`
- **说明**: 更新指定角色的权限关联。
- **路径参数**:
  - `roleId`: (Integer) 角色 ID (必填)
- **请求体** (`application/json`, 权限 ID 列表):
  ```json
  [
    1, // 权限ID: 应用审核
    4 // 权限ID: 数据统计
  ]
  ```
- **成功响应** (`200 OK`):
  ```json
  {
    "code": 0,
    "msg": "更新角色权限成功",
    "data": "更新角色权限成功"
  }
  ```

### 权限管理

#### 获取所有权限列表

- **接口地址**: `GET /v1/admin/permissions`
- **说明**: 查询系统中的所有权限。
- **请求参数**: 无
- **成功响应** (`200 OK`):
  ```json
  {
    "code": 0,
    "msg": "success",
    "data": [
      {
        "id": 1,
        "name": "应用审核",
        "code": "app_review",
        "description": "审核游戏/应用上架申请",
        "isDeleted": 0
      },
      {
        "id": 2,
        "name": "推广位管理",
        "code": "placement_manage",
        "description": "管理推广位位置和规则",
        "isDeleted": 0
      }
      // ...其他权限
    ]
  }
  ```

### 应用管理

#### 获取所有游戏/应用列表 (Admin)

- **接口地址**: `GET /v1/admin/apps`
- **说明**: 分页查询所有游戏/应用，可按所有者、名称或状态过滤，并支持排序。
- **查询参数**:
  - `current`: (Integer) 当前页码 (可选, 默认 1)
  - `size`: (Integer) 每页数量 (可选, 默认 10)
  - `ownerId`: (Integer) 所有者 ID (可选)
  - `name`: (String) 应用名称 (可选, 用于模糊搜索)
  - `status`: (String) 状态 (可选: Pending, Approved, Rejected)
  - `sortField`: (String) 排序字段 (可选: id, name, createdAt, status, 默认 createdAt)
  - `sortOrder`: (String) 排序方向 (可选: asc, desc, 默认 desc)
- **成功响应** (`200 OK`):
  ```json
  {
    "code": 0,
    "msg": "success",
    "data": {
      "records": [
        {
          "id": 123,
          "ownerId": 1,
          "ownerName": "测试所有者1",
          "name": "开心消消乐 H5",
          "type": "Game",
          "url": "https://game.example.com/xxl",
          "icon": "https://icon.example.com/xxl.png",
          "description": "一款经典的消除类休闲游戏",
          "tags": "休闲,消除,益智",
          "status": "Approved",
          "visible": 1,
          "isRecommend": 1,
          "clickCount": 1234,
          "createdAt": "2025-05-07 10:10:00",
          "reviewedAt": "2025-05-07 11:30:00",
          "reviewRemark": "内容合规",
          "isDeleted": 0
        }
        // ...其他应用
      ],
      "total": 50,
      "size": 10,
      "current": 1,
      "pages": 5
    }
  }
  ```

#### 创建游戏/应用 (Admin)

- **接口地址**: `POST /v1/admin/apps`
- **说明**: 管理员为指定的所有者创建新的游戏/应用。
- **请求体** (`application/json`):
  ```json
  {
    "ownerId": 1, // 应用归属的所有者ID (必填)
    "name": "管理员创建的游戏", // 应用名称 (必填, 最多100字符)
    "type": "Game", // 类型 (必填, Game/应用)
    "url": "https://admin-added.example.com/game", // 链接 (必填, 最多255字符)
    "icon": "https://icon.example.com/admin-game.png", // 图标 URL (可选)
    "description": "这是管理员直接添加的游戏", // 描述 (可选, 最多1000字符)
    "tags": "示例,管理员添加", // 标签 (可选, 逗号分隔, 最多255字符)
    "status": "Approved", // 状态 (可选, 默认 Approved)
    "visible": 1, // 可见性 (可选, 默认 1)
    "isRecommend": 0, // 是否推荐 (可选, 默认 0)
    "reviewRemark": "由管理员直接添加并审核通过", // 审核备注 (可选)
    "embedUrl": "https://admin-added.example.com/embed/game", // 嵌入URL (可选, 最多255字符)
    "coverImage": "https://img.example.com/cover/admin-game.jpg" // 封面图片 (可选, 最多255字符)
  }
  ```
- **成功响应** (`200 OK`):
  ```json
  {
    "code": 0,
    "msg": "应用创建成功",
    "data": {
      "id": 124, // 新创建应用的ID
      "ownerId": 1,
      "name": "管理员创建的游戏",
      "type": "Game",
      "url": "https://admin-added.example.com/game",
      "icon": "https://icon.example.com/admin-game.png",
      "description": "这是管理员直接添加的游戏",
      "tags": "示例,管理员添加",
      "status": "Approved",
      "visible": 1,
      "isRecommend": 0,
      "clickCount": 0,
      "createdAt": "2025-05-08 12:00:00",
      "reviewedAt": "2025-05-08 12:00:00",
      "reviewRemark": "由管理员直接添加并审核通过",
      "isDeleted": 0
    }
  }
  ```
- **失败响应** (示例: 应用名已存在或参数无效):
  ```json
  {
    "code": 400,
    "msg": "应用创建失败，可能应用名已存在或参数无效",
    "data": null
  }
  ```

#### 更新游戏/应用信息 (Admin)

- **接口地址**: `PUT /v1/admin/apps/{id}`
- **说明**: 管理员更新指定 ID 的游戏/应用信息。
- **路径参数**:
  - `id`: (Integer) 应用 ID (必填)
- **请求体** (`application/json`):
  ```json
  {
    "id": 123, // 应用ID (必填, 需与路径ID一致)
    "name": "开心消消乐HD", // 应用名称 (可选)
    "type": "Game", // 类型 (可选, Game/应用)
    "url": "https://game.example.com/xxl-hd", // 链接 (可选)
    "icon": "https://icon.example.com/xxl-hd.png", // 图标 (可选)
    "description": "经典消除游戏高清版", // 描述 (可选)
    "tags": "休闲,消除,高清", // 标签 (可选)
    "status": "Approved", // 状态 (可选: Pending, Approved, Rejected)
    "visible": 1, // 可见性 (可选: 0或1)
    "isRecommend": 1, // 是否推荐 (可选)
    "reviewRemark": "管理员更新了信息", // 审核备注 (可选)
    "embedUrl": "https://game.example.com/embed/xxl-hd", // 嵌入URL (可选, 最多255字符)
    "coverImage": "https://img.example.com/cover/xxl-hd.jpg" // 封面图片 (可选, 最多255字符)
  }
  ```
- **成功响应** (`200 OK`):
  ```json
  {
    "code": 0,
    "msg": "应用信息更新成功",
    "data": "应用信息更新成功"
  }
  ```
- **失败响应** (示例: 应用不存在):
  ```json
  {
    "code": 404,
    "msg": "应用不存在或更新失败",
    "data": null
  }
  ```

### 所有者管理

#### 获取所有者列表

**接口**: `GET /v1/admin/owners`

**描述**: 分页查询所有者列表，支持按名称和邮箱搜索

**请求参数**:

- `current` (可选): 当前页码，默认为 1
- `size` (可选): 每页数量，默认为 10
- `name` (可选): 名称搜索关键字
- `email` (可选): 邮箱搜索关键字

**响应示例**:

```json
{
  "code": 0,
  "msg": "success",
  "data": {
    "records": [
      {
        "id": 1,
        "name": "所有者名称",
        "email": "owner@example.com",
        "password": null,
        "balance": 100.0,
        "createdAt": "2024-01-01T10:00:00",
        "isDeleted": 0
      }
    ],
    "total": 1,
    "size": 10,
    "current": 1,
    "pages": 1
  }
}
```

#### 获取所有者详情

**接口**: `GET /v1/admin/owners/{id}`

**描述**: 根据 ID 获取所有者详细信息

**路径参数**:

- `id`: 所有者 ID

**响应示例**:

```json
{
  "code": 0,
  "msg": "success",
  "data": {
    "id": 1,
    "name": "所有者名称",
    "email": "owner@example.com",
    "password": null,
    "balance": 100.0,
    "createdAt": "2024-01-01T10:00:00",
    "isDeleted": 0
  }
}
```

#### 创建所有者

**接口**: `POST /v1/admin/owners`

**描述**: 管理员创建新的所有者

**请求体**:

```json
{
  "name": "所有者名称",
  "email": "owner@example.com",
  "password": "123456",
  "balance": 100.0
}
```

**字段说明**:

- `name`: 所有者名称 (必填，2-100 字符)
- `email`: 邮箱地址 (必填，有效邮箱格式，最大 100 字符)
- `password`: 密码 (必填，6-20 字符)
- `balance`: 初始余额 (可选，默认为 0.00，不能为负数)

**响应示例**:

```json
{
  "code": 0,
  "msg": "所有者创建成功",
  "data": {
    "id": 1,
    "name": "所有者名称",
    "email": "owner@example.com",
    "password": null,
    "balance": 100.0,
    "createdAt": "2024-01-01T10:00:00",
    "isDeleted": 0
  }
}
```

#### 更新所有者信息

**接口**: `PUT /v1/admin/owners/{id}`

**描述**: 管理员更新指定 ID 的所有者信息

**路径参数**:

- `id`: 所有者 ID

**请求体**:

```json
{
  "id": 1,
  "name": "更新后的名称",
  "email": "updated@example.com",
  "password": "newpassword",
  "balance": 200.0
}
```

**字段说明**:

- `id`: 所有者 ID (必填，必须与路径参数一致)
- `name`: 所有者名称 (必填，2-100 字符)
- `email`: 邮箱地址 (必填，有效邮箱格式，最大 100 字符)
- `password`: 密码 (可选，如果不修改密码则不传此字段，6-20 字符)
- `balance`: 余额 (必填，不能为负数)

**响应示例**:

```json
{
  "code": 0,
  "msg": "所有者信息更新成功",
  "data": null
}
```

#### 删除所有者

**接口**: `DELETE /v1/admin/owners/{id}`

**描述**: 管理员逻辑删除指定 ID 的所有者

**路径参数**:

- `id`: 所有者 ID

**响应示例**:

```json
{
  "code": 0,
  "msg": "所有者删除成功",
  "data": null
}
```

#### 更新所有者余额

**接口**: `PUT /v1/admin/owners/{id}/balance`

**描述**: 管理员调整所有者的 SKY 代币余额

**路径参数**:

- `id`: 所有者 ID

**请求参数**:

- `amount`: 变动金额（正数为增加，负数为减少）

**响应示例**:

```json
{
  "code": 0,
  "msg": "余额更新成功",
  "data": null
}
```

---

## 🕵️ 7. 审核接口 (管理员)

**(需要管理员 Token 认证)**

### 获取待审核列表

- **接口地址**: `GET /v1/admin/review/pending`
- **说明**: 分页查询待审核的游戏/应用列表，包含所有者名称。
- **查询参数**:
  - `current`: (Integer) 当前页码 (可选, 默认 1)
  - `size`: (Integer) 每页数量 (可选, 默认 10)
- **成功响应** (`200 OK`):
  ```json
  {
    "code": 0,
    "msg": "success",
    "data": {
      "records": [
        {
          "id": 123,
          "ownerId": 1,
          "ownerName": "测试所有者1",
          "name": "开心消消乐 H5",
          "type": "Game",
          "url": "https://game.example.com/xxl",
          "icon": "https://icon.example.com/xxl.png",
          "description": "一款经典的消除类休闲游戏",
          "tags": "休闲,消除,益智",
          "status": "Pending",
          "visible": 0,
          "isRecommend": 0,
          "clickCount": 10,
          "createdAt": "2025-05-07 10:10:00",
          "reviewedAt": null,
          "reviewRemark": null,
          "isDeleted": 0
        }
        // ...其他待审核应用
      ],
      "total": 15,
      "size": 10,
      "current": 1,
      "pages": 2
    }
  }
  ```

### 审核游戏/应用

- **接口地址**: `POST /v1/admin/review/review`
- **说明**: 管理员审核游戏/应用上架申请。
- **请求体** (`application/json`):
  ```json
  {
    "id": 123, // 应用 ID (必填)
    "status": "Approved", // 审核状态 (必填, Approved 或 Rejected)
    "remark": "内容合规，已通过审核" // 审核备注 (可选, 最多255字符)
  }
  ```
- **成功响应** (`200 OK`):
  ```json
  {
    "code": 0,
    "msg": "审核成功",
    "data": "审核成功"
  }
  ```
- **失败响应** (示例: 状态不合法):
  ```json
  {
    "code": 400,
    "msg": "审核状态不合法",
    "data": null
  }
  ```

### 切换游戏/应用可见状态

- **接口地址**: `POST /v1/admin/review/toggle`
- **说明**: 管理员强制上下架已通过审核的游戏/应用。
- **查询参数**:
  - `id`: (Integer) 应用 ID (必填)
  - `visible`: (Boolean) 是否可见 (必填, true 或 false)
- **成功响应** (`200 OK`):
  ```json
  {
    "code": 0,
    "msg": "上架成功", // 或 "下架成功"
    "data": "上架成功" // 或 "下架成功"
  }
  ```
- **失败响应** (示例: 应用未审核通过):
  ```json
  {
    "code": 500,
    "msg": "操作失败，应用可能不存在或未通过审核",
    "data": null
  }
  ```

---

## 📢 8. 推广管理接口 (管理员)

**(需要管理员 Token 认证)**

### 创建推广预算

- **接口地址**: `POST /v1/admin/promo/budgets`
- **说明**: 为指定的游戏/应用创建推广预算。
- **请求体** (`application/json`):
  ```json
  {
    "gameappId": 123, // 游戏/应用ID (必填)
    "dailyBudget": 50.0, // 每日预算 (必填, >=0)
    "totalBudget": 500.0, // 总预算 (必填, >=0)
    "placements": "首页推荐,分类页广告", // 投放位置标识 (必填)
    "startDate": "2025-06-01", // 开始日期 (必填, >=当前日期)
    "endDate": "2025-06-30" // 结束日期 (必填, >=开始日期)
  }
  ```
- **成功响应** (`200 OK`):
  ```json
  {
    "code": 0,
    "msg": "创建推广预算成功",
    "data": "创建推广预算成功"
  }
  ```
- **失败响应** (示例: 参数无效):
  ```json
  {
    "code": 400,
    "msg": "创建失败，请检查参数是否有效",
    "data": null
  }
  ```

### 获取推广预算列表

- **接口地址**: `GET /v1/admin/promo/budgets`
- **说明**: 分页查询推广预算列表，可按所有者 ID 过滤。
- **查询参数**:
  - `current`: (Integer) 当前页码 (可选, 默认 1)
  - `size`: (Integer) 每页数量 (可选, 默认 10)
  - `ownerId`: (Integer) 所有者 ID (可选)
- **成功响应** (`200 OK`):
  ```json
  {
    "code": 0,
    "msg": "success",
    "data": {
      "records": [
        {
          "id": 1,
          "ownerId": 1,
          "gameappId": 123,
          "dailyBudget": 50.0,
          "totalBudget": 500.0,
          "placements": "首页推荐,分类页广告",
          "startDate": "2025-06-01",
          "endDate": "2025-06-30",
          "status": 1,
          "isDeleted": 0
        }
      ],
      "total": 10,
      "size": 10,
      "current": 1,
      "pages": 1
    }
  }
  ```

### 获取推广预算详情

- **接口地址**: `GET /v1/admin/promo/budgets/{id}`
- **说明**: 获取指定 ID 的推广预算详情。
- **路径参数**:
  - `id`: (Integer) 预算 ID (必填)
- **成功响应** (`200 OK`):
  ```json
  {
    "code": 0,
    "msg": "success",
    "data": {
      "id": 1
    }
  }
  ```
- **失败响应** (示例: 预算不存在):
  ```json
  {
    "code": 404,
    "msg": "推广预算不存在",
    "data": null
  }
  ```

### 更新推广预算

- **接口地址**: `PUT /v1/admin/promo/budgets/{id}`
- **说明**: 更新指定 ID 的推广预算信息。
- **路径参数**:
  - `id`: (Integer) 预算 ID (必填)
- **请求体** (`application/json`):
  ```json
  {
    "id": 1, // 预算ID (必填, 需与路径ID一致)
    "dailyBudget": 60.0, // 每日预算 (可选, >=0)
    "totalBudget": 600.0, // 总预算 (可选, >=0)
    "placements": "首页推荐", // 投放位置 (可选)
    "startDate": "2025-06-02", // 开始日期 (可选, >=当前日期)
    "endDate": "2025-07-01", // 结束日期 (可选, >=开始日期)
    "status": 0 // 状态 (可选, 0暂停, 1运行中)
  }
  ```
- **成功响应** (`200 OK`):
  ```json
  {
    "code": 0,
    "msg": "更新推广预算成功",
    "data": "更新推广预算成功"
  }
  ```
- **失败响应** (示例: 预算不存在):
  ```json
  {
    "code": 404, // 或 500
    "msg": "更新失败，请检查预算ID是否存在或参数是否有效",
    "data": null
  }
  ```

### 删除推广预算

- **接口地址**: `DELETE /v1/admin/promo/budgets/{id}`
- **说明**: 逻辑删除指定 ID 的推广预算。
- **路径参数**:
  - `id`: (Integer) 预算 ID (必填)
- **成功响应** (`200 OK`):
  ```json
  {
    "code": 0,
    "msg": "删除成功",
    "data": "删除成功"
  }
  ```
- **失败响应** (示例: 预算不存在):
  ```json
  {
    "code": 404,
    "msg": "推广预算不存在或删除失败",
    "data": null
  }
  ```

---

## 🧾 9. 财务管理接口 (管理员)

**(需要管理员 Token 认证)**

### 获取充值记录列表 (Admin)

- **接口地址**: `GET /v1/admin/finance/recharges`
- **说明**: 分页查询所有充值记录，可按所有者 ID 过滤。
- **查询参数**:
  - `current`: (Integer) 当前页码 (可选, 默认 1)
  - `size`: (Integer) 每页数量 (可选, 默认 10)
  - `ownerId`: (Integer) 所有者 ID (可选)
- **成功响应** (`200 OK`):
  ```json
  {
    "code": 0,
    "msg": "success",
    "data": {
      "records": [
        {
          "id": 1,
          "ownerId": 1,
          "amount": 50.0,
          "transactionId": "tx123456",
          "status": 1,
          "timestamp": "2025-05-07 11:00:00",
          "isDeleted": 0
        }
      ],
      "total": 30,
      "size": 10,
      "current": 1,
      "pages": 3
    }
  }
  ```

### 获取消耗记录列表 (Admin)

- **接口地址**: `GET /v1/admin/finance/consumptions`
- **说明**: 分页查询所有消耗记录，可按多种条件过滤。
- **查询参数**:
  - `current`: (Integer) 当前页码 (可选, 默认 1)
  - `size`: (Integer) 每页数量 (可选, 默认 10)
  - `ownerId`: (Integer) 所有者 ID (可选)
  - `gameappId`: (Integer) 游戏/应用 ID (可选)
  - `costType`: (String) 消费类型 (可选: CPA, CPM)
  - `startDate`: (String) 开始日期 (可选, 格式: yyyy-MM-dd)
  - `endDate`: (String) 结束日期 (可选, 格式: yyyy-MM-dd)
- **成功响应** (`200 OK`):
  ```json
  {
    "code": 0,
    "msg": "success",
    "data": {
      "records": [
        {
          "id": 1,
          "ownerId": 1,
          "gameappId": 123,
          "costType": "CPA",
          "amount": 0.01,
          "count": 1,
          "date": "2025-05-07",
          "isDeleted": 0
        }
      ],
      "total": 100,
      "size": 10,
      "current": 1,
      "pages": 10
    }
  }
  ```

## 10. H5 接口

### 获取轮播图列表

- **接口**: `GET /h5/games/banners`
- **描述**: 获取首页轮播图列表
- **响应**:
  ```json
  [
    {
      "id": 1,
      "name": "示例游戏",
      "type": "Game",
      "description": "这是一个示例游戏",
      "coverImage": "https://example.com/cover.jpg",
      "icon": "https://example.com/icon.png",
      "views": "1.2w",
      "embedUrl": "https://example.com/game",
      "externalUrl": null,
      "ownerName": "开发者名称",
      "tags": "休闲,益智",
      "isRecommend": true,
      "createdAt": "2024-03-20 10:00:00"
    }
  ]
  ```

### 获取热门游戏/应用

- **接口**: `GET /h5/games/hot`
- **描述**: 获取热门游戏/应用列表
- **参数**:
  - `current`: 页码（默认 1）
  - `size`: 每页大小（默认 10）
- **响应**:
  ```json
  {
    "records": [
      {
        "id": 1,
        "name": "示例游戏",
        "type": "Game",
        "description": "这是一个示例游戏",
        "coverImage": "https://example.com/cover.jpg",
        "icon": "https://example.com/icon.png",
        "views": "1.2w",
        "embedUrl": "https://example.com/game",
        "externalUrl": null,
        "ownerName": "开发者名称",
        "tags": "休闲,益智",
        "isRecommend": true,
        "createdAt": "2024-03-20 10:00:00"
      }
    ],
    "total": 100,
    "size": 10,
    "current": 1,
    "pages": 10
  }
  ```

### 获取首发游戏/应用

- **接口**: `GET /h5/games/new`
- **描述**: 获取最新发布的游戏/应用列表
- **参数**:
  - `current`: 页码（默认 1）
  - `size`: 每页大小（默认 10）
- **响应**: 同热门游戏/应用接口

### 获取推荐游戏/应用

- **接口**: `GET /h5/games/recommend`
- **描述**: 获取推荐游戏/应用列表
- **参数**:
  - `current`: 页码（默认 1）
  - `size`: 每页大小（默认 10）
- **响应**: 同热门游戏/应用接口

### 搜索游戏/应用

- **接口**: `GET /h5/games/search`
- **描述**: 根据关键词搜索游戏/应用
- **参数**:
  - `keyword`: 搜索关键词
  - `current`: 页码（默认 1）
  - `size`: 每页大小（默认 10）
- **响应**: 同热门游戏/应用接口

### 获取游戏/应用详情

- **接口**: `GET /h5/games/{id}`
- **描述**: 根据 ID 获取游戏/应用详细信息
- **参数**:
  - `id`: 游戏/应用 ID
- **响应**:
  ```json
  {
    "id": 1,
    "name": "示例游戏",
    "type": "Game",
    "description": "这是一个示例游戏",
    "coverImage": "https://example.com/cover.jpg",
    "icon": "https://example.com/icon.png",
    "views": "1.2w",
    "embedUrl": "https://example.com/game",
    "externalUrl": null,
    "ownerName": "开发者名称",
    "tags": "休闲,益智",
    "isRecommend": true,
    "createdAt": "2024-03-20 10:00:00"
  }
  ```

### 获取分类游戏/应用

- **接口**: `GET /h5/games/category/{category}`
- **描述**: 根据分类获取游戏/应用列表
- **参数**:
  - `category`: 分类名称
  - `current`: 页码（默认 1）
  - `size`: 每页大小（默认 10）
- **响应**: 同热门游戏/应用接口

### 记录用户点击

- **接口地址**: `POST /h5/track/click`
- **说明**: 记录用户点击游戏/应用的行为。
- **请求体** (`application/json`):
  ```json
  {
    "uid": "user123", // 用户ID (必填)
    "gameappId": 123, // 游戏/应用ID (必填)
    "ip": "192.168.1.100", // 用户IP地址 (可选, 服务端会自动获取)
    "userAgent": "Mozilla/5.0...", // 用户代理信息 (可选, 服务端会自动获取)
    "referer": "https://example.com" // 来源页面 (可选, 服务端会自动获取)
  }
  ```
- **成功响应** (`200 OK`):
  ```json
  {
    "code": 0,
    "msg": "记录成功",
    "data": "记录成功"
  }
  ```

### 记录用户浏览

- **接口地址**: `POST /h5/track/view`
- **说明**: 记录用户浏览游戏/应用详情的行为。
- **请求体** (`application/json`):
  ```json
  {
    "uid": "user123", // 用户ID (必填)
    "gameappId": 123, // 游戏/应用ID (必填)
    "ip": "192.168.1.100", // 用户IP地址 (可选, 服务端会自动获取)
    "userAgent": "Mozilla/5.0...", // 用户代理信息 (可选, 服务端会自动获取)
    "referer": "https://example.com" // 来源页面 (可选, 服务端会自动获取)
  }
  ```
- **成功响应** (`200 OK`):
  ```json
  {
    "code": 0,
    "msg": "记录成功",
    "data": "记录成功"
  }
  ```

### 查询用户点击记录

- **接口地址**: `GET /h5/track/clicks`
- **说明**: 分页查询用户点击记录，可按用户 ID 或游戏/应用 ID 过滤。
- **查询参数**:
  - `current`: (Integer) 当前页码 (可选, 默认 1)
  - `size`: (Integer) 每页数量 (可选, 默认 10)
  - `uid`: (String) 用户 ID (可选)
  - `gameappId`: (Integer) 游戏/应用 ID (可选)
- **成功响应** (`200 OK`):
  ```json
  {
    "code": 0,
    "msg": "success",
    "data": {
      "records": [
        {
          "id": 1,
          "uid": "user123",
          "gameappId": 123,
          "clickTime": "2025-05-07 10:30:00",
          "ip": "192.168.1.100",
          "userAgent": "Mozilla/5.0...",
          "referer": "https://example.com",
          "isDeleted": 0,
          "gameappName": "炫酷方块消除",
          "gameappType": "游戏",
          "gameappIcon": "https://example.com/icon.png",
          "ownerName": "开发者名称",
          "gameappDescription": "一款令人上瘾的益智消除游戏，挑战你的最高分！",
          "gameappCoverImage": "https://example.com/cover.jpg",
          "gameappEmbedUrl": "https://example.com/game/123",
          "gameappExternalUrl": "https://example.com/external/123",
          "views": "1.2k"
        }
        // ...更多记录
      ],
      "total": 100,
      "size": 10,
      "current": 1,
      "pages": 10
    }
  }
  ```

### 查询用户浏览记录

- **接口地址**: `GET /h5/track/views`
- **说明**: 分页查询用户浏览记录，可按用户 ID 或游戏/应用 ID 过滤。
- **查询参数**:
  - `current`: (Integer) 当前页码 (可选, 默认 1)
  - `size`: (Integer) 每页数量 (可选, 默认 10)
  - `uid`: (String) 用户 ID (可选)
  - `gameappId`: (Integer) 游戏/应用 ID (可选)
- **成功响应** (`200 OK`):
  ```json
  {
    "code": 0,
    "msg": "success",
    "data": {
      "records": [
        {
          "id": 1,
          "uid": "user123",
          "gameappId": 123,
          "viewTime": "2025-05-07 10:30:00",
          "ip": "192.168.1.100",
          "userAgent": "Mozilla/5.0...",
          "referer": "https://example.com",
          "isDeleted": 0,
          "gameappName": "炫酷方块消除",
          "gameappType": "游戏",
          "gameappIcon": "https://example.com/icon.png",
          "ownerName": "开发者名称",
          "gameappDescription": "一款令人上瘾的益智消除游戏，挑战你的最高分！",
          "gameappCoverImage": "https://example.com/cover.jpg",
          "gameappEmbedUrl": "https://example.com/game/123",
          "gameappExternalUrl": "https://example.com/external/123",
          "views": "1.2k"
        }
        // ...更多记录
      ],
      "total": 100,
      "size": 10,
      "current": 1,
      "pages": 10
    }
  }
  ```

## 🎯 11. 抽奖活动接口

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
- **错误响应** (`400 Bad Request`):
  ```json
  {
    "code": 400,
    "msg": "更新失败，请检查权限或活动状态",
    "data": null
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
    "data": "更新成功"
  }
  ```

#### 删除抽奖活动

- **接口地址**: `DELETE /v1/admin/lottery/{id}`
- **说明**: 删除指定抽奖活动。
- **路径参数**:
  - `id`: (Integer) 抽奖活动 ID (必填)
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

#### 添加奖项

- **接口地址**: `POST /v1/admin/lottery/prize/add`
- **说明**: 为指定抽奖活动添加奖项。支持实物奖励和代币奖励两种类型。对于代币奖励，需要提供用户认证信息（uid、uuid、token）用于调用第三方 API。
- **查询参数**:
  - `locale`: (String) 语言代码，可选值：en/zh-CN/zh-HK，默认 zh-CN
- **请求体** (`application/json`):

  ```json
  {
    "lotteryId": 1, // 抽奖活动ID (必填)
    "level": "特等奖", // 奖项等级 (必填)
    "name": "iPhone 15", // 奖品名称 (必填)
    "image": "https://example.com/iphone.png", // 奖品图片路径 (可选)
    "probability": 0.1, // 中奖概率，百分比 (必填，0.01-100)
    "totalQuantity": 1, // 奖品总数量 (可选，为空表示不限)
    "prizeType": "physical", // 奖品类型 (必填，physical: 实物奖励, token: 代币奖励)

    // 代币奖励相关字段（当prizeType为"token"时必填）
    "currencyId": 4, // 币种ID (代币奖励时必填)
    "amount": "100.00000000", // 代币数量 (代币奖励时必填)
    "uid": "user123", // 用户UID (代币奖励时必填)
    "uuid": "uuid-123-456", // 用户UUID (代币奖励时必填)
    "token": "jwt-token-here" // JWT Token (代币奖励时必填)
  }
  ```

- **成功响应** (`200 OK`):
  ```json
  {
    "code": 0,
    "msg": "success",
    "data": {
      "prizeId": 1,
      "probabilityValid": true, // 概率之和是否有效
      "prepayId": 8 // 预缴ID（代币奖励时返回）
    }
  }
  ```
- **错误响应** (`400 Bad Request`):
  ```json
  {
    "code": 400,
    "msg": "代币预缴失败: 余额不足",
    "data": null
  }
  ```

#### 获取奖项列表

- **接口地址**: `GET /v1/admin/lottery/{id}/prizes`
- **说明**: 获取指定抽奖活动的奖项列表。
- **路径参数**:
  - `id`: (Integer) 抽奖活动 ID (必填)
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
        "level": "特等奖",
        "name": "iPhone 15",
        "image": "https://example.com/iphone.png",
        "probability": 0.1,
        "totalQuantity": 1,
        "remainQuantity": 1,
        "prizeType": "physical",
        "currencyId": null,
        "amount": null,
        "prepayId": null
      },
      {
        "id": 2,
        "lotteryId": 1,
        "level": "一等奖",
        "name": "100 USDT",
        "image": "https://example.com/usdt.png",
        "probability": 1.0,
        "totalQuantity": 10,
        "remainQuantity": 8,
        "prizeType": "token",
        "currencyId": 4,
        "amount": "100.00000000",
        "prepayId": 8
      }
      // ... 更多奖项
    ]
  }
  ```

#### 删除奖项

- **接口地址**: `DELETE /v1/admin/lottery/prize/{id}`
- **说明**: 删除指定奖项。如果奖项是代币类型，系统会自动调用第三方 API 退回预缴的代币。当删除代币类型奖项时，建议提供认证参数以确保代币正确退回。
- **路径参数**:
  - `id`: (Integer) 奖项 ID (必填)
- **查询参数**:
  - `uid`: (String) 用户 UID (可选，代币奖励时建议提供)
  - `uuid`: (String) 用户 UUID (可选，代币奖励时建议提供)
  - `token`: (String) JWT Token (可选，代币奖励时建议提供)
- **成功响应** (`200 OK`):
  ```json
  {
    "code": 0,
    "msg": "success",
    "data": "删除成功"
  }
  ```
- **错误响应** (`400 Bad Request`):
  ```json
  {
    "code": 400,
    "msg": "奖项已有人中奖，无法删除",
    "data": null
  }
  ```

#### 更新奖项信息

- **接口地址**: `PUT /v1/admin/lottery/prize/update`
- **说明**: 更新指定奖项的信息。如果奖项已有人中奖，则仅允许更新奖项名称、等级和图片，不允许更新概率和数量。对于代币奖励，系统会自动处理代币的退回和重新预缴。活动标题、详细信息和冻结截止时间会自动从抽奖活动信息中获取。代币奖励更新时需要提供用户认证信息（uid、uuid、token）。
- **请求体** (`application/json`):

  ```json
  {
    "id": 1, // 奖项ID (必填)
    "level": "特等奖", // 奖项等级 (可选)
    "name": "iPhone 15 Pro", // 奖品名称 (可选)
    "image": "https://example.com/iphone15pro.png", // 奖品图片路径 (可选)
    "probability": 0.05, // 中奖概率，百分比 (可选，0.01-100)
    "totalQuantity": 2, // 奖品总数量 (可选)
    "prizeType": "token", // 奖品类型 (可选，physical: 实物奖励, token: 代币奖励)

    // 代币奖励相关字段（当prizeType为"token"时必填）
    "currencyId": 4, // 币种ID (代币奖励时必填)
    "amount": "200.00000000", // 代币数量 (代币奖励时必填)
    "uid": "user123", // 用户UID (代币奖励时必填)
    "uuid": "uuid-123-456", // 用户UUID (代币奖励时必填)
    "token": "jwt-token-here" // JWT Token (代币奖励时必填)
  }
  ```

- **成功响应** (`200 OK`):
  ```json
  {
    "code": 0,
    "msg": "success",
    "data": {
      "success": true,
      "probabilityValid": true // 更新后的概率总和是否有效
    }
  }
  ```
- **错误响应** (`400 Bad Request`):
  ```json
  {
    "code": 400,
    "msg": "代币退回失败: 预缴记录不存在",
    "data": null
  }
  ```

#### 更新抽奖规则

- **接口地址**: `PUT /v1/admin/lottery/rule/update`
- **说明**: 更新指定抽奖活动的规则。
- **请求体** (`application/json`):
  ```json
  {
    "lotteryId": 1, // 抽奖活动ID (必填)
    "drawLimit": 3, // 每人抽奖次数限制 (必填，至少1次)
    "dailyLimit": 1, // 每人每日限制次数 (可选，为空表示无限制)
    "additionalInfo": "每人总共3次机会，每天限1次" // 附加说明或参与条件 (可选)
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

#### 获取抽奖规则

- **接口地址**: `GET /v1/admin/lottery/{id}/rule`
- **说明**: 获取指定抽奖活动的规则。
- **路径参数**:
  - `id`: (Integer) 抽奖活动 ID (必填)
- **成功响应** (`200 OK`):
  ```json
  {
    "code": 0,
    "msg": "success",
    "data": {
      "id": 1,
      "lotteryId": 1,
      "drawLimit": 3,
      "dailyLimit": 1,
      "additionalInfo": "每人总共3次机会，每天限1次"
    }
  }
  ```

#### 分页查询中奖记录

- **接口地址**: `GET /v1/admin/lottery/winners`
- **说明**: 按条件分页查询中奖记录。
- **查询参数**:
  - `current`: (Integer) 当前页码，默认 1
  - `size`: (Integer) 每页数量，默认 10
  - `lotteryId`: (Integer) 抽奖活动 ID (可选)
  - `uid`: (String) 用户 ID (可选)
  - `adminUserId`: (Integer) 管理员用户 ID (可选)，如果提供，则只返回该管理员创建的抽奖活动的中奖记录
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
          "prizeId": 1,
          "prizeName": "iPhone 15",
          "prizeLevel": "特等奖",
          "uid": "user123",
          "winTime": "2025-01-01T12:30:45",
          "status": "unclaimed",
          "claimTime": null,
          "contactInfo": "我真的中奖了！"
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

#### 更新中奖记录状态

- **接口地址**: `PUT /v1/admin/lottery/winner/{id}/status`
- **说明**: 更新指定中奖记录的状态。
- **路径参数**:
  - `id`: (Integer) 中奖记录 ID (必填)
- **查询参数**:
  - `status`: (String) 新状态 (必填，unclaimed/claimed/sent)
  - `contactInfo`: (String) 联系信息 (可选)
- **成功响应** (`200 OK`):
  ```json
  {
    "code": 0,
    "msg": "success",
    "data": "更新成功"
  }
  ```

### H5 临时认证

#### 获取临时 token

- **接口地址**: `POST /h5/auth/temp-token`
- **说明**: 获取用于 H5 的临时访问 token，有效期较短，仅用于基础操作，无需登录。
- **查询参数**:
  - `deviceId`: (String) 设备 ID，可以是随机生成的唯一标识符 (必填)
- **成功响应** (`200 OK`):
  ```json
  {
    "code": 0,
    "msg": "success",
    "data": "临时token字符串"
  }
  ```
- **使用说明**:
  - 临时 token 有效期默认为 1 小时
  - 临时 token 可以用于查看活动、参与抽奖等基础操作
  - 敏感操作（如领奖）仍需完整认证
  - 在请求头中携带 `Authorization: Bearer {临时token}`

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
        "createdAt": "2025-05-07T10:00:00"
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
  - `uid`: (String) 用户 ID (选填)
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
      "win": true, // 是否中奖
      "prize": {
        // 中奖奖项信息，未中奖为null
        "id": 1,
        "lotteryId": 1,
        "level": "特等奖",
        "name": "100 USDT",
        "image": "https://example.com/usdt.png",
        "probability": 0.1,
        "prizeType": "token", // 奖品类型
        "currencyId": 4, // 币种ID（代币奖励时）
        "amount": "100.00000000", // 代币数量（代币奖励时）
        "prepayId": 8 // 预缴ID（代币奖励时）
      },
      "winnerId": 1, // 中奖记录ID，未中奖为null
      "remainingDraws": 2, // 剩余抽奖次数
      "remainingDrawsToday": 0 // 今日剩余抽奖次数
    }
  }
  ```

#### 获取用户中奖记录

- **接口地址**: `GET /v1/lottery/user/{uid}/wins`
- **说明**: 获取指定用户的所有中奖记录。
- **路径参数**:
  - `uid`: (String) 用户 ID (必填)
- **成功响应** (`200 OK`):
  ```json
  {
    "code": 0,
    "msg": "success",
    "data": [
      {
        "id": 1,
        "lotteryId": 1,
        "lotteryName": "新年大抽奖",
        "prizeId": 1,
        "prizeName": "iPhone 15",
        "prizeLevel": "特等奖",
        "uid": "user123",
        "winTime": "2025-01-01T12:30:45",
        "status": "unclaimed",
        "claimTime": null
      }
      // ... 更多记录
    ]
  }
  ```

#### 获取用户参与抽奖记录

- **接口地址**: `GET /v1/lottery/user/{uid}/participations`
- **说明**: 获取指定用户的抽奖参与记录。
- **路径参数**:
  - `uid`: (String) 用户 ID (必填)
- **查询参数**:
  - `current`: (Integer) 当前页码，默认 1
  - `size`: (Integer) 每页数量，默认 10
  - `lotteryId`: (Integer) 抽奖活动 ID (可选)
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
          "lotteryType": "wheel",
          "uid": "user123",
          "participationTime": "2025-01-01T12:30:00",
          "isWin": true,
          "prizeId": 1,
          "prizeName": "iPhone 15",
          "prizeLevel": "特等奖",
          "ip": "192.168.1.1",
          "userAgent": "Mozilla/5.0..."
        }
        // ... 更多记录
      ],
      "total": 20,
      "size": 10,
      "current": 1,
      "pages": 2
    }
  }
  ```

#### 更新中奖联系信息

- **接口地址**: `PUT /v1/lottery/winner/{id}/claim`
- **说明**: 用户提交领奖联系信息。
- **路径参数**:
  - `id`: (Integer) 中奖记录 ID (必填)
- **查询参数**:
  - `contactInfo`: (String) 联系信息 (必填)
- **成功响应** (`200 OK`):
  ```json
  {
    "code": 0,
    "msg": "success",
    "data": "提交成功"
  }
  ```

---

## 🌐 12. 好友助力功能接口

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
    "helpEnabled": 1, // 是否启用好友助力功能(0:禁用,1:启用) (必填)
    "helpLimit": 5, // 每个用户最多可获得的助力次数 (必填，1-100)
    "helpRewardDraws": 1, // 每次助力获得的抽奖次数 (必填，1-10)
    "helpDrawsLimit": 10, // 助力抽奖次数上限 (必填，1-100)
    "helpExpireHours": 24, // 助力邀请链接有效期(小时) (已弃用，助力邀请永不过期)
    "helpRuleDesc": "邀请好友助力，每次助力可获得1次抽奖机会" // 助力规则说明 (可选，最多1000字符)
  }
  ```
- **成功响应** (`200 OK`):
  ```json
  {
    "code": 0,
    "msg": "success",
    "data": "配置保存成功"
  }
  ```

#### 获取助力配置

- **接口地址**: `GET /v1/admin/lottery/help/{lotteryId}/config`
- **说明**: 获取指定抽奖活动的好友助力配置
- **路径参数**:
  - `lotteryId`: (Integer) 抽奖活动 ID (必填)
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
      "helpRewardDraws": 1,
      "helpDrawsLimit": 10,
      "helpExpireHours": 24, // 已弃用，助力邀请永不过期
      "helpRuleDesc": "邀请好友助力，每次助力可获得1次抽奖机会",
      "createdAt": "2025-01-01T10:00:00",
      "updatedAt": "2025-01-01T10:00:00"
    }
  }
  ```

#### 启用/禁用助力功能

- **接口地址**: `PUT /v1/admin/lottery/help/{lotteryId}/toggle`
- **说明**: 启用或禁用指定抽奖活动的好友助力功能
- **路径参数**:
  - `lotteryId`: (Integer) 抽奖活动 ID (必填)
- **查询参数**:
  - `enabled`: (Boolean) 是否启用(true:启用,false:禁用) (必填)
- **成功响应** (`200 OK`):
  ```json
  {
    "code": 0,
    "msg": "success",
    "data": "助力功能已启用"
  }
  ```

#### 获取助力概览

- **接口地址**: `GET /v1/admin/lottery/help/{lotteryId}/overview`
- **说明**: 获取指定抽奖活动的好友助力统计概览
- **路径参数**:
  - `lotteryId`: (Integer) 抽奖活动 ID (必填)
- **成功响应** (`200 OK`):
  ```json
  {
    "code": 0,
    "msg": "success",
    "data": {
      "lotteryId": 1,
      "lotteryName": "新年大抽奖",
      "totalInvitations": 50,
      "totalHelpRecords": 120,
      "totalUsersHelped": 80,
      "totalRewardDraws": 120,
      "activeInvitations": 30,
      "expiredInvitations": 0, // 助力邀请永不过期，此字段为0
      "completedInvitations": 5
    }
  }
  ```

#### 分页查询助力记录

- **接口地址**: `GET /v1/admin/lottery/help/records`
- **说明**: 分页查询指定抽奖活动的好友助力记录
- **查询参数**:
  - `current`: (Integer) 当前页码，默认 1
  - `size`: (Integer) 每页数量，默认 10
  - `lotteryId`: (Integer) 抽奖活动 ID (可选)
  - `inviterUid`: (String) 邀请人用户 ID (可选)
  - `helperUid`: (String) 助力人用户 ID (可选)
- **成功响应** (`200 OK`):
  ```json
  {
    "code": 0,
    "msg": "success",
    "data": {
      "records": [
        {
          "id": 1,
          "invitationId": 1,
          "lotteryId": 1,
          "inviterUid": "user123",
          "helperUid": "friend456",
          "helperIp": "192.168.1.100",
          "helperUserAgent": "Mozilla/5.0...",
          "helpTime": "2025-01-01T12:30:00",
          "rewardDraws": 1,
          "status": "valid",
          "lotteryName": "新年大抽奖",
          "inviterName": "用户123",
          "helperName": "好友456"
        }
      ],
      "total": 120,
      "size": 10,
      "current": 1,
      "pages": 12
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
- **错误响应** (`404 Not Found`):
  ```json
  {
    "code": 404,
    "msg": "助力配置不存在",
    "data": null
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
    "inviterUid": "user123", // 邀请人用户ID (必填)
    "inviteUrl": "https://example.com/invite/{code}" // 自定义邀请链接模板 (可选)
  }
  ```
- **参数说明**:
  - `lotteryId`: (Integer) 抽奖活动 ID，必填
  - `inviterUid`: (String) 邀请人用户 ID，必填
  - `inviteUrl`: (String) 自定义邀请链接模板，可选。如果不提供，系统会自动生成默认的邀请链接。如果提供，请使用 `{code}` 作为邀请码的占位符，系统会自动替换为实际的邀请码
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

#### 获取用户的助力邀请

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
- **参数说明**:
  - `inviteCode`: (String) 邀请码，必填，用于标识助力邀请
  - `helperUid`: (String) 助力人用户 ID，必填，用于标识助力用户
  - `helperIp`: (String) 助力人 IP 地址，可选，用于防刷和统计，如果不提供系统会自动从请求中获取。**注意：系统会自动截断至 45 字符以内**
  - `helperUserAgent`: (String) 助力人用户代理，可选，用于设备识别和统计，如果不提供系统会自动从请求头中获取。**注意：系统会自动截断至 250 字符以内，避免数据库写入错误**
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
- **错误响应** (`400 Bad Request`):
  ```json
  {
    "code": 400,
    "msg": "您已经为该邀请助力过了",
    "data": {
      "lotteryId": 12
    }
  }
  ```
- **其他可能的错误响应**:
  - `"邀请码不存在或已失效"` - 邀请码无效，返回 `lotteryId: null`
  - `"邀请已失效，无法助力"` - 邀请状态不是 active，返回对应的 `lotteryId`
  - ~~`"邀请已过期，无法助力"`~~ - ~~邀请已过期~~（已移除时间限制）
  - `"该邀请已达到最大助力次数"` - 助力次数已达上限，返回对应的 `lotteryId`
  - `"不能为自己助力"` - 自己给自己助力，返回对应的 `lotteryId`
  - `"您已经为该邀请助力过了"` - 重复助力，返回对应的 `lotteryId`
  - `"该抽奖活动的助力功能已关闭"` - 助力功能被禁用，返回对应的 `lotteryId`

**注意**：所有响应（成功和失败）都包含 `lotteryId` 字段：

- 如果邀请码能匹配到数据库记录，返回对应的抽奖活动 ID
- 如果邀请码匹配不到，返回 `null`

#### 获取用户助力统计

- **接口地址**: `GET /v1/lottery/help/{lotteryId}/my-stats`
- **说明**: 获取指定用户在指定抽奖活动中的助力统计
- **路径参数**:
  - `lotteryId`: (Integer) 抽奖活动 ID (必填)
- **查询参数**:
  - `uid`: (String) 用户 ID (必填)
- **成功响应** (`200 OK`):
  ```json
  {
    "code": 0,
    "msg": "success",
    "data": {
      "id": 1,
      "lotteryId": 1,
      "uid": "user123",
      "totalHelpReceived": 15,
      "totalHelpDraws": 15,
      "usedHelpDraws": 5,
      "remainingHelpDraws": 10,
      "lastHelpTime": "2025-01-01T12:30:00",
      "createdAt": "2025-01-01T10:00:00",
      "updatedAt": "2025-01-01T12:30:00"
    }
  }
  ```

#### 获取用户助力记录

- **接口地址**: `GET /v1/lottery/help/{lotteryId}/my-records`
- **说明**: 获取指定用户在指定抽奖活动中的助力记录
- **路径参数**:
  - `lotteryId`: (Integer) 抽奖活动 ID (必填)
- **查询参数**:
  - `uid`: (String) 用户 ID (必填)
- **成功响应** (`200 OK`):
  ```json
  {
    "code": 0,
    "msg": "success",
    "data": [
      {
        "id": 1,
        "invitationId": 1,
        "lotteryId": 1,
        "inviterUid": "user123",
        "helperUid": "friend456",
        "helperIp": "192.168.1.100",
        "helperUserAgent": "Mozilla/5.0...",
        "helpTime": "2025-01-01T12:30:00",
        "rewardDraws": 1,
        "status": "valid",
        "lotteryName": "新年大抽奖",
        "inviterName": "用户123",
        "helperName": "好友456"
      }
    ]
  }
  ```

#### 获取助力排行榜

- **接口地址**: `GET /v1/lottery/help/{lotteryId}/ranking`
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

#### 根据活动 ID 获取抽奖活动

- **接口地址**: `GET /v1/lottery/help/activity/{activityId}`
- **说明**: 根据 activityId 字段返回对应的抽奖活动列表
- **路径参数**:
  - `activityId`: (Integer) 活动 ID (必填)
- **成功响应** (`200 OK`):
  ```json
  {
    "code": 0,
    "msg": "success",
    "data": [
      {
        "id": 1,
        "name": "新年大抽奖",
        "sponsor": "Aisky",
        "icon": "/images/lottery/icon1.png",
        "background": "/images/lottery/bg1.png",
        "description": "新年期间的大抽奖活动",
        "lotteryType": "wheel",
        "startTime": "2025-01-01T00:00:00",
        "endTime": "2025-01-31T23:59:59",
        "status": "published",
        "createdBy": 1,
        "activityId": 123,
        "activityName": "新年活动",
        "createdAt": "2025-01-01T10:00:00",
        "updatedAt": "2025-01-01T10:00:00",
        "createdByUsername": "admin"
      }
    ]
  }
  ```

#### 根据创建者获取抽奖活动

- **接口地址**: `GET /v1/lottery/help/creator/{createdBy}`
- **说明**: 根据 uid 返回其创建的抽奖活动列表
- **路径参数**:
  - `createdBy`: (String) 创建者 UID (必填)
- **成功响应** (`200 OK`):
  ```json
  {
    "code": 0,
    "msg": "success",
    "data": [
      {
        "id": 1,
        "name": "新年大抽奖",
        "sponsor": "Aisky",
        "icon": "/images/lottery/icon1.png",
        "background": "/images/lottery/bg1.png",
        "description": "新年期间的大抽奖活动",
        "lotteryType": "wheel",
        "startTime": "2025-01-01T00:00:00",
        "endTime": "2025-01-31T23:59:59",
        "status": "published",
        "createdBy": 1,
        "activityId": 123,
        "activityName": "新年活动",
        "createdAt": "2025-01-01T10:00:00",
        "updatedAt": "2025-01-01T10:00:00",
        "createdByUsername": "admin"
      }
    ]
  }
  ```

### 助力功能说明

1. **助力流程**：

   - 用户 A 在抽奖活动中创建助力邀请
   - 系统生成唯一邀请码和邀请链接
   - 用户 A 分享邀请链接给好友
   - 好友 B 通过链接进入助力页面
   - 好友 B 点击助力按钮，系统验证并记录助力
   - 用户 A 获得额外的抽奖次数

2. **防刷机制**：

   - 自己无法给自己助力：邀请人不能为自己的邀请助力
   - 重复助力限制：同一用户不能为同一邀请多次助力
   - 助力上限：每个邀请最多只能获得指定次数的助力
   - ~~邀请有效期：助力邀请链接有过期时间限制~~（已移除时间限制）
   - 助力功能开关：管理员可以启用/禁用助力功能

3. **邀请有效期**：

   - 助力邀请链接永不过期
   - 用户创建的邀请可以长期使用，直到达到最大助力次数
   - 邀请状态为 `active` 时始终有效

4. **抽奖次数计算与消耗机制**：

   **次数构成**：

   ```
   用户总抽奖次数 = 基础抽奖次数 + 助力获得抽奖次数
   剩余抽奖次数 = 用户总抽奖次数 - 已使用抽奖次数
   ```

   **消耗优先级**：

   - 优先使用基础抽奖次数
   - 基础次数用完后，自动使用助力获得的抽奖次数
   - 每次参与抽奖（`POST /v1/lottery/participate`）会消耗 1 次抽奖机会

   **助力次数消耗逻辑**：

   - 当用户参与抽奖时，系统会检查用户的参与次数
   - 如果参与次数 > 基础次数，系统会自动消耗助力次数
   - 消耗的助力次数 = 参与次数 - 基础次数
   - 助力次数消耗会记录在 `lottery_user_help_stats` 表中

   **示例**：

   - 基础抽奖次数：3 次
   - 助力获得次数：2 次
   - 用户参与第 4 次抽奖时，系统会消耗 1 次助力次数
   - 用户参与第 5 次抽奖时，系统会消耗 1 次助力次数
   - 第 6 次参与时，助力次数用完，无法继续参与

5. **时间限制变更说明**：

   **重要更新**：助力邀请现在永不过期！

   - **变更前**：助力邀请有 24 小时的过期时间限制
   - **变更后**：助力邀请永不过期，用户可以长期使用创建的邀请链接
   - **API 变更**：
     - `expireTime` 字段现在返回 `null`
     - `helpExpireHours` 配置字段已标记为弃用
     - 移除了"邀请已过期，无法助力"的错误响应
   - **向后兼容**：
     - 保留了所有数据库字段和 API 接口
     - 现有数据不会受到影响
     - 配置字段仍然存在但不再生效

---

## API 变更日志

### v1.3.2 (2025-01-15) - 预缴发放接口添加签名验证

- **接口更新**：`POST /open/act/prepay/add` 现在需要 `signCode` 参数
- **安全增强**：
  - 新增签名验证机制，防止接口被恶意调用
  - 签名规则：`MD5("kwowemm@lsloa" + prepayid + currencyId + amount)`
  - 服务端会验证传入的签名是否正确
- **向后兼容**：需要调用方按照新的签名规则生成 signCode

### v1.3.1 (2025-01-15) - 助力接口返回 lotteryId

- **接口更新**：`POST /v1/lottery/help/assist` 现在返回 `lotteryId`
- **变更内容**：
  - 成功响应现在包含 `lotteryId` 字段，标识助力所属的抽奖活动
  - 响应格式从简单字符串改为包含 `message` 和 `lotteryId` 的对象
  - 便于前端识别助力操作对应的具体抽奖活动

### v1.3.0 (2025-01-15) - 助力邀请时间限制移除

- **重要更新**：助力邀请现在永不过期
- **变更内容**：
  - 助力邀请不再有 24 小时的过期时间限制
  - `expireTime` 字段现在返回 `null`
  - `helpExpireHours` 配置字段已标记为弃用
  - 移除了"邀请已过期，无法助力"的错误响应
- **向后兼容**：保留了所有数据库字段和 API 接口
- **用户体验提升**：用户可以长期使用创建的邀请链接

### v1.2.0 (2025-05-08)

- 优化了助力抽奖次数消耗机制
- 修复了助力次数无法正确消耗的问题

### v1.1.0 (2025-01-10)

- 新增助力邀请自定义 URL 功能
- 支持{code}占位符替换

### v1.0.0 (2025-01-01)

- 初始版本发布
- 包含基础抽奖功能
- 包含好友助力功能
