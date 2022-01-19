<template>
  <div>
    <el-form
      :model="queryParams"
      ref="queryForm"
      :inline="true"
      label-width="68px"
    >
      <el-form-item label="支付方式" prop="paymentId">
        <el-cascader
          v-model="form.paymentId"
          :options="paymentOptions"
          clearable
          size="small"
        ></el-cascader>
      </el-form-item>
      <el-form-item label="提成类别" prop="serviceCommiWay">
        <el-select
          v-model="queryParams.serviceCommiWay"
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
      <el-form-item label="归属品牌" prop="deptId">
        <el-select
          v-model="queryParams.deptId"
          placeholder="请选择归属品牌"
          clearable
          size="small"
        >
          <el-option
            v-for="dict in brandList"
            :key="dict.deptId"
            :label="dict.deptName"
            :value="dict.deptId"
          />
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-button
          type="primary"
          icon="el-icon-search"
          size="mini"
          @click="handleQuery"
          >查询</el-button
        >
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery"
          >重置</el-button
        >
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
          >添加</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button type="success" icon="el-icon-download" plain size="mini"
          >导出</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button type="warning" icon="el-icon-download" plain size="mini"
          >导入</el-button
        >
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="4">
        <el-tree
          class="tree-border"
          :data="classList"
          show-checkbox
          ref="category"
          node-key="id"
          empty-text="加载中，请稍后"
          :props="defaultProps"
          :default-expand-all="true"
        ></el-tree>
      </el-col>
      <el-col :span="20">
        <el-table v-loading="loading" :data="dataList">
          <el-table-column
            label="分类名称"
            align="center"
            prop="name"
            :show-overflow-tooltip="true"
          >
            <template slot-scope="scope">
              {{
                classDataSource[scope.row.categoryId] &&
                classDataSource[scope.row.categoryId].name
              }}
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
          <el-table-column
            label="业绩成本"
            align="center"
            prop="goodsClass.name"
          >
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
          <el-table-column
            label="提成比例"
            align="center"
            prop="goodsClass.name"
          >
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
            width="110"
            fixed="right"
          >
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="text"
                icon="el-icon-edit"
                @click="handleUpdate(scope.row)"
                >编辑</el-button
              >
              <el-button
                size="mini"
                type="text"
                icon="el-icon-delete"
                @click="handleDelete(scope.row)"
                >删除</el-button
              >
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
      <el-form ref="form" :model="form" :rules="rules" label-width="auto">
        <el-row>
          <el-col :span="24">
            <el-form-item prop="categoryIds" label="分类名称">
              <el-cascader
                v-model="form.categoryIds"
                :options="classList"
                clearable
                size="small"
                :props="{
                  multiple: true,
                  checkStrictly: true,
                  label: 'name',
                  value: 'id',
                }"
              ></el-cascader>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item prop="paymentIds" label="支付方式">
              <el-cascader
                v-model="form.paymentIds"
                :options="paymentOptions"
                clearable
                size="small"
                :props="{ multiple: true }"
                collapse-tags
              ></el-cascader>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item prop="serviceCommiWay" label="提成类别">
              <el-select
                v-model="form.serviceCommiWay"
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
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="13">
            <el-form-item prop="perfCalWay" label="业绩成本">
              <el-select
                v-model="form.perfCalWay"
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
        </el-row>
        <el-row>
          <el-col :span="13">
            <el-form-item prop="perfCalProport" label-width="78px">
              <el-input
                v-model="form.perfCalProport"
                placeholder="请输入"
                oninput="value=value.replace(/^\.|[^\d|^\.]/g,'')"
                size="small"
                maxlength="10"
              >
                <template slot="append">
                  <el-select
                    prop="perfCalwayType"
                    style="width: 60px"
                    v-model="form.perfCalwayType"
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
          <el-col :span="13">
            <el-form-item prop="commiCalWay" label="提成比例">
              <el-select
                v-model="form.commiCalWay"
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
        </el-row>
        <el-row>
          <el-col :span="13">
            <el-form-item prop="commiCalProport" label-width="78px">
              <el-input
                v-model="form.commiCalProport"
                placeholder="请输入"
                oninput="value=value.replace(/^\.|[^\d|^\.]/g,'')"
                size="small"
                maxlength="10"
              >
                <template slot="append">
                  <el-select
                    prop="commiCalwayType"
                    style="width: 60px"
                    v-model="form.commiCalwayType"
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
          <el-col :span="13">
            <el-form-item prop="status" label="状态">
              <el-radio-group v-model="form.status">
                <el-radio
                  v-for="dict in dict.type.sys_normal_disable"
                  :key="dict.value"
                  :label="dict.value"
                  >{{ dict.label }}</el-radio
                >
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm" :loading="saving"
          >确 定</el-button
        >
        <el-button @click="cancelForm" :loading="saving">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { listClass } from "@/api/store/base/service_class";
import {
  cascaderList as paymentList,
  listPayment,
} from "@/api/store/base/payment";
import { listBrand } from "@/api/system/dept";
import {
  addCommissionServiceInfo,
  getCommissionServiceList,
} from "@/api/store/commission/index";

