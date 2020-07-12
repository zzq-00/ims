// 年终考核
import axios from '../libs/axios'
import qs from 'qs'

let modalPrefix = '/hmbms-application'
const api = {
	dailyAssessment: (obj) => {
		return axios.request({
			url: `${modalPrefix}/Achievements/dailyAssessment`,
			data: obj,
			method: 'post'
		})
	}
}
export default api
