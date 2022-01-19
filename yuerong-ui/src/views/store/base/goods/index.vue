<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="商品名称" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入商品名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="商品分类" prop="classIdArr">
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
          v-hasPermi="['store:base:goods:add']"
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
          v-hasPermi="['store:base:goods:edit']"
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
          v-hasPermi="['store:base:goods:remove']"
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
          v-hasPermi="['store:base:goods:add']"
        >复制</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          :loading="exportLoading"
          @click="handleExport"
          v-hasPermi="['store:base:goods:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList" :columns="columns"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="goodsList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="商品编码" v-if="columns[0].visible" align="center" prop="code" />
      <el-table-column label="商品名称" align="center" prop="name" :show-overflow-tooltip="true" />
      <el-table-column label="商品分类" v-if="columns[1].visible" align="center" prop="goodsClass.name" />
      <el-table-column label="标准价" v-if="columns[2].visible" align="center" prop="standardPrice" />
      <el-table-column label="销售价" v-if="columns[3].visible" align="center" prop="salesPrice" />
      <el-table-column label="会员价" v-if="columns[4].visible" align="center" prop="memberPrice" />
      <el-table-column label="采购价" v-if="columns[5].visible" align="center" prop="purchasePrice" />
      <el-table-column label="门店价" v-if="columns[6].visible" align="center" prop="storePrice" />
      <el-table-column label="成本价" v-if="columns[7].visible" align="center" prop="cost" />
      <el-table-column label="标准单位" v-if="columns[8].visible" align="center" prop="unit">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.goods_standard_unit" :value="scope.row.unit"/>
        </template>
      </el-table-column>
      <el-table-column label="商品供应商" v-if="columns[9].visible" align="center" prop="goodsSupplier.name" />
      <el-table-column label="商品类型" v-if="columns[10].visible" align="center" prop="type">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.goods_type" :value="scope.row.type"/>
        </template>
      </el-table-column>
      <el-table-column label="销售类型" v-if="columns[11].visible" align="center" prop="saleType">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.goods_sale_type" :value="scope.row.saleType"/>
        </template>
      </el-table-column>
      <el-table-column label="采购类型" v-if="columns[12].visible" align="center" prop="purchaseType">
      <template slot-scope="scope">
          <dict-tag :options="dict.type.goods_purchase_type" :value="scope.row.purchaseType"/>
        </template>
      </el-table-column>
      <el-table-column label="归属组织" v-if="columns[13].visible" align="center" prop="dept.deptName" />
      <el-table-column label="适用组织" v-if="columns[14].visible" align="center" prop="deptName" :show-overflow-tooltip="true" />
      <el-table-column label="状态" v-if="columns[15].visible" align="center" prop="status">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.sys_normal_disable" :value="scope.row.status"/>
        </template>
      </el-table-column>
      <el-table-column label="业绩归属部门" v-if="columns[16].visible" align="center" prop="perfToDept">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.sys_dept_group" :value="scope.row.perfToDept"/>
        </template>
      </el-table-column>
      <el-table-column label="商品购买是否受库存限制" v-if="columns[17].visible" align="center" prop="buyLimitStock">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.sys_yes_no" :value="scope.row.buyLimitStock"/>
        </template>
      </el-table-column>
      <el-table-column label="商品品牌" v-if="columns[18].visible" align="center" prop="goodsBrand">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.goods_brand" :value="scope.row.goodsBrand"/>
        </template>
      </el-table-column>
      <el-table-column label="有效期" v-if="columns[19].visible" align="center" prop="expDate" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.expDate, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="110" fixed="right">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['store:base:goods:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['store:base:goods:remove']"
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

    <!-- 添加或修改商品资料对话框 -->
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
        <!-- el-divider content-position="center">基础信息</el-divider -->
        <el-form-item label="商品名称" prop="name">
          <el-input v-model="form.name" @blur="form.name=$event.target.value.trim()" placeholder="请输入商品名称" maxlength="100" show-word-limit size="small"/>
        </el-form-item>
        <el-row>
          <el-col :span="12">
            <el-form-item prop="code">
              <span slot="label">
                <el-tooltip content="建议规则：xx品牌+xx年份+xx月份+xxx前三个商品名称拼音首字母+xxx数字序号，如：JS2105ZST001" placement="top">
                  <i class="el-icon-question"></i>
                </el-tooltip>
                                                商品编码
              </span>
              <el-input v-model="form.code" placeholder="请输入商品编码" maxlength="30" show-word-limit size="small" @change="chkGoodsCode"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="商品分类" prop="classId">
              <el-cascader v-model="form.classIdArr" :options="classOptions" clearable size="small"></el-cascader>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
             <el-form-item label="商品品牌" prop="goodsBrand">
              <el-select v-model="form.goodsBrand" placeholder="请选择商品品牌" size="small" clearable filterable>
                 <el-option
                    v-for="dict in dict.type.goods_brand"
                    :key="dict.value"
                    :label="dict.label"
                    :value="dict.value"
                  />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="供应商" prop="supplierId">
              <el-select v-model="form.supplierId" placeholder="请选择供应商" size="small" clearable filterable>
                 <el-option
                    v-for="item in supplierOptions"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="有效期" prop="expDate">
              <el-date-picker clearable size="small"
                v-model="form.expDate"
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="选择有效期">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="商品类型" prop="type">
              <el-select v-model="form.type" placeholder="请选择商品类型" size="small" clearable >
                <el-option
                    v-for="dict in dict.type.goods_type"
                    :key="dict.value"
                    :label="dict.label"
                    :value="dict.value"
                  />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="销售类型" prop="saleType">
              <el-select v-model="form.saleType" placeholder="请选择销售类型" size="small" clearable >
                 <el-option
                    v-for="dict in dict.type.goods_sale_type"
                    :key="dict.value"
                    :label="dict.label"
                    :value="dict.value"
                  />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="采购类型" prop="purchaseType">
              <el-select v-model="form.purchaseType" placeholder="请选择采购类型" size="small" clearable >
                <el-option
                    v-for="dict in dict.type.goods_purchase_type"
                    :key="dict.value"
                    :label="dict.label"
                    :value="dict.value"
                  />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="管理品牌" prop="deptId">
              <el-select v-model="form.deptId" placeholder="请选择" size="small" clearable filterable>
                <el-option
                  v-for="brand in brandList"
                  :key="brand.deptId"
                  :label="brand.deptName"
                  :value="brand.deptId">{{brand.deptName}}
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="适用组织" prop="deptIds">
              <el-select v-model="form.chkDeptIds" multiple collapse-tags placeholder="请选择" size="small" clearable filterable>
                <el-option
                  v-for="brand in brandList"
                  :key="brand.deptId"
                  :label="brand.deptName"
                  :value="brand.deptId">{{brand.deptName}}
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="标准单位" prop="unit">
              <el-select v-model="form.unit" placeholder="请选择" size="small" clearable filterable>
                 <el-option
                    v-for="dict in dict.type.goods_standard_unit"
                    :key="dict.value"
                    :label="dict.label"
                    :value="dict.value"
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
            
        <el-divider content-position="center">价格信息</el-divider>
        <el-row>
          <el-col :span="12">
            <el-form-item label="标准价" prop="standardPrice">
              <el-input v-model="form.standardPrice" placeholder="请输入标准价" size="small" maxlength="24">
                <template slot="append">元</template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="销售价" prop="salesPrice">
              <el-input v-model="form.salesPrice" placeholder="请输入销售价" size="small" maxlength="24">
                <template slot="append">元</template>
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="门店价" prop="storePrice">
              <el-input v-model="form.storePrice" placeholder="请输入门店价" size="small" maxlength="24">
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
            <el-form-item label="采购价" prop="purchasePrice">
              <el-input v-model="form.purchasePrice" placeholder="请输入采购价" size="small" maxlength="24">
                <template slot="append">元</template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="成本价" prop="cost">
              <el-input v-model="form.cost" placeholder="请输入成本价" size="small" maxlength="24">
                <template slot="append">元</template>
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
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
          <el-col :span="9" :offset="3">
            <el-form-item prop="buyLimitStock">
              <span slot="label">
                <el-tooltip content="关闭则代表库存仅为展示数字" placement="top">
                  <i class="el-icon-question"></i>
                </el-tooltip>
                                                购买是否受库存限制
              </span>
              <el-switch
                v-model="form.buyLimitStock"
                active-value="Y"
                inactive-value="N">
              </el-switch>
            </el-form-item>
          </el-col>
        </el-row>
        
        <!-- el-form-item label="备用字段" prop="field1">
          <el-input v-model="form.field1" placeholder="请输入备用字段" size="small"/>
        </el-form-item>
        <el-form-item label="备用字段" prop="field2">
          <el-input v-model="form.field2" placeholder="请输入备用字段" size="small"/>
        </el-form-item>
        <el-form-item label="备用字段" prop="field3">
          <el-input v-model="form.field3" placeholder="请输入备用字段" size="small"/>
        </el-form-item -->
        
        <el-divider content-position="center">商品规格信息</el-divider>
        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button type="primary" icon="el-icon-plus" size="mini" @click="handleAddGoodsSpec">添加</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="handleDeleteGoodsSpec">删除</el-button>
          </el-col>
        </el-row>
        <el-table :data="goodsSpecList" :row-class-name="rowGoodsSpecIndex" @selection-change="handleGoodsSpecSelectionChange" ref="goodsSpec" size="mini" stripe>
          <el-table-column type="selection" width="50" align="center" />
          <el-table-column type="expand" fixed="left">
              <template slot-scope="props">
                <el-descriptions title="规格详情" direction="" size="small">
                    <el-descriptions-item label="划线价">{{ props.row.origPrice }} 元</el-descriptions-item>
                    <el-descriptions-item label="售价">{{ props.row.price }} 元</el-descriptions-item>
                    <el-descriptions-item label="标准单位">
                      <template v-for="(item, index) in dict.type.goods_standard_unit">
                        <template v-if="item.value">
                          <div
                            v-if="props.row.unit == item.value">
                            {{ item.label }}
                          </div>
                        </template>
                      </template>
                    </el-descriptions-item>
                    <el-descriptions-item label="长宽高">
                      {{ props.row.length?props.row.length:0 }} * {{ props.row.width?props.row.width:0 }} * {{ props.row.height?props.row.height:0 }} cm
                    </el-descriptions-item>
                    <el-descriptions-item label="重量">{{ props.row.weight }} 克</el-descriptions-item>
                    <el-descriptions-item label="上架时间">{{ parseTime(props.row.putawayStartTime, '{y}-{m}-{d}') }} ~ {{ parseTime(props.row.putawayEndTime, '{y}-{m}-{d}') }}</el-descriptions-item>
                    <el-descriptions-item label="描述" span="3" v-if="props.row.remark">{{ props.row.remark }}</el-descriptions-item>
                    <el-descriptions-item label="规格图片">
                      <template v-for="(item, index) in props.row.images">
                        <el-image 
                            style="width:38px;height:38px;margin-right:3px;"
                            :src="item.url"
                            :preview-src-list="[item.url]">
                            <div slot="error" class="image-slot">
                              <i class="el-icon-picture-outline"></i>
                            </div>
                        </el-image>
                      </template>
                    </el-descriptions-item>
                </el-descriptions>
                
              </template>
          </el-table-column>
          <!-- el-table-column label="序号" align="center" prop="index" width="50"/ -->
          <el-table-column label="规格编号" prop="code" width="145" :show-overflow-tooltip="true"/>
          <el-table-column label="规格名称" prop="name" width="145" :show-overflow-tooltip="true"/>
          <el-table-column label="条形码" prop="barcode" width="110" :show-overflow-tooltip="true"/>
          <el-table-column label="状态" prop="status">
            <template slot-scope="scope">
              <dict-tag :options="dict.type.sys_normal_disable" :value="scope.row.status"/>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" width="50" class-name="small-padding" fixed="right">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="text"
                @click="handleUpdateGoodsSpec(scope.row)"
                v-hasPermi="['store:base:goods:edit']"
              >修改</el-button>
              <!-- el-button
                size="mini"
                type="text"
                @click="handleDeleteGoodsSpec(scope.row)"
                v-hasPermi="['store:base:goods:remove']"
              >删除</el-button -->
            </template>
          </el-table-column>
        </el-table>
        
        <el-divider content-position="center"></el-divider>
        
        <el-form-item label="商品图片" prop="" label-width="auto">
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
        
        <el-form-item label="商品简介" prop="remark">
          <editor v-model="form.remark" :height="200"/>
        </el-form-item>
        
        
        <!-- 添加或修改商品规格对话框 -->
        <el-dialog :title="titleSpec" class="myform" :visible.sync="openSpec" width="500px" append-to-body :close-on-click-modal="false">
          <el-form ref="formSpec" :model="formSpec" :rules="rulesSpec" label-width="auto">
            <el-input type="hidden" v-model="formSpec.goodsId" />
            <el-form-item label="规格名称" prop="name">
              <el-input v-model="formSpec.name" @blur="formSpec.name=$event.target.value.trim()" placeholder="请输入规格名称" maxlength="100" show-word-limit size="small"/>
            </el-form-item>
            <el-form-item label="规格编号" prop="code" v-if="formSpec.code">
              <el-input v-model="formSpec.code" :disabled="true" placeholder="请输入规格编号" maxlength="30" show-word-limit size="small" @change="chkSpecCode"/>
            </el-form-item>
            <el-form-item label="条形码" prop="barcode">
              <el-input v-model.trim="formSpec.barcode" placeholder="请输入条形码" maxlength="30" show-word-limit size="small" @change="chkSpecBarcode"/>
            </el-form-item>
            <el-row>
              <el-col :span="12">
                <el-form-item label="划线价" prop="origPrice">
                  <el-input v-model="formSpec.origPrice" placeholder="请输入划线价" size="small" maxlength="24">
                    <template slot="append">元</template>
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="售价" prop="price">
                  <el-input v-model="formSpec.price" placeholder="请输入售价" size="small" maxlength="24">
                    <template slot="append">元</template>
                  </el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="会员价" prop="memberPrice">
                  <el-input v-model="formSpec.memberPrice" placeholder="请输入会员价" size="small" maxlength="24">
                    <template slot="append">元</template>
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="长" prop="length">
                  <el-input v-model="formSpec.length" placeholder="请输入长" size="small" maxlength="6">
                    <template slot="append">cm</template>
                  </el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="宽" prop="width">
                  <el-input v-model="formSpec.width" placeholder="请输入宽" size="small" maxlength="6">
                    <template slot="append">cm</template>
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="高" prop="height">
                  <el-input v-model="formSpec.height" placeholder="请输入高" size="small" maxlength="6">
                    <template slot="append">cm</template>
                  </el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="重量" prop="weight">
                  <!-- el-input v-model="formSpec.weight" placeholder="请输入重量" size="small" -->
                  <el-input-number v-model="formSpec.weight" controls-position="right" :min="0" :max="999999" size="small">
                  </el-input-number> 克
                </el-form-item>
              </el-col>
               <el-col :span="12">
                <el-form-item label="标准单位" prop="unit">
                  <el-select v-model="formSpec.unit" placeholder="请选择" size="small" clearable filterable>
                    <el-option
                      v-for="dict in dict.type.goods_standard_unit"
                      :key="dict.value"
                      :label="dict.label"
                      :value="dict.value"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-form-item label="状态" prop="status">
              <el-radio-group v-model="formSpec.status">
                <el-radio
                  v-for="dict in dict.type.sys_normal_disable"
                  :key="dict.value"
                  :label="dict.value"
                >{{dict.label}}</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="上架时间" prop="putawayTime">
              <el-date-picker
                  v-model="formSpec.putawayTime"
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
            <el-form-item label="规格图片" prop="" label-width="auto">
              <div class="imgUpload">
                <el-upload
                  :class="{ disUoloadSty: noneBtnImg1 }"
                  multiple
                  ref="upload1"
                  :action="uploadFileUrl"
                  :headers="headers"
                  list-type="picture-card"
                  :file-list="fileList1"
                  :limit="6"
                  :on-change="handleFileChange1"
                  :on-preview="handlePictureCardPreview1"
                  :on-exceed="handleFileOverstep1"
                  :on-remove="handleFileRemove1"
                  :before-upload="beforeFileUpload"
                  :on-success="handleFileUploadSuccess1"
                  accept="image/png,image/jpeg,image/jpg"
                >
                  <i class="el-icon-plus"></i>
                  <div slot="tip" class="el-upload__tip">
                    <span>1、支持图片格式：JPG/JPEG/PNG</span><br>
                    <span>2、建议尺寸：750*750 像素，大小不能超过1MB，最多6张</span>
                  </div>
                </el-upload>
                <el-dialog :visible.sync="dialogVisible1" :modal="false">
                  <img width="100%" :src="dialogImageUrl1" alt="" />
                </el-dialog>
              </div>  
            </el-form-item>
            <el-form-item label="描述" prop="remark">
              <el-input v-model="formSpec.remark" type="textarea" placeholder="请输入内容" maxlength="300" show-word-limit />
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click="submitFormSpec">确 定</el-button>
            <el-button @click="cancelSpec">取 消</el-button>
          </div>
        </el-dialog>
        
        
      </el-form>
      <el-divider></el-divider>
      <div class="el-dialog__footer">
        <el-button type="primary" @click="submitForm" :loading="saving">
          <span v-if="!saving">保 存</span>
          <span v-else>保 存 中...</span>
        </el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-drawer>
    
  </div>
</template>

<script>
import { listGoods, getGoods, chkGoodsCode, delGoods, addGoods, updateGoods, exportGoods } from "@/api/store/base/goods";
import { listSpec, getSpec, chkSpecCode, chkSpecBarcode, delSpec, addSpec, updateSpec } from "@/api/store/base/goods_spec";
import { cascaderList as classList } from "@/api/store/base/goods_class";
import { cascaderList as supplierList } from "@/api/store/base/goods_supplier";
import { listBrand } from "@/api/system/dept";
import { getToken } from "@/utils/auth";

export default {
  name: "Goods",
  dicts: ['sys_normal_disable','goods_brand','goods_type','goods_sale_type','goods_purchase_type','goods_standard_unit','sys_dept_group','sys_yes_no'],
  data() {
    return {
      // 遮罩层
      loading: true,
      saving: false,
      // 导出遮罩层
      exportLoading: false,
      // 选中数组
      ids: [],
      // 子表选中数据
      checkedGoodsSpec: [],
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
        { key: 0, label: '商品编码', visible: true },
        { key: 1, label: '商品分类', visible: true },
        { key: 2, label: '标准价', visible: true },
        { key: 3, label: '销售价', visible: true },
        { key: 4, label: '会员价', visible: true },
        { key: 5, label: '采购价', visible: true },
        { key: 6, label: '门店价', visible: true },
        { key: 7, label: '成本价', visible: true },
        { key: 8, label: '标准单位', visible: false },
        { key: 9, label: '商品供应商', visible: true },
        { key: 10, label: '商品类型', visible: false },
        { key: 11, label: '销售类型', visible: false },
        { key: 12, label: '采购类型', visible: false },
        { key: 13, label: '归属组织', visible: false },
        { key: 14, label: '适用组织', visible: false },
        { key: 15, label: '状态', visible: true },
        { key: 16, label: '业绩归属部门', visible: false },
        { key: 17, label: '商品购买是否受库存限制', visible: false },
        { key: 18, label: '商品品牌', visible: false },
        { key: 19, label: '有效期', visible: false }
      ],
      // 商品资料表格数据
      goodsList: [],
      // 商品规格表格数据
      goodsSpecList: [],
      // 弹出层标题
      title: "",
      titleSpec: "",
      // 是否显示弹出层
      open: false,
      openSpec: false,
      // 商品分类选项
      classOptions: [],
      // 商品供应商选项
      supplierOptions: [],
      // 组织品牌列表
      brandList: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        name: null,
        classId: null,
        status: null,
      },
      // 表单参数
      form: {},
      formSpec: {},
      // -----图片上传参数-------
      fileList: [],
      dialogVisible: false,
      dialogImageUrl: "",
      noneBtnImg: false,
      fileList1: [],
      dialogVisible1: false,
      dialogImageUrl1: "",
      noneBtnImg1: false,
      uploadFileUrl: process.env.VUE_APP_BASE_API + "/file/upload",
      headers: {
        Authorization: "Bearer " + getToken(),
      },
      // --------------------
      // 表单校验
      rules: {
        name: [
          { required: true, message: "商品名称不能为空", trigger: "blur" }
        ],
        code: [
          { required: true, message: "商品编码不能为空", trigger: "blur" },
          { pattern: /^[0-9A-Z]+$/, message: "只能为数字或(和)大写字母组合", trigger: "change" }
        ],
        standardPrice: [
          {pattern: /^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/, message: "只能为数字，且最多2位小数", trigger: "change" }
        ],
        salesPrice: [
          {pattern: /^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/, message: "只能为数字，且最多2位小数", trigger: "change" }
        ],
        memberPrice: [
          {pattern: /^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/, message: "只能为数字，且最多2位小数", trigger: "change" }
        ],
        purchasePrice: [
          {pattern: /^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/, message: "只能为数字，且最多2位小数", trigger: "change" }
        ],
        storePrice: [
          {pattern: /^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/, message: "只能为数字，且最多2位小数", trigger: "change" }
        ],
        cost: [
          {pattern: /^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/, message: "只能为数字，且最多2位小数", trigger: "change" }
        ]
      },
      rulesSpec: {
        name: [
          { required: true, message: "规格名称不能为空", trigger: "blur" }
        ],
        code: [
          { required: true, message: "规格编号不能为空", trigger: "blur" },
          { pattern: /^[0-9A-Z]+$/, message: "只能为数字或(和)大写字母组合", trigger: "change" }
        ],
        origPrice: [
          {pattern: /^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/, message: "只能为数字，且最多2位小数", trigger: "change" }
        ],
        price: [
          {pattern: /^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/, message: "只能为数字，且最多2位小数", trigger: "change" }
        ],
        memberPrice: [
          {pattern: /^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/, message: "只能为数字，且最多2位小数", trigger: "change" }
        ],
        length: [
          {pattern: /^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/, message: "只能为数字，且最多2位小数", trigger: "change" }
        ],
        width: [
          {pattern: /^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/, message: "只能为数字，且最多2位小数", trigger: "change" }
        ],
        height: [
          {pattern: /^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/, message: "只能为数字，且最多2位小数", trigger: "change" }
        ],
        weight: [
          {pattern: /^((0)|([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/, message: "只能为数字，且最多2位小数", trigger: "change" }
        ]
      }
    };
  },
  created() {
    this.getList();
    this.getClassList();
  },
  methods: {
    /** 查询商品资料列表 */
    getList() {
      this.loading = true;
      listGoods(this.queryParams).then(response => {
        this.goodsList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    /** 查询商品分类列表 */
    getClassList() {
      classList().then(response => {
        this.classOptions = response.data;
      });
    },
    /** 查询商品供应商列表 */
    getSupplierList() {
      supplierList().then(response => {
        this.supplierOptions = response.data;
      });
    },
    //查询品牌列表
    getBrandList() {
      listBrand().then(response => {
        this.brandList = response.data;
      });
    },
    putawayTimeChange(val) {
      this.$forceUpdate();//修改操作需要使用强制更新
      if(val) {
        this.formSpec.putawayStartTime = val[0];
        this.formSpec.putawayEndTime = val[1];
      } else {
        this.formSpec.putawayStartTime = null;
        this.formSpec.putawayEndTime = null;
        this.formSpec.putawayTime = [];
      }
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        id: null,
        name: null,
        code: null,
        classId: null,
        goodsBrand: null,
        expDate: null,
        supplierId: null,
        type: null,
        standardPrice: null,
        salesPrice: null,
        memberPrice: null,
        purchasePrice: null,
        storePrice: null,
        cost: null,
        deptId: null,
        status: "0",
        perfToDept: null,
        buyLimitStock: null,
        createBy: null,
        createTime: null,
        updateBy: null,
        updateTime: null,
        remark: null,
        field1: null,
        field2: null,
        field3: null,
        images: []
      };
      this.goodsSpecList = [];
      this.resetForm("form");
      this.fileList = [];
      this.dialogVisible=false;
      this.dialogImageUrl="";
      this.noneBtnImg=false;
    },
    resetSpec() {
      this.formSpec = {
        id: null,
        goodsId: this.form.id,
        code: null,
        name: null,
        barcode: null,
        origPrice: null,
        price: null,
        memberPrice: null,
        unit: null,
        length: null,
        width: null,
        height: null,
        weight: null,
        putawayStartTime: null,
        putawayEndTime: null,
        putawayTime: [],
        status: "0",
        remark: null,
        images: []
      };
      //this.resetForm("formSpec");
      this.fileList1 = [];
      this.dialogVisible1=false;
      this.dialogImageUrl1="";
      this.noneBtnImg1=false;
    },
    cancelSpec() {
      this.openSpec = false;
      this.resetSpec();
    },
    chkGoodsCode(code) {
        chkGoodsCode(code, this.form.id?this.form.id:0);
    },
    chkSpecCode(code) {
        chkSpecCode(code, this.formSpec.id?this.formSpec.id:0);
    },
    chkSpecBarcode(barcode) {
        chkSpecBarcode(barcode, this.formSpec.id?this.formSpec.id:0);
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
      this.getSupplierList();
      this.getBrandList();
      this.open = true;
      this.title = "添加商品资料";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      this.getSupplierList();
      this.getBrandList();
      const id = row.id || this.ids
      getGoods(id).then(response => {
        this.form = response.data;
        this.goodsSpecList = response.data.goodsSpecList;
        this.fileList = response.data.images;
        if(this.fileList) {
          this.noneBtnImg = this.fileList.length >= 6;
        } else {
          this.fileList = [];
        }
        this.open = true;
        this.title = "修改商品资料";
      });
    },
    /** 复制按钮操作 */
    handleCopy(row) {
      this.reset();
      this.getSupplierList();
      this.getBrandList();
      const id = row.id || this.ids;
      getGoods(id).then(response => {
        this.form = response.data;
        this.form.id = null;
        this.form.code = null;
        /*this.goodsSpecList = response.data.goodsSpecList;
        this.fileList = response.data.images;
        if(this.fileList) {
          this.noneBtnImg = this.fileList.length >= 6;
        } else {
          this.fileList = [];
        }*/
        this.open = true;
        this.title = "添加商品资料";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          this.saving = true;
          this.form.goodsSpecList = this.goodsSpecList;
          if (this.form.id != null) {
            updateGoods(this.form).then(response => {
              this.saving = false;
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addGoods(this.form).then(response => {
              this.saving = false;
              this.msgSuccess("新增成功");
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
      this.$confirm('是否确认删除商品资料编号为"' + ids + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delGoods(ids);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(() => {});
    },
	/** 商品规格序号 */
    rowGoodsSpecIndex({ row, rowIndex }) {
      row.index = rowIndex + 1;
    },
    /** 商品规格添加按钮操作 */
    handleAddGoodsSpec() {
      this.resetSpec();
      this.openSpec = true;
      this.titleSpec = "添加商品规格";
    },
    /** 修改按钮操作 */
    handleUpdateGoodsSpec(row) {
      this.resetSpec();
      this.formSpec = row;
      if(!this.formSpec.putawayTime) {
        this.formSpec.putawayTime=[];
      }
      if(row.putawayStartTime) {
        this.formSpec.putawayTime.push(row.putawayStartTime);
      }
      if(row.putawayEndTime) {
        this.formSpec.putawayTime.push(row.putawayEndTime);
      }
      row.putawayTime = this.formSpec.putawayTime;
      
      this.fileList1 = row.images;
      if(this.fileList1) {
        this.noneBtnImg1 = this.fileList1.length >= 6;
      } else {
        this.fileList1 = [];
      }
      
      this.openSpec = true;
      this.titleSpec = "修改商品规格";
    },
    submitFormSpec() {
      //console.log(this.formSpec);
      if(this.titleSpec == '添加商品规格') {
          this.goodsSpecList = this.goodsSpecList?this.goodsSpecList:this.form.goodsSpecList;
          this.goodsSpecList = this.goodsSpecList?this.goodsSpecList:[];
          this.$refs["formSpec"].validate(valid => {
            if (valid) {
              this.goodsSpecList.push(this.formSpec);
              this.form.goodsSpecList = this.goodsSpecList;
            }
          });
      }
      this.openSpec = false;
    },
    /** 商品规格删除按钮操作 */
    handleDeleteGoodsSpec() {
      if (this.checkedGoodsSpec.length == 0) {
        this.msgError("请先选择要删除的商品规格数据");
      } else {
        const goodsSpecList = this.goodsSpecList;
        const checkedGoodsSpec = this.checkedGoodsSpec;
        this.goodsSpecList = goodsSpecList.filter(function(item) {
          return checkedGoodsSpec.indexOf(item.index) == -1
        });
      }
    },
    /** 复选框选中数据 */
    handleGoodsSpecSelectionChange(selection) {
      this.checkedGoodsSpec = selection.map(item => item.index)
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('/store/goods/export', {
        ...this.queryParams
      }, `goods_${new Date().getTime()}.xlsx`)
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
    },
    
    /** 
     * 商品规格图片上传
     */
    //取消上传
    canleFileUpload1() {
      this.$refs.upload1.clearFiles();
    },
    //查看大图
    handlePictureCardPreview1(file) {
      this.dialogImageUrl1 = file.url;
      this.dialogVisible1 = true;
    },
    handleFileChange1(file, fileList) {
      this.noneBtnImg1 = fileList.length >= 6;
    },
    // 超出上传最大数
    handleFileOverstep1(files, fileList) {
      this.$message.error("最多只能上传6张图片");
    },
    // 文件删除操作
    handleFileRemove1(file, fileList) {
      this.fileList1 = [];
      this.fileList1 = fileList;
      this.noneBtnImg1 = fileList.length >= 6;
      
      this.formSpec.images = [];
      for (var fi of fileList) {
         this.formSpec.images.push({'url': fi.url});
      }
    },
    handleFileUploadSuccess1(res, file, fileList) {
      if(!this.formSpec.images) {
        this.formSpec.images = [];
      }
      //this.formSpec.images.push({'url': res.url});
      this.formSpec.images.push({'url': res.data.url});
    }
  }
};
</script>
<style scoped>
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
  width: 98px;
  height: 98px;
  line-height: 1;
}
.el-upload--picture-card i {
  line-height: 98px;
}

.spec-table-expand label {
    width: 90px;
    color: #99a9bf;
  }
.spec-table-expand .el-form-item {
  display: contents;
}
.el-table__expanded-cell[class*=cell] {
  padding: 20px 20px;
}
.el-descriptions__title {
  font-size: 13px;
}
</style>
