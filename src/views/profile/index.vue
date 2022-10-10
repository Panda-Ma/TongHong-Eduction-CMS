<template>
  <div class="personal">
    <el-row>
      <el-col :xs="24" :sm="16">
        <el-card shadow="hover" class=" personal-edit" header="更新信息">
          <el-form :model="personalForm" size="default" label-width="40px" class="mt35 mb35" :rules="rules"
                   ref="formRef" label-position="top">
            <el-col class="center" style="margin: 0 auto;width: 300px">
              <el-row>
                <el-col class="mb20">
                  <el-form-item label="昵称" prop="name">
                    <el-input v-model="personalForm.name" placeholder="请输入昵称" clearable></el-input>
                  </el-form-item>
                </el-col>
              </el-row>

              <el-row>
                <el-col class="mb20">
                  <el-form-item label="邮箱" prop="email">
                    <el-input v-model="personalForm.email" placeholder="请输入邮箱" clearable></el-input>
                  </el-form-item>
                </el-col>
              </el-row>

              <el-row>
                <el-col class="mb20">
                  <el-form-item label="手机" prop="phone">
                    <el-input v-model="personalForm.phone" placeholder="请输入手机" clearable></el-input>
                  </el-form-item>
                </el-col>
              </el-row>

              <el-row>
                <el-col class="mb20">
                  <el-form-item label="个人简介" prop="introduction">
                    <el-input v-model="personalForm.introduction" placeholder="请输入个人简介" clearable type="textarea"
                              rows="4"
                              resize="none"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>

              <el-row>
                <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
                  <el-form-item>
                    <el-button type="primary" @click="updateUserInfo(formRef)">
                      <el-icon>
                        <ele-Position/>
                      </el-icon>
                      更新个人信息
                    </el-button>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-col>

          </el-form>
        </el-card>
      </el-col>

      <!-- 个人信息 -->
      <el-col :xs="24" :sm="8" class="pl15 personal-info">
        <el-card shadow="hover" header="个人信息">
          <div class="personal-user">

            <div class="personal-user-left">
              <div class="waterfall-first-item" v-waves>
                <el-upload :action="VITE_UPLOAD_IMG" :before-upload="beforeAvatarUpload"
                           :on-success="handleAvatarSuccess" :show-file-list="false">
                  <el-avatar :size="150"
                             :src="personalInfo.cover"/>
                </el-upload>
              </div>
              <div class="personal-title mt18">{{ personalInfo.name }}</div>
            </div>

            <div class="personal-user-right mt20">
              <el-row>
                <el-col class="personal-item mb6">
                  <div class="personal-item-label">昵称：</div>
                  <div class="personal-item-value">{{ personalInfo.name }}</div>
                </el-col>
              </el-row>


              <el-row>
                <el-col class="personal-item mb6">
                  <div class="personal-item-label">身份：</div>
                  <div class="personal-item-value">{{ personalInfo.role }}</div>
                </el-col>
              </el-row>

              <el-row>
                <el-col class="personal-item mb6">
                  <div class="personal-item-label">级别：</div>
                  <div class="personal-item-value">{{ personalInfo.level }}</div>
                </el-col>
              </el-row>

              <el-row>
                <el-col class="personal-item mb6">
                  <div class="personal-item-label">手机：</div>
                  <div class="personal-item-value">{{ personalInfo.phone }}</div>
                </el-col>
              </el-row>

              <el-row>
                <el-col class="personal-item mb6">
                  <div class="personal-item-label">电子邮件：</div>
                  <div class="personal-item-value">{{ personalInfo.email }}</div>
                </el-col>
              </el-row>

              <el-row>
                <el-col class="personal-item mb6">
                  <div class="personal-item-label">个人简介：</div>
                  <div class="personal-item-value">{{ personalInfo.introduction }}</div>
                </el-col>
              </el-row>
            </div>
          </div>
        </el-card>

      </el-col>


    </el-row>
  </div>
</template>

