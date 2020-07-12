<template>
  <a-card :bordered="false" title="供应商信息导入">
    <a-card>
      <a-form :form="filterForm" :labelCol="filterFormLayout.labelCol" :wrapperCol="filterFormLayout.wrapperCol">
        <a-row :gutter="16">
		  <a-col :span="8" style="text-align:left">
			<span type='margin:5px 10px 0 0;'>供应商信息导入：</span>
            <a-upload
				:file-list="fileList"
				:remove="handleRemove"
				:before-upload="beforeUpload">
				<a-button type="primary" style="margin:5px 10px 0 0;" > 选择导入文件 </a-button>
			</a-upload>
		  </a-col>
		  <a-col :span="8" style="text-align:left">
			<a-button type="" class="editable-add-btn" style="margin:5px 10px 0 0;" :disabled="fileList.length === 0" :loading="uploading" @click="BtnhandleUpload">导入</a-button>
			<a-button type="" class="editable-add-btn" style="margin:5px 10px 0 0;" @click='cancelFn'>清空</a-button>
			<a-button type="" class="editable-add-btn" style="margin:5px 10px 0 0;" @click="downloadSample">模板下载</a-button>
			<a-button type="" class="editable-add-btn" style="margin:5px 10px 0 0;" @click="downloadError">失败清单下载</a-button>
		</a-col>
		</a-row>
		<SupplierModel ref="supplierModel"/>
        <ImportResultModel ref="importResultModel"/>
      </a-form>
    </a-card>
  </a-card>
</template>
<script>
import supApi from '@/api/api-supplier'
import SupplierModel from '@/pages/Supplier/components/model-supplier-import'
import ImportResultModel from '@/pages/Supplier/components/model-supplier-import-result'
import { Promise } from 'q'
export default {
	name: 'NetworkImport',
	components: {SupplierModel, ImportResultModel},
	data () {
		return {
			// 查询条件
			filterFormLayout: {
				labelCol: { span: 9 },
				wrapperCol: { span: 15 }
			},
			filterForm: this.$form.createForm(this),
			selectedRows: [],
			fileList: [],
			uploading: false,
			isuploadFile: true,
			errorFileName: '',
			formDatasFile: new FormData()
		}
	},
	mounted () {
	},
	methods: {
		handleChange () {
			this.isuploadFile = false
		},
		beforeUpload (file) {
			this.fileList = [file]
			return false
		},
		handleRemove (file) {
			const index = this.fileList.indexOf(file)
			const newFileList = this.fileList.slice()
			newFileList.splice(index, 1)
			this.fileList = newFileList
		},
		// 取消按钮点击事件
		cancelFn () {
			this.fileList = []
		},
		BtnhandleUpload () {
			this.uploading = true
			if (this.fileList[0] && this.fileList[0].name) {
				let data = new FormData()
				this.fileList.map((item, index) => {
					data.append('excelFile', item)
				})
				supApi.importSupplier(data).then(res => {
					this.$refs.importResultModel.showModel(res.data)
					if (res.data.errorFileName !== '') {
						this.errorFileName = res.data.errorFileName
					}
					// if (res.status !== 0) {
					// 	this.$message.error(res.statusText)
					// } else {
					// 	this.$message.success(res.statusText)
					// }
				}).finally(() => {
					console.log('处理加载')
					this.uploading = false
				})
			} else {
				this.$message.warning('未指定文件路径！')
			}
		},
		// 简单粗暴一些，直接把之前存放文件名的变量改为失败清单文件的base64码
		downloadError () {
			if (this.errorFileName === (undefined || '')) {
				this.$message.error('失败清单不存在！')
			} else {
				this.$downloadFileByBase64(this.errorFileName, `供应商导入失败清单.xlsx`)
			}
		},
		downloadSample () {
			this.$refs.supplierModel.showModel()
		}
	}
}
</script>
