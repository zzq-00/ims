import axios from '../libs/axios'

let modalPrefix = '/hmims-application'
const api = {
	// 保存编辑数据
	updateDocDef: (obj) => {
		return axios.request({
			url: `${modalPrefix}/TDocDefAPI/updateTDocDef`,
			data: obj,
			method: 'post'
		})
	},
	//
	exportDocDefExcle: (obj) => {
		return axios.request({
			url: `${modalPrefix}/TDocDefAPI/exportDocDefExcle`,
			data: obj,
			method: 'post'
		})
	}
}

export default api
