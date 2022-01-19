<template>
  <el-dialog
    title="提示"
    :visible.sync="dialogVisible"
    :before-close="handleClose"
  >
    <div slot="title" class="dialog-head">
      <div><svg-icon icon-class="ring" class-name="ring-icon" /> 添加等级</div>
    </div>
    <div class="rank-container">
      <div class="rank-info">
        <fieldset class="form-border">
          <legend>等级信息</legend>
          <el-form ref="baseInfoForm" :model="baseInfo" label-position="right" label-width="135px">
            <el-form-item label="等级名称："   
              prop="levelName"                
              :rules="[
                  { required: true, message: '请输入等级名称', trigger: 'blur' },
              ]">
              <el-input v-model="baseInfo.levelName" placeholder="请输入等级名称，限20个中英文" size="small" maxlength="20"></el-input>
            </el-form-item>
            <el-form-item label="等级层次："
              prop="levelCount"                    
              :rules="[
                  { required: true, message: '请输入等级层次', trigger: 'blur' },
              ]">
              <el-input v-model="baseInfo.levelCount" type="number" placeholder="请输入等级层级值，正整数" size="small" maxlength="20"></el-input>
            </el-form-item>
            <el-form-item label="等级图标：">
              <div class="upload-wrapper">
                <el-upload
                  class="avatar-uploader"
                  :action="uploadFileUrl"
                  :show-file-list="false"
                  :on-success="handleAvatarSuccess"
                  :before-upload="beforeAvatarUpload">
                  <img v-if="imageUrl" :src="imageUrl" class="avatar">
                  <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                </el-upload>
                <div class="upload-tips">
                  <div>提示：单个上传文件最大为500KB</div>
                  <div>支持PNG，JPG，JPEG，BMP，GIF</div>
                </div>
              </div>
            </el-form-item>
            <el-form-item label="审核状态：">
              待提交
            </el-form-item>
          </el-form>
        </fieldset>
      </div>
      <div class="rank-info" style="margin-top:20px">
        <fieldset class="form-border">
          <legend>成长值升级规则</legend>
          <el-form ref="upgradeRuleForm" :model="upgradeRule" label-position="right" label-width="135px">
            <el-form-item label="是否可用："
              prop="isExperienceUd"                     
              :rules="[
                  { required: true, message: '请选择是否可用', trigger: 'change' },
              ]">
              <el-radio-group v-model="upgradeRule.isExperienceUd">
                <el-radio label="0">启用</el-radio>
                <el-radio label="1">停用</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="所需成长值："
              prop="experience"                  
              :rules="[
                  { required: true, message: '请输入成长值', trigger: 'blur' },
              ]">
              <el-input v-model="upgradeRule.experience" type="number" placeholder="请输入达到所需成长值，正整数" size="small" maxlength="20"></el-input>
            </el-form-item>
            <el-form-item label="等级有效期："
              prop="validityType"                    
              :rules="[
                  { required: true, message: '请选择等级有效期', trigger: 'change' },
              ]">
              <el-radio-group v-model="upgradeRule.validityType">
                <div>
                  <el-radio label="1">
                    升级后
                    <el-input
                      class="ml-5"
                      type="number" 
                      placeholder="请输入等级层级值，正整数" size="small" maxlength="20" 
                      style="width:150px;"
                      v-model="date"
                    ></el-input> 天
                  </el-radio>
                  <el-radio label="2">
                    到期日期
                    <el-date-picker
                      v-model="schemeDate"
                      type="date"
                      placeholder="选择日期"
                      size="small"
                      style="width: 150px"
                    >
                    </el-date-picker>
                  </el-radio>
                </div>
                <div><el-radio label="3">永久</el-radio></div>
                </el-radio>
              </el-radio-group>
            </el-form-item>
          </el-form>
        </fieldset>
      </div>
      <!-- 付费升级规则 
        Tips: 一期暂时不做
      -->
      <!-- <div class="pay-update-rule" style="margin-top:20px">
        <fieldset class="form-border">
          <legend>付费升级规则</legend>
          <el-form :model="baseInfo" label-position="right" label-width="135px">
            <el-form-item label="是否可用：" :required="true">
              <el-radio-group v-model="radio">
                <el-radio :label="3">启用</el-radio>
                <el-radio :label="6">停用</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="所需成长值：" :required="true">
              <el-input v-model="input" type="number" placeholder="请输入达到所需成长值，正整数" size="small" maxlength="20"></el-input>
            </el-form-item>
            <el-form-item label="等级有效期：">
              <el-radio-group v-model="radio">
                <el-radio :label="3">
                  升级后<el-input v-model="input" placeholder="请输入等级层级值，正整数" size="small" maxlength="20"></el-input>

                </el-radio>
                <el-radio :label="6">永久</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-form>
        </fieldset>
      </div>
      <div class="group-rule" style="margin-top:20px">
        <fieldset class="form-border">
          <legend>群体规则</legend>
          <el-form :model="baseInfo" label-position="right" label-width="135px">
            <el-form-item label="是否可用：" :required="true">
              <el-radio-group v-model="radio">
                <el-radio :label="3">启用</el-radio>
                <el-radio :label="6">停用</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="等级有效期：">
              <el-radio-group v-model="radio">
                <el-radio :label="3">
                  升级后<el-input v-model="input" placeholder="请输入等级层级值，正整数" size="small" maxlength="20"></el-input>

                </el-radio>
                <el-radio :label="6">永久</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="升级群体：" :required="true">
              <div><el-button type="primary" size="mini" icon="el-icon-plus" @click="handleAdd">添加等级</el-button></div>
              <div></div>
            </el-form-item>
          </el-form>
        </fieldset>
      </div> -->
      <div class="demotion-rule" style="margin-top:20px; margin-bottom: 2px;">
        <fieldset class="form-border">
          <legend>降级规则</legend>
          <el-form ref="degradeRuleForm" :model="degradeRule" label-position="right" label-width="135px">
            <el-form-item label="等级有效期过期："
              prop="dropRules"                    
              :rules="[
                  { required: true, message: '请选择降级规则', trigger: 'change' },
              ]">
              <el-radio-group v-model="degradeRule.dropRules">
                <el-radio label="1">重新判定等级</el-radio>
                <el-radio label="2">默认下一等级</el-radio>
                <el-radio label="3">
                  降级至 
                  <el-select v-model="demotionLevel" placeholder="请选择等级" size="small" style="width: 240px">
                    <el-option
                      v-for="item in levelList"
                      :key="item.id"
                      :label="item.schemeName"
                      :value="item.id | valToString"
                      >
                    </el-option>
                  </el-select>
                </el-radio>
              </el-radio-group>
            </el-form-item>
          </el-form>
        </fieldset>
      </div>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary"  @click="submitForm" size="mini">保存</el-button>
    </div>
  </el-dialog>
