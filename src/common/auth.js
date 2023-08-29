import { logDebug } from "./logger";
import { promisify } from "./promisify";
import { saveToken, getAccessToken, directusHostUrl } from "./transport";
import { reportError } from "./errors";

const authLoginUrl = directusHostUrl() + "/auth/login/wechatminiprogram";

/**
 * @returns {Promise<string|undefined>} accessToken
 */
export async function login() {
  logDebug("auth.login.start");

  // 避免频繁调用 wx.login
  try {
    return await getAccessToken();
  } catch (err) {
    logDebug("auth.login.getAccessToken:err=%o", err);
    return await wxLogin();
  }
}

/**
 * 后台需要使用微信的session_key这个字段时，用这个函数保证session_key不过期是最新的
 */
export async function checkSession() {
  try {
    await promisify(wx.checkSession)({});
    //session_key 未过期，并且在本生命周期一直有效
  } catch (err) {
    // session_key 已经失效，需要重新执行登录流程
    await wxLogin();
  }
}

export function logout() {
  // TODO
}

async function wxLogin() {
  try {
    const res = await promisify(wx.login)({});
    const accessToken = await doLogin(res.code);
    return accessToken;
  } catch (err) {
    reportError(err);
    return undefined;
  }
}

/**
 * 处理 wx.login 成功
 * @param {string} code
 * @returns {Promise<string>} accessToken
 */
async function doLogin(code) {
  logDebug(`wx.login:code=${code}`);
  // 发送 code 到后台换取 openId, sessionKey, unionId
  const res = await promisify(wx.request)({
    url: authLoginUrl,
    data: { code },
    method: "GET",
  });
  logDebug(`wx.request:url=${authLoginUrl},res=%o`, res.data);
  // 开发者服务器返回自定义登录态，存入storage
  saveToken(res.data.data);
  return res.data.data.access_token;
}
