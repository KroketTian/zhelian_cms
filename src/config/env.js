/**
 * 配置编译环境和线上环境之间的切换
 * 
 * baseUrl: 域名地址
 * routerMode: 路由模式
 * imgBaseUrl: 图片所在域名地址
 * 
 */

let apiBaseUrl = ''; 
let routerMode = 'hash';
let imgBaseUrl = '';


if (process.env.NODE_ENV == 'development') {
	apiBaseUrl = 'http://order.50niu.com/';
    imgBaseUrl = '/img/';

}else if(process.env.NODE_ENV == 'production'){
	apiBaseUrl = process.env.VUE_APP_API_HOST + '';
    imgBaseUrl = '//elm.cangdu.org/img/';
}else{
	apiBaseUrl = 'http://order.50niu.com/';
	imgBaseUrl = '//elm.cangdu.org/img/';
}

export {
	apiBaseUrl,
	routerMode,
	imgBaseUrl,
}