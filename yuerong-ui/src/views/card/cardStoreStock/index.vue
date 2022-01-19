<template>
  <div class="app-container">
    <el-tabs v-model="activeTabName" @tab-click="handleTabChange">
      <el-tab-pane label="门店库存" name="1">
        <el-form
          :model="queryParams1"
          ref="queryForm1"
          :inline="true"
          v-show="showSearch"
          size="small"
        >
          <el-form-item label="会员卡类型" prop="cardTypeId">
            <el-select
              v-model="queryParams1.cardTypeId"
              placeholder="请选择类型"
              clearable
            >
              <el-option
                v-for="dict in dict.type.order_type"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="卡分类" prop="orderStatu">
            <el-select
              v-model="queryParams1.orderStatu"
              placeholder="请选择状态"
              clearable
            >
              <el-option
                v-for="dict in dict.type.order_statu"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="门店" prop="deptIds">
            <el-tree-select
              v-model="queryParams1.deptIds"
              ref="treeSelect"
              :selectParams="{
                clearable: true,
                placeholder: '请选择门店',
                multiple: true,
                'collapse-tags': true,
              }"
              :treeParams="treeParams"
            ></el-tree-select>
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              icon="el-icon-search"
              size="mini"
              @click="handleQuery"
              >搜索</el-button
            >
            <el-button icon="el-icon-refresh" size="mini" @click="resetQuery"
              >重置</el-button
            >
          </el-form-item>
          <el-row class="mb8">
            <right-toolbar
              :showSearch.sync="showSearch"
              @queryTable="getList1"
            ></right-toolbar>
          </el-row>
        </el-form>

        <el-table v-loading="loading" :data="dataList1">
          <!-- <el-table-column type="selection" width="55" align="center" /> -->
          <el-table-column label="库存批次号" prop="code" width="180" />
          <el-table-column label="卡类编号" prop="cardTypeCode" width="180">
          </el-table-column>
          <el-table-column label="卡类名称" prop="cardTypeName" width="150">
          </el-table-column>
          <el-table-column label="门店编号" prop="storeCode" width="200" />
          <el-table-column label="门店名称" prop="storeName" min-width="150">
            <!-- <template slot-scope="scope">
            <dict-tag
              :options="dict.type.order_type"
              :value="scope.row.orderType"
            />
          </template> -->
          </el-table-column>

          <el-table-column label="可用库存" prop="count" min-width="150" />
          <el-table-column
            label="操作"
            align="center"
            fixed="right"
            width="100"
          >
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="text"
                icon="el-icon-edit"
                @click="openDialog(scope.row)"
                >编辑</el-button
              >
            </template>
          </el-table-column>
        </el-table>
        <pagination
          v-show="total1 > 0"
          :total="total1"
          :page.sync="queryParams1.pageNum"
          :limit.sync="queryParams1.pageSize"
          @pagination="getList1"
        />
      </el-tab-pane>
      <el-tab-pane label="渠道库存" name="2">
        <el-form
          :model="queryParams2"
          ref="queryForm2"
          :inline="true"
          v-show="showSearch"
          size="small"
        >
          <el-form-item label="会员卡类型" prop="cardTypeId">
            <el-select
              v-model="queryParams2.cardTypeId"
              placeholder="请选择类型"
              clearable
            >
              <el-option
                v-for="dict in dict.type.order_type"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="卡分类" prop="classId">
            <el-select
              v-model="queryParams2.classId"
              placeholder="请选择状态"
              clearable
            >
              <el-option
                v-for="dict in dict.type.order_statu"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="渠道" prop="channel">
            <el-select
              v-model="queryParams2.channel"
              placeholder="请选择渠道"
              clearable
            >
              <el-option
                v-for="dict in dict.type.order_statu"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="库存类型" prop="type">
            <el-select
              v-model="queryParams2.type"
              placeholder="请选择类型"
              clearable
            >
              <el-option
                v-for="dict in dict.type.order_statu"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="活动类型" prop="eventsType">
            <el-select
              v-model="queryParams2.eventsType"
              placeholder="请选择类型"
              clearable
            >
              <el-option
                v-for="dict in dict.type.order_statu"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="活动名称" prop="eventsName">
            <el-input
              v-model="queryParams2.eventsName"
              placeholder="请输入活动名称"
              clearable
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              icon="el-icon-search"
              size="mini"
              @click="handleQuery"
              >搜索</el-button
            >
            <el-button icon="el-icon-refresh" size="mini" @click="resetQuery"
              >重置</el-button
            >
          </el-form-item>
          <el-row class="mb8">
            <el-col :span="2">
              <el-button
                type="primary"
                plain
                icon="el-icon-plus"
                size="mini"
                @click="openDialog"
                >新增</el-button
              >
            </el-col>
            <right-toolbar
              :showSearch.sync="showSearch"
              @queryTable="getList2"
            ></right-toolbar>
          </el-row>
        </el-form>

        <el-table v-loading="loading" :data="dataList2">
          <!-- <el-table-column type="selection" width="55" align="center" /> -->
          <el-table-column label="库存批次号" prop="code" width="180" />
          <el-table-column label="卡类编号" prop="cardTypeCode" width="180">
          </el-table-column>
          <el-table-column label="卡类名称" prop="cardTypeName" width="150">
          </el-table-column>
          <el-table-column label="渠道" prop="channelName" width="150" />
          <el-table-column label="库存类型" prop="count" width="100">
            <template slot-scope="scope">
              <span v-show="scope.row.type == '0'">普通库存</span>
              <span v-show="scope.row.type == '1'">活动库存</span>
            </template>
          </el-table-column>

          <el-table-column label="可用库存" prop="count" width="120" />

          <el-table-column label="活动编号" prop="eventsId" width="200" />
          <el-table-column label="活动名称" prop="eventsName" min-width="150">
            <!-- <template slot-scope="scope">
            <dict-tag
              :options="dict.type.order_type"
              :value="scope.row.orderType"
            />
          </template> -->
          </el-table-column>
          <el-table-column label="活动类型" prop="eventsType" width="100" />

          <el-table-column
            label="操作"
            align="center"
            fixed="right"
            width="100"
          >
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="text"
                icon="el-icon-edit"
                @click="openDialog(scope.row)"
                >编辑</el-button
              >
            </template>
          </el-table-column>
        </el-table>
        <pagination
          v-show="total2 > 0"
          :total="total2"
          :page.sync="queryParams2.pageNum"
          :limit.sync="queryParams2.pageSize"
          @pagination="getList2"
        />
      </el-tab-pane>
    </el-tabs>
    <!-- 添加或修改服务分类对话框 -->
    <el-dialog
      :title="dialogTitle"
      :visible.sync="open"
      width="500px"
      append-to-body
      :close-on-click-modal="false"
      @close="dialogClose"
    >
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <template v-if="activeTabName == '1'">
          <el-form-item label="卡类型编号"
            >{{ form.cardTypeCode }}
          </el-form-item>
          <el-form-item label="卡类型名称"
            >{{ form.cardTypeName }}
          </el-form-item>
          <el-form-item label="门店编号">{{ form.storeCode }} </el-form-item>
          <el-form-item label="门店名称">{{ form.storeName }} </el-form-item>
          <el-form-item label="门店库存">
            <el-row>
              <el-col :span="16">
                <el-form-item prop="count">
                  <el-input-number
                    v-model="form.count"
                    :min="1"
                  ></el-input-number>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item prop="isLimit">
                  <el-checkbox
                    v-model="form.isLimit"
                    true-label="1"
                    false-label="0"
                    >不限制</el-checkbox
                  >
                </el-form-item>
              </el-col>
            </el-row>
          </el-form-item>
        </template>

        <template v-if="activeTabName == '2'">
          <template v-if="!targetId">
            <el-form-item label="卡分类">
              <el-select
                v-model="form.classId"
                placeholder="请选择卡分类"
                clearable
              >
                <el-option
                  v-for="dict in dict.type.order_statu"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="卡类型">
              <el-select
                v-model="form.cardTypeId"
                placeholder="请选择卡类型"
                clearable
              >
                <el-option
                  v-for="dict in dict.type.order_statu"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="卡类型编号">
              {{ form.cardTypeCode }}</el-form-item
            >
            <el-form-item label="库存类型">
              <el-select
                v-model="form.type"
                placeholder="请选择卡类型"
                clearable
              >
                <el-option
                  v-for="dict in dict.type.order_statu"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="活动类型">
              <el-select
                v-model="form.eventsType"
                placeholder="请选择活动类型"
                clearable
              >
                <el-option
                  v-for="dict in dict.type.order_statu"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="活动名称" prop="eventsName">
              <el-input
                v-model="form.eventsName"
                placeholder="请输入活动名称"
                clearable
              />
            </el-form-item>

            <el-form-item label="活动编号"> {{ form.eventsId }}</el-form-item>

            <el-form-item label="活动渠道">
              <el-select
                v-model="form.eventsType"
                placeholder="请选择活动渠道"
                clearable
              >
                <el-option
                  v-for="dict in dict.type.order_statu"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                />
              </el-select>
            </el-form-item>
          </template>
          <template v-else>
            <el-form-item label="卡类型编号">
              {{ form.cardTypeCode }}</el-form-item
            >
            <el-form-item label="卡类型名称">
              {{ form.cardTypeName }}</el-form-item
            >
            <el-form-item label="库存类型">
              <span v-show="form.type == '0'">普通库存</span>
              <span v-show="form.type == '1'">活动库存</span>
            </el-form-item>
            <el-form-item label="活动编号"> {{ form.eventsId }}</el-form-item>
            <el-form-item label="活动名称"> {{ form.eventsName }}</el-form-item>
            <el-form-item label="活动渠道">{{ form.channelName }}</el-form-item>
          </template>
          <el-form-item label="可用库存">
            <el-row>
              <el-col :span="16">
                <el-form-item prop="count">
                  <el-input-number
                    v-model="form.count"
                    :min="1"
                  ></el-input-number>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item prop="isLimit">
                  <el-checkbox
                    v-model="form.isLimit"
                    true-label="1"
                    false-label="0"
                    >不限制</el-checkbox
                  >
                </el-form-item>
              </el-col>
            </el-row>
          </el-form-item>
        </template>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="submitForm">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import _ from 'lodash'
