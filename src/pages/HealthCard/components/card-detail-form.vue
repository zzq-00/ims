<template>
  <div>
		<a-modal v-model="formModal" style="top: 30px;" :width="modalWidth" :title="modalTitle">
			<a-form :form="dataForm" :labelCol="dataFormLayout.labelCol" :wrapperCol="dataFormLayout.wrapperCol">
				<a-spin :spinning="spinning"/>

				<a-card style="margin: 24px;">
					<a-row :gutter="16">
						<a-col :span="24">
							<a-row>
								<a-col :span="8">
									<a-form-item label="协议号码">
										<a-input v-decorator="['agreementNo']" :disabled="true" />
									</a-form-item>
								</a-col>
								<a-col :span="8">
									<a-form-item label="参考号码">
										<a-input v-decorator="['businessNo']" :disabled="true"/>
									</a-form-item>
								</a-col>
								<a-col :span="8">
									<a-form-item label="费用来源">
										<a-input v-decorator="['paymentWayName']" :disabled="true"/>
									</a-form-item>
								</a-col>
							</a-row>
						</a-col>
					</a-row>
				</a-card>
				<a-card v-show='perShow' style="margin: 24px;">
					<a-divider orientation="left"><a-icon type="search"/> 个人客户购买信息</a-divider>
					<a-row :gutter="16">
						<a-col :span="24">
							<a-row>
								<a-col :span="8">
									<a-form-item label="客户号码">
										<a-input v-decorator="['custNo']" :disabled="true"/>
									</a-form-item>
								</a-col>
								<a-col :span="8">
									<a-form-item label="客户名称">
										<a-input v-decorator="['customerName']" :disabled="true"/>
									</a-form-item>
								</a-col>
								<a-col :span="8">
									<a-form-item label="性别">
										<a-input v-decorator="['genderName']" :disabled="true"/>
									</a-form-item>
								</a-col>
							</a-row>
							<a-row>
								<a-col :span="8">
									<a-form-item label="证件类型">
										<a-input v-decorator="['certtypeName']" :disabled="true"/>
									</a-form-item>
								</a-col>
								<a-col :span="8">
									<a-form-item label="证件号码">
										<a-input v-decorator="['certno']" :disabled="true"/>
									</a-form-item>
								</a-col>
								<a-col :span="8">
									<a-form-item label="出生日期">
										<a-input v-decorator="['birthDate']" :disabled="true"/>
									</a-form-item>
								</a-col>
							</a-row>
							<a-row>
								<a-col :span="8">
									<a-form-item label="联系电话">
										<a-input v-decorator="['contactTelephone']" :disabled="true"/>
									</a-form-item>
								</a-col>
								<a-col :span="16">
									<a-form-item label="联系地址">
										<a-input v-decorator="['contactAddr']" :disabled="true"/>
									</a-form-item>
								</a-col>
							</a-row>
						</a-col>
					</a-row>
				</a-card>
				<a-card v-show='comShow' style="margin: 24px;">
					<a-divider orientation="left"><a-icon type="search"/> 单位客户购买信息</a-divider>
					<a-row :gutter="16">
						<a-col :span="24">
							<a-row>
								<a-col :span="8">
									<a-form-item label="客户号码">
										<a-input v-decorator="['custNo1']" :disabled="true"/>
									</a-form-item>
								</a-col>
								<a-col :span="8">
									<a-form-item label="客户名称">
										<a-input v-decorator="['customerName1']" :disabled="true"/>
									</a-form-item>
								</a-col>
								<a-col :span="8">
									<a-form-item label="成立日期">
										<a-input v-decorator="['companyEstabDate']" :disabled="true"/>
									</a-form-item>
								</a-col>
							</a-row>
							<a-row>
								<a-col :span="8">
									<a-form-item label="单位性质">
										<a-input v-decorator="['companyProper']" :disabled="true"/>
									</a-form-item>
								</a-col>
								<a-col :span="8">
									<a-form-item label="行业类别">
										<a-input v-decorator="['companyIndustryType']" :disabled="true"/>
									</a-form-item>
								</a-col>
								<a-col :span="8">
									<a-form-item label="联系人">
										<a-input v-decorator="['linkman']" :disabled="true"/>
									</a-form-item>
								</a-col>
							</a-row>
							<a-row>
								<a-col :span="8">
									<a-form-item label="联系电话">
										<a-input v-decorator="['contactTelephone1']" :disabled="true"/>
									</a-form-item>
								</a-col>
								<a-col :span="16">
									<a-form-item label="联系地址">
										<a-input v-decorator="['contactAddr1']" :disabled="true"/>
									</a-form-item>
								</a-col>
							</a-row>

							<a-card style="margin-top:24px;">
								<span href="#" slot="title" style="float:left;"><a-icon type="bank" /> 交费/费用信息</span>
								<a-table :scroll="{ x: 'max-content'}" :bordered="false" :pagination="pagination1" :dataSource="pageData1.data" :columns="columns1" :rowKey="record => record.recordIndex" :indentSize=0 :loading="loading1">
									<span slot="textVal" slot-scope="text, record">{{(text || '-')}}</span>
								</a-table>
							</a-card>

							<a-card style="margin-top:24px;">
								<span href="#" slot="title" style="float:left;"><a-icon type="bank" /> 产品信息</span>
								<a-table :scroll="{ x: 'max-content'}" :bordered="false" :pagination="pagination2" :dataSource="pageData2.data" :columns="columns2" :rowKey="record => record.recordIndex" :indentSize=0 :loading="loading2">
									<span slot="textVal" slot-scope="text, record">{{(text || '-')}}</span>
								</a-table>
							</a-card>

							<a-card style="margin-top:24px;">
								<span href="#" slot="title" style="float:left;"><a-icon type="bank" /> 服务包信息</span>
								<a-table :scroll="{ x: 'max-content'}" :bordered="false" :pagination="pagination3" :dataSource="pageData3.data" :columns="columns3" :rowKey="record => record.recordIndex" :indentSize=0 :loading="loading3">
									<span slot="textVal" slot-scope="text, record">{{(text || '-')}}</span>
								</a-table>
							</a-card>

							<a-card style="margin-top:24px;">
								<span href="#" slot="title" style="float:left;"><a-icon type="bank" /> 服务信息</span>
								<a-table :scroll="{ x: 'max-content'}" :bordered="false" :pagination="pagination4" :dataSource="pageData4.data" :columns="columns4" :rowKey="record => record.recordIndex" :indentSize=0 :loading="loading4">
									<span slot="textVal" slot-scope="text, record">{{(text || '-')}}</span>
								</a-table>
							</a-card>

							<a-card style="margin-top:24px;">
								<span href="#" slot="title" style="float:left;"><a-icon type="bank" /> 协议轨迹</span>
								<a-table :scroll="{ x: 'max-content'}" :bordered="false" :pagination="pagination5" :dataSource="pageData5.data" :columns="columns5" :rowKey="record => record.recordIndex" :indentSize=0 :loading="loading5">
									<span slot="textVal" slot-scope="text, record">{{(text || '-')}}</span>
								</a-table>
							</a-card>

							<a-card style="margin-top:24px;">
								<span href="#" slot="title" style="float:left;"><a-icon type="bank" /> 服务实施</span>
								<a-table :scroll="{ x: 'max-content'}" :bordered="false" :pagination="pagination6" :dataSource="pageData6.data" :columns="columns6" :rowKey="record => record.recordIndex" :indentSize=0 :loading="loading6">
									<span slot="textVal" slot-scope="text, record">{{(text || '-')}}</span>
								</a-table>
							</a-card>

						</a-col>
					</a-row>
				</a-card>
			</a-form>
			<div slot="footer">
				<a-button type="" @click="formModal=false">关闭</a-button>
			</div>
    </a-modal>
  </div>
