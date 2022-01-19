<template>
  <div class="app-container" v-loading="loading">
    <el-card class="mb-22">
      <div slot="header" class="clearfix">
        <span>方案设置</span>
      </div>
      <el-form
        :model="baseForm"
        :rules="rules"
        ref="baseForm"
        :inline="true"
        label-width="100px"
      >
        <el-row :gutter="40">
          <el-col :span="20">
            <el-form-item label="方案名称" prop="name">
              <el-input
                v-model="baseForm.name"
                placeholder="请输入方案名称"
                clearable
                size="small"
                maxlength="100"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="40">
          <el-col :span="20">
            <el-form-item label="部门" prop="deptCodes">
              <el-select
                v-model="baseForm.deptCodes"
                placeholder="请选择部门"
                clearable
                multiple
                :multiple-limit="1"
                size="small"
                @change="deptSelectChange"
              >
                <el-option
                  v-for="dictItem in dict.type.sys_dept_group"
                  :key="dictItem.value"
                  :label="dictItem.label"
                  :value="dictItem.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="40">
          <el-col :span="20">
            <el-form-item label="岗位" prop="postIds">
              <el-select
                v-model="baseForm.postIds"
                placeholder="请选择岗位"
                clearable
                multiple
                size="small"
              >
                <el-option
                  v-for="dictItem in postOptions"
                  :key="dictItem.postId"
                  :label="dictItem.postName"
                  :value="dictItem.postId"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row type="flex" justify="end" class="page-footer">
          <el-col :span="6" class="text-align-right">
            <el-button @click="cancel">取 消</el-button>
            <el-button type="primary" @click="submitForm">提交</el-button>
          </el-col>
        </el-row>
      </el-form>
    </el-card>
    <el-card class="mb-22">
      <el-tabs v-model="activeName" @tab-click="handleSelect" ref="tab">
        <el-tab-pane
          :label="item.name"
          :name="item.id"
          :key="item.id"
          v-for="item in menuList"
        ></el-tab-pane>
      </el-tabs>
      <template v-if="activeName === '1'">
        <ServiceCategoryComponent
          :schemeId="baseForm.id"
          :deptId="userInfo.deptId"
        />
      </template>
      <template v-if="activeName === '2'">
        <ServiceComponent :schemeId="baseForm.id" :deptId="userInfo.deptId" />
      </template>
      <template v-if="activeName === '3'">
        <GoodsCategoryComponent
          :schemeId="baseForm.id"
          :deptId="userInfo.deptId"
        />
      </template>
      <template v-if="activeName === '4'">
        <GoodsComponent :schemeId="baseForm.id" :deptId="userInfo.deptId" />
      </template>
      <template v-if="activeName === '5'">
        <PackCategoryComponent
          :schemeId="baseForm.id"
          :deptId="userInfo.deptId"
        />
      </template>
      <template v-if="activeName === '6'">
        <PackComponent :schemeId="baseForm.id" :deptId="userInfo.deptId" />
      </template>
      <template v-if="activeName === '7'">
        <CardCategoryComponent
          :schemeId="baseForm.id"
          :deptId="userInfo.deptId"
        />
      </template>
      <template v-if="activeName === '8'">
        <CardComponent :schemeId="baseForm.id" :deptId="userInfo.deptId" />
      </template>
    </el-card>
  </div>
</template>
<script>
import ServiceCategoryComponent from "@/views/store/commission/main/components/ServiceCategory.vue";
import ServiceComponent from "@/views/store/commission/main/components/Service.vue";
import CardCategoryComponent from "@/views/store/commission/main/components/CardCategory.vue";
import CardComponent from "@/views/store/commission/main/components/Card.vue";
import GoodsCategoryComponent from "@/views/store/commission/main/components/ProductCategory.vue";
import GoodsComponent from "@/views/store/commission/main/components/Product.vue";
import PackCategoryComponent from "@/views/store/commission/main/components/PackCategory.vue";
import PackComponent from "@/views/store/commission/main/components/Pack.vue";

import { listPostByDept } from "@/api/system/post";
import {
  addCommissionMainInfo,
  getCommissionMainInfo,
} from "@/api/store/commission/index";
import { getUserProfile } from "@/api/system/user";

import _ from "lodash";

export default {
  name: "CommissionAdd",
  dicts: ["sys_dept_group"],
  components: {
    ServiceCategoryComponent,
    ServiceComponent,
    CardCategoryComponent,
    CardComponent,
    GoodsCategoryComponent,
    GoodsComponent,
    PackCategoryComponent,
    PackComponent,
  },
  data() {
    return {
      loading: false,
      activeName: "1",
      menuList: [
        {
          id: "1",
          name: "服务分类提成",
        },
        {
          id: "2",
          name: "服务提成",
        },
        {
          id: "3",
          name: "产品类别提成",
        },
        {
          id: "4",
          name: "产品提成",
        },
        {
          id: "5",
          name: "套餐类别提成",
        },
        {
          id: "6",
          name: "套餐提成",
        },
        {
          id: "7",
          name: "售卡类别提成",
        },
        {
          id: "8",
          name: "售卡提成",
        },
      ],
      postOptions: [],
      baseForm: {
        id: null,
        name: "",
        deptCodes: [],
        postIds: [],
      },
      rules: {
        name: [
          {
            required: true,
            message: "请输入方案名称",
            trigger: "blur",
          },
        ],
        deptCodes: [
          {
            required: true,
            type: "array",
            message: "请选择部门",
            trigger: "change",
          },
        ],
        postIds: [
          {
            required: true,
            type: "array",
            message: "请选择岗位",
            trigger: "change",
          },
        ],
      },
      userInfo: {},
    };
  },
  created() {
    const { id } = this.$route.query;
    this.baseForm.id = id || null;

    if (id) {
      this.getCommissionMainInfo();
    }

    this.getUser();
  },
  methods: {
    getCommissionMainInfo() {
      this.loading = true;
      getCommissionMainInfo(this.baseForm.id)
        .then((res) => {
          this.baseForm = _.pick(res.data, _.keys(this.baseForm));
          this.deptSelectChange(this.baseForm.deptCodes);
        })
        .finally(() => {
          this.loading = false;
        });
    },
    handleSelect() {},
    submitForm() {
      this.$refs["baseForm"].validate((valid) => {
        if (valid) {
          let payload = _.assign(
            {
              deptId: this.userInfo.deptId,
            },
            this.baseForm
          );

          addCommissionMainInfo(payload).then((res) => {
            const { id } = res.data;
            this.baseForm.id = id;
            this.msgSuccess("提交成功");
          });
        }
      });
    },
    cancel() {},
    deptSelectChange(depts) {
      if (!depts || !_.isArray(depts)) {
        return;
      }

      const actions = _.map(depts, (d) => {
        return this.getPostOptions(d);
      });

      Promise.all(actions).then((res) => {
        this.postOptions = _.flatten(res);

        // 清空下拉选项已删除的值
        this.baseForm.postIds = _.filter(this.baseForm.postIds, (id) => {
          const index = _.findIndex(
            this.postOptions,
            (item) => item.postId === id
          );

          return index > -1;
        });
      });
    },
    /** 根据部门查询职位列表 */
    getPostOptions(d) {
      if (d) {
        return listPostByDept(d).then((response) => {
          return response.data;
        });
      }

      return Promise.reject("请先选择部门");
    },
    getUser() {
      getUserProfile().then((response) => {
        this.userInfo = response.data;
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.mb-22 {
  margin-bottom: 22px;
}

.page-footer {
  background: #fff;
  margin-top: 20px;
}

.text-align-right {
  text-align: right;
}
</style>
