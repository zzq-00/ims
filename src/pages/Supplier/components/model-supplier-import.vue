<template>
  <a-modal v-model="formModal" style="top: 30px;" :width="modalWidth" :title="modalTitle" >
    <a-form :form="dataForm" :labelCol="dataFormLayout.labelCol" :wrapperCol="dataFormLayout.wrapperCol">
        <a-row :gutter="16">
          <a-col :span="16">
			<a-button type="primary" class="editable-add-btn" style="margin:5px 10px 0 0;" @click="download">机构模板下载</a-button>
			<a-button type="primary" class="editable-add-btn" style="margin:5px 10px 0 0;" @click="downloadPha">药店模板下载</a-button>
		  </a-col>
		</a-row>
	</a-form>
	<template slot="footer">
		<a-button type="" @click="formModal=false">关闭</a-button>
	</template>
  </a-modal>
</template>
<script>
import supApi from '@/api/api-supplier'

export default {
	name: 'model-supplier-import',
	data () {
		return {
			dataFormLayout: {
				labelCol: { span: 9 },
				wrapperCol: { span: 15 }
			},
			modalWidth: 450,
			modalTitle: '请选择需要下载的导入模板',
			formModal: false,
			dataForm: this.$form.createForm(this)
		}
	},
	mounted () {
	},
	methods: {
		showModel() {
			this.formModal = true
		},
		download() {
			supApi.download().then(res => {
				if (res.status === undefined) {
					// base64内容，文件名
					this.$downloadFileByBase64(res, `机构导入模板.xlsx`)
				} else {
					this.$message.error('文件下载失败，请重试')
				}
			}).finally(() => {
			})
		},
		downloadPha() {
			supApi.downloadPha().then(res => {
				if (res.status === undefined) {
					// base64内容，文件名
					this.$downloadFileByBase64(res, `药店导入模板.xlsx`)
				} else {
					this.$message.error('文件下载失败，请重试')
				}
			}).finally(() => {
			})
		}
		
	}
}
</script>
<style>

</style>
