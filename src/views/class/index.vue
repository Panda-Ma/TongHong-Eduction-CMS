<template>
  <div class="course-container">
    <el-card shadow="hover">
      <div class="system-user-search mb15" style="position: relative">
        <el-button size="default" type="success" class="ml10" @click="onAdd" plain>
          <el-icon>
            <ele-Plus/>
          </el-icon>
          添加
        </el-button>
        <el-button size="default" type="danger" class="ml10" @click="onDeleteAll" :disabled="isDisable">
          <el-icon>
            <ele-Delete/>
          </el-icon>
          批量删除
        </el-button>
        <el-input v-model="searchKey" placeholder="搜索..." clearable class="w-50 m-2" size="default"
                  style="max-width: 300px;position: absolute;right: 30px">
          <template #append>
            <el-button @click="search">
              <SvgIcon name="ele-Search"></SvgIcon>
            </el-button>
          </template>
        </el-input>
      </div>
      <el-table :data="currentData" style="width: 100%" @selection-change="selectionChange" ref="tableRef" v-loading="loading">
        <el-table-column type="selection"></el-table-column>
        <el-table-column label="班级信息" align="center">
          <el-table-column label="主键" v-if="false" prop="id"></el-table-column>
          <el-table-column prop="cover" label="封面" align="center" width="100px">
            <template #default="scope" >
              <el-image :preview-src-list="[scope.row.cover]" :src="scope.row.cover"
                        fit="contain" preview-teleported style="width: 100%;min-height: 50px">
              </el-image>
            </template>
          </el-table-column>
          <el-table-column prop="className" label="班级名称" show-overflow-tooltip align="center" width="150px"></el-table-column>
          <el-table-column prop="describe" label="简介" align="center"></el-table-column>
        </el-table-column>
        <el-table-column prop="headTeacherName" label="班主任" show-overflow-tooltip align="center"
                         width="120"></el-table-column>
        <el-table-column prop="studentNum" label="班级人数" show-overflow-tooltip align="center"
                         width="100"></el-table-column>
        <el-table-column prop="createTime" label="创建时间" align="center" width="100"></el-table-column>
        <el-table-column label="操作" align="center" width="200">
          <template #default="scope">
            <el-button size="small" text type="primary" @click="onLinkCourse(scope.row)">
              课程
            </el-button>
            <el-button size="small" text type="primary" @click="onOpenPlan(scope.row)">
              学习计划
            </el-button>
            <el-button size="small" text type="primary" @click="onEdit(scope.row)">
              修改
            </el-button>
            <el-button type="danger" text size="small" @click="onDelete(scope.row)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
          v-model:page-size="pageSize"
          v-model:current-page="currentPage"
          class="mt15"
          :pager-count="5"
          :page-sizes="[10, 20, 30]"
          background
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
      >
      </el-pagination>
    </el-card>
    <AddClass ref="addClassRef" @tableChange="initTableData"></AddClass>
    <EditClass ref="editClassRef" @tableChange="initTableData"></EditClass>
    <link-course ref="linkCourseRef"></link-course>
  </div>
</template>

<script lang="ts">
import {reactive, toRefs, defineComponent, onMounted, ref, computed} from 'vue';
import SvgIcon from "/@/components/svgIcon/index.vue";
import {ElMessage, ElMessageBox} from "element-plus";
import {Class} from "/@/views/class/interface";
import AddClass from "/@/views/class/component/addClass.vue";
import EditClass from "/@/views/class/component/editClass.vue";
import {deleteClass, initClassTable, searchClassInfo} from "/@/api/class";
import {useRouter} from "vue-router";
import LinkCourse from "/@/views/class/component/linkCourse.vue";

// 页面数据：表格数据、分页数据
interface TableState {
    data: Array<Class>;
    total: number;
    loading: boolean;
    currentPage: number; // 当前页码
    pageSize: number;   // 每页显示的页数
}

