<template>
	<a-card :bordered="false">
		<a-card>
			<a-form :form="filterForm" :labelCol="filterFormLayout.labelCol" :wrapperCol="filterFormLayout.wrapperCol">
				<a-row :gutter="16">
          <a-col :span="8">
						<a-form-item label="问卷编码">
							<a-input v-decorator="['qnrCode', {initialValue: ''}]" />
						</a-form-item>
					</a-col>
					<a-col :span="8">
						<a-form-item label="问卷名称">
							<a-input v-decorator="['qnrName', {initialValue: ''}]" />
						</a-form-item>
					</a-col>
					<a-col :span="8">
						<a-form-item label="应用的产品">
							<ProductSelect :allowClear="true" @change="searchHandle" v-decorator="['useProducts', {initialValue: ''}]" />
						</a-form-item>
					</a-col>
          <a-col :span="8">
						<a-form-item label="应用的服务">
							<ServiceSelect :allowClear="true" @change="searchHandle" v-decorator="['useServices', {initialValue: ''}]" />
						</a-form-item>
					</a-col>
          <a-col :span="8">
            <a-form-item label="所在省">
              <AddressSelect dicType="0" v-decorator="['sorgProvinces',{initialValue: ''}]" />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="所在市">
              <AddressSelect :dicType="filterForm.getFieldsValue(['sorgProvinces']).sorgProvinces" v-decorator="['sorgCitys',{initialValue: ''}]" />
            </a-form-item>
          </a-col>
          <a-col :span="8">
						<a-form-item label="服务商编码">
							<a-input-search :readonly="true" :allowClear="true" v-decorator="['orgCodes', {initialValue: ''}]" enter-button @search="onSearchProvider" />
						</a-form-item>
					</a-col>
          <a-col :span="8">
						<a-form-item label="供应商编码">
							<a-input-search :readonly="true" :allowClear="true" v-decorator="['supplierCodes', {initialValue: ''}]" enter-button @search="onSearchSupplier" />
						</a-form-item>
					</a-col>
          <a-col :span="8">
						<a-form-item label="问卷状态">
							<DicSelect dicType="QNR_STATUS" :allowClear="true" @change="searchHandle" v-decorator="['status', {initialValue: ''}]" />
						</a-form-item>
					</a-col>
				</a-row>
				<a-row :gutter="16">
					<a-col :span="12" :offset="11">
						<a-button type="" class="editable-add-btn" @click="resetFilterForm" style="float:right;margin-right:10px;">重置</a-button>
						<a-button type="" class="editable-add-btn" @click="searchHandle" style="float:right;margin-right:10px;">查询</a-button>
						<a-button type="primary" class="editable-add-btn" @click="addRecord" style="float:right;margin-right:10px;">新增</a-button>
					</a-col>
				</a-row>
			</a-form>
		</a-card>
		<a-card style="margin-top:24px;">
			<span href="#" slot="title" style="float:left;"><a-icon type="bank" /> 问卷列表</span>
			<a href="#" slot="extra"><a-icon :type="iconType" @click="swithTableShow" /></a>
			<a-table v-show="showTable" :bordered="false" :pagination="pagination" :dataSource="pageData.data" :columns="columns" :rowKey="record => record.qnrInfoId" :indentSize=0 :loading="loading"
				:row-selection="{ type: 'radio', selectedRowKeys: selectedRowKeys, onChange: onRowChange }" >
				<a slot="qnrCode" @click="showRecordInfo(record)" slot-scope="text, record">{{(text)}}</a>
				<span slot="textVal" slot-scope="text, record">{{text || '-'}}</span>
				<a-tag slot="status" slot-scope="text, record" :color="text | statusColor">{{text}}</a-tag>
			</a-table>
		</a-card>
		<div style="margin-top: 10px;margin-left: 50%;">
			<a-button type="primary" :disabled="!selectedRows.length || selectedRows[0].status!='02'" @click="deleteRecord" class="editable-add-btn" style="float:right;margin-right:10px;" >删除</a-button>
			<a-button type="primary" :disabled="!selectedRows.length || selectedRows[0].status!='02'" @click="editRecord" class="editable-add-btn" style="float:right;margin-right:10px;" >修改</a-button>
			<a-button type="primary" :loading="loading1" :disabled="!selectedRows.length" @click="copyRecord" class="editable-add-btn" style="float:right;margin-right:10px;" >复制</a-button>
			<a-button type="primary" :disabled="!selectedRows.length || selectedRows[0].status!='03'" @click="enableRecord" class="editable-add-btn" style="float:right;margin-right:10px;" >启用</a-button>
			<a-button type="primary" :disabled="!selectedRows.length || selectedRows[0].status!='01'" @click="disableRecord" class="editable-add-btn" style="float:right;margin-right:10px;" >禁用</a-button>
			<a-button type="primary" :disabled="!selectedRows.length || selectedRows[0].status!='02'" @click="publishRecord" class="editable-add-btn" style="float:right;margin-right:10px;" >发布</a-button>
		</div>

		<ProviderSelectModal ref="providerSelectModal" @on-update="searchProviderHandle"/>
		<SupplierSelectModal ref="supplierSelectModal" @on-update="searchSupplierHandle"/>
		<QuestionaireForm ref="questionaireForm" @on-update="loadPageData" />
		<VisitPreview ref="VisitPreview" />
	</a-card>
