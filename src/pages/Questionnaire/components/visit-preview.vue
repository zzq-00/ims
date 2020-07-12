<template>
	<div>
		<a-modal v-model="formModal" style="top: 30px;" :width="modalWidth" :title="modalTitle">
			<a-form :form="dataForm" style="margin: 10px;" :labelCol="dataFormLayout.labelCol" :wrapperCol="dataFormLayout.wrapperCol">
				<a-spin :spinning="spinning" />
				<a-card title="问卷信息">
					<a-row :gutter="8">
						<a-col :span="12">
							<a-form-item label="问卷名称">
								<a-input :disabled="true" :value="detailInfo.qnrName" />
							</a-form-item>
						</a-col>
						<a-col :span="12">
							<a-form-item label="问卷编码">
								<a-input :disabled="true" :value="detailInfo.qnrCode" />
							</a-form-item>
						</a-col>
						<a-col :span="12">
							<a-form-item label="创建者">
								<a-input :disabled="true" :value="extraParam.insertOper" />
							</a-form-item>
						</a-col>
						<a-col :span="12">
							<a-form-item label="修改者">
								<a-input :disabled="true" :value="detailInfo.updateOper" />
							</a-form-item>
						</a-col>
						<a-col :span="12">
							<a-form-item label="创建时间">
								<a-input :disabled="true" :value="detailInfo.insertTimeDesc" />
							</a-form-item>
						</a-col>
						<a-col :span="12">
							<a-form-item label="修改时间">
								<a-input :disabled="true" :value="detailInfo.updateTimeDesc" />
							</a-form-item>
						</a-col>
					</a-row>
					<a-row>
						<a-col :span="24">
							<a-form-item label="问卷描述" :labelCol="{span: 4}" :wrapperCol="{span: 20}">
								<a-input :disabled="true" :value="detailInfo.qnrDesc" />
							</a-form-item>
						</a-col>
						<a-col :span="24">
							<a-form-item label="应用的服务" :labelCol="{span: 4}" :wrapperCol="{span: 20}">
								<a-input :disabled="true" :value="detailInfo.useServicesDesc" />
							</a-form-item>
						</a-col>
						<a-col :span="24">
							<a-form-item label="应用的产品" :labelCol="{span: 4}" :wrapperCol="{span: 20}">
								<a-input :disabled="true" :value="detailInfo.useProductsDesc" />
							</a-form-item>
						</a-col>
					</a-row>

					<a-row>
						<a-col :span="12">
							<a-form-item label="所在省">
								<a-input :disabled="true" :value="detailInfo.sorgProvincesDesc" />
							</a-form-item>
						</a-col>
						<a-col :span="12">
							<a-form-item label="所在市">
								<a-input :disabled="true" :value="detailInfo.sorgCitysDesc" />
							</a-form-item>
						</a-col>
					</a-row>

					<a-row>
						<a-col :span="24">
							<a-form-item label="服务机构" :labelCol="{span: 4}" :wrapperCol="{span: 20}">
								<a-input :disabled="true" :value="detailInfo.orgCodesDesc" />
							</a-form-item>
						</a-col>
						<a-col :span="24">
							<a-form-item label="供应商机构" :labelCol="{span: 4}" :wrapperCol="{span: 20}">
								<a-input :disabled="true" :value="detailInfo.supplierCodesDesc" />
							</a-form-item>
						</a-col>
					</a-row>

				</a-card>

				<a-card title="回访内容" style="margin-top: 20px;">
        	<div v-html="questionHtml" />
				</a-card>
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
	name: 'visit-preview',
	data () {
		return {
			dataFormLayout: {
				labelCol: { span: 8 },
				wrapperCol: { span: 16 }
			},
			spinning: false,
			extraParam: {},
			modalWidth: 970,
			modalTitle: '回访问卷预览',
			formModal: false,
			dataForm: this.$form.createForm(this),
			detailInfo: {},
			questionHtml: ''
		}
	},
	mounted () {

	},
	methods: {
		show (extraParam) {
			this.extraParam = extraParam || {}
			this.modalTitle = '回访问卷预览'
			this.isAdd = false
			this.formModal = true
			this.dataForm.resetFields()
			this.questionHtml = ''

			this.loadDetail()
		},
		loadDetail () {
			let params = {
				id: this.extraParam.qnrInfoId
			}
			this.spinning = true
			api.queryOneQnrInfo(params).then(res => {
				this.detailInfo = res.data

				this.loadHtml()
			}).finally(() => {
				this.spinning = false
			})
		},
		loadHtml () {
			api.qnrInfoQnrInfo(this.detailInfo).then(res => {
				this.questionHtml = res.data
			})
		}
	}
}
</script>

