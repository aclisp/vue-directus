import { logDebug } from './logger';
import { saveToken, getAccessToken, getRefreshToken, httpPost, resetToken } from './transport';
import { reportError } from './errors';

/**
 * @returns {Promise<string|undefined>} accessToken
 */
export async function login(username, password) {
  logDebug(`auth.login.start:username=${username},password=${password}`);

  // 避免频繁调用 wx.login
  try {
    return await getAccessToken();
  } catch (err) {
    logDebug('auth.login.getAccessToken:err=%o', err);
    return await doLogin(username, password);
  }
}

export async function logout() {
  try {
    const refresh_token = await getRefreshToken();
    await httpPost('/auth/logout', { refresh_token });
  } catch (err) {
    // do nothing
  }
  resetToken();
}

async function doLogin(username, password) {
  const res = await httpPost(
    '/auth/login',
    {
      email: username,
      password: password,
    },
    {
      noAuthorizationHeader: true,
      accessToken: null,
    },
  );
  logDebug('auth.login.httpPost:res=%o', res);
  if (res.ok) {
    saveToken(res);
    return res.access_token;
  }
  reportError(res.msg);
  return undefined;
}
