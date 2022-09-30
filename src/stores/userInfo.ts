import {defineStore} from 'pinia';
import {UserInfosStates} from './interface';
import {Local} from '/@/utils/storage';

/**
 * 用户信息
 * @methods setUserInfos 设置用户信息
 */
export const useUserInfo = defineStore('userInfo', {
    state: (): UserInfosStates => ({
        userInfos: {
            id:-1,
            userName: '',
            name:'',
            photo: '',
            roles: [],
            authBtnList: [],
            phone:'',
            email:'',
            time: 0,
        },
    }),
    actions: {
        async setUserInfos() {
            this.userInfos = Local.get('userInfos');
        },
    },
});
