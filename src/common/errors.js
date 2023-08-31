export class NeedLoginError extends Error {
  constructor(message) {
    super(message);
    this.name = 'NeedLoginError';
  }
}

export class AnotherUserLoginError extends Error {
  constructor(message) {
    super(message);
    this.name = 'AnotherUserLoginError';
  }
}

/**
 * 用 Toast 方式提示错误
 * @param {WechatMiniprogram.RequestFailCallbackErr} err - fail 回调函数的参数
 */
export function reportError(err) {
  throw new Error(String(err));
}