export default defineComponent({
  name: 'class',
  components: {LinkCourse, AddClass, SvgIcon,EditClass},
  setup() {
    const addClassRef = ref()
    const editClassRef = ref()
    const linkCourseRef=ref()
    const tableRef = ref()
    const isDisable = ref(true) // 按钮禁用状态
    const searchKey = ref('')   // 搜索关键字
    const router=useRouter()

    const state = reactive<TableState>({
        data: [],
        total: 0,
        loading: false,
        currentPage: 1,
        pageSize: 10,
    });
    const currentData = computed(() => {
      return state.data.slice((state.currentPage - 1) * state.pageSize, state.currentPage * state.pageSize)
    })
    // 初始化表格数据
    const initTableData = () => {
      initClassTable().then((res) => {
        resetData(res)
      })
    };
    // 更新表格数据
    const resetData = (res: any) => {
      const arr: Array<Class> = [];
      res.data.forEach((val: any) => {
        arr.push({
          id: val.id,
          cover: val.img,
          className:val.className,
          describe: val.introduction,
          headTeacherId:String(val.headTeacherId),
          headTeacherName:val.headTeacherName,
          studentNum:val.studentNum,
          createTime: val.createTime,
        })
      })
      state.data = arr;
      state.total = arr.length;
    }
    // 添加
    const onAdd = () => {
      addClassRef.value.openDialog()
    }
    const onDeleteAll = () => {
      let arr = tableRef.value.getSelectionRows().map((ele: any) => ele.id)
      ElMessageBox.confirm(`此操作将永久删除${arr.length}个班级, 是否继续`, '确认', {
        confirmButtonText: '删除',
        cancelButtonText: '取消',
        type: 'warning',
      })
          .then(() => {
            deleteClass({
              ids: arr
            }).then((res: any) => {
              if (res.code == 200) {
                ElMessage.success('成功删除所选班级');
                initTableData()
              } else ElMessage.error('删除失败')
            })
          })
          .catch(() => {
          });
    }
    const onDelete = (row: Class) => {
      ElMessageBox.confirm(`此操作将永久删除班级：${row.className}, 是否继续`, '确认', {
        confirmButtonText: '删除',
        cancelButtonText: '取消',
        type: 'warning',
      })
          .then(() => {
            deleteClass({
              ids: [row.id]
            }).then((res: any) => {
              if (res.code == 200) {
                ElMessage.success('成功删除该班级');
                initTableData()
              } else ElMessage.error('删除失败')
            })
          })
          .catch(() => {
          });
    };
    // 没有选中选项时,禁用批量删除
    const selectionChange = (selection: any) => {
      isDisable.value = selection.length <= 0;
    }
    // 搜索框
    const search= () => {
      state.loading=true
      console.log(searchKey.value);
      searchClassInfo({
        keyword: searchKey.value
      }).then((res: any) => {
        if (res.code == 200) {
          resetData(res)
        } else {
          ElMessage.error('抱歉,搜索失败...'+ res.msg)
        }
        state.loading = false // 加载动画结束
      })
    }
    const onLinkCourse=(row:Class)=>{
      linkCourseRef.value.openDialog(row.id)
    }

    // 点击计划按钮
    const onOpenPlan = (row: Class) => {
      router.push({
        path: '/class/plan',
        query: {
          classId: row.id,
          className: row.className
        }
      })
    }

    const onEdit = (row: Class) => {
      editClassRef.value.openDialog(row)
    }
    // 页面加载时
    onMounted(() => {
      initTableData();
    });
    return {
      ...toRefs(state),
      tableRef,
      addClassRef,
      editClassRef,
      searchKey,
      currentData,
      search,
      selectionChange,
      initTableData,
      onAdd,
      onDelete,
      onDeleteAll,
      isDisable,
      onEdit,
      onOpenPlan,
      onLinkCourse,
      linkCourseRef
    };
  },
});
</script>

<style scoped lang="scss">

</style>