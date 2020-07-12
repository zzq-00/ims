<template>
  <a-modal v-model="formModal" style="top: 30px;" :width="modalWidth" :title="modalTitle" footer="">
    <a-form :form="dataForm" :labelCol="dataFormLayout.labelCol" :wrapperCol="dataFormLayout.wrapperCol">
      <a-spin :spinning="spinning"/>
      <a-divider orientation="left"><a-icon type="home"/> 医生详细信息</a-divider>
      <a-card style="margin-top: 24px;">
        <a-row :gutter="16">
          <a-col :span="2">
            <a-avatar :size="64" icon="user" />
          </a-col>
          <a-col :span="6">
            <a-form-item label="编码" >
              <a-input v-decorator="['doctorCode']" disabled />
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="名称">
              <a-input v-decorator="['doctorName']" disabled>
              </a-input>
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="电话">
              <a-input v-decorator="['doctorTel']" disabled></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="所属医院">
              <a-input v-decorator="['serviceOrgName']" disabled></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="管理机构">
              <a-input v-decorator="['orgName']" disabled></a-input>
            </a-form-item>
          </a-col>
        </a-row>
      </a-card>
      <a-card style="margin-top: 24px;">
        <a-divider orientation="left">
          <a-icon type="folder-open" /> 人员详细信息</a-divider>
        <a-row :gutter="16">
          <a-col :span="6">
            <a-form-item label="医生编码" >
              <a-input v-decorator="['doctorCode']" disabled />
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="医生名称">
              <a-input v-decorator="['doctorName']" disabled/>
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="所属医院">
              <a-input v-decorator="['serviceOrgName']" disabled/>
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="所属科室">
              <a-input v-decorator="['upDeptName']" disabled></a-input>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :span="6">
            <a-form-item label="所属子科室" >
              <a-input v-decorator="['deptName']" disabled></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="性别" >
			  <DicSelect dicType="GENDER" v-decorator="['doctorGender', {initialValue:''}]" />
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="出生日期" >
			  <a-date-picker v-decorator="['doctorBirthday']" />
			</a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="职称" >
			  <DicSelect dicType="DOCTOR_TITLE_CODE" v-decorator="['doctorTitle', {initialValue:''}]" />
			</a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :span="6">
            <a-form-item label="学历" >
			  <DicSelect dicType="EDUCATION_S" v-decorator="['doctorEducation', {initialValue:''}]" />
			</a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="联系电话" >
              <a-input  v-decorator="['doctorTel']" />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :span="24">
            <a-form-item label="擅长" :label-col="{ span: 2 }" :wrapper-col="{ span: 20 }">
              <a-textarea  v-decorator="['doctorSpec', {rules: [{ required: true, message: '擅长不能为空!' }]} ]" :rows="4" />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :span="24">
            <a-form-item label="乘车路线" :label-col="{ span: 2 }" :wrapper-col="{ span: 20 }">
              <a-textarea  v-decorator="['busLine']" :rows="4" />
            </a-form-item>
          </a-col>
        </a-row>
      </a-card>
    </a-form>
    <div v-show="showTable">
      <a-divider orientation="left">
        <a-icon type="folder-open" /> 服务信息</a-divider>
      <a-table :bordered="false" :pagination="pagination" :rowSelection="rowSelection" :dataSource="pageData.data" :columns="columns" :rowKey="record => record.serverName" :indentSize=0 :loading="loading">
        <a slot="serverName" @click="editData(record)" slot-scope="text, record">{{text}}</a>
      </a-table>
    </div>
  </a-modal>
</template>
<script>
import supApi from '@/api/api-supplier-query'
import DicSelect from '@/components/dic-select'

export default {
	name: 'query-doctor-form',
	components: { DicSelect },
	data () {
		return {
			dataFormLayout: {
				labelCol: { span: 9 },
				wrapperCol: { span: 15 }
			},
			extraParam: {},
			modalWidth: 1070,
			modalTitle: '',
			formModal: false,
			spinning: false,
			dataForm: this.$form.createForm(this),
			showTable: true,
			loading: false,
			iconType: 'down',
			columns: [
				{
					align: "center",
					title: "序号",
					dataIndex: "recordIndex"
				},
				{
					align: "left",
					title: "服务名称",
					dataIndex: "serverName",
					scopedSlots: { customRender: 'serverName' }
				},
				{
					align: "left",
					title: "服务编码",
					dataIndex: "serverCode"
				},
				{
					align: "left",
					title: "开始日期",
					dataIndex: "startDate"
				},
				{
					align: "left",
					title: "结束日期",
					dataIndex: "endDate"
				}
			],
			selectedRows: [],
			rowSelection: {
				onChange: (selectedRowKeys, selectedRows) => {
					this.selectedRows = selectedRows
				}
			},
			pageData: {
				dataCount: 0,
				data: []
			},
			pagination: {
				pageSize: 5,
				current: 1,
				total: 0,
				showTotal: total => `共 ${total} 条数据`,
				showSizeChanger: true,
				pageSizeOptions: ["5", "10", "20"],
				onShowSizeChange: (current, pageSize) => this.onPageSizeChange(current, pageSize),
				onChange: (page, pageSize) => this.onPageChange(page, pageSize)
			}
		}
	},
	mounted () {
	},
	methods: {
		toggleTableShow () {
			this.showTable = !this.showTable
			this.iconType = this.showTable ? 'down' : 'up'
		},
		searchData () {
			this.pagination.current = 1
			this.loadPageData()
		},
		onPageChange (page, pageSize) {
			this.pagination.current = page
			this.loadPageData()
		},
		onPageSizeChange (current, size) {
			this.pagination.pageSize = size
			this.searchData()
		},
		loadPageData () {
			console.log('pageParam===', this.extraParam)
			if (!this.extraParam.code) return
			let data = {
				page: this.pagination.current,
				limit: this.pagination.pageSize,
				searchListsBo: this.extraParam
			}
			this.loading = true
			supApi.searchDocSerList(data).then(res => {
				console.log(res, 'result')
				this.pageData = res.data || {totalCount: 0, data: []}
				this.pageData.data.forEach((item, index) => { item.recordIndex = index + 1 })
				this.pagination.total = this.pageData.totalCount
			}).finally(() => {
				this.loading = false
			})
		},
		editForm (obj, param) {
			this.formModal = true
			this.spinning = true
			this.extraParam = {
				cooperateWay: param.cooperateWay,
				code: obj.doctorCode
			}
			obj.orgName = param.orgName
			console.log(obj, 'doctor edit')

			this.$nextTick(() => {
				this.searchData()
			})
			this.$nextTick(() => {
				this.dataForm.resetFields()
				this.dataForm.setFieldsValue(obj)
			})
			this.spinning = false
		}
	}
}
</script>
<style>

</style>
