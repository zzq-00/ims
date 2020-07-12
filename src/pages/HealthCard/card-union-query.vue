<template>
<a-card>
<a-card>
 <a-divider orientation="left"><a-icon type="file-search" /> 查询条件</a-divider>
<a-form :form="filterForm" :labelCol="filterFormLayout.labelCol" :wrapperCol="filterFormLayout.wrapperCol">
<a-row :span="16">

   <a-col :span="6">
   <a-form-item label="关联编码">
   <a-input v-decorator="['docDefId1', { initialValue: '' }]"/>
  </a-form-item>
  </a-col>
   <a-col :span="6">
   <a-form-item label="健管卡代码">
  <HealthCardSelect  v-decorator="['docDefId',{relues:[{required:true,message:'请选择建管卡代码'}]}]"  />
  </a-form-item>
  </a-col>
   <a-col :span="6">
   <a-form-item label="产品代码">
   <HealthProductSelect v-decorator="['productCode', { initialValue: '' }]"/>
  </a-form-item>
  </a-col>
</a-row>
<a-row :gutter="16">
  <a-col :span="16" :offset="13">
 <a-form-item>
 <a-button type="primary" htmlType="submit" @click="submit1" style="float:right;margin-right:10px;">修改</a-button>
  <a-button type="primary" htmlType="submit" @click="submitQuery" style="float:right;margin-right:10px;">查询</a-button>

  </a-form-item>
  </a-col>
</a-row>
</a-form>
</a-card>
<a-card style="margin-top:20px">
<HealthCardTable ref="table"  @changeRowKeys="changeRowKeys"/>
</a-card>
</a-card>
</template>
<script>
import HealthCardSelect from '@/components/health-card-select'
import HealthCardTable from './components/table-components.vue'
import HealthProductSelect from '@/components/health-product-select'
import api from '@/api/api-health-card-continue'
export default {
	data () {
		return {
			// 查询条件
			filterFormLayout: {
				labelCol: { span: 9 },
				wrapperCol: { span: 15 }
			},
			filterForm: this.$form.createForm(this),
			rows: [],
			pageData: [],
			loading: false
		}
	},
	components: {
		HealthCardSelect,
		HealthCardTable,
		HealthProductSelect
	},
	mounted () {
		this.submitQuery()
	},

	methods: {
		changeRowKeys (rows, data) {
			this.rows = rows
			this.pageData = data
		},
		submitQuery () {
			this.$nextTick(() => {
				let query = this.filterForm.getFieldsValue()
				this.$refs.table.initValue(query)
			})
		},
		submit1 () {
		  let RowKeys = this.rows
		  RowKeys && RowKeys.length > 0 ? this.submitAjax() : this.$message.error('请选择需要保存的数据！')
		},
		submitAjax () {
			let RowKeys = this.rows
		    let pageData = this.pageData
			const data = []
		  RowKeys.map((item, index) => {
			  data.push(pageData.filter(items => item === items.docProductId)[0])
		  })
			this.loading = true
			api.updateDocProduct(data).then(res => {
			 console.log(res)
			 if(res.status=== 0) this.$message.success('修改成功！')
			 this.loading = false
			 this.rows = []
			 this.submitQuery()
		 }).finally(() => {
				this.loading = false
		 })
		}
	}
}
</script>
<style lang="">

</style>
