<template>
  <div class="add-course-container">
    <el-dialog title="添加新课程" v-model="isShowDialog" width="769px">
      <el-form :model="ruleForm" size="default" label-width="90px" label-position="top" :rules="rules"
               ref="ruleFormRef">
        <el-row>
          <el-col :span="12">
            <el-col class="mb20" :span="18">
              <el-form-item label="课程名称" prop="courseName">
                <el-input v-model="ruleForm.courseName" placeholder="请输入课程名称" clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col class="mb20" :span="18">
              <el-form-item label="课程类型" prop="attribute">
                <el-select v-model="ruleForm.attribute" placeholder="课程类型" clearable class="w100">
                  <el-option label="公开课" value="公开课"></el-option>
                  <el-option label="内部课" value="内部课"></el-option>
                  <el-option label="定制课" value="定制课"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-col>
          <el-col :span="12">
            <el-form-item prop="cover" ref="upload">
              <el-upload
                  class="avatar-uploader"
                  :action="VITE_COURSE_COVER"
                  :show-file-list="false"
                  :before-upload="beforeCoverUpload"
                  :on-success="handleAvatarSuccess"
                  :limit="1"
                  accept="image/jpeg,image/png"
              >
                <img v-if="imageUrl" :src="imageUrl" class="avatar" style="object-fit: contain;height: 150px"/>
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
          <el-col class="mb20" :span="9">
            <el-form-item label="授课老师" prop="lecturer">
              <el-input v-model="ruleForm.lecturer" placeholder="请输入授课老师名称" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col class="mb20" :span="18">
            <el-form-item label="课程简介" prop="describe">
              <el-input v-model="ruleForm.describe" placeholder="请输入课程描述..." clearable type="textarea" rows="4"
                        resize="none"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
				<span class="dialog-footer">
					<el-button @click="onCancel" size="default">取 消</el-button>
					<el-button type="primary" @click="onSubmit(ruleFormRef)" size="default">新 增</el-button>
				</span>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import {reactive, toRefs, defineComponent, ref} from 'vue';
import type {UploadProps, FormRules, FormInstance, FormItemInstance} from 'element-plus'
import {ElMessage} from 'element-plus'

interface CourseState {
  isShowDialog: boolean;
  ruleForm: {
    courseName: string;
    describe: string;
    lecturer: string;
    attribute: string;
    createTime: string;
  };
}

export default defineComponent({
  name: 'addCourse',
  setup: function () {
    const ruleFormRef = ref<FormInstance>()
    const imageUrl = ref('')
    const upload = ref<FormItemInstance>()
    const VITE_COURSE_COVER = import.meta.env.VITE_COURSE_COVER
    const state = reactive<CourseState>({
      isShowDialog: false,
      ruleForm: {
        courseName: '',
        describe: '',
        lecturer: '',
        attribute: '',
        createTime: ''
      },
    });
    // 打开弹窗
    const openDialog = () => {
      state.isShowDialog = true;
    };
    // 关闭弹窗
    const closeDialog = () => {
      state.isShowDialog = false;
    };
    // 取消
    const onCancel = () => {
      closeDialog();
    };

    // 提交前的表单验证
    const onSubmit = async (formEl: FormInstance | undefined) => {
      if (!formEl) return
      await formEl.validate((valid, fields) => {
        if (valid) {
          ElMessage.info('添加成功')
          closeDialog();
        } else {
          ElMessage.error('必须填写信息')
          console.log(fields);
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
        uploadFile
    ) => {
      imageUrl.value = URL.createObjectURL(uploadFile.raw!)
      ElMessage.success('上传成功')

      // 移除验证规则中的封面验证
      rules.cover=[{required: false, message: ''}]
      // 这里需要保存响应的结果
    }


    //表单验证规则
    const rules = reactive<FormRules>({
      courseName: [
        {required: true, message: '输入课程名称', trigger: 'blur'}
      ],
      attribute: [
        {required: true, message: '请选择课程类型', trigger: 'change'}
      ],
      lecturer: [
        {required: true, message: '请输入授课老师名称', trigger: 'blur'}
      ],
      describe: [
        {required: true, message: '输入课程描述', trigger: 'blur'}
      ],
      cover: [
        {required: true, message: 'Sorry,请上传课程封面', trigger: 'blur'}
      ]
    })


    return {
      openDialog,
      closeDialog,
      onCancel,
      onSubmit,
      beforeCoverUpload,
      handleAvatarSuccess,
      VITE_COURSE_COVER,
      ...toRefs(state),
      imageUrl,
      upload,
      rules,
      ruleFormRef
    };
  },
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
