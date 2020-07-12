<template>
    <a-modal v-model="formModal" style="top: 30px;" :width="'60%'" title="短信提醒服务" footer="">
        <!-- 如何 每一步的撤销申请  和 提交都触发此短信页面-->
        <a-card ref="patientD">
            <a-divider orientation="left"><a-icon type="mail"/> 发送短信</a-divider>
            <a-form :form="dataForm" :label-col="{ span: 6 }" :wrapper-col="{ span: 14 }">
                <a-form-item label="客户姓名：">
                    <a-input v-decorator="['sendObjectsName', {}]" />
                </a-form-item>
                <a-form-item label="手机号码：">
                    <a-input placeholder="请注意：手机号之间用英文“,”隔开'" v-decorator="['sendNo', { rules: [{ required: true, message: '手机号不能为空，多个手机号用英文逗号隔开' }] }]" />
                </a-form-item>
                <a-form-item label="短信内容">
                    <a-textarea v-decorator="['sendMessage', { rules: [{ required: true, message: '短信内容不能为空' }] }]" :autosize="{ minRows: 6, maxRows: 10 }" />
                </a-form-item>
                 <a-form-item label="是否发送客户短信提醒：">
                    <DicSelect dicType="YES_NO"
                         v-decorator="['isNotSendP', {rules: [{ required: true, message: '不能为空!' }]}]"/>
                </a-form-item>
                <a-form-item :wrapper-col="{ span: 11, offset: 5 }">
                    <a-row :gutter="16">
                        <a-col :span="24" style="margin:10px 0 0 0;text-align:right">
                        <!-- <a-button type="" class="editable-add-btn" style="float:right;margin-right:10px;">发送历史查询</a-button> -->
                        <a-button type="" @click="applyForm" class="editable-add-btn" style="float:right;margin-right:10px;">提交并申请</a-button>
                        <a-button type="primary" :loading="submitLoading" @click="submitForm" class="editable-add-btn" style="float:right;margin-right:10px;">提交</a-button>
                        </a-col>
                    </a-row>
                </a-form-item>
            </a-form>
          <ApplyInfoForm ref="applyInfoForm"/>
        </a-card>
    </a-modal>

</template>
<script>
import api from "@/api/api-serve-apply"
import DicSelect from '@/components/dic-select'
import ApplyInfoForm from "@/pages/ServeApply/components/apply-info-form"
export default {
	name: "mass-text-message-single",
	data () {
		return {
			dataForm: this.$form.createForm(this),
			submitLoading: false,
			molibeMesInfo: [],
			formModal: false,
			taskInfo: {}
		}
	},
	components: { DicSelect, ApplyInfoForm },
	methods: {
		applyForm () {
			this.dataForm.validateFields((error, values) => {
				if (error) {
					return
				}
				let form = {messL: []}
				if (values.isNotSendP === "N") {
					this.formModal = false
					return
				}
				delete values.isNotSendP
				let formData = Object.assign({}, values)
				formData.sendObjects = this.taskInfo.messageTemplateVoL[0].sendingObjects
				formData.serApplyId = this.taskInfo.serviceApplication.serviceReservationId
				form.messL.push(formData)
				api.sendMassSms(form).then(res => { // sendMess
					if (res.status === 0) {
						this.$message.success('发送成功!')
					} else {
						this.$message.success('发送失败!')
					}
				})
				this.formModal = false
				this.$refs.applyInfoForm.showApplyInfoForm()
			})
		},
		submitForm () {
			this.dataForm.validateFields((error, values) => {
				if (error) {
					return
				}
				let form = {messL: []}
				if (values.isNotSendP === "N") {
					this.formModal = false
					return
				}
				delete values.isNotSendP
				let formData = Object.assign({}, values)
				formData.sendObjects = this.taskInfo.messageTemplateVoL[0].sendingObjects
				formData.serApplyId = this.taskInfo.serviceApplication.serviceReservationId
				form.messL.push(formData)
				api.sendMassSms(form).then(res => { // sendMess
					if (res.status === 0) {
						this.$message.success('发送成功!')
					} else {
						this.$message.success('发送失败!')
					}
				})
				this.formModal = false
				this.$emit("on-update")
			})
		},
		show (extraParams) {
			this.formModal = true
			this.taskInfo = extraParams
			if (extraParams.messageTemplateVoL && extraParams.messageTemplateVoL.length === 1) {
				let columnValue = extraParams.messageTemplateVoL[0]
				let data = extraParams.serviceApplication
				if (columnValue.sendingObjects === "01") {
					this.$nextTick(() => {
						this.dataForm.setFieldsValue({
							sendMessage: columnValue.sendingInfo,
							sendObjectsName: data.patientName,
							sendNo: data.patientTelephone,
							isNotSendP: 'Y'
						})
					})
				}
			}
		}
	}
}
</script>

