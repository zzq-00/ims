<template>
  <div>
		<a-modal v-model="formModal" style="top: 30px;" :width="modalWidth" title="第三方询价邮件及短信">

			<a-card>
				<a-table :bordered="false" :dataSource="pageData.data" :columns="columns" :rowKey="record => record.recordIndex" :indentSize=0 :loading="loading">
					<span slot="textVal" slot-scope="text, record">{{(text || '-')}}</span>
					<a slot="agreePrice" @click="clickDetail(record)" slot-scope="text, record">{{text}}</a>
					<template slot="supplierLinkman" slot-scope="text, record">
						<editable-cell :text="text" @change="onCellChange(record.recordIndex, 'supplierLinkman', $event)" />
					</template>
					<template slot="supplierTel" slot-scope="text, record">
						<editable-cell :text="text" @change="onCellChange(record.recordIndex, 'supplierTel', $event)" />
					</template>
					<template slot="supplierZipcode" slot-scope="text, record">
						<editable-cell :text="text" @change="onCellChange(record.recordIndex, 'supplierZipcode', $event)" />
					</template>
				</a-table>
			</a-card>
			<a-card v-show="detailFlag">
				<a-table :pagination=false :bordered="false" :dataSource="pageData1.data" :columns="columns1" >
				</a-table>
			</a-card>
			<a-card>
				<a-form :form="filterForm">
					<a-form-item label="短信内容">
					<a-textarea  v-decorator="['detailedDescription2']"  :autosize="{ minRows: 6, maxRows: 10 }" />
					</a-form-item>
					<a-form-item label="电子邮件内容">
					<a-textarea  v-decorator="['detailedDescriptionE']"  :autosize="{ minRows: 6, maxRows: 10 }" />
					</a-form-item>
				</a-form>
			</a-card>

			<div slot="footer">
				<a-button type="" @click="formModal=false">退出</a-button>
				<a-button type="primary" @click="submitForm">确定</a-button>
			</div>
    </a-modal>
  </div>
