<template>
  <div class="personal">
    <el-row>
      <!-- 个人信息 -->
      <el-col :xs="24" :sm="16">
        <el-card shadow="hover" header="个人信息">
          <div class="personal-user">
            <div class="personal-user-left">
              <div class="waterfall-first-item" v-waves>
                <el-upload :action="VITE_UPLOAD_IMG" :before-upload="beforeAvatarUpload"
                           :on-success="handleAvatarSuccess" :show-file-list="false">
                  <el-avatar :size="150"
                             :src="avatarUrl"/>
                </el-upload>

              </div>

              <div class="personal-title mt18">小明</div>

            </div>
            <div class="personal-user-right">

              <el-row>
                <el-col :xs="24" :sm="8" class="personal-item mb6">
                  <div class="personal-item-label">昵称：</div>
                  <div class="personal-item-value">Xxx</div>
                </el-col>
              </el-row>


              <el-row>
                <el-col :xs="24" :sm="16" class="personal-item mb6">
                  <div class="personal-item-label">身份：</div>
                  <div class="personal-item-value">超级管理</div>
                </el-col>
              </el-row>

              <el-row>
                <el-col :xs="24" :sm="8" class="personal-item mb6">
                  <div class="personal-item-label">登录IP：</div>
                  <div class="personal-item-value">192.168.1.1</div>
                </el-col>
              </el-row>

              <el-row>
                <el-col :xs="24" :sm="16" class="personal-item mb6">
                  <div class="personal-item-label">登录时间：</div>
                  <div class="personal-item-value">2021-02-05 18:47:26</div>
                </el-col>
              </el-row>

              <el-row>
                <el-col :xs="24" :sm="16" class="personal-item mb6">
                  <div class="personal-item-label">电子邮件：</div>
                  <div class="personal-item-value">abcedefg@gmail.com</div>
                </el-col>
              </el-row>

              <el-row>
                <el-col :xs="24" :sm="16" class="personal-item mb6">
                  <div class="personal-item-label">电话号码：</div>
                  <div class="personal-item-value">1898989123</div>
                </el-col>
              </el-row>
            </div>
          </div>
        </el-card>
      </el-col>

      <!-- 消息通知 -->
      <el-col :xs="24" :sm="8" class="pl15 personal-info">
        <el-card shadow="hover">
          <template #header>
            <span>消息通知</span>
            <span class="personal-info-more">更多</span>
          </template>
          <div class="personal-info-box">
            <ul class="personal-info-ul">
              <li v-for="(v, k) in newsInfoList" :key="k" class="personal-info-li">
                <a :href="v.link" target="_block" class="personal-info-li-title">{{ v.title }}</a>
              </li>
            </ul>
          </div>
        </el-card>
      </el-col>

      <!-- 更新信息 -->
      <el-col :span="24">
        <el-card shadow="hover" class="mt15 personal-edit" header="更新信息">
          <div class="personal-edit-title">基本信息</div>
          <el-form :model="personalForm" size="default" label-width="40px" class="mt35 mb35">
            <el-row :gutter="35">
              <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="4" class="mb20">
                <el-form-item label="昵称">
                  <el-input v-model="personalForm.name" placeholder="请输入昵称" clearable></el-input>
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="4" class="mb20">
                <el-form-item label="邮箱">
                  <el-input v-model="personalForm.email" placeholder="请输入邮箱" clearable></el-input>
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="4" class="mb20">
                <el-form-item label="签名">
                  <el-input v-model="personalForm.autograph" placeholder="请输入签名" clearable></el-input>
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="4" class="mb20">
                <el-form-item label="职业">
                  <el-select v-model="personalForm.occupation" placeholder="请选择职业" clearable class="w100">
                    <el-option label="计算机 / 互联网 / 通信" value="1"></el-option>
                    <el-option label="生产 / 工艺 / 制造" value="2"></el-option>
                    <el-option label="医疗 / 护理 / 制药" value="3"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="4" class="mb20">
                <el-form-item label="手机">
                  <el-input v-model="personalForm.phone" placeholder="请输入手机" clearable></el-input>
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="4" class="mb20">
                <el-form-item label="性别">
                  <el-select v-model="personalForm.sex" placeholder="请选择性别" clearable class="w100">
                    <el-option label="男" value="1"></el-option>
                    <el-option label="女" value="2"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
                <el-form-item>
                  <el-button type="primary">
                    <el-icon>
                      <ele-Position/>
                    </el-icon>
                    更新个人信息
                  </el-button>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </el-card>
      </el-col>

    </el-row>
  </div>
