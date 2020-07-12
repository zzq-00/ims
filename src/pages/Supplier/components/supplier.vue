<template>
  <div>
    <a-form :form="selectform" :label-col="formItemLayout.labelCol" :wrapper-col="formItemLayout.wrapperCol">
      <a-card style="margin-top: 24px;">
        <a-divider orientation="left">
          <a-icon type="shopping-cart" /> 供应商基础信息</a-divider>
        <a-row :gutter="16">
          <a-col :span="6">
            <a-form-item label="供应商编码" >
              <a-input v-decorator="['supplierCode']" disabled />
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="供应商名称" >
              <a-input v-decorator="['supplierName',{rules: [{ required: true }]}]" disabled />
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="供应商分类" >
              <DicSelect  dicType="SUPPLIER_TYPE" v-decorator="['supplierType',{rules: [{ required: true }]}]" disabled />
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="供应商类型" >
              <DicSelect disabled dicType="SUPPLIER_SUB_TYPE" v-decorator="[
                      'supplierSubType',
                      {initialValue: '',rules: [{ required: true, message: '请选择!' }]}
                      ]" placeholder="请选择"></DicSelect>
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="管理机构" >
              <OrgSelect :disabled="verify || disabledOrgCode" dicType="4" v-decorator="[
                      'supplierOrgCode',
                      {initialValue: '',rules: [{ required: true, message: '请选择!' }]}
                      ]" placeholder="请选择">></OrgSelect>
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="合作方式" >
              <a-select :disabled="verify" v-decorator="['cooperationType', {initialValue: '', rules: [{ required: true, message: '请选择!' }]}]" :allowClear="true">
                <a-select-option value="1">自建签约</a-select-option>
                <a-select-option value="3">内部自建</a-select-option>
              </a-select>
