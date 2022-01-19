<template>
  <div class="app-container after-sale-apply">
    <div class="after-sale-apply__header">
      <span>售后申请</span>
      <div>
        <el-button type="primary" size="mini">提交</el-button>
      </div>
    </div>
    <el-form :model="form" :inline="true" ref="form" size="mini">
      <el-card class="after-sale-apply__card" header="售后信息">
        <el-row>
          <el-col :span="12">
            <el-form-item label="售后类型:">退款</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="审核状态:">待提交</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="会员编号:">001</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="会员姓名:">张三</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="手机号码:">15000000000</el-form-item>
          </el-col>
          <!-- 会员卡、充值 -->
          <el-col :span="12">
            <el-form-item label="卡类编号:">123</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="卡类名称:">尊享卡</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="会员卡编号:">1212</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="销售价格:">
              <span class="currency-text">{{ 100 | currency }}</span>
            </el-form-item>
          </el-col>
          <!-- 会员卡、充值 -->
          <el-col :span="24">
            <el-form-item label="卡内余额:">
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
            </el-form-item>
          </el-col>
          <!-- 会员卡、充值 -->
          <el-col :span="24">
            <el-form-item label="退款信息:">
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
            </el-form-item>
          </el-col>

          <el-col :span="24">
            <el-form-item>
              <el-table
                :data="tableData"
                border
                show-summary
                :summary-method="getSummaries"
                style="width: 70vw"
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
                    <el-form-item
                      :rules="[
                        {
                          required: true,
                          message: '不能为空',
                          trigger: 'blur',
                        },
                      ]"
                    >
                      <el-input v-model="scope.row.amount1"></el-input>
                    </el-form-item>
                  </template>
                </el-table-column>
                <!-- 核销套餐的服务 金额不能编辑 -->
                <el-table-column label="申请退款金额" width="180">
                  <template slot-scope="scope">
                    <el-form-item :rules="priceRules">
                      <el-input placeholder="请输入金额" size="mini">
                        <template slot="append">元</template>
                      </el-input>
                    </el-form-item>
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
            </el-form-item>
          </el-col>

          <el-col :span="24">
            <el-form-item label="退款方式:">
              <el-form-item prop="refundType">
                <el-radio-group v-model="form.refundType">
                  <el-radio :label="0">原路返回</el-radio>
                  <el-radio :label="1">到指定账户</el-radio>
                </el-radio-group>
              </el-form-item>

              <el-form-item prop="status">
                <el-select v-model="form.status" placeholder="请选择" clearable>
                  <el-option
                    v-for="dict in dict.type.sys_normal_disable"
                    :key="dict.value"
                    :label="dict.label"
                    :value="dict.value"
                  />
                </el-select>
              </el-form-item>
              <el-form-item prop="status">
                <el-select v-model="form.status" placeholder="请选择" clearable>
                  <el-option
                    v-for="dict in dict.type.sys_normal_disable"
                    :key="dict.value"
                    :label="dict.label"
                    :value="dict.value"
                  />
                </el-select>
              </el-form-item>
              <el-form-item prop="status">
                <el-select v-model="form.status" placeholder="请选择" clearable>
                  <el-option
                    v-for="dict in dict.type.sys_normal_disable"
                    :key="dict.value"
                    :label="dict.label"
                    :value="dict.value"
                  />
                </el-select>
              </el-form-item>
            </el-form-item>
          </el-col>

          <el-col :span="24">
            <el-form-item label="备注:" prop="note">
              <el-input
                v-model="form.note"
                type="textarea"
                placeholder="请输入备注信息"
                :rows="4"
                style="width: 600px"
              >
              </el-input>
            </el-form-item>
          </el-col>

          <el-col :span="24">
            <el-form-item label="退款原因:" prop="status" required>
              <el-select v-model="form.status" placeholder="请选择" clearable>
                <el-option
                  v-for="dict in dict.type.sys_normal_disable"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                />
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="24">
            <el-form-item label="责任人:">
              <el-form-item prop="status">
                <el-select
                  v-model="form.status"
                  placeholder="请选择组织架构"
                  clearable
                >
                  <el-option
                    v-for="dict in dict.type.sys_normal_disable"
                    :key="dict.value"
                    :label="dict.label"
                    :value="dict.value"
                  />
                </el-select>
              </el-form-item>
              <el-form-item prop="status">
                <el-select
                  v-model="form.status"
                  placeholder="请选择责任人"
                  clearable
                >
                  <el-option
                    v-for="dict in dict.type.sys_normal_disable"
                    :key="dict.value"
                    :label="dict.label"
                    :value="dict.value"
                  />
                </el-select>
              </el-form-item>
              <el-form-item prop="status">
                <el-input placeholder="责任金额" size="mini">
                  <template slot="append">元</template>
                </el-input>
              </el-form-item>
              <el-form-item prop="status">
                <el-button type="primary" size="mini" icon="el-icon-plus"
                  >添加人员</el-button
                >
              </el-form-item>
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
          </el-col>
        </el-row>
      </el-card>

      <el-card class="after-sale-apply__card" header="退货补偿">
        <el-row>
          <el-col :span="24">
            <el-form-item label="补偿金额:">
              <el-form-item prop="status">
                <el-select v-model="form.status" placeholder="请选择" clearable>
                  <el-option
                    v-for="dict in dict.type.sys_normal_disable"
                    :key="dict.value"
                    :label="dict.label"
                    :value="dict.value"
                  />
                </el-select>
              </el-form-item>
              <el-form-item prop="status">
                <el-select v-model="form.status" placeholder="请选择" clearable>
                  <el-option
                    v-for="dict in dict.type.sys_normal_disable"
                    :key="dict.value"
                    :label="dict.label"
                    :value="dict.value"
                  />
                </el-select>
              </el-form-item>
              <el-form-item prop="status">
                <el-select v-model="form.status" placeholder="请选择" clearable>
                  <el-option
                    v-for="dict in dict.type.sys_normal_disable"
                    :key="dict.value"
                    :label="dict.label"
                    :value="dict.value"
                  />
                </el-select>
              </el-form-item>
              <el-form-item>
                <el-input placeholder="请输入金额" size="mini">
                  <template slot="append">元</template>
                </el-input>
              </el-form-item>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="补偿积分:">
              <el-form-item prop="status">
                <el-select
                  v-model="form.status"
                  placeholder="请选择会员方案"
                  clearable
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
            </el-form-item>
          </el-col>

          <el-col :span="24">
            <el-form-item label="补偿优惠券:">
              <el-form-item prop="status">
                <el-select
                  v-model="form.status"
                  placeholder="优惠券类型"
                  clearable
                >
                  <el-option
                    v-for="dict in dict.type.sys_normal_disable"
                    :key="dict.value"
                    :label="dict.label"
                    :value="dict.value"
                  />
                </el-select>
              </el-form-item>
              <el-form-item prop="status">
                <el-input placeholder="填写数量" size="mini"> </el-input>
              </el-form-item>
              <el-form-item prop="status">
                <el-button type="primary" size="mini" icon="el-icon-plus"
                  >添加优惠券</el-button
                >
              </el-form-item>
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
          </el-col>
        </el-row>
      </el-card>

      <el-card class="after-sale-apply__card" header="订单信息">
        <el-descriptions :column="2">
          <el-descriptions-item label="订单编号"
            >kooriookami</el-descriptions-item
          >
          <el-descriptions-item label="订单类型">服务</el-descriptions-item>
          <el-descriptions-item label="单据类型">销售</el-descriptions-item>
        </el-descriptions>
      </el-card>
    </el-form>

    <el-dialog
      :title="dialogTitle"
      :visible.sync="open"
      width="1000px"
      append-to-body
      :close-on-click-modal="false"
      @close="dialogClose"
    >
      <!-- 商品核销记录 -->
      <el-table :data="tableData" border>
        <el-table-column prop="id" label="商品编号" width="180" />
        <el-table-column prop="name" label="商品名称" width="180" />
        <el-table-column prop="name" label="类型" />
        <el-table-column
          prop="amount1"
          label="未核销额"
          width="100"
          class-name="currency-text"
        >
          <template slot-scope="scope">
            {{ scope.row.amount1 | currency }}
          </template>
        </el-table-column>
        <el-table-column
          prop="amount1"
          label="已核销额"
          width="100"
          class-name="currency-text"
        >
          <template slot-scope="scope">
            {{ scope.row.amount1 | currency }}
          </template>
        </el-table-column>

        <el-table-column
          prop="amount1"
          label="销售价格"
          width="100"
          class-name="currency-text"
        >
          <template slot-scope="scope">
            {{ scope.row.amount1 | currency }}
          </template>
        </el-table-column>

        <el-table-column prop="amount2" label="未核销/已核销次数" width="140">
          <template slot-scope="scope">
            {{ scope.row.amount2 }}
          </template>
        </el-table-column>

        <el-table-column prop="name" label="到期时间" width="160">
          <span>{{ parseTime(new Date()) }}</span>
        </el-table-column>

        <el-table-column prop="amount2" label="延期次数" width="100">
          <template slot-scope="scope">
            {{ scope.row.amount2 }}
          </template>
        </el-table-column>

        <el-table-column prop="name" label="是否赠送" />
        <el-table-column prop="name" label="状态" />
        <el-table-column prop="name" label="获取方式" />
      </el-table>
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
        refundType: 0,
      },
      // 表单校验
      priceRules: [
        { required: true, message: '不能为空', trigger: 'blur' },
        {
          pattern: currencyReg,
          message: '只能为数字，且最多2位小数',
          trigger: 'change',
        },
      ],
      rules: {
        standardPrice: [
          { required: true, message: '不能为空', trigger: 'blur' },
          {
            pattern: /^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/,
            message: '只能为数字，且最多2位小数',
            trigger: 'change',
          },
        ],
      },
    }
  },
  computed: {
    dialogTitle() {
      let title
      if (this.dialogType === 'goods') {
        title = '核销记录'
      } else if (this.dialogType === 'hexiao') {
        title = '核销套餐记录'
      } else if (this.dialogType === 'vipcard') {
        title = '会员卡信息'
      }
      return title
    },
  },
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
    openDialog(type) {
      this.dialogType = type
      this.open = true
    },
    dialogClose() {
      console.log('close')
    },
  },
}
</script>

<style lang="scss" scoped>
.after-sale-apply {
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
.after-sale-apply-description-label {
  width: 80px;
  text-align: right;
}
.after-sale-apply {
  // .el-form-item {
  //   margin-bottom: 0;
  // }
  // .el-form-item--medium .el-form-item__content {
  //   line-height: 1;
  // }
}
</style>
