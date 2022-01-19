<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch">
      <el-form-item label="部门名称" prop="deptName">
        <el-input
          v-model="queryParams.deptName"
          placeholder="请输入部门名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="部门状态" clearable size="small">
          <el-option
            v-for="dict in dict.type.sys_dept_status"
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
          v-hasPermi="['system:dept:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="info"
          plain
          icon="el-icon-sort"
          size="mini"
          @click="toggleExpandAll"
        >展开/折叠</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList" :columns="columns"></right-toolbar>
    </el-row>

    <el-table
      v-if="refreshTable"
      v-loading="loading"
      :data="deptList"
      row-key="deptId"
      :default-expand-all="isExpandAll"
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
    >
      <el-table-column prop="deptName" label="部门名称" width="260" fixed></el-table-column>
      <el-table-column prop="level" v-if="columns[0].visible" label="级别" width="100">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.sys_dept_level" :value="scope.row.level"/>
        </template>
      </el-table-column>
      <el-table-column prop="code" v-if="columns[1].visible" label="部门编号" width="100"></el-table-column>
      <el-table-column prop="orderNum" v-if="columns[2].visible" label="排序" width="80"></el-table-column>
      <el-table-column prop="leader" v-if="columns[3].visible" label="主管" width="100"></el-table-column>
      <el-table-column prop="status" v-if="columns[4].visible" label="状态" width="100">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.sys_dept_status" :value="scope.row.status"/>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" v-if="columns[5].visible" label="创建时间" align="center" width="150">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width" fixed="right">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['system:dept:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-plus"
            @click="handleAdd(scope.row)"
            v-hasPermi="['system:dept:add']"
          >添加下级</el-button>
          <el-button
            v-if="scope.row.parentId != 0"
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['system:dept:remove']"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 添加或修改部门对话框 -->
    <!-- el-dialog :title="title" :visible.sync="open" width="680px" append-to-body :close-on-click-modal="false" -->
    <el-drawer
      :title="title"
      :visible.sync="open"
      direction="rtl"
      :wrapperClosable="false"
      :size="700"
      ref="drawer"
      >
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <table>
          <tr>
            <td style="width: 75%;">
                <el-form-item label="上级部门" prop="parentId">
                  <treeselect :disabled="form.parentId == 0 && form.deptId > 0" v-model="form.parentId" :options="deptOptions" :normalizer="normalizer" placeholder="选择上级部门" />
                </el-form-item>
                        
                <el-form-item label="部门名称" prop="deptName">
                  <el-input v-model="form.deptName" @blur="form.deptName=$event.target.value.trim()" placeholder="请输入部门名称" maxlength="20" show-word-limit />
                </el-form-item>
                
                <el-form-item label="部门编号" prop="code">
                  <el-input v-model="form.code" placeholder="门店编号建议规则：品牌编号+地区英文缩写+门店数字序号，如：01SH001"  maxlength="20" show-word-limit @change="chkCode" />
                </el-form-item>
            </td>
            <td style="text-align:center;">
              <div class="deptlogo">
                <el-form-item label="" prop="logo" label-width="auto">
                    <div class="el-upload-list el-upload-list--picture-card" v-if="form.logo">
                        <div class="el-upload-list__item is-success">
                            <img  :src="form.logo" class="img" >
                            <span class="el-upload-list__item-actions">
                                <span class="el-upload-list__item-preview">
                                    <i class="el-icon-zoom-in" @click.stop="handleLogoPreview"></i>
                                </span>
                                <span class="el-upload-list__item-delete">
                                    <i class="el-icon-delete" @click.stop="handleLogoRemove"></i>
                                </span>
                            </span>
                        </div>
                    </div>
                    <el-upload v-else
                      class="img-uploader"
                      :action="uploadFileUrl"
                      :show-file-list="false"
                      :auto-upload="true" 
                      accept="image/png,image/jpeg,image/jpg"
                      :headers="headers"
                      :before-upload="beforeFileUpload"
                      :on-preview="handlePictureCardPreview"
                      :on-remove="handleLogoRemove"
                      :on-error="handleUploadError"
                      :on-success="handleUploadSuccessLogo">
                      <i slot="default" class="el-icon-plus img-uploader-icon" title="建议尺寸70*70"></i>
                    </el-upload>
                    <span class="lbl">LOGO</span>
                </el-form-item>
              </div>
            </td>
          </tr>
        </table>
        <el-row>
          <el-col :span="12">
            <el-form-item label="同级排序" prop="orderNum">
              <el-input-number v-model="form.orderNum" controls-position="right" :min="0" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="部门主管" prop="leader">
              <el-input v-model="form.leader" placeholder="请输入部门主管" maxlength="20" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="联系电话" prop="phone">
              <el-input v-model="form.phone" placeholder="部门联系电话，座机或手机号" maxlength="20" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="营业状态">
              <el-radio-group v-model="form.status">
                <el-radio
                  v-for="dict in dict.type.sys_dept_status"
                  :key="dict.value"
                  :label="dict.value"
                >{{dict.label}}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="门店级别" prop="level">
                <el-radio-group v-model="form.level" size="medium">
                  <el-radio-button 
                    v-for="dict in dict.type.sys_dept_level"
                    :key="parseInt(dict.value)"
                    :label="parseInt(dict.value)"
                    :value="parseInt(dict.value)">{{dict.label}}
                  </el-radio-button>
                </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="业务范围" prop="businessIds">
              <el-select v-model="form.businessIds" multiple placeholder="请选择" style="width:100%">
                <el-option
                  v-for="dict in dict.type.sys_dept_business"
                  :key="parseInt(dict.value)"
                  :label="dict.label"
                  :value="parseInt(dict.value)">{{dict.label}}
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="20">
            <el-form-item label="地址">
              <el-input id="txtAddress" v-model="form.address" placeholder="请输入地址" maxlength="200" show-word-limit />
              <input type="hidden" id="txtLng" v-model="form.longitude"/>
              <input type="hidden" id="txtLat" v-model="form.latitude"/>
            </el-form-item>
          </el-col>
          <el-col :span="2">
            <el-button type="success" icon="el-icon-map-location" size="small" title="" @click="handleMap" style="margin-left:5px;">定位坐标</el-button>
          </el-col>
          <el-col :span="24">
            <el-form-item label="简介" prop="description">
              <el-input type="textarea" v-model="form.description" placeholder="请输入简介" maxlength="800" show-word-limit />
            </el-form-item>
          </el-col>
          </el-row>
          <el-row>
          <el-form-item label="展示图" prop="" label-width="auto">
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
                    <span>2、建议尺寸：640*320 像素，大小不能超过1MB，最多6张</span>
                  </div>
                </el-upload>
                <el-dialog :visible.sync="dialogVisible" :modal="false">
                  <img width="100%" :src="dialogImageUrl" alt="" />
                </el-dialog>
            </div>  
          
          </el-form-item>
        </el-row>
      </el-form>
      <el-divider></el-divider>
      <div class="el-dialog__footer">
        <el-button type="primary" @click="submitForm">保存</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
      <!-- 嵌套地图dialog -->
      <el-dialog title="地址定位" :visible.sync="openMap" width="700px" append-to-body :close-on-click-modal="false" @opened="handleSearch" @close='cancelMap'>
         <el-row>
            <div class="amap-container">
              <el-col :span="24">
                <amap @cancelMap="cancelMap" :form="form" ref="myMap"></amap>
              </el-col>
            </div>
        </el-row>
      </el-dialog>
    <!-- /el-dialog -->
    </el-drawer>
    
    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>
    
  </div>
