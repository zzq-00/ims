<template>
  <div >
   	<a-table :scroll="{ x: 'max-content'}" v-show="showTable" :bordered="false" :pagination="pagination"  :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange }" :dataSource="pageData.data" :columns="columnss" :rowKey="record=>record.docDefId" :indentSize=0 :loading="loading">
	   <template
            slot="invalidDate"
            slot-scope="text, record, index"
          >
        <div key="invalidDate" @click.stop>
        <a-date-picker
          v-if="isEdit&&record.editable.invalidDate"
          style="margin: -5px 0"
          :placeholder="text"
		  format="YYYY-MM-DD"
          @change="(date, dateString) => handleChange(dateString, record.docDefId, 'invalidDate')"
        />
        <span v-else  @click.stop="() => edit(record, 'invalidDate')"  class="editable">
         {{text?text:'--'}}
        </span>
      </div>
    </template>
	 <template
            slot="docCatCode"
            slot-scope="text, record, index"
			@click.stop
          >
        <div key="docCatCode" @click.stop>
        <Select
          v-if="isEdit&&record.editable.docCatCode"
          style="margin: -5px 0"
          :value="text"
          @change="(value)=> handleChange(value, record.docDefId, 'docCatCode')"
        />
        <span v-else @click.stop="() => edit(record, 'docCatCode')" class="editable">
         {{text === '0' ? '财务单证' :text === '1' ? '自定义单证':'第三方单证'}}
        </span>
      </div>
    </template >
	    <template
            v-for="col in ['isValued', 'isValid', 'isVirtual','docTypeCode', 'docNoLen', 'faceAmount']"
            :slot="col"
            slot-scope="text, record, index"

          >
        <div :key="col" @click.stop>
        <Selects
          v-if="isEdit&&record.editable[col]&&(col=='isValued'||col=='isValid'||col=='isVirtual')"
          style="margin: -5px 0"
          :value="text"
          @change="value => handleChange(value, record.docDefId, col)"
        />
		<a-input
		  v-else-if="isEdit&&record.editable[col]&&(col=='docTypeCode'||col=='docNoLen'||col=='faceAmount')"
          style="margin: -5px 0"
          :value="text"
          @change="e => handleChange(e.target.value, record.docDefId, col)"
		></a-input>
        <span v-else-if="col=='isValued'||col=='isValid'||col=='isVirtual'" @click.stop="() => edit(record, col)" class="editable">
           {{text=='Y' ? '是' : text=='N' ? '否':'--'}}
        </span>
		 <span v-else-if="col=='docTypeCode'||col=='docNoLen'||col=='faceAmount'" @click.stop="() => edit(record, col)" class="editable">
           {{text?text:'--'}}
        </span>
      </div>
    </template>
	</a-table>
  </div>
</template>

