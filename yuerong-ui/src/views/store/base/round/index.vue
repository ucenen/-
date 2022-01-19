<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" v-show="showSearch" :inline="true">
      <el-form-item label="轮牌名称" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入轮牌名称"
          clearable
          size="small"
          style="width: 240px"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
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
          v-hasPermi="['store:base:roundrule:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['store:base:roundrule:edit']"
        >修改</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="roundList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="部门" prop="dept" width="120">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.sys_dept_group" :value="scope.row.dept"/>
        </template>
      </el-table-column>
      <el-table-column label="轮牌名称" prop="name" width="180" />
      <el-table-column label="关联职位" prop="postName" :show-overflow-tooltip="true" width="380" />
      <el-table-column label="创建时间" align="center" prop="createTime" width="150">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['store:base:roundrule:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['store:base:roundrule:remove']"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改对话框 -->
    <el-drawer
      :title="title"
      :visible.sync="open"
      direction="rtl"
      :wrapperClosable="false"
      :size="700"
      ref="drawer"
      >
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="轮牌名称" prop="name">
          <el-input v-model="form.name" @blur="form.name=$event.target.value.trim()" placeholder="请输入轮牌名称" maxlength="30" show-word-limit />
        </el-form-item>
        <el-divider content-position="left">规则设置</el-divider>
        <el-form-item label="上牌规则">
          <el-radio-group v-model="form.upRule">
            <el-radio :label="0">持续上牌</el-radio>
            <el-radio :label="1">重置上牌</el-radio>
          </el-radio-group>
          <div class="tips">开启重置上牌后，第二个账务日期将重新计算轮排顺序</div>
        </el-form-item>
        <el-form-item label="收银联动">
          <el-radio-group v-model="form.cashLinkageRule">
            <el-radio :label="0">联动</el-radio>
            <el-radio :label="1">不联动</el-radio>
          </el-radio-group>
          <div class="tips">开启后，收银开单的服务人员由系统选择，不可手动更改</div>
        </el-form-item>
        <el-form-item label="指定规则">
          <el-radio-group v-model="form.assignRule">
            <el-radio :label="0">指定动牌</el-radio>
            <el-radio :label="1">指定不动牌</el-radio>
          </el-radio-group>
          <div class="tips">从待服务变为服务中，轮牌位置自动轮到最后</div>
        </el-form-item>
        <el-form-item label="服务员工排序">
          <el-radio-group v-model="form.serviceStaffSortRule">
            <el-radio :label="0">按工号顺序</el-radio>
            <el-radio :label="1">同轮牌规则</el-radio>
            <el-radio :label="2" disabled>按考勤顺序</el-radio>
          </el-radio-group>
          <div class="tips">该设置为收银选择服务员工的排序规则</div>
        </el-form-item>
        <el-form-item label="跟单人排序">
          <el-radio-group v-model="form.followSortRule">
            <el-radio :label="0">按工号顺序</el-radio>
            <el-radio :label="1">同轮牌规则</el-radio>
            <el-radio :label="2">所有人</el-radio>
          </el-radio-group>
          <div class="tips">该设置为员工端跟单人的员工排序规则</div>
        </el-form-item>
        <el-divider content-position="left">职位选择</el-divider>
        <el-form-item label="选择部门">
          <el-select v-model="form.dept" @change="deptSelectChange">
            <el-option
                v-for="dict in dict.type.sys_dept_group"
                :key="parseInt(dict.value)"
                :label="dict.label"
                :value="parseInt(dict.value)"
              />
          </el-select>
        </el-form-item>
        <el-form-item label="选择职位" prop="postIds">
          <el-select v-model="form.postIds" multiple placeholder="请选择" style="width:100%">
            <el-option
              v-for="dict in postOptions"
              :key="dict.postId"
              :label="dict.postName"
              :value="dict.postId">{{dict.postName}}
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <el-divider></el-divider>
      <div class="el-dialog__footer">
        <el-button type="primary" @click="submitForm">保存</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-drawer>
  </div>
</template>

<script>
import { listRound, getRound, delRound, addRound, updateRound } from "@/api/store/base/round_rule";
import { listPostByDept } from "@/api/system/post";

export default {
  name: "Round",
  dicts: ['sys_dept_group'],
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 轮牌规则表格数据
      roundList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 职位列表
      postOptions: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        name: undefined
      },
      // 表单参数
      form: {},
      defaultProps: {
        children: "children",
        label: "label"
      },
      // 表单校验
      rules: {
        name: [
          { required: true, message: "名称不能为空", trigger: "blur" }
        ]
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询列表 */
    getList() {
      this.loading = true;
      listRound(this.queryParams).then(
        response => {
          this.roundList = response.rows;
          this.total = response.total;
          this.loading = false;
        }
      );
    },
    /** 根据部门查询职位列表 */
    getPostOptions(dept) {
      let d = dept || this.form.dept;
      if(d) {
        return listPostByDept(d).then(response => {
          this.postOptions = response.data;
          return response;
        });
      }
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.postOptions = [];
      this.form = {
        id: undefined,
        name: undefined,
        upRule: 0,
        cashLinkageRule: 0,
        assignRule: 0,
        serviceStaffSortRule: 0,
        followSortRule: 0,
        dept: undefined,
        postIds: []
      },
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.dateRange = [];
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id)
      this.single = selection.length!=1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.getPostOptions();
      this.open = true;
      this.title = "添加轮牌";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids;
      getRound(id).then(response => {
        this.form = response.data;
        this.getPostOptions(this.form.dept);
        this.open = true;
      });
      this.title = "修改轮牌";
    },
    /** 选择部门改变触发 */
    deptSelectChange(value) {
      if(value) {
        this.form.postIds = [];
        this.getPostOptions(value);
      }
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != undefined) {
            updateRound(this.form).then(response => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addRound(this.form).then(response => {
              this.msgSuccess("新增成功");
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      this.$confirm('是否确认删除"' + row.name + '"?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delRound(row.id);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(() => {});
    }
  }
};
</script>
<style scoped>
 .tips {
   color: #AAAAAA;
 }
</style>