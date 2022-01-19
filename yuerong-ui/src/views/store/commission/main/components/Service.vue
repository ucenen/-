<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      :inline="true"
      v-show="showSearch"
      label-width="68px"
    >
      <el-form-item label="服务编号" prop="code">
        <el-input
          v-model="queryParams.code"
          placeholder="请输入服务编号"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="服务名称" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入服务名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="支付方式" prop="classIdArr">
        <el-cascader
          v-model="queryParams.classIdArr"
          :options="paymentOptions"
          clearable
          size="small"
        ></el-cascader>
      </el-form-item>
      <el-form-item label="提成类别" prop="classIdArr">
        <el-select
          v-model="queryParams.deptCode"
          placeholder="请选择提成类别"
          clearable
          size="small"
        >
          <el-option
            v-for="dict in dict.type.service_commi_way"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
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
      <el-form-item label="服务次" prop="status">
        <el-select
          v-model="queryParams.status"
          placeholder="请选择服务次"
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
          >新增</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          >导出</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          >导入</el-button
        >
      </el-col>
    </el-row>

    <el-table v-loading="loading" :data="serviceList">
      <el-table-column label="服务编号" align="center" prop="code" />
      <el-table-column
        label="服务名称"
        align="center"
        prop="serviceName"
        width="150"
        :show-overflow-tooltip="true"
      />
      <el-table-column label="分类名称" align="center" prop="typeName">
      </el-table-column>
      <el-table-column label="服务次" align="center" prop="serviceNum">
        <template slot-scope="scope">
          <span>{{ scope.row.serviceNum }} 次 </span>
        </template>
      </el-table-column>
      <el-table-column label="支付类型" align="center">
        <template slot-scope="scope">
          <dict-tag
            :options="dict.type.payment_class"
            :value="scope.row.payClassId"
          />
        </template>
      </el-table-column>
      <el-table-column label="支付方式" align="center" prop="payName" />
      <el-table-column label="类别" align="center">
        <template slot-scope="scope">
          <dict-tag
            :options="dict.type.service_commi_way"
            :value="scope.row.serviceCommiWay"
          />
        </template>
      </el-table-column>
      <el-table-column label="业绩成本" align="center" prop="goodsClass.name">
        <el-row slot-scope="scope" type="flex" justify="center">
          <el-col :span="10">
            <dict-tag
              :options="dict.type.perf_cal_way"
              :value="scope.row.perfCalWay"
            />
          </el-col>
          <el-col :span="4" style="text-align: left">{{
            scope.row.perfCalProport
          }}</el-col>
        </el-row>
      </el-table-column>
      <el-table-column label="提成比例" align="center" prop="goodsClass.name">
        <el-row slot-scope="scope" type="flex" justify="center">
          <el-col :span="10"
            ><dict-tag
              :options="dict.type.commi_cal_way"
              :value="scope.row.commiCalWay"
          /></el-col>
          <el-col :span="4">{{ scope.row.commiCalProport }}</el-col>
        </el-row>
      </el-table-column>
      <el-table-column label="状态" align="center" prop="status">
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
            v-hasPermi="['store:service:edit']"
            >编辑</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['store:service:remove']"
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

    <el-dialog
      :visible.sync="serviceDialogVisible"
      append-to-body
      :close-on-click-modal="false"
      width="80%"
    >
      <el-form
        :model="serviceQueryParams"
        ref="serviceQueryForm"
        :inline="true"
        v-show="showSearch"
        label-width="68px"
      >
        <el-form-item label="服务编号" prop="code">
          <el-input
            v-model="serviceQueryParams.code"
            placeholder="请输入服务编号"
            clearable
            size="small"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="服务名称" prop="name">
          <el-input
            v-model="serviceQueryParams.name"
            placeholder="请输入服务名称"
            clearable
            size="small"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="服务分类" prop="classIdArr">
          <el-cascader
            v-model="serviceQueryParams.classIdArr"
            :options="classOptions"
            clearable
            size="small"
          ></el-cascader>
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
          <el-select
            v-model="serviceQueryParams.status"
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
            @click="handleServiceDialogQuery"
            >查询</el-button
          >
          <el-button
            icon="el-icon-refresh"
            size="mini"
            @click="resetServiceDialogQuery"
            >重置</el-button
          >
        </el-form-item>
      </el-form>
      <el-form
        :model="serviceForm"
        ref="serviceForm"
        class="mt-44"
        :inline="true"
      >
        <el-table
          v-loading="serviceDialogLoading"
          :data="serviceForm.serviceList"
          @selection-change="handleDialogSelectionChange"
          class="form-table"
          ref="multipleTable"
        >
          <el-table-column type="selection" width="55" align="center" />
          <el-table-column label="服务图片" align="center">
            <template slot-scope="scope">
              <el-image
                style="width: 50px; height: 50px"
                :src="scope.row.image && scope.row.image.url"
                fit="contain"
              ></el-image>
            </template>
          </el-table-column>
          <el-table-column label="服务编号" align="center" prop="code" />
          <el-table-column
            label="服务名称"
            align="center"
            prop="name"
            width="150"
            :show-overflow-tooltip="true"
          />
          <el-table-column
            label="服务分类"
            align="center"
            prop="serviceClass.name"
          />
          <el-table-column
            label="标准价格"
            align="center"
            prop="standardPrice"
          />
          <el-table-column label="服务次数" prop="storePrice" width="120">
            <template slot-scope="scope">
              <el-form-item
                :prop="'serviceList.' + scope.$index + '.serviceNum'"
                :rules="{ validator: validatePrice, trigger: 'change' }"
              >
                <el-select
                  v-model="scope.row.serviceNum"
                  placeholder="请选择"
                  clearable
                  size="small"
                >
                  <el-option
                    v-for="dict in 10"
                    :key="dict"
                    :label="`${dict}次`"
                    :value="dict"
                  />
                </el-select>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="支付方式" width="140">
            <template slot-scope="scope">
              <el-form-item
                :prop="'serviceList.' + scope.$index + '.paymentIds'"
                :rules="{ validator: validatePrice, trigger: 'change' }"
              >
                <el-cascader
                  v-model="scope.row.paymentIds"
                  :options="paymentOptions"
                  clearable
                  size="small"
                  :props="{ multiple: true }"
                  collapse-tags
                ></el-cascader>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="提成类别" width="120">
            <template slot-scope="scope">
              <el-form-item
                :prop="'serviceList.' + scope.$index + '.serviceCommiWay'"
                :rules="{ validator: validatePrice, trigger: 'change' }"
              >
                <el-select
                  v-model="scope.row.serviceCommiWay"
                  placeholder="请选择提成类别"
                  clearable
                  size="small"
                >
                  <el-option
                    v-for="dict in dict.type.service_commi_way"
                    :key="dict.value"
                    :label="dict.label"
                    :value="dict.value"
                  />
                </el-select>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="设置提成" min-width="280">
            <div slot-scope="scope">
              <el-row>
                <el-col :span="11">
                  <el-form-item
                    :prop="'serviceList.' + scope.$index + '.perfCalWay'"
                    label="业绩成本"
                  >
                    <el-select
                      v-model="scope.row.perfCalWay"
                      placeholder="请选择业绩成本"
                      clearable
                      size="small"
                    >
                      <el-option
                        v-for="dict in dict.type.perf_cal_way"
                        :key="dict.value"
                        :label="dict.label"
                        :value="dict.value"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item
                    :prop="'serviceList.' + scope.$index + '.perfCalProport'"
                  >
                    <el-input
                      v-model="scope.row.perfCalProport"
                      placeholder="请输入"
                      oninput="value=value.replace(/^\.|[^\d|^\.]/g,'')"
                      size="small"
                      maxlength="10"
                      style="vertical-align: middle"
                    >
                      <template slot="append">
                        <el-select
                          prop="perfCalwayType"
                          style="width: 60px"
                          v-model="scope.row.perfCalwayType"
                          placeholder="请选择"
                          size="small"
                        >
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
                <el-col :span="11">
                  <el-form-item
                    :prop="'serviceList.' + scope.$index + '.commiCalWay'"
                    label="提成比例"
                  >
                    <el-select
                      v-model="scope.row.commiCalWay"
                      placeholder="请选择提成比例"
                      clearable
                      size="small"
                    >
                      <el-option
                        v-for="dict in dict.type.commi_cal_way"
                        :key="dict.value"
                        :label="dict.label"
                        :value="dict.value"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item
                    :prop="'serviceList.' + scope.$index + '.commiCalProport'"
                  >
                    <el-input
                      v-model="scope.row.commiCalProport"
                      placeholder="请输入"
                      oninput="value=value.replace(/^\.|[^\d|^\.]/g,'')"
                      size="small"
                      maxlength="10"
                      style="vertical-align: middle"
                    >
                      <template slot="append">
                        <el-select
                          prop="commiCalwayType"
                          style="width: 60px"
                          v-model="scope.row.commiCalwayType"
                          placeholder="请选择"
                          size="small"
                        >
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
            </div>
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
        <el-button @click="cancel" :loading="saving">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  cascaderList as classList,
  listClass,
} from "@/api/store/base/service_class";
import {
  cascaderList as paymentList,
  listPayment,
} from "@/api/store/base/payment";
import { listService } from "@/api/store/base/service";
import {
  getCommissionServiceList,
  addMultipleCommissionService,
} from "@/api/store/commission/index";

