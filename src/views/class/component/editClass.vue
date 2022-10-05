<template>
  <div class="add-course-container">
    <el-dialog title="修改班级" v-model="isShowDialog" width="769px" @close="resetData" @open="getAllTeachers">
      <el-form :model="data" size="default" label-width="90px" label-position="top" :rules="rules"
               ref="formRef">
        <el-row>
          <el-col :span="12">
            <el-col class="mb20" :span="18">
              <el-form-item label="班级名称" prop="className">
                <el-input v-model="data.className" placeholder="请输入班级名称" clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col class="mb20" :span="18">
              <el-form-item label="班主任" prop="headTeacherId">
                <el-select v-model="data.headTeacherId" placeholder="请选择" class="w100" >
                  <el-option v-for="item in teachers" :label="item.name" :value="item.id" :key="item.id"></el-option>
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
          <el-col class="mb20" :span="18">
            <el-form-item label="班级简介" prop="describe">
              <el-input v-model="data.describe" placeholder="请输入课程描述..." clearable type="textarea" rows="4"
                        resize="none"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
				<span class="dialog-footer">
					<el-button @click="onCancel" size="default">取 消</el-button>
					<el-button type="primary" @click="onSubmit(formRef)" size="default">修改</el-button>
				</span>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import {reactive, toRefs, defineComponent, ref} from 'vue';
import type {UploadProps, FormRules, FormInstance} from 'element-plus'
import {ElMessage, UploadInstance} from 'element-plus'
import {Class, ClassDialog} from "/@/views/class/interface";
import {initTeacherTable} from "/@/api/teacher";
import {editClass} from "/@/api/class";

export default defineComponent({
  name: 'addClass',
  setup: function (_, {emit}) {
    const formRef = ref<FormInstance>()
    const uploadRef = ref<UploadInstance>()
    const VITE_UPLOAD_IMG = import.meta.env.VITE_UPLOAD_IMG
    const state = reactive<ClassDialog>({
      isShowDialog: false,
      data: {
        id: -1,
        cover: '',
        className: '',
        describe: '',
        headTeacherId: '',
        headTeacherName: '',
        studentNum: 0,
        createTime: '',
      },
      teachers: []
    });

    // 打开弹窗
    const openDialog = (data: Class) => {
      state.isShowDialog = true;
      state.data.id = data.id
      state.data.cover = data.cover
      state.data.describe = data.describe
      state.data.headTeacherId = data.headTeacherId
      state.data.className=data.className
    };
    // 关闭弹窗
    const closeDialog = () => {
      state.isShowDialog = false;
    };
    const resetData = () => {
      // 重置表单数据
      state.data.className = ''
      state.data.cover = '';
      state.data.describe = '';
      state.data.headTeacherId = '';
      state.teachers = []
      // 重置上传
      uploadRef.value!.clearFiles()
    }
    const getAllTeachers = () => {
      initTeacherTable().then((res) => {
        const arr: any[] = [];
        res.data.forEach((val: any) => {
          arr.push({
            id: String(val.id),
            name: val.name,
          })
        })
        state.teachers = arr
      })
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
          editClass({
            id: state.data.id
            , className: state.data.className
            , img: state.data.cover
            , introduction: state.data.describe
            , headTeacherId: Number(state.data.headTeacherId)
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
        ElMessage.error('上传图片失败:'+ response.msg)
      }
    }


    //表单验证规则
    const rules = reactive<FormRules>({
      className: [
        {required: true, message: '输入课程名称', trigger: 'blur'},
        {max:20,message:'最大长度20个字符',trigger:'blur'}
      ],
      headTeacherId: [
        {required: true, message: '请选择班主任', trigger: 'change'}
      ],
      describe: [
        {max:50,message:'最大长度50个字符',trigger:'blur'}
      ],
    })


    return {
      openDialog,
      closeDialog,
      onCancel,
      onSubmit,
      beforeCoverUpload,
      handleAvatarSuccess,
      resetData,
      getAllTeachers,
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
