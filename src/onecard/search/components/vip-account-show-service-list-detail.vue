<template>
  <a-modal v-model="formModal" style="top: 30px;" :width="1200" title="账户服务列表" footer="">
    <a-card style="margin-top:24px;">
      <div slot="extra">

      </div>
      <span href="#" slot="title" style="float:left;"><a-icon type="bank" />账户服务列表</span>
      <a-table :bordered="false" :pagination="pagination" :dataSource="pageData.data" :columns="columns" :rowKey="record => record.id" :indentSize=0 :loading="loading">

      </a-table>
    </a-card>
  </a-modal>
</template>
<script>
import api from '@/api/api-vip'
import moment from 'moment'
import {formatMoney} from '@/libs/util'
export default {
	name: 'vip-account-show-service-list-detail',
	data () {
		return {
			formModal: false,
			parentData: {},
			filterFormLayout: {
				labelCol: { span: 9 },
				wrapperCol: { span: 15 }
			},
			pageData: {
				dataCount: 0,
				data: []
			},
			filterForm: this.$form.createForm(this),
			loading: false,
			pagination: {
				pageSize: 10,
				current: 1,
				total: 0,
				showTotal: total => `共 ${total} 条数据`,
				showSizeChanger: true,
				pageSizeOptions: ["10", "20", "35", "50"],
				onShowSizeChange: (current, pageSize) => this.onPageSizeChange(current, pageSize),
				onChange: (page, pageSize) => this.onPageChange(page, pageSize)
			},
			columns: [
				{
					align: "left",
					dataIndex: "productname",
					title: "产品名称"
				},
				{
					align: "left",
					dataIndex: "servicename",
					title: "服务名称"
				},
				{
					align: "left",
					dataIndex: "starteffectdate",
					title: "有效期起",
					customRender: (text) => {
						return text ? moment(text).format('YYYY-MM-DD') : ''
					}
				},
				{
					align: "left",
					dataIndex: "endeffectdate",
					title: "有效期止",
					customRender: (text) => {
						return text ? moment(text).format('YYYY-MM-DD') : ''
					}
				},
				{
					align: "left",
					dataIndex: "totalnum",
					title: "服务总数量"
				},
				// {
				// 	align: "left",
				// 	dataIndex: "unit",
				// 	title: "单位"
				// },
				{
					align: "left",
					dataIndex: "usenum",
					title: "已使用数量"
				}
			]
		}
	},
	methods: {
		show (obj) {
			this.formModal = true
			this.parentData = obj
			this.searchHandle()
		},
		searchHandle () {
			this.$nextTick(() => {
				this.pagination.current = 1
				this.loadPageData()
			})
		},
		loadPageData () {
			let query = this.filterForm.getFieldsValue()
			let data = {
				page: this.pagination.current,
				limit: this.pagination.pageSize
			}
			this.loading = true
			api.queryServiceByAccid(Object.assign(data, query, this.parentData)).then(res => {
				this.pageData = res.data || { totalCount: 0, data: [] }
				this.pageData.data.forEach((item, index) => { item.recordIndex = index + 1 
				if(item.totalnum>=9999){
                 item.totalnum = "不限次"
				}else if(item.servicecode === "HCM901"){
                 item.totalnum = item.totalnum/10 + item.unit
				}else{
                  item.totalnum = item.totalnum + item.unit
				}
				})
				debugger
		
				this.pagination.total = this.pageData.totalCount
			}).finally(() => {
				this.loading = false
			})
		},
		onPageChange (page, pageSize) {
			this.pagination.current = page
			this.loadPageData()
		},
		onPageSizeChange (current, size) {
			this.pagination.pageSize = size
			this.searchHandle()
		}
	}
}
</script>
<style>

</style>
