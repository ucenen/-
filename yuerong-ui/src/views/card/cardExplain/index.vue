<template>
  <el-tabs style="margin: 0 20px" v-model="activeName" @tab-click="handleClick">
    <!-- ------------------------分页--------------------------- -->
    <el-tab-pane label="卡延期" name="first">
      <!-- -------------------------------------- -->
      <div class="section_one">
        <div style="margin: 0 10px">
          <p>延期协议:</p>
        </div>
        <div class="module_thr">
          <div style="margin: 10px 30px">
            <el-button type="text" @click="dialogVisible = true"
              >设置协议</el-button
            >
            <!-- -------------------------------------------- -->
            <el-dialog
              title="延期协议"
              :visible.sync="dialogVisible"
              width="80%"
              :before-close="handleClose"
            >
              <div style="display: flex; justify-content: flex-start">
                <div class="input_base">
                  <div>
                    <p style="padding: 5px 0 0 0; width: 60px">模板名称:</p>
                  </div>
                  <div style="padding: 10px 20px; width: 300px">
                    <el-select
                      v-model="value"
                      placeholder="请选择"
                      style="padding: 5px 20px; width: 240px"
                    >
                      <el-option
                        v-for="item in options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      >
                      </el-option>
                    </el-select>
                  </div>
                  <!-- ------------------------------------------------------------- -->
                  <div>
                    <p style="padding: 5px 0 0 0; width: 60px">状态:</p>
                  </div>
                  <div style="padding: 10px 20px; width: 300px">
                    <el-select
                      v-model="value"
                      placeholder="请选择"
                      style="padding: 5px 20px; width: 240px"
                    >
                      <el-option
                        v-for="item in options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      >
                      </el-option>
                    </el-select>
                  </div>
                  <!-- --------------------------------- -->
                  <div>
                    <p style="padding: 5px 0 0 0; width: 60px">更新日期:</p>
                  </div>
                  <div style="padding: 10px 20px; width: 300px">
                    <el-date-picker
                      v-model="updaDateRange"
                      size="small"
                      style="width: 240px"
                      value-format="yyyy-MM-dd HH:mm:ss"
                      type="daterange"
                      range-separator="-"
                      start-placeholder="开始日期"
                      end-placeholder="结束日期"
                    ></el-date-picker>
                  </div>
                  <!-- ---------------end------------------------- -->
                  <div class="module_thr">
                    <div style="margin: 0px 10px">
                      <p>模板编号</p>
                    </div>
                    <el-input
                      style="width: 100px; margin: 10px"
                      v-model="eve_lowow"
                    ></el-input>
                  </div>
                  <el-button
                    type="primary"
                    style="width: 150px; height: 46px; margin: 0 40px"
                    >搜索</el-button
                  >
                  <!-- --------------------------end------------------------------ -->
                </div>
              </div>
              <!-- -------------------------sectin one end ---------------------------------- -->
              <!-- --------------------------------section   two   start------------------------------ -->
              <div>
                <el-table
                  ref="multipleTable"
                  :data="tableData"
                  tooltip-effect="dark"
                  style="width: 100%"
                  @selection-change="handleSelectionChange"
                >
                  <el-table-column type="selection" width="55">
                  </el-table-column>
                  <el-table-column label="模板编号" width="120">
                    <template slot-scope="scope">{{ scope.row.date }}</template>
                  </el-table-column>
                  <el-table-column prop="name" label="模板名称" width="120">
                  </el-table-column>
                  <el-table-column
                    prop="address"
                    label="协议说明"
                    show-overflow-tooltip
                    width="300px"
                  >
                  </el-table-column>
                  <el-table-column
                    prop="address"
                    label="创建日期"
                    show-overflow-tooltip
                    width="300px"
                  >
                  </el-table-column>
                  <el-table-column
                    prop="address"
                    label="更新日期"
                    show-overflow-tooltip
                    width="300px"
                  >
                  </el-table-column>
                  <el-table-column
                    prop="address"
                    label="状态"
                    show-overflow-tooltip
                    width="300px"
                  >
                  </el-table-column>
                </el-table>
                <div style="margin-top: 20px">
                  <el-button
                    @click="
                      toggleSelection([
                        tableData[0],
                        tableData[1],
                        tableData[2],
                        tableData[3],
                        tableData[4],
                      ])
                    "
                    >选择</el-button
                  >
                </div>
              </div>
              <!-- --------------------------------section   two   end------------------------------ -->
              <div class="block">
                <!-- <span class="demonstration">完整功能</span> -->
                <el-pagination
                  @size-change="handleSizeChange"
                  @current-change="handleCurrentChange"
                  :current-page="currentPage4"
                  :page-sizes="[100, 200, 300, 400]"
                  :page-size="100"
                  layout="total, sizes, prev, pager, next, jumper"
                  :total="400"
                >
                </el-pagination>
              </div>
              <!-- -----------------------------section three end--------------------------------- -->
              <span slot="footer" class="dialog-footer">
                <el-button type="primary">保存</el-button>
              </span>
            </el-dialog>
            <!-- ------------------------------------ -->
          </div>
        </div>
      </div>
      <!-- ----------------------------end--------------------------------->
      <div class="section_one">
        <div style="margin: 0 10px">
          <p>延期说明:</p>
        </div>
        <div style="margin: 15px 20px">
          <Editor style="height: 150px"></Editor>
        </div>
      </div>
      <div style="margin: 10% 45%">
        <el-button type="primary">保存</el-button>
      </div>
    </el-tab-pane>
    <!-- ------------------------------one end-------------------------- -->
    <el-tab-pane label="亲情账户" name="second">
      <div class="section_one">
        <div style="margin: 0 10px">
          <p>亲情账户:</p>
        </div>
        <div style="margin: 10px 30px">
          <el-button type="text" @click="dialogVisible_nin = true"
            >设置亲情账户协议</el-button
          >
          <!-- -------------------------------------------- -->
          <el-dialog
            title="设置亲情账户协议"
            :visible.sync="dialogVisible_nin"
            width="80%"
            :before-close="handleClose"
          >
            <div style="display: flex; justify-content: flex-start">
              <div class="input_base">
                <div>
                  <p style="padding: 5px 0 0 0; width: 60px">模板名称:</p>
                </div>
                <div style="padding: 10px 20px; width: 300px">
                  \

                  <el-select
                    v-model="value_o"
                    placeholder="请选择"
                    style="padding: 5px 20px; width: 240px"
                  >
                    <el-option
                      v-for="item in options"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    >
                    </el-option>
                  </el-select>
                </div>
                <!-- ------------------------------------------------------------- -->
                <div>
                  <p style="padding: 5px 0 0 0; width: 60px">状态:</p>
                </div>
                <div style="padding: 10px 20px; width: 300px">
                  <el-select
                    v-model="value_tw"
                    placeholder="请选择"
                    style="padding: 5px 20px; width: 240px"
                  >
                    <el-option
                      v-for="item in options"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    >
                    </el-option>
                  </el-select>
                </div>
                <!-- --------------------------------- -->
                <div>
                  <p style="padding: 5px 0 0 0; width: 60px">更新日期:</p>
                </div>
                <div style="padding: 10px 20px; width: 300px">
                  <el-date-picker
                    v-model="updaDateRange_thr"
                    size="small"
                    style="width: 240px"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    type="daterange"
                    range-separator="-"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                  ></el-date-picker>
                </div>
                <!-- ---------------end------------------------- -->
                <div class="module_thr">
                  <div style="margin: 0px 10px">
                    <p>模板编号</p>
                  </div>
                  <el-input
                    style="width: 100px; margin: 10px"
                    v-model="eve_lowow_one"
                  ></el-input>
                </div>
                <el-button
                  type="primary"
                  style="width: 150px; height: 46px; margin: 0 40px"
                  >搜索</el-button
                >
                <!-- --------------------------end------------------------------ -->
              </div>
            </div>
            <!-- -------------------------sectin one end ---------------------------------- -->
            <!-- --------------------------------section   two   start------------------------------ -->
            <div>
              <el-table
                ref="multipleTable"
                :data="tableData"
                tooltip-effect="dark"
                style="width: 100%"
                @selection-change="handleSelectionChange"
              >
                <el-table-column type="selection" width="55"> </el-table-column>
                <el-table-column label="模板编号" width="120">
                  <template slot-scope="scope">{{ scope.row.date }}</template>
                </el-table-column>
                <el-table-column prop="name" label="模板名称" width="120">
                </el-table-column>
                <el-table-column
                  prop="address"
                  label="类型"
                  show-overflow-tooltip
                  width="300px"
                >
                </el-table-column>
                <el-table-column
                  prop="address"
                  label="账户余额"
                  show-overflow-tooltip
                  width="300px"
                >
                </el-table-column>
                <el-table-column
                  prop="address"
                  label="套餐总价"
                  show-overflow-tooltip
                  width="300px"
                >
                </el-table-column>
                <el-table-column
                  prop="address"
                  label="服务总价"
                  show-overflow-tooltip
                  width="300px"
                >
                </el-table-column>
                <el-table-column
                  prop="address"
                  label="优惠券总价"
                  show-overflow-tooltip
                  width="300px"
                >
                </el-table-column>
                <el-table-column
                  prop="address"
                  label="总计金额"
                  show-overflow-tooltip
                  width="300px"
                >
                </el-table-column>
                <el-table-column
                  prop="address"
                  label="状态"
                  show-overflow-tooltip
                  width="300px"
                >
                </el-table-column>
              </el-table>
              <div style="margin-top: 20px">
                <el-button
                  @click="
                    toggleSelection([
                      tableData[0],
                      tableData[1],
                      tableData[2],
                      tableData[3],
                      tableData[4],
                    ])
                  "
                  >选择</el-button
                >
              </div>
            </div>
            <!-- --------------------------------section   two   end------------------------------ -->
            <div class="block">
              <!-- <span class="demonstration">完整功能</span> -->
              <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="currentPage4"
                :page-sizes="[100, 200, 300, 400]"
                :page-size="100"
                layout="total, sizes, prev, pager, next, jumper"
                :total="400"
              >
              </el-pagination>
            </div>
            <!-- -----------------------------section three end--------------------------------- -->
            <span slot="footer" class="dialog-footer">
              <el-button type="primary">保存</el-button>
            </span>
          </el-dialog>
          <!-- ------------------------------------ -->
        </div>
      </div>
      <!-- ----------------------------end--------------------------------->
      <div class="section_one">
        <div style="margin: 0 10px">
          <p>亲情账户说明:</p>
        </div>
        <div style="margin: 15px 20px">
          <Editor style="height: 150px"></Editor>
        </div>
      </div>
      <div style="margin: 10% 45%">
        <el-button type="primary">保存</el-button>
      </div>
    </el-tab-pane>
    <!-- ------------------------------------two end----------------------------- -->
    <el-tab-pane label="解除绑定" name="third">
      <div class="section_one">
        <div style="margin: 0 10px">
          <p>解除绑定协议:</p>
        </div>
        <div style="margin: 10px 20px">
          <div style="margin: 0 30px">
            <el-button type="text" @click="dialogVisible_nin_gift = true"
              >解除绑定协议</el-button
            >
            <!-- -------------------------------------------- -->
            <el-dialog
              title="解除绑定协议"
              :visible.sync="dialogVisible_nin_gift"
              width="80%"
              :before-close="handleClose"
            >
              <div style="display: flex; justify-content: flex-start">
                <div class="input_base">
                  <div>
                    <p style="padding: 5px 0 0 0; width: 60px">规则名称:</p>
                  </div>
                  <div style="padding: 10px 20px; width: 300px">
                    <el-select
                      v-model="value_o_rules"
                      placeholder="请选择"
                      style="padding: 5px 20px; width: 240px"
                    >
                      <el-option
                        v-for="item in options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      >
                      </el-option>
                    </el-select>
                  </div>
                  <!-- --------------------------------------------------------------->
                  <div>
                    <p style="padding: 5px 0 0 0; width: 60px">状态:</p>
                  </div>
                  <div style="padding: 10px 20px; width: 300px">
                    <el-select
                      v-model="value_tw_state"
                      placeholder="请选择"
                      style="padding: 5px 20px; width: 240px"
                    >
                      <el-option
                        v-for="item in options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      >
                      </el-option>
                    </el-select>
                  </div>
                  <!-- --------------------------------- -->
                  <div>
                    <p style="padding: 5px 0 0 0; width: 60px">更新日期:</p>
                  </div>
                  <div style="padding: 10px 20px; width: 300px">
                    <el-date-picker
                      v-model="updaDateRange_thr_date"
                      size="small"
                      style="width: 240px"
                      value-format="yyyy-MM-dd HH:mm:ss"
                      type="daterange"
                      range-separator="-"
                      start-placeholder="开始日期"
                      end-placeholder="结束日期"
                    ></el-date-picker>
                  </div>
                  <!-- ---------------end------------------------- -->
                  <div class="module_thr">
                    <div style="margin: 0px 10px">
                      <p>规则ID</p>
                    </div>
                    <el-input
                      style="width: 100px; margin: 10px"
                      v-model="eve_lowow_one_rules"
                    ></el-input>
                  </div>
                  <el-button
                    type="primary"
                    style="width: 150px; height: 46px; margin: 0 40px"
                    >搜索</el-button
                  >
                  <!-- --------------------------end------------------------------ -->
                </div>
              </div>
              <!-- -------------------------sectin one end ---------------------------------- -->
              <!-- --------------------------------section   two   start------------------------------ -->
              <div>
                <el-table
                  ref="multipleTable"
                  :data="tableData"
                  tooltip-effect="dark"
                  style="width: 100%"
                  @selection-change="handleSelectionChange"
                >
                  <el-table-column type="selection" width="55">
                  </el-table-column>
                  <el-table-column label="规则ID" width="120">
                    <template slot-scope="scope">{{ scope.row.date }}</template>
                  </el-table-column>
                  <el-table-column prop="name" label="规则名称" width="120">
                  </el-table-column>
                  <el-table-column
                    prop="address"
                    label="是否限定充值金额"
                    show-overflow-tooltip
                    width="300px"
                  >
                  </el-table-column>
                  <el-table-column
                    prop="address"
                    label="规则说明"
                    show-overflow-tooltip
                    width="300px"
                  >
                  </el-table-column>
                  <el-table-column
                    prop="address"
                    label="赠送总计金额"
                    show-overflow-tooltip
                    width="300px"
                  >
                  </el-table-column>

                  <el-table-column
                    prop="address"
                    label="状态"
                    show-overflow-tooltip
                    width="300px"
                  >
                  </el-table-column>
                </el-table>
                <div style="margin-top: 20px">
                  <el-button
                    @click="
                      toggleSelection([
                        tableData[0],
                        tableData[1],
                        tableData[2],
                        tableData[3],
                        tableData[4],
                      ])
                    "
                    >选择</el-button
                  >
                </div>
              </div>
              <!-- --------------------------------section   two   end------------------------------ -->
              <div class="block">
                <!-- <span class="demonstration">完整功能</span> -->
                <el-pagination
                  @size-change="handleSizeChange"
                  @current-change="handleCurrentChange"
                  :current-page="currentPage4"
                  :page-sizes="[100, 200, 300, 400]"
                  :page-size="100"
                  layout="total, sizes, prev, pager, next, jumper"
                  :total="400"
                >
                </el-pagination>
              </div>
              <!-- -----------------------------section three end--------------------------------- -->
              <span slot="footer" class="dialog-footer">
                <el-button type="primary">保存</el-button>
              </span>
            </el-dialog>
            <!-- ------------------------------------ -->
          </div>
        </div>
      </div>
      <!-- ----------------------------end--------------------------------->
      <div class="section_one">
        <div style="margin: 0 10px">
          <p>延期说明:</p>
        </div>
        <div style="margin: 15px 20px">
          <Editor style="height: 150px"></Editor>
        </div>
      </div>
      <div style="margin: 10% 45%">
        <el-button type="primary">保存</el-button>
      </div>
    </el-tab-pane>
  </el-tabs>
