<template>
    <div>
        <a-modal v-model="formModal" style="top: 30px;" :width="modalWidth" :title="modalTitle">
            <a-form :form="dataForm" :labelCol="dataFormLayout.labelCol" :wrapperCol="dataFormLayout.wrapperCol">
                <div style="margin-left: 40%;width: 300px;">
                    <a-steps :current="stepIndex">
                        <a-step title="验证健管卡" description=""/>
                        <a-step title="提交服务请求" description=""/>
                    </a-steps>
                </div>
                <a-card style="margin: 24px;" v-if="stepIndex === 0">
                    <a-row :gutter="16">
                        <a-col :span="24">
                            <a-row>
                                <a-col :span="12">
                                    <a-form-item label="业务发展类型">
                                        <a-select
                                                v-decorator="['orgName', {initialValue: '01', rules: [{ required: true, message: '业务发展类型不能为空!' }]}]">
                                            <a-select-option value="01">普通总公司业务</a-select-option>
                                        </a-select>
                                    </a-form-item>
                                </a-col>
                                <a-col :span="12">
                                    <a-form-item label="业务号类型">
                                        <a-select
                                                v-decorator="['noType', {initialValue: '02', rules: [{ required: true, message: '业务号类型不能为空!' }]}]">
                                            <a-select-option value="02">服务卡号码</a-select-option>
                                            <a-select-option value="03">保单号</a-select-option>
                                        </a-select>
                                    </a-form-item>
                                </a-col>
                            </a-row>
                            <a-divider/>
                            <p>说明：若为健管卡或服务卡，需录入卡号和密码；若为商保保单，需录入保单号。 </p>
                            <br>
                            <a-row v-if="dataForm.getFieldsValue().noType === '03'">
                                <a-col :span="12">
                                    <a-form-item label="保单号">
                                        <a-input
                                                v-decorator="['policyNo', {rules: [{ required: true, message: '保单号不能为空!' }]}]"/>
                                    </a-form-item>
                                </a-col>
                            </a-row>
                            <a-row v-if="dataForm.getFieldsValue().noType === '02'">
                                <a-col :span="12">
                                    <a-form-item label="卡号">
                                        <a-input
                                                v-decorator="['cardNo', {rules: [{ required: true, message: '卡号不能为空!' }]}]"/>
                                    </a-form-item>
                                </a-col>
                                <a-col :span="12">
                                    <a-form-item label="卡密">
                                        <a-input
                                                v-decorator="['clearText', {rules: [{ required: true, message: '卡密不能为空!' }]}]"/>
                                    </a-form-item>
                                </a-col>
                            </a-row>
                        </a-col>
                    </a-row>
                </a-card>

                <div style="margin: 24px;" v-if="stepIndex === 1">
                    <a-card>
                        <h4>持卡人信息</h4>
                        <a-row :gutter="16">
                            <a-col :span="24">
                                <a-row>
                                    <a-col :span="6">
                                        <a-form-item label="客户姓名">
                                            <a-input :readOnly="true" :value="customerInfo.customerName"/>
                                        </a-form-item>
                                    </a-col>
                                    <a-col :span="6">
                                        <a-form-item label="客户性别">
                                            <a-input :readOnly="true" :value="customerInfo.genderName"/>
                                        </a-form-item>
                                    </a-col>
                                    <a-col :span="6">
                                        <a-form-item label="出生日期">
                                            <a-input :readOnly="true" :value="customerInfo.birthDate"/>
                                        </a-form-item>
                                    </a-col>
                                    <a-col :span="6">
                                        <a-form-item label="联系电话">
                                            <a-input :readOnly="true" :value="customerInfo.contactTelephone"/>
                                        </a-form-item>
                                    </a-col>
                                </a-row>
                                <a-row>
                                    <a-col :span="6">
                                        <a-form-item label="证件类型">
                                            <a-input :readOnly="true" :value="customerInfo.certtypeName"/>
                                        </a-form-item>
                                    </a-col>
                                    <a-col :span="6">
                                        <a-form-item label="证件号码">
                                            <a-input :readOnly="true" :value="customerInfo.certno"/>
                                        </a-form-item>
                                    </a-col>
                                </a-row>
                            </a-col>
                        </a-row>

                        <h4>请选择产品服务</h4>
                        <a-table :bordered="false" :pagination="pagination1" :dataSource="pageData1.data"
                                 :columns="columns1" :rowKey="record => record.recordIndex" :indentSize="0"
                                 :loading="loading1"
                                 :row-selection="{ type: 'radio', selectedRowKeys: selectedRowKeys1, onChange: onRowChange1 }">
                            <span slot="textVal" slot-scope="text, record">{{ text || '-' }}</span>
                        </a-table>
                        <a-row>
                            <a-col :span="24">
                                <a-form-item label="有效期至" labelAlign="left" :labelCol="{span: 3}">
                                    <a-input :disabled="true" :value="selectedServiceInfo.endDate"/>
                                </a-form-item>
                            </a-col>
                            <a-col :span="24">
                                <a-form-item label="限制标记" labelAlign="left" :labelCol="{span: 3}">
                                    <a-input :disabled="true" :value="selectedServiceInfo.limitTypeDesc"/>
                                </a-form-item>
                            </a-col>
                            <a-col :span="24">
                                <a-form-item label="产品描述" labelAlign="left" :labelCol="{span: 3}">
                                    <a-textarea :autosize="{ minRows: 2, maxRows: 6 }"
                                                :value="selectedServiceInfo.proDetail" :disabled="true"/>
                                </a-form-item>
                            </a-col>
                        </a-row>
                    </a-card>

                    <a-card style="margin-top: 10px;">
                        <h4>既往使用人列表</h4>
                        <a-table :bordered="false" :pagination="pagination2" :dataSource="pageData2.data"
                                 :columns="columns2" :rowKey="record => record.recordIndex" :indentSize="0"
                                 :loading="loading2"
                                 :row-selection="{ type: 'radio', selectedRowKeys: selectedRowKeys2, onChange: onRowChange2 }">
                            <span slot="textVal" slot-scope="text, record">{{ text || '-' }}</span>
                        </a-table>
                    </a-card>

                    <a-card style="margin-top: 10px;">
                        <h4>新建或更新使用人信息</h4>
                        <a-row :gutter="16">
                            <a-col :span="24">
                                <a-row>
                                    <a-col :span="6">
                                        <a-form-item label="使用人姓名">
                                            <a-input
                                                    v-decorator="['patientName', {rules: [{ required: true, message: '使用人姓名不能为空!' }]}]"/>
                                        </a-form-item>
                                    </a-col>
                                    <a-col :span="6">
                                        <a-form-item label="证件类型">
                                            <DicSelect dicType="CERTI_TYPE"
                                                       v-decorator="['patientCerttype', {rules: [{ required: true, message: '证件类型不能为空!' }]}]"/>
                                        </a-form-item>
                                    </a-col>
                                    <a-col :span="6">
                                        <a-form-item label="证件号码">
                                            <a-input @blur="doBlur"
                                                    v-decorator="['patientCertno', {rules: [{ required: true, message: '证件号码不能为空!' }]}]"/>
                                        </a-form-item>
                                    </a-col>
                                    <a-col :span="6">
                                        <a-form-item label="使用人性别">
                                            <DicSelect dicType="GENDER"
                                                       v-decorator="['patientGender', {rules: [{ required: true, message: '使用人性别不能为空!' }]}]"/>
                                        </a-form-item>
                                    </a-col>
                                </a-row>
                                <a-row>
                                    <a-col :span="6">
                                        <a-form-item label="出生日期">
                                            <a-date-picker @change="handleChange"
                                                           v-decorator="['patientBirthDate', { initialValue: null, rules: [{ required: true, message: '出生日期不能为空!' }] }]"
                                                           format="YYYY-MM-DD"/>
                                        </a-form-item>
                                    </a-col>
                                    <a-col :span="6">
                                        <a-form-item label="手机号码">
                                            <a-input
                                                    v-decorator="['patientTelephone', {rules: [{ required: true, message: '手机号码不能为空!' }]}]"/>
                                        </a-form-item>
                                    </a-col>
                                    <a-col :span="6">
                                        <a-form-item label="所在省">
                                            <AddressSelect dicType="0" placeholder="请选择所在省"
                                                           v-decorator="['patientProvince', {initialValue: ''}]"/>
                                        </a-form-item>
                                    </a-col>
                                    <a-col :span="6">
                                        <a-form-item label="所在市">
                                            <AddressSelect :dicType="dataForm.getFieldValue('patientProvince')"
                                                           placeholder="请选择所在市"
                                                           v-decorator="['patientCity', {initialValue: ''}]"/>
                                        </a-form-item>
                                    </a-col>
                                </a-row>
                                <a-row>
                                    <a-col :span="6">
                                        <a-form-item label="电话号码">
                                            <a-input v-decorator="['patientTelephoneSpare']"/>
                                        </a-form-item>
                                    </a-col>
                                    <a-col :span="12">
                                        <a-form-item label="详细地址" :labelCol="{span: 5}">
                                            <a-input v-decorator="['patientAddress']"/>
                                        </a-form-item>
                                    </a-col>
                                </a-row>
                            </a-col>
                        </a-row>

                        <h4>新建联系人/监护人</h4>
                        <a-row :gutter="16">
                            <a-col :span="24">
                                <!-- 监护人信息 -->
                                <a-row >
                                    <a-col :span="6">
                                        <a-form-item label="姓名">
                                            <a-input
                                                    v-decorator="['linkmanName', {rules: [{ required: isChild, message: '姓名不能为空!' }]}]"/>
                                        </a-form-item>
                                    </a-col>
                                    <a-col :span="6">
                                        <a-form-item label="证件类型">
                                            <DicSelect dicType="CERTI_TYPE"
                                                       v-decorator="['linkmanCerttype',{rules: [{ required: isChild, message: '证件类型不能为空!' }]}]"/>
                                        </a-form-item>
                                    </a-col>
                                    <a-col :span="6">
                                        <a-form-item label="证件号码">
                                            <a-input
                                                    v-decorator="['linkmanCertno', {rules: [{ required: isChild, message: '证件号码不能为空!' }]}]"/>
                                        </a-form-item>
                                    </a-col>
                                    <a-col :span="6">
                                        <a-form-item label="手机号码">
                                            <a-input
                                                    v-decorator="['linkmanPhone', {rules: [{ required: isChild, message: '手机号码不能为空!' }]}]"/>
                                        </a-form-item>
                                    </a-col>
                                </a-row>

                                <a-row>
                                    <a-col :span="19">
                                        <a-form-item label="主要疾病或症状" :labelCol="{span: 3}">
                                            <a-input
                                                    v-decorator="['disease', {rules: [{ required: true, message: '主要疾病或症状不能为空!' }]}]"/>
                                        </a-form-item>
                                    </a-col>
                                </a-row>
                                <a-row>
                                    <a-col :span="19">
                                        <a-form-item label="具体描述" :labelCol="{span: 3}">
                                            <a-textarea v-decorator="['detailedDescription']"
                                                        :autosize="{ minRows: 3, maxRows: 6 }"
                                                        placeholder="1.客户因为该疾病或症状去过哪些，什么科室就诊?什么诊断?2.本次服务预约希望解决的问题是什么?3.其他需要备注的信息"/>
                                        </a-form-item>
                                    </a-col>
                                </a-row>

                                <a-row>
                                    <a-col :span="19">
                                        <a-form-item label="医疗机构" :labelCol="{span: 3}">
                                            <a-input-search :readOnly="true"
                                                            v-decorator="['merchantName', {rules: [{ required: true, message: '医疗机构不能为空!' }]}]"
                                                            enter-button @search="onSearchSorg"/>
                                        </a-form-item>
                                    </a-col>
                                </a-row>
                                <a-row>
                                    <a-col :span="19">
                                        <a-form-item label="期望医生" :labelCol="{span: 3}">
                                            <a-input v-decorator="['resmedDoctorName', {}]"/>
                                        </a-form-item>
                                    </a-col>
								</a-row>
								<a-row>
                                    <a-col :span="10">
                                        <a-form-item label="是否需要特需门诊" :labelCol="{span: 8}">
                                            <DicSelect dicType="YES_NO"
                                                       v-decorator="['specialFlag', {initialValue: 'N', rules: [{ required: true, message: '不能为空!' }]}]"/>
                                        </a-form-item>
                                    </a-col>
                                    <a-col :span="10">
                                        <a-form-item label="是否有所在地医保卡" :labelCol="{span: 8}">
                                            <DicSelect width="{span: 8}" dicType="YES_NO"
                                                       v-decorator="['medicareFlag', {initialValue: 'N', rules: [{ required: true, message: '不能为空!' }]}]"/>
                                        </a-form-item>
                                    </a-col>
                                    <a-col :span="10">
                                        <a-form-item label="期望就诊时间" :labelCol="{span: 8}">
                                            <DicSelect :span="80" dicType="RESMED_DATE_TYPE"
                                                       v-decorator="['resmedDateType', {rules: [{ required: true, message: '不能为空!' }]}]" @change="resmedDateTypeChange"/>
                                        </a-form-item>
                                    </a-col>
                                </a-row>
                                <a-row v-if="dataForm.getFieldsValue().merchantName">
                                    <a-col :span="10" v-show="!contTypeflag">
                                        <a-form-item label="指定就诊时间" :labelCol="{span: 8}">
                                            <a-select v-decorator="['resmedDates']" mode="multiple" :minLength="2"
                                                      :disabled="dataForm.getFieldsValue().resmedDateType === '1'" @blur="resmedDateCheck">
                                                <a-select-option v-for="item in applyDateList" :key="item"
                                                                 :value="item">{{item}}
                                                </a-select-option>
                                            </a-select>
                                        </a-form-item>
                                    </a-col>
                                    <a-col :span="10" v-show="!contTypeflag">
                                        <a-form-item label="不方便就诊时间" :labelCol="{span: 8}">
                                            <a-select v-decorator="['notResmedDates']" mode="multiple" :maxLength="2"
                                                      :disabled="dataForm.getFieldsValue().resmedDateType === '2'" @blur="notResmedDateCheck">
                                                <a-select-option v-for="item in applyDateList" :key="item"
                                                                 :value="item">{{item}}
                                                </a-select-option>
                                            </a-select>
                                        </a-form-item>
                                    </a-col>
                                    <a-col :span="10" v-show="contTypeflag" >
                                        <a-form-item label="健管中心预约时间" :labelCol="{span: 8}">
                                            <a-select v-decorator="['jgResmedDates', {rules: [{ required: contTypeflag, message: '健管中心预约时间不能为空!' }]}]" mode="default" :maxLength="2" :span="14">
                                                <a-select-option v-for="item in applyDateList" :key="item"
                                                                 :value="item">{{item}}
                                                </a-select-option>
                                            </a-select>
                                        </a-form-item>
                                    </a-col>
                                </a-row>
                                <a-row>
                                    <a-col :span="19">
                                        <a-form-item label="就诊卡号" :labelCol="{span: 3}">
                                            <a-input
                                                    v-decorator="['medredCardno', {rules: [{ required: false, message: '保单号不能为空!' }]}]"/>
                                        </a-form-item>
                                    </a-col>
                                </a-row>
                                <h4>1）特需门诊挂号费在150-800元间，每个机构每个医生不同。2）儿研所只有特需门诊,儿童机构需要提前自行办理机构就诊卡</h4>

                            </a-col>
                        </a-row>
                    </a-card>

                </div>

            </a-form>
            <div slot="footer">
                <a-button type="" @click="formModal=false">取消</a-button>
                <a-button v-if="stepIndex !== 0" type="" @click="preStep">上一步</a-button>
                <a-button v-if="stepIndex === 0" :loading="submitLoading" type="primary" @click="submitNext">下一步
                </a-button>
                <a-button v-if="stepIndex === 1" :loading="submitLoading" type="primary" @click="submitForm">提交
                </a-button>
            </div>
        </a-modal>

      <SorgSelectModal ref="sorgSelectModal" @on-update="onSelectSorgHandle"/>
      <MassTextMessages ref="massTextMessages" @on-update="stepNext"/>
    </div>
