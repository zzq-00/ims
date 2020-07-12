import axios from '../libs/axios'

let modalPrefix = '/hmims-application'
const api = {
	// 服务实施-日常管理 产品列表
	getProductList: (obj) => {
		return axios.request({
			url: `${modalPrefix}/modalInfo/initselect/products`,
			data: obj,
			method: 'post'
		})
	},
	// 服务实施-日常管理 服务列表
	getServiceList: (obj) => {
		return axios.request({
			url: `${modalPrefix}/modalInfo/initselect/services`,
			data: obj,
			method: 'post'
		})
	},
	// 服务实施-日常管理 服务商查询
	pageQueryProvider: (obj) => {
		return axios.request({
			url: `${modalPrefix}/modalInfo/queryPage/sorg`,
			data: obj,
			method: 'post'
		})
	},
	// 服务实施-日常管理 供应商查询
	pageQuerySupplier: (obj) => {
		return axios.request({
			url: `${modalPrefix}/modalInfo/queryPage/supplier`,
			data: obj,
			method: 'post'
		})
	},
	// 服务实施-日常管理-回访问卷管理-新增问题接口 新增
	addQnrQuestion: (obj) => {
		return axios.request({
			url: `${modalPrefix}/qnrQuestion/add`,
			data: obj,
			method: 'post'
		})
	},
	// 服务实施-日常管理-回访问卷管理-新增问题接口 添加公共问题至本问卷
	PubQuestQuestion: (obj) => {
		return axios.request({
			url: `${modalPrefix}/qnrQuestion/add/PubQuest`,
			data: obj,
			method: 'post'
		})
	},
	// 服务实施-日常管理-回访问卷管理- 编辑问题时 查询问题选项接口
	queryQuestionAnswer: (obj) => {
		return axios.request({
			url: `${modalPrefix}/qnrAnswer/add/queryList`,
			data: obj,
			method: 'post'
		})
	},
	// 服务实施-日常管理-回访问卷管理-新增问题接口 新增或更新
	addOrUpdateQuestion: (obj) => {
		return axios.request({
			url: `${modalPrefix}/qnrQuestion/addOrUpdate`,
			data: obj,
			method: 'post'
		})
	},
	// 服务实施-日常管理-回访问卷管理-新增问题接口 删除
	deleteQuestion: (obj) => {
		return axios.request({
			url: `${modalPrefix}/qnrQuestion/delete`,
			params: obj,
			method: 'post'
		})
	},
	// 服务实施-日常管理-回访问卷管理-新增问题接口 生成问题顺序号
	getNextSeqQuestion: (obj) => {
		return axios.request({
			url: `${modalPrefix}/qnrQuestion/getNextSeq`,
			data: obj,
			method: 'post'
		})
	},
	// 服务实施-日常管理-回访问卷管理-新增问题接口 新增问题下拉框查询
	queryListQuestion: (obj) => {
		return axios.request({
			url: `${modalPrefix}/qnrQuestion/queryList`,
			data: obj,
			method: 'post'
		})
	},
	// 服务实施-日常管理-回访问卷管理-新增问题接口 根据问卷ID查询
	queryOneQuestion: (obj) => {
		return axios.request({
			url: `${modalPrefix}/qnrQuestion/queryOne`,
			params: obj,
			method: 'post'
		})
	},
	// 服务实施-日常管理-回访问卷管理-新增问题接口 分页查询
	queryPageQuestion: (obj) => {
		return axios.request({
			url: `${modalPrefix}/qnrQuestion/queryPage`,
			data: obj,
			method: 'post'
		})
	},
	// 服务实施-日常管理-回访问卷管理-新增问题接口 更新
	updateQuestion: (obj) => {
		return axios.request({
			url: `${modalPrefix}/qnrQuestion/update`,
			data: obj,
			method: 'post'
		})
	},
	// 服务实施-日常管理-回访问卷维护 新增
	addQnrInfo: (obj) => {
		return axios.request({
			url: `${modalPrefix}/qnrInfo/add`,
			data: obj,
			method: 'post'
		})
	},
	// 服务实施-日常管理-回访问卷维护 新增或更新
	addOrUpdateQnrInfo: (obj) => {
		return axios.request({
			url: `${modalPrefix}/qnrInfo/addOrUpdate`,
			data: obj,
			method: 'post'
		})
	},
	// 服务实施-日常管理-回访问卷维护 校验问卷的匹配条件与已发布问卷之间是否有交集
	checkRepeatTerm: (obj) => {
		return axios.request({
			url: `${modalPrefix}/qnrInfo/checkRepeatTerm`,
			data: obj,
			method: 'post'
		})
	},
	// 服务实施-日常管理-回访问卷维护 复制
	cloneQnrInfo: (obj) => {
		return axios.request({
			url: `${modalPrefix}/qnrInfo/clone`,
			params: obj,
			method: 'post'
		})
	},
	// 服务实施-日常管理-回访问卷维护 删除
	deleteQnrInfo: (obj) => {
		return axios.request({
			url: `${modalPrefix}/qnrInfo/delete`,
			params: obj,
			method: 'post'
		})
	},
	// 服务实施-日常管理-回访问卷维护 生成问卷编码
	markCodeQnrInfo: (obj) => {
		return axios.request({
			url: `${modalPrefix}/qnrInfo/markCode`,
			data: obj,
			method: 'post'
		})
	},
	// 服务实施-日常管理-回访问卷维护 禁用
	qnrDisableQnrInfo: (obj) => {
		return axios.request({
			url: `${modalPrefix}/qnrInfo/qnrDisable`,
			params: obj,
			method: 'post'
		})
	},
	// 服务实施-日常管理-回访问卷维护 启用
	qnrEnableQnrInfo: (obj) => {
		return axios.request({
			url: `${modalPrefix}/qnrInfo/qnrEnable`,
			params: obj,
			method: 'post'
		})
	},
	// 服务实施-日常管理-回访问卷维护 发布
	qnrReleaseQnrInfo: (obj) => {
		return axios.request({
			url: `${modalPrefix}/qnrInfo/qnrRelease`,
			params: obj,
			method: 'post'
		})
	},
	// 服务实施-日常管理-回访问卷维护 根据问卷信息ID查询问卷信息
	queryOneQnrInfo: (obj) => {
		return axios.request({
			url: `${modalPrefix}/qnrInfo/queryOne`,
			params: obj,
			method: 'post'
		})
	},
	// 服务实施-日常管理-回访问卷预览 根据问卷信息ID查询问卷信息
	qnrInfoQnrInfo: (obj) => {
		return axios.request({
			url: `${modalPrefix}/qnrBuild/buildHtml/qnrInfo`,
			data: obj,
			method: 'post'
		})
	},
	// 服务实施-日常管理-回访问卷维护 根据问卷编码查询问卷信息
	queryOneByCodeQnrInfo: (obj) => {
		return axios.request({
			url: `${modalPrefix}/qnrInfo/queryOneByCode`,
			params: obj,
			method: 'post'
		})
	},
	// 服务实施-日常管理-回访问卷维护 分页查询
	queryPageQnrInfo: (obj) => {
		return axios.request({
			url: `${modalPrefix}/qnrInfo/queryPage`,
			data: obj,
			method: 'post'
		})
	},
	// 服务实施-日常管理-回访问卷维护 更新
	updateQnrInfo: (obj) => {
		return axios.request({
			url: `${modalPrefix}/qnrInfo/update`,
			data: obj,
			method: 'post'
		})
	},
	// 服务实施-日常管理-公共问题管理 新增公共问题
	addPublicQuestion: (obj) => {
		return axios.request({
			url: `${modalPrefix}/publicquestion/add`,
			data: obj,
			method: 'post'
		})
	},
	// 服务实施-日常管理-公共问题管理 新增或更新公共问题
	addOrUpdatePublicQuestion: (obj) => {
		return axios.request({
			url: `${modalPrefix}/publicquestion/addOrUpdate`,
			data: obj,
			method: 'post'
		})
	},
	// 服务实施-日常管理-公共问题管理 根据公共题库编码校验该问题是否属于按钮类型
	checkPaPublicQuestion: (obj) => {
		return axios.request({
			url: `${modalPrefix}/publicquestion/check/PA`,
			data: obj,
			method: 'post'
		})
	},
	// 服务实施-日常管理-公共问题管理 根据公共题库的的名称校验该公共问题是否存在
	checkQuestionNamePublicQuestion: (obj) => {
		return axios.request({
			url: `${modalPrefix}/publicquestion/check/questionName`,
			data: obj,
			method: 'post'
		})
	},
	// 服务实施-日常管理-公共问题管理 根据公共题库编码复制公共问题
	clonePublicQuestion: (obj) => {
		return axios.request({
			url: `${modalPrefix}/publicquestion/clone`,
			params: obj,
			method: 'post'
		})
	},
	// 服务实施-日常管理-公共问题管理 根据公共题库编码删除单个公共问题
	deletePublicQuestion: (obj) => {
		return axios.request({
			url: `${modalPrefix}/publicquestion/delete`,
			params: obj,
			method: 'post'
		})
	}, // 服务实施-日常管理-公共问题管理 根据公共题库的相关字段查询公共问题
	queryListPublicQuestion: (obj) => {
		return axios.request({
			url: `${modalPrefix}/publicquestion/queryList`,
			data: obj,
			method: 'post'
		})
	},
	// 服务实施-日常管理-公共问题管理 公共问题预览
	queryOnePublicQuestion: (obj) => {
		return axios.request({
			url: `${modalPrefix}/publicquestion/queryOne`,
			params: obj,
			method: 'post'
		})
	},
	// 服务实施-日常管理-公共问题管理 根据公共题库编码查询单个公共问题
	buildHtmlPublicQuestion: (obj) => {
		return axios.request({
			url: `${modalPrefix}/qnrBuild/buildHtml/publicQuestion`,
			data: obj,
			method: 'post'
		})
	}, // 服务实施-日常管理-公共问题管理 根据公共题库的相关字段分页查询公共问题
	queryPagePublicQuestion: (obj) => {
		return axios.request({
			url: `${modalPrefix}/publicquestion/queryPage`,
			data: obj,
			method: 'post'
		})
	},
	// 服务实施-日常管理-公共问题管理 更新公共问题
	updatePublicQuestion: (obj) => {
		return axios.request({
			url: `${modalPrefix}/publicquestion/update`,
			data: obj,
			method: 'post'
		})
	},
	// 服务实施-日常管理-回访问卷 问题编辑 修改排序
	updateQuestionaireQuestSeq: (obj) => {
		return axios.request({
			url: `${modalPrefix}/qnrQuestion/updateSeq`,
			data: obj,
			method: 'post'
		})
	},
	// 服务实施-日常管理-回访问卷 根据编码查问卷
	findOneByCode: (obj) => {
		return axios.request({
			url: `${modalPrefix}/qnrInfo/queryOneByCode`,
			params: obj,
			method: 'post'
		})
	}
}

export default api
