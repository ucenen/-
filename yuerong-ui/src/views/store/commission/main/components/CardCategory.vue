<template>
  <div>
    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px">
      <el-form-item label="支付方式" prop="status">
        <el-select v-model="queryParams.status" placeholder="请选择支付方式" clearable size="small">
          <el-option
            v-for="dict in dict.type.sys_normal_disable"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="提成类别" prop="deptCode">
        <el-select v-model="queryParams.deptCode" placeholder="请选择提成类别" clearable size="small">
          <el-option
            v-for="dict in dict.type.sys_normal_disable"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="状态" prop="postId">
        <el-select v-model="queryParams.postId" placeholder="请选择状态" clearable size="small">
          <el-option
            v-for="dict in dict.type.sys_normal_disable"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="归属品牌" prop="storePlanId">
        <el-select v-model="queryParams.storePlanId" placeholder="请选择归属品牌" clearable size="small">
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

    <el-row :gutter="10" class="mb-22">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['store:commissionMain:add']"
        >添加</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-download"
          plain
          size="mini"
        >导出</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          plain
          size="mini"
        >导入</el-button>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="4">
        <el-tree
          class="tree-border"
          :data="classList"
          show-checkbox
          ref="dept"
          node-key="id"
          empty-text="加载中，请稍后"
          :props="defaultProps"
          :default-expand-all="true"
        ></el-tree>
      </el-col>
      <el-col :span="20">
        <el-table v-loading="loading" :data="dataList">
          <el-table-column label="分类名称" align="center" prop="name" :show-overflow-tooltip="true" />
          <el-table-column label="支付类型" align="center" prop="goodsClass.name" />
          <el-table-column label="支付方式" align="center" prop="goodsClass.name" />
          <el-table-column label="支付方式" align="center" prop="goodsClass.name" />
          <el-table-column label="支付方式" align="center" prop="goodsClass.name" />
          <el-table-column label="支付方式" align="center" prop="goodsClass.name" />
          <el-table-column label="状态" align="center" prop="status">
            <template slot-scope="scope">
              <dict-tag :options="dict.type.sys_normal_disable" :value="scope.row.status"/>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="110" fixed="right">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="text"
                icon="el-icon-edit"
                @click="handleUpdate(scope.row)"
              >编辑</el-button>
              <el-button
                size="mini"
                type="text"
                icon="el-icon-delete"
                @click="handleDelete(scope.row)"
              >删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>
    <el-dialog 
      :title="addTitle"
      :visible.sync="dialogVisible"
      width="500px"
      append-to-body
      :close-on-click-modal="false"
    >
       <el-form
        ref="form"
        :model="form"
        :rules="rules"
        label-width="auto"
        >
          <el-row>
            <el-col :span="13">
              <el-form-item prop="name" label="分类名称">
                <el-select
                  v-model="form.status"
                  placeholder="请选择分类名称"
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
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="13">
              <el-form-item prop="name" label="支付方式">
                <el-select
                  v-model="form.status"
                  placeholder="请选择支付方式"
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
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="13">
              <el-form-item prop="name" label="提成类别">
                <el-select
                  v-model="form.status"
                  placeholder="请选择提成类别"
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
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="13">
              <el-form-item prop="name" label="业绩成本">
                <el-select
                  v-model="form.status"
                  placeholder="请选择业绩成本"
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
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="13">
              <el-form-item prop="name" label-width="68px">
                <el-input
                  v-model="form.perfDeduction"
                  placeholder="请输入"
                  oninput="value=value.replace(/^\.|[^\d|^\.]/g,'')"
                  size="small"
                  maxlength="10"
                >
                  <template slot="append">
                    <el-select prop="perfDeductionUnit" style="width:60px" v-model="form.perfDeductionUnit"
                      placeholder="请选择"
                      size="small">
                      <el-option
                        v-for="dict in dict.type.unit_yuan_percent"
                        :key="dict.value"
                        :label="dict.label"
                        :value="dict.value"
                      />
                    </el-select>
                  </template>
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="13">
              <el-form-item prop="name" label="提成比例">
                <el-select
                  v-model="form.status"
                  placeholder="请选择提成比例"
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
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="13">
              <el-form-item prop="name" label-width="68px">
                <el-input
                  v-model="form.perfDeduction"
                  placeholder="请输入"
                  oninput="value=value.replace(/^\.|[^\d|^\.]/g,'')"
                  size="small"
                  maxlength="10"
                >
                  <template slot="append">
                    <el-select prop="perfDeductionUnit" style="width:60px" v-model="form.perfDeductionUnit"
                      placeholder="请选择"
                      size="small">
                      <el-option
                        v-for="dict in dict.type.unit_yuan_percent"
                        :key="dict.value"
                        :label="dict.label"
                        :value="dict.value"
                      />
                    </el-select>
                  </template>
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button
            type="primary"
            @click="submitForm"
            :loading="saving"
            >确 定</el-button
          >
          <el-button @click="cancelForm" :loading="saving"
            >取 消</el-button
          >
        </div>
    </el-dialog>
  </div> 
</template>
<script>
import {
  listClass,
} from "@/api/store/base/service_class";

export default {
  dicts:['sys_normal_disable', 'unit_yuan_percent'],
  data(){
    return {
      loading: false,
      saving: false,
      queryParams: {},
      classList: [],
      dataList: [],
      defaultProps: {
        children: "children",
        label: "name",
      },
      addTitle: '添加提成',
      dialogVisible: false,
      form: {
        status: null,
        categoryId: ''
      },
      rules: {}
    }
  },
  created(){
    this.getServiceClassList()
  },
  methods: {
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
    handleAdd(){
      this.dialogVisible = true
    },
    handleUpdate(){},
    handleDelete(){},
    getServiceClassList(){
      this.loading = true;
      listClass().then((response) => {
        this.classList = this.handleTree(response.data, "id", "parentId");
        this.loading = false;
      });
    },
    cancelForm(){
      this.resetForm('form');
      this.dialogVisible = false;
    },
    submitForm(){
      this.$refs['form'].validate(valid=>{
        if(!valid){
          return
        }

        this.cancelFormCopy();
      })
    },
  }
}
</script>
<style lang="scss" scoped>
  .mb-22 {
    margin-bottom: 22px;
  }
</style>
