<template>
  <a-card :bordered="false">

    <a-card>
      <a-divider orientation="left">
        <a-icon type="download" /> 自营服务批量导入</a-divider>
      <a-form :form="filterForm" :labelCol="filterFormLayout.labelCol" :wrapperCol="filterFormLayout.wrapperCol">
        <a-row :gutter="16">
          <a-col :span="9">
            <a-form-item label="分公司自营服务项目">
              <a-input placeholder="" v-model="filesName"/>
            </a-form-item>
          </a-col>
          <a-col :span="14" style="text-align:left">
			  <a-upload
						name="file"
						:multiple="true"
						:action="actionUrl"
						:headers="headers"
						@change="handleChange"
						:file-list="fileList"
						:remove="handleRemove"
						:before-upload="beforeUpload">
						<a-button type="primary"> 浏览 </a-button>
					</a-upload>
            <a-button :loading="aloading" type="primary" class="editable-add-btn" style="margin:0px 10px 0 0;" @click="BtnhandleUpload">导入</a-button>
            <a-button type="" class="editable-add-btn" style="margin:5px 10px 0 0;" @click="cancelFn">清空</a-button>
            <a-button type="" class="editable-add-btn" style="margin:0px 10px 0 0;" @click="exportTemplate">下载导入模板</a-button>
            <a-button type="" class="editable-add-btn" style="margin:0px 10px 0 0;" @click="exportErrList">下载失败清单</a-button>
          </a-col>
        </a-row>
      </a-form>
			<div id="blink">模板更新时间：2020-06-22</div>
    </a-card>
    <a-card style="margin-top:24px;">
      <span href="#" slot="title" style="float:left;">
        <a-icon type="download" /> 导入列表</span>
      <a href="#" slot="extra">
        <a-icon :type="iconType" />
      </a>
      <a-table v-show="showTable" :scroll="{ x: 'calc(2000px + 50%)'}" :bordered="false" :pagination="pagination"  :dataSource="pageData.data" :columns="columns" :rowKey="record => record.recordIndex" :indentSize="0" :loading="loading"
               :row-selection="{ type: 'checkbox', selectedRowKeys: selectedRowKeys, onChange: onRowChange }">
        <a slot="docCode" slot-scope="text, record">{{ text }}</a>
        <a slot="docName" slot-scope="text, record">{{ text }}</a>
        <span slot="docCatCode" slot-scope="text, record">{{
          getDocCatName(text)
          }}</span>
        <a-tag slot="yesNo" slot-scope="text, record" :color="text === 'Y' ? 'green' : 'orange'">{{ text === "Y" ? "是" : "否" }}</a-tag>
      </a-table>
      <a-row :gutter="16">
        <a-col :span="24" style="margin:10px 0 0 0;text-align:right">
          <a-button type="" :disabled="selectedRows.length === 0" @click="deleteSelected" class="editable-add-btn" style="float:right;margin-right:10px;">删除</a-button>
          <a-button type="primary" :disabled="selectedRows.length === 0"  @click="submitSelected"  class="editable-add-btn" style="float:right;margin-right:10px;">提交审核</a-button>
        </a-col>
      </a-row>
    </a-card>

    <a-modal v-model="formModal" style="top: 30px;" :width="800" title="操作提示">
      <a-form :form="dataForm1" :labelCol="{span: 6}" :wrapperCol="{span: 18}">
        <a-card style="margin: 24px;" v-for="(item,index) in customers"  :key = "index">
          <a-row :gutter="16">
            <a-col :span="12">
              <a-form-item label="实施管家">
                <a-input disabled= "true" placeholder="" v-decorator="[ 'systemNo'+index, {initialValue: item.systemNo}]"/>
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item label="审批主管">
                <LeaderSelect :defaultDisplayFirst="true" :dicType=item.systemNo  v-decorator="['oper'+index,{initialValue: null, rules: [ {required: true, message: '请选择审批主管'}]} ]" placeholder="请选择审批主管" />
              </a-form-item>
            </a-col>
          </a-row>
        </a-card>
      </a-form>
      <div slot="footer">
        <a-button type="" @click="formModal=false">取消</a-button>
        <a-button :loading="submitLoading" type="primary" @click="submitForm">确定</a-button>
      </div>
    </a-modal>
	  <HandleModelPreview ref="handleModelPreview" />
  </a-card>