</template>
<script>
  import { cloneDeep } from 'lodash';
  import {
    getSchemeLeveList, addSchemeLevel
  } from '@/api/member/schemeLevel';
  export default {
    props: {
      schemeId: {
        type: String
      }
    },
    data() {
      return {
        dialogVisible: false,
        uploadFileUrl: process.env.VUE_APP_BASE_API + "/file/upload",
        baseInfo: {isChecked: false},
        upgradeRule: {isChecked: false},
        degradeRule: {isChecked: false},
        imageUrl: '',
        schemeDate: '',
        demotionLevel: '',
        levelList: [],
        date: ''
      };
    },
    created() {

    },
    methods: {
      fetchLevel() {
        getSchemeLeveList(this.schemeId).then(res => {
          this.levelList = res.data
        })
      },
      handleClose() {
        console.log('handleClose')
        this.$confirm('确认关闭？')
          .then(_ => {
            this.closeDialogEimt()
          })
      },
      showDialog() {
        this.fetchLevel()
        this.dialogVisible = true;
      },
      closeDialogEimt() {
        this.dialogVisible = false;
      },
      handleAvatarSuccess(res, file) {
          this.imageUrl = URL.createObjectURL(file.raw);
      },
      beforeAvatarUpload(file) {
        const isJPG = ["image/png", "image/jpeg", "image/jpg"].indexOf(file.type) == -1 ? 0 : 1;
        const isLt500KB = file.size / 1024 < 500;

        if (!isJPG) {
          this.$message.error('图片只能是PNG,JPG或JPEG 格式!');
        }
        if (!isLt500KB) {
          this.$message.error('上传头像图片大小不能超过 500KB!');
        }
        return isLt500KB;
      },
      checkForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if(formName == 'baseInfoForm') this.baseInfo.isChecked = true
            if(formName == 'upgradeRuleForm') this.upgradeRule.isChecked = true
            if(formName == 'degradeRuleForm') this.degradeRule.isChecked = true
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },

      // 提交表单
      submitForm() {
        this.checkForm('baseInfoForm')
        this.checkForm('upgradeRuleForm')
        this.checkForm('degradeRuleForm')
        if(this.baseInfo.isChecked && this.upgradeRule.isChecked && this.degradeRule.isChecked) {
          const addSchemeParmas = {...this.baseInfo, ...this.upgradeRule, ...this.degradeRule}
          addSchemeParmas.imageUrl = this.imageUrl
                    console.log(this)
          console.log(this.schemeId)
          addSchemeParmas.schemeRuleId = this.schemeId
          const cloneSchemeRuleParmas = cloneDeep(addSchemeParmas)
          cloneSchemeRuleParmas.experience = parseInt(cloneSchemeRuleParmas.experience)
          addSchemeLevel(cloneSchemeRuleParmas).then(res => {
            this.dialogVisible = false
            this.$emit('addRankSuccess')
          })
        }
      }
    }
  };
</script>
<style lang="scss">
  .ring-icon {
    margin-right: 5px;
    font-size: 12px;
  }
  .rank-container {
    overflow-y: scroll;
    max-height: 460px;
  }
  .upload-wrapper {
    display: flex;
    align-items: center;
    line-height: 10px;
    .upload-tips {
      margin-left: 12px;
      font-size: 12px;
      line-height: 20px;
    }
  }
  .el-radio {
    margin-bottom: 5px;
  }
</style>