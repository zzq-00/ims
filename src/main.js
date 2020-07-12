import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/antd.less'
import {
	DatePicker,
	Button,
	Message,
	Modal,
	Radio,
	Select,
	Option,
	Switch,
	Notice
} from 'iview'
import 'babel-polyfill'
import './assets/theme.less'
import './assets/css/base.less'
import './assets/css/reiview.less'
import { apiList } from './api/apiList'
import axios from '@/libs/axios'

import downloadFileByBase64 from '@/libs/fileDownload.js'
import moment from "moment"
Vue.prototype.$downloadFileByBase64 = downloadFileByBase64
Vue.prototype.$moment = moment
Vue.config.productionTip = false

Vue.use(Antd)

// Ajax
Vue.use({
	install (vue, options) {
		vue.prototype.$axios = axios
		vue.prototype.$apiList = apiList
	}
})


// 设置iview部分全局组件
Vue.component('DatePicker', DatePicker)
Vue.component('Button', Button)
Vue.component('Modal', Modal)
Vue.component('Radio', Radio)
Vue.component('Select', Select)
Vue.component('Option', Option)
Vue.component('i-switch', Switch)
Vue.prototype.$Message = Message
Vue.prototype.$Modal = Modal
Vue.prototype.$Notice = Notice

Vue.config.productionTip = false
/* eslint-disable no-new */
new Vue({
	el: '#app',
	router,
	store,
	axios,
	components: { App },
	template: '<App/>'
})