<!--              <DicSelect  dicType="COOPERATE_WAY" v-decorator="[-->
<!--                      'cooperationType',-->
<!--                      {initialValue: '',}-->
<!--                      ]" placeholder="请选择">></DicSelect>-->
            </a-form-item>
		  </a-col>
		  <a-col :span="6">
			<a-form-item label="是否有效" v-show="param.showValidState">
				<DicSelect dicType="EFFECT_TYPE" v-decorator="[
						'validState',
						{initialValue: '01',rules: [{ required: true, message: '请选择是否有效!' }]}
						]" disabled></DicSelect>
			</a-form-item>
		</a-col>
        </a-row>
      </a-card>
      <a-card style="margin-top: 24px;">
        <a-divider orientation="left">
          <a-icon type="shopping-cart" /> 供应商详细信息</a-divider>
        <a-row :gutter="16">
          <a-col :span="6">
            <a-form-item label="所在省" >
              <AddressSelect disabled dicType="0" placeholder="请选择所在省" v-decorator="[
                      'province',
                      {initialValue: '',rules: [{ required: true, message: '请选择所在省!' }]}
                      ]"></AddressSelect>
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="所在市" >
              <AddressSelect disabled :dicType="selectform.getFieldValue('province')" placeholder="请选择" v-decorator="[
                      'city',
                      {initialValue: '',rules: [{ required: true, message: '请选择所在市!' }]}
                      ]"></AddressSelect>
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="所在区" >
              <AddressSelect disabled :dicType="selectform.getFieldValue('city')" placeholder="请选择所在区" v-decorator="['county',{initialValue: ''}]"></AddressSelect>
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="联系人" >
              <a-input disabled v-decorator="['supplierLinkman']">
              </a-input>
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="联系电话" >
              <a-input disabled v-decorator="['supplierTel']" >
              </a-input>
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="移动电话" >
              <a-input disabled v-decorator="[
                      'supplierMobile',
                      {rules: [{ pattern: /^1[3456789]\d{9}$/, message: '移动电话格式不正确!' }]}
                      ]" >
              </a-input>
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="证书号" >
              <a-input disabled v-decorator="['certifiCode']" >
              </a-input>
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="营业执照编码" >
              <a-input disabled v-decorator="['licenseCode']" >
              </a-input>
            </a-form-item>
          </a-col>

          <a-col :span="18">
            <a-form-item label="详细地址" :label-col="{ span: 3 }" :wrapper-col="{ span: 18 }">
              <a-input disabled v-decorator="['supplierAddress']">
              </a-input>
            </a-form-item>
          </a-col>
          <a-col :span="18">
            <a-form-item label="乘车路线" :label-col="{ span: 3 }" :wrapper-col="{ span: 18 }">
              <a-input disabled v-decorator="['busLine']">
              </a-input>
            </a-form-item>
          </a-col>
        </a-row>
      </a-card>
      <a-row type="flex" justify="center">
        <a-col :span="24">
          <a-card style="margin-top: 24px;">
            <span slot="title" style="float:left;">
              <a-icon type="book" /> 合约信息</span>
							<template slot="extra">
								<a-icon :type="iconType" @click="switchTableShow" /></template>
							<div v-show="showTable">
								<a-button v-if="!verify" type="primary" class="editable-add-btn" @click="addContract" style="float:right;margin-left: 10px;z-index:10;">新建</a-button>
								<a-table :bordered="false" :pagination="pagination" :dataSource="pageData.data" :columns="columns" :rowSelection="rowSelection" :rowKey="record => record.contNo" :indentSize=0 :loading="loading">
										<a slot="contNo" slot-scope="text,record" @click="editContract(record.contNo)">{{text}}</a>
								</a-table>
							</div>
          </a-card>
        </a-col>
      </a-row>
      <a-row type="flex" justify="center">
        <a-col :span="24">
          <a-card style="margin-top: 24px;">
            <span slot="title" style="float:left;">
              <a-icon type="aliwangwang-o" /> 服务信息</span>
							<template href="" slot="extra">
								<a-icon :type="iconType2" @click="switchTableShow2" />
							</template>
							<div v-show="showTable2">
								<a-button v-if="!verify" type="primary" class="editable-add-btn" @click="addService" style="float:right;margin-left: 10px;z-index:10;">新建</a-button>
								<a-table :bordered="false" :pagination="pagination2" :dataSource="pageData2.data" :columns="columns2" :rowSelection="rowSelection2" :rowKey="record => record.supServId" :indentSize=0 :loading="loading2">
									<a slot="supServId" slot-scope="text,record" @click="editService(record.supServId)">{{text}}</a>
								</a-table>
							</div>
          </a-card>
        </a-col>
      </a-row>
      <a-row :gutter="16" style="margin-top:12px;">
        <a-col :span="12" :offset="12">
          <a-button v-if="!verify" type="primary" class="editable-add-btn" @click="temp" style="float:right;margin-right:10px;">保存供应商</a-button>
          <a-button v-if="!verify" type="primary" class="editable-add-btn" @click="next()" style="float:right;margin-right:10px;">下一步</a-button>
        </a-col>
      </a-row>
    </a-form>
    <SupplierContractForm ref="contractForm" :param="param" :supplierData="supplierData" @on-update="updateContract" :verify="verify"/>
    <SupplierServiceForm ref="serviceForm" @on-update="updateService" :verify="verify"/>
  </div>
