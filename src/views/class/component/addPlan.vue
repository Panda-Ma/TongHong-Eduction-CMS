<template>
  <div class="add-plan">
    <el-dialog title="添加新计划" v-model="isShowDialog" width="769px" @close="resetData">
      <el-form :model="data" size="default" label-width="90px" label-position="top" :rules="rules"
               ref="formRef">
        <el-col :span="12">
          <el-col class="mb20" :span="18">
            <el-form-item label="开始时间" prop="targetTime">
              <el-date-picker
                  v-model="data.targetTime"
                  type="date"
                  placeholder="请选择开始时间"
                  :shortcuts="shortcuts"
                  value-format="YYYY-MM-DD"
                  :editable="false"
              />
            </el-form-item>
          </el-col>
        </el-col>

        <el-col class="mb20" :span="18">
          <el-form-item label="新计划" prop="context">
            <el-input v-model="data.context" placeholder="请输入新的计划内容..." clearable type="textarea" rows="4"
                      resize="none"></el-input>
          </el-form-item>
        </el-col>
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
import {defineComponent, reactive, toRefs, ref} from "vue";
import {ElMessage, FormInstance, FormRules} from "element-plus";
import {addPlan} from "/@/api/class";

export default defineComponent({
  name: "addPlan",
  setup: function (_, {emit}) {
    const formRef = ref<FormInstance>()

    const state = reactive({
      isShowDialog: false,
      data: {
        context: ''
        , classId: 0,
        targetTime: ''
      },
      shortcuts: [
        {
          text: '今天',
          value: new Date(),
        },
        {
          text: '明天',
          value: () => {
            const date = new Date()
            date.setTime(date.getTime() + 3600 * 1000 * 24)
            return date
          },
        },
        {
          text: '一个星期后',
          value: () => {
            const date = new Date()
            date.setTime(date.getTime() + 3600 * 1000 * 24 * 7)
            return date
          },
        },
      ]
    })

    // 打开弹窗
    const openDialog = (classId: any) => {
      state.isShowDialog = true;
      state.data.classId = classId
    };
    // 关闭弹窗
    const closeDialog = () => {
      state.isShowDialog = false;
    };
    const resetData = () => {
      // 重置表单数据
      state.data.context = ''
      state.data.classId = -1;
      state.data.targetTime = '';
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
          addPlan({
            classId: state.data.classId,
            context: state.data.context,
            targetTime: state.data.targetTime
          }).then((res: any) => {
            if (res.code === 200) {
              ElMessage.success('成功添加新计划')
              emit('planChange')
              closeDialog();
            } else {
              ElMessage.error('抱歉，添加计划失败')
            }
          })
        } else {
          ElMessage.error('必须填写信息')
        }
      })
    }
    //表单验证规则
    const rules = reactive<FormRules>({
      context: [
        {required: true, message: '输入计划内容', trigger: 'blur'},
        {max:50,message:'最大长度50个字符',trigger:'blur'}
      ],
      targetTime: [
        {required: true, message: '请选择开始时间', trigger: 'blur'}
      ],
    })
    return {
      ...toRefs(state),
      formRef,
      openDialog,
      closeDialog,
      resetData,
      onCancel,
      onSubmit,
      rules
    }
  },
  emits: ['planChange']
})
</script>

<style scoped>

</style>