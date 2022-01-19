<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      :inline="true"
      v-if="showSearch"
      label-width="90px"
      size="small"
    >
      <el-form-item label="会员卡号" prop="code">
        <el-input
          v-model="queryParams.code"
          placeholder="请输入会员卡编号"
          clearable
          @keyup.enter.native="handleQuery"
        ></el-input>
      </el-form-item>
      <el-form-item label="手机号码" prop="phone">
        <el-input
          v-model="queryParams.phone"
          placeholder="请输入手机号码"
          clearable
          @keyup.enter.native="handleQuery"
        ></el-input>
      </el-form-item>
      <el-form-item label="渠道" prop="channel">
        <el-select
          v-model="queryParams.channel"
          placeholder="请选择渠道"
          clearable
        >
          <el-option
            v-for="dict in dict.type.comm_channel"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="会员卡类型" prop="cardTypeId">
        <el-select
          v-model="queryParams.cardTypeId"
          placeholder="请选择类型"
          clearable
        >
          <el-option
            v-for="dict in dict.type.comm_channel"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="状态" prop="status">
        <el-select
          v-model="queryParams.status"
          placeholder="请选择状态"
          clearable
        >
          <el-option
            v-for="dict in dict.type.comm_channel"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="发卡日期">
        <el-date-picker
          v-model="queryParams.crtTime"
          style="width: 240px"
          value-format="yyyy-MM-dd"
          type="daterange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        ></el-date-picker>
      </el-form-item>

      <el-form-item label="到期日期">
        <el-date-picker
          v-model="queryParams.expTime"
          style="width: 240px"
          value-format="yyyy-MM-dd"
          type="daterange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="归属" prop="customerId">
        <el-select
          v-model="queryParams.customerId"
          placeholder="请选择归属"
          clearable
        >
          <el-option
            v-for="dict in dict.type.comm_channel"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="库存批次" prop="stockCode">
        <el-input
          v-model="queryParams.stockCode"
          placeholder="请输入库存编号"
          clearable
          @keyup.enter.native="handleQuery"
        />
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

    <el-row :gutter="10" class="mb8">
      <el-col :span="4">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleGoAdd"
          >会员发卡</el-button
        >
      </el-col>
      <right-toolbar
        :showSearch.sync="showSearch"
        @queryTable="getList"
        :columns="columns"
        @change="handleToolbarChange"
      ></right-toolbar>
    </el-row>

    <el-row class="summation">
      <el-col :span="2">合计</el-col>
      <el-col :span="4">
        <span class="summation__label">待审核：</span>
        <span class="summation__value">10</span>
      </el-col>
      <el-col :span="4">
        <span class="summation__label">发卡总量：</span>
        <span class="summation__value">10</span>
      </el-col>
      <el-col :span="4">
        <span class="summation__label">在用总量：</span>
        <span class="summation__value">10</span>
      </el-col>
      <el-col :span="4">
        <span class="summation__label">到期总量：</span>
        <span class="summation__value">10</span>
      </el-col>
      <el-col :span="4">
        <span class="summation__label">作废总量：</span>
        <span class="summation__value">10</span>
      </el-col>
    </el-row>

    <el-table ref="tableRef" v-loading="loading" :data="dataList" row-key="id">
      <el-table-column label="库存批次" prop="stockCode" width="160" />
      <el-table-column label="会员卡号" prop="code" width="160" />
      <el-table-column label="卡类名称" prop="cardTypeName" width="100" />

      <el-table-column label="会员姓名" prop="name" width="140" />

      <el-table-column label="手机号码" prop="phone" width="140" />

      <el-table-column label="发卡日期" prop="companyAccount" width="160">
        <template slot-scope="scope">
          {{ parseTime(scope.row.createTime) }}
        </template>
      </el-table-column>
      <el-table-column label="到期日期" prop="companyAccount" width="160">
        <template slot-scope="scope">
          {{ parseTime(scope.row.createTime) }}
        </template>
      </el-table-column>

      <el-table-column label="销售金额" prop="packagePrice" width="100" />
      <el-table-column label="卡状态" prop="serviceNum" width="100" />
      <!-- 非必展示 -->
      <el-table-column
        v-if="columns[0].visible"
        label="会员编号"
        prop="code"
        width="160"
      />
      <el-table-column
        label="售卡渠道"
        v-if="columns[1].visible"
        prop="channel"
        width="100"
      />

      <el-table-column
        label="卡批次号"
        v-if="columns[2].visible"
        prop="stockCode"
        width="160"
      />

      <el-table-column
        v-if="columns[3].visible"
        label="发卡原因"
        prop="servicePrice"
        width="150"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        v-if="columns[4].visible"
        label="备注"
        prop="servicePrice"
        width="150"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        v-if="columns[5].visible"
        label="可共享亲情账户人数"
        prop="servicePrice"
        width="150"
      />
      <el-table-column
        v-if="columns[6].visible"
        label="已共享亲情账户人数"
        prop="servicePrice"
        width="150"
      />
      <el-table-column
        v-if="columns[7].visible"
        label="可延期次数"
        prop="servicePrice"
        width="120"
      />
      <el-table-column
        v-if="columns[8].visible"
        label="已延期次数"
        prop="servicePrice"
        width="120"
      />
      <el-table-column
        v-if="columns[9].visible"
        label="是否赠送"
        prop="servicePrice"
        width="100"
      />
      <el-table-column
        v-if="columns[10].visible"
        label="赠送人"
        prop="servicePrice"
        width="100"
      />
      <el-table-column
        v-if="columns[11].visible"
        label="赠送日期"
        prop="servicePrice"
        width="160"
      >
        <template slot-scope="scope">
          {{ parseTime(scope.row.createTime) }}
        </template>
      </el-table-column>
      <el-table-column
        v-if="columns[12].visible"
        label="是否解绑"
        prop="servicePrice"
        width="100"
      />
      <el-table-column
        v-if="columns[13].visible"
        label="解绑日期"
        prop="servicePrice"
        width="160"
      >
        <template slot-scope="scope">
          {{ parseTime(scope.row.createTime) }}
        </template>
      </el-table-column>
      <el-table-column
        v-if="columns[14].visible"
        label="状态变更日期"
        prop="servicePrice"
        width="160"
      >
        <template slot-scope="scope">
          {{ parseTime(scope.row.createTime) }}
        </template>
      </el-table-column>

      <el-table-column
        label="操作"
        fixed="right"
        width="220"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            @click="handleCheck(scope.row)"
            v-hasPermi="['store:service:edit']"
            >管理</el-button
          >

          <el-button
            size="mini"
            type="text"
            @click="handleDelete(scope.row)"
            v-hasPermi="['store:service:remove']"
            >查看</el-button
          >
          <el-button
            size="mini"
            type="text"
            @click="handleDelete(scope.row)"
            v-hasPermi="['store:service:remove']"
            >账户明细</el-button
          >
          <el-button
            size="mini"
            type="text"
            @click="handleDelete(scope.row)"
            v-hasPermi="['store:service:remove']"
            >卡升级</el-button
          >
          <el-button
            size="mini"
            type="text"
            @click="handleDelete(scope.row)"
            v-hasPermi="['store:service:remove']"
            >作废</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <pagination
      :hidden="total <= 0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList(queryParams)"
      layout="total, prev, pager, next, jumper"
    />
  </div>
