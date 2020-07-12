<template>
  <div>
   	<a-table :scroll="{x: 800}" v-show="showTable" :bordered="false" :pagination="pagination"  :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange }" :dataSource="pageData.data" :columns="columnss" :rowKey="record=>record[rowKeys]" :indentSize=0 :loading="loading">
	  <!--<template slot="docDefId" slot-scope="text, record, index">
      <div class="editable-row-operations">
        <span v-if="record.editable">
          <a @click="() => save(record.docDefId,record)">保存</a>
          <a-popconfirm title="Sure to cancel?" @confirm="() => cancel(record.docDefId)">
            <a>取消</a>
          </a-popconfirm>
        </span>
        <span v-else>
          <a :disabled="editingKey !== ''" @click="() => edit(record.docDefId)">编辑</a>
        </span>
      </div>
      </template>
		<template
            v-for="col in ['docTypeCode', 'docNoLen', 'faceAmount']"
            :slot="col"
            slot-scope="text, record, index"
          >
        <div :key="col">
        <a-input
          v-if="record.editable"
          style="margin: -5px 0"
          :value="text"
          @change="e => handleChange(e.target.value, record.docDefId, col)"
        />
        <template v-else>
          {{ text }}
        </template>
      </div>
    </template>
	   <template
            slot="invalidDate"
            slot-scope="text, record, index"
          >
        <div key="invalidDate">
        <a-date-picker
          v-if="record.editable"
          style="margin: -5px 0"
          :placeholder="text"
		  format="YYYY/MM/DD"
          @change="(date, dateString) => handleChange(dateString, record.docDefId, 'invalidDate')"
        />
        <template v-else>
         {{text}}
        </template>
      </div>
    </template>
	 <template
            slot="docCatCode"
            slot-scope="text, record, index"
          >
        <div key="docCatCode">
        <Select
          v-if="record.editable"
          style="margin: -5px 0"
          :value="text"
          @change="(value)=> handleChange(value, record.docDefId, 'docCatCode')"
        />
        <template v-else>
         {{text === '0' ? '财务单证' :text === '1' ? '自定义单证':'第三方单证'}}
        </template>
      </div>
    </template>
	    <template
            v-for="col in ['isValued', 'isValid', 'isVirtual','docTypeCode', 'docNoLen', 'faceAmount']"
            :slot="col"
            slot-scope="text, record, index"
          >
        <div :key="col">
        <Selects
          v-if="record.editable&&(col=='isValued'||col=='isValid'||col=='isVirtual')"
          style="margin: -5px 0"
          :value="text"
          @change="value => handleChange(value, record.docDefId, col)"
        />
		<a-input
		  v-else-if="record.editable&&(col=='docTypeCode'||col=='docNoLen'||col=='faceAmount')"
          style="margin: -5px 0"
          :value="text"
          @change="e => handleChange(e.target.value, record.docDefId, col)"
		></a-input>
        <template v-else-if="col=='isValued'||col=='isValid'||col=='isVirtual'">
           {{text === 'Y' ? '是' : '否'}}
        </template>
		 <template v-else-if="col=='docTypeCode'||col=='docNoLen'||col=='faceAmount'">
           {{text}}
        </template>
      </div>
    </template>-->
	</a-table>
  <!--<a-modal :visible="showModal" :title="showModalTitle" @ok="handleOk" :confirmLoading="confirmLoading" @cancel="handleCancel">
       <a-row :span="16">
   <a-form :labelCol="filterFormLayout.labelCol" :wrapperCol="filterFormLayout.wrapperCol" :form="filterForm">
   <a-col :span="8">
   <a-form-item label="健管卡类型">
     <Select :dataList="dataList1" v-decorator="['docCatCode', {initialValue: ''}]" />
   </a-form-item>
   </a-col>
    <a-col :span="8">
   <a-form-item label="健管卡类型码">
   <a-input v-decorator="['docTypeCode', {initialValue: ''}]"></a-input>
   </a-form-item>
   </a-col>
    <a-col :span="8">
   <a-form-item label="健管卡号码长度">
   <a-input v-decorator="['docNoLen', {initialValue: ''}]"></a-input>
   </a-form-item>
   </a-col>
     <a-col :span="8">
   <a-form-item label="是否有价">
     <Select :dataList="dataList2" v-decorator="['isValued', {initialValue: ''}]" />
   </a-form-item>
   </a-col>
     <a-col :span="8">
   <a-form-item label="是否虚拟卡">
     <Select :dataList="dataList2" v-decorator="['isVirtual', {initialValue: ''}]"/>
   </a-form-item>
   </a-col>
   <a-col :span="8">
   <a-form-item label="是否有效">
     <Select :dataList="dataList2" v-decorator="['isValid', {initialValue: ''}]"/>
   </a-form-item>
   </a-col>
     <a-col :span="8">
   <a-form-item label="有效截止日期">
    <a-input v-decorator="['invalidDate', {initialValue: ''}]"></a-input>
   </a-form-item>
   </a-col>
    <a-col :span="8">
   <a-form-item label="票面金额">
    <a-input v-decorator="['faceAmount', {initialValue: ''}]"></a-input>
   </a-form-item>
   </a-col>
   </a-form>
   </a-row>
  </a-modal>-->
  </div>
