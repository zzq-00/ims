<template>
  <a-card :bordered="false">
    <a-card>
      <a-divider orientation="left"><a-icon type="bank" /> 查询条件</a-divider>
      <a-form :form="filterForm" :labelCol="filterFormLayout.labelCol" :wrapperCol="filterFormLayout.wrapperCol">
        <a-row :gutter="16">
          <a-col :span="6">
            <a-form-item label="投保人">
              <a-input v-decorator="['name', {initialValue: ''}]" />
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="联系方式">
              <a-input v-decorator="['mobile', {initialValue: ''}]" />
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="证件类型">
              <DicSelect dicType="VIP_IDCARDTYPE" placeholder="请选择证件类型" v-decorator="[ 'idcardtype', {initialValue: ''}]" />
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="证件号码">
              <a-input v-decorator="['idcard', {initialValue: ''}]" />
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="发卡状态">
              <DicSelect dicType="VIP_SENDCARDSTATUS" placeholder="未发卡" v-decorator="[ 'sendFlag', {initialValue: '1'}]" @change="searchHandle"/>
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="活动类型">
              <DicSelect dicType="VIP_ACTIVE_TYPE" placeholder="全部" v-decorator="[ 'datetype', {initialValue: '9'}]" />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :offset="11" :span="12">
            <a-button @click="resetFilterForm" class="editable-add-btn" style="float:right;margin-right:10px;" type="">重置</a-button>
            <a-button @click="searchHandle" class="editable-add-btn" style="float:right;margin-right:10px;" type="">查询</a-button>
          </a-col>
        </a-row>
      </a-form>
    </a-card>
    <a-card style="margin-top:24px;">
      <span href="#" slot="title" style="float:left;">
        <a-icon type="bank" />待发卡列表</span>
      <a href="#" slot="extra">
        <a-icon :type="iconType" @click="swithTableShow" />
      </a>
      <a-table  :scroll="{ x: 'max-content'}" v-show="showTable" :bordered="false" :pagination="pagination" :rowSelection="rowSelection" :dataSource="pageData.data" :columns="columns" :rowKey="index => index.index" :indentSize=0 :loading="loading">

      </a-table>
    </a-card>

    <a-card style="margin-top:24px;">
      <span href="#" slot="title" style="float:left;">
        <a-icon type="bank" />发卡信息录入</span>
      <a-row :gutter="16" style="margin-bottom:12px;">
        <a-col :span="12" :offset="12">
          <div style="float:right">
            <a-button :loading="submitLoading" v-show ="saveDisabled"  @click="saveHandle" class="editable-add-btn" style="margin-right:5px;" type="primary">保存</a-button>
            <a-button type="" :loading="printLoading"  class="editable-add-btn" @click="printInfo" style="margin-right:5px;">打印票据</a-button>
          </div>
        </a-col>
      </a-row>
        <a-form :form="saveForm" :labelCol="filterFormLayout.labelCol" :wrapperCol="filterFormLayout.wrapperCol">
          <a-row :gutter="16">
            <a-col :span="6">
              <a-form-item label="卡号">
                <a-input v-decorator="['cardno',{rules: [{ required: true, message: '卡号不能为空!' }]}]" />
                <a-input type="hidden" v-decorator="['name']"/>
                <a-input type="hidden" v-decorator="['mobile']"/>
                <a-input type="hidden" v-decorator="['idcard']"/>
                <a-input type="hidden" v-decorator="['statusName']"/>
                <a-input type="hidden" v-decorator="['cardtypename']"/>
                <a-input type="hidden" v-decorator="['cardtypecode']"/>
                <a-input type="hidden" v-decorator="['cardno']"/>
                <a-input type="hidden" v-decorator="['accountid']"/>
                <a-input type="hidden" v-decorator="['vipid']"/>
                <a-input type="hidden" v-decorator="['id']"/>
                <a-input type="hidden" v-decorator="['remark']"/>
              </a-form-item>
            </a-col>
            <a-col :span="6">
              <a-alert showIcon message="刷卡时,请将光标移到卡号控件内！" type="warning" />
            </a-col>
            <a-col :span="6">
              <a-form-item label="领取方式">
                <DicSwitch :value="saveForm.getFieldsValue(['dealtype']).dealtype" @change="dealTypeChange" dicType="VIP_DEALTYPE" v-decorator="['dealtype',{initialValue: inputCompact.dealtypeValue}]"/>
              </a-form-item>
            </a-col>
            <a-col :span="6">
              <a-form-item label="邮寄方式">
                <DicSwitch :value="saveForm.getFieldValue('receivetype')" @change="receiveTypeChange" dicType="VIP_RECEIVETYPE" v-decorator="['receivetype', {initialValue: inputCompact.receivetypeValue}]"/>
              </a-form-item>
            </a-col>
            <a-col :span="6">
              <a-form-item label="销售渠道">
                <DicSelect dicType="VIP_SALECHNL" v-decorator="[ 'agentchannel']" />
              </a-form-item>
            </a-col>
            <a-col :span="6">
              <a-form-item label="代领人姓名">
                <a-input :disabled="(inputCompact.dealtypeValue == saveForm.getFieldsValue(['dealtype']).dealtype)"
                         v-decorator="['agentName', {rules: [(inputCompact.dealtypeValue == saveForm.getFieldsValue(['dealtype']).dealtype)?{ required: false, message: '' }:{ required: true, message: '代领人姓名不能为空!' }]}]"/>
              </a-form-item>
            </a-col>
            <a-col :span="6">
              <a-form-item label="代领人电话">
                <a-input :disabled="(inputCompact.dealtypeValue == saveForm.getFieldsValue(['dealtype']).dealtype)"
                         v-decorator="['agentmobile', {rules: [(inputCompact.dealtypeValue == saveForm.getFieldsValue(['dealtype']).dealtype)?{ required: false, message: '' }:{ required: true, message: '代领人电话不能为空!' }]}]"/>
              </a-form-item>
            </a-col>
            <a-col :span="6">
              <a-form-item label="代领人机构">
                <a-input :disabled="(inputCompact.dealtypeValue == saveForm.getFieldsValue(['dealtype']).dealtype)"
                         v-decorator="['unitname', {initialValue: ''}]"/>
              </a-form-item>
            </a-col>
            <a-col :span="6">
              <a-form-item label="邮寄省份" >
                <AddressSelect :disabled="(inputCompact.receivetypeValue == saveForm.getFieldValue('receivetype'))" dicType="0" placeholder="请选择邮寄省份" v-decorator="[
                      'receiveprovince',
                      {initialValue: '',rules: [(inputCompact.receivetypeValue == saveForm.getFieldValue('receivetype'))?{required: false, message: ''}:{ required: true, message: '请选择省份!' }]}
                      ]" @change="hasCascadeDefaultProvince=true"></AddressSelect>
              </a-form-item>
            </a-col>
            <a-col :span="6">
              <a-form-item label="邮寄城市">
                <AddressSelect :hasCascadeDefault="hasCascadeDefaultProvince" :dicType="saveForm.getFieldValue('receiveprovince')"
                               :disabled="(inputCompact.receivetypeValue == saveForm.getFieldValue('receivetype'))"
                               placeholder="请选择" v-decorator="[
                      'receivecity',
                      {initialValue: '',rules: [(inputCompact.receivetypeValue == saveForm.getFieldValue('receivetype'))?{ required: false, message: '' }:{ required: true, message: '请选择邮寄城市!' }]}
                      ]" @change="hasCascadeDefaultCity=true"></AddressSelect>
              </a-form-item>
            </a-col>
            <a-col :span="6">
              <a-form-item label="邮寄区县">
                <AddressSelect :hasCascadeDefault="hasCascadeDefaultProvince || hasCascadeDefaultCity" :dicType="saveForm.getFieldValue('receivecity')"
                               :disabled="(inputCompact.receivetypeValue == saveForm.getFieldValue('receivetype'))"
                               placeholder="请选择邮寄区县" v-decorator="['receivedistrict',
                               {initialValue: '',rules: [(inputCompact.receivetypeValue == saveForm.getFieldValue('receivetype'))?{required: false, message: '' }:{ required: true, message: '请选择邮寄城市!' }] }
                               ]"></AddressSelect>
              </a-form-item>
            </a-col>
            <a-col :span="6">
              <a-form-item label="邮寄地址">
                <a-input
                  :disabled="(inputCompact.receivetypeValue == saveForm.getFieldsValue(['receivetype']).receivetype)"
                  v-decorator="['receiveremark',{rules: [(inputCompact.receivetypeValue == saveForm.getFieldsValue(['receivetype']).receivetype)?{ required: false, message: '' }:{ required: true, message: '邮寄地址不能为空!' }]}]"/>
              </a-form-item>
            </a-col>
          </a-row>
        </a-form>
    </a-card>
  </a-card>
