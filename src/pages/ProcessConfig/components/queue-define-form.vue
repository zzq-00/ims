<template>
  <div>
		<a-modal v-model="formModal" style="top: 30px;" :width="modalWidth" :title="modalTitle">
			<a-form :form="dataForm" :labelCol="dataFormLayout.labelCol" :wrapperCol="dataFormLayout.wrapperCol">
				<a-row :gutter="8">
					<a-col :span="12">
						<a-form-item label="管理机构">
							<OrgSelect dicType="4" v-decorator="['orgCode', {initialValue: '',rules: [{ required: true, message: '请选择!' }]}]" placeholder="请选择" />
						</a-form-item>
					</a-col>
					<a-col :span="12">
            <a-form-item label="队列名称">
              <a-input v-decorator="['queueName', {initialValue: '',rules: [{ required: true, message: '请输入队列名称!' }]}]" />
            </a-form-item>
          </a-col>
				</a-row>
				<a-row :gutter="8">
					<a-col :span="12">
            <a-form-item label="是否允许订阅">
              <DicSelect dicType="YES_NO" :allowClear="true" v-decorator="['isOrder', {initialValue: '',rules: [{ required: true, message: '请选择!' }]}]" />
            </a-form-item>
          </a-col>
				</a-row>
				<a-row :gutter="8">
					<a-col :span="24">
            <a-form-item label="备注" :labelCol="{span: 4}" :wrapperCol="{span:20}">
						  <a-textarea :allowClear="true" v-decorator="['remark', {initialValue: ''}]" />
					  </a-form-item>
          </a-col>
				</a-row>
			</a-form>
			<div slot="footer">
				<a-button type="" @click="formModal=false">返回</a-button>
				<a-button v-if="!readonly" :loading="submitLoading" type="primary" @click="submitForm">保存</a-button>
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
				labelCol: { span: 8 },
				wrapperCol: { span: 16 }
			},
			spinning: false,
			extraParam: {},
			readonly: true,
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
			this.readonly = false
			this.modalTitle = '新建队列'
			this.formModal = true

			this.$nextTick(() => {
				this.dataForm.resetFields()
				this.dataForm.setFieldsValue({})
			})
		},
		editForm (extraParam, readonly) {
			this.extraParam = extraParam || {}
			this.modalTitle = '编辑队列'
			this.readonly = false
			if (readonly) {
				this.modalTitle = '查看队列'
				this.readonly = true
			}
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
					api.updateQueueInfo(data).then(res => {
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