</template>
<script>
import api from "@/api/api-serve-apply"
import LeaderSelect from '../SalaryPerformance/components/Importleader-select'
import { Promise } from 'q'
import HandleModelPreview from './components/improt-template-handleModel2'
export default {
	name: "import-branchself-performance",
	components: {LeaderSelect, HandleModelPreview},
	data () {
		return {
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
			selectedRowKeys: [],
			selectedRows: [],
			dataList: [], // 下拉选择的数据集合
			customers: [{}], // 管家列表
			successList2: [{}], // 行选中数据集合
			fileList: [],
			loading: false,
			uploading: false,
			formModal: false,
			headers: {},
			aloading: false,
			showTable: true,
			actionUrl: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
			isuploadFile: true,
			filesName: '',
			errorFileName: '',
			iconType: 'down',
			columns: [
				// {
				// 	align: "left",
				// 	title: "状态",
				// 	dataIndex: "state",
				// 	scopedSlots: { customRender: "docCode" }
				// },
				{
					align: "left",
					title: "序号",
					dataIndex: "recordIndex"
				},
				{
					align: "left",
					title: "管理机构",
					// dataIndex: "auditOpinion",
					dataIndex: "orgName",
					scopedSlots: { customRender: "docName" }
				},
				{
					align: "left",
					title: "服务实施日期",
					// dataIndex: "serDate"
					dataIndex: "serveTime"
				},

				{
					align: "left",
					title: "服务项目",
					// dataIndex: "serItems"
					dataIndex: "serveItem"
				},
				{
					align: "left",
					title: "服务细类",
					// dataIndex: "category"
					dataIndex: "serveItemSub"
				},
				{
					align: "left",
					title: "服务数量",
					// dataIndex: "quantity"
					dataIndex: "serveCount"
				},
				{
					align: "left",
					title: "服务单位",
					// dataIndex: "serviceUnit"
					dataIndex: "serveUnit"
				},
				{
					align: "left",
					title: "客户人数",
					// dataIndex: "customers"
					dataIndex: "customerNum"
				},
				{
					align: "left",
					title: "服务实施部门",
					// dataIndex: "department"
					dataIndex: "serviceExecuteOrg"
				},
				{
					align: "left",
					title: "健管中心/VIP诊疗室名称",
					// dataIndex: "healthCenter"
					dataIndex: "vipSeverName"
				},
				{
					align: "left",
					title: "客户类型",
					// dataIndex: "customerType"
					dataIndex: "customerType"
				},

				{
					align: "left",
					title: "团体客户名称",
					// dataIndex: "cusName"
					dataIndex: "teamName"
				},
				{
					align: "left",
					title: "团体客户人数",
					// dataIndex: "cusNumbers"
					dataIndex: "teamNum"
				},
				{
					align: "left",
					title: "客户姓名",
					// dataIndex: "customerName"
					dataIndex: "customeName"
				},
				{
					align: "left",
					title: "证件类型",
					// dataIndex: "idType"
					dataIndex: "customeCertType"
				},
				{
					align: "left",
					title: "证件号码",
					// dataIndex: "idNumber"
					dataIndex: "customeCertNum"
				},
				{
					align: "left",
					title: "性别",
					// dataIndex: "gender"
					dataIndex: "customeSex"
				},
				{
					align: "left",
					title: "出生日期",
					// dataIndex: "birthDate"
					dataIndex: "borthTime"
				},
				{
					align: "left",
					title: "联系电话",
					// dataIndex: "Tel"
					dataIndex: "custTel"
				},
				{
					align: "left",
					title: "客户来源",
					// dataIndex: "customerSource"
					dataIndex: "custChannelDesc"
				},
				{
					align: "left",
					title: "服务机构/预约医院",
					// dataIndex: "hospital"
					dataIndex: "serviceProvider"
				},
				{
					align: "left",
					title: "实施管家账号",
					// dataIndex: "account"
					dataIndex: "systemNo"
				},
				{
					align: "left",
					title: "备注",
					// dataIndex: "remarks"
					dataIndex: "remark"
				}

			],
			rowSelection: {
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
		onRowChange (selectedRowKeys, selectedRows) {
			this.selectedRowKeys = selectedRowKeys || []
			this.selectedRows = selectedRows
		},
		loadPageData () {
			this.selectedRowKeys = []
			this.selectedRows = []
			let query = this.filterForm.getFieldsValue()
			let data = {
				page: this.pagination.current,
				limit: this.pagination.pageSize
			}
			this.loading = true
			api.qureyList(data).then(res => {
				console.log(res, "result")
				this.pageData = res || { totalCount: 0, data: [] }
				console.log(this.pageData.data, 'this.pageData.data')
				this.pageData.data.forEach((item, index) => {
					item.recordIndex = index + 1
				})
				this.pagination.total = this.pageData.totalCount
			}).finally(() => {
				this.loading = false
			})
		},
		exportTemplate () {
			let query = this.filterForm.getFieldsValue()
			api.export(query).then(res => {
				if (res !== (undefined || '')) {
					// base64内容，文件名
					this.$downloadFileByBase64(res, `自营项目业绩导入模板.xlsx`)
				} else {
					this.$message.error('文件下载失败,请重试')
				}
			})
		},
		handleChange () {
			this.isuploadFile = false
		},
		beforeUpload (file) {
			this.fileList = [...this.fileList, file]
			this.filesName = this.fileList[0].length !== 0 ? this.fileList[0].name : ''
			return false
		},
		handleRemove (file) {
			const index = this.fileList.indexOf(file)
			const newFileList = this.fileList.slice()
			newFileList.splice(index, 1)
			this.fileList = newFileList
		},
		// 取消按钮点击事件
		cancelFn () {
			this.fileList = []
			this.filesName = ''
		},
		BtnhandleUpload () {
			this.aloading = true
			const { fileList } = this
			if (fileList[0] && fileList[0].name) {
				var data = new FormData()
				fileList.map((item, index) => {
					data.append('file', item)
				})
				api.importPerformance(data).then(res => {
				  	if (res.status !== 0) {
						this.$message.error(res.statusText)

						// this.loadPageData()
					} else {
						this.loadPageData()
						if (res.data.sameMSG !== undefined) {
							this.$refs.handleModelPreview.show(res.data)
							if (res.data.errorFileName !== undefined) {
								this.errorFileName = res.data.errorFileName
								// this.$message.error(res.data.msg + ' 请点击失败清单下载查看！')
							}
							// else {
							// 	this.$message.success(res.data.msg)
							// }
						} else {
							if (res.data.errorFileName !== undefined) {
								this.errorFileName = res.data.errorFileName
						  this.$message.error(res.data.msg + ' 请点击失败清单下载查看！')
							} else {
								this.$message.success(res.data.msg)
							}
						}
					}
				}).catch((e) => {
					this.errorFileName = e.data.errorFileName
				}).finally(() => {
					this.aloading = false
					console.log('处理加载')
				})
			} else {
				this.$message.warning('未指定文件路径！')
			}
		},
		exportErrList () {
			if (this.errorFileName === (undefined || '')) {
				this.$message.error('失败清单不存在！')
			} else {
				this.$downloadFileByBase64(this.errorFileName, `失败清单信息.xls`)
			}
		},

		/**
     * 删除按钮
     */
		deleteSelected () {
		  if (this.selectedRows.length === 0) {
				this.$message.info('请选择要删除的行！')
				return
			}
			let data = {
				customerList: [],
				status: '02',
				hadleType: '02' // 删除
			}
			this.selectedRows.forEach((item, index) => {
				let customer = {}
				customer.customeNo = item.customeNo
				data.customerList.push(customer)
			})
			this.loading = true
			api.submitPerformanceAudit(data).then(res => {
				let code = res.data.code
				if (code === '00') {
					this.$message.success("删除成功！")
					this.searchHandle()
				} else if (code === '01') {
					this.$message.error(res.msg)
				} else {
					this.$message.error('删除失败')
				}
			}).finally(() => {
				this.loading = false
			})
		},

		/**
     * 提交审核按钮
     */
		submitSelected () {
			if (this.selectedRows.length === 0) {
				this.$message.info('请选择要删除的行！')
				return
			}
			// 遍历需要提交的数据,只有一个上级主管，则默认，有多个，且管家不同，则选择、auditOperAccountName
			this.customers = []
			this.selectedRows.forEach((item, index) => {
				// 获取选中行的所有数据
				{
					let successList = {}
					successList.customeNo = item.customeNo
					successList.systemNo = item.systemNo
					successList.orgCode = item.orgCode
					successList.serveTime = item.serveTime
					this.successList2.push(successList)
				}
				console.log(item.systemNo, "item.systemNo999999999999999999999999999999")
				let isHasSame = false
				if (this.customers.length > 0) {
					this.customers.forEach((item2, index2) => {
						if (item.systemNo === item2.systemNo) {
							isHasSame = true
						}
					})
				}
				if (isHasSame === false) { // 没有相同的
					let customer = {}
					customer.customeNo = item.customeNo
					customer.systemNo = item.systemNo
					customer.orgCode = item.orgCode
					customer.serveTime = item.serveTime
					customer.status = '02'
					// customer.auditOperAccount = item.auditOperAccount
					this.customers.push(customer)
				}
			})
			this.customers.forEach((item4, index4) => {
			  console.log(item4, 'item4')
			  	// api.getuserupoperlist2({sysNo: item4.systemNo}).then(res => {
				// if (res.data == null) {
				// 	this.$message.error('未配置审核主管信息或查询审批主管失败')
				// 	 this.formModal = false
				// 	}
				// }
			})
			//
			this.formModal = true
		},

		/**
     *
     */
		submitForm () {
		  let flag = true
		  let customersList = []
			this.customers.forEach((item, index) => {
			  let auditOperAccountName = this.dataForm1.getFieldValue('oper' + index)
			  let sysno = item.systemNo
				if (auditOperAccountName === null || auditOperAccountName === '') {
					flag = false
					this.$message.error('请您先配置管家与主管关系的数据！')
				}
				item.auditOperAccount = auditOperAccountName
				this.successList2.forEach((item2, index2) => {
					if (sysno == item2.systemNo) {
						let customer = {}
						customer.customeNo = item2.customeNo
						customer.orgCode = item2.orgCode
						customer.serveTime = item2.serveTime
						customer.status = '02'
				         customer.auditOperAccount = item.auditOperAccount
						customersList.push(customer)
					}
				})
			})
			if (!flag) {
				return
			}
			let data = {
				customerList: customersList,
				status: '02',
				hadleType: '01'// 提交
			}
			this.loading = true
			api.submitPerformanceAudit(data).then(res => {
				let code = res.data.code
				if (code === '00') {
					this.$message.success("提交审核成功！")
					this.formModal = false
					this.searchHandle()
				} else if (code === '01') {
					this.$message.error(res.msg)
				} else {
					this.$message.error('提交审核失败')
				}
				this.dataForm1.resetFields()
				this.successList2 = [{}]
			}).finally(() => {
				this.loading = false
			})
		}
	}
}
</script>
<style lang="less" scoped>
	#blink {
		margin: 20px 0 0 366px;
		font-size: 22px;
		animation:blink 1s infinite;
	}
	@keyframes blink {
		from {color:#ff0000;}
		to {color:#c0c0c0;}
}
</style>
