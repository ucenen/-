<template>
  <div class="app-container card-base-manage">
    <el-card>
      <div slot="header" class="header">
        <span>会员卡管理</span>
        <el-button type="primary" size="mini" @click="handleSubmit"
          >提交</el-button
        >
      </div>
      <div class="content">
        <el-form
          ref="form"
          :model="form"
          :rules="rules"
          size="small"
          label-width="170px"
        >
          <el-card class="card-base-manage__card" header="基本信息">
            <el-row>
              <el-col :span="12">
                <el-form-item label="会员卡号:">1212121</el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="卡类名称:">卡</el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="会员编号:">001</el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="会员姓名:">张三</el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="会员手机号:">15000000000</el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="卡状态:">
                  <el-select
                    v-model="form.status"
                    placeholder="请选择卡状态"
                    clearable
                  >
                    <el-option
                      v-for="dict in dict.type.member_status"
                      :key="dict.value"
                      :label="dict.label"
                      :value="dict.value"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
          </el-card>
          <el-card class="card-base-manage__card" header="亲情账户">
            <el-row>
              <el-col :span="12">
                <el-form-item label="已共享人数/可共享人数:"
                  >1/1人</el-form-item
                >
              </el-col>
              <el-col :span="12">
                <el-form-item label="增加可共享人数:">
                  <el-input-number
                    v-model="form.deadlineDays"
                    placeholder="请输入数值"
                    :min="0"
                    style="width: 160px"
                  >
                  </el-input-number>
                </el-form-item>
              </el-col>
            </el-row>
          </el-card>
          <el-card class="card-base-manage__card" header="延期设置">
            <el-row>
              <el-col :span="12">
                <el-form-item label="已延期次数/可延期次数:"
                  >1/1人</el-form-item
                >
              </el-col>
              <el-col :span="12">
                <el-form-item label="增加可延期次数:">
                  <el-input-number
                    v-model="form.deadlineDays"
                    placeholder="请输入次数"
                    :min="0"
                    style="width: 160px"
                  >
                  </el-input-number>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="到期日期:">2022-01-28</el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="每次可延时长:">
                  <el-input-number
                    v-model="form.deadlineDays"
                    placeholder="请输入天数"
                    :min="0"
                    style="width: 160px"
                  >
                  </el-input-number>
                </el-form-item>
              </el-col>
            </el-row>
          </el-card>
        </el-form>
      </div>
    </el-card>
  </div>
</template>

<script>
import { currencyFormat } from '@/utils/currency'
import { currencyReg, phoneReg, positiveNumberReg } from '@/utils/validate'

export default {
  name: 'CardBaseManage',
  dicts: ['sys_normal_disable', 'comm_channel', 'member_status'],
  data() {
    return {
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
      form: {
        itemIds: [],
      },
      // 表单校验
      // priceRules: [
      //   { required: true, message: '不能为空', trigger: 'blur' },
      //   {
      //     pattern: currencyReg,
      //     message: '只能为数字，且最多2位小数',
      //     trigger: 'change',
      //   },
      // ],
      rules: {
        phone: [
          { required: true, message: '请输入会员手机号', trigger: 'blur' },
          {
            pattern: phoneReg,
            message: '请输入正确的手机号码',
            trigger: 'blur',
          },
        ],
        classId: [
          { required: true, message: '请选择卡分类', trigger: 'change' },
        ],
        cardTypeId: [
          { required: true, message: '请选择卡类型', trigger: 'change' },
        ],
        itemIds: [
          { required: true, message: '请勾选开卡项设置', trigger: 'change' },
        ],
        deadlineType: [
          { required: true, message: '请设置卡有效期', trigger: 'change' },
        ],
        deadlineDays: [
          { required: true, message: '请输入天数', trigger: 'change' },
        ],
        deadlineDate: [
          { required: true, message: '请选择日期', trigger: 'change' },
        ],
        cause: [
          { required: true, message: '请选择发卡原因', trigger: 'change' },
        ],
      },
    }
  },
  computed: {},
  methods: {
    handleSubmit() {
      this.$refs['form'].validate((valid) => {
        if (!valid) return
        // updateApplyItemsTemp(this.formBase).then((response) => {
        //   this.$modal.msgSuccess('修改成功')
        //   this.$router.push({
        //     path: '/card/card/cardApplyItemsTemp',
        //   })
        // })
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.card-base-manage {
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .content {
    width: 100%;
    margin: 0 auto;
  }
  &__card {
    margin-bottom: 30px;
    &:last-child {
      margin-bottom: 0;
    }
  }
}
</style>
