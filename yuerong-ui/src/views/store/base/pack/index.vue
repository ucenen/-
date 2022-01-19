<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="套餐名称" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入套餐名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="套餐编号" prop="code">
        <el-input
          v-model="queryParams.code"
          placeholder="请输入套餐编号"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="套餐分类" prop="classIdArr">
        <el-cascader v-model="queryParams.classIdArr" :options="classOptions" clearable size="small"></el-cascader>
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="请选择状态" clearable size="small">
          <el-option
            v-for="dict in dict.type.sys_normal_disable"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['store:pack:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['store:pack:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['store:pack:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleCopy"
          v-hasPermi="['store:pack:add']"
        >复制</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['store:pack:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList" :columns="columns"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="packList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="套餐编号" v-if="columns[0].visible" align="center" prop="code" width="130" />
      <el-table-column label="套餐名称" v-if="columns[1].visible" align="center" prop="name" :show-overflow-tooltip="true" />
      <el-table-column label="分类" v-if="columns[2].visible" align="center" prop="packClass.name" width="150" :show-overflow-tooltip="true" />
      <el-table-column label="套餐内容" v-if="columns[3].visible" align="center" prop="itemVos" width="100">
        <template slot-scope="scope">
          <span v-if="scope.row.itemVos">
            <el-popover
              placement="bottom"
              width="450"
              trigger="hover">
              <el-table :data="scope.row.itemVos">
                <el-table-column property="name" label="项目">
                  <template slot-scope="scope">
                    {{ scope.row.name }}
                    <span v-if="scope.row.children">
                      <el-tooltip class="item" effect="light" placement="bottom-start">
                          <span slot="content" v-for="(item,i) in scope.row.children">
                            {{ i+1 }}.{{ item.name }}, {{ item.num }}<br>
                          </span>
                          <i class="el-icon-caret-bottom el-icon--right"></i>
                      </el-tooltip>
                    </span>
                  </template>
                </el-table-column>
                <el-table-column width="60" property="num" label="数量"></el-table-column>
                <el-table-column property="val" label="有效期" :show-overflow-tooltip="true" ></el-table-column>
              </el-table>
              <el-button type="text" slot="reference">{{ scope.row.itemVos.length }}项<i class="el-icon-caret-bottom el-icon--right"></i></el-button>
            </el-popover>
          </span>
          <span v-else>
                                    无
          </span>
        </template>
      </el-table-column>
      <el-table-column label="销售价(元)" v-if="columns[4].visible" align="center" prop="salePrice" width="120"/>
      <el-table-column label="会员价(元)" v-if="columns[5].visible" align="center" prop="memberPrice" width="120"/>
      <el-table-column label="总标准价(元)" v-if="columns[6].visible" align="center" prop="standardPrice" width="120"/>
      <el-table-column label="固定成本" v-if="columns[7].visible" align="center" prop="cost" :formatter="costFormatter" width="110"/>
      <el-table-column label="管理品牌" v-if="columns[8].visible" align="center" prop="dept.deptName" width="100"/>
      <el-table-column label="业绩归属部门" v-if="columns[9].visible" align="center" prop="perfToDept" width="120">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.sys_dept_group" :value="scope.row.perfToDept"/>
        </template>
      </el-table-column>
      
      <el-table-column label="是否允许赠送" v-if="columns[10].visible" align="center" prop="givable" width="120">
        <template slot-scope="scope">
          <span v-if="scope.row.givable == '0'">是</span>
          <span v-else>否</span>
        </template>
      </el-table-column>
      <el-table-column label="上下架时间" v-if="columns[11].visible" align="center" prop="putawayStartTime" width="220">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.putawayStartTime, '{y}-{m}-{d}') }} ~ </span>
          <span v-if="scope.row.putawayEndTime">
            {{ parseTime(scope.row.putawayEndTime, '{y}-{m}-{d}') }}
          </span>
          <span v-else>N/A</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" v-if="columns[12].visible" align="center" prop="status" width="80">
       <template slot-scope="scope">
          <dict-tag :options="dict.type.sys_normal_disable" :value="scope.row.status"/>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="120" fixed="right">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['store:pack:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['store:pack:remove']"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    
    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改套餐对话框 -->
    <el-drawer
      :title="title"
      :visible.sync="open"
      direction="rtl"
      :wrapperClosable="false"
      :size="700"
      ref="drawer"
      class="myform"
      >
      <el-form ref="form" :model="form" :rules="rules" label-width="auto">
        <el-form-item label="套餐名称" prop="name">
          <el-input v-model="form.name" @blur="form.name=$event.target.value.trim()" placeholder="请输入套餐名称" maxlength="100" show-word-limit size="small"/>
        </el-form-item>
        <el-form-item label="管理品牌" prop="deptId">
          <el-select v-model="form.deptId" placeholder="请选择" size="small" style="width:100%" clearable filterable>
            <el-option
              v-for="brand in brandList"
              :key="brand.deptId"
              :label="brand.deptName"
              :value="brand.deptId">{{brand.deptName}}
            </el-option>
          </el-select>
        </el-form-item>
        <el-tabs @tab-click="handleTabClick" v-model="curTab">
          <el-tab-pane label="基础设置" name="base">
            <el-row>
              <el-col :span="12">
                <el-form-item label="套餐编号" prop="code">
                  <el-input v-model.trim="form.code" placeholder="请输入套餐编号" maxlength="20" show-word-limit size="small" @change="chkPackCode"/>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="分类" prop="classIdArr">
                  <el-cascader v-model="form.classIdArr" :options="classOptions" clearable size="small" :show-all-levels="false"></el-cascader>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="销售价" prop="salePrice">
                  <el-input v-model="form.salePrice" placeholder="请输入销售价" size="small" maxlength="24">
                    <template slot="append">元</template>
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="会员价" prop="memberPrice">
                  <el-input v-model="form.memberPrice" placeholder="请输入会员价" size="small" maxlength="24">
                    <template slot="append">元</template>
                  </el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="固定成本" prop="cost">
                  <el-input placeholder="请输入固定成本" v-model="form.cost" class="input-with-select" size="small" maxlength="24">
                    <el-select v-model="form.costUnit" slot="append" size="small">
                      <el-option
                        v-for="dict in dict.type.unit_yuan_percent"
                        :key="dict.value"
                        :label="dict.label"
                        :value="dict.value"
                      />
                    </el-select>
                  </el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-form-item label="" prop="valid">
              <span slot="label">
                                                项目默认有效期
                <el-tooltip content="将作为搭配的服务和商品的默认初始值，可在具体项目里修改。下同" placement="top">
                  <i class="el-icon-question"></i>
                </el-tooltip>
              </span>
              <el-radio-group v-model="form.validType">
                 <el-radio
                   v-for="t in validTypeOptions"
                   :key="t.value"
                   :label="t.value"
                  >{{t.label}}</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item>
              <el-input v-if="form.validType === 1" placeholder="不填则永久有效" v-model="form.relativeValidDays" class="input-with-select relativeType" size="small" style="width:300px">
                <el-select v-model="form.relativeType" slot="prepend" placeholder="请选择">
                  <el-option
                        v-for="d in relativeTypeOptions"
                        :key="d.value"
                        :label="d.label"
                        :value="d.value"/>
                </el-select>
                <template slot="append">天</template>
              </el-input>
              <el-date-picker
                  v-if="form.validType === 2"
                  v-model="form.validTime"
                  type="daterange"
                  align="right"
                  unlink-panels
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期" 
                  :default-time="['00:00:00', '23:59:59']"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  @input="validTimeChange">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="默认生效方式" prop="effective" v-if="form.validType === 1">
              <el-radio-group v-model="form.effectiveType">
                 <el-radio :label="1">购买即生效</el-radio>
                 <el-radio :label="2">购买
                   <el-input v-model="form.effectiveDays" :disabled="form.effectiveType == 1" maxlength="3" size="small" oninput="value=value.replace(/[^\d]/g,'')" style="width:66px"/>天后生效
                 </el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="默认不可用日期" prop="unavailable">
              <el-radio-group v-model="form.unavailableType">
                 <el-radio
                       v-for="t in unavailableTypeOptions"
                       :key="t.value"
                       :label="t.value"
                      >{{t.label}}</el-radio>
              </el-radio-group>
              &nbsp;&nbsp;<el-button type="warning" :disabled="form.unavailableType == 1" @click="handleUnavailableDefault" size="mini" plain round>设置</el-button>
            </el-form-item>
            <el-row>
              <el-col :span="12">
                <el-form-item label="业绩归属部门" prop="perfToDept">
                  <el-select v-model="form.perfToDept" clearable size="small">
                    <el-option
                        v-for="dict in dict.type.sys_dept_group"
                        :key="parseInt(dict.value)"
                        :label="dict.label"
                        :value="parseInt(dict.value)"
                      />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item prop="payment">
                  <span slot="label">
                    <el-tooltip content="选择一级分类时，代表支持其下面所有支付方式（包括以后新增的支付方式）" placement="top">
                      <i class="el-icon-question"></i>
                    </el-tooltip>
                                                            关联支付方式
                  </span>
                  <el-cascader v-model="form.paymentIds" :options="paymentOptions" :props="{ multiple: true, checkStrictly: true }" collapse-tags clearable size="small"></el-cascader>
                </el-form-item>
              </el-col>
            </el-row>
            <el-form-item label="上架时间" prop="putawayTime">
              <el-date-picker
                  v-model="form.putawayTime"
                  type="daterange"
                  align="right"
                  unlink-panels
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期" 
                  :default-time="['00:00:00', '23:59:59']"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  @input="putawayTimeChange">
              </el-date-picker>
            </el-form-item>
            <el-row>
              <el-col :span="12">
                <el-form-item label="是否允许赠送">
                  <el-radio-group v-model="form.givable">
                    <el-radio
                       v-for="t in givableOptions"
                       :key="t.value"
                       :label="t.value"
                      >{{t.label}}</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="状态">
                  <el-radio-group v-model="form.status">
                    <el-radio
                      v-for="dict in dict.type.sys_normal_disable"
                      :key="dict.value"
                      :label="dict.value"
                    >{{dict.label}}</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
            </el-row>
            <el-form-item label="套餐图片" prop="" label-width="auto">
              <div class="imgUpload">
                <el-upload
                  :class="{ disUoloadSty: noneBtnImg }"
                  multiple
                  ref="upload"
                  :action="uploadFileUrl"
                  :headers="headers"
                  list-type="picture-card"
                  :file-list="fileList"
                  :limit="6"
                  :on-change="handleFileChange"
                  :on-preview="handlePictureCardPreview"
                  :on-exceed="handleFileOverstep"
                  :on-remove="handleFileRemove"
                  :before-upload="beforeFileUpload"
                  :on-success="handleFileUploadSuccess"
                  accept="image/png,image/jpeg,image/jpg"
                >
                  <i class="el-icon-plus"></i>
                  <div slot="tip" class="el-upload__tip">
                    <span>1、支持图片格式：JPG/JPEG/PNG</span><br>
                    <span>2、建议尺寸：750*750 像素，大小不能超过1MB，最多6张</span>
                  </div>
                </el-upload>
                <el-dialog :visible.sync="dialogVisible" :modal="false">
                  <img width="100%" :src="dialogImageUrl" alt="" />
                </el-dialog>
              </div>  
            </el-form-item>
            <el-form-item label="开卡协议">
              <el-switch
                v-model="form.cardAgreementSwitch"
                active-value="1"
                inactive-value="0">
              </el-switch>
            </el-form-item>
            <el-form-item label="" prop="cardAgreement">
              <el-input v-model="form.cardAgreement" type="textarea" placeholder="请输入开卡协议" :rows="8" maxlength="1000" show-word-limit />
            </el-form-item>
            <el-form-item label="卖点描述" prop="description">
              <el-input v-model="form.description" type="textarea" placeholder="请输入卖点描述" :rows="5" maxlength="300" show-word-limit />
            </el-form-item>
            <el-form-item label="套餐简介" prop="remark">
              <editor v-model="form.remark" :height="200"/>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="搭配服务" name="service" v-if="this.form.id">
            <el-row :gutter="10" class="mb8">
              <el-col :span="1.5">
                <el-button type="primary" icon="el-icon-plus" size="mini" @click="handleAddService" v-hasPermi="['store:pack:add']">添加服务</el-button>
              </el-col>
              <el-col :span="5" style="margin-top:10px">
                <span class="mytotal">共 {{ packServiceList.length }} 项服务</span>
              </el-col>
            </el-row>
            
            <div class="psDiv">
            <!-- div v-for="item in packServiceList" v-bind:key="item.id" -->
            <div v-for="(item,index) in packServiceList" :key="packServiceList.length">
              <el-card class="box-card">
                  <div slot="header" class="clearfix">
                    <span>{{index+1}}、<b>{{ item.service.name }}</b>（标准价：{{ item.service.standardPrice }}元）</span>
                    <span style="float:right;padding: 3px 0"> 
                      <el-button 
                        type="text"@click="handleUpdateService(item)"
                        v-hasPermi="['store:pack:edit']">修改</el-button>
                      <el-button 
                        type="text"
                        class="danger"
                        @click="handleDeleteService(item)"
                        v-hasPermi="['store:pack:remove']">删除</el-button>
                    </span>
                  </div>
                  <div class="text item">
                    <el-row :gutter="12">
                      <el-col :span="6">{{'销售价：' + item.salePrice + '元' }}</el-col>
                      <el-col :span="4">{{'数量：' + (item.num?item.num:'不限量') }}</el-col>
                      <el-col :span="14">
                                                                      有效期：
                       <span v-if="item.validType == 1"> 
                         <span v-if="item.relativeValidDays > 0">
                           <span v-if="item.relativeType == 2">
                                                                                       首次使用后
                           </span>
                           {{ item.relativeValidDays }}天
                         </span>
                         <span v-else>
                                                                                 永久有效
                         </span>
                         <span v-if="item.effectiveType == 2 && item.effectiveDays > 0">
                           {{ '（购买' + item.effectiveDays + '天后生效）' }}
                         </span>
                       </span>
                       <span v-else>
                         <span v-if="item.validStartTime">
                           {{ parseTime(item.validStartTime, '{y}-{m}-{d}') }} ~ {{ parseTime(item.validEndTime, '{y}-{m}-{d}') }}
                         </span>
                         <span v-else>永久有效</span>
                       </span>
                      </el-col>
                    </el-row>
                  </div>
              </el-card>
             </div>
            </div>
            <!-- 添加或修改套餐服务对话框 -->
            <el-dialog :title="titleService" class="myform" :visible.sync="openService" width="500px" append-to-body :close-on-click-modal="false">
              <el-form ref="formService" :model="formService" :rules="rulesService" label-width="auto">
                <el-input type="hidden" v-model="formService.packId" />
                <el-form-item label="选择服务" prop="serviceIdArr">
                  <el-cascader v-model="formService.serviceIdArr" :options="serviceOptions" :show-all-levels="false" clearable size="small" style="width:100%" @change="changeService"></el-cascader>
                </el-form-item>
                <el-form-item label="销售价" prop="salePrice">
                  <el-input v-model="formService.salePrice" placeholder="请输入销售价" size="small" maxlength="24">
                    <template slot="append">元</template>
                  </el-input>
                </el-form-item>
                <el-form-item label="数量" prop="num">
                  <el-input v-model="formService.num" placeholder="不填则不限数量" size="small" oninput="value=value.replace(/[^\d]/g,'')"/>
                </el-form-item>
                <el-form-item label="服务有效期" prop="valid">
                  <el-radio-group v-model="formService.validType">
                     <el-radio
                       v-for="t in validTypeOptions"
                       :key="t.value"
                       :label="t.value"
                      >{{t.label}}</el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-form-item>
                  <el-input v-if="formService.validType === 1" placeholder="不填则永久有效" v-model="formService.relativeValidDays" class="input-with-select relativeType" size="small" style="width:300px">
                    <el-select v-model="formService.relativeType" slot="prepend" placeholder="请选择">
                      <el-option
                            v-for="d in relativeTypeOptions"
                            :key="d.value"
                            :label="d.label"
                            :value="d.value"/>
                    </el-select>
                    <template slot="append">天</template>
                  </el-input>
                  <el-date-picker
                      v-if="formService.validType === 2"
                      v-model="formService.validTime"
                      type="daterange"
                      align="right"
                      unlink-panels
                      range-separator="至"
                      start-placeholder="开始日期"
                      end-placeholder="结束日期" 
                      :default-time="['00:00:00', '23:59:59']"
                      value-format="yyyy-MM-dd HH:mm:ss"
                      @input="validTimeChangeService">
                  </el-date-picker>
                </el-form-item>
                <el-form-item label="生效方式" prop="effective" v-if="formService.validType === 1">
                  <el-radio-group v-model="formService.effectiveType">
                     <el-radio :label="1">购买即生效</el-radio>
                     <el-radio :label="2">购买
                       <el-input v-model="formService.effectiveDays" :disabled="formService.effectiveType == 1" maxlength="3" size="small" oninput="value=value.replace(/[^\d]/g,'')" style="width:66px"/>天后生效
                     </el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-form-item label="不可用日期" prop="unavailable">
                  <el-radio-group v-model="formService.unavailableType">
                     <el-radio
                       v-for="t in unavailableTypeOptions"
                       :key="t.value"
                       :label="t.value"
                      >{{t.label}}</el-radio>
                  </el-radio-group>
                  &nbsp;&nbsp;<el-button type="warning" :disabled="formService.unavailableType == 1" @click="handleUnavailableService" size="mini" plain round>设置</el-button>
                </el-form-item>
              </el-form>
              <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="submitFormService">保 存</el-button>
                <el-button @click="cancelService">取 消</el-button>
              </div>
            </el-dialog>
            
            <el-divider></el-divider>
            <el-row :gutter="10" class="mb8">
              <el-col :span="1.5">
                <el-button type="primary" icon="el-icon-plus" size="mini" @click="handleAddMultiple" v-hasPermi="['store:pack:add']">多选服务</el-button>
              </el-col>
              <el-col :span="5" style="margin-top:10px">
                <span class="mytotal">共 {{ packMultipleList.length }} 项多选服务组</span>
              </el-col>
            </el-row>
            
            <div class="psDiv">
            <div v-for="(item,index) in packMultipleList" :key="packMultipleList.length">
              <el-card class="box-card">
                  <div slot="header" class="clearfix">
                    <el-row :gutter="6">
                      <el-col :span="8">{{index+1}}、<b>{{ item.name }}</b></el-col>
                      <el-col :span="5">{{'销售价：' + item.salePrice }}</el-col>
                      <el-col :span="5">{{'总次数：' + item.useTotal }}</el-col>
                      <el-col :span="6">
                        <el-button 
                            type="text" @click="handleUpdateMultiple(item)"
                            v-hasPermi="['store:pack:edit']">修改</el-button>
                          <el-button 
                            type="text"
                            class="danger"
                            @click="handleDeleteMultiple(item)"
                            v-hasPermi="['store:pack:remove']">删除</el-button>
                          <el-button 
                            type="text" @click="handleAddMultipleDetail(item)"
                            v-hasPermi="['store:pack:add']">添加服务</el-button>
                      </el-col>
                    </el-row>
                  </div>
                  <div class="text item">
                    <el-table :data="item.detailList">
                      <el-table-column width="150" property="service.name" label="服务名" :show-overflow-tooltip="true" ></el-table-column>
                      <el-table-column width="100" property="service.code" label="服务编号" :show-overflow-tooltip="true"></el-table-column>
                      <el-table-column width="98" property="maxUse" label="最多核销次数"></el-table-column>
                      <el-table-column width="100" property="validTime" label="有效期" :show-overflow-tooltip="true">
                        <template slot-scope="scope">
                          <span v-if="scope.row.validType == 1"> 
                             <span v-if="scope.row.relativeValidDays > 0">
                               <span v-if="scope.row.relativeType == 2">
                                                                                           首次使用后
                               </span>
                               {{ scope.row.relativeValidDays }}天
                             </span>
                             <span v-else>
                                                                                     永久有效
                             </span>
                             <span v-if="scope.row.effectiveType == 2 && scope.row.effectiveDays > 0">
                               {{ '（购买' + scope.row.effectiveDays + '天后生效）' }}
                             </span>
                           </span>
                           <span v-else>
                             <span v-if="scope.row.validStartTime">
                               {{ parseTime(scope.row.validStartTime, '{y}-{m}-{d}') }} ~ {{ parseTime(scope.row.validEndTime, '{y}-{m}-{d}') }}
                             </span>
                             <span v-else>永久有效</span>
                           </span>
                        </template>
                      </el-table-column>
                      <el-table-column property="period" label="核销周期" :show-overflow-tooltip="true">
                        <template slot-scope="scope" v-if="scope.row.periodUseNum">
                          <span v-if="scope.row.periodType == 1">每年{{'可核销' + scope.row.periodUseNum +'次'}}</span>
                          <span v-if="scope.row.periodType == 2">每月{{'可核销' + scope.row.periodUseNum +'次'}}</span>
                          <span v-if="scope.row.periodType == 3">每日{{'可核销' + scope.row.periodUseNum +'次'}}</span>
                        </template>
                      </el-table-column>
                      <el-table-column label="操作" align="center" width="80" class-name="small-padding" fixed="right">
                        <template slot-scope="scope">
                          <el-button
                            size="mini"
                            type="text"
                            @click="handleUpdateMultipleDetail(scope.row)"
                            v-hasPermi="['store:pack:edit']"
                          >修改</el-button>
                          <el-button
                            size="mini"
                            type="text"
                            @click="handleDeleteMultipleDetail(scope.row)"
                            v-hasPermi="['store:pack:remove']"
                          >删除</el-button>
                        </template>
                      </el-table-column>
                    </el-table>
                  </div>
              </el-card>
             </div>
            </div>
            
            <el-dialog :title="titleMultiple" class="myform" :visible.sync="openMultiple" width="380px" append-to-body :close-on-click-modal="false">
              <el-form ref="formMultiple" :model="formMultiple" :rules="rulesMultiple" label-width="auto">
                <el-input type="hidden" v-model="formMultiple.packId" />
                <el-form-item label="名称" prop="name">
                  <el-input v-model="formMultiple.name" @blur="formMultiple.name=$event.target.value.trim()" placeholder="请输入名称" size="small"/>
                </el-form-item>
                <el-form-item label="销售价" prop="salePrice">
                  <el-input v-model="formMultiple.salePrice" placeholder="请输入销售价" size="small" maxlength="24">
                    <template slot="append">元</template>
                  </el-input>
                </el-form-item>
                <el-form-item label="总核销次数" prop="useTotal">
                  <el-input v-model="formMultiple.useTotal" placeholder="" size="small" oninput="value=value.replace(/[^\d]/g,'')"/>
                </el-form-item>
              </el-form>
              <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="submitFormMultiple">保 存</el-button>
                <el-button @click="cancelMultiple">取 消</el-button>
              </div>
            </el-dialog>
            
            <el-dialog :title="titleMultipleDetail" class="myform" :visible.sync="openMultipleDetail" width="500px" append-to-body :close-on-click-modal="false">
              <el-form ref="formMultipleDetail" :model="formMultipleDetail" :rules="rulesMultipleDetail" label-width="auto">
                <el-input type="hidden" v-model="formMultipleDetail.multipleId" />
                <el-form-item label="选择服务" prop="serviceIdArr">
                  <el-cascader v-model="formMultipleDetail.serviceIdArr" :options="serviceOptions" :show-all-levels="false" clearable size="small" style="width:100%"></el-cascader>
                </el-form-item>
                <!-- el-form-item label="销售价" prop="salePrice">
                  <el-input v-model="formMultipleDetail.salePrice" placeholder="请输入销售价" size="small">
                    <template slot="append">元</template>
                  </el-input>
                </el-form-item -->
                <el-form-item label="最多核销" prop="maxUse">
                  <el-input v-model="formMultipleDetail.maxUse" placeholder="" size="small" maxlength="3" oninput="value=value.replace(/[^\d]/g,'')">
                    <template slot="append">次</template>
                  </el-input>
                </el-form-item>
                <el-form-item label="核销规则" prop="period" style="line-height:35px">
                                                        每 <el-select v-model="form.relativeType" placeholder="请选择" size="small" style="width:70px">
                      <el-option
                        v-for="d in periodTypeOptions"
                        :key="d.value"
                        :label="d.label"
                        :value="d.value"/>
                    </el-select>
                                                            可核销
                    <el-input v-model="formMultipleDetail.periodUseNum" placeholder="" size="small" maxlength="3" oninput="value=value.replace(/[^\d]/g,'')" style="width:150px">
                      <template slot="append">次</template>
                    </el-input>
                </el-form-item>
                <el-form-item label="服务有效期" prop="valid">
                  <el-radio-group v-model="formMultipleDetail.validType">
                     <el-radio
                       v-for="t in validTypeOptions"
                       :key="t.value"
                       :label="t.value"
                      >{{t.label}}</el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-form-item>
                  <el-input v-if="formMultipleDetail.validType === 1" placeholder="不填则永久有效" v-model="formMultipleDetail.relativeValidDays" class="input-with-select relativeType" size="small" style="width:300px">
                    <el-select v-model="formMultipleDetail.relativeType" slot="prepend" placeholder="请选择">
                      <el-option
                            v-for="d in relativeTypeOptions"
                            :key="d.value"
                            :label="d.label"
                            :value="d.value"/>
                    </el-select>
                    <template slot="append">天</template>
                  </el-input>
                  <el-date-picker
                      v-if="formMultipleDetail.validType === 2"
                      v-model="formMultipleDetail.validTime"
                      type="daterange"
                      align="right"
                      unlink-panels
                      range-separator="至"
                      start-placeholder="开始日期"
                      end-placeholder="结束日期" 
                      :default-time="['00:00:00', '23:59:59']"
                      value-format="yyyy-MM-dd HH:mm:ss"
                      @input="validTimeChangeMultipleDetail">
                  </el-date-picker>
                </el-form-item>
                <el-form-item label="生效方式" prop="effective" v-if="formMultipleDetail.validType === 1">
                  <el-radio-group v-model="formMultipleDetail.effectiveType">
                     <el-radio :label="1">购买即生效</el-radio>
                     <el-radio :label="2">购买
                       <el-input v-model="formMultipleDetail.effectiveDays" :disabled="formMultipleDetail.effectiveType == 1" maxlength="3" size="small" oninput="value=value.replace(/[^\d]/g,'')" style="width:66px"/>天后生效
                     </el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-form-item label="不可用日期" prop="unavailable">
                  <el-radio-group v-model="formMultipleDetail.unavailableType">
                     <el-radio
                       v-for="t in unavailableTypeOptions"
                       :key="t.value"
                       :label="t.value"
                      >{{t.label}}</el-radio>
                  </el-radio-group>
                  &nbsp;&nbsp;<el-button type="warning" :disabled="formMultipleDetail.unavailableType == 1" @click="handleUnavailableMultiple" size="mini" plain round>设置</el-button>
                </el-form-item>
              </el-form>
              <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="submitFormMultipleDetail">保 存</el-button>
                <el-button @click="cancelMultipleDetail">取 消</el-button>
              </div>
            </el-dialog>
            
          </el-tab-pane>
          
          <el-tab-pane label="搭配商品" name="goods" v-if="this.form.id">
            <el-row :gutter="10" class="mb8">
              <el-col :span="1.5">
                <el-button type="primary" icon="el-icon-plus" size="mini" @click="handleAddGoods" v-hasPermi="['store:pack:add']">添加商品</el-button>
              </el-col>
              <el-col :span="5" style="margin-top:10px">
                <span class="mytotal">共 {{ packGoodsList.length }} 个商品</span>
              </el-col>
            </el-row>
            
            <div v-for="(item,index) in packGoodsList" :key="packGoodsList.length">
              <el-card class="box-card">
                  <div slot="header" class="clearfix">
                    <span>{{index+1}}、<b>{{ item.goods.name }}</b>（标准价：{{ item.goods.standardPrice }}元）</span>
                    <span style="float:right;padding: 3px 0"> 
                      <el-button 
                        type="text"@click="handleUpdateGoods(item)"
                        v-hasPermi="['store:pack:edit']">修改</el-button>
                      <el-button 
                        type="text"
                        @click="handleDeleteGoods(item)"
                        v-hasPermi="['store:pack:remove']">删除</el-button>
                    </span>
                  </div>
                  <div class="text item">
                    <el-row :gutter="12">
                      <el-col :span="6">{{'销售价：' + item.salePrice + '元' }}</el-col>
                      <el-col :span="4">{{'数量：' + (item.num?item.num:'不限量') }}</el-col>
                      <el-col :span="14">
                                                                      有效期：
                       <span v-if="item.validType == 1"> 
                         <span v-if="item.relativeValidDays > 0">
                           <span v-if="item.relativeType == 2">
                                                                                       首次使用后
                           </span>
                           {{ item.relativeValidDays }}天
                         </span>
                         <span v-else>
                                                                                 永久有效
                         </span>
                         <span v-if="item.effectiveType == 2 && item.effectiveDays > 0">
                           {{ '（购买' + item.effectiveDays + '天后生效）' }}
                         </span>
                       </span>
                       <span v-else>
                         <span v-if="item.validStartTime">
                           {{ parseTime(item.validStartTime, '{y}-{m}-{d}') }} ~ {{ parseTime(item.validEndTime, '{y}-{m}-{d}') }}
                         </span>
                         <span v-else>永久有效</span>
                       </span>
                      </el-col>
                    </el-row>
                  </div>
              </el-card>
            </div>
            <!-- 添加或修改套餐商品对话框 -->
            <el-dialog :title="titleGoods" class="myform" :visible.sync="openGoods" width="500px" append-to-body :close-on-click-modal="false">
              <el-form ref="formGoods" :model="formGoods" :rules="rulesGoods" label-width="auto">
                <el-input type="hidden" v-model="formGoods.packId" />
                <el-form-item label="选择商品" prop="goodsIdArr">
                  <el-cascader v-model="formGoods.goodsIdArr" :options="goodsOptions" :show-all-levels="false" clearable size="small" style="width:100%" @change="changeGoods"></el-cascader>
                </el-form-item>
                <el-form-item label="销售价" prop="salePrice">
                  <el-input v-model="formGoods.salePrice" placeholder="请输入销售价" size="small" maxlength="24">
                    <template slot="append">元</template>
                  </el-input>
                </el-form-item>
                <el-form-item label="数量" prop="num">
                  <el-input v-model="formGoods.num" placeholder="不填则不限数量" size="small" oninput="value=value.replace(/[^\d]/g,'')"/>
                </el-form-item>
                <el-form-item label="服务有效期" prop="valid">
                  <el-radio-group v-model="formGoods.validType">
                     <el-radio
                       v-for="t in validTypeOptions"
                       :key="t.value"
                       :label="t.value"
                      >{{t.label}}</el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-form-item>
                  <el-input v-if="formGoods.validType === 1" placeholder="不填则永久有效" v-model="formGoods.relativeValidDays" class="input-with-select relativeType" size="small" style="width:300px">
                    <el-select v-model="formGoods.relativeType" slot="prepend" placeholder="请选择">
                      <el-option
                            v-for="d in relativeTypeOptions"
                            :key="d.value"
                            :label="d.label"
                            :value="d.value"/>
                    </el-select>
                    <template slot="append">天</template>
                  </el-input>
                  <el-date-picker
                      v-if="formGoods.validType === 2"
                      v-model="formGoods.validTime"
                      type="daterange"
                      align="right"
                      unlink-panels
                      range-separator="至"
                      start-placeholder="开始日期"
                      end-placeholder="结束日期" 
                      :default-time="['00:00:00', '23:59:59']"
                      value-format="yyyy-MM-dd HH:mm:ss"
                      @input="validTimeChangeGoods">
                  </el-date-picker>
                </el-form-item>
                <el-form-item label="生效方式" prop="effective" v-if="formGoods.validType === 1">
                  <el-radio-group v-model="formGoods.effectiveType">
                     <el-radio :label="1">购买即生效</el-radio>
                     <el-radio :label="2">购买
                       <el-input v-model="formGoods.effectiveDays" :disabled="formGoods.effectiveType == 1" maxlength="3" size="small" oninput="value=value.replace(/[^\d]/g,'')" style="width:66px"/>天后生效
                     </el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-form-item label="不可用日期" prop="unavailable">
                  <el-radio-group v-model="formGoods.unavailableType">
                     <el-radio
                       v-for="t in unavailableTypeOptions"
                       :key="t.value"
                       :label="t.value"
                      >{{t.label}}</el-radio>
                  </el-radio-group>
                  &nbsp;&nbsp;<el-button type="warning" :disabled="formGoods.unavailableType == 1" @click="handleUnavailableGoods" size="mini" plain round>设置</el-button>
                </el-form-item>
              </el-form>
              <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="submitFormGoods">保 存</el-button>
                <el-button @click="cancelGoods">取 消</el-button>
              </div>
            </el-dialog>
          </el-tab-pane>
          
          <el-tab-pane label="回访设置" name="visit" v-if="this.form.id">
            <el-row :gutter="10" class="mb8">
              <el-col :span="1.5">
                <el-button type="primary" icon="el-icon-plus" size="mini" @click="handleAddVisit" v-hasPermi="['store:pack:add']">添加回访</el-button>
              </el-col>
            </el-row>
            
            <el-table :data="packVisitList" ref="packVisit">
              <el-table-column type="expand" fixed="left">
                  <template slot-scope="props">
                    <el-descriptions title="详情" direction="" size="small" :column="1">
                        <el-descriptions-item label="回访内容">{{ props.row.content }}</el-descriptions-item>
                        <el-descriptions-item label="注意事项">{{ props.row.attention }}</el-descriptions-item>
                        <el-descriptions-item label="赠送优惠券">无</el-descriptions-item>
                        <el-descriptions-item label="回访规则">
                          <span v-if="props.row.timesType == 0">固定{{ props.row.times }}次，</span>
                          <span v-if="props.row.timesType == 1">不限次数，</span>
                          <span v-if="props.row.loopType == 0">按照周期{{ props.row.loopDay }}天循环{{ props.row.loopTimes }}次，直到客户再次消费</span>
                          <span v-if="props.row.loopType == 1">不循环</span>
                        </el-descriptions-item>
                    </el-descriptions>
                  </template>
              </el-table-column>
              <el-table-column label="回访类型" prop="type" width="200" :show-overflow-tooltip="true"/>
              <el-table-column label="回访周期" prop="period">
                <template slot-scope="scope" v-if="scope.row.period">
                  {{ scope.row.period }}
                  <template v-for="(item, index) in periodUnitOptions">
                    <template v-if="item.value">
                      <span
                        v-if="scope.row.periodUnit == item.value">
                        {{ item.label }}
                      </span>
                    </template>
                  </template>
                </template>
              </el-table-column>
              <el-table-column label="操作" align="center" width="80" class-name="small-padding" fixed="right">
                <template slot-scope="scope">
                  <el-button
                    size="mini"
                    type="text"
                    @click="handleUpdateVisit(scope.row)"
                    v-hasPermi="['store:pack:edit']"
                  >修改</el-button>
                  <el-button
                    size="mini"
                    type="text"
                    @click="handleDeleteVisit(scope.row)"
                    v-hasPermi="['store:pack:remove']"
                  >删除</el-button>
                </template>
              </el-table-column>
            </el-table>
            
            <!-- 添加或修改套餐回访对话框 -->
            <el-dialog :title="titleVisit" class="myform" :visible.sync="openVisit" width="460px" append-to-body :close-on-click-modal="false">
              <el-form ref="formVisit" :model="formVisit" :rules="rulesVisit" label-width="auto">
                <el-input type="hidden" v-model="formVisit.packId" />
                <el-form-item label="回访类型" prop="type">
                  <el-input v-model="formVisit.type" @blur="formVisit.type=$event.target.value.trim()" placeholder="请输入回访类型" maxlength="30" show-word-limit size="small"/>
                </el-form-item>
                <el-form-item label="回访周期" prop="period">
                  <el-input placeholder="请输入回访周期" v-model="formVisit.period" oninput="value=value.replace(/[^\d]/g,'')" class="input-with-select" size="small">
                    <el-select v-model="formVisit.periodUnit" slot="append" size="small">
                      <el-option
                        v-for="d in periodUnitOptions"
                        :key="d.value"
                        :label="d.label"
                        :value="d.value"/>
                    </el-select>
                  </el-input>
                </el-form-item>
                <el-form-item label="回访内容" prop="content">
                  <el-input v-model="formVisit.content" @blur="formVisit.content=$event.target.value.trim()" placeholder="请输入回访内容" maxlength="100" show-word-limit size="small"/>
                </el-form-item>
                <el-form-item label="注意事项" prop="attention">
                  <el-input v-model="formVisit.attention" @blur="formVisit.attention=$event.target.value.trim()" placeholder="请输入注意事项" maxlength="100" show-word-limit size="small"/>
                </el-form-item>
                <el-form-item label="赠送优惠券" prop="couponId">
                  <el-select v-model="formVisit.couponId" placeholder="请选择优惠券" size="small" clearable filterable style="width:100%">
                     <el-option
                        v-for="coupon in couponList"
                        :key="coupon.id"
                        :label="coupon.name"
                        :value="coupon.id"
                      />
                  </el-select>
                </el-form-item>
                <el-form-item label="回访次数" prop="timesType">
                  <el-radio-group v-model="formVisit.timesType">
                    <el-radio
                      v-for="t in timesTypeOptions"
                      :key="t.value"
                      :label="t.value"
                    >{{t.label}}</el-radio>
                  </el-radio-group>
                  <div v-if="formVisit.timesType == 0">
                    <el-input-number v-model="formVisit.times" controls-position="right" :min="1" size="small"/>次
                  </div>
                </el-form-item>
                <el-form-item label="循环设置" prop="loopType">
                  <el-radio-group v-model="formVisit.loopType">
                    <el-radio
                      v-for="t in loopTypeOptions"
                      :key="t.value"
                      :label="t.value"
                    >{{t.label}}</el-radio>
                  </el-radio-group>
                  <div v-if="formVisit.loopType == 0">
                    <el-input v-model="formVisit.loopDay" oninput="value=value.replace(/[^\d]/g,'')" prop="loopDay" maxlength="4" size="small" style="width:66px;"/> 天循环
                    <el-input v-model="formVisit.loopTimes" oninput="value=value.replace(/[^\d]/g,'')" prop="loopTimes" maxlength="4" size="small" style="width:66px;"/> 次直到客户再次消费
                  </div>
                </el-form-item>
              </el-form>
              <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="submitFormVisit">保 存</el-button>
                <el-button @click="cancelVisit">取 消</el-button>
              </div>
            </el-dialog>
          </el-tab-pane>
          
          <el-tab-pane label="搭配满减" name="prom" v-if="this.form.id">
            <el-form ref="formProm" :model="formProm" :rules="rulesProm" label-width="auto">
              <el-form-item label="享受会员卡折扣">
                <el-switch
                  v-model="formProm.cardDiscount"
                  active-value="Y"
                  inactive-value="N">
                </el-switch>
              </el-form-item>
              <el-form-item label="满减活动" prop="promId">
                <el-select v-model="formProm.promId" placeholder="请选择" size="small" clearable filterable>
                    <el-option
                      v-for="prom in promList"
                      :key="prom.id"
                      :label="prom.name"
                      :value="prom.id">{{prom.name}}
                    </el-option>
                </el-select>
              </el-form-item>
              <el-button type="primary" plain @click="submitFormProm" size="mini">保存活动</el-button>
              <el-button
                  type="danger"
                  plain
                  size="mini"
                  @click="handleDeleteProm"
                  v-hasPermi="['store:pack:remove']"
                  v-if="formProm.id"
                >删除活动</el-button>
            </el-form>
          </el-tab-pane>
          
        </el-tabs>
      </el-form>
      <el-divider></el-divider>
      <div class="el-dialog__footer">
        <el-button type="primary" @click="submitForm" v-if="curTab=='base'">保 存</el-button>
        <el-button @click="cancel">关 闭</el-button>
      </div>
    </el-drawer>
    
    <!-- 不可用日期设置 -->
    <el-dialog :title="titleUnavailable" class="myform" :visible.sync="openUnavailable" width="598px" append-to-body :close-on-click-modal="false">
      <el-form ref="formUnavailable" :model="formUnavailable" :rules="rulesUnavailable" size="small"
        label-width="100px" label-position="top">
        <el-form-item label="" prop="chkedWeekDays">
          <span slot="label">
                                    每周不可用日期
            <el-tooltip content="最多选择6天" placement="top">
              <i class="el-icon-question"></i>
            </el-tooltip>
          </span>
          <el-checkbox-group v-model="formUnavailable.chkedWeekDays" :max="6" size="medium">
            <el-checkbox v-for="item in weekdaysOptions" :key="item.value" :label="item.value"
              >{{item.label}}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="" prop="chkedHolidays" class="chklable_width">
          <span slot="label">不可用节假日
            <el-button type="text" @click="handleChkAll">全选</el-button>
          </span>
          <el-checkbox-group v-model="formUnavailable.chkedHolidays" size="medium">
            <el-checkbox 
                v-for="d in dict.type.unavailable_holidays" 
                :key="d.value" 
                :label="d.value">
                {{d.label}}
                <span v-if="d.raw.remark">({{d.raw.remark}})</span>
                <span v-else>(法定)</span>
            </el-checkbox>
          </el-checkbox-group>
          <span class="tip">注：“法定”节假日为国务院规定的公共休息日，点击 <el-link type="primary" href="http://sousuo.gov.cn/s.htm?t=paper&advance=false&n=&timetype=&mintime=&maxtime=&sort=&q=%E8%8A%82%E5%81%87%E6%97%A5" target="_blank">查看公告</el-link></span>
        </el-form-item>
        <el-form-item label="" prop="customDateArr">
          <span slot="label">
                                    自定义不可用日期
            <el-tooltip content="最多设置5个自定义日期" placement="top">
              <i class="el-icon-question"></i>
            </el-tooltip>
          </span>
          <div v-for="(item,index) in formUnavailable.customDateArr" :key="index" style="margin-bottom:5px;">
            <span v-if="index === 0">
              <el-date-picker
                      v-model="formUnavailable.customDateArr[index]"
                      type="daterange"
                      align="right"
                      unlink-panels
                      range-separator="至"
                      start-placeholder="开始日期"
                      end-placeholder="结束日期" 
                      value-format="yyyy-MM-dd"
                      @input="">
                  </el-date-picker>
              <el-button type="primary" icon="el-icon-plus" class="mypicker_btn" circle @click="plusPicker(index)" size="mini"/>
            </span>
            <span v-if="index > 0">
              <el-date-picker
                      v-model="formUnavailable.customDateArr[index]"
                      type="daterange"
                      align="right"
                      unlink-panels
                      range-separator="至"
                      start-placeholder="开始日期"
                      end-placeholder="结束日期" 
                      value-format="yyyy-MM-dd"
                      @input="">
                  </el-date-picker>
              <el-button type="danger" icon="el-icon-minus" class="mypicker_btn" plain circle @click="rmPicker(index)" size="mini"/>
            </span>
          </div>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="cancelUnavailable">取消</el-button>
        <el-button type="primary" @click="submitFormUnavailable">确定</el-button>
      </div>
    </el-dialog>
  </div>
  
</template>

<script>
import { cascaderList as classList } from "@/api/store/base/pack_class";
import { cascaderList as paymentList } from "@/api/store/base/payment";
import { cascaderList as goodsList, getGoods } from "@/api/store/base/goods";
import { cascaderList as serviceList, getService } from "@/api/store/base/service";
import { listPack, getPack, delPack, addPack, updatePack, chkPackCode } from "@/api/store/base/pack";
import { listPackGoods, getPackGoods, delPackGoods, addPackGoods, updatePackGoods } from "@/api/store/base/pack_goods";
import { listPackService, getPackService, delPackService, addPackService, updatePackService } from "@/api/store/base/pack_service";
import { listPackMultiple, getPackMultiple, delPackMultiple, addPackMultiple, updatePackMultiple } from "@/api/store/base/pack_multiple_service";
import { listPackMultipleDetail, getPackMultipleDetail, delPackMultipleDetail, addPackMultipleDetail, updatePackMultipleDetail } from "@/api/store/base/pack_multiple_service_detail";
import { getPackProm, delPackProm, addPackProm, updatePackProm } from "@/api/store/base/pack_prom";
import { listProm4Pack } from "@/api/prom/events";
// import { getUnavail, getUnavailByPackId } from "@/api/store/base/item_unavailable_date";
import { listVisit, getVisit, delVisit, addVisit, updateVisit } from "@/api/store/base/pack_visit";
import { getToken } from "@/utils/auth";
import { listBrand } from "@/api/system/dept";

export default {
  name: "Pack",
  dicts: ['sys_normal_disable','sys_dept_group','sys_yes_no','unit_yuan_percent','unavailable_holidays'],
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 显隐列信息
      columns: [
        { key: 0, label: '套餐编号', visible: true },
        { key: 1, label: '套餐名称', visible: true },
        { key: 2, label: '分类', visible: true },
        { key: 3, label: '套餐内容', visible: true },
        { key: 4, label: '销售价(元)', visible: true },
        { key: 5, label: '会员价(元)', visible: true },
        { key: 6, label: '总标准价(元)', visible: true },
        { key: 7, label: '固定成本', visible: false },
        { key: 8, label: '管理品牌', visible: true },
        { key: 9, label: '业绩归属部门', visible: false },
        { key: 10, label: '是否允许赠送', visible: false },
        { key: 11, label: '上下架时间', visible: false },
        { key: 12, label: '状态', visible: true }
      ],
      // 套餐表格数据
      packList: [],
      serviceOptions: [],
      // 套餐服务表格数据
      packServiceList: [],
      packMultipleList: [],
      packMultipleDetailList: [],
      packVisitList: [],
      packGoodsList: [],
      // 套餐分类选项
      classOptions: [],
      // 支付方式选项
      paymentOptions: [],
      goodsOptions: [],
      validTypeOptions: [{
        value: 1,
        label: '相对有效期'
      },{
        value: 2,
        label: '固定有效期'
      }],
      relativeTypeOptions: [{
        value: 1,
        label: '生效后'
      },{
        value: 2,
        label: '首次使用后'
      }],
      unavailableTypeOptions: [{
        value: 1,
        label: '所有日期都可用'
      },{
        value: 2,
        label: '部分日期不可用'
      }],
      givableOptions: [{
        value: '0',
        label: '是'
      },{
        value: '1',
        label: '否'
      }],
      periodUnitOptions: [{
        value: '0',
        label: '天'
      },{
        value: '1',
        label: '次'
      }],
      timesTypeOptions: [{
        value: '0',
        label: '固定次数'
      },{
        value: '1',
        label: '不限次数'
      }],
      loopTypeOptions: [{
        value: '1',
        label: '不循环'
      },{
        value: '0',
        label: '按照周期'
      }],
      periodTypeOptions: [{
        value: 1,
        label: '年'
      },{
        value: 2,
        label: '月'
      },{
        value: 3,
        label: '日'
      }],
      weekdaysOptions: [{
        "label": "周日",
        "value": "7"
      }, {
        "label": "周一",
        "value": "1"
      }, {
        "label": "周二",
        "value": "2"
      }, {
        "label": "周三",
        "value": "3"
      }, {
        "label": "周四",
        "value": "4"
      }, {
        "label": "周五",
        "value": "5"
      }, {
        "label": "周六",
        "value": "6"
      }],
      // 部门品牌列表
      brandList: [],
      roundList: [],
      couponList: [],
      // 促销满减套餐活动
      promList: [],
      // 弹出层标题
      title: "",
      titleService: '',
      titleMultiple: '',
      titleMultipleDetail: '',
      titleVisit: '',
      titleGoods: '',
      titleUnavailable: '',
      // 是否显示弹出层
      open: false,
      openService: false,
      openMultiple: false,
      openMultipleDetail: false,
      openVisit: false,
      openGoods: false,
      openUnavailable: false,
      // -----图片上传参数-------
      fileList: [],
      dialogVisible: false,
      dialogImageUrl: "",
      noneBtnImg: false,
      uploadFileUrl: process.env.VUE_APP_BASE_API + "/file/upload",
      headers: {
        Authorization: "Bearer " + getToken(),
      },
      // --------------------
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        name: null,
        classId: null,
        status: null
      },
      // 表单参数
      form: {},
      formService: {},
      formMultiple: {},
      formMultipleDetail: {},
      formVisit: {},
      formGoods: {},
      formUnavailable: {},
      formProm: {},
      curTab: 'base',
      // 表单校验
      rules: {
        deptId: [
          { required: true, message: "不能为空", trigger: "blur" }
        ],
        name: [
          { required: true, message: "不能为空", trigger: "blur" }
        ],
        code: [
          { required: true, message: "不能为空", trigger: "blur" }
        ],
        classIdArr: [
          { required: true, message: "分类不能为空", trigger: "blur" }
        ],
        perfToDept: [
          { required: true, message: "不能为空", trigger: "blur" }
        ],
        salePrice: [
          { required: true, message: "不能为空", trigger: "blur" },
          { pattern: /^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/, message: "只能为数字，且最多2位小数", trigger: "change" }
        ],
        memberPrice: [
          { required: true, message: "不能为空", trigger: "blur" },
          { pattern: /^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/, message: "只能为数字，且最多2位小数", trigger: "change" }
        ],
        cost: [
          { pattern: /^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/, message: "只能为数字，且最多2位小数", trigger: "change" }
        ]
      },
      rulesService: {
        serviceIdArr: [
          { required: true, message: "服务不能为空", trigger: "blur" }
        ],
        salePrice: [
          { required: true, message: "不能为空", trigger: "blur" },
          { pattern: /^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/, message: "只能为数字，且最多2位小数", trigger: "change" }
        ]/*,
        num:[
          { required: true, message: "不能为空", trigger: "blur" }
        ]*/
      },
      rulesMultiple: {
        name: [
          { required: true, message: "不能为空", trigger: "blur" }
        ],
        salePrice:[
          { required: true, message: "不能为空", trigger: "blur" },
          { pattern: /^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/, message: "只能为数字，且最多2位小数", trigger: "change" }
        ],
        useTotal: [
          { required: true, message: "不能为空", trigger: "blur" }
        ]
      },
      rulesMultipleDetail: {
        serviceIdArr: [
          { required: true, message: "服务不能为空", trigger: "blur" }
        ],
        salePrice: [
          { required: true, message: "不能为空", trigger: "blur" },
          { pattern: /^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/, message: "只能为数字，且最多2位小数", trigger: "change" }
        ]
      },
      rulesGoods: {
        goodsIdArr: [
          { required: true, message: "不能为空", trigger: "blur" }
        ],
        salePrice: [
          { required: true, message: "不能为空", trigger: "blur" },
          { pattern: /^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/, message: "只能为数字，且最多2位小数", trigger: "change" }
        ]/*,
        num:[
          { required: true, message: "不能为空", trigger: "blur" }
        ]*/
      },
      rulesVisit: {
        type: [
          { required: true, message: "回访类型不能为空", trigger: "blur" }
        ],
        period: [
          { required: true, message: "回访周期不能为空", trigger: "blur" }
        ],
        content: [
          { required: true, message: "回访内容不能为空", trigger: "blur" }
        ],
        attention: [
          { required: true, message: "注意事项不能为空", trigger: "blur" }
        ],
        loopDay: [
          { pattern: /^\d+$/, message: "只能为数字", trigger: "change" }
        ],
        loopTimes: [
          { pattern: /^\d+$/, message: "只能为数字", trigger: "change" }
        ]
      },
      rulesUnavailable: {
        
      },
      rulesProm: {
        promId: [
          { required: true, message: "不能为空", trigger: "blur" }
        ]
      }
    };
  },
  created() {
    this.getClassList();
    this.getList();
  },
  methods: {
    costFormatter(row, column) {
      return row.cost + this.selectDictLabel(this.dict.type.unit_yuan_percent, row.costUnit);
    },
    /** 查询套餐列表 */
    getList() {
      this.loading = true;
      listPack(this.queryParams).then(response => {
        this.packList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    /** 查询套餐分类列表 */
    getClassList() {
      classList().then(response => {
        this.classOptions = response.data;
      });
    },
    /** 查询支付方式列表 */
    getPaymentList() {
      paymentList().then(response => {
        this.paymentOptions = response.data;
      });
    },
    //查询部门（品牌级别）列表
    getBrandList() {
      listBrand().then(response => {
        this.brandList = response.data;
      });
    },
    //查询促销满减套餐活动列表
    getPromList(){
      listProm4Pack().then(response => {
        this.promList = response.rows;
      });
    },
    //查询商品级联列表
    getGoodsList() {
      goodsList().then(response => {
        this.goodsOptions = response.data;
      });
    },
    //服务分类+服务级联选择列表
    getServiceList() { 
      serviceList().then(response => {
        this.serviceOptions = response.data;
      });
    },
    getPackServiceList(packId) {
      listPackService(packId).then(response => {
        this.packServiceList = response.data;
      });
    },
    getPackMultipleList(packId) {
      listPackMultiple(packId).then(response => {
        this.packMultipleList = response.data;
      });
    },
    getPackMultipleDetailList(multipleId) {
      listPackMultipleDetail(multipleId).then(response => {
        this.packMultipleDetailList = response.data;
      });
    },
    getPackVisitList(packId) {
      listVisit(packId).then(response => {
        this.packVisitList = response.data;
      });
    },
    getPackGoodsList(packId) {
      listPackGoods(packId).then(response => {
        this.packGoodsList = response.data;
      });
    },
    getPackProm(packId) {
      this.resetProm();
      getPackProm(packId).then(response => {
        this.formProm = response.data;
        if(!this.formProm) {
          this.resetProm();
        }
      });
    },
    putawayTimeChange(val) {
      this.$forceUpdate();//修改操作需要使用强制更新
      if(val) {
        this.form.putawayStartTime = val[0];
        this.form.putawayEndTime = val[1];
      } else {
        this.form.putawayStartTime = null;
        this.form.putawayEndTime = null;
        this.form.putawayTime = [];
      }
    },
    validTimeChange(val) {
      this.$forceUpdate();//修改操作需要使用强制更新
      if(val) {
        this.form.validStartTime = val[0];
        this.form.validEndTime = val[1];
      } else {
        this.form.validStartTime = null;
        this.form.validEndTime = null;
        this.form.validTime = [];
      }
    },
    validTimeChangeService(val) {
      this.$forceUpdate();//修改操作需要使用强制更新
      if(val) {
        this.formService.validStartTime = val[0];
        this.formService.validEndTime = val[1];
      } else {
        this.formService.validStartTime = null;
        this.formService.validEndTime = null;
        this.formService.validTime = [];
      }
    },
    validTimeChangeMultipleDetail(val) {
      this.$forceUpdate();//修改操作需要使用强制更新
      if(val) {
        this.formMultipleDetail.validStartTime = val[0];
        this.formMultipleDetail.validEndTime = val[1];
      } else {
        this.formMultipleDetail.validStartTime = null;
        this.formMultipleDetail.validEndTime = null;
        this.formMultipleDetail.validTime = [];
      }
    },
    validTimeChangeGoods(val) {
      this.$forceUpdate();//修改操作需要使用强制更新
      if(val) {
        this.formGoods.validStartTime = val[0];
        this.formGoods.validEndTime = val[1];
      } else {
        this.formGoods.validStartTime = null;
        this.formGoods.validEndTime = null;
        this.formGoods.validTime = [];
      }
    },
    chkPackCode(code) {
        chkPackCode(code, this.form.id?this.form.id:0);
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    cancelService() {
      this.openService = false;
      this.resetService();
    },
    cancelMultiple() {
      this.openMultiple = false;
      this.resetMultiple();
    },
    cancelMultipleDetail() {
      this.openMultipleDetail = false;
      this.resetMultipleDetail();
    },
    cancelVisit() {
      this.openVisit = false;
      this.resetVisit();
    },
    cancelGoods() {
      this.openGoods = false;
      this.resetGoods();
    },
    cancelUnavailable() {
      this.openUnavailable = false;
    },
    // 表单重置
    reset() {
      this.form = {
        id: null,
        name: null,
        deptId: null,
        code: null,
        salePrice: null,
        memberPrice: null,
        classIdArr: null,
        cost: null,
        costUnit: null,
        perfToDept: null,
        validType: this.validTypeOptions[0].value,
        relativeType: this.relativeTypeOptions[0].value,
        relativeValidDays: null,
        validStartTime: null,
        validEndTime: null,
        validTime: [],
        //effectiveType: this.effectiveTypeOptions[0].value,
        effectiveType: 1,
        effectiveDays: null,
        unavailableType: this.unavailableTypeOptions[0].value,
        givable: this.givableOptions[0].value,
        putawayStartTime: null,
        putawayEndTime: null,
        putawayTime: [],
        cardAgreementSwitch: '0',
        cardAgreement: null,
        description: null,
        status: "0",
        remark: null,
        images: []
      };
      this.fileList = [];
      this.packServiceList = [];
      this.packVisitList = [];
      this.packGoodsList = [];
      this.resetForm("form");
      this.noneBtnImg=false;
      this.curTab='base';
    },
    resetService() {
      this.formService = {
        id: null,
        packId: this.form.id,
        serviceId: null,
        salePrice: null,
        num: null,
        //validType: this.validTypeOptions[0].value,
        validType: this.form.validType,
        //relativeType: this.relativeTypeOptions[0].value,
        relativeType: this.form.relativeType,
        relativeValidDays: this.form.relativeValidDays,
        validTime: this.form.validTime,
        validStartTime: this.form.validStartTime,
        validEndTime: this.form.validEndTime,
        //effectiveType: this.effectiveTypeOptions[0].value,
        effectiveType: this.form.effectiveType,
        effectiveDays: this.form.effectiveDays,
        //unavailableType: this.unavailableTypeOptions[0].value
        unavailableType: this.form.unavailableType
      };
      this.resetForm("formService");
    },
    resetMultiple() {
      this.formMultiple = {
        id: null,
        packId: this.form.id,
        salePrice: null,
        name: null,
        useTotal: null
      };
      this.resetForm("formMultiple");
    },
    resetMultipleDetail() {
      this.formMultipleDetail = {
        id: null,
        packId: this.form.id,
        multipleId: null,
        serviceId: null,
        salePrice: null,
        maxUse: null,
        //validType: this.validTypeOptions[0].value,
        validType: this.form.validType,
        //relativeType: this.relativeTypeOptions[0].value,
        relativeType: this.form.relativeType,
        relativeValidDays: this.form.relativeValidDays,
        validTime: this.form.validTime,
        validStartTime: this.form.validStartTime,
        validEndTime: this.form.validEndTime,
        //effectiveType: this.effectiveTypeOptions[0].value,
        effectiveType: this.form.effectiveType,
        effectiveDays: this.form.effectiveDays,
        //unavailableType: this.unavailableTypeOptions[0].value
        unavailableType: this.form.unavailableType,
        periodType: this.periodTypeOptions[0].value,
        periodUseNum: null
      };
      this.resetForm("formMultipleDetail");
    },
    resetVisit() {
      this.formVisit = {
        id: null,
        packId: this.form.id,
        type: null,
        period: null,
        periodUnit: null,
        content: null,
        attention: null,
        couponId: null,
        timesType: 0,
        times: null,
        loopType: 0,
        loopDay: null,
        loopTimes: null
      };
      this.resetForm("formVisit");
    },
    resetGoods() {
      this.formGoods = {
        id: null,
        packId: this.form.id,
        goodsIdArr: null,
        salePrice: null,
        num: null,
        //validType: this.validTypeOptions[0].value,
        validType: this.form.validType,
        //relativeType: this.relativeTypeOptions[0].value,
        relativeType: this.form.relativeType,
        relativeValidDays: this.form.relativeValidDays,
        validTime: this.form.validTime,
        validStartTime: this.form.validStartTime,
        validEndTime: this.form.validEndTime,
        //effectiveType: this.effectiveTypeOptions[0].value,
        effectiveType: this.form.effectiveType,
        effectiveDays: this.form.effectiveDays,
        //unavailableType: this.unavailableTypeOptions[0].value
        unavailableType: this.form.unavailableType
      };
      this.resetForm("formGoods");
    },
    resetUnavailable() {
      this.formUnavailable = {
        id: null,
        packId: this.form.id,
        packServiceId: null,
        packGoodsId: null,
        packMultipleServiceDetailId: null,
        chkedWeekDays: [],
        chkedHolidays: [],
        customDateArr: ['']
      };
      this.titleUnavailable = '';
      this.resetForm("formUnavailable");
    },
    resetProm() {
      this.formProm = {
        id: null,
        packId: this.form.id,
        cardDiscount: null,
        promId: null
      };
      this.resetForm("formProm");
    },
    handleChkAll(e) {
      const temp = [];
      if(this.formUnavailable.chkedHolidays.length == this.dict.type.unavailable_holidays.length) {
        //this.formUnavailable.chkedHolidays = [];
        e.target.innerText = '全选';
      } else {
        this.dict.type.unavailable_holidays.forEach(function(d) {
          temp.push(d.value);
        });
        e.target.innerText = '取消全选';
      }
      this.formUnavailable.chkedHolidays = temp;
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.getBrandList();
      this.getPaymentList();
      this.resetUnavailable();
      this.open = true;
      this.title = "添加套餐";
      this.form.costUnit = this.dict.type.unit_yuan_percent[0].value;
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      this.getBrandList();
      this.getPaymentList();
      const id = row.id || this.ids
      getPack(id).then(response => {
        this.form = response.data;
        if(this.form.unavailableDate) {
          this.formUnavailable = this.form.unavailableDate;
        }
        this.fileList = response.data.images;
        if(this.fileList) {
          this.noneBtnImg = this.fileList.length >= 6;
        } else {
          this.fileList = [];
        }
        
        if(!this.form.putawayTime) {
          this.form.putawayTime=[];
        }
        if(row.putawayStartTime) {
          this.form.putawayTime.push(row.putawayStartTime);
        }
        if(row.putawayEndTime) {
          this.form.putawayTime.push(row.putawayEndTime);
        }
        row.putawayTime = this.form.putawayTime;
        
        if(!this.form.validTime) {
          this.form.validTime=[];
        }
        if(row.validStartTime) {
          this.form.validTime.push(row.validStartTime);
        }
        if(row.validEndTime) {
          this.form.validTime.push(row.validEndTime);
        }
        row.validTime = this.form.validTime;
        
        this.open = true;
        this.title = "修改套餐";
      });
    },
    /** 复制按钮操作 */
    handleCopy(row) {
      this.reset();
      this.getBrandList();
      this.getPaymentList();
      const id = row.id || this.ids
      getPack(id).then(response => {
        this.form = response.data;
        this.form.id = null;
        this.form.code = null;
        if(this.form.unavailableDate) {
          this.formUnavailable = this.form.unavailableDate;
        }
        /*this.fileList = response.data.images;
        if(this.fileList) {
          this.noneBtnImg = this.fileList.length >= 6;
        } else {
          this.fileList = [];
        }*/
        
        if(!this.form.putawayTime) {
          this.form.putawayTime=[];
        }
        if(row.putawayStartTime) {
          this.form.putawayTime.push(row.putawayStartTime);
        }
        if(row.putawayEndTime) {
          this.form.putawayTime.push(row.putawayEndTime);
        }
        row.putawayTime = this.form.putawayTime;
        
        if(!this.form.validTime) {
          this.form.validTime=[];
        }
        if(row.validStartTime) {
          this.form.validTime.push(row.validStartTime);
        }
        if(row.validEndTime) {
          this.form.validTime.push(row.validEndTime);
        }
        row.validTime = this.form.validTime;
        
        this.open = true;
        this.title = "添加套餐";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updatePack(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addPack(this.form).then(response => {
              this.$modal.msgSuccess("新增成功");
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$modal.confirm('是否确认删除套餐"' + row.name + '"？').then(function() {
        return delPack(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 套餐服务添加按钮操作 */
    handleAddService() {
      if(this.packServiceList.length == 10) {
        this.$modal.msgError("最多只能添加10项服务！");
        return;
      }
      this.resetService();
      this.getServiceList();
      
      //取套餐默认配置
      this.formUnavailable = this.form.unavailableDate;
      if(this.formUnavailable) {
        this.formUnavailable.id = null;
      } else {
        this.resetUnavailable();
      }
      
      this.openService = true;
      this.titleService = "添加服务";
    },
    handleUpdateService(row) {
      this.resetService();
      this.getServiceList();
      const id = row.id;
      getPackService(id).then(response => {
        this.formService = response.data;
        this.formUnavailable = this.formService.unavailableDate;
        if(!this.formUnavailable) {//取套餐默认配置
          this.formUnavailable = this.form.unavailableDate;
          if(this.formUnavailable) {
            this.formUnavailable.id = null;
          } else {
            this.resetUnavailable();
          }
        }
        
        if(!this.formService.validTime) {
          this.formService.validTime=[];
        }
        if(row.validStartTime) {
          this.formService.validTime.push(row.validStartTime);
        }
        if(row.validEndTime) {
          this.formService.validTime.push(row.validEndTime);
        }
        row.validTime = this.formService.validTime;
        
        this.openService = true;
        this.titleService = "修改服务";
      });
    },
    submitFormService() {
      //this.formService.unavailableDate = this.formUnavailable;
      this.checkFromUnavailable();
      this.$refs["formService"].validate(valid => {
        if (valid) {
          if (this.formService.id != null) {
            updatePackService(this.formService).then(response => {
              this.getPackServiceList(this.formService.packId);
              this.getList();
              this.$modal.msgSuccess("修改成功");
              this.openService = false;
            });
          } else {
            addPackService(this.formService).then(response => {
              this.getPackServiceList(this.formService.packId);
              this.getList();
              this.$modal.msgSuccess("新增成功");
              this.openService = false;
            });
          }
        }
      });
    },
    /** 套餐服务删除按钮操作 */
    handleDeleteService(row) {
      const id = row.id;
      this.$modal.confirm('是否确认删除"' + row.service.name + '"？').then(function() {
        return delPackService(id);
      }).then(() => {
        this.getPackServiceList(row.packId);
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    //查询服务标准价
    changeService(arr) {
      if(arr) {
        getService(arr[arr.length-1]).then(response => {
          if(response.data.standardPrice) {
            this.formService.salePrice = response.data.standardPrice;
          }
        });
      }
    },
    //查询商品标准价
    changeGoods(arr) {
      if(arr) {
        getGoods(arr[arr.length-1]).then(response => {
          if(response.data.standardPrice) {
            this.formGoods.salePrice = response.data.standardPrice;
          }
        });
      }
    },
    /** 多选服务组 */
    handleAddMultiple() {
      if(this.packMultipleList.length == 5) {
        this.$modal.msgError("最多只能添加5项多选服务组！");
        return;
      }
      this.resetMultiple();
      this.openMultiple = true;
      this.titleMultiple = "添加多选服务组";
    },
    handleUpdateMultiple(row) {
      this.resetMultiple();
      const id = row.id;
      getPackMultiple(id).then(response => {
        this.formMultiple = response.data;
        
        this.openMultiple = true;
        this.titleMultiple = "修改多选服务组";
      });
    },
    submitFormMultiple() {
      this.$refs["formMultiple"].validate(valid => {
        if (valid) {
          if (this.formMultiple.id != null) {
            updatePackMultiple(this.formMultiple).then(response => {
              this.getPackMultipleList(this.formMultiple.packId);
              this.getList();
              this.$modal.msgSuccess("修改成功");
              this.openMultiple = false;
            });
          } else {
            addPackMultiple(this.formMultiple).then(response => {
              this.getPackMultipleList(this.formMultiple.packId);
              this.getList();
              this.$modal.msgSuccess("新增成功");
              this.openMultiple = false;
            });
          }
        }
      });
    },
    handleDeleteMultiple(row) {
      const id = row.id;
      this.$modal.confirm('是否确认删除"' + row.name + '"？').then(function() {
        return delPackMultiple(id);
      }).then(() => {
        this.getPackMultipleList(row.packId);
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 套餐多选服务明细添加按钮操作 */
    handleAddMultipleDetail(item) {
      if(this.packMultipleDetailList.length == 10) {
        this.$modal.msgError("最多只能添加10项服务！");
        return;
      }
      this.resetMultipleDetail();
      this.formMultipleDetail.multipleId = item.id;
      this.getServiceList();
      
      //取套餐默认配置
      this.formUnavailable = this.form.unavailableDate;
      if(this.formUnavailable) {
        this.formUnavailable.id = null;
      } else {
        this.resetUnavailable();
      }
      
      this.openMultipleDetail = true;
      this.titleMultipleDetail = "添加服务";
    },
    handleUpdateMultipleDetail(row) {
      this.resetMultipleDetail();
      this.getServiceList();
      const id = row.id;
      getPackMultipleDetail(id).then(response => {
        this.formMultipleDetail = response.data;
        this.formUnavailable = this.formMultipleDetail.unavailableDate;
        if(!this.formUnavailable) {//取套餐默认配置
          this.formUnavailable = this.form.unavailableDate;
          if(this.formUnavailable) {
            this.formUnavailable.id = null;
          } else {
            this.resetUnavailable();
          }
        }
        
        if(!this.formMultipleDetail.validTime) {
          this.formMultipleDetail.validTime=[];
        }
        if(row.validStartTime) {
          this.formMultipleDetail.validTime.push(row.validStartTime);
        }
        if(row.validEndTime) {
          this.formMultipleDetail.validTime.push(row.validEndTime);
        }
        row.validTime = this.formMultipleDetail.validTime;
        
        this.openMultipleDetail = true;
        this.titleMultipleDetail = "修改服务";
      });
    },
    submitFormMultipleDetail() {
      this.checkFromUnavailable();
      this.$refs["formMultipleDetail"].validate(valid => {
        if (valid) {
          if (this.formMultipleDetail.id != null) {
            updatePackMultipleDetail(this.formMultipleDetail).then(response => {
              this.getPackMultipleList(this.form.id);
              this.getList();
              this.$modal.msgSuccess("修改成功");
              this.openMultipleDetail = false;
            });
          } else {
            addPackMultipleDetail(this.formMultipleDetail).then(response => {
              this.getPackMultipleList(this.form.id);
              this.getList();
              this.$modal.msgSuccess("新增成功");
              this.openMultipleDetail = false;
            });
          }
        }
      });
    },
    handleDeleteMultipleDetail(row) {
      const id = row.id;
      this.$modal.confirm('是否确认删除"' + row.service.name + '"？').then(function() {
        return delPackMultipleDetail(id);
      }).then(() => {
        this.getPackMultipleList(row.packId);
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    handleAddVisit() {
      this.resetVisit();
      this.openVisit = true;
      this.titleVisit = "添加回访设置";
      this.formVisit.timesType = this.timesTypeOptions[0].value;
      this.formVisit.loopType = this.loopTypeOptions[1].value;
      this.formVisit.periodUnit = this.periodUnitOptions[0].value;
    },
    handleUpdateVisit(row) {
      this.resetVisit();
      const id = row.id || this.ids
      getVisit(id).then(response => {
        this.formVisit = response.data;
        
        this.openVisit = true;
        this.titleVisit = "修改回访设置";
      });
    },
    submitFormVisit() {
      this.$refs["formVisit"].validate(valid => {
        if (valid) {
          if (this.formVisit.id != null) {
            updateVisit(this.formVisit).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.openVisit = false;
              this.getPackVisitList(this.formVisit.packId);
            });
          } else {
            addVisit(this.formVisit).then(response => {
              this.$modal.msgSuccess("新增成功");
              this.openVisit = false;
              this.getPackVisitList(this.formVisit.packId);
            });
          }
        }
      });
    },
    /** 套餐服务删除按钮操作 */
    handleDeleteVisit(row) {
      const id = row.id;
      this.$modal.confirm('是否确认删除"' + row.type + '"？').then(function() {
        return delVisit(id);
      }).then(() => {
        this.getPackVisitList(row.packId);
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    
    handleAddGoods() {
      this.resetGoods();
      this.getGoodsList();
      
      //取套餐默认配置
      this.formUnavailable = this.form.unavailableDate;
      if(this.formUnavailable) {
        this.formUnavailable.id = null;
      } else {
        this.resetUnavailable();
      }
      
      this.openGoods = true;
      this.titleGoods = "添加商品";
    },
    handleUpdateGoods(row) {
      this.resetGoods();
      this.getGoodsList();
      const id = row.id || this.ids
      getPackGoods(id).then(response => {
        this.formGoods = response.data;
        this.formUnavailable = this.formGoods.unavailableDate;
        if(!this.formUnavailable) {//取套餐默认配置
          this.formUnavailable = this.form.unavailableDate;
          if(this.formUnavailable) {
            this.formUnavailable.id = null;
          } else {
            this.resetUnavailable();
          }
        }
        
        if(!this.formGoods.validTime) {
          this.formGoods.validTime=[];
        }
        if(row.validStartTime) {
          this.formGoods.validTime.push(row.validStartTime);
        }
        if(row.validEndTime) {
          this.formGoods.validTime.push(row.validEndTime);
        }
        row.validTime = this.formGoods.validTime;
        
        this.openGoods = true;
        this.titleGoods = "修改商品";
      });
    },
    submitFormGoods() {
      //this.formGoods.unavailableDate = this.formUnavailable;
      this.checkFromUnavailable();
      this.$refs["formGoods"].validate(valid => {
        if (valid) {
          if (this.formGoods.id != null) {
            updatePackGoods(this.formGoods).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.openGoods = false;
              this.getPackGoodsList(this.formGoods.packId);
              this.getList();
            });
          } else {
            addPackGoods(this.formGoods).then(response => {
              this.$modal.msgSuccess("新增成功");
              this.openGoods = false;
              this.getPackGoodsList(this.formGoods.packId);
              this.getList();
            });
          }
        }
      });
    },
    /** 套餐服务删除按钮操作 */
    handleDeleteGoods(row) {
      const id = row.id;
      this.$modal.confirm('是否确认删除？').then(function() {
        return delPackGoods(id);
      }).then(() => {
        this.getPackGoodsList(row.packId);
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 套餐活动删除按钮操作 */
    handleDeleteProm() {
      const packId = this.formProm.packId;
      if(packId) {
        this.$modal.confirm('是否确认删除？').then(function() {
          return delPackProm(packId);
        }).then(() => {
          this.resetProm();
          this.$modal.msgSuccess("删除成功");
        }).catch(() => {});
      }
    },
    
    /** 导出按钮操作 */
    handleExport() {
      this.download('store/pack/export', {
        ...this.queryParams
      }, `pack.xlsx`)
    },
    handleTabClick(tab) {
      //console.log(tab.loaded);
      if(tab.name == 'service' && !tab.loaded) {
        this.getPackServiceList(this.form.id);
        this.getPackMultipleList(this.form.id);
      } else if(tab.name == 'visit' && !tab.loaded) {
        this.getPackVisitList(this.form.id);
      } else if(tab.name == 'goods' && !tab.loaded) {
        this.getPackGoodsList(this.form.id);
      } else if(tab.name == 'prom' && !tab.loaded) {
        this.getPromList();
        this.getPackProm(this.form.id);
      }
    },
    //设置套餐默认不可用日期
    handleUnavailableDefault() {
      if(!this.formUnavailable) {
        this.resetUnavailable();
      }
      if(!this.formUnavailable.chkedHolidays) {
        this.formUnavailable.chkedHolidays = [];
      }
      if(!this.formUnavailable.customDateArr || this.formUnavailable.customDateArr == []) {
        this.formUnavailable.customDateArr = [''];
      }
      this.openUnavailable = true;
      this.titleUnavailable = "默认不可用日期设置";
    },
    //设置服务不可用日期
    handleUnavailableService() {
      if(!this.formUnavailable.chkedHolidays) {
        this.formUnavailable.chkedHolidays = [];
      }
      if(!this.formUnavailable.customDateArr || this.formUnavailable.customDateArr == []) {
        this.formUnavailable.customDateArr = [''];
      }
      this.openUnavailable = true;
      this.titleUnavailable = "服务不可用日期设置";
    },
    //设置商品不可用日期
    handleUnavailableGoods() {
      if(!this.formUnavailable.chkedHolidays) {
        this.formUnavailable.chkedHolidays = [];
      }
      if(!this.formUnavailable.customDateArr || this.formUnavailable.customDateArr == []) {
        this.formUnavailable.customDateArr = [''];
      }
      this.openUnavailable = true;
      this.titleUnavailable = "商品不可用日期设置";
    },
    //多选服务组服务不可用日期
    handleUnavailableMultiple() {
      if(!this.formUnavailable.chkedHolidays) {
        this.formUnavailable.chkedHolidays = [];
      }
      if(!this.formUnavailable.customDateArr || this.formUnavailable.customDateArr == []) {
        this.formUnavailable.customDateArr = [''];
      }
      this.openUnavailable = true;
      this.titleUnavailable = "服务不可用日期设置";
    },
    submitFormUnavailable() {
      //console.log(this.formUnavailable);
      
      this.$refs["formUnavailable"].validate(valid => {
          if (valid) {
            this.checkFromUnavailable();
            this.openUnavailable = false;
          }
      });
    },
    
    //检查验证不可用日期配置
    checkFromUnavailable() {
        if(!this.formUnavailable.customDateArr || 
            (this.formUnavailable.customDateArr.length == 1 && 
            (this.formUnavailable.customDateArr[0] == "" || this.formUnavailable.customDateArr[0] == null))) {
          this.formUnavailable.customDateArr = [];
        }
      
        //未设置任何日期，则当作删除操作
        if(this.formUnavailable.chkedHolidays.length == 0 && 
            this.formUnavailable.chkedWeekDays.length == 0 &&
            this.formUnavailable.customDateArr.length == 0) {
          this.formUnavailable = null;
        }
      
        if(this.curTab == 'base') {//套餐默认
          this.form.unavailableDate = this.formUnavailable;
          if(!this.formUnavailable) {//未设置任何日期，则改为所有日期可用
            this.form.unavailableType = this.unavailableTypeOptions[0].value;
          }
        } else if(this.curTab == 'service') {//服务
          //单服务
          if(this.openService) {
            if(this.formUnavailable && !this.formUnavailable.packServiceId) {
              this.formUnavailable.packServiceId = this.formService.id;
            }
            this.formService.unavailableDate = this.formUnavailable;
            if(!this.formUnavailable) {
              this.formService.unavailableType = this.unavailableTypeOptions[0].value;
            }
          } 
          //多选服务组服务
          else {
            if(this.formUnavailable && !this.formUnavailable.packMultipleServiceDetailId) {
              this.formUnavailable.packMultipleServiceDetailId = this.formMultipleDetail.id;
            }
            this.formMultipleDetail.unavailableDate = this.formUnavailable;
            if(!this.formUnavailable) {
              this.formMultipleDetail.unavailableType = this.unavailableTypeOptions[0].value;
            }
          }
        } else if(this.curTab == 'goods') {//商品
          if(this.formUnavailable && !this.formUnavailable.packGoodsId) {
            this.formUnavailable.packGoodsId = this.formGoods.id;
          }
          this.formGoods.unavailableDate = this.formUnavailable;
          if(!this.formUnavailable) {
            this.formGoods.unavailableType = this.unavailableTypeOptions[0].value;
          }
        }
        
        if(!this.formUnavailable) {
          this.resetUnavailable();
        }
    },
    
    plusPicker(index) {
      if(this.formUnavailable.customDateArr.length == 5) {
        this.$message.error("最多只能添加5个自定义日期");
        return;
      }
      this.formUnavailable.customDateArr.push('')
    },
    rmPicker(index) {
      this.formUnavailable.customDateArr.splice(index, 1)

      //this.$message.success('移除成功')
    },
    submitFormProm() {
      this.$refs["formProm"].validate(valid => {
        if (valid) {
          if (this.formProm.id != null) {
            updatePackProm(this.formProm).then(response => {
              this.$modal.msgSuccess("修改成功");
            });
          } else {
            if(!this.formProm.promId) {
              this.$modal.msgError("满减活动不能为空");
              return;
            }
            addPackProm(this.formProm).then(response => {
              this.$modal.msgSuccess("新增成功");
              this.getPackProm(this.formProm.packId);
            });
          }
        }
      });
    },
    
    /** 
     * 商品图片上传
     */
    //取消上传
    canleFileUpload() {
      this.$refs.upload.clearFiles();
    },
    //查看大图
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    handleFileChange(file, fileList) {
      this.noneBtnImg = fileList.length >= 6;
    },
    // 超出上传最大数
    handleFileOverstep(files, fileList) {
      this.$message.error("最多只能上传6张图片");
    },
    // 文件删除操作
    handleFileRemove(file, fileList) {
      this.fileList = [];
      this.fileList = fileList;
      this.noneBtnImg = fileList.length >= 6;
      
      this.form.images = [];
      for (var fi of fileList) {
         this.form.images.push({'url': fi.url});
      }
    },
    //上传图片之前判断图片大小及格式
    beforeFileUpload(file) {
      const isJPG = ["image/png", "image/jpeg", "image/jpg"].indexOf(file.type) == -1 ? 0 : 1;
      const isLt1M = file.size / 1024 / 1024 < 1;
      if (!isJPG) {
        this.$message.error("图片只能是  PNG,JPG或JPEG 格式!");
        return false;
      }
      if (!isLt1M) {
        this.$message.error("图片大小不能超过 1MB!");
      }
    },
    handleFileUploadSuccess(res, file, fileList) {
      if(!this.form.images) {
        this.form.images = [];
      }
      this.form.images.push({'url': res.data.url});
    }
  }
};
</script>

<style lang="scss" scoped>
  .el-input-group__append {
    padding: 0 20px!important;
  }
  .input-with-select .el-input__inner {
    padding-left: 7px;
    padding-right: 16px;
  }
  .input-with-select .el-select {
    width: 40px;
  }
  .input-with-select .el-input__suffix {
    right: -1px;
  }
  .relativeType .el-select {
    width: 115px!important;
  }
  .imgUpload {
    display: flow-root;
  }
  .disUoloadSty .el-upload--picture-card {
    display: none; /* 上传按钮隐藏 */
  }
  .el-upload__tip {
    line-height: 20px;
    color: #8c939d;
  }
  .el-upload-list--picture-card .el-upload-list__item, .el-upload--picture-card {
    width: 98px!important;
    height: 98px;
    line-height: 1;
  }
  .el-upload--picture-card i {
    line-height: 98px;
  }
  .goodsForm .input-with-select .el-select {
    width: 95px;
  }
  .el-card {
    margin-top: 6px;
    font-size: 14px;
  }
  .el-card .el-button {
    padding: 0;
  }
  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }
  .clearfix:after {
    clear: both
  }
  .el-descriptions__title {
    font-size: 13px;
  }
  .el-card__body {
    padding: 10px 15px 10px 15px;
  }
  .danger {
    color: #f56c6c;
  }
  .psDiv {
    max-height: 350px;
    overflow-y: auto;
  }
  .mytotal {
    font-size: 12px;
  }
  .chklable_width .el-checkbox {
    width: 106px;
  }
  .chklable_width .tip {
    color: #a8a9ab;
  }
  .mypicker_btn {
    margin-left: 5px;
  }
</style>