<template>
    <div>
        <a-modal v-model="formModal" style="top: 30px;" :width="modalWidth" :title="modalTitle">

            <a-card>
                <a-table :scroll="{ x: 'max-content'}"  :bordered="false" :pagination="pagination" :dataSource="pageData.data" :columns="columns" :rowKey="record => record.recordIndex" :indentSize=0 :loading="loading"
                         :row-selection="{ type: 'radio', selectedRowKeys: selectedRowKeys, onChange: onRowChange }" >
                    <span slot="textVal" slot-scope="text, record">{{text || '-'}}</span>
                    <a-tag slot="yesNo" slot-scope="text, record" :color="text=== '是' ? 'green' : 'orange'">{{text}}</a-tag>
                </a-table>
            </a-card>

            <a-card style="margin-top: 10px;">
                <a-form :form="dataForm" :labelCol="dataFormLayout.labelCol" :wrapperCol="dataFormLayout.wrapperCol">
                    <a-row :gutter="8">
                        <a-col :span="6">
                            <a-form-item label="服务名称">
                                <a-input :disabled="true" :value="extraParam.serviceName" />
                            </a-form-item>
                        </a-col>
                        <a-col :span="6">
                            <a-form-item label="节点">
                                <a-select v-decorator="['applyStatus', {initialValue: '', rules: [{ required: true, message: '请选择节点!' }]}]">
                                    <a-select-option value="02">待分诊</a-select-option>
                                    <a-select-option value="03">待预约</a-select-option>
                                    <a-select-option value="04">待陪诊</a-select-option>
                                    <a-select-option value="05">待次日就诊</a-select-option>
                                    <a-select-option value="06">待服务实施</a-select-option>
                                    <a-select-option value="07">服务实施</a-select-option>
                                    <a-select-option value="08">待回访</a-select-option>
                                    <a-select-option value="09">已回访</a-select-option>
                                    <a-select-option value="10">已取消</a-select-option>
                                    <a-select-option value="11">疑难待处理</a-select-option>
                                    <a-select-option value="12">疑难已处理</a-select-option>
                                </a-select>
                                <a-input :readonly="true" v-decorator="['serviceQueueId']" v-show="false"  />
                            </a-form-item>
                        </a-col>
                    </a-row>

                    <a-divider />

                    <a-row :gutter="8">
                        <a-col :span="8">
                            <a-form-item label="目标类型">
                                <DicSelect dicType="SI_GOAL_TYPE" v-decorator="['allocateType', {initialValue: '', rules: [{ required: true, message: '请选择' }]}]" />
                            </a-form-item>
                        </a-col>
                        <a-col :span="8">
                            <a-form-item label="队列目标">
                                <a-select allowClear :showSearch="showSearch" v-decorator="['queueId', {initialValue: '', rules: [{ required: true, message: '请选择' }]}]" >
                                    <a-select-option v-for="item in queueList" :key="item.queueId" :value="item.queueName">{{item.queueName}}</a-select-option>
                                </a-select>
                            </a-form-item>
                        </a-col>
                        <a-col :span="6">
                            <a-form-item label="申请渠道">
                                <!-- <DicSelect dicType="ST_SYS_NO" v-decorator="['serviceApplyChannel', {initialValue: ''}]" /> -->
								<a-select v-decorator="['serviceApplyChannel', {initialValue: ''}]">
                                    <a-select-option value="19">移动应用</a-select-option>
                                    <a-select-option value="17">电话受理</a-select-option>
                                    <a-select-option value="08">官网</a-select-option>
                                    <a-select-option value="12">健管业务系统</a-select-option>
                                    <a-select-option value="18">管家安排</a-select-option>
                                    <a-select-option value="11">人民网</a-select-option>
                                    <a-select-option value="10">微信</a-select-option>
                                </a-select>
							</a-form-item>
                        </a-col>
                        <a-col :span="8">
                            <a-form-item label="客户类型">
                                <DicSelect dicType="SI_CUST_TYPE" v-decorator="['custType', {initialValue: ''}]" />
                            </a-form-item>
                        </a-col>
                        <a-col :span="8">
                            <a-form-item label="产品名称">
                                <a-select v-decorator="['productCode', {initialValue: ''}]" @change="queryImp(dataForm.getFieldValue('productCode'))" >
                                    <a-select-option   v-for="item in productList" :key="item.productCode" :value="item.productCode"  >{{item.productCode + '-' + item.productName}}</a-select-option>
                                </a-select>
                            </a-form-item>
                        </a-col>
                        <a-col :span="6">
                            <a-form-item label="供应商服务">
                                <a-select v-decorator="['supServCode', {initialValue: ''}]">
                                    <a-select-option v-for="item in supplyServiceList" :key="item.serviceCode" :value="item.serviceCode">{{item.serviceCode + '-' + item.supServName}}</a-select-option>
                                </a-select>
                            </a-form-item>
                        </a-col>
                        <a-col :span="8">
                            <a-form-item label="优先级">
                                <a-input v-decorator="['priority', {initialValue: '', rules: [{ required: true, message: '请输入优先级' }]}]" />
                            </a-form-item>
                        </a-col>
                        <a-col :span="8">
                            <a-form-item label="产品服务实施类型">
                                <DicSelect :disabled="dataForm.serviceQueueId"  dicType="IMPL_TYPE_1" v-decorator="['implementType', {initialValue: ''}]" />
                            </a-form-item>
                        </a-col>
                        <a-col :span="6">
                            <a-form-item label="服务商名称">
                                <a-input-search :readonly="true" v-decorator="['providerName']" enter-button @search="onSearchServiceProvider" />
                                <a-input :readonly="true" v-decorator="['providerCode']" v-show="false"  />
                            </a-form-item>
                        </a-col>
                        <a-col :span="8">
                            <a-form-item label="服务商类型">
                                <DicSelect dicType="SUPPLIER_SUB_TYPE" :disabled="disableDsupliler" v-decorator="['providerType', {initialValue: ''}]" />
                            </a-form-item>
                        </a-col>
                        <a-col :span="8">
                            <a-form-item label="服务商所在省">
                                <AddressSelect dicType="0" :disabled="disableDsupliler" v-decorator="['province', {initialValue: ''}]" />
                            </a-form-item>
                        </a-col>
                        <a-col :span="6">
                            <a-form-item label="服务商所在市">
                                <AddressSelect :dicType="this.dataForm.getFieldValue('province')" :disabled="disableDsupliler" v-decorator="['city', {initialValue: ''}]" />
                            </a-form-item>
                        </a-col>
                        <a-col :span="8">
                            <a-form-item label="自建签约机构">
                                <OrgSelect dicType="4" :disabled="disableDsupliler" v-decorator="['orgCode',{initialValue: ''}]"/>
                            </a-form-item>
                        </a-col>
                        <a-col :span="8">
                            <a-form-item label="项目名称">
                                <a-select :showSearch="showSearch" v-decorator="['itemCode', {initialValue: ''}]">
                                    <a-select-option v-for="item in itemList" :key="item.itemCode" :value="item.itemCode">{{item.itemCode + '-' + item.itemName}}</a-select-option>
                                </a-select>
                            </a-form-item>
                        </a-col>
                        <a-col :span="6">
                            <a-form-item label="当前状态">
                                <DicSelect :disabled="InvalidFlag" dicType="SI_FLOW_STATUS" v-decorator="['serviceQueueStatus', {initialValue: '01', rules: [{ required: true, message: '请选择' }]}]" />
                            </a-form-item>
                        </a-col>
                    </a-row>
                </a-form>

                <div style="marign-top: 10px;margin-left: 80%;">
                    <a-button type="" @click="resetDataForm">重置</a-button>
                    <a-button :loading="submitLoading" @click="submitForm('00')" type="primary">保存</a-button>
                </div>
            </a-card>

            <div slot="footer">
                <a-button type="" @click="formModal=false">返回</a-button>
            </div>
        </a-modal>

        <ProviderSelectModal ref="providerSelectModal" @on-update="selectProviderHandle" />
    </div>
