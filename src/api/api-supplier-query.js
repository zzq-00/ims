import axios from '../libs/axios'
import qs from 'qs'

let modalPrefix = '/hmims-application'
const api = {
	// 信息查询页面-查询机构详细信息
	getOrgBasicInfos: (obj) => {
		return axios.request({
			url: `${modalPrefix}/supInfoSearch/getOrgBasicInfos`,
			data: obj,
			method: 'post'
		})
	},
	// 信息查询页面-查询医生详细信息
	searchDocList: (obj) => {
		return axios.request({
			url: `${modalPrefix}/supInfoSearch/searchDocList`,
			data: obj,
			method: 'post'
		})
	},
	// 信息查询页面-查询药店详细信息
	searchMemberOfPhaList: (obj) => {
		return axios.request({
			url: `${modalPrefix}/supInfoSearch/searchMemberOfPhaList`,
			data: obj,
			method: 'post'
		})
	},
	// 信息查询页面-查询人员详细信息
	searchMemberList: (obj) => {
		return axios.request({
			url: `${modalPrefix}/supInfoSearch/searchMemberList`,
			data: obj,
			method: 'post'
		})
	},
	// 信息查询页面-查询科室列表信息
	searchDeptList: (obj) => {
		return axios.request({
			url: `${modalPrefix}/supInfoSearch/searchDeptList`,
			data: obj,
			method: 'post'
		})
	},
	// 信息查询页面-查询科室下人员信息
	getDoctorsForDept: (obj) => {
		return axios.request({
			url: `${modalPrefix}/supInfoSearch/getDoctorsForDept`,
			data: obj,
			method: 'post'
		})
	},
	// 信息查询页面-查询服务列表信息
	searchSerList: (obj) => {
		return axios.request({
			url: `${modalPrefix}/supInfoSearch/searchSerList`,
			data: obj,
			method: 'post'
		})
	},
	// 查询服务
	searchDocSerList: (obj) => {
		return axios.request({
			url: `${modalPrefix}/supInfoSearch/searchDocSerList`,
			data: obj,
			method: 'post'
		})
	},
	// 查询医生
	getPhaBasicInfos: (obj) => {
		return axios.request({
			url: `${modalPrefix}/supInfoSearch/getPhaBasicInfos`,
			data: obj,
			method: 'post'
		})
	},
	// 删除医生
	deleteDoctor: (obj) => {
		return axios.request({
			url: `${modalPrefix}/supModify/delDoctorInfo`,
			data: obj,
			method: 'post'
		})
	},
	// 通过机构编码查询医生信息表格
	queryDoctorTable: (obj) => {
		return axios.request({
			url: `${modalPrefix}/newSupInfoSearch/searchDoctorTable`,
			data: obj,
			method: 'post'
		})
	},
	// 获取医生详情
	getDoctorInfo: (obj) => {
		return axios.request({
			url: `${modalPrefix}/newSupInfoSearch/getDocInfo`,
			data: obj,
			method: 'post'
		})
	},
	// 保存科室
	saveDept: (obj) => {
		return axios.request({
			url: `${modalPrefix}/supModify/saveDepartment`,
			data: obj,
			method: 'post'
		})
	},
	// 通过机构编码查询科室信息表格
	queryDeptTable: (obj) => {
		return axios.request({
			url: `${modalPrefix}/newSupInfoSearch/searchDepartmentTable`,
			data: obj,
			method: 'post'
		})
	},
	// 获取科室详情
	getDeptInfo: (obj) => {
		return axios.request({
			url: `${modalPrefix}/newSupInfoSearch/getDeptInfo`,
			data: obj,
			method: 'post'
		})
	},
	// 删除科室
	deleteDept: (obj) => {
		return axios.request({
			url: `${modalPrefix}/supModify/delDeptData`,
			data: obj,
			method: 'post'
		})
	},
	// 查询所属科室列表
	querySelectDeptList: (obj) => {
		return axios.request({
			url: `${modalPrefix}/newSupInfoSearch/getSelectDept`,
			data: obj,
			method: 'post'
		})
	},
	// 保存机构关联
	saveServProvider: (obj) => {
		return axios.request({
			url: `${modalPrefix}/supModify/addServiceProvider`,
			data: obj,
			method: 'post'
		})
	},
	// 机构成员导出--医生【中介机构】
	exportOrgDocAgency: (obj) => {
		return axios.request({
			url: `${modalPrefix}/supInfoExport/exportOrgDocAgency`,
			data: obj,
			method: 'post'
		})
	},
	// 机构成员导出--机构【中介机构】
	exportOrgOrg: (obj) => {
		return axios.request({
			url: `${modalPrefix}/supInfoExport/exportOrgOrg`,
			data: obj,
			method: 'post'
		})
	},
	// 机构成员导出--药店【中介机构】
	exportOrgPhaAgency: (obj) => {
		return axios.request({
			url: `${modalPrefix}/supInfoExport/exportOrgPhaAgency`,
			data: obj,
			method: 'post'
		})
	},
	// 机构成员导出--药店【中介机构】
	exportOrgDept: (obj) => {
		return axios.request({
			url: `${modalPrefix}/supInfoExport/exportOrgDept`,
			data: obj,
			method: 'post'
		})
	},
	// 科室人员导出--医生信息
	exportDoctorsForDept: (obj) => {
		return axios.request({
			url: `${modalPrefix}/supInfoExport/exportDoctorsForDept`,
			data: obj,
			method: 'post'
		})
	},
	// 机构成员导出--服务信息
	exportService: (obj) => {
		return axios.request({
			url: `${modalPrefix}/supInfoExport/exportService`,
			data: obj,
			method: 'post'
		})
	}
}

export default api
