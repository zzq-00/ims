<template>
  <a-card :bordered="false">
    <a-card>
      <a-divider orientation="left"><a-icon type="file-search" /> 服务申请查询</a-divider>
      <a-form :form="filterForm" :labelCol="filterFormLayout.labelCol" :wrapperCol="filterFormLayout.wrapperCol">
        <a-row :gutter="16">
          <a-col :span="6">
            <a-form-item label="服务卡号码">
              <a-input v-decorator="['cardNo', { initialValue: '' }]" />
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="产品名称">
              <a-input v-decorator="['productName', { initialValue: '' }]" />
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="当前状态">
              <DicSelect dicType="ACTUALIZED_STATUS" :removeList="removeListState" :allowClear="true" @change="searchHandle" v-decorator="['status', { initialValue: '' }]" />
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="申请方式">
              <DicSelect dicType="ST_SYS_NO" :allowClear="true" @change="searchHandle" v-decorator="['channelType', { initialValue: '' }]" />
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="就诊人姓名">
              <a-input v-decorator="['patientName', { initialValue: '' }]"/>
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="就诊人证件类型">
              <DicSelect dicType="CERTI_TYPE" :allowClear="true" @change="searchHandle" v-decorator="['applyCerttype', { initialValue: '' }]" />
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="就诊人证件号码">
              <a-input v-decorator="['applyCertno', { initialValue: '' }]" />
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="就诊人手机号码">
              <a-input v-decorator="['patientTelephone', { initialValue: '' }]" />
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="服务申请起期">
              <a-date-picker v-decorator="['applyBeginTime', { initialValue: null }]" format="YYYY/MM/DD" />
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="服务申请止期">
              <a-date-picker v-decorator="['applyEndTime', { initialValue: null }]" format="YYYY/MM/DD" />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :span="24" style="margin:10px 0 0 0;text-align:right">
            <a-button type="" class="editable-add-btn" @click="resetFilterForm" style="float:right;margin-right:10px;">重置</a-button>
            <a-button type="" class="editable-add-btn" @click="searchHandle" style="float:right;margin-right:10px;">查询</a-button>
            <a-button type="primary" @click="addRecord" class="editable-add-btn" style="float:right;margin-right:10px;">提交新的申请</a-button>
          </a-col>
        </a-row>
      </a-form>
    </a-card>
    <a-card style="margin-top:24px;">
      <span href="#" slot="title" style="float:left;"><a-icon type="search" /> 我的任务</span>
      <a href="#" slot="extra"><a-icon :type="iconType" @click="swithTableShow" /></a>
      <a-table v-show="showTable" :scroll="{ x: 'max-content'}" :bordered="false" :pagination="pagination" :dataSource="pageData.data" :columns="columns" :rowKey="record => record.recordIndex" :indentSize="0" :loading="loading"
				:row-selection="{ type: 'radio', selectedRowKeys: selectedRowKeys, onChange: onRowChange }">
        <a slot="serviceName" @click="showRecordInfo(record)" slot-scope="text, record">{{ text }}</a>
        <span slot="textVal" slot-scope="text, record">{{ text || '-' }}</span>
      </a-table>
      <a-row :gutter="16">
        <a-col :span="24" style="margin:10px 0 0 0;text-align:right">
          <a-button type="" class="editable-add-btn" :disabled="selectedRows.length === 0" @click="assignTask" style="float:right;margin-right:10px;">任务指派</a-button>
          <a-button class="editable-add-btn" :disabled="selectedRows.length === 0" @click="releaseTask" style="float:right;margin-right:10px;">任务释放</a-button>
					<a-button type="primary" :disabled="selectedRows.length === 0" @click="handleTask" class="editable-add-btn" style="float:right;margin-right:10px;">服务处理</a-button>
        </a-col>
      </a-row>
    </a-card>

		<ApplyInfoForm ref="applyInfoForm" @on-update="searchHandle"/>
		<ApplyAssignModal ref="applyAssignModal" @on-update="searchHandle"/>
		<ApplyInfoDetails ref="applyInfoDetails" />
		<ApplyInfoHandle ref="applyInfoHandle" @on-update="onUpdate"/>
  </a-card>
