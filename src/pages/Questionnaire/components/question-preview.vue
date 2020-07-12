<template>
	<div>
		<a-modal v-model="formModal" style="top: 30px;" :width="modalWidth" :title="modalTitle">
			<a-form :form="dataForm" style="margin: 10px;" :labelCol="dataFormLayout.labelCol" :wrapperCol="dataFormLayout.wrapperCol">
				<a-spin :spinning="spinning" />
        <div v-html="questionHtml" />
        </a-form>
			<div slot="footer">
				<a-button type="" @click="formModal=false">关闭</a-button>
			</div>
		</a-modal>
	</div>
</template>
<script>
import api from '@/api/api-questionnaire'
export default {
	name: 'question-preview',
	data () {
		return {
			dataFormLayout: {
				labelCol: { span: 8 },
				wrapperCol: { span: 16 }
			},
			spinning: false,
			extraParam: {},
			modalWidth: 970,
			modalTitle: '问题预览',
			formModal: false,
			dataForm: this.$form.createForm(this),
			questionHtml: ''
		}
	},
	mounted () {

	},
	methods: {
		show (extraParam) {
			this.extraParam = extraParam || {}
			this.modalTitle = '问题预览'
			this.isAdd = false
			this.formModal = true
			this.dataForm.resetFields()
			this.questionHtml = ''

			this.spinning = true
			api.buildHtmlPublicQuestion(this.extraParam).then(res => {
				this.questionHtml = res.data
			}).finally(() => {
				this.spinning = false
			})
		}
	}
}
</script>

