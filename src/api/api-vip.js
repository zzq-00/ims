import axios from '../libs/axios'

let modalPrefix = '/hmims-application'
let modalPrefix2 = '/hmbms-application'
const api = {
	// 推荐人编码校验
	refereecodeCheck: (agentCode) => {
		return axios.request({
			url: `${modalPrefix}/VipInsureAdd/checkRefereecode`,
			params: {agentCode},
			method: 'post'
		})
	},
	getCardTypeList () {
		return axios.request({
			url: `${modalPrefix}/VipInsureAdd/getCardTypeList`,
			method: 'post'
		})
	},
	getVipSysparam: (sysparamId) => {
		return axios.request({
			url: `${modalPrefix}/VipInsureAdd/getVipSysparam`,
			params: {sysparamId},
			method: 'post'
		})
	},
	// 查询交叉渠道的业务员信息
	uniagentcodeCheck: (obj) => {
		return axios.request({
			url: `${modalPrefix}/VipInsureAdd/queryUniAgentInfo`,
			data: obj,
			method: 'post'
		})
	},
	// 获取中介公司信息
	queryAgentCom: (obj) => {
		return axios.request({
			url: `${modalPrefix}/VipStoreValue/query`,
			data: obj,
			method: 'post'
		})
	},
	// 查询产品缴费列表
	queryVipInsureList: (obj) => {
		return axios.request({
			url: `${modalPrefix}/VipInsureList/queryInsureList`,
			data: obj,
			method: 'post'
		})
	},

	// 查看详细投保信息
	getInsureInfo: (obj) => {
		return axios.request({
			url: `${modalPrefix}/VipInsureList/getInsureInfo`,
			data: obj,
			method: 'post'
		})
	},
	// 投保更新信息
	updateInsureInfo: (obj) => {
		return axios.request({
			url: `${modalPrefix}/VipInsureList/updateInsureInfo`,
			data: obj,
			method: 'post'
		})
	},
	// 保存投保信息
	saveInsureInfo: (obj) => {
		return axios.request({
			url: `${modalPrefix}/VipInsureAdd/saveInsureInfo`,
			data: obj,
			method: 'post'
		})
	},
	// 打印票据投保信息
	vipInsurePrint: (obj) => {
		return axios.request({
			url: `${modalPrefix}/VipInsureAdd/vipInsurePrint`,
			data: obj,
			method: 'post'
		})
	},
	vipInsurePrintCom: (obj) => {
		return axios.request({
			url: `${modalPrefix}/VipInsureAdd/vipInsurePrintCom`,
			data: obj,
			method: 'post'
		})
	},
	// 储值申请-打印票据
	vipStorePrint: (obj) => {
		return axios.request({
			url: `${modalPrefix}/VipStoreValue/storeApplPrint`,
			data: obj,
			method: 'post'
		})
	},
	// 储值申请-打印团单票据
	vipStorePrintCom: (obj) => {
		return axios.request({
			url: `${modalPrefix}/VipStoreValue/storeApplPrintCom`,
			data: obj,
			method: 'post'
		})
	},
	// 缴费管理删除信息
	insureDelete: (insureId) => {
		return axios.request({
			url: `${modalPrefix}/VipInsureList/doDelete`,
			params: {insureId},
			method: 'post'
		})
	},
	// 储值确认
	insureAppleConfirm: (obj) => {
		return axios.request({
			url: `${modalPrefix}/VipInsureList/appleConfirm`,
			data: obj,
			method: 'post'
		})
	},
	// 查询银行列表
	queryAccountCodeList: () => {
		return axios.request({
			url: `${modalPrefix}/VipInsureList/queryAccountCodeList`,
			method: 'post'
		})
	},

	// 管理式保单状态查询
	queryByCommon: (obj) => {
		return axios.request({
			url: `${modalPrefix}/GsContinfo/queryByCommon`,
			data: obj,
			method: 'post'
		})
	},
	// 送万家保单查询
	queryByDirectSales: (obj) => {
		return axios.request({
			url: `${modalPrefix}/GsContinfo/query`,
			data: obj,
			method: 'post'
		})
	},
	// 送万家销售查询
	queryReceiveCardInfo: (obj) => {
		return axios.request({
			url: `${modalPrefix}/GsContinfo/queryReceiveCardInfo`,
			data: obj,
			method: 'post'
		})
	},
	// 送万家保单查询导出
	directSalesExport: (obj) => {
		return axios.request({
			url: `${modalPrefix}/GsContinfo/export`,
			data: obj,
			method: 'post'
		})
	},
	// 团险管理--修改一卡通支付密码-查询
	queryUpdatePwdAccountInfo: (obj) => {
		return axios.request({
			url: `${modalPrefix}/UpdatePwd/queryAccountInfo`,
			data: obj,
			method: 'post'
		})
	},
	// 团险管理--修改一卡通支付密码-修改密码
	resetPwdUpdatePwd: (obj) => {
		return axios.request({
			url: `${modalPrefix}/UpdatePwd/resetPwd`,
			data: obj,
			method: 'post'
		})
	},
	// 团险管理--修改一卡通支付密码-发送验证码
	sendYzmcode: (obj) => {
		return axios.request({
			url: `${modalPrefix}/VipRelatedImport/sendYzmcode`,
			data: obj,
			method: 'post'
		})
	},
	// 查询-会员账户列表
	queryVipStoreValueAccountInfo: (obj) => {
		return axios.request({
			url: `${modalPrefix}/VipStoreValue/queryAccountInfo`,
			data: obj,
			method: 'post'
		})
	},
	// 校验推荐人工号
	checkVipStoreValueRefereecode: (refereecode) => {
		return axios.request({
			url: `${modalPrefix}/VipStoreValue/checkRefereecode`,
			params: { refereecode },
			method: 'post'
		})
	},
	// 会员卡激活
	cardActive: (obj) => {
		return axios.request({
			url: `${modalPrefix}/VIPAccountQuery/cardActive`,
			data: obj,
			method: 'post'
		})
	},
	// 查询会员账户
	queryImageUploadAccountInfo: (obj) => {
		return axios.request({
			url: `${modalPrefix}/ImageUpload/queryAccountInfo`,
			data: obj,
			method: 'post'
		})
	},
	// 查询会员购买列表
	queryImageUploadWithContno: (obj) => {
		return axios.request({
			url: `${modalPrefix}/ImageUpload/queryWithContno`,
			data: obj,
			method: 'post'
		})
	},
	// 查询图片上传信息表
	queryImageUpload: (obj) => {
		return axios.request({
			url: `${modalPrefix}/ImageUpload/query`,
			data: obj,
			method: 'post'
		})
	},
	// 查看图片
	queryImageUploadImage: (id) => {
		return axios.request({
			url: `${modalPrefix}/ImageUpload/queryImage`,
			params: { id },
			method: 'post'
		})
	},
	// 删除图片
	deleteImageUploadVipImagepath: (ids) => {
		return axios.request({
			url: `${modalPrefix}/ImageUpload/deleteVipImagepath`,
			params: { ids },
			method: 'post'
		})
	},
	// 上传
	uploadImageUploadVipImagepath: (obj) => {
		return axios.request({
			url: `${modalPrefix}/ImageUpload/uploadVipImagepath`,
			data: obj,
			method: 'post',
			headers: { 'Content-Type': 'multipart/form-data' }
		})
	},
	// 上传到核心
	uploadImageUploadToHx: (obj) => {
		return axios.request({
			url: `${modalPrefix}/ImageUpload/uploadToHx`,
			data: obj,
			method: 'post'
		})
	},
	// 查询-待发卡列表
	queryForSend: (obj) => {
		return axios.request({
			url: `${modalPrefix}/CardBind/queryForSend`,
			data: obj,
			method: 'post'
		})
	},
	// 保存-发卡信息
	saveVipSendcardForSend: (obj) => {
		return axios.request({
			url: `${modalPrefix}/CardBind/saveVipSendcardForSend`,
			data: obj,
			method: 'post'
		})
	},
	// 打印票据
	printSendCard: (obj) => {
		return axios.request({
			url: `${modalPrefix}/CardBind/printSendCard`,
			data: obj,
			method: 'post'
		})
	},
	// 查询-自领邮寄列表
	queryForSendPost: (obj) => {
		return axios.request({
			url: `${modalPrefix}/VipSendCardPost/queryForSendPost`,
			data: obj,
			method: 'post'
		})
	},
	// 查询代领取列表
	queryOtherSendPost: (obj) => {
		return axios.request({
			url: `${modalPrefix}/VipSendCardPost/queryOtherSendPost`,
			data: obj,
			method: 'post'
		})
	},
	// 保存-自领邮寄列表
	saveVipSendcardForSendPost: (obj) => {
		return axios.request({
			url: `${modalPrefix}/VipSendCardPost/saveVipSendcardForSendPost`,
			data: obj,
			method: 'post'
		})
	},
	// 保存-代领邮寄列表
	saveVipSendcardForSendPostOther: (obj) => {
		return axios.request({
			url: `${modalPrefix}/VipSendCardPost/saveVipSendcardForSendPostOther`,
			data: obj,
			method: 'post'
		})
	},
	// 导出-邮寄地址
	exportVipSendcardForSendPost: (obj) => {
		return axios.request({
			url: `${modalPrefix}/VipSendCardPost/export`,
			data: obj,
			method: 'post'
		})
	},
	// 查询产品列表
	queryProductInfo: (obj) => {
		return axios.request({
			url: `${modalPrefix}/VipProductList/queryProductInfo`,
			data: obj,
			method: 'post'
		})
	},
	// 单个产品详情
	getVipProductbaseById: (vipProductbaseId) => {
		return axios.request({
			url: `${modalPrefix}/VipProductList/getVipProductbaseById`,
			params: { vipProductbaseId },
			method: 'post'
		})
	},
	// 查询服务列表
	queryServiceInfo: () => {
		return axios.request({
			url: `${modalPrefix}/VipProductList/queryServiceInfo`,
			method: 'post'
		})
	},
	// 删除产品
	deleteVipProductbase: (obj) => {
		return axios.request({
			url: `${modalPrefix}/VipProductList/deleteVipProductbase`,
			data: obj,
			method: 'post'
		})
	},
	// 新增更新产品
	saveVipProductbase: (obj) => {
		return axios.request({
			url: `${modalPrefix}/VipProductList/saveVipProductbase`,
			data: obj,
			method: 'post'
		})
	},
	// 团险管理--部分领取管理查询
	queryVipWithDrawApply: (obj) => {
		return axios.request({
			url: `${modalPrefix}/VipWithDrawApply/query`,
			data: obj,
			method: 'post'
		})
	},
	// 团单部分领取-查询  //url: `${modalPrefix2}/VipAccountAPI/queryAccountInfo`,
	queryAccountInfo: (obj) => {
		return axios.request({
			url: `${modalPrefix}/VipStoreValue/queryAccountInfo`,
			data: obj,
			method: 'post'
		})
	},
	// 团单部分领取-提现
	withdrawalApply: (obj) => {
		return axios.request({
			url: `${modalPrefix2}/VipWithDrawApply/withdrawalApply`,
			data: obj,
			method: 'post'
		})
	},
	// 团险管理--部分领取管理查询
	queryWithdrawalMoney: (obj) => {
		return axios.request({
			url: `${modalPrefix2}/VipWithDrawApply/queryWithdrawalMoney`,
			data: obj,
			method: 'post'
		})
	},
	// 团险部分领取
	updateStatusVipWithDrawApply: (obj) => {
		return axios.request({
			url: `${modalPrefix}/VipWithDrawApply/updateStatus`,
			data: obj,
			method: 'post'
		})
	},
	// 团险部分领取校验
	checkWithdrawapply: (obj) => {
		return axios.request({
			url: `${modalPrefix}/VipWithDrawApply/checkWithdrawapply`,
			data: obj,
			method: 'post'
		})
	},
	updatePrtStatus: (obj) => {
		return axios.request({
			url: `${modalPrefix}/VipWithDrawApply/updatePrtstatus`,
			data: obj,
			method: 'post'
		})
	},
	// 团险部分领取打印
	printWithdrawapply: (obj) => {
		return axios.request({
			url: `${modalPrefix}/VipWithDrawApply/printVipWithDrawApply`,
			data: obj,
			method: 'post'
		})
	},
	// 附属人-查询会员信息
	queryRelatedAccountInfo: (obj) => {
		return axios.request({
			url: `${modalPrefix}/VipRelatedImport/queryAccountInfo`,
			data: obj,
			method: 'post'
		})
	},
	// 查询附属人列表
	queryVipRelated: (obj) => {
		return axios.request({
			url: `${modalPrefix}/VipRelatedImport/query`,
			data: obj,
			method: 'post'
		})
	},
	// 修改附属人信息
	updateVipRelated: (obj) => {
		return axios.request({
			url: `${modalPrefix}/VipRelatedImport/updateVipAccountrelated`,
			data: obj,
			method: 'post'
		})
	},
	// 删除附属人
	delVipRelated: (ids) => {
		return axios.request({
			url: `${modalPrefix}/VipRelatedImport/deleteVipAccountrelatedByIds`,
			params: { ids },
			method: 'post'
		})
	},
	// 查询附属人上传文件
	queryDSUploadInfo: (obj) => {
		return axios.request({
			url: `${modalPrefix}/VipRelatedImport/queryDSUploadInfo`,
			data: obj,
			method: 'post'
		})
	},
	// 附属人上传文件
	uploadRelatedFile: (obj) => {
		return axios.request({
			url: `${modalPrefix}/VipRelatedImport/uploadRelatedFile`,
			data: obj,
			method: 'post',
			headers: { 'Content-Type': 'multipart/form-data' }
		})
	},
	// 附属人错误下载
	downloadErrorFromServer: (vipFilepathId) => {
		return axios.request({
			url: `${modalPrefix}/VipRelatedImport/downloadErrorFromServer`,
			params: {vipFilepathId},
			method: 'post'
		})
	},
	// 附属人导入
	importRelatedfile: (obj) => {
		return axios.request({
			url: `${modalPrefix}/VipRelatedImport/importRelatedfile`,
			data: obj,
			method: 'post'
		})
	},

	// 试销计划套餐退款
	doRefundForFixed: (accountid) => {
		return axios.request({
			url: `${modalPrefix}/VipRefundList/doRefund`,
			params: {accountid},
			method: 'post'
		})
	},
	// 账户储值确认-查询
	queryStoreValueConfirm: (obj) => {
		return axios.request({
			url: `${modalPrefix}/StoreValueConfirm/query`,
			data: obj,
			method: 'post'
		})
	},
	// 账户储值确认-确认
	StoreValueConfirm: (obj) => {
		return axios.request({
			url: `${modalPrefix}/StoreValueConfirm/appleConfirm`,
			data: obj,
			method: 'post'
		})
	},
	// 账户储值确认-删除
	deleteStoreValue: (id) => {
		return axios.request({
			url: `${modalPrefix}/StoreValueConfirm/deleteVipStoreApply`,
			params: {id},
			method: 'post'
		})
	},
	// 查询已购买健管服务列表
	queryPurchasedserviceManagapi: (obj) => {
		return axios.request({
			url: `${modalPrefix}/purchasedserviceManagapi/query`,
			data: obj,
			method: 'post'
		})
	},
	// 取消交易
	deleteVipshoppingorder: (id) => {
		return axios.request({
			url: `${modalPrefix}/purchasedserviceManagapi/deleteVipshoppingorder`,
			params: {id},
			method: 'post'
		})
	},
	// 批量支付结果查询
	queryBatchpayList: (obj) => {
		return axios.request({
			url: `${modalPrefix2}/VipBatchpayResult/query`,
			data: obj,
			method: 'post'
		})
	},
	// 为理赔提供的查询账户信息
	queryAccountForClaim: (obj) => {
		return axios.request({
			url: `${modalPrefix}/vipShoppingOrderAdd/queryAccountForClaim`,
			data: obj,
			method: 'post'
		})
	},
	// 健管服务商品信息查询
	queryVipShoppingInfo: (obj) => {
		return axios.request({
			url: `${modalPrefix}/vipShoppingOrderAdd/queryVipShoppingInfo`,
			data: obj,
			method: 'post'
		})
	},
	// 保存购买健管服务订单信息
	saveVipShoppingOrder: (obj) => {
		return axios.request({
			url: `${modalPrefix}/vipShoppingOrderAdd/saveVipShoppingOrder`,
			data: obj,
			method: 'post'
		})
	},
	// 获取最小折扣信息
	findDiscountrate: (vipid) => {
		return axios.request({
			url: `${modalPrefix}/vipShoppingOrderAdd/fandDiscountrate`,
			params: { vipid },
			method: 'post'
		})
	},
	// 团体购买查询列表
	querySOUploadInfo: (obj) => {
		return axios.request({
			url: `${modalPrefix}/grouppurchaseApi/querySOUploadInfo`,
			data: obj,
			method: 'post'
		})
	},
	// 会员消费记录查询
	qureyFLowDetailList: (obj) => {
		return axios.request({
			url: `${modalPrefix}/VIPAccountQuery/qureyFLowDetailList`,
			data: obj,
			method: 'post'
		})
	},
	// 明细信息查询
	qureyProductFlowDetail: (obj) => {
		return axios.request({
			url: `${modalPrefix}/VIPAccountQuery/qureyProductFlowDetail`,
			data: obj,
			method: 'post'
		})
	},
	// 会员账户信息查询
	queryAccountInfoVipAccount: (obj) => {
		return axios.request({
			url: `${modalPrefix}/VipStoreValue/queryAccountInfo`,
			data: obj,
			method: 'post'
		})
	},
	// 会员账户信息查询(新)
	queryAccountByRelated: (obj) => {
		return axios.request({
			url: `${modalPrefix2}/VipAccountAPI/queryAccountByRelated`,
			data: obj,
			method: 'post'
		})
	},
	// 会员账户信息选项卡-卡类型CodeList查询
	queryVipCardType: () => {
		return axios.request({
			url: `${modalPrefix2}/VipCardType/queryVipCardType`,
			method: 'post'
		})
	},
	// 会员账户信息选项卡-会员级别CodeList查询
	queryVipGradeType: () => {
		return axios.request({
			url: `${modalPrefix2}/vipGradeType/queryVipGradeType`,
			method: 'post'
		})
	},
	// 会员信息变更已发短信查询
	getVipSendMessageList: (obj) => {
		return axios.request({
			url: `${modalPrefix}/VIPAccountQuery/getVipSendMessageList`,
			data: obj,
			method: 'post'
		})
	},
	// 会员信息变更重新发送
	saveVipSendMessageByVipId: (obj) => {
		return axios.request({
			url: `${modalPrefix}/VIPAccountQuery/saveVipSendMessageByVipId`,
			data: obj,
			method: 'post'
		})
	},
	// 会员卡券信息查询分页（点击查询结果列表-卡卷数）
	queryCouponInfoByAccid: (obj) => {
		return axios.request({
			url: `${modalPrefix}/VIPAccountQuery/queryCouponInfoByAccid`,
			data: obj,
			method: 'post'
		})
	},
	// 会员账户附属人查询分页（点击查询结果列表-附属人）
	queryVIPAccountQuery: (obj) => {
		return axios.request({
			url: `${modalPrefix}/VIPAccountQuery/query`,
			data: obj,
			method: 'post'
		})
	},
	// 根据账号ID查询服务信息（点击查询结果列表-会员级别）
	queryServiceByAccid: (obj) => {
		return axios.request({
			url: `${modalPrefix}/VIPAccountQuery/queryServiceByAccid`,
			data: obj,
			method: 'post'
		})
	},
	// 积分流水查询分页（点击查询结果列表-积分）
	queryPointByAccid: (obj) => {
		return axios.request({
			url: `${modalPrefix}/VIPAccountQuery/queryPointByAccid`,
			data: obj,
			method: 'post'
		})
	},
	// 团体购买导入
	importSOFile: (obj) => {
		return axios.request({
			url: `${modalPrefix}/grouppurchaseApi/importSOFile`,
			data: obj,
			method: 'post'
		})
	},
	// 团体购买上传文件
	uploadSOFile: (obj) => {
		return axios.request({
			url: `${modalPrefix}/grouppurchaseApi/uploadSOFile`,
			data: obj,
			method: 'post'
		})
	},
	// 储值申请-保存
	saveStoreValueAppl: (obj) => {
		return axios.request({
			url: `${modalPrefix}/VipStoreValue/saveStoreValue`,
			data: obj,
			method: 'post'
		})
	},
	// 团体购买错误下载
	errorExport: (vipFilepathId) => {
		return axios.request({
			url: `${modalPrefix}/grouppurchaseApi/export`,
			params: {vipFilepathId},
			method: 'post'
		})
	},
	// 根据查询条件查询健管商品类型表
	queryVipShoppingTypeList: () => {
		return axios.request({
			url: `${modalPrefix}/vipShoppingOrderAdd/queryVipShoppingTypeList`,
			method: 'post'
		})
	},
	// 管理式医疗绑卡查询-待发卡列表
	queryForSend1: (obj) => {
		return axios.request({
			url: `${modalPrefix}/MedicalCardBind/queryForSendWork`,
			data: obj,
			method: 'post'
		})
	},
	// 管理式医疗绑卡保存-发卡信息
	saveVipSendcardForSend1: (obj) => {
		return axios.request({
			url: `${modalPrefix}/MedicalCardBind/saveVipSendcardForSend`,
			data: obj,
			method: 'post'
		})
	},
	// 消费管理>批量支付导入 上传文件
	uploadBatchPayFile: (obj) => {
		return axios.request({
			url: `${modalPrefix2}/VipFilepath/uploadBatchPayFile`,
			data: obj,
			method: 'post'
		})
	},
	// 消费管理>批量支付导入 批量支付导入查询分页
	queryBatchPayUploadInfo: (obj) => {
		return axios.request({
			url: `${modalPrefix2}/VipFilepath/queryBatchPayUploadInfo`,
			data: obj,
			method: 'post'
		})
	},
	// 附属人错误下载
	downloadErrorFromServer1: (id) => {
		return axios.request({
			url: `${modalPrefix2}/VipFilepath/downloadErrorFromServer`,
			params: {id},
			method: 'post'
		})
	},
	// 消费管理>批量支付导入 导入
	importBatchPayFile: (obj) => {
		return axios.request({
			url: `${modalPrefix2}/VipFilepath/importBatchPayFile`,
			data: obj,
			method: 'post'
		})
	},
	// 消费管理>批量支付导入 批量支付扣费
	doBatchPay: () => {
		return axios.request({
			url: `${modalPrefix2}/VipFilepath/doPay`,
			method: 'post'
		})
	},
	// 产品购买申请>查询购买金额范围
	queryAccountAs: () => {
		return axios.request({
			url: `${modalPrefix}/VipFilepath/doPay`,
			method: 'post'
		})
	},
	// 会员信息变更-投保信息列表
	getVipInfo: (obj) => {
		return axios.request({
			url: `${modalPrefix}/VIPAccountQuery/getVipInfo`,
			data: obj,
			method: 'post'
		})
	},
	updateVipInfo: (obj) => {
		return axios.request({
			url: `${modalPrefix}/VIPAccountQuery/updateVipInfo`,
			data: obj,
			method: 'post'
		})
	},
	// 会员信息变更-投保信息列表
	queryInsureWithGS: (obj) => {
		return axios.request({
			url: `${modalPrefix}/VIPAccountQuery/queryInsureWithGS`,
			data: obj,
			method: 'post'
		})
	}
}

export default api

