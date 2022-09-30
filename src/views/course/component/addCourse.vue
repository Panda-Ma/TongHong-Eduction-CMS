<template>
  <div class="add-course-container">
    <el-dialog title="添加新课程" v-model="isShowDialog" width="769px" @closed="resetData">
      <el-form :model="data" size="default" label-width="90px" label-position="top" :rules="rules"
               ref="formRef">
        <el-row>
          <el-col :span="12">
            <el-col class="mb20" :span="18">
              <el-form-item label="课程名称" prop="courseName">
                <el-input v-model="data.courseName" placeholder="请输入课程名称" clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col class="mb20" :span="18">
              <el-form-item label="课程类型" prop="attribute">
                <el-select v-model="data.attribute" placeholder="课程类型" class="w100">
                  <el-option label="公开课" value="公开课"></el-option>
                  <el-option label="内部课" value="内部课"></el-option>
                  <el-option label="定制课" value="定制课"></el-option>
                </el-select>
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
          <el-col class="mb20" :span="9">
            <el-form-item label="授课老师" prop="lecturer">
              <el-input v-model="data.lecturer" placeholder="请输入授课老师名称" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col class="mb20" :span="17">
            <el-form-item label="课时" prop="courseTime">
              <el-input-number v-model="data.courseTime" :min="0" :max="999"/>
            </el-form-item>
          </el-col>
          <el-col class="mb20" :span="18">
            <el-form-item label="课程简介" prop="describe">
              <el-input v-model="data.describe" placeholder="请输入课程描述..." clearable type="textarea" rows="4"
                        resize="none"></el-input>
            </el-form-item>
          </el-col>
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
import type {UploadProps, FormRules, FormInstance} from 'element-plus'
import {ElMessage} from 'element-plus'
import {CourseDialog} from "/@/views/course/interface";
import {addCourse} from "/@/api/course";

export default defineComponent({
  name: 'addCourse',
  setup: function (_, {emit}) {
    const formRef = ref<FormInstance>()
    const VITE_UPLOAD_IMG = import.meta.env.VITE_UPLOAD_IMG

    const state = reactive<CourseDialog>({
      isShowDialog: false,
      data: {
        id: -1,
        courseName: '',
        describe: '',
        lecturer: '',
        attribute: '',
        createTime: '',
        cover: '',
        courseware: '',
        courseTime: 0
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
    const resetData=()=>{
      state.data.id=-1;
      state.data.courseName='';
      state.data.describe='';
      state.data.lecturer='';
      state.data.attribute='';
      state.data.createTime='';
      state.data.cover='';
      state.data.courseware='';
      state.data.courseTime=0;
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
          addCourse({
            courseName: state.data.courseName
            , introduction: state.data.describe
            , attribute: state.data.attribute
            , teacher: state.data.lecturer
            , courseTime: state.data.courseTime
            , img: state.data.cover
          }).then((res:any) => {
            if(res.code==200){
              ElMessage.success('添加成功')
              emit('tableChange')
              closeDialog();
            }else{
              ElMessage.error('添加失败:',res.msg)
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
        // 移除验证规则中的封面验证
        rules.cover = [{required: false, message: ''}]
      }else{
        ElMessage.error('上传图片失败:',response.msg)
      }
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
      resetData,
      VITE_UPLOAD_IMG,
      ...toRefs(state),
      rules,
      formRef
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
