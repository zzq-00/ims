import axios from '../libs/axios'

let modalPrefix = '/hmims-application'
const api = {
	// 供应商服务列表
	queryDropListSup: (obj) => {
		return axios.request({
			url: `${modalPrefix}/supserv/queryDropList`,
			data: obj,
			method: 'post'
		})
	},
	// 产品服务列表
	queryDropListPro: (obj) => {
		return axios.request({
			url: `${modalPrefix}/proserv/queryDropList`,
			data: obj,
			method: 'post'
		})
	},
	// 分页查询供应商服务
	supservQueryPage: (obj) => {
		return axios.request({
			url: `${modalPrefix}/supserv/queryPage`,
			data: obj,
			method: 'post'
		})
	},
	// 分页查询产品服务
	proservQueryPage: (obj) => {
		return axios.request({
			url: `${modalPrefix}/proserv/queryPage`,
			data: obj,
			method: 'post'
		})
	},
	// 查询供应商服务关系 分页
	supservRelaQueryPage: (obj) => {
		return axios.request({
			url: `${modalPrefix}/supservRela/queryPage`,
			data: obj,
			method: 'post'
		})
	},
	// 查询供应商服务关系 全部
	supservRelaQueryList: (obj) => {
		return axios.request({
			url: `${modalPrefix}/supservRela/queryList`,
			data: obj,
			method: 'post'
		})
	},
	// 保存服务关系
	supservRelaSave: (obj) => {
		return axios.request({
			url: `${modalPrefix}/supservRela/saves`,
			data: obj,
			method: 'post'
		})
	},
	// 删除服务关系
	supservRelaDelete: (obj) => {
		return axios.request({
			url: `${modalPrefix}/supservRela/delete`,
			data: obj,
			method: 'post'
		})
	},
	// 获取产品
	getServiceByProductAll: (obj) => {
		return axios.request({
			url: `${modalPrefix}/serviceNetwork/getServiceByProduceAll`,
			data: obj,
			method: 'post'
		})
	},
	// 获取产品
	getServiceByProduct: (obj) => {
		return axios.request({
			url: `${modalPrefix}/serviceNetwork/getServiceByProduce`,
			data: obj,
			method: 'post'
		})
	},
	// 查询服务商信息
	getProductServiceOrgBy: (obj) => {
		return axios.request({
			url: `${modalPrefix}/serviceNetwork/getProductServiceOrgBy`,
			method: 'post',
			data: obj
		})
	},
	// 插入数据
	getServiceNetworkInsert: (obj) => {
		return axios.request({
			url: `${modalPrefix}/serviceNetwork/getServiceNetworkInsert`,
			method: 'post',
			data: obj
		})
	},
	// 获取模板编码
	getTempletCode: (obj) => {
		return axios.request({
			url: `${modalPrefix}/serviceNetwork/getTempletCode`,
			method: 'post',
			data: obj
		})
	},
	// 服务网络信息查询
	queryServiceNet: (obj) => {
		return axios.request({
			url: `${modalPrefix}/serviceNetwork/queryServiceNet`,
			method: 'post',
			data: obj
		})
	},
	// 产品网络删除
	delServiceNet: (obj) => {
		return axios.request({
			url: `${modalPrefix}/serviceNetwork/delServiceNet`,
			method: 'post',
			data: obj
		})
	},
	// 产品网络全部删除
	allDelServiceNet: (obj) => {
		return axios.request({
			url: `${modalPrefix}/serviceNetwork/allDelServiceNet`,
			method: 'post',
			data: obj
		})
	},

	// 查询模板服务商
	getProvidersTemplet: (obj) => {
		return axios.request({
			url: `${modalPrefix}/templet/getProviders`,
			method: 'post',
			data: obj
		})
	},
	// 查询服务相关信息
	getServiceTemplet: (obj) => {
		return axios.request({
			url: `${modalPrefix}/templet/getService`,
			method: 'post',
			data: obj
		})
	},
	// 查询服务网络模版
	getSorgTemplet: (obj) => {
		return axios.request({
			url: `${modalPrefix}/templet/getSorg`,
			method: 'post',
			data: obj
		})
	},
	// 服务网络模版 导出
	getTemplet: (obj) => {
		return axios.request({
			url: `${modalPrefix}/templet/getTemplet`,
			method: 'post',
			data: obj
		})
	},
	// 服务网络添加B页面获取模板编码
	getTempletCode2: (obj) => {
		return axios.request({
			url: `${modalPrefix}/templet/getTempletCode`,
			method: 'post',
			data: obj
		})
	},
	// 服务网络模版下载
	downloadTemplet: (obj) => {
		return axios.request({
			url: `${modalPrefix}/templet/download`,
			method: 'post',
			data: obj
		})
	},
	// 服务网络模版导入
	importTemplet: (obj) => {
		return axios.request({
			url: `${modalPrefix}/templet/import`,
			method: 'post',
			data: obj
		})
	},
	// 服务网络模版显示
	showTemplet: (obj) => {
		return axios.request({
			url: `${modalPrefix}/templet/templetShow`,
			method: 'post',
			data: obj
		})
	},
	// 服务网络模版保存
	saveTemplet: (obj) => {
		return axios.request({
			url: `${modalPrefix}/templet/insert`,
			method: 'post',
			data: obj
		})
	},
	// 服务网络模版更新
	updateTemplet: (obj) => {
		return axios.request({
			url: `${modalPrefix}/templet/update`,
			method: 'post',
			data: obj
		})
	},
	// 服务网络模版删除
	delTemplet: (obj) => {
		return axios.request({
			url: `${modalPrefix}/templet/delTemplet`,
			method: 'post',
			data: obj
		})
	},
	// 服务网络信息导出
	exportServiceNet: (obj) => {
		return axios.request({
			url: `${modalPrefix}/serviceNetwork/exportServiceNet`,
			method: 'post',
			data: obj
		})
	},
	// 服务网络明细信息导出
	exportServiceNetDetail: (obj) => {
		return axios.request({
			url: `${modalPrefix}/templet/getTempletDetail`,
			method: 'post',
			data: obj
		})
	},
	// 服务网络信息导入--上载
	import: (obj) => {
		return axios.request({
			url: `${modalPrefix}/networkImport/import`,
			method: 'post',
			data: obj
		})
	},
	// 服务网络信息导入--模板下载
	download: (obj) => {
		return axios.request({
			url: `${modalPrefix}/networkImport/download`,
			method: 'post',
			data: obj
		})
	},
	// 服务网络模板导入--上载
	importForUseTemplet: (obj) => {
		return axios.request({
			url: `${modalPrefix}/networkImport/importForUseTemplet`,
			method: 'post',
			data: obj
		})
	},
	// 服务网络模板导入--模板下载
	downloadForUseTemplet: (obj) => {
		return axios.request({
			url: `${modalPrefix}/networkImport/downloadForUseTemplet`,
			method: 'post',
			data: obj
		})
	},
	// 保存产品网络
	saveTemplets: (obj) => {
		return axios.request({
			url: `${modalPrefix}/templet/save`,
			method: 'post',
			data: obj
		})
	}
}

export default api
