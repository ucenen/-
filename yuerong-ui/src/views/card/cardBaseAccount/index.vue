<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      :inline="true"
      v-show="showSearch"
      label-width="98px"
    >
      <el-form-item label="会员卡号" prop="id">
        <el-input v-model="input_member" placeholder="请输入内容"></el-input>
      </el-form-item>
      <el-form-item label="手机号码" prop="id">
        <el-input
          v-model="input_phone_member"
          placeholder="请输入内容"
        ></el-input>
      </el-form-item>
      <!-- <el-form-item label="卡类型" prop="id">
        <el-select
          v-model="queryParams.id"
          filterable
          placeholder="全部"
          clearable
          size="small"
        >
          <el-option
            v-for="item in cardListName"
            :key="item.value"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item> -->
      <!-- <el-form-item label="所属分类" prop="classId">
        <el-select
          v-model="queryParams.classId"
          placeholder="全部"
          clearable
          size="small"
        >
          <el-option
            v-for="item in cardListType"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item> -->

      <!-- <el-form-item label="归属" prop="deptId">
        <el-select
          v-model="queryParams.deptId"
          placeholder="请选择归属"
          clearable
          size="small"
        >
        </el-select>
      </el-form-item> -->
      <el-form-item label="日期范围">
        <el-date-picker
          v-model="updateDateRange"
          size="small"
          style="width: 240px"
          value-format="yyyy-MM-dd HH:mm:ss"
          type="daterange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        ></el-date-picker>
      </el-form-item>

      <el-form-item label="会员卡类型" prop="id">
        <el-select
          style="width: 210px"
          v-model="queryParams.id"
          filterable
          placeholder="全部"
          clearable
          size="small"
        >
          <el-option
            v-for="item in cardListName"
            :key="item.value"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="账户类型" prop="id">
        <el-select
          style="width: 210px"
          v-model="queryParams.id"
          filterable
          placeholder="全部"
          clearable
          size="small"
        >
          <el-option
            v-for="item in cardListName"
            :key="item.value"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="品牌" prop="deptId">
        <el-select
          v-model="queryParams.deptId"
          placeholder="请选择"
          clearable
          size="small"
        >
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          icon="el-icon-search"
          size="mini"
          @click="handleQuery"
          >查询</el-button
        >
      </el-form-item>
      <div>
        <el-form-item label="状态" prop="deptId">
          <el-select
            style="margin: 0, 10px"
            v-model="form_state"
            placeholder="请选择"
            clearable
            size="small"
          >
          </el-select>
        </el-form-item>
        <el-form-item label="到期日期">
          <el-date-picker
            v-model="updateDateRange_tw"
            size="small"
            style="width: 240px"
            value-format="yyyy-MM-dd HH:mm:ss"
            type="daterange"
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          ></el-date-picker>
        </el-form-item>
      </div>
    </el-form>

    <div class="state_all" style="border: 1px dashed lightblue">
      <div class="state_all" style="width: 10%; margin: 0 40px">
        <p>合计：</p>
        <p>待审核</p>
        <p style="margin: 20px 20px">10</p>
      </div>
      <div class="state_all" style="width: 10%">
        <p>审核通过：</p>
        <p style="margin: 20px 20px">6000</p>
      </div>
      <div class="state_all" style="width: 10%">
        <p>首冲金额</p>
        <p style="margin: 20px 20px">20000</p>
      </div>
      <div class="state_all" style="width: 10%">
        <p>充值金额</p>

        <p style="margin: 20px 20px">10</p>
      </div>
      <div class="state_all" style="width: 10%">
        <p>消费金额</p>
        <p style="margin: 20px 20px">13400</p>
      </div>
      <div class="state_all" style="width: 10%">
        <p>账户余额</p>
        <p style="margin: 20px 20px">1300</p>
      </div>
      <div class="state_all" style="width: 10%">
        <p>可用金额</p>
        <p style="margin: 20px 20px">1300</p>
      </div>
      <div class="state_all" style="width: 10%">
        <p>子账户总数</p>
        <p style="margin: 20px 20px">1300</p>
      </div>
    </div>

    <el-row :gutter="10" class="mb8">
      <right-toolbar
        :showSearch.sync="showSearch"
        @queryTable="getList"
        :columns="columns"
      ></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="cardAgreementList">
      <el-table-column
        label="会员卡号"
        v-if="columns[0].visible"
        align="center"
        prop="code"
      />
      <el-table-column
        label="卡类名称"
        v-if="columns[1].visible"
        align="center"
        prop="name"
        width="150"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="会员姓名"
        v-if="columns[2].visible"
        align="center"
        prop="type"
      >
        <template slot-scope="scope">
          {{ scope.type == 0 ? "计费" : "赠送" }}
        </template>
      </el-table-column>

      <el-table-column
        label="手机号码"
        v-if="columns[3].visible"
        align="center"
        prop="status"
      >
        <template slot-scope="scope">
          <span>{{ statuText[scope.row.status].label }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="账户类型"
        v-if="columns[4].visible"
        align="center"
        prop="account"
        width="220"
      >
      </el-table-column>
      <el-table-column
        label="充值总额"
        v-if="columns[5].visible"
        align="center"
        prop="personalAccount"
        width="220"
      >
        <template slot-scope="scope">
          <span v-if="scope.row.type == 0">{{
            scope.row.personalAccount
          }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="消费总额"
        v-if="columns[6].visible"
        align="center"
        prop="personalAccount"
        width="220"
      >
        <template slot-scope="scope">
          <span v-if="scope.row.type == 1">{{
            scope.row.personalAccount
          }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="欠款总额"
        v-if="columns[7].visible"
        align="center"
        prop="companyAccount"
        width="220"
      >
        <template slot-scope="scope">
          <span v-if="scope.row.type == 0">{{ scope.row.companyAccount }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="账户余额"
        v-if="columns[8].visible"
        align="center"
        prop="companyAccount"
        width="220"
      >
        <template slot-scope="scope">
          <span v-if="scope.row.type == 1">{{ scope.row.companyAccount }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="充值总额"
        v-if="columns[9].visible"
        align="center"
        prop="packageNum"
        width="220"
      >
      </el-table-column>
      <el-table-column
        label="消费总额"
        v-if="columns[10].visible"
        align="center"
        prop="packagePrice"
      />
      <el-table-column
        label="欠款总额"
        v-if="columns[11].visible"
        align="center"
        prop="serviceNum"
      />
      <el-table-column
        label="账户余额"
        v-if="columns[12].visible"
        align="center"
        prop="servicePrice"
      />
      <el-table-column
        label="可用额度"
        v-if="columns[17].visible"
        align="center"
        prop="totalPrice"
      />
      <el-table-column
        label="操作"
        align="center"
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
            >余额增减</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList(queryParams)"
      layout="total, prev, pager, next, jumper"
    />
  </div>
</template>

<script>
import {
  deleteApplyItemsTemp,
  applyItemsTempList,
} from "@/api/card/cardApplyItemsTemp";
export default {
  name: "detail",
  data() {
    return {
      form_state: "",
      input_member: "",
      input_phone_member: "",
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 是否禁用
      isDisabled: false,
      // 是否是查看
      isCheck: false,
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        name: "",
        code: "",
        status: null,
        crBeginTime: "",
        crEndTime: "",
        upBeginTime: "",
        upEndTime: "",
      },
      statuText: [
        { label: "启用", value: 0 },
        { label: "停用", value: 1 },
      ],
      columns: [
        { key: 0, label: "项目编号", visible: true },
        { key: 1, label: "项目名称", visible: true },
        { key: 2, label: "类型", visible: true },
        { key: 3, label: "状态", visible: true },
        { key: 4, label: "账户金额", visible: true },
        { key: 5, label: "个人账户金额", visible: false },
        { key: 6, label: "个人赠送金额", visible: false },
        { key: 7, label: "企业账户金额", visible: false },
        { key: 8, label: "企业赠送金额", visible: false },
        { key: 9, label: "套餐总数", visible: true },
        { key: 10, label: "套餐总价", visible: true },
        { key: 11, label: "服务总数", visible: true },
        { key: 12, label: "服务总价", visible: true },
        { key: 13, label: "优惠券总数", visible: true },
        { key: 14, label: "优惠券总价", visible: false },
        { key: 15, label: "商品总数", visible: true },
        { key: 16, label: "商品总价", visible: false },
        { key: 17, label: "总计金额", visible: true },
      ],
      cardTypeParams: {
        pageNum: 1,
        pageSize: 10,
      },
      formBase: {
        name: "",
        status: "0",
        type: "0",
      },
      rulesBase: {},
      formVisit: {
        content: "",
        description: "",
        name: "",
        status: "0",
      },
      rulesVisit: {
        name: [
          { required: true, message: "模板名称不能为空", trigger: "blur" },
        ],
        description: [
          { required: true, message: "协议说明不能为空", trigger: "blur" },
        ],
        content: [
          { required: true, message: "模板内容不能为空", trigger: "blur" },
        ],
        status: [{ required: true, message: "状态不能为空", trigger: "blur" }],
      },
      updateDateRange: [],
      updateDateRange_tw: [],
      startdateRange: [],
      cardAgreementList: [],
      cardListType: [],
      titleVisit: "",
      openVisit: false,
    };
  },
  created() {
    this.getList(this.queryParams);
  },
  computed: {
    typeLabel: function () {
      let str = "";
      if (this.formBase.type == 1) {
        str = "赠送";
      } else {
        str = "";
      }
      return str;
    },
  },
  watch: {
    $route(to, from) {
      this.getList(this.queryParams);
    },
  },
  methods: {
    getList(queryParams) {
      applyItemsTempList(queryParams).then((response) => {
        this.cardAgreementList = response.rows;
        this.loading = false;
        this.total = response.total;
      });
    },
    handleQuery() {
      this.queryParams.crBeginTime = this.startdateRange?.[0];
      this.queryParams.crEndTime = this.startdateRange?.[1];
      this.queryParams.upBeginTime = this.updateDateRange?.[0];
      this.queryParams.upEndTime = this.updateDateRange?.[1];
      this.getList(this.queryParams);
    },
    handleAdd() {
      this.$router.push({
        path: "/card/cardApplyItemsTemp/detail",
      });
    },
    handleDelete(rows) {
      let rowid = { id: rows.id };
      this.$modal
        .confirm('是否确认删除编号为"' + rows.code + '"的预设开卡项？')
        .then(function () {
          deleteApplyItemsTemp(rowid);
        })
        .then(() => {
          this.$modal.msgSuccess("删除成功");
          this.getList(this.queryParams);
        })
        .catch(() => {});
    },
    handleUpdate(rows) {
      this.$router.push({
        path: "/card/cardApplyItemsTemp/detail",
        query: {
          id: rows.id,
          type: "edit",
        },
      });
    },
    handleCheck(rows) {
      this.$router.push({
        path: "/card/cardsetting/index",
      });
    },
    reset() {
      this.formVisit = {
        content: "",
        description: "",
        name: "",
        status: "0",
      };
      this.resetForm("formVisit");
    },
  },
};
</script>
<style lang="scss" scoped>
.line {
  border: 1px solid #dcdfe6;
  border-radius: 10px;
  padding: 40px 30px;
  position: relative;
  margin-bottom: 30px;
}
.positop {
  position: absolute;
  top: -20px;
  left: 29px;
  background-color: #fff;
  padding: 10px;
  font-size: 14px;
}
.state_all {
  display: flex;
  justify-content: flex-start;
}
</style>
