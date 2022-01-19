<template>
  <!--      :disabled="item.id !== '1' && !storePlanId"      -->
  <div class="app-container">
    <el-tabs v-model="activeName" @tab-click="handleSelect" ref="tab">
      <el-tab-pane
        :label="item.name"
        :name="item.id"
        :key="item.id"
        v-for="item in menuList"
      ></el-tab-pane>
    </el-tabs>

    <el-card class="mb-22" v-if="activeIndex === '1'">
      <!-- -->
      <div class="app-container">
        <el-form
          :model="baseForm"
          :rules="rules"
          ref="baseForm"
          :inline="true"
          label-width="100px"
        >
          <el-row :gutter="40">
            <el-col :span="12">
              <el-form-item label="方案名称" prop="name">
                <el-input
                  v-model="baseForm.name"
                  placeholder="请输入方案名称"
                  clearable
                  size="small"
                  maxlength="100"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="进店渠道" prop="enterChannelArr">
                <el-select
                  v-model="baseForm.enterChannelArr"
                  placeholder="进店渠道"
                  multiple
                  clearable
                  size="small"
                >
                  <el-option
                    v-for="dictItem in dict.type.enter_store_channel"
                    :key="dictItem.value"
                    :label="dictItem.label"
                    :value="dictItem.value - 0"
                  />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>

          <div class="mb-22">小票模板设置</div>
          <el-row :gutter="10">
            <el-col :span="12">
              <el-form-item label="服务&商品">
                <el-select
                  v-model="baseForm.receiptClass1"
                  placeholder="服务商品"
                  clearable
                  size="small"
                >
                  <el-option
                    v-for="item in receiptDataList.filter(
                      (item) => item.receiptClass === 1
                    )"
                    :key="item.id"
                    :value="item.id"
                    :label="item.name"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="售卡">
                <el-select
                  v-model="baseForm.receiptClass3"
                  placeholder="服务商品"
                  clearable
                  size="small"
                >
                  <el-option
                    v-for="item in receiptDataList.filter(
                      (item) => item.receiptClass === 3
                    )"
                    :key="item.id"
                    :value="item.id"
                    :label="item.name"
                  />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="10">
            <el-col :span="12">
              <el-form-item label="充值">
                <el-select
                  v-model="baseForm.receiptClass2"
                  placeholder="充值"
                  clearable
                  size="small"
                >
                  <el-option
                    v-for="item in receiptDataList.filter(
                      (item) => item.receiptClass === 2
                    )"
                    :key="item.id"
                    :value="item.id"
                    :label="item.name"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="套餐">
                <el-select
                  v-model="baseForm.receiptClass4"
                  placeholder="套餐"
                  clearable
                  size="small"
                >
                  <el-option
                    v-for="item in receiptDataList.filter(
                      (item) => item.receiptClass === 4
                    )"
                    :key="item.id"
                    :value="item.id"
                    :label="item.name"
                  />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
    </el-card>
    <el-row :gutter="20" class="mb-22" v-if="activeIndex === '1'">
      <el-col :span="12">
        <el-card>
          <div slot="header" class="clearfix">
            <span>部门职级</span>
            <el-button
              @click="handleAddDepartment"
              style="float: right; padding: 3px 0"
              type="text"
              >添加</el-button
            >
          </div>
          <el-table
            v-loading="loading"
            :data="departmentDataList"
            :height="300"
          >
            <el-table-column label="岗位编号" align="center" prop="postCode" />
            <el-table-column label="所属部门" align="center">
              <template slot-scope="scope">
                <dict-tag
                  :options="dict.type.sys_dept_group"
                  :value="scope.row.group"
                />
              </template>
            </el-table-column>
            <el-table-column label="岗位名称" align="center" prop="postName">
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
                  icon="el-icon-delete"
                  @click="handleDeletePostInfo(scope.row)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
          <!-- <pagination
            v-show="departmentTotal > 0"
            :total="departmentTotal"
            :page.sync="departmentParams.pageNum"
            :limit.sync="departmentParams.pageSize"
            @pagination="getDepartmentList"
          /> -->
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card>
          <div slot="header" class="clearfix">
            <span>轮牌</span>
            <el-button
              @click="handleAddRoundData"
              style="float: right; padding: 3px 0"
              type="text"
              >添加</el-button
            >
          </div>
          <el-table v-loading="loading" :data="roundDataList" :height="300">
            <el-table-column label="部门" align="center" prop="id" />
            <el-table-column label="轮牌名称" align="center" prop="name" />
            <el-table-column label="关联职位" align="center">
              <template slot-scope="scope">
                <dict-tag
                  :options="dict.type.sys_dept_group"
                  :value="scope.row.dept"
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
                  icon="el-icon-delete"
                  @click="handleDeleteRoundInfo(scope.row)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
          <!-- <pagination
            v-show="roundTotal > 0"
            :total="roundTotal"
            :page.sync="roundParams.pageNum"
            :limit.sync="roundParams.pageSize"
            @pagination="getRoundDataList"
          /> -->
        </el-card>
      </el-col>
    </el-row>

    <el-card title="参数配置" class="mb-22" v-if="activeIndex === '1'">
      <el-row>
        <el-col :span="12">
          <el-row type="flex" justify="space-between" class="mb-10">
            <el-col :span="20" class="form-label"
              >充值是否重新计算账户截至日起按:</el-col
            >
            <el-col :span="4"
              ><el-switch
                v-model="baseForm.paramVo.rechargeRecalcEnddate"
                :active-value="1"
                :inactive-value="0"
              >
              </el-switch
            ></el-col>
          </el-row>
          <el-row type="flex" justify="space-between" class="mb-10">
            <el-col :span="20" class="form-label"
              >点客/非点客是否严格按照预约、预开单执行:</el-col
            >
            <el-col :span="4"
              ><el-switch
                v-model="baseForm.paramVo.observeReservePreorder"
                :active-value="1"
                :inactive-value="0"
              >
              </el-switch
            ></el-col>
          </el-row>
          <el-row type="flex" justify="space-between" class="mb-10">
            <el-col :span="20" class="form-label"
              >服务关联商品消耗是否必选SKU:</el-col
            >
            <el-col :span="4"
              ><el-switch
                v-model="baseForm.paramVo.goodsSkuRequired"
                :active-value="1"
                :inactive-value="0"
              >
              </el-switch
            ></el-col>
          </el-row>
          <el-row type="flex" justify="space-between" class="mb-10">
            <el-col :span="20" class="form-label"
              >套餐消耗是否可见对应金额:</el-col
            >
            <el-col :span="4"
              ><el-switch
                v-model="baseForm.paramVo.packShowMoney"
                :active-value="1"
                :inactive-value="0"
              >
              </el-switch
            ></el-col>
          </el-row>
          <el-row type="flex" justify="space-between" class="mb-10">
            <el-col :span="20" class="form-label"
              >是否可手工识别会员身份:</el-col
            >
            <el-col :span="4"
              ><el-switch
                v-model="baseForm.paramVo.manualIdentificationMember"
                :active-value="1"
                :inactive-value="0"
              >
              </el-switch
            ></el-col>
          </el-row>
          <el-row type="flex" justify="space-between" class="mb-10">
            <el-col :span="20" class="form-label"
              >修改应收额是否需要选择修改原因:</el-col
            >
            <el-col :span="4"
              ><el-switch
                v-model="baseForm.paramVo.changeReceivableRequiredReason"
                :active-value="1"
                :inactive-value="0"
              >
              </el-switch
            ></el-col>
          </el-row>
        </el-col>
        <el-col :span="12">
          <el-row class="mb-10 form-label">
            <el-col class="mb-10 form-label" :span="12"
              >会员价享受优惠价格:
              <el-checkbox
                :indeterminate="isMemberIndeterminate"
                v-model="memberPreferentialPriceCheckedAll"
                @change="handleMemberPreferentialCheckAllChange"
                >全选</el-checkbox
              ></el-col
            >
            <el-col :span="24" :offset="3">
              <el-checkbox-group
                v-model="baseForm.paramVo.memberPreferentialPrice"
                @change="handleMemberPreferentialCheckedChange"
              >
                <el-checkbox
                  v-for="dictItem in dict.type
                    .store_param_member_preferential_price"
                  :key="dictItem.value"
                  :label="dictItem.value"
                  >{{ dictItem.label }}</el-checkbox
                >
              </el-checkbox-group>
            </el-col>
          </el-row>
          <el-row class="mb-10 form-label">
            <el-col class="mb-10 form-label" :span="12"
              >需要客人确认订单才可保存收款:
              <el-checkbox
                :indeterminate="isReceiptIndeterminate"
                v-model="saveReceiptNeedConfirmCheckedAll"
                @change="handleReceiptCheckAllChange"
                >全选</el-checkbox
              ></el-col
            >
            <el-col :span="24" :offset="3">
              <el-checkbox-group
                v-model="baseForm.paramVo.saveReceiptNeedConfirm"
                @change="handleReceiptCheckedChange"
              >
                <el-checkbox
                  v-for="dictItem in dict.type.store_param_need_confirm_order"
                  :key="dictItem.value"
                  :label="dictItem.value"
                  >{{ dictItem.label }}</el-checkbox
                >
              </el-checkbox-group>
            </el-col>
          </el-row>
          <el-row class="mb-10 form-label">
            <el-col :span="4">销售业绩输入方式: </el-col>
            <el-col :span="18">
              <el-radio-group
                v-model="baseForm.paramVo.salesPerformanceInputType"
              >
                <el-radio
                  v-for="dictItem in dict.type
                    .store_param_performance_input_type"
                  :key="dictItem.value"
                  :label="dictItem.value"
                  >{{ dictItem.label }}</el-radio
                >
              </el-radio-group>
              <!-- <el-checkbox-group
                v-model="baseForm.paramVo.salesPerformanceInputType"
                @change="handleCheckedChange"
              >
                <el-checkbox label="全额">全额</el-checkbox>
                <el-checkbox label="比例">比例</el-checkbox>
                <el-checkbox label="金额&比例">金额&比例</el-checkbox>
                <el-checkbox label="自动平均分配">自动平均分配</el-checkbox>
              </el-checkbox-group> -->
            </el-col>
          </el-row>
          <el-row class="mb-10 form-label">
            <el-col :span="4">销售业绩人数上限: </el-col>
            <el-col :span="18">
              <el-select
                v-model="baseForm.paramVo.salesPerformanceLimitNum"
                placeholder="收入上限"
                clearable
                size="small"
              >
                <el-option
                  v-for="item in 10"
                  :key="item"
                  :label="item"
                  :value="item"
                />
              </el-select>
            </el-col>
          </el-row>
          <el-row class="mb-10 form-label">
            <el-col class="mb-10 form-label" :span="4"
              >账务日期分割时间点:
            </el-col>
            <el-col :span="10">
              <el-time-picker
                v-model="baseForm.billingTimeDate"
                placeholder="时间点"
                @change="handleTimeChange"
              >
              </el-time-picker>
            </el-col>
            <el-col :span="24" :offset="3">
              <el-radio-group v-model="baseForm.paramVo.billingTimeType">
                <el-radio :label="0">当日</el-radio>
                <el-radio :label="1">次日</el-radio>
              </el-radio-group>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
    </el-card>

    <el-row
      type="flex"
      justify="end"
      class="page-footer"
      v-if="activeIndex === '1'"
    >
      <el-col :span="6" class="text-align-right">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="submitForm">提交</el-button>
      </el-col>
    </el-row>

    <template v-if="activeIndex === '2'"
      ><StoreComponent :id="storePlanId"
    /></template>
    <template v-if="activeIndex === '3'"
      ><ServiceComponent :id="storePlanId"
    /></template>
    <template v-if="activeIndex === '4'"
      ><GoodsComponent :id="storePlanId"
    /></template>
    <template v-if="activeIndex === '5'"
      ><PackComponent :id="storePlanId"
    /></template>
    <template v-if="activeIndex === '6'"
      ><PaymentMethodComponent :id="storePlanId"
    /></template>
    <template v-if="activeIndex === '7'"
      ><AchievementPercentComponent :id="storePlanId"
    /></template>

    <!-- 方案添加部门职级 -->
    <el-dialog
      title="选择部门职级"
      :visible.sync="isDepartmentVisible"
      width="500px"
      append-to-body
      :close-on-click-modal="false"
    >
      <el-form
        ref="departmentForm"
        :model="departmentForm"
        :rules="departmentRules"
        label-width="100px"
      >
        <el-divider content-position="left">职位选择</el-divider>
        <el-form-item label="选择部门">
          <el-select v-model="departmentForm.dept" @change="deptSelectChange">
            <el-option
              v-for="dict in dict.type.sys_dept_group"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="选择职位" prop="postIds">
          <el-select
            v-model="departmentForm.postIds"
            multiple
            placeholder="请选择"
            style="width: 100%"
          >
            <el-option
              v-for="dict in postOptions"
              :key="dict.postId"
              :label="dict.postName"
              :value="dict.postId"
              :disabled="getPostItemDisabledStatus(dict.postId)"
              >{{ dict.postName }}
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleDepartmentConfirm"
          >确 定</el-button
        >
        <el-button @click="handleCloseDepartmentDialog">取 消</el-button>
      </div>
    </el-dialog>

    <el-dialog
      title="选择轮牌"
      :visible.sync="isRoundVisible"
      width="800px"
      append-to-body
      :close-on-click-modal="false"
    >
      <el-table
        v-loading="roundLoading"
        :data="translateRoundList"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="部门" align="center">
          <template slot-scope="scope">
            <dict-tag
              :options="dict.type.sys_dept_group"
              :value="scope.row.dept"
            />
          </template>
        </el-table-column>
        <el-table-column label="轮牌名称" align="center" prop="name" />
        <el-table-column
          label="关联职位"
          align="center"
          :show-overflow-tooltip="true"
          prop="postName"
        >
        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleRoundConfirm" :loading="saving"
          >确 定</el-button
        >
        <el-button @click="handleCloseRoundDialog" :loading="saving"
          >取 消</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import GoodsComponent from "@/views/store/plan/plan/components/Goods.vue";
