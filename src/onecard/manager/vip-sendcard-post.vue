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
              <DicSelect dicType="VIP_IDCARDTYPE" placeholder="请选择证件类型" v-decorator="[ 'idcardtype']" />
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="证件号码">
              <a-input v-decorator="['idcard', {initialValue: ''}]" />
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="邮寄状态">
              <DicSelect dicType="VIP_POST_STATUS" v-decorator="[ 'sendFlag', {initialValue: '2'}]" @change="allSearch"/>
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="数据类型">
              <DicSelect dicType="VIP_ACTIVE_TYPE" v-decorator="[ 'datetype', {initialValue: '9'}]"/>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :span="12" :offset="11">
            <a-button @click="resetFilterForm" class="editable-add-btn" style="float:right;margin-right:10px;" type="">重置</a-button>
            <a-button @click="allSearch" class="editable-add-btn" style="float:right;margin-right:10px;" type="">查询</a-button>
          </a-col>
        </a-row>
      </a-form>
    </a-card>
    <a-card style="margin-top:24px;">
      <span href="#" slot="title" style="float:left;">
        <a-icon type="bank" />自领邮寄列表</span>
      <a href="#" slot="extra">
        <a-icon :type="iconType" @click="swithTableShow" />
      </a>
      <a-row :gutter="16" style="margin-bottom:12px;">
        <a-col :span="12" :offset="12">
          <div style="float:right">
            <a-button @click="saveUpHandle" :loading="upSubmitLoading" class="editable-add-btn" style="margin-right:5px;" type="primary">保存</a-button>
            <a-button @click="exportUpHandle" class="editable-add-btn" style="margin-right:5px;" type="">导出Excel</a-button>
          </div>
        </a-col>
      </a-row>
      <a-table :bordered="false" :columns="columns" :dataSource="pageData.data" :indentSize=0 :loading="loading" :pagination="pagination" :rowKey="record => record.index" :rowSelection="rowSelection" :scroll="{ x: 'max-content'}" v-show="showTable">
        <div slot="sendposttime" slot-scope="text, record, index">
          <a-week-picker format="YYYY-MM-DD" v-if="record.editable" v-model="record.sendposttime"/>
          <span v-if="!record.editable">{{dateRender(text)}}</span></div>
        <div slot="expressname" slot-scope="text, record, index">
          <DicSelect  v-if="record.editable" :value="{key:record.expressname}"  dicType="VIP_EXPRESS"
                      :labelInValue="true"  @select="value => itemSetting(value, {rowindex:index, rowrecord:record, rowkey:'expressname'})" /><span v-if="!record.editable">{{record.expressnameName}}</span></div>
        <div slot="expressnumber" slot-scope="text, record, index"><a-input v-if="record.editable" v-model="record.expressnumber"/><span v-if="!record.editable">{{text}}</span></div>
      </a-table>
    </a-card>

    <a-card v-if="!loading" style="margin-top:24px;">
      <span href="#" slot="title" style="float:left;">
        <a-icon type="bank" />代领邮寄列表</span>
      <a href="#" slot="extra">
        <a-icon :type="iconType" @click="swithTableShowSub" />
      </a>
      <a-form :form="saveForm" :labelCol="filterFormLayout.labelCol" :wrapperCol="filterFormLayout.wrapperCol">
        <a-row :gutter="16">
          <a-col :span="6">
            <a-form-item label="邮寄日期">
              <a-week-picker format="YYYY-MM-DD"
                             v-decorator="['sendposttime',{rules: [{ required: true, message: '邮寄日期不能为空!' }]}]"/>
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="快递公司">
              <DicSelect dicType="VIP_EXPRESS"
                         v-decorator="[ 'expressname',{rules: [{ required: true, message: '快递公司不能为空!' }]}]"/>
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="快递单号">
              <a-input v-decorator="['expressnumber',{rules: [{ required: true, message: '快递单号不能为空!' }]}]"/>
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <div style="float:right">
              <a-button @click="saveDownHandle" :loading="downSubmitLoading" class="editable-add-btn" style="margin-right:5px;" type="primary">保存</a-button>
              <a-button @click="exportDownHandle" class="editable-add-btn" style="margin-right:5px;" type="">导出Excel</a-button>
            </div>
          </a-col>
        </a-row>
      </a-form>
      <a-table :bordered="false" :columns="columnsSub" :dataSource="pageDataSub.data" :indentSize=0 :loading="loadingSub" :pagination="paginationSub" :rowKey="index => index.index" :rowSelection="rowSelectionSub" :scroll="{ x: 'max-content'}" @rowClick="selectSubTableRowClick" v-show="showTableSub">

      </a-table>
    </a-card>
  </a-card>
