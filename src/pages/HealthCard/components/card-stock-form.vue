<template>
  <div>
		<a-modal v-model="formModal" style="top: 30px;" :width="modalWidth" :title="modalTitle">
			<a-form :form="dataForm" :labelCol="dataFormLayout.labelCol" :wrapperCol="dataFormLayout.wrapperCol">
				<a-spin :spinning="spinning"/>
				<a-card style="margin: 24px;">
					<a-divider orientation="left"><a-icon type="home"/> 健管卡库存领用申请</a-divider>
					<a-row :gutter="16">
						<a-col :span="24">
							<a-row>
								<a-col :span="8">
									<a-form-item label="健管卡代码">
										<a-input :disabled="true" v-decorator="['docCode']" />
									</a-form-item>
								</a-col>
								<a-col :span="8">
									<a-form-item label="健管卡名称">
										<a-input :disabled="true" v-decorator="['docName']" />
									</a-form-item>
								</a-col>
								<a-col :span="8">
									<a-form-item label="产品代码">
										<a-input :disabled="true" v-decorator="['productCode']" />
									</a-form-item>
								</a-col>
							</a-row>
							<a-row>
								<a-col :span="8">
									<a-form-item label="产品名称">
										<a-input :disabled="true" v-decorator="['productName']" />
									</a-form-item>
								</a-col>
								<a-col :span="8">
									<a-form-item label="是否虚拟卡">
										<a-input :disabled="true" v-decorator="['isVirtual']" />
									</a-form-item>
								</a-col>
								<a-col :span="8">
									<a-form-item label="管理机构">
										<OrgSelect2 dicType="86" v-decorator="['orgCode',{initialValue: ''}]" placeholder="请选择管理机构" />
									</a-form-item>
								</a-col>
							</a-row>
							<a-row>
								<a-col :span="8">
									<a-form-item label="项目名称">
										<BudgetItemSelect ref="budgetItemSelect" :docParam="comItemParam" :allowClear="true" @change="budgetItemChange" v-decorator="['budgetItemCode', {initialValue: '', rules: [{ required: true, message: '请选择项目!' }]}]" />
									</a-form-item>
								</a-col>
								<a-col :span="8">
									<a-form-item label="项目截止日期">
										<a-input :disabled="true" v-decorator="['itemEndDate']" />
									</a-form-item>
								</a-col>
								<a-col :span="8">
									<a-form-item label="部门">
										<a-input :disabled="true" v-decorator="['deptCode']" />
									</a-form-item>
								</a-col>
							</a-row>
							<a-row>
								<a-col :span="8">
									<a-form-item label="申请数量">
										<a-input-number @blur="applyQuantityBlur" :min="1" :max="9999999" v-decorator="['applyQuantity', {rules: [{ required: true, message: '申请数量不能为空!' }]}]" />
									</a-form-item>
								</a-col>
								<a-col :span="8">
									<a-form-item label="是否收费">
										<a-select v-decorator="['isCharged', {initialValue: 'Y'}]">
											<a-select-option value="Y">是</a-select-option>
											<a-select-option value="N">否</a-select-option>
										</a-select>
									</a-form-item>
								</a-col>
								<a-col :span="8">
									<a-form-item label="领用人代码">
										<a-input-search placeholder="请输入领用人代码" @search="onSearchReceiver" enterButton="查询" size="default" v-decorator="['receiveCode']" />
									</a-form-item>
								</a-col>
							</a-row>
							<a-row>
                <a-col :span="8">
                  <a-form-item label="领用人类型">
                    <DicSelect dicType="RECEIVE_TYPE" :disabled="disabledReceiveType" :allowClear="true" v-decorator="['receiveType', {initialValue: '', rules: [{ required: true, message: '领用人类型不能为空!' }]}]" />
                  </a-form-item>
                </a-col>
