<template>
  <div>
    <el-table
      :data="dataList"
      style="width: 100%"
      :indent="0"
      class="expand-container"
    >
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-table :data="props.row.children" :show-header="false">
            <el-table-column label="名称" prop="name"> </el-table-column>
            <el-table-column label="显示顺序" prop="orderNum">
            </el-table-column>
            <el-table-column label="支付上限(0为不限制)" prop="maxMoney">
              <template slot-scope="scope">
                <!-- <el-radio v-model="scope.row.maxMoneyFlag" label="N"
                  >不限制</el-radio
                >
                <el-radio v-model="scope.row.maxMoneyFlag" label="Y"
                  >限制</el-radio
                > -->
                <el-input-number
                  size="mini"
                  v-model="scope.row.maxMoney"
                  :precision="2"
                  :step="0.1"
                ></el-input-number>
              </template>
            </el-table-column>
            <el-table-column label="散客是否可用" prop="guestFlag">
              <template slot-scope="scope">
                <el-radio v-model="scope.row.guestFlag" label="Y">是</el-radio>
                <el-radio v-model="scope.row.guestFlag" label="N">否</el-radio>
              </template>
            </el-table-column>
            <el-table-column label="会员是否可用" prop="memberFlag">
              <template slot-scope="scope">
                <el-radio v-model="scope.row.memberFlag" label="Y">是</el-radio>
                <el-radio v-model="scope.row.memberFlag" label="N">否</el-radio>
              </template>
            </el-table-column>
            <el-table-column label="支付业务" prop="desc">
              <template slot-scope="scope">
                <el-checkbox
                  v-model="scope.row.checkedAll"
                  :indeterminate="scope.row.indeterminate"
                  @change="
                    (flag) => handleToggleCheckAllChange(flag, scope.row)
                  "
                  >全选</el-checkbox
                >
                <div style="margin: 15px 0"></div>
                <el-checkbox
                  v-model="scope.row.cashieringFlag"
                  true-label="Y"
                  false-label="N"
                  @change="(flag) => handleCheckedChange(flag, scope.row)"
                >
                  收银</el-checkbox
                >
                <el-checkbox
                  v-model="scope.row.packFlag"
                  true-label="Y"
                  false-label="N"
                  @change="(flag) => handleCheckedChange(flag, scope.row)"
                  >套餐</el-checkbox
                >
                <el-checkbox
                  v-model="scope.row.promFlag"
                  true-label="Y"
                  false-label="N"
                  @change="(flag) => handleCheckedChange(flag, scope.row)"
                  >促销</el-checkbox
                >
                <el-checkbox
                  v-model="scope.row.rechargeFlag"
                  true-label="Y"
                  false-label="N"
                  @change="(flag) => handleCheckedChange(flag, scope.row)"
                  >充值</el-checkbox
                >
                <el-checkbox
                  v-model="scope.row.soldCardFlag"
                  true-label="Y"
                  false-label="N"
                  @change="(flag) => handleCheckedChange(flag, scope.row)"
                  >卖卡</el-checkbox
                >
              </template>
            </el-table-column>
            <el-table-column label="状态" prop="status">
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
                <el-switch
                  v-model="scope.row.status"
                  active-value="0"
                  inactive-value="1"
                  :disabled="props.row.status === '1'"
                ></el-switch>
              </template>
            </el-table-column>
          </el-table>
        </template>
      </el-table-column>
      <el-table-column label="名称" prop="name"> </el-table-column>
      <el-table-column label="显示顺序"> </el-table-column>
      <el-table-column label="支付上限(0为不限制)"> </el-table-column>
      <el-table-column label="散客是否可用"> </el-table-column>
      <el-table-column label="会员是否可用"> </el-table-column>
      <el-table-column label="支付业务"> </el-table-column>
      <el-table-column label="状态" prop="status">
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
          <el-switch
            v-model="scope.row.status"
            active-value="0"
            inactive-value="1"
            @change="(val) => handleCategoryChange(val, scope.row)"
          ></el-switch>
        </template>
      </el-table-column>
    </el-table>

    <el-row type="flex" justify="end" class="page-footer">
      <el-col :span="6" class="text-align-right">
        <el-button @click="cancel" :loading="saving">取 消</el-button>
        <el-button type="primary" @click="submitForm" :loading="saving"
          >提交</el-button
        >
      </el-col>
    </el-row>
  </div>
