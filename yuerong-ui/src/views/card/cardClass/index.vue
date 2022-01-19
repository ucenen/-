<template>
  <div class="app-container">
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['store:base:goods:class:add']"
          >新增一级分类</el-button
        >
      </el-col>
      <right-toolbar
        :showSearch.sync="showSearch"
        @queryTable="getList"
      ></right-toolbar>
    </el-row>

    <el-table
      v-loading="loading"
      :data="dataList"
      row-key="id"
      default-expand-all
      :tree-props="{
        children: 'childCardClassList',
        hasChildren: 'hasChildren',
      }"
    >
      <el-table-column label="分类名称" align="" prop="name" />
      <el-table-column label="分类编码" align="" prop="code" />
      <el-table-column label="层级" align="" prop="hierarchy" width="110" />
      <el-table-column label="同级排序" align="" prop="sort" width="80" />
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
      >
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['store:base:goods:class:edit']"
            >修改</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-plus"
            @click="handleAdd(scope.row)"
            v-hasPermi="['store:base:goods:class:add']"
            >添加子分类</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['store:base:goods:class:remove']"
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
      @pagination="getList(queryParams)"
      layout="total, prev, pager, next, jumper"
    />

    <!-- 添加或修改卡分类对话框 -->
    <el-dialog
      :title="title"
      :visible.sync="open"
      width="500px"
      append-to-body
      :close-on-click-modal="false"
    >
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="父分类" prop="parentId">
          <treeselect
            :disabled="isfirst"
            v-model="form.parentId"
            :options="classOptions"
            :normalizer="normalizer"
            placeholder="请选择上级"
          />
        </el-form-item>
        <el-form-item label="层级" prop="hierarchy">
          <el-input
            :disabled="isfirst"
            v-model="form.hierarchy"
            placeholder="请输入层级"
            maxlength="50"
          />
        </el-form-item>
        <el-form-item label="名称" prop="name">
          <el-input
            v-model="form.name"
            placeholder="请输入名称"
            maxlength="50"
          />
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input-number v-model="form.sort" />
        </el-form-item>
        <el-form-item label="是否启用" prop="status">
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
  listCardClass,
  addClass,
  updateClass,
  deleteClass,
  getClassone,
} from "@/api/card/class";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";

export default {
  name: "GoodsClass",
  dicts: ["sys_normal_disable"],
  components: {
    Treeselect,
  },
  data() {
    return {
      // 总条数
      total: 0,
      // 遮罩层
      loading: true,
      // 导出遮罩层
      exportLoading: false,
      // 显示搜索条件
      showSearch: true,
      classOptions: [],
      brandList: [],
      // 卡分类表格数据
      dataList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
      },
      // 表单参数
      form: {
        status: "0",
      },
      isfirst: false,
      // 表单校验
      rules: {
        hierarchy: [
          { required: true, message: "层级不能为空", trigger: "blur" },
        ],
        name: [{ required: true, message: "名称不能为空", trigger: "blur" }],
        sort: [{ required: true, message: "排序不能为空", trigger: "blur" }],
      },
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询卡分类列表 */
    getList() {
      this.loading = true;
      listCardClass(this.queryParams).then((response) => {
        this.dataList = response.rows;
        this.dataList.map((item) => this.handleData(item));
        this.loading = false;
        this.total = response.total;
      });
    },
    handleData(node) {
      node.children = node.childCardClassList;
      if (!node.childCardClassList) {
        node.children = node.childCardClassList;
      } else {
        node.childCardClassList.map((item) => this.handleData(item));
      }
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
    getTreeselect() {
      this.getList();
      this.classOptions = [];
      const data = { id: 0, name: "无上级", children: [] };
      data.children = this.dataList;
      this.classOptions.push(data);
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        id: undefined,
        parentId: 0,
        name: null,
        status: "0",
        hierarchy: undefined,
      };
      this.resetForm("form");
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
    /** 新增按钮操作 */
    handleAdd(row) {
      this.isfirst = true;
      this.reset();
      this.getTreeselect();
      if (row != null && row.id) {
        this.form.parentId = row.id;
        this.form.hierarchy = row.hierarchy + 1;
        if (row.children) {
          this.form.sort = row.children.length + 1;
        }
      } else {
        this.form.parentId = 0;
        this.form.hierarchy = 1;
        this.isfirst = true;
      }
      this.open = true;
      this.title = "添加卡分类";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      this.isfirst = true;
      this.getTreeselect();
      console.log(this.dataList);
      if (row != null) {
        // this.form.parentId = row.id;
        // this.form.hierarchy = row.hierarchy;
      }
      getClassone(row.id).then((response) => {
        this.form = response.data;
      });
      this.open = true;
      this.title = "修改卡分类";
    },
    // 新增提交按钮
    submitForm: function () {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.form.id != undefined) {
            let query = {
              id: this.form.id,
              sort: this.form.sort,
              hierarchy: this.form.hierarchy,
              name: this.form.name,
              status: this.form.status,
            };
            updateClass(query).then((response) => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            if (this.form.hierarchy >= 5) {
              this.$modal.alertError("会员卡分类最多只能4级");
              this.open = false;
            } else {
              addClass(this.form).then((response) => {
                this.$modal.msgSuccess("新增成功");
                this.open = false;
                this.getList();
              });
            }
          }
        }
      });
      this.isfirst = false;
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      this.$confirm(
        '是否确认删除卡分类编号为"' + row.id + '"的数据项?',
        "警告",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(function () {
          return deleteClass({ id: row.id });
        })
        .then(() => {
          this.getList();
          this.$modal.msgSuccess("删除成功");
        })
        .catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download(
        "/store/base/goods_class/export",
        {
          ...this.queryParams,
        },
        `goods_class_${new Date().getTime()}.xlsx`
      );
    },
  },
};
</script>
