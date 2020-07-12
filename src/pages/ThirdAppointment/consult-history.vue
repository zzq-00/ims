<template>
  <a-card :bordered="false">
    <a-card style="margin-top:24px;">
      <span href="#" slot="title" style="float:left;">
        <a-icon type="bank" /> 查询结果</span>
      <a href="#" slot="extra">
        <a-icon :type="iconType" @click="swithTableShow" />
      </a>
      <a-table v-show="showTable" :scroll="{ x: 'max-content'}" :bordered="false" :pagination="pagination"  :dataSource="pageData.data" :columns="columns" :rowKey="record => record.cardNo" :indentSize=0 :loading="loading">
        <!--<a slot="docCode" @click="showRecordInfo(record)" slot-scope="text, record">{{(text)}}</a>
        <a slot="docName" @click="showRecordInfo(record)" slot-scope="text, record">{{(text)}}</a>
        <span slot="docCatCode" slot-scope="text">{{getDocCatName(text)}}</span>
        <a-tag slot="yesNo" slot-scope="text" :color="text=== 'Y' ? 'green' : 'orange'">{{text === 'Y' ? '是' : '否'}}</a-tag>-->
      </a-table>
    </a-card>
	  <a-row :gutter="16">
          <a-col :span="24" style="margin:10px 0 0 0;text-align:right">
            <a-button type="primary" class="editable-add-btn" @click="searchHandle" style="float:right;margin-right:10px;">关闭</a-button>
          </a-col>
        </a-row>
  </a-card>
</template>
<script>
import api from "@/api/api-health-consult"
import { Promise } from "q"
export default {
	name: "consult-query",
	props: {
		columns: {
			type: Array,
			default () {
         		const tableItemsList = []
				const tableItems = {
					label: ['第三方名称', '预约来源', '产品名称', '服务名称', '服务商名称', '科室', '服务卡号', '就诊人姓名', '就诊人性别', '就诊人证件类型', '就诊人证件号码', '就诊人手机号码', '处理日期', '服务状态'],
					key: ['thirdNameDesc', 'orderSourceDesc', 'productNameDesc', 'serviceName', 'sorgName', 'deptName', 'cardNo', 'patientName', 'patientGenderDesc', 'patientCertTypeDesc', 'patientCertNo', 'patientTelephone', 'insertTime', 'outStatusDesc']
				}
				tableItemsList.push({
					align: "left",
					title: "序号",
					customRender: (text, record, index) => {
						return `${index + 1}`
					}
				})
				tableItems.label.forEach((item, index) => {
				  let column = {
					  title: item,
					  dataIndex: tableItems.key[index]
				  }
				  tableItemsList.push(column)
				})
				return tableItemsList
			}
		}
	},
	data () {
		return {
			thirdNameDesc: '',
			removeListArr: ['03'],
			visible: true,
			confirmLoading: false,
			// 查询条件
			filterFormLayout: {
				labelCol: { span: 9 },
				wrapperCol: { span: 15 }
			},
			pageData: {
				dataCount: 0,
				data: []
			},
			filterForm: this.$form.createForm(this),
			selectedRows: [],
			loading: false,
			aloading: false,
			showTable: true,
			iconType: "down",

			rowSelection: {
				onChange: (selectedRowKeys, selectedRows) => {
					this.selectedRows = selectedRows
				}
			},
			pagination: {
				pageSize: 10,
				current: 1,
				total: 0,
				showTotal: total => `共 ${total} 条数据`,
				showSizeChanger: true,
				pageSizeOptions: ["10", "20", "35", "50"],
				onShowSizeChange: (current, pageSize) =>
					this.onPageSizeChange(current, pageSize),
				onChange: (page, pageSize) => this.onPageChange(page, pageSize)
			},
			serviceReservationId: ""
		}
	},
	mounted () {
		this.$nextTick(() => {
			let query = this.$route.params
			let prop = this.$route.props
			this.thirdNameDesc = this.$route.query.thirdNameDesc
			console.log(this.thirdNameDesc,'9999999999999999')
			this.serviceReservationId = query.id
			this.loadPageData()
		})
	},
	methods: {
		searchHandle () {
			this.$router.back(-1)
		},
		swithTableShow () {
			this.showTable = !this.showTable
			this.iconType = this.showTable ? "down" : "up"
		},
		onPageChange (page, pageSize) {
			this.pagination.current = page
			this.loadPageData()
		},
		onPageSizeChange (current, size) {
			this.pagination.pageSize = size
			this.loadPageData()
		},
		loadPageData () {
			let data = {
				page: this.pagination.current,
				limit: this.pagination.pageSize,
				serviceReservationId: this.serviceReservationId
			}
			this.loading = true
			api.listInfo(data).then(res => {
				console.log(res, "result")
				this.pageData = res.data || { totalCount: 0, data: [] }
				this.pageData.data.forEach((item, index) => {
					console.log(item, 'item-----')
					item.thirdNameDesc = this.thirdNameDesc
					item.recordIndex = index + 1
				})
				this.pagination.total = this.pageData.totalCount
			})
				.finally(() => {
					this.loading = false
				})
		}
	}
}
</script>
