<template>
  <div class="container-style scheme-container">
    <el-container>
      <el-header class="scheme-head">
        <div class="scheme-head-wrapper">
          <div class="scheme-head-left">
            <el-form :inline="true">
              <el-form-item label="请选择">
                <el-select v-model="schemeId" placeholder="请选择" size="small" style="width: 240px">
                  <el-option
                    v-for="item in schemelist"
                    :key="item.id"
                    :label="item.schemeName"
                    :value="item.id | valToString"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" icon="el-icon-search" size="mini" @click="handleSchememQuery">查询</el-button>
              </el-form-item>
            </el-form>
          </div>
          <div class="scheme-head-right">
            <el-button size="mini" icon="el-icon-plus" @click="addNewScheme">创建新方案</el-button>
          </div>
        </div>
      </el-header>
      <el-main>
        <div class="member-scheme-set" v-if="!noScheme">
          <div class="main-head">
            <div><svg-icon icon-class="ring" class-name="ring-icon" />会员方案配置</div>
            <div class="but-groups">
              <el-button size="mini" type="primary" @click="submitForm('ruleForm')">保存</el-button>
              <el-button size="mini" type="warning" @click="resetForm('ruleForm')">重新计算</el-button>
            </div>
          </div>
          <div class="base-info" style="margin-top: 20px">
            <fieldset class="form-border">
              <legend>基本信息</legend>
              <el-form 
                :model="schemeRuleParmas" label-position="right" label-width="120px"
                ref="ruleForm"
              >
                <el-form-item label="方案名称：" prop="schemeName"
                  :rules="[
                      { required: true, message: '请输入方案名称', trigger: 'blur' },
                  ]"
                >
                  <el-input v-model="schemeRuleParmas.schemeName" placeholder="请输入内容" size="small" maxlength="20" style="width:500px"></el-input>
                </el-form-item>
                <el-form-item label="适用渠道：" prop="applyChannel"
                  :rules="[
                    { required: true, message: '请选择适用渠道', trigger: 'blur' },
                  ]"
                >
                  <el-select 
                    v-model="schemeRuleParmas.applyChannel" placeholder="选择售卖渠道，包括：会员APP、微信小程序、门店收银" 
                    size="small" style="width:500px"
                    multiple
                  >
                    <el-option
                      v-for="item in channelist"
                      :key="item.dictValue"
                      :label="item.dictLabel"
                      :value="item.dictValue"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="方案类型：" prop="schemeType"
                  :rules="[
                    { required: true, message: '请选择方案类型', trigger: 'blur' },
                  ]"
                >
                  <el-select 
                    v-model="schemeRuleParmas.schemeType" placeholder="选择会员类型，包括：集团、门店" size="small" style="width:500px"
                    @change="handleSchemeType"
                  >
                    <el-option
                      v-for="item in schemeTypeList"
                      :key="item.dictValue"
                      :label="item.dictLabel"
                      :value="item.dictValue"
                      >
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="适用组织架构：">
                  <el-tree
                    ref="tree"
                    :props="defaultProps"
                    :data="organizationlist"
                    :default-checked-keys="organizationTreeCheck"
                    node-key="id"
                    show-checkbox
                    @check-change="handleCheckChange"
                  >
                  </el-tree>
                </el-form-item>
                <el-form-item label="说明：">
                  <el-input v-model="schemeRuleParmas.schemeSpecification" placeholder="清输入说明内容" size="small" maxlength="50" style="width:500px"></el-input>
                </el-form-item>
                <el-form-item label="状态：">
                  <el-radio-group v-model="schemeRuleParmas.schemeStatus">
                    <el-radio label="0">启用</el-radio>
                    <el-radio label="1">停用</el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-form-item label="审核状态：">
                  待提交
                </el-form-item>
              </el-form>
            </fieldset>
          </div>
          <div class="level-set" style="margin-top: 20px">
            <fieldset class="form-border">
              <legend>等级设置</legend>
              <div class="level-head">
                <div class="title"><label>*</label>等级设置</div>
                <el-button type="primary" size="mini" icon="el-icon-plus" @click="handleAdd">添加等级</el-button>
              </div>
              <el-table
                :data="tableData"
                border
                style="width: 100%">
                <el-table-column
                  prop="date"
                  label="等级名称"
                  width="150">
                </el-table-column>
                <el-table-column
                  prop="name"
                  label="层级"
                  width="120">
                </el-table-column>
                <el-table-column
                  prop="province"
                  label="等级图标"
                  width="120">
                </el-table-column>
                <el-table-column
                  prop="city"
                  label="等级权益数">
                </el-table-column>
                <el-table-column
                  prop="address"
                  label="是否可用成长值升降级">
                </el-table-column>
                <el-table-column
                  prop="zip"
                  label="所需成长值"
                  width="120">
                </el-table-column>
                <el-table-column
                  prop="zip"
                  label="是否可购买">
                </el-table-column>
                <el-table-column
                  prop="zip"
                  label="售价">
                </el-table-column>
                <el-table-column
                  fixed="right"
                  label="等级有效期"
                  width="100">
                </el-table-column>
                <el-table-column
                  fixed="right"
                  label="操作"
                  width="100">
                  <template slot-scope="scope">
                    <el-button @click="handleClick(scope.row)" type="text" size="small">编辑</el-button>
                    <el-button type="text" size="small">操作</el-button>
                    <el-button type="text" size="small">权益配置</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </fieldset>
          </div>
        </div>
        <el-empty v-else description="空空如也"></el-empty>
      </el-main>
    </el-container>
    <addRankDialog 
      ref="addRankDialogRef" 
      :schemeId="schemeId"
      @addRankSuccess="fetchSchemeLeveList"
    ></addRankDialog>
    <setPrivilegeDialog ref="setPrivilegeDialogRef"></setPrivilegeDialog>
    <addPrivilegeDialog ref="addPrivilegeDialo"></addPrivilegeDialog>
  </div>