<script lang="ts">
import {toRefs, reactive, defineComponent, onMounted, ref} from 'vue';
import {ElMessage, FormInstance, FormRules, UploadProps} from "element-plus/es";
import {getTeacherInfo, updateHeader, updateInfo} from "/@/api/profile";
import {useUserInfo} from "/@/stores/userInfo";

// 定义接口来定义对象的类型
interface PersonalState {
  personalForm: any;
  personalInfo: any;
}

export default defineComponent({
  name: 'profile',
  setup() {
    const VITE_UPLOAD_IMG = import.meta.env.VITE_UPLOAD_IMG
    const formRef = ref()
    const userInfo = useUserInfo()  // pinia
    const state = reactive<PersonalState>({
      personalInfo: {
        name: ''
        , username: ''
        , role: ''
        , cover: ''
        , level: ''
        , phone: ''
        , email: ''
        , introduction: ''
      },
      personalForm: {
        name: '',
        email: '',
        phone: '',
        introduction: ''
      },
    });

    const updateUserInfo = async (formEl: FormInstance | undefined) => {
      if (!formEl) {
        return
      }
      await formEl.validate((valid) => {
        if (valid) {
          updateInfo({
            id: userInfo.userInfos.id
            , name: state.personalForm.name
            , number: state.personalForm.phone
            , email: state.personalForm.email
            , introduction: state.personalForm.introduction
          }).then((res: any) => {
            if (res.code == 200) {
              ElMessage.success('修改成功')
              resetData()
            } else {
              ElMessage.error('修改失败:' + res.msg)
            }
          })

        } else {
          ElMessage.error('必须填写信息')
        }
      })

    }
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
    ) => {
      if (response.code == 200) {
        state.personalInfo.cover = response.data
        ElMessage.success('上传图片成功')
        updateHeader({
          id: userInfo.userInfos.id
          , img: state.personalInfo.cover
        }).then((res: any) => {
          if (res.code == 200) {
            ElMessage.success('修改成功')
          } else {
            ElMessage.error('修改失败:' + res.msg)
          }
        })
      } else {
        ElMessage.error('上传图片失败:' + response.msg)
      }
    }

    const rules = reactive<FormRules>({
      name: [
        {required: true, message: '输入个人姓名', trigger: 'blur'},
        {max: 20, message: '最大长度20个字符', trigger: 'blur'}
      ],
      phone: [
        {required: true, message: '输入手机', trigger: 'blur'},
        {max: 11, message: '最大长度11个字符', trigger: 'blur'}
      ],
      email: [
        {required: true, message: '输入邮箱', trigger: 'blur'},
        {max: 30, message: '最大长度30个字符', trigger: 'blur'},
        {
          pattern: /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/,
          message: '请输入正确的邮箱格式',
          trigger: 'blur'
        }
      ],
      introduction: [
        {required: true, message: '输入个人简介', trigger: 'blur'},
        {max: 50, message: '最大长度50个字符', trigger: 'blur'},
      ]
    })
    const resetData = () => {
      getTeacherInfo({
        teacherId: userInfo.userInfos.id
      }).then((res) => {
        state.personalInfo.name = res.data.name
        state.personalInfo.username = res.data.username
        state.personalInfo.role = res.data.role == 1 ? '管理员' : '教师'
        state.personalInfo.cover = res.data.img
        state.personalInfo.level = res.data.level
        state.personalInfo.phone = res.data.number
        state.personalInfo.email = res.data.email
        state.personalInfo.introduction = res.data.introduction
      })
    }
    onMounted(() => {
      resetData()
    })
    return {
      VITE_UPLOAD_IMG,
      beforeAvatarUpload,
      handleAvatarSuccess,
      ...toRefs(state),
      updateUserInfo,
      rules,
      formRef
    };
  },
});
</script>

<style scoped lang="scss">
@import '../../theme/mixins/index.scss';

.personal {
  .personal-user {

    .personal-user-left {
      height: 200px;
      border-radius: 3px;
      align-items: center;
      display: flex;
      flex-direction: column;

      .waterfall-first-item {
        color: var(--el-color-white);
        transition: all 0.3s ease;
        border-radius: 50%;
        margin: 0 auto;
        width: 150px;
        text-align: center;
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


}
</style>
