<template>
  <div>
		<a-modal v-model="formModal" style="top: 30px;" :width="600" title="工作量审核">
			<a-form :form="dataForm" :label-col="{ span: 4 }" :wrapper-col="{ span: 16 }">
				<a-form-item label="审核结论">
					<a-select v-decorator="['status', {initialValue: '', rules: [{ required: true, message: '审核结论不能为空!' }]}]">
						<a-select-option value="03">审核通过</a-select-option>
						<a-select-option value="04">审核退回</a-select-option>
					</a-select>
				</a-form-item>
				<a-form-item label="审核意见">
					<a-textarea :autosize="{ minRows: 4, maxRows: 8 }" v-decorator="['auditContent']" placeholder="审核退回时必须录入" />
				</a-form-item>
			</a-form>
			<div slot="footer">
				<a-button type="" @click="formModal=false">取消</a-button>
				<a-button :loading="submitLoading" @click="submitForm" type="primary">提交</a-button>
			</div>
		</a-modal>
  </div>
</template>
<script>
import api from '@/api/api-serve-apply'
export default {
	name: 'work-autdit-modal',
	props: {
		timesSourece: {
			type: String,
			required: true,
			default () {
				return null
			}
		}
	},
	data () {
		return {
			dataForm: this.$form.createForm(this, { name: 'coordinated' }),
			formModal: false,
			extraParam: { list: [] },
			submitLoading: false
		}
	},
	mounted () {

	},
	methods: {
		show (extraPam) {
			this.extraParam = extraPam || { list: [] }
			this.formModal = true
			this.dataForm.resetFields()
		},
		submitForm () {
			this.dataForm.validateFields((error, values) => {
				if (error) {
					return
				}
				if (values.status === '04' && !values.auditContent) {
					this.$Message.warning('审核退回时,请填写审核意见!')
					return
				}

				let formData = Object.assign({}, values)
				let data = {
					serviceTimesBoList: [],
					timesSourece: this.timesSourece,
					status: formData.status
				}

				this.extraParam.list.forEach(item => {
					var obj = {}
					obj.serviceTimeId = item.serviceTimeId
					obj.reportedDate = item.reportedDate
					obj.timesSourece = this.timesSourece
					obj.auditContent = formData.auditContent
					obj.status = formData.status

					data.serviceTimesBoList.push(obj)
				})

				this.submitLoading = true
				api.submitGroupSubsidiaryAudit(data).then(res => {
					this.$Message.success('审核成功!')
					this.formModal = false
					this.$emit('on-update')
				}).finally(() => {
					this.submitLoading = false
				})
			})
		}
	}
}
</script>
