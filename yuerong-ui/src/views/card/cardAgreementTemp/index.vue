<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      :inline="true"
      v-show="showSearch"
      label-width="68px"
    >
      <el-form-item label="模版名称" prop="name">
        <el-input
          v-model="queryParams.name"
          clearable
          placeholder="请输入模版名称"
        />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select
          v-model="queryParams.status"
          placeholder="请选择状态"
          clearable
          size="small"
        >
          <el-option
            v-for="item in statuText"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="创建日期">
        <el-date-picker
          v-model="startdateRange"
          size="small"
          style="width: 240px"
          value-format="yyyy-MM-dd HH:mm:ss"
          type="daterange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="更新日期">
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
      <el-form-item>
        <el-button
          type="primary"
          icon="el-icon-search"
          size="mini"
          @click="handleQuery"
          >查询</el-button
        >
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
          v-hasPermi="['monitor:job:add']"
          >新增</el-button
        >
      </el-col>
      <right-toolbar
        :showSearch.sync="showSearch"
        @queryTable="getList"
        :columns="columns"
      ></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="cardAgreementList">
      <el-table-column
        label="模版编号"
        v-if="columns[0].visible"
        align="center"
        prop="code"
      />
      <el-table-column
        label="模版名称"
        v-if="columns[1].visible"
        align="center"
        prop="name"
        width="150"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="协议说明"
        v-if="columns[2].visible"
        align="center"
        prop="description"
      />
      <el-table-column
        label="创建日期"
        v-if="columns[3].visible"
        align="center"
        prop="createTime"
        width="220"
      >
      </el-table-column>
      <el-table-column
        label="更新日期"
        v-if="columns[4].visible"
        align="center"
        prop="updateTime"
        width="220"
      >
      </el-table-column>
      <el-table-column
        label="适用卡类"
        v-if="columns[5].visible"
        align="center"
        prop="typeNum"
      />
      <el-table-column
        label="状态"
        v-if="columns[6].visible"
        align="center"
        prop="status"
      >
        <template slot-scope="scope">
          <span>{{ statuText[scope.row.status].label }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-view"
            @click="handleCheck(scope.row)"
            v-hasPermi="['store:service:edit']"
            >查看</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['store:service:edit']"
            >修改</el-button
          >
          <el-button
            v-if="scope.row.status == 1"
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['store:service:remove']"
            >删除</el-button
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

    <el-drawer
      :title="titleVisit"
      size="50%"
      :visible.sync="openVisit"
      direction="rtl"
      append-to-body
      :close-on-click-modal="false"
      wrapperClosable
    >
      <el-form
        ref="formVisit"
        :model="formVisit"
        :rules="rulesVisit"
        label-width="auto"
      >
        <div class="line">
          <div class="positop">基本信息</div>
          <el-form-item label="模板名称" prop="name">
            <el-input
              :disabled="isDisabled"
              v-model="formVisit.name"
              placeholder="请输入模板名称"
              maxlength="20"
              show-word-limit
              size="small"
            />
          </el-form-item>
          <el-form-item label="协议说明" prop="description">
            <el-input
              :disabled="isDisabled"
              placeholder="请输入协议说明"
              v-model="formVisit.description"
              class="input-with-select"
              size="small"
            >
            </el-input>
          </el-form-item>
          <el-form-item label="状态" prop="content">
            <el-radio-group
              v-model="formVisit.status"
              size="mini"
              :disabled="isDisabled"
            >
              <el-radio label="0">启用</el-radio>
              <el-radio label="1">停用</el-radio>
            </el-radio-group>
          </el-form-item>
        </div>
        <div class="line">
          <div class="positop">模板内容</div>
          <el-form-item label="内容编辑" prop="remark" v-show="!isCheck">
            <editor v-model="formVisit.content" :height="400" />
          </el-form-item>
          <el-form-item label="内容编辑" prop="remark" v-show="isCheck">
            <div v-html="formVisit.content"></div>
          </el-form-item>
        </div>
        <el-form-item v-show="!isCheck">
          <el-button type="primary" @click="addArgumentSubmit">保 存</el-button>
          <el-button @click="cancelVisit">取 消</el-button>
        </el-form-item>
      </el-form>
    </el-drawer>
  </div>
</template>

<script>
import {
  cardArgumentList,
  addArgument,
  updateArgument,
  getAgreement,
  deleteAgreement,
} from "@/api/card/agreement";
export default {
  data() {
    return {
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
      // 显隐列信息
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        name: "",
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
        { key: 0, label: "模版编号", visible: true },
        { key: 1, label: "模版名称", visible: true },
        { key: 2, label: "协议说明", visible: true },
        { key: 3, label: "创建日期", visible: true },
        { key: 4, label: "更新日期", visible: true },
        { key: 5, label: "适用卡类", visible: true },
        { key: 6, label: "状态", visible: true },
      ],
      cardTypeParams: {
        pageNum: 1,
        pageSize: 100,
      },
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
  methods: {
    // 卡类型列表
    getList(queryParams) {
      cardArgumentList(queryParams).then((response) => {
        this.cardAgreementList = response.rows;
        this.loading = false;
        this.total = response.total;
      });
    },
    // 查询
    handleQuery() {
      // if (this.startdateRange.length != 0)
      this.queryParams.crBeginTime = this.startdateRange?.[0];
      this.queryParams.crEndTime = this.startdateRange?.[1];
      this.queryParams.upBeginTime = this.updateDateRange?.[0];
      this.queryParams.upEndTime = this.updateDateRange?.[1];
      this.getList(this.queryParams);
    },
    handleAdd() {
      (this.titleVisit = "新增协议模版"), this.reset();
      this.openVisit = true;
    },
    handleDelete(rows) {
      let rowid = { id: rows.id };
      this.$modal
        .confirm('是否确认删除编号为"' + rows.code + '"的协议模版？')
        .then(function () {
          deleteAgreement(rowid);
        })
        .then(() => {
          this.msgSuccess("删除成功");
          this.getList(this.queryParams);
        })
        .catch(() => {});
    },
    handleUpdate(rows) {
      (this.titleVisit = "修改协议模版"), (this.isCheck = false);
      this.isDisabled = false;
      getAgreement(rows.id).then((response) => {
        this.formVisit = response.data;
      });
      this.openVisit = true;
    },
    handleCheck(rows) {
      (this.titleVisit = "查看协议模版"), (this.isCheck = true);
      this.isDisabled = true;
      getAgreement(rows.id).then((response) => {
        let { content, description, name, status, id } = { ...response.data };
        this.formVisit = {
          id: id,
          content: content,
          description: description,
          name: name,
          status: status,
        };
      });
      this.openVisit = true;
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
    addArgumentSubmit() {
      this.$refs["formVisit"].validate((valid) => {
        if (valid) {
          if (this.formVisit.id != undefined) {
            updateArgument(this.formVisit).then((response) => {
              this.msgSuccess("修改成功");
              this.openVisit = false;
              this.getList(this.queryParams);
            });
          } else {
            addArgument(this.formVisit).then((response) => {
              this.msgSuccess("新增成功");
              this.openVisit = false;
              this.getList(this.queryParams);
            });
          }
        }
      });
    },
    cancelVisit() {
      this.openVisit = false;
      this.reset();
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
</style>
