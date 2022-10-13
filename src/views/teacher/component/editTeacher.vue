<template>
  <div class="edit-teacher-container">
    <el-dialog title="修改老师" v-model="isShowDialog" width="769px" @close="resetData">
      <el-form :model="data" size="default" label-width="90px" label-position="top" :rules="rules"
               ref="formRef">
        <el-row>
          <el-col :span="12">
            <el-col class="mb20" :span="18">
              <el-form-item label="姓名" prop="name">
                <el-input v-model="data.name" placeholder="请输入老师姓名" clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col class="mb20" :span="18">
              <el-form-item label="用户名" prop="userName">
                <el-input v-model="data.userName" placeholder="请输入账号" clearable></el-input>
              </el-form-item>
            </el-col>
          </el-col>
          <el-col :span="12">
            <el-form-item prop="cover">
              <el-upload
                  class="avatar-uploader"
                  :action="VITE_UPLOAD_IMG"
                  :show-file-list="false"
                  :before-upload="beforeCoverUpload"
                  :on-success="handleAvatarSuccess"
                  accept="image/jpeg,image/png"
                  ref="uploadRef"
              >
                <img v-if="data.cover" :src="data.cover" class="avatar" style="object-fit: contain;height: 150px"/>
                <el-icon v-else class="avatar-uploader-icon">
                  <ele-Picture></ele-Picture>
                  上传封面
                </el-icon>
                <template #tip>
                  <div class="el-upload__tip">
                    jpeg/png 文件大小不能超过 2MB.
                  </div>
                </template>
              </el-upload>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col class="mb20 ml40" :span="9">
            <el-form-item label="教师级别" prop="level">
              <el-select v-model="data.level" placeholder="选择教师级别" class="w100">
                <el-option label="初级教师" value="初级教师"></el-option>
                <el-option label="中级教师" value="中级教师"></el-option>
                <el-option label="高级教师" value="高级教师"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col class="mb20 ml40" :span="9">
            <el-form-item label="手机" prop="phone">
              <el-input v-model="data.phone" placeholder="请输入手机" clearable></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col class="mb20" :span="9">
            <el-form-item label="邮箱" prop="email">
              <el-input v-model="data.email" placeholder="请输入邮箱" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="4"></el-col>

        </el-row>

      </el-form>
      <template #footer>
				<span class="dialog-footer">
					<el-button @click="onCancel" size="default">取 消</el-button>
					<el-button type="primary" @click="onSubmit(formRef)" size="default">新 增</el-button>
				</span>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import {reactive, toRefs, defineComponent, ref} from 'vue';
import type {UploadProps, FormRules, FormInstance, UploadInstance} from 'element-plus'
import {ElMessage} from 'element-plus'
import {Teacher, TeacherDialog} from "/@/views/teacher/interface";
import {editTeacher} from "/@/api/teacher";

export default defineComponent({
  name: 'editTeacher',
  setup: function (_, {emit}) {
    const formRef = ref<FormInstance>()
    const uploadRef = ref<UploadInstance>()
    const VITE_UPLOAD_IMG = import.meta.env.VITE_UPLOAD_IMG

    const state = reactive<TeacherDialog>({
      isShowDialog: false,
      data: {
        id: -1,
        name: '',
        userName: '',
        password: '',
        cover: '',
        phone: '',
        email: '',
        level: '',
        createTime: '',
        introduction: '',
      },
    });
    // 打开弹窗
    const openDialog = (data: Teacher) => {
      state.isShowDialog = true;
      state.data.id = data.id
      state.data.name = data.name
      state.data.userName = data.userName
      state.data.password = data.password
      state.data.cover = data.cover
      state.data.phone = data.phone
      state.data.level = data.level
      state.data.email = data.email
    };
    // 关闭弹窗
    const closeDialog = () => {
      state.isShowDialog = false;
    };
    const resetData = () => {
      state.data.id = -1;
      state.data.name = '';
      state.data.introduction = '';
      state.data.userName = '';
      state.data.password = '';
      state.data.cover = '';
      state.data.phone = '';
      state.data.level = '';
      state.data.email = ''
      uploadRef.value!.clearFiles()
    }
    // 取消
    const onCancel = () => {
      closeDialog();
    };

    // 提交前的表单验证
    const onSubmit = async (formEl: FormInstance | undefined) => {
      if (!formEl) {
        return
      }
      await formEl.validate((valid) => {
        if (valid) {
          // 对表单进行提交
          editTeacher({
            id: state.data.id
            , name: state.data.name
            , username: state.data.userName
            , number: state.data.phone
            , level: state.data.level
            , img: state.data.cover
            , email: state.data.email
          }).then((res: any) => {
            if (res.code == 200) {
              ElMessage.success('修改成功')
              emit('tableChange')
              closeDialog();
            } else {
              ElMessage.error('修改失败:'+res.msg)

            }
          })
        } else {
          ElMessage.error('必须填写信息')
        }
      })
    }
    //上传封面验证
    const beforeCoverUpload: UploadProps['beforeUpload'] = (rawFile) => {
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
        state.data.cover = response.data
        ElMessage.success('上传图片成功')
      } else {
        ElMessage.error('上传图片失败:'+response.msg)
      }
    }


    //表单验证规则
    const rules = reactive<FormRules>({
      name: [
        {required: true, message: '输入老师姓名', trigger: 'blur'},
        {max:20,message:'最大长度20个字符',trigger:'blur'}
      ],
      userName: [
        {required: true, message: '输入账号', trigger: 'blur'},
        {max:30,message:'最大长度30个字符',trigger:'blur'}
      ],
      level: [
        {required: true, message: '请选择教师级别', trigger: 'blur'},
      ],
      phone:[
        {required: true, message: '请输入手机号', trigger: 'blur'},
        {max:11,message:'最大长度11个字符',trigger:'blur'}
      ],
      email:[
        {max:30,message:'最大长度30个字符',trigger:'blur'},
        {
          pattern:/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/,
          message:'请输入正确的邮箱格式',
          trigger:'blur'
        }
      ]
    })



    return {
      openDialog,
      closeDialog,
      onCancel,
      onSubmit,
      beforeCoverUpload,
      handleAvatarSuccess,
      resetData,
      VITE_UPLOAD_IMG,
      ...toRefs(state),
      rules,
      formRef,
      uploadRef
    };
  },
  emits: ['tableChange']
});
</script>

<style scoped>

.avatar-uploader {
  height: 150px;
  width: 80%;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
  margin-top: 10px;
  margin-left: 50px;
}

.avatar-uploader:hover {
  border-color: var(--el-color-primary);
}

.avatar-uploader-icon {
  font-size: 25px;
  color: #8c939d;
  height: 178px;
  text-align: center;
  width: 300px;
  font-style: normal;
}

.el-upload__tip {
  position: absolute;
  bottom: -30px;
}
</style>
