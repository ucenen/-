<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      :inline="true"
      v-show="showSearch"
      label-width="68px"
    >
      <el-form-item label="商品编号" prop="code">
        <el-input
          v-model="queryParams.code"
          placeholder="请输入商品名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="商品名称" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入商品名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="更新日期">
        <el-date-picker
          v-model="updateDate"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :default-time="['00:00:00', '23:59:59']"
          value-format="yyyy-MM-dd HH:mm:ss"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select
          v-model="queryParams.status"
          placeholder="请选择状态"
          clearable
          size="small"
        >
          <el-option
            v-for="dict in dict.type.sys_normal_disable"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="商品分类" prop="classIdArr">
        <el-cascader
          v-model="queryParams.classIdArr"
          :options="classOptions"
          clearable
          size="small"
        ></el-cascader>
      </el-form-item>
      <el-form-item label="是否添加" prop="addFlag">
        <el-select
          v-model="queryParams.addFlag"
          placeholder="请选择"
          clearable
          size="small"
        >
          <el-option label="是" :value="true" />
          <el-option label="否" :value="false" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          icon="el-icon-search"
          size="mini"
          @click="handleQuery"
          >查询</el-button
        >
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery"
          >重置</el-button
        >
      </el-form-item>
    </el-form>

    <el-form :model="goodsForm" ref="goodsForm" class="mt-44">
      <el-table
        v-loading="loading"
        :data="goodsForm.goodsList"
        @selection-change="handleSelectionChange"
        class="form-table"
        ref="multipleTable"
      >
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="商品图片" align="center">
          <template slot-scope="scope">
            <el-image
              style="width: 100px; height: 100px"
              :src="scope.row.images && scope.row.images[0].url"
              fit="contain"
            ></el-image>
          </template>
        </el-table-column>
        <el-table-column
          label="SKU编号"
          align="center"
          prop="specCode"
          width="160"
        />
        <el-table-column
          label="商品名称"
          align="center"
          prop="specName"
          :show-overflow-tooltip="true"
        />
        <el-table-column label="商品分类" align="center" prop="goodsClass" />
        <el-table-column
          label="条码"
          align="center"
          prop="barcode"
          :show-overflow-tooltip="true"
        />
        <el-table-column label="销售价格" align="center" prop="standardPrice" />
        <el-table-column label="门店售价" prop="storePrice" min-width="180"
          ><template slot-scope="scope">
            <el-form-item
              :prop="'goodsList.' + scope.$index + '.storePrice'"
              :rules="{ validator: validatePrice, trigger: 'change' }"
            >
              <el-input-number
                size="mini"
                v-model="scope.row.storePrice"
                :precision="2"
                :step="0.1"
              ></el-input-number>
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column label="会员价" align="center" prop="memberPrice" />
        <el-table-column label="门店会员价" prop="memberPrice" min-width="180">
          <template slot-scope="scope">
            <el-form-item
              :prop="'goodsList.' + scope.$index + '.storeMemberPrice'"
              :rules="{ validator: validatePrice, trigger: 'change' }"
            >
              <el-input-number
                size="mini"
                v-model="scope.row.storeMemberPrice"
                :precision="2"
                :step="0.1"
              ></el-input-number>
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column label="是否添加" align="center" prop="status">
          <template slot-scope="scope">
            {{ scope.row.id ? "是" : "否" }}
          </template>
        </el-table-column>
        <el-table-column label="状态" align="center" prop="status">
          <template slot-scope="scope">
            <dict-tag
              :options="dict.type.sys_normal_disable"
              :value="scope.row.status"
            />
          </template>
        </el-table-column>
      </el-table>
    </el-form>
    <el-row
      type="flex"
      justify="space-between"
      align="middle"
      class="page-footer"
    >
      <el-col :span="10">
        <el-button size="mini" plain @click="handleToggleSelectedAll">{{
          isSelectedCurrentAll ? "全不选" : "全选"
        }}</el-button>
        <el-button size="mini" plain @click="handleAddMultiple"
          >批量添加</el-button
        >
        <el-button size="mini" plain @click="handleRemoveMultiple"
          >批量删除</el-button
        >
      </el-col>
      <el-col :span="6" class="text-align-right">
        <pagination
          v-show="total > 0"
          :total="total"
          :page.sync="queryParams.pageNum"
          :limit.sync="queryParams.pageSize"
          @pagination="getList"
        />
      </el-col>
    </el-row>
  </div>
</template>

<script>
import {
  getPlanGoodsList,
  getPlanGoodsCascadeList,
  addPlanGoodsList,
  deletePlanMultipleGoods,
} from "@/api/store/plan";

import normalizr from "@/utils/normalizr";

import _ from "lodash";

