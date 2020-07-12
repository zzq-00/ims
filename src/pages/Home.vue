<style lang="less">
@import url('../assets/css/public');
.m-inner-app {
  height: 100%;
}
</style>

<template>
	<div class="m-inner-app" >
		<a-layout class="layout">
			<!-- <a-layout-header class="header" :style="{ position: 'fixed', zIndex: 1, width: '100%',height:'100px',background:'#5abd88' }">
				<div class="logo" />
				<span style="font-size: 32px;line-height: 100px;">智能规则引擎配置</span>
			</a-layout-header> -->
			<a-layout-content :style="{ padding: '0 0', marginTop: '0px' }">
				<a-layout-sider :width="256" :style="{ overflow: 'auto', height: '100vh', position: 'fixed', left: 0,textAlign:'left' }">
					<MenuList />
				</a-layout-sider>
				<div class="m-outter-home-container"
					style="background: #fff;margin-left:256px;min-height:800px;">
					<router-view v-if="showType === 'router'" />
				</div>
			</a-layout-content>
		</a-layout>
	</div>
</template>
<script>
import Header from "../components/header/index"
import MenuList from "../components/menuList"
import { mapState } from "vuex"

export default {
	name: "Home",
	data: function () {
		return {
			userName: ""
		}
	},
	components: {
		Header,
		MenuList
	},
	methods: {
		pageChange (value) {
			this.$store.commit("updateState", value)
		},
		showTypeChange (value) {
			this.$store.commit("updateShowType", value)
		},
		// 注销
		logout () { }
	},
	computed: {
		...mapState({
			pageUrl: state => state.pageUrl,
			showType: state => state.showType,
			menuData: state => state.menuData,
			systemData: state => state.systemData,
			systemClassB: state => state.systemClassB
		})
	}
}
</script>
<style lang="less" scoped>
.m-inner-app {
  // text-align: center;
  .ant-layout-sider {
    background: #FFFFFF;
    color: #FFFFFF;
    height: 750px;
  }
  .ant-layout-content {
    background: rgba(16, 142, 233, 1);
    color: #fff;
    min-height: 120px;
  }
  .logo {
	width: 195px;
	height: 91px;
	background: url('../assets/images/header/logo2.jpg') no-repeat center;
	margin: 5px 5px;
	float: left;
  }
}
</style>
