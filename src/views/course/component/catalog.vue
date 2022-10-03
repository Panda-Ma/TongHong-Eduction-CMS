<template>
  <div>
    <h1 style="text-align: center;font-size: 30px" class="mb20">课程：{{ courseName }}</h1>
    <div class="mb20">
      <el-button type="primary" plain style="height: 35px;" @click="append({parent:0,courseId:courseId})">新增</el-button>
    </div>
    <el-tree :data="data" :props="defaultProps">
      <template #default="{node,data}">
        <div class="custom-tree-node">
          <span>{{ node.label }}</span>
          <span>
            <a @click="append(data)" style="color:#67C23A">新增</a>
            <a style="margin-left: 8px;color:#F56C6C" @click="edit(data)"> 编辑 </a>
            <a style="margin-left: 8px;color:#F56C6C" @click="remove(data)"> 删除 </a>
          </span>
        </div>
      </template>
    </el-tree>
  </div>
</template>

<script lang="ts">

import {defineComponent, onMounted, reactive, toRefs} from "vue";
import {useRoute} from "vue-router";
import {ElMessage, ElMessageBox} from "element-plus";
import {addCatalog, deleteCatalog, editCatalog, initCatalog} from "/@/api/course";

interface Node {
  id: number,
  parent: number,
  title: string,
  courseId: number,
  sort: number,
  createTime:string,
  child?: Node[]
}

interface Catalog {
  courseName: string, // 课程名称
  courseId: number,   // 课程id
  data: Node[]  // 目录数据
}

export default defineComponent({
  name: "catalog",
  setup: function () {
    const route = useRoute()
    const state = reactive<Catalog>({
      courseName: '',
      courseId: 0,
      data: []
    })

    const defaultProps = {
      children: 'child',
      label: 'title',
    }
    const resetData = () => {
      initCatalog({
        courseId:state.courseId
      }).then((res:any)=>{
        state.data=res.data
      })
    }
    const append = (data: any) => {
      ElMessageBox.prompt('请输入新的章节名称', '新增章节', {
        confirmButtonText: '提交'
        , cancelButtonText: '取消'
      }).then(({value}) => {
        addCatalog({
          title: value,
          parent: data.id,
          courseId: data.courseId
        }).then((res: any) => {
          if (res.code == 200) {
            ElMessage.success('成功添加新章节')
            resetData()
          } else {
            ElMessage.error('抱歉，添加新章节失败')
          }
        })
      }).catch(() => {

      })
    }
    const edit=(data:any)=>{
      ElMessageBox.prompt('请输入新的章节名称', '修改名称', {
        confirmButtonText: '提交'
        , cancelButtonText: '取消'
      }).then(({value}) => {
        editCatalog({
          title: value,
          id: data.id
        }).then((res: any) => {
          if (res.code == 200) {
            ElMessage.success('成功修改章节')
            resetData()
          } else {
            ElMessage.error('抱歉，修改章节失败')
          }
        })
      }).catch(() => {

      })
    }
    const remove = (data: any) => {
      ElMessageBox.confirm('确认删除该章节', '删除章节', {
        confirmButtonText: '删除'
        , cancelButtonText: '取消'
      }).then(() => {
        deleteCatalog({
          ids:[data.id]
        }).then((res: any) => {
          if (res.code == 200) {
            ElMessage.success('成功删除该章节')
            resetData()
          } else {
            ElMessage.error('删除章节失败')
          }
        })
      }).catch(() => {

      })
    }
    onMounted(() => {
      state.courseName = String(route.query.courseName)
      state.courseId = Number(route.query.courseId)
      resetData()
    })
    return {
      ...toRefs(state),
      defaultProps,
      append,
      edit,
      remove,
    }
  }
})
</script>

<style>
.el-tree-node__content {
  height: 40px;
}

.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}

</style>