<!--								<a-col :span="8">-->
<!--									<a-form-item label="领用人类型">-->
<!--										<a-input  v-decorator="['receiveTypeDesc', {rules: [{ required: true, message: '领用人类型不能为空!' }]}]" />-->
<!--									</a-form-item>-->
<!--								</a-col>-->
								<a-col :span="8">
									<a-form-item label="领用人姓名">
										<a-input :disabled="true" v-decorator="['receiveName', {rules: [{ required: true, message: '领用人姓名不能为空!' }]}]" />
									</a-form-item>
								</a-col>
								<a-col :span="8">
									<a-form-item label="领用人证件类型">
										<a-input :disabled="true" v-decorator="['receiveIdTypeName']" />
									</a-form-item>
								</a-col>
							</a-row>
							<a-row>
								<a-col :span="8">
									<a-form-item label="领用人证件号码">
										<a-input :disabled="true" v-decorator="['receiveIdNo']" />
									</a-form-item>
								</a-col>
								<a-col :span="8">
									<a-form-item label="领用人性别">
										<DicSelect dicType="GENDER" :disabled="true" v-decorator="['receiveGender']" ></DicSelect>
									</a-form-item>
								</a-col>
								<a-col :span="8">
									<a-form-item label="领用人出生日期">
										<a-input :disabled="true" v-decorator="['receiveBirthday']" />
									</a-form-item>
								</a-col>
							</a-row>
							<a-row v-show="!(isVirtual =='是')">
								<a-col :span="8">
									<a-form-item label="起始号码">
										<a-input @blur="startCardNoBlur" v-decorator="['startCardNo', {rules: [{ required: !(isVirtual =='是'), message: '起始号码不能为空!' }]}]" />
										<a-input style="display:none" v-decorator="['startNo']" />
										<a-input style="display:none" v-decorator="['docNoLen']" />
										<a-input style="display:none" v-decorator="['docTypeCode']" />
									</a-form-item>
								</a-col>
								<a-col :span="8">
									<a-form-item label="终止号码">
										<a-input @blur="endCardNoBlur" v-decorator="['endCardNo', {rules: [{ required: !(isVirtual =='是'), message: '终止号码不能为空!' }]}]" />
										<a-input style="display:none" v-decorator="['endNo']" />
									</a-form-item>
								</a-col>
								<a-col :span="8">
									<a-form-item label="票面金额">
										<a-input disabled v-decorator="['price']" />
									</a-form-item>
								</a-col>
							</a-row>
							<a-row v-show="!(isVirtual =='是')">
								<a-col :span="8">
									<a-form-item label="合计金额">
										<a-input disabled v-decorator="['totalPrice']" />
									</a-form-item>
								</a-col>
							</a-row>
						</a-col>
					</a-row>
				</a-card>
			</a-form>
			<div slot="footer">
				<a-button type="" @click="formModal=false">取消</a-button>
				<a-button :loading="submitLoading" type="primary" @click="submitForm">保存</a-button>
			</div>
    </a-modal>
		<ModalReceiverSelect ref="modalReceiverSelect" @on-update="updateReceiver" />
  </div>
</template>
<script>
import api from '@/api/api-health-card'
import DicSelect from '@/components/dic-select'
import OrgSelect2 from '@/components/org-select2'
import ModalReceiverSelect from './modal-receiver-select'
import BudgetItemSelect from '@/components/budget-item-select2'

