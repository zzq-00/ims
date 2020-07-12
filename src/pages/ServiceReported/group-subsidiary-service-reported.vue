<template>
  <a-card :bordered="false">

    <a-card>
      <span href="#" slot="title" style="float:left;">
        <a-icon type="profile" /> 集团子公司服务量报送列表</span>
      <a href="#" slot="extra">
        <a-icon :type="iconType" />
      </a>
      <a-table v-show="showTable" :scroll="{ x: 'max-content'}"  :bordered="false" :pagination="pagination" :dataSource="pageData.data" :columns="columns" :rowKey="record => record.recordIndex" :indentSize="0" :loading="loading"
				:row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onRowChange }" >
        <a slot="reportedDate" @click="showRecordInfo(record)" slot-scope="text, record">{{ text }}</a>
        <a slot="docName" slot-scope="text, record">{{ text }}</a>
        <a-tag slot="yesNo" slot-scope="text, record" :color="text === 'Y' ? 'green' : 'orange'">{{ text === "Y" ? "是" : "否" }}</a-tag>
      </a-table>
      <a-row :gutter="16">
        <a-col :span="24" style="margin:10px 0 0 0;text-align:right">
          <a-button type="" :disabled="selectedRows.length === 0" @click="deleteBatch" class="editable-add-btn" style="float:right;margin-right:10px;">删除</a-button>
          <a-button type="" :disabled="selectedRows.length === 0" @click="approveBatch" class="editable-add-btn" style="float:right;margin-right:10px;">提交审核</a-button>
          <a-button type="primary" @click="addRecord" class="editable-add-btn" style="float:right;margin-right:10px;">新建</a-button>
        </a-col>
      </a-row>
    </a-card>

		<GroupSubsidiaryForm ref="groupSubsidiaryForm" @on-update="loadPageData" />
    <a-modal v-model="formModal" style="top: 30px;" :width="600" title="选择审批主管">
      <a-form :form="dataForm1" :labelCol="{span: 4}" :wrapperCol="{span: 20}">
        <a-card style="margin: 24px;">
          <a-row :gutter="16">
            <a-col :span="24">
              <a-row>
                <a-col :span="24">
                  <a-form-item label="审批主管">
                    <LeaderSelect dicType="86" :defaultDisplayFirst="true" v-decorator="['auditOper',{initialValue: '', rules: [ {required: true, message: '请选择审批主管'}]} ]" placeholder="请选择审批主管" />
                  </a-form-item>
                </a-col>
              </a-row>
            </a-col>
          </a-row>
        </a-card>
      </a-form>
      <div slot="footer">
        <a-button type="" @click="formModal=false">取消</a-button>
        <a-button :loading="submitLoading" type="primary" @click="submitBatch">确定</a-button>
      </div>
    </a-modal>
  </a-card>

</template>
<script>
import api from '@/api/api-serve-apply'
import GroupSubsidiaryForm from './components/group-subsidiary-form'
import LeaderSelect from '@/components/leader-select'
import apiCommon from '@/api/api-common'