</template>
<script>
  import { cloneDeep } from 'lodash';
  import {
    geSchemelist, geSchemeChannelist, geSchemeTypeList, geSchemeStatus, geSchemeOrganizationlist,
    addSchemeRule, geSchemeDetail, schemeEdit
  } from '@/api/member/sheme';
  import { getSchemeLeveList } from '@/api/member/schemeLevel';
  import addRankDialog from './add-rank-dialog';
  import setPrivilegeDialog from './set-privilege-dialog';
  import addPrivilegeDialog from './add-privilege-dialog';
  export default {
    data: function() {
      return {
        noScheme: true,
        // Tips: 审核状态暂定默认为1
        schemeRuleParmas: {auditStatus: '1'},
        schemelist: [],
        schemeId: null,
        channelList: [],
        schemeTypeList: [],
        schemeStatusList: [],
        channelist: [],
        organizationlist: [],
        defaultProps: {
          children: 'children',
          label: 'label'
        },
        organizationlistLast: [],
        organizationTreeCheck: [],
        currSaveType: 'add',
        tableData: [{
          levelName: '钻石',
          levelCount: '1',
          imageUrl: 'url',
          // 会员权益权益数 - 暂无
          // 是否可通过成长值降级
          experience: '50',
          isSellUd: '1',
          sellPrice: 100,
          validityType: 1,
          validityParam: 100
        }],
        schemeLevellist: []
      }
    },
    created() {
      geSchemelist().then(res => {
        this.schemelist = res.data;
      })
      geSchemeTypeList().then(res => {
        this.schemeTypeList = res.data
        this.fetchSchemeOrganizationlist(res.data[0].dictValue)
      })
      geSchemeStatus().then(res => {
        this.schemeStatusList = res.data
      })
      geSchemeChannelist().then(res => {
        this.channelist = res.data
      })
    },
    methods: {
      showScheme() {
        this.noScheme = false
      },
      addNewScheme() {
        this.showScheme()
        this.schemeRuleParmas = {auditStatus: '1'}
        this.currSaveType = 'add'
        this.schemeId = ''
        this.organizationTreeCheck = []
        this.$nextTick(this.resetChecked)
      },
      resetChecked() {
        if(!this.organizationlist.length) {return}
        this.$refs.tree.setCheckedKeys([])
      },
      handleAdd() {
        this.$refs.addRankDialogRef.showDialog()
      },

      handleSchemeType(type) {
        this.fetchSchemeOrganizationlist(type)
      },                                                                                                                                 
      fetchSchemeOrganizationlist(type) {
        const query = { schemeType: type }
        geSchemeOrganizationlist(query).then(res => {
          this.organizationlist = res.data;
        })
      },
      handleCheckChange(data, checked, indeterminate) {
        this.getCheckedNodes()
      },

      // 查询方案详情
      async handleSchememQuery() {
        const res = await geSchemeDetail(this.schemeId)
        res.data.applyChannel = res.data.applyChannel.split(',')
        this.organizationTreeCheck = res.data.applyOrganization.split(',')
        this.schemeRuleParmas = res.data
        this.showScheme()
        this.currSaveType = 'edit'
        this.$nextTick(this.getCheckedNodes)
        this.fetchSchemeLeveList()
      },

      async fetchSchemeLeveList() {
        const res = await getSchemeLeveList(this.schemeId)
        console.log(res)
      },

      getCheckedNodes() {
        this.organizationlistLast = this.$refs.tree.getCheckedNodes()
      },

      dealOrganizationlistStr() {
        let strId = '';
        const getLastId = function(list) {
          list.forEach(item => {
            if(!item.children) {
              strId+=item.id+','
            }
          });
        }
        getLastId(this.organizationlistLast)
        return strId;
      },

      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            const schemeRuleParmas = cloneDeep(this.schemeRuleParmas)
            schemeRuleParmas.applyChannel = schemeRuleParmas.applyChannel.join()
            const idStr = this.dealOrganizationlistStr()
            schemeRuleParmas.applyOrganization = idStr;
            if(this.currSaveType == 'add') {
              addSchemeRule(schemeRuleParmas).then(res => {
                this.schemeId = res.data.id
                this.$modal.msgSuccess("方案保存成功！");
              })
            } else {
              schemeEdit(schemeRuleParmas).then(res => {
                this.$modal.msgSuccess("方案修改成功！");
              })
            }
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      },
    },

    components: {
      addRankDialog,
      setPrivilegeDialog,
      addPrivilegeDialog
    }
  }
</script>
<style lang="scss" scoped>
  .container-style {
    min-height: calc(100vh - 84px);
    border: 12px solid rgba(240, 242, 245, .8);
    padding: 10px;
  }
  .scheme-container {
    width: 100%;
    font-size: 14px;
  }
  .scheme-head-wrapper, .main-head {
    display: flex;
    justify-content: space-between;
    border-bottom: 1px solid #DCDFE6;
  }
  .main-head {
    width: 100%;
    padding-bottom: 12px;
  }
  .ring-icon {
    margin-right: 5px;
    font-size: 14px;
  }
  .level-head {
    display: flex;
    align-items: center;
    margin-top: 5px;
    margin-bottom: 5px;
    .title {
      margin-right: 10px;
    }
    label {
      color: #ff4949;
    }
  }
</style>