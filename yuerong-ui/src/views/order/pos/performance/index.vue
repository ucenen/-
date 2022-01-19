<template>
  <div class="app-container performance">
    <div class="performance__header">
      <span>服务业绩提成</span>
      <div>
        <el-button type="primary" size="mini" @click="openDialog"
          >业绩变更记录</el-button
        >
      </div>
    </div>

    <el-card class="performance__card">
      <el-table
        :data="tableData"
        border
        show-summary
        :summary-method="getSummaries"
        :span-method="spanMethod"
      >
        <el-table-column prop="name" label="项目名称" width="120" />
        <el-table-column prop="type" label="项目类型" width="100" />
        <el-table-column prop="userName" label="店员" width="100" />
        <el-table-column prop="level" label="岗位/职级" width="120" />
        <el-table-column
          prop="serviceValue"
          label="服务业绩"
          width="100"
          class-name="currency-text"
        >
          <template slot-scope="scope">
            {{ scope.row.serviceValue | currency }}
          </template>
        </el-table-column>
        <el-table-column
          prop="chengben"
          label="业绩成本"
          width="100"
          class-name="currency-text"
        >
          <template slot-scope="scope">
            {{ scope.row.chengben | currency }}
          </template>
        </el-table-column>

        <el-table-column prop="category" label="提成类型" />
        <el-table-column prop="payType" label="支付方式" />
        <el-table-column
          prop="value"
          label="分摊金额"
          width="100"
          class-name="currency-text"
        >
          <template slot-scope="scope">
            {{ scope.row.value | currency }}
          </template>
        </el-table-column>
        <el-table-column
          prop="value"
          label="扣除成本"
          width="100"
          class-name="currency-text"
        >
          <template slot-scope="scope">
            {{ scope.row.value | currency }}
          </template>
        </el-table-column>
        <el-table-column prop="payType" label="提成方式" />
        <el-table-column prop="num" label="数值" width="100">
          <template slot-scope="scope">
            {{ scope.row.num }}
          </template>
        </el-table-column>
        <el-table-column
          prop="value"
          label="提成金额"
          width="100"
          class-name="currency-text"
        >
          <template slot-scope="scope">
            {{ scope.row.value | currency }}
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog
      title="业绩变动记录"
      :visible.sync="open"
      width="80%"
      append-to-body
      :close-on-click-modal="false"
      @close="dialogClose"
    >
      <el-form :model="queryParams" ref="queryForm" :inline="true" size="small">
        <el-form-item label="变动类型" prop="type">
          <el-select
            v-model="queryParams.type"
            placeholder="请选择类型"
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
        <el-form-item label="异动时间">
          <el-date-picker
            v-model="queryParams.dateRange"
            style="width: 240px"
            value-format="yyyy-MM-dd"
            type="daterange"
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          ></el-date-picker>
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

      <el-table :data="tableData" border>
        <el-table-column prop="name" label="变动时间" width="160">
          <span>{{ parseTime(new Date()) }}</span>
        </el-table-column>

        <el-table-column prop="name" label="操作人" width="100" />
        <el-table-column prop="name" label="操作端" width="100" />
        <el-table-column prop="name" label="店员" width="100" />
        <el-table-column prop="name" label="项目名称" width="100" />
        <el-table-column prop="name" label="项目类型" width="100" />
        <el-table-column prop="name" label="变动类型" width="100" />
        <el-table-column
          prop="name"
          label="变动内容"
          min-width="300"
          class-name="primary-text"
          :show-overflow-tooltip="true"
        />
      </el-table>
      <pagination
        :hidden="total <= 0"
        :total="total"
        :page.sync="queryParams.pageNum"
        :limit.sync="queryParams.pageSize"
        @pagination="getDialogTableData"
      />
    </el-dialog>
  </div>
</template>

<script>
import _ from 'lodash'
import { currencyFormat } from '@/utils/currency'
import { searchStaffPerform, searchStaffPerformHistory } from '@/api/order/pos'

