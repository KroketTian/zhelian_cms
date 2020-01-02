<template>
    <div class="autjorization">
        <div class="ctrl-block">
            <div class="search-block">
                <el-form :inline="true" :model="searchForm" class="demo-form-inline">
                    <!-- <el-form-item label="关键词">
                        <el-input v-model="searchForm.keyword" placeholder="关键词" size="mini"></el-input>
                    </el-form-item> -->
                    <el-form-item v-for="dataDemo in showInSearchDemo" :key="dataDemo.name" :label="dataDemo.tableTitleName">
                        <el-input v-model="searchForm[dataDemo.name]" :placeholder="dataDemo.tableTitleName" size="mini"></el-input>
                    </el-form-item>
                </el-form>
            </div>
            <div class="ctrl-btns">
                <el-button type="primary" @click="currentPage = 0 ;getTableData()" size="mini">查询</el-button>
                <el-button type="primary" size="mini" @click="openAddTable">添加</el-button>
            </div>
        </div>
        <div class="content-block">
            <el-table :data="tableData" border style="width: 100%">
                <el-table-column v-for="dataDemo in showInTableDemo" :key="dataDemo.name" v-show="dataDemo.isShowInTable" :prop="dataDemo.name" :label="dataDemo.tableTitleName"></el-table-column>
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
                <el-form-item label="分类" :label-width="addDialogLabelWidth">
                    <el-select v-model="addForm.cid" :disabled="!isEditing" placeholder="请选择" >
                        <el-option
                            v-for="cat in catData"
                            :key="cat.id"
                            :label="cat.title"
                            :value="cat.id">
                        </el-option>
                    </el-select>
                </el-form-item>
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
        getBranchData,
        addBranch,
        getBranchDetail,
        deletBranch,
        getBranchTypeData
    } from '@/service/getData'
    import {
        reflashAddForm
    } from '@/config/mUtils'

    let getTableDataService = getBranchData,
        getDetailService = getBranchDetail,
        addService = addBranch,
        editService = addBranch,
        deletService = deletBranch;
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
            name:'cid',
            tableTitleName:'分类id',
            isShowInTable:true,
            isShowInAddDialog:false,
            isShowInEditDislog:false,
            isShowSearch:true,
            dataType:'string',
            defaultData:'',
        },
        {
            name:'name',
            tableTitleName:'负责人姓名',
            isShowInTable:true,
            isShowInAddDialog:true,
            isShowInEditDislog:true,
            isShowSearch:false,
            dataType:'string',
            defaultData:'',
        },
        {
            name:'phone',
            tableTitleName:'负责人手机',
            isShowInTable:true,
            isShowInAddDialog:true,
            isShowInEditDislog:true,
            isShowSearch:false,
            dataType:'string',
            defaultData:'',
        },
        {
            name:'desc',
            tableTitleName:'描述',
            isShowInTable:true,
            isShowInAddDialog:true,
            isShowInEditDislog:true,
            isShowSearch:false,
            dataType:'string',
            defaultData:'',
        },
        {
            name:'icon',
            tableTitleName:'头像',
            isShowInTable:false,
            isShowInAddDialog:false,
            isShowInEditDislog:false,
            isShowSearch:false,
            dataType:'string',
            defaultData:'',
        },
        {
            name:'longitude',
            tableTitleName:'经度',
            isShowInTable:false,
            isShowInAddDialog:true,
            isShowInEditDislog:true,
            isShowSearch:false,
            dataType:'string',
            defaultData:'',
        },
        {
            name:'latitude',
            tableTitleName:'纬度',
            isShowInTable:false,
            isShowInAddDialog:true,
            isShowInEditDislog:true,
            isShowSearch:false,
            dataType:'string',
            defaultData:'',
        },
        {
            name:'location',
            tableTitleName:'位置',
            isShowInTable:true,
            isShowInAddDialog:true,
            isShowInEditDislog:true,
            isShowSearch:false,
            dataType:'string',
            defaultData:'',
        },
    ]


    export default {
        name: 'branch',
        data() {
            return {
                tableData: [], //表格数据
                currentPage: 0, //当前页数
                totalData: 0, //总条数
                pageSize: 10, //每页条数
                isEditing:false,//是否正在编辑
                addDialogVisible: false, //添加弹窗是否可见
                addDialogLabelWidth: '120px',
                addDialogTitle: '添加',
                searchForm:{
                },
                addForm: {
                    id: '',
                    cid: '',
                    name: '',
                },
                addMsg: '', //添加弹窗的提示
                tableDataDemo: tableDataDemo,//数据格式
                catData:[],//分类列表

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
                    this.tableData = res.data.list;
                    this.totalData = Number(res.data.total);
                    // this.pageSize = res.size;
                    // this.currentPage = res.page;
                })
            },
            /**添加 */
            addTableData() {
                if(!this.addForm.cid){
                    this.addMsg = '请选择分类';
                    return
                }
                if(!this.addForm.name){
                    this.addMsg = '请填写负责人姓名';
                    return
                }
                if(!this.addForm.phone){
                    this.addMsg = '请填写负责人手机';
                    return
                }
                addService(this.addForm).then(res => {
                    this.addMsg = '';
                    this.addDialogVisible = false;
                    this.getTableData();
                }).catch((err) => {
                    // 请求成功发出，服务器响应的状态码不在2xx范围内
                    if (err.response) {
                        this.addMsg = err.response.data.error_description;
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
                getDetailService(id).then(res => {
                    this.addForm = res.data;
                })
                this.addMsg = '';
                this.addDialogTitle = '详情';
                this.addDialogVisible = true;
                this.changeEditStatus(false);
            },
            /**详情-改变编辑状态,true:可编辑状态,flase:不可编辑状态 */
            changeEditStatus(flag){
                //获取企业选项
                getBranchTypeData().then(res => {
                    let re = [];
                    getAllCatData(re,{children:res});
                    this.catData = re;
                })
                function getAllCatData(re,obj){
                    if(obj.id && !re.children){
                        re.push({
                            icon:obj.icon,
                            id:obj.id,
                            parent_id:obj.parent_id,
                            title:obj.title,
                        })
                    }
                    for(let i in obj.children){
                        getAllCatData(re,obj.children[i])
                    }
                }
                this.isEditing = flag;
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
                        let msg = '删除失败!';
                        this.$message({
                            type: 'error',
                            message: msg,
                            duration:4000,
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
        },
        beforeMount: function () {
            this.getTableData()
        }
    }
</script>
<style>
</style>