</template>

<script>
import api from '@/api/api-table-post'
import moment from "moment"
// import Select from './card-select-type.vue'
// import Selects from './card-select-yesno.vue'
const tableItems =
{
	lebel: ['健管卡代码', '健管卡名称', '产品代码', '产品名称', '生效日期', '失效日期', '流水号'],
	key: ['docCode', 'docName', 'productCode', 'productName', 'statusDate', 'invalidDate', 'docNo']
}
const rowKeys = 'docId'
export default {
	name: 'health-card-select',
	props: {
		rowKeys: {
			type: String,
			default () {
				return rowKeys
			}
		},
		columns: {
			type: Array,
			default () {
				const tableItemsList = []
				tableItemsList.push(
				  	{
						align: "left",
						title: "序号",
						customRender: (text, record, index) => {
							return `${index + 1}`
						}
					},
				)
				tableItems.lebel.map((item, index) => {
				   const tableList = {
					  align: "left",
					  title: item,
					  dataIndex: `${tableItems.key[index]}`
				   }
				    tableItemsList.push(tableList)
				})
				return tableItemsList
				// return [
				// 	{
				// 		align: "left",
				// 		title: "序号",
				// 		customRender: (text, record, index) => {
				// 			return `${index + 1}`
				// 		}
				// 	},
				//    {
				// 		align: "center",
				// 		title: "健管卡代码",
				// 		dataIndex: "docCode"
				// 	},
				// 	{
				// 		align: "center",
				// 		title: "健管卡名称",
				// 		dataIndex: "docName"
				// 	},
				// 	{
				// 		align: "center",
				// 		title: "产品代码",
				// 		dataIndex: "productCode"
				// 		// scopedSlots: { customRender: 'docCatCode' }
				// 	},
				// 	{
				// 		align: "center",
				// 		title: "产品名称",
				// 		dataIndex: "productName"
				// 		// scopedSlots: { customRender: 'docTypeCode' }
				// 	},
				// 	{
				// 		align: "center",
				// 		title: "生效日期",
				// 		dataIndex: "statusDate"
				// 		// scopedSlots: { customRender: 'docNoLen' }
				// 	},
				// 	{
				// 		align: "center",
				// 		title: "失效日期",
				// 		dataIndex: "invalidDate"
				// 		// scopedSlots: { customRender: 'isValued' }
				// 	},
				// 	{
				// 		align: "center",
				// 		title: "流水号",
				// 		dataIndex: "docNo"
				// 		// scopedSlots: { customRender: 'isVirtual' }
				// 	}
				// ]
			}
		},
		// 这个字段需要在'@/api/api-table-post'中定义接口
		apiName: {
			type: String,
			default () {
				return "checkData"
			}
		},
		placeholder: {
			type: String,
			default () {
				return '请选择'
			}
		},
		value: {
			type: String,
			default () {
				return undefined
			}
		},
		mode: {
			type: String,
			default () {
				return 'default'
			}
		},
		showSearch: {
			type: Boolean,
			default () {
				return true
			}
		},
		filterOption: {
			type: Boolean,
			default () {
				return true
			}
		},
		allowClear: {
			type: Boolean,
			default () {
				return false
			}
		},
		disabled: {
			type: Boolean,
			default () {
				return false
			}
		}
	},
	data () {
		return {
			loading: false,
			showTable: true,
			showModal: false,
			confirmLoading: false,
			showModalTitle: '健管卡修改',
			filterForm: this.$form.createForm(this),
			editingKey: '',
			columnss: [
				//    {
				// 	align: "center",
				// 	title: "健管卡代码",
				// 	dataIndex: "docCode"
				// },
				// {
				// 	align: "center",
				// 	title: "健管卡名称",
				// 	dataIndex: "docCode"
				// },
				// {
				// 	align: "center",
				// 	title: "健管卡类型",
				// 	dataIndex: "docCode"
				// },
				// {
				// 	align: "center",
				// 	title: "健管卡号码长度",
				// 	dataIndex: "docCode"
				// },
				// {
				// 	align: "center",
				// 	title: "是否有价",
				// 	dataIndex: "docCode"
				// },
				// {
				// 	align: "center",
				// 	title: "是否虚拟卡",
				// 	dataIndex: "docCode"
				// },

				// {
				// 	align: "center",
				// 	title: "是否有效",
				// 	dataIndex: "docCode"
				// },
				// {
				// 	align: "center",
				// 	title: "有效截止日期",
				// 	dataIndex: "docCode"
				// },
				// {
				// 	align: "center",
				// 	title: "有效截止日期",
				// 	dataIndex: "docCode"
				// },
				// {
				// 	align: "center",
				// 	title: "操作",
				// 	dataIndex: "id",
				// 	scopedSlots: { customRender: 'docCode' }
				// }
			],
			dataLists: [],
			selectedVal: 0,
			selectedRows: [],
			selectedRowKeys: [],
			pageData: {
				dataCount: 0,
				data: []
			},
			rowSelection: {
				onChange: (selectedRowKeys, selectedRows) => {
					this.selectedRows = selectedRows
					this.selectedRowKeys = selectedRowKeys
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
			cacheData: {},
			query: {}
		}
	},
	mounted () {
		// this.loadPageData()
	},
	components: {
		// Select,
		// Selects
	},
	watch: {
		columns (newV, oldV) {
			this.columnss = newV
		}
	},
	methods: {
		onPageChange (page, pageSize) {
			this.pagination.current = page
			this.loadPageData()
		},
		onPageSizeChange (current, size) {
			this.pagination.pageSize = size
			this.loadPageData()
		},
		initValue (query) {
		 this.pagination.current = 1
		 this.pagination.pageSize = 10
		 this.query = query
		 this.loadPageData()
		},
		loadPageData () {
			let data = {
				page: this.pagination.current,
				limit: this.pagination.pageSize
			}
			this.query.docDefId ? Object.assign(data, this.query) : ''
			this.loading = true
			api[this.apiName](data).then(res => {
			// let res = {"total": 353, "data": [{"docDefId": 71, "docCode": "JG33/16B", "docName": "人民健康一卡通钻石卡虚拟激活卡", "docCatCode": "1", "docTypeCode": "AFL", "docNoLen": 7, "isValued": "Y", "isVirtual": "Y", "isValid": "Y", "invalidDate": "9999-12-30", "insertOper": null, "insertTime": null, "updateTime": null, "updateOper": null, "faceAmount": 2000.0, "delayStartDate": null, "delayEndDate": null, "confirmDate": null, "statusDate": null, "productCode": null, "productName": null, "docId": null, "insertDate": null, "updateDate": null, "docNo": null}, {"docDefId": 72, "docCode": "JG29/16B", "docName": "人民健康一卡通--悠享健康管家服务卡（虚拟）", "docCatCode": "0", "docTypeCode": "AES", "docNoLen": 7, "isValued": "Y", "isVirtual": "Y", "isValid": "Y", "invalidDate": "9999-12-30", "insertOper": null, "insertTime": null, "updateTime": null, "updateOper": null, "faceAmount": 2780.0, "delayStartDate": null, "delayEndDate": null, "confirmDate": null, "statusDate": null, "productCode": null, "productName": null, "docId": null, "insertDate": null, "updateDate": null, "docNo": null}, {"docDefId": 73, "docCode": "JG36/16B", "docName": "健康守望C健康尊享卡C卡（虚拟）", "docCatCode": "0", "docTypeCode": "AGL", "docNoLen": 7, "isValued": "Y", "isVirtual": "Y", "isValid": "Y", "invalidDate": "9999-12-30", "insertOper": null, "insertTime": null, "updateTime": null, "updateOper": null, "faceAmount": 3650.0, "delayStartDate": null, "delayEndDate": null, "confirmDate": null, "statusDate": null, "productCode": null, "productName": null, "docId": null, "insertDate": null, "updateDate": null, "docNo": null}, {"docDefId": 74, "docCode": "TJ003", "docName": "关爱父母体检套餐男", "docCatCode": "1", "docTypeCode": "GANA", "docNoLen": 9, "isValued": "Y", "isVirtual": "Y", "isValid": "Y", "invalidDate": "9999-12-30", "insertOper": null, "insertTime": null, "updateTime": null, "updateOper": null, "faceAmount": 1066.0, "delayStartDate": null, "delayEndDate": null, "confirmDate": null, "statusDate": null, "productCode": null, "productName": null, "docId": null, "insertDate": null, "updateDate": null, "docNo": null}, {"docDefId": 75, "docCode": "JG23/16B", "docName": "乐享洁牙卡实物激活卡", "docCatCode": "0", "docTypeCode": "AEL", "docNoLen": 7, "isValued": "Y", "isVirtual": "N", "isValid": "Y", "invalidDate": "9999-12-30", "insertOper": null, "insertTime": null, "updateTime": null, "updateOper": null, "faceAmount": 268.0, "delayStartDate": null, "delayEndDate": null, "confirmDate": null, "statusDate": null, "productCode": null, "productName": null, "docId": null, "insertDate": null, "updateDate": null, "docNo": null}, {"docDefId": 76, "docCode": "JG31/16B", "docName": "人民健康一卡通--公益扶贫健康关爱服务（虚拟）", "docCatCode": "0", "docTypeCode": "AEU", "docNoLen": 7, "isValued": "Y", "isVirtual": "Y", "isValid": "Y", "invalidDate": "9999-12-30", "insertOper": null, "insertTime": null, "updateTime": null, "updateOper": null, "faceAmount": 10.0, "delayStartDate": null, "delayEndDate": null, "confirmDate": null, "statusDate": null, "productCode": null, "productName": null, "docId": null, "insertDate": null, "updateDate": null, "docNo": null}, {"docDefId": 77, "docCode": "JG37/16B", "docName": "健康守望C健康尊享卡D卡（虚拟）", "docCatCode": "0", "docTypeCode": "AGM", "docNoLen": 7, "isValued": "Y", "isVirtual": "Y", "isValid": "Y", "invalidDate": "9999-12-30", "insertOper": null, "insertTime": null, "updateTime": null, "updateOper": null, "faceAmount": 6050.0, "delayStartDate": null, "delayEndDate": null, "confirmDate": null, "statusDate": null, "productCode": null, "productName": null, "docId": null, "insertDate": null, "updateDate": null, "docNo": null}, {"docDefId": 78, "docCode": "JG22/16B", "docName": "洁牙卡产品实物激活卡", "docCatCode": "0", "docTypeCode": "AEK", "docNoLen": 7, "isValued": "Y", "isVirtual": "N", "isValid": "Y", "invalidDate": "9999-12-30", "insertOper": null, "insertTime": null, "updateTime": null, "updateOper": null, "faceAmount": 198.0, "delayStartDate": null, "delayEndDate": null, "confirmDate": null, "statusDate": null, "productCode": null, "productName": null, "docId": null, "insertDate": null, "updateDate": null, "docNo": null}, {"docDefId": 79, "docCode": "TJ001", "docName": "普通体检套餐男", "docCatCode": "1", "docTypeCode": "PTNA", "docNoLen": 9, "isValued": "Y", "isVirtual": "Y", "isValid": "Y", "invalidDate": "9999-12-30", "insertOper": null, "insertTime": null, "updateTime": null, "updateOper": null, "faceAmount": 426.0, "delayStartDate": null, "delayEndDate": null, "confirmDate": null, "statusDate": null, "productCode": null, "productName": null, "docId": null, "insertDate": null, "updateDate": null, "docNo": null}, {"docDefId": 80, "docCode": "JG38/16B", "docName": "健康守望C健康尊享卡E卡（虚拟）", "docCatCode": "0", "docTypeCode": "AGN", "docNoLen": 7, "isValued": "Y", "isVirtual": "Y", "isValid": "Y", "invalidDate": "9999-12-30", "insertOper": null, "insertTime": null, "updateTime": null, "updateOper": null, "faceAmount": 11600.0, "delayStartDate": null, "delayEndDate": null, "confirmDate": null, "statusDate": null, "productCode": null, "productName": null, "docId": null, "insertDate": null, "updateDate": null, "docNo": null}]}
				console.log(res, 'result')
				this.pageData.data = res.data
				this.showTable = true
				this.pageData = res.data || { totalCount: 0, data: [] }
				this.pageData.data.forEach((item, index) => {
					item.recordIndex = index + 1
					item.invalidDate ? item.invalidDate = moment(item.invalidDate).format('YYYY-MM-DD') : ''
				})
				this.pagination.total = this.pageData.totalCount
				this.selectedRowKeys = []
				this.$emit('SuccessGetData', this.query)
			}).finally(() => {
				this.loading = false
			})
		},
		onSelectChange (selectedRowKeys, selectedRows) {
			// console.log('selectedRowKeys changed: ', selectedRowKeys)
			this.selectedRowKeys = selectedRowKeys
			let selectedRowKey = JSON.parse(JSON.stringify(selectedRowKeys))
			let pageData = JSON.parse(JSON.stringify(this.pageData.data))
			this.$emit('changeRowKeys', selectedRowKey, pageData)
		},
		// 点击了保存后，默认选中，并将值传给父组件
		// showRecordInfo (record) {
		// 	this.selectedRowKeys.push(record.docDefId)
		// 	this.selectedRowKeys = Array.from(new Set(this.selectedRowKeys))
		// 	// console.log(this.pageData.data)
		// 	// this.showModalTitle = record.docCode
		// 	// this.showModal = true
		// 	// this.$nextTick(() => {
		// 	// 	this.filterForm.setFieldsValue(record)
		// 	// })
		// 	this.$emit('tableEdit', this.selectedRowKeys, this.pageData.data)
		// },
		onChange (value, option) {
			this.$emit('input', value, option)
			this.$emit('change', value, option)
		},
		onSelect (value, opiton) {
			this.$emit('select', value, opiton)
		}
	},
	created () {
		this.columnss = this.columns
	//   this.dataLists = this.dataList
	}
}
</script>

<style>

</style>
