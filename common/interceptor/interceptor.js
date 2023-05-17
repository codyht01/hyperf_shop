//页面白名单
const whiteList = [
	'/bindLogin/bindLogin',
]
//判断是否需要拦截
function hasPermission(url) {
	//请求路径在白名单中直接跳转，或者带有token直接跳转，
	let userinfo = uni.getStorageSync('userInfo') || "";
	for (var i = 0; i < whiteList.length; i++) {
		if (url.indexOf(whiteList[i]) != -1 || userinfo.token ) {
			return true
		}
	}
	return false
}
//拦截
uni.addInterceptor('navigateTo', {
	invoke(e) {
		if (!hasPermission(e.url)) {
			// #ifdef MP-WEIXIN
			uni.navigateTo({
				url:'/pages/avatar/avatar'
			})
			// #endif
			// #ifdef APP-PLUS
			uni.navigateTo({
				url: '/pages/public/login'
			})
			// #endif
			
			return false
		}
		return true
	},
	success(e) {
		console.log(e)
	},
	fail(e) {
		console.log(e)
	}
})