import {
  getCardStoreStockList,
  updateCardStoreStock,
  getCardChannelStockList,
  updateCardChannelStock,
} from '@/api/card/inventory'
import { listDept } from '@/api/system/dept'
import ElTreeSelect from '@/components/ElTreeSelect'
export default {
  name: 'CardStoreStock',
  components: {
    ElTreeSelect,
  },
  dicts: ['order_type', 'order_statu'],
  data() {
    return {
      activeTabName: '1',
      // 遮罩层
      loading: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total1: 0,
      total2: 0,
      // 显隐列信息
      columns: [
        { key: _.uniqueId(), label: '库存批次号', visible: true },
        { key: _.uniqueId(), label: '卡类编号', visible: true },
        { key: _.uniqueId(), label: '卡类名称', visible: true },
        { key: _.uniqueId(), label: '门店编号', visible: true },
        { key: _.uniqueId(), label: '门店名称', visible: true },
        { key: _.uniqueId(), label: '可用库存', visible: true },
      ],
      // 表格数据
      dataList1: [],
      dataList2: [],
      // 查询参数
      queryParams1: {
        pageNum: 1,
        pageSize: 10,
      },
      queryParams2: {
        pageNum: 1,
        pageSize: 10,
      },
      // 销售门店列表
      deptList: [],
      treeParams: {
        clickParent: false,
        'default-expand-all': true,
        'expand-on-click-node': false,
        data: [],
        props: {
          children: 'children',
          label: 'deptName',
          value: 'deptId',
        },
      },

      targetId: '',
      // 是否显示弹出层
      open: false,
      // 表单参数
      form: {
        count: null,
        isLimit: '0',
      },
      // 表单校验
      rules: {
        name: [
          { required: true, message: '分类名称不能为空', trigger: 'blur' },
        ],
        deptId: [{ required: true, message: '不能为空', trigger: 'blur' }],
      },
    }
  },
  computed: {
    dialogTitle() {
      const tabTitle = this.activeTabName == '1' ? '门店库存' : '渠道库存'
      return `${this.targetId ? '编辑' : '新增'}${tabTitle}`
    },
  },
  created() {
    this.getDeptList()
    this.getList1()
    this.getList2()
  },

  methods: {
    handleTabChange() {
      console.log(this.activeTabName)
    },
    // 销售门店列表
    getDeptList() {
      listDept().then((response) => {
        const deptList = this.handleTree(response.data, 'deptId')
        this.deptList = deptList
        this.$nextTick(() => {
          this.$refs.treeSelect.treeDataUpdateFun(deptList)
        })
      })
    },
    // 门店库存列表
    getList1() {
      this.loading = true
      const payload = _.assign({}, this.queryParams1)
      getCardStoreStockList(payload).then((response) => {
        console.log(response)
        this.dataList1 = [{ id: 1 }] || response.rows
        this.total1 = response.total
        this.loading = false
      })
    },
    // 渠道库存列表
    getList2() {
      this.loading = true
      const payload = _.assign({}, this.queryParams1)
      getCardChannelStockList(payload).then((response) => {
        this.dataList2 = [{ id: 2 }] || response.rows
        this.total2 = response.total
        this.loading = false
      })
    },
    /** 搜索按钮操作 */
    handleQuery() {
      if (this.activeTabName == '2') {
        this.getList2()
      } else {
        this.getList1()
      }
    },
    /** 重置按钮操作 */
    resetQuery() {
      if (this.activeTabName == '2') {
        this.resetForm('queryForm2')
      } else {
        this.resetForm('queryForm1')
      }
      this.handleQuery()
    },

    // 取消按钮
    cancel() {
      this.open = false
    },
    openDialog(row) {
      if (row) {
        this.targetId = row.id
      } else {
        this.targetId = ''
      }
      this.open = true
    },
    dialogClose() {
      this.$nextTick(() => this.resetForm('form'))
    },
    submitForm() {
      this.$refs['form'].validate((valid) => {
        if (!valid) return false
        // this.$modal.msgSuccess('方案修改成功！')
      })
    },
  },
}
</script>
