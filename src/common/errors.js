import { logError } from './logger';

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
  logError('系统异常:err=%o', err);
  wx.showToast({
    title: `系统异常(${err.errno ?? -1}) ${err.errMsg}`,
    icon: 'none',
    duration: 10000,
  });
}
