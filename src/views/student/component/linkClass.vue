<template>
  <div class="link-Class">
    <el-dialog title="关联班级" v-model="isShowDialog" width="769px" @close="resetData">
      <el-transfer v-model="value" :data="data" :button-texts="['删除','添加']" :titles="['未关联班级', '已关联班级']">

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
import { initClassTable} from "/@/api/class";
import {bindClass, getLinkedClass} from "/@/api/student";
import {Class} from "/@/views/class/interface";

interface Option {
  key: number
  label: string
  disabled: boolean
}

export default defineComponent({
  name: "linkClass",
  setup: () => {
    const state = reactive({
      isShowDialog: false,
      studentId: -1,
    })
    const data = ref<Option[]>([])
    const value = ref<Option[]>([])

    // 打开弹窗
    const openDialog = (id: any) => {
      state.isShowDialog = true;
      state.studentId = id

      // 获取全部课程信息
      initClassTable().then((res: any) => {
        res.data.forEach((val: Class) => {
          data.value.push({
            key: val.id,
            label: val.className,
            disabled: false
          })
        })
      })
      // 获取该班级已绑定的信息
      getLinkedClass({
        studentId:state.studentId
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
      state.studentId = -1;
      data.value = []
      value.value = []
    }
    // 取消
    const onCancel = () => {
      closeDialog();
    };

    // 提交前的表单验证
    const onSubmit = async () => {
      bindClass({
        id: state.studentId,
        ids:value.value
      }).then((res: any) => {
        if (res.code === 200) {
          ElMessage.success('成功关联班级')
          closeDialog();
        } else {
          ElMessage.error('抱歉，关联班级失败')
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