export default {
  name: "GoodsComponent",
  dicts: [
    "sys_normal_disable",
    "goods_brand",
    "goods_type",
    "goods_sale_type",
    "goods_purchase_type",
    "goods_standard_unit",
    "sys_dept_group",
    "sys_yes_no",
  ],
  props: ["id"],
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      selectedIDList: [],
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 商品分类选项
      classOptions: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        storePlanId: null,
        classIdArr: [],
        name: null,
        code: null,
        status: null,
        addFlag: false,
        status: null,
        updateStart: null,
        updateEnd: null,
      },
      storePlanId: null,
      // 表单参数
      goodsForm: {
        goodsList: [],
      },
      goodsSpecIDList: [],
      updateDate: "",
      goodsDataSource: {},
    };
  },
  created() {
    const { id } = this.$route.query;
    this.storePlanId = this.queryParams.storePlanId = id || this.id || null;

    this.getList();
    this.getClassList();
  },
  computed: {
    isSelectedCurrentAll() {
      return _.every(this.goodsSpecIDList, (id) =>
        _.includes(this.selectedIDList, id)
      );
    },
  },
  methods: {
    /** 查询商品资料列表 */
    getList() {
      this.loading = true;
      getPlanGoodsList(this.queryParams).then((response) => {
        const translateDataList = _.map(response.rows,item=>{
          return _.assign(item,{storePrice:item.id?item.storePrice:item.standardPrice,storeMemberPrice:item.id?item.storeMemberPrice:item.memberPrice})
        })
        this.goodsSpecIDList = _.map(translateDataList || [], "goodsSpecId");
        this.goodsForm.goodsList = translateDataList || [];
        _.assign(this.goodsDataSource, normalizr(translateDataList, "goodsSpecId"));
        this.total = response.total;
        this.loading = false;
      });
    },
    /** 查询商品分类列表 */
    getClassList() {
      getPlanGoodsCascadeList().then((response) => {
        this.classOptions = response.data;
      });
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      if (!!this.updateDate && this.updateDate.length > 0) {
        this.queryParams.updateStart = this.updateDate[0];

        this.queryParams.updateEnd = this.updateDate[1];
      }

      this.getList();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.selectedIDList = selection.map((item) => item.goodsSpecId);
    },
    handleToggleSelectedAll() {
      if (this.isSelectedCurrentAll) {
        this.$refs.multipleTable.clearSelection();
        this.selectedIDList = _.without(
          this.selectedIDList,
          _.join(this.goodsSpecIDList)
        );
      } else {
        _.each(this.goodsForm.goodsList, (item) => {
          this.$refs.multipleTable.toggleRowSelection(item, true);
        });

        this.selectedIDList = _.uniq(
          _.concat(this.selectedIDList, this.goodsSpecIDList)
        );
      }
    },
    handleAddMultiple() {
      if (!this.selectedIDList.length) {
        this.msgError("请先选择要添加的商品");
        return;
      }

      this.$refs["goodsForm"].validate((valid) => {
        if (valid) {
          let payload = _.map(this.selectedIDList, (goodsSpecId) => {
            const goodsData = this.goodsDataSource[goodsSpecId] || {};
            const { storeMemberPrice, storePrice, goodsId } = goodsData;

            const data = {
              id: goodsData.id || null,
              goodsId: goodsId,
              goodsSpecId: goodsSpecId,
              storeMemberPrice,
              storePlanId: this.storePlanId - 0,
              storePrice,
            };

            return _.omit(
              data,
              _.filter(_.keys(data), (key) => data[key] === null)
            );
          });

          this.saving = true;
          addPlanGoodsList(payload)
            .then(() => {
              this.selectedIDList = [];
              this.msgSuccess("批量添加成功");
              this.getList();
            })
            .finally(() => {
              this.saving = false;
            });
        }
      });
    },
    handleRemoveMultiple() {
      if (!this.selectedIDList.length) {
        this.msgError("请先选择要删除的服务");
        return;
      }

      this.saving = true;
      deletePlanMultipleGoods(_.join(this.selectedIDList))
        .then(() => {
          this.msgSuccess("批量删除成功");
          this.selectedIDList = [];
          this.getList();
        })
        .finally(() => {
          this.saving = false;
        });
    },
    validatePrice(rule, value, callback) {
      const index = _.nth(_.split(rule.field, "."), 1);
      const isSelected = _.includes(
        this.selectedIDList,
        this.goodsForm.goodsList[index].goodsSpecId
      );

      if (isSelected) {
        if (value <= 0 || !Number(value)) {
          callback(new Error("请输入大于0的价格!"));
        }

        callback();
      } else {
        callback();
      }
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
  },
};
</script>
<style scoped lang="scss">
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
.el-upload-list--picture-card .el-upload-list__item,
.el-upload--picture-card {
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
.el-table__expanded-cell[class*="cell"] {
  padding: 20px 20px;
}
.el-descriptions__title {
  font-size: 13px;
}

.mt-44 {
  margin-top: 44px;
}
</style>
