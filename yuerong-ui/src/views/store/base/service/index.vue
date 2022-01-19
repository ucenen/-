<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="服务名称" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入服务名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="服务编号" prop="code">
        <el-input
          v-model="queryParams.code"
          placeholder="请输入服务编号"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="服务分类" prop="classIdArr">
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
          v-hasPermi="['store:service:add']"
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
          v-hasPermi="['store:service:edit']"
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
          v-hasPermi="['store:service:remove']"
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
          v-hasPermi="['store:service:add']"
        >复制</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['store:service:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList" :columns="columns"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="serviceList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="服务编号" v-if="columns[0].visible" align="center" prop="code" />
      <el-table-column label="服务名称" v-if="columns[1].visible" align="center" prop="name" width="150" :show-overflow-tooltip="true" />
      <el-table-column label="分类" v-if="columns[2].visible" align="center" prop="serviceClass.name" />
      <el-table-column label="标准价" v-if="columns[3].visible" align="center" prop="standardPrice" />
      <el-table-column label="会员价" v-if="columns[4].visible" align="center" prop="memberPrice" />
      <el-table-column label="固定成本" v-if="columns[5].visible" align="center" prop="cost" :formatter="costFormatter"/>
      <el-table-column label="管理品牌" v-if="columns[6].visible" align="center" prop="dept.deptName" />
      <el-table-column label="业绩归属部门" v-if="columns[7].visible" align="center" prop="perfToDept">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.sys_dept_group" :value="scope.row.perfToDept"/>
        </template>
      </el-table-column>
      <el-table-column label="服务显示标题" v-if="columns[8].visible" align="center" prop="displayTitle" width="100" :show-overflow-tooltip="true"/>
      <el-table-column label="服务时长" v-if="columns[9].visible" align="center" prop="durationHour">
        <template slot-scope="scope">
          <span v-if="scope.row.durationHour">{{ scope.row.durationHour }} 小时 </span>
          <span v-if="scope.row.durationMinute">
            {{ scope.row.durationMinute }} 分钟
          </span>
        </template>
      </el-table-column>
      <el-table-column label="上下架时间" v-if="columns[10].visible" align="center" prop="putawayStartTime" width="220">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.putawayStartTime, '{y}-{m}-{d}') }} ~ </span>
          <span v-if="scope.row.putawayEndTime">
            {{ parseTime(scope.row.putawayEndTime, '{y}-{m}-{d}') }}
          </span>
          <span v-else>N/A</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" v-if="columns[11].visible" align="center" prop="status">
       <template slot-scope="scope">
          <dict-tag :options="dict.type.sys_normal_disable" :value="scope.row.status"/>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['store:service:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['store:service:remove']"
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

    <!-- 添加或修改服务对话框 -->
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
        <table width="100%">
          <tr>
            <td style="width:25%;text-align:center;">
              <div class="imgUpload">
                <div class="el-upload-list el-upload-list--picture-card" v-if="imageUrl">
                    <div class="el-upload-list__item is-success">
                        <img :src="imageUrl" class="avatar"/>
                        <span class="el-upload-list__item-actions">
                            <span class="el-upload-list__item-preview">
                                <i class="el-icon-zoom-in" @click.stop="handleFilePreview"></i>
                            </span>
                            <span class="el-upload-list__item-delete">
                                <i class="el-icon-delete" @click.stop="handleFileRemove"></i>
                            </span>
                        </span>
                    </div>
                </div>
                <el-upload  v-else 
                  class="avatar-uploader"
                  :action="uploadFileUrl"
                  :headers="headers"
                  :show-file-list="false"
                  :on-success="handleFileUploadSuccess"
                  :before-upload="beforeFileUpload">
                  <i class="el-icon-plus avatar-uploader-icon"></i>
                </el-upload>
                <el-dialog :visible.sync="dialogVisible" :modal="false">
                  <img width="100%" :src="dialogImageUrl" alt="" />
                </el-dialog>
              </div>
            </td>
            <td>
              <el-form-item label="服务名称" prop="name">
                <el-input v-model="form.name" @blur="form.name=$event.target.value.trim()" placeholder="请输入服务名称" maxlength="100" show-word-limit size="small"/>
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
            </td>
          </tr>
        </table>
        <el-tabs @tab-click="handleTabClick" v-model="curTab">
          <el-tab-pane label="基础设置" name="base">
            <el-row>
              <el-col :span="12">
                <el-form-item label="服务编号" prop="code">
                  <el-input v-model.trim="form.code" placeholder="请输入服务编号" maxlength="20" show-word-limit size="small" @change="chkServiceCode" :disabled="form.id > 0"/>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="分类" prop="classIdArr">
                  <el-cascader v-model="form.classIdArr" :options="classOptions" clearable size="small"></el-cascader>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="标准价" prop="standardPrice">
                  <el-input v-model="form.standardPrice" placeholder="请输入标准价" size="small" maxlength="24">
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
              <el-col :span="10">
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
              <el-col :span="12" :offset="2">
                <el-form-item label="业绩归属部门" prop="perfToDept">
                  <el-select v-model="form.perfToDept" clearable size="small">
                    <el-option
                        v-for="dict in dict.type.sys_dept_group"
                        :key="dict.value"
                        :label="dict.label"
                        :value="dict.value - 0"
                      />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-form-item label="服务显示标题" prop="displayTitle">
              <el-input v-model="form.displayTitle" placeholder="请输入服务显示标题" maxlength="100" show-word-limit size="small"/>
            </el-form-item>
            <el-row>
              <el-col :span="12">
                <el-form-item label="服务时长" prop="durationHour">
                  <el-select v-model="form.durationHour" clearable size="small" style="width:100px">
                    <el-option
                        v-for="item in durationHourOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value - 0"
                      />
                  </el-select>&nbsp;
                  <el-select v-model="form.durationMinute" clearable size="small" style="width:100px">
                    <el-option
                        v-for="item in durationMinuteOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value - 0"
                      />
                  </el-select>
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
            <el-row>
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
              <el-col :span="12">
                <el-form-item label="关联证书">
                  <el-cascader v-model="form.certIds" :options="certOptions" :props="{ multiple: true }" :show-all-levels="false" collapse-tags clearable size="small"></el-cascader>
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
            <el-form-item label="服务简介" prop="description">
              <el-input v-model="form.description" type="textarea" placeholder="请输入服务简介" maxlength="300" show-word-limit />
            </el-form-item>
            <el-form-item label="服务说明" prop="remark">
              <editor v-model="form.remark" :height="200"/>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="服务步骤" name="step" v-if="this.form.id">
            <el-row :gutter="10" class="mb8">
              <el-col :span="1.5">
                <el-button type="primary" icon="el-icon-plus" size="mini" @click="handleAddStep" v-hasPermi="['store:service:add']">添加步骤</el-button>
              </el-col>
            </el-row>
            
            <el-table :data="serviceStepList" ref="serviceStep">
              <!-- el-table-column type="selection" width="50" align="center" / -->
              <el-table-column label="顺序" prop="orderNum" width="50"/>
              <el-table-column label="步骤名称" prop="name" width="100" :show-overflow-tooltip="true"/>
              <el-table-column label="轮牌" prop="roundRuleNames" width="160" :show-overflow-tooltip="true"/>
              <el-table-column label="主步骤" prop="main" width="60">
                <template slot-scope="scope">
                  <dict-tag :options="dict.type.sys_yes_no" :value="scope.row.main"/>
                </template>
              </el-table-column>
              <el-table-column label="耗时" prop="durationMinute" width="88">
                <template slot-scope="scope" v-if="scope.row.durationMinute">
                  {{ scope.row.durationMinute }} 分钟
                </template>
              </el-table-column>
              <el-table-column label="说明" prop="remark" width="100" :show-overflow-tooltip="true"/>
              <el-table-column label="操作" align="center" width="80" class-name="small-padding" fixed="right">
                <template slot-scope="scope">
                  <el-button
                    size="mini"
                    type="text"
                    @click="handleUpdateStep(scope.row)"
                    v-hasPermi="['store:service:edit']"
                  >修改</el-button>
                  <el-button
                    size="mini"
                    type="text"
                    @click="handleDeleteStep(scope.row)"
                    v-hasPermi="['store:service:remove']"
                  >删除</el-button>
                </template>
              </el-table-column>
            </el-table>
            
            <!-- 添加或修改服务步骤对话框 -->
            <el-dialog :title="titleStep" class="myform" :visible.sync="openStep" width="380px" append-to-body :close-on-click-modal="false">
              <el-form ref="formStep" :model="formStep" :rules="rulesStep" label-width="auto">
                <el-input type="hidden" v-model="formStep.serviceId" />
                <el-form-item label="步骤名称" prop="name">
                  <el-input v-model="formStep.name" @blur="formStep.name=$event.target.value.trim()" placeholder="请输入步骤名称" maxlength="30" show-word-limit size="small"/>
                </el-form-item>
                <el-form-item label="选择轮牌" prop="roundRuleIds">
                  <el-select v-model="formStep.roundRuleIds" multiple collapse-tags placeholder="请选择轮牌" size="small" clearable filterable style="width:100%">
                    <el-option
                      v-for="round in roundList"
                      :key="round.id"
                      :label="round.name"
                      :value="round.id">{{round.name}}
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="主步骤" prop="main">
                  <el-select v-model="formStep.main" placeholder="请选择是否主步骤" size="small" clearable filterable style="width:100%">
                     <el-option
                        v-for="dict in dict.type.sys_yes_no"
                        :key="dict.value"
                        :label="dict.label"
                        :value="dict.value"
                      />
                  </el-select>
                </el-form-item>
                <el-form-item label="排序" prop="orderNum">
                  <el-input-number v-model="formStep.orderNum" controls-position="right" :min="1" size="small"/>
                </el-form-item>
                <el-form-item label="步骤耗时" prop="durationMinute">
                  <el-input v-model="formStep.durationMinute" placeholder="请输入耗时" size="small" maxlength="4" oninput="value=value.replace(/[^\d]/g,'')">
                    <template slot="append">分钟</template>
                  </el-input>
                </el-form-item>
                <el-form-item label="步骤说明" prop="remark">
                  <el-input v-model="formStep.remark" type="textarea" placeholder="请输入说明" maxlength="60" show-word-limit />
                </el-form-item>
              </el-form>
              <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="submitFormStep">保 存</el-button>
                <el-button @click="cancelStep">取 消</el-button>
              </div>
            </el-dialog>
            
          </el-tab-pane>
          <el-tab-pane label="回访设置" name="visit" v-if="this.form.id">
            <el-row :gutter="10" class="mb8">
              <el-col :span="1.5">
                <el-button type="primary" icon="el-icon-plus" size="mini" @click="handleAddVisit" v-hasPermi="['store:service:add']">添加回访</el-button>
              </el-col>
            </el-row>
            
            <el-table :data="serviceVisitList" ref="serviceVisit">
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
                    v-hasPermi="['store:service:edit']"
                  >修改</el-button>
                  <el-button
                    size="mini"
                    type="text"
                    @click="handleDeleteVisit(scope.row)"
                    v-hasPermi="['store:service:remove']"
                  >删除</el-button>
                </template>
              </el-table-column>
            </el-table>
            
            <!-- 添加或修改服务回访对话框 -->
            <el-dialog :title="titleVisit" class="myform" :visible.sync="openVisit" width="460px" append-to-body :close-on-click-modal="false">
              <el-form ref="formVisit" :model="formVisit" :rules="rulesVisit" label-width="auto">
                <el-input type="hidden" v-model="formVisit.serviceId" />
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
          <el-tab-pane label="商品消耗" name="goods" v-if="this.form.id">
            <el-row :gutter="10" class="mb8">
              <el-col :span="1.5">
                <el-button type="primary" icon="el-icon-plus" size="mini" @click="handleAddGoods" v-hasPermi="['store:service:add']">添加商品</el-button>
              </el-col>
            </el-row>
            
            <el-table :data="serviceGoodsList" ref="serviceGoods">
              <el-table-column label="关联商品" prop="goods.name" width="200" :show-overflow-tooltip="true"/>
              <el-table-column label="商品编号" prop="goods.code" width="120" :show-overflow-tooltip="true"/>
              <el-table-column label="消耗量" prop="useCount" width="100">
                <template slot-scope="scope" v-if="scope.row.useCount">
                  {{ scope.row.useCount }}
                  <template v-for="(item, index) in dict.type.goods_standard_unit">
                    <template v-if="item.value">
                      <span
                        v-if="scope.row.unit == item.value">
                        {{ item.label }}
                      </span>
                    </template>
                  </template>
                </template>
              </el-table-column>
              <el-table-column label="自动出库" prop="autoOut">
                <template slot-scope="scope">
                  <span v-if="scope.row.autoOut === '0'">否</span><span v-else>是</span>
                </template>
              </el-table-column>
              <el-table-column label="操作" align="center" width="80" class-name="small-padding" fixed="right">
                <template slot-scope="scope">
                  <el-button
                    size="mini"
                    type="text"
                    @click="handleUpdateGoods(scope.row)"
                    v-hasPermi="['store:service:edit']"
                  >修改</el-button>
                  <el-button
                    size="mini"
                    type="text"
                    @click="handleDeleteGoods(scope.row)"
                    v-hasPermi="['store:service:remove']"
                  >删除</el-button>
                </template>
              </el-table-column>
            </el-table>
            
            <!-- 添加或修改服务商品对话框 -->
            <el-dialog :title="titleGoods" class="myform goodsForm" :visible.sync="openGoods" width="380px" append-to-body :close-on-click-modal="false">
              <el-form ref="formGoods" :model="formGoods" :rules="rulesGoods" label-width="auto">
                <el-input type="hidden" v-model="formGoods.serviceId" />
                <el-form-item label="选择商品" prop="goodsIdArr">
                  <el-cascader v-model="formGoods.goodsIdArr" :options="goodsOptions" :show-all-levels="false" clearable size="small"></el-cascader>
                </el-form-item>
                <el-form-item label="消耗量" prop="useCount">
                  <el-input placeholder="请输入消耗量" v-model="formGoods.useCount" oninput="value=value.replace(/[^\d]/g,'')" class="input-with-select" size="small" style="width:83%">
                    <el-select v-model="formGoods.unit" slot="append" size="small" placeholder="请选择单位" filterable>
                      <el-option
                        v-for="dict in dict.type.goods_standard_unit"
                        :key="dict.value"
                        :label="dict.label"
                        :value="dict.value">
                        {{dict.label}}
                      </el-option>
                    </el-select>
                  </el-input>
                </el-form-item>
                <el-form-item label="自动出库" prop="autoOut">
                  <el-radio-group v-model="formGoods.autoOut">
                    <el-radio
                      v-for="t in autoOutOptions"
                      :key="t.value"
                      :label="t.value"
                    >{{t.label}}</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-form>
              <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="submitFormGoods">保 存</el-button>
                <el-button @click="cancelGoods">取 消</el-button>
              </div>
            </el-dialog>
          </el-tab-pane>
        </el-tabs>
      </el-form>
      <el-divider></el-divider>
      <div class="el-dialog__footer">
        <el-button type="primary" @click="submitForm" v-if="curTab=='base'">保 存</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-drawer>
  </div>
</template>

<script>
import { cascaderList as classList } from "@/api/store/base/service_class";
import { cascaderList as paymentList } from "@/api/store/base/payment";
import { cascaderList as certList } from "@/api/store/base/cert";
import { cascaderList as goodsList } from "@/api/store/base/goods";
import { listService, getService, delService, addService, updateService, chkServiceCode } from "@/api/store/base/service";
import { listStep, getStep, delStep, addStep, updateStep } from "@/api/store/base/service_step";
import { listServiceGoods, getServiceGoods, delServiceGoods, addServiceGoods, updateServiceGoods } from "@/api/store/base/service_goods";
import { listVisit, getVisit, delVisit, addVisit, updateVisit } from "@/api/store/base/service_visit";
import { getToken } from "@/utils/auth";
import { listBrand } from "@/api/system/dept";
import { listRound } from "@/api/store/base/round_rule";

export default {
  name: "Service",
  dicts: ['sys_normal_disable','sys_dept_group','sys_yes_no','unit_yuan_percent', 'goods_standard_unit'],
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
        { key: 0, label: '服务编号', visible: true },
        { key: 1, label: '服务名称', visible: true },
        { key: 2, label: '分类', visible: true },
        { key: 3, label: '标准价', visible: true },
        { key: 4, label: '会员价', visible: true },
        { key: 5, label: '固定成本', visible: false },
        { key: 6, label: '管理品牌', visible: true },
        { key: 7, label: '业绩归属部门', visible: false },
        { key: 8, label: '服务显示标题', visible: false },
        { key: 9, label: '服务时长', visible: true },
        { key: 10, label: '上下架时间', visible: true },
        { key: 11, label: '状态', visible: true }
      ],
      // 服务表格数据
      serviceList: [],
      // 服务步骤表格数据
      serviceStepList: [],
      serviceVisitList: [],
      serviceGoodsList: [],
      // 服务分类选项
      classOptions: [],
      // 支付方式选项
      paymentOptions: [],
      certOptions: [],
      goodsOptions: [],
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
      autoOutOptions: [{
        value: '0',
        label: '否'
      },{
        value: '1',
        label: '是'
      }],
      durationHourOptions: [{
        value: '0',
        label: '0小时'
      },{
        value: '1',
        label: '1小时'
      },{
        value: '2',
        label: '2小时'
      },{
        value: '3',
        label: '3小时'
      },{
        value: '4',
        label: '4小时'
      },{
        value: '5',
        label: '5小时'
      },{
        value: '6',
        label: '6小时'
      },{
        value: '7',
        label: '7小时'
      },{
        value: '8',
        label: '8小时'
      },{
        value: '9',
        label: '9小时'
      },{
        value: '10',
        label: '10小时'
      },{
        value: '11',
        label: '11小时'
      },{
        value: '12',
        label: '12小时'
      }],
      durationMinuteOptions: [{
        value: '0',
        label: '0分钟'
      },{
        value: '5',
        label: '5分钟'
      },{
        value: '10',
        label: '10分钟'
      },{
        value: '15',
        label: '15分钟'
      },{
        value: '20',
        label: '20分钟'
      },{
        value: '25',
        label: '25分钟'
      },{
        value: '30',
        label: '30分钟'
      },{
        value: '35',
        label: '35分钟'
      },{
        value: '40',
        label: '40分钟'
      },{
        value: '45',
        label: '45分钟'
      },{
        value: '50',
        label: '50分钟'
      },{
        value: '55',
        label: '55分钟'
      }],  
      // 部门品牌列表
      brandList: [],
      roundList: [],
      couponList: [],
      // 弹出层标题
      title: "",
      titleStep: '',
      titleVisit: '',
      titleGoods: '',
      // 是否显示弹出层
      open: false,
      openStep: false,
      openVisit: false,
      openGoods: false,
      // -----图片上传参数-------
      imageUrl: '',
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
      formStep: {},
      formVisit: {},
      formGoods: {},
      curTab: 'base',
      // 表单校验
      rules: {
        deptId: [
          { required: true, message: "管理品牌不能为空", trigger: "blur" }
        ],
        name: [
          { required: true, message: "服务名称不能为空", trigger: "blur" }
        ],
        code: [
          { required: true, message: "服务编号不能为空", trigger: "blur" }
        ],
        status: [
          { required: true, message: "状态不能为空", trigger: "blur" }
        ],
        classIdArr: [
          { required: true, message: "分类不能为空", trigger: "blur" }
        ],
        perfToDept: [
          { required: true, message: "不能为空", trigger: "blur" }
        ],
        standardPrice: [
          { required: true, message: "不能为空", trigger: "blur" },
          { pattern: /^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/, message: "只能为数字，且最多2位小数", trigger: "change" }
        ],
        memberPrice: [
          { pattern: /^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/, message: "只能为数字，且最多2位小数", trigger: "change" }
        ],
        cost: [
          { pattern: /^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/, message: "只能为数字，且最多2位小数", trigger: "change" }
        ]
      },
      rulesStep: {
        name: [
          { required: true, message: "步骤名称不能为空", trigger: "blur" }
        ],
        roundRuleIds: [
          { required: true, message: "轮牌不能为空", trigger: "blur" }
        ],
        durationMinute: [
          {pattern: /^\d+$/, message: "只能为数字", trigger: "change"}
        ]
      },
      rulesVisit: {
        type: [
          { required: true, message: "回访类型不能为空", trigger: "blur" }
        ],
        period: [
          { required: true, message: "回访周期不能为空", trigger: "blur" }/*,
          { pattern: /^\d+$/, message: "只能为数字", trigger: "change" }*/
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
      rulesGoods: {
        goodsIdArr: [
          { required: true, message: "商品不能为空", trigger: "blur" }
        ],
        useCount: [
          { required: true, message: "消耗量不能为空", trigger: "blur" },
          { pattern: /^\d+$/, message: "只能为数字", trigger: "change" }
        ],
        unit: [
          { required: true, message: "消耗量单位不能为空", trigger: "blur" }
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
    /** 查询服务列表 */
    getList() {
      this.loading = true;
      listService(this.queryParams).then(response => {
        this.serviceList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    /** 查询服务分类列表 */
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
    /** 查询证书列表 */
    getCertList() {
      certList().then(response => {
        this.certOptions = response.data;
      });
    },
    //查询部门（品牌级别）列表
    getBrandList() {
      listBrand().then(response => {
        this.brandList = response.data;
      });
    },
    getGoodsList() {
      goodsList().then(response => {
        this.goodsOptions = response.data;
      });
    },
    getServiceStepList(serviceId) {
      listStep(serviceId).then(response => {
        this.serviceStepList = response.data;
      });
    },
    getRoundList() { 
      listRound().then(response => {
        this.roundList = response.rows;
      });
    },
    getServiceVisitList(serviceId) {
      listVisit(serviceId).then(response => {
        this.serviceVisitList = response.data;
      });
    },
    getServiceGoodsList(serviceId) {
      listServiceGoods(serviceId).then(response => {
        this.serviceGoodsList = response.data;
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
    chkServiceCode(code) {
        chkServiceCode(code, this.form.id?this.form.id:0);
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    cancelStep() {
      this.openStep = false;
      this.resetStep();
    },
    cancelVisit() {
      this.openVisit = false;
      this.resetVisit();
    },
    cancelGoods() {
      this.openGoods = false;
      this.resetGoods();
    },
    // 表单重置
    reset() {
      this.form = {
        id: null,
        name: null,
        deptId: null,
        code: null,
        standardPrice: null,
        memberPrice: null,
        classId: null,
        cost: null,
        costUnit: null,
        perfToDept: null,
        displayTitle: null,
        durationHour: null,
        durationMinute: null,
        putawayStartTime: null,
        putawayEndTime: null,
        putawayTime: [],
        description: null,
        status: "0",
        remark: null,
        image: null
      };
      this.imageUrl = '';
      this.serviceStepList = [];
      this.serviceVisitList = [];
      this.serviceGoodsList = [];
      this.resetForm("form");
      this.noneBtnImg=false;
      this.curTab='base';
    },
    resetStep() {
      this.formStep = {
        id: null,
        serviceId: this.form.id,
        name: null,
        main: null,
        roundRuleIds: [],
        durationMinute: null,
        orderNum: 0,
        remark: null
      };
      this.resetForm("formStep");
    },
    resetVisit() {
      this.formVisit = {
        id: null,
        serviceId: this.form.id,
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
        serviceId: this.form.id,
        goodsId: null,
        useCount: null,
        autoOut: 0
      };
      this.resetForm("formGoods");
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
      this.getCertList();
      this.open = true;
      this.title = "添加服务";
      this.form.costUnit = this.dict.type.unit_yuan_percent[0].value;
      this.form.durationHour = 0;
      this.form.durationMinute = 30;
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      this.getBrandList();
      this.getPaymentList();
      this.getCertList();
      const id = row.id || this.ids
      getService(id).then(response => {
        this.form = response.data;
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
        
        if(this.form.image) {
          this.imageUrl = this.form.image.url;
        }
        
        this.open = true;
        this.title = "修改服务";
      });
    },
    /** 复制按钮操作 */
    handleCopy(row) {
      this.reset();
      this.getBrandList();
      this.getPaymentList();
      this.getCertList();
      const id = row.id || this.ids
      getService(id).then(response => {
        this.form = response.data;
        this.form.id = null;
        this.form.code = null;
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
        
        /*if(this.form.image) {
          this.imageUrl = this.form.image.url;
        }*/
        
        this.open = true;
        this.title = "添加服务";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateService(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addService(this.form).then(response => {
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
      this.$modal.confirm('是否确认删除服务编号为"' + ids + '"的数据项？').then(function() {
        return delService(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 服务步骤添加按钮操作 */
    handleAddStep() {
      this.resetStep();
      this.getRoundList();
      this.formStep.orderNum = this.serviceStepList.length+1;
      this.openStep = true;
      this.titleStep = "添加步骤";
    },
    handleUpdateStep(row) {
      this.resetStep();
      this.getRoundList();
      const id = row.id || this.ids
      getStep(id).then(response => {
        this.formStep = response.data;
        
        this.openStep = true;
        this.titleStep = "修改步骤";
      });
    },
    submitFormStep() {
      this.$refs["formStep"].validate(valid => {
        if (valid) {
          if (this.formStep.id != null) {
            updateStep(this.formStep).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.openStep = false;
              this.getServiceStepList(this.formStep.serviceId);
            });
          } else {
            addStep(this.formStep).then(response => {
              this.$modal.msgSuccess("新增成功");
              this.openStep = false;
              this.getServiceStepList(this.formStep.serviceId);
            });
          }
        }
      });
    },
    /** 服务步骤删除按钮操作 */
    handleDeleteStep(row) {
      const id = row.id;
      this.$modal.confirm('是否确认删除"' + row.name + '"？').then(function() {
        return delStep(id);
      }).then(() => {
        this.getServiceStepList(row.serviceId);
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
              this.getServiceVisitList(this.formVisit.serviceId);
            });
          } else {
            addVisit(this.formVisit).then(response => {
              this.$modal.msgSuccess("新增成功");
              this.openVisit = false;
              this.getServiceVisitList(this.formVisit.serviceId);
            });
          }
        }
      });
    },
    /** 服务步骤删除按钮操作 */
    handleDeleteVisit(row) {
      const id = row.id;
      this.$modal.confirm('是否确认删除"' + row.type + '"？').then(function() {
        return delVisit(id);
      }).then(() => {
        this.getServiceVisitList(row.serviceId);
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    
    handleAddGoods() {
      this.resetGoods();
      this.getGoodsList();
      this.formGoods.autoOut = '0';
      this.openGoods = true;
      this.titleGoods = "添加商品消耗";
    },
    handleUpdateGoods(row) {
      this.resetGoods();
      this.getGoodsList();
      const id = row.id || this.ids
      getServiceGoods(id).then(response => {
        this.formGoods = response.data;
        
        this.openGoods = true;
        this.titleGoods = "修改商品消耗";
      });
    },
    submitFormGoods() {
      this.$refs["formGoods"].validate(valid => {
        if (valid) {
          if (this.formGoods.id != null) {
            updateServiceGoods(this.formGoods).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.openGoods = false;
              this.getServiceGoodsList(this.formGoods.serviceId);
            });
          } else {
            addServiceGoods(this.formGoods).then(response => {
              this.$modal.msgSuccess("新增成功");
              this.openGoods = false;
              this.getServiceGoodsList(this.formGoods.serviceId);
            });
          }
        }
      });
    },
    /** 服务步骤删除按钮操作 */
    handleDeleteGoods(row) {
      const id = row.id;
      this.$modal.confirm('是否确认删除？').then(function() {
        return delServiceGoods(id);
      }).then(() => {
        this.getServiceGoodsList(row.serviceId);
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    
    /** 导出按钮操作 */
    handleExport() {
      this.download('store/service/export', {
        ...this.queryParams
      }, `store_service.xlsx`)
    },
    handleTabClick(tab) {
      //console.log(tab.loaded);
      if(tab.name == 'step' && !tab.loaded) {
        this.getServiceStepList(this.form.id);
      } else if(tab.name == 'visit' && !tab.loaded) {
        this.getServiceVisitList(this.form.id);
      } else if(tab.name == 'goods' && !tab.loaded) {
        this.getServiceGoodsList(this.form.id);
      }
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
      this.noneBtnImg = fileList.length >= 1;
    },
    // 超出上传最大数
    handleFileOverstep(files, fileList) {
      this.$message.error("最多只能上传1张图片");
    },
    // 文件删除操作
    handleFileRemove(file, fileList) {
      this.fileList = [];
      this.fileList = fileList;
      this.noneBtnImg = fileList.length >= 1;
      
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
      this.form.image = {'url': res.data.url};
      this.imageUrl = res.data.url;
    },
    handleFilePreview() {
      this.dialogImageUrl = this.form.image.url;
      this.dialogVisible = true;
    },
    handleFileRemove() {
      this.form.image = null;
      this.imageUrl = null;
    }
  }
};
</script>

<style>
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
  .el-upload-list--picture-card .el-upload-list__item {
    width: 108px;
    height: 108px;
  }
  .el-descriptions__title {
    font-size: 13px;
  }
  .goodsForm .input-with-select .el-select {
    width: 95px;
  }
</style>