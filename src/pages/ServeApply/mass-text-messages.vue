<template>
    <a-modal v-model="formModal" style="top: 30px;" :width="'60%'" title="短信提醒服务" footer="">
        <!-- 如何 每一步的撤销申请  和 提交都触发此短信页面-->
        <a-card>
            <a-divider orientation="left"><a-icon type="mail"/> 发送短信</a-divider>
            <a-form :form="dataForm" :label-col="{ span: 6 }" :wrapper-col="{ span: 14 }">
                <div v-show="showCustomer">
                    <a-form-item label="客户姓名：">
                        <a-input v-decorator="['customerName', {initialValue:''}]"/>
                    </a-form-item>
                    <a-form-item label="手机号码：">
                        <a-input v-decorator="['customerPhone', {initialValue:''}]"/>
                    </a-form-item>
                    <a-form-item label="短信内容">
                        <a-textarea :rows="4" v-decorator="['customerContent', {initialValue:''}]"/>
                    </a-form-item>
                    <a-form-item label="是否发送客户短信提醒：">
                        <DicSelect dicType="YES_NO" v-decorator="['customerFlag', {initialValue:'Y'}]"/>
                    </a-form-item>
                </div>
                <div v-show="showAccompany">
                  <a-form-item label="陪诊人员姓名：">
                    <a-input v-decorator="['accompanyName', {initialValue:''}]" />
                  </a-form-item>
                  <a-form-item label="陪诊人员手机号：">
                    <a-input v-decorator="['accompanyPhone', {initialValue:''}]" />
                  </a-form-item>
                  <a-form-item label="陪诊员短信内容">
                    <a-textarea :rows="4" v-decorator="['accompanyContent', {initialValue:''}]"/>
                  </a-form-item>
                  <a-form-item label="是否发送管家短信提醒：">
                    <DicSelect dicType="YES_NO" v-decorator="['accompanyFlag', {initialValue:'Y'}]"/>
                  </a-form-item>
                </div>
                <div v-show="showPICC">
                  <a-form-item label="PICC陪诊人员姓名：">
                    <a-input v-decorator="['piccName', {initialValue:''}]" />
                  </a-form-item>
                  <a-form-item label="PICC陪诊员手机号：">
                    <a-input v-decorator="['piccPhone', {initialValue:''}]" />
                  </a-form-item>
                  <a-form-item label="PICC陪诊员短信内容：">
                    <a-textarea :rows="4" v-decorator="['piccContent', {initialValue:''}]" />
                  </a-form-item>
                  <a-form-item label="是否发送PICC陪诊管家短信提醒：">
                    <DicSelect dicType="YES_NO" v-decorator="['piccFlag', {initialValue:'Y'}]"/>
                  </a-form-item>
                </div>
                <a-form-item :wrapper-col="{ span: 11, offset: 5 }">
                    <a-row :gutter="16">
                        <a-col :span="24" style="margin:10px 0 0 0;text-align:right">
                            <a-button type="" @click="applyForm" class="editable-add-btn" style="float:right;margin-right:10px;">提交并申请</a-button>
                            <a-button type="primary" :loading="submitLoading" @click="submitForm" class="editable-add-btn" style="float:right;margin-right:10px;">提交</a-button>
                        </a-col>
                    </a-row>
                </a-form-item>
            </a-form>
        </a-card>
    </a-modal>
