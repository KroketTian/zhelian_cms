<template>
    <div class="select-image">
        <div class="show-seleted-img">
            <div class="show-image-list" v-for="image in selectedImages"
                v-dragging="{ item: image, list: selectedImages, group: 'selectedImages' }" :key="image.id">
                <el-image :src="image.url+'?imageMogr2/thumbnail/100x100'" fit="cover"></el-image>
                <span class="el-upload-list__item-actions" v-show="!disabled" @click="selectIamgeById(image)">
                    <span class="el-upload-list__item-delete">
                        <i class="el-icon-delete"></i>
                    </span>
                </span>
            </div>
            <!-- <select-image :selected-images="addForm.images" /> -->
            <div style="display:inline-block" v-show="!disabled" id="selectImageBlock">
                <div class="openSelectImageBtn" @click="isShowSelectBlock = !isShowSelectBlock">
                    <div class="el-upload el-upload--picture-card">
                        <i class="el-icon-plus"></i>
                    </div>
                </div>
                <el-tabs v-show="isShowSelectBlock" class="select-block" type="border-card" @tab-click="clearFileList">
                    <el-tab-pane label="图片库">
                        <div class="imageList">
                            <el-form :inline="true" :model="searchForm" class="demo-form-inline">
                                <el-form-item label="分组">
                                    <el-select v-model="searchForm.groupId" placeholder="请选择" size="mini"
                                        @change="getImages(true)">
                                        <el-option label="全部" value=""></el-option>
                                        <el-option v-for="imgCate in imgCates" :key="imgCate.id" :label="imgCate.name"
                                            :value="imgCate.id">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </el-form>
                            <div class="image-block" v-for="image in images" :key="image.id"
                                :class="[{'image-block-active':isSelectImage(image.id)>=0},{'image-block-unactive':isSelectImage(image.id)<0}]"
                                @click="selectIamgeById(image)">
                                <el-image :src="image.url" fit="cover"></el-image>
                                <h5>{{image.name}}</h5>
                            </div>
                            <div class="pagination-bar">
                                <el-pagination small layout="prev, pager, next" @size-change="handleSizeChange"
                                    @current-change="handleCurrentChange" :page-size="pageSize"
                                    :current-page="currentPage+1" :total="totalData">
                                </el-pagination>
                            </div>
                        </div>
                    </el-tab-pane>
                    <el-tab-pane label="上传">
                        <div class="imageList">
                            <el-form :inline="true" :model="editForm" class="demo-form-inline">
                                <el-form-item label="分组">
                                    <el-select v-model="editForm.groupId" placeholder="请选择" size="mini" filterable
                                        allow-create default-first-option @change="clearFileList">
                                        <el-option label="全部" value=""></el-option>
                                        <el-option v-for="imgCate in imgCates" :key="imgCate.id" :label="imgCate.name"
                                            :value="imgCate.id">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </el-form>
                            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过2MB</div>
                            <!-- <div class="image-block"> -->
                            <el-upload ref="upload" :action="apiBaseUrl + '/api/mc/v1/images'" :headers="upImageHade"
                                name="files" list-type="picture-card" :on-change="addImageChange"
                                :on-success="addImageSuccess" :before-remove="removeNewImage" :show-file-list="true">
                                <!-- multiple -->
                                <i slot="default" class="el-icon-plus"></i>
                            </el-upload>
                            <!-- </div> -->
                        </div>
                    </el-tab-pane>
                </el-tabs>
            </div>
            <div class="no-image-tip" v-show="disabled && selectedImages.length<1">暂无图片</div>
        </div>
        <div class="cover-images" v-show="disabled"></div>
    </div>
