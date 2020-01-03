<template>
    <div class="control">
        <el-container style="height: 100vh;">

            <el-header height="50px">
                <!-- <img class="control-logo" src="../../assets/veda_logo_black.png"/> -->
                <div class="head-logo">浙联物流-CMS</div>
                <div class="head-right">
                    <el-dropdown @command="userCommand">
                        <div class="user el-dropdown-link">
                            <el-avatar :size="30"
                                src="https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png">
                            </el-avatar>
                        </div>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item v-if="currentUser" disabled>{{currentUser.username}}</el-dropdown-item>
                            <el-dropdown-item divided command="logout">退出</el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                </div>
            </el-header>
            <el-container>
            <el-aside width="225px">
                <el-row>
                    <el-col>
                        <el-menu :default-active="menuActive" class="el-menu-vertical-demo" background-color="#222"
                            text-color="#999" active-text-color="#fff">
                            <template v-for="menu in menuList">
                                <el-submenu v-if="!!menu.child" :key="menu.index" :index="menu.index">
                                    <template slot="title">
                                        <i :class="menu.icon"></i>
                                        <span>{{menu.name}}</span>
                                    </template>
                                    <template v-for="secondMenu in menu.child">
                                        <router-link v-if="secondMenu.link" :to="{ name: secondMenu.link}"
                                            :key="secondMenu.index">
                                            <el-menu-item :index="secondMenu.index">{{secondMenu.name}}</el-menu-item>
                                        </router-link>
                                        <el-menu-item v-if="!secondMenu.link" :key="secondMenu.index">
                                            {{secondMenu.name}}</el-menu-item>
                                    </template>
                                </el-submenu>
                                <router-link v-if="!menu.child && menu.link" :to="{ name: menu.link}" :key="menu.index">
                                    <el-menu-item :index="menu.index"><i :class="menu.icon"></i>{{menu.name}}
                                    </el-menu-item>
                                </router-link>
                                <el-menu-item v-if="!menu.child && !menu.link" :key="menu.index" :index="menu.index"><i
                                        :class="menu.icon"></i>{{menu.name}}</el-menu-item>
                            </template>
                        </el-menu>
                    </el-col>
                </el-row>
            </el-aside>
                <el-main>
                    <div class="page-title">
                        <el-breadcrumb separator-class="el-icon-arrow-right">
                            <el-breadcrumb-item v-for="menuActiveName in menuActiveNames" :key="menuActiveName">{{menuActiveName}}</el-breadcrumb-item>
                        </el-breadcrumb>
                    </div>
                    <router-view />
                </el-main>
                <!-- <el-footer style="30px">Footer</el-footer> -->
            </el-container>
        </el-container>
    </div>
</template>

