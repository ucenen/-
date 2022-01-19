<template>
  <div class="">
    <el-table
      ref="multipleTable"
      :data="tableData"
      tooltip-effect="dark"
      style="width: 100%"
      @selection-change="handleSelectionChange"
      :row-key="
        (row) => {
          return row.id;
        }
      "
    >
      <el-table-column type="selection" width="55"> </el-table-column>
      <slot name="insert-before" />
      <el-table-column
        v-for="(column, index) in colums"
        :key="column.prop + column.label + index"
        :label="column.label"
      >
        <template
          :slot="
            column.components && column.components.header ? 'header' : null
          "
          slot-scope="scope"
        >
          <component :is="column.components.header" :scope="scope" />
        </template>
        <template slot-scope="scope">
          {{
            columnFormatter(column, scope) || cellPlaceholderFunc(column, scope)
          }}
        </template>
        <template
          :slot="column.components && column.components.body ? 'default' : null"
          slot-scope="scope"
        >
          <component :is="column.components.body" :scope="scope" />
        </template>
        <template
          :slot="$scopedSlots[column.prop] ? 'default' : null"
          slot-scope="scope"
        >
          <slot :name="column.prop" v-bind="scope" />
        </template>
      </el-table-column>
      <slot />
    </el-table>
    <slot name="pagination">
      <el-pagination
        :total="total"
        :current-page.sync="assetQuery.pageNum"
        :page.sync="assetQuery.pageNum"
        :limit.sync="assetQuery.pageSize"
        layout="total, prev, pager, next, jumper"
        @pagination="getList(title)"
        @current-change="handlerCurrentChage"
        v-if="isrender"
      />
    </slot>

    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="submitForm">保 存</el-button>
      <el-button @click="cancel">取 消</el-button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    // 列表數據
    tableData: {
      type: Array,
      default: [],
    },
    title: {
      type: String,
      default: "",
    },
    // 列表設置
    colums: {
      type: Array,
      default: [],
    },
    // 总页数
    total: {
      type: Number,
    },
    // 列表请求参数
    assetQuery: {
      type: Object,
      default: {
        pageNum: 1,
        pageSize: 10,
      },
    },
    // 分页显示隐藏分页显示隐藏
    isrender: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      multipleTable: [],
      child: "",
      statusText: ["正常", "停用"],
      cellPlaceholder: "",
    };
  },

  methods: {
    // 內容格式化
    columnFormatter(col, scope) {
      if (typeof col.formatter === "function") {
        return col.formatter(scope.row, scope.column);
      }
      return scope.row[col.prop];
    },
    cellPlaceholderFunc(col, scope) {
      if (
        scope.row[col.prop] === undefined ||
        scope.row[col.prop] === "" ||
        scope.row[col.prop] === null
      )
        return this.cellPlaceholder;
      return scope.row[col.prop];
    },
    // 多選
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    // 保存
    submitForm() {
      if (this.multipleSelection.length) {
        let arr = [];
        this.multipleSelection.map((item) => {
          let query = [];
          query.count = item.count;
          query.assetId = item.id;
          arr.push(query);
        });
        this.$emit("submitForm", arr);
      }
    },
    // 取消
    cancel() {
      this.$emit("cancel");
    },
    // 分頁獲取列表方法
    getList() {
      this.$emit("getList");
    },
    // 操作分頁
    handlerCurrentChage(currentPage) {
      this.$emit("handlerCurrentChage", this.assetQuery.pageSize, currentPage);
    },
  },
};
</script>

<style></style>
