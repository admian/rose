<template>
  <el-table
    :data="topData"
    stripe
    style="width: 100%"
    height="490"
    fit
    highlight-current-row
  >
    <el-table-column
      prop="fodderId"
      label="排行榜"
      width="100">
    </el-table-column>
    <el-table-column
      prop="fodderName"
      label="素材名"
      >
    </el-table-column>
    <el-table-column
      prop="useCount"
      label="使用次数">
    </el-table-column>
  </el-table>
</template>

<script>
export default {
  name: 'PanelTable',
  props:['topData']
}
</script>

<style scoped>

</style>
