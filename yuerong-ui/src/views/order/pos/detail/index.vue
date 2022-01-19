<template>
  <div class="app-container pos-detail">
    <div class="pos-detail__header">
      <span>账单详情</span>
      <div>
        <el-button type="primary" size="mini" @click="goAfterSale()"
          >售后申请</el-button
        >
        <el-button
          type="primary"
          size="mini"
          @click="goPerformance(infoData.bill.operUserId)"
          >员工业绩</el-button
        >
        <!-- infoData.deptId -->
        <el-button
          type="primary"
          size="mini"
          @click="goDepartment(infoData.order.deptId)"
          >部门业绩</el-button
        >
      </div>
    </div>
    <div class="pos-detail__steps">
      <el-steps :space="200" :active="3" align-center finish-status="success">
        <el-step title="提交订单" description="2021-11-18 08:30:55"></el-step>
        <el-step title="支付完成" description="2021-11-18 08:30:55"></el-step>
        <el-step title="订单完成" description="2021-11-18 08:30:55"></el-step>
      </el-steps>
    </div>
    <el-card class="pos-detail__card" header="订单信息">
      <el-descriptions :column="2">
        <el-descriptions-item label="单据类型">
          <dict-tag
            :options="dict.type.doc_type"
            :value="infoData.order.docType"
          />
        </el-descriptions-item>
        <el-descriptions-item label="订单编号">{{
          infoData.order.orderNumber
        }}</el-descriptions-item>
        <el-descriptions-item label="订单状态">
          <dict-tag
            :options="dict.type.order_statu"
            :value="infoData.order.orderStatu"
          />
        </el-descriptions-item>
        <el-descriptions-item label="订单类型">
          <dict-tag
            :options="dict.type.order_type"
            :value="infoData.order.orderType"
          />
        </el-descriptions-item>
        <el-descriptions-item label="销售渠道">
          <dict-tag
            :options="dict.type.sale_channel"
            :value="infoData.bill.saleChannel"
          />
        </el-descriptions-item>
        <el-descriptions-item label="归属部门">
          {{ infoData.bill.deptName }}
        </el-descriptions-item>
        <el-descriptions-item label="操作人">
          {{ infoData.bill.operUserName }}
        </el-descriptions-item>
      </el-descriptions>
    </el-card>

    <el-card class="pos-detail__card" header="会员信息">
      <el-descriptions :column="2">
        <el-descriptions-item label="会员编号">{{
          infoData.member.memberCode
        }}</el-descriptions-item>
        <el-descriptions-item label="会员姓名">{{
          infoData.member.name
        }}</el-descriptions-item>
        <el-descriptions-item label="手机号码">{{
          infoData.member.mobile
        }}</el-descriptions-item>
      </el-descriptions>
    </el-card>

    <el-card class="pos-detail__card" header="商品信息">
      <el-table
        :data="infoData.orderItems"
        border
        show-summary
        :summary-method="
          (param) =>
            getSummaries(param, [
              'saleUnitPrice',
              'discountSal',
              'saleQuantity',
              'saleTotalPrice',
              'promotionSal',
              'changeSal',
            ])
        "
      >
        <el-table-column prop="itemCode" label="商品编号" width="180" />
        <el-table-column prop="itemName" label="商品名称" width="180" />
        <el-table-column prop="itemType" label="商品类型">
          <template slot-scope="scope">
            <dict-tag
              :options="dict.type.goods_type"
              :value="scope.row.itemType"
            />
          </template>
        </el-table-column>
        <el-table-column
          prop="saleUnitPrice"
          label="标准售价"
          width="100"
          class-name="currency-text"
        >
          <template slot-scope="scope">
            {{ scope.row.saleUnitPrice | currency }}
          </template>
        </el-table-column>
        <el-table-column
          prop="saleUnitPrice"
          label="销售单价"
          width="100"
          class-name="currency-text"
        >
          <template slot-scope="scope">
            {{ scope.row.saleUnitPrice | currency }}
          </template>
        </el-table-column>
        <el-table-column prop="saleQuantity" label="数量" width="100">
          <template slot-scope="scope">
            {{ scope.row.saleQuantity }}
          </template>
        </el-table-column>
        <el-table-column
          prop="saleTotalPrice"
          label="销售总价"
          width="100"
          class-name="currency-text"
        >
          <template slot-scope="scope">
            {{ scope.row.saleTotalPrice | currency }}
          </template>
        </el-table-column>
        <el-table-column
          prop="discountSal"
          label="优惠金额"
          width="100"
          class-name="currency-text"
        >
          <template slot-scope="scope">
            {{ scope.row.discountSal | currency }}
          </template>
        </el-table-column>
        <el-table-column
          prop="promotionSal"
          label="促销金额"
          width="100"
          class-name="currency-text"
        >
          <template slot-scope="scope">
            {{ scope.row.promotionSal | currency }}
          </template>
        </el-table-column>
        <el-table-column
          prop="changeSal"
          label="改价金额"
          width="100"
          class-name="currency-text"
        >
          <template slot-scope="scope">
            {{ scope.row.changeSal | currency }}
          </template>
        </el-table-column>

        <el-table-column prop="giveFlag" label="是否赠送">
          <template slot-scope="scope">
            {{ scope.row.giveFlag == 1 ? '是' : '否' }}
          </template>
        </el-table-column>

        <el-table-column prop="deptName" label="归属品牌" />

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
              @click="openDialog(scope.row.writeOffItemId)"
              >详情</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-card class="pos-detail__card" header="销售金额">
      <el-descriptions :column="2">
        <el-descriptions-item label="原单金额">
          <span class="currency-text">
            {{ infoData.order.oriOrderSal | currency }}</span
          >
        </el-descriptions-item>
        <el-descriptions-item label="优惠金额">
          <span> {{ infoData.order.couponSal | currency }}</span>
        </el-descriptions-item>
        <el-descriptions-item label="促销优惠">
          <span> {{ infoData.order.promotSal | currency }}</span>
        </el-descriptions-item>
        <el-descriptions-item label="改价优惠">
          <span> {{ infoData.order.changeSal | currency }}</span>
        </el-descriptions-item>
        <!-- <el-descriptions-item label="欠款优惠">
          <span> {{ -10 | currency }}</span>
        </el-descriptions-item> -->
        <el-descriptions-item label="订单金额合计">
          <span class="currency-text">
            {{ infoData.order.orderSal | currency }}</span
          >
        </el-descriptions-item>
      </el-descriptions>
    </el-card>

    <el-card class="pos-detail__card" header="收款信息">
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

    <el-card
      v-if="orderType === 100"
      class="pos-detail__card"
      header="核销信息"
    >
      <el-table
        :data="infoData.orderItems"
        border
        show-summary
        :summary-method="
          (param) =>
            getSummaries(param, [
              'saleUnitPrice',
              'saleQuantity',
              'saleTotalPrice',
            ])
        "
      >
        <el-table-column prop="itemCode" label="服务编号" width="180" />
        <el-table-column prop="itemName" label="服务名称" width="180" />
        <el-table-column prop="orderId" label="核销订单编号" width="120" />
        <el-table-column prop="name" label="套餐编号" />
        <el-table-column prop="name" label="套餐名称" />

        <el-table-column
          prop="saleUnitPrice"
          label="销售单价"
          width="100"
          class-name="currency-text"
        >
          <template slot-scope="scope">
            {{ scope.row.saleUnitPrice | currency }}
          </template>
        </el-table-column>
        <el-table-column prop="saleQuantity" label="次数" width="100">
          <template slot-scope="scope">
            {{ scope.row.saleQuantity }}
          </template>
        </el-table-column>
        <el-table-column
          prop="saleTotalPrice"
          label="销售价格"
          width="100"
          class-name="currency-text"
        >
          <template slot-scope="scope">
            {{ scope.row.saleTotalPrice | currency }}
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
            <el-button size="mini" type="text" @click="openDialog(scope.row.id)"
              >详情</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-card class="pos-detail__card" header="售后信息">
      <el-table :data="infoData.soldApplys" border>
        <el-table-column
          prop="soldApplyNumber"
          label="售后单编号"
          width="180"
        />

        <el-table-column prop="soldStatus" label="售后状态" width="100">
          <template slot-scope="scope">
            <dict-tag
              :options="dict.type.sold_status"
              :value="scope.row.soldStatus"
            />
          </template>
        </el-table-column>

        <el-table-column prop="soldType" label="售后类型" width="100">
          <template slot-scope="scope">
            <dict-tag
              :options="dict.type.sold_type"
              :value="scope.row.soldType"
            />
          </template>
        </el-table-column>

        <el-table-column prop="soldTime" label="售后申请时间" width="160">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.soldTime) }}</span>
          </template>
        </el-table-column>

        <el-table-column
          prop="soldApplySal"
          label="售后申请金额"
          width="100"
          class-name="currency-text"
        >
          <template slot-scope="scope">
            {{ scope.row.soldApplySal | currency }}
          </template>
        </el-table-column>

        <el-table-column
          prop="refundSal"
          label="实际退款金额"
          width="100"
          class-name="currency-text"
        >
          <template slot-scope="scope">
            {{ scope.row.refundSal | currency }}
          </template>
        </el-table-column>

        <el-table-column prop="reviewTime" label="审核时间" min-width="160">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.reviewTime) }}</span>
          </template>
        </el-table-column>

        <el-table-column prop="name" label="售后完成时间" min-width="160">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.soldCompleteTime) }}</span>
          </template>
        </el-table-column>

        <el-table-column
          label="操作"
          align="center"
          fixed="right"
          class-name="fixed-width"
        >
          <template slot-scope>
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
      <el-table
        v-if="orderType == '2' || orderType == '5'"
        :data="tableData"
        border
      >
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
      <el-table v-if="orderType == '1'" :data="tableData" border>
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
        v-if="orderType == '3'"
        :column="2"
        labelClassName="pos-detail-description-label"
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
        v-if="orderType === '4'"
        :column="2"
        labelClassName="pos-detail-description-label"
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
import _ from 'lodash'
import { currencyFormat } from '@/utils/currency'
import { getOrderDetail } from '@/api/order/pos'