</template>
<script>
import api from "@/api/api-serve-apply"
import DicSelect from '@/components/dic-select'
export default {
	name: "mass-text-messages",
	props: {
		sendmsg: {
			type: Array,
			default () {
				return []
			}
		}
	},
	data () {
		return {
			dataForm: this.$form.createForm(this),
			submitLoading: false,
			formModal: false,
			showAccompany: false,
			showCustomer: false,
			showPICC: false,
			serApplyId: '',
			customerData: {},
			accompanyData: {},
			piccData: {},
			serviceData: {}
		}
	},
	components: { DicSelect },
	methods: {
		createMessL () {
			let messL = []
			if (this.dataForm.getFieldValue('customerFlag') == 'Y' && this.showCustomer) {
				messL.push(this.customerData)
			}
			if (this.dataForm.getFieldValue('accompanyFlag') == 'Y' && this.showAccompany) {
				messL.push(this.accompanyData)
			}
			if (this.dataForm.getFieldValue('piccFlag') == 'Y' && this.showPICC) {
				messL.push(this.piccData)
			}
			let messData = {
				messL: messL
			}
			return messData
		},
		applyForm () {
			let messData = this.createMessL()
			if (messData.messL.length > 0) {
				api.sendMassSms(messData).then(res => {
					if (res.status === 0) {
						this.$message.success("短信发送成功！")
					}
				}).finally(() => {
				})
			}
			this.serviceData.status = '00'
			this.$emit("on-update", this.serviceData)
			this.formModal = false
		},
		submitForm () {
			let messData = this.createMessL()
			if (messData.messL.length > 0) {
				api.sendMassSms(messData).then(res => {
					if (res.status === 0) {
						this.$message.success("短信发送成功！")
					}
				}).finally(() => {
				})
			}
			this.$emit("on-update", this.serviceData)
			this.formModal = false
		},
		showForm (messageData) {
			let taskInfo = messageData.taskInfo
			this.serviceData = messageData.serviceData
			taskInfo.payDateStr = taskInfo.payDate
			taskInfo.payDate = ""
			let sendMess = {
				allInfo: taskInfo,
				newInfo: this.serviceData
			}
			this.serviceData.payDate = this.serviceData.payDateStr
			delete sendMess.allInfo.updateTime
			api.selectSMInfo(sendMess).then(res => {
				if (res.status === 0) {
					if (res.data.sendingInfo.length > 0) {
						this.formModal = true
						let data = {
							sendingInfo: res.data.sendingInfo,
							serviceData: this.serviceData
						}
						this.initForm(data)
					} else {
						this.$emit("on-update", this.serviceData)
					}
				}
			}).finally(() => {
			})
		},
		initForm (obj) {
			if (obj.sendingInfo.length > 0) {
				obj.sendingInfo.map(item => {
					if (obj.sendingInfo.length === 1 && item.sendingObjects === '04') {
						this.formModal = false
						this.$emit("on-update", {})
					}
					// 客户
					if (item.sendingObjects === '01') {
						this.showCustomer = true
						this.customerData = {
							serApplyId: obj.serviceData.serviceReservationId,
							serApplyStatus: item.templateType,
							sendObjectsName: obj.serviceData.patientName,
							sendObjects: item.sendingObjects,
							sendMessage: item.sendingInfo,
							sendNo: obj.serviceData.patientTelephone
						}
						this.$nextTick(() => {
							this.dataForm.setFieldsValue({customerName: this.customerData.sendObjectsName,
								customerPhone: this.customerData.sendNo,
								customerContent: this.customerData.sendMessage})
						})
					}
					// 陪诊人员
					if (item.sendingObjects === '02') {
						this.accompanyData = {
							serApplyId: obj.serviceData.serviceReservationId,
							serApplyStatus: item.templateType,
							sendObjectsName: obj.serviceData.nextStaffName ? obj.serviceData.nextStaffName : obj.serviceData.staffName,
							sendObjects: item.sendingObjects,
							sendMessage: item.sendingInfo,
							sendNo: obj.serviceData.nextStaffTel ? obj.serviceData.nextStaffTel : obj.serviceData.staffTel
						}
						this.showAccompany = !!this.accompanyData.sendNo
						this.$nextTick(() => {
							this.dataForm.setFieldsValue({accompanyName: this.accompanyData.sendObjectsName,
								accompanyPhone: this.accompanyData.sendNo,
								accompanyContent: this.accompanyData.sendMessage})
						})
					}
					// picc陪诊人员
					if (item.sendingObjects === '03') {
						this.piccData = {
							serApplyId: obj.serviceData.serviceReservationId,
							serApplyStatus: item.templateType,
							sendObjectsName: obj.serviceData.nextPiccStaffName ? obj.serviceData.nextPiccStaffName : obj.serviceData.piccStaffName,
							sendObjects: item.sendingObjects,
							sendMessage: item.sendingInfo,
							sendNo: obj.serviceData.nextPiccStaffMobile ? obj.serviceData.nextPiccStaffMobile : obj.serviceData.piccStaffMobile
						}
						this.showPICC = !!this.piccData.sendNo
						this.$nextTick(() => {
							this.dataForm.setFieldsValue({piccName: this.piccData.sendObjectsName,
								piccPhone: this.piccData.sendNo,
								piccContent: this.piccData.sendMessage})
						})
					}
				})
			}
		}
	}
}
</script>

