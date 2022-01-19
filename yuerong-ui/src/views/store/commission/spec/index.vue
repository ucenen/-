<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      :inline="true"
      v-show="showSearch"
      label-width="68px"
    >
      <el-form-item label="规则名称" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入规则名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select
          v-model="queryParams.status"
          placeholder="请选择状态"
          clearable
          size="small"
        >
          <el-option
            v-for="dict in dict.type.sys_normal_disable"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="部门" prop="deptCode">
        <el-select
          v-model="queryParams.deptCode"
          placeholder="请选择部门"
          clearable
          size="small"
          @change="deptSelectChange"
        >
          <el-option
            v-for="dict in dict.type.sys_dept_group"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="岗位" prop="postId">
        <el-select
          v-model="queryParams.postId"
          placeholder="请选择岗位"
          clearable
          size="small"
        >
          <el-option
            v-for="dict in postOptions"
            :key="dict.postId"
            :label="dict.postName"
            :value="dict.postId"
            >{{ dict.postName }}
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="门店方案" prop="storePlanId">
        <el-select
          v-model="queryParams.storePlanId"
          placeholder="请选择门店方案"
          clearable
          size="small"
        >
          <el-option
            v-for="dict in planList"
            :key="dict.id"
            :label="dict.name"
            :value="dict.id"
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
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery"
          >重置</el-button
        >
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          >新建</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button type="success" plain size="mini">复制至</el-button>
      </el-col>
      <!-- <right-toolbar :showSearch.sync="showSearch" @queryTable="getList" :columns="columns"></right-toolbar> -->
    </el-row>

    <el-table
      v-loading="loading"
      :data="commissionSpecList"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column
        label="规则名称"
        align="center"
        prop="name"
        :show-overflow-tooltip="true"
      />
      <el-table-column label="奖励条件" align="center" min-width="180">
        <template slot-scope="scope">
          {{ getDictData("trig_criteria", scope.row.trigCriteria).label }}
          {{
            `= ${scope.row.includeStartVal === "1" ? "[ " : "( "} ${
              scope.row.startVal
            } ,${scope.row.endVal} ${
              scope.row.includeEndVal === "1" ? " ]" : " )"
            }`
          }}
        </template>
      </el-table-column>
      <el-table-column label="奖励内容" align="center" min-width="180">
        <template slot-scope="scope">
          {{
            getDictData("achie_stand_index", scope.row.achieStandIndex).label
          }}
          {{ getDictData("index_type", scope.row.indexType).label }} *
          {{ scope.row.indexParam }}
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center" prop="status">
        <template slot-scope="scope">
          <dict-tag
            :options="dict.type.sys_normal_disable"
            :value="scope.row.status"
          />
        </template>
      </el-table-column>
      <el-table-column label="创建人" align="center" prop="createUserName" />
      <el-table-column
        label="创建时间"
        align="center"
        prop="createTime"
        width="180"
      >
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
        class-name="small-padding fixed-width"
        width="110"
        fixed="right"
      >
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['store:base:goods:edit']"
            >编辑</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['store:base:goods:remove']"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />
  </div>
</template>

<script>
import {
  getCommissionSpecList,
  deleteCommissionSpecInfo,
} from "@/api/store/commission/spec";
import { listPostByDept } from "@/api/system/post";
import { planList } from "@/api/store/plan/index";
import _ from "lodash";

export default {
  name: "CommissionMain",
  dicts: [
    "sys_normal_disable",
    "sys_dept_group",
    "trig_criteria",
    "index_type",
    "achie_stand_index",
  ],
  data() {
    return {
      // 遮罩层
      loading: false,
      saving: false,
      showSearch: true,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        name: null,
        postId: null,
        storePlanId: null,
        deptCode: null,
      },
      total: 0,
      // 显隐列信息
      columns: [
        { key: 0, label: "规则名称", visible: true },
        { key: 1, label: "奖励条件", visible: true },
        { key: 2, label: "奖励内容", visible: true },
        { key: 3, label: "门店方案", visible: true },
        { key: 4, label: "状态", visible: true },
      ],
      commissionSpecList: [],
      planList: [],
      postOptions: [],
    };
  },
  created() {
    this.getList();
    this.getStorePlanList();
  },
  methods: {
    getStorePlanList() {
      planList().then((response) => {
        this.planList = response.data;
      });
    },
    getList() {
      this.loading = true;
      getCommissionSpecList(this.queryParams)
        .then((response) => {
          this.commissionSpecList = response.rows;
          this.total = response.total || 0;
        })
        .finally(() => {
          this.loading = false;
        });
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    handleSelectionChange() {},
    handleUpdate(row) {
      if (!row.id) {
        return;
      }

      this.$router.push({
        path: "/store/base/commission/commissionSpecAdd",
        query: {
          id: row.id,
        },
      });
    },
    handleDelete(row) {
      if (!row.id) {
        return;
      }

      this.$confirm('是否确认删除名称为"' + row.name + '"的数据项?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(function () {
          return deleteCommissionSpecInfo(row.id);
        })
        .then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        })
        .catch(() => {});
    },
    handleAdd() {
      this.$router.push("/store/base/commission/commissionSpecAdd");
    },
    deptSelectChange(dept) {
      this.getPostOptions(dept);
    },
    /** 根据部门查询职位列表 */
    getPostOptions(d) {
      if (d) {
        listPostByDept(d).then((response) => {
          this.postOptions = response.data;
        });
      }
    },
    getDictData(type, value) {
      return (
        _.find(
          this.dict.type[type],
          (item) => item.value + "" === value + ""
        ) || {}
      );
    },
  },
};
</script>
