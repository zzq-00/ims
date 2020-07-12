<template>
  <a-card :bordered="false">
    <a-card>
      <a-divider orientation="left">
        <a-icon type="download" /> 作废健管卡导入</a-divider>
      <a-row :gutter="16">
        <a-col :span="24">
          <a-form-item label="作废健管卡导入">
            <a-upload
              name="file"
              @change="handleChange"
              :file-list="fileList"
              :remove="handleRemove"
              :before-upload="beforeUpload">
              <a-button> <a-icon type="upload" /> 点击上传 </a-button>
            </a-upload>
          </a-form-item>
        </a-col>
      </a-row>
      <a-row :gutter="16">
        <a-col :span="14" :offset="6" style="text-align:left">
          <a-button
            type=""
            class="editable-add-btn"
            style="margin:5px 10px 0 0;"
            @click="fileList = []">清空</a-button>
          <a-button type="" class="editable-add-btn" style="margin:5px 10px 0 0;"
                    @click="templateDownload">导入模板下载</a-button>
          <a-button type="" class="editable-add-btn" style="margin:5px 10px 0 0;"
                    @click="errorListDownload">错误清单下载</a-button>
          <a-button
            type=""
            class="editable-add-btn"
            style="margin:5px 10px 0 0;"
            :disabled="fileList.length === 0"
            :loading="uploading"
            @click="BtnhandleUpload">{{ uploading ? '上传中···' : '作废健管卡导入' }}</a-button>
        </a-col>
      </a-row>
    </a-card>

  </a-card>
</template>
<script>
import api from '@/api/api-health-card'
import { Promise } from 'q'
export default {
	name: "card-import-invalid",
	components: {},
	data () {
		return {
			fileList: [],
			uploading: false
		}
	},
	mounted () {
	},
	methods: {
		handleChange (info) {
			if (info.file.status !== 'uploading') {
				console.log(info.file, info.fileList)
			}
			if (info.file.status === 'done') {
				this.$message.success(`${info.file.name} 文件上传成功`)
			} else if (info.file.status === 'error') {
				this.$message.error(`${info.file.name} 文件上传失败`)
			}
		},
		beforeUpload (file) {
			this.fileList = [file]
			return false
		},
		// 作废健管卡导入
		BtnhandleUpload () {
			const { fileList } = this
			var data = new FormData()
			this.uploading = true

			fileList.forEach((item, index) => {
				data.append('file', item)
			})
			api.importDocCancel(data).then(res => {
				this.fileList = []
				this.$message.success(res.messageInfo)
			}).finally(() => {
				this.uploading = false
			})
		},
		handleRemove (file) {
			const index = this.fileList.indexOf(file)
			const newFileList = this.fileList.slice()
			newFileList.splice(index, 1)
			this.fileList = newFileList
		},
		// 错误清单下载
		errorListDownload () {
			api.exportDocCancel().then(res => {
				if (res.status === undefined) {
					// base64内容，文件名
					this.$downloadFileByBase64(res, `健管卡作废导入错误清单.xls`)
				} else {
					this.$message.error('文件下载失败,请重试')
				}
			}).finally(() => {
			})
		},
		// 导入模板下载
		templateDownload () {
			api.download({}).then(res => {
				if (res.status === undefined) {
					// base64内容，文件名
					this.$downloadFileByBase64(res, `健管卡作废导入模板.xls`)
				} else {
					this.$message.error('文件下载失败,请重试')
				}
			}).finally(() => {
			})
		}
	}
}
</script>
