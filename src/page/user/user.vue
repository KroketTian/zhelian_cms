<template>
    <div class="autjorization">
        <div class="ctrl-block">
            <!-- <div class="search-block">
                <el-form :inline="true" :model="searchForm" class="demo-form-inline">
                    <el-form-item label="关键词">
                        <el-input v-model="searchForm.keyword" placeholder="关键词" size="mini"></el-input>
                    </el-form-item>
                    <el-form-item v-for="dataDemo in showInSearchDemo" :key="dataDemo.name" :label="dataDemo.tableTitleName">
                        <el-input v-model="searchForm[dataDemo.name]" :placeholder="dataDemo.tableTitleName" size="mini"></el-input>
                    </el-form-item>
                </el-form>
            </div> -->
            <div class="ctrl-btns">
                <el-button type="primary" @click="currentPage = 0 ;getTableData()" size="mini">刷新</el-button>
                <el-button type="primary" size="mini" @click="openAddTable">添加</el-button>
            </div>
        </div>
        <div class="content-block">
            <el-table :data="tableData" border style="width: 100%">
                <el-table-column v-for="dataDemo in showInTableDemo" :key="dataDemo.name" v-show="dataDemo.isShowInTable" :prop="dataDemo.name" :label="dataDemo.tableTitleName"></el-table-column>
                <!-- <el-table-column label="角色">
                    <template slot-scope="scope">
                        <div v-for="role in scope.row.roles" :key="role.id">{{ role.description }}</div>
                    </template>
                </el-table-column> -->
                <el-table-column label="状态">
                    <template slot-scope="scope">
                        <span v-if="scope.row.status == '1'">启用</span>
                        <span v-if="scope.row.status == '0'">禁用</span>
                        <span v-if="scope.row.status == '2'">删除</span>
                    </template>
                </el-table-column>
                <el-table-column label="是否超级管理员">
                    <template slot-scope="scope">
                        <el-switch v-model="scope.row.is_admin" disabled></el-switch>
                    </template>
                </el-table-column>
                <el-table-column label="权限列表">
                    <template slot-scope="scope">
                        <el-checkbox-group v-model="scope.row.authSelectList">
                            <el-checkbox label="cms_user_group" disabled>部门管理</el-checkbox>
                            <el-checkbox label="cms_user" disabled>用户管理</el-checkbox>
                            <el-checkbox label="cms_images" disabled>图片管理</el-checkbox>
                            <el-checkbox label="cms_descript" disabled>文字管理</el-checkbox>
                            <el-checkbox label="cms_branch_type" disabled>网点分类</el-checkbox>
                            <el-checkbox label="cms_branch" disabled>网点管理</el-checkbox>
                            <el-checkbox label="driver" disabled>司机</el-checkbox>
                            <el-checkbox label="driver_loca" disabled>司机打卡</el-checkbox>
                        </el-checkbox-group>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="150">
                    <template slot-scope="scope">
                        <el-button type="primary" size="mini" @click="openDetailTable(scope.row.id)">详情</el-button>
                        <el-button type="primary" size="mini" @click="openDelet(scope.row.id)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination-bar">
                <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                    :current-page="currentPage+1" :page-sizes="[5, 10, 50, 100]" :page-size="pageSize"
                    layout="total, sizes, prev, pager, next, jumper" :total="totalData">
                </el-pagination>
            </div>
        </div>
        <!-- 弹窗 -->
        <!-- 添加 -->
        <el-dialog :title="addDialogTitle" :visible.sync="addDialogVisible" :close-on-click-modal="false">
            <el-form :model="addForm">
                <el-form-item v-for="dataDemo in showInAddDialogDemo" :key="dataDemo.name" :label="dataDemo.tableTitleName" :label-width="addDialogLabelWidth">
                    <el-input v-model="addForm[dataDemo.name]" autocomplete="off" :disabled="!isEditing"></el-input>
                </el-form-item>
                <el-form-item label="密码" :label-width="addDialogLabelWidth">
                    <el-input v-model="addForm.password" autocomplete="off" :disabled="!isEditing" show-password  placeholder="不填写则不修改密码"></el-input>
                </el-form-item>
                <el-form-item label="部门" :label-width="addDialogLabelWidth">
                    <el-select v-model="addForm.group_id" :disabled="!isEditing" placeholder="请选择" >
                        <el-option
                            v-for="group in groupData"
                            :key="group.id"
                            :label="group.name"
                            :value="group.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="是否是超级管理员" :label-width="addDialogLabelWidth">
                    <el-switch v-model="addForm.is_admin" :disabled="!isEditing"></el-switch>
                </el-form-item>
                <el-form-item label="状态" :label-width="addDialogLabelWidth">
                    <el-radio-group v-model="addForm.status">
                      <el-radio :label="'1'" :disabled="!isEditing">启用</el-radio>
                      <el-radio :label="'0'" :disabled="!isEditing">禁用</el-radio>
                      <!-- <el-radio :label="'2'" :disabled="!isEditing">删除</el-radio> -->
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="权限列表" :label-width="addDialogLabelWidth">
                    <el-checkbox-group v-model="addForm.authSelectList">
                        <el-checkbox :disabled="!isEditing" label="cms_user_group">部门管理</el-checkbox>
                        <el-checkbox :disabled="!isEditing" label="cms_user">用户管理</el-checkbox>
                        <el-checkbox :disabled="!isEditing" label="cms_images">图片管理</el-checkbox>
                        <el-checkbox :disabled="!isEditing" label="cms_descript">文字管理</el-checkbox>
                        <el-checkbox :disabled="!isEditing" label="cms_branch_type">网点分类</el-checkbox>
                        <el-checkbox :disabled="!isEditing" label="cms_branch">网点管理</el-checkbox>
                        <el-checkbox :disabled="!isEditing" label="driver">司机</el-checkbox>
                        <el-checkbox :disabled="!isEditing" label="driver_loca">司机打卡</el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
                <!-- <el-form-item label="企业" :label-width="addDialogLabelWidth">
                    <el-select v-model="addForm.enterpriseId" :disabled="!isEditing" placeholder="请选择" >
                        <el-option
                            v-for="company in companyData"
                            :key="company.id"
                            :label="company.name"
                            :value="company.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="角色" :label-width="addDialogLabelWidth">
                    <el-select v-model="selectRoles" multiple :disabled="!isEditing" placeholder="请选择" @change="setRoles">
                        <el-option
                            v-for="role in roles"
                            :key="role.id"
                            :label="role.description"
                            :value="role.id">
                        </el-option>
                    </el-select>
                </el-form-item> -->
                <el-form-item>
                    <div v-show="addMsg" class="el-form-item__error">{{addMsg}}</div>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="addDialogVisible = false">取 消</el-button>
                <el-button v-if="isEditing" type="primary" @click="addTableData()">确 定</el-button>
                <el-button v-if="!isEditing" type="primary" @click="changeEditStatus(true)">编 辑</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
    import {
        getUserData,
        addUser,
        getUserDetail,
        deletUser,
        getRoleData,
        // getCompanyData
    } from '@/service/getData'
    import {
        reflashAddForm,deepClone
    } from '@/config/mUtils'

    let getTableDataService = getUserData,
        getDetailService = getUserDetail,
        addService = addUser,
        editService = addUser,
        deletService = deletUser;
    let tableDataDemo = [
        {
            name:'id',
            tableTitleName:'id',
            isShowInTable:false,
            isShowInAddDialog:false,
            isShowInEditDislog:false,
            isShowSearch:false,
            dataType:'string',
            defaultData:'',
        },
        {
            name:'username',
            tableTitleName:'账号名',
            isShowInTable:true,
            isShowInAddDialog:true,
            isShowInEditDislog:true,
            isShowSearch:false,
            dataType:'string',
            defaultData:'',
        },
        {
            name:'realname',
            tableTitleName:'真实姓名',
            isShowInTable:true,
            isShowInAddDialog:true,
            isShowInEditDislog:true,
            isShowSearch:false,
            dataType:'string',
            defaultData:'',
        },
        {
            name:'password',
            tableTitleName:'密码',
            isShowInTable:false,
            isShowInAddDialog:false,
            isShowInEditDislog:false,
            isShowSearch:false,
            dataType:'string',
            defaultData:'',
        },
        {
            name:'auth',
            tableTitleName:'权限列表',
            isShowInTable:false,
            isShowInAddDialog:false,
            isShowInEditDislog:false,
            isShowSearch:false,
            dataType:'string',
            defaultData:'',
        },
        {
            name:'authSelectList',
            tableTitleName:'权限列表',
            isShowInTable:false,
            isShowInAddDialog:false,
            isShowInEditDislog:false,
            isShowSearch:false,
            dataType:'arry',
            defaultData:[]
        },
        {
            name:'group_id',
            tableTitleName:'部门ID',
            isShowInTable:false,
            isShowInAddDialog:false,
            isShowInEditDislog:false,
            isShowSearch:false,
            dataType:'string',
            defaultData:'',
        },
        {
            name:'is_admin',
            tableTitleName:'是否为超级管理员',
            isShowInTable:false,
            isShowInAddDialog:false,
            isShowInEditDislog:false,
            isShowSearch:false,
            dataType: 'boolean',
            defaultData: false,
        },
        {
            name:'status',
            tableTitleName:'用户状态',
            isShowInTable:false,
            isShowInAddDialog:false,
            isShowInEditDislog:false,
            isShowSearch:false,
            dataType:'string',
            defaultData:'1',
        },
        {
            name:'last_login_time',
            tableTitleName:'最新登录时间',
            isShowInTable:true,
            isShowInAddDialog:false,
            isShowInEditDislog:false,
            isShowSearch:false,
            dataType:'string',
            defaultData:'',
        },
    ]


    export default {
        name: 'user',
        data() {
            return {
                tableData: [], //表格数据
                currentPage: 0, //当前页数
                totalData: 0, //总条数
                pageSize: 10, //每页条数
                isEditing:false,//是否正在编辑
                addDialogVisible: false, //添加弹窗是否可见
                addDialogLabelWidth: '140px',
                addDialogTitle: '添加',
                searchForm:{
                    keyword:'',
                },
                addForm: {
                    id: '',
                    username: '',
                    nickname: '',
                    password: '',
                    enterpriseId:'',
                    roles: [],
                },
                addMsg: '', //添加弹窗的提示
                tableDataDemo: tableDataDemo,//数据格式
                
                // selectRoles:[],//选中的角色
                // roles: [], //角色列表
                // companyData: [],//企业列表
                groupData: [],//部门列表
                test:[],
            }
        },
        computed: {
            showInTableDemo: function () {
                return this.tableDataDemo.filter(demo => {return demo.isShowInTable});
            },
            showInAddDialogDemo: function () {
                return this.tableDataDemo.filter(demo => {return demo.isShowInAddDialog});
            },
            showInSearchDemo: function () {
                return this.tableDataDemo.filter(demo => {return demo.isShowSearch});
            },
        },
        methods: {
            /**获取表格数据 */
            getTableData: function () {
                let pagePer = {
                    page: this.currentPage,
                    size: this.pageSize,
                }
                for(let i in this.searchForm){
                    pagePer[i] = this.searchForm[i];
                }
                getTableDataService(pagePer).then(res => {
                    // 过滤返回的数据
                    for(let i in res.data.list){
                        let u = res.data.list[i];
                        u.is_admin = u.is_admin == '0' ? false : true;
                        u.authSelectList = u.auth ? u.auth.split(',') : [];
                    }
                    this.tableData = res.data.list;
                    this.totalData = Number(res.data.total);
                    // this.pageSize = Number(res.pagesize);
                    // this.currentPage = Number(res.page);
                })
            },
            /**添加 */
            addTableData() {
                // 校验
                if(this.addForm.username.length < 6 || this.addForm.username.length > 18){
                    this.addMsg = '请输入6-18位的账号名！';
                    return
                }
                if(this.addForm.realname.length < 2 || this.addForm.realname.length > 18){
                    this.addMsg = '请输入2-18位的真实姓名！';
                    return
                }
                if(!this.addForm.group_id || (!this.addForm.password && this.addDialogTitle !== '详情')){
                    this.addMsg = '请填写完整的信息！';
                    return
                }
                // 过滤提交的内容
                this.addForm.is_admin = this.addForm.is_admin ? 1 : 0;
                this.addForm.auth = this.addForm.authSelectList.join(',');
                addService(this.addForm).then(res => {
                    this.addMsg = '';
                    this.addDialogVisible = false;
                    this.getTableData();
                }).catch((err) => {
                    // 请求成功发出，服务器响应的状态码不在2xx范围内
                    if (err.data) {
                        this.addMsg = err.data.error_description;
                    } else {
                        this.addMsg = err.message;
                    }
                })
            },
            /**添加-打开弹窗 */
            openAddTable() {
                this.addForm = reflashAddForm(this.tableDataDemo);
                this.addMsg = '';
                this.addDialogTitle = '添加';
                this.addDialogVisible = true;
                this.changeEditStatus(true);
            },
            /**详情-打开弹窗 */
            openDetailTable(id) {
                for(let i in this.tableData){
                    if(this.tableData[i].id == id){
                        this.addForm = deepClone(this.tableData[i]);
                        this.addForm.password = ''
                    }
                }
                // getDetailService(id).then(res => {
                //     this.addForm = res;
                //     this.selectRoles = this.getSelectRolesByRoles(res.roles);
                // })
                this.addMsg = '';
                this.addDialogTitle = '详情';
                this.addDialogVisible = true;
                this.changeEditStatus(false);
            },
            /**详情-改变编辑状态,true:可编辑状态,flase:不可编辑状态 */
            changeEditStatus(flag){
                this.isEditing = flag;
                // //获取角色选项
                // getRoleData().then(res => {
                //     this.roles = res.content;
                // })
                // //获取企业选项
                // getCompanyData().then(res => {
                //     this.companyData = res.content;
                // })
                // 获取部门选项
                getRoleData().then(res => {
                    this.groupData = res.data.list;
                })
            },
            /**删除 */
            openDelet(id) {
                this.$confirm('此操作将永久删除该内容, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    deletService(id).then(res => {
                        this.$message({
                            type: 'success',
                            message: '删除成功!'
                        });
                        this.getTableData();
                    }).catch((err) => {
                        this.$message({
                            type: 'error',
                            message: '删除失败!'
                        });
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },
            /**选择每页显示数 */
            handleSizeChange(val) {
                this.pageSize = val;
                this.getTableData()
            },
            /**选择页码 */
            handleCurrentChange(val) {
                this.currentPage = val - 1;
                this.getTableData()
            },
            /**当select改变时，更新addform的数据 */
            setRoles(){
                this.addForm.roles = [];
                for(let i in this.selectRoles){
                    this.addForm.roles.push({
                        id:this.selectRoles[i]
                    })
                }
            },
            /**把roles转成select的格式（提取id）出来 */
            getSelectRolesByRoles(roles){
                let re = [];
                for(let i in roles){
                    re.push(roles[i].id)
                }
                return re;
            },
        },
        beforeMount: function () {
            this.getTableData()
        }
    }
</script>
<style>
</style>