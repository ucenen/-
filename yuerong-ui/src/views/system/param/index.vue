<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="auto">
      <el-form-item label="所属系统" prop="system">
        <el-select v-model="queryParams.system" placeholder="所属系统" clearable size="small">
          <el-option
            v-for="dict in systemOptions"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="业务模块" prop="moduleName">
        <el-input
          v-model="queryParams.moduleName"
          placeholder="如“会员中心”"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="参数字段名称" prop="fieldName">
        <el-input
          v-model="queryParams.fieldName"
          placeholder="如“是否只能在门店内登录软件”"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="请选择状态" clearable size="small">
           <el-option
            v-for="dict in dict.type.sys_normal_disable"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
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
          v-hasPermi="['system:param:add']"
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
          v-hasPermi="['system:param:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['system:param:remove']"
        >删除</el-button>
      </el-col>
      <!-- el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          :loading="exportLoading"
          @click="handleExport"
          v-hasPermi="['system:param:export']"
        >导出</el-button -->
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="paramList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="ID" align="center" prop="id" width="60"/>
      <el-table-column label="所属系统" :formatter="systemFormat" align="" prop="system" width="80"/>
      <el-table-column label="业务模块" :formatter="moduleFormat" align="" prop="module" width="140"/>
      <!-- el-table-column label="业务模块名称" align="center" prop="moduleName" /-->
      <el-table-column label="参数字段" align="" prop="field" />
      <el-table-column label="参数字段名称" align="" prop="fieldName" />
      <el-table-column label="字段类型" align="center" prop="fieldType" width="150" :show-overflow-tooltip="true"/>
      <el-table-column label="同级排序" align="center" prop="orderNum" width="80" />
      <el-table-column label="状态" align="center" prop="status" width="60">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.sys_normal_disable" :value="scope.row.status"/>
        </template>
      </el-table-column>
      <el-table-column label="备注" align="center" prop="remark" width="150" :show-overflow-tooltip="true"/>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['system:param:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-document-copy"
            @click="handleCopy(scope.row)"
            v-hasPermi="['system:param:edit']"
          >复制</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['system:param:remove']"
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

    <!-- 添加或修改角色细节参数对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="700px" append-to-body :close-on-click-modal="false">
      <el-form ref="form" :model="form" :rules="rules" label-width="auto">
        <el-form-item label="所属系统" prop="system">
          <el-select @change="systemChanged" v-model="form.system" placeholder="所属系统" clearable size="small">
            <el-option
              v-for="dict in systemOptions"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            />
          </el-select>
        </el-form-item>
         <el-row>
          <el-col :span="12">
            <el-form-item prop="module">
              <span slot="label">
                <el-tooltip content="纯字母和(或)数字的组合，如“member”" placement="top">
                  <i class="el-icon-question"></i>
                </el-tooltip>
                                        业务模块标识
              </span>
              <el-input v-model.trim="form.module" placeholder="如“member”" maxlength="50" show-word-limit />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="业务模块名称" prop="moduleName">
              <el-input v-model="form.moduleName" @blur="form.moduleName=$event.target.value.trim()" placeholder="如“会员中心”" maxlength="50" show-word-limit />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="参数字段" prop="field">
          <el-input v-model.trim="form.field" placeholder="请输入参数字段" maxlength="100" show-word-limit />
        </el-form-item>
        <el-form-item label="参数字段名称" prop="fieldName">
          <el-input v-model="form.fieldName" @blur="form.fieldName=$event.target.value.trim()" placeholder="如“是否只能在门店内登录软件”" maxlength="100" show-word-limit />
        </el-form-item>
        <el-form-item prop="fieldType">
          <span slot="label">
            <el-tooltip content="json格式，不填默认为Html【开关】类型，即“[{'type':'el-switch','dict':'sys_common_switch'}]”" placement="top">
              <i class="el-icon-question"></i>
            </el-tooltip>
                                    参数字段类型
          </span>
          <el-input v-model="form.fieldType" type="textarea" placeholder="json格式，不填默认为Html【开关】类型，即“[{'type':'el-switch','dict':'sys_common_switch'}]”" maxlength="300" show-word-limit />
        </el-form-item>
        <el-form-item label="状态" prop="status">
            <el-select v-model="form.status" placeholder="请选择状态" size="small">
              <el-option
                v-for="dict in dict.type.sys_normal_disable"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              />
            </el-select>
        </el-form-item>
        <el-form-item label="所属系统排序" prop="orderNum">
          <el-input-number
            v-model="form.orderNum"
            controls-position="right"
            :min="0"
          />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" type="textarea" placeholder="请输入内容" maxlength="300" show-word-limit />
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
import { listParam, getParam, delParam, addParam, updateParam, exportParam } from "@/api/system/param";

export default {
  name: "Param",
  dicts: ['sys_normal_disable'],
  data() {
    return {
      // 遮罩层
      loading: true,
      // 导出遮罩层
      exportLoading: false,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 角色细节参数表格数据
      paramList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 所属系统
      systemOptions: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        system: null,
        systemName: null,
        module: null,
        moduleName: null,
        field: null,
        fieldName: null,
        fieldType: null,
        status: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        system: [
          { required: true, message: "所属系统不能为空", trigger: "blur" }
        ],
        module: [
          { required: true, message: "业务模块标识不能为空", trigger: "blur" }
        ],
        moduleName: [
          { required: true, message: "业务模块名称不能为空", trigger: "blur" }
        ],
        field: [
          { required: true, message: "参数字段不能为空", trigger: "blur" }
        ],
        fieldName: [
          { required: true, message: "参数字段名称不能为空", trigger: "blur" }
        ],
      }
    };
  },
  created() {
    this.getSystemList();
    this.getList();
  },
  methods: {
    getSystemList() {
        this.systemOptions = [{
          value: 0,
          label: '通用参数'
        },{
          value: 1,
          label: '总部端'
        },{
          value: 2,
          label: '员工端'
        },{
          value: 3,
          label: '收银端'
      }];
    },
    // 所属系统翻译
    systemFormat(row, column) {
      if(row.system == '0') {
        return '通用参数';
      } else if(row.system == '1') {
        return '总部端';
      } else if(row.system == '2') {
        return '员工端';
      } else if(row.system == '3') {
        return '收银端';
      } 
    },
    systemChanged(val){
        if(0 === val) {
            this.form.module = 'common';
            this.form.moduleName = '通用参数';
        } else {
            this.form.module = '';
            this.form.moduleName = '';
        }
    },
    moduleFormat(row, column) {
      return row.moduleName + '(' + row.module + ')';
    },
    /** 查询角色细节参数列表 */
    getList() {
      this.loading = true;
      listParam(this.queryParams).then(response => {
        this.paramList = response.rows;
        this.total = response.total;
        this.loading = false;
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
        system: null,
        systemName: null,
        module: null,
        moduleName: null,
        field: null,
        fieldName: null,
        fieldType: null,
        status: "0",
        createBy: null,
        createTime: null,
        updateBy: null,
        updateTime: null,
        remark: null
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
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加角色细节参数";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getParam(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改角色细节参数";
      });
    },
    /** 复制按钮操作 */
    handleCopy(row) {
      row.id = null;
      this.form = row;
      this.open = true;
      this.title = "添加角色细节参数";
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateParam(this.form).then(response => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addParam(this.form).then(response => {
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
      const ids = row.id || this.ids;
      this.$confirm('是否确认删除角色细节参数编号为"' + ids + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delParam(ids);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有角色细节参数数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          this.exportLoading = true;
          return exportParam(queryParams);
        }).then(response => {
          this.download(response.msg);
          this.exportLoading = false;
        }).catch(() => {});
    }
  }
};
</script>
