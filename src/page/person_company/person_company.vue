<template>
    <div class="person-company">
        <el-form :model="editForm">
            <!-- <el-form-item label="id" :label-width="addDialogLabelWidth">
                <el-input v-model="editForm.id" autocomplete="off" :disabled="true"></el-input>
            </el-form-item> -->
            <el-form-item label="企业名" :label-width="addDialogLabelWidth">
                <el-input v-model="editForm.name" autocomplete="off" :disabled="!isEditing"></el-input>
            </el-form-item>
            <el-form-item label="电子邮箱" :label-width="addDialogLabelWidth">
                <el-input v-model="editForm.email" autocomplete="off" :disabled="!isEditing"></el-input>
            </el-form-item>
            <el-form-item label="联系人" :label-width="addDialogLabelWidth">
                <el-input v-model="editForm.contacts" autocomplete="off" :disabled="!isEditing"></el-input>
            </el-form-item>
            <el-form-item label="地址" :label-width="addDialogLabelWidth">
                <el-input v-model="editForm.address" autocomplete="off" :disabled="!isEditing"></el-input>
            </el-form-item>
            <el-form-item label="经度" :label-width="addDialogLabelWidth">
                <el-input v-model="editForm.longitude" autocomplete="off" :disabled="!isEditing"></el-input>
            </el-form-item>
            <el-form-item label="纬度" :label-width="addDialogLabelWidth">
                <el-input v-model="editForm.latitude" autocomplete="off" :disabled="!isEditing"></el-input>
            </el-form-item>
            <el-form-item label="电话列表" :label-width="addDialogLabelWidth">
                <el-input v-model="phoneList" autocomplete="off" :disabled="!isEditing"></el-input>
                <span class="input-tip">多个电话请用英文逗号“,”隔开</span>
            </el-form-item>
            <el-form-item label="描述" :label-width="addDialogLabelWidth">
                <el-input type="textarea" :autosize="{ minRows: 3, maxRows: 4}" placeholder="请输入内容"
                    v-model="editForm.description" :disabled="!isEditing"></el-input>
            </el-form-item>
            <el-form-item>
                <div v-show="addMsg" class="el-form-item__error">{{addMsg}}</div>
            </el-form-item>
        </el-form>
        <div class="footer">
            <el-button v-if="isEditing" type="primary" @click="editCompany()">确 定</el-button>
            <el-button v-if="!isEditing" type="primary" @click="changeEditStatus(true)">编 辑</el-button>
        </div>
    </div>
</template>
<script>
    import {
        getPersonCompany,
        addCompany,
    } from '@/service/getData'
    export default {
        name: 'personCompany',
        data() {
            return {
                addDialogLabelWidth: '90px',
                isEditing:false,
                addMsg: '',
                editForm: {
                    id: '',
                    name: '',
                    description: '',
                    email: '',
                    contacts: '',
                    address: '',
                    longitude: '',
                    latitude: '',
                    telephones: [],
                },
            }
        },
        computed: {
            phoneList: {
                get: function(){
                    return this.editForm.telephones ? this.editForm.telephones.join(',') : '';
                },
                set: function(value){
                    this.editForm.telephones = value.split(',');
                }
            }
        },
        methods: {
            changeEditStatus: function(isEditing){
                this.isEditing = isEditing;
            },
            editCompany: function(){
                addCompany(this.editForm).then(res => {
                    this.addMsg = '';
                    this.getCompany();
                    this.changeEditStatus(false);
                }).catch((err) => {
                    // 请求成功发出，服务器响应的状态码不在2xx范围内
                    if (err.response) {
                        this.addMsg = err.response.data.error_description;
                    } else {
                        this.addMsg = err.message;
                    }
                })
            },
            getCompany: function(){
                getPersonCompany().then(res => {
                    this.editForm = res;
                })
            },
        },
        beforeMount: function () {
            this.getCompany()
        }
    }
</script>
<style >
.input-tip{
    font-size: 12px;
    color: #428bca;
}
.el-form-item__label{
    text-align: left!important;
}
</style>