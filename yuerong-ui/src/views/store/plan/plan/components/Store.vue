<template>
  <div class="app-container">
    <el-checkbox
      v-model="deptExpand"
      @change="handleCheckedTreeExpand($event, 'dept')"
      >展开/折叠</el-checkbox
    >
    <el-checkbox
      v-model="deptNodeAll"
      @change="handleCheckedTreeNodeAll($event, 'dept')"
      >全选/全不选</el-checkbox
    >
    <el-checkbox v-model="storeForm.deptCheckStrictly" disabled
      >父子联动</el-checkbox
    >
    <el-tree
      class="tree-border"
      :data="deptOptions"
      show-checkbox
      ref="dept"
      node-key="id"
      :check-strictly="!storeForm.deptCheckStrictly"
      empty-text="加载中，请稍后"
      :props="defaultProps"
      :default-expand-all="true"
    ></el-tree>

    <el-row type="flex" justify="end" class="page-footer">
      <el-col :span="6" class="text-align-right">
        <el-button @click="cancel" :loading="saving">取 消</el-button>
        <el-button type="primary" @click="submitForm" :loading="saving"
          >提交</el-button
        >
      </el-col>
    </el-row>
  </div>
</template>
<script>
import { treeselect as deptTreeselect } from "@/api/system/dept";
import { getPlanDeptList, addPlanDeptInfo } from "@/api/store/plan";

export default {
  props: ["id"],
  data() {
    return {
      saving: false,
      deptExpand: true,
      deptNodeAll: false,
      // 表单参数
      storeForm: {
        deptCheckStrictly: true,
        storePlanId: null,
      },
      // 部门列表
      deptOptions: [],
      defaultProps: {
        children: "children",
        label: "label",
      },
    };
  },
  mounted() {
    const { id } = this.$route.query;
    this.storeForm.storePlanId = id || this.id || null;
    if (!!id) {
      this.getPlanStoreList(id);
    } else {
      this.getDeptTreeselect();
    }
  },
  methods: {
    getPlanStoreList(id) {
      if (!id) {
        return;
      }

      getPlanDeptList(id).then((res) => {
        console.log(res);
        const { depts, checkedKeys } = res.data || {};

        this.deptOptions = depts || [];

        this.$refs.dept.setCheckedKeys(checkedKeys);
      });
    },
    /** 查询部门树结构 */
    getDeptTreeselect() {
      deptTreeselect().then((response) => {
        this.deptOptions = response.data;
      });
    },
    // 树权限（展开/折叠）
    handleCheckedTreeExpand(value, type) {
      if (type == "menu") {
        let treeList = this.menuOptions;
        for (let i = 0; i < treeList.length; i++) {
          this.$refs.menu.store.nodesMap[treeList[i].id].expanded = value;
        }
      } else if (type == "dept") {
        let treeList = this.deptOptions;
        for (let i = 0; i < treeList.length; i++) {
          this.$refs.dept.store.nodesMap[treeList[i].id].expanded = value;
        }
      }
    },
    // 树权限（全选/全不选）
    handleCheckedTreeNodeAll(value, type) {
      if (type == "menu") {
        this.$refs.menu.setCheckedNodes(value ? this.menuOptions : []);
      } else if (type == "dept") {
        this.$refs.dept.setCheckedNodes(value ? this.deptOptions : []);
      }
    },
    // 树权限（父子联动）
    handleCheckedTreeConnect(value, type) {
      if (type == "menu") {
        this.storeForm.menuCheckStrictly = value ? true : false;
      } else if (type == "dept") {
        this.storeForm.deptCheckStrictly = value ? true : false;
      }
    },
    // 所有部门节点数据
    getDeptAllCheckedKeys() {
      // 目前被选中的部门节点
      let checkedKeys = this.$refs.dept.getCheckedKeys();
      // 半选中的部门节点
      let halfCheckedKeys = this.$refs.dept.getHalfCheckedKeys();
      checkedKeys.unshift.apply(checkedKeys, halfCheckedKeys);
      return checkedKeys;
    },
    getCheckedKeys() {
      return this.$refs.dept.getCheckedKeys();
    },
    cancel() {
      this.$router.push("/store/plan/plan");
    },
    submitForm() {
      const checkDeptIDList = this.getCheckedKeys();
      if (!this.storeForm.storePlanId) {
        return;
      }

      this.saving = true;
      addPlanDeptInfo({
        deptIds: checkDeptIDList || [],
        storePlanId: this.storeForm.storePlanId,
      })
        .then(() => {
          this.msgSuccess("更新成功");
        })
        .finally(() => {
          this.saving = false;
        });
    },
  },
};
</script>
<style lang="scss" scoped>
.page-footer {
  background: #fff;
  margin-top: 20px;
}

.text-align-right {
  text-align: right;
}
</style>
