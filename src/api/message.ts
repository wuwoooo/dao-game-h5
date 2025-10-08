// 用户消息相关API

import { getUserInfoFromCache } from "../utils/auth";

// 获取用户认证头信息
function getUserAuthHeaders() {
  const userInfo = getUserInfoFromCache();
  if (!userInfo) {
    throw new Error("用户未登录");
  }

  return {
    "X-User-Uid": userInfo.uid,
    "X-User-Uuid": userInfo.uuid,
    "X-User-Token": userInfo.token,
  };
}

// 发送用户私信
export async function sendUserMessage(data: {
  receiverUid: string;
  receiverNickname: string;
  receiverAvatar?: string;
  content: string;
  messageType?: string;
  title?: string;
}) {
  const headers = getUserAuthHeaders();

  const response = await fetch(
    `${import.meta.env.VITE_API_BASE_URL || ""}/api/message/send`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
      body: JSON.stringify({
        ...data,
        messageType: data.messageType || "user",
      }),
    }
  );

  const result = await response.json();

  if (result.code !== 0) {
    throw new Error(result.msg || "发送消息失败");
  }

  return result;
}

// 获取对话列表
export async function getConversations() {
  const headers = getUserAuthHeaders();

  const response = await fetch(
    `${import.meta.env.VITE_API_BASE_URL || ""}/api/message/conversations`,
    {
      method: "GET",
      headers,
    }
  );

  const result = await response.json();

  if (result.code !== 0) {
    throw new Error(result.msg || "获取对话列表失败");
  }

  return result;
}

// 获取对话详情
export async function getConversationDetail(
  otherUid: string,
  conversationType: string,
  current = 1,
  size = 10
) {
  const headers = getUserAuthHeaders();

  const response = await fetch(
    `${
      import.meta.env.VITE_API_BASE_URL || ""
    }/api/message/conversations/${otherUid}?conversationType=${conversationType}&current=${current}&size=${size}`,
    {
      method: "GET",
      headers,
    }
  );

  const result = await response.json();

  if (result.code !== 0) {
    throw new Error(result.msg || "获取对话详情失败");
  }

  return result;
}

// 标记消息为已读
export async function markMessagesAsRead(messageIds: number[]) {
  const headers = getUserAuthHeaders();

  const response = await fetch(
    `${import.meta.env.VITE_API_BASE_URL || ""}/api/message/mark-read`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
      body: JSON.stringify(messageIds),
    }
  );

  const result = await response.json();

  if (result.code !== 0) {
    throw new Error(result.msg || "标记消息已读失败");
  }

  return result;
}

// 获取用户私信统计
export async function getMessageStatistics() {
  const headers = getUserAuthHeaders();

  const response = await fetch(
    `${import.meta.env.VITE_API_BASE_URL || ""}/api/message/statistics`,
    {
      method: "GET",
      headers,
    }
  );

  const result = await response.json();

  if (result.code !== 0) {
    throw new Error(result.msg || "获取消息统计失败");
  }

  return result;
}
