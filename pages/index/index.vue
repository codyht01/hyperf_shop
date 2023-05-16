<template>
	<view class="container">
		<template v-for="item in tempList">
			<commoditysearch :data="item" v-if="item.component == 'commoditysearch'"></commoditysearch>
		</template>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				tempList: [],
				type: 'commoditysearch'
			}
		},
		computed: {

		},
		methods: {

		},
		onLoad() {
			this.tempList = JSON.parse(
				'[{"component":"commoditysearch","text":"商品搜索","type":"1-1","active":false,"style":"commoditysearchstyle","setStyle":{"text":"商品搜索","heights":28,"position":0,"sweep":false,"borderRadius":0,"textPosition":0,"backgroundColor":"rgb(249, 249, 249)","borderColor":"rgb(255, 255, 255)","textColor":"rgb(150, 151, 153)","hotords":[]}},{"component":"commoditysearch","text":"商品搜索","type":"1-1","active":false,"style":"commoditysearchstyle","setStyle":{"text":"商品搜索","heights":28,"position":0,"sweep":false,"borderRadius":0,"textPosition":0,"backgroundColor":"rgb(249, 249, 249)","borderColor":"rgb(255, 255, 255)","textColor":"rgb(150, 151, 153)","hotords":[]}},{"component":"pictureads","text":"图片广告","type":"1-3","active":false,"style":"pictureadsstyle","setStyle":{"text":"图片广告","swiperType":0,"borderRadius":0,"pageMargin":0,"imageMargin":0,"pagingType":0,"rowindividual":2,"imageList":[]}},{"component":"graphicnavigation","text":"图文导航","type":"1-4","active":true,"style":"graphicnavigationstyle","setStyle":{"text":"图文导航","imageList":[],"navigationType":0,"imgStyle":0,"backgroundColor":"rgb(255, 255, 255)","textColor":"rgb(0, 0, 0)","borderRadius":0,"showSize":5,"textHeight":24,"textSize":12,"bgImg":""}}]'
			)
		}
	}
</script>

<style lang="scss">
</style>