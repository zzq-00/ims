<template>
  <a-card :bordered="false">
    <a-card>
      <a-divider orientation="left"><a-icon type="file-search" /> 查询条件</a-divider>
      <a-form :form="filterForm" :labelCol="filterFormLayout.labelCol" :wrapperCol="filterFormLayout.wrapperCol">
        <a-row :gutter="16">
          <a-col :span="6">
            <a-form-item label="第三方名称">
							<DicSelect dicType="THIRD_NAME" v-decorator="['thirdName', { initialValue: '' }]" :allowClear="true" @change="searchHandle" />
						</a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="预约来源">
							<DicSelect dicType="ST_SYS_NO" :removeList="removeListArr" v-decorator="['orderSource', { initialValue: '' }]" :allowClear="true" @change="searchHandle" />
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="产品名称">
              <!-- <a-input placeholder="" v-decorator="['productName', { initialValue: '' }]"/> -->
							<a-Select v-decorator="['productName', {initialValue: ''}]" showSearch optionFilterProp="children">
								<a-select-option v-for="(item, index) in productNameList" :value="item.value" :key="index">{{ item.label }}</a-select-option>
							</a-select>
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="当前状态">
							<DicSelect dicType="ACTUALIZED_STATUS" v-decorator="['status', { initialValue: '' }]" :allowClear="true" @change="searchHandle" />
            </a-form-item>
          </a-col>
					<a-col :span="6">
            <a-form-item label="就诊人姓名">
              <a-input placeholder="" v-decorator="['patientName', { initialValue: '' }]"/>
            </a-form-item>
          </a-col>
					<a-col :span="6">
            <a-form-item label="就诊人证件类型">
							<DicSelect dicType="CERTI_TYPE" v-decorator="['patientCertType', { initialValue: '' }]" :allowClear="true" @change="searchHandle" />
            </a-form-item>
          </a-col>
					<a-col :span="6">
            <a-form-item label="就诊人证件号码">
              <a-input placeholder="" v-decorator="['patientCertNo', { initialValue: '' }]"/>
            </a-form-item>
          </a-col>
					<a-col :span="6">
            <a-form-item label="就诊人手机号码">
              <a-input placeholder="" v-decorator="['patientTelephone', { initialValue: '' }]"/>
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="预约日期起期">
              <a-date-picker v-decorator="['applyBeginTime', { initialValue: null }]" format="YYYY/MM/DD" />
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="预约日期止期">
              <a-date-picker  v-decorator="['applyEndTime', { initialValue: null }]" format="YYYY/MM/DD" />
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
      <a-table v-show="showTable" :scroll="{ x: 'max-content'}" :bordered="false" :pagination="pagination" :rowSelection="rowSelection" :dataSource="pageData.data" :columns="columns" :rowKey="record => record.docDefId" :indentSize="0" :loading="loading">
        <a slot="textVal" slot-scope="text, record">{{ text || '-' }}</a>
        <a slot="docName" @click="showRecordInfo(record)" slot-scope="text, record">{{ text }}</a>
        <a-tag slot="yesNo" slot-scope="text, record" :color="text === 'Y' ? 'green' : 'orange'">{{ text === "Y" ? "是" : "否" }}</a-tag>
      </a-table>
    </a-card>

  </a-card>
</template>
<script>
import api from "@/api/api-third-appointment"
import DicSelect from "@/components/dic-select"
import moment from 'moment'
export default {
	name: "serve-third-appointment-query",
	components: { DicSelect },
	data () {
		return {
			productNameList: [], // 产品名称列表
			removeListArr: ['01', '02', '03', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '16', '17', '18', '19', '20', '21', '22'],
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
			selectedRowKeys: [],
			selectedRows: [],
			loading: false,
			showTable: true,
			iconType: "down",
			columns: [
				{ title: "序号", dataIndex: "recordIndex" },
				{ title: "预约订单号",
					dataIndex: "orderNo",
					scopedSlots: { customRender: 'docName' }},
				{ title: "第三方名称",
					dataIndex: "thirdNameDesc"},
				{ title: "预约来源", dataIndex: "orderSourceDesc" },
				{ title: "产品名称", dataIndex: "productNameDesc"	},
				{ title: "服务名称", dataIndex: "serviceName" },
				{ title: "服务商名称", dataIndex: "sorgName" },
				{ title: "科室", dataIndex: "deptName" },
				{ title: "服务卡号", dataIndex: "cardNo" },
				{ title: "就诊人姓名", dataIndex: "patientName" },
				{ title: "就诊人性别", dataIndex: "patientGenderDesc" },
				{ title: "就诊人证件类型", dataIndex: "patientCertTypeDesc" },
				{ title: "就诊人证件号码", dataIndex: "patientCertNo" },
				{ title: "就诊人手机号码", dataIndex: "patientTelephone" },
				{ title: "服务预约日期", dataIndex: "payDate" },
				{ title: "服务实施完成日期", dataIndex: "consumeDate" },
				{ title: "当前状态", dataIndex: "statusDesc" }

			],
			rowSelection: {
				type: 'radio',
				onChange: (selectedRowKeys, selectedRows) => {
					this.selectedRowKeys = selectedRowKeys
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
		this.getProduceName()
	},
	methods: {
		// 产品名称列表
		getProduceName () {
			api.getProductName({productType: ''}).then(res => {
				res.data.map(item => {
					this.productNameList.push({ value: item.productCode, label: item.productCode + "-" + item.productName })
				})
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
			let query = this.filterForm.getFieldsValue()
			query.applyBeginTime = query.applyBeginTime ? moment(query.applyBeginTime).format('YYYY-MM-DD') : null
			query.applyEndTime = query.applyEndTime ? moment(query.applyEndTime).format('YYYY-MM-DD') : null
			let data = {
				page: this.pagination.current,
				limit: this.pagination.pageSize
			}
			data.QueryThirdAppointmentBo = JSON.stringify(query)
			this.loading = true
			api.list(data).then(res => {
				console.log(res, "result")
				this.pageData = res.data || { totalCount: 0, data: [] }
				this.pageData.data.forEach((item, index) => {
					item.recordIndex = index + 1
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
		showRecordInfo (record) {
			this.$router.push({
				path: `HealthConsultHistory/${record.serviceReservationId}`,
				query: {thirdNameDesc: record.thirdNameDesc}
			})
		},
		swithTableShow () {
			this.showTable = !this.showTable
			this.iconType = this.showTable ? "down" : "up"
		},
		exportRecord () {
			let query = this.filterForm.getFieldsValue()
			this.submitLoading = true
			api.export(query).then(res => {
				if (res !== undefined) {
					this.$downloadFileByBase64(res, `第三方预约信息明细列表.xlsx`)
				} else {
					this.$message.error('文件下载失败，请重试')
				}
			}).finally(() => {
				this.submitLoading = false
			})
		}
	}
}
</script>

