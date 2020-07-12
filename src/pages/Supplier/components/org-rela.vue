<template>
  <div>
    <a-card style="margin-top:24px;">
      <span href="#" slot="title" style="float:left;">
        <a-icon type="folder-open" /> {{this.param.sorgName + "关联信息"}}</span>
      <a href="#" slot="extra">
        <a-icon :type="iconType" @click="switchTableShow" /></a>
      <a-tabs defaultActiveKey="1" tabPosition="top" type="card" v-show="showTable">
        <a-tab-pane tab="服务商关联信息" key="1"  v-if="param.supplierCode">
          <a-form :form="filterForm">
            <a-row :gutter="16">
              <a-col :span="6">
                <a-form-item label="机构编码" :label-col="filterFormLayout.labelCol" :wrapper-col="filterFormLayout.wrapperCol">
                  <a-input v-decorator="['sorgRelatedQuery']"/>
                </a-form-item>
              </a-col>
              <a-col :span="6">
                <a-form-item label="机构名称" :label-col="filterFormLayout.labelCol" :wrapper-col="filterFormLayout.wrapperCol">
                  <a-input v-decorator="['sorgRelatedName']"/>
                </a-form-item>
              </a-col>
              <a-col :span="12">
                <a-button v-if="!verify" type="primary" class="editable-add-btn" @click="selectRelaOrg" style="float:right;margin-right:10px;">新建</a-button>
                <a-button v-if="!verify" type="primary" :disabled="!selectedRows.length" class="editable-add-btn" style="float:right;margin-right:10px;" @click="delProvider">删除</a-button>
                <a-button type="" class="editable-add-btn" @click="resetFilterForm" style="float:right;margin-right:10px;">重置</a-button>
                <a-button type="" class="editable-add-btn" @click="searchHandle" style="float:right;margin-right:10px;">查询</a-button>
              </a-col>
            </a-row>
          </a-form>
          <a-table :bordered="false" :pagination="pagination" :rowSelection="rowSelection" :dataSource="pageData.data" :columns="columns" :rowKey="record => record.providerCode" :indentSize=0 :loading="loading">
            <a slot="providerCode" slot-scope="text">{{text}}</a>
            <span slot="orgCodeDesc" slot-scope="text">{{text || '-'}}</span>
          </a-table>
        </a-tab-pane>
        <a-tab-pane tab="供应商关联信息" key="2">
          <a-form :form="filterForm2">
            <a-row :gutter="16">
              <a-col :span="6">
                <a-form-item label="供应商编码" :label-col="filterFormLayout.labelCol" :wrapper-col="filterFormLayout.wrapperCol">
				  				<a-input v-decorator="['supplierRelaedCode']"/>
                </a-form-item>
              </a-col>
              <a-col :span="6">
                <a-form-item label="供应商名称" :label-col="filterFormLayout.labelCol" :wrapper-col="filterFormLayout.wrapperCol">
				  				<a-input v-decorator="['supplierRelaedName']"/>
                </a-form-item>
              </a-col>
              <a-col :span="12">
                <a-button v-if="!verify" type="primary" class="editable-add-btn" @click="selectRelaSupplier" style="float:right;margin-right:10px;">新建</a-button>
                <a-button v-if="!verify" type="primary" :disabled="!selectedRows2.length" class="editable-add-btn" style="float:right;margin-right:10px;" @click="delSupplier">删除</a-button>
                <a-button type="" class="editable-add-btn" @click="resetFilterForm2" style="float:right;margin-right:10px;">重置</a-button>
                <a-button type="" class="editable-add-btn" @click="searchHandle2" style="float:right;margin-right:10px;">查询</a-button>
              </a-col>
            </a-row>
          </a-form>
          <a-table v-show="showTable" :bordered="false" :pagination="pagination2" :rowSelection="rowSelection2" :dataSource="pageData2.data" :columns="columns2" :rowKey="record => record.supplierCode" :indentSize=0 :loading="loading2">
            <a slot="supplierCode" slot-scope="text">{{text}}</a>
            <span slot="orgCodeDesc" slot-scope="text">{{text || '-'}}</span>
          </a-table>
        </a-tab-pane>
      </a-tabs>
    </a-card>
    <a-card style="margin-top:24px;">
      <span href="#" slot="title" style="float:left;">
        <a-icon type="link" /> 下级关联信息</span>
      <a href="#" slot="extra">
        <a-icon :type="iconType2" @click="switchTableShow2" /></a>
      <a-row :gutter="16" v-show="showTable2">
        <a-col :span="8" :offset="16">
          <a-button v-if="!verify" type="primary" :disabled="!selectedRows3.length" class="editable-add-btn" style="float:right;margin-right:10px;" @click="delDownOrg">删除</a-button>
          <a-button v-if="!verify" type="primary" class="editable-add-btn" @click="showDownOrg" style="float:right;margin-right:10px;">新建</a-button>
        </a-col>
      </a-row>
      <a-table v-show="showTable2" :bordered="false" :pagination="pagination3" :rowSelection="rowSelection3" :dataSource="pageData3.data" :columns="columns3" :rowKey="record => record.sorgCode" :indentSize=0 :loading="loading3">
        <a slot="sorgCode" slot-scope="text">{{text}}</a>
        <span slot="orgCodeDesc" slot-scope="text">{{text || '-'}}</span>
      </a-table>
    </a-card>
    <a-row :gutter="16" style="margin-top:12px;" v-show="!verify" >
      <a-col :span="12" :offset="12">
        <a-button type="primary" class="editable-add-btn" @click="submitData" style="float:right;margin-right:10px;">提交审批</a-button>
      </a-col>
    </a-row>
		<a-row :gutter="16" style="margin-top:12px;" v-show="verify && !similar">
			<a-form :form="filterForm3">
				<a-row :gutter="16">
					<a-col :span="20">
						<a-form-item label="审批意见" :label-col="{ span: 3 }" :wrapper-col="{ span: 18 }">
							<a-textarea :auto-size="{ minRows: 5,maxRows:5 }" v-decorator="['approveOpinion',{initialValue: '',rules: [{ message: '请输入审批意见!' }]}]"/>
						</a-form-item>
					</a-col>
				</a-row>
				<a-row>
					<a-col :span="12" :offset="12">
						<a-button type="" class="editable-add-btn" @click="supplierVerifyBack" style="float:right;margin-right:10px;">退回</a-button>
						<a-button type="primary" class="editable-add-btn" @click="supplierVerifyApproval" style="float:right;margin-right:10px;">通过</a-button>
					</a-col>
				</a-row>
			</a-form>
	</a-row>
    <a-modal v-model="relaOrgModal" :footer="null" style="top: 30px;" :width="1070" title="选择关联数据">
      <ModalRelaOrgSearch :param="sorgParam()" ref='modalRelaOrgSearch'  @addRelaOrg="addRelaOrg" />
    </a-modal>
    <a-modal v-model="relaSupplierModal" :footer="null" style="top: 30px;" :width="1070" title="选择关联数据">
      <ModalRelaSupplierSearch :param="sorgParam()"   ref='modalRelaSupplierSearch' @addRelaSupplier="addRelaSupplier" />
    </a-modal>
    <a-modal v-model="downModal" :footer="null" style="top: 30px;" :width="1070" title="下级关联信息数据">
      <ModalDownSearch :param="sorgParam()"  ref='modalDownSearch' @addDownOrg="addDownOrg" />
    </a-modal>
  </div>
