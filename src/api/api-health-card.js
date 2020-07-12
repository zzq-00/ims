import axios from '../libs/axios'

let modalPrefix = '/hmims-application'
let modalhmbmsPrefix = '/hmbms-application'
const api = {
	// 保存健管卡
	saveCard: (obj) => {
		return axios.request({
			url: `${modalPrefix}/TDocDefAPI/TDocDefAdd`,
			data: obj,
			method: 'post'
		})
	},
	// 更新健管卡
	updateCard: (obj) => {
		return axios.request({
			url: `${modalPrefix}/TDocDefAPI/updateTDocDef`,
			data: obj,
			method: 'post'
		})
	},
	// 查询健管卡表格
	queryCardList: (obj) => {
		return axios.request({
			url: `${modalPrefix}/TDocDefAPI/queryDocDefList`,
			data: obj,
			method: 'post'
		})
	},
	// 导出健管卡
	exportCardList: (obj) => {
		return axios.request({
			url: `${modalPrefix}/TDocDefAPI/exportDocDefExcle`,
			data: obj,
			method: 'post'
			// responseType: 'arraybuffer'
		})
	},
	// 查询健管卡编码列表
	getCardCodeList: (obj) => {
		return axios.request({
			url: `${modalPrefix}/TDocDefAPI/getDocCode`,
			data: obj,
			method: 'post'
		})
	},
	// 获取批次号
	getBatchnoList: (obj) => {
		return axios.request({
			url: `${modalhmbmsPrefix}/ConfirmDataRecordAPI/getList`,
			// data: obj,
			method: 'post'
		})
	},
	// 查询库存预警
	queryWarningList: (obj) => {
		return axios.request({
			url: `${modalPrefix}/TDocDefAPI/queryDocWarningList`,
			data: obj,
			method: 'post'
		})
	},
	// 保存库存预警设置
	saveWarning: (obj) => {
		return axios.request({
			url: `${modalPrefix}/TDocDefAPI/saveWarning`,
			data: obj,
			method: 'post'
		})
	},
	// 查询人员联系信息列表
	queryPersonMail: (obj) => {
		return axios.request({
			url: `${modalPrefix}/TDocDefAPI/queryPersonMailList`,
			data: obj,
			method: 'post'
		})
	},
	// 保存人员联系信息
	savePersonMail: (obj) => {
		return axios.request({
			url: `${modalPrefix}/TDocDefAPI/saveChangePersonMail`,
			data: obj,
			method: 'post'
		})
	},
	// 查询健管卡产品关联列表
	queryCardProduct: (obj) => {
		return axios.request({
			url: `${modalPrefix}/DocProductAPI/docProductQuery`,
			data: obj,
			method: 'post'
		})
	},
	// 查询健管卡产品编码
	getProductCodeList: (obj) => {
		return axios.request({
			url: `${modalPrefix}/DocProductAPI/queryProductCode`,
			data: obj,
			method: 'post'
		})
	},
	// 查询健管卡产品关联
	getCardProductList: (obj) => {
		return axios.request({
			url: `${modalPrefix}/docDefined/cascadCpTree`,
			data: obj,
			method: 'post'
		})
	},
	// 保存健管卡产品关联
	saveCardProduct: (obj) => {
		return axios.request({
			url: `${modalPrefix}/DocProductAPI/addDocProduct`,
			data: obj,
			method: 'post'
		})
	},
	// 更新健管卡产品关联
	updateCardProduct: (obj) => {
		return axios.request({
			url: `${modalPrefix}/DocProductAPI/updateDocProduct`,
			data: obj,
			method: 'post'
		})
	},
	// 健管卡状态查询-连号
	queryCardStatusConstant: (obj) => {
		return axios.request({
			url: `${modalPrefix}/DocStatusAPI/query`,
			data: obj,
			method: 'post'
		})
	},
	// 健管卡状态查询-单号
	queryCardStatusSingle: (obj) => {
		return axios.request({
			url: `${modalPrefix}/DocStatusAPI/querySingle`,
			data: obj,
			method: 'post'
		})
	},
	// 健管卡状态查询-连号
	exportCardStatusConstant: (obj) => {
		return axios.request({
			url: `${modalPrefix}/DocStatusAPI/export`,
			data: obj,
			method: 'post'
		})
	},
	// 健管卡状态查询-单号
	exportCardStatusSingle: (obj) => {
		return axios.request({
			url: `${modalPrefix}/DocStatusAPI/exportSingle`,
			data: obj,
			method: 'post'
		})
	},
	// 健管卡明细导出
	exportCardDetail: (obj) => {
		return axios.request({
			url: `${modalPrefix}/DocDetailInfoAPI/export`,
			data: obj,
			method: 'post'
		})
	},
	// 健管卡明细查询
	queryCardDetail: (obj) => {
		return axios.request({
			url: `${modalPrefix}/DocDetailInfoAPI/query`,
			data: obj,
			method: 'post'
		})
	},
	// 健管卡明细查询-协议
	queryCardDetailAgreement: (obj) => {
		return axios.request({
			url: `${modalPrefix}/DocDetailInfoAPI/getAgreeByCardNo`,
			data: obj,
			method: 'post'
		})
	},
	// 健管卡明细查询-交费费用
	queryCardDetailCostFee: (obj) => {
		return axios.request({
			url: `${modalPrefix}/DocDetailInfoAPI/getCostTableInfo`,
			data: obj,
			method: 'post'
		})
	},
	// 健管卡明细查询-产品信息
	queryCardDetailProduct: (obj) => {
		return axios.request({
			url: `${modalPrefix}/DocDetailInfoAPI/getProductTableInfo`,
			data: obj,
			method: 'post'
		})
	},
	// 健管卡明细查询-服务包信息
	queryCardDetailServicePackage: (obj) => {
		return axios.request({
			url: `${modalPrefix}/DocDetailInfoAPI/getServicePackgeTableInfo`,
			data: obj,
			method: 'post'
		})
	},
	// 健管卡明细查询-服务信息
	queryCardDetailService: (obj) => {
		return axios.request({
			url: `${modalPrefix}/DocDetailInfoAPI/getServiceTableInfo`,
			data: obj,
			method: 'post'
		})
	},
	// 健管卡明细查询-协议轨迹
	queryCardDetailAgreementTrack: (obj) => {
		return axios.request({
			url: `${modalPrefix}/DocDetailInfoAPI/getAgreementTraceTableInfo`,
			data: obj,
			method: 'post'
		})
	},
	// 健管卡明细查询-服务实施
	queryCardDetailServiceImplement: (obj) => {
		return axios.request({
			url: `${modalPrefix}/DocDetailInfoAPI/getServiceImplementTableInfo`,
			data: obj,
			method: 'post'
		})
	},
	// 健管卡发放查询
	queryCardSend: (obj) => {
		return axios.request({
			url: `${modalPrefix}/DocGrantCalAfterAPI/queryDocByUser`,
			data: obj,
			method: 'post'
		})
	},
	// 健管卡发放-领用人查询
	queryReceiver: (obj) => {
		return axios.request({
			url: `${modalPrefix}/DocGrantCalAfterAPI/queryRecipient`,
			data: obj,
			method: 'post'
		})
	},
	// 健管卡发放-查询第三方机构
	queryThirdOrgAll: (obj) => {
		return axios.request({
			url: `${modalPrefix}/DocGrantCalAfterAPI/queryThirdOrgAll`,
			data: obj,
			method: 'post'
		})
	},
	// 健管卡发放-保存
	saveCardGrant: (obj) => {
		return axios.request({
			url: `${modalPrefix}/DocGrantCalAfterAPI/grantToDoc`,
			data: obj,
			method: 'post'
		})
	},
	// 健管卡售出登记查询
	soldCardQuery: (obj) => {
		return axios.request({
			url: `${modalPrefix}/DocGrantCalAfterAPI/queryGrant`,
			data: obj,
			method: 'post'
		})
	},
	// 健管卡售出登记保存
	soldCardSave: (obj) => {
		return axios.request({
			url: `${modalPrefix}/DocGrantCalAfterAPI/register`,
			data: obj,
			method: 'post'
		})
	},
	// 健管卡发放审核查询
	sendCardApproveQuery: (obj) => {
		return axios.request({
			url: `${modalPrefix}/DocGrantCalAfterAPI/queryDocGrantVerify`,
			data: obj,
			method: 'post'
		})
	},
	// 健管卡发放审核-保存
	sendCardApprove: (obj) => {
		return axios.request({
			url: `${modalPrefix}/DocGrantCalAfterAPI/docApplyAssess2`,
			data: obj,
			method: 'post'
		})
	},
	// 健管卡发放审核-全部保存
	sendCardAllApprove: (obj) => {
		return axios.request({
			url: `${modalPrefix}/DocGrantCalAfterAPI/docApplyAssess1`,
			data: obj,
			method: 'post'
		})
	},
	// 健管卡发放查询
	querySellCard: (obj) => {
		return axios.request({
			url: `${modalPrefix}/DocGrantCalAfterAPI/queryGrant2`,
			data: obj,
			method: 'post'
		})
	},
	// 健管卡发放导出卡号卡密
	exportSellCardPass: (obj) => {
		return axios.request({
			url: `${modalPrefix}/DocGrantCalAfterAPI/exportGrant`,
			data: obj,
			method: 'post'
		})
	},
	// 健管卡发放导出查询
	exportSellCardQuery: (obj) => {
		return axios.request({
			url: `${modalPrefix}/DocGrantCalAfterAPI/exportQueryResult`,
			data: obj,
			method: 'post'
		})
	},
	// 健管卡领用审核查询
	receiveCardApproveQuery: (obj) => {
		return axios.request({
			url: `${modalPrefix}/docApply/queryAssessDocApply`,
			data: obj,
			method: 'post'
		})
	},
	// 健管卡领用审核-保存
	receiveCardApprove: (obj) => {
		return axios.request({
			url: `${modalPrefix}/docApply/docApplyAssess2`,
			data: obj,
			method: 'post'
		})
	},
	// 健管卡领用审核-全部保存
	receiveCardAllApprove: (obj) => {
		return axios.request({
			url: `${modalPrefix}/docApply/docApplyAssess1`,
			data: obj,
			method: 'post'
		})
	},
	// 健管卡领用查询-查询
	receiveCardQuery: (obj) => {
		return axios.request({
			url: `${modalPrefix}/docApply/queryDocApply`,
			data: obj,
			method: 'post'
		})
	},
	// 健管卡领用查询-导出
	receiveCardQueryExport: (obj) => {
		return axios.request({
			url: `${modalPrefix}/docApply/export`,
			data: obj,
			method: 'post'
		})
	},
	// 健管卡领用查询-项目列表
	getBudgetItemList: (obj) => {
		return axios.request({
			url: `${modalPrefix}/DocDetailListAPI/getALLItemCode`,
			data: obj,
			method: 'post'
		})
	},
	// 健管卡领用申请-项目列表
	getBudgetItemListByDoc: (obj) => {
		return axios.request({
			url: `${modalPrefix}/docApply/queryItemSelect`,
			data: obj,
			method: 'post'
		})
	},
	// 健管卡领用查询-项目详情
	getBudgetItemDetail: (obj) => {
		return axios.request({
			url: `${modalPrefix}/docApply/queryOrgByItem`,
			data: obj,
			method: 'post'
		})
	},
	// 健管卡领用查询-项目列表
	budgetItemShowForDoc: (obj) => {
		return axios.request({
			url: `${modalPrefix}/docApply/budgetItemShowForDoc`,
			data: obj,
			method: 'post'
		})
	},
	// 健管卡库存查询及领用申请-查询
	stockQuery: (obj) => {
		return axios.request({
			url: `${modalPrefix}/docApply/queryDocByUser`,
			data: obj,
			method: 'post'
		})
	},
	// 健管卡库存查询及领用申请-提交
	stockApplySumit: (obj) => {
		return axios.request({
			url: `${modalPrefix}/docApply/addDocApply`,
			data: obj,
			method: 'post'
		})
	},
	// 健管卡库存查询及领用申请-最小单证号
	selectDocMinNoById: (obj) => {
		return axios.request({
			url: `${modalPrefix}/docApply/selectDocMinNoById`,
			data: obj,
			method: 'post'
		})
	},
	// 健管卡库存查询及领用申请-获取docId
	checkDocId: (obj) => {
		return axios.request({
			url: `${modalPrefix}/docApply/checkDocId`,
			data: obj,
			method: 'post'
		})
	},
	// 健管卡库存查询及领用申请-卡日期更新为项目日期
	updateDocApply: (obj) => {
		return axios.request({
			url: `${modalPrefix}/docApply/updateDocApply`,
			data: obj,
			method: 'post'
		})
	},
	// 健管卡库存查询及领用申请-获取起始卡号
	queryCardNo: (obj) => {
		return axios.request({
			url: `${modalPrefix}/docApply/queryCardNo`,
			data: obj,
			method: 'post'
		})
	},
	// 自定义健管卡生成卡号密码-查询
	custCardQuery: (obj) => {
		return axios.request({
			url: `${modalPrefix}/docDefined/queryImportCamList`,
			data: obj,
			method: 'post'
		})
	},
	// 自定义健管卡生成卡号密码-导出
	custCardExport: (obj) => {
		return axios.request({
			url: `${modalPrefix}/docDefined/exportCam`,
			data: obj,
			method: 'post'
		})
	},
	// 自定义健管卡生成卡号密码-生成卡密
	custCardGenerateNoPass: (obj) => {
		return axios.request({
			url: `${modalPrefix}/docDefined/createCam`,
			data: obj,
			method: 'post'
		})
	},
	// 上传作废建管卡
	importDocCancel: (obj) => {
		return axios.request({
			url: `${modalPrefix}/docCancel/importDocCancel`,
			data: obj,
			method: 'post',
			// responseType: 'arraybuffer',
			headers: { 'Content-Type': 'multipart/form-data' }
		})
	},
	// 导入模版下载
	download: (obj) => {
		return axios.request({
			url: `${modalPrefix}/docCancel/download`,
			data: obj,
			method: 'post'
		})
	},
	// 错误清单下载
	exportDocCancel: (obj) => {
		return axios.request({
			url: `${modalPrefix}/docCancel/exportDocCancel`,
			data: obj,
			method: 'post'
		})
	},
	// 第三方健管卡导入入库-上传建管卡
	importDocThirdParty: (obj) => {
		return axios.request({
			url: `${modalPrefix}/docThirdParty/importDocThirdParty`,
			data: obj,
			method: 'post',
			// responseType: 'arraybuffer',
			headers: { 'Content-Type': 'multipart/form-data' }
		})
	},
	// 第三方健管卡导入入库-导入模版下载
	thirtyDownload: (obj) => {
		return axios.request({
			url: `${modalPrefix}/docThirdParty/download`,
			data: obj,
			method: 'post'
		})
	},
	// 第三方健管卡导入入库-错误清单下载
	exportDocThirdParty: (obj) => {
		return axios.request({
			url: `${modalPrefix}/docThirdParty/exportDocThirdParty`,
			data: obj,
			method: 'post'
		})
	}
}

export default api
