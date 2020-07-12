<template>
  <div>
		<a-modal v-model="formModal" style="top: 30px;" :width="modalWidth" title="第三方询价">
			<a-card>
				<a-form :form="filterForm" :labelCol="filterFormLayout.labelCol" :wrapperCol="filterFormLayout.wrapperCol">
					<a-row :gutter="16">
						<a-col :span="6">
							<a-form-item label="产品名称">
								<a-input   v-decorator="['productName']" :disabled="true"/>
							</a-form-item>
						</a-col>
						<a-col :span="6">
							<a-form-item label="服务名称">
								<a-input   v-decorator="['serviceName']" :disabled="true" />
							</a-form-item>
						</a-col>
						<a-col :span="6">
							<a-form-item label="所在省">
								<AddressSelect dicType="0" v-decorator="['orgPrivince']" />
							</a-form-item>
						</a-col>
						<a-col :span="6">
							<a-form-item label="供应商名称">
								<a-input v-decorator="['sorgCodeName']" />
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

			<a-card>
				<a-table :bordered="false" :pagination="pagination" :dataSource="pageData.data" :columns="columns" :rowKey="record => record.recordIndex" :indentSize=0 :loading="loading"
					:row-selection="{ type: 'checkbox', selectedRowKeys: selectedRowKeys, onChange: onRowChange }">
					 <a slot="agreePrice" @click="clickDetail(record)" slot-scope="text, record">{{text}}</a>
				</a-table>
			</a-card>
			<a-card v-show="detailFlag">
				<a-table :pagination=false :bordered="false" :dataSource="pageData1.data" :columns="columns1" >
				</a-table>
			</a-card>

			<div slot="footer">
				<!-- <a-button type="" @click="formModal=false">取消</a-button> -->
				<a-button type="primary" @click="submitForm">下一步</a-button>
			</div>
    </a-modal>
  </div>
