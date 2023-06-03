<template>
	<view class="content">
		<view v-if="addressList.length > 0">
			<view class="list b-b" v-for="(item, index) in addressList" :key="index" @click="checkAddress(item)">
				<view class="wrapper">
					<view class="address-box">
						<text v-if="item.is_default" class="tag">默认</text>
						<text class="address">{{ item.addressName }} {{ item.area }}</text>
					</view>
					<view class="u-box">
						<text class="name">{{ item.name }}</text>
						<text class="mobile">{{ item.mobile }}</text>
					</view>
				</view>
				<text class="yticon icon-bianji" @click.stop="addAddress('edit', item)"></text>
			</view>
			<view class="nomore" v-if="addressList.length >= limit">
				<u-loadmore :status="status" :loading-text="loadingText" :loadmore-text="loadmoreText"
					:nomore-text="nomoreText" />
			</view>
		</view>

		<view class="empty" v-else>
			<u-empty icon="/static/empty.png" text="地址为空"></u-empty>
		</view>

		<button class="add-btn" @click="addAddress('add')">新增地址</button>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				source: 0,
				addressList: [],
				status: 'loadmore',
				loadingText: '努力加载中',
				loadmoreText: '轻轻上拉',
				nomoreText: '实在没有了',
				limit: 10,
				page: 1
			};
		},
		onLoad(option) {
			this.source = option.source;

		},
		onShow() {
			this.addressList = []
			this.initConfig().then(()=>{
				this.loadData();
			})
		},
		onReachBottom() {
			if (this.status != 'nomore') {
				this.page++;
				this.loadData('add');
			}
		},
		onPullDownRefresh() {
			this.status = 'loadmore';
			this.page = 1;
			this.loadData();
		},
		methods: {
			async loadData(type = '') {
				this.status = 'loading';
				this.http('address/index').then(res => {
					if (res.code) {
						setTimeout(() => {
							uni.stopPullDownRefresh()
						}, 500)
						if (this.addressList.length == 0) {
							this.addressList = res.data.data;
						} else {
							if (type == 'add') {
								res.data.data.forEach((item) => {
									this.addressList.push(item);
								});
							} else {
								this.addressList = res.data.data;
							}
						}

						if (res.data.current_page >= res.data.last_page) {
							this.status = 'nomore';
						} else {
							this.status = 'loadmore';
						}

					}
				});
				console.log(this.addressList)
			},
			//选择地址
			checkAddress(item) {
				if (this.source == 1) {
					//this.$api.prePage()获取上一页实例，在App.vue定义
					this.$api.prePage().addressData = item;
					uni.navigateBack();
				}
			},
			addAddress(type, item) {
				uni.navigateTo({
					url: `/pages/address/addressManage?type=${type}&data=${JSON.stringify(item)}`
				});
			},
			//添加或修改成功之后回调
			refreshList(data, type) {
				//添加或修改后事件，这里直接在最前面添加了一条数据，实际应用中直接刷新地址列表即可
				this.addressList.unshift(data);

				console.log(data, type);
			}
		}
	};
</script>

<style lang="scss">
	page {
		padding-bottom: 120upx;
	}

	.content {
		position: relative;
	}

	.list {
		display: flex;
		align-items: center;
		padding: 20upx 30upx;
		background: #fff;
		position: relative;
	}

	.wrapper {
		display: flex;
		flex-direction: column;
		flex: 1;
	}

	.address-box {
		display: flex;
		align-items: center;

		.tag {
			font-size: 24upx;
			color: $base-color;
			margin-right: 10upx;
			background: #fffafb;
			border: 1px solid #ffb4c7;
			border-radius: 4upx;
			padding: 4upx 10upx;
			line-height: 1;
		}

		.address {
			font-size: 30upx;
			color: $font-color-dark;
		}
	}

	.u-box {
		font-size: 28upx;
		color: $font-color-light;
		margin-top: 16upx;

		.name {
			margin-right: 30upx;
		}
	}

	.icon-bianji {
		display: flex;
		align-items: center;
		height: 80upx;
		font-size: 40upx;
		color: $font-color-light;
		padding-left: 30upx;
	}

	.add-btn {
		position: fixed;
		left: 30upx;
		right: 30upx;
		bottom: 16upx;
		z-index: 95;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 690upx;
		height: 80upx;
		font-size: 32upx;
		color: #fff;
		background-color: $base-color;
		border-radius: 10upx;
		box-shadow: 1px 2px 5px rgba(219, 63, 96, 0.4);
	}

	.nomore {
		padding: 20rpx 0;
	}

	.empty {
		width: 100%;
		display: flex;
		justify-content: center;
		margin-top: 200rpx;
	}
</style>