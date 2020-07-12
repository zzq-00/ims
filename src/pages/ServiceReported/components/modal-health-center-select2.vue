<template>
  <div>
    <a-modal v-model="formModal" style="top: 30px;" :width="modalWidth" :title="modalTitle">
      <a-card>
        <a-form :form="filterForm" :labelCol="filterFormLayout.labelCol" :wrapperCol="filterFormLayout.wrapperCol">
          <a-row :gutter="16">
            <a-col :span="6">
              <a-form-item label="机构名称">
                <a-input v-decorator="['serveOrgName', {initialValue: ''}]" />
              </a-form-item>
            </a-col>
            <a-col :span="6">
              <a-form-item label="机构编码">
                <a-input v-decorator="['serveOrgCode', {initialValue: ''}]" />
              </a-form-item>
            </a-col>
            <a-col :span="6">
              <a-form-item label="所在省">
                <AddressSelect dicType="0" :allowClear="true" @change="searchHandle" placeholder="请选择" v-decorator="['provinceName', { initialValue: ''} ]" />
              </a-form-item>
            </a-col>
            <a-col :span="6">
              <a-form-item label="所在市">
                <AddressSelect :dicType="this.filterForm.getFieldValue('provinceName')" :hasCascadeDefault='false' :allowClear="true" @change="searchHandle" placeholder="请选择" v-decorator="['cityName',{ initialValue: ''}]" />
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
      <a-card style="margin-top:24px;">
        <a-table :bordered="false" :pagination="pagination" :rowSelection="rowSelection" :dataSource="pageData.data" :columns="columns" :rowKey="record => record.recordIndex" :indentSize=0 :loading="loading">
          <a-tag slot="yesNo" slot-scope="text, record" :color="text=== 'Y' ? 'green' : 'orange'">{{text === 'Y' ? '是' : '否'}}</a-tag>
          <a-badge slot="number" slot-scope="text, record" :count="text" :showZero="true" />
        </a-table>
      </a-card>
      <div slot="footer">
        <a-button type="" @click="formModal=false">取消</a-button>
        <a-button type="primary" @click="submitForm">确定</a-button>
      </div>
    </a-modal>
  </div>
</template>
<script>
import api from '@/api/api-serve-apply'
import AddressSelect from '@/components/address-select'
export default {
	name: 'modal-health-center-select',
	components: { AddressSelect },
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
			formModal: false,
			modalWidth: 1170,
			filterForm: this.$form.createForm(this),
			selectedRows: [],
			loading: false,
			columns: [
				{ title: "序号", dataIndex: "recordIndex" },
				{ title: "机构编码", dataIndex: "serverCode" },
				{ title: "机构名称", dataIndex: "serverName" },
				{ title: "所在省", dataIndex: "orgPrivinceDesc" },
				{ title: "所在市	", dataIndex: "orgCityDesc" }
			],
			rowSelection: {
				type: 'radio',
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
				onShowSizeChange: (current, pageSize) => this.onPageSizeChange(current, pageSize),
				onChange: (page, pageSize) => this.onPageChange(page, pageSize)
			}
		}
	},
	mounted () {

	},
	methods: {
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

				let query = this.filterForm.getFieldsValue()
				let data = {
					page: this.pagination.current,
					limit: this.pagination.pageSize,
					orgType: "04"
				}
				Object.assign(data, query)
				this.loading = true
				api.queryHealthCenterName4Select(data).then(res => {
					console.log(res, 'result')
					let pdata = {
						data: res.data.rows,
						totalCount: res.data.total
					}
					this.pageData = pdata || { totalCount: 0, data: [] }
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
		show () {
			this.formModal = true
			this.modalTitle = '健管中心名称查询'
			this.searchHandle()
		},
		show2 () {
			this.formModal = true
			this.modalTitle = '医院名称查询'
			this.searchHandle()
		},
		submitForm () {
			if (this.selectedRows.length) {
				this.$emit('on-update', this.selectedRows[0])
				this.formModal = false
			} else {
				this.$message.warning('请选择一条记录')
			}
		}
	}
}
</script>