</template>

<script>
import { listDept, getDept, chkCode, delDept, addDept, updateDept, listDeptExcludeChild } from "@/api/system/dept";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import amap from "@/components/AMap/amap";
import { getToken } from "@/utils/auth";

export default {
  name: "Dept",
  dicts: ['sys_normal_disable','sys_dept_status','sys_dept_business','sys_dept_level'],
  components: { Treeselect, amap },
  data() {
    return {
      // 遮罩层
      loading: true,
      // 显示搜索条件
      showSearch: true,
      // 列信息
      columns: [
        { key: 0, label: `级别`, visible: true },
        { key: 1, label: `部门编号`, visible: true },
        { key: 2, label: `排序`, visible: false },
        { key: 3, label: `主管`, visible: true },
        { key: 4, label: `状态`, visible: true },
        { key: 5, label: `创建时间`, visible: true }
      ],
      // 表格树数据
      deptList: [],
      // 部门树选项
      deptOptions: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 是否打开地图弹出层
      openMap: false,
      dialogImageUrl: '',
      dialogVisible: false,
      // 是否展开，默认全部展开
      isExpandAll: true,
      // 重新渲染表格状态
      refreshTable: true,
      // 是否展开
      expand: false,
      // 查询参数
      queryParams: {
        deptName: undefined,
        status: undefined
      },
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
      //logoUrl: '',
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        parentId: [
          { required: true, message: "上级部门不能为空", trigger: "blur" }
        ],
        deptName: [
          { required: true, message: "部门名称不能为空", trigger: "blur" }
        ],
        code: [
          { required: true, message: "部门编号不能为空", trigger: "blur" },
          { pattern: /^[0-9A-Z]+$/, message: "部门编号只能为数字或(和)大写字母组合", trigger: "blur" }
        ],
        orderNum: [
          { required: true, message: "显示排序不能为空", trigger: "blur" }
        ],
        email: [
          {
            type: "email",
            message: "'请输入正确的邮箱地址",
            trigger: ["blur", "change"]
          }
        ]/*,
        phone: [
          {
            pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/,
            message: "请输入正确的手机号码",
            trigger: "blur"
          }
        ]*/
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    handleSearch() {
      this.$refs.myMap.handleSearch();
    },
    chkCode(code) {
        chkCode(code, this.form.deptId?this.form.deptId:0);
    },
    /** 
     * 图片上传
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
    // 上传失败
    handleUploadError(err) {
      this.$message.error("上传失败, 请重试");
    },
    handleLogoPreview() {
      this.dialogImageUrl = this.form.logo;
      this.dialogVisible = true;
    },
    // 文件删除操作
    handleLogoRemove(file, fileList) {
      //console.log(fileList);
      //console.log(file);
      this.form.logo = null;
    },
    // 上传成功回调
    handleUploadSuccessLogo(res, file) {
      //console.log(res);
      this.$message.success("上传成功");
      this.form.logo = res.data.url;
    },
    /** 查询部门列表 */
    getList() {
      this.loading = true;
      listDept(this.queryParams).then(response => {
        this.deptList = this.handleTree(response.data, "deptId");
        this.loading = false;
      });
    },
    /** 转换部门数据结构 */
    normalizer(node) {
      if (node.children && !node.children.length) {
        delete node.children;
      }
      return {
        id: node.deptId,
        label: node.deptName,
        children: node.children
      };
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 关闭地图弹框
    cancelMap() {
      this.openMap = false;
    },
    // 表单重置
    reset() {
      this.form = {
        deptId: undefined,
        parentId: undefined,
        deptName: undefined,
        code: undefined,
        orderNum: 1,
        leader: undefined,
        phone: undefined,
        address: undefined,
        status: "0",
        businessIds: []
      };
      this.resetForm("form");
      this.fileList = [];
      this.dialogVisible=false;
      this.dialogImageUrl="";
      this.noneBtnImg=false;
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    /** 新增按钮操作 */
    handleAdd(row) {
      this.reset();
      if (row != undefined) {
        this.form.parentId = row.deptId;
        if(row.children) {
          this.form.orderNum = row.children.length+1;
        }
      }
      this.open = true;
      this.title = "添加部门";
      listDept().then(response => {
	        this.deptOptions = this.handleTree(response.data, "deptId");
      });
    },
    /** 展开/折叠操作 */
    toggleExpandAll() {
      this.refreshTable = false;
      this.isExpandAll = !this.isExpandAll;
      this.$nextTick(() => {
        this.refreshTable = true;
      });
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      getDept(row.deptId).then(response => {
        this.form = response.data;
        this.fileList = response.data.images;
        if(!this.fileList) {
          this.fileList = [];
        }
        this.open = true;
        this.title = "修改部门";
      });
      listDeptExcludeChild(row.deptId).then(response => {
	        this.deptOptions = this.handleTree(response.data, "deptId");
	        if(!this.deptOptions || this.deptOptions.length === 0) {
	          const topNo = { deptId: 0, deptName: '无', children: [] };
              this.deptOptions.push(topNo);
            }
      });
    },
    handleMap() {
      this.openMap = true;
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.deptId != undefined) {
            updateDept(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addDept(this.form).then(response => {
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
      this.$modal.confirm('是否确认删除名称为"' + row.deptName + '"的数据项？').then(function() {
        return delDept(row.deptId);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    }
  }
};
</script>
<style>
  .img-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .img-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .img-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 98px;
    height: 98px;
    line-height: 98px;
    text-align: center;
  }
  .img {
    width: 98px;
    height: 98px;
    display: block;
  }
  .amap-container {
    margin-top: 5px;
    width: 660px;
    height: 360px;
  }
  .deptlogo .lbl {
    position: absolute;
    top: 96px;
    right: 56px;
  }
  .deptlogo .el-upload {
    border-radius: 50px;
  }
  .el-upload-list__item-actions {
    position: absolute;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    cursor: default;
    text-align: center;
    color: #fff;
    opacity: 0;
    font-size: 20px;
    background-color: rgba(0,0,0,.5);
    transition: opacity .3s;
}
.el-upload-list__item-actions:hover {
    opacity: 1;
}
.el-upload-list__item-actions span {
    display: none;
    cursor: pointer;
    position: relative;
}
.el-upload-list__item-actions:hover span {
    display: inline-block;
}
.el-upload-list__item-delete {
    right: 0;
    font-size: 20px;
    color: #fff;
}
.el-upload-list__item-actions span:hover {
    color: #1890ff;
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
  width: 98px;
  height: 98px;
  line-height: 1;
}
.deptlogo .el-upload-list--picture-card .el-upload-list__item {
  border-radius: 50px;
}
.el-upload--picture-card i {
  line-height: 98px;
}
</style>