</template>
<script>
    import {
        getImageData,
        getImgCateData,
        addImgCate,
        editImageCate,
        deletImageCate
    } from '../../service/getData'
    import {
        getToken
    } from '../../config/mUtils'
    import {
        apiBaseUrl
    } from '../../config/env'

    export default {
        name: 'selectImage',
        data() {
            return {
                isShowSelectBlock: false, //是否选中图片选择框
                currentPage: 0, //当前页数
                totalData: 0, //总条数
                pageSize: 5, //每页条数
                searchForm: {
                    groupId: '',
                },
                selectImageList: [],
                editForm: {
                    groupId: '',
                },

                imgCates: [], //分组列表
                // addImgFileDataList:[],//要上传的图片的数据列表
                apiBaseUrl: apiBaseUrl,
                // dialogImageDetailUrl: '',//图片详情
                // dialogImageDetailVisible: false,//图片详情

                images: [], //图片列表
                newAddImagefileList: [], //新增的图片列表，用于改变分组
            }
        },
        props: {
            selectedImages: Array,
            disabled: Boolean,
        },
        computed: {
            /**上传图片的头部 */
            upImageHade: function () {
                let token = getToken()
                let re = {
                    authorization: 'Bearer ' + token.access_token
                }
                return re;
            },
            /**是否选中要上传图片 */
            isSelectImage(id) {
                return function (id) {
                    for (let i in this.selectedImages) {
                        if (this.selectedImages[i].id === id) {
                            return i;
                        }
                    }
                    return -1;
                }
            }
        },
        methods: {
            /**获取表格数据 */
            getImages: function (isReflash) {
                if (isReflash) {
                    this.currentPage = 0;
                }
                let pagePer = {
                    groupId: this.searchForm.groupId,
                    page: this.currentPage,
                    size: this.pageSize,
                }
                getImageData(pagePer).then(res => {
                    this.images = res.content;
                    this.totalData = res.totalElements;
                    this.pageSize = res.size;
                    this.currentPage = res.page;
                })
            },

            /**选择每页显示数 */
            handleSizeChange(val) {
                this.pageSize = val;
                this.getImages(true)
            },
            /**选择页码 */
            handleCurrentChange(val) {
                this.currentPage = val - 1;
                this.getImages()
            },
            /**上传图片 */
            addImageChange() {
                // this.getImages();
            },
            addImageSuccess(response, file, fileList) {
                this.newAddImageList = fileList;
                // 添加进分组
                let isNewGroup = true;
                for (let i in this.imgCates) {
                    if (this.imgCates[i].id === this.editForm.groupId) {
                        isNewGroup = false;
                    }
                }
                if (isNewGroup && this.editForm.groupId) {
                    addImgCate({
                        name: this.editForm.groupId
                    }).then((imgCateRes) => {
                        getImgCateData().then((res) => {
                            this.imgCates = res;
                            this.editForm.groupId = imgCateRes.id;
                        })
                        editImageCate([{
                            id: response[0].id,
                            name: response[0].name,
                            groupId: imgCateRes.id,
                        }])
                    }).catch((error) => {})
                } else if (this.editForm.groupId) {
                    editImageCate([{
                        id: response[0].id,
                        name: response[0].name,
                        groupId: this.editForm.groupId,
                    }])
                }
                // 选中图片
                this.selectIamgeById(response[0]);
            },
            /**改变图片分组 */
            clearFileList() {
                this.$refs['upload'].clearFiles();
            },

            /**选中图片 */
            selectIamgeById(image) {
                let selectI = this.isSelectImage(image.id);
                if (selectI >= 0) {
                    this.selectedImages.splice(selectI, 1)
                } else {
                    this.selectedImages.push(image)
                }
            },
            /**删除图片 */
            removeNewImage(file, fileList) {
                return new Promise(function (resolve, reject) {
                    deletImageCate(file.response[0].id).then(res => {
                        resolve(res);
                    }).catch(error => {
                        reject(error);
                    })
                })
            },
            /**成功删除图片 */
            removeNewImageSuccess(file, fileList) {
              
              this.selectIamgeById(file.response[0])
            },
            // 点击空白处消失
            hideSelectImageBlockClick(event){
                let dom = document.getElementById('selectImageBlock') // 这里是你的下拉菜单元素
                if (!dom.contains(event.target)) {
                    // 不在菜单范围，隐藏即可
                    this.isShowSelectBlock = false
                }
            }
        },
        beforeMount: function () {
            this.getImages(true);
            getImgCateData().then((res) => {
                this.imgCates = res;
            })
            document.addEventListener('mouseup', (e) => {
                var _con = document.getElementById('more-oprate')
                if (_con) {
                    if (!_con.contains(e.target)) {
                        this.isShowBtn = ''
                    }
                }
            })
        },
        mounted() {
            this.$dragging.$on('dragged', ({
                value
            }) => {})
            this.$dragging.$on('dragend', (res) => {
                // console.error(res);
            })
            // 点击空白处消失
            document.addEventListener('click', this.hideSelectImageBlockClick)
        },
        created () {
        },
        beforeDestroy () {
            // 点击空白处消失
            document.removeEventListener('click', this.hideSelectImageBlockClick)
        },
    }