</template>
<script>
import api from "@/api/api-questionnaire"
import DicSelect from "@/components/dic-select"
import QuestionaireForm from "./components/questionnaire-form"
import AddressSelect from "@/components/address-select"
import ProductSelect from "./components/product-select"
import ServiceSelect from "./components/service-select"
import ProviderSelectModal from "./components/provider-select-modal"
import SupplierSelectModal from "./components/supplier-select-modal"
import VisitPreview from './components/visit-preview'
export default {
	name: "questionnaire-info",
	components: { DicSelect, AddressSelect, QuestionaireForm, ProductSelect, ServiceSelect, ProviderSelectModal, SupplierSelectModal, VisitPreview },
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
			loading1: false,
			filterForm: this.$form.createForm(this),
			selectedRows: [],
			selectedRowKeys: [],
			loading: false,
			showTable: true,
			iconType: "down",
			columns: [
				{ title: "问卷编码", dataIndex: "qnrCode", scopedSlots: { customRender: "qnrCode" } },
				{ title: "问卷名称", dataIndex: "qnrName" },
				{ title: "问卷描述", dataIndex: "qnrDesc" },
				{ title: "状态", dataIndex: "statusDesc", scopedSlots: { customRender: "status" } },
				{ title: "发布日期", dataIndex: "releaseDateDesc" }
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
			}
		}
	},
	filters: {
		statusColor (val) {
			if (val === '已发布') return 'green'
			if (val === '已禁用') return 'orange'

			return 'blue'
		}
	},
	mounted () {
		this.searchHandle()
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
			this.selectedRowKeys = []
			this.selectedRows = []

			let query = this.filterForm.getFieldsValue()
			let data = {
				page: this.pagination.current,
				limit: this.pagination.pageSize,
				queryParam: query
			}
			this.loading = true
			api.queryPageQnrInfo(data).then(res => {
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
		resetFilterForm () {
			this.filterForm.resetFields()
			this.searchHandle()
		},
		onSearchProvider () {
			this.$refs.providerSelectModal.show()
		},
		searchProviderHandle (obj) {
			this.filterForm.setFieldsValue({
				orgCodes: obj.sorgCode
			})
		},
		onSearchSupplier () {
			this.$refs.supplierSelectModal.show()
		},
		searchSupplierHandle (obj) {
			this.filterForm.setFieldsValue({
				supplierCodes: obj.supplierCode
			})
		},
		addRecord () {
			this.$refs.questionaireForm.addForm()
		},
		showRecordInfo (obj) {
			this.$refs.VisitPreview.show(obj)
		},
		deleteRecord () {
			let obj = this.selectedRows[0]
			if (obj.status === '01') {
				this.$Message.warning('此问卷已发布不可删除')
				return
			}
			let self = this
			this.$confirm({
				title: '确认提示',
				content: `删除后不可恢复，确认删除吗？`,
				okType: 'danger',
				onOk () {
					return new Promise((resolve, reject) => {
						api.deleteQnrInfo({id: obj.qnrInfoId}).then(res => {
							self.$Message.success('删除成功，数据已更新!')
							self.loadPageData()
						}).finally(() => {
							resolve()
						})
					})
				}
			})
		},
		editRecord () {
			let obj = this.selectedRows[0]
			if (obj.status === '01') {
				this.$Message.warning('此问卷已发布不可修改')
			}

			this.$refs.questionaireForm.editForm(obj)
		},
		copyRecord () {
			let obj = this.selectedRows[0]
			this.loading1 = true
			api.cloneQnrInfo({id: obj.qnrInfoId}).then(res => {
				let newId = res.data
				if (newId) {
					this.$refs.questionaireForm.editForm({qnrInfoId: newId})
				}
			}).finally(() => {
				this.loading1 = false
			})
		},
		enableRecord () {
			let obj = this.selectedRows[0]
			if (obj.status === '01') {
				this.$Message.warning('此问卷非禁用状态不可启用')
				return
			}
			if (obj.status === '02') {
				this.$Message.warning('此问卷非禁用状态不可启用')
				return
			}
			api.qnrEnableQnrInfo({id: obj.qnrInfoId}).then(res => {
				this.$Message.success('启用成功，数据已更新!')
				this.loadPageData()
			})
		},
		disableRecord () {
			let obj = this.selectedRows[0]
			if (obj.status === '02') {
				this.$Message.warning('此问卷非发布状态不可禁用')
				return
			}
			if (obj.status === '03') {
				this.$Message.warning('此问卷非发布状态不可禁用')
				return
			}
			api.qnrDisableQnrInfo({id: obj.qnrInfoId}).then(res => {
				this.$Message.success('禁用成功，数据已更新!')
				this.loadPageData()
			})
		},
		publishRecord () {
			let obj = this.selectedRows[0]
			if (obj.status === '01') {
				this.$Message.warning('此问卷非草稿状态不可发布')
				return
			}
			if (obj.status === '03') {
				this.$Message.warning('此问卷非草稿状态不可发布')
				return
			}

			let self = this
			api.checkRepeatTerm(obj).then(res => {
				let arr = res.data

				if (arr && arr.length) {
					self.$confirm({
						title: '确认提示',
						content: `此问卷的匹配条件与 ${arr.join(' ')} 存在冲突，是否继续？`,
						okType: 'danger',
						onOk () {
							return new Promise((resolve, reject) => {
								api.qnrReleaseQnrInfo({id: obj.qnrInfoId}).then(res => {
									self.$Message.success('发布成功，数据已更新!')
									self.loadPageData()
								}).finally(() => {
									resolve()
								})
							})
						}
					})
				} else {
					api.qnrReleaseQnrInfo({id: obj.qnrInfoId}).then(res => {
						self.$Message.success('发布成功，数据已更新!')
						self.loadPageData()
					})
				}
			})
		},
		swithTableShow () {
			this.showTable = !this.showTable
			this.iconType = this.showTable ? "down" : "up"
		}
	}
}
</script>