</template>
<script>
import api from '@/api/api-serve-apply'
import DicSelect from '@/components/dic-select'
import SorgSelectModal from './sorg-select-modal'
import AddressSelect from '@/components/address-select'
import MassTextMessages from '@/pages/ServeApply/mass-text-messages'
import {Promise} from 'q'
import moment from "moment"

export default {
	name: 'apply-info-form',
	components: {DicSelect, SorgSelectModal, AddressSelect, MassTextMessages},
	data () {
		return {
			resmedDatesCheckFlag: false,
			stepIndex: 0,
			dataFormLayout: {
				labelCol: {span: 9},
				wrapperCol: {span: 15}
			},
			spinning: false,
			extraParam: {},
			isAdd: true,
			modalWidth: 1370,
			modalTitle: '',
			submitLoading: false,
			formModal: false,
			dataForm: this.$form.createForm(this),
			docData: {},
			customerInfo: {},
			cardNo: '',
			selectedServiceInfo: {},
			applyDateList: [],

			pageData1: {
				dataCount: 0,
				data: []
			},
			selectedRows1: [],
			selectedRowKeys1: [],
			loading1: false,
			columns1: [
				{title: "产品名称", dataIndex: "productName"},
				{title: "服务包", dataIndex: "proServiceName", scopedSlots: {customRender: "textVal"}},
				{title: "服务名称", dataIndex: "serviceName"},
				{title: "总次数", dataIndex: "availableAmount"},
				{title: "剩余次数", dataIndex: "remainingValue"},
				{title: "取消次数", dataIndex: "cancleNum"},
				{title: "价格", dataIndex: "serviceChargeAmount"},
				{title: "服务说明", dataIndex: "serviceDetail"}
			],
			pagination1: {
				pageSize: 10,
				current: 1,
				total: 0,
				showTotal: total => `共 ${total} 条数据`,
				showSizeChanger: true,
				pageSizeOptions: ["10", "20", "35", "50"],
				onShowSizeChange: (current, pageSize) => this.onPageSizeChange1(current, pageSize),
				onChange: (page, pageSize) => this.onPageChange1(page, pageSize)
			},

			pageData2: {
				dataCount: 0,
				data: []
			},
			selectedRows2: [],
			selectedRowKeys2: [],
			loading2: false,
			columns2: [
				{title: "序号", dataIndex: "recordIndex"},
				{title: "使用人姓名", dataIndex: "patientName"},
				{title: "使用人性别", dataIndex: "patientGenderDesc", scopedSlots: {customRender: "textVal"}},
				{title: "出生日期", dataIndex: "patientBirthDate"},
				{title: "证件类型", dataIndex: "patientCerttypeDesc"},
				{title: "证件号码", dataIndex: "patientCertno"},
				{title: "手机号码", dataIndex: "patientTelephone", scopedSlots: {customRender: "textVal"}},
				{title: "地址", dataIndex: "patientAddress", scopedSlots: {customRender: "textVal"}}
			],
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
			// 控制健管中心预约时间是否显示
			contTypeflag: false,
			checkBoy: false, // 判断服务类别，只有就医服务才限制未成年人必录监护人
			// 未成年人标志
			isChild: false,
			merchantMsg: {} // 医疗机构的信息

		}
	},
	mounted () {
		// this.loadApplyDateList()
	},
	methods: {
		onRowChange1 (selectedRowKeys, selectedRows) {
			this.selectedRowKeys1 = selectedRowKeys || []
			this.selectedRows1 = selectedRows

			this.selectedServiceInfo = {}
			if (this.selectedRows1.length) this.selectedServiceInfo = this.selectedRows1[0]
			// 判断服务类别，只有就医服务才限制未成年人必录监护人
			this.checkBoy = this.selectedServiceInfo.serviceType === "14"
			// console.log("数据服务", this.selectedServiceInfo)
			// 清空医疗机构信息
			this.merchantMsg = []
			this.dataForm.setFieldsValue({
				merchantName: null
			})
		},
		searchHandle1 () {
			this.$nextTick(() => {
				this.pagination1.current = 1
				this.loadPageData1()
			})
		},
		onPageChange1 (page, pageSize) {
			this.pagination1.current = page
			this.loadPageData1()
		},
		onPageSizeChange1 (current, size) {
			this.pagination1.pageSize = size
			this.searchHandle1()
		},
		loadPageData1 () {
			this.selectedRowKeys1 = []
			let data = {
				page: this.pagination1.current,
				limit: this.pagination1.pageSize,
				agreementNo: this.docData.agreementNo
			}
			this.loading1 = true
			api.getAgreementService(data).then(res => {
				// console.log(res, "result")
				let pageData = {
					totalCount: res.data.total,
					data: res.data.rows
				}
				this.pageData1 = pageData || {totalCount: 0, data: []}
				this.pageData1.data.forEach((item, index) => {
					item.recordIndex = index + 1
				})
				this.pagination1.total = this.pageData1.totalCount
				// console.log('服务数据', data)
			}).finally(() => {
				this.loading1 = false
			})
		},

		onRowChange2 (selectedRowKeys, selectedRows) {
			this.selectedRowKeys2 = selectedRowKeys || []
			this.selectedRows2 = selectedRows
			let data = JSON.parse(JSON.stringify(selectedRows[0]))
			// 只有就医服务才限制监护人必录
			let age = this.checkAge(moment(data.patientBirthDate).format('YYYY-MM-DD'))
			this.isChild = age < 18 && this.checkBoy
			data.patientBirthDate = moment(data.patientBirthDate)
			this.dataForm.setFieldsValue(data)
		},
		searchHandle2 () {
			this.$nextTick(() => {
				this.pagination2.current = 1
				this.loadPageData2()
			})
		},
		onPageChange2 (page, pageSize) {
			this.pagination2.current = page
			this.loadPageData2()
		},
		onPageSizeChange2 (current, size) {
			this.pagination2.pageSize = size
			this.searchHandle2()
		},
		loadPageData2 () {
			this.selectedRowKeys2 = []
			let data = {
				page: this.pagination2.current,
				limit: this.pagination2.pageSize,
				cardNo: this.cardNo
			}
			this.loading2 = true
			api.queryUsedMan(data).then(res => {
				// console.log(res, "result")
				let pageData = {
					totalCount: res.data.total,
					data: res.data.rows
				}
				this.pageData2 = pageData || {totalCount: 0, data: []}
				this.pageData2.data.forEach((item, index) => {
					item.recordIndex = index + 1
				})
				this.pagination2.total = this.pageData2.totalCount
			}).finally(() => {
				this.loading2 = false
			})
		},
		loadApplyDateList () {
			api.queryTime().then(res => {
				let rows = res.data.rows
				this.applyDateList = rows
			})
		},
		loadAllTable () {
			this.searchHandle1()
			this.searchHandle2()
		},
		addForm (obj) {
			this.extraParam = obj || {}
			this.isAdd = true
			this.modalTitle = '提交服务申请'
			this.formModal = true
			this.modalWidth = 1370
			this.stepIndex = 0

			this.$nextTick(() => {
				this.dataForm.resetFields()
				this.dataForm.setFieldsValue({
					orgName: '01',
					noType: '02'
				})
			})
		},
		editForm (docDefId, extraParam) {
			this.extraParam = extraParam || {}
			this.modalTitle = '编辑健管卡'
			this.isAdd = false
			this.formModal = true
			this.spinning = false
			this.$nextTick(() => {
				this.dataForm.resetFields()
				this.dataForm.setFieldsValue(this.extraParam)
			})
		},
		onSearchSorg () {
			if (!this.selectedRows1.length) {
				this.$message.info('请选择一项服务,再选择医疗机构!')
				return
			}
			this.$refs.sorgSelectModal.show(this.selectedRows1[0])
		},
		onSelectSorgHandle (item) {
			this.merchantMsg = item
			this.dataForm.setFieldsValue({
				merchantName: item.sorgName + item.deptName,
				jgResmedDates: null, // 清空预约时间
				notResmedDates: null,
				resmedDates: null
			})
			// 此验证copy 老系统
			if (item.orgType === "04") {
				// 判断是否需要推送健管中心
				this.checkHinsService()
			} else {
				this.loadApplyDateList() // 初始化方便、不方便就诊时间
				this.contTypeflag = false
			}
			// this.dataForm.setFieldsValue({
			// 	merchantName: item.sorgName
			// })
		},
		preStep () {
			this.stepIndex = 0
			this.$nextTick(() => {
				this.dataForm.resetFields()
				this.dataForm.setFieldsValue({
					orgName: '01',
					noType: '02'
				})
			})
			console.log(111, this.dataForm.getFieldsValue.noType)
		},
		// 信息验证通过后要进行的下一步
		submitNext () {
			this.dataForm.validateFields((error, values) => {
				if (error) {
					this.$message.error('表单请填写完整！')
					return
				}

				let noType = values.noType
				let params = Object.assign({}, values)
				delete params.noType
				delete params.orgName

				this.submitLoading = true
				if (noType === '02') {
					api.makdoc(params).then(res => {
						this.docData = res.data
						this.customerInfo = this.docData.Customer || {}
						this.cardNo = values.cardNo
						this.stepIndex = 1
						this.modalWidth = 1370

						this.loadAllTable()
					}).finally(() => {
						this.submitLoading = false
					})
				} else if (noType === '03') {
					api.makeAgree(params).then(res => {
						// {"status":0,"statusText":"Success","data":{"msg":"该保单不存在或无效"}}
						if (res.data.jsonData) {
							let jsonData = res.data.jsonData
							let cardNo = jsonData.cardNo
							let clearText = jsonData.clearText
							let params = {cardNo: cardNo, clearText: clearText}
							this.cardNo = cardNo
							console.log(1, params)
							api.makdoc(params).then(res => {
								this.docData = res.data
								this.customerInfo = this.docData.Customer || {}
								this.stepIndex = 1
								this.modalWidth = 1370

								this.loadAllTable()
							}).finally(() => {
								this.submitLoading = false
							})
						} else {
							this.$message.error(res.data.msg)
						}
					}).finally(() => {
						this.submitLoading = false
					})
				}
			})
		},
		// 新增的申请信息进行提交
		submitForm () {
			// 手机格式正则 copy the old system
			let myPhoneReg = /^[1][3,4,5,6,7,8,9][0-9]{9}$/
			this.dataForm.validateFields((error, values) => {
				// 提交再次确认提示
				// if (!confirm("是否确认提交，提交后不可修改")) return
				// 必要字段非空验证
				if (error) {
					this.$message.error("表单请填写完整！")
					return
				}
				let formData = Object.assign({}, values, this.merchantMsg)
				// 手机号码格式校验
				if (!myPhoneReg.test(formData.patientTelephone) || formData.patientTelephone.length < 11 || !this.checkNumber(formData.patientTelephone)) {
					this.$message.error("使用人手机号码格式不正确")
					return
				}
				// 使用人身份证校验
				var certiNoTip = this.IdentityCodeValid(formData.patientCertno)
				if (formData.patientCerttype === '0' && certiNoTip) {
					this.$message.error(certiNoTip)
					return
				}
				// 联系人身份证校验
				var certiNoTip1 = this.IdentityCodeValid(formData.linkmanCertno)
				if (formData.linkmanCerttype === '0' && certiNoTip1) {
					this.$message.error(certiNoTip1)
					return
				}

				// 只有就医服务才限制监护人必录  checkBoy serviceType
				if (this.isChild) {
					// 使用人未成年 联系监护人人非空校验
					if (!myPhoneReg.test(formData.linkmanPhone) || formData.linkmanPhone.length < 11 || !this.checkNumber(formData.linkmanPhone)) {
						this.$message.error("联系人手机号码格式不正确")
						return
					}
				}

				// 健管中心预约
				if (this.contTypeflag) {
					let AjgResmedDates = this.dataForm.getFieldsValue().jgResmedDates
					if (AjgResmedDates && AjgResmedDates.length > 0) {
						formData.jgResmedDates = AjgResmedDates.split('(')[0]
					} else {
						return this.$message.error("健管中心预约时间不可为空！")
					}
				} else {
					let AresmedDates = this.dataForm.getFieldsValue().resmedDates
					let AnotResmedDates = this.dataForm.getFieldsValue().notResmedDates
					if (AresmedDates && AresmedDates.length > 0) {
						if (this.dataForm.getFieldsValue().resmedDates.length < 2) {
							return this.$message.error("指定就诊时间最少选择两项！")
						}
						AresmedDates = AresmedDates.join(',')
					} else {
						AresmedDates = "无"
					}
					if (AnotResmedDates && AnotResmedDates.length > 0) {
						if (this.dataForm.getFieldsValue().notResmedDates.length > 2) {
							return this.$message.error("不方便就诊时间最多选择两项！")
						}
						AnotResmedDates = AnotResmedDates.join(',')
					} else {
						AnotResmedDates = "无"
					}
					formData.resmedDates = AresmedDates
					formData.notResmedDates = AnotResmedDates
				}
				let Customers = this.customerInfo// 持卡人信息
				let serviceMsg = this.selectedServiceInfo// 服务信息
				let ServiceApplication = {
					"patientName": formData.patientName,
					"patientCerttype": formData.patientCerttype,
					"patientCertno": formData.patientCertno,
					"patientGender": formData.patientGender,
					"patientBirthDate": moment(formData.patientBirthDate).format('YYYY-MM-DD'),
					"patientTelephone": formData.patientTelephone,
					"patientProvince": formData.patientProvince,
					"patientCity": formData.patientCity,
					"patientTelephoneSpare": formData.patientTelephoneSpare,
					"patientAddress": formData.patientAddress,
					"linkmanName": formData.linkmanName,
					"linkmanCerttype": formData.linkmanCerttype,
					"linkmanCertno": formData.linkmanCertno,
					"linkmanPhone": formData.linkmanPhone,
					"disease": formData.disease,
					"detailedDescription": formData.detailedDescription,
					"merchantName": formData.merchantName,
					"resmedDoctorName": formData.resmedDoctorName,
					"specialFlag": formData.specialFlag,
					"medicareFlag": formData.medicareFlag,
					"resmedDateType": formData.resmedDateType,
					"resmedDates": formData.resmedDates,
					"medredCardno": formData.medredCardno,
					"merchantcode": formData.sorgCode, // 找了这么久竟让是这里的问题
					"sorgName": formData.sorgName,
					"deptName": formData.deptName,
					"deptCode": formData.deptCode,
					"sorgProvince": formData.orgPrivince, // 泪
					"sorgCity": formData.orgCity, // 都是泪
					"orgType": formData.orgType,
					"notResmedDates": formData.notResmedDates,
					"jgResmedDates": formData.jgResmedDates,
					"cardNo": this.cardNo,
					"agreementNo": this.docData.agreementNo,
					"applyName": Customers.customerName,
					"applySex": Customers.gender,
					"applyBirthday": Customers.birthDate,
					"applyTel": Customers.contactTelephone,
					"applyCerttype": Customers.certtype,
					"applyCertno": Customers.certno,
					"servicePackageCode": serviceMsg.parentServiceCode,
					"serviceCode": serviceMsg.serviceCode,
					"serviceName": serviceMsg.serviceName,
					"productCode": serviceMsg.productCode,
					"productName": serviceMsg.productName,
					"productId": serviceMsg.proId,
					"explain": serviceMsg.serviceDetail,
					"channelType": "12"
				}
				// 校验就诊人是否为被保人
				api.checkPolicyMan(ServiceApplication).then(res => {
					if (res.data === '2') {
						return this.$message.error('就诊人不是被保人或此保单无效!')
					} else {
						// 校验通过开始服务申请
						let self = this
						this.$confirm({
							title: '提示',
							content: '是否确认提交，提交后不可修改？',
							okType: 'danger',
							onOk () {
								return new Promise((resolve, reject) => {
									self.submitLoading = true
									api.newApplyInfo(ServiceApplication).then(res => {
										if (res.status === 0) {
											if (res.data.result === 1) {
												self.$message.success('保存成功!')
												let taskInfo = res.data.serviceApplication
												// self.formModal = false
												//
												// 处理短信
												ServiceApplication.serviceReservationId = taskInfo.serviceReservationId
												let messageData = {
													taskInfo: taskInfo,
													serviceData: ServiceApplication
												}
												self.$refs.massTextMessages.showForm(messageData)
											}
										}
									}).finally(() => {
										self.submitLoading = false
										resolve()
									})
								})
							}
						})
					}
				})
			})
		},
		// 判断是否需要推送健管中心
		checkHinsService () {
			let params = {"serviceCode": this.selectedServiceInfo.serviceCode}
			api.checkHinsService(params).then(res => {
				// console.log('res',res)
				this.contTypeflag = res.data.flag
				if (res.data.flag) {
					this.getHinsWorkPlan()// 获取健管中心排班日期
				}
			}).finally(() => {
			})
		},
		// 获取健管中心排班日期
		getHinsWorkPlan () {
			let params = {
				serviceCode: this.selectedServiceInfo.serviceCode,
				merchantCode: this.merchantMsg.sorgCode
			}
			api.getHinsWorkPlan(params).then(res => {
				if (res.status === 0) {
					this.applyDateList = res.data
				}
			}).finally(() => {
			})
		},
		checkNumber (str) {
			var regex = new RegExp(str.substr(0, 1), 'g') // 使用g表示整个字符串都要匹配
			var result = str.match(regex)
			var count = !result ? 0 : result.length
			if (count < str.length) {
				return true
			} else {
				return false
			}
		},
		format (m) {
			return m < 10 ? '0' + m : m
		},
		// 当出生日期改变时是否是未成年人
		handleChange (e) {
			let arrT = new Date(e._d).toLocaleDateString().split('/')
			let remindTime = arrT[0] + "-" + this.format(arrT[1]) + "-" + this.format(arrT[2])
			this.dataForm.setFieldsValue({
				patientBirthDate: remindTime
			})
			// 只有就医服务才限制监护人必录
			let age = this.checkAge(remindTime)
			this.isChild = age < 18 && this.checkBoy
		},
		// 年龄校验
		checkAge (strBirthday) {
			var returnAge
			var strBirthdayArr = strBirthday.split("-")
			var birthYear = strBirthdayArr[0]
			var birthMonth = strBirthdayArr[1]
			var birthDay = strBirthdayArr[2]
			var nowDate = moment(new Date(), 'YYYY-MM-DD').format('YYYY-MM-DD').split("-")
			var nowYear = nowDate[0]
			var nowMonth = nowDate[1]
			var nowDay = nowDate[2]
			if (nowYear === birthYear) {
				returnAge = 0// 同年 则为0岁
			} else {
				var ageDiff = nowYear - birthYear // 年之差
				if (ageDiff > 0) {
					if (nowMonth === birthMonth) {
						var dayDiff = nowDay - birthDay// 日之差
						if (dayDiff < 0) {
							returnAge = ageDiff - 1
						} else {
							returnAge = ageDiff
						}
					} else {
						var monthDiff = nowMonth - birthMonth// 月之差
						if (monthDiff < 0) {
							returnAge = ageDiff - 1
						} else {
							returnAge = ageDiff
						}
					}
				} else {
					returnAge = -1// 返回-1 表示出生日期输入错误 晚于今天
				}
			}
			return returnAge// 返回周岁年龄
		},
		/**
			 * 身份证校验
			 */
		IdentityCodeValid (code) {
			var city = {
				11: "北京",
				12: "天津",
				13: "河北",
				14: "山西",
				15: "内蒙古",
				21: "辽宁",
				22: "吉林",
				23: "黑龙江 ",
				31: "上海",
				32: "江苏",
				33: "浙江",
				34: "安徽",
				35: "福建",
				36: "江西",
				37: "山东",
				41: "河南",
				42: "湖北 ",
				43: "湖南",
				44: "广东",
				45: "广西",
				46: "海南",
				50: "重庆",
				51: "四川",
				52: "贵州",
				53: "云南",
				54: "西藏 ",
				61: "陕西",
				62: "甘肃",
				63: "青海",
				64: "宁夏",
				65: "新疆",
				71: "台湾",
				81: "香港",
				82: "澳门",
				91: "国外 "
			}
			var tip = ""
			if (!code || !/^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/i.test(code) | /^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{2}$/i.test(code)) {
				tip = "身份证号格式错误"
			} else if (!city[code.substr(0, 2)]) {
				tip = "身份证号地址编码错误"
			} else {
				// 18位身份证需要验证最后一位校验位
				if (code.length === 18) {
					code = code.split('')
					// ∑(ai×Wi)(mod 11)
					// 加权因子
					var factor = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2]
					// 校验位
					var parity = [1, 0, 'X', 9, 8, 7, 6, 5, 4, 3, 2]
					var sum = 0
					var ai = 0
					var wi = 0
					for (var i = 0; i < 17; i++) {
						ai = code[i]
						wi = factor[i]
						sum += ai * wi
					}
					var last = parity[sum % 11] + ''
					if (last !== (code[17] + '')) {
						tip = "身份证号校验位错误"
					}
				}
			}
			return tip
		},
		resmedDateTypeChange () {
			this.dataForm.setFieldsValue({resmedDates: undefined, notResmedDates: undefined})
		},
		showApplyInfoForm () {
			this.formModal = true
		},
		// 当证件类型为身份证时，填完身份证后，可自动带出客户性别，出生日期，并真实性效验。
		// 身份证输入框失去焦点时触发
		doBlur () {
			// 获取证件类型下拉框的值
			let linkmanCerttype = this.dataForm.getFieldValue('patientCerttype')
			if (linkmanCerttype === "0") {
				// 获取输入的证件号
				let linkmanCertno = this.dataForm.getFieldValue('patientCertno')
				this.autoFill(linkmanCertno)
			}
		},
		/**
			 * 根据身份证自动带出出身日期、性别、年龄
			 */
		autoFill (certiNo) {
			let certiNoTip = this.IdentityCodeValid(certiNo)
			if (certiNoTip !== '') {
				this.$message.error(certiNoTip)
				return
			}
			// 获取出生日期
			let birth = certiNo.substring(6, 10) + "-" + certiNo.substring(10, 12) + "-" + certiNo.substring(12, 14)
			// 只有就医服务才限制监护人必录
			let age = this.checkAge(birth)
			this.isChild = age < 18 && this.checkBoy
			this.dataForm.setFieldsValue({'patientBirthDate': moment(birth, 'YYYY-MM-DD')})
			// 获取性别
			if (parseInt(certiNo.substr(16, 1)) % 2 === 1) {
				// 男
				this.dataForm.setFieldsValue({'patientGender': '0'})
			} else {
				// 女
				this.dataForm.setFieldsValue({'patientGender': '1'})
			}
		},
		stepNext (serviceData) {
			if (serviceData.status === '00') {
				this.addForm()
			} else {
				this.formModal = false
				this.$emit('on-update')
			}
		},
		resmedDateCheck (record) {
			if (record.length < 2) {
				return this.$message.error("指定就诊时间最少选择两项！")
			}
		},
		notResmedDateCheck (record) {
			if (record.length > 2) {
				return this.$message.error("不方便就诊时间最多选择两项！")
			}
		}

	}
}
</script>
<style>

</style>
