// 封装会员服务用到的服务端API
// 会员joy_user是小程序的用户，与directus_user是1:1的关系。
// 一开始会员记录是不存在的，因此判断用户是否会员，使用user.ext===undefined
// 用户报名，系统要求它先填写会员表单，成为会员。
// 用户也可以主动申请成为会员。
// 填写会员表单时，将收集用户信息：姓名、手机、头像、地址、职位。这些信息暂时不允许其自行修改。
// 会员名下有订单和积分。

import { logDebug } from './logger';
import { httpGet } from './transport';
import { URLSearchParams } from './url-search-params-polyfill';

export class User {
  id?: string = undefined;
  first_name?: string = undefined;
  last_name?: string = undefined;
  email?: string = undefined;
  avatar?: string = undefined;
  ext?: object;
}

export async function fetchUserInfo() {
  const params = new URLSearchParams();
  params.append('fields', Object.keys(new User()).join(','));
  const user = await httpGet('/users/me', { params });
  logDebug('user=%o', user);
  if (user.ok && user.id) {
    const ext = await fetchUserInfoExt(user.id);
    user.ext = ext;
  }
  return user as User;
}

async function fetchUserInfoExt(userId: string) {
  const params = new URLSearchParams();
  params.append('fields', '*');
  params.append('filter', JSON.stringify({ sys_user: { _eq: userId } }));
  params.append('limit', 1);
  const { ok, data } = await httpGet('/items/joy_user', { params });
  return ok && data.length > 0 ? data[0] : undefined;
}
