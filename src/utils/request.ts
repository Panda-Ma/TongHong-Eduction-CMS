import axios from 'axios';
import {ElMessage} from 'element-plus';
import {Session} from '/@/utils/storage';
import Cookies from 'js-cookie'
// 配置新建一个 axios 实例
const service = axios.create({
    baseURL: import.meta.env.VITE_API_URL as any,
    timeout: 50000,
    headers: {'Content-Type': 'application/json'},
    // withCredentials:true
});

// 添加响应拦截器
service.interceptors.response.use(
    (response) => {
        // 对响应数据做点什么
        const res = response.data;
        if ( res.code === 400) {
            Session.clear(); // 清除浏览器全部临时缓存
            Cookies.remove('token')
            window.location.href = '/'; // 去登录页
            ElMessage.error('你已被登出，请重新登录')
            return Promise.reject(service.interceptors.response);
        } else {
            return response.data;
        }
    },
    (error) => {
        // 对响应错误做点什么
        if (error.message.indexOf('timeout') != -1) {
            ElMessage.error('网络超时');
        } else if (error.message == 'Network Error') {
            ElMessage.error('网络连接错误');
        } else {
            if (error.response.data) ElMessage.error(error.response.statusText);
            else ElMessage.error('接口路径找不到');
        }
        return Promise.reject(error);
    }
);

// 导出 axios 实例
export default service;
