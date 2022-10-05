<template>
  <div class="upload">
    <el-dialog
        v-model="isShowDialog"
        title="批量上传"
        width="769px"
        @closed="resetData">
      <el-row>
        <el-col :span="12">
          <el-button type="primary" @click="downloadFile">下载模版</el-button>
        </el-col>
        <el-col :span="12">
          <el-upload
              ref="upload"
              class="upload-demo"
              action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15"
              :limit="1"
              :on-exceed="handleExceed"
          >
            <el-button class="ml-3" type="success">
              上传
            </el-button>
            <template #tip>
              <div class="el-upload__tip text-red">
                下载模版后按照格式填写学生信息，然后将文件上传
              </div>
            </template>
          </el-upload>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import {defineComponent, reactive, ref, toRefs} from "vue";
import {ElMessage, genFileId, UploadInstance, UploadProps, UploadRawFile} from "element-plus/es";
import {Course} from "/@/views/course/interface";
import {download} from "/@/api/student";

export default defineComponent({
  name: "uploadStudent",
  setup: () => {
    const VITE_UPLOAD_WARE = import.meta.env.VITE_UPLOAD_WARE
    const uploadRef = ref<UploadInstance>()
    const state = reactive({
      isShowDialog: false,
      courseware: '', // 课件名
      id: 0  // 该课件所属的课程id
    })
    const openDialog = (data: Course) => {
      state.isShowDialog = true
      state.courseware = data.courseware
      state.id = data.id
    };
    const closeDialog = () => {
      state.isShowDialog = false
    }
    const resetData = () => {
      uploadRef.value!.clearFiles()
    }
    const onCancel = () => {
      closeDialog()
    }
    const submitUpload = () => {
      uploadRef.value!.submit()
    }
    // 当文件上传数量超过指定的数目时，覆盖前一次文件
    const handleExceed: UploadProps['onExceed'] = (files) => {
      uploadRef.value!.clearFiles()
      const file = files[0] as UploadRawFile
      file.uid = genFileId()
      uploadRef.value!.handleStart(file)
    }

    const handlerSuccess: UploadProps['onSuccess'] = (
        response,
    ) => {
      if (response.code == 200) {
        ElMessage.success('上传资料成功')
        closeDialog()
      } else
        ElMessage.error('上传资料失败:' + response.msg)
    }

    const downloadFile=()=>{
      download().then((res:any)=>{
        if(res.code==200){
          ElMessage.success('正在下载..')
        }else{
          ElMessage.error('下载失败，请重新尝试:'+res.msg)
        }
      })
    }
    return {
      ...toRefs(state),
      onCancel,
      submitUpload,
      openDialog,
      handleExceed,
      handlerSuccess,
      VITE_UPLOAD_WARE,
      uploadRef,
      resetData,
      downloadFile
    }

  }
})
</script>

<style scoped>

</style>