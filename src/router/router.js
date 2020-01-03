import Vue from 'vue'
import Router from 'vue-router'
import login from '@/page/login/login'
import control from '@/components/control/control'
import role from '@/page/role/role'
import user from '@/page/user/user'
import faq from '@/page/faq/faq'
import images from '@/page/images/images'
import controlIndex from '@/page/control_index/control_index'
import descript from '@/page/descript/descript'
import branch_type from '@/page/branch_type/branch_type'
import branch from '@/page/branch/branch'
import driver from '@/page/driver/driver'
import driver_loca from '@/page/driver_loca/driver_loca'

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
                {
                    path: 'driver_loca',
                    name: 'driver_loca',
                    component: driver_loca,
                },
            ]
        }
    ]
})