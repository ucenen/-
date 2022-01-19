<template>
  <div class="container-style member-container">
    <div class="filter-head">
      <div class="filter-head-left">
        <el-form class="filter-wrapper" :model="queryParmas" :inline="true">
          <el-form-item class="filter-head-item" label="会员方案:">
            <el-select v-model="queryParmas.schemeRuleId" placeholder="请选择" size="mini" style="width:120px">
              <el-option
                v-for="item in schemelist"
                :key="item.id"
                :label="item.schemeName"
                :value="item.id | valToString"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item  class="filter-head-item" label="会员等级:">
            <el-select v-model="queryParmas.schemeLevelId" placeholder="请选择" size="mini" style="width: 120px">
              <el-option
                v-for="item in memberLevelList"
                :key="item.id"
                :label="item.schemeName"
                :value="item.id | valToString"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item class="filter-head-item" label="会员账号:">
            <el-input v-model="queryParmas.memberIds" placeholder="请输入姓名" size="mini" style="width: 120px"></el-input>
          </el-form-item>
          <el-form-item class="filter-head-item" label="会员手机号:">
            <el-input v-model="queryParmas.mobile" placeholder="请输入手机号" type="number" size="mini" style="width: 120px"></el-input>
          </el-form-item>
          <el-form-item  class="filter-head-item" label="归属门店:">
            <el-select v-model="queryParmas.deptId" placeholder="请选择" size="mini" style="width: 120px">
              <el-option
                v-for="item in storeList"
                :key="item.id"
                :label="item.schemeName"
                :value="item.id | valToString"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item class="filter-head-item" label="注册时间:">
            <el-date-picker
              v-model="queryParmas.date"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              size="mini"
              style="width: 200px"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item  class="filter-head-item" label="会员状态:">
            <el-select v-model="queryParmas.status" placeholder="请选择" size="mini" style="width: 120px">
              <el-option
                v-for="item in memberStateList"
                :key="item.state"
                :label="item.label"
                :value="item.state"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item  class="filter-head-item" label="注册渠道:">
            <el-select v-model="queryParmas.sourceChannel" placeholder="请选择" size="mini" style="width: 120px">
              <el-option
                v-for="item in registerTypeList"
                :key="item.dictCode"
                :label="item.dictLabel"
                :value="item.dictValue"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <!-- <el-form-item  class="filter-head-item" label="冻结状态:">
            <el-select v-model="queryParmas.type" placeholder="请选择" size="mini" style="width: 120px">
              <el-option
                v-for="item in freezeStateList"
                :key="item.id"
                :label="item.schemeName"
                :value="item.id | valToString"
              >
              </el-option>
            </el-select>
          </el-form-item> -->
          <el-form-item  class="filter-head-item" label="冻结原因:">
            <el-select v-model="queryParmas.type" placeholder="请选择" size="mini" style="width: 120px">
              <el-option
                v-for="item in freezeReasonList"
                :key="item.id"
                :label="item.schemeName"
                :value="item.id | valToString"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <!-- <el-form-item  class="filter-head-item" label="注销状态:">
            <el-select v-model="queryParmas.type" placeholder="请选择" size="mini" style="width: 120px">
              <el-option
                v-for="item in cancelStateList"
                :key="item.id"
                :label="item.schemeName"
                :value="item.id | valToString"
              >
              </el-option>
            </el-select>
          </el-form-item> -->
          <el-form-item  class="filter-head-item" label="黑名单会员:">
            <el-select v-model="queryParmas.type" placeholder="请选择" size="mini" style="width: 120px">
              <el-option
                v-for="item in blackList"
                :key="item.state"
                :label="item.label"
                :value="item.state"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handlePrivilegeQuery">查询</el-button>
      </div>
      <div class="filter-head-right">
        <el-button icon="el-icon-s-operation" size="mini" @click="handlePrivilegeQuery">自定义列</el-button>
      </div>
    </div>
    <div class="member-total-status">
      <div class="title">合计</div>
      <div class="status-show">
        <div class="status-show-item">待审核: 0</div>
        <div class="status-show-item">审核通过: <label>{{memberStatusTotal.toAudit | totalNum}}</label></div>
        <div class="status-show-item">会员数: <label>{{memberStatusTotal.normal | totalNum}}</label></div>
        <div class="status-show-item">冻结数: <label>{{memberStatusTotal.freeze | totalNum}}</label></div>
        <div class="status-show-item">禁用数: <label>{{memberStatusTotal.forbidden | totalNum}}</label></div>
        <div class="status-show-item">黑名单数: <label>{{memberStatusTotal.blacklist | totalNum}}</label></div>
        <div class="status-show-item">注销数: <label>{{memberStatusTotal.writeOff | totalNum}}</label></div>
      </div>
    </div>
    <div class="member-set-func">
      <el-button size="mini" @click="handlePrivilegeQuery"><svg-icon icon-class="level" />会员等级设置</el-button>
      <el-button size="mini" @click="handlePrivilegeQuery"><svg-icon icon-class="grow" />成长值设置</el-button>
      <el-button size="mini" @click="handlePrivilegeQuery"><svg-icon icon-class="freeze" />会员冻结</el-button>
      <el-button icon="el-icon-unlock" size="mini" @click="handlePrivilegeQuery">会员解冻</el-button>
      <el-button size="mini" @click="handlePrivilegeQuery"><svg-icon icon-class="freeze" />冻结规则</el-button>
      <el-button size="mini" @click="handlePrivilegeQuery"><svg-icon icon-class="black" />加入黑名单</el-button>
      <el-button icon="el-icon-user" size="mini" @click="handlePrivilegeQuery">解除黑名单</el-button>
      <el-button icon="el-icon-circle-check" size="mini" @click="handlePrivilegeQuery">会员启用</el-button>
      <el-button icon="el-icon-remove-outline" size="mini" @click="handlePrivilegeQuery">会员禁用</el-button>
      <el-button size="mini" @click="handlePrivilegeQuery"><svg-icon icon-class="import" />会员导入</el-button>
    </div>
    <el-table
      :data="tableData"
      style="width: 100%"
    >
      <el-table-column
        type="selection"
        width="55"
      >
      </el-table-column>
      <el-table-column
        prop="name"
        label="会员信息"
        width="130">
        <template slot-scope="{row}">
          {{ row.name || '-' }}
        </template>
      </el-table-column>
      <el-table-column
        prop="birthday"
        label="生日"
        width="150">
        <template slot-scope="{row}">
          {{ row.birthday || '-' }}
        </template>
      </el-table-column>
      <el-table-column
        prop="regTime"
        label="注册时间"
        width="150">
      <template slot-scope="{row}">
          {{ row.regTime || '-' }}
        </template>
      </el-table-column>
      <el-table-column
        prop="sourceChannel"
        width="150"
        label="首次注册渠道">
        <template slot-scope="{row}">
          {{ row.sourceChannel || '-' }}
        </template>
      </el-table-column>
      <el-table-column
        prop="deptName"
        label="归属门店">
        <template slot-scope="{row}">
          {{ row.deptName || '-' }}
        </template>
      </el-table-column>
      <el-table-column
        prop="gender"
        label="性别"
        width="50">
        <template slot-scope="{row}">
          {{ row.gender || '-' }}
        </template>
      </el-table-column>
      <el-table-column
        prop="lastConsuTime"
        width="150"
        label="最后一次消费时候">
        <template slot-scope="{row}">
          {{ row.lastConsuTime || '-' }}
        </template>
      </el-table-column>
      <el-table-column
        prop="status"
        label="状态">
        <template slot-scope="{row}">
          {{ row.status | memberStateText }}
        </template>
      </el-table-column>
      <el-table-column
        fixed="right"
        label="操作"
        width="100">
        <template slot-scope="scope">
          <el-button type="text" size="small">查看</el-button><el-divider direction="vertical"></el-divider>
          <el-button class="audit" type="text" size="small">审核</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
