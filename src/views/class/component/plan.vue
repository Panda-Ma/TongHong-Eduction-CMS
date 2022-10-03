<template>
  <div class="plan">
    <h1 style="text-align: center;font-size: 30px" class="mb20">班级：{{ className }}</h1>
    <div class="mb20">
      <el-button type="primary" plain style="height: 35px;" @click="append()">新增</el-button>
    </div>
    <div class="plan-box" style="margin: 0 auto;width: 60%">
      <el-timeline v-if="data.length>0">
        <el-timeline-item v-for="(item,index) in data" :timestamp="item.targetTime" placement="top" :key="item.id"
                          type="primary" :hollow="true">
          <el-card>
            <h4 class="mb10">任务 {{ index + 1 }}</h4>
            <p class="mb10">{{ item.context }}</p>
            <p style="text-align: right">
              <span style="color: #909193;">创建于 {{ item.createTime }}</span>
              <el-button size="default" type="danger" class="ml10" @click="onDelete(item.id)" text>
                <el-icon>
                  <ele-Delete/>
                </el-icon>
              </el-button>
            </p>
          </el-card>
        </el-timeline-item>
      </el-timeline>
      <div :style="{boxShadow:`var(${`--el-box-shadow-lighter`})`}" v-else>
        <p style="text-align: center;color: #909193;background-color: #fff;height: 50px;line-height: 50px">
          还没有任务被添加进来
        </p>
      </div>
    </div>
    <add-plan @planChange="resetData" ref="addPlanRef"></add-plan>
  </div>
</template>

<script lang="ts">
import {defineComponent, onMounted, reactive, toRefs, ref} from "vue";
import {useRoute} from "vue-router";
import {initPlan, deletePlan} from "/@/api/class";
import AddPlan from "/@/views/class/component/addPlan.vue";
import {ElMessage, ElMessageBox} from "element-plus";

export default defineComponent({
  name: "plan",
  components: {AddPlan},
  setup: function () {
    const route = useRoute()
    const addPlanRef = ref()
    const state = reactive({
      className: '',
      classId: -1,
      data: []
    })
    const resetData = () => {
      initPlan({
        classId: state.classId
      }).then((res: any) => {
        state.data = res.data
      })
    }
    const append = () => {
      addPlanRef.value.openDialog(state.classId)
    }
    const onDelete = (planId:Number) => {
      ElMessageBox.confirm(`此操作将永久删除该计划, 是否继续`, '确认', {
        confirmButtonText: '删除',
        cancelButtonText: '取消',
        type: 'warning',
      })
          .then(() => {
            deletePlan({
              id: planId
            }).then((res: any) => {
              if (res.code == 200) {
                ElMessage.success('成功删除该计划');
                resetData()
              } else ElMessage.error('删除失败')
            })
          })
          .catch(() => {
          });
    }
    onMounted(() => {
      state.classId = Number(route.query.classId)
      state.className = String(route.query.className)
      resetData()
    })
    return {
      ...toRefs(state),
      append,
      resetData,
      addPlanRef,
      onDelete
    }
  }
})
</script>

<style scoped>

</style>