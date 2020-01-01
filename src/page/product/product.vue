<template>
    <div class="autjorization">
        <template>
            <el-tabs v-model="searchForm.enabled" type="card" @tab-click="getTableData">
                <el-tab-pane label="我的货架" name="true"></el-tab-pane>
                <el-tab-pane label="回收站" name="false"></el-tab-pane>
            </el-tabs>
        </template>
        <div class="ctrl-block">
            <div class="search-block">
                <el-form :inline="true" :model="searchForm" class="demo-form-inline">
                    <el-form-item label="关键词">
                        <el-input v-model="searchForm.keyword" placeholder="关键词" size="mini"></el-input>
                    </el-form-item>
                    <el-form-item label="前端显示状态">
                        <el-select v-model="showSearchApproval" placeholder="请选择" size="mini">
                            <el-option label="全部" value="all"></el-option>
                            <el-option label="是" value="true"></el-option>
                            <el-option label="否" value="false"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="分类">
                        <el-select v-model="searchForm.categoryId" placeholder="请选择" size="mini">
                            <el-option label="全部" value=""></el-option>
                            <el-option
                                v-for="productCate in productCateData"
                                :key="productCate.id"
                                :label="productCate.name"
                                :value="productCate.id">
                            </el-option>
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
                <el-button type="primary" v-show="searchForm.enabled === 'true'" size="mini" @click="openAddTable">添加</el-button>
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
                        <el-button v-show="searchForm.enabled === 'true'" type="primary" size="mini" @click="openDetailTable(scope.row.id)">详情</el-button>
                        <el-button v-show="searchForm.enabled === 'true'" type="primary" size="mini" @click="openDelet(scope.row.id)">删除</el-button>
                        <el-button v-show="searchForm.enabled === 'false'" type="primary" size="mini" @click="resetProductEnable(scope.row.id)">恢复</el-button>
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
                <el-form-item label="分类" :label-width="addDialogLabelWidth">
                    <el-select v-model="addForm.categoryId" placeholder="请选择" :disabled="!isEditing">
                        <el-option
                            v-for="productCate in productCateData"
                            :key="productCate.id"
                            :label="productCate.name"
                            :value="productCate.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="属性" :label-width="addDialogLabelWidth">
                    <div class="attributes-table">
                        <el-table :data="addForm.attributes" border>
                            <el-table-column label="名称">
                                <template slot-scope="scope">
                                    <el-input v-model="scope.row.name" placeholder="请输入内容" :disabled="!isEditing" size="mini"></el-input>
                                </template>
                            </el-table-column>
                            <el-table-column label="值">
                                <template slot-scope="scope">
                                    <el-input v-model="scope.row.value" placeholder="请输入内容" :disabled="!isEditing" size="mini"></el-input>
                                </template>
                            </el-table-column>
                            <el-table-column label="操作" width="100">
                                <template slot-scope="scope">
                                    <el-button v-if="isEditing" type="danger" icon="el-icon-delete" circle @click="deletAttributes(scope.$index)" size="mini"></el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                        <el-button class="add-attributes-btn" v-if="isEditing" size="small" type="primary" icon="el-icon-plus" circle @click="addAttributes"></el-button>
                    </div>
                </el-form-item>
                <el-form-item label="前端显示状态" :label-width="addDialogLabelWidth">
                    <el-switch v-model="addForm.approval" :disabled="!isEditing"></el-switch>
                </el-form-item>
                <el-form-item label="图片" :label-width="addDialogLabelWidth">
                    <select-image v-if="addDialogVisible" :selected-images="addForm.images" :disabled="!isEditing"/>
                </el-form-item>
                <el-form-item label="详情图片" :label-width="addDialogLabelWidth">
                    <select-image v-if="addDialogVisible" :selected-images="addForm.detailImages" :disabled="!isEditing"/>
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
        getProductData,
        addProduct,
        getProductDetail,
        deletProduct,
        editProductApproval,
        editProductEnable,
        getProductCateData
    } from '@/service/getData'
    import {
        reflashAddForm
    } from '@/config/mUtils'
    import selectImage from '@/components/selectImage/selectImage'

    let getTableDataService = getProductData,
        getDetailService = getProductDetail,
        addService = addProduct,
        editService = addProduct,
        deletService = deletProduct;
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
            name: 'code',
            tableTitleName: '编码',
            isShowInTable: true,
            isShowInAddDialog: true,
            isShowInEditDislog: true,
            isShowSearch: false,
            dataType: 'string',
            defaultData: '',
        },
        {
            name: 'name',
            tableTitleName: '名称',
            isShowInTable: true,
            isShowInAddDialog: true,
            isShowInEditDislog: true,
            isShowSearch: false,
            dataType: 'string',
            defaultData: '',
        },
        {
            name: 'categoryId',
            tableTitleName: '分类id',
            isShowInTable: false,
            isShowInAddDialog: false,
            isShowInEditDislog: false,
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
            name: 'attributes',
            tableTitleName: '属性列表',
            isShowInTable: false,
            isShowInAddDialog: false,
            isShowInEditDislog: false,
            isShowSearch: false,
            dataType: 'arry',
            defaultData: [],
        },
        {
            name: 'images',
            tableTitleName: '图片列表',
            isShowInTable: false,
            isShowInAddDialog: false,
            isShowInEditDislog: false,
            isShowSearch: false,
            dataType: 'arry',
            defaultData: [],
        },
        {
            name: 'detailImages',
            tableTitleName: '详情图片列表',
            isShowInTable: false,
            isShowInAddDialog: false,
            isShowInEditDislog: false,
            isShowSearch: false,
            dataType: 'arry',
            defaultData: [],
        },
    ]


    export default {
        name: 'product',
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
                    categoryId: '',
                    enabled: 'true',
                },
                addForm: {
                    id: '',
                    code: '',
                    name: '',
                    categoryId: '',
                    approval: true,
                    attributes: [],
                    images: [],
                    detailImages: [],
                },
                addMsg: '', //添加弹窗的提示
                tableDataDemo: tableDataDemo, //数据格式

                productCateData:[],//分类列表

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
            },
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
                /**过滤空的属性 */
                let attributes = [];
                for(let i in this.addForm.attributes){
                    if(this.addForm.attributes[i].name != '' || this.addForm.attributes[i].value != ''){
                        attributes.push(this.addForm.attributes[i])
                    }
                }
                this.addForm.attributes = attributes;

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
                this.getProductCate();
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
                    editProductApproval({
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
            },

            /**获取分组列表 */
            getProductCate() {
                getProductCateData().then(res => {
                    this.productCateData = res.content;
                }).catch(err => {
                })
            },
            /**给属性列表添加一列 */
            addAttributes() {
                this.addForm.attributes.push({name:'',value:''})
            },
            /**删除属性列表 */
            deletAttributes(i) {
                this.addForm.attributes.splice(i,1)
            },
            /**改变删除状态 */
            resetProductEnable(id){
                editProductEnable({
                    id:id,
                    enabled:true
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
            }
        },
        
        
        beforeMount: function () {
            this.getTableData();
            this.getProductCate();
        }
    }
</script>
<style>
.attributes-table .el-table td, .attributes-table .el-table th {
    padding: 4px;
    line-height: 1.2;
}
.add-attributes-btn{
    margin: -10px 0px 10px 10px;
}
</style>