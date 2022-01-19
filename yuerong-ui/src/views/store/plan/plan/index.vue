<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      :inline="true"
      v-show="showSearch"
      label-width="68px"
    >
      <el-form-item prop="group">
        <el-select
          v-model="queryParams.deptIds"
          placeholder="选择适用门店"
          clearable
          multiple
          size="small"
        >
          <el-option
            v-for="item in deptList"
            :key="item.deptId"
            :label="item.deptName"
            :value="item.deptId"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          icon="el-icon-search"
          size="mini"
          @click="handleQuery"
          >搜索</el-button
        >
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['store:plan:add']"
          >添加</el-button
        >
      </el-form-item>
    </el-form>

    <el-row :gutter="20" class="mb8">
      <el-col :span="8" v-for="item in dataList" :key="item.id" class="mb-22">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>{{ item.name }}（{{ item.deptCount }}）</span>
            <el-button
              @click="handleEditStorePlan(item)"
              style="float: right; padding: 3px 0"
              type="text"
              >编辑</el-button
            >
          </div>
          <div class="store-plan-list">
            <div class="empty" v-if="!item.deptCount">暂无门店数据</div>
            <div
              class="text"
              v-for="(deptNameItem, index) in item.deptNameList || []"
              :key="deptNameItem + index"
            >
              {{ deptNameItem }}
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    /> -->
  </div>
</template>

<script>
import { listDept } from "@/api/system/dept";
import { planList } from "@/api/store/plan/index";

export default {
  name: "Plan",
  dicts: ["sys_normal_disable", "sys_dept_group"],
  data() {
    return {
      loading: true,
      // 总条数
      total: 0,
      // 门店配置数据
      dataList: [],
      // 表单参数
      form: {},
      // 显示搜索条件
      showSearch: true,
      deptList: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        deptIds: [],
      },
    };
  },
  created() {
    this.getList();
    this.getDeptList();
  },
  methods: {
    getDeptList() {
      listDept().then((res) => {
        this.deptList = res.data || [];
      });
    },
    /** 查询门店配置列表 */
    getList() {
      this.loading = true;
      planList(this.queryParams).then((response) => {
        this.dataList = response.data;
        this.total = response.total || 0;
        this.loading = false;
      });
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    // 表单重置
    reset() {
      this.form = {
        id: undefined,
        name: undefined,
        status: "0",
        remark: undefined,
      };
      this.resetForm("form");
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.$router.push("/store/plan/planAdd");
    },
    handleEditStorePlan(item) {
      if (!item.id) {
        return;
      }

      this.$router.push({
        path: "/store/plan/planAdd",
        query: {
          id: item.id,
        },
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.text {
  padding: 10px 0;
  font-size: 14px;
  border-bottom: 1px solid #dcdfe6;
}

.mb-22 {
  margin-bottom: 22px;
}

.store-plan-list {
  height: 210px;
  overflow-y: auto;
}

.empty {
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