import normalizr from "@/utils/normalizr";
import _ from "lodash";

export default {
  dicts: [
    "sys_normal_disable",
    "sys_dept_group",
    "unit_yuan_percent",
    "service_commi_way",
    "perf_cal_way",
    "commi_cal_way",
    "payment_class",
  ],
  props: ["schemeId", "deptId"],
  data() {
    return {
      saving: false,
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
      // 服务表格数据
      serviceList: [],
      // 服务分类选项
      classOptions: [],
      classDataSource: {},
      // 支付方式选项
      paymentOptions: [],
      // --------------------
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        commiType: "2",
        schemeId: "",
        name: null,
        classId: null,
        status: null,
      },
      // 表单参数
      form: {},
      // 弹窗
      serviceDialogVisible: false,
      serviceQueryParams: {
        pageNum: 1,
        pageSize: 10,
        name: null,
        classId: null,
        status: null,
      },
      serviceDialogDataTotal: 0,
      serviceForm: {
        serviceList: [],
      },
      serviceDialogLoading: false,
      updateDate: "",
      paymentList: [],
      selectedFromTableList: [],
    };
  },
  created() {
    if (this.schemeId) {
      this.queryParams.schemeId = this.schemeId;
      this.getList();
    }

    this.getClassList();
    this.getPaymentOptions();
    this.getPaymentList();
    this.getServiceClassList();
  },
  methods: {
    costFormatter(row, column) {
      return (
        row.cost +
        this.selectDictLabel(this.dict.type.unit_yuan_percent, row.costUnit)
      );
    },
    /** 查询服务列表 */
    getList() {
      this.loading = true;
      getCommissionServiceList(this.queryParams).then((response) => {
        this.serviceList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    /** 查询服务分类列表 */
    getClassList() {
      classList().then((response) => {
        this.classOptions = response.data;
      });
    },
    getServiceClassList() {
      listClass().then((response) => {
        this.classDataSource = normalizr(response.data);
      });
    },
    /** 查询支付方式列表 */
    getPaymentOptions() {
      paymentList().then((response) => {
        this.paymentOptions = response.data;
      });
    },
    getPaymentList() {
      listPayment().then((response) => {
        this.paymentList = response.rows;
      });
    },
    // 取消按钮
    cancel() {
      this.serviceDialogVisible = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.serviceForm = {
        serviceList: [],
      };

      this.selectedFromTableList = [];

      this.resetForm("serviceForm");
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
      this.getServiceDialogList();
      this.serviceDialogVisible = true;
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      return;
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["serviceForm"].validate((valid) => {
        if (valid) {
          let payload = _.map(this.selectedFromTableList, (item) => {
            return _.pick(
              _.assign({}, item, {
                paymentIds: item.paymentIds.reduce((prev, current) => {
                  return _.concat(prev, _.last(current));
                }, []),
              }),
              [
                "categoryId",
                "commiCalProport",
                "commiCalWay",
                "commiCalwayType",
                "commiType",
                "paymentIds",
                "perfCalProport",
                "perfCalWay",
                "perfCalwayType",
                "schemeId",
                "serviceCommiWay",
                "serviceNum",
              ]
            );
          });

          addMultipleCommissionService(payload).then((res) => {
            this.msgSuccess("添加成功");
            this.getList();
            this.cancel();
          });
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      return;
    },

    /** 导出按钮操作 */
    handleExport() {},
    handleDialogSelectionChange(selections) {
      this.selectedFromTableList = selections;
    },
    getServiceDialogList() {
      this.serviceDialogLoading = true;
      listService(this.serviceQueryParams).then((response) => {
        const translateDataList = _.map(response.rows, (item) => {
          return _.assign(item, {
            paymentIds: [],
            serviceCommiWay: "", //提成类别
            commiCalWay: "", // 提成计算方式
            commiCalProport: "", //提成计算比例
            perfCalWay: "", // 业绩计算方式
            perfCalProport: "", // 业绩计算比例
            commiCalwayType: "2",
            perfCalwayType: "2",
            commiType: "2",
            schemeId: this.schemeId,
            serviceNum: "1",
            categoryId: item.id,
          });
        });

        this.serviceForm.serviceList = translateDataList;

        this.total = response.total;
        this.serviceDialogLoading = false;
      });
    },
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
    validatePrice(rule, value, callback) {
      callback();
    },
  },
};
</script>

<style>
.el-input-group__append {
  padding: 0 20px !important;
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
