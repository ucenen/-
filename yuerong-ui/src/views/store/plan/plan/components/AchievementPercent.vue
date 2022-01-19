<template>
  <div>
    <el-row :gutter="20" class="mb-22">
      <el-col :span="12">
        <el-card>
          <div slot="header" class="clearfix">
            <span>奖励类型</span>
            <el-button
              style="float: right; padding: 3px 0"
              type="text"
              @click="rewardDialogVisible = true"
              >添加</el-button
            >
          </div>
          <el-table
            v-loading="rewardLoading"
            :data="rewardTypeDataList"
            :height="300"
          >
            <el-table-column
              label="奖罚类型"
              align="center"
              prop="rewardPunishTypeName"
            />
            <el-table-column label="奖罚范围" align="center">
              <span slot-scope="scope" style="color: #f56c6c">
                {{ currencyFormat(scope.row.minMoney) }} ~
                {{ currencyFormat(scope.row.maxMoney) }}
              </span>
            </el-table-column>
            <el-table-column label="备注" align="center" prop="remark">
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
                  @click="handleEditRewardData(scope.row)"
                  >编辑</el-button
                >
                <el-button
                  size="mini"
                  type="text"
                  icon="el-icon-delete"
                  @click="handleDeleteReward(scope.row)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card>
          <div slot="header" class="clearfix">
            <span>业绩成本</span>
            <el-button
              @click="handleAddAchievementData"
              style="float: right; padding: 3px 0"
              type="text"
              >添加</el-button
            >
          </div>
          <el-table
            v-loading="achievementLoading"
            :data="achievementDataList"
            :height="300"
          >
            <el-table-column
              label="服务分类"
              align="center"
              prop="serviceClassName"
            />
            <el-table-column label="判断标准" align="center">
              <span slot-scope="scope" style="color: #f56c6c">
                {{
                  `${scope.row.judgeStandardName}${
                    ' ' + getAchievementJudgeSymbol(scope.row.judgeSymbol) + ' '
                  }${currencyFormat(scope.row.money)}`
                }}
              </span>
            </el-table-column>
            <el-table-column label="员工业绩扣除" align="center">
              <span slot-scope="scope" style="color: #67c23a">
                {{ scope.row.perfDeductionUnit==='1' ? currencyFormat(scope.row.perfDeduction): scope.row.perfDeduction + '%'}}
              </span>
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
                  @click="handleEditAchievementData(scope.row)"
                  >编辑</el-button
                >
                <el-button
                  size="mini"
                  type="text"
                  icon="el-icon-delete"
                  @click="handleDeleteAchievement(scope.row)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
          <pagination
            v-show="achievementTotal > 0"
            :total="achievementTotal"
            :page.sync="achievementParams.pageNum"
            :limit.sync="achievementParams.pageSize"
            @pagination="getAchievementDataList"
          />
        </el-card>
      </el-col>
    </el-row>

    <el-card>
      <div slot="header" class="clearfix">
        <span>提成方案</span>
        <el-button
          style="float: right; padding: 3px 0"
          type="text"
          @click="handleAddPercentData"
          >添加</el-button
        >
      </div>
      <el-table v-loading="percentLoading" :data="percentDataList">
        <el-table-column
          label="方案名称"
          align="center"
          prop="commissionName"
        />
        <el-table-column label="部门职级" align="center" prop="postNames" />
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
              icon="el-icon-delete"
              @click="handleDeletePercent(scope.row)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <pagination
        v-show="percentTotal > 0"
        :total="percentTotal"
        :page.sync="percentParams.pageNum"
        :limit.sync="percentParams.pageSize"
        @pagination="getPercentDataList"
      />
    </el-card>

    <!-- 门店方案奖罚类型 -->
    <el-dialog
      :title="rewardTitle"
      :visible.sync="rewardDialogVisible"
      width="500px"
      append-to-body
      :close-on-click-modal="false"
    >
      <el-form
        ref="formReward"
        :model="formReward"
        :rules="rulesReward"
        label-width="auto"
      >
        <el-input type="hidden" v-model="formReward.id" />
        <el-form-item label="奖罚类型" prop="rewardPunishType">
          <el-select
            v-model="formReward.rewardPunishType"
            placeholder="请选择奖罚类型"
            clearable
            size="small"
          >
            <el-option
              v-for="dict in dict.type.reward_punish_type"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select
            v-model="formReward.status"
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
        <el-form-item label="奖罚最高金额" prop="maxMoney">
          <el-input
            v-model="formReward.maxMoney"
            oninput="value=value.replace(/^\.|[^\d|^\.]/g,'')"
            placeholder="请输入奖罚最高金额"
            size="small"
            maxlength="10"
          >
            <template slot="append">元</template>
          </el-input>
        </el-form-item>
        <el-form-item label="奖罚最低金额" prop="minMoney">
          <el-input
            v-model="formReward.minMoney"
            placeholder="请输入奖罚最低金额"
            oninput="value=value.replace(/^\.|[^\d|^\.]/g,'')"
            size="small"
            maxlength="10"
          >
            <template slot="append">元</template>
          </el-input>
        </el-form-item>

        <el-form-item label="备注" prop="remark">
          <el-input
            v-model="formReward.remark"
            type="textarea"
            placeholder="请输入内容"
            maxlength="300"
            show-word-limit
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitFormReward" :loading="saving"
          >确 定</el-button
        >
        <el-button @click="cancelReward" :loading="saving">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 门店方案业绩成本  -->
    <el-dialog
      :title="achievementTitle"
      :visible.sync="achievementDialogVisible"
      width="800px"
      append-to-body
      :close-on-click-modal="false"
    >
      <el-form
        ref="formAchievement"
        :model="formAchievement"
        :rules="rulesAchievement"
        label-width="auto"
      >
        <el-input type="hidden" v-model="formAchievement.id" />
        <el-form-item label="服务分类" prop="serviceClassId">
          <el-cascader
            v-model="formAchievement.serviceClassId"
            :options="classOptions"
            :props="{ checkStrictly: true }"
            clearable
            size="small"
          ></el-cascader>
        </el-form-item>
        <el-row>
          <el-col :span="10">
            <el-form-item label="判断标准" prop="judgeStandard">
              <el-select
                v-model="formAchievement.judgeStandard"
                placeholder="请选择判断标准"
                clearable
                size="small"
              >
                <el-option
                  v-for="dict in dict.type.performance_judge_standard"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="3">
            <el-form-item prop="judgeSymbol" label-width="10px">
              <el-select
                v-model="formAchievement.judgeSymbol"
                placeholder="请选择符号"
                clearable
                size="small"
              >
                <el-option label=">" :value="1" />
                <el-option label="<" :value="2" />
                <el-option label=">=" :value="3" />
                <el-option label="<=" :value="4" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item prop="money" label-width="10px">
              <el-input
                v-model="formAchievement.money"
                oninput="value=value.replace(/^\.|[^\d|^\.]/g,'')"
                placeholder="请输入金额"
                size="small"
                maxlength="10"
              >
                <template slot="append">元</template>
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="10">
            <el-form-item label="员工业绩扣除金额" prop="perfDeduction">
              <el-input
                v-model="formAchievement.perfDeduction"
                placeholder="请输入员工业绩扣除金额"
                oninput="value=value.replace(/^\.|[^\d|^\.]/g,'')"
                size="small"
                maxlength="10"
              >
                <template slot="append">
                  <el-select prop="perfDeductionUnit" style="width:60px" v-model="formAchievement.perfDeductionUnit"
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
          @click="submitFormAchievement"
          :loading="saving"
          >确 定</el-button
        >
        <el-button @click="cancelFormAchievement" :loading="saving"
          >取 消</el-button
        >
      </div>
    </el-dialog>

    <!-- 门店方案提成  -->
    <!-- <el-dialog
      :visible.sync="percentDialogVisible"
      width="800px"
      append-to-body
      :close-on-click-modal="false"
    >
      <el-form
        ref="formPercent"
        :model="formPercent"
        :rules="rulesPercent"
        label-width="auto"
      >
        <el-row>
          <el-col :span="10">
            <el-form-item label="方案名称" prop="commissionId">
              <el-select
                v-model="formPercent.commissionId"
                placeholder="请选择方案名称"
                clearable
                size="small"
              >
                <el-option
                  v-for="item in commissionMainList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitFormPercent">确 定</el-button>
        <el-button @click="cancelFormPercent">取 消</el-button>
      </div>
    </el-dialog> -->
    <el-dialog
      :visible.sync="percentDialogVisible"
      width="800px"
      append-to-body
      :close-on-click-modal="false"
    >
      <el-form
        :model="commissionQueryParams"
        ref="queryForm"
        :inline="true"
        v-show="showSearch"
        label-width="68px"
      >
        <el-form-item label="方案名称" prop="name">
          <el-input
            v-model="commissionQueryParams.name"
            placeholder="请输入方案名称"
            clearable
            size="small"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select
            v-model="commissionQueryParams.status"
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
            >查询</el-button
          >
          <el-button icon="el-icon-refresh" size="mini" @click="resetQuery"
            >重置</el-button
          >
        </el-form-item>
      </el-form>
      <el-table
        v-loading="commissionLoading"
        :data="commissionMainList"
        @selection-change="handleSelectionChange"
        class="form-table"
        ref="multipleTable"
      >
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column
          label="方案名称"
          align="center"
          prop="name"
          :show-overflow-tooltip="true"
        />

        <el-table-column label="部门职级" align="center" prop="postNames" />
        <el-table-column label="状态" align="center" prop="status">
          <template slot-scope="scope">
            <dict-tag
              :options="dict.type.sys_normal_disable"
              :value="scope.row.status"
            />
          </template>
        </el-table-column>
      </el-table>
      <el-row
        type="flex"
        justify="space-between"
        align="middle"
        class="page-footer"
      >
        <el-col :span="10"> </el-col>
        <el-col :span="6" class="text-align-right">
          <pagination
            v-show="commissionTotal > 0"
            :total="commissionTotal"
            :page.sync="commissionQueryParams.pageNum"
            :limit.sync="commissionQueryParams.pageSize"
            @pagination="getCommissionMainList"
          />
        </el-col>
      </el-row>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitFormPercent" :loading="saving"
          >确 定</el-button
        >
        <el-button @click="cancelFormPercent" :loading="saving"
          >取 消</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {
  getPlanRewardPunishList,
  addPlanRewardPunish,
  updatePlanRewardPunish,
  deletePlanRewardPunish,
  getPlanAchievementPunishList,
  addPlanAchievementPunish,
  updatePlanAchievementPunish,
  deletePlanAchievementPunish,
  getPlanCommissionPunishList,
  addPlanCommissionPunish,
  deletePlanCommissionPunish,
  getPlanServiceCascadeList,
  getCommissionMainListByStorePlanID,
} from "@/api/store/plan";

