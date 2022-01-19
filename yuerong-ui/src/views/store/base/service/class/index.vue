<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      :inline="true"
      v-show="showSearch"
      label-width="68px"
    >
      <el-form-item label="分类名称" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入分类名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="管理部门" prop="deptId">
        <el-select
          v-model="queryParams.deptId"
          placeholder="请选择"
          clearable
          size="small"
        >
          <el-option
            v-for="brand in brandList"
            :key="brand.deptId"
            :label="brand.deptName"
            :value="brand.deptId"
            >{{ brand.deptName }}
          </el-option>
        </el-select>
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
          v-hasPermi="['store:base:servcie:class:add']"
          >新增</el-button
        >
      </el-col>
      <right-toolbar
        :showSearch.sync="showSearch"
        @queryTable="getList"
      ></right-toolbar>
    </el-row>

    <el-table
      v-loading="loading"
      :data="classList"
      row-key="id"
      default-expand-all
      :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
    >
      <el-table-column label="分类名称" align="" prop="name" width="260" />
      <el-table-column label="同级排序" align="" prop="orderNum" width="80" />
      <el-table-column
        label="管理部门"
        align=""
        prop="dept.deptName"
        width="110"
      />
      <!-- el-table-column label="适用组织" align="" prop="deptName" width="300" :show-overflow-tooltip="true" / -->
      <el-table-column label="状态" align="" prop="status" width="80">
        <template slot-scope="scope">
          <dict-tag
            :options="dict.type.sys_normal_disable"
            :value="scope.row.status"
          />
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['store:base:servcie:class:edit']"
            >修改</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-plus"
            @click="handleAdd(scope.row)"
            v-hasPermi="['store:base:servcie:class:add']"
            >添加子分类</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['store:base:servcie:class:remove']"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <!-- 添加或修改服务分类对话框 -->
    <el-dialog
      :title="title"
      :visible.sync="open"
      width="500px"
      append-to-body
      :close-on-click-modal="false"
    >
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="上级分类" prop="parentId">
          <treeselect
            :disabled="isfirst"
            v-model="form.parentId"
            :options="classOptions"
            :normalizer="normalizer"
            placeholder="请选择上级"
          />
        </el-form-item>
        <el-form-item label="分类名称" prop="name">
          <el-input
            v-model="form.name" 
            @blur="form.name=$event.target.value.trim()"
            placeholder="请输入分类名称"
            maxlength="50"
            show-word-limit
          />
        </el-form-item>
        <!-- el-form-item label="适用组织">
           <el-select v-model="form.chkDeptIds" multiple placeholder="请选择" style="width:100%">
            <el-option
              v-for="brand in brandList"
              :key="brand.deptId"
              :label="brand.deptName"
              :value="brand.deptId">{{brand.deptName}}
            </el-option>
          </el-select>
        </el-form-item -->
        <el-form-item label="管理部门" prop="deptId">
          <el-select
            v-model="form.deptId"
            placeholder="请选择"
            style="width: 100%"
          >
            <el-option
              v-for="brand in brandList"
              :key="brand.deptId"
              :label="brand.deptName"
              :value="brand.deptId"
              >{{ brand.deptName }}
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="同级排序" prop="orderNum">
          <el-input-number
            v-model="form.orderNum"
            controls-position="right"
            :min="0"
          />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="form.status">
            <el-radio
              v-for="dict in dict.type.sys_normal_disable"
              :key="dict.value"
              :label="dict.value"
              >{{ dict.label }}</el-radio
            >
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  listClass,
  getClass,
  delClass,
  addClass,
  updateClass,
  exportClass,
} from "@/api/store/base/service_class";
import { listBrand } from "@/api/system/dept";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";

export default {
  name: "Class",
  dicts: ["sys_normal_disable"],
  components: {
    Treeselect,
  },
  data() {
    return {
      // 遮罩层
      loading: true,
      // 显示搜索条件
      showSearch: true,
      // 服务分类表格数据
      classList: [],
      // 服务分类树选项
      classOptions: [],
      //适用组织(品牌)列表
      brandList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        name: null,
        deptId: null,
        status: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        name: [
          { required: true, message: "分类名称不能为空", trigger: "blur" },
        ],
        deptId: [{ required: true, message: "不能为空", trigger: "blur" }],
      },
      isfirst: false,
    };
  },
  created() {
    this.getList();
    this.getBrandList();
  },
  methods: {
    /** 查询服务分类列表 */
    getList() {
      this.loading = true;
      listClass(this.queryParams).then((response) => {
        this.classList = this.handleTree(response.data, "id", "parentId");
        this.loading = false;
      });
    },
    //查询品牌列表
    getBrandList() {
      listBrand().then((response) => {
        this.brandList = response.data;
      });
    },
    /** 转换服务分类数据结构 */
    normalizer(node) {
      if (node.children && !node.children.length) {
        delete node.children;
      }
      return {
        id: node.id,
        label: node.name,
        children: node.children,
      };
    },
    /** 查询服务分类下拉树结构 */
    getTreeselect() {
      listClass().then((response) => {
        this.classOptions = [];
        const data = { id: 0, name: "无上级", children: [] };
        data.children = this.handleTree(response.data, "id", "parentId");
        this.classOptions.push(data);
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        id: null,
        parentId: 0,
        name: null,
        orderNum: 1,
        chkDeptIds: [],
        status: "0",
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    /** 新增按钮操作 */
    handleAdd(row) {
      this.isfirst = true;
      this.reset();
      this.getTreeselect();
      if (row != null && row.id) {
        this.form.parentId = row.id;
        this.form.deptId = row.deptId;
        if (row.children) {
          this.form.orderNum = row.children.length + 1;
        }
      } else {
        this.form.parentId = 0;
      }
      this.open = true;
      this.title = "添加服务分类";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.isfirst = false;
      this.reset();
      this.getTreeselect();
      if (row != null) {
        this.form.parentId = row.id;
      }
      getClass(row.id).then((response) => {
        this.form = response.data;
        this.open = true;
        this.title = "修改服务分类";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.form.id != null) {
            updateClass(this.form).then((response) => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addClass(this.form).then((response) => {
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
      this.$confirm(
        '是否确认删除服务分类编号为"' + row.id + '"的数据项?',
        "警告",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(function () {
          return delClass(row.id);
        })
        .then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        })
        .catch(() => {});
    },
  },
};
</script>
