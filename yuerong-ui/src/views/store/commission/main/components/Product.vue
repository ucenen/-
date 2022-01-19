<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="商品编号" prop="code">
        <el-input
            v-model="queryParams.code"
            placeholder="请输入商品编号"
            clearable
            size="small"
            @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="商品名称" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入商品名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="支付方式" prop="classIdArr">
        <el-cascader v-model="queryParams.classIdArr" :options="classOptions" clearable size="small"></el-cascader>
      </el-form-item>
      <el-form-item label="提成类别" prop="classIdArr">
        <el-cascader v-model="queryParams.classIdArr" :options="classOptions" clearable size="small"></el-cascader>
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
      <el-form-item label="商品次" prop="status">
        <el-select v-model="queryParams.status" placeholder="请选择商品次" clearable size="small">
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
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
        >导出</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
        >导入</el-button>
      </el-col>
    </el-row>

    <el-table v-loading="loading" :data="serviceList" >
      <el-table-column label="商品编号" align="center" prop="code" />
      <el-table-column label="商品名称"  align="center" prop="name" width="150" :show-overflow-tooltip="true" />
      <el-table-column label="分类名称" align="center" prop="serviceClass.name" />
      <el-table-column label="商品次" align="center" prop="durationHour">
        <template slot-scope="scope">
          <span v-if="scope.row.durationHour">{{ scope.row.durationHour }} 小时 </span>
          <span v-if="scope.row.durationMinute">
            {{ scope.row.durationMinute }} 分钟
          </span>
        </template>
      </el-table-column>
      <el-table-column label="支付类型" align="center" prop="serviceClass.name" />
      <el-table-column label="支付方式" align="center" prop="serviceClass.name" />
      <el-table-column label="类别" align="center" prop="serviceClass.name" />
      <el-table-column label="业绩成本" align="center" prop="standardPrice" />
      <el-table-column label="提成比例" align="center" prop="memberPrice" />
      <el-table-column label="状态" align="center" prop="status">
       <template slot-scope="scope">
          <dict-tag :options="dict.type.sys_normal_disable" :value="scope.row.status"/>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['store:service:edit']"
          >编辑</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['store:service:remove']"
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

    <el-dialog
      :visible.sync="serviceDialogVisible"
      append-to-body
      :close-on-click-modal="false"
    >
      <el-form
        :model="serviceQueryParams"
        ref="serviceQueryForm"
        :inline="true"
        v-show="showSearch"
        label-width="68px"
      >
       <el-form-item label="商品编号" prop="code">
          <el-input
              v-model="serviceQueryParams.code"
              placeholder="请输入商品编号"
              clearable
              size="small"
              @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="商品名称" prop="name">
          <el-input
            v-model="serviceQueryParams.name"
            placeholder="请输入商品名称"
            clearable
            size="small"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="商品分类" prop="classIdArr">
          <el-cascader v-model="serviceQueryParams.classIdArr" :options="classOptions" clearable size="small"></el-cascader>
        </el-form-item>
         <el-form-item label="更新日期" prop="date">
          <el-date-picker
            v-model="updateDate"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :default-time="['00:00:00', '23:59:59']"
            value-format="yyyy-MM-dd HH:mm:ss"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="serviceQueryParams.status" placeholder="请选择状态" clearable size="small">
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
            @click="handleServiceDialogQuery"
            >查询</el-button
          >
          <el-button icon="el-icon-refresh" size="mini" @click="resetServiceDialogQuery"
            >重置</el-button
          >
        </el-form-item>
      </el-form>
      <el-form :model="serviceForm" ref="serviceForm" class="mt-44">
      <el-table
        v-loading="serviceDialogLoading"
        :data="serviceForm.serviceDialogDataList"
        @selection-change="handleDialogSelectionChange"
        class="form-table"
        ref="multipleTable"
      >
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="商品图片" align="center">
          <template slot-scope="scope">
            <el-image
              style="width: 100px; height: 100px"
              :src="scope.row.image && scope.row.image.url"
              fit="contain"
            ></el-image>
          </template>
        </el-table-column>
        <el-table-column label="商品编号" align="center" prop="serviceCode" />
        <el-table-column
          label="商品名称"
          align="center"
          prop="serviceName"
          width="150"
          :show-overflow-tooltip="true"
        />
        <el-table-column label="商品分类" align="center" prop="serviceClass" />
        <el-table-column label="标准价格" align="center" prop="standardPrice" />
        <el-table-column label="门店售价" prop="storePrice" min-width="180">
          <template slot-scope="scope">
            <el-form-item
              :prop="'serviceList.' + scope.$index + '.storePrice'"
              :rules="{ validator: validatePrice, trigger: 'change' }"
            >
              <el-input-number
                size="mini"
                v-model="scope.row.storePrice"
                :precision="2"
                :step="0.1"
              ></el-input-number>
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column label="会员价" align="center" prop="memberPrice" />
        <el-table-column label="门店会员价" prop="storePrice" min-width="180">
          <template slot-scope="scope">
            <el-form-item
              :prop="'serviceList.' + scope.$index + '.storeMemberPrice'"
              :rules="{ validator: validatePrice, trigger: 'change' }"
            >
              <el-input-number
                size="mini"
                v-model="scope.row.storeMemberPrice"
                :precision="2"
                :step="0.1"
              ></el-input-number>
            </el-form-item>
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
      </el-table>
      </el-form>
      <el-row
        type="flex"
        justify="space-between"
        align="middle"
        class="page-footer"
      >
        <el-col :span="10"> </el-col>
        <el-col :span="6" class="text-align-right">
          <pagination
            v-show="serviceDialogDataTotal > 0"
            :total="serviceDialogDataTotal"
            :page.sync="serviceQueryParams.pageNum"
            :limit.sync="serviceQueryParams.pageSize"
            @pagination="getServiceDialogList"
          />
        </el-col>
      </el-row>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm" :loading="saving"
          >确 定</el-button
        >
        <el-button @click="cancel" :loading="saving"
          >取 消</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { cascaderList as classList } from "@/api/store/base/service_class";