export default {
	name: 'card-send-form',
	components: { DicSelect, OrgSelect2, BudgetItemSelect, ModalReceiverSelect },
	data () {
		return {
			dataFormLayout: {
				labelCol: { span: 9 },
				wrapperCol: { span: 15 }
			},
			spinning: false,
			extraParam: {
				yCount: 0
			},
			isAdd: true,
			modalWidth: 1170,
			modalTitle: '',
			submitLoading: false,
			formModal: false,
			receiveIdTypeDisabled: true,
			receiveGenderDisabled: true,
			dataForm: this.$form.createForm(this),
			disabledReceiveType: false
		}
	},
	computed: {
		isVirtual () {
			return this.extraParam.isVirtual
		},
		comItemParam () {
			let param = {
				docCode: this.extraParam.docCode,
				docCatCode: this.extraParam.docCatCode,
				isVirtual: this.extraParam.isVirtual
			}
			return param
		}
	},
	mounted () {

	 },
	methods: {
		// 总公司最小号
		selectDocMinNo (docDefId) {
			api.selectDocMinNoById({
				docDefId
			}).then(res => {
				if (res.data == null) {
					this.$message.error('总公司健管卡库存不足!')
				} else {
					this.$nextTick(() => {
						this.dataForm.setFieldsValue({
							startNo: res.data
						})
					})
				}
			}).finally(() => {
			})
		},
		// 获取docId
		checkDocId (data, dateEnd, itemEndDate) {
			api.selectDocMinNoById(data).then(res => {
				var row = res.data
				for (let j = 0, len = row.length; j < len; j++) {
					var docId = row[j].docId
					var invalidDate = row[j].invalidDate
					var dateStart = new Date(invalidDate)
					if (dateEnd < dateStart) {
						this.updateDocApply(docId, itemEndDate)
					}
				}
			}).finally(() => {
			})
		},
		// 卡日期更新为项目日期
		updateDocApply (docId, itemEndDate) {
			api.selectDocMinNoById({
				docId,
				itemEndDate
			}).then(res => {

			}).finally(() => {
			})
		},
		comTotalPrice () {
			let applyQuantity = this.dataForm.getFieldsValue().applyQuantity
			let price = this.dataForm.getFieldsValue().price
			if (applyQuantity) {
				return parseInt(price) * parseInt(applyQuantity)
			}
			return 0
		},
		budgetItemChange (itemCode) {
			let docCode = this.extraParam.docCode
			if (!itemCode || !docCode) return

			let param = {
				budgetItemCode: itemCode,
				docCode: docCode
			}
			api.getBudgetItemDetail(param).then(res => {
				let obj = res.data
				let data = {
					itemEndDate: obj.itemEndDate,
					deptCode: obj.deptName,
					orgCode: obj.orgCode
				}
				console.log(data.orgCode)

				Object.assign(this.extraParam, data)
				this.dataForm.setFieldsValue(data)
			})
		},
		maxCount () {
			if (this.extraParam && this.extraParam.yCount) {
				return parseInt(this.extraParam.yCount) + 1
			}

			return 10
		},
		addForm (obj) {
			this.extraParam = obj || {}
			this.isAdd = true
			this.modalTitle = '新建健管卡申请'
			this.formModal = true

			this.$nextTick(() => {
				this.dataForm.resetFields()
				this.dataForm.setFieldsValue({})
			})
		},
		editForm (docCode, extraParam) {
		  console.log("extraParam:", extraParam)
			this.extraParam = extraParam || {}
			this.modalTitle = '编辑健管卡申请'
			this.isAdd = false
			this.formModal = true
			this.disabledReceiveType = false
			this.spinning = false
			this.dataForm.resetFields()
			this.$nextTick(() => {
				this.dataForm.setFieldsValue(this.extraParam)
				// 唉，手动置空，暂时处理
				this.dataForm.setFieldsValue({receiveCode: '', receiveType: '', receiveName: '', receiveIdTypeName: '', receiveIdNo: '', receiveGender: '', receiveBirthday: ''})
			})
			// 当是虚拟卡时, 不显示票面金额和总金额字段
			// wst4.25 新增需求 虚拟卡隐藏起始号和终止号
			if (extraParam.isVirtual === "是") {
				// 自动带出总公司最小号
				this.selectDocMinNo(extraParam.docDefId)
			}
		},
		submitForm () {
			this.dataForm.validateFields((error, values) => {
				if (error) {
					this.$message.error('表单填写不完整！')
					return
				}
				// 选中行信息
				let ep = this.extraParam
				// 卡日期
				let { invalidDate, docDefId, yCount, isVirtual } = ep
				// 项目截止日期/申请数量
				let { itemEndDate, applyQuantity, startNo, endNo } = values
				// 校验  项目到期
				let nowDate = new Date()
				let itemDate = new Date(itemEndDate)
				if (itemDate < nowDate) {
					this.$message.error("项目已到期")
					return
				}
				if (isVirtual !== "是") {
					if (parseInt(endNo) < parseInt(startNo)) {
						this.$message.error("终止号不能小于起始号")
						return
					}
					if ((parseInt(endNo) - parseInt(startNo) + 1) != parseInt(applyQuantity)) {
						this.$message.error("申请数量与起止号段不一致")
						return
					}
					if (parseInt(applyQuantity) > parseInt(yCount)) {
						this.$message.error("总公司健管卡库存不足")
						return
					}
				} else { // 虚拟卡
					if (parseInt(applyQuantity) > parseInt(yCount)) {
						this.$message.error("总公司健管卡库存不足")
						return
					}
					// 虚拟卡如果 项目日期<卡日期   取项目日期 2019.9.11  改
					let dateEnd = new Date(itemEndDate)
					this.checkDocId(values, dateEnd, itemEndDate)
				}

				this.receiveIdTypeDisabled = false
				this.receiveGenderDisabled = false

				let formData = Object.assign({}, values)
				let data = Object.assign(this.extraParam, formData)
				data.totalPrice = this.comTotalPrice()
				data.receiver = data.receiveName
				this.submitLoading = true
				api.stockApplySumit(data).then(res => {
					this.$message.success('保存成功!')
					this.formModal = false
					this.$emit('on-update')
				}).finally(() => {
					this.submitLoading = false
				})
			})
		},
		onSearchReceiver () {
			this.$refs.modalReceiverSelect.show(this.dataForm.getFieldValue('receiveType'))
		},
		updateReceiver (obj) {
			delete obj.orgCode
			delete obj.startNo
			delete obj.endNo
			delete obj.applyQuantity
			Object.assign(this.extraParam, obj)
			this.dataForm.setFieldsValue(obj)
			this.disabledReceiveType = true
		},
		applyQuantityBlur () {
			if (!this.dataForm.getFieldValue('applyQuantity')) {
				return
			}
			// 单证代码
			let docCode = this.dataForm.getFieldValue('docCode')
			// 虚拟卡
			if (this.isVirtual === '是') {
				let startNo = this.dataForm.getFieldValue('startNo')
				let data = {"docNo": startNo, "docCode": docCode}
				api.queryCardNo(data).then(res => {
					this.dataForm.setFieldsValue({'startCardNo': res.data})
					let applyQuantity = parseInt(this.dataForm.getFieldValue('applyQuantity'))
					let price = parseInt(this.dataForm.getFieldValue('price'))
					let endNo = this.addPreZero(parseInt(startNo) + applyQuantity - 1)
					// 设置末尾接口
					this.dataForm.setFieldsValue({'endNo': endNo})
					let data1 = {"docNo": endNo, "docCode": docCode}
					api.queryCardNo(data1).then(res1 => {
						this.dataForm.setFieldsValue({'endCardNo': res1.data})
						if (price) {
							var totalPrice = applyQuantity * price
							this.dataForm.setFieldsValue({'totalPrice': totalPrice})
						}
					})
				})
				return
			}
			// 非虚拟卡
			// 卡单号
			let endCardNo = this.dataForm.getFieldValue('endCardNo')
			let startCardNo = this.dataForm.getFieldValue('startCardNo')
			// 票面金额
			let price = parseInt(this.dataForm.getFieldValue('price'))
			// 数量
			let applyQuantity = parseInt(this.dataForm.getFieldValue('applyQuantity'))

			if (startCardNo) {
				// 单证号码
				let startNo = this.getDocNo(startCardNo)
				let endNo = applyQuantity + startNo - 1
				let data = {"docNo": this.addPreZero(endNo), "docCode": docCode}
				api.queryCardNo(data).then(res => {
					this.dataForm.setFieldsValue({
						'endCardNo': res.data,
						'startNo': this.addPreZero(startNo),
						'endNo': this.addPreZero(endNo)
					})
					if (price) {
						let totalPrice = applyQuantity * price
						this.dataForm.setFieldsValue({'totalPrice': totalPrice})
					}
				})
			}
			if (endCardNo) {
				let endNo = this.getDocNo(endCardNo)
				let startNo = endNo - applyQuantity + 1
				let data = {"docNo": this.addPreZero(startNo), "docCode": docCode}
				api.queryCardNo(data).then(res => {
					this.dataForm.setFieldsValue({
						'startCardNo': startCardNo,
						'startNo': this.addPreZero(startNo),
						'endNo': this.addPreZero(endNo)
					})
					if (price) {
						let totalPrice = applyQuantity * price
						this.dataForm.setFieldsValue({'totalPrice': totalPrice})
					}
				})
			}
		},
		startCardNoBlur () {
			if (!this.dataForm.getFieldValue('startCardNo')) {
				return
			}
			// 非虚拟卡
			// 卡单号
			let endCardNo = this.dataForm.getFieldValue('endCardNo')
			let startCardNo = this.dataForm.getFieldValue('startCardNo')
			// 票面金额
			let price = parseInt(this.dataForm.getFieldValue('price'))
			// 数量
			let applyQuantity = parseInt(this.dataForm.getFieldValue('applyQuantity'))
			// 单证代码
			let docCode = this.dataForm.getFieldValue('docCode')
			if (applyQuantity) {
				// 单证号码
				let startNo = this.getDocNo(startCardNo)
				let endNo = applyQuantity + startNo - 1

				let data = {"docNo": this.addPreZero(endNo), "docCode": docCode}
				api.queryCardNo(data).then(res => {
					this.dataForm.setFieldsValue({
						'endCardNo': res.data,
						'startNo': this.addPreZero(startNo),
						'endNo': this.addPreZero(endNo)
					})
					if (price) {
						let totalPrice = applyQuantity * price
						this.dataForm.setFieldsValue({'totalPrice': totalPrice})
					}
				})
			}
			if (endCardNo) {
				let startNo = this.getDocNo(startCardNo)
				let endNo = this.getDocNo(endCardNo)
				if (!endNo || !startNo) {
					this.$message.error("号码不存在")
					return
				} else {
					this.dataForm.setFieldsValue({'applyQuantity': (endNo - startNo + 1)})
				}
				this.dataForm.setFieldsValue({
					'startNo': this.addPreZero(startNo),
					'endNo': this.addPreZero(endNo)
				})
				if (price && applyQuantity) {
					let totalPrice = applyQuantity * price
					this.dataForm.setFieldsValue({'totalPrice': totalPrice})
				}
			}
		},
		endCardNoBlur () {
			console.log("this.dataForm.getFieldValue('endCardNo'):", this.dataForm.getFieldValue('endCardNo'))
			if (!this.dataForm.getFieldValue('endCardNo')) {
				return
			}
			// 非虚拟卡
			// 卡单号
			let endCardNo = this.dataForm.getFieldValue('endCardNo')
			let startCardNo = this.dataForm.getFieldValue('startCardNo')
			// 票面金额
			let price = parseInt(this.dataForm.getFieldValue('price'))
			// 数量
			let applyQuantity = parseInt(this.dataForm.getFieldValue('applyQuantity'))
			// 单证代码
			let docCode = this.dataForm.getFieldValue('docCode')
			if (applyQuantity) {
				// 单证号码
				let endNo = this.getDocNo(endCardNo)
				let startNo = endNo - applyQuantity + 1
				let data = {"docNo": this.addPreZero(startNo), "docCode": docCode}
				api.queryCardNo(data).then(res => {
					this.dataForm.setFieldsValue({
						'endCardNo': res.data,
						'startNo': this.addPreZero(startNo),
						'endNo': this.addPreZero(endNo)
					})
					if (price) {
						let totalPrice = applyQuantity * price
						this.dataForm.setFieldsValue({'totalPrice': totalPrice})
					}
				})
			}
			if (startCardNo) {
				// 单证号码
				let startNo = this.getDocNo(startCardNo)
				let endNo = this.getDocNo(endCardNo)
				if (!endNo || !startNo) {
					this.$message.error("号码不存在")
					return
				} else {
					this.dataForm.setFieldsValue({'applyQuantity': (endNo - startNo + 1)})
				}
				this.dataForm.setFieldsValue({
					'startNo': this.addPreZero(startNo),
					'endNo': this.addPreZero(endNo)
				})
				if (price && applyQuantity) {
					let totalPrice = applyQuantity * price
					this.dataForm.setFieldsValue({'totalPrice': totalPrice})
				}
			}
		},
		addPreZero (docNo) {
			let docNoLen = this.dataForm.getFieldValue('docNoLen')
			let t = (docNo + '').length,
				s = ''
			console.log('t', docNo + '', t)
			for (let i = 0; i < docNoLen - t; i++) {
				s += '0'
			}
			return s + docNo
		},
		getDocNo (cardNo) {
			let docTypeCode = this.dataForm.getFieldValue('docTypeCode')
			let docNoLen = this.dataForm.getFieldValue('docNoLen')
			let docNo = ''
			// 卡单号码等于单证号码长度
			if (cardNo.length === parseInt(docNoLen)) {
				docNo = cardNo
			} else {
				// 卡单号码不等于单证号码长度，且类型码不为空
				if (docTypeCode) {
					let docTypeLen = docTypeCode.length
					docNo = cardNo.substring(docTypeLen, parseInt(docTypeLen) + parseInt(docNoLen))
				} else {
					docNo = cardNo.substring(0, docNoLen)
				}
			}
			return parseInt(docNo)
		}
	}
}
</script>
<style>

</style>
