<template>
  <a-card :bordered="false">
    <a-card>
      <a-divider orientation="left"><a-icon type="file-search" /> 查询条件</a-divider>
      <a-form :form="filterForm" :labelCol="filterFormLayout.labelCol" :wrapperCol="filterFormLayout.wrapperCol">
        <a-row :gutter="16">
          <a-col :span="6">
            <a-form-item label="管理机构">
							<OrgSelect2 dicType="orgCode_4" v-decorator="['orgCode',{initialValue: ''}]" @change="searchHandle" placeholder="请选择机构" />
						</a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="管家工号">
              <a-input placeholder="" v-decorator="['staffNo', { initialValue: '' }]"/>
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="管家姓名">
              <a-input placeholder="" v-decorator="['staffName', { initialValue: '' }]"/>
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="状态">
							<a-select :allowClear="true" @change="searchHandle" v-decorator="['status', {initialValue: ''}]">
								<a-select-option value="01">未提交</a-select-option>
								<a-select-option value="02">待审核</a-select-option>
								<a-select-option value="03">审核通过</a-select-option>
								<a-select-option value="04">审核退回</a-select-option>
								<a-select-option value="06">退回已修改</a-select-option>
							</a-select>
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="服务起期">
              <a-date-picker v-decorator="['serveBeginTime', { initialValue: null }]" format="YYYY/MM/DD" />
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="服务止期">
              <a-date-picker  v-decorator="['serveEndDate', { initialValue: null }]" format="YYYY/MM/DD" />
            </a-form-item>
          </a-col>
					<a-col :span="6">
            <a-form-item label="操作起期">
              <a-date-picker v-decorator="['insertBeginTime', { initialValue: null }]" format="YYYY/MM/DD"  />
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="操作止期">
              <a-date-picker  v-decorator="['insertEndTime', { initialValue: null }]" format="YYYY/MM/DD" />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :span="24" style="margin:10px 0 0 0;text-align:right">
						<a-button type="" :loading="submitLoading" class="editable-add-btn" @click="exportRecord" style="float:right;margin-right:10px;">导出</a-button>
            <a-button type="" class="editable-add-btn" @click="resetFilterForm" style="float:right;margin-right:10px;">重置</a-button>
            <a-button type="primary" class="editable-add-btn" @click="searchHandle" style="float:right;margin-right:10px;">查询</a-button>
          </a-col>
        </a-row>
      </a-form>
    </a-card>
    <a-card style="margin-top:24px;">
      <span href="#" slot="title" style="float:left;">
        <a-icon type="search" /> 查询显示</span>
      <a href="#" slot="extra">
        <a-icon :type="iconType" @click="swithTableShow" />
      </a>
      <a-table v-show="showTable" :scroll="{ x: 'calc(2400px + 50%)'}" :bordered="false" :pagination="pagination" :rowSelection="rowSelection" :dataSource="pageData.data" :columns="columns" :rowKey="record => record.docDefId" :indentSize="0" :loading="loading">
        <a slot="textVal" slot-scope="text, record">{{ text || '-' }}</a>
        <a slot="docName" @click="showRecordInfo(record)" slot-scope="text, record">{{ text }}</a>
        <a-tag slot="yesNo" slot-scope="text, record" :color="text === 'Y' ? 'green' : 'orange'">{{ text === "Y" ? "是" : "否" }}</a-tag>
      </a-table>
    </a-card>
  </a-card>