import {
  geSchemelist
} from '@/api/member/sheme';
import { getMemberlist, getMemberStatusTotal, getDictType } from '@/api/member/member-control';
import { getList } from './getList';
export default {
  data() {
    return {
      queryParmas: {},
      tableData: [],
      memberStatusTotal: {},
      noData: false,
      queryParmas: {},
      schemelist: [],
      memberLevelList: [],
      storeList: [],
      memberStateList: [
        {state: 0,label: '正常'},
        {state: 1,label: '未审核'},
        {state: 2,label: '冻结'},
        {state: 3,label: '禁用'},
        {state: 4,label: '注销'}
      ],
      registerTypeList: [],
      freezeStateList: [],
      freezeReasonList: [],
      cancelStateList: [],
      blackList: [
        {state: 0,label: '未添加'},
        {state: 1,label: '已添加'},
      ]
    }
  },
  created() {
    this.getPageData()
    this.initFilterData()
  },
  methods: {
    handlePrivilegeQuery() {
      this.getPageData()
    },
    initFilterData() {
      this.fetchSchemelist()
      this.getDictType()
    },
    getPageData() {
      this.fetchMemberList()
      this.getMemberStatusTotal()
    },
    async fetchMemberList() {
      const res = await getMemberlist(this.queryParmas);
      this.tableData = res.rows
    },
    async getMemberStatusTotal() {
      const res = await getMemberStatusTotal(this.queryParmas);
      this.memberStatusTotal = res.data
    },
    async fetchSchemelist() {
      const res = await geSchemelist()
      this.schemelist = res.data;
    },
    async getDictType() {
      const res = await getDictType('comm_channel')
      console.log(res)
      this.registerTypeList = res.data;
    }
  },
  filters: {
    totalNum: function (value) {
      if (!value) return 0
      return value
    }
  }
}
</script>
<style lang="scss" scoped>
  .member-set-func .el-button {
    border: 1px dashed #DCDFE6;
  }
  .audit {
    color: #A30014;
  }
  .container-style {
    min-height: calc(100vh - 84px);
    border: 12px solid rgba(240, 242, 245, .8);
    padding: 10px;
  }
  .member-container {
    width: 100%;
    font-size: 14px;
    .member-set-func {
      display: flex;
      justify-content: space-between;
      width: 100%;
      margin-bottom: 22px;
    }
    .member-total-status {
      margin-top: -12px;
      margin-bottom: 12px;
      font-size: 13px;
      .title {
        margin-left: 10px;
      }
      display: flex;
      width: 100%;
      padding: 10px 3px;
      border: 1px dashed #DCDFE6;
      border-radius: 5px;
      .status-show {
        display: flex;
        flex: 1;
        justify-content: space-around;
        label {
          color: #A30014;
        }
      }
    }
  }
  .filter-head {
    display: flex;
    justify-content: space-between;
  }
  .filter-head-left {
      display: flex;
      align-items: flex-start;
      font-size: 12px;
      .filter-wrapper {
        max-width: 86%;
      }
    }
  .filter-head-item {
    margin-right: 25px;
  }
</style>