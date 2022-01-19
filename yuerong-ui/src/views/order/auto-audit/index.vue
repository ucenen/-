<template>
  <div class="app-container">
    <!-- <el-form
      :model="queryParams"
      ref="queryForm"
      :inline="true"
      v-show="showSearch"
      label-width="88px"
    >
      
      <el-form-item label="分类" prop="classId">
        <el-select
          v-model="queryParams.classId"
          placeholder="请选择分类"
          clearable
          size="small"
        >
          <el-option
            v-for="dict in dict.type.sold_type"
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
          >搜索</el-button
        >
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery"
          >重置</el-button
        >
      </el-form-item>
    </el-form> -->

    <el-row :gutter="10" class="mb8">
      <el-col :span="2">
        <!-- v-hasPermi="['store:base:payment:add']" -->
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          >新增规则</el-button
        >
      </el-col>
      <!-- <right-toolbar
        :showSearch.sync="showSearch"
        @queryTable="getList"
      ></right-toolbar> -->
    </el-row>

    <el-table v-loading="loading" :data="dataList">
      <el-table-column label="售后类型" align="" prop="name" width="120" />
      <el-table-column label="销售渠道" align="" prop="code" width="120" />
      <el-table-column label="单据类型" align="" prop="classId" width="120">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.sold_type" :value="scope.row.classId" />
        </template>
      </el-table-column>
      <el-table-column label="订单类型" align="" prop="orderNum" width="120" />
      <el-table-column label="满足条件" align="" prop="status" min-width="200">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.sold_type" :value="scope.row.status" />
        </template>
      </el-table-column>

      <el-table-column
        label="自动审核时效"
        align=""
        prop="orderNum"
        width="120"
      />

      <el-table-column
        label="操作"
        align="center"
        class-name="small-padding fixed-width"
        width="120"
      >
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['store:base:payment:edit']"
            >修改</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['store:base:payment:remove']"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <el-dialog
      :title="title"
      :visible.sync="open"
      width="480px"
      append-to-body
      :close-on-click-modal="false"
      @close="dialogClose"
    >
      <el-form ref="form" :model="form" :rules="rules" label-width="110px">
        <el-form-item label="售后类型" prop="soldId">
          <el-select v-model="form.soldId" placeholder="请选择售后类型">
            <el-option
              v-for="dict in dict.type.sold_type"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="销售渠道" prop="channelId">
          <el-select v-model="form.channelId" placeholder="请选择销售渠道">
            <el-option
              v-for="dict in dict.type.comm_channel"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="单据类型" prop="bills">
          <el-select v-model="form.bills" placeholder="请选择单据类型">
            <el-option
              v-for="dict in dict.type.sold_type"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="订单类型" prop="orderId">
          <el-select v-model="form.orderId" placeholder="请选择订单类型">
            <el-option
              v-for="dict in dict.type.order_type"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="满足条件" prop="indicators">
          <el-select v-model="form.indicators" placeholder="请选择指标">
            <el-option
              v-for="dict in dict.type.sold_type"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item prop="symbol">
          <el-select v-model="form.symbol" placeholder="等于、大于、小于符号">
            <el-option
              v-for="dict in dict.type.sold_type"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item prop="amount">
          <el-input
            v-model="form.amount"
            placeholder="请输入金额"
            style="width: 193px"
          >
            <template slot="append">元</template>
          </el-input>
        </el-form-item>

        <el-form-item label="自动审核时长" prop="time">
          <el-input-number
            v-model="form.time"
            :min="1"
            placeholder="请输入分钟"
            style="width: 193px"
          ></el-input-number>
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
import _ from 'lodash'
import {
  listPayment,
  getPayment,
  delPayment,
  addPayment,
  updatePayment,
  exportPayment,
} from '@/api/store/base/payment'
import { currencyReg } from '@/utils/validate'

export default {
  name: 'AutoAudit',
  dicts: ['sold_type', 'comm_channel', 'order_type'],
  data() {
    return {
      loading: true,
      showSearch: true,
      total: 0,
      dataList: [],
      paymentOptions: [],
      title: '',
      open: false,
      queryParams: {},
      // 表单参数
      form: {
        soldId: undefined,
        channelId: undefined,
        orderId: undefined,
        bills: undefined,
        indicators: undefined,
        symbol: undefined,
        time: undefined,
        amount: undefined,
      },
      // 表单校验
      rules: {
        soldId: [
          { required: true, message: '售后类型不能为空', trigger: 'change' },
        ],
        channelId: [
          { required: true, message: '销售渠道不能为空', trigger: 'change' },
        ],
        bills: [
          { required: true, message: '单据类型不能为空', trigger: 'change' },
        ],
        orderId: [
          { required: true, message: '订单类型不能为空', trigger: 'change' },
        ],
        indicators: [
          { required: true, message: '指标不能为空', trigger: 'change' },
        ],
        symbol: [
          { required: true, message: '符号不能为空', trigger: 'change' },
        ],
        time: [{ required: true, message: '时长不能为空', trigger: 'change' }],
        amount: [
          { required: true, message: '金额不能为空', trigger: 'blur' },
          {
            pattern: currencyReg,
            message: '只能为数字，且最多2位小数',
            trigger: 'blur',
          },
        ],
      },
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.loading = true
      listPayment(this.queryParams).then((response) => {
        this.dataList = response.rows
        this.total = response.total
        this.loading = false
      })
    },
    dialogClose() {
      this.$nextTick(() => this.resetForm('form'))
    },
    cancel() {
      this.open = false
    },

    /** 搜索按钮操作 */
    handleQuery() {
      this.getList()
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm('queryForm')
      this.handleQuery()
    },
    /** 新增按钮操作 */
    handleAdd(row) {
      this.open = true
      this.title = '新增规则'
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      getPayment(row.id).then((response) => {
        this.form = _.pick(response.data, _.keys(this.form))
        this.open = true
        this.title = '修改规则'
      })
    },

    /** 提交按钮 */
    submitForm() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          if (this.form.id != null) {
            updatePayment(this.form).then((response) => {
              this.msgSuccess('修改成功')
              this.open = false
              this.getList()
            })
          } else {
            addPayment(this.form).then((response) => {
              this.msgSuccess('新增成功')
              this.open = false
              this.getList()
            })
          }
        }
      })
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      this.$confirm('是否确认删除规则编号为"' + row.id + '"的数据项?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(function () {
          return delPayment(row.id)
        })
        .then(() => {
          this.getList()
          this.msgSuccess('删除成功')
        })
        .catch(() => {})
    },
  },
}
</script>