</template>
<script>
export default {
  data() {
    return {
      activeName: "first",
      input_money_small: "",
      input_money: "",
      dialogVisible_rules: false,
      value_o_rules: "",
      value_tw_state: "",
      updaDateRange_thr_date: [],
      eve_lowow_one_rules: "",
      dialogVisiblessss: false,
      value_nin: "",
      value_o: "",
      value_tw: "",
      multipleSelection: [],
      dialogVisible_nin: false,
      dialogVisible_nin_gift: false,
      dialogVisible: false,
      dialogVisibleee: false,
      updaDateRange_thr: [],
      updaDateRange: [],
      updaDateRange_one: [],
      tableData: [
        {
          date: "2016-05-02",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄",
        },
        {
          date: "2016-05-04",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1517 弄",
        },
        {
          date: "2016-05-01",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1519 弄",
        },
        {
          date: "2016-05-03",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1516 弄",
        },
      ],
      giftpack: [
        {
          date: "2016-05-02",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄",
        },
        {
          date: "2016-05-04",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1517 弄",
        },
        {
          date: "2016-05-01",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1519 弄",
        },
        {
          date: "2016-05-03",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1516 弄",
        },
      ],
      value_module: "",
      value_module_type: "",
      input: "",
      input1: "",
      input2: "",
      radio: 1,
      radio2: "",
      radio3: "",
      input4: "",
      input5: "",
      input6: "",
      valuedata: "",
      radionone: "",
      inputnum: "",
      valuedata_select: "",
      y_turn: "",
      y_turn_y: "",
      n_turn: "",
      n_turn_n: "",
      groupvalue: "",
      gpvalue: "",
      op_turn: "",
      off_turn: "",
      dont_pay: "",
      sure_pay: "",
      eve_low: "",
      eve_height: "",
      y_adds: "",
      n_adds: "",
      eve_lowow: "",
      eve_lowow_one: "",
      currentPage4: 4,
      input_stop: "",
    };
  },
  methods: {
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
    },
    handleClose(done) {
      this.$confirm("确认关闭？")
        .then((_) => {
          done();
        })
        .catch((_) => {});
    },
    handleCloseee(done) {
      this.$confirm("确认关闭？")
        .then((_) => {
          done();
        })
        .catch((_) => {});
    },
    toggleSelection(rows) {
      if (rows) {
        rows.forEach((row) => {
          this.$refs.multipleTable.toggleRowSelection(row);
        });
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    handleClick(tab, event) {
      console.log(tab, event);
    },
  },
};
</script>

<style scoped>
.section_one {
  display: flex;
  justify-content: flex-start;
}

.input_base {
  display: flex;
  justify-content: flex-start;
}
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
.peo_card {
  display: flex;
  justify-content: flex-start;
}
.module_thr {
  display: flex;
  justify-content: flex-start;
}
.block {
  margin: 10px;
}
.no_date {
  display: flex;
  justify-content: flex-start;
}
.no_input {
  display: flex;
  margin: 10px 15px;
}
.evev_long {
  margin: 8px 10px;
}
.geeat_money {
  display: flex;
  justify-content: flex-start;
}
.big_mon {
  display: flex;
  margin: 5px 20px;
}
.module_name {
  display: flex;
  justify-content: flex-start;
}
.stop_witre {
  display: flex;
  justify-content: flex-start;
}
.use_set {
  margin-top: 20px;
  text-align: center;
}
</style>
