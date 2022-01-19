<template>
  <div class="app-container after-sale-detail">
    <div class="after-sale-detail__header">
      <span>售后申请</span>
      <div>
        <el-button type="primary" size="mini" @click="openDialog"
          >审核</el-button
        >
      </div>
    </div>
    <el-card class="after-sale-detail__card" header="售后信息">
      <el-descriptions :column="2">
        <el-descriptions-item label="售后类型">退款</el-descriptions-item>
        <el-descriptions-item label="审核状态">待提交</el-descriptions-item>
        <el-descriptions-item label="会员编号">001</el-descriptions-item>
        <el-descriptions-item label="会员姓名">张三</el-descriptions-item>
        <el-descriptions-item label="手机号码"
          >15000000000</el-descriptions-item
        >
        <!-- 会员卡、充值 -->

        <el-descriptions-item label="卡类编号">123</el-descriptions-item>

        <el-descriptions-item label="卡类名称">尊享卡</el-descriptions-item>

        <el-descriptions-item label="会员卡编号">1212</el-descriptions-item>

        <el-descriptions-item label="销售价格" :span="3">
          <span class="currency-text">{{ 100 | currency }}</span>
        </el-descriptions-item>

        <!-- 会员卡、充值 -->
        <el-descriptions-item label="卡内余额" :span="3">
          <el-table :data="tableData" border style="width: 820px">
            <el-table-column prop="id" label="项目名称" />
            <el-table-column
              prop="amount1"
              label="个人账户"
              width="100"
              class-name="currency-text"
            >
              <template slot-scope="scope">
                {{ scope.row.amount1 | currency }}
              </template>
            </el-table-column>
            <el-table-column
              prop="amount1"
              label="企业账户"
              width="100"
              class-name="currency-text"
            >
              <template slot-scope="scope">
                {{ scope.row.amount1 | currency }}
              </template>
            </el-table-column>
            <el-table-column
              prop="amount1"
              label="个人增搜账户（无折扣）"
              width="180"
              class-name="currency-text"
            >
              <template slot-scope="scope">
                {{ scope.row.amount1 | currency }}
              </template>
            </el-table-column>
            <el-table-column
              prop="amount1"
              label="企业赠送账户"
              width="100"
              class-name="currency-text"
            >
              <template slot-scope="scope">
                {{ scope.row.amount1 | currency }}
              </template>
            </el-table-column>
            <el-table-column
              prop="amount1"
              label="计费项目"
              width="100"
              class-name="currency-text"
            >
              <template slot-scope="scope">
                {{ scope.row.amount1 | currency }}
              </template>
            </el-table-column>
            <el-table-column
              prop="amount1"
              label="赠送项目"
              width="100"
              class-name="currency-text"
            >
              <template slot-scope="scope">
                {{ scope.row.amount1 | currency }}
              </template>
            </el-table-column>
          </el-table>
        </el-descriptions-item>

        <!-- 会员卡、充值 -->

        <el-descriptions-item label="退款信息" :span="3">
          <el-table :data="tableData" border style="width: 600px">
            <el-table-column prop="id" label="项目名称" />
            <el-table-column
              prop="amount1"
              label="累计销售额"
              width="100"
              class-name="currency-text"
            >
              <template slot-scope="scope">
                {{ scope.row.amount1 | currency }}
              </template>
            </el-table-column>
            <el-table-column
              prop="amount1"
              label="（-）累计实际销售额"
              width="160"
              class-name="currency-text"
            >
              <template slot-scope="scope">
                {{ scope.row.amount1 | currency }}
              </template>
            </el-table-column>
            <el-table-column
              prop="amount1"
              label="（=）可退金额"
              width="160"
              class-name="currency-text"
            >
              <template slot-scope="scope">
                {{ scope.row.amount1 | currency }}
              </template>
            </el-table-column>
          </el-table>
        </el-descriptions-item>

        <el-descriptions-item label="套餐信息" :span="3">
          <el-table
            :data="tableData"
            border
            show-summary
            :summary-method="getSummaries"
            style="width: 68vw"
          >
            <!-- 套餐 -->
            <el-table-column prop="id" label="套餐编号" width="120" />
            <el-table-column prop="name" label="套餐名称" width="120" />
            <el-table-column prop="id" label="服务编号" width="120" />
            <el-table-column prop="name" label="服务名称" width="120" />
            <el-table-column prop="name" label="是否赠送" />
            <!-- 服务单 -->
            <el-table-column prop="id" label="服务编号" width="120" />
            <el-table-column prop="name" label="服务名称" width="120" />
            <el-table-column prop="name" label="是否赠送" />
            <!-- 商品 -->
            <el-table-column prop="id" label="商品编号" width="120" />
            <el-table-column prop="name" label="商品名称" width="120" />
            <el-table-column prop="name" label="规格" width="80" />
            <el-table-column prop="name" label="是否赠送" width="80" />
            <!-- 权益 -->
            <el-table-column prop="id" label="权益编号" width="120" />
            <el-table-column prop="name" label="权益名称" width="120" />
            <el-table-column prop="name" label="权益类型" width="80" />
            <el-table-column prop="name" label="是否赠送" width="80" />
            <!-- 券 -->
            <el-table-column prop="id" label="券编号" width="120" />
            <el-table-column prop="name" label="券名称" width="120" />
            <el-table-column prop="name" label="券类型" width="80" />
            <el-table-column prop="name" label="是否赠送" width="80" />
            <el-table-column
              prop="amount1"
              label="销售单价"
              width="100"
              class-name="currency-text"
            >
              <template slot-scope="scope">
                {{ scope.row.amount1 | currency }}
              </template>
            </el-table-column>
            <el-table-column label="可售后数量" width="100">
              <template slot-scope="scope">
                {{ scope.row.amount2 }}
              </template>
            </el-table-column>
            <el-table-column label="申请售后数量" width="110">
              <template slot-scope="scope">
                <span>{{ scope.row.amount1 }}</span>
              </template>
            </el-table-column>
            <!-- 核销套餐的服务 金额不能编辑 -->
            <el-table-column label="申请退款金额" width="180">
              <template slot-scope="scope">
                {{ scope.row.amount1 | currency }}
              </template>
            </el-table-column>
            <!-- 服务单 券 -->
            <el-table-column label="退后服务购买金额" width="140">
              <template slot-scope="scope">
                {{ scope.row.amount2 }}
              </template>
            </el-table-column>
            <!-- 商品 -->
            <el-table-column label="售后商品购买金额" width="140">
              <template slot-scope="scope">
                {{ scope.row.amount2 }}
              </template>
            </el-table-column>
            <!-- 套餐 -->
            <el-table-column label="退后服务销售价格" width="140">
              <template slot-scope="scope">
                {{ scope.row.amount2 }}
              </template>
            </el-table-column>
            <el-table-column label="退后可核销次数" width="140">
              <template slot-scope="scope">
                {{ scope.row.amount2 }}
              </template>
            </el-table-column>
          </el-table>
        </el-descriptions-item>

        <el-descriptions-item label="退款方式">
          转入会员卡
        </el-descriptions-item>
        <el-descriptions-item label="退入会员卡">金卡</el-descriptions-item>
        <el-descriptions-item label="退入账号">个人账号</el-descriptions-item>

        <el-descriptions-item label="退款原因">
          服务不满意
        </el-descriptions-item>
        <el-descriptions-item label="备注" :span="3">
          备注信息
        </el-descriptions-item>

        <el-descriptions-item label="责任人" :span="3">
          <el-table :data="tableData" border style="width: 680px">
            <el-table-column prop="id" label="员工编号" width="120" />
            <el-table-column prop="name" label="姓名" width="120" />
            <el-table-column prop="name" label="岗位" />
            <el-table-column prop="name" label="门店" />
            <el-table-column
              prop="amount1"
              label="金额"
              width="100"
              class-name="currency-text"
            >
              <template slot-scope="scope">
                {{ scope.row.amount1 | currency }}
              </template>
            </el-table-column>
          </el-table>
        </el-descriptions-item>

        <el-descriptions-item label="审核状态">待审核</el-descriptions-item>
        <el-descriptions-item label="审核时间">无</el-descriptions-item>
      </el-descriptions>
    </el-card>

    <el-card class="after-sale-detail__card" header="退货补偿">
      <el-descriptions :column="2">
        <el-descriptions-item label="补偿金额:">
          <span class="currency-text">{{ 100 | currency }}</span>
        </el-descriptions-item>

        <el-descriptions-item label="补偿积分:"> 10 </el-descriptions-item>

        <el-descriptions-item label="补偿优惠券:" :span="3">
          <el-table :data="tableData" border style="width: 450px">
            <el-table-column prop="id" label="券模板编号" width="120" />
            <el-table-column prop="name" label="券名称" width="120" />
            <el-table-column prop="name" label="补偿数量" />
          </el-table>
        </el-descriptions-item>
      </el-descriptions>
    </el-card>

    <el-card class="after-sale-detail__card" header="订单信息">
      <el-descriptions :column="2">
        <el-descriptions-item label="订单编号"
          >kooriookami</el-descriptions-item
        >
        <el-descriptions-item label="订单类型">服务</el-descriptions-item>
        <el-descriptions-item label="单据类型">销售</el-descriptions-item>
      </el-descriptions>
    </el-card>

    <el-card class="after-sale-detail__card" header="退款明细">
      <el-descriptions :column="2">
        <el-descriptions-item label="退款状态">未退款</el-descriptions-item>
        <el-descriptions-item label="应退金额">
          <span class="currency-text">{{ 100 | currency }}</span>
        </el-descriptions-item>
        <el-descriptions-item label="明细列表" :span="3">
          <el-table :data="tableData" border style="width: 800px">
            <el-table-column prop="id" label="平台退款单号" width="120" />
            <el-table-column prop="name" label="退款形式" width="120" />
            <el-table-column prop="name" label="退款金额">
              <template slot-scope="scope">
                <span class="currency-text">
                  {{ scope.row.amount1 | currency }}
                </span>
              </template>
            </el-table-column>
            <el-table-column prop="name" label="退款状态" />
            <el-table-column prop="name" label="退款时间">
              <template slot-scope="scope">
                {{ parseTime(new Date()) }}
              </template>
            </el-table-column>
          </el-table>
        </el-descriptions-item>
      </el-descriptions>
    </el-card>

    <el-dialog
      title="退款审核"
      :visible.sync="open"
      width="800px"
      append-to-body
      :close-on-click-modal="false"
      @close="dialogClose"
    >
      <el-form
        ref="form"
        :model="form"
        :rules="rules"
        label-width="110px"
        size="small"
      >
        <el-form-item label="售后类型:">退款</el-form-item>
        <el-form-item label="申请退款金额:">
          <span class="currency-text">{{ 100 | currency }}</span>
        </el-form-item>

        <el-form-item label="是否审核通过" prop="status">
          <el-select v-model="form.status" placeholder="请选择" size="small">
            <el-option
              v-for="dict in dict.type.sys_normal_disable"
              :key="parseInt(dict.value)"
              :label="dict.label"
              :value="parseInt(dict.value)"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="退款原因:">服务不满意</el-form-item>

        <el-form-item label="备注" prop="note">
          <el-input
            v-model="form.note"
            type="textarea"
            :rows="4"
            placeholder="请输入备注信息"
            maxlength="300"
            show-word-limit
          />
        </el-form-item>

        <el-form-item label="责任人:">
          <el-row type="flex" justify="start" align="middle">
            <el-form-item prop="status" class="mr10">
              <el-select
                v-model="form.status"
                placeholder="请选择组织架构"
                clearable
                size="mini"
              >
                <el-option
                  v-for="dict in dict.type.sys_normal_disable"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item prop="status" class="mr10">
              <el-select
                v-model="form.status"
                placeholder="请选择责任人"
                clearable
                size="mini"
              >
                <el-option
                  v-for="dict in dict.type.sys_normal_disable"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item prop="status" class="mr10">
              <el-input
                placeholder="责任金额"
                size="mini"
                style="width: 150px; vertical-align: baseline"
              >
                <template slot="append">元</template>
              </el-input>
            </el-form-item>
            <el-form-item class="mr10">
              <el-button type="primary" size="mini" icon="el-icon-plus"
                >添加人员</el-button
              >
            </el-form-item>
          </el-row>

          <el-table :data="tableData" border style="width: 680px">
            <el-table-column prop="id" label="员工编号" width="120" />
            <el-table-column prop="name" label="姓名" width="120" />
            <el-table-column prop="name" label="岗位" />
            <el-table-column prop="name" label="门店" />
            <el-table-column
              prop="amount1"
              label="金额"
              width="100"
              class-name="currency-text"
            >
              <template slot-scope="scope">
                {{ scope.row.amount1 | currency }}
              </template>
            </el-table-column>

            <el-table-column label="操作" align="center">
              <template slot-scope="scope">
                <el-button size="mini" type="text" icon="el-icon-delete"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>

        <el-form-item label="补偿金额:">
          <el-row type="flex" justify="start" align="middle">
            <el-form-item prop="status" class="mr10">
              <el-select
                v-model="form.status"
                placeholder="请选择"
                clearable
                size="mini"
              >
                <el-option
                  v-for="dict in dict.type.sys_normal_disable"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item prop="status" class="mr10">
              <el-select
                v-model="form.status"
                placeholder="请选择"
                clearable
                size="mini"
              >
                <el-option
                  v-for="dict in dict.type.sys_normal_disable"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item prop="status" class="mr10">
              <el-select
                v-model="form.status"
                placeholder="请选择"
                clearable
                size="mini"
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
              <el-input
                placeholder="请输入金额"
                size="mini"
                style="width: 150px; vertical-align: baseline"
              >
                <template slot="append">元</template>
              </el-input>
            </el-form-item>
          </el-row>
        </el-form-item>

        <el-form-item label="补偿积分:">
          <el-row type="flex" justify="start" align="middle">
            <el-form-item prop="status" class="mr10">
              <el-select
                v-model="form.status"
                placeholder="请选择会员方案"
                clearable
                size="mini"
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
              <el-input size="mini" placeholder="请输入数量"></el-input>
            </el-form-item>
          </el-row>
        </el-form-item>

        <el-form-item label="补偿优惠券:">
          <el-row type="flex" justify="start" align="middle">
            <el-form-item prop="status" class="mr10">
              <el-select
                v-model="form.status"
                placeholder="优惠券类型"
                clearable
                size="mini"
              >
                <el-option
                  v-for="dict in dict.type.sys_normal_disable"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item prop="status" class="mr10">
              <el-input placeholder="填写数量" size="mini"> </el-input>
            </el-form-item>
            <el-form-item prop="status">
              <el-button type="primary" size="mini" icon="el-icon-plus"
                >添加优惠券</el-button
              >
            </el-form-item>
          </el-row>

          <el-table :data="tableData" border style="width: 450px">
            <el-table-column prop="id" label="券模板编号" width="120" />
            <el-table-column prop="name" label="券名称" width="120" />
            <el-table-column prop="name" label="补偿数量" />

            <el-table-column label="操作" align="center">
              <template slot-scope="scope">
                <el-button size="mini" type="text" icon="el-icon-delete"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="submitForm">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { currencyFormat } from '@/utils/currency'
