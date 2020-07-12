import axios from '../libs/axios'

let modalPrefix = '/hmbms-application'
const api = {
// 查询日志列表
	queryLog: (obj) => {
		return axios.request({
			url: `${modalPrefix}/getoperationLog/searchLogByTime`,
			data: obj,
			method: 'post'
		})
	},
	// 下载选中日志
	downLog: (obj) => {
		return axios.request({
			url: `${modalPrefix}/getoperationLog/downloadLogByEvetNo`,
			data: obj,
			method: 'post'
		})
	}
}
export default api