</template>
<script>
import api from "@/api/api-serve-apply"
import DicSelect from "@/components/dic-select"
import OrgSelect2 from '@/components/org-select2'
import moment from "moment"
export default {
	name: "serve-apply-performance-query",
	components: { DicSelect, OrgSelect2 },
	data () {
		return {
			value: '',
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
			submitLoading: false,
			selectedRows: [],
			loading: false,
			showTable: true,
			iconType: "down",
			columns: [
				{ title: "序号", dataIndex: "recordIndex" },
				{ title: "服务日期", dataIndex: "serveTime" },
				{ title: "管理机构", dataIndex: "orgName" },
				{ title: "管家工号", dataIndex: "staffNo" },
				{ title: "管家姓名", dataIndex: "staffName"	},
				{ title: "服务实施机构", dataIndex: "serviceExecuteOrgStr" },
				{ title: "健管中心/VIP诊疗室名称", dataIndex: "vipSeverName" },
				{ title: "客户类型", dataIndex: "customerTypeStr" },
				{ title: "客户姓名", dataIndex: "customeName" },
				{ title: "客户性别", dataIndex: "customeSexStr" },
				{ title: "客户证件类型", dataIndex: "customeCertTypeDesc" },
				{ title: "客户证件号码", dataIndex: "customeCertNum" },
				{ title: "出生日期", dataIndex: "borthTimeStr" },
				{ title: "团体客户名称", dataIndex: "teamName" },
				{ title: "团体客户人数", dataIndex: "teamNum" },
				{ title: "服务项目", dataIndex: "serveItemDesc" },
				{ title: "服务细类", dataIndex: "serveItemSub" },
				{ title: "服务数量", dataIndex: "serveCount" },
				{ title: "服务单位", dataIndex: "serveUnitDesc" },
				{ title: "客户人数", dataIndex: "customerNum" },
				{ title: "联系电话", dataIndex: "custTel" },
				{ title: "客户来源", dataIndex: "custChannelDesc" },
				{ title: "服务机构/预约医院", dataIndex: "serviceProvider" },
				{ title: "操作日期", dataIndex: "updateTime" },
				{ title: "状态", dataIndex: "statusStr" },
				{ title: "备注", dataIndex: "remarkdesc" }

			],
			rowSelection: {
				type: 'radio',
				onChange: (selectedRowKeys, selectedRows) => {
					this.selectedRows = selectedRows
				}
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
		this.searchHandle()
	},
	methods: {
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
			let query = this.filterForm.getFieldsValue()
			query.serveBeginTime = query.serveBeginTime ? moment(query.serveBeginTime).format('YYYY-MM-DD') : null
			query.serveEndDate = query.serveEndDate ? moment(query.serveEndDate).format('YYYY-MM-DD') : null
			query.insertBeginTime = query.insertBeginTime ? moment(query.insertBeginTime).format('YYYY-MM-DD') : null
			query.insertEndTime = query.insertEndTime ? moment(query.insertEndTime).format('YYYY-MM-DD') : null
			let data = {
				page: this.pagination.current,
				limit: this.pagination.pageSize,
				statusType: '08'
			}

			data.ServeSearchBo = JSON.stringify(query)
			this.loading = true
			api.queryPerformanceQuery(data).then(res => {
				console.log(res, "result")
				this.pageData = res.data || { totalCount: 0, data: [] }
				this.pageData.data.forEach((item, index) => {
					item.recordIndex = index + 1
					item.updateTime = moment(item.updateTime).format('YYYY-MM-DD HH:mm:ss')
				})
				this.pagination.total = this.pageData.totalCount
			}).finally(() => {
				this.loading = false
			})
		},
		getDocCatName (code) {
			return this.$refs.dicCatCode.getName(code)
		},
		resetFilterForm () {
			this.filterForm.resetFields()
			this.searchHandle()
		},
		addRecord () {

		},
		showRecordInfo (obj) {

		},
		swithTableShow () {
			this.showTable = !this.showTable
			this.iconType = this.showTable ? "down" : "up"
		},
		exportRecord () {
			let query = this.filterForm.getFieldsValue()
			// if (query.insertBeginTime == null && query.insertEndTime == null) {
			// 	return this.$message.warn('请录入操作起止时间')
			// }
			if (query.insertBeginTime) {
				query.insertBeginTime = moment(query.insertBeginTime).format("YYYY/MM/DD")
			}
			if (query.insertEndTime) {
				query.insertEndTime = moment(query.insertEndTime).format("YYYY/MM/DD")
			}
			console.log(query.insertBeginTime, query.insertEndTime, Date.parse(query.insertEndTime), Date.parse(query.insertBeginTime), '间隔--')
			var days = new Date(query.insertEndTime) - new Date(query.insertBeginTime)
			console.log(days, 'days-- 7948800000')
			if (days < 0) {
				return this.$message.warn('结束日期必须大于开始日期')
			}
			if (days > 7948800000) {
				return this.$message.warn('起止时间间隔不能超过三个月')
			}
			this.submitLoading = true
			query.serveBeginTime = query.serveBeginTime ? moment(query.serveBeginTime).format('YYYY-MM-DD') : null
			query.serveEndDate = query.serveEndDate ? moment(query.serveEndDate).format('YYYY-MM-DD') : null
			query.insertBeginTime = query.insertBeginTime ? moment(query.insertBeginTime).format('YYYY-MM-DD') : null
			query.insertEndTime = query.insertEndTime ? moment(query.insertEndTime).format('YYYY-MM-DD') : null
			api.exportPerformanceQuery(query).then(res => {
				if (res.status !== (undefined || '')) {
					this.$downloadFileByBase64(res, `自营服务信息.xls`)
				} else {
					this.$message.error('文件下载失败,请重试')
				}
			}).finally(() => {
				this.submitLoading = false
			})
		}
	}
}
</script>

