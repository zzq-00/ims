<template>
  <a-card :bordered="false">
    <a-card>
      <a-divider orientation="left"><a-icon type="file-search" /> 查询条件</a-divider>
			<a-form :form="filterForm" :labelCol="filterFormLayout.labelCol" :wrapperCol="filterFormLayout.wrapperCol">
				<a-row :gutter="16">
					<a-col :span="6">
						<a-form-item label="服务组名称">
							<a-input placeholder="" />
						</a-form-item>
					</a-col>
					<a-col :span="6">
						<a-form-item label="服务组编码">
							<a-input placeholder="" />
						</a-form-item>
					</a-col>
					<a-col :span="6">
						<a-button type="primary" class="editable-add-btn" style="margin:0px 10px 0 0;">查询</a-button>
						<a-button type="" class="editable-add-btn" style="margin:0px 0 0 0;">重置</a-button>
					</a-col>
				</a-row>
			</a-form>
      <a-divider />
      <a-row :gutter="16">
        <a-col :span="24" style="text-align:right">
          <a-form-item>
            <a-button type="primary" class="editable-add-btn" style="margin:0px 10px 0 0;">新增</a-button>
            <a-button type="" class="editable-add-btn" style="margin:0px 10px 0 0;">修改</a-button>
            <a-button type="" class="editable-add-btn" style="margin:0px 0 0 0;">删除</a-button>
          </a-form-item>
        </a-col>
      </a-row>
      <a-divider orientation="left">
        <a-icon type="search" /> 查询结果</a-divider>
      <a-table v-show="showTable" :bordered="false" :pagination="pagination" :dataSource="pageData.data" :columns="columns" :rowKey="record => record.sorgCode" :indentSize=0 :loading="loading">
        <a slot="sorgCode" @click="showOrgInfo(record)" slot-scope="text, record">{{text}}</a>
        <span slot="orgCodeDesc" slot-scope="text">{{text || '-'}}</span>
      </a-table>
      <a-divider orientation="left">
        <a-icon type="search" /> 查询结果</a-divider>
      <a-table v-show="showTable" :bordered="false" :pagination="pagination" :dataSource="pageData.data" :columns="columns2" :rowKey="record => record.sorgCode" :indentSize=0 :loading="loading">
        <a slot="sorgCode" @click="showOrgInfo(record)" slot-scope="text, record">{{text}}</a>
        <span slot="orgCodeDesc" slot-scope="text">{{text || '-'}}</span>
      </a-table>
    </a-card>

  </a-card>
</template>
<script>
import supApi from '@/api/api-supplier'
import { Promise } from 'q'
export default {
	name: 'NetworkAdd',
	components: {},
	data () {
		return {
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
			showTable: true,
			iconType: 'down',
			columns: [
				{
					align: "center",
					title: "序号",
					dataIndex: "recordIndex"
				},

				{
					align: "left",
					title: "服务组名称",
					dataIndex: "serName"
				},
				{
					align: "left",
					title: "服务组编码",
					dataIndex: "serCode",
					scopedSlots: { customRender: 'serCode' }
				},
				{
					align: "left",
					title: "状态",
					dataIndex: "serState"
				}
			],
			columns2: [
				{
					align: "center",
					title: "序号",
					dataIndex: "recordIndex"
				},
				{
					align: "left",
					title: "服务编码",
					dataIndex: "serCodes",
					scopedSlots: { customRender: 'serCodes' }
				},
				{
					align: "left",
					title: "服务名称",
					dataIndex: "serName"
				},
				{
					align: "left",
					title: "服务组名称",
					dataIndex: "sergroupName"
				},
				{
					align: "left",
					title: "服务组编码",
					dataIndex: "serCode",
					scopedSlots: { customRender: 'sergroupCode' }
				}
			],
			pagination: {
				pageSize: 10,
				current: 1,
				total: 0,
				showTotal: total => `共 ${total} 条数据`,
				showSizeChanger: true,
				pageSizeOptions: ["10", "20", "35", "50"],
				onShowSizeChange: (current, pageSize) => this.onPageSizeChange(current, pageSize),
				onChange: (page, pageSize) => this.onPageChange(page, pageSize)
			}
		}
	},
	mounted () {
		this.searchHandle()
	},
	methods: {
		searchHandle () {
			this.pagination.current = 1
		},
		onPageChange (page, pageSize) {
			this.pagination.current = page
		},
		onPageSizeChange (current, size) {
			this.pagination.pageSize = size
			this.searchHandle()
		}
	}
}
</script>
