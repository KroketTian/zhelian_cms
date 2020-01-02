import md5 from 'js-md5';
let Base64 = require('js-base64').Base64;
import service from '../config/axios_request';
import {getCookie} from '../config/mUtils'
import qs from "qs";


export const login = (userName, password) => {
    // password = md5(password)
    // let Authorization = Base64.encode(userName + ':' + password);
    return service({
        method: 'post',
        url: '/Admin/Admin/login',
        data:{
            username:userName,
            password:password,
        }
    }).then(res => {
        return new Promise(function(resolve,reject){
            resolve(res);
            reject(res);
        })
    })
}

export const loginBytoken = (refresh_token) => {
    return service({
        method: 'post',
        url: '/api/mc/v1/auth/refresh_token',
        params: {
            refresh_token: refresh_token
        }
    })
}

export const logout = () => {
    return service({
        method: 'POST',
        url: '/Admin/Admin/logout',
    })
}

export const checkIsLoginApi = () => {
    var userId = getCookie('userId');
    return service({
        method: 'post',
        url: '/Admin/AdminUser/edit',
        data:{
            id:userId,
        }
    })
}
/**获取权限列表 */
export const getPermissionsData = (pagePer) => {
    let par = {};
    if(pagePer){
        par = {
            page:pagePer.page,
            size:pagePer.size,
        }
    }else{
        par = {
            page:0,
            size:100000000000,
        }
    }
    return service({
        method: 'get',
        url: '/api/mc/v1/permissions',
        params: par
    })
}
/**获取权限详情 */
export const getPermissionsDetail = (id) => {
    return service({
        method: 'get',
        url: '/api/mc/v1/permissions/'+id,
    })
}
/**添加权限 */
export const addPermissions = (permission) => {
    let data = {
        description:permission.description,
        resource:permission.resource,
    }
    if(permission.id){
        data.id = permission.id;
    }
    if(permission.parentId){
        data.parentId = permission.parentId;
    }
    return service({
        method: 'post',
        url:'/api/mc/v1/permissions',
        data: JSON.stringify(data),
        headers: {
            "content-type": 'application/json'
        }
    })
}
/**删除权限 */
export const deletPermissions = (id) => {
    return service({
        method: 'delete',
        url: '/api/mc/v1/permissions/'+id,
    })
}

/**获取角色列表 */
export const getRoleData = (pagePer) => {
    // let par = {};
    // if(pagePer){
    //     par = {
    //         page:pagePer.page,
    //         size:pagePer.size,
    //     }
    // }else{
    //     par = {
    //         page:0,
    //         size:100000000000,
    //     }
    // }
    return service({
        method: 'POST',
        url: '/Admin/AuthGroup/lists',
        // data: par
    })
}
/**获取角色详情 */
export const getRoleDetail = (id) => {
    return service({
        method: 'POST',
        url: '/Admin/AuthGroup/detail',
        data:{
            id:id
        }
    })
}
/**添加角色 */
export const addRole = (role) => {
    let data = {
        name:role.name,
        desc:role.desc,
    }
    if(role.id){
        data.id = role.id;
        return service({
            method: 'post',
            url:'/Admin/AuthGroup/editGroup',
            data: data,
        })
    }
    return service({
        method: 'post',
        url:'/Admin/AuthGroup/addGroup',
        data: data,
    })
}
/**删除角色 */
export const deletRole = (id) => {
    return service({
        method: 'post',
        url: '/Admin/AuthGroup/delGroup',
        data: {
            id:id
        }
    })
}

