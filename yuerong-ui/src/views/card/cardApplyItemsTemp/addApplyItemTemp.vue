<template>
  <div class="app-container">
    <div class="aligncenter">
      <!-- <div>开卡项</div> -->
      <el-form
        ref="formBase"
        :model="formBase"
        :rules="rulesBase"
        label-width="auto"
      >
        <el-steps :active="active" finish-status="success" simple>
          <el-step title="基本信息"></el-step>
          <el-step title="开卡项设置"></el-step>
        </el-steps>
        <div class="line" v-if="active == 0">
          <el-form-item label="开卡项名称" prop="name">
            <el-input
              :disabled="isCheck"
              v-model="formBase.name"
              placeholder="请输入开卡项名称"
              maxlength="20"
              show-word-limit
              size="small"
            />
          </el-form-item>
          <el-form-item label="状态" prop="content">
            <el-radio-group
              v-model="formBase.status"
              size="mini"
              :disabled="isCheck"
            >
              <el-radio label="0">启用</el-radio>
              <el-radio label="1">停用</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="类型" prop="content">
            <el-radio-group
              v-model="formBase.type"
              size="mini"
              :disabled="isCheck"
            >
              <el-radio label="0">计费</el-radio>
              <el-radio label="1">赠送</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item style="text-align: cenetr">
            <el-button style="margin-top: 12px" type="primary" @click="nextStep"
              >设置下一步</el-button
            >
          </el-form-item>
        </div>

        <div v-if="active == 1">
          <div class="line">
            <el-form-item label="账户余额"></el-form-item>
            <el-form-item
              :label="'个人' + typeLabel + '账户'"
              prop="personalAccount"
            >
              <el-input
                v-model="formBase.personalAccount"
                placeholder="请输入金额"
                size="small"
                :disabled="isCheck"
              >
                <template slot="append">元</template>
              </el-input>
            </el-form-item>
            <el-form-item
              :label="'企业' + typeLabel + '账户'"
              prop="companyAccount"
            >
              <el-input
                v-model="formBase.companyAccount"
                placeholder="请输入金额"
                size="small"
                :disabled="isCheck"
              >
                <template slot="append">元</template>
              </el-input>
            </el-form-item>
            <el-form-item label="预设项目"></el-form-item>
            <el-tabs
              v-model="activeName"
              type="border-card"
              @tab-click="handleClick(activeName)"
            >
              <el-tab-pane label="套餐" name="package">
                <el-button
                  style="margin-top: 12px"
                  type="primary"
                  @click="showPack"
                  v-if="$route.query.type != 'check'"
                  >添加</el-button
                >
                <el-table v-loading="loadingPack" :data="itemPackList">
                  <el-table-column
                    label="套餐编号"
                    align="center"
                    prop="pack.code"
                  />
                  <el-table-column
                    label="套餐名称"
                    align="center"
                    prop="pack.name"
                    width="150"
                    :show-overflow-tooltip="true"
                  />
                  <el-table-column
                    label="销售价格"
                    align="center"
                    prop="pack.standardPrice"
                    width="150"
                    :show-overflow-tooltip="true"
                  />
                  <el-table-column
                    label="数量"
                    align="center"
                    prop="count"
                    width="150"
                    :show-overflow-tooltip="true"
                  />
                  <el-table-column
                    label="总价"
                    align="center"
                    prop="totalPrice"
                    width="150"
                    :show-overflow-tooltip="true"
                  />
                  <el-table-column
                    label="操作"
                    align="center"
                    class-name="small-padding fixed-width"
                    v-if="$route.query.type != 'check'"
                  >
                    <template slot-scope="scope">
                      <el-button
                        size="mini"
                        type="text"
                        icon="el-icon-edit"
                        @click="editItem(scope.row, 'package')"
                        v-hasPermi="['store:service:edit']"
                        >修改</el-button
                      >
                      <el-button
                        size="mini"
                        type="text"
                        icon="el-icon-delete"
                        @click="deleteItem(scope.row, 'package')"
                        v-hasPermi="['store:service:remove']"
                        >删除</el-button
                      >
                    </template>
                  </el-table-column>
                </el-table>
                <pagination
                  v-show="totalPack > 0"
                  :total="totalPack"
                  :page.sync="assetQuery.pageNum"
                  :limit.sync="assetQuery.pageSize"
                  @pagination="getItemPackList"
                  layout="total, prev, pager, next, jumper"
                />
              </el-tab-pane>
              <el-tab-pane label="优惠券" name="coupon"></el-tab-pane>
              <el-tab-pane label="服务" name="service">
                <el-button
                  style="margin-top: 12px"
                  type="primary"
                  @click="showService"
                  v-if="$route.query.type != 'check'"
                  >添加</el-button
                >
                <el-table v-loading="loadingPack" :data="itemSreviceList">
                  <el-table-column
                    label="服务编号"
                    align="center"
                    prop="service.code"
                  />
                  <el-table-column
                    label="服务名称"
                    align="center"
                    prop="service.name"
                    width="150"
                    :show-overflow-tooltip="true"
                  />
                  <el-table-column
                    label="销售价格"
                    align="center"
                    prop="service.standardPrice"
                    width="150"
                    :show-overflow-tooltip="true"
                  />
                  <el-table-column
                    label="数量"
                    align="center"
                    prop="count"
                    width="150"
                    :show-overflow-tooltip="true"
                  />
                  <el-table-column
                    label="总价"
                    align="center"
                    prop="totalPrice"
                    width="150"
                    :show-overflow-tooltip="true"
                  />
                  <el-table-column
                    label="操作"
                    align="center"
                    class-name="small-padding fixed-width"
                    v-if="$route.query.type != 'check'"
                  >
                    <template slot-scope="scope">
                      <el-button
                        size="mini"
                        type="text"
                        icon="el-icon-edit"
                        @click="editItem(scope.row, 'service')"
                        v-hasPermi="['store:service:edit']"
                        >修改</el-button
                      >
                      <el-button
                        size="mini"
                        type="text"
                        icon="el-icon-delete"
                        @click="deleteItem(scope.row, 'service')"
                        v-hasPermi="['store:service:remove']"
                        >删除</el-button
                      >
                    </template>
                  </el-table-column>
                </el-table>
                <pagination
                  v-show="totalPack > 0"
                  :total="totalPack"
                  :page.sync="assetQuery.pageNum"
                  :limit.sync="assetQuery.pageSize"
                  @pagination="getItemSevivceList"
                  layout="total, prev, pager, next, jumper"
                />
              </el-tab-pane>
              <el-tab-pane label="商品" name="goods">
                <el-button
                  style="margin-top: 12px"
                  type="primary"
                  @click="showGoods"
                  v-if="$route.query.type != 'check'"
                  >添加</el-button
                >
                <el-table v-loading="loadingPack" :data="itemGoodList">
                  <el-table-column
                    label="商品编号"
                    align="center"
                    prop="goods.code"
                  />
                  <el-table-column
                    label="商品名称"
                    align="center"
                    prop="goods.name"
                    width="150"
                    :show-overflow-tooltip="true"
                  />
                  <el-table-column
                    label="规格"
                    align="center"
                    prop="goods.name"
                    width="150"
                    :show-overflow-tooltip="true"
                  />
                  <el-table-column
                    label="条码"
                    align="center"
                    prop="goods.name"
                    width="150"
                    :show-overflow-tooltip="true"
                  />
                  <el-table-column
                    label="销售价格"
                    align="center"
                    prop="goods.standardPrice"
                    width="150"
                    :show-overflow-tooltip="true"
                  />
                  <el-table-column
                    label="数量"
                    align="center"
                    prop="count"
                    width="150"
                    :show-overflow-tooltip="true"
                  />
                  <el-table-column
                    label="总价"
                    align="center"
                    prop="totalPrice"
                    width="150"
                    :show-overflow-tooltip="true"
                  />
                  <el-table-column
                    label="操作"
                    align="center"
                    class-name="small-padding fixed-width"
                    v-if="$route.query.type != 'check'"
                  >
                    <template slot-scope="scope">
                      <el-button
                        size="mini"
                        type="text"
                        icon="el-icon-edit"
                        @click="editItem(scope.row, 'service')"
                        v-hasPermi="['store:service:edit']"
                        >修改</el-button
                      >
                      <el-button
                        size="mini"
                        type="text"
                        icon="el-icon-delete"
                        @click="deleteItem(scope.row, 'service')"
                        v-hasPermi="['store:service:remove']"
                        >删除</el-button
                      >
                    </template>
                  </el-table-column>
                </el-table>
                <pagination
                  v-show="totalPack > 0"
                  :total="totalPack"
                  :page.sync="assetQuery.pageNum"
                  :limit.sync="assetQuery.pageSize"
                  @pagination="getItemSevivceList"
                  layout="total, prev, pager, next, jumper"
                />
              </el-tab-pane>
            </el-tabs>
          </div>
          <el-form-item>
            <el-button @click="prevStep">回到上一步</el-button>
            <el-button
              type="primary"
              v-show="!isCheck"
              @click="addArgumentSubmit"
              >保 存</el-button
            >
          </el-form-item>
        </div>
      </el-form>
    </div>
    <el-dialog
      :title="title"
      :visible.sync="isOpen"
      width="80%"
      append-to-body
      :close-on-click-modal="false"
      align="center"
    >
      <!-- selectTable -->
      <selectTable
        :colums="colums"
        :tableData="tableList"
        :isrender="isrender"
        :assetQuery="listQuery"
        :total="totalList"
        @getList="getList"
        @handlerCurrentChage="handlerCurrentChage"
        @submitForm="submitForm"
        @cancel="cancelTable"
      >
        <template slot="images" slot-scope="scope" v-if="scope.row.images">
          {{ scope.row.images.url }}
        </template>
        <template
          slot="serviceClassName"
          slot-scope="scope"
          v-if="activeName != 'goods' && scope.row.serviceClass"
        >
          {{ scope.row.serviceClass.name }}
        </template>
        <template
          slot="goodsClassName"
          slot-scope="scope"
          v-if="activeName == 'goods' && scope.row.goodsClass"
        >
          {{ scope.row.goodsClass.name }}
        </template>
        <template
          slot="goodsSpecListBarcode"
          slot-scope="scope"
          v-if="activeName == 'goods' && scope.row.goodsSpecList"
        >
          {{ scope.row.goodsSpecList.barcode }}
        </template>
        <template slot="count" slot-scope="scope">
          <el-input
            type="number"
            @input="changinput(scope.row)"
            v-model="scope.row.count"
          />
        </template>
      </selectTable>
    </el-dialog>
    <el-dialog
      title="修改数量"
      :visible.sync="isOpenChange"
      width="400px"
      append-to-body
      :close-on-click-modal="false"
    >
      <el-form label-width="80px">
        <el-form-item label="数量">
          <el-input v-model="updateCountData.count" placeholder="请输入数量" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="changeCount">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  getApplyItemsTemp,
  updateApplyItemsTemp,
  addApplyItemsTemp,
  listByAssetAndItem,
  insertCardItemsMiddle,
  deleteCardItemsMiddle,
  updateCardItemsMiddle,
} from "@/api/card/cardApplyItemsTemp";
import { listPack } from "@/api/store/base/pack";
import { listService } from "@/api/store/base/service";
import { listGoods } from "@/api/store/base/goods";
import selectTable from "../../components/selectTable/index.vue";