</template>

<script>
import _ from 'lodash'
import {
  deleteApplyItemsTemp,
  applyItemsTempList,
} from '@/api/card/cardApplyItemsTemp'
export default {
  name: 'CardBase',
  dicts: ['comm_channel'],
  data() {
    return {
      // 遮罩层
      loading: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
      },
      // 显隐列信息
      columns: [
        { key: 0, label: '会员编号', visible: false },
        { key: 1, label: '售卡渠道', visible: false },
        { key: 2, label: '卡批次号', visible: false },
        { key: 3, label: '发卡原因', visible: false },
        { key: 4, label: '备注', visible: false },
        { key: 5, label: '可共享亲情账户人数', visible: false },
        { key: 6, label: '已共享亲情账户人数', visible: false },
        { key: 7, label: '可延期次数', visible: false },
        { key: 8, label: '已延期次数', visible: false },
        { key: 9, label: '是否赠送', visible: false },
        { key: 10, label: '赠送人', visible: false },
        { key: 11, label: '赠送日期', visible: false },
        { key: 12, label: '是否解绑', visible: false },
        { key: 13, label: '解绑日期', visible: false },
        { key: 14, label: '状态变更日期', visible: false },
      ],
      dataList: [],
    }
  },
  created() {
    this.getList(this.queryParams)
  },
  computed: {},
  methods: {
    getList(queryParams) {
      this.loading = true
      const payload = _.assign({}, this.queryParams, {
        crtBeginTime: _.nth(this.queryParams.crtTime, 0),
        crtEndTime: _.nth(this.queryParams.crtTime, 1),
        expBeginTime: _.nth(this.queryParams.expTime, 0),
        expEndTime: _.nth(this.queryParams.expTime, 1),
      })
      applyItemsTempList(payload).then((response) => {
        this.dataList = response.rows
        this.loading = false
        this.total = response.total
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
    handleGoAdd() {
      this.$router.push({
        path: '/card/cardBaseAdd',
      })
    },
    handleDelete(rows) {
      let rowid = { id: rows.id }
      this.$modal
        .confirm('是否确认删除编号为"' + rows.code + '"的预设开卡项？')
        .then(function () {
          deleteApplyItemsTemp(rowid)
        })
        .then(() => {
          this.$modal.msgSuccess('删除成功')
          this.getList(this.queryParams)
        })
        .catch(() => {})
    },
    handleUpdate(rows) {
      this.$router.push({
        path: '/card/cardApplyItemsTemp/detail',
        query: {
          id: rows.id,
          type: 'edit',
        },
      })
    },
    handleCheck(rows) {
      this.$router.push({
        path: '/card/cardsetting/index',
      })
    },
    handleToolbarChange() {
      this.$nextTick(() => this.$refs.tableRef.doLayout())
    },
  },
}
</script>
<style lang="scss" scoped>
.summation {
  font-size: 14px;
  color: #606266;
  padding: 20px;
  border: 1px dashed #ebebeb;
  border-radius: 4px;
  margin-bottom: 20px;
  &__label {
    font-weight: 500;
  }
  &__value {
    color: #f56c6c;
    &.error {
      color: #f56c6c;
    }
    &.success {
      color: #67c23a;
    }
  }
}
</style>
