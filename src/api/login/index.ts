import request from '/@/utils/request';

// 登陆接口
/**
 *
 * @param obj 请求参数
 */
export function signIn(obj:object) {
    return request({
        url: '/user/login',
        method: 'post',
        data: obj,
        // withCredentials:false
    });
}
