<template>
  <el-table
    :data="tableData"
    border
    style="width: 100%"
    @selection-change="handleSelectionChange"
  >

    <el-table-column
      v-for="item in columns"
      :type='item.type?item.type:""' ,
      :width='item.width?item.width:""',
      :prop='item.prop?item.prop:""',
      :label='item.label?item.label:""',
      :fixed='item.fixed?item.fixed:""',
    >
      <template v-if="item.slot">
        <slot :name="item.slot"></slot>
      </template>
    </el-table-column>
    <el-table-column
      fixed="right"
      label="操作"
      width="100"
    >
      <template slot-scope="scope">
        <el-button @click="handleClick(scope.row)" type="text" size="mini">查看</el-button>
        <el-button type="text" size="mini">编辑</el-button>
      </template>
    </el-table-column>
  </el-table>
</template>
<script>
import columns from './columns.config';
export default {
  props: {
    tableData: {
      type: Array,
      default: [],
    },
    columns: {
      type: Array,
      default: () => [],
    },
  },
  methods: {
    handleSelectionChange(val) {
      console.log(val)
      this.multipleSelection = val;
    }
  }
}
</script>