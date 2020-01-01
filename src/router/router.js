import Vue from 'vue'
import Router from 'vue-router'
import login from '@/page/login/login'
import control from '@/components/control/control'
import permissions from '@/page/permissions/permissions'
import role from '@/page/role/role'
import user from '@/page/user/user'
import productCate from '@/page/productCate/productCate'
import product from '@/page/product/product'
import company from '@/page/company/company'
import personCompany from '@/page/person_company/person_company'
import faq from '@/page/faq/faq'
import imgCate from '@/page/imgCate/imgCate'
import projects from '@/page/projects/projects'
import images from '@/page/images/images'
import messages from '@/page/messages/messages'
import controlIndex from '@/page/control_index/control_index'
import descript from '@/page/descript/descript'
import branch_type from '@/page/branch_type/branch_type'
import branch from '@/page/branch/branch'
import driver from '@/page/driver/driver'

Vue.use(Router)

export default new Router({
    routes: [
        {
            path: '/',
            redirect: '/control',
            meta: {
                title: 'zhelian_cms'
            }
        },
        {
            path: '/login',
            name: 'login',
            component: login,
            meta: {
                title: 'zhelian_cms'
            },
        },
        {
            path: '/control',
            name: 'control',
            component: control,
            redirect: '/control/controlIndex',
            meta: {
                title: 'zhelian_cms'
            },
            children: [
                {
                    path: 'controlIndex',
                    name: 'controlIndex',
                    component: controlIndex,
                },
                {
                    path: 'user',
                    name: 'user',
                    component: user,
                },
                {
                    path: 'role',
                    name: 'role',
                    component: role,
                },
                {
                    path: 'images',
                    name: 'images',
                    component: images,
                },
                {
                    path: 'descript',
                    name: 'descript',
                    component: descript,
                },
                {
                    path: 'branch_type',
                    name: 'branch_type',
                    component: branch_type,
                },
                {
                    path: 'branch',
                    name: 'branch',
                    component: branch,
                },
                {
                    path: 'driver',
                    name: 'driver',
                    component: driver,
                },
                // {
                //     path: 'permissions',
                //     name: 'permissions',
                //     component: permissions,
                // },
                // {
                //     path: 'role',
                //     name: 'role',
                //     component: role,
                // },
                // {
                //     path: 'user',
                //     name: 'user',
                //     component: user,
                // },
                // {
                //     path: 'productCate',
                //     name: 'productCate',
                //     component: productCate,
                // },
                // {
                //     path: 'product',
                //     name: 'product',
                //     component: product,
                // },
                // {
                //     path: 'company',
                //     name: 'company',
                //     component: company,
                // },
                // {
                //     path: 'personCompany',
                //     name: 'personCompany',
                //     component: personCompany,
                // },
                // {
                //     path: 'faq',
                //     name: 'faq',
                //     component: faq,
                // },
                // {
                //     path: 'imgCate',
                //     name: 'imgCate',
                //     component: imgCate,
                // },
                // {
                //     path: 'projects',
                //     name: 'projects',
                //     component: projects,
                // },
                // {
                //     path: 'images',
                //     name: 'images',
                //     component: images,
                // },
                {
                    path: 'messages',
                    name: 'messages',
                    component: messages,
                },
            ]
        }
    ]
})