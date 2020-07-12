import axios from '../libs/axios'
import qs from 'qs'

let modalPrefix = '/hmims-application'
let modalHbfix = '/hmbms-application'

const api = {
	// 保存机构
	saveOrg: (obj) => {
		return axios.request({
			url: `${modalPrefix}/supModify/saveSorg`,
			data: obj,
			method: 'post'
		})
	},
	// 保存医生
	saveDoctor: (obj) => {
		return axios.request({
			url: `${modalPrefix}/supModify/saveDoctor`,
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
	// 保存供应商关联
	saveSupProvider: (obj) => {
		return axios.request({
			url: `${modalPrefix}/supModify/addSupplierProvider`,
			data: obj,
			method: 'post'
		})
	},
	// 删除供应商关联
	deleteSupProvider: (obj) => {
		return axios.request({
			url: `${modalPrefix}/supModify/delSupplierProvider`,
			data: obj,
			method: 'post'
		})
	},
	// 保存下级关联
	saveDownSorg: (obj) => {
		return axios.request({
			url: `${modalPrefix}/supModify/addDownSorg`,
			data: obj,
			method: 'post'
		})
	},
	// 删除下级关联
	deleteDownSorg: (obj) => {
		return axios.request({
			url: `${modalPrefix}/supModify/delDownSorg`,
			data: obj,
			method: 'post'
		})
	},
	// 通过机构编码查询下级关联信息表格
	queryDownSorgList: (obj) => {
		return axios.request({
			url: `${modalPrefix}/newSupInfoSearch/searchDownSorgTable`,
			data: obj,
			method: 'post'
		})
	},
	// 通过机构编码查询上级机构信息
	queryUpsorgist: (obj) => {
		return axios.request({
			url: `${modalPrefix}/newSupInfoSearch/selectUpsorgCodes`,
			data: obj,
			method: 'post'
		})
	},
	// 保存合约信息
	saveContract: (obj) => {
		return axios.request({
			url: `${modalPrefix}/supModify/saveContract`,
			data: obj,
			method: 'post'
		})
	},
	// 保存服务信息
	saveService: (obj) => {
		return axios.request({
			url: `${modalPrefix}/supModify/saveService`,
			data: obj,
			method: 'post'
		})
	},
	// 更新供应商机构信息
	updateSupplierInfo: (obj) => {
		return axios.request({
			url: `${modalPrefix}/newSupInfoSearch/updataSupplierInfos`,
			data: obj,
			method: 'post'
		})
	},
	// 保存药店信息
	savePhar: (obj) => {
		return axios.request({
			url: `${modalPrefix}/supModify/savePhar`,
			data: obj,
			method: 'post'
		})
	},
	// 提交审核
	updateOrginStatus: (obj) => {
		return axios.request({
			url: `${modalPrefix}/newSupInfoSearch/updateOrginStatus`,
			data: obj,
			method: 'post'
		})
	},
	// 撤销机构数据
	revokeAll: (obj) => {
		return axios.request({
			url: `${modalPrefix}/supModify/revokeAll`,
			data: obj,
			method: 'post'
		})
	},
	// 查询供应商机构信息表格
	querySupOrginInfo: (obj) => {
		return axios.request({
			url: `${modalPrefix}/newSupInfoSearch/querySupOrginInfo`,
			data: obj,
			method: 'post'
		})
	},
	// 查询页面基础信息
	queryBaseInfo: (obj) => {
		return axios.request({
			url: `${modalPrefix}/newSupInfoSearch/queryPageBaseInfo`,
			data: obj,
			method: 'post'
		})
	},
	// 通过机构编码查询合约信息表格
	queryContractList: (obj) => {
		return axios.request({
			url: `${modalPrefix}/newSupInfoSearch/searchOneselfSupplierContractTable`,
			data: obj,
			method: 'post'
		})
	},
	// 查询供应商下的所有合约信息
	queryContractList4Supplier: (obj) => {
		return axios.request({
			url: `${modalPrefix}/newSupInfoSearch/searchSupplierContractInfos`,
			data: obj,
			method: 'post'
		})
	},
	// 获取合约信息
	getContractInfo: (obj) => {
		return axios.request({
			url: `${modalPrefix}/newSupInfoSearch/getConInfo`,
			data: obj,
			method: 'post'
		})
	},
	// 查询既往使用银行信息
	queryBankInfo: (obj) => {
		return axios.request({
			url: `${modalPrefix}/newSupInfoSearch/getBankInfo`,
			data: obj,
			method: 'post'
		})
	},
	// 通过机构编码查询服务信息表格
	queryServiceList: (obj) => {
		return axios.request({
			url: `${modalPrefix}/newSupInfoSearch/searchOneselfSupplierServiceTable`,
			data: obj,
			method: 'post'
		})
	},
	// 获取服务信息
	getServiceInfo: (obj) => {
		return axios.request({
			url: `${modalPrefix}/newSupInfoSearch/getServiceInfo`,
			data: obj,
			method: 'post'
		})
	},
	// 查询基础供应商服务
	getSupSer: (obj) => {
		return axios.request({
			url: `${modalPrefix}/newSupInfoSearch/getSupSer`,
			data: obj,
			method: 'post'
		})
	},
	// 通过机构编码查询关联信息表格
	queryProviderList: (obj) => {
		return axios.request({
			url: `${modalPrefix}/newSupInfoSearch/searchSupplierProviderTableBySorgCode`,
			data: obj,
			method: 'post'
		})
	},
	// 通过供应商编码查询关联信息表格
	queryProviderList4Supplier: (obj) => {
		return axios.request({
			url: `${modalPrefix}/newSupInfoSearch/searchSupplierProviderTableBySupplierCode`,
			data: obj,
			method: 'post'
		})
	},
	// 通过供应商编码查询第三方机构信息
	queryThirdPartySupplierList: (obj) => {
		return axios.request({
			url: `${modalPrefix}/newSupInfoSearch/selectThirdPartySuppliersInfos`,
			data: obj,
			method: 'post'
		})
	},
	// 通过机构编码查询第三方机构信息
	queryThirdPartyOrgList: (obj) => {
		return axios.request({
			url: `${modalPrefix}/newSupInfoSearch/selectThirdPartyOrganInfos`,
			data: obj,
			method: 'post'
		})
	},
	// 获取经纬度
	getAddress: (obj) => {
		return axios.request({
			url: `${modalPrefix}/newSupInfoSearch/getAddress`,
			data: obj,
			method: 'post'
		})
	},
	// 相似机构校验是否可编辑
	querySimilarEditable: (obj) => {
		return axios.request({
			url: `${modalPrefix}/newSupInfoSearch/qxkz`,
			data: obj,
			method: 'post'
		})
	},
	// 查询相似机构列表信息
	querySimilarSorg: (obj) => {
		return axios.request({
			url: `${modalPrefix}/supModify/sorg`,
			data: obj,
			method: 'post'
		})
	},
	// 查询相似药店列表信息
	querySimilarPhas: (obj) => {
		return axios.request({
			url: `${modalPrefix}/supModify/phas`,
			data: obj,
			method: 'post'
		})
	},
	// 供应商审核通过
	supplierVerifyApproval: (obj) => {
		return axios.request({
			url: `${modalPrefix}/newSupInfoSearch/supplierVerifyApproval`,
			data: obj,
			method: 'post'
		})
	},
	// 供应商审核退回
	supplierVerifyBack: (obj) => {
		return axios.request({
			url: `${modalPrefix}/newSupInfoSearch/supplierVerifyBack`,
			data: obj,
			method: 'post'
		})
	},
	// 供应商合并 查询供应商信息
	mergeQuerySupplier: (obj) => {
		return axios.request({
			url: `${modalPrefix}/mergeSupplier/querySupplier`,
			data: obj,
			method: 'post'
		})
	},
	// 供应商合并 查询供应商相似数据
	mergeSimilardata: (obj) => {
		return axios.request({
			url: `${modalPrefix}/mergeSupplier/similardata`,
			data: obj,
			method: 'post'
		})
	},
	// 供应商合并 回退相似数据
	dealMergeBackList: (obj) => {
		return axios.request({
			url: `${modalPrefix}/dealMerge/backList`,
			data: obj,
			method: 'post'
		})
	},
	// 供应商合并 合并历史下载
	dealMergeExport: (obj) => {
		return axios.request({
			url: `${modalPrefix}/dealMerge/export`,
			data: obj,
			method: 'post'
		})
	},
	// 供应商合并 合并供应商相似数据
	dealMergeSorg: (obj) => {
		return axios.request({
			url: `${modalPrefix}/dealMerge/mergeSorg`,
			data: obj,
			method: 'post'
		})
	},
	// 供应商合并 若该机构在其他服务中正在使用，则不可合并
	dealMergeCheck: (obj) => {
		return axios.request({
			url: `${modalPrefix}/dealMerge/checkMerge`,
			data: obj,
			method: 'post'
		})
	},
	// 信息查询页面-查询机构列表信息
	searchOrgList: (obj) => {
		return axios.request({
			url: `${modalPrefix}/supInfoSearch/searchOrgList`,
			data: obj,
			method: 'post'
		})
	},
	// 信息查询页面-查询医生列表信息
	searchDocOfMainList: (obj) => {
		return axios.request({
			url: `${modalPrefix}/supInfoSearch/searchDocOfMainList`,
			data: obj,
			method: 'post'
		})
	},
	// 信息查询页面-查询药店列表信息
	searchPhaList: (obj) => {
		return axios.request({
			url: `${modalPrefix}/supInfoSearch/searchPhaList`,
			data: obj,
			method: 'post'
		})
	},
	// 合约文件上传
	uploadContract: (obj) => {
		return axios.request({
			url: `${modalPrefix}/supModify/uploadContract`,
			data: obj,
			method: 'post',
			headers: { 'Content-Type': 'multipart/form-data' }
		})
	},
	// 批复文件上传
	uploadReply: (obj) => {
		return axios.request({
			url: `${modalPrefix}/supModify/uploadReply`,
			data: obj,
			method: 'post',
			headers: { 'Content-Type': 'multipart/form-data' }
		})
	},
	// 合约文件下载
	downContract: (obj) => {
		return axios.request({
			url: `${modalPrefix}/supModify/downContract`,
			data: obj,
			method: 'post'
		})
	},
	// 供应商附件上载
	importSupplier: (obj) => {
		return axios.request({
			url: `${modalPrefix}/supplierImport/import`,
			data: obj,
			method: 'post',
			headers: { 'Content-Type': 'multipart/form-data' }
		})
	},
	// 供应商导入模板下载
	download: (obj) => {
		return axios.request({
			url: `${modalPrefix}/supplierImport/download`,
			method: 'post'
		})
	},
	// 供应商导入模板下载
	downloadPha: (obj) => {
		return axios.request({
			url: `${modalPrefix}/supplierImport/downloadPha`,
			method: 'post'
		})
	},
	// 供应商导入失败清单下载
	downloadError: (obj) => {
		return axios.request({
			url: `${modalPrefix}/supplierImport/error`,
			data: obj,
			method: 'post'
		})
	},
	// 服务网络信息附件上载
	importNetwork: (obj) => {
		return axios.request({
			url: `${modalPrefix}/networkImport/import`,
			data: obj,
			method: 'post',
			headers: { 'Content-Type': 'multipart/form-data' }
		})
	},
	// 服务网络模板附件上载
	importForUseTemplet: (obj) => {
		return axios.request({
			url: `${modalPrefix}/networkImport/importForUseTemplet`,
			data: obj,
			method: 'post',
			headers: { 'Content-Type': 'multipart/form-data' }
		})
	},
	// 产品网络模板维护附件上载
	importNetworkTem: (obj) => {
		return axios.request({
			url: `${modalPrefix}/templet/import`,
			data: obj,
			method: 'post',
			headers: { 'Content-Type': 'multipart/form-data' }
		})
	},
	// 供应商查询导出机构
	exportSupOrg: (obj) => {
		return axios.request({
			url: `${modalPrefix}/supInfoExport/exportSupOrg`,
			data: obj,
			method: 'post'
		})
	},
	// 供应商查询导出机构
	exportSupPha: (obj) => {
		return axios.request({
			url: `${modalPrefix}/supInfoExport/exportSupPha`,
			data: obj,
			method: 'post'
		})
	},
	// 供应商查询导出医生
	exportSupDoc: (obj) => {
		return axios.request({
			url: `${modalPrefix}/supInfoExport/exportSupDoc`,
			data: obj,
			method: 'post'
		})
	},
	// 手工确认接口查询
	handletSingleList: (obj) => {
		return axios.request({
			url: `${modalPrefixSettle}/SupplierSettleAPI/manualSettleQuery`,
			data: obj,
			method: 'post',
			headers: { 'Content-Type': 'multipart/form-data' }
		})
	},
	// 结算管理-手工确认-确定
	handleSubmit: (obj) => {
		return axios.request({
			url: `${modalPrefixSettle}/SupplierSettleAPI/manualSettleConfirm`,
			data: obj,
			method: 'post',
			headers: { 'Content-Type': 'multipart/form-data' }
		})
	},
	        // 结算管理-结算确认-查询接口
	handletlementList: (obj) => {
		return axios.request({
			url: `${modalHbfix}/SupplierSettleAPI/getSupplierSettle`,
			data: obj,
			method: 'post'
		})
	},
	// 结算管理-结算确认-全部确认
	handleAllSubmit: (obj) => {
		return axios.request({
			url: `${modalHbfix}/SupplierSettleAPI/allSettleConfirm`,
			data: obj,
			method: 'post'
		})
	},
	// 结算管理-结算确认-非全部、确认不通过
	handleNoAllSubmit: (obj) => {
		return axios.request({
			url: `${modalHbfix}/SupplierSettleAPI/settleConfirm`,
			data: obj,
			method: 'post'
		})
	},
	// 根据batchNo获取结算分类
	handletdSortList: (obj) => {
		return axios.request({
			url: `${modalHbfix}/SupplierSettleAPI/getSupplierSettleByBatchNo`,
			data: obj,
			method: 'post'
		})
	},
	// 导出
	exportSettleConfirm: (obj) => {
		return axios.request({
			url: `${modalHbfix}/SupplierSettleAPI/exportSettleConfirm`,
			data: obj,
			method: 'post'
		})
	}

}

export default api
