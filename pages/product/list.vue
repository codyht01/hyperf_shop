<template>
	<view class="content">
		<view class="navbar" :style="{position:headerPosition,top:headerTop}">
			<view class="nav-item" :class="{current: filterIndex === 0}" @click="tabClick(0)">
				综合排序
			</view>
			<view class="nav-item" :class="{current: filterIndex === 1}" @click="tabClick(1)">
				销量优先
			</view>
			<view class="nav-item" :class="{current: filterIndex === 2}" @click="tabClick(2)">
				<text>价格</text>
				<view class="p-box">
					<text :class="{active: priceOrder === 1 && filterIndex === 2}" class="yticon icon-shang"></text>
					<text :class="{active: priceOrder === 2 && filterIndex === 2}" class="yticon icon-shang xia"></text>
				</view>
			</view>
			<text class="cate-item yticon icon-fenlei1" @click="toggleCateMask('show')" v-if="cateId != 0"></text>
		</view>
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
		<view class="nomore"  v-if="goodsList.length >= 10">
			<u-loadmore :status="status" :loading-text="loadingText" :loadmore-text="loadmoreText"
				:nomore-text="nomoreText" />
		</view>
		<view class="cate-mask" :class="cateMaskState===0 ? 'none' : cateMaskState===1 ? 'show' : ''"
			@click="toggleCateMask">
			<view class="cate-content" @click.stop.prevent="stopPrevent" @touchmove.stop.prevent="stopPrevent">
				<scroll-view scroll-y class="cate-list">
					<view v-for="item in cateList" :key="item.id">
						<view class="cate-item b-b two">{{item.title}}</view>
						<view v-for="tItem in item.children" :key="tItem.id" class="cate-item b-b"
							:class="{active: tItem.id==cateId}" @click="changeCate(tItem)">
							{{tItem.title}}
						</view>
					</view>
				</scroll-view>
			</view>
		</view>

	</view>
</template>

<script>
	export default {
		components: {
			// uniLoadMore
		},
		data() {
			return {
				cateMaskState: 0, //分类面板展开状态
				headerPosition: "fixed",
				headerTop: "0px",
				filterIndex: 0,
				cateId: 0, //已选三级分类id
				priceOrder: 0, //1 价格从低到高 2价格从高到低
				cateList: [],
				goodsList: [],
				whereData: {
					limit: 10,
					page: 1,
					order_type: '',
					order_value: ''
				},
				status: 'loadmore',
				loadingText: '努力加载中',
				loadmoreText: '轻轻上拉',
				nomoreText: '实在没有了'
			};
		},

		onLoad(options) {
			// #ifdef H5
			this.headerTop = document.getElementsByTagName('uni-page-head')[0].offsetHeight + 'px';
			// #endif
			// fid sid tid
			this.cateId = options.tid;
			this.loadCateList(options.sid, options.tid);
			this.goodsList = []
			this.loadData();
		},
		onPageScroll(e) {
			//兼容iOS端下拉时顶部漂移
			if (e.scrollTop >= 0) {
				this.headerPosition = "fixed";
			} else {
				this.headerPosition = "absolute";
			}
		},
		//下拉刷新
		onPullDownRefresh() {
			this.loadData('refresh');
		},
		//加载更多
		onReachBottom() {
			if (this.status != 'nomore') {
				this.status = 'loading'
				this.whereData.page++
				this.loadData('add');
			}

		},
		methods: {
			/**
			 * 加载分类
			 * @param {Object} sid 第二级id
			 * @param {Object} tid 第三级id
			 */
			async loadCateList(sid, tid) {
				let that = this
				this.http("category/getOneToAll/" + parseInt(sid)).then(res => {
					if (res.code) {
						that.cateList = res.data
					}
				})
			},
			//加载商品 ，带下拉刷新和上滑加载
			async loadData(type = '', loading) {
				console.log(type)
				let that = this
				if (this.status != 'nomore') {
					this.status = 'loading'
					that.http('goods/index', {
						...this.whereData,
						cate_id: parseInt(this.cateId)
					}).then(res => {
						uni.hideLoading()
						if (res.code) {
							if (type == '') {
								this.goodsList = res.data.data
							} else if (type == 'add') {
								res.data.data.forEach(item => {
									this.goodsList.push(item)
								})

							} else if (type === 'refresh') {
								this.goodsList = res.data.data
							}
							if (res.data.current_page >= res.data.last_page) {
								this.status = "nomore"
							} else {
								this.status = "loadmore"
							}
						}
					})
				}

				// if (type === 'refresh') {
				// 	this.goodsList = [];
				// }
				// //筛选，测试数据直接前端筛选了
				// if (this.filterIndex === 1) {
				// 	goodsList.sort((a, b) => b.sales - a.sales)
				// }
				// if (this.filterIndex === 2) {
				// 	goodsList.sort((a, b) => {
				// 		if (this.priceOrder == 1) {
				// 			return a.price - b.price;
				// 		}
				// 		return b.price - a.price;
				// 	})
				// }
				// this.goodsList = this.goodsList.concat(goodsList);

				// //判断是否还有下一页，有是more  没有是nomore(测试数据判断大于20就没有了)
				// this.loadingType = this.goodsList.length > 20 ? 'nomore' : 'more';
				// if (type === 'refresh') {
				// 	if (loading == 1) {
				// 		uni.hideLoading()
				// 	} else {
				// 		uni.stopPullDownRefresh();
				// 	}
				// }
			},
			//筛选点击
			tabClick(index) {
				console.log(this.filterIndex,index)
				this.status = 'loadmore'
				if (this.filterIndex === index && index !== 2) {
					return;
				}
				this.filterIndex = index;
				if (index === 2) {
					this.priceOrder = this.priceOrder === 1 ? 2 : 1;
					this.whereData.order_type = 'price'
					if (this.priceOrder == 1) {
						this.whereData.order_value = 'asc'
					} else if (this.priceOrder == 2) {
						this.whereData.order_value = 'desc'
					} else {
						this.whereData.order_value = ''
					}
				} else {
					this.priceOrder = 0;
				}
				uni.pageScrollTo({
					duration: 300,
					scrollTop: 0
				})
				this.goodsList = [];
				if (index == 0) {
					this.whereData.order_type = ''
				} else if (index == 1) {
					this.whereData.order_type = 'number'
				}
				this.loadData('', 1);
			},
			//显示分类面板
			toggleCateMask(type) {
				let timer = type === 'show' ? 10 : 300;
				let state = type === 'show' ? 1 : 0;
				this.cateMaskState = 2;
				setTimeout(() => {
					this.cateMaskState = state;
				}, timer)
			},
			//分类点击
			changeCate(item) {
				this.cateId = item.id;
				this.toggleCateMask();
				uni.pageScrollTo({
					duration: 300,
					scrollTop: 0
				})
				this.goodsList = []
				this.status = 'loading'
				this.loadData('refresh', 1);
				uni.showLoading({
					title: '正在加载'
				})
			},
			//详情
			navToDetailPage(item) {
				//测试数据没有写id，用title代替
				let id = item.sku_id;
				uni.navigateTo({
					url: `/pages/product/product?id=${id}`
				})
			},
			stopPrevent() {}
		},
	}
