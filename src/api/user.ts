// 用户相关 API 封装
import axios from "axios";

const THIRD_PARTY_URL = import.meta.env.VITE_Aisky_API_BASE_URL;

// 获取用户信息（第三方接口）
export function getUserInfo({
  uuid,
  token,
  uid,
}: {
  uuid: string;
  token: string;
  uid: string;
}) {
  return axios.get(`${THIRD_PARTY_URL}/open/redpacket/my/info`, {
    params: { uuid, token, uid },
  });
}

// 用户登录（第三方接口）
export function userSignIn({
  phone,
  password,
  source,
}: {
  phone: string;
  password: string;
  source: string;
}) {
  return axios.post(`${THIRD_PARTY_URL}/user/signin`, null, {
    params: { phone, password, source },
  });
}

// 生成短链（第三方接口）
export function getShortUrl({
  uuid,
  token,
  uid,
  oriUrl,
}: {
  uuid: string;
  token: string;
  uid: string;
  oriUrl: string;
}) {
  return axios.get(`${THIRD_PARTY_URL}/open/getShortUrl`, {
    params: { uuid, token, uid, oriUrl },
  });
}

// 根据 UID 查询用户昵称
export function getNicknames(uids: string) {
  return axios.get(`${THIRD_PARTY_URL}/user/getNicknames`, {
    params: { uids },
  });
}