export default {
  data() {
    return {
      // 遮罩层
      loadingPack: true,
      loadingCoupon: true,
      loadingService: true,
      loadingGood: true,
      loadingPackList: true,
      loadingCouponList: true,
      loadingServiceList: true,
      loadingGoodList: true,
      // 总条数
      totalPack: 0,
      totalCoupon: 0,
      totalService: 0,
      totalGood: 0,
      totalList: 0,
      // 是否显示弹窗
      isOpen: false,
      tableList: [],
      itemSreviceList: [],
      itemPackList: [],
      itemGoodList: [],
      // 列表查询参数
      listQuery: {
        pageNum: 1,
        pageSize: 10,
      },
      currentPage: 1,
      //资产配置项请求参数
      assetQuery: {
        assetType: "",
        itemType: "1",
        itemId: "",
        pageNum: 1,
        pageSize: 10,
      },
      formBase: {
        name: "",
        status: "0",
        type: "0",
        personalAccount: "",
        companyAccount: "",
      },
      rulesBase: {
        name: [
          { required: true, message: "开卡项名称不能为空", trigger: "blur" },
        ],
        personalAccount: [
          { required: true, message: "个人账户不能为空", trigger: "blur" },
        ],
        companyAccount: [
          { required: true, message: "企业账户不能为空", trigger: "blur" },
        ],
      },
      itemPackList: [],
      titleVisit: "",
      active: 0,
      insertId: "",
      count: 1,
      isshowPack: false,
      isShowService: false,
      isCheck: false,
      title: "选择套餐",
      insertDataItem: {},
      colums: [],
      activeName: "package",
      updateCountData: {
        id: "",
        count: 0,
      },
      isOpenChange: false,
      statusText: ["正常", "停用"],
      isrender: false,
    };
  },
  components: {
    selectTable,
  },
  created() {
    let { id, type } = { ...this.$route.query };
    if (id) {
      getApplyItemsTemp(id).then((response) => {
        let { name, id, status, type, personalAccount, companyAccount } = {
          ...response.data,
        };
        this.formBase = {
          id: id,
          name: name,
          status: status,
          type: type,
          personalAccount: personalAccount,
          companyAccount: companyAccount,
        };
      });
    }
    if (type == "check") {
      this.isCheck = true;
    } else if (type == "edit") {
      this.getApplayItem(id);
    }
  },
  computed: {
    typeLabel: function () {
      let str = "";
      if (this.formBase.type == 1) {
        str = "赠送";
      } else {
        str = "";
      }
      return str;
    },
  },
  methods: {
    // 查詢當前開卡項信息
    getApplayItem(id) {
      getApplyItemsTemp(id).then((response) => {
        let { id, name, status, type, companyAccount, personalAccount } = {
          ...response.data,
        };
        this.formBase = {
          id: id,
          name: name,
          status: status,
          type: type,
          personalAccount: personalAccount,
          companyAccount: companyAccount,
        };
      });
    },
    // 查询开卡项套餐
    getItemPackList() {
      this.assetQuery.assetType = "package";
      this.assetQuery.itemId = this.formBase.id;
      listByAssetAndItem(this.assetQuery).then((response) => {
        this.itemPackList = response.rows;
        this.totalPack = response.total;
        this.loadingPack = false;
      });
    },
    // 查询套餐列表
    getlistPack() {
      listPack(this.listQuery).then((response) => {
        this.tableList = response.rows;
        this.tableList.map((item) => {
          item.count = this.count;
        });
        this.totalList = response.total;
        this.loadingPackList = false;
        this.$nextTick(() => {
          this.isrender = true;
        });
      });
    },
    // 查询开卡项服务
    getItemSevivceList() {
      this.assetQuery.assetType = "service";
      this.assetQuery.itemId = this.formBase.id;
      listByAssetAndItem(this.assetQuery).then((response) => {
        this.itemSreviceList = response.rows;
        this.totalService = response.total;
        this.loadingService = false;
      });
    },
    // 查询服务列表
    getListService() {
      listService(this.listQuery).then((response) => {
        this.tableList = response.rows;
        this.tableList.map((item) => {
          item.count = this.count;
        });
        this.totalList = response.total;
        this.loadingService = false;
        this.$nextTick(() => {
          this.isrender = true;
        });
      });
    },
    // 查询开卡项商品
    getItemGoodList() {
      this.assetQuery.assetType = "goods";
      this.assetQuery.itemId = this.formBase.id;
      listByAssetAndItem(this.assetQuery).then((response) => {
        this.itemGoodList = response.rows;
        this.totalService = response.total;
        this.loadingService = false;
      });
    },
    // 查询商品列表
    getListGood() {
      listGoods(this.listQuery).then((response) => {
        this.tableList = response.rows;
        this.tableList.map((item) => {
          item.count = this.count;
        });
        this.totalList = response.total;
        this.loadingGood = false;
        this.$forceUpdate();
      });
    },
    // 下一步按鈕
    nextStep() {
      if (!this.formBase.id) {
        // if (this.formBase.name == "") {
        //   this.$modal.msgError("请完成页面信息");
        // } else {
        addApplyItemsTemp(this.formBase).then((response) => {
          this.formBase.id = response.data;
          this.getApplayItem(this.formBase.id);
          this.getItemPackList();
        });
        // }
      } else {
        this.getItemPackList();
      }
      this.active = 1;
    },
    // 回到上一步按鈕
    prevStep() {
      this.active = 0;
    },
    reset() {
      this.formBase = {
        name: "",
        status: "0",
        type: "0",
        personalAccount: "",
        companyAccount: "",
      };
      this.resetForm("formBase");
    },
    // 基本信息保存按鈕
    addArgumentSubmit() {
      this.$refs["formBase"].validate((valid) => {
        if (valid) {
          updateApplyItemsTemp(this.formBase).then((response) => {
            this.$modal.msgSuccess("修改成功");
            this.$router.push({
              path: "/card/card/cardApplyItemsTemp",
            });
          });
        }
      });
    },
    cancel() {
      this.updateCountData = {
        id: "",
        count: 0,
      };
      this.isOpenChange = false;
    },
    cancelTable() {
      this.isOpen = false;
      this.listQuery = {
        pageNum: 1,
        pageSize: 10,
      };
      this.currentPage = 1;
    },
    // 套餐添加按钮
    showPack() {
      this.listQuery = {
        pageNum: 1,
        pageSize: 10,
      };
      this.currentPage = 1;
      this.isOpen = true;
      this.getlistPack();
      this.colums = [
        {
          label: "套餐图片",
          prop: "images",
          align: "center",
        },
        {
          label: "套餐编号",
          prop: "code",
          align: "center",
        },
        {
          label: "套餐名称",
          prop: "name",
          align: "center",
        },
        {
          label: "服务分类",
          prop: "serviceClassName",
          align: "center",
        },
        {
          label: "销售价格",
          prop: "standardPrice",
          align: "center",
        },
        {
          label: "状态",
          prop: "status",
          align: "center",
          formatter(row) {
            return row.status == 0 ? "正常" : "停用";
          },
        },
        {
          label: "数量",
          prop: "count",
          align: "center",
        },
        {
          label: "描述",
          prop: "description",
          align: "center",
        },
      ];
      this.insertDataItem = {
        assetId: "", //选择的id
        assetType: "package", //套餐，服务，商品，优惠券
        count: 1,
        itemId: this.formBase.id, //当前开卡项id
        itemType: "1", //1 预设开卡项 2赠送规则
      };
    },
    // 添加服務按扭
    showService() {
      this.listQuery = {
        pageNum: 1,
        pageSize: 10,
      };
      this.currentPage = 1;
      this.isOpen = true;
      this.$nextTick(() => {
        this.isrender = true;
      });
      this.title = "选择服务";
      this.getListService();
      this.colums = [
        {
          label: "服务图片",
          prop: "images",
        },
        {
          label: "服务编号",
          prop: "code",
        },
        {
          label: "服务名称",
          prop: "name",
        },
        {
          label: "服务分类",
          prop: "serviceClassName",
        },
        {
          label: "销售价格",
          prop: "standardPrice",
        },
        {
          label: "状态",
          prop: "status",
          formatter(row) {
            return row.status == 0 ? "正常" : "停用";
          },
        },
        {
          label: "数量",
          prop: "count",
        },
        {
          label: "描述",
          prop: "description",
        },
      ];
      this.insertDataItem = {
        assetId: "", //选择的id
        assetType: "service", //套餐，服务，商品，优惠券
        count: 1,
        itemId: this.formBase.id, //当前开卡项id
        itemType: "1", //1 预设开卡项 2赠送规则
      };
    },
    // 添加商品按鈕
    showGoods() {
      console.log(this.currentPage);
      this.listQuery = {
        pageNum: 1,
        pageSize: 10,
      };
      this.currentPage = 1;
      this.isOpen = true;
      this.$nextTick(() => {
        this.isrender = true;
      });
      this.title = "选择商品";
      this.getListGood();
      this.colums = [
        {
          label: "商品图片",
          prop: "images",
        },
        {
          label: "sku编号",
          prop: "code",
        },
        {
          label: "商品名称",
          prop: "name",
        },
        {
          label: "商品分类",
          prop: "goodsClassName",
        },
        {
          label: "销售价格",
          prop: "standardPrice",
        },
        {
          label: "条码",
          prop: "goodsSpecListBarcode",
        },
        {
          label: "数量",
          prop: "count",
        },
        {
          label: "状态",
          prop: "status",
          formatter(row) {
            return row.status == 0 ? "正常" : "停用";
          },
        },
      ];
      this.insertDataItem = {
        assetId: "", //选择的id
        assetType: "goods", //套餐，服务，商品，优惠券
        count: 1,
        itemId: this.formBase.id, //当前开卡项id
        itemType: "1", //1 预设开卡项 2赠送规则
      };
    },
    // 列表選中提交按鈕
    submitForm(option) {
      let arr = [];
      this.isOpen = false;
      option.map((i) => {
        this.insertDataItem.assetId = i.assetId;
        this.insertDataItem.count = i.count;
        arr.push(this.insertDataItem);
      });
      insertCardItemsMiddle(arr).then((response) => {
        this.handleClick(this.activeName);
        this.isOpen = false;
      });
    },
    // tab列表 編輯按鈕
    editItem(rows) {
      this.updateCountData.id = rows.id;
      this.updateCountData.count = rows.count;
      this.isOpenChange = true;
    },
    // tab 列表編輯提交按鈕
    changeCount() {
      updateCardItemsMiddle(this.updateCountData).then((response) => {
        this.handleClick(this.activeName);
        this.updateCountData = {
          id: "",
          count: 0,
        };
        this.isOpenChange = false;
      });
    },
    // tab 列表刪除按鈕
    deleteItem(rows, type) {
      let id = { id: rows.id };
      this.$modal
        .confirm("是否确认删除该资产配置项？")
        .then(function () {
          deleteCardItemsMiddle(id);
        })
        .then(() => {
          this.$modal.msgSuccess("删除成功");
          this.handleClick("type");
        })
        .catch(() => {});
    },
    // tab觸發事件
    handleClick(name) {
      if (name == "package") {
        this.getItemPackList();
      } else if (name == "coupon") {
      } else if (name == "service") {
        this.getItemSevivceList();
      } else if (name == "goods") {
        this.getItemGoodList();
      }
    },
    // selectTable刷新列表
    getList() {
      let str = this.activeName;
      if (str == "package") {
        this.getlistPack();
      } else if (str == "service") {
        this.getListService();
      } else if (str == "goods") {
        this.getListGood();
      }
    },
    // selectTable 數字input刷新方法
    changinput(rows) {
      let index = this.tableList.map((i, index) =>
        i.id == rows.id ? index : null
      );
      this.$set(this.tableList, index, rows);
    },
    // 操作selectTable分頁
    handlerCurrentChage(pageSize, currentPage) {
      this.listQuery.pageSize = pageSize;
      this.listQuery.pageNum = currentPage;
      this.getList(this.title);
    },
  },
};
</script>
<style lang="scss" scoped>
.app-container {
  display: flex;
  justify-content: center;
  align-items: center;
}
.aligncenter {
  padding-top: 5%;
  width: 70%;
}
.line {
  // border: 1px solid #dcdfe6;
  // border-radius: 10px;
  padding: 40px 30px;
  // position: relative;
  margin: 30px 0;
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
