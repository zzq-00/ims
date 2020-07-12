<template>
  <a-modal v-model="formModal" style="top: 30px;" :width="modalWidth" title="导入结果">
    <a-table :bordered="false" :dataSource="resultList" :columns="columns" :pagination="false"/>
    <template slot="footer">
      <a-button type="" @click="formModal=false">关闭</a-button>
    </template>
  </a-modal>
</template>
<script>
export default {
	name: 'model-supplier-import',
	data () {
		return {
			dataFormLayout: {
				labelCol: { span: 9 },
				wrapperCol: { span: 15 }
			},
			modalWidth: 600,
			formModal: false,
			dataForm: this.$form.createForm(this),
			resultList: [],
			columns: [
				{
					align: "center",
					title: "",
					dataIndex: "result"
				},
				{
					align: "center",
					title: "机构信息",
					dataIndex: "suppliers"
				},
				{
					align: "center",
					title: "医生信息",
					dataIndex: "doctors"
				},
				{
					align: "center",
					title: "合约基本信息",
					dataIndex: "supplierContracts"
				},
				{
					align: "center",
					title: "服务信息",
					dataIndex: "supplierServices"
				}
			]
		}
	},
	mounted () {
	},
	methods: {
		showModel (param) {
		  console.log("param:", param)
		  this.resultList = []
		  let successResult = {
				result: '成功',
				suppliers: param.successCount.suppliers,
				doctors: param.successCount.doctors,
				supplierContracts: param.successCount.supplierContracts,
				supplierServices: param.successCount.supplierServices
			}
			this.resultList.push(successResult)
			let errorResult = {
				result: '失败',
				suppliers: param.errorCount.suppliers,
				doctors: param.errorCount.doctors,
				supplierContracts: param.errorCount.supplierContracts,
				supplierServices: param.errorCount.supplierServices
			}
			this.resultList.push(errorResult)
			this.formModal = true
		}
	}
}
</script>
<style>

</style>
