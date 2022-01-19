<template>
  <div style="margin: 10px 20px 0 20px">
    <div>新增充值规则</div>

    <div>
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <!-- tabs /one -->
        <el-tab-pane label="基本信息" name="first"
          ><div class="uniei">
            <div>
              <p>规则名称</p>
            </div>
            <div>
              <el-input
                v-model="input"
                placeholder="请输入内容"
                class="un_put"
              ></el-input>
            </div>
          </div>
          <div class="uniei">
            <div>
              <p>规则说明</p>
            </div>
            <div>
              <el-input
                v-model="input1"
                placeholder="请输入内容"
                class="un_put"
              ></el-input>
            </div>
          </div>
          <div class="uniei">
            <div>
              <p>适用渠道</p>
            </div>
            <div>
              <el-input
                v-model="input2"
                placeholder="请输入内容"
                class="un_put"
              ></el-input>
            </div>
          </div>
          <div class="uniei">
            <div>
              <p>适用门店</p>
            </div>
            <div>
              <el-input
                v-model="input3"
                placeholder="请输入内容"
                class="un_put"
              ></el-input>
            </div>
          </div>

          <div class="uniei">
            <div>温馨提示</div>
            <div>
              <Editor
                style="width: 1400px; height: 400px; margin: 0 20px 0 20px"
              ></Editor>
            </div>
          </div>

          <div class="uniei">
            <div style="margin: 80px 0 0 20px">状态</div>
            <div style="margin: 85px 0 0 30px">
              <el-radio v-model="radio" label="1">备选项</el-radio>
              <el-radio v-model="radio" label="2">备选项</el-radio>
            </div>
          </div>
          <div>
            <el-button type="primary" style="margin: 150px 0 0 450px"
              >保存下一步</el-button
            >
          </div>
        </el-tab-pane>
        <!-- end -->
        <!--tabs /two -->

        <el-tab-pane label="赠送条件" name="second">
          <div style="width: 700px; margin: 30px 0 0 90px">
            <el-table :data="tableData" style="width: 100%">
              <el-table-column label="赠送条件" width="180">
                <template slot-scope="scope">
                  <i class="el-icon-time"></i>
                  <span style="margin-left: 10px">{{ scope.row.date }}</span>
                </template>
              </el-table-column>
              <el-table-column label="赠送内容" width="180">
                <template slot-scope="scope">
                  <i class="el-icon-time"></i>
                  <span style="margin-left: 10px">{{ scope.row.date }}</span>
                </template>
              </el-table-column>
              <el-table-column label="总计金额" width="180">
                <template slot-scope="scope">
                  <el-popover trigger="hover" placement="top">
                    <p>姓名: {{ scope.row.name }}</p>
                    <p>住址: {{ scope.row.address }}</p>
                    <div slot="reference" class="name-wrapper">
                      <el-tag size="medium">{{ scope.row.name }}</el-tag>
                    </div>
                  </el-popover>
                </template>
              </el-table-column>
              <el-table-column label="操作">
                <template slot-scope="scope">
                  <el-button type="text" @click="dialogVisible = true"
                    >编辑</el-button
                  >
                  <el-dialog
                    title="编辑规则"
                    :visible.sync="dialogVisible"
                    width="30%"
                    :before-close="handleClose"
                  >
                    <div class="uniei">
                      <div><p>赠送条件</p></div>

                      <div>
                        <el-radio
                          v-model="radio"
                          label="1"
                          style="margin: 15px 0 0 20px"
                          >充值金额大于等于</el-radio
                        >
                      </div>
                      <div>
                        <el-input
                          v-model="input"
                          placeholder="请输入金额"
                          style="margin: 5px 0 0 10px"
                        ></el-input>
                      </div>
                    </div>
                    <!-- ------------------------------------------- -->
                    <div class="uniei">
                      <div>
                        <el-radio
                          v-model="radio2"
                          label="1"
                          style="margin: 15px 0 0 80px"
                          >充值金额区间</el-radio
                        >
                      </div>
                      <div>
                        <el-input
                          v-model="input_one"
                          placeholder="大于等于"
                          style="margin: 5px 0 0 10px"
                        ></el-input>
                      </div>
                      <div style="margin: 10px 0 20px 20px">~~</div>
                      <!-- <div>
                        <el-radio
                          v-model="radio0"
                          label="1"
                          style="margin: 15px 0 0 10px"
                          >按百分比</el-radio
                        >
                      </div> -->
                      <div>
                        <el-input
                          v-model="input_two"
                          placeholder="小于等于"
                          style="margin: 5px 0 0 10px"
                        ></el-input>
                      </div>
                    </div>
                    <!-- ---------------------------------------------- -->
                    <div class="uniei">
                      <div style="width: 70px; margin: 10px 0 0 0px">
                        奖励金额
                      </div>
                      <div>
                        <el-radio
                          v-model="radio4"
                          label="1"
                          style="margin: 15px 0 0 10px"
                          >固定金额</el-radio
                        >
                      </div>
                      <div>
                        <el-input
                          v-model="input_one"
                          placeholder="大于等于"
                          style="margin: 5px 0 0 10px"
                        ></el-input>
                      </div>
                      <!-- <div style="margin: 10px 0 20px 20px">~~</div> -->
                      <div>
                        <el-radio
                          v-model="radio0"
                          label="1"
                          style="margin: 15px 0 0 10px"
                          >按百分比</el-radio
                        >
                      </div>
                      <div>
                        <el-input
                          v-model="input_two"
                          placeholder="小于等于"
                          style="margin: 5px 0 0 10px"
                        ></el-input>
                      </div>
                    </div>
                    <!-- ------------------------------------------------------- -->

                    <div class="uniei">
                      <div style="margin: 20px 0 0 0px">奖励设置：</div>
                      <div>
                        <el-tabs
                          style="margin: 10px 0 0 20px"
                          v-model="acctiveName"
                          @tab-click="handleClickk"
                        >
                          <el-tab-pane label="套餐" name="first">
                            <el-button type="primary"
                              >添加</el-button
                            ></el-tab-pane
                          >
                          <el-tab-pane label="优惠券" name="second"
                            >配置管理</el-tab-pane
                          >
                          <el-tab-pane label="服务" name="third"
                            >角色管理</el-tab-pane
                          >
                          <el-tab-pane label="商品" name="fourth"
                            >定时任务补偿</el-tab-pane
                          >
                        </el-tabs>
                      </div>
                    </div>

                    <!-- ------------------------------------------------------------------ -->
                    <span slot="footer" class="dialog-footer">
                      <el-button @click="dialogVisible = false"
                        >取 消</el-button
                      >
                      <el-button type="primary" @click="dialogVisible = false"
                        >确 定</el-button
                      >
                    </span>
                  </el-dialog>
                  <el-button>删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>

          <div class="uniei">
            <div style="margin: 150px 0 0 300px">
              <el-button type="primary">回到上一步</el-button>
              <el-button type="primary">完成设置</el-button>
            </div>
            <div></div>
          </div>
        </el-tab-pane>
        <!-- end -->
      </el-tabs>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      acctiveName: "first",
      radio0: "",
      radio: "1",
      dialogVisible: false,
      radio: "1",
      radio2: "",
      radio4: "",
      input: "",
      input1: "",
      input2: "",
      input3: "",
      input_one: "",
      input_two: "",
      activeName: "first",
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
    };
  },
  methods: {
    handleClick(tab, event) {
      console.log(tab, event);
    },
    handleClickk(tab, event) {
      console.log(tab, event);
    },
    handleClose(done) {
      this.$confirm("确认关闭？")
        .then((_) => {
          done();
        })
        .catch((_) => {});
    },
  },
};
</script>

<style scoped>
.uniei {
  display: flex;
  justify-content: flex-start;
}
.un_put {
  margin: 10px 10px 0 20px;
}
</style>
