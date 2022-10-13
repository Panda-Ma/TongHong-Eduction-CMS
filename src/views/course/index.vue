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
      <el-table :data="currentData" style="width: 100%" @selection-change="selectionChange" ref="tableRef"
                v-loading="loading">
        <el-table-column type="selection"></el-table-column>
        <el-table-column label="课程信息" align="center">
          <el-table-column label="主键" v-if="false" prop="id"></el-table-column>
          <el-table-column label="课件" v-if="false" prop="courseware"></el-table-column>
          <el-table-column prop="cover" label="封面" align="center" width="100px">
            <template #default="scope">
              <el-image :preview-src-list="[scope.row.cover]" :src="scope.row.cover"
                        fit="contain" preview-teleported style="width: 100%;min-height: 50px">
              </el-image>
            </template>
          </el-table-column>
          <el-table-column prop="courseName" label="课程名称" show-overflow-tooltip align="center"
                           width="150px"></el-table-column>
          <el-table-column prop="describe" label="简介" align="center"></el-table-column>
          <el-table-column prop="attribute" label="属性" show-overflow-tooltip align="center" width="100">
            <template #default="scope">
              <el-tag type="success" v-if="scope.row.attribute==='公开课'">公开课</el-tag>
              <el-tag type="danger" v-else-if="scope.row.attribute==='定制课'">定制课</el-tag>
              <el-tag v-else>内部课</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="courseTime" label="课时" align="center" width="60"></el-table-column>

        </el-table-column>
        <el-table-column prop="teacherName" label="授课老师" show-overflow-tooltip align="center"
                         width="120"></el-table-column>
        <el-table-column prop="createTime" label="创建时间" align="center" width="100"></el-table-column>
        <el-table-column label="操作" align="center" width="180">
          <template #default="scope">
            <el-button size="small" text type="primary" @click="onOpenCatalogue(scope.row)">
              目录
            </el-button>
            <el-button size="small" text type="primary" @click="onOpenCourseware(scope.row)">
              资料
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
    <AddCourse ref="addCourseRef" @tableChange="initTableData"></AddCourse>
    <edit-course ref="editCourseRef" @tableChange="initTableData"></edit-course>
    <courseware ref="coursewareRef" @tableChange="initTableData"></courseware>
  </div>
</template>

<script lang="ts">
import {reactive, toRefs, defineComponent, onMounted, ref, computed} from 'vue';
import SvgIcon from "/@/components/svgIcon/index.vue";
import AddCourse from "/@/views/course/component/addCourse.vue";
import {ElMessage, ElMessageBox} from "element-plus";
import EditCourse from "/@/views/course/component/editCourse.vue";
import {Course} from "/@/views/course/interface";
import {deleteCourse, initCourseTable, searchCourseInfo} from "/@/api/course";
import Courseware from "/@/views/course/component/courseware.vue";
import {useRouter} from "vue-router";

// 页面数据：表格数据、分页数据
interface TableState {
  data: Array<Course>;
  total: number;
  loading: boolean;
  currentPage: number; // 当前页码
  pageSize: number;   // 每页显示的页数
}

export default defineComponent({
  name: 'course',
  components: {Courseware, EditCourse, AddCourse, SvgIcon},
  setup() {
    const tableRef = ref()
    const addCourseRef = ref()
    const editCourseRef = ref()
    const coursewareRef = ref()
    const isDisable = ref(true) // 按钮禁用状态
    const searchKey = ref('')   // 搜索关键字
    const router = useRouter()

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
      initCourseTable().then((res) => {
        resetData(res)
      })
    };
    // 更新表格数据
    const resetData = (res: any) => {
      const arr: Array<Course> = [];
      res.data.forEach((val: any) => {
        arr.push({
          id: val.id,
          cover: val.img,
          courseName: val.courseName,
          describe: val.introduction,
          teacherId: val.teacherId,
          teacherName: val.teacherName,
          attribute: val.attribute,
          createTime: val.createTime,
          courseware: val.courseware,
          courseTime: val.courseTime
        })
      })
      state.data = arr;
      state.total = arr.length;
    }

    // 添加
    const onAdd = () => {
      addCourseRef.value.openDialog()
    }
    const onDeleteAll = () => {
      let arr = tableRef.value.getSelectionRows().map((ele: any) => ele.id)
      ElMessageBox.confirm(`此操作将永久删除${arr.length}个课程, 是否继续`, '确认', {
        confirmButtonText: '删除',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => { //对应confirm
        deleteCourse({
          ids: arr
        }).then((res: any) => {
          if (res.code == 200) {
            ElMessage.success('成功删除所选课程');
            initTableData()
          } else ElMessage.error('删除失败:'+ res.msg)
        })
      }).catch(() => {

      })
    }
    // 点击目录按钮
    const onOpenCatalogue = (row: Course) => {
      router.push({
        path: '/course/catalog',
        query: {
          courseId: row.id,
          courseName: row.courseName
        }
      })
    }
    const onOpenCourseware = (row: Course) => {
      coursewareRef.value.openDialog(row)
    }
    const onEdit = (row: Course) => {
      editCourseRef.value.openDialog(row)
    }
    const onDelete = (row: Course) => {
      ElMessageBox.confirm(`此操作将永久删除课程：${row.courseName}, 是否继续`, '确认', {
        confirmButtonText: '删除',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => { // 对应confirm
        deleteCourse({
          ids: [row.id]
        }).then((res: any) => {
          if (res.code == 200) {
            ElMessage.success('成功删除该课程');
            initTableData()
          } else ElMessage.error('删除失败:'+res.msg)
        })
      }).catch(() => {

      })

    };
    // 没有选中选项时,禁用批量删除
    const selectionChange = (selection: any) => {
      isDisable.value = selection.length <= 0;
    }
    // 搜索框
    const search = () => {
      state.loading = true // 加载动画开始

      searchCourseInfo({
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
    // 页面加载时
    onMounted(() => {
      initTableData();
    });
    return {
      ...toRefs(state),
      tableRef,
      addCourseRef,
      editCourseRef,
      coursewareRef,
      searchKey,
      currentData,
      search,
      selectionChange,
      onAdd,
      onOpenCatalogue,
      onOpenCourseware,
      onEdit,
      onDelete,
      onDeleteAll,
      initTableData,
      isDisable,
    };
  },
});
</script>

<style scoped lang="scss">

</style>