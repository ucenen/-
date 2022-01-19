<template>
  <div class="container-style privilege-container">
    <div class="filter-head">
      <div class="filter-head-left">
        <el-form class="filter-wrapper" :inline="true">
          <el-form-item class="filter-head-item" label="权益名称:">
            <el-select v-model="privilegeFilter.name" placeholder="请选择" size="mini" style="width:120px">
              <el-option
                v-for="item in privilegeList"
                :key="item.id"
                :label="item.schemeName"
                :value="item.id | valToString"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item  class="filter-head-item" label="状态:">
            <el-select v-model="privilegeFilter.status" placeholder="请选择" size="mini" style="width: 120px">
              <el-option
                v-for="item in statusList"
                :key="item.id"
                :label="item.schemeName"
                :value="item.id | valToString"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item class="filter-head-item" label="更新日期:">
            <el-date-picker
              v-model="privilegeFilter.date"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              size="mini"
              style="width: 200px"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item  class="filter-head-item" label="权益类型:">
            <el-select v-model="privilegeFilter.type" placeholder="请选择" size="mini" style="width: 120px">
              <el-option
                v-for="item in privilageTypeList"
                :key="item.id"
                :label="item.schemeName"
                :value="item.id | valToString"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item class="filter-head-item" label="权益编号:">
            <el-input v-model="privilegeFilter.number" placeholder="请输入编号" size="mini" style="width: 120px"></el-input>
          </el-form-item>
        </el-form>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handlePrivilegeQuery">查询</el-button>
      </div>
      <div class="filter-head-right">
        <el-button icon="el-icon-plus" size="mini" @click="handlePrivilegeQuery">添加权益</el-button>
        <el-button icon="el-icon-s-operation" size="mini" @click="handlePrivilegeQuery">自定义列</el-button>
      </div>
    </div>
    <div class="table-wrapper" v-if="!noData">
      <el-table
        :data="tableData"
        border
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column
          type="selection"
          width="55">
        </el-table-column>
        <el-table-column
          prop="date"
          label="权益名称"
          width="150">
        </el-table-column>
        <el-table-column
          prop="name"
          label="权益图标"
          width="120">
        </el-table-column>
        <el-table-column
          prop="province"
          label="权益类型"
          width="120">
        </el-table-column>
        <el-table-column
          prop="city"
          label="是否可购买">
        </el-table-column>
        <el-table-column
          prop="address"
          label="售价">
        </el-table-column>
        <el-table-column
          prop="zip"
          label="领取限制"
          width="120">
        </el-table-column>
        <el-table-column
          prop="zip"
          label="状态">
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
    </div>
    <el-empty v-else description="空空如也"></el-empty>
  </div>
</template>
<script>
export default {
  data() {
    return {
      noData: false,
      privilegeFilter: {},
      privilegeList: [],
      statusList: [],
      privilageTypeList: [],
      multipleSelection: [],
      tableData: [
        {
          date: "2016-05-02",
          name: "王小虎",
          province: "上海",
          city: "普陀区",
          address: "上海市普陀区金沙江路 1518 弄",
          zip: 200333,
        },
        {
          date: "2016-05-03",
          name: "王大虎",
          province: "上海",
          city: "普陀区",
          address: "上海市普陀区金沙江路 1518 弄",
          zip: 200334,
        },
      ],
    };
  },
  methods: {
    handleClick(row) {
      console.log(row);
    },
    handlePrivilegeQuery() {},
    handleSelectionChange(val) {
      console.log(val)
      this.multipleSelection = val;
    }
  },
  components: {
  },
};
</script>
<style lang="scss" scoped>
.container-style {
  min-height: calc(100vh - 84px);
  border: 12px solid rgba(240, 242, 245, 0.8);
  padding: 10px;
}
.privilege-container {
  width: 100%;
  font-size: 14px;
}
.filter-head {
  display: flex;
  justify-content: space-between;
}
.filter-head-left {
  display: flex;
  align-items: flex-start;
  max-width: 77%;
  font-size: 12px;
  .filter-wrapper {
    max-width: 86%;
  }
}
.filter-head-item {
  margin-right: 25px;
}
</style>