<script>
    import {
        getCurrentUser,logout
    } from '../../service/getData'
    import {
        checkIsLogin,
        logoutFun
    } from '../../config/mUtils'

    let checkMenuFromMenuData = (menuData,target) => {
        let reList = [];
        for(let menuI in menuData){
            if(menuData[menuI].child){
                let re = checkMenuFromMenuData(menuData[menuI].child,target);
                reList = reList.concat(re);
                re.length > 0 ? reList.push(menuI):'';
            }
            if(menuData[menuI].link === target){
                reList.push(menuI)
                return reList
            }
        }
        return reList
    }

    export default {
        name: 'control',
        data: function () {
            return {
                spanLeft: 5,
                spanRight: 19,
                menuActive:'',
                menuActiveNames:[],
                currentUser:null,
                menuList: [{
                        name: '账号管理',
                        index: '账号管理',
                        link: '',
                        icon: 'el-icon-s-check',
                        child: [{
                            name: '部门管理',
                            index: 'role',
                            link: 'role',
                            premission:'cms_user_group',
                        }, {
                            name: '用户管理',
                            index: 'user',
                            link: 'user',
                            premission:'cms_user',
                        }, ]
                    },{
                        name: '内容管理',
                        index: '内容管理',
                        link: '',
                        icon: 'el-icon-s-shop',
                        child: [{
                            name: '图片管理',
                            index: 'images',
                            link: 'images',
                            premission:'cms_images',
                        }, {
                            name: '文字管理',
                            index: 'descript',
                            link: 'descript',
                            premission:'cms_descript',
                        }, {
                            name: '网点分类',
                            index: 'branch_type',
                            link: 'branch_type',
                            premission:'cms_branch_type',
                        }, {
                            name: '网点管理',
                            index: 'branch',
                            link: 'branch',
                            premission:'cms_branch',
                        }, ]
                    }, {
                        name: '司机',
                        index: 'driver',
                        link: 'driver',
                        icon: 'el-icon-s-finance',
                        premission:'driver',
                    }, {
                        name: '打卡记录',
                        index: 'driver_loca',
                        link: 'driver_loca',
                        icon: 'el-icon-s-finance',
                        premission:'driver_loca',
                    },

                    //     name: '账号管理',
                    //     index: '账号管理',
                    //     link: '',
                    //     icon: 'el-icon-s-check',
                    //     child: [{
                    //         name: '权限管理',
                    //         index: 'permissions',
                    //         link: 'permissions',
                    //         premission:'OP_ACCOUNT or ADMIN or OP_PERMISSION',
                    //     }, {
                    //         name: '角色管理',
                    //         index: 'role',
                    //         link: 'role',
                    //         premission:'OP_ACCOUNT or ADMIN or OP_ROLE',
                    //     }, {
                    //         name: '用户管理',
                    //         index: 'user',
                    //         link: 'user',
                    //         premission:'OP_ACCOUNT or ADMIN or OP_USER',
                    //     }, ]
                    // }, {
                    //     name: '产品管理',
                    //     index: '产品管理',
                    //     link: '',
                    //     icon: 'el-icon-s-shop',
                    //     child: [{
                    //         name: '分类管理',
                    //         index: 'productCate',
                    //         link: 'productCate',
                    //         premission:'OP_CATEGORY',
                    //     }, {
                    //         name: '商品管理',
                    //         index: 'product',
                    //         link: 'product',
                    //         premission:'OP_PRODUCT',
                    //     }, ]
                    // }, {
                    //     name: '企业信息管理',
                    //     index: 'company',
                    //     link: 'company',
                    //     icon: 'el-icon-s-finance',
                    //     premission:'OP_ENTERPRISE or ADMIN or OP_COMPANY',
                    // }, {
                    //     name: '个人企业信息管理',
                    //     index: 'personCompany',
                    //     link: 'personCompany',
                    //     icon: 'el-icon-s-finance',
                    //     premission:'OP_SELF_COMPANY',
                    // }, {
                    //     name: 'faq管理',
                    //     index: 'faq',
                    //     link: 'faq',
                    //     icon: 'el-icon-s-opportunity',
                    //     premission:'OP_FAQ',
                    // }, {
                    //     name: '素材管理',
                    //     index: '素材管理',
                    //     link: '',
                    //     icon: 'el-icon-picture',
                    //     child: [{
                    //         name: '图片分组管理',
                    //         index: 'imgCate',
                    //         link: 'imgCate',
                    //         premission:'OP_IMAGE',
                    //     }, {
                    //         name: '图片管理',
                    //         index: 'images',
                    //         link: 'images',
                    //         premission:'OP_IMAGE',
                    //     }, ]
                    // }, {
                    //     name: '案例管理',
                    //     index: 'projects',
                    //     link: 'projects',
                    //     icon: 'el-icon-location',
                    //     premission:'OP_PROJECT',
                    // }, {
                    //     name: '留言管理',
                    //     index: 'messages',
                    //     link: 'messages',
                    //     icon: 'el-icon-location',
                    //     premission:'OP_MSG',
                    // }
                ],
            }
        },
        methods: {
            logout() {
                // deletToken();
                logoutFun()
                
            },
            userCommand(command) {
                this[command]();
            },
        },
        mounted: function () {
            checkIsLogin();
            // 更新菜单样式
            let showPageIndexList = checkMenuFromMenuData(this.menuList,this.$route.name).reverse();
            let active = {child:this.menuList};
            this.menuActiveNames = [];
            for(let menuI in showPageIndexList){
                active = active.child[showPageIndexList[menuI]]
                this.menuActiveNames.push(active.name)
            }
            this.menuActive = active.index;
            //获取当前用户信息
            getCurrentUser().then(res => {
                this.currentUser = res.data;
                let authList = res.data.auth ? res.data.auth.split(',') : [];
                let newMenu = [];
                // 根据用户权限筛选能显示的菜单
                for(let menuI in this.menuList){
                    // 如果有子菜单，则循环子菜单
                    if(this.menuList[menuI].child){
                        // 先把一级菜单加入列表+
                        newMenu.push( JSON.parse(JSON.stringify(this.menuList[menuI])) );
                        newMenu[newMenu.length-1].child = [];

                        for(let secondMenuI in this.menuList[menuI].child){
                            let checkMenu = this.menuList[menuI].child[secondMenuI];
                            let isShow = false;
                            checkMenu.premission.split(' or ').forEach(function(val,i,arr){
                                if(res.data.is_admin == '1'){
                                    isShow = true;
                                }else{
                                    for(let permissionI in authList){
                                        let authoritie = authList[permissionI];
                                        if(val === authoritie){
                                            isShow = true;
                                            break;
                                        }
                                    }
                                }
                            })
                            isShow ? newMenu[newMenu.length-1].child.push( JSON.parse(JSON.stringify(checkMenu)) ) : '';
                        }

                        // 检查完子菜单后，如果子菜单为空，则把父菜单删除
                        if(newMenu[newMenu.length-1].child.length < 1){
                            newMenu.splice(length-1,1);
                        }
                    }else{ //如果无子菜单
                        let checkMenu = this.menuList[menuI];
                        let isShow = false;
                        checkMenu.premission.split(' or ').forEach(function(val,i,arr){
                            if(res.data.is_admin == '1'){
                                isShow = true;
                            }else{
                                for(let permissionI in authList){
                                    let authoritie = authList[permissionI];
                                    if(val === authoritie || res.data.is_admin == '1'){
                                        isShow = true;
                                        break;

                                    }
                                }
                            }
                        })
                        isShow ? newMenu.push( JSON.parse(JSON.stringify(checkMenu)) ) : '';
                    }
                }
                this.menuList = newMenu;

            }).catch(err => {
                if(err.data.code === 4002){
                    logoutFun()
                }
            })
        },
        watch: {
            $route(to, from) {
                // 更新菜单样式
                let showPageIndexList = checkMenuFromMenuData(this.menuList,to.name).reverse();
                let active = {child:this.menuList};
                this.menuActiveNames = [];
                for(let menuI in showPageIndexList){
                    active = active.child[showPageIndexList[menuI]]
                    this.menuActiveNames.push(active.name)
                }
                this.menuActive = active.index;
            }
        }
    }
</script>

<style scoped>
    @import url('./control.css');
</style>