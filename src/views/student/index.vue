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

<!--        <el-button size="default" type="primary" class="ml10" @click="onUploadStudent" plain>-->
<!--          <el-icon>-->
<!--            <ele-Plus/>-->
<!--          </el-icon>-->
<!--          批量上传-->
<!--        </el-button>-->

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
        <el-table-column label="主键" v-if="false" prop="id"></el-table-column>
        <el-table-column prop="cover" label="头像" align="center" width="100px">
          <template #default="scope">
            <el-image :preview-src-list="[scope.row.cover]" :src="scope.row.cover"
                      fit="contain" preview-teleported style="width: 100%;min-height: 50px">
            </el-image>
          </template>
        </el-table-column>
        <el-table-column prop="studentName" label="姓名" align="center" width="100px"></el-table-column>
        <el-table-column prop="userName" label="账号" align="center"></el-table-column>
        <el-table-column prop="phone" label="手机号码" align="center" width="120px"></el-table-column>
        <el-table-column prop="qq" label="QQ号码" show-overflow-tooltip align="center"></el-table-column>
        <el-table-column prop="email" label="邮箱" show-overflow-tooltip align="center"></el-table-column>
        <el-table-column label="操作" align="center" width="160px">
          <template #default="scope">
            <el-button size="small" text type="primary" @click="onEdit(scope.row)">
              修改
            </el-button>
            <el-button size="small" text type="primary" @click="onLinkClass(scope.row)">
              关联班级
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
    <AddStudent ref="addStudentRef" @tableChange="initTableData"></AddStudent>
    <EditStudent ref="editStudentRef" @tableChange="initTableData"></EditStudent>
    <link-class ref="linkClassRef"></link-class>
    <upload-student ref="uploadStudentRef"></upload-student>
  </div>
</template>

<script lang="ts">
import {reactive, toRefs, defineComponent, onMounted, ref, computed} from 'vue';
import SvgIcon from "/@/components/svgIcon/index.vue";
import {ElMessage, ElMessageBox} from "element-plus";
import {Student} from "/@/views/student/interface";
import AddStudent from "/@/views/student/component/addStudent.vue";
import EditStudent from "/@/views/student/component/editStudent.vue";
import uploadStudent from "/@/views/student/component/uploadStudent.vue";
import {deleteStudent, initStudentTable, searchStudentInfo} from "/@/api/student";
import LinkClass from "/@/views/student/component/linkClass.vue";

// 页面数据：表格数据、分页数据
interface TableState {
  data: Array<Student>;
  total: number;
  loading: boolean;
  currentPage: number; // 当前页码
  pageSize: number;   // 每页显示的页数
}

export default defineComponent({
  name: 'student',
  components: {AddStudent, EditStudent, SvgIcon, LinkClass, uploadStudent},
  setup() {
    const addStudentRef = ref()
    const editStudentRef = ref()
    const linkClassRef = ref()
    const uploadStudentRef = ref()
    const tableRef = ref()
    const isDisable = ref(true) // 按钮禁用状态
    const searchKey = ref('')   // 搜索关键字

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
      initStudentTable().then((res) => {
        resetData(res)
      })
    };
    // 更新表格数据
    const resetData = (res: any) => {
      const arr: Array<Student> = [];
      res.data.forEach((val: any) => {
        arr.push({
          id: val.id,
          studentName: val.studentName,
          userName: val.username,
          password: '',
          cardId: val.cardId,
          phone: val.number,
          qq: val.tim,
          email: val.email,
          cover: val.img,
          introduction: val.introduction,
        })
      })
      state.data = arr;
      state.total = arr.length;
    }

    // 添加
    const onAdd = () => {
      addStudentRef.value.openDialog()
    }
    const onDeleteAll = () => {
      let arr = tableRef.value.getSelectionRows().map((ele: any) => ele.id)
      ElMessageBox.confirm(`此操作将永久删除${arr.length}个学生, 是否继续`, '确认', {
        confirmButtonText: '删除',
        cancelButtonText: '取消',
        type: 'warning',
      })
          .then(() => { // 对应confirm
            deleteStudent({
              ids: arr
            }).then((res: any) => {
              if (res.code == 200) {
                ElMessage.success('成功删除学生');
                initTableData()
              } else ElMessage.error('删除失败')
            })
          }).catch(() => {
      })
    }
    const onEdit = (row: Student) => {
      editStudentRef.value.openDialog(row)
    }
    const onLinkClass = (row: Student) => {
      linkClassRef.value.openDialog(row.id)
    }
    const onDelete = (row: Student) => {
      ElMessageBox.confirm(`此操作将永久删除该学生：${row.userName}, 是否继续`, '确认', {
        confirmButtonText: '删除',
        cancelButtonText: '取消',
        type: 'warning',
      })
          .then(() => { // 对应confirm
            deleteStudent({
              ids: [row.id]
            }).then((res: any) => {
              if (res.code == 200) {
                ElMessage.success('成功删除该学生');
                initTableData()
              } else ElMessage.error('删除失败')
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
      state.loading = true
      searchStudentInfo({
        keyword: searchKey.value
      }).then((res: any) => {
        if (res.code == 200) {
          resetData(res)
        } else {
          ElMessage.error('抱歉,搜索失败...' + res.msg)
        }
        state.loading = false // 加载动画结束
      })
    }
    const onUploadStudent = () => {
      uploadStudentRef.value.openDialog()
    }
    // 页面加载时
    onMounted(() => {
      initTableData();
    });
    return {
      ...toRefs(state),
      tableRef,
      addStudentRef,
      editStudentRef,
      searchKey,
      currentData,
      search,
      selectionChange,
      onAdd,
      onDelete,
      onDeleteAll,
      isDisable,
      initTableData,
      onEdit,
      linkClassRef,
      onLinkClass,
      uploadStudentRef,
      onUploadStudent
    };
  },
});
</script>

<style scoped lang="scss">

</style>