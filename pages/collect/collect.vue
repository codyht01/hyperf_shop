<template>
	<view class="wappter">
		<view class="load_page" v-if="loading_page">
			<u-loading-page :loading="loading_page"></u-loading-page>
		</view>
		<view class="content" v-else>
			<view class="goods-list" v-if="goodsList.length > 0">
				<view v-for="(item, index) in goodsList" :key="index" class="goods-item" @click="navToDetailPage(item)">
					<view class="image-wrapper">
						<image :src="item.url" mode="aspectFill"></image>
					</view>
					<text class="title clamp">{{item.title}}</text>
					<view class="price-box">
						<text class="price">{{item.price}}</text>
						<text>已售 {{item.number}}</text>
					</view>
				</view>
			</view>
			<view class="empty" v-else>
				<u-empty mode="data" :icon="'/static/empty.png'"></u-empty>
			</view>
			<view class="nomore" v-if="goodsList.length >= 10">
				<u-loadmore :status="status" :loading-text="loadingText" :loadmore-text="loadmoreText"
					:nomore-text="nomoreText" />
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				loading_page: true,
				goodsList: [],
				limit: 10,
				page: 1,
				status: 'loadmore',
				loadingText: '努力加载中',
				loadmoreText: '轻轻上拉',
				nomoreText: '实在没有了'
			}
		},
		onLoad() {
			this.initConfig().then(res => {
				this.loadData()
			})
		},
		onReachBottom() {
			if (this.status != 'nomore') {
				this.loading_page = true
				this.loadData('add')
			}
		},
		onPullDownRefresh() {
			this.loading_page = true
			this.loadData()
		},
		methods: {
			async loadData(type = '') {
				this.status = 'loading'
				this.http('collect/index').then(res => {
					if (res.code) {
						uni.stopPullDownRefresh()
						if (type == 'add') {
							res.data.data.forEach(item => {
								this.goodsList.push(item)
							})
						} else {
							this.goodsList = res.data.data
						}
						if (res.data.current_page >= res.data.last_page) {
							this.status == 'nomore'
						} else {
							this.status = 'loadmore'
						}
						this.loading_page = false
					}
				})
			},
			//详情
			navToDetailPage(item) {
				if(item.error_goods != 1){
					let id = item.sku_id;
					uni.navigateTo({
						url: `/pages/product/product?id=${id}`
					})
				}else{
					uni.$u.toast('该商品已经失效');
				}
			},
		}
	}
</script>

<style lang="scss">
	/* 商品列表 */
	.goods-list {
		display: flex;
		flex-wrap: wrap;
		padding: 0 30upx;
		background: #fff;

		.goods-item {
			display: flex;
			flex-direction: column;
			width: 48%;
			padding-bottom: 40upx;

			&:nth-child(2n+1) {
				margin-right: 4%;
			}
		}

		.image-wrapper {
			width: 100%;
			height: 330upx;
			border-radius: 3px;
			overflow: hidden;

			image {
				width: 100%;
				height: 100%;
				opacity: 1;
			}
		}

		.title {
			font-size: $font-lg;
			color: $font-color-dark;
			line-height: 80upx;
		}

		.price-box {
			display: flex;
			align-items: center;
			justify-content: space-between;
			padding-right: 10upx;
			font-size: 24upx;
			color: $font-color-light;
		}

		.price {
			font-size: $font-lg;
			color: $uni-color-primary;
			line-height: 1;

			&:before {
				content: '￥';
				font-size: 26upx;
			}
		}
	}

	.nomore {
		display: flex;
		padding: 10rpx 0;
		background-color: #fff;
	}

	.empty {
		width: 100%;
		height: 500rpx;
		display: flex;
		justify-content: center;
		align-items: center;
	}
</style>