import { cascaderList as paymentList } from "@/api/store/base/payment";
import { listService } from "@/api/store/base/service";
export default {
  dicts: ['sys_normal_disable','sys_dept_group','sys_yes_no','unit_yuan_percent', 'goods_standard_unit'],
  data() {
    return {
      saving:false,
      // 遮罩层
      loading: true,
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
      // 商品表格数据
      serviceList: [],
      // 商品步骤表格数据
      serviceStepList: [],
      serviceVisitList: [],
      serviceGoodsList: [],
      // 商品分类选项
      classOptions: [],
      // 支付方式选项
      paymentOptions: [],
      certOptions: [],
      goodsOptions: [],
      periodUnitOptions: [{
        value: '0',
        label: '天'
      },{
        value: '1',
        label: '次'
      }],
      roundList: [],
      couponList: [],
      // 弹出层标题
      title: "",
      titleStep: '',
      titleVisit: '',
      titleGoods: '',
      // 是否显示弹出层
      open: false,
      openStep: false,
      openVisit: false,
      openGoods: false,
      // -----图片上传参数-------
      imageUrl: '',
      fileList: [],
      dialogVisible: false,
      dialogImageUrl: "",
      noneBtnImg: false,
      // --------------------
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        name: null,
        classId: null,
        status: null
      },
      // 表单参数
      form: {},
      formStep: {},
      formVisit: {},
      formGoods: {},
      curTab: 'base',
      // 弹窗
      serviceDialogVisible:false,
      serviceQueryParams:{
        pageNum: 1,
        pageSize: 10,
        name: null,
        classId: null,
        status: null
      },
      serviceDialogDataTotal: 0,
      serviceForm:{
        serviceDialogDataList: [],
      },
      serviceDialogLoading: false,
      updateDate:''
    };
  },
  created() {
    this.getClassList();
    this.getList();
  },
  methods: {
    costFormatter(row, column) {
      return row.cost + this.selectDictLabel(this.dict.type.unit_yuan_percent, row.costUnit);
    },
    /** 查询商品列表 */
    getList() {
      this.loading = true;
      listService(this.queryParams).then(response => {
        this.serviceList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    /** 查询商品分类列表 */
    getClassList() {
      classList().then(response => {
        this.classOptions = response.data;
      });
    },
    /** 查询支付方式列表 */
    getPaymentList() {
      paymentList().then(response => {
        this.paymentOptions = response.data;
      });
    },
    // 取消按钮
    cancel() {
      this.serviceDialogVisible = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
       
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
    handleAdd() {
      this.serviceDialogVisible = true
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      return 
    },
    /** 提交按钮 */
    submitForm() {
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      return 
    },

    /** 导出按钮操作 */
    handleExport() {
    },
    handleDialogSelectionChange(){},
    getServiceDialogList(){},
    /** 搜索按钮操作 */
    handleServiceDialogQuery() {
      this.serviceQueryParams.pageNum = 1;
      this.getServiceDialogList();
    },
    /** 重置按钮操作 */
    resetServiceDialogQuery() {
      this.resetForm("serviceQueryForm");
      this.handleServiceDialogQuery();
    },
  }
};
</script>

<style>
  .el-input-group__append {
    padding: 0 20px!important;
  }
  .input-with-select .el-input__inner {
    padding-left: 7px;
    padding-right: 16px;
  }
  .input-with-select .el-select {
    width: 40px;
  }
  .input-with-select .el-input__suffix {
    right: -1px;
  }
  .el-upload-list--picture-card .el-upload-list__item {
    width: 108px;
    height: 108px;
  }
  .el-descriptions__title {
    font-size: 13px;
  }
  .goodsForm .input-with-select .el-select {
    width: 95px;
  }
</style>