</template>

<script lang="ts">
import {toRefs, reactive, computed, defineComponent} from 'vue';
import {formatAxis} from '/@/utils/formatTime';
import {newsInfoList} from './mock';
import {ElMessage, UploadProps} from "element-plus/es";

// 定义接口来定义对象的类型
interface PersonalState {
  newsInfoList: any;
  personalForm: any;
  avatarUrl:any;
}

export default defineComponent({
  name: 'profile',
  setup() {
    const VITE_UPLOAD_IMG=import.meta.env.VITE_UPLOAD_IMG
    const state = reactive<PersonalState>({
      newsInfoList,
      avatarUrl:'https://img2.baidu.com/it/u=1978192862,2048448374&fm=253&fmt=auto&app=138&f=JPEG?w=504&h=500',
      personalForm: {
        name: '',
        email: '',
        autograph: '',
        occupation: '',
        phone: '',
        sex: '',
      },
    });
    // 当前时间提示语
    const currentTime = computed(() => {
      return formatAxis(new Date());
    });
    //上传头像验证
    const beforeAvatarUpload: UploadProps['beforeUpload'] = (rawFile) => {
      const imgType = ['image/png', 'image/jpeg']
      if (!imgType.includes(rawFile.type)) {
        ElMessage.error('封面必须是JPEG或者PNG格式')
        return false
      } else if (rawFile.size / 1024 / 1024 > 2) {
        ElMessage.error('封面大小不能超过2MB!')
        return false
      }
      return true
    }
    // 封面上传成功
    const handleAvatarSuccess: UploadProps['onSuccess'] = (
        response,
        uploadFile
    ) => {
      state.avatarUrl = URL.createObjectURL(uploadFile.raw!)
      ElMessage.success('上传成功')
      // 这里需要保存响应的结果
    }

    return {
      currentTime,
      VITE_UPLOAD_IMG,
      beforeAvatarUpload,
      handleAvatarSuccess,
      ...toRefs(state),
    };
  },
});
</script>

<style scoped lang="scss">
@import '../../theme/mixins/index.scss';

.personal {
  .personal-user {
    height: 200px;
    display: flex;
    align-items: center;

    .personal-user-left {
      width: 200px;
      height: 200px;
      border-radius: 3px;
      display: flex;
      flex-direction: column;
      align-items: center;

      .waterfall-first-item {
        color: var(--el-color-white);
        transition: all 0.3s ease;
        border-radius: 50%;

        &:nth-of-type(3n + 1) {
          grid-row: auto / span 5;
        }

        &:nth-of-type(3n + 2) {
          grid-row: auto / span 6;
        }

        &:nth-of-type(3n + 3) {
          grid-row: auto / span 8;
        }

        &:hover {
          box-shadow: 0 2px 12px 0 rgb(0 0 0 / 10%);
          transition: all 0.3s ease;
          cursor: pointer;
        }
      }

      .personal-title {
        font-size: 24px;
        line-height: 1.25;
        @include text-ellipsis(1);
        text-align: center;
        color: #24292f;
      }

    }

    .personal-user-right {
      flex: 1;
      padding-left: 60px;

      .personal-item {
        display: flex;
        align-items: center;
        font-size: 13px;

        .personal-item-label {
          color: var(--el-text-color-secondary);
          @include text-ellipsis(1);
        }

        .personal-item-value {
          @include text-ellipsis(1);
        }
      }
    }
  }

  .personal-info {
    .personal-info-more {
      float: right;
      color: var(--el-text-color-secondary);
      font-size: 13px;

      &:hover {
        color: var(--el-color-primary);
        cursor: pointer;
      }
    }

    .personal-info-box {
      height: 130px;
      overflow: hidden;

      .personal-info-ul {
        list-style: none;

        .personal-info-li {
          font-size: 13px;
          padding-bottom: 10px;

          .personal-info-li-title {
            display: inline-block;
            @include text-ellipsis(1);
            color: var(--el-text-color-secondary);
            text-decoration: none;
          }

          & a:hover {
            color: var(--el-color-primary);
            cursor: pointer;
          }
        }
      }
    }
  }

  .personal-edit {
    .personal-edit-title {
      position: relative;
      padding-left: 10px;
      color: var(--el-text-color-regular);

      &::after {
        content: '';
        width: 2px;
        height: 10px;
        position: absolute;
        left: 0;
        top: 50%;
        transform: translateY(-50%);
        background: var(--el-color-primary);
      }
    }
  }


}
</style>