</template>
<script>
import api from '@/api/api-health-card'
import DicSelect from '@/components/dic-select'

export default {
	name: 'card-detail-form',
	components: { DicSelect },
	data () {
		return {
			dataFormLayout: {
				labelCol: { span: 9 },
				wrapperCol: { span: 15 }
			},
			spinning: false,
			extraParam: {},
			isAdd: true,
			modalWidth: 1270,
			modalTitle: '',
			submitLoading: false,
			formModal: false,
			dataForm: this.$form.createForm(this),
			agreementData: {},
			pageData1: {
				dataCount: 0,
				data: []
			},
			loading1: false,
			columns1: [
				{ title: "序号", dataIndex: "recordIndex" },
				{ title: "收据号", dataIndex: "receiptNo", scopedSlots: { customRender: 'textVal' } },
				{ title: "管理机构", dataIndex: "orgName" },
				{ title: "交费机构", dataIndex: "inputOrgname", scopedSlots: { customRender: 'textVal' } },
				{ title: "费用来源", dataIndex: "paymentWayName" },
				{ title: "交费方式", dataIndex: "payWayName" },
				{ title: "交费金额", dataIndex: "payableAmount" },
				{ title: "交费日期", dataIndex: "paidDate" },
				{ title: "参考号码", dataIndex: "businessNo" }
			],
			pagination1: {
				pageSize: 10,
				current: 1,
				total: 0,
				showTotal: total => `共 ${total} 条数据`,
				showSizeChanger: false,
				onChange: (page, pageSize) => this.onPageChange1(page, pageSize)
			},

			pageData2: {
				dataCount: 0,
				data: []
			},
			loading2: false,
			columns2: [
				{ title: "序号", dataIndex: "recordIndex" },
				{ title: "产品代码", dataIndex: "productCode", scopedSlots: { customRender: 'textVal' } },
				{ title: "产品名称", dataIndex: "productName" },
				{ title: "产品分类", dataIndex: "productTypeName", scopedSlots: { customRender: 'textVal' } },
				{ title: "是否为保险产品覆盖", dataIndex: "yes_noName" },
				{ title: "保险产品", dataIndex: "ins", scopedSlots: { customRender: 'textVal' } }
			],
			pagination2: {
				pageSize: 10,
				current: 1,
				total: 0,
				showTotal: total => `共 ${total} 条数据`,
				showSizeChanger: false,
				onChange: (page, pageSize) => this.onPageChange2(page, pageSize)
			},

			pageData3: {
				dataCount: 0,
				data: []
			},
			loading3: false,
			columns3: [
				{ title: "序号", dataIndex: "recordIndex" },
				{ title: "服务包代码", dataIndex: "servicePackgeCode", scopedSlots: { customRender: 'textVal' } },
				{ title: "服务包名称", dataIndex: "servicePackgeName" },
				{ title: "可选/必选", dataIndex: "serviceOptionName", scopedSlots: { customRender: 'textVal' } },
				{ title: "服务包定价", dataIndex: "servicePackgePrice", scopedSlots: { customRender: 'textVal' } }
			],
			pagination3: {
				pageSize: 10,
				current: 1,
				total: 0,
				showTotal: total => `共 ${total} 条数据`,
				showSizeChanger: false,
				onChange: (page, pageSize) => this.onPageChange3(page, pageSize)
			},

			pageData4: {
				dataCount: 0,
				data: []
			},
			loading4: false,
			columns4: [
				{ title: "序号", dataIndex: "recordIndex" },
				{ title: "服务包代码", dataIndex: "servicePCode", scopedSlots: { customRender: 'textVal' } },
				{ title: "服务包名称", dataIndex: "servicePName" },
				{ title: "服务代码", dataIndex: "serviceCode", scopedSlots: { customRender: 'textVal' } },
				{ title: "服务名称", dataIndex: "serviceName", scopedSlots: { customRender: 'textVal' } },
				{ title: "计费方式", dataIndex: "chargingWayName" },
				{ title: "服务可用额度", dataIndex: "remainingValue", scopedSlots: { customRender: 'textVal' } },
				{ title: "服务可用额度单位", dataIndex: "amountUnitDesc", scopedSlots: { customRender: 'textVal' } },
				{ title: "可选/必选", dataIndex: "serviceOptionName", scopedSlots: { customRender: 'textVal' } },
				{ title: "服务定价", dataIndex: "servicePrice", scopedSlots: { customRender: 'textVal' } },
				{ title: "是否有等待期", dataIndex: "yes_noName", scopedSlots: { customRender: 'textVal' } },
				{ title: "关系", dataIndex: "relation", scopedSlots: { customRender: 'textVal' } }
			],
			pagination4: {
				pageSize: 10,
				current: 1,
				total: 0,
				showTotal: total => `共 ${total} 条数据`,
				showSizeChanger: false,
				onChange: (page, pageSize) => this.onPageChange4(page, pageSize)
			},

			pageData5: {
				dataCount: 0,
				data: []
			},
			loading5: false,
			columns5: [
				{ title: "序号", dataIndex: "recordIndex" },
				{ title: "协议变更号码", dataIndex: "changeNo", scopedSlots: { customRender: 'textVal' } },
				{ title: "变更项目", dataIndex: "changeTypeDesc" },
				{ title: "操作时间", dataIndex: "updateTimeTrack", scopedSlots: { customRender: 'textVal' } },
				{ title: "生效时间", dataIndex: "changeDate", scopedSlots: { customRender: 'textVal' } },
				{ title: "操作人", dataIndex: "updateOperTrack" }
			],
			pagination5: {
				pageSize: 10,
				current: 1,
				total: 0,
				showTotal: total => `共 ${total} 条数据`,
				showSizeChanger: false,
				onChange: (page, pageSize) => this.onPageChange5(page, pageSize)
			},

			pageData6: {
				dataCount: 0,
				data: []
			},
			loading6: false,
			columns6: [
				{ title: "序号", dataIndex: "recordIndex" },
				{ title: "服务代码", dataIndex: "serviceImplemenCode", scopedSlots: { customRender: 'textVal' } },
				{ title: "服务名称", dataIndex: "serviceImplemenName" },
				{ title: "服务管理机构", dataIndex: "serviceOrgName", scopedSlots: { customRender: 'textVal' } },
				{ title: "客户姓名", dataIndex: "consumer", scopedSlots: { customRender: 'textVal' } },
				{ title: "供应商", dataIndex: "suppliername" },
				{ title: "医院", dataIndex: "serviceOrgIdName" },
				{ title: "科室", dataIndex: "serviceDeptName" },
				{ title: "医生/保健专员", dataIndex: "servicerName" },
				{ title: "服务实施日期", dataIndex: "consumeTime" },
				{ title: "费用额度", dataIndex: "consumeAmount" },
				{ title: "消费单位", dataIndex: "consumeAmountUnitName" },
				{ title: "操作日期", dataIndex: "updateTime" },
				{ title: "操作人", dataIndex: "updateOper" }
			],
			pagination6: {
				pageSize: 10,
				current: 1,
				total: 0,
				showTotal: total => `共 ${total} 条数据`,
				showSizeChanger: false,
				onChange: (page, pageSize) => this.onPageChange6(page, pageSize)
			},
			perShow: false,
			comShow: false
		}
	},
	mounted () {

	 },
	methods: {
		addForm (obj) {
			this.extraParam = obj || {}
			this.isAdd = true
			this.modalTitle = '新建健管卡'
			this.formModal = true

			this.$nextTick(() => {
				this.dataForm.resetFields()
				this.dataForm.setFieldsValue({})
			})
		},
		editForm (extraParam) {
			this.extraParam = extraParam || {}
			this.modalTitle = '查看健管卡明细信息'
			this.isAdd = false
			this.formModal = true
			this.spinning = false
			this.loadAgreement()
			this.$nextTick(() => {
				// this.dataForm.resetFields()
				this.dataForm.setFieldsValue(extraParam)
			})
		},
		loadAgreement () {
			let param = {
				cardNo: this.extraParam.cardNo
			}
			api.queryCardDetailAgreement(param).then(res => {
				if (res.data.data) {
					this.agreementData = res.data.data.find(item => item.roleType === '07')
					if (this.agreementData.customerType === "02") {
						this.perShow = false
						this.comShow = true
					}
					if (this.agreementData.customerType === "01") {
						this.perShow = true
						this.comShow = false
					}
					this.dataForm.setFieldsValue(this.agreementData)
				}
				this.loadDetail()
			})
		},
		loadDetail () {
			if (this.agreementData.agreementNo) {
				this.searchPageData1()
				this.searchPageData3()
				this.searchPageData4()
				this.searchPageData5()
				this.searchPageData6()
			}
			if (this.agreementData.productId) {
				this.searchPageData2()
			}
		},
		searchPageData1 () {
			this.pagination1.current = 1
			this.loadPageData1()
		},
		onPageChange1 (page, pageSize) {
			this.pagination1.current = page
			this.loadPageData1()
		},
		loadPageData1 () {
			let data = {
				page: this.pagination1.current,
				limit: this.pagination1.pageSize,
				agreementNo: this.agreementData.agreementNo
			}
			this.loading1 = true
			api.queryCardDetailCostFee(data).then(res => {
				console.log(res, 'result')
				this.pageData1 = res.data || { totalCount: 0, data: [] }
				this.pageData1.data.forEach((item, index) => { item.recordIndex = index + 100 })
				this.pagination1.total = this.pageData1.totalCount
			}).finally(() => {
				this.loading1 = false
			})
		},

		searchPageData2 () {
			this.pagination2.current = 1
			this.loadPageData2()
		},
		onPageChange2 (page, pageSize) {
			this.pagination2.current = page
			this.loadPageData2()
		},
		loadPageData2 () {
			let data = {
				page: this.pagination2.current,
				limit: this.pagination2.pageSize,
				productId: this.agreementData.productId ? this.agreementData.productId : 'null'
			}
			// console.log(this.agreementData.prodcutId)
			this.loading2 = true
			api.queryCardDetailProduct(data).then(res => {
				console.log(res, 'result')
				this.pageData2 = res.data || { totalCount: 0, data: [] }
				this.pageData2.data.forEach((item, index) => { item.recordIndex = index + 200 })
				this.pagination2.total = this.pageData2.totalCount
			}).finally(() => {
				this.loading2 = false
			})
		},

		searchPageData3 () {
			this.pagination3.current = 1
			this.loadPageData3()
		},
		onPageChange3 (page, pageSize) {
			this.pagination3.current = page
			this.loadPageData3()
		},
		loadPageData3 () {
			let data = {
				page: this.pagination3.current,
				limit: this.pagination3.pageSize,
				agreementId: this.agreementData.agreementId
			}
			this.loading3 = true
			api.queryCardDetailServicePackage(data).then(res => {
				console.log(res, 'result3333')
				this.pageData3 = res.data || { totalCount: 0, data: [] }
				this.pageData3.data.forEach((item, index) => { item.recordIndex = index + 300 })
				this.pagination3.total = this.pageData3.totalCount
			}).finally(() => {
				this.loading3 = false
			})
		},

		searchPageData4 () {
			this.pagination4.current = 1
			this.loadPageData4()
		},
		onPageChange4 (page, pageSize) {
			this.pagination4.current = page
			this.loadPageData1()
		},
		loadPageData4 () {
			let data = {
				page: this.pagination4.current,
				limit: this.pagination4.pageSize,
				agreementId: this.agreementData.agreementId
			}
			this.loading4 = true
			api.queryCardDetailService(data).then(res => {
				console.log(res, 'result')
				this.pageData4 = res.data || { totalCount: 0, data: [] }
				this.pageData4.data.forEach((item, index) => { item.recordIndex = index + 400 })
				this.pagination4.total = this.pageData4.totalCount
			}).finally(() => {
				this.loading4 = false
			})
		},

		searchPageData5 () {
			this.pagination5.current = 1
			this.loadPageData5()
		},
		onPageChange5 (page, pageSize) {
			this.pagination5.current = page
			this.loadPageData5()
		},
		loadPageData5 () {
			let data = {
				page: this.pagination5.current,
				limit: this.pagination5.pageSize,
				agreementId: this.agreementData.agreementId
			}
			this.loading5 = true
			api.queryCardDetailAgreementTrack(data).then(res => {
				console.log(res, 'result')
				this.pageData5 = res.data || { totalCount: 0, data: [] }
				this.pageData5.data.forEach((item, index) => { item.recordIndex = index + 500 })
				this.pagination5.total = this.pageData5.totalCount
			}).finally(() => {
				this.loading5 = false
			})
		},

		searchPageData6 () {
			this.pagination6.current = 1
			this.loadPageData6()
		},
		onPageChange6 (page, pageSize) {
			this.pagination6.current = page
			this.loadPageData6()
		},
		loadPageData6 () {
			let data = {
				page: this.pagination6.current,
				limit: this.pagination6.pageSize,
				agreementId: this.agreementData.agreementId
			}
			this.loading6 = true
			api.queryCardDetailServiceImplement(data).then(res => {
				console.log(res, 'result')
				this.pageData6 = res.data || { totalCount: 0, data: [] }
				this.pageData6.data.forEach((item, index) => { item.recordIndex = index + 600 })
				this.pagination6.total = this.pageData6.totalCount
			}).finally(() => {
				this.loading6 = false
			})
		}


	}
}
</script>
<style>

</style>
