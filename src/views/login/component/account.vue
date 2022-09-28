<template>
  <el-form size="large" class="login-content-form" :rules="rules" ref="formRef" :model="data">
    <el-form-item class="login-animation1" prop="userName">
      <el-input type="text" placeholder="请输入账号" v-model="data.userName" clearable autocomplete="off">
        <template #prefix>
          <el-icon class="el-input__icon">
            <ele-User/>
          </el-icon>
        </template>
      </el-input>
    </el-form-item>
    <el-form-item class="login-animation2" prop="password">
      <el-input :type="isShowPassword ? 'text' : 'password'" placeholder="请输入密码" v-model="data.password"
                autocomplete="off">
        <template #prefix>
          <el-icon class="el-input__icon">
            <ele-Unlock/>
          </el-icon>
        </template>
        <template #suffix>
          <i
              class="iconfont el-input__icon login-content-password"
              :class="isShowPassword ? 'icon-yincangmima' : 'icon-xianshimima'"
              @click="isShowPassword = !isShowPassword"
          >
          </i>
        </template>
      </el-input>
    </el-form-item>
    <el-form-item class="login-animation4">
      <el-button type="primary" class="login-content-submit" round @click="onSignIn(formRef)" :loading="loading">
        <span>登 录</span>
      </el-button>
    </el-form-item>
  </el-form>
</template>

<script lang="ts">
import {toRefs, reactive, defineComponent, computed, ref} from 'vue';
import {useRoute, useRouter} from 'vue-router';
import {ElMessage, FormInstance} from 'element-plus';
import {initFrontEndControlRoutes} from '/@/router/frontEnd';
import {Session} from '/@/utils/storage';
import {formatAxis} from '/@/utils/formatTime';
import {NextLoading} from '/@/utils/loading';
import {signIn} from "/@/api/login";
import {UserInfosState} from "/@/stores/interface";

export default defineComponent({
  name: 'loginAccount',
  setup() {
    const formRef = ref()
    const route = useRoute();
    const router = useRouter();
    const state = reactive({
      isShowPassword: false,
      data: {
        userName: '',
        password: '',
      },
      loading: false,
    });
    // 时间获取
    const currentTime = computed(() => {
      return formatAxis(new Date());
    });
    const rules = reactive({
      userName: [{required: true, message: '请输入账号', trigger: 'blur'}],
      password: [{required: true, message: '请输入密码', trigger: 'blur'}]
    })

    // 登录
    const onSignIn = async (formEl: FormInstance) => {
      // 检查是否填写
      await formEl.validate((valid) => {
        if (valid) {
          verify()
        } else {
          ElMessage.error('必须填写信息')
        }
      })
    };
    // 检查账号密码是否正确
    const verify =  async() => {
      // 按钮显示加载动画
      state.loading = true;

      const userInfos:UserInfosState = {
        id: 1,
        userName: '123088',
        name: 'mzx',
        photo: 'https://img2.baidu.com/it/u=1978192862,2048448374&fm=253&fmt=auto&app=138&f=JPEG?w=504&h=500',
        roles:  ['admin'] ,
        authBtnList: ['btn.add', 'btn.del', 'btn.edit', 'btn.link'],
        phone: '1888888',
        email: 'xxxemail',
        time: new Date().getTime(), //登陆时间
      }
      // 用户信息存放到sessionStorage中
      Session.set('userInfo', userInfos);

      // 随机生成一个token,存放到cookie中
      Session.set('token', Math.random().toString(36).substring(0));
      // 更新信息到 路由、pinia
      await initFrontEndControlRoutes();
      signInSuccess();
      // 请求登陆接口
      // signIn({
      //   username: state.data.userName,
      //   password: state.data.password
      // }).then(async (rsp) => {
      //   const res = rsp.data;
      //   if (rsp.code == 200) {
      //     const userInfos: UserInfosState = {
      //       id: res.id,
      //       userName: res.username,
      //       name: res.name,
      //       photo: res.img,
      //       roles: res.role === 1 ? ['admin'] : ['common'],
      //       authBtnList: ['btn.add', 'btn.del', 'btn.edit', 'btn.link'],
      //       phone: res.number,
      //       email: res.email,
      //       time: new Date().getTime(), //登陆时间
      //     }
      //     // 用户信息存放到sessionStorage中
      //     Session.set('userInfo', userInfos);
      //
      //     // 随机生成一个token,存放到cookie中
      //     Session.set('token', Math.random().toString(36).substring(0));
      //     // 更新信息到 路由、pinia
      //     await initFrontEndControlRoutes();
      //     signInSuccess();
      //   } else {
      //     ElMessage.error('账号或密码错误')
      //   }
      //   // 关闭 loading
      //   state.loading = false;
      // })
    }


    // 登录成功后的跳转
    const signInSuccess = () => {
      // 未登陆进入系统时，路径会被转义。登录成功后重定向到对应的路径中。
      if (route.query?.redirect) {
        router.push({
          path: <string>route.query?.redirect,
          query: Object.keys(<string>route.query?.params).length > 0 ? JSON.parse(<string>route.query?.params) : '',
        });
      } else {
        //默认进入首页
        router.push('/');
      }
      ElMessage.success(`${currentTime.value}`);
      NextLoading.start();
    };
    return {
      onSignIn,
      ...toRefs(state),
      rules,
      formRef
    };
  },
});
</script>

<style scoped lang="scss">
.login-content-form {
  margin-top: 20px;
  @for $i from 1 through 4 {
    .login-animation#{$i} {
      opacity: 0;
      animation-name: error-num;
      animation-duration: 0.5s;
      animation-fill-mode: forwards;
      animation-delay: calc($i/10) + s;
    }
  }

  .login-content-password {
    display: inline-block;
    width: 20px;
    cursor: pointer;

    &:hover {
      color: #909399;
    }
  }

  .login-content-code {
    width: 100%;
    padding: 0;
    font-weight: bold;
    letter-spacing: 5px;
  }

  .login-content-submit {
    width: 100%;
    letter-spacing: 2px;
    font-weight: 300;
    margin-top: 15px;
  }
}
</style>
