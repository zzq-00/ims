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
			modalWidth: 500,
			formModal: false,
			dataForm: this.$form.createForm(this),
			resultList: [],
			columns: [
				{
					align: "center",
					title: "成功",
					dataIndex: "successCount"
				},
				{
					align: "center",
					title: "失败",
					dataIndex: "errorCount"
				},
				{
					align: "center",
					title: "重复",
					dataIndex: "updateCount"
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
		  let result = {
				successCount: param.successCount + '条',
				errorCount: param.errorCount + '条',
				updateCount: param.updateCount ? param.updateCount + '条' : '0条'
			}
			this.resultList.push(result)
			this.formModal = true
		}
	}
}
</script>
<style>

</style>
