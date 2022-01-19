<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" v-show="showSearch" :inline="true">
      <el-form-item label="角色名称" prop="roleName">
        <el-input
          v-model="queryParams.roleName"
          placeholder="请输入角色名称"
          clearable
          size="small"
          style="width: 240px"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="权限字符" prop="roleKey">
        <el-input
          v-model="queryParams.roleKey"
          placeholder="请输入权限字符"
          clearable
          size="small"
          style="width: 240px"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select
          v-model="queryParams.status"
          placeholder="角色状态"
          clearable
          size="small"
          style="width: 240px"
        >
          <el-option
            v-for="dict in dict.type.sys_normal_disable"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="创建时间">
        <el-date-picker
          v-model="dateRange"
          size="small"
          style="width: 240px"
          value-format="yyyy-MM-dd"
          type="daterange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        ></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['system:role:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['system:role:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['system:role:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['system:role:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="roleList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="角色编号" prop="roleId" width="120" />
      <el-table-column label="角色名称" prop="roleName" :show-overflow-tooltip="true" width="150" />
      <el-table-column label="权限字符" prop="roleKey" :show-overflow-tooltip="true" width="150" />
      <el-table-column label="显示顺序" prop="roleSort" width="100" />
      <el-table-column label="状态" align="center" width="100">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.status"
            active-value="0"
            inactive-value="1"
            @change="handleStatusChange(scope.row)"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center" prop="createTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
            <span v-if="scope.row.roleId === 1">
              <el-button
                size="mini"
                type="text"
                icon="el-icon-turn-off"
                @click="handleParamScope(scope.row)"
                v-hasRole="['admin']"
              >细节参数权限</el-button>
            </span>
            <span v-else>
              <el-button
                size="mini"
                type="text"
                icon="el-icon-edit"
                @click="handleUpdate(scope.row)"
                v-hasPermi="['system:role:edit']"
              >修改</el-button>
              <el-button
                size="mini"
                type="text"
                icon="el-icon-delete"
                @click="handleDelete(scope.row)"
                v-hasPermi="['system:role:remove']"
              >删除</el-button>
              <el-button
                size="mini"
                type="text" @click="handleDataScope(scope.row)" 
                icon="el-icon-circle-check"
                v-hasPermi="['system:role:edit']"
               >数据权限</el-button>
              <el-button
                size="mini"
                type="text" @click="handleParamScope(scope.row)" 
                icon="el-icon-turn-off"
                v-hasPermi="['system:role:edit']"
               >细节参数权限</el-button>
               <!-- el-button
                size="mini"
                type="text" @click="handleAuthUser(scope.row)" 
                icon="el-icon-user"
                v-hasPermi="['system:role:edit']"
               >分配用户</el-button -->
            </span>
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

    <!-- 添加或修改角色配置对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body :close-on-click-modal="false">
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="form.roleName" @blur="form.roleName=$event.target.value.trim()" placeholder="请输入角色名称" maxlength="30" show-word-limit />
        </el-form-item>
        <el-form-item prop="roleKey">
          <span slot="label">
            <el-tooltip content="控制器中定义的权限字符，如：@PreAuthorize(`@ss.hasRole('admin')`)" placement="top">
              <i class="el-icon-question"></i>
            </el-tooltip>
            权限字符
          </span>
          <el-input v-model.trim="form.roleKey" placeholder="请输入权限字符" maxlength="100" show-word-limit/>
        </el-form-item>
        <el-form-item label="角色顺序" prop="roleSort">
          <el-input-number v-model="form.roleSort" controls-position="right" :min="0" />
        </el-form-item>
        <el-form-item label="状态">
          <el-radio-group v-model="form.status">
            <el-radio
              v-for="dict in dict.type.sys_normal_disable"
              :key="dict.value"
              :label="dict.value"
            >{{dict.label}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="菜单权限">
          <el-checkbox v-model="menuExpand" @change="handleCheckedTreeExpand($event, 'menu')">展开/折叠</el-checkbox>
          <el-checkbox v-model="menuNodeAll" @change="handleCheckedTreeNodeAll($event, 'menu')">全选/全不选</el-checkbox>
          <el-checkbox v-model="form.menuCheckStrictly" @change="handleCheckedTreeConnect($event, 'menu')">父子联动</el-checkbox>
          <el-tree
            class="tree-border"
            :data="menuOptions"
            show-checkbox
            ref="menu"
            node-key="id"
            :check-strictly="!form.menuCheckStrictly"
            empty-text="加载中，请稍后"
            :props="defaultProps"
          ></el-tree>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="form.remark" type="textarea" placeholder="请输入内容" maxlength="300" show-word-limit></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">保 存</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 分配角色数据权限对话框 -->
    <el-dialog :title="title" :visible.sync="openDataScope" width="500px" append-to-body :close-on-click-modal="false">
      <el-form :model="form" label-width="80px">
        <el-form-item label="角色名称">
          <el-input v-model="form.roleName" :disabled="true" />
        </el-form-item>
        <el-form-item label="权限字符">
          <el-input v-model="form.roleKey" :disabled="true" />
        </el-form-item>
        <el-form-item label="权限范围">
          <el-select v-model="form.dataScope" @change="dataScopeSelectChange">
            <el-option
              v-for="item in dataScopeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="数据权限" v-show="form.dataScope == 2">
          <el-checkbox v-model="deptExpand" @change="handleCheckedTreeExpand($event, 'dept')">展开/折叠</el-checkbox>
          <el-checkbox v-model="deptNodeAll" @change="handleCheckedTreeNodeAll($event, 'dept')">全选/全不选</el-checkbox>
          <el-checkbox v-model="form.deptCheckStrictly" @change="handleCheckedTreeConnect($event, 'dept')">父子联动</el-checkbox>
          <el-tree
            class="tree-border"
            :data="deptOptions"
            show-checkbox
            default-expand-all
            ref="dept"
            node-key="id"
            :check-strictly="!form.deptCheckStrictly"
            empty-text="加载中，请稍后"
            :props="defaultProps"
          ></el-tree>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitDataScope">保 存</el-button>
        <el-button @click="cancelDataScope">取 消</el-button>
      </div>
    </el-dialog>
    
    <!-- 分配角色细节参数权限对话框 -->
    <el-dialog :title="title" :visible.sync="openParamScope" width="66%" :close-on-click-modal="false" append-to-body>
      <el-form ref="paramForm">
      <span v-if="this.form.roleId===1"><i class="el-icon-warning" style="color:#e6a23c;"></i> 请给 <el-tag>超级管理员</el-tag> 角色分配“最大”权限，用于实现右边 <el-tag>全部赋予最大权限</el-tag> 按钮功能！</span>
      <el-button type="primary" size="mini" round style="float:right;margin: 0 5px 5px 0;" @click="handleChkAll">全部赋予最大权限</el-button>
      <el-table :data="paramList" highlight-current-row border :show-header="false" :span-method="objectSpanMethod" max-height="600">
        <el-table-column type="index" width="40"></el-table-column>
        <el-table-column property="system" :formatter="systemFormat" label="系统" align="center" width="150">
          <!-- template slot-scope="scope">
            <span v-if="scope.row.system == '0'">
                <el-checkbox :label="0" :key="0">通用参数</el-checkbox>
            </span>
            <span v-else-if="scope.row.system == '1'">
                <el-checkbox :label="1" :key="1">总部端</el-checkbox>
            </span>
            <span v-else-if="scope.row.system == '2'">
                <el-checkbox :label="2" :key="2">员工端</el-checkbox>
            </span>
            <span v-else-if="scope.row.system == '3'">
                <el-checkbox :label="3" :key="3">收银端</el-checkbox>
            </span>
          </template -->
        </el-table-column>
        <el-table-column property="moduleName" label="业务模块" align="center" width="200">
          <!-- template slot-scope="scope">
            <el-checkbox :label="scope.row.module" :key="scope.row.module" :id="'chk'+scope.row.module+'_'+scope.row.system" v-model="'chk'+scope.row.module+'_'+scope.row.system" @change="handleChkModule">{{scope.row.moduleName}}</el-checkbox>
          </template -->
        </el-table-column>
        <el-table-column property="fieldName" label="业务项" header-align="center">
            <template slot-scope="scope">
                <el-checkbox label="" :key="scope.row.paramId" :name="'chk'+scope.row.module" @change="handleChkParam" v-model="scope.row.status" true-label="0" false-label="1"></el-checkbox>&nbsp;
                <el-tooltip v-if="scope.row.remark" :content="scope.row.remark" placement="top">
                  <i class="el-icon-question"></i>
                </el-tooltip>
                {{scope.row.fieldName}}
                <span v-for="fi in scope.row.fieldTypeList">
                    <span v-if="fi.type == 'el-switch'">
                        <el-switch v-model="fi.val" active-value="1" inactive-value="0" :name="scope.row.id.toString()"></el-switch>
                    </span>
                    <span v-else-if="fi.type == 'el-checkbox-group'">
                        <el-checkbox-group v-model="fi.val" :name="scope.row.id.toString()">
                            <span v-if="fi.dict">
                              <el-checkbox v-for="dict in fi.dict" :label="dict.dictValue" :key="dict.dictValue">{{dict.dictLabel}}</el-checkbox>
                            </span>
                        </el-checkbox-group>
                    </span>
                    <span v-else-if="fi.type == 'el-input-number'">
                        <el-input-number v-model="fi.val" :precision="fi.precision" :min="fi.min" :max="fi.max" :step="fi.step" :name="scope.row.id.toString()" size="small"></el-input-number>
                         <span v-if="fi.slot_append">{{fi.slot_append}}</span>
                    </span>
                    <span v-else-if="fi.type == 'el-select'">
                        <el-select v-model="fi.val" clearable size="small" :name="scope.row.id.toString()">
                          <span v-if="fi.dict">
                            <el-option v-for="dict in fi.dict"
                                :key="dict.dictValue"
                                :label="dict.dictLabel"
                                :value="dict.dictValue"/>
                          </span>
                        </el-select>
                    </span>
                </span>
            </template>
        </el-table-column>
      </el-table>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitParamScope">保存</el-button>
        <el-button @click="cancelParamScope">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listRole, getRole, delRole, addRole, updateRole, dataScope, changeRoleStatus } from "@/api/system/role";