</template>
<script>
import api from '@/api/api-vip'
import DicSelect from '@/components/dic-select'
import moment from 'moment'

export default {
	name: 'vip-sendcard-post',
	components: {DicSelect},
	data () {
		return {
			// 查询条件
			filterFormLayout: {
				labelCol: {span: 9},
				wrapperCol: {span: 15}
			},
			filterForm: this.$form.createForm(this),
			saveForm: this.$form.createForm(this),
			pageData: {
				dataCount: 0,
				data: []
			},
			pageDataSub: {
				dataCount: 0,
				data: []
			},
			loading: false,
			loadingSub: false,
			showTable: true,
			showTableSub: true,
			iconType: 'down',
			iconTypeSub: 'down',
			rowSelection: {
				selectedRowKeys: [],
				onChange: (selectedRowKeys, selectedRows) => {
					this.rowSelection.selectedRowKeys = selectedRowKeys
				},
				onSelect: (record, selected, selectedRows) => {
					if (!selected) {
						record.editable = false
					} else {
						record.editable = true
					}
				}
			},
			upSubmitLoading: false,
			downSubmitLoading: false,
			rowSelectionSub: {
				selectedRowKeys: [],
				onChange: (selectedRowKeys, selectedRows) => {
					this.rowSelectionSub.selectedRowKeys = selectedRowKeys
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
			paginationSub: {
				pageSize: 10,
				current: 1,
				total: 0,
				showTotal: total => `共 ${total} 条数据`,
				showSizeChanger: true,
				pageSizeOptions: ["10", "20", "35", "50"],
				onShowSizeChange: (current, pageSize) => this.onSubPageSizeChange(current, pageSize),
				onChange: (page, pageSize) => this.onSubPageChange(page, pageSize)
			},
			columns: [
				{
					align: "left",
					dataIndex: "name",
					title: "会员"
				},
				{
					align: "left",
					dataIndex: "cardno",
					title: "会员卡号"
				},
				{
					align: "left",
					dataIndex: "cardtypename",
					title: "卡类型"
				},
				{
					align: "left",
					dataIndex: "mobile",
					title: "联系方式"
				},
				{
					align: "left",
					dataIndex: "receiveprovinceName",
					title: "省"
				},
				{
					align: "left",
					dataIndex: "receivecityName",
					title: "市"
				},
				{
					align: "left",
					dataIndex: "receivedistrictName",
					title: "区"
				},
				{
					align: "left",
					dataIndex: "receiveremark",
					title: "邮寄地址"
				},
				{
					align: "left",
					dataIndex: "sendcardtime",
					title: "发卡日期",
					customRender: (text) => {
						return text ? moment(text).format('YYYY-MM-DD HH:mm:ss') : ''
					}
				},
				{
					align: "left",
					dataIndex: "sendposttime",
					title: "邮寄日期",
					scopedSlots: {customRender: 'sendposttime'}
				},
				{
					align: "left",
					dataIndex: "expressname",
					title: "快递公司",
					scopedSlots: {customRender: 'expressname'}
				},
				{
					align: "left",
					dataIndex: "expressnumber",
					title: "快递单号",
					scopedSlots: {customRender: 'expressnumber'}
				},
				{
					align: "left",
					dataIndex: "statusName",
					title: "备注"
				}
			],
			columnsSub: [
				{
					align: "left",
					dataIndex: "agentname",
					title: "代办人"
				},
				{
					align: "left",
					dataIndex: "agentmobile",
					title: "代办人电话"
				},
				{
					align: "left",
					dataIndex: "name",
					title: "会员"
				},
				{
					align: "left",
					dataIndex: "cardno",
					title: "会员卡号"
				},
				{
					align: "left",
					dataIndex: "cardtypename",
					title: "卡类型"
				},
				{
					align: "left",
					dataIndex: "mobile",
					title: "联系方式"
				},
				{
					align: "left",
					dataIndex: "receiveprovinceName",
					title: "省"
				},
				{
					align: "left",
					dataIndex: "receivecityName",
					title: "市"
				},
				{
					align: "left",
					dataIndex: "receivedistrictName",
					title: "区"
				},
				{
					align: "left",
					dataIndex: "receiveremark",
					title: "邮寄地址"
				},
				{
					align: "left",
					dataIndex: "createtime",
					title: "发卡日期",
					customRender: (text) => {
						return text ? moment(text).format('YYYY-MM-DD') : ''
					}
				},
				{
					align: "left",
					dataIndex: "sendposttime",
					title: "邮寄日期",
					customRender: (text) => {
						return text ? moment(text).format('YYYY-MM-DD') : ''
					}
				},
				{
					align: "left",
					dataIndex: "expressnameName",
					title: "快递公司"
				},
				{
					align: "left",
					dataIndex: "expressnumber",
					title: "邮寄单号"
				},
				{
					align: "left",
					dataIndex: "statusName",
					title: "备注"
				}
			]
		}
	},
	mounted () {
		this.$nextTick(() => {
			this.filterForm.setFieldsValue({sendFlag: "2"})
			this.searchHandle()
			this.searchHandleSubTable()
		})
	},
	methods: {
		allSearch () {
			this.searchHandle()
			this.searchHandleSubTable()
		},
		itemSetting (LabeledValue, option) {
			this.$set(this.pageData.data[option.rowindex], option.rowkey, LabeledValue.key)
			this.$set(this.pageData.data[option.rowindex], option.rowkey + 'Name', LabeledValue.label)
		},
		dateRender (text) {
			return text ? moment(text).format('YYYY-MM-DD') : ''
		},
		resetFilterForm () {
			this.filterForm.resetFields()
		},
		searchHandle () {
			this.$nextTick(() => {
				this.pagination.current = 1
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
			/* let query = this.form.sendFlag */
			Object.assign(data, query)
			this.loading = true
			api.queryForSendPost(data).then(res => {
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
		selectRowClick (record, index) {
			let ki = this.rowSelection.selectedRowKeys.findIndex(key => (key === index))
			if (ki > -1) {
				this.rowSelection.selectedRowKeys.splice(ki, 1)
				record.editable = false
			} else {
				this.rowSelection.selectedRowKeys.push(index)
				record.editable = true
			}
		},
		searchHandleSubTable () {
			this.$nextTick(() => {
				this.paginationSub.current = 1
				this.loadSubPageData()
			})
		},
		loadSubPageData () {
			this.rowSelectionSub.selectedRows = []
			this.rowSelectionSub.selectedRowKeys = []
			let query = this.filterForm.getFieldsValue()
			let data = {
				page: this.paginationSub.current,
				limit: this.paginationSub.pageSize
			}
			this.loadingSub = true
			api.queryOtherSendPost(Object.assign(data, query)).then(res => {
				this.pageDataSub = res.data || {totalCount: 0, data: []}
				this.pageDataSub.data.forEach((item, index) => {
					item.recordIndex = index + 1
				})
				this.paginationSub.total = this.pageDataSub.totalCount
			}).finally(() => {
				this.loadingSub = false
			})
		},
		onSubPageChange (page, pageSize) {
			this.paginationSub.current = page
			this.loadSubPageData()
		},
		onSubPageSizeChange (current, size) {
			this.paginationSub.pageSize = size
			this.searchHandleSubTable()
		},
		selectSubTableRowClick (record, index) {
			let ki = this.rowSelectionSub.selectedRowKeys.findIndex(key => (key === index))
			if (ki > -1) {
				this.rowSelectionSub.selectedRowKeys.splice(ki, 1)
			} else {
				this.rowSelectionSub.selectedRowKeys.push(index)
			}
		},
		swithTableShow () {
			this.showTable = !this.showTable
			this.iconType = this.showTable ? 'down' : 'up'
		},
		swithTableShowSub () {
			this.showTableSub = !this.showTableSub
			this.iconTypeSub = this.showSubTable ? 'down' : 'up'
		},
		saveUpHandle () {
			let self = this
			if (!self.rowSelection.selectedRowKeys || self.rowSelection.selectedRowKeys.length <= 0) {
				this.$message.warning('请选择记录!')
				return
			}
			let selectedRecords = self.rowSelection.selectedRowKeys.map(val => {
				return self.pageData.data[val]
			})
			let canSave = true
			selectedRecords.forEach(p => {
			  if (!p.sendposttime || !p.expressname || !p.expressnumber)canSave = false
			})
			if (!canSave) {
				this.$message.warning('填写邮寄信息的数据，请输入完整！')
				return
			}
			self.upSubmitLoading = true
			api.saveVipSendcardForSendPost(selectedRecords).then(res => {
			  debugger
				if (res.status === 0) {
					self.$message.success('保存成功')
					 self.loadPageData()
				} else {
					self.$message.error(res.statusText)
				}
			}).finally(() => {
				self.upSubmitLoading = false
			})
		},
		saveDownHandle () {
			let self = this
			if (!self.rowSelectionSub.selectedRowKeys || self.rowSelectionSub.selectedRowKeys.length <= 0) {
				this.$message.warning('请选择记录!')
				return
			}
			this.saveForm.validateFields((error, values) => {
				if (error) {
					this.$message.warning('填写邮寄信息的数据，请输入完整！')
					return
				}
				let selectedRecords = self.rowSelectionSub.selectedRowKeys.map(val => {
					return self.pageDataSub.data[val]
				})
				let selectedPostRec = Object.assign({}, this.saveForm.getFieldsValue())
				let data = {"lstVipSendcard": selectedRecords, "vipSendcardVo": selectedPostRec}
				self.downSubmitLoading = true
				api.saveVipSendcardForSendPostOther(data).then(res => {
					if (res.status === 0) {
						self.$message.success('保存成功')
						self.loadSubPageData()
					} else {
						self.$message.error(res.statusText)
					}
				}).finally(() => {
					self.downSubmitLoading = false
				})
			})
		},
		exportUpHandle () {
			let query = this.filterForm.getFieldsValue()
			let data = {
				page: this.pagination.current,
				limit: this.pagination.pageSize,
				receivetype: 2,
				dealtype: 1
			}

			api.exportVipSendcardForSendPost(Object.assign(data, query)).then(res => {
				if (res.status === undefined) {
					// base64内容，文件名
					this.$downloadFileByBase64(res, '邮寄卡管理.xls')
				} else {
					this.$message.error('文件下载失败,请重试')
				}
			})
		},
		exportDownHandle () {
			let query = this.filterForm.getFieldsValue()
			let data = {
				page: this.paginationSub.current,
				limit: this.paginationSub.pageSize,
				receivetype: 2,
				dealtype: 2
			}
			api.exportVipSendcardForSendPost(Object.assign(data, query)).then(res => {
				if (res.status === undefined) {
					// base64内容，文件名
					this.$downloadFileByBase64(res, '邮寄卡管理.xls')
				} else {
					this.$message.error('文件下载失败,请重试')
				}
			})
		}
	}
}
</script>
