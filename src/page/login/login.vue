<template>
    <div class="login">
        <div class="header">
            <!-- <div class="logo">浙联物流-后台管理系统</div> -->
        </div>
        <div class="login-form">
            <div class="jiao"></div>
            <div class="jiao2"></div>
            <div class="logo">
                <span>浙联物流-后台管理系统</span>
            </div>
            <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="50px"
                class="demo-ruleForm">
                <!-- <el-form-item label="" prop="userName"> -->
                    <el-input size="s" placeholder="用户名" v-model.number="ruleForm.userName">
                        <i slot="prefix" class="el-input__icon el-icon-s-finance"></i>
                    </el-input>
                <!-- </el-form-item> -->
                <!-- <el-form-item label="" prop="pass"> -->
                    <el-input size="s" placeholder="密码" type="password" v-model="ruleForm.pass">
                        <i slot="prefix" class="el-input__icon el-icon-s-check"></i>
                    </el-input>
                <!-- </el-form-item> -->
                <!-- <el-form-item> -->
                    <el-button class="sub-btn" @click="login('ruleForm')">提交</el-button>
                    <!-- <el-button size="mini" type="warning" @click="getAdData()">测试</el-button> -->
                <!-- </el-form-item> -->
                <el-form-item>
                    <div v-show="loginMsg" class="el-form-item__error">{{loginMsg}}</div>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>
<script>
    import {
        login,getAdData
    } from '../../service/getData';
    import {
        setToken,checkIsLogin,setCookie
    } from '../../config/mUtils'

    export default {
        name: 'login',
        data() {
            var checkUserName = (rule, value, callback) => {
                if (!value) {
                    return callback(new Error('账号不能为空'));
                } else {
                    callback();
                }
            };
            var validatePass = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请输入密码'));
                } else {
                    callback();
                }
            };
            return {
                ruleForm: {
                    userName: '',
                    pass: '',
                },
                rules: {
                    userName: [{
                        validator: checkUserName,
                        trigger: 'blur'
                    }],
                    pass: [{
                        validator: validatePass,
                        trigger: 'blur'
                    }]
                },
                loginMsg: '',//登录错误返回的信息
                activeHead:'',//顶部被选中的状态
            };
        },
        methods: {
            login(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        login(this.ruleForm.userName, this.ruleForm.pass).then(res => {
                            this.loginMsg = '登录成功';
                            // setToken(res)
                            setCookie('userId',res.data.user_id)
                            this.$router.replace({ name: 'control'})
                        }).catch((err) => {
                            // 请求成功发出，服务器响应的状态码不在2xx范围内
                            if (err.data) {
                                this.loginMsg = err.data.msg ? err.data.msg : err.data.error_description;
                            } else {
                                this.loginMsg = err.message;
                            }
                        })
                    } else {
                        return false;
                    }
                });
            },
            getAdData(){
                getAdData().then(res => {

                }).catch(err => {

                })
            }
        },
        beforeMount: function(){
            checkIsLogin();
        }
    }
</script>
<style scoped>
    @import url('./login.css');
</style>