/**获取账号列表 */
export const getUserData = (pagePer) => {
    return service({
        method: 'post',
        url: '/Admin/AdminUser/lists',
        data: {
            // keyword:pagePer.keyword,
            page:pagePer.page+1,
            pagesize:pagePer.size,
        }
    })
}
/**获取账号详情 */
export const getUserDetail = (id) => {
    return service({
        method: 'post',
        url: '/Admin/AdminUser/detail',
        data:{
            id: id
        }
    })
}
/**添加、编辑账户 */
export const addUser = (user) => {
    let data = {
        username:user.username,
        realname:user.realname,
        auth:user.auth,
        group_id:user.group_id,
        is_admin:user.is_admin,
        status:user.status,
    }
    if(user.password){
        data.password = user.password;
    }
    if(user.id){
        data.id = user.id;
        return service({
            method: 'post',
            url:'/Admin/AdminUser/edit',
            data: data,
        })
    }
    return service({
        method: 'post',
        url:'/Admin/AdminUser/add',
        data: data,
    })
}

/**删除账户 */
export const deletUser = (id) => {
    return service({
        method: 'post',
        url: '/Admin/AdminUser/del',
        data:{
            id: id,
        }
    })
}
/**获取当前账号信息 */
export const getCurrentUser = () => {
    var userId = getCookie('userId');
    return service({
        method: 'post',
        url: '/Admin/AdminUser/detail',
        data:{
            id:userId,
        }
    })
}

/**获取企业列表 */
export const getCompanyData = (pagePer) => {
    let par = {};
    if(pagePer){
        par = {
            keyword:pagePer.keyword,
            page:pagePer.page,
            size:pagePer.size,
        }
    }else{
        par = {
            page:0,
            size:100000000000,
        }
    }
    return service({
        method: 'get',
        url: '/api/mc/v1/enterprises',
        params: par,
    })
}
/**获取企业详情 */
export const getCompanyDetail = (id) => {
    return service({
        method: 'get',
        url: '/api/mc/v1/enterprises/'+id,
    })
}
/**添加、编辑企业 */
export const addCompany = (company) => {
    let data = {
        name:company.name,
        description:company.description,
        email:company.email,
        contacts:company.contacts,
        address:company.address,
        longitude:company.longitude,
        latitude:company.latitude,
        telephones:company.telephones,
    }
    if(company.id){
        data.id = company.id;
    }
    return service({
        method: 'post',
        url:'/api/mc/v1/enterprises',
        data: JSON.stringify(data),
        headers: {
            "content-type": 'application/json'
        }
    })
}
/**删除企业 */
export const deletCompany = (id) => {
    return service({
        method: 'delete',
        url: '/api/mc/v1/enterprises/'+id,
    })
}
/**获取当前账号的企业信息 */
export const getPersonCompany = (id) => {
    return service({
        method: 'get',
        params:{
            id: id
        },
        url: 'api/mc/v1/enterprises/current',
    })
}

/**获取分类列表 */
export const getProductCateData = (pagePer) => {
    let par = {};
    if(pagePer){
        par = {
            keyword:pagePer.keyword,
            page:pagePer.page,
            size:pagePer.size,
        }
    }else{
        par = {
            page:0,
            size:100000000000,
        }
    }
    return service({
        method: 'get',
        url: '/api/mc/v1/categories',
        params: par
    })
}
/**获取分类详情 */
export const getProductCateDetail = (id) => {
    return service({
        method: 'get',
        url: '/api/mc/v1/categories/'+id,
    })
}
/**添加、编辑分类 */
export const addProductCate = (productCate) => {
    let data = {
        name:productCate.name,
    }
    if(productCate.id){
        data.id = productCate.id;
    }
    return service({
        method: 'post',
        url:'/api/mc/v1/categories',
        data: JSON.stringify(data),
        headers: {
            "content-type": 'application/json'
        }
    })
}
/**删除分类 */
export const deletProductCate = (id) => {
    return service({
        method: 'delete',
        url: '/api/mc/v1/categories/'+id,
    })
}


