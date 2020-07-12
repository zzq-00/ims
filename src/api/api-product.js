import axios from '../libs/axios'

let modalPrefix = '/hmims-application'
const api = {
	// 所有产品列表
	getAllList: (obj) => {
		return axios.request({
			url: `${modalPrefix}/product/getAllList`,
			data: obj,
			method: 'post'
		})
	},
	// 所有保险产品列表
	queryAllInsProd: (obj) => {
		return axios.request({
			url: `${modalPrefix}/product/queryAllInsProd`,
			data: obj,
			method: 'post'
		})
	},
	// 产品查询
	productList: (obj) => {
		return axios.request({
			url: `${modalPrefix}/product/list`,
			data: obj,
			method: 'post'
		})
	},
	// 产品修改查询详情
	productQueryByEdit: (obj) => {
		return axios.request({
			url: `${modalPrefix}/product/queryByEdit`,
			params: obj,
			method: 'get'
		})
	},
	// 产品新增
	productAdd: (obj) => {
		return axios.request({
			url: `${modalPrefix}/product/add`,
			data: obj,
			method: 'post'
		})
	},
  // 产品修改查询详情
  productQueryByCopy: (obj) => {
    return axios.request({
      url: `${modalPrefix}/product/queryByCopy`,
      params: obj,
      method: 'get'
    })
  },
	// 产品编辑
	productSaveEdit: (obj) => {
		return axios.request({
			url: `${modalPrefix}/product/saveEdit`,
			data: obj,
			method: 'post'
		})
	},
	// 根据产品类型自动生成产品代码
	getNextId: () => {
		return axios.request({
			url: `${modalPrefix}/pservice/getNextId`,
			method: 'post'
		})
	},
	// 根据产品类型自动生成产品代码
	makeCode: (obj) => {
		return axios.request({
			url: `${modalPrefix}/MakeCode/MakeProCode`,
			params: obj,
			method: 'get'
		})
	},
	// 根据产品编码校验是否重复
	checkCode: (Code) => {
		return axios.request({
			url: `${modalPrefix}/product/checkCode?productCode=${Code}`,
			// data: obj,
			method: 'get'
		})
	}, // 根据产品编码校验是否重复
	checkName: (codeName) => {
		return axios.request({
			url: `${modalPrefix}/product/checkName?productName=${codeName}`,
			// data: obj,
			method: 'get'
		})
	},
	checkHealthService: (obj) => {
		return axios.request({
			url: `${modalPrefix}/product/checkHealthService`,
			data: obj,
			method: 'post'
		})
	},
	// 新增按钮全部提交
	commitAdd: (obj) => {
		return axios.request({
			url: `${modalPrefix}/examine/commit/add`,
			data: obj,
			method: 'post'
		})
	},
	// 复制按钮全部提交
	recommit: (obj) => {
		return axios.request({
			url: `${modalPrefix}/examine/commit/recommit`,
			data: obj,
			method: 'post'
		})
	},
	// 修改按钮全部提交
	commitUpdate: (obj) => {
		return axios.request({
			url: `${modalPrefix}/examine/commit/update`,
			data: obj,
			method: 'post'
		})
	},
	// 修改按钮全部提交
	revoke: (obj) => {
		return axios.request({
			url: `${modalPrefix}/examine/revoke`,
			params: obj,
			method: 'get'
		})
	},
	// 进入按钮初始化页面信息获取
	getExamineInfo: (obj) => {
		return axios.request({
			url: `${modalPrefix}/examine/getExamineInfo`,
			params: obj,
			method: 'get'
		})
	},
	// 产品审核 提交
	examineCheck: (obj) => {
		return axios.request({
			url: `${modalPrefix}/examine/check`,
			data: obj,
			method: 'post'
		})
	},
	// 产品审核查询
	examinePublicList: (obj) => {
		return axios.request({
			url: `${modalPrefix}/examine/list/public`,
			data: obj,
			method: 'post'
		})
	},
	// 产品审核查询
	examineSelfList: (obj) => {
		return axios.request({
			url: `${modalPrefix}/examine/list/self`,
			data: obj,
			method: 'post'
		})
	},
	// 产品审核 获取任务
	examinePick: (obj) => {
		return axios.request({
			url: `${modalPrefix}/examine/pick`,
			data: obj,
			method: 'post'
		})
	},
	// 查询产品停售轨迹表
	examineTrace: (obj) => {
		return axios.request({
			url: `${modalPrefix}/examine/queryTrajectory`,
			params: obj,
			method: 'get'
		})
	},
	// 待审批任务公共池-查询
	examineOrderPublicList: (obj) => {
		return axios.request({
			url: `${modalPrefix}/examine/order/list/public`,
			data: obj,
			method: 'post'
		})
	},
	// 待审批任务个人池-查询
	examineOrderSelfList: (obj) => {
		return axios.request({
			url: `${modalPrefix}/examine/order/list/self`,
			data: obj,
			method: 'post'
		})
	},
	// 获取任务
	examineOrderPick: (obj) => {
		return axios.request({
			url: `${modalPrefix}/examine/order/pick`,
			data: obj,
			method: 'post'
		})
	},
	// 产品审批提交
	examineOrderCheck: (obj) => {
		return axios.request({
			url: `${modalPrefix}/examine/order/check`,
			data: obj,
			method: 'post'
		})
	},
	// 通过审核任务编码查询存在表里面的请求报文
	examineQueryByCode: (obj) => {
		return axios.request({
			url: `${modalPrefix}/examine/queryByCode`,
			params: obj,
			method: 'get'
		})
	},
	// 临时获取表格内联
	getDictType: (obj) => {
	  return axios.request({
			url: `${modalPrefix}/dict/getValue/${obj}`,
			method: 'post'
		})
	}
}

export default api