</template>
<script>
import { getPlanPaymentList, addPlanPayment } from "@/api/store/plan";

/**
 * {
          id: 1,
          cashieringFlag: "Y", // 收银是否可用
          children: [
            {
              id: 11,
              cashieringFlag: "Y", // 收银是否可用
              guestFlag: "Y", // 散客是否可用
              maxMoney: 1000, // 上限金额
              maxMoneyFlag: "Y",
              memberFlag: "Y", // 会员是否可用
              name: "支付宝", //支付方式/分类名称
              packFlag: "", //套餐是否可用
              paymentClass: "", //支付方式分类
              promFlag: "Y", //促销是否可用
              rechargeFlag: "Y", // 充值是否可用
              soldCardFlag: "Y", //卖卡是否可用
              status: "1", //状态
              checkList: [],
              checkAll: false,
            },
          ],
          guestFlag: "Y", // 散客是否可用
          maxMoney: 1000, // 上限金额
          memberFlag: "Y", // 会员是否可用
          name: "现金类", //支付方式/分类名称
          packFlag: "", //套餐是否可用
          paymentClass: "", //支付方式分类
          promFlag: "Y", //促销是否可用
          rechargeFlag: "Y", // 充值是否可用
          soldCardFlag: "Y", //卖卡是否可用
          status: 1, //状态
        }
 */

export default {
  dicts: ["sys_normal_disable"],
  props: ["id"],
  data() {
    return {
      saving: false,
      loading: false,
      storePlanId: null,
      dataList: [],
      queryParams: {
        storePlanId: null,
      },
    };
  },
  created() {
    const { id } = this.$route.query;
    this.storePlanId = this.queryParams.storePlanId = id || this.id || null;

    this.getList();
  },
  methods: {
    getList() {
      getPlanPaymentList(this.queryParams).then((res) => {
        this.dataList = _.map(res.data, (item) => {
          let nextItem = _.assign({}, item, { status: "0" });
          nextItem.children = _.map(nextItem.children, (item) => {
            const checkedCount =
              (item.cashieringFlag === "Y" ? 1 : 0) +
              (item.packFlag === "Y" ? 1 : 0) +
              (item.promFlag === "Y" ? 1 : 0) +
              (item.rechargeFlag === "Y" ? 1 : 0) +
              (item.soldCardFlag === "Y" ? 1 : 0);

            return _.assign(item, {
              checkedAll: checkedCount === 5,
              indeterminate: checkedCount > 0 && checkedCount < 5,
            });
          });

          return nextItem;
        });
      });
    },
    handleCheckedChange(flag, row) {
      const checkedCount =
        (row.cashieringFlag === "Y" ? 1 : 0) +
        (row.packFlag === "Y" ? 1 : 0) +
        (row.promFlag === "Y" ? 1 : 0) +
        (row.rechargeFlag === "Y" ? 1 : 0) +
        (row.soldCardFlag === "Y" ? 1 : 0);

      console.log(checkedCount);

      row.indeterminate = checkedCount > 0 && checkedCount < 5;

      row.checkedAll = checkedCount === 5;

      console.log(row.indeterminate);
    },
    handleToggleCheckAllChange(flag, row) {
      row.indeterminate = false;
      row.cashieringFlag =
        row.packFlag =
        row.promFlag =
        row.rechargeFlag =
        row.soldCardFlag =
          flag ? "Y" : "N";
    },
    submitForm() {
      if (!this.storePlanId) {
        return;
      }

      this.saving = true;

      let payload = _.flatMap(this.dataList, (item) => {
        return _.map(item.children, (child) =>
          _.assign(
            {},
            _.omit(child, ["createBy", "createTime", "updateBy", "updateTime"]),
            { storePlanId: this.storePlanId }
          )
        );
      });

      addPlanPayment(payload)
        .then(() => {
          this.msgSuccess("添加成功");
          this.getList();
        })
        .finally(() => {
          this.saving = false;
        });
    },
    cancel() {
      this.$router.push("/store/plan/plan");
    },
    handleCategoryChange(val, row) {
      _.each(row.children, (item) => {
        item.status = val;
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.expand-container {
  ::v-deep {
    .el-table__expanded-cell[class*="cell"] {
      padding: 0 0 0 48px;
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
