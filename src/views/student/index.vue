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
      <el-table :data="currentData" style="width: 100%" @selection-change="selectionChange" ref="tableRef" v-loading="tableData.loading">
        <el-table-column type="selection"></el-table-column>
        <el-table-column label="主键" v-if="false" prop="id"></el-table-column>
        <el-table-column prop="avatar" label="头像" align="center" width="100px">
          <template #default="scope" >
            <el-image :preview-src-list="[scope.row.avatar]" :src="scope.row.avatar"
                      fit="contain" preview-teleported style="width: 100%;min-height: 50px">
            </el-image>
          </template>
        </el-table-column>
        <el-table-column prop="userName" label="姓名" align="center" width="100px"></el-table-column>
        <el-table-column prop="account" label="账号"  align="center" ></el-table-column>
        <el-table-column prop="studentId" label="学号"  align="center" ></el-table-column>
        <el-table-column prop="phone" label="手机号码"  align="center" width="120px"></el-table-column>
        <el-table-column prop="qq" label="QQ号码" show-overflow-tooltip align="center" ></el-table-column>
        <el-table-column prop="email" label="邮箱" show-overflow-tooltip align="center" ></el-table-column>
        <el-table-column label="操作" align="center" width="100px">
          <template #default="scope">
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
          v-model:page-size="tableData.pageSize"
          v-model:current-page="tableData.currentPage"
          class="mt15"
          :pager-count="5"
          :page-sizes="[10, 20, 30]"
          background
          layout="total, sizes, prev, pager, next, jumper"
          :total="tableData.total"
      >
      </el-pagination>
    </el-card>
    <AddCourse ref="addCourseRef"></AddCourse>
  </div>
</template>

<script lang="ts">
import {reactive, toRefs, defineComponent, onMounted, ref, computed} from 'vue';
import SvgIcon from "/@/components/svgIcon/index.vue";
import AddCourse from "/@/views/course/component/addCourse.vue";
import {ElMessage, ElMessageBox} from "element-plus";

// 通过接口定义对象的类型
interface TableDataRow {
  id: Number, // 主键
  avatar: string;  // 头像
  userName: string; // 姓名
  account: string; // 账号
  studentId: string; // 学号
  phone: string;  // 手机号码
  qq:string; // QQ号码
  email:string; // 电子邮箱
}
// 页面数据：表格数据、分页数据
interface TableDataState {
  tableData: {
    data: Array<TableDataRow>;
    total: number;
    loading: boolean;
    currentPage: number; // 当前页码
    pageSize: number;   // 每页显示的页数
  };
}

export default defineComponent({
  name: 'student',
  components: {AddCourse, SvgIcon},
  setup() {
    const addCourseRef = ref()
    const tableRef = ref()
    const isDisable = ref(true) // 按钮禁用状态
    const searchKey = ref('')   // 搜索关键字

    const state = reactive<TableDataState>({
      tableData: {
        data: [],
        total: 0,
        loading: false,
        currentPage: 1,
        pageSize: 10,
      },
    });
    const currentData = computed(() => {
      return state.tableData.data.slice((state.tableData.currentPage - 1) * state.tableData.pageSize, state.tableData.currentPage * state.tableData.pageSize)
    })
    // 初始化表格数据
    const initTableData = () => {
      const data: Array<TableDataRow> = [];
      for (let i = 0; i < 300; i++) {
        data.push({
          id: 1,
          avatar: 'https://all.haoapk.cn/s2/image/iwcpxlja7bn903sz4mv2hgkudrtf1yoe.jpeg',
          userName: `${i}`,
          account:'1233dsf',
          studentId:'38476872',
          phone: '12345678912345',
          qq: 'vueNextAdmin',
          email: 'vueNextAdmin@123.com',
        });
      }
      state.tableData.data = data;
      state.tableData.total = data.length;
    };
    // 添加
    const onAdd = () => {
      addCourseRef.value.openDialog()
    }
    const onDeleteAll = () => {
      let arr = tableRef.value.getSelectionRows().map((ele: any) => ele.id)
      ElMessageBox.confirm(`此操作将永久删除${arr.length}个学生, 是否继续`, '确认', {
        confirmButtonText: '删除',
        cancelButtonText: '取消',
        type: 'warning',
      })
          .then(() => {
            ElMessage.success('删除成功');
          })
          .catch(() => {
          });
    }
    const onDelete = (row: TableDataRow) => {
      ElMessageBox.confirm(`此操作将永久删除该学生：${row.userName}, 是否继续`, '确认', {
        confirmButtonText: '删除',
        cancelButtonText: '取消',
        type: 'warning',
      })
          .then(() => {
            ElMessage.success('删除成功');
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
      state.tableData.loading=true
      setTimeout(()=>{
        state.tableData.loading=false
      },1000)
      console.log(searchKey.value)
    }

    // 页面加载时
    onMounted(() => {
      initTableData();
    });
    return {
      ...toRefs(state),
      tableRef,
      addCourseRef,
      searchKey,
      currentData,
      search,
      selectionChange,
      onAdd,
      onDelete,
      onDeleteAll,
      isDisable
    };
  },
});
</script>

<style scoped lang="scss">

</style>