export default {
  name: 'PosDetail',
  dicts: [
    'order_type',
    'order_statu',
    'sale_channel',
    'goods_type',
    'sold_status',
    'sold_type',
    'doc_type',
  ],
  data() {
    return {
      // 商品详情弹窗
      infoData: {
        bill: {}, // 账单信息
        billPays: [], // 账单已支付列表
        member: {}, // 会员信息
        order: {}, // 订单信息
        orderItems: [], // 订单商品列表
        soldApplys: [], // 账单售后列表
      },
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

      goodsData: [],
    }
  },
  computed: {
    orderId() {
      return this.$route.query.id
    },
    // 订单类型
    orderType() {
      // 1 服务（消费单） 2 商品 3 开卡 4 充值 5 套餐
      return this.infoData.order.orderType
    },
    // 单据类型
    docType() {
      // 0 销售单 1 消费单
      return this.infoData.docType
    },
    dialogTitle() {
      let title
      if (this.orderType == '2') {
        title = '核销记录'
      } else if (this.orderType == '1') {
        title = '核销套餐记录'
      } else if (this.orderType == '3' || this.orderType == '4') {
        title = '会员卡信息'
      }
      return title
    },
  },
  created() {
    this.getInfo()
  },
  methods: {
    getInfo() {
      getOrderDetail(this.orderId).then((res) => {
        if (!res.data.member) {
          res.data.member = {}
        }
        if (!res.data.bill) {
          res.data.bill = {}
        }
        if (!res.data.order) {
          res.data.order = {}
        }
        res.data.orderItems = _.map(res.data.orderItems, (item) => {
          return {
            ...item,
            saleTotalPrice: item.saleQuantity * item.saleUnitPrice,
          }
        })
        this.infoData = res.data
      })
    },
    // // 展示统计的keys
    //   showSumKeys: ['amount'],
    getSummaries(param, showSumKeys) {
      const { columns, data } = param
      const sums = []
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '总价'
          return
        }
        if (_.includes(showSumKeys, column.property)) {
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

            sums[index] =
              column.property === 'saleQuantity'
                ? sumIndex
                : currencyFormat(sumIndex)
          } else {
            sums[index] = ''
          }
        } else {
          sums[index] = ''
        }
      })

      return sums
    },
    openDialog(id) {
      this.open = true
    },
    dialogClose() {
      console.log('close')
    },
    goPerformance(id) {
      if (!id) return
      this.$router.push({
        path: '/order/pos/performance',
        query: {
          id,
        },
      })
    },
    goDepartment(id) {
      if (!id) return
      this.$router.push({
        path: '/order/pos/department',
        query: {
          id,
        },
      })
    },
    goAfterSale(id) {
      this.$router.push({
        path: '/order/after-sale/after-sale-apply',
        query: {
          id,
        },
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.pos-detail {
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
.pos-detail-description-label {
  width: 80px;
  text-align: right;
}
</style>
