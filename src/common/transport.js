import { logDebug } from './logger';
import { Storage } from './storage';
import { NeedLoginError, AnotherUserLoginError } from './errors';
// eslint-disable-next-line no-unused-vars
import { URLSearchParams } from './url-search-params-polyfill';
import jwtDecode from './jwt-decode';

const directusHost = 'http://192.168.0.109:8055';

/**
 * Promise of Storage
 * @type {Promise<Storage>|undefined}
 */
let refreshInProgress = undefined;

/**
 * current user id after authenticate; it is used to prevent access token from overwriting
 * by another login from the same browser.
 * @type {string|undefined}
 */
let userId = undefined;

// import side effects
init();

function init() {
  logDebug(`transport.init`);
  const storage = Storage.load();
  if (storage) {
    userId = decodeUserId(storage.accessToken);
    logDebug(`transport.init.decodeUserId:userId=${userId}`);
  }
}

export function directusHostUrl() {
  return directusHost;
}

export function directusHostOrigin() {
  const url = new URL(directusHost);
  return url.origin;
}

/**
 * @param {string} fileId
 * @param {string} accessToken
 */
export function assetsUrl(fileId, accessToken) {
  return directusHost + '/assets/' + fileId + '?access_token=' + accessToken;
}

export function saveToken(loginInfo) {
  const storage = new Storage(loginInfo);
  storage.save();
  logDebug(`SAVE token until ${storage.expiresDate}`);
  userId = decodeUserId(loginInfo.access_token);
}

export function resetToken() {
  Storage.reset();
  userId = undefined;
}

/**
 * @param {string} path
 * @param {object} data
 * @param {object} options
 * @param {boolean=} options.noAuthorizationHeader - 是否加认证请求头
 * @param {(string|null)=} options.accessToken - Skip refreshing the access token if it is null.
 * @param {URLSearchParams=} options.params - Global query parameters
 * @param {function=} options.mapResponse - JSON response transformer
 * @returns {Promise<any>} Promise of data with `ok` and `msg`
 */
export async function httpPost(path, data, options = {}) {
  let { noAuthorizationHeader = false, accessToken, params, mapResponse } = options;
  logDebug(`POST ${path}`);

  if (accessToken === undefined) {
    accessToken = await getAccessToken();
  }

  const headers = {
    'Content-Type': 'application/json',
  };
  if (!noAuthorizationHeader) {
    if (!accessToken) {
      throw new Error(`missing access token: ${accessToken}`);
    }
    headers['Authorization'] = `Bearer ${accessToken}`;
  }

  let url = directusHost + path;
  if (params) {
    url += '?' + params;
  }

  const res = await fetch(url, {
    body: JSON.stringify(data),
    headers: headers,
    method: 'POST',
  });
  if (res.status < 200 || res.status > 299) {
    return failure(res);
  }
  return success(res, mapResponse);
}

/**
 * @param {string} path
 * @param {object} options
 * @param {boolean=} options.noAuthorizationHeader - 是否加认证请求头
 * @param {(string|null)=} options.accessToken - Skip refreshing the access token if it is null.
 * @param {URLSearchParams=} options.params - Global query parameters
 * @param {function=} options.mapResponse - JSON response transformer
 * @returns {Promise<any>} Promise of data with `ok` and `msg`
 */
export async function httpGet(path, options = {}) {
  let { noAuthorizationHeader = false, accessToken, params, mapResponse } = options;
  logDebug(`GET ${path}`);

  if (accessToken === undefined) {
    accessToken = await getAccessToken();
  }

  const headers = {};
  if (!noAuthorizationHeader) {
    if (!accessToken) {
      throw new Error(`missing access token: ${accessToken}`);
    }
    headers['Authorization'] = `Bearer ${accessToken}`;
  }

  let url = directusHost + path;
  if (params) {
    url += '?' + params;
  }

  const res = await fetch(url, {
    headers: headers,
    method: 'GET',
  });
  if (res.status < 200 || res.status > 299) {
    return failure(res);
  }
  return success(res, mapResponse);
}

function failure(res) {
  return {
    ok: false,
    msg: `${res.status} ${res.statusText}`,
  };
}

function success(res, mapResponse) {
  if (res.statusCode == 204) {
    return {
      ok: true,
      msg: `204 No Content`,
    };
  }

  const json = res.data;

  let data;
  if (mapResponse) {
    data = mapResponse(json);
  } else if (typeof json === 'object' && json && 'data' in json) {
    data = Array.isArray(json.data) ? json : json.data;
  } else {
    data = json;
  }

  return {
    ok: true,
    msg: `${res.status} OK`,
    ...data,
  };
}

export async function getAccessToken() {
  const storage = await getToken();
  const tokenUserId = decodeUserId(storage.accessToken);
  if (userId !== tokenUserId) {
    throw new AnotherUserLoginError('user mismatch');
  }
  return storage.accessToken;
}

// eslint-disable-next-line no-unused-vars
async function getRefreshToken() {
  const storage = await getToken();
  return storage.refreshToken;
}

async function getToken() {
  const storage = Storage.load();
  if (!storage) {
    throw new NeedLoginError('never login');
  }

  const expiresAt = storage.expiresAt;
  if (expiresAt < Date.now() + 30000) {
    if (refreshInProgress) {
      return await waitForRefresh();
    }

    refresh(storage);
    return await waitForRefresh();
  }

  return storage;
}

async function waitForRefresh() {
  if (!refreshInProgress) {
    throw new Error('no refresh in progress');
  }

  try {
    return await refreshInProgress;
  } finally {
    refreshInProgress = undefined;
  }
}

/**
 * @param {Storage} storage
 */
function refresh(storage) {
  const refreshPromise = async () => {
    const refreshToken = storage.refreshToken;
    const loginResult = await _refresh(refreshToken);
    if (loginResult.ok) {
      const storage = new Storage(loginResult);
      storage.save();
      logDebug(`SAVE token until ${storage.expiresDate}`);
      return storage;
    } else {
      throw new NeedLoginError('refresh failure');
    }
  };

  refreshInProgress = refreshPromise();
}

async function _refresh(refreshToken) {
  return await httpPost(
    '/auth/refresh',
    {
      refresh_token: refreshToken,
      mode: 'json',
    },
    {
      noAuthorizationHeader: true,
      accessToken: null,
    },
  );
}

/**
 * @param {string} token
 * @returns {string}
 */
function decodeUserId(token) {
  const decoded = jwtDecode(token);
  return decoded.id;
}
