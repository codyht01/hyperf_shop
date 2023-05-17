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
			this.tempList = [{
				component:'commoditysearch'
			}]
		}
	}
</script>

<style lang="scss">
</style>