import { currencyReg } from '@/utils/validate'

export default {
  name: 'PosDetail',
  dicts: ['sys_normal_disable'],
  data() {
    return {
      // 商品详情弹窗
      dialogType: '',
      open: false,
      tableData: [
        {
          id: '12987122',
          name: '王小虎',
          amount1: '234',
          amount2: '3.2',
          amount3: 10,
        },
        {
          id: '12987123',
          name: '王小虎',
          amount1: '165',
          amount2: '4.43',
          amount3: 12,
        },
      ],
      form: {
        status: undefined,
      },
      // 表单校验
      rules: {
        status: [
          { required: true, message: '审核状态不能为空', trigger: 'change' },
        ],
        postCode: [
          { required: true, message: '岗位编码不能为空', trigger: 'blur' },
        ],
        postSort: [
          { required: true, message: '岗位顺序不能为空', trigger: 'blur' },
        ],
      },
    }
  },
  computed: {},
  methods: {
    getSummaries(param) {
      const { columns, data } = param
      const sums = []
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '总价'
          return
        }
        const values = data.map((item) => Number(item[column.property]))
        if (!values.every((value) => isNaN(value))) {
          const sumIndex = values.reduce((prev, curr) => {
            const value = Number(curr)
            if (!isNaN(value)) {
              return prev + curr
            } else {
              return prev
            }
          }, 0)
          sums[index] = index === 5 ? sumIndex : currencyFormat(sumIndex)
        } else {
          sums[index] = ''
        }
      })

      return sums
    },
    // 取消按钮
    cancel() {
      this.open = false
    },
    openDialog() {
      this.open = true
    },
    dialogClose() {
      this.$nextTick(() => this.resetForm('form'))
      console.log('close')
    },
    submitForm() {
      this.$refs['form'].validate((valid) => {
        if (!valid) return false
        // this.$modal.msgSuccess('方案修改成功！')
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.after-sale-detail {
  &__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #ebebeb;
    padding-bottom: 16px;
  }
  &__steps {
    padding: 30px 0;
    border-bottom: 1px solid #ebebeb;
    margin-bottom: 30px;
  }
  &__card {
    margin-bottom: 30px;
    &:last-child {
      margin-bottom: 0;
    }
  }
}
</style>

<style lang="scss">
.after-sale-detail-description-label {
  width: 80px;
  text-align: right;
}
</style>
