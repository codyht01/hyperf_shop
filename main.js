import Vue from 'vue'
import store from './store'
import App from './App'

import Json from './Json' //测试用数据
/**
 *  因工具函数属于公司资产, 所以直接在Vue实例挂载几个常用的函数
 *  所有测试用数据均存放于根目录json.js
 *  
 *  css部分使用了App.vue下的全局样式和iconfont图标，有需要图标库的可以留言。
 *  示例使用了uni.scss下的变量, 除变量外已尽量移除特有语法,可直接替换为其他预处理器使用
 */
const msg = (title, duration = 1500, mask = false, icon = 'none') => {
	//统一提示方便全局修改
	if (Boolean(title) === false) {
		return;
	}
	uni.showToast({
		title,
		duration,
		mask,
		icon
	});
}
const json = type => {
	//模拟异步请求数据
	return new Promise(resolve => {
		setTimeout(() => {
			resolve(Json[type]);
		}, 500)
	})
}

const prePage = () => {
	let pages = getCurrentPages();
	let prePage = pages[pages.length - 2];
	// #ifdef H5
	return prePage;
	// #endif
	return prePage.$vm;
}
const baseurl = "http://192.168.0.88:9501/member/"
const request = (url, data = {}, methods = 'post', header = {}, is_loading = true, loading_msg = '加载中...') => {
	if (Boolean(url) === false) {
		return;
	}
	//查询本地缓存
	let userinfo = uni.getStorageSync('userInfo') || "";
	let that = this;
	if (is_loading) {
		uni.showLoading({
			title: loading_msg,
			mask: true
		});
	}
	header['Access-Token'] = userinfo.token || ""
	return new Promise((resolve, reject) => {
		uni.request({
			method: methods,
			url: baseurl + url,
			data: data,
			header: header,
			dataType: 'json'
		}).then((response) => {
			uni.hideLoading();
			let [error, res] = response;
			switch (res.statusCode) {
				case 426:
					return uni.reLaunch({
						url: '/pages/error/error?msg=网络连接失败&type=no_network'
					})
					break;
				case 403:
					return uni.reLaunch({
						url: '/pages/error/error?msg=网络连接失败&type=403'
					})
					break;
				case 404:
					return uni.reLaunch({
						url: '/pages/error/error?msg=服务器异常&type=404'
					})
					break;
				case 500:
					return uni.reLaunch({
						url: '/pages/error/error?msg=网络连接失败&type=500'
					})
					break;
				case 1000:
					return uni.reLaunch({
						url: '/pages/error/error?msg=商品已下架&type=1000'
					})
					break;
			}
			switch (res.data.code) {
				case 102:
					return uni.$u.toast(res.data.msg)
					break;
				case 909:
					uni.showModal({
						title: '请先登录',
						showCancel: true,
						success(re) {
							if (re.confirm) {
								uni.switchTab({
									url: '/pages/mine/mine'
								})
							}
						}
					})
					break;
				case 1000:
					uni.showModal({
						title: '请先绑定信息',
						showCancel: true,
						success(re) {
							if (re.confirm) {
								uni.switchTab({
									url: '/pages/avatar/avatar'
								})
							}
						}
					})
					break;

			}
			resolve(res.data);
		}).catch(error => {
			let [err, res] = error;
			console.log("err=", err)
			reject(err)
		})
	});
}
Vue.prototype.http = request;
//获取是否登录
const initConfig = (config = {}, is_login = true) => {
	let that = this;
	return new Promise((resolve, reject) => {
		if (is_login) {
			let getInitConfig = ""
			if (Object.keys(config).length > 0 && config.type === 99) {
				getInitConfig = ""
			} else {
				getInitConfig = uni.getStorageSync("userInfo")
			}
			if (!getInitConfig) {
				// #ifdef MP-WEIXIN
				uni.getProvider({
					service: 'oauth',
					success: function(res) {
						if (~res.provider.indexOf('weixin')) {
							uni.login({
								provider: 'weixin',
								scopes: 'auth_base',
								onlyAuthorize: true,
								success: function(loginRes) {
									request('login/check', {
										...loginRes,
										type: 'wx'
									}).then(res => {
										if (res.code === 101) {
											//记录缓存
											store.commit('login', res.data)
											resolve(res.data)
										}
									})
								}
							});
						}
					}
				});
				// #endif
				// #ifdef APP-PLUS
				uni.reLaunch({
					url: '/pages/bindLogin/bindLogin'
				})
				// #endif

			} else {
				resolve(getInitConfig)
			}
		} else {
			resolve([])
		}
	})
}
Vue.prototype.initConfig = initConfig

Vue.config.productionTip = false
Vue.prototype.$fire = new Vue();
Vue.prototype.$store = store;
Vue.prototype.$api = {
	msg,
	json,
	prePage
};

App.mpType = 'app'
import uView from '@/uni_modules/uview-ui'
Vue.use(uView)

const app = new Vue({
	...App
})

app.$mount()