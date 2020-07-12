import axios from '../libs/axios'

let modalPrefix = '/hmbms-application'
const api = {
	// 固定薪酬查询
	queryFixedSalary: (obj) => {
		return axios.request({
			url: `${modalPrefix}/fixedSalary/fixedSalaryQuery`,
			data: obj,
			method: 'post'
		})
	},
	// 固定薪酬保存
	saveFixedSalary: (obj) => {
		return axios.request({
			url: `${modalPrefix}/fixedSalary/fixedSalaryUpdate`,
			data: obj,
			method: 'post'
		})
	},

	// 税前导入薪资查询
	preSalaryQuery: (obj) => {
		return axios.request({
			url: `${modalPrefix}/salaryQueryUpdate/perSalaryQuery`,
			data: obj,
			method: 'post'
		})
	},
	// 税后导入薪资查询
	postSalaryQuery: (obj) => {
		return axios.request({
			url: `${modalPrefix}/salaryQueryUpdate/salaryQuery`,
			data: obj,
			method: 'post'
		})
	},
	// 导入查询及修改 保存
	updateSalary: (obj) => {
		return axios.request({
			url: `${modalPrefix}/salaryQueryUpdate/updateSalary`,
			data: obj,
			method: 'post'
		})
	},
	// 固定薪资查询
	fixedSalaryQuery: (obj) => {
		return axios.request({
			url: `${modalPrefix}/fixedSalary/fixedSalaryQuery`,
			data: obj,
			method: 'post'
		})
	},
	// 非固定薪资查询
	salaryDetailQuery: (obj) => {
		return axios.request({
			url: `${modalPrefix}/salaryDetail/salaryDetailQuery`,
			data: obj,
			method: 'post'
		})
	},
	// 导出查询及修改--导出
	fixedSalaryExport: (obj) => {
		return axios.request({
			url: `${modalPrefix}/salaryQueryUpdate/exportSalary`,
			data: obj,
			method: 'post'
		})
	},

	// 导出查询及修改--下载
	downSalary: (obj) => {
		return axios.request({
			url: `${modalPrefix}/salaryImport/busiNo`,
			data: obj,
			method: 'post'
		})
	},
	// 薪资核算
	checkComp: (obj) => {
		return axios.request({
			url: `${modalPrefix}/trial/checkComp`,
			data: obj,
			method: 'post'
		})
	},
	// 薪资试算
	salaryTrial: (obj) => {
		return axios.request({
			url: `${modalPrefix}/trial/salaryTrial`,
			data: obj,
			method: 'post'
		})
	},
	// 薪资计算状态查询
	queryOrgTrial: (obj) => {
		return axios.request({
			url: `${modalPrefix}/trial/queryOrgTrial`,
			data: obj,
			method: 'post'
		})
	},
	// 薪资计算状态回退
	salaryStatusBack: (obj) => {
		return axios.request({
			url: `${modalPrefix}/trial/salaryStatusBack`,
			data: obj,
			method: 'post'
		})
	},
	// 薪酬指标查询
	querySalaryTarget: (obj) => {
		return axios.request({
			url: `${modalPrefix}/salaryConfigure/queryConfiguration`,
			data: obj,
			method: 'post'
		})
	},
	// 薪酬指标保存
	saveSalaryTarget: (obj) => {
		return axios.request({
			url: `${modalPrefix}/salaryConfigure/addConfiguration`,
			data: obj,
			method: 'post'
		})
	},
	// 薪酬指标更新
	updateSalaryTarget: (obj) => {
		return axios.request({
			url: `${modalPrefix}/salaryConfigure/updateConfiguration`,
			data: obj,
			method: 'post'
		})
	},
	// 薪酬指标导出
	exportSalaryTarget: (obj) => {
		return axios.request({
			url: `${modalPrefix}/perSalDet/exportDetail`,
			data: obj,
			method: 'post'
		})
	},
	// 管家薪资统计-查询
	queryPersonalSalaryDetail: (obj) => {
		return axios.request({
			url: `${modalPrefix}/perSalDet/queryConfiguration`,
			data: obj,
			method: 'post'
		})
	},
	// 群发工资单邮件-查询
	queryPayroll: (obj) => {
		return axios.request({
			url: `${modalPrefix}/sendEmail/perSalaryQuery`,
			data: obj,
			method: 'post'
		})
	},
	// 群发工资单邮件-邮件发送
	payrollSendMail: (obj) => {
		return axios.request({
			url: `${modalPrefix}/sendEmail/sendPayroll`,
			data: obj,
			method: 'post'
		})
	},

	// 薪资明细查询
	 // 导出-非固定薪酬
	noFixexport: (obj) => {
		return axios.request({
			url: `${modalPrefix}/salaryDetail/salaryDetailExport`,
			data: obj,
			method: 'post'
		})
	},
	// 导出-固定薪酬
	fixexport: (obj) => {
		return axios.request({
			url: `${modalPrefix}/salaryDetail/fixedSalaryExport`,
			data: obj,
			method: 'post'
		})
	},
	// 薪资指标项配置 --导出
	targetExport: (obj) => {
		return axios.request({
			url: `${modalPrefix}/salaryConfigure/export`,
			data: obj,
			method: 'post'
		})
	},
	// 管家薪资统计 --导出
	personalExport: (obj) => {
		return axios.request({
			url: `${modalPrefix}/perSalDet/exportDetail`,
			data: obj,
			method: 'post'
		})
	},
	// 工资单导出 --固定薪资导出
	fixPayrollExport: (obj) => {
		return axios.request({
			url: `${modalPrefix}/salaryDetail/exportPayrollIsFix`,
			data: obj,
			method: 'post'
		})
	},
	// 工资单导出 --不是固定薪资导出
	noFixPayrollExport: (obj) => {
		return axios.request({
			url: `${modalPrefix}/salaryDetail/exportPayrollNotFix`,
			data: obj,
			method: 'post'
		})
	},
	// 薪资导入管理
	// 查询 salaryImport/querySalaryPerformanceImport
	querySalaryPerformanceImport: (obj) => {
		return axios.request({
			url: `${modalPrefix}/salaryImport/querySalaryPerformanceImport`,
			data: obj,
			method: 'post'
		})
	},
	// 模板下载
	exportTemplate: (obj) => {
		return axios.request({
			url: `${modalPrefix}/salaryImport/export`,
			data: obj,
			method: 'post'
		})
	},
	// 导入exe文件
	importPerformanceItem: (obj) => {
		return axios.request({
			url: `${modalPrefix}/salaryImport/importPerformanceItem`,
			data: obj,
			method: 'post'
		})
	},
	// 导入福利文件
	uploadBenefitFile: (obj) => {
		return axios.request({
			url: `${modalPrefix}	/salaryImport/uploadBenefitFile`,
			data: obj,
			method: 'post'
		})
	},
	// 下载
	downloadFile: (obj) => {
		return axios.request({
			url: `${modalPrefix}/salaryImport/downloadFiles`,
			data: obj,
			method: 'post'
		})
	},
	// 薪资明细--详情页
	querySalaryDetail: (obj) => {
		return axios.request({
			url: `${modalPrefix}/salaryDetail/querySalaryDetail`,
			data: obj,
			method: 'post'
		})
	}
}

export default api