import { treeselect as menuTreeselect, roleMenuTreeselect } from "@/api/system/menu";
import { treeselect as deptTreeselect, roleDeptTreeselect } from "@/api/system/dept";
import { listParam4Role as listParam, addRoleParam } from "@/api/system/param";

export default {
  name: "Role",
  dicts: ['sys_normal_disable'],
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 角色表格数据
      roleList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 是否显示弹出层（数据权限）
      openDataScope: false,
      menuExpand: false,
      menuNodeAll: false,
      deptExpand: true,
      deptNodeAll: false,
      // 日期范围
      dateRange: [],
      // 数据范围选项
      dataScopeOptions: [
        {
          value: "1",
          label: "全部数据权限"
        },
        {
          value: "2",
          label: "自定数据权限"
        },
        {
          value: "3",
          label: "本部门数据权限"
        },
        {
          value: "4",
          label: "本部门及以下数据权限"
        }/*,
        {
          value: "5",
          label: "仅本人数据权限"
        }*/
      ],
      // 是否显示弹出层（细节参数权限）
      openParamScope: false,
      // 角色细节参数表格数据
      paramList: [],
      spanArr: [],//用于存放每一行记录的合并数
      spanArrModule: [],
      pos:0,
      posModule:0,
      // 复选框全选参数
      systemMap: new Map(),
      moduleMap: new Map(),
      systemArr: [],
      moduleArr: [],
      // 菜单列表
      menuOptions: [],
      // 部门列表
      deptOptions: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        roleName: undefined,
        roleKey: undefined,
        status: undefined
      },
      // 表单参数
      form: {},
      defaultProps: {
        children: "children",
        label: "label"
      },
      // 表单校验
      rules: {
        roleName: [
          { required: true, message: "角色名称不能为空", trigger: "blur" }
        ],
        roleKey: [
          { required: true, message: "权限字符不能为空", trigger: "blur" }
        ],
        roleSort: [
          { required: true, message: "角色顺序不能为空", trigger: "blur" }
        ]
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    getSpanArr(data) {
      for (var i = 0; i < data.length; i++) {
        if (i === 0) {
          this.spanArr.push(1);
          this.pos = 0;
          
          this.spanArrModule.push(1);
          this.posModule = 0;
          this.systemMap.set('chk'+data[i].system, 1);
          this.moduleMap.set('chk'+data[i].module, 1);
          this.systemArr.push('chk'+data[i].system);
          this.moduleArr.push('chk'+data[i].module);
        } else {
          // 判断当前元素与上一个元素是否相同
          if (data[i].system === data[i - 1].system) {
            this.spanArr[this.pos] += 1;
            this.spanArr.push(0);
          } else {
            this.spanArr.push(1);
            this.pos = i;
            this.systemMap.set('chk'+data[i].system, 0);
          }
          
          if (data[i].module === data[i - 1].module) {
            this.spanArrModule[this.posModule] += 1;
            this.spanArrModule.push(0);
            this.moduleMap.set('chk'+data[i].module, this.moduleMap.get('chk'+data[i].module) + 1);
          } else {
            this.spanArrModule.push(1);
            this.posModule = i;
            this.moduleMap.set('chk'+data[i].module, 1);
            this.systemMap.set('chk'+data[i].system, this.systemMap.get('chk'+data[i].system) + 1);
            this.moduleArr.push('chk'+data[i].module);
          }
        }
      }
    },
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 1) {//第二列（系统）合并
        const _row = this.spanArr[rowIndex];
        const _col = _row > 0 ? 1 : 0;
        //console.log(`rowspan:${_row} colspan:${_col}`);
        return {
          // [0,0] 表示这一行不显示， [2,1]表示行的合并数
          rowspan: _row,
          colspan: _col
        };
      }
      
      if (columnIndex === 2) {//第三列（业务模块）合并
        const _row = this.spanArrModule[rowIndex];
        const _col = _row > 0 ? 1 : 0;
        return {
          // [0,0] 表示这一行不显示， [2,1]表示行的合并数
          rowspan: _row,
          colspan: _col
        };
      }
    },
    handleChkModule(val){
      //console.error(this.systemMap.get('1'));
    },
    handleChkParam(val){
      var tempMap = this.moduleMap;
      this.moduleArr.forEach(function(val,index,arr){
          console.log(val);
          var inputs = document.getElementsByName(val);
            var checked_counts = 0;
            for(var i=0;i<inputs.length;i++){
              if(inputs[i].checked){
                checked_counts++;
              }
            } 
            if(checked_counts == tempMap.get(val)) {
              console.log('---全选中' + val);
              //document.getElementById('chkcommon_0').checked=true;
            } 
        });
    },
    /** 查询角色列表 */
    getList() {
      this.loading = true;
      listRole(this.addDateRange(this.queryParams, this.dateRange)).then(
        response => {
          this.roleList = response.rows;
          this.total = response.total;
          this.loading = false;
        }
      );
    },
    /** 查询菜单树结构 */
    getMenuTreeselect() {
      menuTreeselect().then(response => {
        this.menuOptions = response.data;
      });
    },
    /** 查询部门树结构 */
    getDeptTreeselect() {
      deptTreeselect().then(response => {
        this.deptOptions = response.data;
      });
    },
    // 所有菜单节点数据
    getMenuAllCheckedKeys() {
      // 目前被选中的菜单节点
      let checkedKeys = this.$refs.menu.getCheckedKeys();
      // 半选中的菜单节点
      let halfCheckedKeys = this.$refs.menu.getHalfCheckedKeys();
      checkedKeys.unshift.apply(checkedKeys, halfCheckedKeys);
      return checkedKeys;
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
    /** 根据角色ID查询菜单树结构 */
    getRoleMenuTreeselect(roleId) {
      return roleMenuTreeselect(roleId).then(response => {
        this.menuOptions = response.menus;
        return response;
      });
    },
    /** 根据角色ID查询部门树结构 */
    getRoleDeptTreeselect(roleId) {
      return roleDeptTreeselect(roleId).then(response => {
        this.deptOptions = response.depts;
        return response;
      });
    },
    // 角色状态修改
    handleStatusChange(row) {
      let text = row.status === "0" ? "启用" : "停用";
      this.$modal.confirm('确认要"' + text + '""' + row.roleName + '"角色吗？').then(function() {
        return changeRoleStatus(row.roleId, row.status);
      }).then(() => {
        this.$modal.msgSuccess(text + "成功");
      }).catch(function() {
        row.status = row.status === "0" ? "1" : "0";
      });
    },
    // 全部赋予最大权限 按钮
    handleChkAll() {
      const roleId = this.form.roleId;
      const loading = this.$loading({
          lock: true,
          //text: 'Loading',
          //spinner: 'el-icon-loading',
          background: 'rgba(205, 205, 205, 0.7)'
        });
      listParam(1).then(response => {
        this.reset();
        this.paramList = response.rows;
        this.form = response.rows;
        this.form.roleId = roleId;
        this.getSpanArr(this.paramList);
        loading.close();
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 取消按钮（数据权限）
    cancelDataScope() {
      this.openDataScope = false;
      this.reset();
    },
    // 取消按钮（细节参数权限）
    cancelParamScope() {
      this.openParamScope = false;
      this.reset();
    },
    // 表单重置
    reset() {
      if (this.$refs.menu != undefined) {
        this.$refs.menu.setCheckedKeys([]);
      }
      this.menuExpand = false,
      this.menuNodeAll = false,
      this.deptExpand = true,
      this.deptNodeAll = false,
      this.form = {
        roleId: undefined,
        roleName: undefined,
        roleKey: undefined,
        roleSort: 0,
        status: "0",
        menuIds: [],
        deptIds: [],
        menuCheckStrictly: true,
        deptCheckStrictly: true,
        remark: undefined
      },
      this.spanArr = [],//用于存放每一行记录的合并数
      this.spanArrModule = [],
      this.pos = 0,
      this.posModule = 0,
      this.systemMap = new Map(),
      this.moduleMap = new Map(),
      this.systemArr = [],
      this.moduleArr = [],
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.dateRange = [];
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.roleId)
      this.single = selection.length!=1
      this.multiple = !selection.length
    },
    // 树权限（展开/折叠）
    handleCheckedTreeExpand(value, type) {
      if (type == 'menu') {
        let treeList = this.menuOptions;
        for (let i = 0; i < treeList.length; i++) {
          this.$refs.menu.store.nodesMap[treeList[i].id].expanded = value;
        }
      } else if (type == 'dept') {
        let treeList = this.deptOptions;
        for (let i = 0; i < treeList.length; i++) {
          this.$refs.dept.store.nodesMap[treeList[i].id].expanded = value;
        }
      }
    },
    // 树权限（全选/全不选）
    handleCheckedTreeNodeAll(value, type) {
      if (type == 'menu') {
        this.$refs.menu.setCheckedNodes(value ? this.menuOptions: []);
      } else if (type == 'dept') {
        this.$refs.dept.setCheckedNodes(value ? this.deptOptions: []);
      }
    },
    // 树权限（父子联动）
    handleCheckedTreeConnect(value, type) {
      if (type == 'menu') {
        this.form.menuCheckStrictly = value ? true: false;
      } else if (type == 'dept') {
        this.form.deptCheckStrictly = value ? true: false;
      }
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.getMenuTreeselect();
      this.open = true;
      this.title = "添加角色";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const roleId = row.roleId || this.ids
      const roleMenu = this.getRoleMenuTreeselect(roleId);
      getRole(roleId).then(response => {
        this.form = response.data;
        this.open = true;
        this.$nextTick(() => {
          roleMenu.then(res => {
            let checkedKeys = res.checkedKeys
            checkedKeys.forEach((v) => {
                this.$nextTick(()=>{
                    this.$refs.menu.setChecked(v, true ,false);
                })
            })
          });
        });
        this.title = "修改角色";
      });
    },
    /** 选择角色权限范围触发 */
    dataScopeSelectChange(value) {
      if(value !== '2') {
        this.$refs.dept.setCheckedKeys([]);
      }
    },
    /** 分配数据权限操作 */
    handleDataScope(row) {
      this.reset();
      const roleDeptTreeselect = this.getRoleDeptTreeselect(row.roleId);
      getRole(row.roleId).then(response => {
        this.form = response.data;
        this.openDataScope = true;
        this.$nextTick(() => {
          roleDeptTreeselect.then(res => {
            this.$refs.dept.setCheckedKeys(res.checkedKeys);
          });
        });
        this.title = "分配数据权限";
      });
    },
    /** 分配细节参数权限操作 */
    handleParamScope(row) {
      this.reset();
      const loading = this.$loading({
          lock: true,
          //text: 'Loading',
          //spinner: 'el-icon-loading',
          background: 'rgba(205, 205, 205, 0.7)'
        });
      listParam(row.roleId).then(response => {
        this.paramList = response.rows;
        this.form = response.rows;
        this.form.roleId = row.roleId;
        this.getSpanArr(this.paramList);
        this.openParamScope = true;
        this.title = "分配细节参数权限";
        loading.close();
      });
    },
    // 所属系统翻译
    systemFormat(row, column) {
      if(row.system == '0') {
        return '通用参数';
      } else if(row.system == '1') {
        return '总部端';
      } else if(row.system == '2') {
        return '员工端';
      } else if(row.system == '3') {
        return '收银端';
      } 
    },
    /** 分配用户操作 */
    handleAuthUser: function(row) {
      const roleId = row.roleId;
      this.$router.push("/system/role-auth/user/" + roleId);
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.roleId != undefined) {
            this.form.menuIds = this.getMenuAllCheckedKeys();
            updateRole(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            this.form.menuIds = this.getMenuAllCheckedKeys();
            addRole(this.form).then(response => {
              this.$modal.msgSuccess("新增成功");
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
    /** 提交按钮（数据权限） */
    submitDataScope: function() {
      if (this.form.roleId != undefined) {
        this.form.deptIds = this.getDeptAllCheckedKeys();
        dataScope(this.form).then(response => {
          this.$modal.msgSuccess("修改成功");
          this.openDataScope = false;
          this.getList();
        });
      }
    },
    /** 提交按钮（细节参数权限） */
    submitParamScope: function() {
      //console.error(this.form);
      if (this.form.roleId != undefined) {
        addRoleParam(this.form.roleId, this.form).then(response => {
          this.msgSuccess("修改成功");
          this.openParamScope = false;
          this.getList();
        });
      }
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const roleIds = row.roleId || this.ids;
      this.$modal.confirm('是否确认删除角色编号为"' + roleIds + '"的数据项？').then(function() {
        return delRole(roleIds);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('system/role/export', {
        ...this.queryParams
      }, `role_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>