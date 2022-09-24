<template>
  <div class="paper-container">
    <el-card shadow="hover">
      <div class="system-user-search mb15">
        <el-input size="default" placeholder="请输入试卷名称" style="max-width: 180px"> </el-input>
        <el-button size="default" type="primary" class="ml10">
          <el-icon>
            <ele-Search />
          </el-icon>
          查询
        </el-button>
        <el-button size="default" type="success" class="ml10" @click="onOpenAddPaper">
          <el-icon>
            <ele-FolderAdd />
          </el-icon>
          新增用户
        </el-button>
      </div>
    </el-card>
  </div>
</template>

<script lang="ts">
import {reactive, toRefs, defineComponent} from 'vue';

export default defineComponent({
  name: 'paper',
  setup() {
    const state = reactive({});
    return {
      ...toRefs(state),
    };
  },
});
</script>

<style scoped lang="scss">

</style>