</template>
<script>
import api from '@/api/api-serve-apply'
import AddressSelect from '@/components/address-select'
export default {
	name: 'three-select-modal',
	components: { AddressSelect },
	data () {
		return {
			// 查询条件
			filterFormLayout: {
				labelCol: { span: 9 },
				wrapperCol: { span: 15 }
			},
			extraParams: {},
			formModal: false,
			detailFlag: false,
			modalWidth: 1470,
			pageData: {
				dataCount: 0,
				data: []
			},
			pageData1: {
				dataCount: 0,
				data: []
			},
			filterForm: this.$form.createForm(this),
			selectedRows: [],
			selectedRowKeys: [],
			loading: false,
			columns: [
				{ title: "序号", dataIndex: "recordIndex" },
				{ title: "名称", dataIndex: "supplierName" },
				{ title: "协议价格", dataIndex: "agreePrice", width: 250, scopedSlots: { customRender: 'agreePrice' } },
				{ title: "联系人", dataIndex: "supplierLinkman" },
				{ title: "联系电话", dataIndex: "supplierTel" },
				{ title: "邮箱", dataIndex: "supplierZipcode" },
				{ title: "总询价次数", dataIndex: "enquiryNumber" },
				{ title: "总选择次数", dataIndex: "supplierEnquiryNumber" },
				{ title: "成功率", dataIndex: "successRate" },
				{ title: "平均反馈时间(小时)", dataIndex: "averageFeedbackTime", width: 100 },
				{ title: "平均反馈价格", dataIndex: "averagePrice", width: 100 }
			],
			columns1: [
				{ title: "序号", dataIndex: "recordIndex" },
				{ title: "第三方名称", dataIndex: "supplierName" },
				{ title: "供应商服务名称", dataIndex: "supServName" },
				{ title: "协议价格", dataIndex: "agreePrice" }
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
					limit: this.pagination.pageSize,
					sorgCode: this.extraParams.merchantcode,
					sorgCodeName: values.sorgCodeName || '',
					orgprovince: values.orgPrivince || '',
					productCode: this.extraParams.productCode,
					serviceCode: this.extraParams.serviceCode
				}
				this.loading = true
				api.selEnquiry(data).then(res => {
					console.log(res, 'result')
					let pageData = {
						totalCount: res.data.total,
						data: res.data.rows
					}
					this.pageData = pageData || { totalCount: 0, data: [] }
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


		show (extraParams) {
			this.selectedRowKeys = []
			this.selectedRows = []
			this.detailFlag = false
			let self = this
			self.formModal = true
			setTimeout(function () {
				self.extraParams = extraParams || {}
				self.filterForm.resetFields()

				self.filterForm.setFieldsValue({
					productName: self.extraParams.productName,
					serviceName: self.extraParams.serviceName
				})
				self.searchHandle()
			}, 50)
		},
		submitForm () {
			if (this.selectedRows.length) {
				this.$emit('on-update', this.selectedRows)
				this.formModal = false
			} else {
				this.$message.warning('请选择一条数据')
			}
		},
		clickDetail (record) {
			this.detailFlag = true
			let param = {
				supplierCode: record.supplierCode,
				sorgCode: this.extraParams.merchantcode,
				sorgCodeName: '', // 置空，别问，问就是没值
				orgprovince: record.orgprovince,
				productCode: this.extraParams.productCode,
				serviceCode: this.extraParams.serviceCode
			}
			// this.pageData1.data = [{"serviceReservationId": null, "supplierName": "北京寰宇医道科技有限公司", "supplierCode": "S11000409", "price": null, "supplierLinkman": null, "supplierTel": null, "supplierZipcode": null, "enquiryTime": null, "enquiryTimeDesc": null, "enquiryTimeDay": null, "enquiryStartTime": null, "enquiryEndTime": null, "ordinaryPrice": null, "specialPrice": null, "internationalPrice": null, "feedbackTime": null, "feedbackTimeDesc": null, "feedbackTimeDay": null, "productCode": null, "serviceCode": null, "flag": null, "reason": null, "sorgCode": null, "sorgName": null, "deptCode": null, "deptName": null, "enquiryNumber": null, "supplierEnquiryNumber": null, "successRate": null, "averageFeedbackTime": null, "averagePrice": null, "orgCode": "86", "orgName": null, "province": "110000", "provinceName": null, "city": "110100", "cityName": null, "insertOper": null, "insertTime": null, "updateOper": null, "updateTime": null, "state": null, "finalChoose": null, "consumeDate": null, "orgPrivince": null, "orgPrivinceDesc": null, "orgCity": null, "orgCityDesc": null, "sorgEmail": null, "maxSettleCost": "20000", "minSettleCost": "500", "otherPrice": null, "specPrice": null, "agreePrice": "最高价格:20000,最低价格:500", "supServName": "专家门诊挂号服务"}, {"serviceReservationId": null, "supplierName": "北京寰宇医道科技有限公司", "supplierCode": "S11000409", "price": null, "supplierLinkman": null, "supplierTel": null, "supplierZipcode": null, "enquiryTime": null, "enquiryTimeDesc": null, "enquiryTimeDay": null, "enquiryStartTime": null, "enquiryEndTime": null, "ordinaryPrice": null, "specialPrice": null, "internationalPrice": null, "feedbackTime": null, "feedbackTimeDesc": null, "feedbackTimeDay": null, "productCode": null, "serviceCode": null, "flag": null, "reason": null, "sorgCode": null, "sorgName": null, "deptCode": null, "deptName": null, "enquiryNumber": null, "supplierEnquiryNumber": null, "successRate": null, "averageFeedbackTime": null, "averagePrice": null, "orgCode": "86", "orgName": null, "province": "110000", "provinceName": null, "city": "110100", "cityName": null, "insertOper": null, "insertTime": null, "updateOper": null, "updateTime": null, "state": null, "finalChoose": null, "consumeDate": null, "orgPrivince": null, "orgPrivinceDesc": null, "orgCity": null, "orgCityDesc": null, "sorgEmail": null, "maxSettleCost": "20000", "minSettleCost": "500", "otherPrice": null, "specPrice": "10250", "agreePrice": "最高价格:20000,最低价格:500,固定价格:10250", "supServName": "专家门诊挂号服务"}]
			// this.pageData1.data.forEach((item, index) => { item.recordIndex = index + 1 })
			api.selEnquiryInfo(param).then(res => {
				this.pageData1.data = res.data.rows
				this.pageData1.data.forEach((item, index) => { item.recordIndex = index + 1 })
			})
		}
	}
}
</script>