import normalizr from "@/utils/normalizr";
import _ from "lodash";

export default {
  dicts: [
    "sys_normal_disable",
    "unit_yuan_percent",
    "service_commi_way",
    "perf_cal_way",
    "commi_cal_way",
    "payment_class",
  ],
  props: ["schemeId", "deptId"],
  data() {
    return {
      loading: false,
      saving: false,
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        commiType: 1,
        schemeId: this.schemeId,
        paymentId: "",
        serviceCommiWay: "",
        status: null,
        deptId: "",
      },
      classList: [],
      classDataSource: {}, //
      paymentList: [],
      paymentOptions: [],
      brandList: [],
      dataList: [],
      defaultProps: {
        children: "children",
        label: "name",
      },
      addTitle: "添加提成",
      dialogVisible: false,
      form: {
        commiType: "1",
        status: null,
        categoryIds: [],
        paymentIds: [],
        serviceCommiWay: "", //提成类别
        commiCalWay: "", // 提成计算方式
        commiCalProport: "", //提成计算比例
        perfCalWay: "", // 业绩计算方式
        perfCalProport: "", // 业绩计算比例
        commiCalwayType: "2",
        perfCalwayType: "2",
      },
      rules: {
        status: [{ required: true, message: "请选择状态", trigger: "change" }],
        categoryIds: [
          {
            required: true,
            type: "array",
            message: "请选择分类",
            trigger: "change",
          },
        ],
        paymentIds: [
          {
            required: true,
            type: "array",
            message: "请选择支付方式",
            trigger: "change",
          },
        ],
        serviceCommiWay: [
          { required: true, message: "请选择提成类别", trigger: "change" },
        ],
        commiCalWay: [
          { required: true, message: "请选择提成比例", trigger: "change" },
        ],
        perfCalWay: [
          { required: true, message: "请选择业绩成本", trigger: "change" },
        ],
        commiCalProport: [
          { required: true, message: "请输入提成比例", trigger: "blur" },
        ],
        perfCalProport: [
          { required: true, message: "请输入", trigger: "blur" },
        ],
      },
    };
  },
  created() {
    this.getServiceClassList();
    this.getPaymentList();
    this.getPaymentOptions();
    this.getBrandList();

    if (this.schemeId) {
      this.queryParams.schemeId = this.schemeId;
      this.getList();
    }
  },
  methods: {
    getList() {
      getCommissionServiceList(this.queryParams).then((res) => {
        this.dataList = res.rows;
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
    handleAdd() {
      if (!this.schemeId) {
        this.msgError("请先提交基本信息");
        return;
      }

      let categoryIds = this.getCheckedKeys();
      if (!categoryIds.length) {
        this.msgError("请先选择类别");
        return;
      }

      let nextServiceClassIDList = [];

      _.each(this.classList, (item) => {
        if (_.includes(categoryIds, item.id)) {
          nextServiceClassIDList.push([item.value]);
        }

        _.each(item.children, (subItem) => {
          if (_.includes(categoryIds, subItem.id)) {
            nextServiceClassIDList.push([item.id, subItem.id]);
          }

          _.each(subItem.children, (classIDItem) => {
            if (_.includes(categoryIds, classIDItem.id)) {
              nextServiceClassIDList.push([
                item.id,
                subItem.id,
                classIDItem.id,
              ]);
            }
          });
        });
      });

      this.form.categoryIds = nextServiceClassIDList;

      this.dialogVisible = true;
    },
    handleUpdate() {},
    handleDelete() {},
    getServiceClassList() {
      this.loading = true;
      listClass().then((response) => {
        this.classList = this.handleTree(response.data, "id", "parentId");
        this.classDataSource = normalizr(response.data);
        this.loading = false;
      });
    },
    cancelForm() {
      this.resetForm("form");
      this.dialogVisible = false;
    },
    submitForm() {
      this.$refs["form"].validate((valid) => {
        if (!valid) {
          return;
        }

        this.saving = true;

        let payload = _.assign(
          {
            schemeId: String(this.schemeId),
            deptId: this.deptId,
            serviceCommiWays: [this.form.serviceCommiWay],
          },
          this.form,
          {
            categoryIds: this.form.categoryIds.reduce((prev, current) => {
              return _.concat(prev, _.last(current));
            }, []),
            paymentIds: this.form.paymentIds.reduce((prev, current) => {
              return _.concat(prev, _.last(current));
            }, []),
          }
        );

        addCommissionServiceInfo(payload)
          .then((res) => {
            this.msgSuccess("提交成功");
            this.getList();
            this.cancelForm();
          })
          .finally(() => {
            this.saving = false;
          });
      });
    },
    getCheckedKeys() {
      return this.$refs.category.getCheckedKeys();
    },
    getPaymentList() {
      listPayment().then((response) => {
        this.paymentList = response.rows;
      });
    },
    /** 查询支付方式列表 */
    getPaymentOptions() {
      paymentList().then((response) => {
        this.paymentOptions = response.data;
      });
    },
    //查询品牌列表
    getBrandList() {
      listBrand().then((response) => {
        this.brandList = response.data;
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.mb-22 {
  margin-bottom: 22px;
}
</style>
