<template>
  <div class="app-container card-base-upgrade">
    <el-card>
      <div slot="header" class="header">
        <span>会员卡升级</span>
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
          label-width="120px"
        >
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
              <el-form-item label="账户总额:">
                <span class="currency-text">
                  {{ 1000 | currency }}
                </span>
              </el-form-item>
            </el-col>
          </el-row>

          <el-divider></el-divider>

          <el-form-item label="升级到卡类:" prop="cardTypeId">
            <el-select
              v-model="form.cardTypeId"
              placeholder="请选择可升级卡类型"
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
          <el-form-item label="卡类编号:">
            <span>121212</span>
          </el-form-item>
          <el-form-item label="发卡渠道:" prop="channel">
            <el-select
              v-model="form.status"
              placeholder="请选择卡类型"
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

          <el-form-item label="卡批次号:">
            <span>121212</span>
          </el-form-item>

          <el-form-item label="开卡项设置:" prop="itemIds">
            <el-checkbox-group v-model="form.itemIds">
              <el-table :data="tableData" border style="width: 450px">
                <el-table-column prop="name" label="开卡项内容:" />
                <el-table-column label="操作" align="center" width="120">
                  <template slot-scope="scope">
                    <el-checkbox :label="scope.row.id">授予</el-checkbox>
                  </template>
                </el-table-column>
              </el-table>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item label="卡有效期:" prop="deadlineType">
            <el-row type="flex" align="center">
              <el-form-item class="mr10">
                <el-radio v-model="form.deadlineType" label="0"
                  >剩余时间</el-radio
                >
              </el-form-item>
              <el-form-item prop="deadlineDays" class="mr20">
                <el-input-number
                  v-model="form.deadlineDays"
                  placeholder="请输入天数"
                  :min="1"
                  style="width: 160px"
                >
                </el-input-number>
                <!-- <template slot="append">天</template> -->
              </el-form-item>
              <el-form-item class="mr10">
                <el-radio v-model="form.deadlineType" label="1"
                  >到期日期</el-radio
                >
              </el-form-item>
              <el-form-item prop="deadlineDate">
                <el-date-picker
                  v-model="form.deadlineDate"
                  type="datetime"
                  placeholder="选择日期"
                  format="yyyy-MM-dd HH:mm"
                  value-format="yyyy-MM-dd HH:mm:ss"
                >
                </el-date-picker>
              </el-form-item>
            </el-row>
          </el-form-item>

          <el-form-item label="发卡原因:" prop="cause">
            <el-select v-model="form.cause" placeholder="请选择" clearable>
              <el-option
                v-for="dict in dict.type.sys_normal_disable"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              />
            </el-select>
          </el-form-item>

          <el-form-item label="责任人:">
            <el-row>
              <el-col :span="6">
                <el-form-item prop="status">
                  <el-select
                    v-model="form.status"
                    placeholder="请选择组织架构"
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
              </el-col>
              <el-col :span="6">
                <el-form-item prop="status">
                  <el-select
                    v-model="form.status"
                    placeholder="请选择责任人"
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
              </el-col>
              <el-col :span="8">
                <el-form-item prop="status">
                  <!-- <el-input placeholder="责任金额" size="mini">
                    <template slot="append">元</template>
                  </el-input> -->
                  <el-input-number
                    v-model="form.deadlineDays"
                    placeholder="请输入金额（元）"
                    :min="1"
                    style="width: 200px"
                  >
                  </el-input-number>
                </el-form-item>
              </el-col>
              <el-col :span="4">
                <el-form-item prop="status">
                  <el-button type="primary" size="mini" icon="el-icon-plus"
                    >添加人员</el-button
                  >
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-table :data="tableData" border style="width: 680px">
                  <el-table-column prop="id" label="员工编号" width="120" />
                  <el-table-column prop="name" label="姓名" width="120" />
                  <el-table-column prop="name" label="岗位" />
                  <el-table-column
                    prop="amount1"
                    label="责任金额"
                    width="100"
                    class-name="currency-text"
                  >
                    <template slot-scope="scope">
                      {{ scope.row.amount1 | currency }}
                    </template>
                  </el-table-column>

                  <el-table-column label="操作" align="center">
                    <!-- slot-scope="scope" -->
                    <template>
                      <el-button size="mini" type="text" icon="el-icon-delete"
                        >删除</el-button
                      >
                    </template>
                  </el-table-column>
                </el-table>
              </el-col>
            </el-row>
          </el-form-item>

          <el-form-item label="备注:" prop="remark">
            <el-input
              v-model="form.remark"
              type="textarea"
              placeholder="请输入备注信息"
              maxlength="100"
              show-word-limit
            />
          </el-form-item>
          <el-form-item label="审核状态:"> 待审核 </el-form-item>
        </el-form>
      </div>
    </el-card>
  </div>
</template>

<script>
import { currencyFormat } from '@/utils/currency'
import { currencyReg, phoneReg, positiveNumberReg } from '@/utils/validate'

export default {
  name: 'CardBaseUpgrade',
  dicts: ['sys_normal_disable', 'comm_channel'],
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
.card-base-upgrade {
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .content {
    width: 100%;
    margin: 0 auto;
  }
}
</style>
