<template>
    <div class="autjorization">
        <div class="ctrl-block">
            <div class="search-block">
                <el-form :inline="true" :model="searchForm" class="demo-form-inline">
                    <el-form-item label="关键词">
                        <el-input v-model="searchForm.keyword" placeholder="关键词" size="mini"></el-input>
                    </el-form-item>
                    <el-form-item label="分组">
                        <el-select v-model="searchForm.groupId" placeholder="请选择" size="mini">
                            <el-option label="全部" value=""></el-option>
                            <el-option
                                v-for="imgCate in imgCates"
                                :key="imgCate.id"
                                :label="imgCate.name"
                                :value="imgCate.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
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
                <el-table-column label="预览" width="150">
                    <template slot-scope="scope">
                        <el-image
                            style="width: 130px; height: 130px"
                            :src="scope.row.url+'?imageMogr2/thumbnail/130x130'"
                            fit="contain"
                            :preview-src-list="[scope.row]">
                        </el-image>
                        <p class="img-table-url">{{scope.row.url}}</p>
                    </template>
                </el-table-column>
                <el-table-column v-for="dataDemo in showInTableDemo" :key="dataDemo.name" v-show="dataDemo.isShowInTable" :prop="dataDemo.name" :label="dataDemo.tableTitleName"></el-table-column>

                <el-table-column label="操作" width="150">
                    <template slot-scope="scope">
                        <el-button type="primary" size="mini" @click="openDetailTable(scope.row)">详情</el-button>
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
        <el-dialog center title="添加" :visible.sync="addDialogVisible" :close-on-click-modal="false" width="754px">
            <!-- 上传图片 -->
            <div class="addImg-block">
                <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过2MB</div>
                <el-upload
                    :action="apiBaseUrl + 'Admin/Uploads/upload'"
                    name="images"
                    list-type="picture-card"
                    :on-change="addImageChange"
                    :on-preview="addImagePreview"
                    :on-remove="addImageRemove"
                    :file-list="addImgFileDataList"
                    multiple>
                    <i class="el-icon-plus"></i>
                </el-upload>
                <el-dialog :visible.sync="dialogImageDetailVisible">
                    <img width="100%" :src="dialogImageDetailUrl" alt="">
                </el-dialog>
                <div v-show="addMsg" class="el-form-item__error">{{addMsg}}</div>
            </div>
            <!-- <div>
                <label class="add-right-label">分组</label>
                <el-select size="small" v-model="addForm.groupId" placeholder="请选择">
                    <el-option
                        v-for="imgCate in imgCates"
                        :key="imgCate.id"
                        :label="imgCate.name"
                        :value="imgCate.id">
                    </el-option>
                </el-select>
                <el-button style="margin-left: 10px;" size="small" type="primary" @click="initImgGroups()">修 改</el-button>
            </div> -->
            <div slot="footer" class="dialog-footer">
                <el-button @click="addDialogVisible = false;getTableData()">关 闭</el-button>
            </div>
        </el-dialog>
        <!-- 编辑 -->
        <el-dialog title="编辑" :visible.sync="editDialogVisible" :close-on-click-modal="false">
            <el-form :model="addForm">
                <el-form-item label="名称" :label-width="addDialogLabelWidth">
                    <el-input v-model="editForm.name" autocomplete="off" :disabled="!isEditing"></el-input>
                </el-form-item>
                <el-form-item label="分组" :label-width="addDialogLabelWidth">
                    <el-select v-model="editForm.groupId" placeholder="请选择" :disabled="!isEditing">
                        <el-option
                            v-for="imgCate in imgCates"
                            :key="imgCate.id"
                            :label="imgCate.name"
                            :value="imgCate.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="图片" :label-width="addDialogLabelWidth">
                    <el-image
                        style="width: 200px; height: 200px"
                        :src="editForm.url"
                        fit="contain"
                        :preview-src-list="[editForm]">
                    </el-image>
                </el-form-item>
                <el-form-item>
                    <div v-show="editMsg" class="el-form-item__error">{{editMsg}}</div>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="editDialogVisible = false">取 消</el-button>
                <el-button v-if="isEditing" type="primary" @click="editTableData()">确 定</el-button>
                <el-button v-if="!isEditing" type="primary" @click="changeEditStatus(true)">编 辑</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
    import {
        getImageData,
        addImageCate,
        editImageCate,
        deletImageCate,
        // getImgCateData,
    } from '../../service/getData'
    import {
        getToken
    } from '../../config/mUtils'
    import {
        apiBaseUrl
    } from '../../config/env'

    let getTableDataService = getImageData,
        getDetailService = null,
        addService = addImageCate,
        editService = editImageCate,
        deletService = deletImageCate;
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
            name:'name',
            tableTitleName:'名称',
            isShowInTable:true,
            isShowInAddDialog:false,
            isShowInEditDislog:false,
            isShowSearch:false,
            dataType:'string',
            defaultData:'',
        },
        {
            name:'groupName',
            tableTitleName:'分组',
            isShowInTable:true,
            isShowInAddDialog:false,
            isShowInEditDislog:false,
            isShowSearch:false,
            dataType:'string',
            defaultData:'',
        },
        {
            name:'groupId',
            tableTitleName:'分组',
            isShowInTable:false,
            isShowInAddDialog:false,
            isShowInEditDislog:false,
            isShowSearch:false,
            dataType:'string',
            defaultData:'',
        },
        {
            name:'url',
            tableTitleName:'图片',
            isShowInTable:false,
            isShowInAddDialog:false,
            isShowInEditDislog:false,
            isShowSearch:false,
            dataType:'string',
            defaultData:'',
        },
    ]


    export default {
        name: 'images',
        data() {
            return {
                tableData: [], //表格数据
                currentPage: 0, //当前页数
                totalData: 0, //总条数
                pageSize: 10, //每页条数
                isEditing:false,//是否正在编辑
                addDialogVisible: false, //添加弹窗是否可见
                editDialogVisible: false,
                addDialogLabelWidth: '120px',
                searchForm:{
                    groupId:'',
                    keyword:'',
                },
                addForm: {
                    id: '',
                    groupId: '',
                },
                editForm: {
                    id: '',
                    name: '',
                    groupId: '',
                    url: '',
                },
                addMsg: '', //添加弹窗的提示
                editMsg: '', //编辑弹窗的提示
                tableDataDemo: tableDataDemo,//数据格式

                imgCates: [],//分组列表
                addImgFileDataList:[],//要上传的图片的数据列表
                apiBaseUrl: apiBaseUrl,
                dialogImageDetailUrl: '',//图片详情
                dialogImageDetailVisible: false,//图片详情
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
                    this.tableData = res.content;
                    this.totalData = res.totalElements;
                    this.pageSize = res.size;
                    this.currentPage = res.page;
                })
            },
            /**
             * 图片选择的实际已经上传了，此函数用于把上传了的图片跟新分组数据
             * 此函数实际操作是修改图片信息
             */
            initImgGroups() {
                let images = [];
                // 如果没填组别 则报错
                if(!this.addForm.groupId){
                    this.addMsg = '请选择分组！';
                    return;
                }
                // 如果没上传图片
                if(this.addImgFileDataList.length <= 0){
                    this.addMsg = '请先上传图片！';
                    return;
                }
                for(let i in this.addImgFileDataList){
                    if(this.addImgFileDataList[i].status === 'success' && this.addImgFileDataList[i].response){
                        images.push({
                            id:this.addImgFileDataList[i].response[0].id,
                            name:this.addImgFileDataList[i].response[0].name,
                            groupId:this.addForm.groupId,
                        })
                    }
                }
                editService(images).then(res => {
                    this.$message.success('添加成功');
                    this.addMsg = '';
                }).catch(err => {
                    let ids = [];
                    for(let imagesI in images){
                        ids.push(images[imagesI].id)
                    }
                    deletService(ids);
                })
            },
            /**编辑图片 */
            editTableData(){
                editService([this.editForm]).then(res => {
                    this.editMsg = '';
                    this.editDialogVisible = false;
                    this.getTableData();
                }).catch((err) => {
                    // 请求成功发出，服务器响应的状态码不在2xx范围内
                    if (err.response) {
                        this.editMsg = err.response.data.error_description;
                    } else {
                        this.editMsg = err.message;
                    }
                })
            },
            /**取消添加图片
             * 图片选择的实际已经上传了，此函数要把已经上传了的图片删除
             */
            /**添加-打开弹窗 */
            openAddTable() {
                this.addForm = {
                    id: '',
                    groupId: '',
                }
                this.addImgFileDataList = [];
                // getImgCateData().then((res) => {
                //     this.imgCates = res;
                // })
                this.addMsg = '';
                this.addDialogVisible = true;
                this.changeEditStatus(true);
            },
            /**详情-打开弹窗 */
            openDetailTable(image) {
                this.editForm = image;
                // getImgCateData().then((res) => {
                //     this.imgCates = res;
                // })
                this.editMsg = '';
                this.editDialogVisible = true;
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
                    deletService([id]).then(res => {
                        this.$message({
                            type: 'success',
                            message: '删除成功!'
                        });
                        this.getTableData();
                    }).catch((err) => {
                        let msg = err.response.data.error == '40001' ? '删除失败，存在引用该分类的商品，请先把对应商品删除！' : '删除失败!';
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
            
            /**上传图片 */
            addImageRemove(file, fileList) {
              this.addImgFileDataList = fileList;
            },
            addImageChange(file, fileList) {
              this.addImgFileDataList = fileList;
            },
            addImagePreview(file, fileList){
                this.dialogImageDetailUrl = file.url;
                this.dialogImageDetailVisible = true;
            }
            
        },
        beforeMount: function () {
            this.getTableData();
            // getImgCateData().then((res) => {
            //     this.imgCates = res;
            // })
        }
    }
</script>
<style>
.addImg-block {
    padding: 10px;
    border: 1px solid #eee;
    height: 310px;
    overflow: auto;
    margin-bottom: 20px;
}
.add-right-label {
    margin-bottom: 6px;
    display: block;
}
.img-table-url {
    margin: 0;
    font-size: 12px;
    line-height: 14px;
    color: #c3c3c3;
}
</style>