/**获取商品列表 */
export const getProductData = (pagePer) => {
    return service({
        method: 'get',
        url: '/api/mc/v1/products',
        params: {
            keyword:pagePer.keyword,
            categoryId:pagePer.categoryId,
            enabled:pagePer.enabled,
            approval:pagePer.approval,
            page:pagePer.page,
            size:pagePer.size,
        }
    })
}
/**获取商品详情 */
export const getProductDetail = (id) => {
    return service({
        method: 'get',
        url: '/api/mc/v1/products/'+id,
    })
}
/**添加、编辑商品 */
export const addProduct = (product) => {
    let data = {
        code:product.code,
        name:product.name,
        categoryId:product.categoryId,
        approval:product.approval,
        attributes:product.attributes,
        images:product.images,
        detailImages:product.detailImages,
    }
    if(product.id){
        data.id = product.id;
    }
    return service({
        method: 'post',
        url:'/api/mc/v1/products',
        data: JSON.stringify(data),
        headers: {
            "content-type": 'application/json'
        }
    })
}
/**修改商品显示状态 */
export const editProductApproval = (product) => {
    let data = {
        id:product.id,
        approval:product.approval,
    }
    return service({
        method: 'patch',
        url: '/api/mc/v1/products',
        data:JSON.stringify(data),
        headers: {
            "content-type": 'application/json'
        }
    })
}
/**删除商品 */
export const deletProduct = (id) => {
    return service({
        method: 'delete',
        url: '/api/mc/v1/products/'+id,
    })
}
/**恢复商品删除状态 */
export const editProductEnable = (product) => {
    let data = {
        id:product.id,
        enabled:product.enabled,
    }
    return service({
        method: 'patch',
        url: '/api/mc/v1/products',
        data:JSON.stringify(data),
        headers: {
            "content-type": 'application/json'
        }
    })
}

/**获取图片分类列表 */
export const getImgCateData = (pagePer) => {
    let par = {};
    if(pagePer){
        par = {
            page:pagePer.page,
            size:pagePer.size,
        }
    }else{
        par = {
            page:0,
            size:100000000000,
        }
    }
    return service({
        method: 'get',
        url: '/api/mc/v1/images/groups',
        params: par,
    })
}
/**获取图片分类详情 */
export const getImgCateDetail = (id) => {
    return service({
        method: 'get',
        url: '/api/mc/v1/images/groups/'+id,
    })
}
/**添加、编辑图片分类 */
export const addImgCate = (productCate) => {
    let data = {
        name:productCate.name,
    }
    if(productCate.id){
        data.id = productCate.id;
    }
    return service({
        method: 'post',
        url:'/api/mc/v1/images/groups',
        data: JSON.stringify(data),
        headers: {
            "content-type": 'application/json'
        }
    })
}
/**删除图片分类 */
export const deletImgCate = (id) => {
    return service({
        method: 'delete',
        url: '/api/mc/v1/images/groups/'+id,
    })
}


/**获取图片列表 */
export const getImageData = (pagePer) => {
    let par = {};
    if(pagePer){
        par = {
            // keyword:pagePer.keyword,
            status:pagePer.status,
            page:pagePer.page,
            pagesize:pagePer.size,
        }
    }else{
        par = {
            page:0,
            size:100000000000,
        }
    }
    return service({
        method: 'post',
        url: '/Admin/Ads/lists',
        data: par
    })
}
/**获取图片详情 */
export const getImageDetail = (id) => {
    return service({
        method: 'post',
        url: '/Admin/Ads/detail',
        data:{
            id: id
        }
    })
}
/**添加图片 */
export const addImageCate = (image) => {
    let data = {
        title:image.title,
        image:image.image,
        url:image.url,
        status:image.status,
        sort:image.sort,
        desc:image.desc,
        type:image.type,
    }
    if(image.id){
        data.id = image.id;
        return service({
            method: 'post',
            url:'/Admin/Ads/edit',
            data: data,
        })
    }
    return service({
        method: 'post',
        url:'/Admin/Ads/add',
        data: data,
    })
}
/**删除图片 */
export const deletImageCate = (ids) => {
    // let paramsStr = '?id=' + ids.join('&id=');
    return service({
        method: 'post',
        url: '/Admin/Ads/del',
        data:{
            id:ids
        }
    })
}

/**批量上传图片 */
export const pushImg = (file) => {
    return service({
        method:'post',
        url:'/cms/api/mc/v1/images',
        data: JSON.stringify(file),
        headers: {
            "content-type": 'application/json'
        }
    })
}

