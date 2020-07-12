<template>
	<a-card :bordered="false">
		<a-card>
			<span href="#" slot="title" style="float:left;">
				<a-icon type="search" /> 查询显示</span>
			<a href="#" slot="extra">
				<a-icon :type="iconType" @click="swithTableShow" />
			</a>
			<a-table :key="count" :rowClassName="(record, index) => { return record.status==='04'? 'no-pass':''}" v-show="showTable"
				:scroll="{ x: 'max-content'}" :bordered="false" :pagination="pagination"
				:dataSource="pageData.data"
				:columns="columns" :rowKey="record => record.recordIndex" :indentSize="0"
				:loading="loading"
				:row-selection="{ type: 'checkbox', selectedRowKeys: selectedRowKeys, onChange: onRowChange }">
				<a-tag slot="yesNo" slot-scope="text, record" :color="text === 'Y' ? 'green' : 'orange'">
					{{ text === "Y" ? "是" : "否" }}</a-tag>
			</a-table>
			<a-row :gutter="16">
				<a-col :span="24" style="margin:10px 0 0 0;text-align:right">
					<a-button type="" :disabled="selectedRows.length === 0" @click="deleteBatch"
						class="editable-add-btn" style="float:right;margin-right:10px;">删除</a-button>
					<a-button type="" :disabled="selectedRows.length === 0" @click="approveBatch"
						class="editable-add-btn" style="float:right;margin-right:10px;">提交审核</a-button>
					<a-button type="primary" :disabled="pageData.data.length === 0" @click="approveAllBatch"
						class="editable-add-btn" style="float:right;margin-right:10px;">全部提交审核</a-button>
				</a-col>
			</a-row>
		</a-card>
		<a-modal v-model="formModal" style="top: 30px;" :width="600" title="选择审批主管">
			<a-form :form="dataForm1" :labelCol="{span: 4}" :wrapperCol="{span: 20}">
				<a-card style="margin: 24px;">
					<a-row :gutter="16">
						<a-col :span="24">
							<a-row>
								<a-col :span="24">
									<a-form-item label="审批主管">
										<!-- 开启defaultDisplayFirst后, initialValue失效 -->
										<LeaderSelect :defaultDisplayFirst="true" dicType="86"
											v-decorator="['auditOper',{initialValue: '', rules: [ {required: true, message: '请选择审批主管'}]} ]"
											placeholder="请选择审批主管" @change="changevalue" />
									</a-form-item>
								</a-col>
							</a-row>
						</a-col>
					</a-row>
				</a-card>
			</a-form>
			<div slot="footer">
				<a-button type="" @click="formModal=false">取消</a-button>
				<a-button :loading="submitLoading" type="primary" @click="submitForm">确定</a-button>

			</div>
		</a-modal>
		<a-card style="margin-top:24px;">
			<a-divider orientation="left">
				<a-icon type="file-search" /> 基本信息</a-divider>
			<a-form :form="filterForm" :labelCol="filterFormLayout.labelCol" :wrapperCol="filterFormLayout.wrapperCol">
				<a-row :gutter="16">
					<a-col :span="6">
						<a-form-item label="管理机构">
							<a-input :disabled="true" placeholder="" v-decorator="[
                  'orgName',
                  {initialValue: ''}
                  ]" />
						</a-form-item>
					</a-col>
					<a-col :span="6">
						<a-form-item label="管家姓名">
							<a-input :disabled="true" placeholder="" v-decorator="[
                  'staffName',
                  {initialValue: ''}
                  ]" />
						</a-form-item>
					</a-col>
					<a-col :span="6">
						<a-form-item label="管家工号">
							<a-input :disabled="true" placeholder="" v-decorator="[
                  'staffNo',
                  {initialValue: ''}
                  ]" />
						</a-form-item>
					</a-col>
					<a-col :span="6">
						<a-form-item label="系统账号">
							<a-input :disabled="true" placeholder="" v-decorator="[
                  'systemNo',
                  {initialValue: ''}
                  ]" />
						</a-form-item>
					</a-col>
				</a-row>

				<a-row :gutter="16">
					<a-col :span="6">
						<a-form-item label="客户类型">
							<a-select :showSearch="true" :filterOption="true" optionFilterProp="children" allowClear
								placeholder="请选择" :dropdownMatchSelectWidth="false" v-decorator="['customerType',
								{initialValue:'01',
								rules: [{ required: true,
								 message: '客户类型不能为空!' }]}]" @change="checks">
								<a-select-option v-for="(item, index) in customerTypeList" :value="item.value"
									:key="index">{{ item.label }}</a-select-option>
							</a-select>
						</a-form-item>
					</a-col>
					<a-col :span="6">
						<a-form-item label="服务实施部门">
							<DicSelect dicType="ORG_DEPT" allowClear :placeholder="placeholder" :removeList="removeListArr2" v-decorator="[
                  'serviceExecuteOrg',
                  {initialValue: '',rules: [{ required: true, message: '请选择!' }]}
                  ]"></DicSelect>
						</a-form-item>
					</a-col>
					<a-col :span="6" v-show="filterForm.getFieldValue('serviceExecuteOrg')==='01'">
						<a-form-item label="健管中心名称">
							<DicSelectList dicType="ORG_DEPT" allowClear v-decorator="[
                  'realName',
                  {initialValue: '',rules: [{ required: filterForm.getFieldValue('serviceExecuteOrg')==='01', message: '请选择!' }]}
                  ]" placeholder="请选择"></DicSelectList>
						</a-form-item>
					</a-col>
					<a-col :span="6" v-show="filterForm.getFieldValue('serviceExecuteOrg')==='03'">
						<a-form-item label="VIP诊疗室名称">
							<DicSelectList dicType="ORG_DEPT" allowClear v-decorator="[
                  'vipName',
                  {initialValue: '',rules: [{ required: filterForm.getFieldValue('serviceExecuteOrg')==='03', message: '请选择!' }]}
                  ]" placeholder="请选择"></DicSelectList>
						</a-form-item>
					</a-col>
				</a-row>
				<a-row :gutter="16">
					<a-col :span="6">
						<a-form-item label="服务项目">
							<ServitemSelect :customerType="filterForm.getFieldValue('customerType')" allowClear v-decorator="[
                  'serveItem',
                  {initialValue: '',rules: [{ required: true, message: '请选择!' }]}
                  ]" placeholder="请选择" @change="serverProduct"></ServitemSelect>
						</a-form-item>
					</a-col>
					<a-col :span="6">
						<a-form-item label="服务细类">
							<ServitemSubSelect ref='servitemSubSelect'
								:customerType="filterForm.getFieldValue('customerType')"
								:serveItem="filterForm.getFieldValue('serveItem')" allowClear v-decorator="[
                  'serveItemSub',
                  {initialValue: '',rules: [{ required: true, message: '请选择!' }]}
                  ]" placeholder="请选择" @change="serverclassfiy"/>
						</a-form-item>
					</a-col>
					<a-col :span="6">
						<a-form-item label="服务单位">
							<a-select :showSearch="true" :filterOption="true" optionFilterProp="children" allowClear
								placeholder="请选择" :dropdownMatchSelectWidth="false"
								v-decorator="['serveUnit', {initialValue:'',rules: [{ required: true, message: '服务单位不能为空!' }]}]">
								<a-select-option v-for="(item, index) in selectSaveList" :value="item.value" :key="index">
									{{ item.label }}</a-select-option>
									<!-- <a-select-option :value="serveUnitList">
									{{ serveUnitList }}</a-select-option> -->
							</a-select>
						</a-form-item>
					</a-col>
					<a-col :span="6">
						<a-form-item label="服务数量">
							<a-input-number :disabled="disabled" :min="1" :max="100000" v-decorator="[
                  'serveCount',
                  {rules: [{ required: true, message: '请选择!' }]}
                  ]" />
						</a-form-item>
					</a-col>
					<a-col  v-if="hasCustomerNum==='Y'" :span="6">
						<a-form-item label="客户人数">
							<a-input placeholder="请输入..."
								v-decorator="[ 'customerNum', {initialValue: '', rules: [{ pattern:new RegExp(/^[0-9]*$/), required: true, message: '只能录入非负整数!'}]}]" />
						</a-form-item>
					</a-col>
					<a-col :span="9">
						<a-form-item label="服务机构/预约医院" >
							<!--              <a-input placeholder="" v-decorator="[-->
							<!--                  'serviceProvider',-->
							<!--                  {initialValue: '',rules: [{ required: true, message: '请选择!' }]}-->
							<!--                  ]" />-->
							<a-input-search :read-only="true"
								v-decorator="[ 'serviceProvider', {initialValue: '', rules: [ {required: true, message: '请选择'} ]}]"
								@search="onSearchHealthCenter" enterButton="搜索" />
						</a-form-item>
					</a-col>
					<a-col :span="6">
						<a-form-item label="服务时间">
							<a-date-picker v-decorator="['serveTime',{rules: [{ required: true, message: '请选择!' }]}]" />
						</a-form-item>
					</a-col>
				</a-row>

				<a-row :gutter="16">
					<div v-show="filterForm.getFieldValue('customerType')==='01'">
						<a-col :span="6">
							<a-form-item label="客户姓名">
								<a-input placeholder="" v-decorator="[
										'customeName',
										{initialValue: '',rules: [{ required: filterForm.getFieldValue('customerType')==='01', message: '请选择!' }]}
										]" />
							</a-form-item>
						</a-col>
						<a-col :span="6">
							<a-form-item label="客户证件类型">
								<DicSelect dicType="CERTI_TYPE" allowClear v-decorator="[
								'customeCertType',
								{initialValue: '',rules: [{ required: hasCustomerInfo==='Y' && filterForm.getFieldValue('customerType')==='01', message: '不能为空!' }]}
								]"></DicSelect>
							</a-form-item>
						</a-col>
						<a-col :span="6">
							<a-form-item label="客户证件号">
								<a-input @blur="doBlur"
									v-decorator="['customeCertNum', {rules: [{ required: hasCustomerInfo==='Y' && filterForm.getFieldValue('customerType')==='01', message: '证件号码不能为空!' }]}]" />
							</a-form-item>
						</a-col>
						<a-col :span="6">
							<a-form-item label="客户性别">
								<DicSelect dicType="GENDER" allowClear v-decorator="[
								'customeSex',
								{initialValue: '',rules: [{ required: hasCustomerInfo==='Y' && filterForm.getFieldValue('customerType')==='01', message: '请选择!' }]}
								]"></DicSelect>
							</a-form-item>
						</a-col>
						<a-col :span="6">
							<a-form-item label="出生日期">
								<a-date-picker v-decorator="[
								'borthTime',
								{initialValue:'',rules: [{ required: hasCustomerInfo==='Y' && filterForm.getFieldValue('customerType')==='01', message: '请选择!' }]}
								]" @change="onChange" />
							</a-form-item>
						</a-col>
					</div>
					<div v-show="filterForm.getFieldValue('customerType')==='02'">
						<a-col :span="6">
							<a-form-item label="团体客户名称">
								<a-input placeholder=""
									v-decorator="['teamName', {initialValue: '',rules: [{required: filterForm.getFieldValue('customerType')==='02', message: '团体客户名称不能为空'}]}]" />
							</a-form-item>
						</a-col>
						<a-col :span="6">
							<a-form-item label="团体客户人数">
								<a-input-number :min="1" placeholder=""
									v-decorator="['teamNum', {initialValue: '',rules: [{required: filterForm.getFieldValue('customerType')==='02', message: '团体客户人数不能为空'}]}]" />
							</a-form-item>
						</a-col>
					</div>
					<a-col :span="6">
						<a-form-item label="联系电话">
							<a-input placeholder="请输入" v-decorator="[
                  'custTel',
                  {initialValue: '',rules: [{ required: true, message: '联系电话不能为空!' }]}
                  ]" />
						</a-form-item>
					</a-col>
					<a-col :span="6">
						<a-form-item label="客户来源">
							<DicSelect dicType="SI_CUST_CHANNEL" allowClear :removeList="removeListArr" v-decorator="[
                  'custChannel',
                  {initialValue: '',rules: [{ required: true, message: '请选择客户来源!' }]}
                  ]" />
						</a-form-item>
					</a-col>
					<a-col :span="6">
						<a-form-item label="备注">
							<a-input placeholder=""
								v-decorator="['remark',{initialValue: '',rules: [{ type: 'string', max:150,message: '备注超长!' }]}]" />
						</a-form-item>
					</a-col>
				</a-row>
				<!-- selectedRows.length > 0 && selectedRows[0]['status'] === '04' -->
				<a-row :gutter="16" v-show="isShowauditContent">
					<a-col :span="17">
						<a-form-item label="审核意见" :label-col="{span: 3}" :wrapper-col="{span: 14}">
							<!-- <a-textarea v-decorator="['auditRemarkMiNi']" disabled></a-textarea> -->
							<a-textarea v-decorator="['auditContent']" disabled></a-textarea>
						</a-form-item>
					</a-col>
				</a-row>
				<a-row :gutter="16">
					<a-col :span="24" style="margin:10px 0 0 0;text-align:right">
						<a-button type="" class="editable-add-btn" style="float:right;margin-right:10px;"
							@click="resetFilterForm">重置</a-button>
						<a-button type="primary" class="editable-add-btn" style="float:right;margin-right:10px;"
							@click="saveHandle">保存</a-button>
					</a-col>
				</a-row>
			</a-form>
		</a-card>
		<ModalHealtheCenterSelect ref="modalHealtheCenterSelect" @on-update="onSelectItem" />
	</a-card>