</template>
<script>
import supApi from "@/api/api-supplier"
import ModalRelaSupplierSearch from "./modal-rela-supplier-search"
import ModalRelaOrgSearch from "./modal-rela-org-search"
import ModalDownSearch from "./modal-down-search"
import { Promise } from "q"
export default {
	name: 'OrgRela',
	components: { ModalRelaSupplierSearch, ModalRelaOrgSearch, ModalDownSearch },
	props: {
		param: {
			type: Object,
			default () {
				return {}
			}
		},
		verify: {
			type: Boolean,
			default () {
				return false
			}
		},
		similar: {
			type: Boolean,
			default () {
				return false
			}
		}
	},
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
			pageData2: {
				dataCount: 0,
				data: []
			},
			pageData3: {
				dataCount: 0,
				data: []
			},
			relaSupplierModal: false,
			relaOrgModal: false,
			downModal: false,
			filterForm: this.$form.createForm(this),
			filterForm2: this.$form.createForm(this),
			filterForm3: this.$form.createForm(this),
			selectedRows: [],
			selectedRows2: [],
			selectedRows3: [],
			loading: false,
			loading2: false,
			loading3: false,
			showTable: true,
			iconType: "down",
			showTable2: true,
			iconType2: "down",
			columns: [
				{
					align: "center",
					title: "序号",
					dataIndex: "recordIndex"
				},
				{
					align: "left",
					title: "机构编码",
					dataIndex: "providerCode",
					scopedSlots: { customRender: "providerCode" }
				},
				{
					align: "left",
					title: "机构名称",
					dataIndex: "sorgName"
				},
				{
					align: "left",
					title: "机构类型",
					dataIndex: "providerTypeDesc"
				},
				{
					align: "left",
					title: "机构状态",
					dataIndex: "relaStateDesc"
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
					title: "供应商编码",
					dataIndex: "supplierCode",
					scopedSlots: { customRender: "supplierCode" }
				},
				{
					align: "left",
					title: "供应商名称",
					dataIndex: "supplierName"
				},
				{
					align: "left",
					title: "成员类型",
					dataIndex: "providerTypeDesc"
				},
				{
					align: "left",
					title: "当前状态",
					dataIndex: "relaStateDesc"
				}
			],
			columns3: [
				{
					align: "center",
					title: "序号",
					dataIndex: "recordIndex"
				},
				{
					align: "left",
					title: "机构编码",
					dataIndex: "sorgCode",
					scopedSlots: { customRender: "sorgCode" }
				},
				{
					align: "left",
					title: "机构名称",
					dataIndex: "sorgName"
				},
				{
					align: "left",
					title: "机构类型",
					dataIndex: "orgTypeDesc"
				}
			],
			rowSelection: {
				onChange: (selectedRowKeys, selectedRows) => {
					this.selectedRows = selectedRows
				}
			},
			rowSelection2: {
				onChange: (selectedRowKeys, selectedRows) => {
					this.selectedRows2 = selectedRows
				}
			},
			rowSelection3: {
				onChange: (selectedRowKeys, selectedRows) => {
					this.selectedRows3 = selectedRows
				}
			},
			pagination: {
				pageSize: 5,
				current: 1,
				total: 0,
				showTotal: total => `共 ${total} 条数据`,
				showSizeChanger: true,
				pageSizeOptions: ["10", "20", "35", "50"],
				onShowSizeChange: (current, pageSize) =>
					this.onPageSizeChange(current, pageSize),
				onChange: (page, pageSize) => this.onPageChange(page, pageSize)
			},
			pagination2: {
				pageSize: 5,
				current: 1,
				total: 0,
				showTotal: total => `共 ${total} 条数据`,
				showSizeChanger: true,
				pageSizeOptions: ["10", "20", "35", "50"],
				onShowSizeChange: (current, pageSize) =>
					this.onPageSizeChange2(current, pageSize),
				onChange: (page, pageSize) => this.onPageChange2(page, pageSize)
			},
			pagination3: {
				pageSize: 5,
				current: 1,
				total: 0,
				showTotal: total => `共 ${total} 条数据`,
				showSizeChanger: true,
				pageSizeOptions: ["10", "20", "35", "50"],
				onShowSizeChange: (current, pageSize) =>
					this.onPageSizeChange3(current, pageSize),
				onChange: (page, pageSize) => this.onPageChange3(page, pageSize)
			}
		}
	},
	watch: {
		param: {
			deep: true,
			handler () {
				this.searchHandle()
				this.searchHandle2()
				this.searchHandle3()
			}
		}
	},
	mounted () {
		this.searchHandle()
		this.searchHandle2()
		this.searchHandle3()
	},
	methods: {
		searchHandle () {
			this.pagination.current = 1
			this.loadPageData()
		},
		onPageChange (page, pageSize) {
			this.pagination.current = page
			this.loadPageData()
		},
		onPageSizeChange (current, size) {
			this.pagination.pageSize = size
			this.searchHandle()
		},
		// 查询服务商管理机构
		loadPageData () {
			console.log('pageParam===', this.param)
			if (!this.param.sorgCode) return
			let query = this.filterForm.getFieldsValue()
			let data = {
				page: this.pagination.current,
				limit: this.pagination.pageSize,
				sorgCode: this.param.sorgCode,
				supplierCode: this.param.supplierCode
			}
			this.loading = true
			supApi.queryProviderList4Supplier(Object.assign(query, data)).then(res => {
				this.pageData = res.data
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
		searchHandle2 () {
			this.pagination2.current = 1
			this.loadPageData2()
		},
		onPageChange2 (page, pageSize) {
			this.pagination2.current = page
			this.loadPageData2()
		},
		onPageSizeChange2 (current, size) {
			this.pagination2.pageSize = size
			this.searchHandle2()
		},
		// 查询供应商关联机构
		loadPageData2 () {
			console.log('pageParam===', this.param)
			if (!this.param.sorgCode) return
			let query = this.filterForm2.getFieldsValue()
			let data = {
				page: this.pagination2.current,
				limit: this.pagination2.pageSize,
				sorgCode: this.param.sorgCode
			}
			this.loading2 = true
			supApi.queryProviderList(Object.assign(query, data)).then(res => {
				this.pageData2 = res.data
				this.pageData2.data.forEach((item, index) => {
					item.recordIndex = index + 1
				})
				this.pagination2.total = this.pageData2.totalCount
			}).finally(() => {
				this.loading2 = false
			})
		},
		resetFilterForm2 () {
			this.filterForm2.resetFields()
			this.searchHandle2()
		},
		searchHandle3 () {
			this.pagination3.current = 1
			this.loadPageData3()
		},
		onPageChange3 (page, pageSize) {
			this.pagination3.current = page
			this.loadPageData3()
		},
		onPageSizeChange3 (current, size) {
			this.pagination3.pageSize = size
			this.searchHandle3()
		},
		addRelaOrg () {
			this.searchHandle()
			this.relaOrgModal = false
			this.ModalRelaOrgSearch = false
		},
		addRelaSupplier () {
			this.searchHandle2()
			this.relaSupplierModal = false
			this.ModalRelaSupplierSearch = false
		},
		addDownOrg () {
			this.downModal = false
			this.ModalDownSearch = false
			this.searchHandle3()
		},
		// 机构管理，删除服务商
		delProvider () {
			let data = {
				sorgCode: this.param.sorgCode,
				sorgName: this.param.sorgName,
				providerId: this.selectedRows
			}
			let self = this
			this.$confirm({
				title: '确认提示',
				content: '确认删除关联信息？',
				okType: 'danger',
				onOk () {
					return new Promise((resolve, reject) => {
						supApi.deleteSupProvider(data).then(res => {
							self.$message.success('删除服务商操作成功')
							self.searchHandle()
						}).finally(() => {
							resolve()
						})
					})
				}
			})
		},
		// 机构管理，删除供应商
		delSupplier () {
			let data = {
				sorgCode: this.param.sorgCode,
				sorgName: this.param.sorgName,
				providerId: this.selectedRows2
			}
			let self = this
			this.$confirm({
				title: '确认提示',
				content: '确认删除关联信息？',
				okType: 'danger',
				onOk () {
					return new Promise((resolve, reject) => {
						supApi.deleteSupProvider(data).then(res => {
							self.$message.success('删除供应商操作成功')
							self.searchHandle2()
						}).finally(() => {
							resolve()
						})
					})
				}
			})
		},
		// 删除下级机构管理
		delDownOrg () {
			let data = {
				sorgCode: this.param.sorgCode,
				sorgName: this.param.sorgName,
				providerId: this.selectedRows3
			}
		  let self = this
			this.$confirm({
				title: '确认提示',
				content: '确认删除关联信息？',
				okType: 'danger',
				onOk () {
					return new Promise((resolve, reject) => {
						supApi.deleteDownSorg(data).then(res => {
							self.$message.success('删除下级机构操作成功')
							self.searchHandle3()
						}).finally(() => {
							resolve()
						})
					})
				}
			})
		},
		// 审批退回
		supplierVerifyBack () {
			// this.filterForm3.validateFields((error, values) => {
			//   console.log("values:", values)
			// 	if (error) {
			// 		this.$message.error('表单请填写完整！')
			// 	}
			// })
			if (this.filterForm3.getFieldValue('approveOpinion') === '') {
				this.$message.error('退回意见不能为空！')
				return
			}
			let formData = Object.assign({}, this.filterForm3.getFieldsValue())
			this.loading3 = true
			formData.operationType = "verifyBack"
			formData.sorgCode = this.param.sorgCode
			formData.supplierCode = this.param.supplierCode
			supApi.supplierVerifyBack(formData).then(res => {
				this.$message.success('审批退回操作成功')
				this.$emit('showTabs', [], true, '1')
				this.$emit('showTabs', ['showTabServiceOrg', 'showTabSupplier', ['showTabPhar'], ['showTabOrgRela']], false)
			}).finally(() => {
				this.loading3 = false
			})
			// })
		},
		// 审批通过
		supplierVerifyApproval () {
			this.filterForm3.validateFields((error, values) => {
				if (error) {
					this.$message.error('表单请填写完整！')
					return
				}
				let formData = Object.assign({}, values)
				this.loading3 = true
				formData.operationType = "verifyApproval"
				formData.isNewFlag = this.param.isNewFlag ? 'true' : 'false'
				formData.sorgCode = this.param.sorgCode
				formData.supplierCode = this.param.supplierCode
				supApi.supplierVerifyApproval(formData).then(res => {
					this.$message.success('审批通过操作成功')
					this.$emit('showTabs', [], true, '1')
					this.$emit('showTabs', ['showTabServiceOrg', 'showTabSupplier', ['showTabPhar'], ['showTabOrgRela']], false)
				}).finally(() => {
					this.loading3 = false
				})
			})
		},
		// 查询下级机构
		loadPageData3 () {
			console.log('pageParam===', this.param)
			if (!this.param.sorgCode) return
			let data = {
				page: this.pagination3.current,
				limit: this.pagination3.pageSize,
				sorgCode: this.param.sorgCode
			}
			this.loading3 = true
			supApi.queryDownSorgList(data).then(res => {
				this.pageData3 = res.data
				this.pageData3.data.forEach((item, index) => {
					item.recordIndex = index + 1
				})
				this.pagination3.total = this.pageData3.totalCount
			}).finally(() => {
				this.loading3 = false
			})
		},
		switchTableShow () {
			this.showTable = !this.showTable
			this.iconType = this.showTable ? "down" : "up"
		},
		switchTableShow2 () {
			this.showTable2 = !this.showTable2
			this.iconType2 = this.showTable2 ? "down" : "up"
		},
		selectRelaOrg () {
			console.log(this.param)
			this.relaOrgModal = true
		},
		selectRelaSupplier () {
			this.relaSupplierModal = true
		},
		selectDownModal () {
			this.downModal = true
		},
		sorgParam () {
			return this.param
		},
		showDownOrg () {
			console.log("校验上级机构：", this.param)
			// 校验是否存在上级机构
			if (this.param.upSorgCode === undefined || this.param.upSorgCode === '' || this.param.upSorgCode == null) {
				this.downModal = true
			} else {
				this.$message.error("有上级机构不可添加下级机构！")
			}
		},
		submitData () {
		  // 如果机构OR药店为非自建，即为服务商，则需要配置供应商才可以提交审批
			if (this.param.isSelfSign === 'N' && this.pagination2.total === 0) {
				// 判断供应商关联信息是否已添加
				this.$message.error("该服务商需要配置供应商才可以提交审核！")
				return
			}
			let self = this
			let sorgCode = this.param.sorgCode
			let supplierCode = this.param.supplierCode
			this.$confirm({
				title: '确认提示',
				content: `信息提交审批后数据不可修改，是否继续？`,
				okText: '继续',
				okType: 'danger',
				cancelText: '关闭',
				onOk () {
					return new Promise((resolve, reject) => {
						let data = {
							sorgCode: sorgCode,
							supplierCode: supplierCode
						}
						supApi.updateOrginStatus(data).then(res => {
							self.$message.success('提交审批成功')
							self.$emit('showTabs', [], true, '1')
							self.$emit('showTabs', ['showTabServiceOrg', 'showTabSupplier', ['showTabPhar'], ['showTabOrgRela']], false)
							self.$emit('loadPageData')
						}).finally(() => {
							resolve()
						})
					})
				}
			})
		}
	}
}
</script>
<style>
.editable-cell {
  position: relative;
}

.editable-cell-input-wrapper,
.editable-cell-text-wrapper {
  padding-right: 24px;
}

.editable-cell-text-wrapper {
  padding: 5px 24px 5px 5px;
}

.editable-cell-icon,
.editable-cell-icon-check {
  position: absolute;
  right: 0;
  width: 20px;
  cursor: pointer;
}

.editable-cell-icon {
  line-height: 18px;
  display: none;
}

.editable-cell-icon-check {
  line-height: 28px;
}

.editable-cell:hover .editable-cell-icon {
  display: inline-block;
}

.editable-cell-icon:hover,
.editable-cell-icon-check:hover {
  color: #108ee9;
}

.editable-add-btn {
  margin-bottom: 8px;
}
</style>

