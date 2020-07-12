import Axios from "axios"
import {
	message
} from 'ant-design-vue'
import baseURL from "../api/url"
import qs from 'qs'

let urlPrefix = '/hmms'
// let urlPrefix = ''
let token = ""
console.log('process.env', process.env.NODE_ENV)
if (process.env.NODE_ENV === 'development') {
	urlPrefix = 'apis' + urlPrefix
} else {
	let query = location.href.split('?')[1]
	token = qs.parse(query, {
		ignoreQueryPrefix: true
	})["token"]
}

class HttpRequest {
	constructor () {
		this.options = {
			method: "",
			url: ""
		}
		// 存储请求队列
		this.queue = {}
	}
	// 销毁请求实例
	destroy (url) {
		delete this.queue[url]
		const queue = Object.keys(this.queue)
		return queue.length
	}
	// 请求拦截
	interceptors (instance, url) {
		// 添加请求拦截器
		instance.interceptors.request.use(
			config => {
				// console.log("headers====", config)
				// config.headers['token'] = ''
				// 在发送请求之前做些什么
				return config
			},
			error => {
				// 对请求错误做些什么
				return Promise.reject(error)
			}
		)

		// 添加响应拦截器
		instance.interceptors.response.use(
			res => {
				let {
					data
				} = res
				const is = this.destroy(url)
				if (!is) {
					setTimeout(() => {
						// Spin.hide()
					}, 500)
				}
				if (data.status !== undefined && data.status !== 0) {
					let errorMsg = data.statusText || data.error
					if (errorMsg) message.error(errorMsg)
					return Promise.reject(data)
				}

				return data
			},
			error => {
				message.error("服务请求超时，稍后重试")
				// 对响应错误做点什么
				return Promise.reject(error)
			}
		)
	}
	// 创建实例
	create () {
		let conf = {
			baseURL: baseURL,
			// timeout: 2000,
			withCredentials: true,
			headers: {
				"Content-Type": "application/json; charset=utf-8",
				"X-URL-PATH": location.pathname,
				"token": token
			}
		}
		return Axios.create(conf)
	}
	// 合并请求实例
	mergeReqest (instances = []) {
		//
	}
	// 请求实例
	request (options) {
		var instance = this.create()
		let url = urlPrefix + options.url
		if (url.indexOf("?") > 0) {
			url += "&_t=" + Math.random()
		} else {
			url += "?_t=" + Math.random()
		}
		options.url = url

		this.interceptors(instance, options.url)
		this.queue[options.url] = instance
		return instance(options)
	}

	// 健管中心使用
	post (url, data, config) {
		var instance = this.create()
		url = urlPrefix + url
		if (url.indexOf("?") > 0) {
			url += "&_t=" + Math.random()
		} else {
			url += "?_t=" + Math.random()
		}

		this.interceptors(instance, url)
		this.queue[url] = instance
		return instance.post(url, data, config)
	}
}

const AxiosRequest = new HttpRequest()
export default AxiosRequest
