<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="系统模块" prop="title">
        <el-input
          v-model="queryParams.title"
          placeholder="请输入系统模块"
          clearable
          style="width: 240px;"
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="操作人员" prop="operName">
        <el-input
          v-model="queryParams.operName"
          placeholder="请输入操作人员"
          clearable
          style="width: 240px;"
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="类型" prop="businessType">
        <el-select
          v-model="queryParams.businessType"
          placeholder="操作类型"
          clearable
          size="small"
          style="width: 240px"
        >
          <el-option
            v-for="dict in dict.type.sys_oper_type"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select
          v-model="queryParams.status"
          placeholder="操作状态"
          clearable
          size="small"
          style="width: 240px"
        >
          <el-option
            v-for="dict in dict.type.sys_common_status"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="操作时间">
        <el-date-picker
          v-model="dateRange"
          size="small"
          style="width: 240px"
          :clearable="false"
          value-format="yyyy-MM-dd"
          type="daterange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :picker-options="pickerOptions"
        ></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <!-- el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['system:operlog:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          @click="handleClean"
          v-hasPermi="['system:operlog:remove']"
        >清空</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['system:operlog:export']"
        >导出</el-button>
      </el-col -->
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table ref="tables" v-loading="loading" :data="list" @selection-change="handleSelectionChange" :default-sort="defaultSort" @sort-change="handleSortChange">
      <!-- el-table-column type="selection" width="55" align="center" / -->
      <el-table-column label="日志编号" align="center" prop="operId" />
      <el-table-column label="系统模块" align="center" prop="title" />
      <el-table-column label="操作类型" align="center" prop="businessType">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.sys_oper_type" :value="scope.row.businessType"/>
        </template>
      </el-table-column>
      <el-table-column label="请求方式" align="center" prop="requestMethod" />
      <el-table-column label="操作人员" align="center" prop="operName" :show-overflow-tooltip="true" sortable="custom" :sort-orders="['descending', 'ascending']" width="100"/>
      <el-table-column label="主机" align="center" prop="operIp" width="130" :show-overflow-tooltip="true" />
      <el-table-column label="操作状态" align="center" prop="status">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.sys_common_status" :value="scope.row.status"/>
        </template>
      </el-table-column>
      <el-table-column label="操作日期" align="center" prop="operTime" sortable="custom" :sort-orders="['descending', 'ascending']" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.operTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-view"
            @click="handleView(scope.row,scope.index)"
            v-hasPermi="['system:operlog:query']"
          >详细</el-button>
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

    <!-- 操作日志详细 -->
    <el-dialog title="操作日志详细" :visible.sync="open" width="700px" append-to-body>
      <el-form ref="form" :model="form" label-width="100px" size="mini">
        <el-row>
          <el-col :span="12">
            <el-form-item label="操作模块：">{{ form.title }} / {{ typeFormat(form) }}</el-form-item>
            <el-form-item
              label="登录IP："
            >{{ form.operIp }}</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="操作人员：">{{ form.operName }}</el-form-item>
            <el-form-item label="操作状态：">
              <dict-tag :options="dict.type.sys_common_status" :value="form.status"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="请求地址：" v-if="form.businessType === 3">{{ form.operUrl }}</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="操作时间：">{{ parseTime(form.operTime) }}</el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="异常信息：" v-if="form.status === 1">{{ form.errorMsg }}</el-form-item>
          </el-col>
          <el-col :span="24">
            <!-- el-form-item label="请求参数：">{{ form.operParam }}</el-form-item -->
            <el-table v-if="form.businessType == 1 || form.businessType == 2"
              :data="tableData"
              height="450"
              style="width:100%;padding:20px;" :cell-style="cellStyle">
              <el-table-column prop="field" label="" width="220">
              </el-table-column>
              <el-table-column
                prop="before"
                label="修改前"
                :formatter="beforeFormat">
              </el-table-column>
              <el-table-column prop="after" label="修改后" :formatter="afterFormat"/>
                <!-- template slot-scope="scope">
                  <span v-if="scope.row.after != scope.row.before && form.businessType !== 1">
                    <span style="color:#ff4949">({{ scope.row.after }}).replace(/00:00:00/,'')</span>
                  </span>
                  <span v-else>
                    <span>{{ scope.row.after }}</span>
                  </span>
                </template -->
              </el-table-column>
            </el-table>
          </el-col>
          <!-- el-col :span="24">
            <el-form-item label="返回参数：">{{ form.jsonResult }}</el-form-item>
          </el-col -->
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="open = false">关 闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { list, getOperlog, delOperlog, cleanOperlog } from "@/api/system/operlog";

export default {
  name: "Operlog",
  dicts: ['sys_oper_type', 'sys_common_status'],
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 表格数据
      list: [],
      tableData: [],
      // 是否显示弹出层
      open: false,
      // 日期范围
      dateRange: [],
      pickerOptions: {
        onPick: ({ maxDate,minDate}) => {
            this.min = minDate && minDate.getTime();
            if(maxDate) {
                this.min='';
            }
         },
         // 最大查看范围为30天
         disabledDate:time=> {
            let m = 30 * 24 * 60 * 60 * 1000;
            if (this.min) {
                return time.getTime() > (this.min+m)||time.getTime() < (this.min-m)||time.getTime() > Date.now();
            } else {
                return time.getTime() > Date.now();
            }
         }
      },
      // 默认排序
      defaultSort: {prop: 'operTime', order: 'descending'},
      // 表单参数
      form: {},
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        title: undefined,
        operName: undefined,
        businessType: undefined,
        status: undefined
      }
    };
  },
  created() {
    this.getToday();
    this.getList();
  },
  methods: {
    /** 获取当天日期 */
    getToday() {
      var now = new Date();
      var year = now.getFullYear();
      var month = now.getMonth()+1;
      var date = now.getDate();
      month = month.toString().padStart(2, "0");
      date = date.toString().padStart(2, "0");
      var today = `${year}-${month}-${date}`;
      this.dateRange = [today, today];
    },
    beforeFormat(row) {
      if(row.before) {
        if(typeof row.before == 'string') {
          return  row.before.replace(/00:00:00/,'');
        }
        return row.before;
      }
      return '';
    },
    afterFormat(row) {
      if(row.after) {
        if(typeof row.after == 'string') {
          return  row.after.replace(/00:00:00/,'');
        }
        return row.after;
      }
      return '';
    },
    cellStyle({row, column, rowIndex, columnIndex}) {
      if(this.form.businessType !== 1 && columnIndex === 2) {
        for(let key in row) {
          if(row['after'] != row['before']) {
            return 'background:#fbfb52ad';
          }
        }
      }
    },
    /** 查询登录日志 */
    getList() {
      this.loading = true;
      list(this.addDateRange(this.queryParams, this.dateRange)).then( response => {
          this.list = response.rows;
          this.total = response.total;
          this.loading = false;
        }
      );
    },
    // 操作日志类型字典翻译
    typeFormat(row, column) {
      return this.selectDictLabel(this.dict.type.sys_oper_type, row.businessType);
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      //this.dateRange = [];
      this.resetForm("queryForm");
      this.$refs.tables.sort(this.defaultSort.prop, this.defaultSort.order)
      this.handleQuery();
    },
    /** 多选框选中数据 */
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.operId)
      this.multiple = !selection.length
    },
    /** 排序触发事件 */
    handleSortChange(column, prop, order) {
      this.queryParams.orderByColumn = column.prop;
      this.queryParams.isAsc = column.order;
      this.getList();
    },
    /** 详细按钮操作 */
    handleView(row) {
      //this.form = row;
      this.tableData = [];
      getOperlog(row.operId).then(response => {
        this.form = response.data;
        if(this.form.afterData) {
          var beforeMap = this.form.beforeData;
          var bLen = 0;
          if(beforeMap) {
            beforeMap = JSON.parse(beforeMap);
            bLen = Object.keys(beforeMap).length
          }
          var afterMap = JSON.parse(this.form.afterData);
          var aLen = Object.keys(afterMap).length;
          var map = afterMap;
          if(bLen > aLen) {
            map = beforeMap;
          }
          
          for(var key in map) {
            this.tableData.push({'field':key, 'before':(beforeMap?beforeMap[key]:''), 'after':afterMap[key]});
          }
        }
        this.open = true;
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const operIds = row.operId || this.ids;
      this.$modal.confirm('是否确认删除日志编号为"' + operIds + '"的数据项？').then(function() {
        return delOperlog(operIds);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 清空按钮操作 */
    handleClean() {
      this.$modal.confirm('是否确认清空所有操作日志数据项？').then(function() {
        return cleanOperlog();
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("清空成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('system/operlog/export', {
        ...this.queryParams
      }, `operlog_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>

<style>
  .el-table--scrollable-y .el-table__body-wrapper {
     overflow: auto;
  }
</style>