import StoreComponent from "@/views/store/plan/plan/components/Store.vue";
import ServiceComponent from "@/views/store/plan/plan/components/Service.vue";
import PaymentMethodComponent from "@/views/store/plan/plan/components/PaymentMethod.vue";
import AchievementPercentComponent from "@/views/store/plan/plan/components/AchievementPercent.vue";
import PackComponent from "@/views/store/plan/plan/components/Pack.vue";

import {
  getPlanInfo,
  addBasePlanInfo,
  updateBasePlanInfo,
  getPlanPostList,
  addPlanPostInfo,
  deletePlanPostInfo,
  getPlanRoundList,
  addPlanRoundInfo,
  deletePlanRoundInfo,
  listReceipt,
} from "@/api/store/plan";
import { listPostByDept } from "@/api/system/post";
import { listRound } from "@/api/store/base/round_rule";

import _ from "lodash";
import dayjs from "dayjs";

export default {
  name: "PlanAdd",
  dicts: [
    "sys_dept_group",
    "enter_store_channel",
    "store_param_member_preferential_price",
    "store_param_need_confirm_order",
    "store_param_performance_input_type",
  ],
  components: {
    GoodsComponent,
    ServiceComponent,
    PaymentMethodComponent,
    AchievementPercentComponent,
    StoreComponent,
    PackComponent,
  },
  data() {
    return {
      loading: false,
      saving: false,
      isDepartmentVisible: false,
      isRoundVisible: false,
      receiptDataList: [], // 全部小票模板数据
      // 基础配置
      baseForm: {
        id: null,
        deptCount: 0, // 方案中包含的门店数量
        deptNameList: [], // 方案中包含的门店（名称）列表
        enterChannel: "",
        enterChannelArr: [], // 进店渠道
        name: "", // 方案名称
        paramVo: {
          billingTime: "", // 账务日期分割时间，格式：HH:mm:ss
          billingTimeType: -1, // 账务日期分割时间点类型（0当日，1次日）
          changeReceivableRequiredReason: 0, // 修改应收额是否需要选择修改原因（0否，1是）
          goodsSkuRequired: 0, //服务关联商品消耗是否必选SKU（0否，1是）
          manualIdentificationMember: 0, //是否可手工识别会员身份（0否，1是）
          memberPreferentialPrice: [], //会员价享受优惠价格
          observeReservePreorder: 0, //点客/非点客是否严格按照预约、预开单执行（0否，1是）
          packShowMoney: 0, //套餐消耗是否可见对应金额（0否，1是）
          rechargeRecalcEnddate: 0, //充值是否重新计算账户截止日期（0否，1是）
          salesPerformanceInputType: null, //销售业绩输入方式
          salesPerformanceLimitNum: null, // 销售业绩人数上限
          saveReceiptNeedConfirm: [], // 需要客人确认订单才可保存收款
        }, // 细节参数
        postList: [], // 岗位职级配置(新增方案时同方案一起保存)
        receiptList: [], // 小票模板配置(新增方案时同方案一起保存)
        roundList: [], // 轮牌配置(新增方案时同方案一起保存)
        status: undefined,
        // 方案选择的小票模板数据
        receiptClass1: null, // 收银
        receiptClass2: null, // 充值
        receiptClass3: null, // 卖卡
        receiptClass4: null, // 套餐
        billingTimeDate: null,
      },
      activeIndex: "1",
      activeName: "1",
      menuList: [
        {
          id: "1",
          name: "基础配置",
        },
        {
          id: "2",
          name: "选择门店",
        },
        {
          id: "3",
          name: "选择服务",
        },
        {
          id: "4",
          name: "选择商品",
        },
        {
          id: "5",
          name: "选择套餐",
        },
        {
          id: "6",
          name: "支付方式配置",
        },
        {
          id: "7",
          name: "业绩提成",
        },
      ],
      switchValue: false,
      isReceiptIndeterminate: true,
      isMemberIndeterminate: true,
      memberPreferentialPriceCheckedAll: true,
      saveReceiptNeedConfirmCheckedAll: false,
      checkedList: [],
      time: new Date(2021, 12, 21, 18, 40),
      departmentTotal: 10,
      roundTotal: 10,
      roundLoading: false,
      roundList: [], // 轮牌列表数据
      roundSelectedDataList: [], // 选中的轮牌数据
      roundDataList: [], // 门店方案中的轮牌数据
      roundParams: {
        pageNum: 1,
        pageSize: 10,
      },
      departmentDataList: [],
      departmentParams: {
        pageNum: 1,
        pageSize: 10,
      },
      postOptions: [],
      departmentForm: {
        dept: "",
        postIds: [],
      },
      rules: {
        name: [
          { required: true, message: "方案名称不能为空", trigger: "blur" },
        ],
        enterChannelArr: [
          {
            type: "array",
            required: true,
            message: "请至少选择一个渠道",
            trigger: "change",
          },
        ],
        receiptClass1: [
          {
            required: true,
            message: "请选择",
            trigger: "change",
          },
        ],
        receiptClass2: [
          {
            required: true,
            message: "请选择",
            trigger: "change",
          },
        ],
        receiptClass3: [
          {
            required: true,
            message: "请选择",
            trigger: "change",
          },
        ],
        receiptClass4: [
          {
            required: true,
            message: "请选择",
            trigger: "change",
          },
        ],
      },
      departmentRules: {
        dept: [{ required: true, message: "请选择部门", trigger: "change" }],
        postIds: [
          {
            type: "array",
            required: true,
            message: "请至少选择一个职位",
            trigger: "change",
          },
        ],
      },
      storePlanId: "",
    };
  },
  created() {
    const { id } = this.$route.query;
    this.storePlanId = this.baseForm.id = id || null;

    if (this.baseForm.id) {
      this.getPlanInfo();
      this.getDepartmentList(this.baseForm.id);
      this.getRoundDataList(this.baseForm.id);
    }

    this.getReceiptList();
  },
  computed: {
    translateRoundList() {
      return _.differenceBy(this.roundList, this.roundDataList, "id");
    },
  },
  methods: {
    // 获取小票模板
    getReceiptList() {
      listReceipt({}).then((res) => {
        this.receiptDataList = res.rows || [];
      });
    },
    getDepartmentList(planID) {
      getPlanPostList(planID).then((res) => {
        this.departmentDataList = res.rows || [];
      });
    },
    getRoundDataList(planID) {
      getPlanRoundList(planID).then((res) => {
        this.roundDataList = res.rows || [];
      });
    },
    /** 获取轮牌列表 */
    getAllRoundList() {
      this.roundLoading = true;
      listRound().then((response) => {
        this.roundList = response.rows;
        this.roundLoading = false;
      });
    },
    // 表单重置
    reset() {
      this.baseForm = {
        id: undefined,
        name: undefined,
        remark: undefined,
      };
      this.resetForm("form");
    },
    handleSelect(tab) {
      // 判断是否有门店方案ID,没有的话禁止切换
      if (!this.storePlanId && this.activeIndex !== tab.name) {
        this.msgError("请先保存门店方案基础配置");
        this.$refs["tab"].$data.currentName = this.activeName =
          this.activeIndex;

        return;
      }

      this.activeIndex = tab.name;
    },
    handleMenuSelect(key) {
      // 判断是否有门店方案ID,没有的话禁止切换
      if (!this.storePlanId && this.activeIndex !== key) {
        this.msgError("请先保存门店方案基础配置");
        return;
      }

      this.activeIndex = key;
    },
    handleMemberPreferentialCheckAllChange(val) {
      this.baseForm.paramVo.memberPreferentialPrice = val
        ? _.map(
            this.dict.type.store_param_member_preferential_price,
            (item) => item.value
          )
        : [];
      this.isMemberIndeterminate = false;
    },
    handleMemberPreferentialCheckedChange(value) {
      let checkedCount = value.length;
      this.memberPreferentialPriceCheckedAll =
        checkedCount ===
        this.dict.type.store_param_member_preferential_price.length;
      this.isMemberIndeterminate =
        checkedCount > 0 &&
        checkedCount <
          this.dict.type.store_param_member_preferential_price.length;
    },
    handleReceiptCheckAllChange(val) {
      this.baseForm.paramVo.saveReceiptNeedConfirm = val
        ? _.map(
            this.dict.type.store_param_need_confirm_order,
            (item) => item.value
          )
        : [];
      this.isReceiptIndeterminate = false;
    },
    handleReceiptCheckedChange(value) {
      let checkedCount = value.length;
      this.saveReceiptNeedConfirmCheckedAll =
        checkedCount === this.dict.type.store_param_need_confirm_order.length;
      this.isReceiptIndeterminate =
        checkedCount > 0 &&
        checkedCount < this.dict.type.store_param_need_confirm_order.length;
    },
    submitForm() {
      this.$refs["baseForm"].validate((valid) => {
        let payload = _.omit(this.baseForm, [
          "receiptClass1",
          "receiptClass2",
          "receiptClass3",
          "receiptClass4",
          "billingTimeDate",
        ]);

        if (!!payload.id) {
          payload.receiptList = [
            {
              receiptId: this.baseForm.receiptClass1,
              storePlanId: payload.id,
            },
            {
              receiptId: this.baseForm.receiptClass2,
              storePlanId: payload.id,
            },
            {
              receiptId: this.baseForm.receiptClass3,
              storePlanId: payload.id,
            },
            {
              receiptId: this.baseForm.receiptClass4,
              storePlanId: payload.id,
            },
          ];

          payload.postList = _.map(this.departmentDataList, (item) => {
            return {
              postId: item.postId,
              storePlanId: payload.id,
            };
          });

          payload.roundList = _.map(this.roundDataList, (item) => {
            return {
              roundId: item.id,
              storePlanId: payload.id,
            };
          });
        } else {
          payload.receiptList = [
            {
              receiptId: this.baseForm.receiptClass1,
            },
            {
              receiptId: this.baseForm.receiptClass2,
            },
            {
              receiptId: this.baseForm.receiptClass3,
            },
            {
              receiptId: this.baseForm.receiptClass4,
            },
          ];

          payload.postList = _.map(this.departmentDataList, (item) => {
            return {
              postId: item.postId,
            };
          });

          payload.roundList = _.map(this.roundDataList, (item) => {
            return {
              roundId: item.id,
            };
          });
        }

        payload.paramVo.billingTime = this.parseTime(
          this.baseForm.billingTimeDate,
          "{h}:{i}:{s}"
        );

        if (valid) {
          this.saving = true;
          if (!!payload.id) {
            updateBasePlanInfo(payload)
              .then((response) => {
                this.saving = false;
                this.msgSuccess("修改成功");
              })
              .finally(() => {
                this.saving = false;
              });
          } else {
            addBasePlanInfo(payload)
              .then((response) => {
                this.storePlanId = this.baseForm.id = response.data;
                this.saving = false;
                this.msgSuccess("新增成功");
              })
              .finally(() => {
                this.saving = false;
              });
          }
        }
      });
    },
    handleDeletePostInfo(row) {
      if (!this.baseForm.id || !row.postId) {
        return;
      }

      deletePlanPostInfo(this.baseForm.id, row.postId).then((res) => {
        this.getDepartmentList(this.baseForm.id);
      });
    },
    handleDeleteRoundInfo(row) {
      if (!this.baseForm.id || !row.id) {
        return;
      }

      deletePlanRoundInfo(this.baseForm.id, row.id).then((res) => {
        this.getRoundDataList(this.baseForm.id);
      });
    },
    cancel() {
      this.$router.push("/store/plan/plan");
    },
    getPlanInfo() {
      if (!this.baseForm.id) {
        return;
      }

      getPlanInfo(this.baseForm.id).then((res) => {
        this.baseForm = _.assign(
          this.baseForm,
          _.pick(res.data, _.keys(this.baseForm))
        );
        this.baseForm.billingTimeDate = new Date(
          dayjs().format("YYYY-MM-DD") + " " + this.baseForm.paramVo.billingTime
        );

        this.baseForm.receiptClass1 =
          this.baseForm.receiptList[0]?.receiptId || "";
        this.baseForm.receiptClass2 =
          this.baseForm.receiptList[1]?.receiptId || "";
        this.baseForm.receiptClass3 =
          this.baseForm.receiptList[2]?.receiptId || "";
        this.baseForm.receiptClass4 =
          this.baseForm.receiptList[3]?.receiptId || "";
      });
    },
    handleTimeChange() {},
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
    handleDepartmentConfirm() {
      this.$refs["departmentForm"].validate((valid) => {
        if (valid) {
          const addDepartmentData = _.map(
            this.departmentForm.postIds,
            (postId) => {
              const postData = _.find(
                this.postOptions,
                (item) => item.postId === postId
              );

              return {
                id: postId,
                postId: postId,
                dept: this.departmentForm.dept,
                group: this.departmentForm.dept,
                postCode: postData.postCode,
                postName: postData.postName,
              };
            }
          );

          this.departmentDataList = _.uniqBy(
            _.concat(this.departmentDataList, addDepartmentData),
            (item) => item.postId
          );
          // 编辑的话，单独请求接口
          if (!!this.baseForm.id) {
            //是否要过滤已经有的数据
            const actions = _.map(addDepartmentData, (item) => {
              return addPlanPostInfo({
                postId: item.postId,
                storePlanId: this.baseForm.id,
              });
            });

            Promise.all(actions).then((res) => {
              console.log(res);
            });
          }

          console.log(this.departmentDataList);

          this.handleCloseDepartmentDialog();
        }
      });
    },
    handleCloseDepartmentDialog() {
      this.isDepartmentVisible = false;
      this.departmentForm = {
        dept: "",
        postIds: [],
      };
      this.resetForm("departmentForm");
    },
    handleAddRoundData() {
      this.isRoundVisible = true;
      this.getAllRoundList();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.roundSelectedDataList = selection;
    },
    handleRoundConfirm() {
      this.roundDataList = _.uniqBy(
        _.concat(this.roundDataList, this.roundSelectedDataList),
        (item) => item.id
      );

      // 编辑的话，单独请求接口
      if (!!this.baseForm.id) {
        //是否要过滤已经有的数据
        const actions = _.map(this.roundSelectedDataList, (item) => {
          return addPlanRoundInfo({
            roundId: item.id,
            storePlanId: this.baseForm.id,
          });
        });

        Promise.all(actions).then((res) => {
          console.log(res);
        });
      }

      this.isRoundVisible = false;
    },
    handleCloseRoundDialog() {
      this.isRoundVisible = false;
    },
    getPostItemDisabledStatus(postId) {
      if (!postId) {
        return;
      }

      return (
        _.findIndex(this.departmentDataList, (item) => item.postId === postId) >
        -1
      );
    },
    handleAddDepartment() {
      this.isDepartmentVisible = true
    }
  },
};
</script>
<style lang="scss" scoped>
.mb-22 {
  margin-bottom: 22px;
}

.mb-10 {
  margin-bottom: 10px;
}

.form-label {
  font-size: 14px;
  color: #606266;
  line-height: 36px;
}

.page-footer {
  background: #fff;
  margin-top: 20px;
}

.text-align-right {
  text-align: right;
}
</style>
