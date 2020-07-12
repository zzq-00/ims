<template>
  <a-card :bordered="false">
    <a-card>
      <a-divider orientation="left">
        <a-icon type="download" /> 第三方健管卡导入</a-divider>
        <a-row :gutter="16">
          <a-col :span="24">
            <a-form-item label="第三方健管卡导入">
             <a-upload
                name="file"
                :multiple="true"
                :action="actionUrl"
                :headers="headers"
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
            <a-button type="" class="editable-add-btn" style="margin:5px 10px 0 0;" @click="clearAllFiles">清空</a-button>
            <a-button type="" class="editable-add-btn" style="margin:5px 10px 0 0;">导入模板下载</a-button>
            <a-button type="" class="editable-add-btn" style="margin:5px 10px 0 0;">错误清单下载</a-button>
            <a-button type="" class="editable-add-btn" style="margin:5px 10px 0 0;" @click="BtnhandleUpload">健康卡导入</a-button>
          </a-col>
        </a-row>
    </a-card>

  </a-card>
</template>
<script>
import api from '@/api/api-health-card'
import { Promise } from 'q'
export default {
	name: "card-import-3rd",
	components: {},
	data () {
		return {
			headers: {},
			actionUrl: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
			fileList: []
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
			this.fileList = [...this.fileList, file]
			return false
		},
		clearAllFiles () {
			this.fileList = []
		},
		BtnhandleUpload () {
			const { fileList } = this
			var data = new FormData()
			fileList.map((item, index) => {
				data.append('excelFile', item)
			})
			// // data.append("staffNoOO", this.selectedRows[0].staffNo)
			// console.log(fileList, '这是上传的文件的流')
			// data.append("excelFile", fileList)

			api.importDocThirdParty(data).then(res => {
				console.log(res, res.data)
			}).finally(() => {
				console.log('处理加载')
			})
		},
		handleRemove (file) {
			const index = this.fileList.indexOf(file)
			const newFileList = this.fileList.slice()
			newFileList.splice(index, 1)
			this.fileList = newFileList
		}
	}
}
</script>