import { currencyFormat } from "@/utils/currency";

import _ from "lodash";

export default {
  name: "AchievementPercentComponent",
  dicts: [
    "reward_punish_type",
    "sys_normal_disable",
    "performance_judge_standard",
    "unit_yuan_percent"
  ],
  props: ["id"],
  data() {

    return {
      showSearch: false,
      saving: false,
      commissionLoading: false,
      rewardLoading: false,
      rewardDialogVisible: false,
      rewardTypeDataList: [],
      rewardTypeTotal: 0,
      rewardTypeParams: {
        pageNum: 1,
        pageSize: 10,
      },
      achievementDialogVisible: false,
      achievementLoading: false,
      achievementDataList: [],
      achievementTotal: 0,
      achievementParams: {
        pageNum: 1,
        pageSize: 10,
      },
      percentDialogVisible: false,
      percentLoading: false,
      percentDataList: [],
      percentTotal: 0,
      percentParams: {
        pageNum: 1,
        pageSize: 10,
      },
      storePlanId: null,
      formReward: {
        id: null,
        maxMoney: null,
        minMoney: null,
        remark: "",
        rewardPunishType: "",
        status: "",
        storePlanId: 0,
      },
      formAchievement: {
        id: 0,
        judgeStandard: "",
        judgeSymbol: null,
        money: null,
        perfDeduction: null,
        serviceClassId: 0,
        storePlanId: 0,
        perfDeductionUnit: '1',
      },
      formPercent: {
        commissionIDList: [],
      },
      rulesReward: {
        rewardPunishType: [
          { required: true, message: "请选择奖惩类型", trigger: "change" },
        ],
        maxMoney: [
          { required: true, message: "请输入奖罚最高金额", trigger: "blur" },
        ],
        minMoney: [
          { required: true, message: "请输入奖罚最低金额", trigger: "blur" },
        ],
        status: [{ required: true, message: "请选择状态", trigger: "change" }],
      },
      rulesAchievement: {
        serviceClassId: [
          {
            required: true,
            message: "请选择服务分类",
            trigger: "change",
            type: "array",
          },
        ],
        judgeStandard: [
          {
            required: true,
            message: "请选择判断标准",
            trigger: "change",
          },
        ],
        judgeSymbol: [
          {
            required: true,
            message: "请选择符号",
            trigger: "change",
          },
        ],
        money: [
          {
            required: true,
            message: "请输入标准金额",
            trigger: "blur",
          },
        ],
        perfDeduction: [{ required: true, message: "请输入金额", trigger: "blur" }],
      },
      rulesPercent: {
        commissionId: [
          { required: true, message: "请选择方案名称", trigger: "change" },
        ],
      },
      classOptions: [],
      commissionMainList: [],
      commissionQueryParams: {
        pageNum: 1,
        pageSize: 10,
        name: null,
        status: null,
      },
      commissionTotal: 0,
    };
  },
  created() {
    const { id } = this.$route.query;
    this.storePlanId = id || this.id || null;

    this.getRewardTypeList();
    this.getAchievementDataList();
    this.getPercentDataList();
    this.getClassList();
  },
  computed: {
    rewardTitle() {
      return this.formAchievement.id ? "编辑奖罚类型" : "新增奖罚类型";
    },
    achievementTitle() {
      return this.formAchievement.id ? "编辑业绩成本" : "新增业绩成本";
    },
  },
  methods: {
    currencyFormat,
    getRewardTypeList() {
      if (!this.storePlanId) {
        return;
      }

      this.rewardLoading = true;
      getPlanRewardPunishList(this.storePlanId)
        .then((res) => {
          this.rewardTypeDataList = res.rows || [];
        })
        .finally(() => {
          this.rewardLoading = false;
        });
    },
    getPercentDataList() {
      if (!this.storePlanId) {
        return;
      }

      this.percentLoading = true;
      getPlanCommissionPunishList(this.storePlanId)
        .then((res) => {
          this.percentDataList = res.rows || [];
        })
        .finally(() => {
          this.percentLoading = false;
        });
    },
    getAchievementDataList() {
      if (!this.storePlanId) {
        return;
      }

      this.achievementLoading = true;
      getPlanAchievementPunishList(this.storePlanId)
        .then((res) => {
          this.achievementDataList = res.rows || [];
        })
        .finally(() => {
          this.achievementLoading = false;
        });
    },
    getCommissionMainList() {
      this.commissionLoading = true;
      getCommissionMainListByStorePlanID(
        this.storePlanId,
        this.commissionQueryParams
      )
        .then((res) => {
          this.commissionMainList = _.differenceBy(
            res.rows || [],
            _.map(this.percentDataList, (item) =>
              _.assign(item, { id: item.commissionId })
            ),
            "id"
          );
        })
        .finally(() => {
          this.commissionLoading = false;
        });
    },
    handleDelete() {},
    submitFormReward() {
      this.$refs["formReward"].validate((valid) => {
        if (valid) {
          this.saving = true;
          let payload = _.assign({}, this.formReward, {
            storePlanId: this.storePlanId,
          });

          if (payload.id) {
            updatePlanRewardPunish(payload)
              .then(() => {
                this.msgSuccess("更新成功");
                this.getRewardTypeList();
                this.cancelReward();
              })
              .finally(() => {
                this.saving = false;
              });
          } else {
            delete payload.id;
            addPlanRewardPunish(payload)
              .then(() => {
                this.msgSuccess("添加成功");
                this.getRewardTypeList();
                this.cancelReward();
              })
              .finally(() => {
                this.saving = false;
              });
          }
        }
      });
    },
    cancelReward() {
      this.rewardDialogVisible = false;
      this.resetAchievementForm();
    },
    submitFormAchievement() {
      this.$refs["formAchievement"].validate((valid) => {
        if (valid) {
          this.saving = true;
          let payload = _.assign({}, this.formAchievement, {
            storePlanId: this.storePlanId,
          });

          payload.serviceClassId = _.isArray(payload.serviceClassId)
            ? _.last(payload.serviceClassId)
            : payload.serviceClassId;

          if (payload.id) {
            updatePlanAchievementPunish(payload)
              .then(() => {
                this.msgSuccess("更新成功");
                this.getAchievementDataList();
                this.cancelFormAchievement();
              })
              .finally(() => {
                this.saving = false;
              });
          } else {
            delete payload.id;
            addPlanAchievementPunish(payload)
              .then(() => {
                this.msgSuccess("添加成功");
                this.getAchievementDataList();
                this.cancelFormAchievement();
              })
              .finally(() => {
                this.saving = false;
              });
          }
        }
      });
    },
    cancelFormAchievement() {
      this.achievementDialogVisible = false;
      this.resetAchievementForm();
    },
    resetAchievementForm() {
      this.resetForm("formReward");
      this.resetForm("formAchievement");
      this.resetForm("formPercent");

      this.formReward = {
        id: null,
        maxMoney: null,
        minMoney: null,
        remark: "",
        rewardPunishType: "",
        status: "",
        storePlanId: 0,
      };

      this.formAchievement = {
        id: 0,
        judgeStandard: "",
        judgeSymbol: null,
        money: null,
        perfDeduction: null,
        serviceClassId: 0,
        storePlanId: 0,
        perfDeductionUnit: '1'
      };

      this.formPercent = { commissionIDList: [] };
    },
    handleEditRewardData(row) {
      if (!row.id) {
        return;
      }

      this.formReward = _.pick(row, _.keys(this.formReward));

      this.rewardDialogVisible = true;
    },
    handleDeleteReward(row) {
      if (!row.id) {
        return;
      }

      this.$confirm("是否确认删除", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(function () {
          return deletePlanRewardPunish(row.id);
        })
        .then(() => {
          this.getRewardTypeList();
          this.msgSuccess("删除成功");
        })
        .catch(() => {});
    },
    handleEditAchievementData(row) {
      if (!row.id) {
        return;
      }

      this.formAchievement = _.pick(row, _.keys(this.formAchievement));

      let nextServiceClassIDList = [];

      if (!_.isArray(this.formAchievement.serviceClassId)) {
        _.each(this.classOptions, (item) => {
          if (item.value - 0 === this.formAchievement.serviceClassId - 0) {
            nextServiceClassIDList = [item.value];
          }

          _.each(item.children, (subItem) => {
            if (subItem.value - 0 === this.formAchievement.serviceClassId - 0) {
              nextServiceClassIDList = [item.value, subItem.value];
            }

            _.each(subItem.children, (classIDItem) => {
              if (
                classIDItem.value - 0 ===
                this.formAchievement.serviceClassId - 0
              ) {
                nextServiceClassIDList = [
                  item.value,
                  subItem.value,
                  classIDItem.value,
                ];
              }
            });
          });
        });
      }

      this.formAchievement.serviceClassId = _.isArray(
        this.formAchievement.serviceClassId
      )
        ? this.formAchievement.serviceClassId
        : nextServiceClassIDList;

      this.updateClassOptionsDisabledStatus();

      this.achievementDialogVisible = true;
    },
    updateClassOptionsDisabledStatus() {
      // 已经选择的服务分类设置禁用
      const selectedIDList = _.map(this.achievementDataList, "serviceClassId");
      _.each(this.classOptions, (item) => {
        if (_.includes(selectedIDList, item.value - 0)) {
          item.disabled = true;
        }

        _.each(item.children, (subItem) => {
          if (_.includes(selectedIDList, subItem.value - 0)) {
            subItem.disabled = true;
          }

          _.each(subItem.children, (classIDItem) => {
            if (_.includes(selectedIDList, classIDItem.value - 0)) {
              classIDItem.disabled = true;
            }
          });
        });
      });
    },
    handleAddAchievementData() {
      this.updateClassOptionsDisabledStatus();
      this.achievementDialogVisible = true;
    },
    handleDeleteAchievement(row) {
      if (!row.id) {
        return;
      }

      this.$confirm("是否确认删除", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(function () {
          return deletePlanAchievementPunish(row.id);
        })
        .then(() => {
          this.getAchievementDataList();
          this.msgSuccess("删除成功");
        })
        .catch(() => {});
    },
    /** 查询服务分类列表 */
    getClassList() {
      getPlanServiceCascadeList().then((response) => {
        this.classOptions = response.data;
      });
    },
    submitFormPercent() {
      if (!this.formPercent.commissionIDList.length) {
        this.msgError("请先选择要添加的提成方案");
        return;
      }

      this.saving = true;
      let payload = _.map(this.formPercent.commissionIDList, (commissionId) => {
        return {
          storePlanId: this.storePlanId,
          commissionId,
        };
      });

      addPlanCommissionPunish(payload)
        .then(() => {
          this.msgSuccess("添加成功");
          this.getPercentDataList();
          this.cancelFormPercent();
        })
        .finally(() => {
          this.saving = false;
        });

      return;
    },
    handleDeletePercent(row) {
      if (!row.commissionId || !this.storePlanId) {
        return;
      }

      this.$confirm("是否确认删除", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          return deletePlanCommissionPunish(this.storePlanId, row.commissionId);
        })
        .then(() => {
          this.getPercentDataList();
          this.msgSuccess("删除成功");
        })
        .catch(() => {});
    },
    cancelFormPercent() {
      this.percentDialogVisible = false;
      this.resetAchievementForm();
    },
    handleSelectionChange(selection) {
      this.formPercent.commissionIDList = _.map(selection, "id");
    },
    handleAddPercentData() {
      this.getCommissionMainList();
      this.percentDialogVisible = true;
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.commissionQueryParams.pageNum = 1;

      this.getCommissionMainList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    getAchievementJudgeSymbol(value){
      switch(value){
        case 1:
          return '>'
        case 2:
          return '<'
        case 3:
          return '>='
        case 4:
          return '<='
      }

      return ''
    }
  },
};
</script>

<style lang="scss" scoped>
.mb-22 {
  margin-bottom: 22px;
}
</style>