/**获取faq列表 */
export const getFaqData = (pagePer) => {
    return service({
        method: 'get',
        url: '/api/mc/v1/faqs',
        params: {
            keyword:pagePer.keyword,
            page:pagePer.page,
            size:pagePer.size,
        }
    })
}
/**获取faq详情 */
export const getFaqDetail = (id) => {
    return service({
        method: 'get',
        url: '/api/mc/v1/faqs/'+id,
    })
}
/**添加、编辑faq */
export const addFaq = (faq) => {
    let data = {
        question:faq.question,
        answer:faq.answer,
    }
    if(faq.id){
        data.id = faq.id;
    }
    return service({
        method: 'post',
        url:'/api/mc/v1/faqs',
        data: JSON.stringify(data),
        headers: {
            "content-type": 'application/json'
        }
    })
}
/**删除faq */
export const deletFaq = (id) => {
    return service({
        method: 'delete',
        url: '/api/mc/v1/faqs/'+id,
    })
}

/**获取案例列表 */
export const getProjectData = (pagePer) => {
    let par = {};
    if(pagePer){
        par = {
            keyword:pagePer.keyword,
            approval:pagePer.approval ? pagePer.approval : '',
            page:pagePer.page,
            size:pagePer.size,
        }
    }else{
        par = {
            page:0,
            size:100000000000,
        }
    }
    return service({
        method: 'get',
        url: '/api/mc/v1/projects',
        params: par
    })
}
/**获取案例详情 */
export const getProjectDetail = (id) => {
    return service({
        method: 'get',
        url: '/api/mc/v1/projects/'+id,
    })
}
/**添加、编辑案例 */
export const addProject = (project) => {
    let data = {
        name:project.name,
        description:project.description,
        approval:project.approval,
        images:project.images,
    }
    if(project.id){
        data.id = project.id;
    }
    return service({
        method: 'post',
        url:'/api/mc/v1/projects',
        data: JSON.stringify(data),
        headers: {
            "content-type": 'application/json'
        }
    })
}
/**修改案例显示状态 */
export const editProjectApproval = (project) => {
    let data = {
        id:project.id,
        approval:project.approval,
    }
    return service({
        method: 'patch',
        url: '/api/mc/v1/projects',
        data:JSON.stringify(data),
        headers: {
            "content-type": 'application/json'
        }
    })
}
/**删除案例 */
export const deletProject = (id) => {
    return service({
        method: 'delete',
        url: '/api/mc/v1/projects/'+id,
    })
}

/**获取留言列表 */
export const getMessagesData = (pagePer) => {
    return service({
        method: 'get',
        url: '/api/mc/v1/messages',
        params: {
            page:pagePer.page,
            size:pagePer.size,
        }
    })
}
/**获取留言详情 */
export const getMessagesDetail = (id) => {
    return service({
        method: 'get',
        url: '/api/mc/v1/messages/'+id,
    })
}

/**获取广告 */
export const getAdData = (pagePer) => {
    let par = {};
    if(pagePer){
        par = {
            keyword:pagePer.keyword,
            approval:pagePer.approval ? pagePer.approval : '',
            page:pagePer.page,
            size:pagePer.size,
        }
    }else{
        par = {
            page:0,
            size:100000000000,
        }
    }
    return service({
        method: 'post',
        url: '/Admin/Ads/lists',
        params: par
    })
}

/**获取文字列表 */
export const getDesData = (pagePer) => {
    return service({
        method: 'post',
        url: '/Admin/Portal/lists',
        data: {
            page:pagePer.page+1,
            pagesize:pagePer.size,
        }
    })
}/**获取文字详情 */
export const getDesDetail = (id) => {
    return service({
        method: 'post',
        url: '/Admin/Portal/detail',
        data:{
            id :id
        }
    })
}
/**添加、编辑文字 */
export const addDes = (msg) => {
    let data = {
        content:msg.content,
        title:msg.title,
    }
    if(msg.id){
        data.id = msg.id;
        return service({
            method: 'post',
            url:'/Admin/Portal/edit',
            data: data,
        })
    }
    return service({
        method: 'post',
        url:'/Admin/Portal/add',
        data: data,
    })
}
/**删除文字 */
export const deletDes = (id) => {
    return service({
        method: 'post',
        url: '/Admin/Portal/del',
        data:{
            id: id
        }
    })
}

