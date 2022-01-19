<template>
  <el-dialog
    title="提示"
    :visible.sync="dialogVisible"
    :before-close="handleClose"
  >
    <div slot="title" class="dialog-head">
      <div><svg-icon icon-class="ring" class-name="ring-icon" /> 权益配置</div>
    </div>
    <div class="set-privilege-container">
      <div class="head"><label>*</label>权益设置：<el-button type="primary" size="mini" icon="el-icon-plus" @click="handleAdd">添加权益</el-button></div>
      <div class="table-wrapper">
        <el-table
          :data="tableData"
          border
          style="width: 100%">
          <el-table-column
            prop="date"
            label="权益名称"
            width="150">
          </el-table-column>
          <el-table-column
            prop="name"
            label="权益图标"
            width="120">
          </el-table-column>
          <el-table-column
            prop="province"
            label="权益类型"
            width="120">
          </el-table-column>
          <el-table-column
            prop="city"
            label="是否可购买">
          </el-table-column>
          <el-table-column
            prop="address"
            label="售价">
          </el-table-column>
          <el-table-column
            prop="zip"
            label="领取限制"
            width="120">
          </el-table-column>
          <el-table-column
            prop="zip"
            label="状态">
          </el-table-column>
          <el-table-column
            fixed="right"
            label="操作"
            width="100">
            <template slot-scope="scope">
              <el-button @click="handleClick(scope.row)" type="text" size="small">查看</el-button>
              <el-button type="text" size="small">编辑</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="dialogVisible = false" size="mini">保存</el-button>
    </div>
  </el-dialog>
</template>
<script>
  export default {
    props: {

    },
    data() {
      return {
        dialogVisible: false,
        tableData: [{
          date: '2016-05-02',
          name: '王小虎',
          province: '上海',
          city: '普陀区',
          address: '上海市普陀区金沙江路 1518 弄',
          zip: 200333
        }]
      };
    },
    methods: {
      handleClick(row) {
        console.log(row);
      },
      handleClose() {
        this.$confirm('确认关闭？')
          .then(_ => {
            this.closeDialogEimt()
          })
      },
      handleAdd() {

      },
      showDialog() {
        this.dialogVisible = true;
      },
      closeDialogEimt() {
        this.dialogVisible = false;
        this.$emit('closeDialog')
      },
    }
  };
</script>
<style lang="scss">
.set-privilege-container {
  .head  {
    display: flex;
    margin-top: -20px;
    margin-bottom: 20px;
    align-items: center;
    font-size: 12px;
    label {
      color: #ff4949;
    }
  }
  .table-wrapper {
    margin-left: 65px;
  }
}
</style>
