<template>
    <div class="autjorization">
        <div class="ctrl-block">
            <div class="search-block">
                <el-form :inline="true" :model="searchForm" class="demo-form-inline">
                    <el-form-item label="关键词">
                        <el-input v-model="searchForm.keyword" placeholder="关键词" size="mini"></el-input>
                    </el-form-item>
                    <el-form-item label="前端显示状态">
                        <el-select v-model="showSearchApproval" placeholder="请选择">
                            <el-option label="全部" value="all"></el-option>
                            <el-option label="是" value="true"></el-option>
                            <el-option label="否" value="false"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item v-for="dataDemo in showInSearchDemo" :key="dataDemo.name"
                        :label="dataDemo.tableTitleName">
                        <el-input v-model="searchForm[dataDemo.name]" :placeholder="dataDemo.tableTitleName"
                            size="mini"></el-input>
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
                <el-table-column label="图片" width="150">
                    <template slot-scope="scope" v-if="scope.row.images[0]">
                        <el-image
                            style="width: 130px; height: 130px"
                            :src="scope.row.images[0].url+'?imageMogr2/thumbnail/130x130'"
                            fit="contain">
                        </el-image>
                        <p class="img-table-url">{{scope.row.url}}</p>
                    </template>
                </el-table-column>
                <el-table-column v-for="dataDemo in showInTableDemo" :key="dataDemo.name"
                    v-show="dataDemo.isShowInTable" :prop="dataDemo.name" :label="dataDemo.tableTitleName">
                </el-table-column>
                <el-table-column label="显示">
                    <template slot-scope="scope">
                        <el-switch v-model="scope.row.approval" @change="changeApproval(scope.row.id,scope.row.approval,scope.$index)"></el-switch>
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
        <el-dialog :title="addDialogTitle" :visible.sync="addDialogVisible" :close-on-click-modal="false" width="780px">
            <el-form :model="addForm">
                <el-form-item v-for="dataDemo in showInAddDialogDemo" :key="dataDemo.name"
                    :label="dataDemo.tableTitleName" :label-width="addDialogLabelWidth">
                    <el-input v-model="addForm[dataDemo.name]" autocomplete="off" :disabled="!isEditing"></el-input>
                </el-form-item>
                <el-form-item label="前端显示状态" :label-width="addDialogLabelWidth">
                    <el-switch v-model="addForm.approval" :disabled="!isEditing"></el-switch>
                </el-form-item>
                <el-form-item label="图片" :label-width="addDialogLabelWidth">
                    <select-image v-if="addDialogVisible" :selected-images="addForm.images" :disabled="!isEditing"/>
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
        getProjectData,
        addProject,
        getProjectDetail,
        deletProject,
        editProjectApproval
    } from '@/service/getData'
    import {
        reflashAddForm
    } from '@/config/mUtils'
    import selectImage from '@/components/selectImage/selectImage'

    let getTableDataService = getProjectData,
        getDetailService = getProjectDetail,
        addService = addProject,
        editService = addProject,
        deletService = deletProject;
    let tableDataDemo = [{
            name: 'id',
            tableTitleName: 'id',
            isShowInTable: false,
            isShowInAddDialog: false,
            isShowInEditDislog: false,
            isShowSearch: false,
            dataType: 'string',
            defaultData: '',
        },
        {
            name: 'name',
            tableTitleName: '名字',
            isShowInTable: true,
            isShowInAddDialog: true,
            isShowInEditDislog: true,
            isShowSearch: false,
            dataType: 'string',
            defaultData: '',
        },
        {
            name: 'description',
            tableTitleName: '描述',
            isShowInTable: false,
            isShowInAddDialog: true,
            isShowInEditDislog: true,
            isShowSearch: false,
            dataType: 'string',
            defaultData: '',
        },
        {
            name: 'approval',
            tableTitleName: '前端显示状态',
            isShowInTable: false,
            isShowInAddDialog: false,
            isShowInEditDislog: false,
            isShowSearch: false,
            dataType: 'boolean',
            defaultData: false,
        },
        {
            name: 'images',
            tableTitleName: '图片',
            isShowInTable: false,
            isShowInAddDialog: false,
            isShowInEditDislog: false,
            isShowSearch: false,
            dataType: 'arry',
            defaultData: [],
        },
    ]


    export default {
        name: 'projects',
        components:{
            'select-image':selectImage,
        },
        data() {
            return {
                tableData: [], //表格数据
                currentPage: 0, //当前页数
                totalData: 0, //总条数
                pageSize: 10, //每页条数
                isEditing: false, //是否正在编辑
                addDialogVisible: false, //添加弹窗是否可见
                addDialogLabelWidth: '120px',
                addDialogTitle: '添加',
                searchForm: {
                    approval: '',
                    keyword: '',
                },
                addForm: {
                    id: '',
                    name: '',
                    description: '',
                    approval: false,
                    images: [],
                },
                addMsg: '', //添加弹窗的提示
                tableDataDemo: tableDataDemo, //数据格式

            }
        },
        computed: {
            showInTableDemo: function () {
                return this.tableDataDemo.filter(demo => {
                    return demo.isShowInTable
                });
            },
            showInAddDialogDemo: function () {
                return this.tableDataDemo.filter(demo => {
                    return demo.isShowInAddDialog
                });
            },
            showInSearchDemo: function () {
                return this.tableDataDemo.filter(demo => {
                    return demo.isShowSearch
                });
            },
            showSearchApproval: {
                get: function () {
                    return this.searchForm.approval === '' ? 'all' : this.searchForm.approval;
                },
                set: function (val) {
                    this.searchForm.approval = (val === 'all') ? '' : val;
                }
            }
        },
        methods: {
            /**获取表格数据 */
            getTableData: function () {
                let pagePer = {
                    page: this.currentPage,
                    size: this.pageSize,
                }
                for (let i in this.searchForm) {
                    pagePer[i] = this.searchForm[i];
                }
                getTableDataService(pagePer).then(res => {
                    this.tableData = res.content;
                    this.totalData = res.totalElements;
                    this.pageSize = res.size;
                    this.currentPage = res.page;
                })
            },
            /**添加 */
            addTableData() {
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
                    this.addForm = res;
                })
                this.addMsg = '';
                this.addDialogTitle = '详情';
                this.addDialogVisible = true;
                this.changeEditStatus(false);
            },
            /**详情-改变编辑状态,true:可编辑状态,flase:不可编辑状态 */
            changeEditStatus(flag) {
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
                        let msg = err.response.data.error == '40001' ? '删除失败，存在引用该分类的商品，请先把对应商品删除！' :
                            '删除失败!';
                        this.$message({
                            type: 'error',
                            message: msg,
                            duration: 4000,
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

            /**改变显示状态 */
            changeApproval(id,val,index) {
                this.$confirm('此操作确定要修改显示状态?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    editProjectApproval({
                        id:id,
                        approval:val,
                    }).then(() => {
                        this.getTableData();
                        this.$message({
                            type: 'success',
                            message: '修改成功!'
                        });
                    }).catch((err) => {
                        this.$message({
                            type: 'error',
                            message: '修改失败!'
                        });
                    })
                }).catch((action) => {
                    this.tableData[index].approval = !val;
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            }
        },
        beforeMount: function () {
            this.getTableData()
        }
    }
</script>
<style>
</style>