</template>
<script>
import api from "@/api/api-serve-apply"
import DicSelect from "@/components/dic-select"
import ApplyInfoForm from "./apply-info-form"
import ApplyAssignModal from "./apply-assign-modal"
import ApplyInfoDetails from "@/pages/ServeApply/apply-info-details"
import ApplyInfoHandle from "@/pages/ServeApply/components/apply-info-handle"
import moment from 'moment'
export default {
	name: "apply-info-self",
	components: { DicSelect, ApplyInfoForm, ApplyAssignModal, ApplyInfoDetails, ApplyInfoHandle },
	data () {
		return {
			removeListState: ['01', '07', '09', '10', '12'],
			visible: false,
			confirmLoading: false,
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
			selectedRows: [],
			selectedRowKeys: [],
			loading: false,
			showTable: true,
			iconType: "down",
			columns: [
				{ title: "序号", dataIndex: "recordIndex" },
				{ title: "产品名称", dataIndex: "productName" },
				{ title: "服务名称", dataIndex: "serviceName", scopedSlots: { customRender: "serviceName" } },
				{ title: "服务商名称", dataIndex: "sorgName" },
				{ title: "服务卡号码", dataIndex: "cardNo" },
				{ title: "就诊人姓名", dataIndex: "patientName" },
				{ title: "就诊人性别", dataIndex: "patientGenderDesc" },
				{ title: "就诊人证件类型", dataIndex: "patientCerttypeDesc" },
				{ title: "就诊人证件号码", dataIndex: "patientCertno" },
				{ title: "就诊人手机号码", dataIndex: "patientTelephone" },
				{ title: "申请日期", dataIndex: "applyTime" },
				{ title: "所属队列", dataIndex: "queueName" },
				{ title: "当前状态", dataIndex: "statusDesc" },
				{ title: "申请方式", dataIndex: "channelTypeDesc" },
				{ title: "最后处理时间", dataIndex: "updateTime", scopedSlots: { customRender: "textVal" } },
				{ title: "回访次数", dataIndex: "backNum" },
				{ title: "预约再回访时间", dataIndex: "appointmentBackTime", scopedSlots: { customRender: "textVal" } }
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
		this.searchHandle()
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
			this.selectedRowKeys = [] // 清空选中按钮
			this.selectedRows = [] // 清空选中项数据集
			let query = this.filterForm.getFieldsValue()
			query.applyBeginTime = query.applyBeginTime ? moment(query.applyBeginTime).format('YYYY-MM-DD') : null
			query.applyEndTime = query.applyEndTime ? moment(query.applyEndTime).format('YYYY-MM-DD') : null
			let data = {
				page: this.pagination.current,
				limit: this.pagination.pageSize,
				sortName: 'applyTime',
				sortOrder: 'desc'
			}
			data.ServiceApplication = query
			this.loading = true
			api.queryTaskInfo(data).then(res => {
				console.log(res, "result")
				let pageData = {
					totalCount: res.data.total,
					data: res.data.rows
				}
				this.pageData = pageData
				this.pageData.data.forEach((item, index) => {
					item.recordIndex = index + 1
				})
				this.pagination.total = this.pageData.totalCount
			}).finally(() => {
				this.loading = false
			})
		},
		resetFilterForm () {
			this.filterForm.resetFields()
			this.searchHandle()
		},
		addRecord () {
			this.$refs.applyInfoForm.addForm()
		},
		showRecordInfo (obj) {
			this.$refs.applyInfoDetails.show(obj)
		},
		assignTask () {
			let record = this.selectedRows[0]
			this.$refs.applyAssignModal.show(record)
		},
		releaseTask () {
			let record = this.selectedRows[0]
			let params = {
				serviceReservationId: record.serviceReservationId
			}
			api.taskRelease(params).then(res => {
				this.$Message.success('操作成功!')
				this.selectedRowKeys = []
				this.loadPageData()
			})
		},
		handleTask () {
			this.$refs.applyInfoHandle.show(this.selectedRows[0])
		},
		swithTableShow () {
			this.showTable = !this.showTable
			this.iconType = this.showTable ? "down" : "up"
		},
		// 数据反查：1、清空查询条件，防止条件变化导致数据反查更新失败（举例：预约节点提交后状态由03->04，此时反查获取最新数据若不清空查询条件的话，该条数据
		// 无法获取到最新值；2、直接按照当前页码进行查询，若使用searchHandle默认查询第一页，防止用户点击到2/3/4/5..页后，操作完数据无法获取到最新值）
		onUpdate () {
			this.filterForm.resetFields()
			this.loadPageData()
		}
	}
}
</script>


