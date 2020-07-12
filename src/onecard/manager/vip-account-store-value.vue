<template>
  <a-card :bordered="false">
    <a-card>
      <a-divider orientation="left">
        <a-icon type="bank" />查询条件
      </a-divider>
      <a-form :form="filterForm" :labelCol="filterFormLayout.labelCol" :wrapperCol="filterFormLayout.wrapperCol">
        <a-row :gutter="16">
          <a-col :span="6">
            <a-form-item label="会员姓名">
              <a-input v-decorator="['name', {initialValue: ''}]" />
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="证件号码">
              <a-input v-decorator="['idcard', {initialValue: ''}]" />
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="联系方式">
              <a-input v-decorator="['mobile', {initialValue: ''}]" />
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="会员卡号">
              <a-input v-decorator="['cardno', {initialValue: ''}]" />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :span="12" :offset="11">
            <a-button type="" class="editable-add-btn" @click="resetFilterForm" style="float:right;margin-right:10px;">重置</a-button>
            <a-button type="primary" class="editable-add-btn" @click="searchHandle" style="float:right;margin-right:10px;">查询</a-button>
          </a-col>
        </a-row>
      </a-form>
    </a-card>
    <a-card style="margin-top:24px;">
      <span href="#" slot="title" style="float:left;"><a-icon type="bank" />会员帐户列表</span>
      <a href="#" slot="extra">
        <a-icon :type="iconType" @click="swithTableShow" />
      </a>
      <a-table :bordered="false" :columns="columns" :dataSource="pageData.data" :indentSize="0" :loading="loading" :pagination="pagination" :rowKey="record => record.index" :rowSelection="rowSelection" :scroll="{ x: 'max-content'}" v-show="showTable"></a-table>
    </a-card>
    <a-card style="margin-top:24px;">
      <span href="#" slot="title" style="float:left;">
        <a-icon type="bank" />账户购买信息
      </span>
      <a-row :gutter="16" style="margin-bottom:12px;">
        <a-col :span="12" :offset="12">
          <div style="float:right">
            <a-button type="primary" :loading="printLoading" @click="printInsure" class="editable-add-btn" style="margin-right:5px;" >打印票据</a-button>
          </div>
        </a-col>
      </a-row>
      <a-form :form="saveForm" :labelCol="filterFormLayout.labelCol" :wrapperCol="filterFormLayout.wrapperCol">
        <a-row :gutter="16">
          <a-col :span="6">
            <a-form-item label="试销计划">
              <DicSelect @select="doChecksxtype" dicType="VIP_SX_TYPE" placeholder="请选择试销计划" v-decorator="[ 'sxtype',{initialValue:'',rules: [{ required: true, message: '请选择试销计划!' }]}]" />
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="购买金额">
              <a-input-number :disabled="inputCompact.sxtypeDisabled"
                              :formatter="value => `￥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')" :min="100"
                              :parser="value => value.replace(/\￥\s?|(,*)/g, '')" @blur="doCheckMoney"
                              @pressEnter="doCheckMoney"
                              v-decorator="['money', {rules: [{ required: true, message: '请选择购买金额!' }]}]"/>
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="推荐人工号" >
              <a-input
                v-decorator="['refereecode', {rules: [{ required: true, message: '请填写推荐人工号' }]}]"
                @pressEnter="refereecodeCheck"
                @blur="refereecodeCheck"
              />
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="推荐人姓名">
              <a-input :disabled="true" v-decorator="['refereename', {initialValue: ''}]"/>
              <a-input type="hidden" v-decorator="['vipId',{initialValue: ''}]"/>
              <a-input type="hidden" v-decorator="['id',{initialValue: ''}]"/>
              <a-input type="hidden" v-decorator="['status',{initialValue: ''}]"/>
              <a-input type="hidden" v-decorator="['insuretype',{initialValue: ''}]"/>
              <a-input type="hidden" v-decorator="['unitCode', {initialValue: ''}]"/>
              <a-input type="hidden" v-decorator="['unitName', {initialValue: ''}]"/>
              <a-input type="hidden" v-decorator="['agentchannelName', {initialValue: ''}]"/>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :span="6">
            <a-form-item label="推荐人手机号" class="form-item-label-long">
              <a-input :disabled="true" v-decorator="['refereemobile', {initialValue: ''}]" />
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="销售渠道">
              <DicSelect :disabled="true" dicType="VIP_SALECHNL" v-decorator="[ 'agentchannel',{initialValue:''}]" />
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="中介公司">
              <a-select :disabled="inputCompact.agentcomcodeDisabled" v-decorator="['agentcomcode', {initialValue: ''}]">
                <a-select-option v-for="(item, index) in inputCompact.agentComList" :value="item.value" :key="index">{{ item.label }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="交叉销售渠道" class="form-item-label-long">
              <DicSelect :disabled="inputCompact.unisaleschannelDisabled"
                         :labelInValue="true" @select="value => formSetting(value,{rowkey:'unisaleschannel'})"
                         dicType="VIP_UNI_SALECHNL"
                         v-decorator="[ 'unisaleschannelTemp',{initialValue:''}]"/>
              <a-input type="hidden" v-decorator="['unisaleschannel']"/>
              <a-input type="hidden" v-decorator="['unisaleschannelName']"/>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :span="6">
            <a-form-item label="交叉销售业务类型" class="form-item-label-long">
              <DicSelect :disabled="inputCompact.unisaleschannelDisabled" :labelInValue="true"
                         @select="value => formSet(value,{rowkey:'unisalesbusitype'})" dicType="VIP_UNI_SALEBUSI"
                         v-decorator="[ 'unisalesbusitypeTemp',{initialValue:''}]"/>
              <a-input type="hidden" v-decorator="['unisalesbusitype']"/>
              <a-input type="hidden" v-decorator="['unisalesbusitypeName']"/>
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="对方业务员编号" class="form-item-label-long">
              <a-input :disabled="(inputCompact.unisaleschannelDisabled || editable === 'view')"
                       @blur="uniagentcodeCheck" @pressEnter="uniagentcodeCheck"
                       v-decorator="['uniagentcode', {initialValue: ''}]"/>
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="对方业务员姓名" class="form-item-label-long">
              <a-input :disabled="true" v-decorator="['uniagentname', {initialValue: ''}]" />
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="对方业务员身份证" class="form-item-label-long">
              <a-input :disabled="true" v-decorator="['uniagentidno', {initialValue: ''}]" />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :span="6">
            <a-form-item label="对方机构编码" class="form-item-label-long">
              <a-input :disabled="true" @blur="uniagentcodeCheck" @pressEnter="uniagentcodeCheck"
                       v-decorator="['uniagentunitcode', {initialValue: ''}]"/>
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="对方机构名称" class="form-item-label-long">
              <a-input :disabled="true" v-decorator="['uniagentunitname', {initialValue: ''}]" />
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="生效日期">
              <a-week-picker format="YYYY-MM-DD" v-decorator="['contnostartdate']"/>
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="满期日期">
              <a-week-picker format="YYYY-MM-DD" v-decorator="['contnoenddate']"/>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :span="6">
            <a-form-item label="账户管理费(%)" class="form-item-label-long">
              <a-input-number :formatter="value => `${value}%`" :parser="value => value.replace('%', '')" :min="0"
                              v-decorator="['accmanagefee', {initialValue: '0',rules: [{ required: true, message: '账户管理费必须大于0！' }]}]"/>
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="账户解约管理费(%)" class="form-item-label-long">
              <a-input-number :formatter="value => `${value}%`" :parser="value => value.replace('%', '')" :min="0"
                              v-decorator="['accrelieffee', {initialValue: '0'}]"/>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </a-card>
  </a-card>
</template>
<script>
import api from "@/api/api-vip"
import DicSelect from "@/components/dic-select"
import AddressSelect from "@/components/address-select"
import {formatMoney} from "../../libs/util"

export default {
	name: "vip-account-store-value",
	components: {DicSelect, AddressSelect},
	data () {
		return {
			// 查询条件
			filterFormLayout: {
				labelCol: {span: 10},
				wrapperCol: {span: 14}
			},
			pageData: {
				dataCount: 0,
				data: []
			},
			filterForm: this.$form.createForm(this),
			saveForm: this.$form.createForm(this),
			inputCompact: {
				agentcomcodeDisabled: true,
				agentComList: [],
				unisaleschannelDisabled: true,
				sxtypeDisabled: false
			},
			tabledata: [],
			cardTypeList: [],
			loading: false,
			printLoading: false,
			showTable: true,
			printCardType: '',
			currentCard: '',
			currentCardCode: '',
			iconType: "down",
			columns: [
				{
					align: "left",
					dataIndex: "name",
					title: "会员姓名"
				},
				{
					align: "left",
					dataIndex: "cardno",
					title: "会员卡号"
				},
				{
					align: "left",
					dataIndex: "idcardtypeName",
					title: "证件类型"
				},
				{
					align: "left",
					dataIndex: "idcard",
					title: "证件号"
				},
				{
					align: "left",
					dataIndex: "mobile",
					title: "联系方式"
				},
				{
					align: "left",
					dataIndex: "money",
					title: "账户余额",
					customRender: (text) => {
						return text ? '￥' + formatMoney(text, 2) : ''
					}
				},
				{
					align: "left",
					dataIndex: "cardtypename",
					title: "会员卡类型"
				},
				{
					align: "left",
					dataIndex: "gradetypename",
					title: "会员级别"
				},
				{
					align: "left",
					dataIndex: "typeName",
					title: "卡形式"
				},
				{
					align: "left",
					dataIndex: "accountmoneytypeName",
					title: "账户类型"
				},
				{
					align: "left",
					dataIndex: "statusName",
					title: "账户状态"
				}
			],

			rowSelection: {
				type: "radio",
				selectedRows: [],
				selectedRowKeys: [],
				onChange: this.radioChange
			},
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
	mounted () {
		this.getCardTypeList()
	},
	methods: {
		searchHandle () {
			let query = this.filterForm.getFieldsValue()
			if (query.name === "" && query.idcard === "" &&
        query.mobile === "" && query.cardno === "") {
				this.$message.warning("请至少输入一个检索条件!")
				return
			}
			this.$nextTick(() => {
				this.pagination.current = 1
				this.loadPageData()
			})
		},
		loadPageData () {
			// ''
			let query = this.filterForm.getFieldsValue()
			let data = {
				page: this.pagination.current,
				limit: this.pagination.pageSize,
				accountmoneytype: '1'
			}
			Object.assign(data, query)
			this.loading = true
			api.queryVipStoreValueAccountInfo(data).then(res => {
				this.pageData = res.data || {totalCount: 0, data: []}
				this.pageData.data.forEach((item, index) => {
					item.recordIndex = index + 1
				})
				this.pagination.total = this.pageData.totalCount
			}).finally(() => {
				this.loading = false
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
		// 点击单选框实现选中效果
		radioChange (selectedRowKeys, selectedRows) {
			''
			// 重置表单项数据
			this.saveForm.resetFields()
			this.rowSelection.selectedRows = []
			this.rowSelection.selectedRowKeys = []
			this.rowSelection.selectedRows = selectedRows
			this.rowSelection.selectedRowKeys = selectedRowKeys
			this.tabledata[0] = this.pageData.data[this.rowSelection.selectedRowKeys[0]]
			// 重置表单项数据
			this.saveForm.resetFields()
			// 设置表单默认值
			let record = this.tabledata[0]
			this.setSaveFormData(record)
			if (record.refereecode) this.refereecodeCheck()
			if (record.uniagentcode) this.uniagentcodeCheck()
		},
		setSaveFormData (record) {
			debugger
			let refereecode = record.refereecode
			/* if (refereecode === null || refereecode === undefined || refereecode === '') return */
			this.saveForm.setFieldsValue({
				refereecode: record.refereecode,
				agentchannel: record.agentchannel,
				vipId: record.vipid,
				id: record.id,
				status: record.status,
				insuretype: record.insuretype
			})
		},
		resetFilterForm () {
			this.filterForm.resetFields()
			this.rowSelection.selectedRows = []
			this.rowSelection.selectedRowKeys = []
		},
		swithTableShow () {
			this.showTable = !this.showTable
			this.iconType = this.showTable ? "down" : "up"
		},
		// 推荐人信息
		refereecodeCheck () {
			let that = this
			let refereecode = that.saveForm.getFieldValue("refereecode")
			api.refereecodeCheck(refereecode).then(res => {
				if (res.status !== 0) {
					that.$message.warning(res.statusText)
				}
				if (res.data.flag) {
					let agentchannel = res.data.agentchannelcode
					if (agentchannel === "17") {
						// 如果是健管直销，可以选择中介公司，否则不可选择
						that.inputCompact.agentcomcodeDisabled = false
						let agentObj = {
							agentCode: res.data.agentCode,
							limit: 100,
							page: 0
						}
						api.queryAgentCom(agentObj).then(rescom => {
							that.inputCompact.agentComList = []
							if (rescom.data.length > 0) {
								rescom.data.map(item => {
									that.inputCompact.agentComList.push({
										value: item.agencyunitcode,
										label: item.agencyunitname
									})
								})
							}
						})
					} else {
						that.inputCompact.agentcomcodeDisabled = true
						that.inputCompact.agentComList = []
						that.saveForm.setFieldsValue({agentcomcode: ''})
					}
					that.saveForm.setFieldsValue({
						refereename: res.data.agentName,
						refereemobile: res.data.agentmobile,
						agentchannel: res.data.agentchannelcode,
						agentchannelName: res.data.agentchannelName,
						unitCode: res.data.unitCode,
						unitName: res.data.unitName,
						agentunit: res.data.agentunit
					})
					// 查询交叉销售员
					if (agentchannel === "14" || agentchannel === "15") {
						that.inputCompact.unisaleschannelDisabled = false
					} else {
						that.inputCompact.unisaleschannelDisabled = true
						that.saveForm.setFieldsValue({
							unisaleschannel: '',
							unisalesbusitype: '',
							uniagentcode: '',
							uniagentname: '',
							uniagentidno: '',
							uniagentunitcode: '',
							uniagentunitname: ''
						})
					}
				} else {
					that.inputCompact.agentcomcodeDisabled = true
					that.inputCompact.agentComList = []
					that.inputCompact.unisaleschannelDisabled = true
					that.saveForm.setFieldsValue({
						unisaleschannel: '',
						unisalesbusitype: '',
						uniagentcode: '',
						uniagentname: '',
						uniagentidno: '',
						uniagentunitcode: '',
						uniagentunitname: '',
						refereecode: '',
						refereename: '',
						refereemobile: '',
						agentchannel: '',
						unitcode: '',
						unitname: '',
						agentcomcode: ''
					})
					that.$message.warning("无此工号")
				}
			})
		},
		formSetting (LabeledValue, option) {
			let unisaleschannel = option.rowkey
			let unisaleschannelName = option.rowkey + 'Name'
			this.saveForm.setFieldsValue({unisaleschannel: LabeledValue.key, unisaleschannelName: LabeledValue.label})
		},
		formSet (LabeledValue, option) {
			let unisalesbusitype = option.rowkey
			let unisalesbusitypeName = option.rowkey + 'Name'
			this.saveForm.setFieldsValue({unisalesbusitype: LabeledValue.key, unisalesbusitypeName: LabeledValue.label})
		},
		doChecksxtype (value) {
			let sxtype = value
			if (sxtype === "0") {
				this.inputCompact.sxtypeDisabled = false
				this.saveForm.setFieldsValue({money: ''})
			} else if (sxtype === "1") {
				this.inputCompact.sxtypeDisabled = true
				this.saveForm.setFieldsValue({money: "3000"})
				this.doCheckMoney()
			} else if (sxtype === "2") {
				this.inputCompact.sxtypeDisabled = true
				this.saveForm.setFieldsValue({money: "10000"})
				this.doCheckMoney()
			} else if (sxtype === "3") {
				this.inputCompact.sxtypeDisabled = true
				this.saveForm.setFieldsValue({money: "50000"})
				this.doCheckMoney()
			} else if (sxtype === "4") {
				this.inputCompact.sxtypeDisabled = true
				this.saveForm.setFieldsValue({money: "100000"})
				this.doCheckMoney()
			}
		},
		doCheckMoney () {
			let money = parseInt(this.saveForm.getFieldValue('money'))
			if (money > 99999999.99) {
				this.$message.error('数据不能超过99999999.99，请重新输入！')
				this.saveForm.setFieldsValue({money: ''})
				return
			}
			if (money < 100) {
				this.$message.error('储值金额必须大于等于100元')
				this.saveForm.setFieldsValue({money: ''})
				return
			}
			if (money === 3000) {
				this.saveForm.setFieldsValue({sxtype: '1'})
			} else if (money === 10000) {
				this.saveForm.setFieldsValue({sxtype: '2'})
			} else if (money === 50000) {
				this.saveForm.setFieldsValue({sxtype: '3'})
			} else if (money === 100000) {
				this.saveForm.setFieldsValue({sxtype: '4'})
			} else {
				this.saveForm.setFieldsValue({sxtype: '0'})
			}
			let self = this
			// 根据储值金额判断会员卡类别，设置预约使用人的最大数
			self.cardTypeList.forEach(p => {
				if (parseInt(p.moneystart) <= money && money <= parseInt(p.moneyend)) {
					self.currentCard = p.name
					self.currentCardCode = p.code
				}
			})
			if (this.currentCardCode === '01') {
				this.printCardType = '至尚卡，首次购买金额1,000-10,000元（不含）'
			} else if (this.currentCardCode === '02') {
				this.printCardType = '至珍卡，首次购买金额10,000-50,000元（不含）'
			} else if (this.currentCardCode === '03') {
				this.printCardType = '至享卡，首次购买金额50,000-100,000元（不含）'
			} else if (this.currentCardCode === '04') {
				this.printCardType = '至尊卡，首次购买金额≥100,000元'
			}
		},
		getCardTypeList () {
			api.getCardTypeList().then(res => {
				this.cardTypeList = res.data
			}
			)
		},
		// 查询对方业务员信息
		uniagentcodeCheck () {
			let that = this
			let uniagentObj = {
				uniagentCode: this.saveForm.getFieldValue('uniagentcode'),
				unitCode: this.saveForm.getFieldValue('unitCode')
			}
			api.uniagentcodeCheck(uniagentObj).then(res => {
				if (res.flag) {
					that.saveForm.setFieldsValue({
						uniagentname: res.uniagentname,
						uniagentidno: res.uniagentidno,
						uniagentunitcode: res.uniagentunitcode,
						uniagentunitname: res.uniagentunitname
					})
				} else {
					that.saveForm.setFieldsValue({
						uniagentcode: '',
						uniagentname: '',
						uniagentidno: '',
						uniagentunitcode: '',
						uniagentunitname: ''
					})
					that.$message.warning("无此交叉工号，请重新填写。")
				}
			})
		},
		printInsure () {
			if (parseInt(this.saveForm.getFieldValue('accmanagefee')) <= 0) {
				this.$message.error('账户管理费必须大于0！')
				return
			}
			let self = this
			let data = this.saveForm.getFieldsValue()
			delete data.unisaleschannelTemp
			delete data.unisalesbusitypeTemp
			this.saveForm.validateFields((error, values) => { // TODO
				if (error) {
					this.$message.error('您填写的数据有误或者必填项没填!')
					return
				}
				if (parseInt(data.status) === 1) {
					this.$message.error("新建状态的账户不能储值!")
					return
				}
				if (this.rowSelection.selectedRowKeys.length === 0) {
					this.$message.error("请选择一个会员账户")
					return
				}
				this.$confirm({
					title: '确认框',
					content: `确认打印票据？`,
					okType: 'danger',
					onOk () {
						return new Promise((resolve, reject) => {
							self.printLoading = true
							api.saveStoreValueAppl(data).then(res => {
								if (res.status === 0) {
									self.$message.success('保存成功')
									let iscom = !(parseInt(data.insuretype) === 1)
									data.printCardType = self.printCardType
									if (iscom) {
										api.vipStorePrintCom(data).then(res => {
											if (res.status === undefined) {
												// base64内容，文件名
												self.$downloadFileByBase64(res, '团体客户贴心管家健康保障委托管理购买信息单')
											} else {
												self.$message.error('打印票据失败')
											}
										})
									} else {
										api.vipStorePrint(data).then(res => {
											if (res.status === undefined) {
												// base64内容，文件名
												self.$downloadFileByBase64(res, '贴心管家健康保障委托管理购买信息单')
											} else {
												self.$message.error('打印票据失败')
											}
										})
									}
								} else {
									self.$message.error(res.statusText)
								}
							}).finally(() => {
								resolve()
								self.printLoading = false
							})
						})
					}
				})
			})
		}

	}
}
</script>
