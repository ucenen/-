<template>
  <div>
    <div>
      <!-- <p style="display: fixed; margin-left: 80px">新增会员卡类型</p> -->
    </div>
    <div>
      <el-tabs type="border-card">
        <el-tab-pane>
          <span slot="label"><i class="el-icon-date"></i> 基本设置</span>

          <div class="input_base">
            <div>
              <p>会员卡名称:</p>
            </div>
            <div style="padding: 10px 20px; width: 1200px">
              <el-input
                v-model="input"
                placeholder="请输入卡名称、限20个英文"
              ></el-input>
            </div>
          </div>

          <div class="input_base">
            <div>
              <p style="padding: 5px 0 0 0">所属分类:</p>
            </div>
            <div style="padding: 10px 20px; width: 1200px">
              <el-select
                v-model="value"
                placeholder="请选择"
                style="padding: 5px 20px; width: 1200px"
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
          </div>

          <div class="input_base">
            <div>
              <p style="padding: 5px 0 0 0">卡面图片:</p>
            </div>
            <div style="margin: 10px 50px 0 40px">
              <el-upload
                class="avatar-uploader"
                action="https://jsonplaceholder.typicode.com/posts/"
                :show-file-list="false"
                :on-success="handleAvatarSuccess"
                :before-upload="beforeAvatarUpload"
              >
                <img v-if="imageUrl" :src="imageUrl" class="avatar" />
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
            </div>
          </div>

          <div class="input_base">
            <div>
              <p>标准售价:</p>
            </div>
            <div style="margin: 10px 40px; width: 200px">
              <el-input v-model="input1" placeholder="标准售价"></el-input>
            </div>
          </div>

          <div class="input_base">
            <div>
              <p>允许售卖折扣:</p>
            </div>
            <div style="margin: 10px 10px; width: 200px">
              <el-input v-model="input2" placeholder="允许售卖折扣"></el-input>
            </div>
          </div>

          <div class="peo_card">
            <div>
              <p>单人发卡数</p>
            </div>

            <div style="margin: 20px 10px">
              <el-radio-group v-model="radio">
                <el-radio :label="3">备选项</el-radio>
                <el-radio :label="6">备选项</el-radio>
              </el-radio-group>
            </div>

            <div><p style="margin: 15px 20px">不可超过</p></div>
            <div style="margin: 10px 5px">
              <el-input v-model="input4" placeholder="请输入内容"></el-input>
            </div>
          </div>

          <div class="input_base">
            <div>
              <p>可共享人数:</p>
            </div>
            <div style="margin: 10px 40px; width: 200px">
              <el-input v-model="input5" placeholder="可共享人数"></el-input>
            </div>
          </div>

          <div class="module_thr">
            <div><p>卡有效期:</p></div>
            <div style="margin: 18px 30px">
              <el-radio v-model="radio2" label="1">剩余时间</el-radio>
            </div>

            <div style="margin: 8px 30px">
              <el-input v-model="input6" placeholder="输入数量"></el-input>
            </div>
            <div></div>

            <div style="margin: 18px 30px">
              <el-radio v-model="radio3" label="1">到期日期</el-radio>
            </div>
            <div class="block">
              <el-date-picker
                v-model="valuedata_select"
                type="date"
                placeholder="选择日期"
              >
              </el-date-picker>
            </div>
          </div>

          <div class="module_thr">
            <div><p>是否可延期:</p></div>
            <div style="margin: 18px 30px">
              <el-radio v-model="radionone" label="1">不可延期</el-radio>
            </div>

            <div style="margin: 1px 30px">
              <div class="no_date">
                <div>
                  <p>可延期</p>
                </div>
                <div class="no_input">
                  <el-input v-model="inputnum" placeholder=""></el-input>
                </div>
                <div>
                  <p>天</p>
                </div>
              </div>
            </div>

            <div style="margin: 0px 10px">
              <p>每次延长</p>
            </div>
            <div class="evev_long">
              <el-date-picker v-model="valuedata" type="date"> </el-date-picker>
            </div>
            <div>
              <p>天</p>
            </div>
          </div>

          <div class="module_thr">
            <div><p>是否可转增:</p></div>
            <div style="margin: 18px 30px">
              <el-radio v-model="y_turn" label="1">可转增</el-radio>
            </div>
            <div style="margin: 18px 30px">
              <el-radio v-model="n_turn" label="1">不可转增</el-radio>
            </div>
          </div>

          <div class="module_thr">
            <div><p>开卡协议:</p></div>
            <div style="margin: 10px 30px">
              <el-button type="text" @click="dialogVisible = true"
                >设置协议</el-button
              >
              <!-- -------------------------------------------- -->
              <el-dialog
                title="选择开卡协议"
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
                      <template slot-scope="scope">{{
                        scope.row.date
                      }}</template>
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
                  <el-button @click="dialogVisible = false">取 消</el-button>
                  <el-button type="primary" @click="dialogVisible = false"
                    >确 定</el-button
                  >
                </span>
              </el-dialog>
              <!-- ------------------------------------ -->
            </div>
          </div>

          <div class="module_thr">
            <div><p>使用说明:</p></div>

            <div style="margin: 10px 30px">
              <Editor style="height: 300px"></Editor>
            </div>
          </div>

          <div style="margin: 40px 0 0 0">
            <div class="input_base">
              <div>
                <p style="padding: 5px 0 0 0">归属组织:</p>
              </div>
              <div style="padding: 10px 20px; width: 1200px">
                <el-select
                  v-model="groupvalue"
                  placeholder="请选择"
                  style="padding: 5px 20px; width: 1200px"
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
            </div>
          </div>

          <div style="margin: 40px 0 0 0">
            <div class="input_base">
              <div>
                <p style="padding: 5px 0 0 0">管理组织:</p>
              </div>
              <div style="padding: 10px 20px; width: 1200px">
                <el-select
                  v-model="gpvalue"
                  placeholder="请选择"
                  style="padding: 5px 20px; width: 1200px"
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
            </div>
          </div>

          <div class="module_thr">
            <div><p>状态:</p></div>
            <div style="margin: 18px 30px">
              <el-radio v-model="op_turn" label="1">启用</el-radio>
            </div>
            <div style="margin: 18px 30px">
              <el-radio v-model="off_turn" label="1">禁用</el-radio>
            </div>
          </div>
          <div>
            <div class="input_base">
              <div>
                <p style="padding: 5px 0 0 0">审核状态:</p>
              </div>
              <div style="padding: 8px 20px; width: 1200px; font-size: 15px">
                <p>待提交</p>
              </div>
            </div>
          </div>
        </el-tab-pane>

        <el-tab-pane>
          <span slot="label"
            ><i class="el-icon-date"></i> 账户管理设置如下</span
          >
          <div>
            <el-table :data="tableData" style="width: 100%">
              <el-table-column prop="date" label="账户类型" width="245">
              </el-table-column>
              <el-table-column prop="name" label="消费规则" width="245">
              </el-table-column>
              <el-table-column prop="address" label="适用渠道" width="245">
              </el-table-column>
              <el-table-column prop="address" label="适用门店" width="245">
              </el-table-column>
              <el-table-column
                prop="address"
                label="到店可消费时间段"
                width="245"
              >
              </el-table-column>
              <el-table-column prop="address" label="服务提成系数" width="245">
              </el-table-column>
              <el-table-column prop="address" label="是否可共享" width="245">
              </el-table-column>
              <el-table-column prop="address" label="状态" width="245">
              </el-table-column>
              <el-table-column label="操作">
                <template slot-scope="scope">
                  <el-button type="text" @click="dialogVisibleee = true"
                    >编辑</el-button
                  >
                  <!-- ---------------------------------------begin-------------- -->
                  <el-dialog
                    title="编辑账户"
                    :visible.sync="dialogVisibleee"
                    width="80%"
                    :before-close="handleCloseee"
                  >
                    <!-- -------------------section one---------------------------- -->
                    <div class="input_base">
                      <div>
                        <p style="padding: 5px 0 0 0; width: 60px">消费规则:</p>
                      </div>
                      <div style="padding: 0px 20px; width: 300px">
                        <el-select
                          v-model="value_nin"
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
                    </div>
                    <!-- ----------------section two ------------------------------------- -->
                    <div class="input_base">
                      <div>
                        <p style="padding: 5px 0 0 0; width: 60px">更新日期:</p>
                      </div>
                      <div style="padding: 10px 20px; width: 300px">
                        <el-date-picker
                          v-model="updaDateRange_one"
                          size="small"
                          style="width: 240px"
                          value-format="yyyy-MM-dd HH:mm:ss"
                          type="daterange"
                          range-separator="-"
                          start-placeholder="开始日期"
                          end-placeholder="结束日期"
                        ></el-date-picker>
                      </div>
                    </div>
                    <!-- -------------------------------section three ---------------------------------- -->
                    <div class="input_base">
                      <div>
                        <p style="padding: 5px 0 0 0; width: 100px">
                          服务提成系数:
                        </p>
                      </div>
                      <div style="padding: 0px 20px; width: 300px">
                        <div class="input_base">
                          <div style="padding: 0px 1px; width: 300px">
                            <div class="input_base">
                              <div style="padding: 10px 1px; width: 300px">
                                <el-input
                                  v-model="input"
                                  placeholder="请输入提成数值"
                                ></el-input>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <!-- -------------------------section four---------------------------------------------- -->
                    <div class="module_thr">
                      <div><p>是否可共享:</p></div>
                      <div style="margin: 14px 30px">
                        <el-radio v-model="y_turn_y" label="1">可共享</el-radio>
                      </div>
                      <div style="margin: 14px 30px">
                        <el-radio v-model="n_turn_n" label="1"
                          >不可共享</el-radio
                        >
                      </div>
                    </div>
                    <!-- ------------------------------end----------------------------- -->
                    <span slot="footer" class="dialog-footer">
                      <el-button @click="dialogVisibleee = false"
                        >取 消</el-button
                      >
                      <el-button type="primary" @click="dialogVisibleee = false"
                        >确 定</el-button
                      >
                    </span>
                  </el-dialog>
                  <!-- ----------------------------end--------------------------- -->
                  <el-button type="text" @click="dialogVisiblessss = true"
                    >停用</el-button
                  >
                  <el-dialog
                    title="提示"
                    :visible.sync="dialogVisiblessss"
                    width="30%"
                    :before-close="handleClose"
                  >
                    <span>是否停用个人账户？</span>
                    <span slot="footer" class="dialog-footer">
                      <el-button @click="dialogVisiblessss = false"
                        >取 消</el-button
                      >
                      <el-button
                        type="primary"
                        @click="dialogVisiblessss = false"
                        >确 定</el-button
                      >
                    </span>
                  </el-dialog>
                  <!-- ------------------------ -->
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-tab-pane>

        <el-tab-pane>
          <span slot="label"><i class="el-icon-date"></i> 开卡项</span>
          <div class="input_base">
            <div>
              <p style="padding: 5px 0 0 0">审核状态:</p>
            </div>
            <!-- ------------------------------------------------- -->
            <div style="margin: 10px 30px">
              <el-button type="text" @click="dialogVisible_nin = true"
                >添加项目</el-button
              >
              <!-- -------------------------------------------- -->
              <el-dialog
                title="选择开卡协议"
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
                    <el-table-column type="selection" width="55">
                    </el-table-column>
                    <el-table-column label="模板编号" width="120">
                      <template slot-scope="scope">{{
                        scope.row.date
                      }}</template>
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
                  <el-button @click="dialogVisible = false">取 消</el-button>
                  <el-button type="primary" @click="dialogVisible = false"
                    >确 定</el-button
                  >
                </span>
              </el-dialog>
              <!-- ------------------------------------ -->
            </div>
            <!-- -------------------------------------------------------------------- -->
          </div>
          <div>
            <el-table :data="tableData" style="width: 650px">
              <el-table-column prop="date" label="开卡项内容" width="150">
              </el-table-column>
              <el-table-column prop="name" label="类型" width="175">
              </el-table-column>

              <el-table-column label="操作" width="200px">
                <template slot-scope="scope">
                  <el-button
                    size="mini"
                    @click="handleEdit(scope.$index, scope.row)"
                    >删除</el-button
                  >
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-tab-pane>

        <el-tab-pane>
          <span slot="label"><i class="el-icon-date"></i> 充值规则</span>
          <div>
            <div class="module_thr">
              <div><p>是否可充值:</p></div>
              <div style="margin: 18px 30px">
                <el-radio v-model="dont_pay" label="1">不可续充</el-radio>
              </div>
              <div style="margin: 18px 30px">
                <el-radio v-model="sure_pay" label="1">可充值</el-radio>
              </div>
            </div>
            <div class="module_thr">
              <div style="margin: 0px 10px">
                <p>最低充值金额</p>
              </div>
              <el-input
                style="width: 100px; margin: 10px"
                v-model="eve_low"
              ></el-input>
              <div>
                <p>元</p>
              </div>
            </div>
            <div class="module_thr">
              <div style="margin: 0px 10px">
                <p>最高充值金额</p>
              </div>
              <el-input
                style="width: 100px; margin: 10px"
                v-model="eve_height"
              ></el-input>
              <div>
                <p>元</p>
              </div>
            </div>
          </div>
          <div class="input_base">
            <div>
              <p style="padding: 5px 0 0 0">充值礼包:</p>
            </div>
            <div style="padding: 18px 20px; width: 1200px; font-size: 15px">
              <!-- ----------------------------------------------------------------- -->
              <div style="margin: px 30px">
                <el-button type="text" @click="dialogVisible_nin_gift = true"
                  >添加礼包</el-button
                >
                <!-- -------------------------------------------- -->
                <el-dialog
                  title="选择充值礼包"
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
                      <!-- ------------------------------------------------------------- -->
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
                        <template slot-scope="scope">{{
                          scope.row.date
                        }}</template>
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
                    <el-button @click="dialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="dialogVisible = false"
                      >确 定</el-button
                    >
                  </span>
                </el-dialog>
                <!-- ------------------------------------ -->
              </div>
            </div>
          </div>
          <div>
            <el-table :data="giftpack" style="width: 650px">
              <el-table-column prop="date" label="充值礼包" width="150">
              </el-table-column>
              <el-table-column prop="name" label="适用渠道" width="150">
              </el-table-column>
              <el-table-column prop="name" label="适用门店" width="150">
              </el-table-column>

              <el-table-column label="操作" width="150px">
                <template slot-scope="scope">
                  <el-button
                    size="mini"
                    @click="handleEdit(scope.$index, scope.row)"
                    >删除</el-button
                  >
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-tab-pane>

        <el-tab-pane>
          <span slot="label"><i class="el-icon-date"></i> 升级规则</span>
          <div class="input_base">
            <div>
              <p style="padding: 5px 0 0 0">升级规则设置:</p>
            </div>
            <div style="padding: 18px 20px; width: 1200px; font-size: 15px">
              <!-- --------------------dialog---------------------------------- -->
              <el-button type="text" @click="dialogVisible_rules = true"
                >添加规则</el-button
              >
              <el-dialog
                title="编辑升级规则"
                :visible.sync="dialogVisible_rules"
                width="30%"
                :before-close="handleClose"
              >
                <!-- ----------------------------section o------------------------------ -->
                <div class="geeat_money">
                  <div>
                    <p>充值金额区间</p>
                  </div>
                  <div class="big_mon">
                    <el-input
                      v-model="input_money"
                      placeholder="大于等于"
                    ></el-input>
                  </div>
                  <div>
                    <p>~</p>
                  </div>
                  <div class="big_mon">
                    <el-input
                      v-model="input_money_small"
                      placeholder="小于等于"
                    ></el-input>
                  </div>
                </div>
                <!-- ------------------------------------section tw----------------------->
                <div class="module_name">
                  <div>
                    <p style="padding: 10px 0 0 0; width: 100px">升级卡分类:</p>
                  </div>
                  <div style="padding: 10px 0px; width: 300px">
                    <el-select
                      v-model="value_module"
                      placeholder="请选择"
                      style="padding: 5px 0px; width: 240px"
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
                </div>
                <!-- --------------------------------section thr---------------------------------- -->
                <div class="module_name">
                  <div>
                    <p style="padding: 10px 0 0 0; width: 100px">升级卡类型:</p>
                  </div>
                  <div style="padding: 10px 0px; width: 300px">
                    <el-select
                      v-model="value_module_type"
                      placeholder="请选择"
                      style="padding: 5px 0px; width: 240px"
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
                </div>
                <!-- --------------------------------------------section four--------------------------------- -->
                <div class="stop_witre">
                  <div style="margin: 20px 0">升级卡类编号</div>
                  <div>
                    <el-input
                      placeholder="请输入内容"
                      v-model="input_stop"
                      :disabled="true"
                      style="padding: 10px 20px; width: 280px"
                    >
                    </el-input>
                  </div>
                </div>

                <!-- ----------------------------------------section five------------------------------------- -->
                <div class="use_set">
                  <el-button type="primary">主要按钮</el-button>
                </div>
                <!-- ---------------------------------end----------------- -->
                <span slot="footer" class="dialog-footer">
                  <el-button @click="dialogVisible_rules = false"
                    >取 消</el-button
                  >
                  <el-button type="primary" @click="dialogVisible_rules = false"
                    >确 定</el-button
                  >
                </span>
              </el-dialog>
              <!-- ----------------------------end------------------------------------ -->
            </div>
          </div>
          <div>
            <el-table :data="giftpack" style="width: 650px">
              <el-table-column prop="date" label="充值金额" width="150">
              </el-table-column>
              <el-table-column prop="name" label="升级到" width="150">
              </el-table-column>
              <el-table-column label="操作" width="150px">
                <template slot-scope="scope">
                  <el-button
                    size="mini"
                    @click="handleEdit(scope.$index, scope.row)"
                    >删除</el-button
                  >
                </template>
              </el-table-column>
            </el-table>
          </div>
          <div>
            <div class="module_thr">
              <div><p>充值金额是否可累计:</p></div>
              <div style="margin: 18px 30px">
                <el-radio v-model="y_adds" label="1">不可累计</el-radio>
              </div>
              <div style="margin: 18px 30px">
                <el-radio v-model="n_adds" label="1">可累计</el-radio>
              </div>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
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
  created: {},
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
  },
  watch: {},
  computed: {},
};
</script>

<style scoped>
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