<script>
import api from '@/api/api-table-post'
import Select from './card-select-type.vue'
import Selects from './card-select-yesno.vue'
export default {
	name: 'health-card-select',
	props: {
		columns: {
			type: Array,
			default () {
				return [
				   {
						align: "center",
						title: "健管卡代码",
						dataIndex: "docCode"
					},
					{
						align: "center",
						title: "健管卡名称",
						dataIndex: "docName"
					},
					{
						align: "center",
						title: "健管卡类型",
						dataIndex: "docCatCode", //
						scopedSlots: { customRender: 'docCatCode' }
					},
					{
						align: "center",
						title: "健管卡类型码",
						dataIndex: "docTypeCode",
						scopedSlots: { customRender: 'docTypeCode' }
					},
					{
						align: "center",
						title: "健管卡号码长度",
						dataIndex: "docNoLen",
						scopedSlots: { customRender: 'docNoLen' }
					},
					{
						align: "center",
						title: "是否有价",
						dataIndex: "isValued",
						scopedSlots: { customRender: 'isValued' }
					},
					{
						align: "center",
						title: "是否虚拟卡",
						dataIndex: "isVirtual",
						scopedSlots: { customRender: 'isVirtual' }
					},

					{
						align: "center",
						title: "是否有效",
						dataIndex: "isValid",
						scopedSlots: { customRender: 'isValid' }
					},
					{
						align: "center",
						title: "有效截止日期",
						dataIndex: "invalidDate",
						scopedSlots: { customRender: 'invalidDate' }
					},
					{
						align: "center",
						title: "票面金额",
						dataIndex: "faceAmount",
						scopedSlots: { customRender: 'faceAmount' }
					}
				]
			}
		},
		apiName: {
			type: String,
			default () {
				return "queryDocDefList"
			}
		},
		placeholder: {
			type: String,
			default () {
				return '请选择'
			}
		},
		value: {
			type: [Number, Array, String],
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
			showTable: false,
			showModal: false,
			confirmLoading: false,
			showModalTitle: '健管卡修改',
			filterForm: this.$form.createForm(this),
			editingKey: '',
			dataList1: [
				{label: '财务单证',
					value: 0
				},
				{label: '自定义单证',
					value: 1
				},
				{label: '第三方单证',
					value: 2
				}

			],
        	dataList2: [
				{label: '是',
					value: 'Y'
				},
				{label: '否',
					value: 'N'
				}
			],
			columnss: [],
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
			isEdit: false,
			isActive: {
			  name: '',
			  key: ''
			}
		}
	},
	mounted () {
		this.loadPageData()
	},
	components: {
		Select,
		Selects
	},
	watch: {
		columns (newV, oldV) {
			this.columnss = newV
		}
	},
	methods: {
		changeEdit () {
			this.isEdit = false
			// console.log('取消编辑')
		},
		handleChange (value, key, column) {
			const newData = [...this.pageData.data]
			const target = newData.filter(item => key === item.docDefId)[0]
			if (target) {
				target[column] = value
				this.pageData.data = newData
			}
			this.showRecordInfo(target.docDefId)
		},
		 edit (record, col) {
			//  console.log(1)
			 this.isEdit = true
			 this.editingKey = record.docDefId
			 this.isActive.name && this.isActive.key ? this.noFirseEdit(record, col) : this.firseEdit(record, col)
		},
		noFirseEdit (record, col) {
			const newData = [...this.pageData.data]
           	const target = newData.filter(item => this.isActive.name === item.docDefId)[0]
           	const targets = newData.filter(item => record.docDefId === item.docDefId)[0]
			target['editable'][this.isActive.key] ? target['editable'][this.isActive.key] = false : ''
			this.isActive.name = record.docDefId
			this.isActive.key = col
			targets['editable'][col] = true
			this.pageData.data = newData
		},
		firseEdit (record, col) {
			const newData = [...this.pageData.data]
           	const target = newData.filter(item => record.docDefId === item.docDefId)[0]
			this.isActive.name = record.docDefId
			this.isActive.key = col
			this.pageData.data = newData
		},
		handleOk () {
			this.showModal = false
			this.$nextTick(() => {

			})
			// this.$message.success('修改成功')
		},
		onPageChange (page, pageSize) {
			this.pagination.current = page
			this.loadPageData()
		},
		onPageSizeChange (current, size) {
			this.pagination.pageSize = size
			this.loadPageData()
		},
		loadPageData (query) {
			query ? this.query = query : ''
			let data = {
				page: this.pagination.current,
				limit: this.pagination.pageSize
			}
			this.query ? Object.assign(data, this.query) : ''
			this.loading = true
			// // console.log(this.apiName)
			api[this.apiName](data).then(res => {
				this.showTable = true
				this.pageData = res.data || { totalCount: 0, data: [] }
				this.pageData.data.forEach((item, index) => {
					 item.recordIndex = index + 1
					  item['editable'] = {}
					 item.invalidDate && item.invalidDate.indexOf('/') !== -1 ? item.invalidDate = item.invalidDate.split('/').join('-') : ''
					 })
				this.isActive.name = ''
				this.isActive.key = ''
				this.pagination.total = this.pageData.totalCount
				this.selectedRowKeys = []
				// console.log(this.pageData.data)
			}).finally(() => {
				this.loading = false
			})
		},
		onSelectChange (selectedRowKeys, selectedRows) {
			this.selectedRowKeys = selectedRowKeys
			let selectedRow = JSON.parse(JSON.stringify(selectedRows))
			this.$emit('tableEdit', selectedRow)
		},
		// 点击了保存后，默认选中，并将值传给父组件
		showRecordInfo (docDefId) {
			this.selectedRowKeys.push(docDefId)
			this.selectedRowKeys = Array.from(new Set(this.selectedRowKeys))
			let tableData = this.pageData.data
			var pageDatas = []
			this.selectedRowKeys.map((item, index) => {
				tableData.map(items => {
					items.docDefId == item ? pageDatas.push(items) : ''
				})
			})
			let pageData = JSON.parse(JSON.stringify(pageDatas))
			this.$emit('tableEdit', pageData)
		}
	},
	created () {
		this.columnss = this.columns
	//   this.dataLists = this.dataList
	}
}
</script>

<style>
.editable{
	color: #ec613e;
	cursor: pointer;
	border-bottom: dashed 1px #ec613e;
}
</style>
