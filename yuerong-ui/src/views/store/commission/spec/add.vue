<template>
  <div class="app-container">
    <el-form
      :model="baseForm"
      :rules="rules"
      ref="baseForm"
      :inline="true"
      label-width="100px"
    >
      <el-card class="mb-22">
        <div slot="header" class="clearfix">
          <span>基本设置</span>
        </div>

        <el-row :gutter="40">
          <el-col :span="20">
            <el-form-item label="规则名称" prop="name">
              <el-input
                v-model="baseForm.name"
                placeholder="请输入规则名称"
                clearable
                size="small"
                maxlength="100"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="40">
          <el-col :span="20">
            <el-form-item label="适用提成方案" prop="commissionIDList">
              <el-select
                v-model="baseForm.commissionIDList"
                placeholder="请选择适用提成方案"
                multiple
                clearable
                size="small"
              >
                <el-option
                  v-for="dictItem in commissionNormalList"
                  :key="dictItem.id"
                  :label="dictItem.name"
                  :value="dictItem.id"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="40">
          <el-col :span="20">
            <el-form-item label="备注" prop="note">
              <el-input
                v-model="baseForm.note"
                placeholder="请输入"
                clearable
                size="small"
                maxlength="100"
              />
            </el-form-item>
          </el-col>
        </el-row>
      </el-card>
      <el-card class="mb-22">
        <div slot="header" class="clearfix">
          <span>规则设置</span>
        </div>
        <div class="spec-content">
          <el-table
            v-loading="loading"
            :data="baseForm.triggerList"
            class="form-spec-table"
            ref="multipleTable"
          >
            <el-table-column label="序号" prop="id" width="60" fixed>
              <div class="mb-22" slot-scope="scope">
                {{ scope.$index > 0 ? scope.$index : "" }}
              </div>
            </el-table-column>
            <el-table-column
              label="奖励条件"
              prop="trigCriteria"
              min-width="760"
            >
              <template slot-scope="scope">
                <el-form-item
                  :prop="'triggerList.' + scope.$index + '.trigCriteria'"
                  :rules="{
                    validator: validateTrigCriteria,
                    trigger: 'change',
                  }"
                >
                  <el-select
                    v-model="scope.row.trigCriteria"
                    placeholder="请选择"
                    clearable
                    size="small"
                    :disabled="scope.$index > 0"
                  >
                    <el-option
                      v-for="dictItem in dict.type.trig_criteria"
                      :key="dictItem.value"
                      :label="dictItem.label"
                      :value="dictItem.value"
                    />
                  </el-select>
                </el-form-item>
                <el-form-item
                  :prop="'triggerList.' + scope.$index + '.includeStartVal'"
                  :rules="{ validator: validatePrice, trigger: 'change' }"
                >
                  <el-select
                    v-model="scope.row.includeStartVal"
                    placeholder="请选择"
                    clearable
                    size="small"
                  >
                    <el-option label="大于等于" value="1" />
                    <el-option label="大于" value="2" />
                  </el-select>
                </el-form-item>
                <el-form-item
                  :prop="'triggerList.' + scope.$index + '.startVal'"
                  :rules="{ validator: validatePrice, trigger: 'change' }"
                >
                  <el-input
                    v-model="scope.row.startVal"
                    oninput="value=value.replace(/[^\d]/g,'')"
                    placeholder="请输入"
                    size="small"
                    maxlength="10"
                  />
                </el-form-item>
                <el-form-item
                  :prop="'triggerList.' + scope.$index + '.includeEndVal'"
                  :rules="{ validator: validatePrice, trigger: 'change' }"
                >
                  <el-select
                    v-model="scope.row.includeEndVal"
                    placeholder="请选择"
                    clearable
                    size="small"
                    @change="handleIncludeEndChange(scope.row)"
                  >
                    <el-option label="小于等于" value="1" />
                    <el-option label="小于" value="2" />
                    <el-option label="不设置" value="0" />
                  </el-select>
                </el-form-item>
                <el-form-item
                  :prop="'triggerList.' + scope.$index + '.endVal'"
                  :rules="{ validator: validatePrice, trigger: 'change' }"
                >
                  <el-input
                    :disabled="scope.row.includeEndVal === '0'"
                    v-model="scope.row.endVal"
                    oninput="value=value.replace(/[^\d]/g,'')"
                    placeholder="请输入"
                    size="small"
                    :min="scope.row.startVal"
                    maxlength="10"
                  >
                  </el-input>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column
              label="奖励值"
              prop="achieStandIndex"
              min-width="400"
            >
              <template slot-scope="scope">
                <el-form-item
                  :prop="'triggerList.' + scope.$index + '.achieStandIndex'"
                  :rules="{
                    validator: validateAchieStandIndex,
                    trigger: 'change',
                  }"
                >
                  <el-select
                    v-model="scope.row.achieStandIndex"
                    placeholder="请选择"
                    clearable
                    size="small"
                    :disabled="scope.$index > 0"
                  >
                    <el-option
                      v-for="dictItem in dict.type.achie_stand_index"
                      :key="dictItem.value"
                      :label="dictItem.label"
                      :value="dictItem.value"
                    />
                  </el-select>
                </el-form-item>
                <el-form-item
                  :prop="'triggerList.' + scope.$index + '.indexType'"
                  :rules="{ validator: validatePrice, trigger: 'change' }"
                >
                  <el-select
                    v-model="scope.row.indexType"
                    placeholder="请选择"
                    clearable
                    size="small"
                  >
                    <el-option
                      v-for="dictItem in dict.type.index_type"
                      :key="dictItem.value"
                      :label="dictItem.label"
                      :value="dictItem.value"
                    />
                  </el-select>
                </el-form-item>
                <el-form-item
                  :prop="'triggerList.' + scope.$index + '.indexParam'"
                  :rules="{ validator: validatePrice, trigger: 'change' }"
                >
                  <!-- <el-input-number
                    size="mini"
                    v-model="scope.row.indexParam"
                    :precision="2"
                    :step="0.1"
                  ></el-input-number> -->
                  <el-input
                    v-model="scope.row.indexParam"
                    oninput="value=value.replace(/^\.|[^\d|^\.]/g,'')"
                    placeholder="请输入"
                    size="small"
                    maxlength="10"
                    style="vertical-align: middle"
                  >
                    <template slot="append">元</template>
                  </el-input>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column
              label="操作"
              align="center"
              prop="status"
              width="80"
              fixed="right"
            >
              <div slot-scope="scope" class="mb-22">
                <el-button
                  v-if="scope.$index >= 1"
                  size="mini"
                  type="text"
                  icon="el-icon-delete"
                  @click="handleDelete(scope.row)"
                  >删除</el-button
                >
                <el-button
                  v-else
                  size="mini"
                  type="text"
                  icon="el-icon-plus"
                  @click="handleAddNewSpecData(scope.row)"
                  >添加</el-button
                >
              </div>
            </el-table-column>
          </el-table>
        </div>
      </el-card>
    </el-form>
    <el-row type="flex" justify="end" class="page-footer">
      <el-col :span="6" class="text-align-right">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="submitForm">提交</el-button>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import {
  addCommissionSpecInfo,
  getCommissionSpecInfo,
} from "@/api/store/commission/spec";
import { getCommissionMainList } from "@/api/store/commission/index";