</script>
<style>
    .show-image-list {
        display: inline-block;
        position: relative;
        margin-right: 6px;
        margin-bottom: 6px;
    }

    .show-image-list:hover .el-upload-list__item-actions {
        display: block;
    }

    .show-image-list .el-upload-list__item-actions {
        display: block;
        width: 20px;
        height: 20px;
        position: absolute;
        top: 0;
        right: 0;
        cursor: pointer;
    }

    .show-image-list .el-upload-list__item-delete {
        position: absolute;
        right: 0;
        top: 0;
        font-size: 14px;
        color: #ffffff;
        display: block;
        width: 100%;
        height: 100%;
        text-align: center;
        line-height: 20px;
        background: #0009;
    }

    .cover-images {
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
    }

    .show-seleted-img {
        padding: 5px 5px 10px 5px;
        -webkit-box-sizing: border-box;
        box-sizing: border-box;
        width: 100%;
        border: 1px solid #dcdfe6;
    }

    .show-seleted-img .el-image {
        width: 100px;
        height: 100px;
        vertical-align: top;
        border: 1px solid #c0ccda;
    }

    .select-block {
        position: absolute;
        z-index: 1;
        margin-top: 10px;
        width: 600px;
    }

    .el-tabs--border-card {
        box-shadow: 0 0 0 0 !important;
    }

    .el-form-item .el-form-item {
        margin: 0;
    }

    .image-block {
        display: inline-block;
        margin: 5px;
        border: 1px solid #eee;
        width: 100px;
        height: 120px;
        line-height: 1.2;
        vertical-align: top;
        position: relative;
    }

    .el-image {
        width: 100px;
        height: 100px;
    }

    .image-block h5 {
        font-size: 12px;
        font-weight: 100;
        line-height: 14px;
        color: #9e9e9e;
        margin: 0px;
        padding: 0px 4px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        text-align: center;
    }

    .el-upload--picture-card {
        width: 100px !important;
        height: 100px !important;
        line-height: 100px !important;
    }

    .image-block-unactive:before {
        content: '';
        position: absolute;
        top: 6px;
        right: 4px;
        width: 15px;
        height: 15px;
        background: #d8d8d8;
        border-radius: 50%;
        z-index: 1;
    }

    .image-block-unactive:after {
        content: '';
        width: 3px;
        height: 6px;
        border-bottom: 2px solid white;
        border-right: 2px solid white;
        position: absolute;
        right: 9px;
        top: 9px;
        transform: rotate(45deg);
        z-index: 2;
    }

    .image-block-active:before {
        content: '';
        position: absolute;
        top: 6px;
        right: 4px;
        width: 15px;
        height: 15px;
        background: #67C23A;
        border-radius: 50%;
        z-index: 1;
    }

    .image-block-active:after {
        content: '';
        width: 3px;
        height: 6px;
        border-bottom: 2px solid white;
        border-right: 2px solid white;
        position: absolute;
        right: 9px;
        top: 9px;
        transform: rotate(45deg);
        z-index: 2;
    }

    .el-upload__tip {
        line-height: 1.2;
        margin-bottom: 8px;
    }

    .el-upload-list--picture-card .el-upload-list__item {
        width: 100px !important;
        height: 100px !important;
    }
</style>