</template>
<script>
import supApi from '@/api/api-supplier'
import DicSelect from '@/components/dic-select'
import OrgSelect from '@/components/org-select'
import AddressSelect from '@/components/address-select'
import SupplierContractForm from './supplier-contract-form'
import SupplierServiceForm from './supplier-service-form'
import {Promise} from "q"
export default {
	name: 'supplier',
	components: { DicSelect, OrgSelect, AddressSelect, SupplierContractForm, SupplierServiceForm },
	props: {
		supplierData: {
			type: Object,
			default () {
				return {}
			}
		},
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
		}
	},
	data () {
		return {
			// 查询条件
			formItemLayout: {
				labelCol: { span: 10 },
				wrapperCol: { span: 14 }
			},
			formLayout: "horizontal",
			selectform: this.$form.createForm(this),
			loading: false,
			loading2: false,
			editData: null,
			addTitle: "新增用户",
			visible: false,
			count: 2,
			power: [],
			pageData: {
				dataCount: 0,
				data: []
			},
			selectedRows: [],
			selectedRows2: [],
			pageData2: {
				dataCount: 0,
				data: []
			},
			showTable: true,
			iconType: 'down',
			showTable2: true,
			iconType2: 'down',
			pageSize: 20, // 每页显示多少条
			dataCount: 0, // 总条数
			page: 1, // 当前页
			columns: [
				{
					align: "center",
					title: "序号",
					dataIndex: "recordIndex"
				},
				{
					align: "left",
					title: "合约编码",
					dataIndex: "contNo",
					scopedSlots: { customRender: 'contNo' }
				},
				{
					align: "left",
					title: "合约名称",
					dataIndex: "contName"
				},
				{
					align: "left",
					title: "签订日期",
					dataIndex: "startDate"
				},
				{
					align: "left",
					title: "结束日期",
					dataIndex: "endDate"
				},
				{
					align: "left",
					title: "当前状态",
					dataIndex: "supContStatusDesc"
				}
				// {
				// 	align: "center",
				// 	title: "操作",
				// 	dataIndex: "operation",
				// 	scopedSlots: { customRender: "operation" }
				// }
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
					dataIndex: "serviceCode",
					scopedSlots: { customRender: 'supServId' }
				},
				{
					align: "left",
					title: "服务名称",
					dataIndex: "supServName"
				},
				{
					align: "left",
					title: "所属合约名称",
					dataIndex: "contName"
				},
				{
					align: "left",
					title: "当前状态",
					dataIndex: "serviceStatesDesc"
				}
				// {
				// 	align: "center",
				// 	title: "操作",
				// 	dataIndex: "operation",
				// 	scopedSlots: { customRender: "operation" }
				// }
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
			pagination2: {
				pageSize: 10,
				current: 1,
				total: 0,
				showTotal: total => `共 ${total} 条数据`,
				showSizeChanger: true,
				pageSizeOptions: ["10", "20", "35", "50"],
				onShowSizeChange: (current, pageSize) => this.onPageSizeChange2(current, pageSize),
				onChange: (page, pageSize) => this.onPageChange2(page, pageSize)
			},
			contractModal: false,
			serviceModal: false,
			selectedContId: '',
			selectedServiceId: '',
			disabledOrgCode: false
		}
	},
	watch: {
		supplierData: {
			immediate: true,
			deep: true,
			handler (newVal, oldVal) {
				this.restoreFormData(newVal)
			}
		},
		param: {
			deep: true,
			handler () {
				this.searchHandle()
				this.searchHandle2()
			}
		}
	},
	created () {
		// 取出权限串和token，存入data
		// console.log(this.$route.query, "============")
		// this.power = JSON.parse(this.$route.query.power)
		// this.token = this.$route.query.token
	},
	mounted () {
		this.searchHandle()
		this.searchHandle2()
	},
	methods: {
		searchHandle () {
			this.pagination.current = 1
			this.loadContractData()
		},
		onPageChange (page, pageSize) {
			this.pagination.current = page
			this.loadContractData()
		},
		onPageSizeChange (current, size) {
			this.pagination.pageSize = size
			this.loadContractData()
		},
		searchHandle2 () {
			this.pagination2.current = 1
			this.loadServiceData()
		},
		onPageChange2 (page, pageSize) {
			this.pagination2.current = page
			this.loadServiceData()
		},
		onPageSizeChange2 (current, size) {
			this.pagination2.pageSize = size
			this.loadServiceData()
		},
		switchTableShow () {
			this.showTable = !this.showTable
			this.iconType = this.showTable ? 'down' : 'up'
		},
		switchTableShow2 () {
			this.showTable2 = !this.showTable2
			this.iconType2 = this.showTable2 ? 'down' : 'up'
		},
		showContModal (contNo) {
			this.selectedContId = contNo
			this.contractModal = true
		},
		showServiceModal (serviceId) {
			this.selectedServiceId = serviceId
			this.serviceModal = true
		},
		// showServiceModal (serviceId) {
		// 	this.selectedContId = contNo
		// 	this.contractModal = true
		// },
		loadContractData () {
			console.log('pageParam===', this.param)
			if (!this.param.sorgCode) return
			let data = {
				page: this.pagination.current,
				limit: this.pagination.pageSize,
				supplierCode: this.param.supplierCode,
				sorgCode: this.param.sorgCode
			}
			this.loading = true
			supApi.queryContractList(data).then(res => {
				console.log(res, 'result')
				this.pageData = res.data
				this.pageData.data.forEach((item, index) => { item.recordIndex = index + 1 })
				this.pagination.total = this.pageData.totalCount
			}).finally(() => {
				this.loading = false
			})
		},
		addContract () {
			// let data = {
			// 	supplierName: this.supplierData.supplierName
			// }
			// Object.assign(data, this.param)
			// console.log(data, 'add Conrace', this.param)
			this.$refs.contractForm.addForm()
		},
		editContract (contNo) {
			let data = {
				supplierName: this.supplierData.supplierName
			}
			Object.assign(data, this.param)
			this.contractModal = true
			this.$refs.contractForm.editForm(contNo, data)
		},
		updateContract () {
			this.searchHandle()
		},
		loadServiceData () {
			console.log('pageParam===', this.param)
			if (!this.param.sorgCode) return
			let data = {
				page: this.pagination2.current,
				limit: this.pagination2.pageSize,
				supplierCode: this.param.supplierCode,
				sorgCode: this.param.sorgCode
			}
			this.loading2 = true
			supApi.queryServiceList(data).then(res => {
				this.pageData2 = res.data
				this.pageData2.data.forEach((item, index) => { item.recordIndex = index + 1 })
				this.pagination2.total = this.pageData2.totalCount
			}).finally(() => {
				this.loading2 = false
			})
		},
		addService () {
			this.$refs.serviceForm.addForm(this.param)
		},
		editService (supServId) {
			this.$refs.serviceForm.editForm(supServId, this.param)
		},
		updateService () {
			this.searchHandle2()
		},
		restoreFormData (obj) {
			if (!obj || !obj.supplierCode) {
				this.selectform.resetFields()
				return
			}
			let data = Object.assign({}, obj)
			console.log('param', this.param)
			// 机构类型为药店，管理机构不可修改
			if (this.param.orgType === '18') {
			  this.disabledOrgCode = true
			} else {
				this.disabledOrgCode = false
			}
			this.$nextTick(() => {
				this.selectform.setFieldsValue(data)
			})
		},
		temp () {
			if (this.selectform.getFieldValue('supplierCode') === undefined || this.selectform.getFieldValue('supplierCode') === '') {
				this.$message.error('请先保存机构信息！')
				return
			}
			this.selectform.validateFields((error, values) => {
				if (error) {
					this.$message.error('表单请填写完整！')
					return
				}
				let formData = Object.assign({}, values)
				let data = {
					sorgCode: this.param.sorgCode,
					supplierData: formData
				}
				supApi.updateSupplierInfo(data).then(res => {
					this.$message.success('保存成功!')
				}).finally(() => {
				})
			})
		},
		next () {
			if (this.selectform.getFieldValue('supplierCode') === undefined || this.selectform.getFieldValue('supplierCode') === '') {
				this.$message.error('请先保存机构信息！')
				return
			}
			if (this.pageData.totalCount === 0) {
				this.$message.error('请填写合约信息！')
				return
			}
			this.$emit('showTabs', ['showTabOrgRela'], true)
			if (this.pageData2.totalCount === 0) {
				let self = this
				this.$confirm({
					title: '确认提示',
					content: '服务信息未添加是否下一步？',
					okType: 'danger',
					onOk () {
						return new Promise((resolve, reject) => {
							self.$emit('showTabs', [], true, '7')
							self.$destroyAll()
						})
					}
				})
			} else {
				this.$emit('showTabs', [], true, '7')
			}
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