</template>
<script>
import moment from 'moment'
import api from "@/api/api-serve-apply"
import DicSelect from "@/components/dic-select"
import DicSelectList from "@/components/dic-select-list"
import ServitemSelect from "@/components/servitem-select"
import ServitemSubSelect from "@/components/servitem-sub-select"
import ModalHealtheCenterSelect from "./../ServiceReported/components/modal-health-center-select"
import LeaderSelect from '@/components/leader-select'
import apiCommon from '@/api/api-common'
import { constants } from 'zlib'

export default {
	name: "salary-performance",
	components: { DicSelect, ServitemSelect, ServitemSubSelect, ModalHealtheCenterSelect, DicSelectList, LeaderSelect },
	data () {
		return {
			count: 0, // 更新表格
			isShowauditContent: false, // 审核意见是否显示--审核回退时显示
			isDisableServerNum: false, // 服务数量--根据客户类型判断是否禁用
			removeListArr: ['09', '10', '11', '12', '13'],
			removeListArr2: ['04'],
			selectSaveList: [],
			submitLoading: false,
			customerTypeList: [{ value: '01', label: '个人' }, { value: '02', label: '团体' }],
			// serveUnitList: [{value: '04', label: '个'},{value: '05', label: '位'}],
			// serveUnitList: [],
			placeholder: "请选择",
			serveUnitList: '',
			value: '',
			auditOperAccountValue: '',
			userType: '',
			serverProductName: '',
			serverclass: '',
			serveItemSubCode: '',
			isShow: '',
			disabled: false,
			hasCustomerNum: 'N',
			hasCustomerInfo: 'N',
			form: this.$form.createForm(this, { name: 'coordinated' }),
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
			dataForm1: this.$form.createForm(this),
			approveAllFlag: false,
			selectedRowKeys: [],
			selectedRows: [],
			loading: false,
			showTable: true,
			iconType: "down",
			serviceProviderCode: '',
			formModal: false,

			columns: [
				{
					align: "center",
					title: "序号",
					dataIndex: "recordIndex"
				},
				{
					align: "left",
					title: "状态",
					dataIndex: "statusStr",
					scopedSlots: { customRender: "statusStr" }
				},
				{
					align: "left",
					title: "审核意见",
					dataIndex: "auditRemarkMiNi",
					scopedSlots: { customRender: "auditRemarkMiNi" }
				},
				{
					align: "left",
					title: "服务日期",
					dataIndex: "serveTime"
				},
				{
					align: "left",
					title: "客户类型",
					dataIndex: "customerTypeStr"
				},
				{
					align: "left",
					title: "客户姓名",
					dataIndex: "customeName"
				},
				{
					align: "left",
					title: "客户性别",
					dataIndex: "customeSexStr"
				},
				{
					align: "left",
					title: "团体客户名称",
					dataIndex: "teamName"
				},
				{
					align: "left",
					title: "团体客户人数",
					dataIndex: "teamNum"
				},
				{
					align: "left",
					title: "服务项目",
					dataIndex: "serveItemDesc"
				},
				{
					align: "left",
					title: "服务细类",
					dataIndex: "serveItemSub"
				},
				{
					align: "left",
					title: "服务数量",
					dataIndex: "serveCount"
				},
				{
					align: "left",
					title: "服务单位",
					dataIndex: "serveUnitDesc"
				},
				{
					align: "left",
					title: "客户人数",
					dataIndex: "customerNum"
				},
				{
					align: "left",
					title: "服务机构/预约医院",
					dataIndex: "serviceProvider"
				},
				{
					align: "left",
					title: "操作日期",
					customRender: (value, row, index) => value && moment(value).format('YYYY-MM-DD HH:mm:ss'),
					dataIndex: "updateTime"
				}

			],
			rowSelection: {
				onChange: (selectedRowKeys, selectedRows) => {
					this.selectedRows = selectedRows
					// 设置基本信息
					if (this.selectedRows.length) {
						// if(this.selectedRows.length>=1){
						// 	this.setBaseInfo()
						// }
						this.setBaseInfo()
					}
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
			defaultList: [],
			serveItemSub: '',
			serveUnit: '',
			showCustomerNum: false
		}
	},
	mounted () {
		//  处理逻辑：初始化查询当前用户信息、审批主管、健管中心/VIP诊疗室数据、服务单位为1的基础数据，用于下拉选择或者设置为不可修改
		//  根据个人/团体，显示不同的表单
		//  根据serveSubFind，addserveItemse，addserveds封装动态组件，最后提交
		// this.searchHandle()
		this.$nextTick(() => {
			this.getUserInfo()
			this.queryInput()
			this.queryDefault()
			// this.ServiceUnit()
		})
	},
	methods: {
		onRowChange (selectedRowKeys, selectedRows) {
			this.selectedRowKeys = selectedRowKeys || []
			this.selectedRows = selectedRows
			let length = selectedRows.length
			if (length >= 1) {
				let recordIndex = selectedRowKeys[length - 1]
				selectedRows.map((item, index) => {
					if (item.recordIndex === recordIndex) {
						let info = Object.assign({}, item)
						info.borthTime = info.borthTime ? moment(info.borthTime) : null
						info.serveTime = info.serveTime ? moment(info.serveTime) : null
						this.filterForm.setFieldsValue({
							serviceExecuteOrg: info.serviceExecuteOrg,
							teamName: info.teamName,
							teamNum: info.teamNum
						})
						this.filterForm.setFieldsValue(info)
						this.filterForm.setFieldsValue({serveUnit: info.serveUnitDesc})
						this.serveItemSubCode = item.serveItemSubCode
						// 服务单位
						this.serveUnit = info.serveUnit
						if (info.status === '04') {
							this.isShowauditContent = true
							this.filterForm.setFieldsValue({ auditContent: info.auditRemark })
						} else {
							this.isShowauditContent = false
						}
						// 查询数量是否只读
						this.disabled = false
						this.defaultList.forEach((items2, index2) => {
							if (parseInt(items2.performanceCode) === parseInt(item.serveItemSubCode)) {
								// this.filterForm.setFieldsValue({ serveCount: 1 })
								this.disabled = true
							}
						})
					}
				})
			}
		},
		onSearchHealthCenter () {
			this.serviceProviderCode = ''
			this.$refs.modalHealtheCenterSelect.show()
		},
		onSelectItem (obj) {
			this.serviceProviderCode = obj.serverCode
			this.filterForm.setFieldsValue({ serviceProvider: obj.serverName })
		},
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
					console.log(code)
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
		// 当证件类型为身份证时，填完身份证后，可自动带出客户性别，出生日期，并真实性效验。
		// 身份证输入框失去焦点时触发
		doBlur () {
			// 获取证件类型下拉框的值
			let linkmanCerttype = this.filterForm.getFieldValue('customeCertType')
			console.log(linkmanCerttype)
			if (linkmanCerttype === "0") {
				// 获取输入的证件号
				let linkmanCertno = this.filterForm.getFieldValue('customeCertNum')
				this.autoFill(linkmanCertno)
			}
		},
		/**
			 * 根据身份证自动带出出身日期、性别、年龄
			 */
		autoFill (certiNo) {
			let certiNoTip = this.IdentityCodeValid(certiNo)
			console.log('certiNoTip', certiNoTip)
			if (certiNoTip !== '') {
				this.$message.error(certiNoTip)
				return
			}
			// 获取出生日期
			let birth = certiNo.substring(6, 10) + "-" + certiNo.substring(10, 12) + "-" + certiNo.substring(12, 14)
			console.log(birth)
			this.filterForm.setFieldsValue({ 'borthTime': moment(birth, 'YYYY-MM-DD') })
			// 获取性别
			if (parseInt(certiNo.substr(16, 1)) % 2 === 1) {
				// 男
				this.filterForm.setFieldsValue({ 'customeSex': '0' })
			} else {
				// 女
				this.filterForm.setFieldsValue({ 'customeSex': '1' })
			}
		},

		// 提交审核
		approveBatch () {
			this.approveAllFlag = false
			// this.dataForm1.resetFields()
			apiCommon.getLeaderInfo().then(res => {
				if (res.data.length > 0) {
					this.formModal = true
				} else {
					this.$message.error('未配置审核主管信息或查询审批主管失败')
					this.formModal = false
				}
			})
		},
		// 全部提交审核
		approveAllBatch () {
			this.approveAllFlag = true
			// this.dataForm1.resetFields()
			apiCommon.getLeaderInfo().then(res => {
				if (res.data.length > 0) {
					this.formModal = true
				} else {
					this.$message.error('未配置审核主管信息或查询审批主管失败')
					this.formModal = false
				}
			})
		},
		changevalue (value, option) {
			this.auditOperAccountValue = value
			console.log(this.auditOperAccountValue)
		},
		submitForm () {
			// debugger
			console.log(this.dataForm1)
			this.dataForm1.validateFields((error, values) => {
				console.log(values, "==================================")
				if (error) {

				}
				if (this.approveAllFlag) {
					let data = {}
					data.auditOperAccount = this.auditOperAccountValue
					// data.auditOperAccount=values.auditOper
					api.submitPerformanceAuditAll(data).then(res => {
						this.$message.success('提交审核成功')
						this.formModal = false
						this.queryInput()
					})
				} else {
					let data = {}

					data.customerList = this.selectedRows
					console.log(data.customerList, "---------------------------")
					let orgCode = this.$store.state.userOrgCode
					for (let i = 0; i < this.selectedRows.length; i++) {
						data.customerList[i].orgCode = orgCode
						data.customerList[i].auditOperAccount = this.auditOperAccountValue
						// data.customerList[i].auditOperAccount=values.auditOper
						data.customerList[i].status = '02'
					}
					data.status = '02'
					data.hadleType = '01'
					api.submitPerformanceAudit(data).then(res => {
						this.$message.success('提交审核成功')
						this.formModal = false
						this.queryInput()
					})
				}
			})
		},
		// 删除
		deleteBatch () {
			let self = this
			this.$confirm({
				title: '确认提示',
				content: `确定删除当前选中的${self.selectedRows.length}项记录吗？`,
				okType: 'danger',
				onOk () {
					return new Promise((resolve, reject) => {
						let data = {}
						data.customerList = self.selectedRows
						let orgCode = self.$store.state.userOrgCode
						for (let i = 0; i < self.selectedRows.length; i++) {
							data.customerList[i].orgCode = orgCode
							data.customerList[i].status = '05'
						}
						data.status = '05'
						data.hadleType = '02'
						api.submitPerformanceAudit(data).then(res => {
							self.$message.success('删除成功')
							self.queryInput()
						}).finally(() => {
							resolve()
						})
					})
				}
			})
		},
		saveHandle () {
			this.filterForm.validateFields((err) => {
				if (!err) {
					let query = this.filterForm.getFieldsValue()
					if (this.checkServeTime(moment(query.serveTime).format("YYYY-MM-DD"))) {
						return
					}
					query.serveTime = query.serveTime ? moment(query.serveTime).format("YYYY-MM-DD") : ''
					query.borthTime = query.borthTime ? moment(query.borthTime).format("YYYY-MM-DD") : null
					query.customeSex = query.customeSex ? query.customeSex : ''
					query.customeCertType = query.customeCertType ? query.customeCertType : ''
					query.serviceProviderCode = this.serviceProviderCode
					query.serveItemSub = this.serveItemSub ? this.serveItemSub : query.serveItemSub
					query.serveItemSubCode = this.serveItemSubCode
					query.serveUnit = this.serveUnit
					this.loading = true
					// 使用人身份证校验
					var customeCertNum = this.IdentityCodeValid(query.customeCertNum)
					if (query.customeCertType === '0' && customeCertNum) {
						this.$message.error(customeCertNum)
						return
					}

					if (this.selectedRows.length >= 1) {
						// 修改操作
						if (this.selectedRows[this.selectedRows.length - 1].status === '04') {
							query.status = '06'
						}
						query.customeNo = this.selectedRows[this.selectedRows.length - 1].customeNo
						api.serveEdit(query).then(res => {
							if (res.status === 0) {
								this.queryInput()
								this.resetFilterForm()
								this.isShowauditContent = false
								// this.queryInput()
								this.$message.success('操作成功！')
							} else {
								this.$message.error(res.statusText ? res.statusText : '请求失败！')
							}
						}).finally(() => {
							this.loading = false
						})
						this.selectedRowKeys = []
						// this.selectedRows = []
					} else {
						// 新增操作
						query.status = '01'
						query.customeNo = ""
						api.serveAdd(query).then(res => {
							if (res.status === 0) {
								this.queryInput()
								this.resetFilterForm()
								this.$message.success('操作成功！')
							} else {
								this.$message.error(res.statusText ? res.statusText : '请求失败！')
							}
						}).finally(() => {
							this.loading = false
						})
					}
				} else {

				}
			})
		},
		// 设置选中信息

		setBaseInfo () {
			let info = Object.assign({}, this.selectedRows[0])
			console.log(info, "222222222222222222222222")
			info.borthTime = info.borthTime ? moment(info.borthTime) : ''
			info.serveTime = info.serveTime ? moment(info.serveTime) : ''
			this.filterForm.setFieldsValue({
				serviceExecuteOrg: info.serviceExecuteOrg,
				customerType: info.customerType,
				teamName: info.teamName,
				teamNum: info.teamNum
			})
			this.$nextTick(() => {
				this.filterForm.setFieldsValue(info)
				if (info.status === '04') {
					this.filterForm.setFieldsValue({ auditContent: info.auditRemark })
				}
			})
		},
		// 获取管家信息
		getUserInfo () {
			api.getuserinfo().then(res => {
				if (res.data) {
					this.filterForm.setFieldsValue({ orgName: res.data.orgCode })
					this.filterForm.setFieldsValue({ staffName: res.data.staffName })
					this.filterForm.setFieldsValue({ staffNo: res.data.staffNo })
					this.filterForm.setFieldsValue({ systemNo: res.data.userName })
				}
			}).finally(() => {
				this.loading = false
			})
		},


		ServiceUnit () {
			let data = {
				customerType: this.userType,
				serveItem: this.serverProductName,
				serveItemSub: this.serverclass
			}
			api.serverunit(data).then(res => {
				console.log(res, "===========")
				// if(res.data[0].serveUnitLis!=null){
				let processingData = res.data[0].serveUnitList.join().split("-")[1]
				let processingCode = res.data[0].serveUnitList.join().split("-")[0]
				console.log(processingData + "------------的码值" + processingCode)
				this.serveUnitList = processingData
				this.selectSaveList = []
				this.selectSaveList.push({value: processingCode, label: processingData})
				this.filterForm.setFieldsValue({ serveUnit: processingData })
				this.serveUnit = processingCode
				// }
			})
		},
		// 查询服务单位为1的数据
		queryInput () {
			this.count++
			this.loading = true
			let data = {
				page: this.pagination.current,
				limit: this.pagination.pageSize,
				ServeSearchBo: {},
				statusType: "01"
			}
			api.queryInput(data).then(res => {
				if (res.status === 0) {
					this.pageData = res.data || { totalCount: 0, data: [] }
					this.pageData.data.forEach((item, index) => {
						item.recordIndex = index + 1
					})
					this.pagination.total = this.pageData.totalCount
					this.selectedRowKeys = []
					this.selectedRows =[]
				}
			}).finally(() => {
				this.loading = false
			})
		},
		queryDefault () {
			api.queryDefault().then(res => {
				this.defaultList = res.data
			})
		},
		handleSubmit (e) {
			e.preventDefault()
			this.form.validateFields((err, values) => {
				if (!err) {
					console.log('Received values of form: ', values)
				}
			})
		},
		handleSelectChange (value) {
			console.log(value)
			this.form.setFieldsValue({
				note: `Hi, ${value === 'male' ? 'man' : 'lady'}!`
			})
		},
		onChange (date, dateString) {
			console.log(date, dateString)
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
			this.queryInput()
			// let query = this.filterForm.getFieldsValue()
			// let data = {
			// 	page: this.pagination.current,
			// 	limit: this.pagination.pageSize
			// }
			// Object.assign(data, query)
			// this.loading = true
			// data.statusType = '01'
			// api.queryInput(data).then(res => {
			// 	console.log(res, "result")
			// 	this.pageData = res.data || { totalCount: 0, data: [] }
			// 	this.pageData.data.forEach((item, index) => {
			// 		item.recordIndex = index + 1
			// 	})
			// 	this.pagination.total = this.pageData.totalCount
			// }).finally(() => {
			// 	this.loading = false
			// })
		},
		resetFilterForm () {
			// this.loadPageData()
			this.hasCustomerNum = 'N'
			this.hasCustomerInfo = 'N'
			this.serveItemSubCode = ''
			this.filterForm.resetFields([
				'remark',
				'custChannel',
				'custTel',
				'teamNum',
				'teamName',
				'borthTime',
				'customeSex',
				'customeCertNum',
				'customeCertType',
				'customeName',
				'serveTime',
				'serviceProvider',
				'serveCount',
				'serveUnit',
				'serveItem',
				'serveItemSub',
				'vipNameCode',
				'realNameCode',
				'serviceExecuteOrg',
				'customerType'
			])
		},
		swithTableShow () {
			this.showTable = !this.showTable
			this.iconType = this.showTable ? "down" : "up"
		},

		// isunit(){
		// 		// if(this.isCustomer===&&this.isChoose&&this.isDetailClassfiy)
		// }
		checks (value, option) {
			console.log(value, option, '客户类型')
			this.isCustomer = value
			this.isChoose = value
			this.isDetailClassfiy = value
			this.hasCustomerNum = 'N'
			if (value == '02') {
				this.disabled = true
			} else {
				this.disabled = false
			}
			this.filterForm.setFieldsValue({serveItem:'',serveItemSub:'',serveCount:'',serveUnit: '',customerNum:''})
			this.serveUnitList =[]
		},
		serverProduct (value, option) {
			// console.log(value, option.componentOptions.children[0].text)
			this.serverProductName = value
			this.filterForm.setFieldsValue({serveItemSub:'',serveCount:'',serveUnit: '',customerNum:''})
		},
		serverclassfiy (value, option) {
			console.log(option, 'option00000000000000000000000000000000')
			console.log(value, 'option11111111111111111111111111111111111')
			// let serverclassfiySize = option.componentOptions.children[0].text
			// 清空服务单位
			this.filterForm.setFieldsValue({ serveUnit: '' })
			this.serverclass = value
			this.serveItemSubCode = value// 获取到服务细类的码值
			this.serveItemSub = option.componentOptions.children[0].text
			// this.isShow
			this.ServiceUnit()
			this.disabled = false
			// 查询数量是否只读
			this.defaultList.forEach((items, index) => {
				if (parseInt(items.performanceCode) === parseInt(value)) {
					this.filterForm.setFieldsValue({ serveCount: 1 })
					this.disabled = true
				}
			})
			// 客户人数隐藏展示判断
			if (value) {
				this.hasCustomerNum = this.$refs.servitemSubSelect.getHasCustomerNum(value)
				this.hasCustomerInfo = this.$refs.servitemSubSelect.getHasCustomerInfo(value)
			} else {
				this.hasCustomerNum = 'N'
				this.hasCustomerInfo = 'N'
			}
		},

		// auditName (value, option) {
		// 	console.log(data, value)
		// 	data.customerList.auditOperAccount = value
		// 	console.log(value, option, data.customerList, "1111111111111111111111")
		// },
		checkServeTime (serveTime) {
			let time = moment(serveTime + ' 23:59:59', "YYYY-MM-DD HH:mm:ss")
			let compare = moment(new Date()).subtract(2, 'months')
			if (time < compare) {
				this.$message.error("您录入的服务时间在2个月之前，请核实")
				// return true
			}
			if (moment(serveTime, "YYYY-MM-DD") > moment(new Date(), "YYYY-MM-DD")) {
				this.$message.error("服务日期不可大于当前日期")
				return true
			}
			return false
		}
	}
}
</script>
<style lang="css">
	.ant-table-wrapper /deep/ .no-pass {
		/* background-color: #f7f7f7; */
		background-color: #ffefe6;
	}
</style>
