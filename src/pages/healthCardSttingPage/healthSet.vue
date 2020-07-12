<template>
<a-card @click="changeEdit">
 <a-card style="margin-top:20px">
    <a-divider orientation="left"><a-icon type="file-search" /> 查询条件</a-divider>
   <a-row :span="16">
   <a-form :labelCol="filterFormLayout.labelCol" :wrapperCol="filterFormLayout.wrapperCol" :form="filterForm">
    <a-col :span="8">
    <a-form-item label="健管卡代码">
        <HealthCardSelect  v-decorator="['docDefId', {initialValue: ''}]" />
    </a-form-item>
   </a-col >
   <a-col :span="8">
   <a-form-item label="健管卡类型">
     <Select :dataList="dataList1" v-decorator="['docCatCode', {initialValue: ''}]" />
   </a-form-item>
   </a-col>
    <a-col :span="8">
   <a-form-item label="健管卡类型码">
   <a-input v-decorator="['docTypeCode', {initialValue: ''}]"></a-input>
   </a-form-item>
   </a-col>
     <a-col :span="8">
   <a-form-item label="是否有价">
     <Select :dataList="dataList2" v-decorator="['isValued', {initialValue: ''}]" />
   </a-form-item>
   </a-col>
     <a-col :span="8">
   <a-form-item label="是否虚拟卡">
     <Select :dataList="dataList2" v-decorator="['isVirtual', {initialValue: ''}]"/>
   </a-form-item>
   </a-col>
   <a-col :span="8">
   <a-form-item label="是否有效">
     <Select :dataList="dataList2" v-decorator="['isValid', {initialValue: ''}]"/>
   </a-form-item>
   </a-col>
   </a-form>
   </a-row>
   <a-row :gutter="16">
         <a-col :span="12" :offset="11">
         <!-- <a-button type="primary" :disabled="selectedRows.length === 0" class="editable-add-btn" @click="showWarningInfo" style="float:right;margin-right:10px;">设置预警</a-button> -->
		 <a-button type="primary"  class="editable-add-btn" @click="savaChange" style="float:right;margin-right:10px;">保存</a-button>
         <a-button type="" class="editable-add-btn" @click="exportData"  style="float:right;margin-right:10px;">导出</a-button>
         <a-button type="" class="editable-add-btn" @click="searchHandle" style="float:right;margin-right:10px;">查询</a-button>
		  </a-col>
        </a-row>
  </a-card>
 <a-card>
  <HealthCardTable ref="table"   @tableEdit="tableEdit" />
 </a-card>
</a-card>
</template>
<script>
import HealthCardSelect from '@/components/health-card-select'
import HealthCardTable from './components/table-component'
import Select from './components/card-select.vue'
import api from '@/api/api-health-card-setting'
export default {
	data () {
		return {
			 RowKeys: '',
			 pageDatass: [],
			// 查询条件
			filterFormLayout: {
				labelCol: { span: 9 },
				wrapperCol: { span: 15 }
			},
			filterForm: this.$form.createForm(this),
			dataList1: [
			 {label: '请选择',
					value: ''
				},
				{label: '财务单证',
					value: 0
				},
				{label: '自定义单证',
					value: 1
				},
				{label: '第三方单证',
					value: 2
				}

			],
      	dataList2: [
			 {label: '请选择',
					value: ''
				},
				{label: '是',
					value: 'Y'
				},
				{label: '否',
					value: 'N'
				}
			]
		}
	},
	components: {
		HealthCardSelect,
		Select,
		HealthCardTable
	},
	mounted () {

	},
	methods: {
		changeEdit () {
			this.$nextTick(() => {
				this.$refs.table.changeEdit()
			})
		},
		tableEdit (pageDatass) {
			this.pageDatass = pageDatass
		},
		//   导出
		exportData () {
			this.$message.info('正在导出')
			let query = this.filterForm.getFieldsValue()
			api.exportDocDefExcle(query).then(res => {
				if (res.status === undefined) {
					// base64内容，文件名
					this.$downloadFileByBase64(res, `健管卡定义.xls`)
				} else {
					this.$message.error('文件下载失败,请重试')
				}
			}).finally(() => {
				this.submitLoading = false
			})
	    },
		// 保存数据
	    savaChange () {
			this.pageDatass && this.pageDatass.length > 0 ? this.saveData() : this.$message.error('请选择一条记录进行修改再保存!')
		},
		// 保存数据
		saveData () {
			let pageDatass = JSON.parse(JSON.stringify(this.pageDatass))
			this.sendChangeData(pageDatass)
		},
		// 发送修改数据
		sendChangeData (pageDatass) {
			var data = []
			for (var i = 0; i < pageDatass.length; i++) {
				const item = pageDatass[i]
				item.invalidDate && item.invalidDate.length < 11 ? item.invalidDate = item.invalidDate + " 00:00:00" : ''
				data.push(item)
			}
			api.updateDocDef(data).then(res => {
				res.status == '0' ? this.$message.success('保存成功!') : this.$message.success('保存失败!')
				this.searchHandle()
		  }).finally(() => {
			  this.loading = false
			})
		 },
		// 查询
		searchHandle () {
			this.$nextTick(() => {
			 let query = this.filterForm.getFieldsValue()
			 this.$refs.table.loadPageData(query)
			})
			// this.$message.error('正在查询!')
		}
	}
}
</script>
<style lang="">

</style>
