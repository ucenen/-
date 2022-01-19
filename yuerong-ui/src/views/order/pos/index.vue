<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      :inline="true"
      v-show="showSearch"
      size="small"
    >
      <el-form-item label="账单编号" prop="billNumber">
        <el-input
          v-model="queryParams.billNumber"
          placeholder="请输入编号"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="销售门店" prop="deptIds">
        <el-tree-select
          v-model="queryParams.deptIds"
          ref="treeSelect"
          :selectParams="{
            clearable: true,
            placeholder: '请选择门店',
            multiple: true,
            'collapse-tags': true,
          }"
          :treeParams="treeParams"
        ></el-tree-select>
      </el-form-item>
      <el-form-item label="订单类型" prop="orderType">
        <el-select
          v-model="queryParams.orderType"
          placeholder="请选择类型"
          clearable
        >
          <el-option
            v-for="dict in dict.type.order_type"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="订单状态" prop="orderStatu">
        <el-select
          v-model="queryParams.orderStatu"
          placeholder="请选择状态"
          clearable
        >
          <el-option
            v-for="dict in dict.type.order_statu"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="订单编号/父单号" prop="orderNumber">
        <el-input
          v-model="queryParams.orderNumber"
          placeholder="请输入单号"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>

      <el-form-item label="下单时间">
        <el-date-picker
          v-model="queryParams.orderTime"
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
          v-model="queryParams.completTime"
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

      <el-form-item label="会员手机号" prop="mobile">
        <el-input
          v-model="queryParams.mobile"
          placeholder="请输入会员手机号"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>

      <el-form-item label="订单来源" prop="source">
        <el-select
          v-model="queryParams.source"
          placeholder="请选择来源"
          clearable
        >
          <el-option
            v-for="dict in dict.type.order_source"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="来源终端" prop="sourceTerminal">
        <el-select
          v-model="queryParams.sourceTerminal"
          placeholder="请选择来源终端"
          clearable
        >
          <el-option
            v-for="dict in dict.type.order_source_terminal"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>

      <!-- <el-form-item label="商品名称" prop="name">
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
      </el-form-item> -->

      <el-form-item label="单据类型" prop="docType">
        <el-select
          v-model="queryParams.docType"
          placeholder="请选择单据类型"
          clearable
        >
          <el-option
            v-for="dict in dict.type.doc_type"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <!-- <el-form-item label="支付类型" prop="payment_class">
        <el-select
          v-model="queryParams.payment_class"
          placeholder="请选择支付类型"
          clearable
        >
          <el-option
            v-for="dict in dict.type.payment_class"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item> -->
      <el-form-item label="销售渠道" prop="saleChannel">
        <el-select
          v-model="queryParams.saleChannel"
          placeholder="请选择渠道"
          clearable
        >
          <el-option
            v-for="dict in dict.type.sale_channel"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="收银员" prop="operUserId">
        <el-input
          v-model="queryParams.operUserId"
          placeholder="请输入收银员姓名"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="归属品牌" prop="status">
        <el-select
          v-model="queryParams.companyId"
          placeholder="请选择"
          clearable
          filterable
        >
          <el-option
            v-for="brand in brandList"
            :key="brand.deptId"
            :label="brand.deptName"
            :value="brand.deptId"
            >{{ brand.deptName }}
          </el-option>
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
          <el-radio-group v-model="queryParams.orderStatu" size="mini">
            <el-radio-button label="">全部</el-radio-button>
            <el-radio-button
              v-for="dict in dict.type.order_statu"
              :key="dict.value"
              :label="dict.value"
              :value="dict.value"
              >{{ dict.label }}</el-radio-button
            >
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
      :data="dataList"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column
        v-if="columns[0].visible"
        label="账单编号"
        prop="billNumber"
        width="180"
      />
      <el-table-column
        v-if="columns[1].visible"
        label="单据类型"
        prop="docType"
        width="80"
      >
        <template slot-scope="scope">
          <dict-tag :options="dict.type.doc_type" :value="scope.row.docType" />
        </template>
      </el-table-column>
      <el-table-column
        v-if="columns[2].visible"
        label="支付状态"
        prop="payStatu"
        width="100"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.payStatu == '0' ? '未支付' : '已支付' }}</span>
        </template>
      </el-table-column>
      <el-table-column
        v-if="columns[3].visible"
        label="订单编号"
        prop="orderNumber"
        width="150"
      />
      <el-table-column
        v-if="columns[4].visible"
        label="订单类型"
        prop="orderType"
        width="100"
      >
        <template slot-scope="scope">
          <dict-tag
            :options="dict.type.order_type"
            :value="scope.row.orderType"
          />
        </template>
      </el-table-column>

      <el-table-column
        v-if="columns[5].visible"
        label="销售门店"
        prop="deptName"
        width="100"
      />
      <el-table-column
        v-if="columns[6].visible"
        label="下单时间"
        prop="orderTime"
        width="160"
      >
        <template slot-scope="scope">
          {{ parseTime(scope.row.orderTime) }}
        </template>
      </el-table-column>
      <el-table-column
        v-if="columns[7].visible"
        label="下单会员账号"
        prop="memberCode"
        width="120"
      />
      <el-table-column
        v-if="columns[8].visible"
        label="下单会员姓名"
        prop="memberName"
        width="120"
      />
      <el-table-column
        v-if="columns[9].visible"
        label="下单会员手机"
        prop="mobile"
        width="120"
      />
      <el-table-column
        v-if="columns[10].visible"
        label="订单总金额"
        prop="orderSal"
        width="100"
      />
      <el-table-column
        v-if="columns[11].visible"
        label="实收金额"
        prop="actualSal"
        width="80"
      />
      <el-table-column
        v-if="columns[12].visible"
        label="消费金额"
        prop="wipeSal"
        width="80"
      />
      <el-table-column
        v-if="columns[13].visible"
        label="父单号"
        prop="porderNumber"
        width="160"
      />
      <el-table-column
        v-if="columns[14].visible"
        label="订单状态"
        prop="orderStatu"
        width="80"
      >
        <template slot-scope="scope">
          <dict-tag
            :options="dict.type.order_statu"
            :value="scope.row.orderStatu"
          />
        </template>
      </el-table-column>

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
            @click="goDetail(scope.row.orderId)"
            >查看</el-button
          >
          <!-- <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['store:base:goods:supplier:edit']"
            >修改</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['store:base:goods:supplier:remove']"
            >删除</el-button
          > -->
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
// import { listSupplier } from '@/api/store/base/goods_supplier'
import { posOrderList } from '@/api/order/pos'
import { listDept } from '@/api/system/dept'
import { listBrand } from '@/api/system/dept'
import ElTreeSelect from '@/components/ElTreeSelect'
export default {
  name: 'POS',
  components: {
    ElTreeSelect,
  },
  dicts: [
    'order_type',
    'order_statu',
    'order_source',
    'order_source_terminal',
    'payment_class',
    'sale_channel',
    'doc_type',
  ],
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
        { key: _.uniqueId(), label: '账单编号', visible: true },
        { key: _.uniqueId(), label: '单据类型', visible: true },
        { key: _.uniqueId(), label: '支付状态', visible: true },
        { key: _.uniqueId(), label: '订单编号', visible: true },
        { key: _.uniqueId(), label: '订单类型', visible: true },
        { key: _.uniqueId(), label: '销售门店', visible: true },
        { key: _.uniqueId(), label: '下单时间', visible: true },
        { key: _.uniqueId(), label: '下单会员账号', visible: true },
        { key: _.uniqueId(), label: '下单会员姓名', visible: true },
        { key: _.uniqueId(), label: '下单会员手机', visible: true },
        { key: _.uniqueId(), label: '订单总金额', visible: true },
        { key: _.uniqueId(), label: '实收金额', visible: true },
        { key: _.uniqueId(), label: '消费金额', visible: true },
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
      dataList: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        orderStatu: '',
        // deptIds: [],
      },
      // 销售门店列表
      deptList: [],
      treeParams: {
        clickParent: false,
        'default-expand-all': true,
        'expand-on-click-node': false,
        data: [],
        props: {
          children: 'children',
          label: 'deptName',
          value: 'deptId',
        },
      },
      // 品牌列表
      brandList: [],
    }
  },
  created() {
    this.getDeptList()
    this.getBrandList()
    this.getList()
  },
  methods: {
    //查询品牌列表
    getBrandList() {
      listBrand().then((response) => {
        this.brandList = response.data
      })
    },
    // 销售门店列表
    getDeptList() {
      listDept().then((response) => {
        const deptList = this.handleTree(response.data, 'deptId')
        this.deptList = deptList
        this.$nextTick(() => {
          this.$refs.treeSelect.treeDataUpdateFun(deptList)
        })
      })
    },
    /** 查询商品供应商列表 */
    getList() {
      this.loading = true
      const payload = _.assign({}, this.queryParams, {
        orderTimeStart: _.nth(this.queryParams.orderTime, 0),
        orderTimeEnd: _.nth(this.queryParams.orderTime, 1),
        completTimeStart: _.nth(this.queryParams.completTime, 0),
        completTimeEnd: _.nth(this.queryParams.completTime, 1),
      })
      posOrderList(payload).then((response) => {
        console.log(response)
        this.dataList = response.rows
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
        path: '/order/pos/pos-detail',
        query: {
          id,
        },
      })
    },
  },
}
</script>