import _ from "lodash";

export default {
  name: "CommissionSpecAdd",
  dicts: ["sys_dept_group", "trig_criteria", "index_type", "achie_stand_index"],
  data() {
    return {
      loading: false,
      saving: false,
      commissionNormalList: [],
      baseForm: {
        id: null,
        name: "",
        note: "",
        triggerList: [],
        commissionIDList: [],
      },
      rules: {
        name: [
          {
            required: true,
            message: "请输入规则名称",
            trigger: "blur",
          },
        ],
      },
      hasDefaultData: false,
    };
  },
  created() {
    const { id } = this.$route.query;

    if (id) {
      this.baseForm.id = id;
      this.getSpecCommissionInfo(id);
    } else {
      this.baseForm.triggerList.push({
        trigCriteria: null,
        achieStandIndex: "",
        includeEndVal: null,
        includeStartVal: null,
        indexType: "",
        indexParam: "",
        startVal: null,
        endVal: null,
      });
    }

    this.getCommissionMainList();
  },
  computed: {
    trigCriteria() {
      if (this.baseForm.triggerList.length > 1) {
        return this.baseForm.triggerList[1].trigCriteria;
      } else {
        return "";
      }
    },
    achieStandIndex() {
      if (this.baseForm.triggerList.length > 1) {
        return this.baseForm.triggerList[1].achieStandIndex;
      } else {
        return "";
      }
    },
  },
  methods: {
    getCommissionMainList() {
      getCommissionMainList().then((res) => {
        this.commissionNormalList = _.uniqBy(res.rows, "id");
      });
    },
    getSpecCommissionInfo() {
      const id = this.baseForm.id;

      if (!id) {
        return;
      }

      getCommissionSpecInfo(id).then((res) => {
        const { name, schemeList, achieStandIndex, trigCriteria, triggerList } =
          res.data;
        this.baseForm.name = name;
        this.baseForm.commissionIDList = _.map(schemeList, "id");
        this.baseForm.triggerList = _.map(triggerList || [], (item) => {
          return _.assign(item, {
            trigCriteria,
            achieStandIndex,
          });
        });

        if (!this.hasDefaultData) {
          this.hasDefaultData = true;

          this.baseForm.triggerList.unshift({
            trigCriteria: trigCriteria,
            achieStandIndex: achieStandIndex,
            includeEndVal: null,
            includeStartVal: null,
            indexType: "",
            indexParam: "",
            startVal: null,
            endVal: null,
          });
        }
      });
    },
    handleDelete(row) {},
    validatePrice(rule, value, callback) {
      callback();
    },
    validateTrigCriteria(rule, value, callback) {
      if (!value) {
        callback(new Error("请选择"));
      } else {
        callback();
      }
    },
    validateAchieStandIndex(rule, value, callback) {
      if (!value) {
        callback(new Error("请选择"));
      } else {
        callback();
      }
    },
    handleAddNewSpecData(row) {
      console.log(row);
      this.$refs["baseForm"].validate((valid) => {
        if (valid) {
          this.baseForm.triggerList.push(_.assign({}, row));
          this.baseForm.triggerList[0] = _.assign(
            this.baseForm.triggerList[0],
            {
              includeEndVal: null,
              includeStartVal: null,
              indexType: "",
              indexParam: "",
              startVal: null,
              endVal: null,
            }
          );
        }
      });
    },
    submitForm() {
      this.$refs["baseForm"].validate((valid) => {
        if (valid) {
          if (this.baseForm.triggerList.length <= 1) {
            this.msgError("请先添加规则");
            return;
          }

          this.saving = true;

          let payload = {
            trigCriteria: this.trigCriteria,
            achieStandIndex: this.achieStandIndex,
            schemeList: _.map(this.baseForm.commissionIDList, (id) => {
              const commissionData =
                _.find(this.commissionNormalList, (item) => item.id === id) ||
                {};

              return {
                id,
                name: commissionData.name,
              };
            }),
            id: this.baseForm.id || null,
            triggerList: _.slice(this.baseForm.triggerList, 1),
            name: this.baseForm.name,
          };

          addCommissionSpecInfo(payload)
            .then(() => {
              this.msgSuccess("提交成功");
              this.getCommissionSpecInfo();
            })
            .finally(() => {
              this.saving = false;
            });
        }
      });
    },
    cancel() {},
    handleIncludeEndChange(row) {
      if (row.includeEndVal === 0) {
        row.endVal = null;
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.mb-22 {
  margin-bottom: 22px;
}

.spec-content {
  ::v-deep {
    .el-form-item {
      width: 130px;
    }
  }
}

.page-footer {
  background: #fff;
  margin-top: 20px;
}

.text-align-right {
  text-align: right;
}
</style>
