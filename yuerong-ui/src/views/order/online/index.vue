<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      :inline="true"
      v-show="showSearch"
      size="small"
    >
      <el-form-item label="订单类型" prop="status">
        <el-select
          v-model="queryParams.status"
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
      <el-form-item label="订单状态" prop="status">
        <el-select
          v-model="queryParams.status"
          placeholder="请选择状态"
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

      <el-form-item label="订单编号/父单号" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入单号"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>

      <el-form-item label="下单时间">
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

      <el-form-item label="支付完成时间">
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

      <el-form-item label="下单会员账号" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入会员姓名"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>

      <el-form-item label="会员手机号" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入会员手机号"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>

      <el-form-item label="订单来源" prop="status">
        <el-select
          v-model="queryParams.status"
          placeholder="请选择来源"
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
      <el-form-item label="来源终端" prop="status">
        <el-select
          v-model="queryParams.status"
          placeholder="请选择来源终端"
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

      <el-form-item label="商品名称" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入套餐、服务名称"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>

      <el-form-item label="商品编号" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入套餐、服务编号"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>

      <el-form-item label="支付类型" prop="status">
        <el-select
          v-model="queryParams.status"
          placeholder="请选择支付类型"
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
      <el-form-item label="渠道" prop="status">
        <el-select
          v-model="queryParams.status"
          placeholder="请选择渠道"
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
      <el-form-item label="售后单编号" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入单号"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="归属品牌" prop="status">
        <el-select
          v-model="queryParams.status"
          placeholder="请选择归属品牌"
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
      <el-row :gutter="10">
        <el-form-item>
          <el-radio-group v-model="queryParams.status" size="mini">
            <el-radio-button label="1">全部</el-radio-button>
            <el-radio-button label="2">待支付</el-radio-button>
            <el-radio-button label="3">已支付</el-radio-button>
            <el-radio-button label="4">待审核</el-radio-button>
            <el-radio-button label="5">待核销</el-radio-button>
            <el-radio-button label="6">已完成</el-radio-button>
            <el-radio-button label="7">已关闭</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <right-toolbar
          :showSearch.sync="showSearch"
          :columns="columns"
          @queryTable="getList"
        ></right-toolbar>
      </el-row>
    </el-form>

    <el-table
      v-loading="loading"
      :data="supplierList"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column
        v-if="columns[0].visible"
        label="订单编号"
        prop="name"
        width="180"
      />
      <el-table-column
        v-if="columns[1].visible"
        label="支付状态"
        prop="orderNum"
        width="80"
      />
      <el-table-column
        v-if="columns[2].visible"
        label="销售渠道"
        prop="contact"
        width="100"
      />
      <el-table-column
        v-if="columns[3].visible"
        label="订单类型"
        prop="phone"
        width="120"
      />
      <el-table-column
        v-if="columns[4].visible"
        label="下单时间"
        prop="phone"
        width="100"
      />
      <el-table-column
        v-if="columns[5].visible"
        label="下单会员姓名"
        prop="status"
        width="100"
      />
      <el-table-column
        v-if="columns[6].visible"
        label="下单会员账号"
        prop="status"
        width="150"
      />
      <el-table-column
        v-if="columns[7].visible"
        label="订单总金额"
        prop="status"
        width="120"
      />
      <el-table-column
        v-if="columns[8].visible"
        label="支付方式"
        prop="status"
        width="120"
      />
      <el-table-column
        v-if="columns[9].visible"
        label="父单号"
        prop="status"
        width="100"
      />
      <el-table-column
        v-if="columns[10].visible"
        label="订单状态"
        prop="status"
        width="80"
      />

      <el-table-column
        label="操作"
        align="center"
        fixed="right"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="goDetail(scope.row.id)"
            >查看</el-button
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
  </div>
</template>

<script>
import _ from 'lodash'
import {
  listSupplier,
  getSupplier,
  delSupplier,
  addSupplier,
  updateSupplier,
  exportSupplier,
} from '@/api/store/base/goods_supplier'

export default {
  name: 'OnlineOrder',
  dicts: ['sys_normal_disable'],
  data() {
    return {
      // 遮罩层
      loading: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 显隐列信息
      columns: [
        { key: _.uniqueId(), label: '订单编号', visible: true },
        { key: _.uniqueId(), label: '支付状态', visible: true },
        { key: _.uniqueId(), label: '销售渠道', visible: true },
        { key: _.uniqueId(), label: '订单类型', visible: true },
        { key: _.uniqueId(), label: '下单时间', visible: true },
        { key: _.uniqueId(), label: '下单会员姓名', visible: true },
        { key: _.uniqueId(), label: '下单会员账号', visible: true },
        { key: _.uniqueId(), label: '订单总金额', visible: true },
        { key: _.uniqueId(), label: '支付方式', visible: true },
        { key: _.uniqueId(), label: '父单号', visible: true },
        { key: _.uniqueId(), label: '订单状态', visible: true },
      ],
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 表格数据
      supplierList: [],
      // 商品供应商树选项
      supplierOptions: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        name: null,
        status: null,
      },
    }
  },
  created() {
    this.getList()
  },
  methods: {
    /** 查询商品供应商列表 */
    getList() {
      this.loading = true
      listSupplier(this.queryParams).then((response) => {
        this.supplierList = response.rows
        this.total = response.total
        this.loading = false
      })
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
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.id)
      this.single = selection.length != 1
      this.multiple = !selection.length
    },
    goDetail(id) {
      this.$router.push({
        path: '/order/pos/detail',
        query: {
          id,
        },
      })
    },
  },
}
</script>
