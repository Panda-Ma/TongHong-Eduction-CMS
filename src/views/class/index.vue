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
        <el-table-column prop="classMaster" label="班主任" show-overflow-tooltip align="center"
                         width="120"></el-table-column>
        <el-table-column prop="createTime" label="创建时间" align="center" width="100"></el-table-column>
        <el-table-column label="操作" align="center" width="200">
          <template #default="scope">
            <el-button size="small" text type="primary" @click="onOpenCourse(scope.row)">
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
    <AddCourse ref="addCourseRef"></AddCourse>
  </div>
</template>

<script lang="ts">
import {reactive, toRefs, defineComponent, onMounted, ref, computed} from 'vue';
import SvgIcon from "/@/components/svgIcon/index.vue";
import AddCourse from "/@/views/course/component/addCourse.vue";
import {ElMessage, ElMessageBox} from "element-plus";
import {Class} from "/@/views/class/interface";

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
  components: {AddCourse, SvgIcon},
  setup() {
    const addCourseRef = ref()
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
      const data: Array<Class> = [];
      for (let i = 0; i < 300; i++) {
        data.push({
          id: 1,
          cover: 'https://all.haoapk.cn/s2/image/iwcpxlja7bn903sz4mv2hgkudrtf1yoe.jpeg',
          // cover: 'https://all.haoapk.cn/s2/image/ih9t7eondr1gmkvfs4w2zx68yujp5bq3.png',
          className: `${i}`,
          describe: '的复古风根深是否就会收到尽快发货速度高的数据客观dfjaskdhf就开始东莞艰苦奋斗看对方国家的咖啡馆的咖啡馆就看对方国家奉公克己都是分开过对方空间广阔第三方机构对方空间广阔的风景广阔的风景光看对方国家看风景光看对方国家对方空间广阔的风景光发的环境都是个地方见过很多了蒂固',
          classMaster: '12345678910',
          createTime: new Date().toLocaleString(),
          num:40
        });
      }
      state.data = data;
      state.total = data.length;
    };
    // 添加
    const onAdd = () => {
      addCourseRef.value.openDialog()
    }
    const onDeleteAll = () => {
      let arr = tableRef.value.getSelectionRows().map((ele: any) => ele.id)
      ElMessageBox.confirm(`此操作将永久删除${arr.length}个班级, 是否继续`, '确认', {
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
    const onDelete = (row: Class) => {
      ElMessageBox.confirm(`此操作将永久删除班级：${row.className}, 是否继续`, '确认', {
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
      state.loading=true
      setTimeout(()=>{
        state.loading=false
      },1000)
      console.log(searchKey.value)
    }
    // 点击目录按钮
    const onOpenCatalogue = (row: Class) => {
      console.log(row.id);
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