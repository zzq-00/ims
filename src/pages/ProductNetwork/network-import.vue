<template>
  <a-card :bordered="false">
    <a-card>
      <a-form :form="filterForm" :labelCol="filterFormLayout.labelCol" :wrapperCol="filterFormLayout.wrapperCol">
        <a-row :gutter="16">
          <a-col :span="8" style="text-align:right">
            <span type='margin:5px 10px 0 0;'>服务网络信息导入：</span>
              <a-upload
              :file-list="fileList"
              :remove="handleRemove"
              :before-upload="beforeUpload">
              <a-button style="margin:5px 10px 0 0;" type="primary"> 浏览 </a-button>
            </a-upload>
          </a-col>
          <a-col :span="8" style="text-align:left">
            <a-button type="" class="editable-add-btn" style="margin:5px 10px 0 0;" :disabled="fileList.length === 0" :loading="uploading" @click="BtnhandleUpload">上载</a-button>
            <a-button type="" class="editable-add-btn" style="margin:5px 10px 0 0;" @click='cancelFn'>清空</a-button>
            <a-button type="" class="editable-add-btn" style="margin:5px 10px 0 0;" @click='downloadTemp'>模板下载</a-button>
            <a-button type="" class="editable-add-btn" style="margin:5px 10px 0 0;" @click='downloadError'>下载错误清单</a-button>
          </a-col>
        </a-row>
        <a-divider />
        <a-row :gutter="16">
          <a-col :span="8" style="text-align:right">
            <span type='margin:5px 10px 0 0;'>服务网络模板导入：</span>
              <a-upload
              :file-list="fileList1"
              :remove="handleRemove1"
              :before-upload="beforeUpload1">
              <a-button style="margin:5px 10px 0 0;" type="primary"> 浏览 </a-button>
            </a-upload>
          </a-col>
          <a-col :span="8" style="text-align:left">
            <a-button type="" class="editable-add-btn" style="margin:5px 10px 0 0;" :disabled="fileList1.length === 0" :loading="uploading1" @click="BtnhandleUpload1">上载</a-button>
            <a-button type="" class="editable-add-btn" style="margin:5px 10px 0 0;" @click='cancelFn1'>清空</a-button>
            <a-button type="" class="editable-add-btn" style="margin:5px 10px 0 0;" @click='downloadTemp1'>模板下载</a-button>
            <a-button type="" class="editable-add-btn" style="margin:5px 10px 0 0;" @click='downloadError1'>下载错误清单</a-button>
          </a-col>
        </a-row>
        <NetworkImportResult ref="networkImportResult"/>
      </a-form>
    </a-card>

  </a-card>
</template>
<script>
import api from '@/api/api-product-network'
import NetworkImportResult from '@/pages/ProductNetwork/components/network-import-result'
import { Promise } from 'q'
import moment from 'moment'

export default {
	name: 'NetworkImport',
	components: {NetworkImportResult},
	data () {
		return {
			// 查询条件
			filterFormLayout: {
				labelCol: { span: 9 },
				wrapperCol: { span: 15 }
			},
			filterForm: this.$form.createForm(this),
			fileList: [],
			uploading: false,
			errorFileName: '',
			fileList1: [],
			uploading1: false,
			errorFileName1: ''
		}
	},
	mounted () {
	},
	methods: {
		handleRemove (file) {
			const index = this.fileList.indexOf(file)
			const newFileList = this.fileList.slice()
			newFileList.splice(index, 1)
			this.fileList = newFileList
		},
		beforeUpload (file) {
			this.fileList = [file]
			return false
		},
		BtnhandleUpload () {
			this.uploading = true
			if (this.fileList[0] && this.fileList[0].name) {
				let data = new FormData()
				this.fileList.map((item, index) => {
					data.append('excelFile', item)
				})
				api.import(data).then(res => {
					this.$refs.networkImportResult.showModel(res.data)
					if (res.data.errorFileName !== '') {
						this.errorFileName = res.data.errorFileName
					}
				  // if (res.status !== 0) {
					// 	this.$message.error(res.statusText)
					// } else {
					// 	this.$message.success(res.statusText)
					// }
				}).finally(() => {
					this.uploading = false
				})
			} else {
				this.$message.warning('未指定文件路径！')
			}
		},
		// 取消按钮点击事件
		cancelFn () {
			this.fileList = []
		},
		downloadTemp () {
			api.download().then(res => {
				if (res.status === undefined) {
					// base64内容，文件名
					this.$downloadFileByBase64(res, `产品网络导入模板.xlsx`)
				} else {
					this.$message.error('文件下载失败，请重试')
				}
			}).finally(() => {
			})
		},
		downloadError () {
			if (this.errorFileName === (undefined || '')) {
				this.$message.error('失败清单不存在！')
			} else {
				this.$downloadFileByBase64(this.errorFileName, `产品服务网络` + this.getDate() + `-错误清单.xlsx`)
			}
		},
		handleRemove1 (file) {
			const index = this.fileList1.indexOf(file)
			const newFileList = this.fileList1.slice()
			newFileList.splice(index, 1)
			this.fileList1 = newFileList
		},
		beforeUpload1 (file) {
			this.fileList1 = [file]
			return false
		},
		BtnhandleUpload1 () {
			this.uploading1 = true
			if (this.fileList1[0] && this.fileList1[0].name) {
				let data = new FormData()
				this.fileList1.map((item, index) => {
					data.append('excelFile', item)
				})
				api.importForUseTemplet(data).then(res => {
					this.$refs.networkImportResult.showModel(res.data)
					if (res.data.errorFileName !== '') {
						this.errorFileName1 = res.data.errorFileName
					}
				  // if (res.status !== 0) {
					// 	this.$message.error(res.statusText)
					// } else {
					// 	this.$message.success(res.statusText)
					// }
				}).finally(() => {
					this.uploading1 = false
				})
			} else {
				this.$message.warning('未指定文件路径！')
			}
		},
		// 取消按钮点击事件
		cancelFn1 () {
			this.fileList1 = []
		},
		downloadTemp1 () {
			api.downloadForUseTemplet().then(res => {
				if (res.status === undefined) {
					// base64内容，文件名
					this.$downloadFileByBase64(res, `产品网络模板导入.xlsx`)
				} else {
					this.$message.error('文件下载失败，请重试')
				}
			}).finally(() => {
			})
		},
		downloadError1 () {
			if (this.errorFileName1 === (undefined || '')) {
				this.$message.error('失败清单不存在！')
			} else {
				this.$downloadFileByBase64(this.errorFileName1, `产品服务网络` + this.getDate() + `-错误清单.xlsx`)
			}
		},
		getDate () {
			return moment(new Date(), 'YYYY-MM-DD').format('YYYY-MM-DD')
		}
	}
}
</script>
