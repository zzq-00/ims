<template>
  <a-card :bordered="false">
    <a-card>
      <a-form :form="filterForm" :labelCol="filterFormLayout.labelCol" :wrapperCol="filterFormLayout.wrapperCol" >
        <a-row :gutter="16">
          <a-col :span="8" style="text-align:left">
            <a-form-item label="标准服务导入">
                  <a-input placeholder="" v-model="filesName"/>
            </a-form-item>
          </a-col>
          <a-col :span="14" style="text-align:left">
          <a-upload
						name="file"
						:multiple="true"
						:action="actionUrl"
						:headers="headers"
						@change="handleChange"
						:file-list="fileList"
						:remove="handleRemove"
						:before-upload="beforeUpload">
						<a-button type="primary"> 选择文件 </a-button>
					</a-upload>
            <a-button :loading="loading" type="primary" class="editable-add-btn" style="margin:5px 10px 0 0;" @click="BtnhandleUpload">开始导入</a-button>
            <a-button type="" class="editable-add-btn" style="margin:5px 10px 0 0;" @click='cancelFn'>重置</a-button>
            <a-button type="" class="editable-add-btn" style="margin:5px 10px 0 0;" @click="downloadSampleHealth">就医服务模板下载</a-button>
						<a-button type="" class="editable-add-btn" style="margin:5px 10px 0 0;" @click="downloadSampleOther">其它服务模板下载</a-button>
            <a-button type="" class="editable-add-btn" style="margin:5px 10px 0 0;" @click="downloadError">失败清单下载</a-button>
          </a-col>
        </a-row>
      </a-form>
    </a-card>
  </a-card>
</template>
<script>
import api from "@/api/api-serve-apply"
import { Promise } from 'q'
export default {
	name: "serve-apply-non-proprietary-import",
	components: {},
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
			loading: false,
			uploading: false,
			headers: {},
			actionUrl: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
			isuploadFile: true,
			filesName: '',
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
			this.fileList = [...this.fileList, file]
			this.filesName = this.fileList[0].length !== 0 ? this.fileList[0].name : ''
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
			this.filesName = ''
		},
		BtnhandleUpload () {
			this.loading = true
			const { fileList } = this
			if (fileList[0] && fileList[0].name) {
				var data = new FormData()
				fileList.map((item, index) => {
					data.append('file', item)
				})
				api.templateImport(data).then(res => {
				  	if (res.status !== 0) {
						this.$message.error(res.statusText)
					} else {
						if (!res.data.flag) {
							this.errorFileName = res.data.errorFileName
						  this.$message.error(res.data.message + ' 请点击失败清单下载查看！')
						} else {
							this.$message.success(res.data.message)
						}
					}
				}).catch((e) => {
					this.errorFileName = e.data.errorFileName
				}).finally(() => {
					this.loading = false
					console.log('处理加载')
				})
			} else {
				this.$message.warning('未指定文件路径！')
			}
		},
		downloadError () {
			if (this.errorFileName === (undefined || '')) {
				this.$message.error('失败清单不存在！')
			} else {
				this.$downloadFileByBase64(this.errorFileName, `失败清单信息.xlsx`)
			}
		},
		downloadSampleHealth () {
			api.HealthServiceDownload().then(res => {
				if (res !== (undefined || '')) {
					this.$downloadFileByBase64(res, `就医服务模板.xlsx`)
				} else {
					this.$message.error('文件下载失败，请重试')
				}
			}).finally(() => {
				console.log('处理加载')
			})
		},
		downloadSampleOther () {
			 api.OtherServiceDownload().then(res => {
				if (res !== undefined) {
					this.$downloadFileByBase64(res, `其他服务模板.xlsx`)
				} else {
					this.$message.error('文件下载失败，请重试')
				}
			}).finally(() => {
				console.log('处理加载')
			})
		}
	}
}
</script>
