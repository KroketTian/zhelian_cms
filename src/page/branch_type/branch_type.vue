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
                <el-button type="primary" size="mini" @click="openAddTable()">添加</el-button>
            </div>
        </div>
        <div class="content-block">
            <el-table :data="tableData" border style="width: 100%">
                <el-table-column v-for="dataDemo in showInTableDemo" :key="dataDemo.name" v-show="dataDemo.isShowInTable" :prop="dataDemo.name" :label="dataDemo.tableTitleName"></el-table-column>
                <el-table-column label="操作" width="300">
                    <template slot-scope="scope">
                        <el-button type="primary" size="mini" @click="openDetailTable(scope.row.id)">详情</el-button>
                        <el-button type="primary" size="mini" @click="openAddTable(scope.row.id)">添加子集分类</el-button>
                        <el-button type="primary" size="mini" @click="openDelet(scope.row.id)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <!-- <div class="pagination-bar">
                <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                    :current-page="currentPage+1" :page-sizes="[5, 10, 50, 100]" :page-size="pageSize"
                    layout="total, sizes, prev, pager, next, jumper" :total="totalData">
                </el-pagination>
            </div> -->
        </div>
        <!-- 弹窗 -->
        <!-- 添加 -->
        <el-dialog :title="addDialogTitle" :visible.sync="addDialogVisible" :close-on-click-modal="false">
            <el-form :model="addForm">
                <el-form-item v-for="dataDemo in showInAddDialogDemo" :key="dataDemo.name" :label="dataDemo.tableTitleName" :label-width="addDialogLabelWidth">
                    <el-input v-model="addForm[dataDemo.name]" autocomplete="off" :disabled="!isEditing"></el-input>
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
        getBranchTypeData,
        addBranchType,
        getMessagesDetail,
        deletBranchType
    } from '@/service/getData'
    import {
        reflashAddForm,deepClone
    } from '@/config/mUtils'

    let getTableDataService = getBranchTypeData,
        // getDetailService = getMessagesDetail;
        addService = addBranchType,
        editService = addBranchType,
        deletService = deletBranchType;
    let tableDataDemo = [
        {
            name:'id',
            tableTitleName:'id',
            isShowInTable:true,
            isShowInAddDialog:false,
            isShowInEditDislog:false,
            isShowSearch:false,
            dataType:'string',
            defaultData:'',
        },
        {
            name:'title',
            tableTitleName:'分类名',
            isShowInTable:true,
            isShowInAddDialog:true,
            isShowInEditDislog:true,
            isShowSearch:false,
            dataType:'string',
            defaultData:'',
        },
        {
            name:'sort',
            tableTitleName:'排序',
            isShowInTable:true,
            isShowInAddDialog:true,
            isShowInEditDislog:true,
            isShowSearch:false,
            dataType:'string',
            defaultData:'0',
        },
        {
            name:'icon',
            tableTitleName:'图标',
            isShowInTable:false,
            isShowInAddDialog:false,
            isShowInEditDislog:false,
            isShowSearch:false,
            dataType:'string',
            defaultData:'',
        },
        {
            name:'parent_id',
            tableTitleName:'父级分类id',
            isShowInTable:true,
            isShowInAddDialog:true,
            isShowInEditDislog:true,
            isShowSearch:false,
            dataType:'string',
            defaultData:'0',
        }
    ]


    export default {
        name: 'branch_type',
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
                    title: '',
                    parent_id: '',
                    sort: '',
                    icon: '',
                },
                addMsg: '', //添加弹窗的提示
                tableDataDemo: tableDataDemo,//数据格式

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
                // let pagePer = {
                //     page: this.currentPage,
                //     size: this.pageSize,
                // }
                // for(let i in this.searchForm){
                //     pagePer[i] = this.searchForm[i];
                // }
                getTableDataService().then(res => {
                    // 把元素拆分出来
                    let re = [];
                    getAllTableData(re,{children:res});

                    this.tableData = re;
                    // this.totalData = res.totalElements;
                    // this.pageSize = res.size;
                    // this.currentPage = res.page;
                })
                function getAllTableData(re,obj){
                    if(obj.id){
                        re.push({
                            icon:obj.icon,
                            id:obj.id,
                            parent_id:obj.parent_id,
                            title:obj.title,
                            sort:obj.sort,
                        })
                    }
                    for(let i in obj.children){
                        getAllTableData(re,obj.children[i])
                    }
                }
            },
            /**添加 */
            addTableData() {
                if(!this.addForm.title){
                    this.addMsg = '请填写分类名';
                    return
                }
                addService(this.addForm).then(res => {
                    if(res === 0){
                        this.$message({
                            type: 'error',
                            message: '提交失败,请填写合法的数据',
                            duration:2000,
                        });
                    }
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
            openAddTable(id) {
                this.addForm = reflashAddForm(this.tableDataDemo);
                if(id){
                    this.addForm.parent_id = id
                }
                this.addMsg = '';
                this.addDialogTitle = '添加';
                this.addDialogVisible = true;
                this.changeEditStatus(true);
            },
            /**详情-打开弹窗 */
            openDetailTable(id) {
                // getDetailService(id).then(res => {
                //     this.addForm = res;
                // })
                for(let i in this.tableData){
                    if(this.tableData[i].id == id){
                        this.addForm = deepClone(this.tableData[i]);
                        this.addForm.password = ''
                    }
                }
                this.addMsg = '';
                this.addDialogTitle = '详情';
                this.addDialogVisible = true;
                this.changeEditStatus(false);
            },
            /**详情-改变编辑状态,true:可编辑状态,flase:不可编辑状态 */
            changeEditStatus(flag){
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
                        let msg = err.data.msg ? err.data.msg : (err.data.error_description ? err.data.error_description : '删除失败!');
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