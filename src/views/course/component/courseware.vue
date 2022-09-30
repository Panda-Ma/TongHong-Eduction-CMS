<template>
  <el-dialog
      v-model="isShowDialog"
      title="上传资料"
      width="769px"
      @closed="resetData"
  >
    <el-col>
      <el-input v-model="courseware" placeholder="还未上传资料" disabled>
        <template #prepend>已上传资料</template>
      </el-input>
    </el-col>
    <template #footer>
      <el-upload :limit="1" :action="VITE_UPLOAD_WARE" :auto-upload="false"
                 :on-exceed="handleExceed" ref="uploadRef" :data="{id:id}" :on-success="handlerSuccess">
        <template #trigger>
          <el-button type="primary">选择文件</el-button>
        </template>
        <el-button type="success" class="ml10" @click="submitUpload">确认上传</el-button>
        <template #tip>
          <div class="el-upload__tip">
            上传会覆盖之前的文件！
          </div>
        </template>
      </el-upload>

    </template>
  </el-dialog>
</template>

<script lang="ts">
import {defineComponent, reactive, ref, toRefs} from "vue";
import {Course} from "/@/views/course/interface";
import {ElMessage, genFileId, UploadInstance, UploadProps, UploadRawFile} from "element-plus";

export default defineComponent({
  name: "courseWare",
  setup: function (_,{emit}) {
    const VITE_UPLOAD_WARE = import.meta.env.VITE_UPLOAD_WARE
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
    const resetData=()=>{
      uploadRef.value!.clearFiles()
    }
    const onCancel = () => {
      closeDialog()
    }
    const submitUpload = () => {
      uploadRef.value!.submit()
    }
    const uploadRef = ref<UploadInstance>()
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
        emit('tableChange')
        closeDialog()
      } else
        ElMessage.error('上传资料失败:',response.msg)
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
      resetData
    }
  },
  emits:['tableChange']
})
</script>

<style scoped>

</style>