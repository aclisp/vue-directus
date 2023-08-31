import { logDebug } from './logger';
import { saveToken, getAccessToken, httpPost } from './transport';
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

export function logout() {
  // TODO
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