export default {
  name: 'Performance',
  dicts: ['sys_normal_disable'],
  data() {
    return {
      total: 10,
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        type: undefined,
        dateRange: [],
      },
      // 弹窗
      open: false,
      spanObj: {},
      // 需要合并的列
      mergekeys: ['name', 'type', 'userName'],
      excludeKeys: ['level', 'serviceValue', 'chengben', 'category'],
      // 展示统计的keys
      showSumKeys: ['value'],
      tableData: [
        {
          id: '12987122',
          name: '总监洗剪吹',
          type: '服务',
          userName: '张三',
          level: '发型师/高级',
          serviceValue: 1000,
          chengben: 400,
          category: '点客',
          payType: '支付宝',
          num: 50,
          value: 100,
        },
        {
          id: '12987123',
          name: '总监洗剪吹',
          type: '服务',
          userName: '张三',
          level: '发型师/高级',
          serviceValue: 1000,
          chengben: 400,
          category: '点客',
          payType: '微信',
          num: 50,
          value: 100,
        },
        {
          id: '12987124',
          name: '总监洗剪吹',
          type: '服务',
          userName: '张三',
          level: '发型师/高级',
          serviceValue: 1000,
          chengben: 400,
          category: '点客',
          payType: '积分',
          num: 50,
          value: 100,
        },

        {
          id: '12987122',
          name: '总监洗剪吹',
          type: '服务',
          userName: '李四',
          level: '发型师/中级',
          serviceValue: 1000,
          chengben: 400,
          category: '轮牌',
          payType: '支付宝',
          num: 50,
          value: 100,
        },
        {
          id: '12987123',
          name: '总监洗剪吹',
          type: '服务',
          userName: '李四',
          level: '发型师/中级',
          serviceValue: 1000,
          chengben: 400,
          category: '轮牌',
          payType: '微信',
          num: 50,
          value: 100,
        },
        {
          id: '12987124',
          name: '总监洗剪吹',
          type: '服务',
          userName: '李四',
          level: '发型师/中级',
          serviceValue: 1000,
          chengben: 400,
          category: '轮牌',
          payType: '积分',
          num: 50,
          value: 100,
        },
      ],
    }
  },
  computed: {
    deptId() {
      return this.$route.query.id
    },
  },
  created() {
    this.getStaffPerform()
    this.getStaffPerformHistory()
  },
  mounted() {
    this.handleSpan(this.tableData)
  },
  methods: {
    /** 搜索按钮操作 */
    handleQuery() {
      // this.getList()
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm('queryForm')
      this.handleQuery()
    },
    handleSpan(listData) {
      _.each(this.mergekeys, (key) => {
        this.spanObj[key] = []
        let position = 0
        _.forEach(listData, (item, index) => {
          if (index === 0) {
            this.spanObj[key].push(1)
            position = 0
          } else {
            if (listData[index][key] === listData[index - 1][key]) {
              this.spanObj[key][position] += 1
              this.spanObj[key].push(0)
            } else {
              this.spanObj[key].push(1)
              position = index
            }
          }
        })
      })
      _.each(this.excludeKeys, (key) => {
        this.spanObj[key] = this.spanObj.userName
      })
    },
    spanMethod({ row, column, rowIndex, columnIndex }) {
      const mergekeys = _.concat(this.mergekeys, this.excludeKeys)
      for (let i = 0; i < mergekeys.length; i++) {
        if (column.property === mergekeys[i]) {
          const _row = this.spanObj[mergekeys[i]][rowIndex]
          const _col = _row > 0 ? 1 : 0
          return {
            rowspan: _row,
            colspan: _col,
          }
        }
      }
    },
    getSummaries(param) {
      const { columns, data } = param
      const sums = []
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '合计'
          return
        }

        if (_.includes(this.showSumKeys, column.property)) {
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
        } else {
          sums[index] = ''
        }
      })

      return sums
    },
    openDialog() {
      this.open = true
    },
    dialogClose() {
      console.log('close')
    },
    getDialogTableData() {},
    getStaffPerform() {
      searchStaffPerform(this.deptId).then((res) => {
        this.tableData = res.data
        console.log(res.data)
      })
    },
    getStaffPerformHistory() {
      searchStaffPerformHistory(this.deptId).then((res) => {
        this.historyData = res.data
        console.log(res.data)
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.performance {
  &__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #ebebeb;
    padding-bottom: 16px;
  }

  &__card {
    margin-bottom: 30px;
    &:last-child {
      margin-bottom: 0;
    }
  }
}
</style>