</template>
<script>
import api from '@/api/api-process-config'
import DicSelect from '@/components/dic-select'
import OrgSelect from "@/components/org-select"
import AddressSelect from '@/components/address-select'
import ProviderSelectModal from './provider-select-modal'
export default {
	name: 'queue-config-form',
	props: {
		showSearch: {
			type: Boolean,
			default () {
				return true
			}
		}
	},
	components: { DicSelect, AddressSelect, OrgSelect, ProviderSelectModal },
	data () {
		return {
			disableDsupliler: false,
			InvalidFlag: true,
			pageData: {
				dataCount: 0,
				data: []
			},
			selectedRows: [],
			selectedRowKeys: [],
			loading: false,
			columns: [
				{ title: "序号", dataIndex: "recordIndex" },
				{ title: "服务名称", dataIndex: "serviceName" },
				{ title: "流程节点", dataIndex: "applyStatusDesc" },
				{ title: "队列名称", dataIndex: "queueName" },
				{ title: "申请渠道", dataIndex: "serviceApplyChannelDesc", scopedSlots: { customRender: "textVal" } },
				{ title: "产品服务实施类型", dataIndex: "implementTypeDesc", scopedSlots: { customRender: "textVal" } },
				{ title: "产品名称", dataIndex: "productName", scopedSlots: { customRender: "textVal" } },
				{ title: "服务商类型", dataIndex: "providerTypeDesc", scopedSlots: { customRender: "textVal" } },
				{ title: "服务商名称", dataIndex: "providerName", scopedSlots: { customRender: "textVal" } },
				{ title: "自建签约机构", dataIndex: "orgCodeStr", scopedSlots: { customRender: "textVal" } },
				{ title: "服务商所在省", dataIndex: "provinceName", scopedSlots: { customRender: "textVal" } },
				{ title: "服务商所在市", dataIndex: "cityName", scopedSlots: { customRender: "textVal" } },
				{ title: "项目名称", dataIndex: "itemObj", scopedSlots: { customRender: "textVal" } },
				{ title: "优先级", dataIndex: "priority" },
				{ title: "当前状态", dataIndex: "serviceQueueStatusDesc" }
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

			dataFormLayout: {
				labelCol: { span: 8 },
				wrapperCol: { span: 16 }
			},
			spinning: false,
			extraParam: {},
			readonly: true,

			modalWidth: 1270,
			modalTitle: '',
			submitLoading: false,
			formModal: false,
			dataForm: this.$form.createForm(this),

			productList: [],
			queueList: [],
			supplyServiceList: [],
			itemList: []
		}
	},
	mounted () {
		this.loadItemList()
		this.loadQueueList()
	},
	methods: {
		queryImp (productCode) {
			console.log(this.dataForm.serviceQueueId, '------------')
		  if (productCode) {
			  api.queueQueryImplType({"productCode": productCode}).then(res => {
					if (res.data == null) {
						this.dataForm.serviceQueueId = true
					}
				})
		  }
		},

		onRowChange (selectedRowKeys, selectedRows) {
			this.selectedRowKeys = selectedRowKeys || []
			this.selectedRows = selectedRows
			this.InvalidFlag = false // 设置发布状态可编辑啊啊啊啊啊啊啊啊啊啊啊啊困死了
			// 为了支持目标队列的中文模糊查询，该控件的key value取反；防止引用传递进行变量拷贝
			let tRows = Object.assign({}, this.selectedRows[0])
			let tmp = tRows.queueId
			tRows.queueId = tRows.queueName
			tRows.queueName = tmp
			this.fillFrom(tRows)
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
			this.InvalidFlag = true
			this.selectedRows = []
			this.selectedRowKeys = []
			let data = {
				page: this.pagination.current,
				limit: this.pagination.pageSize,
				WorkQueueVo: {serviceCode: this.extraParam.serviceCode}
			}
			this.loading = true
			api.queryAllQueueServiceFlow(data).then(res => {
				console.log(res, "result")
				res = {
					data: res.data.rows,
					totalCount: res.data.total
				}
				this.pageData = res || { totalCount: 0, data: [] }
				this.pageData.data.forEach((item, index) => {
					item.recordIndex = index + 1
				})
				this.pagination.total = this.pageData.totalCount
			}).finally(() => {
				this.loading = false
			})
		},
		filterOptionQueue (input, option) {
			return (
				option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
			)
		},
		loadItemList () {
			api.initItemServiceFlow({id: 'id'}).then(res => {
				this.itemList = res.data || []
			})
		},
		loadSupplyServiceList () {
			if (!this.extraParam.serviceCode) return
			api.initSupSerServiceFlow({serviceCode: this.extraParam.serviceCode}).then(res => {
				this.supplyServiceList = res.data.supSrevL || []
			})
		},
		loadProductList () {
			if (!this.extraParam.serviceCode) return
			api.initProductServiceFlow({serviceCode: this.extraParam.serviceCode}).then(res => {
				this.productList = res.data.data || []
			})
		},
		loadQueueList () {
			api.initQueueServiceFlow({id: null}).then(res => {
				this.queueList = res.data.data || []
			})
		},
		onSearchServiceProvider () {
			console.log(this.extraParam)
			this.extraParam.productCode = this.dataForm.getFieldValue('productCode')
			let item = this.productList.find(item => item.productCode === this.extraParam.productCode)
			if (item) this.extraParam.productName = item.productName
			this.$refs.providerSelectModal.show(this.extraParam)
		},
		selectProviderHandle (obj) {
			this.dataForm.setFieldsValue({
				providerName: obj.sorgName,
				providerCode: obj.sorgCode,
				providerType: obj.orgType,
				province: obj.orgPrivince,
				city: obj.orgCity
			})
			this.queryOrg(obj)
			this.disableDsupliler = true
		},
		queryOrg (obj) {
			let data = {
				sorgCode: obj.sorgCode,
				sorgName: obj.sorgName
			}
			api.queryOrg(data).then(res => {
				this.dataForm.setFieldsValue({
					orgCode: res.data
				})
			})
		},
		productChange (selVal) {
			console.log(this.productCode)
			console.log(selVal)
		},
		fillFrom (itemObj) {
			this.dataForm.resetFields()
			this.$nextTick(() => {
				this.dataForm.setFieldsValue(itemObj)
			})
		},
		resetDataForm () {
			this.dataForm.resetFields()
		},
		editForm (extraParam, readonly) {
			this.extraParam = extraParam || {}
			this.modalTitle = '服务队列分配配置'
			this.readonly = false
			if (readonly) {
				this.readonly = true
				this.modalTitle = '查看服务队列分配配置'
			}
			this.formModal = true
			this.spinning = false
			this.dataForm.resetFields()

			this.loadProductList()
			this.loadSupplyServiceList()
			this.searchHandle()
		},
		submitForm () {
			this.dataForm.validateFields((error, values) => {
				if (error) {
					return
				}
				let formData = Object.assign({}, values)
				let data = {
					serviceCode: this.extraParam.serviceCode,
					serviceName: this.extraParam.serviceName
				}

				if (formData.productCode) {
					let item = this.productList.find(item => item.productCode === formData.productCode)
					if (item) formData.productName = item.productName
				}
				if (formData.queueId) {
					// 为了支持【目标队列】的中文模糊查询，此处的queueId被迫获取成了queueName，需要逆向转码
					formData.queueName = formData.queueId
					let tQueueItem = this.queueList.find(item => item.queueName === formData.queueName)
					if (tQueueItem) formData.queueId = tQueueItem.queueId
					console.log('queueId', formData.queueId)
					console.log('queueName', formData.queueName)
				}
				if (formData.itemCode) {
					let item = this.itemList.find(item => item.itemCode === formData.itemCode)
					if (item) formData.itemName = item.itemName
				}
				Object.assign(data, formData)

				this.submitLoading = true
				if (data.serviceQueueId) {
					api.updOrderInfoServiceFlow(data).then(res => {
						this.$message.success('保存成功!')
						this.$emit('on-update')
						this.resetDataForm()
						this.searchHandle()
					}).finally(() => {
						this.submitLoading = false
					})
				} else {
					api.addInfoServiceFlow(data).then(res => {
						this.$message.success('保存成功!')
						this.$emit('on-update')
						this.resetDataForm()
						this.searchHandle()
					}).finally(() => {
						this.submitLoading = false
					})
				}
			})
		}
	}
}
</script>
<style>

</style>
