import axios from "axios";
import qs from "qs";
import {logoutFun} from '../config/mUtils'
import {
    apiBaseUrl
} from './env'
import {
    Loading
} from 'element-ui';
import {
    getToken,refreshToken,deletTokenInStore
} from './mUtils'
import {
    errorMsgMap
} from './msg'
import { Message } from 'element-ui';

/****** 创建axios实例 ******/
const service = axios.create({
    baseURL: apiBaseUrl, // api的base_url
    timeout: 5000 // 请求超时时间
});
let loadingInstance = '';//全屏loading


/****** request拦截器==>对请求参数做处理 ******/
service.interceptors.request.use(config => {
    loadingInstance = Loading.service({ fullscreen: true });
    config.method === 'post' ?
        config.data = qs.stringify({
            ...config.data
        }) :
        config.params = {
            ...config.params
        };
    config.headers['Content-Type'] = 'application/x-www-form-urlencoded';
    return config;
}, error => { //请求错误处理
    loadingInstance = Loading.service({ fullscreen: true });
    Promise.reject(error)
})
/****
 * ** respone拦截器==>对响应做处理 ******/
service.interceptors.response.use(
    response => { //成功请求到数据
        loadingInstance.close();
        if(/^2/.test(response.data.code) || !response.data.code){
            //这里根据后端提供的数据进行对应的处理
            return response.data;
        }else{// 如果接口错误
            setErrorData(response.data)
            return Promise.reject(response)
        }
    },
    error => { //响应错误处理
        loadingInstance.close();
        setErrorData(error)
        return Promise.reject(error)
    }
)
var errorMsg = [
    {code:'200' ,msg:'操作成功',},
    {code:'400' ,msg:'操作失败',},
    {code:'4001',msg:'重新登录',},
    {code:'4002',msg:'id不能为空',},
    {code:'4100',msg:'数据不存在',},
    {code:'4101',msg:'数据重复',},
    {code:'4102',msg:"数据被删除/禁用",},
    {code:'4013',msg:'账号密码不一致',},
    {code:'4014',msg:'传参格式不正确',},
    {code:'4015',msg:'用户账号重复',},
    {code:'4016',msg:'两次密码不一致',},
    {code:'4017',msg:'旧密码不一致',},
    {code:'5001',msg:'请求非法',},
    {code:'6001',msg:'标题不能为空',},
    {code:'6002',msg:'存在有效的子级，不允许删除',},
    {code:'9100',msg:'单号不能为空',},
]
// 处理出错
function setErrorData(error){
    // loadingInstance.close();
    // /**令牌无效 */
    // /**令牌过期 */
    // if(error.response.status === 401 && !isLoginPage){
    //     refreshToken();
    // }
    // /**插入错误信息 */
    // if((error.response.status === 400 && error.response.data.error) || (error.response.status === 401 && isLoginPage)){
    //     let requestUrl = error.response.config.url;
    //     let requestUrlName = requestUrl.split(apiBaseUrl)[1];
    //     let requestMethod = error.response.config.method;
    //     error.response.data.error_description = errorMsgMap.get(requestUrlName+'_'+requestMethod) ? 
    //         errorMsgMap.get(requestUrlName+'_'+requestMethod)[error.response.data.error] : error.response.data.error_description;
    // }
    // /**无权限 */
    // if(error.response.status === 403){
    //     Message.error('该账号无此操作的权限');
    // }
    // /**系统错误 */
    // if(error.response.status === 500){
    //     Message.error('系统错误，请联系管理员');
    // }
    let rep = /#\/login/;
    let isLoginPage = rep.test(window.location.href);
    if(error.code === 4001 && !isLoginPage){
        logoutFun();
    }
    for(let i = 0 ; i < errorMsg.length ; i++){
        if(error.code == errorMsg[i].code){
            error.error_description = errorMsg[i].msg;
        }
    }
}

export default service;