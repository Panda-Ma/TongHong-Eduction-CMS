<template>
  <div class="link-Course">
    <el-dialog title="关联课程" v-model="isShowDialog" width="769px" @close="resetData">
      <el-transfer v-model="value" :data="data" :button-texts="['删除','添加']" :titles="['未关联课程', '已关联课程']">

      </el-transfer>

      <template #footer>
				<span class="dialog-footer">
					<el-button @click="onCancel" size="default">取 消</el-button>
					<el-button type="primary" @click="onSubmit" size="default">确 定</el-button>
				</span>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import {defineComponent, reactive, ref, toRefs} from "vue";
import {ElMessage} from "element-plus";
import {initCourseTable} from "/@/api/course";
import {Course} from "/@/views/course/interface";
import {bindCourse, getLinkedCourse} from "/@/api/class";

interface Option {
  key: number
  label: string
  disabled: boolean
}

export default defineComponent({
  name: "linkCourse",
  setup: () => {
    const state = reactive({
      isShowDialog: false,
      classId: -1,
    })
    const data = ref<Option[]>([])
    const value = ref<Option[]>([])

    // 打开弹窗
    const openDialog = (classId: any) => {
      state.isShowDialog = true;
      state.classId = classId

      // 获取全部课程信息
      initCourseTable().then((res: any) => {
        res.data.forEach((val: Course) => {
          data.value.push({
            key: val.id,
            label: val.courseName,
            disabled: false
          })
        })
      })
      // 获取该班级已绑定的信息
      getLinkedCourse({
        classId:state.classId
      }).then((res)=>{
        value.value=res.data
      })

    };
    // 关闭弹窗
    const closeDialog = () => {
      state.isShowDialog = false;
    };
    const resetData = () => {
      // 重置数据
      state.classId = -1;
      data.value = []
      value.value = []
    }
    // 取消
    const onCancel = () => {
      closeDialog();
    };

    // 提交前的表单验证
    const onSubmit = async () => {
      bindCourse({
        id: state.classId,
        ids:value.value
      }).then((res: any) => {
        if (res.code === 200) {
          ElMessage.success('成功关联课程')
          closeDialog();
        } else {
          ElMessage.error('抱歉，关联课程失败')
        }
      })
    }

    return {
      ...toRefs(state),
      openDialog,
      closeDialog,
      resetData,
      onCancel,
      onSubmit,
      value,
      data
    }
  },


})
</script>

<style scoped>

</style>