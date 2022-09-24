<template>
  <div class="course-container">
    <el-card shadow="hover">
      <div class="system-user-search mb15" style="position: relative">
        <el-button size="default" type="success" class="ml10" @click="onOpenAddCourse" plain>
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
                  style="max-width: 300px;position: absolute;right: 30px" >
          <template #append>
            <el-button @click="getKeyData" >
              <SvgIcon name="ele-Search"></SvgIcon>
            </el-button>
          </template>
        </el-input>
      </div>
      <el-table :data="tableData.data" style="width: 100%" @selection-change="selectionChange">
        <el-table-column type="selection"></el-table-column>
        <el-table-column label="课程信息" align="center">
          <el-table-column label="主键" v-if="false" prop="id"></el-table-column>
          <el-table-column prop="cover" label="封面" align="center">
            <template #default="scope">
              <el-image :preview-src-list="[scope.row.cover]" :src="scope.row.cover" style="width: 100px;height: 50px"
                        fit="contain" preview-teleported>
                <template #error>
                  <div class="image-slot">
                    <el-icon>
                      <SvgIcon name="ele-Picture"></SvgIcon>
                    </el-icon>
                  </div>
                </template>
              </el-image>
            </template>
          </el-table-column>
          <el-table-column prop="courseName" label="课程名称" show-overflow-tooltip align="center"></el-table-column>
          <el-table-column prop="describe" label="简介" align="center" show-overflow-tooltip
                           width="300"></el-table-column>
          <el-table-column prop="attribute" label="属性" show-overflow-tooltip align="center" width="100">
            <template #default="scope">
              <el-tag type="success" v-if="scope.row.attribute">公开课</el-tag>
              <el-tag v-else>任选课</el-tag>
            </template>
          </el-table-column>

        </el-table-column>
        <el-table-column prop="lecturer" label="授课老师" show-overflow-tooltip align="center"
                         width="120"></el-table-column>
        <el-table-column prop="createTime" label="创建时间" align="center" width="100"></el-table-column>
        <el-table-column label="操作" align="center" width="200">
          <template #default="scope">
            <el-button size="small" text type="primary" @click="onOpenCatalogue(scope.row)">
              目录
            </el-button>
            <el-button size="small" text type="primary" @click="onUpload(scope.row)">
              上传
            </el-button>
            <el-button size="small" text type="primary" @click="onUpload(scope.row)">
              修改
            </el-button>
            <el-button type="danger" text size="small" @click="onRowDel(scope.row)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
          @size-change="onHandleSizeChange"
          @current-change="onHandleCurrentChange"
          class="mt15"
          :pager-count="5"
          :page-sizes="[10, 20, 30]"
          v-model:current-page="tableData.param.pageNum"
          background
          v-model:page-size="tableData.param.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="tableData.total"
      >
      </el-pagination>
    </el-card>
    <AddCourse ref="addCourseRef"></AddCourse>
  </div>
</template>

<script lang="ts">
import {reactive, toRefs, defineComponent, onMounted, ref} from 'vue';
import SvgIcon from "/@/components/svgIcon/index.vue";
import AddCourse from "/@/views/course/component/addCourse.vue";

// 定义接口来定义对象的类型
interface TableDataRow {
  id:Number,
  cover: string;
  courseName: string;
  describe: string;
  lecturer: string;
  attribute: string;
  createTime: string;
}

interface TableDataState {
  tableData: {
    data: Array<TableDataRow>;
    total: number;
    loading: boolean;
    param: {
      pageNum: number;
      pageSize: number;
    };
  };
}

export default defineComponent({
  name: 'course',
  components: {AddCourse, SvgIcon},
  setup() {
    const addCourseRef = ref()
    let isDisable = ref(true) // 按钮禁用状态
    let searchKey = ref('')   // 搜索关键字
    const state = reactive<TableDataState>({
      tableData: {
        data: [],
        total: 0,
        loading: false,
        param: {
          pageNum: 1,
          pageSize: 10,
        },
      },
    });
    // 初始化表格数据
    const initTableData = () => {
      const data: Array<TableDataRow> = [];
      for (let i = 0; i < 3; i++) {
        data.push({
          id:1,
          cover: 'https://tse1-mm.cn.bing.net/th/id/OIP-C.n0_p3rYRuofABd3XudbZnAHaEo?pid=ImgDet&rs=1',
          courseName: 'java',
          describe: '的复古风根深是否就会收到尽快发货速度高的数据客观环境都是个地方见过很多了蒂固',
          lecturer: '12345678910',
          attribute: 'vueNextAdmin@123.com',
          createTime: new Date().toLocaleString(),
        });
      }
      state.tableData.data = data;
      state.tableData.total = state.tableData.data.length;
    };
    // 添加新课程
    const onOpenAddCourse = () => {
      addCourseRef.value.openDialog()
    }
    // 禁用批量删除
    const selectionChange = (selection: any) => {
      isDisable.value = selection.length <= 0;
    }
    // 搜索框
    const getKeyData=()=>{
      console.log(searchKey.value)
    }
    // 打开目录
    const onOpenCatalogue=(row:TableDataRow)=>{
      console.log(row.id);
    }
    // 页面加载时
    onMounted(() => {
      initTableData();
    });
    return {
      ...toRefs(state),
      addCourseRef,
      searchKey,
      getKeyData,
      selectionChange,
      onOpenAddCourse,
      onOpenCatalogue,
      isDisable
    };
  },
});
</script>

<style scoped lang="scss">

</style>