<template>
  <div class="app-container online-detail">
    <div class="online-detail__header">
      <span>账单详情</span>
      <div>
        <el-button type="primary" size="mini" @click="goAfterSale()"
          >售后申请</el-button
        >
        <el-button type="primary" size="mini" @click="goPerformance()"
          >员工业绩</el-button
        >
        <el-button type="primary" size="mini" @click="goDepartment()"
          >部门业绩</el-button
        >
      </div>
    </div>
    <div class="online-detail__steps">
      <el-steps :space="200" :active="3" align-center finish-status="success">
        <el-step title="提交订单" description="2021-11-18 08:30:55"></el-step>
        <el-step title="支付完成" description="2021-11-18 08:30:55"></el-step>
        <el-step title="订单完成" description="2021-11-18 08:30:55"></el-step>
      </el-steps>
    </div>
    <el-card class="online-detail__card" header="订单信息">
      <el-descriptions :column="2">
        <el-descriptions-item label="订单编号"
          >kooriookami</el-descriptions-item
        >
        <el-descriptions-item label="订单状态"
          >18100000000</el-descriptions-item
        >
        <el-descriptions-item label="订单类型">苏州市</el-descriptions-item>
        <el-descriptions-item label="渠道"> 1 </el-descriptions-item>
        <el-descriptions-item label="归属部门">江苏省</el-descriptions-item>
        <el-descriptions-item label="操作人">王二</el-descriptions-item>
      </el-descriptions>
    </el-card>

    <el-card class="online-detail__card" header="会员信息">
      <el-descriptions :column="2">
        <el-descriptions-item label="会员编号"
          >kooriookami</el-descriptions-item
        >
        <el-descriptions-item label="会员姓名"
          >18100000000</el-descriptions-item
        >
        <el-descriptions-item label="手机号码">苏州市</el-descriptions-item>
      </el-descriptions>
    </el-card>

    <el-card class="online-detail__card" header="商品信息">
      <el-table
        :data="tableData"
        border
        show-summary
        :summary-method="getSummaries"
      >
        <el-table-column prop="id" label="商品编号" width="180" />
        <el-table-column prop="name" label="商品名称" width="180" />
        <el-table-column prop="name" label="商品类型" />
        <el-table-column
          prop="amount1"
          label="标准售价"
          width="100"
          class-name="currency-text"
        >
          <template slot-scope="scope">
            {{ scope.row.amount1 | currency }}
          </template>
        </el-table-column>
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
        <el-table-column prop="amount2" label="数量" width="100">
          <template slot-scope="scope">
            {{ scope.row.amount2 }}
          </template>
        </el-table-column>
        <el-table-column
          prop="amount1"
          label="销售总价"
          width="100"
          class-name="currency-text"
        >
          <template slot-scope="scope">
            {{ scope.row.amount1 | currency }}
          </template>
        </el-table-column>
        <el-table-column
          prop="amount1"
          label="优惠金额"
          width="100"
          class-name="currency-text"
        >
          <template slot-scope="scope">
            {{ scope.row.amount1 | currency }}
          </template>
        </el-table-column>
        <el-table-column
          prop="amount1"
          label="促销金额"
          width="100"
          class-name="currency-text"
        >
          <template slot-scope="scope">
            {{ scope.row.amount1 | currency }}
          </template>
        </el-table-column>
        <el-table-column
          prop="amount1"
          label="改价金额"
          width="100"
          class-name="currency-text"
        >
          <template slot-scope="scope">
            {{ scope.row.amount1 | currency }}
          </template>
        </el-table-column>

        <el-table-column prop="name" label="是否赠送" />
        <el-table-column prop="name" label="归属品牌" />

        <el-table-column
          label="操作"
          align="center"
          fixed="right"
          class-name="fixed-width"
        >
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              @click="openDialog('goods', scope.row.id)"
              >详情</el-button
            >
            <el-button
              size="mini"
              type="text"
              @click="openDialog('vipcard', scope.row.id)"
              >详情</el-button
            >
            <el-button
              size="mini"
              type="text"
              @click="openDialog('viptopup', scope.row.id)"
              >详情</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-card class="online-detail__card" header="销售金额">
      <el-descriptions :column="2">
        <el-descriptions-item label="原单金额">
          <span class="currency-text"> {{ 1200 | currency }}</span>
        </el-descriptions-item>
        <el-descriptions-item label="优惠金额">
          <span> {{ -10 | currency }}</span>
        </el-descriptions-item>
        <el-descriptions-item label="促销优惠">
          <span> {{ -10 | currency }}</span>
        </el-descriptions-item>
        <el-descriptions-item label="改价优惠">
          <span> {{ -10 | currency }}</span>
        </el-descriptions-item>
        <el-descriptions-item label="欠款优惠">
          <span> {{ -10 | currency }}</span>
        </el-descriptions-item>
        <el-descriptions-item label="订单金额合计">
          <span class="currency-text"> {{ 1000 | currency }}</span>
        </el-descriptions-item>
      </el-descriptions>
    </el-card>

    <el-card class="online-detail__card" header="收款信息">
      <el-descriptions :column="2">
        <el-descriptions-item label="支付宝">
          <span class="currency-text"> {{ 1200 | currency }}</span>
        </el-descriptions-item>
        <el-descriptions-item label="微信支付">
          <span class="currency-text"> {{ -10 | currency }}</span>
        </el-descriptions-item>
        <el-descriptions-item label="积分抵扣">
          <span class="currency-text"> {{ -10 | currency }}</span>
        </el-descriptions-item>
        <el-descriptions-item label="会员卡支付">
          <span class="currency-text"> {{ -10 | currency }}</span>
        </el-descriptions-item>
      </el-descriptions>
    </el-card>

    <el-card class="online-detail__card" header="核销信息">
      <el-table
        :data="tableData"
        border
        show-summary
        :summary-method="getSummaries"
      >
        <el-table-column prop="id" label="服务编号" width="180" />
        <el-table-column prop="name" label="服务名称" width="180" />
        <el-table-column prop="name" label="核销订单编号" />
        <el-table-column prop="name" label="套餐编号" />
        <el-table-column prop="name" label="套餐名称" />
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
        <el-table-column prop="amount2" label="次数" width="100">
          <template slot-scope="scope">
            {{ scope.row.amount2 }}
          </template>
        </el-table-column>
        <el-table-column
          prop="amount1"
          label="销售总价"
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

        <el-table-column prop="name" label="归属品牌" />

        <el-table-column
          label="操作"
          align="center"
          fixed="right"
          class-name="fixed-width"
        >
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              @click="openDialog('hexiao', scope.row.id)"
              >详情</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-card class="online-detail__card" header="售后信息">
      <el-table :data="tableData" border>
        <el-table-column prop="id" label="售后单编号" width="180" />
        <el-table-column prop="name" label="售后状态" width="100" />
        <el-table-column prop="name" label="售后类型" width="100" />
        <el-table-column prop="name" label="售后申请时间" width="160">
          <span>{{ parseTime(new Date()) }}</span>
        </el-table-column>
        <el-table-column
          prop="amount1"
          label="售后申请金额"
          width="100"
          class-name="currency-text"
        >
          <template slot-scope="scope">
            {{ scope.row.amount1 | currency }}
          </template>
        </el-table-column>
        <el-table-column
          prop="amount1"
          label="实际退款金额"
          width="100"
          class-name="currency-text"
        >
          <template slot-scope="scope">
            {{ scope.row.amount1 | currency }}
          </template>
        </el-table-column>

        <el-table-column prop="name" label="审核时间" min-width="160">
          <span>{{ parseTime(new Date()) }}</span>
        </el-table-column>

        <el-table-column prop="name" label="售后完成时间" min-width="160">
          <span>{{ parseTime(new Date()) }}</span>
        </el-table-column>

        <el-table-column
          label="操作"
          align="center"
          fixed="right"
          class-name="fixed-width"
        >
          <template slot-scope="scope">
            <el-button size="mini" type="text">详情</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog
      :title="dialogTitle"
      :visible.sync="open"
      width="1000px"
      append-to-body
      :close-on-click-modal="false"
      @close="dialogClose"
    >
      <!-- 商品核销记录 -->
      <el-table v-show="dialogType === 'goods'" :data="tableData" border>
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
      <!-- 核销套餐记录 -->
      <el-table v-show="dialogType === 'hexiao'" :data="tableData" border>
        <el-table-column prop="id" label="服务编号" width="180" />
        <el-table-column prop="name" label="服务名称" width="180" />
        <el-table-column prop="name" label="核销订单编号" width="180" />
        <el-table-column prop="name" label="套餐编号" />
        <el-table-column prop="name" label="套餐名称" />
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

        <el-table-column prop="name" label="归属品牌" />

        <el-table-column prop="name" label="使用时间" width="160">
          <span>{{ parseTime(new Date()) }}</span>
        </el-table-column>
      </el-table>
      <!-- 会员卡信息 -->
      <el-descriptions
        v-show="dialogType === 'vipcard'"
        :column="2"
        labelClassName="online-detail-description-label"
      >
        <el-descriptions-item label="卡类编号"
          >kooriookami</el-descriptions-item
        >
        <el-descriptions-item label="卡类名称">123</el-descriptions-item>
        <el-descriptions-item label="所属分类"
          >美容法卡/储值卡</el-descriptions-item
        >
        <el-descriptions-item label="会员卡编号"
          >kooriookami</el-descriptions-item
        >
        <el-descriptions-item label="标准售价">
          <span class="currency-text">{{ 200 | currency }}</span>
        </el-descriptions-item>
        <el-descriptions-item label="归属品牌"
          >kooriookami</el-descriptions-item
        >
        <el-descriptions-item label="账户资金" :span="2">
          <el-table
            style="width: 800px"
            :data="tableData"
            border
            show-summary
            :summary-method="getSummaries"
          >
            <el-table-column prop="name" label="账号名称" />
            <el-table-column prop="name" label="消费规则" />
            <el-table-column label="到店可消费时间段">
              {{ parseTime(new Date(), '{h}:{i}:{s}') }}~{{
                parseTime(new Date(), '{h}:{i}:{s}')
              }}</el-table-column
            >
            <el-table-column
              prop="amount1"
              label="开账金额"
              class-name="currency-text"
            >
              <template slot-scope="scope">
                {{ scope.row.amount1 | currency }}
              </template>
            </el-table-column>
          </el-table>
        </el-descriptions-item>

        <el-descriptions-item label="其它" :span="2">
          <el-table style="width: 300px" :data="tableData" border>
            <el-table-column prop="name" label="附加权益名称" />

            <el-table-column
              prop="amount1"
              label="销售价格"
              class-name="currency-text"
            >
              <template slot-scope="scope">
                {{ scope.row.amount1 | currency }}
              </template>
            </el-table-column>
          </el-table>
        </el-descriptions-item>
      </el-descriptions>
      <!-- 会员卡充值信息 -->
      <el-descriptions
        v-show="dialogType === 'viptopup'"
        :column="2"
        labelClassName="online-detail-description-label"
      >
        <el-descriptions-item label="卡类编号"
          >kooriookami</el-descriptions-item
        >
        <el-descriptions-item label="卡类名称">123</el-descriptions-item>
        <el-descriptions-item label="所属分类"
          >美容法卡/储值卡</el-descriptions-item
        >
        <el-descriptions-item label="会员卡编号"
          >kooriookami</el-descriptions-item
        >

        <el-descriptions-item label="归属品牌" :span="2"
          >kooriookami</el-descriptions-item
        >
        <el-descriptions-item label="账户资金" :span="2">
          <el-table style="width: 300px" :data="tableData" border>
            <el-table-column prop="name" label="账号名称" />

            <el-table-column
              prop="amount1"
              label="充值金额"
              class-name="currency-text"
            >
              <template slot-scope="scope">
                {{ scope.row.amount1 | currency }}
              </template>
            </el-table-column>
          </el-table>
        </el-descriptions-item>
      </el-descriptions>
    </el-dialog>
  </div>
</template>

<script>
import { currencyFormat } from '@/utils/currency'

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
    goPerformance(id) {
      this.$router.push({
        path: '/order/pos/performance',
        query: {
          id,
        },
      })
    },
    goDepartment(id) {
      this.$router.push({
        path: '/order/pos/department',
        query: {
          id,
        },
      })
    },
    goAfterSale(id) {
      this.$router.push({
        path: '/order/after-sale/apply',
        query: {
          id,
        },
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.online-detail {
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
.online-detail-description-label {
  width: 80px;
  text-align: right;
}
</style>
