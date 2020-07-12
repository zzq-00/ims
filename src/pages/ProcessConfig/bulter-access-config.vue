<template>
	<a-card :bordered="false">
		<a-card>
			<a-form :form="filterForm" :labelCol="filterFormLayout.labelCol" :wrapperCol="filterFormLayout.wrapperCol">
				<a-row :gutter="16">
          <a-col :span="6">
            <a-form-item label="第三方名称">
							<a-select :allowClear="true" @change="searchHandle" v-decorator="['thirdName', {initialValue: ''}]">
								<a-select-option v-for="item in thirdNameList" :key="item.code" :value="item.codeAndDesc">{{item.codeDesc}}</a-select-option>
							</a-select>
            </a-form-item>
          </a-col>
          <a-col :span="6">
						<a-form-item label="管家姓名">
							<a-input :allowClear="true" v-decorator="['bulterNumber', {initialValue: ''}]" />
						</a-form-item>
					</a-col>
          <a-col :span="6">
            <a-form-item label="是否有效">
              <DicSelect dicType="YES_NO" @change="searchHandle" v-decorator="['isValid', {initialValue: ''}]" placeholder="请选择" />
            </a-form-item>
          </a-col>
				</a-row>
				<a-row :gutter="16">
					<a-col :span="12" :offset="11">
            <a-button type="" class="editable-add-btn" @click="addRecord" style="float:right;margin-right:10px;">新增</a-button>
            <a-button type="" class="editable-add-btn" @click="resetFilterForm" style="float:right;margin-right:10px;">重置</a-button>
            <a-button type="primary" class="editable-add-btn" @click="searchHandle" style="float:right;margin-right:10px;">查询</a-button>
          </a-col>
				</a-row>
			</a-form>
		</a-card>
		<a-card style="margin-top:24px;">
			<span href="#" slot="title" style="float:left;"><a-icon type="bank" /> 第三方预约配置列表</span>
			<a href="#" slot="extra"><a-icon :type="iconType" @click="swithTableShow" /></a>
			<a-table v-show="showTable" :scroll="{ x: 'max-content'}" :bordered="false" :pagination="pagination" :rowSelection="null" :dataSource="pageData.data" :columns="columns" :rowKey="record => record.docDefId" :indentSize=0 :loading="loading">
				<div slot="bulterNumber" slot-scope="text, record">
					<a-popover title="系统帐号" trigger="click">
						<template slot="content">
							<p v-for="subi in getSplitUserName(text)" :key="subi.userName">
								系统帐号: {{subi.userName}}  管家姓名: {{subi.staffName}}
							</p>
						</template>
						<a href="javascript:void(0)">{{text}}</a>
					</a-popover>
				</div>
				<span slot="textVal" slot-scope="text, record">{{text || '-'}}</span>
				<a-tag slot="yesNo" slot-scope="text, record" :color="text=== '是' ? 'green' : 'orange'">{{text}}</a-tag>
				<div slot="operation" slot-scope="text, record">
					<a-button @click="showRecordInfo(record)" type="link">查看</a-button>
					<a-button @click="editRecord(record)" type="link">修改</a-button>
				</div>

			</a-table>
		</a-card>

		<BulterAccessForm ref="bulterAccessForm" @on-update="loadPageData" />
	</a-card>
</template>
<script>
import api from "@/api/api-process-config"
import DicSelect from "@/components/dic-select"
import OrgSelect2 from "@/components/org-select2"
import BulterAccessForm from "./components/bulter-access-form"
import { Promise } from "q"
import qs from "qs"
export default {
	name: "bulter-access-config",
	components: { DicSelect, OrgSelect2, BulterAccessForm },
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
			iconType: "down",
			columns: [
				{ title: "序号", dataIndex: "recordIndex" },
				{ title: "第三方名称", dataIndex: "thirdNameDesc", scopedSlots: { customRender: "textVal" } },
				{ title: "预约来源", dataIndex: "orderSourceDesc", scopedSlots: { customRender: "textVal" } },
				{ title: "产品名称", dataIndex: "productNameDesc", scopedSlots: { customRender: "textVal" } },
				{ title: "管家系统账号", dataIndex: "bulterNumber", width: 240, scopedSlots: { customRender: "bulterNumber" } },
				{ title: "是否查看", dataIndex: "isCheckedDesc" },
				{ title: "是否接收短信", dataIndex: "receivedMessDesc", scopedSlots: { customRender: "yesNo" } },
				{ title: "是否接收邮件", dataIndex: "receivedEmailDesc", scopedSlots: { customRender: "yesNo" } },
				{ title: "是否有效", dataIndex: "isValidDesc" },
				{ title: "操作", fixed: 'right', dataIndex: "operation", scopedSlots: { customRender: "operation" } }
			],
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
			thirdNameList: []
		}
	},
	mounted () {
		this.loadThirdNameList()
		this.searchHandle()
	},
	methods: {
		loadThirdNameList () {
			api.queryThirdNameBulterAccessCfg({thirdName: null}).then(res => {
				this.thirdNameList = res.data.data
			})
		},
		searchHandle () {
			this.$nextTick(() => {
				this.pagination.current = 1
				this.loadPageData()
			})
		},
		onPageChange (page, pageSize) {
			this.pagination.current = page
			this.loadPageData()
		},
		onPageSizeChange (current, size) {
			this.pagination.pageSize = size
			this.searchHandle()
		},
		loadPageData () {
			this.selectedRows = []
			this.selectedRowKeys = []

			let query = this.filterForm.getFieldsValue()
			let data = {
				page: this.pagination.current,
				limit: this.pagination.pageSize
			}
			Object.assign(data, query)
			this.loading = true
			api.selectBulterOrderInfoBulterAccessCfg(data).then(res => {
				console.log(res, "result")
				this.pageData = res.data || { totalCount: 0, data: [] }
				this.pageData.data.forEach((item, index) => {
					item.recordIndex = index + 1
				})
				this.pagination.total = this.pageData.totalCount
			}).finally(() => {
				this.loading = false
			})
		},
		getSplitUserName (text) {
			text = text || ''
			let segs = text.split(',')
			return segs.map(item => {
				return {
					staffName: item.split('-')[0],
					userName: item.split('-')[1]
				}
			})
		},
		resetFilterForm () {
			this.filterForm.resetFields()
			this.searchHandle()
		},
		addRecord () {
			this.$refs.bulterAccessForm.addForm()
		},
		editRecord (obj) {
			this.$refs.bulterAccessForm.editForm(obj)
		},
		showRecordInfo (obj) {
			this.$refs.bulterAccessForm.editForm(obj, true)
		},
		swithTableShow () {
			this.showTable = !this.showTable
			this.iconType = this.showTable ? "down" : "up"
		}
	}
}
</script>