</template>
<script>
import api from '@/api/api-vip'
import DicSelect from '@/components/dic-select'
import DicSwitch from '@/components/dic-switch'
import AddressSelect from '@/components/address-select'
import moment from 'moment'
import {formatMoney} from '@/libs/util'
export default {
	name: 'vip-sendcard-post-main',
	components: { DicSelect, DicSwitch, AddressSelect },
	data () {
		return {
			inputCompact: {
				dealtypeValue: 1,
				receivetypeValue: 1
			},
			// 查询条件
			filterFormLayout: {
				labelCol: { span: 9 },
				wrapperCol: { span: 15 }
			},
			filterForm: this.$form.createForm(this),
			saveForm: this.$form.createForm(this),
			pageData: {
				dataCount: 0,
				data: []
			},
			loading: false,
			saveDisabled: false,
			submitLoading: false,
			printLoading: false,
			showTable: true,
			iconType: 'down',
			rowSelection: {
				type: 'radio',
				selectedRows: [],
				selectedRowKeys: [],
				onChange: this.radioChange
			},
			tabledata: [],
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
			currRowIndex: -1,
			columns: [
				{
					align: "left",
					dataIndex: "datetypeName",
					title: "活动名称"
				},
				{
					align: "left",
					dataIndex: "unitname",
					title: "发卡机构"
				},
				{
					align: "left",
					dataIndex: "agentchannelName",
					title: "销售渠道"
				},
				{
					align: "left",
					dataIndex: "name",
					title: "投保人"
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
					dataIndex: "cardtypename",
					title: "会员卡类型"
				},
				{
					align: "left",
					dataIndex: "statusName",
					title: "发卡原因"
				},
				{
					align: "left",
					dataIndex: "cardno",
					title: "会员卡号"
				},
				{
					align: "left",
					dataIndex: "sendcardtime",
					title: "发卡时间",
					customRender: (text) => {
						return text ? moment(text).format('YYYY-MM-DD') : ''
					}
				},
				{
					align: "left",
					dataIndex: "createtime",
					title: "缴费确认时间",
					customRender: (text) => {
						return text ? moment(text).format('YYYY-MM-DD HH:mm:ss') : ''
					}
				}
			],
			hasCascadeDefaultProvince: false,
			hasCascadeDefaultCity: false
		}
	},
	mounted () {
		this.searchHandle()
	},
	methods: {
	  dealTypeChange (type) {
		  if (type === '1') {
			  this.saveForm.resetFields(`agentmobile`, '')
			  this.saveForm.resetFields(`agentname`, '')
		  }
	  },
	  receiveTypeChange (type) {
		  if (type === '1') {
			  this.saveForm.resetFields(`receiveprovince`, '')
			  this.saveForm.resetFields(`receivecity`, '')
			  this.saveForm.resetFields(`receivedistrict`, '')
			  this.saveForm.resetFields(`receiveremark`, '')
		  }
	  },
	  resetFilterForm () {
			this.filterForm.resetFields()
			this.rowSelection.selectedRows = []
			this.rowSelection.selectedRowKeys = []
			// this.searchHandle()
		},
		searchHandle () {
			this.$nextTick(() => {
				this.pagination.current = 1
				if (parseInt(this.filterForm.getFieldValue("sendFlag")) === 2) {
					this.saveDisabled = false
				} else {
					this.saveDisabled = true
				}
				this.rowSelection.selectedRows = []
				this.rowSelection.selectedRowKeys = []
				this.loadPageData()
			})
		},
		loadPageData () {
			this.rowSelection.selectedRows = []
			this.rowSelection.selectedRowKeys = []
			let query = this.filterForm.getFieldsValue()
			let data = {
				page: this.pagination.current,
				limit: this.pagination.pageSize

			}
			Object.assign(data, query)
			this.loading = true

			api.queryForSend1(data).then(res => {
				this.pageData = res.data || { totalCount: 0, data: [] }
				this.pageData.data.forEach((item, index) => { item.recordIndex = index + 1 })
				this.pagination.total = this.pageData.totalCount
			}).finally(() => {
				this.saveForm.resetFields()
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
			// 重置表单项数据
			this.saveForm.resetFields()
			// 	// 每次新加载数据都不联动
           	this.hasCascadeDefaultProvince = false
           	this.hasCascadeDefaultCity = false
			this.rowSelection.selectedRows = []
			this.rowSelection.selectedRowKeys = []
			this.rowSelection.selectedRows = selectedRows
			this.rowSelection.selectedRowKeys = selectedRowKeys
			this.tabledata[0] = this.pageData.data[this.rowSelection.selectedRowKeys[0]]
			// 设置表单默认值
			this.resetSaveFormData()
		},
		resetSaveFormData () {
			this.saveForm.setFieldsValue(this.tabledata[0])
			this.saveForm.setFieldsValue({ receiveprovince: this.tabledata[0].receiveprovince })
			this.saveForm.setFieldsValue({ receivecity: this.tabledata[0].receivecity })
			this.saveForm.setFieldsValue({ receivedistrict: this.tabledata[0].receivedistrict})
			this.saveForm.setFieldsValue({ accountid: this.tabledata[0].accountid })
			this.saveForm.setFieldsValue({ agentName: this.tabledata[0].agentname })
			this.saveForm.setFieldsValue({ vipid: this.tabledata[0].vipid })
			this.saveForm.setFieldsValue({ id: this.tabledata[0].id })
			this.saveForm.setFieldsValue({ cardtypecode: this.tabledata[0].cardtypecode })
			this.saveForm.setFieldsValue({ dealtype: this.tabledata[0].dealtype || 1})
			this.saveForm.setFieldsValue({ receivetype: this.tabledata[0].receivetype || 1})
			this.tabledata = []
		},
		swithTableShow () {
			this.showTable = !this.showTable
			this.iconType = this.showTable ? 'down' : 'up'
		},
		saveHandle () {
			let that = this
			// 校验表单
			this.saveForm.validateFields((error, values) => { // TODO
			  debugger
				this.submitLoading = true
				if (error) {
					this.submitLoading = false
					that.$message.error('您填写的数据有误或者必填项没填!')
					return
				}
				let data = that.saveForm.getFieldsValue()
				let selectedRecords = that.rowSelection.selectedRowKeys.map(val => {
					return this.pageData.data[val]
				})
				debugger
				selectedRecords[0].dealtype = that.saveForm.getFieldValue("dealtype")
				selectedRecords[0].receivetype = that.saveForm.getFieldValue("receivetype")
				selectedRecords[0].agentchannel = that.saveForm.getFieldValue("agentchannel")
				selectedRecords[0].agentmobile = that.saveForm.getFieldValue("agentmobile")
				selectedRecords[0].agentunit = that.saveForm.getFieldValue("agentunit")
				selectedRecords[0].receiveprovince = that.saveForm.getFieldValue("receiveprovince")
				selectedRecords[0].receivecity = that.saveForm.getFieldValue("receivecity")
				selectedRecords[0].receivedistrict = that.saveForm.getFieldValue("receivedistrict")
				selectedRecords[0].receiveremark = that.saveForm.getFieldValue("receiveremark")
				Object.assign(data, selectedRecords[0])
				data.cardno = that.saveForm.getFieldValue("cardno")
				data.agentName = that.saveForm.getFieldValue("agentName")
				api.saveVipSendcardForSend1(data).then(res => {
					if (res.status === 0) {
						that.$confirm({
							title: "确认框",
							content: `保存成功!!!!`,
							okType: "danger",
							onOk () {
								debugger
								api.printSendCard(data).then(res => {
									debugger
									if (res.status === undefined) {
										that.$downloadFileByBase64(res, '人民健康一卡通')
										that.loadPageData()
									} else {
										that.$message.error('打印票据失败')
									}
								})
							}
						})
					} else {
						that.$message.error('保存失败')
					}
				}).finally(() => {
				  this.submitLoading = false
				})
			})
		},
		printInfo () {
			let that = this
			that.printLoading = true
			// 校验表单
			this.saveForm.validateFields((error, values) => { // TODO
				if (error) {
					return
				}
				let data = that.saveForm.getFieldsValue()
				api.printSendCard(data).then(res => {
					if (res.status === undefined) {
						this.$downloadFileByBase64(res, '人民健康一卡通')
					} else {
						that.$message.error('打印失败')
					}
				}).finally(() => { that.printLoading = false })
			})
		}
	}
}
</script>