export default {
	name: "serve-apply-group-subsidiary-service",
	components: { GroupSubsidiaryForm, LeaderSelect },
	data () {
		return {
			// 查询条件
			filterFormLayout: {
				labelCol: { span: 9 },
				wrapperCol: { span: 15 }
			},
			columns: [
				{ title: "序号", dataIndex: "recordIndex" },
				{ title: "报送年月", dataIndex: "reportedDate", scopedSlots: { customRender: 'reportedDate' } },
				{ title: "管理机构", dataIndex: "orgCodeDesc" },
				{ title: "健康档案", dataIndex: "healthFile" },
				{ title: "健康评估", dataIndex: "healthEvaluate" },
				{ title: "健康咨询", dataIndex: "healthConsult" },
				{ title: "就医服务", dataIndex: "medicalService" },
				{ title: "健康干预", dataIndex: "healthIntervention" },
				{ title: "远程医疗及第二次诊疗意见", dataIndex: "telMedicine" },
				{ title: "健康体检", dataIndex: "healthCheckup" },
				{ title: "健康资讯", dataIndex: "healthInformation" },
				{ title: "中医服务", dataIndex: "chineseMedicine" },
				{ title: "心理健康服务", dataIndex: "mentalHealth" },
				{ title: "健康讲座", dataIndex: "healthLecture" },
				{ title: "医疗风险控制", dataIndex: "medicalRiskControl" },
				{ title: "药品服务", dataIndex: "drugService" },
				{ title: "口腔齿科服务", dataIndex: "dentalService" },
				{ title: "基因检测", dataIndex: "geneDetection" },
				{ title: "其它服务", dataIndex: "otherService" },
				{ title: "其它服务说明", dataIndex: "otherServiceDesc", width: 240 },
				{ title: "状态", dataIndex: "statusDesc" },
				{ title: "审核结论", dataIndex: "auditContent" }
			],
			selectedRows: [],
			selectedRowKeys: [],
			pagination: {
				pageSize: 10,
				current: 1,
				total: 0,
				hideOnSinglePage: true,
				disabled: true,
				showTotal: total => `共 ${total} 条数据`,
				showSizeChanger: true,
				pageSizeOptions: ["10", "20", "35", "50"],
				onShowSizeChange: (current, pageSize) =>
					this.onPageSizeChange(current, pageSize),
				onChange: (page, pageSize) => this.onPageChange(page, pageSize)
			},
			pageData: {
				data: []
			},
			filterForm: this.$form.createForm(this),
			dataForm1: this.$form.createForm(this),
			loading: false,
			showTable: true,
			iconType: 'down',
			formModal: false
		}
	},
	mounted () {
		this.searchHandle()
	},
	methods: {
		approveBatch () {
			this.dataForm1.resetFields()
			apiCommon.getLeaderInfo().then(res => {
				if (res.data.length > 0) {
					this.formModal = true
				} else {
					this.$message.error('未配置审核主管信息或查询审批主管失败')
					this.formModal = false
				}
			})
		},
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
			this.selectedRowKeys = []
			this.selectedRows = []

			let query = this.filterForm.getFieldsValue()
			let data = {
				page: this.pagination.current,
				limit: this.pagination.pageSize
			}
			Object.assign(data, query)
			this.loading = true
			api.queryGroupSubsidiaryServiceReported(data).then(res => {
				console.log(res, "result")
				this.pageData.data = res.data
				this.pageData.data.forEach((item, index) => {
					item.recordIndex = index + 1
				})
			}).finally(() => {
				this.loading = false
			})
		},
		addRecord () {
			this.$refs.groupSubsidiaryForm.addForm()
		},
		showRecordInfo (obj) {
			this.$refs.groupSubsidiaryForm.editForm(obj.serviceTimeId, obj)
		},
		deleteBatch () {
			let self = this
			this.$confirm({
				title: '确认提示',
				content: `确定删除当前选中的${self.selectedRows.length}项记录吗？`,
				okType: 'danger',
				onOk () {
					return new Promise((resolve, reject) => {
						let data = {
							timesSourece: '02',
							type: '0203'
						}
						data.serviceTimesBoList = self.selectedRows
						api.deleteGroupSubsidiaryServiceReported(data).then(res => {
							self.$message.success('删除成功')
							self.loadPageData()
						}).finally(() => {
							resolve()
						})
					})
				}
			})
		},
		submitBatch () {
			this.dataForm1.validateFields((error, values) => {
				if (error) {
					return
				}
				let data = {
					timesSourece: '0202',
					type: '02'
				}
				data.serviceTimesBoList = this.selectedRows
				for (var i = 0; i < this.selectedRows.length; i++) {
					data.serviceTimesBoList[i].auditOper = values.auditOper
				}
				api.submitGroupSubsidiaryServiceReported(data).then(res => {
					if (res.data.flag) {
					  this.formModal = false
						this.$message.success('提交审核成功!')
						this.loadPageData()
					} else {
						this.formModal = false
						this.$message.error(res.data.statusText)
					}
				})
			})
		}
	}
}
</script>
