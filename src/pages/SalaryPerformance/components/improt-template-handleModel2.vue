<template>
	<div>
		<a-modal v-model="formModal" style="top: 30px;" :width="modalWidth" :title="modalTitle">
			<a-form :form="dataForm" style="margin: 10px;" :labelCol="dataFormLayout.labelCol" :wrapperCol="dataFormLayout.wrapperCol">
				<a-spin :spinning="spinning" />
        <div v-html="questionHtml" />
        </a-form>
			<div slot="footer">
				<a-button type=""  @click="sure">确定</a-button>
			</div>
		</a-modal>
	</div>
</template>
<script>
import api from '@/api/api-questionnaire'
export default {
	name: 'improt-template-handleModel2',
	data () {
		return {
			dataFormLayout: {
				labelCol: { span: 8 },
				wrapperCol: { span: 16 }
			},
			spinning: false,
			extraParam: {},
			modalWidth: 970,
			modalTitle: '友情提示',
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
			this.modalTitle = '友情提示'
			this.isAdd = false
			this.formModal = true
			this.dataForm.resetFields()
			this.questionHtml = ''

			this.spinning = false
			this.questionHtml = this.extraParam.sameMSG
		},
		sure () {
			this.formModal = false
			if (this.extraParam.errorFileName !== undefined) {
				this.$message.error(this.extraParam.msg + ' 请点击失败清单下载查看！')
			}else {
				this.$message.success(this.extraParam.msg)
			}
		}
	}
}
</script>