</template>
<script>
import api from '@/api/api-serve-apply'
import EditableCell from './editable-cell'
import {Promise} from "q"
export default {
	name: 'three-choose-modal',
	components: { EditableCell },
	data () {
		return {
			// 查询条件
			filterFormLayout: {
				labelCol: { span: 9 },
				wrapperCol: { span: 15 }
			},
			extraParams: [],
			taskInfo: {},
			formModal: false,
			modalWidth: 1470,
			pageData: {
				dataCount: 0,
				data: []
			},
			pageData1: {
				dataCount: 0,
				data: []
			},
			filterForm: this.$form.createForm(this),
			loading: false,
			columns: [
				{ title: "省", dataIndex: "provinceName", width: 100 },
				{ title: "市", dataIndex: "cityName", scopedSlots: { customRender: 'textVal' } },
				{ title: "名称", dataIndex: "supplierName", width: 300, scopedSlots: { customRender: 'textVal' } },
				{ title: "协议价格", dataIndex: "agreePrice", width: 400, scopedSlots: { customRender: 'agreePrice' } },
				{ title: "联系人", dataIndex: "supplierLinkman", scopedSlots: { customRender: 'supplierLinkman' } },
				{ title: "联系电话", dataIndex: "supplierTel", scopedSlots: { customRender: 'supplierTel' } },
				{ title: "电子邮件", dataIndex: "supplierZipcode", scopedSlots: { customRender: 'supplierZipcode' } }
			],
			columns1: [
				{ title: "序号", dataIndex: "recordIndex" },
				{ title: "第三方名称", dataIndex: "supplierName" },
				{ title: "供应商服务名称", dataIndex: "supServName" },
				{ title: "协议价格", dataIndex: "agreePrice" }
			],
			detailFlag: false,
			editable: false

		}
	},
	mounted () {},
	methods: {
		onCellChange (key, dataIndex, value) {
			const pageData = [...this.pageData.data]
			const target = pageData.find(item => item.recordIndex === key)
			if (target) {
				target[dataIndex] = value
				this.pageData.data = pageData
			}
		},
		submitForm () {
			let myPhoneReg = /^[1][3,4,5,6,7,8,9][0-9]{9}$/
			let messTemplate = this.filterForm.getFieldsValue()
			let ThreeModsTable = this.pageData.data
			let list = this.taskInfo
			// console.log(ThreeModsTable)
			let messL = []
			let result = 1
			let checkN = 1
			ThreeModsTable.forEach((Value, Key) => {
				if (Value.supplierLinkman !== "无" && Value.supplierLinkman) {
					var num = 0
					if (Value.supplierTel !== "无" && Value.supplierTel) {
						num += 1
						// 手机号码格式校验
						if (!myPhoneReg.test(Value.supplierTel) || Value.supplierTel.length < 11 || !this.checkNumber(Value.supplierTel)) {
							alert("请确认所填手机号格式是否正确!")
							result = 2
						}
						var MessTrace = {}
						MessTrace.serApplyId = list.serviceReservationId
						MessTrace.serApplyStatus = list.status
						MessTrace.sendObjectsName = Value.supplierLinkman
						MessTrace.sendObjects = "04"
						MessTrace.sendMessage = messTemplate.detailedDescription2
						MessTrace.sendNo = Value.supplierTel
						messL.push(MessTrace)
					}
					if (Value.supplierZipcode !== "无" && Value.supplierZipcode) {
						num += 1
						let MessTrace = {}
						MessTrace.serApplyId = list.serviceReservationId
						MessTrace.serApplyStatus = list.status
						MessTrace.sendObjectsName = Value.supplierLinkman
						MessTrace.sendObjects = "05"
						MessTrace.sendMessage = messTemplate.detailedDescriptionE
						MessTrace.sendNo = Value.supplierZipcode
						messL.push(MessTrace)
					}
					if (num === 0) {
						alert("电子邮件和联系电话不可均为空!")
						result = 3
					}
				} else {
					checkN = 2
				}
			})
			if (checkN === 2) {
				alert("第三方询价联系人信息必录！")
			} else if (result === 1) {
				if (messL && messL.length > 0) {
					this.sendMess(messL)// 发送短信
				}
				this.selThreeMod()
				// $('#ThssModal').modal('hide');
				// queryList();
				// var url = '/picchibm/SerApply/SelThreeMod';
				// settingSerThreeTableInfo(url);
			}
			// let MessTrace = {
			// 	messL: []
			// }
			// let data1 = {
			// 	serApplyId:taskInfo.serviceReservationId,
			// 	serApplyStatus: taskInfo.status,
			// 	sendObjectsName: ThreeModsTable[0].supplierLinkman,
			// 	sendObjects: "04",
			// 	sendMessage: messTemplate.detailedDescription2,
			// 	sendNo:  ThreeModsTable[0].supplierTel
			// }
			// let data2 = {
			// 	serApplyId:taskInfo.serviceReservationId,
			// 	serApplyStatus: taskInfo.status,
			// 	sendObjectsName: ThreeModsTable[0].supplierLinkman,
			// 	sendObjects: "05",
			// 	sendMessage: messTemplate.detailedDescriptionE,
			// 	sendNo: ThreeModsTable[0].supplierZipcode
			// }
			// MessTrace.messL.push(data1);
			// MessTrace.messL.push(data2);


			// if(this.pageData.data.length>0&&!this.pageData.data[0].supplierLinkman){
			// 	this.$message.warning('联系人不能为空');
			// 	return;
			// };
			// if(this.pageData.data.length>0&&!this.pageData.data[0].supplierTel){
			// 	this.$message.warning('联系电话不能为空');
			// 	return;
			// };
			//
			// if(!myPhoneReg.test(this.pageData.data[0].supplierTel)||this.pageData.data[0].supplierTel.length<11||!this.checkNumber(this.pageData.data[0].supplierTel)){
			// 	this.$message.warning('请确认所填手机号格式是否正确');
			// 	return;
			// };

			// if(this.pageData.data.length>0&&!this.pageData.data[0].supplierZipcode){
			// 	this.$message.warning('电子邮件不能为空');
			// 	return;
			// };

		// 第三方询价下一步确定 第三方短信询价
		},
		selThreeMod () {
			let data = {
				page: 1,
				limit: 10,
				ThirdPartyEnquiryList: [],
				ThreeModTable: this.pageData.data,
				supplierCode: this.taskInfo.supplierCode,
				serviceReservationId: this.taskInfo.serviceReservationId
			}
			// console.log('入参短信 第三方参数', JSON.stringify(data))
			//   let data={"page":1,"limit":10,
			//   "ThirdPartyEnquiryList":[{"serviceReservationId":"8361","supplierName":"测试洗牙机构","supplierCode":"S11002479","price":"10","supplierLinkman":"张拉拉","supplierTel":"18809010908","supplierZipcode":"dfsdf@163.com","enquiryTime":1585101600000,"enquiryTimeDesc":"10:00","enquiryTimeDay":"2020-03-25","enquiryStartTime":null,"enquiryEndTime":null,"ordinaryPrice":"10","specialPrice":null,"internationalPrice":null,"feedbackTime":1585108800000,"feedbackTimeDesc":"12:00","feedbackTimeDay":"2020-03-25","productCode":"test_011","serviceCode":"CK0006","flag":"Y","reason":"整体服务最好（包括分诊、陪诊、诊后指导等）","sorgCode":"H11000003","sorgName":null,"deptCode":"DE11000003000001","deptName":null,"enquiryNumber":null,"supplierEnquiryNumber":null,"successRate":null,"averageFeedbackTime":null,"averagePrice":null,"orgCode":"86","orgName":"总公司","province":null,"provinceName":null,"city":null,"cityName":null,"insertOper":null,"insertTime":null,"updateOper":null,"updateTime":null,"state":null,"finalChoose":null,"consumeDate":null,"orgPrivince":null,"orgPrivinceDesc":null,"orgCity":null,"orgCityDesc":null,"sorgEmail":null,"maxSettleCost":null,"minSettleCost":null,"otherPrice":null,"specPrice":null,"agreePrice":null,"supServName":null}],
			//   "ThreeModTable":[{"serviceReservationId":null,"supplierName":"测试洗牙机构","supplierCode":"S11002479","price":null,"supplierLinkman":"张三","supplierTel":"18518172948","supplierZipcode":"aikesls@163.com","enquiryTime":null,"enquiryTimeDesc":null,"enquiryTimeDay":null,"enquiryStartTime":null,"enquiryEndTime":null,"ordinaryPrice":null,"specialPrice":null,"internationalPrice":null,"feedbackTime":null,"feedbackTimeDesc":null,"feedbackTimeDay":null,"productCode":null,"serviceCode":null,"flag":null,"reason":null,"sorgCode":null,"sorgName":null,"deptCode":null,"deptName":null,"enquiryNumber":"1","supplierEnquiryNumber":"1","successRate":"100%","averageFeedbackTime":"2.00","averagePrice":null,"orgCode":"86","orgName":"总公司","province":"110000","provinceName":"北京市","city":"110100","cityName":"市辖区","insertOper":null,"insertTime":null,"updateOper":null,"updateTime":null,"state":null,"finalChoose":null,"consumeDate":null,"orgPrivince":null,"orgPrivinceDesc":null,"orgCity":null,"orgCityDesc":null,"sorgEmail":null,"maxSettleCost":null,"minSettleCost":null,"otherPrice":null,"specPrice":null,"agreePrice":"-","supServName":" 儿童洗牙及常规牙齿检查"}],"supplierCode":null,"serviceReservationId":"8361"}
			// 添加第三方询价-下一步-确定
			api.selThreeMod(data).then(res => {
				// console.log(res, 'result 第三方询价下一步确定')
				if (res.status === 0) {
					this.$emit('on-update', res.data)
				}
			})
		},
		// 第三方询价 发送短信 邮件
		sendMess (messL) {
			let MessVo = {}
			MessVo.messL = messL
			this.$message.success('请稍等，正在发送短信和邮件!')
			api.sendMassSms(MessVo).then(res => { // sendMess
				if (res.status === 0) {
					this.$message.success('发送成功!')
					this.formModal = false
				} else {
					this.$message.success('发送失败!')
				}
			})
		},

		loadPageData () {
			let data = {
				ThreeModTable: this.extraParams
			}
			// let data = {
			//   ThreeModTable: [
			//     {"0":true,"serviceReservationId":null,"supplierName":"测试洗牙机构","supplierCode":"S11002479","price":null,"supplierLinkman":null,"supplierTel":null,"supplierZipcode":"无","enquiryTime":null,"enquiryTimeDesc":null,"enquiryTimeDay":null,"enquiryStartTime":null,"enquiryEndTime":null,"ordinaryPrice":null,"specialPrice":null,"internationalPrice":null,"feedbackTime":null,"feedbackTimeDesc":null,"feedbackTimeDay":null,"productCode":null,"serviceCode":null,"flag":null,"reason":null,"sorgCode":null,"sorgName":null,"deptCode":null,"deptName":null,"enquiryNumber":"1","supplierEnquiryNumber":"1","successRate":"100%","averageFeedbackTime":"2.00","averagePrice":null,"orgCode":"86","orgName":"总公司","province":"110000","provinceName":"北京市","city":"110100","cityName":"市辖区","insertOper":null,"insertTime":null,"updateOper":null,"updateTime":null,"state":null,"finalChoose":null,"consumeDate":null,"orgPrivince":null,"orgPrivinceDesc":null,"orgCity":null,"orgCityDesc":null,"sorgEmail":null,"maxSettleCost":null,"minSettleCost":null,"otherPrice":null,"specPrice":null,"agreePrice":"-","supServName":" 儿童洗牙及常规牙齿检查"},
			//     {"0":true,"serviceReservationId":null,"supplierName":"测试洗牙机构","supplierCode":"S11002479","price":null,"supplierLinkman":null,"supplierTel":null,"supplierZipcode":"无","enquiryTime":null,"enquiryTimeDesc":null,"enquiryTimeDay":null,"enquiryStartTime":null,"enquiryEndTime":null,"ordinaryPrice":null,"specialPrice":null,"internationalPrice":null,"feedbackTime":null,"feedbackTimeDesc":null,"feedbackTimeDay":null,"productCode":null,"serviceCode":null,"flag":null,"reason":null,"sorgCode":null,"sorgName":null,"deptCode":null,"deptName":null,"enquiryNumber":"1","supplierEnquiryNumber":"1","successRate":"100%","averageFeedbackTime":"2.00","averagePrice":null,"orgCode":"86","orgName":"总公司","province":"110000","provinceName":"北京市","city":"110100","cityName":"市辖区","insertOper":null,"insertTime":null,"updateOper":null,"updateTime":null,"state":null,"finalChoose":null,"consumeDate":null,"orgPrivince":null,"orgPrivinceDesc":null,"orgCity":null,"orgCityDesc":null,"sorgEmail":null,"maxSettleCost":null,"minSettleCost":null,"otherPrice":null,"specPrice":null,"agreePrice":"-","supServName":" 儿童洗牙及常规牙齿检查"}
			//   ]
			// }
			this.pageData.data = []
			this.loading = true
			api.selThreeMods(data).then(res => {
				let pageData = {
					totalCount: res.data.total,
					data: res.data.rows
				}
				this.pageData = pageData || { totalCount: 0, data: [] }
				this.pageData.data.forEach((item, index) => { item.recordIndex = index })
			}).finally(() => {
				this.loading = false
			})
		},

		show (extraParams, taskInfo) {
			this.detailFlag = false
			// console.log('1122'+JSON.stringify(extraParams),JSON.stringify(taskInfo))
			let self = this
			self.formModal = true
			self.filterForm.resetFields()
			setTimeout(function () {
				self.extraParams = extraParams || []
				self.taskInfo = taskInfo || {}
				self.loadPageData()
				self.filterForm.setFieldsValue({
					detailedDescriptionE: self.INOdetailedDescription(taskInfo),
					detailedDescription2: self.INOdetailedDescription(taskInfo)
				})
			}, 50)
		},
		checkNumber (str) {
			var regex = new RegExp(str.substr(0, 1), 'g') // 使用g表示整个字符串都要匹配
			var result = str.match(regex)
			var count = !result ? 0 : result.length
			if (count < str.length) {
				return true
			} else {
				return false
			}
		},
		getNowFormatDate () {
			var date = new Date()
			var seperator1 = "-"
			var year = date.getFullYear()
			var month = date.getMonth() + 1
			var strDate = date.getDate()
			if (month >= 1 && month <= 9) {
				month = "0" + month
			}
			if (strDate >= 0 && strDate <= 9) {
				strDate = "0" + strDate
			}
			var currentdate = year + seperator1 + month + seperator1 + strDate
			return currentdate
		},

		INOdetailedDescription (list) {
			var INFpatientName = ''
			var INFpatientGenderDesc = ''
			var INFpatientCertno = ''
			var INFsorgName = ''
			var INFdeptName = ''
			var INFresmedDoctorName = ''
			var INFresmedDateTypeDesc = ''
			var INFresmedDates = ''
			var INFdisease = ''
			var INFspecialFlag = ''
			var INFmedicareFlag = ''
			var INFdetailedDescription = ''
			var INFlinkmanName = ''
			var INFlinkmanPhone = ''
			var INFserviceName = ''
			if (list.patientName !== null && list.patientName !== '' && list.patientName !== 'null') {
				INFpatientName = '就诊人员姓名：' + list.patientName + '。'
			}
			if (list.patientGenderDesc !== null && list.patientGenderDesc !== '') {
				INFpatientGenderDesc = '性别：' + list.patientGenderDesc + '。'
			}
			if (list.patientCertno !== null && list.patientCertno !== '' && list.patientCertno !== 'null') {
				INFpatientCertno = '就诊人证件号：' + list.patientCertno + '。'
			}

			if (list.sorgName !== null && list.sorgName !== '' && list.sorgName !== 'null') {
				INFsorgName = '就诊医院：' + list.sorgName + '。'
			}

			if (list.deptName !== null && list.deptName !== '' && list.deptName !== 'null') {
				INFdeptName = '就诊科室：' + list.deptName + '。'
			}

			if (list.resmedDoctorName !== null && list.resmedDoctorName !== '' && list.resmedDoctorName !== 'null') {
				INFresmedDoctorName = '期望就诊专家：' + list.resmedDoctorName + '。'
			}
			if (list.resmedDateType !== null && list.resmedDateType !== '' && list.resmedDateType !== 'null') {
				INFresmedDateTypeDesc = '期望就诊时间：从：' + this.getNowFormatDate() + ' 00:00:00 起'
				if (list.resmedDateType !== null && list.resmedDateType === '1') {
					INFresmedDates = '七个工作日之内('
					if (list.notResmedDates !== null && list.notResmedDates !== '' && list.notResmedDates !== 'null') { INFresmedDates = INFresmedDates + "不方便就诊时间：" + list.notResmedDates }
					if (list.jgResmedDates !== null && list.jgResmedDates !== '' && list.jgResmedDates !== 'null') { INFresmedDates = INFresmedDates + '健管中心预约时间：' + list.notResmedDates }
					INFresmedDates = INFresmedDates + ')。'
				} else if (list.resmedDateType !== null && list.resmedDateType === '2') {
					INFresmedDates = '七个工作日之后('
					if (list.resmedDates !== null && list.resmedDates !== '' && list.resmedDates !== 'null') { INFresmedDates = INFresmedDates + "方便就诊时间：" + list.resmedDates }
					if (list.jgResmedDates !== null && list.jgResmedDates !== '' && list.jgResmedDates !== 'null') { INFresmedDates = INFresmedDates + '健管中心预约时间：' + list.notResmedDates }
					INFresmedDates = INFresmedDates + ')。'
				}
			}
			if (list.disease !== null && list.disease !== '' && list.disease !== 'null') {
				INFdisease = '主要疾病或症状：' + list.disease + '。'
			}
			if (list.specialFlag !== null && list.specialFlag === 'Y') {
				INFspecialFlag = '接受特需门诊。'
			} else if (list.specialFlag !== null && list.specialFlag === 'N') {
				INFspecialFlag = '不接受特需门诊。'
			}
			if (list.medicareFlag !== null && list.medicareFlag === 'Y') {
				INFmedicareFlag = '有当地医保卡。'
			} else if (list.medicareFlag !== null && list.medicareFlag === 'N') {
				INFmedicareFlag = '没有当地医保卡。'
			}
			if (list.detailedDescription !== null && list.detailedDescription !== '') {
				INFdetailedDescription = '备注：' + list.detailedDescription + '。'
			}
			if (list.applyName !== null && list.applyName !== '' && list.applyName !== 'null') {
				INFlinkmanName = '联系人：' + list.applyName + '。'
			}
			INFlinkmanPhone = '电话：' + list.handleTel + '。'

			if (list.serviceName !== null && list.serviceName !== '') {
				INFserviceName = '有一单' + list.serviceName + '请您及时处理，订单号码：' + list.serviceReservationId + '。'
			}
			var INOdetailedDescription = '工作提醒:' + INFserviceName + INFpatientName + INFpatientGenderDesc + INFpatientCertno + INFsorgName + INFdeptName + INFresmedDoctorName + INFresmedDateTypeDesc + INFresmedDates + INFdisease + INFspecialFlag + INFmedicareFlag + INFdetailedDescription + INFlinkmanName + INFlinkmanPhone + "最终反馈结果请发至medicalservice@picchealth.com。"
			return INOdetailedDescription
		},
		clickDetail (record) {
			this.detailFlag = true
			let param = {
				supplierCode: record.supplierCode,
				sorgCode: this.taskInfo.merchantcode,
				sorgCodeName: '', // 置空，别问，问就是没值
				orgprovince: record.orgprovince,
				productCode: this.taskInfo.productCode,
				serviceCode: this.taskInfo.serviceCode
			}
			// this.pageData1.data = [{"serviceReservationId": null, "supplierName": "北京寰宇医道科技有限公司", "supplierCode": "S11000409", "price": null, "supplierLinkman": null, "supplierTel": null, "supplierZipcode": null, "enquiryTime": null, "enquiryTimeDesc": null, "enquiryTimeDay": null, "enquiryStartTime": null, "enquiryEndTime": null, "ordinaryPrice": null, "specialPrice": null, "internationalPrice": null, "feedbackTime": null, "feedbackTimeDesc": null, "feedbackTimeDay": null, "productCode": null, "serviceCode": null, "flag": null, "reason": null, "sorgCode": null, "sorgName": null, "deptCode": null, "deptName": null, "enquiryNumber": null, "supplierEnquiryNumber": null, "successRate": null, "averageFeedbackTime": null, "averagePrice": null, "orgCode": "86", "orgName": null, "province": "110000", "provinceName": null, "city": "110100", "cityName": null, "insertOper": null, "insertTime": null, "updateOper": null, "updateTime": null, "state": null, "finalChoose": null, "consumeDate": null, "orgPrivince": null, "orgPrivinceDesc": null, "orgCity": null, "orgCityDesc": null, "sorgEmail": null, "maxSettleCost": "20000", "minSettleCost": "500", "otherPrice": null, "specPrice": null, "agreePrice": "最高价格:20000,最低价格:500", "supServName": "专家门诊挂号服务"}, {"serviceReservationId": null, "supplierName": "北京寰宇医道科技有限公司", "supplierCode": "S11000409", "price": null, "supplierLinkman": null, "supplierTel": null, "supplierZipcode": null, "enquiryTime": null, "enquiryTimeDesc": null, "enquiryTimeDay": null, "enquiryStartTime": null, "enquiryEndTime": null, "ordinaryPrice": null, "specialPrice": null, "internationalPrice": null, "feedbackTime": null, "feedbackTimeDesc": null, "feedbackTimeDay": null, "productCode": null, "serviceCode": null, "flag": null, "reason": null, "sorgCode": null, "sorgName": null, "deptCode": null, "deptName": null, "enquiryNumber": null, "supplierEnquiryNumber": null, "successRate": null, "averageFeedbackTime": null, "averagePrice": null, "orgCode": "86", "orgName": null, "province": "110000", "provinceName": null, "city": "110100", "cityName": null, "insertOper": null, "insertTime": null, "updateOper": null, "updateTime": null, "state": null, "finalChoose": null, "consumeDate": null, "orgPrivince": null, "orgPrivinceDesc": null, "orgCity": null, "orgCityDesc": null, "sorgEmail": null, "maxSettleCost": "20000", "minSettleCost": "500", "otherPrice": null, "specPrice": "10250", "agreePrice": "最高价格:20000,最低价格:500,固定价格:10250", "supServName": "专家门诊挂号服务"}]
			// this.pageData1.data.forEach((item, index) => { item.recordIndex = index + 1 })
			api.selEnquiryInfo(param).then(res => {
				this.pageData1.data = res.data.rows
				this.pageData1.data.forEach((item, index) => { item.recordIndex = index + 1 })
			})
		}
	},
	watch: {
		pageData: {
			handler (newName, oldName) {
			},
			// immediate: true,
			deep: true
		}
	}
}
</script>
