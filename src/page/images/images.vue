<template>
    <div class="autjorization">
        <div class="ctrl-block">
            <div class="search-block">
                <el-form :inline="true" :model="searchForm" class="demo-form-inline">
                    <!-- <el-form-item label="关键词">
                        <el-input v-model="searchForm.keyword" placeholder="关键词" size="mini"></el-input>
                    </el-form-item>
                    <el-form-item v-for="dataDemo in showInSearchDemo" :key="dataDemo.name"
                        :label="dataDemo.tableTitleName">
                        <el-input v-model="searchForm[dataDemo.name]" :placeholder="dataDemo.tableTitleName"
                            size="mini"></el-input>
                    </el-form-item>
                    <el-form-item label="分类">
                        <el-select v-model="searchForm.categoryId" placeholder="请选择" size="mini">
                            <el-option
                                label="全部"
                                value="">
                            </el-option>
                            <el-option
                                v-for="productCate in productCateData"
                                :key="productCate.id"
                                :label="productCate.name"
                                :value="productCate.id">
                            </el-option>
                        </el-select>
                    </el-form-item> -->
                    <el-form-item label="显示">
                        <el-select v-model="searchForm.status" placeholder="请选择" size="mini">
                            <el-option label="全部" value=""></el-option>
                            <el-option label="是" value="1"></el-option>
                            <el-option label="否" value="2"></el-option>
                        </el-select>
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
                <el-table-column label="图片/视频" width="150">
                    <template slot-scope="scope" v-if="scope.row.image">
                        <video v-if="scope.row.type == '2'" 
                            :src="apiBaseUrl + scope.row.image" 
                            fit="contain" 
                            style="width: 130px; height: 130px">
                        </video>
                        <el-image v-if="scope.row.type == '1'" 
                            style="width: 130px; height: 130px"
                            :src="apiBaseUrl + scope.row.image"
                            fit="contain">
                        </el-image>
                        <!-- <p class="img-table-url">{{scope.row.image.url}}</p> -->
                    </template>
                </el-table-column>
                <el-table-column v-for="dataDemo in showInTableDemo" :key="dataDemo.name"
                    v-show="dataDemo.isShowInTable" :prop="dataDemo.name" :label="dataDemo.tableTitleName">
                </el-table-column>
                <el-table-column label="类型">
                    <template slot-scope="scope">
                        <span v-if="scope.row.type == '1'">图片</span>
                        <span v-if="scope.row.type == '2'">视频</span>
                    </template>
                </el-table-column>
                <el-table-column label="是否显示">
                    <template slot-scope="scope">
                        <el-switch v-model="scope.row.isShow" disabled></el-switch>
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
                    :current-page="currentPage+1" :page-sizes="[2,5, 10, 50, 100]" :page-size="pageSize"
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
                <el-form-item label="是否显示" :label-width="addDialogLabelWidth">
                    <el-switch v-model="addForm.isShow" :disabled="!isEditing"></el-switch>
                </el-form-item>
                <el-form-item label="类型" :label-width="addDialogLabelWidth">
                    <el-select v-model="addForm.type" placeholder="请选择" :disabled="!isEditing">
                        <el-option label="图片" value="1"></el-option>
                        <el-option label="视频" value="2"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="图片" v-if="addForm.type == '1'" :label-width="addDialogLabelWidth">
                    <el-upload ref="upload"
                      class="avatar-uploader"
                      :action="apiBaseUrl + 'Admin/Uploads/upload'"
                      name="file"
                      accept="image/png,image/gif,image/jpeg"
                      :show-file-list="false"
                      :on-success="handleAvatarSuccess"
                      :on-error="handleAvatarError"
                      :before-upload="beforeAvatarUpload">
                      <img v-if="addForm.image" :src="apiBaseUrl + addForm.image" class="avatar">
                      <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload>
                </el-form-item>
                <el-form-item label="视频" v-if="addForm.type == '2'" :label-width="addDialogLabelWidth">
                    <el-upload ref="upload"
                      class="avatar-uploader"
                      :action="apiBaseUrl + 'Admin/Uploads/upload'"
                      name="file"
                      accept="audio/mp4, video/mp4"
                      :show-file-list="false"
                      :on-success="handleAvatarSuccess"
                      :on-error="handleAvatarError"
                      :before-upload="beforeAvatarUpload">
                      <video v-if="addForm.image" :src="apiBaseUrl + addForm.image" class="video" style="width:178px"></video>
                      <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload>
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
        getToken
    } from '../../config/mUtils'
    import {
        apiBaseUrl
    } from '../../config/env'
    import {
        getImageData,
        addImageCate,
        getImageDetail,
        deletImageCate,
    } from '@/service/getData'
    import {
        reflashAddForm
    } from '@/config/mUtils'
    import {
        Loading
    } from 'element-ui';

    let getTableDataService = getImageData,
        getDetailService = getImageDetail,
        addService = addImageCate,
        editService = addImageCate,
        deletService = deletImageCate;
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
            name: 'title',
            tableTitleName: '标题',
            isShowInTable: true,
            isShowInAddDialog: true,
            isShowInEditDislog: true,
            isShowSearch: false,
            dataType: 'string',
            defaultData: '',
        },
        {
            name: 'image',
            tableTitleName: '图片地址',
            isShowInTable: false,
            isShowInAddDialog: false,
            isShowInEditDislog: false,
            isShowSearch: false,
            dataType: 'string',
            defaultData: '',
        },
        {
            name: 'url',
            tableTitleName: '跳转地址',
            isShowInTable: true,
            isShowInAddDialog: true,
            isShowInEditDislog: true,
            isShowSearch: false,
            dataType: 'string',
            defaultData: '',
        },
        {
            name: 'status',
            tableTitleName: '状态',
            isShowInTable: false,
            isShowInAddDialog: false,
            isShowInEditDislog: false,
            isShowSearch: false,
            dataType: 'string',
            defaultData: '1',
        },
        {
            name: 'sort',
            tableTitleName: '排序',
            isShowInTable: true,
            isShowInAddDialog: true,
            isShowInEditDislog: true,
            isShowSearch: false,
            dataType: 'string',
            defaultData: '',
        },
        {
            name: 'desc',
            tableTitleName: '描述',
            isShowInTable: true,
            isShowInAddDialog: true,
            isShowInEditDislog: true,
            isShowSearch: false,
            dataType: 'string',
            defaultData: '',
        },
        {
            name: 'type',
            tableTitleName: '类型',
            isShowInTable: false,
            isShowInAddDialog: false,
            isShowInEditDislog: false,
            isShowSearch: false,
            dataType: 'string',
            defaultData: "1",
        },
    ]


    export default {
        name: 'images',
        components:{
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
                    status:''
                },
                addForm: {
                    id: '',
                    image: '',
                    url: '',
                    title: '',
                    status: '',
                    sort: '',
                    add_time: '',
                    edit_time: '',
                    desc: '',
                    type: '',
                },
                addMsg: '', //添加弹窗的提示
                tableDataDemo: tableDataDemo, //数据格式
                apiBaseUrl: apiBaseUrl,
                loadingInstance:null,//加载中提示

                productCateData:[],//分类列表
            }
        },
        computed: {
            /**上传图片的头部 */
            // upImageHade: function () {
            //     let token = getToken()
            //     let re = {
            //         authorization: 'Bearer ' + token.access_token
            //     }
            //     return re;
            // },
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
            selectCategoryId:{
                get: function(){
                    return (this.addForm.category.id ? this.addForm.category.id : '');
                },
                set: function(val){
                    for(let i in this.productCateData){
                        if(this.productCateData[i].id === val){
                            this.addForm.category = this.productCateData[i]
                        }
                    }
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
                    for(let i in res.data.list){
                        if(res.data.list[i].status == "1"){
                            res.data.list[i].isShow = true;
                        }else{
                            res.data.list[i].isShow = false
                        }
                    }
                    this.tableData = res.data.list;
                    this.totalData = Number(res.data.total);
                    // this.pageSize = res.size;
                    // this.currentPage = res.page;
                })
            },
            /**添加 */
            addTableData() {
                if(!this.addForm.title){
                    this.addMsg = "标题不能为空！"
                    return
                }
                if(!this.addForm.image){
                    this.addMsg = "请上传图片"
                    return
                }
                this.addForm.status = this.addForm.isShow ? '1' : '2';
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
                this.addForm.isShow = true;
                this.addMsg = '';
                this.addDialogTitle = '添加';
                this.addDialogVisible = true;
                this.changeEditStatus(true);
            },
            /**详情-打开弹窗 */
            openDetailTable(id) {
                getDetailService(id).then(res => {
                    if(res.data.status == "1"){
                        res.data.isShow = true;
                    }else{
                        res.data.isShow = false
                    }
                    this.addForm = res.data;
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
                let imgId = '';
                for(let i in this.tableData){
                    if(this.tableData[i].id === id){
                        imgId === this.tableData[i].image.id
                    }
                }
                this.$confirm('此操作将永久删除该内容, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    deletService(id).then(res => {
                        // deleteImage(imgId)
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
            // changeApproval(id,val,index) {
            //     this.$confirm('此操作确定要修改显示状态?', '提示', {
            //         confirmButtonText: '确定',
            //         cancelButtonText: '取消',
            //         type: 'warning'
            //     }).then(() => {
            //         editProjectApproval({
            //             id:id,
            //             approval:val,
            //         }).then(() => {
            //             this.getTableData();
            //             this.$message({
            //                 type: 'success',
            //                 message: '修改成功!'
            //             });
            //         }).catch((err) => {
            //             this.$message({
            //                 type: 'error',
            //                 message: '修改失败!'
            //             });
            //         })
            //     }).catch((action) => {
            //         this.tableData[index].approval = !val;
            //         this.$message({
            //             type: 'info',
            //             message: '已取消删除'
            //         });
            //     });
            // },
            handleAvatarSuccess(res, file) {
                this.loadingInstance.close();
                if(res.code != '200'){
                    this.$message.error(res.msg?res.msg:'上传失败');
                }
                this.addForm.image = res.data.url;
            },
            handleAvatarError(){
                this.loadingInstance.close();
                this.$message.error('上传失败');
            },
            beforeAvatarUpload(file) {
                this.loadingInstance = Loading.service({ fullscreen: true });
            //   const isLt2M = file.size / 1024 / 1024 < 1;

            //   if (!isLt2M) {
            //     this.$message.error('上传头像图片大小不能超过 1MB!');
            //   }
            //   return isLt2M;
            },
        },
        beforeMount: function () {
            this.getTableData();
        }
    }
</script>
<style>
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
    .avatar-uploader-icon {
        font-size: 52px;
        color: #8c939d;
        width: 178px;
        height: 178px;
        line-height: 178px!important;
        text-align: center;
    }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>