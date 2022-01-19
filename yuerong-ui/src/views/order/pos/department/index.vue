<template>
  <div class="app-container department">
    <div class="department__header">
      <span>服务业绩提成</span>
      <div>
        <el-button type="primary" size="mini" @click="openDialog"
          >业绩变更记录</el-button
        >
      </div>
    </div>

    <el-card class="department__card">
      <el-table
        :data="tableData"
        border
        show-summary
        :summary-method="getSummaries"
      >
        <el-table-column prop="deptName" label="部门名称" />
        <el-table-column
          prop="amount"
          label="业绩金额"
          class-name="currency-text"
        >
          <template slot-scope="scope">
            {{ scope.row.amount | currency }}
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog
      title="业绩变动记录"
      :visible.sync="open"
      width="60%"
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
import { searchDeptPerform, searchDeptPerformHistory } from '@/api/order/pos'

export default {
  name: 'department',
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
      // 展示统计的keys
      showSumKeys: ['amount'],
      tableData: [],
    }
  },
  computed: {
    staffId() {
      return this.$route.query.id
    },
  },
  created() {
    this.getDeptPerform()
    this.getDeptPerformHistory()
  },
  mounted() {},
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
    getDeptPerform() {
      searchDeptPerform(this.staffId).then((res) => {
        this.tableData = res.data
        console.log(res.data)
      })
    },
    getDeptPerformHistory() {
      searchDeptPerformHistory(this.staffId).then((res) => {
        this.historyData = res.data
        console.log(res.data)
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.department {
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
