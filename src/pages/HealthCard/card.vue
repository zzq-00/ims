<template>
  <a-card :bordered="false">
    <!--<a-card>
      <a-form :form="filterForm" :labelCol="filterFormLayout.labelCol" :wrapperCol="filterFormLayout.wrapperCol">
        <a-row :gutter="16">
          <a-col :span="8">
            <a-form-item label="健管卡代码">
							<HealthCardSelect ref="healthCardSelect" :allowClear="true" @change="searchHandle" v-decorator="['docDefId', {initialValue: ''}]" />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="健管卡类型">
              <DicSelect ref="dicCatCode" dicType="DOC_CAT_CODE" :allowClear="true" @change="searchHandle" v-decorator="['docCatCode', {initialValue: ''}]" />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="健管卡类型码">
              <a-input v-decorator="['docTypeCode', {initialValue: ''}]" />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="是否有价">
              <DicSelect dicType="YES_NO" :allowClear="true" @change="searchHandle" v-decorator="['isValued', {initialValue: ''}]" />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="是否虚拟卡">
              <DicSelect dicType="YES_NO" :allowClear="true" @change="searchHandle" v-decorator="['isVirtual', {initialValue: ''}]" />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="是否有效">
              <DicSelect dicType="YES_NO" :allowClear="true" @change="searchHandle" v-decorator="['isValid', {initialValue: ''}]" />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :span="12" :offset="11">
            <a-button type="" class="editable-add-btn" @click="resetFilterForm" style="float:right;margin-right:10px;">重置</a-button>
            <a-button type="" class="editable-add-btn" @click="exportRecord" style="float:right;margin-right:10px;">导出</a-button>
            <a-button type="" class="editable-add-btn" @click="searchHandle" style="float:right;margin-right:10px;">查询</a-button>
            <a-button type="primary" class="editable-add-btn" @click="addRecord" style="float:right;margin-right:10px;">新建</a-button>
          </a-col>
        </a-row>
      </a-form>
    </a-card>
    <a-card style="margin-top:24px;">
      <span href="#" slot="title" style="float:left;">
        <a-icon type="bank" /> 健管卡信息</span>
      	<a href="#" slot="extra">
        	<a-icon :type="iconType" @click="swithTableShow" />
				</a>
				<a-table :scroll="{ x: 'max-content'}" v-show="showTable" :bordered="false" :pagination="pagination" :rowSelection="rowSelection" :dataSource="pageData.data" :columns="columns" :rowKey="record => record.docDefId" :indentSize=0 :loading="loading">
					<a slot="docCode" @click="showRecordInfo(record)" slot-scope="text, record">{{(text)}}</a>
                  <a slot="docName" @click="showRecordInfo(record)" slot-scope="text, record">查看</a>
                  <span slot="docCatCode" slot-scope="text, record">{{getDocCatName(text)}}</span>
					<a-tag slot="yesNo" slot-scope="text, record" :color="text=== 'Y' ? 'green' : 'orange'" >{{text === 'Y' ? '是' : '否'}}</a-tag>
				</a-table>
    </a-card>-->
    <CardForm ref="cardForm" @on-update="onUpdateData" />
  </a-card>
</template>
<script>
import api from '@/api/api-health-card'
// import DicSelect from '@/components/dic-select'
// import HealthCardSelect from '@/components/health-card-select'
import CardForm from '@/pages/HealthCard/components/card-form'
import { turn2NewPage } from '@/libs/util'
import { Promise } from 'q'
export default {
	name: 'health-card',
	components: {CardForm },
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
			selectedRows: [],
			loading: false,
			showTable: true,
			iconType: 'down',
			columns: [
				{
					align: "left",
					title: "健管卡代码",
					dataIndex: "docCode",
					scopedSlots: { customRender: 'docCode' }
				},
				{
					align: "left",
					title: "健管卡名称",
					dataIndex: "docName",
					scopedSlots: { customRender: 'docName' }
				},
				{
					align: "left",
					title: "健管卡类型",
					dataIndex: "docCatCode",
					scopedSlots: { customRender: 'docCatCode' }
				},
				{
					align: "left",
					title: "健管卡类型码",
					dataIndex: "docTypeCode"
				},
				{
					align: "left",
					title: "健管卡号码长度",
					dataIndex: "docNoLen"
				},
				{
					align: "left",
					title: "是否有价",
					dataIndex: "isValued",
					scopedSlots: { customRender: 'yesNo' }
				},
				{
					align: "left",
					title: "是否虚拟卡",
					dataIndex: "isVirtual",
					scopedSlots: { customRender: 'yesNo' }
				},
				{
					align: "left",
					title: "是否有效",
					dataIndex: "isValid",
					scopedSlots: { customRender: 'yesNo' }
				},
				{
					align: "left",
					title: "有效截止日期",
					dataIndex: "invalidDate"
				},
				{
					align: "left",
					title: "票面金额",
					dataIndex: "faceAmount"
				}, {
					title: '操作',
					key: 'operation',
					fixed: 'right',
					width: 100,
					scopedSlots: { customRender: 'docName' }
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
				onShowSizeChange: (current, pageSize) => this.onPageSizeChange(current, pageSize),
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
		onUpdateData () {
			this.$refs.healthCardSelect.loadList()
			this.loadPageData()
		},
		loadPageData () {
			let query = this.filterForm.getFieldsValue()
			let data = {
				page: this.pagination.current,
				limit: this.pagination.pageSize
			}
			Object.assign(data, query)
			this.loading = true
			api.queryCardList(data).then(res => {
				console.log(res, 'result')
				this.pageData = res.data || { totalCount: 0, data: [] }
				this.pageData.data.forEach((item, index) => { item.recordIndex = index + 1 })
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
			this.$refs.cardForm.addForm()
		},
		showRecordInfo (obj) {
			this.$router.push({
				name: 'HalthCardInfoPage',
				params: obj
			})
			// this.$refs.cardForm.editForm(obj.docDefId, obj)
		},
		swithTableShow () {
			this.showTable = !this.showTable
			this.iconType = this.showTable ? 'down' : 'up'
		},
		exportRecord () {
			let query = this.filterForm.getFieldsValue()
			api.exportCardList(query).then(res => {
				if (res.status === undefined) {
					// base64内容，文件名
					this.$downloadFileByBase64(res, `健康卡定义查询.xls`)
				} else {
					this.$message.error('文件下载失败,请重试')
				}
				// let blob = new Blob([res.data], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'})
				// let objectUrl = URL.createObjectURL(blob)
				// window.open(objectUrl, '_blank')
			})
		}
	}
}
</script>