/**获取网点分类列表 */
export const getBranchTypeData = (pagePer) => {
    return service({
        method: 'post',
        url: '/Admin/Category/lists',
        data: {
            // keyword:pagePer.keyword,
            // page:pagePer.page,
            // pagesize:pagePer.size,
        }
    })
}
/**获取网点分类详情 */
// export const getBranchTypeDetail = (id) => {
//     return service({
//         method: 'get',
//         url: '/api/mc/v1/faqs/'+id,
//     })
// }
/**添加、编辑网点分类 */
export const addBranchType = (bt) => {
    let data = {
        title:bt.title,
        sort:bt.sort,
        parent_id:bt.parent_id,
    }
    if(bt.id){
        data.id = bt.id;
        return service({
            method: 'post',
            url:'/Admin/category/updateCate',
            data: data,
        })
    }
    return service({
        method: 'post',
        url:'/Admin/category/addCate',
        data: data,
    })
}
/**删除网点分类 */
export const deletBranchType = (id) => {
    return service({
        method: 'post',
        url: '/Admin/category/del',
        data:{
            id: id
        }
    })
}

/**获取网点列表 */
export const getBranchData = (pagePer) => {
    return service({
        method: 'post',
        url: '/Admin/branch/lists',
        data: {
            cid:pagePer.cid,
            page:pagePer.page+1,
            pageSize:Number(pagePer.size),
        }
    })
}
/**获取网点详情 */
export const getBranchDetail = (id) => {
    return service({
        method: 'post',
        url: '/Admin/branch/detail',
        data:{
            id: id
        }
    })
}
/**添加、编辑网点 */
export const addBranch = (msg) => {
    let data = {
        cid:msg.cid,
        name:msg.name,
        phone:msg.phone,
        desc:msg.desc,
        icon:msg.icon,
        longitude:msg.longitude,
        latitude:msg.latitude,
        location:msg.location,
    }
    if(msg.id){
        data.id = msg.id;
        return service({
            method: 'post',
            url:'/Admin/branch/edit',
            data: data,
        })
    }
    return service({
        method: 'post',
        url:'/Admin/branch/add',
        data: data,
    })
}
/**删除网点 */
export const deletBranch = (id) => {
    return service({
        method: 'post',
        url: '/Admin/branch/del',
        data:{
            id: id
        }
    })
}

/**获取司机列表 */
export const getDriverData = (pagePer) => {
    return service({
        method: 'post',
        url: '/Admin/User/lists',
        data: {
            phone:pagePer.phone,
            // is_driver:'1',
            page:pagePer.page+1,
            pagesize:pagePer.size,
        }
    })
}
/**添加、编辑司机 */
export const addDriver = (msg) => {
    let data = {
        // nickName:msg.nickName,
        // avatarUrl:msg.avatarUrl,
        // gender:msg.gender,
        // city:msg.city,
        // country:msg.country,
        // province:msg.province,
        // language:msg.language,
        // is_driver:msg.is_driver,
        real_name:msg.real_name,
        phone:msg.phone,
        // birthday:msg.birthday,
    }
    if(msg.id){
        data.id = msg.id;
        return service({
            method: 'post',
            url:'/Admin/User/edit',
            data: data,
        })
    }
}

/**删除司机 */
export const deletDriver = (id) => {
    return service({
        method: 'post',
        url: '/Admin/User/del',
        data:{
            id: id
        }
    })
}

/**获取打卡列表 */
export const getDriverLocaData = (pagePer) => {
    return service({
        method: 'post',
        url: '/Admin/Driver/lists',
        data: {
            phone:pagePer.phone,
            page:pagePer.page+1,
            pagesize:pagePer.size,
        }
    })
}