</script>

<style lang="scss">
	page,
	.content {
		background: $page-color-base;
	}

	.content {
		padding-top: 96upx;
	}

	.navbar {
		position: fixed;
		left: 0;
		top: var(--window-top);
		display: flex;
		width: 100%;
		height: 80upx;
		background: #fff;
		box-shadow: 0 2upx 10upx rgba(0, 0, 0, .06);
		z-index: 10;

		.nav-item {
			flex: 1;
			display: flex;
			justify-content: center;
			align-items: center;
			height: 100%;
			font-size: 30upx;
			color: $font-color-dark;
			position: relative;

			&.current {
				color: $base-color;

				&:after {
					content: '';
					position: absolute;
					left: 50%;
					bottom: 0;
					transform: translateX(-50%);
					width: 120upx;
					height: 0;
					border-bottom: 4upx solid $base-color;
				}
			}
		}

		.p-box {
			display: flex;
			flex-direction: column;

			.yticon {
				display: flex;
				align-items: center;
				justify-content: center;
				width: 30upx;
				height: 14upx;
				line-height: 1;
				margin-left: 4upx;
				font-size: 26upx;
				color: #888;

				&.active {
					color: $base-color;
				}
			}

			.xia {
				transform: scaleY(-1);
			}
		}

		.cate-item {
			display: flex;
			justify-content: center;
			align-items: center;
			height: 100%;
			width: 80upx;
			position: relative;
			font-size: 44upx;

			&:after {
				content: '';
				position: absolute;
				left: 0;
				top: 50%;
				transform: translateY(-50%);
				border-left: 1px solid #ddd;
				width: 0;
				height: 36upx;
			}
		}
	}

	/* 分类 */
	.cate-mask {
		position: fixed;
		left: 0;
		top: var(--window-top);
		bottom: 0;
		width: 100%;
		background: rgba(0, 0, 0, 0);
		z-index: 95;
		transition: .3s;

		.cate-content {
			width: 630upx;
			height: 100%;
			background: #fff;
			float: right;
			transform: translateX(100%);
			transition: .3s;
		}

		&.none {
			display: none;
		}

		&.show {
			background: rgba(0, 0, 0, .4);

			.cate-content {
				transform: translateX(0);
			}
		}
	}

	.cate-list {
		display: flex;
		flex-direction: column;
		height: 100%;

		.cate-item {
			display: flex;
			align-items: center;
			height: 90upx;
			padding-left: 30upx;
			font-size: 28upx;
			color: #555;
			position: relative;
		}

		.two {
			height: 64upx;
			color: #303133;
			font-size: 30upx;
			background: #f8f8f8;
		}

		.active {
			color: $base-color;
		}
	}

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