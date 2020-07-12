<template>
  <div>
		<a-modal v-model="formModal" style="top: 30px;" :width="modalWidth" :title="modalTitle">
			<a-form :form="dataForm" :labelCol="dataFormLayout.labelCol" :wrapperCol="dataFormLayout.wrapperCol">
				<a-row :gutter="16">
					<a-col :span="8">
            <a-form-item label="模板编码">
              <a-input v-decorator="['templetCode', {initialValue: '',rules: [{ required: true, message: '请录入!' }]}]" />
            </a-form-item>
          </a-col>
					<a-col :span="8">
            <a-form-item label="模板名称">
              <a-input v-decorator="['templetName', {initialValue: '',rules: [{ required: true, message: '请录入!' }]}]" />
            </a-form-item>
          </a-col>
				</a-row>
				<a-row :gutter="1">
					<a-form-item label="模板描述" :labelCol="{span: 3}" :wrapperCol="{span:21}">
						<a-textarea :allowClear="true" v-decorator="['templetRemark', {initialValue: ''}]" />
					</a-form-item>
				</a-row>
			</a-form>
			<div slot="footer">
				<a-button type="" @click="formModal=false">取消</a-button>
				<a-button :loading="submitLoading" type="primary" @click="submitForm">保存</a-button>
			</div>
    </a-modal>
  </div>
</template>
<script>
import api from "@/api/api-process-config"
import OrgSelect from "@/components/org-select"
import DicSelect from '@/components/dic-select'

export default {
	name: 'queue-define-form',
	components: { DicSelect, OrgSelect },
	data () {
		return {
			dataFormLayout: {
				labelCol: { span: 9 },
				wrapperCol: { span: 15 }
			},
			spinning: false,
			extraParam: {},
			isAdd: true,
			modalWidth: 800,
			modalTitle: '',
			submitLoading: false,
			formModal: false,
			dataForm: this.$form.createForm(this)
		}
	},
	mounted () {

	 },
	methods: {
		addForm (obj) {
			this.extraParam = obj || {}
			this.isAdd = true
			this.modalTitle = '新建模板'
			this.formModal = true

			this.$nextTick(() => {
				this.dataForm.resetFields()
				this.dataForm.setFieldsValue({})
			})
		},
		editForm (queueId, extraParam) {
			this.extraParam = extraParam || {}
			this.modalTitle = '编辑模板'
			this.isAdd = false
			this.formModal = true
			this.spinning = false
			this.$nextTick(() => {
				this.dataForm.resetFields()
				this.dataForm.setFieldsValue(this.extraParam)
			})
		},
		submitForm () {
			this.dataForm.validateFields((error, values) => {
				if (error) {
					return
				}
				let formData = Object.assign({}, values)
				let data = Object.assign(this.extraParam, formData)
				this.submitLoading = true
				if (data.queueId) {
					api.updateQueueInfo([data]).then(res => {
						this.$message.success('保存成功!')
						this.formModal = false
						this.$emit('on-update')
					}).finally(() => {
						this.submitLoading = false
					})
				} else {
					api.addQueueInfo(data).then(res => {
						this.$message.success('保存成功!')
						this.formModal = false
						this.$emit('on-update')
					}).finally(() => {
						this.submitLoading = false
					})
				}
			})
		}
	}
}
</script>
<style>

</style>
