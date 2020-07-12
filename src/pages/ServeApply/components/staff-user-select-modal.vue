<template>
  <div>
    <a-modal v-model="formModal" style="top: 30px;" :width="modalWidth" title="陪诊人查询">
        <a-card>
            <a-form :form="filterForm" :labelCol="filterFormLayout.labelCol" :wrapperCol="filterFormLayout.wrapperCol">
                <a-row :gutter="16">
                    <a-col :span="6">
                        <a-form-item label="系统用户">
                            <a-input v-decorator="['userName']"/>
                        </a-form-item>
                    </a-col>
                    <a-col :span="6">
                        <a-form-item label="姓名">
                            <a-input  v-decorator="['staffName']"/>
                        </a-form-item>
                    </a-col>
                    <a-col :span="6">
                        <a-form-item label="管理机构">
							<OrgSelect2 dicType="86" :allowClear="true" v-decorator="['orgCode']" />
                        </a-form-item>
                    </a-col>
                </a-row>
                <a-row :gutter="16">
                    <a-col :span="12" :offset="11">
                        <a-button type="" class="editable-add-btn" @click="resetFilterForm" style="float:right;margin-right:10px;">重置</a-button>
                        <a-button type="" class="editable-add-btn" @click="searchHandle" style="float:right;margin-right:10px;">查询</a-button>
                    </a-col>
                </a-row>
            </a-form>
        </a-card>

        <h4 style="margin-top:10px;">查询结果</h4>
        <a-card>
            <a-table :bordered="false" :pagination="pagination" :dataSource="pageData.data" :columns="columns" :rowKey="record => record.recordIndex" :indentSize=0 :loading="loading"
                :row-selection="{ type: 'radio', selectedRowKeys: selectedRowKeys, onChange: onRowChange }">
                <span slot="recordIndex" slot-scope="text, record">{{(text || '-')}}</span>
            </a-table>
        </a-card>

        <div slot="footer">
            <a-button type="" @click="formModal=false">关闭</a-button>
            <a-button type="" @click="confirmData" >确认</a-button>
        </div>
    </a-modal>
  </div>
</template>
<script>
import api from '@/api/api-serve-apply'
import AddressSelect from '@/components/address-select'
import OrgSelect2 from "@/components/org-select2"
export default {
	name: 'staff-user-select-modal',
	components: { AddressSelect, OrgSelect2 },
	data () {
		return {
			// 查询条件
			filterFormLayout: {
				labelCol: { span: 9 },
				wrapperCol: { span: 15 }
			},
			formModal: false,
			modalWidth: 1170,
			pageData: {
				dataCount: 0,
				data: []
			},
			filterForm: this.$form.createForm(this),
			selectedRows: [],
			selectedRowKeys: [],
			loading: false,
			columns: [
				{
					align: "center",
					title: "序号",
					dataIndex: "recordIndex",
					scopedSlots: { customRender: 'recordIndex' }
				},
				{
					align: "left",
					title: "系统账号",
					dataIndex: "userName"
				},
				{
					align: "left",
					title: "工号",
					dataIndex: "staffNo"
				},
				{
					align: "left",
					title: "名称",
					dataIndex: "staffName"
				},
				{
					align: "left",
					title: "所属管理机构",
					dataIndex: "orgName"
				},
				{
					align: "left",
					title: "联系电话",
					dataIndex: "tel"
				},
				{
					align: "left",
					title: "状态",
					width: '80',
					dataIndex: "status"
				}
			],
			pagination: {
				pageSize: 5,
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
		// this.searchHandle()
	},
	methods: {
		onRowChange (selectedRowKeys, selectedRows) {
			this.selectedRowKeys = selectedRowKeys || []
			this.selectedRows = selectedRows
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
			this.filterForm.validateFields((error, values) => {
				if (error) {
					return
				}
				let query = values
				let data = {
					page: this.pagination.current,
					limit: this.pagination.pageSize
				}
			    this.loading = true
				api.staffUser(Object.assign(data, query)).then(res => {
					this.pageData = res.data || { totalCount: 0, data: [] }
					this.pageData.data.forEach((item, index) => { item.recordIndex = index + 1 })
					this.pagination.total = this.pageData.totalCount
				}).finally(() => {
					this.loading = false
				})
			})
		},
		resetFilterForm () {
			this.filterForm.resetFields()
			this.searchHandle()
		},
		confirmData () {
			this.$emit('on-update', this.selectedRows[0])
			this.formModal = false
		},
		showPage () {
			this.formModal = true
		}
	}
}
</script>
