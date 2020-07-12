<template>
  <a-card :bordered="false">
    <a-card>
      <a-divider orientation="left">
        <a-icon type="bank" />查询条件
      </a-divider>
      <a-form
        :form="filterForm"
        :labelCol="filterFormLayout.labelCol"
        :wrapperCol="filterFormLayout.wrapperCol"
      >
        <a-row :gutter="16">
          <a-col :span="6">
            <a-form-item label="产品编码">
              <a-input v-decorator="['productcode', {initialValue: ''}]" />
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="产品名称">
              <a-input v-decorator="['productname', {initialValue: ''}]" />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :span="12" :offset="11">
            <a-button
              type
              class="editable-add-btn"
              @click="resetFilterForm"
              style="float:right;margin-right:10px;"
            >重置</a-button>
            <a-button
              type
              class="editable-add-btn"
              @click="searchHandle"
              style="float:right;margin-right:10px;"
            >查询</a-button>
          </a-col>
        </a-row>
      </a-form>
    </a-card>
    <a-card style="margin-top:24px;">
      <span href="#" slot="title" style="float:left;">
        <a-icon type="bank" />购买列表
      </span>
      <a href="#" slot="extra">
        <a-icon :type="iconType" @click="swithTableShow" />
      </a>
      <a-row :gutter="16" style="margin-bottom:12px;">
        <a-col :span="12" :offset="12">
          <div style="float:right">
            <a-button
              type="primary"
              class="editable-add-btn"
              @click="addHandle"
              style="margin-right:5px;"
            >新增</a-button>
            <a-button
              type="primary"
              class="editable-add-btn"
              @click="editHandle"
              style="margin-right:5px;"
            >编辑</a-button>
            <a-button type class="editable-add-btn" @click="delHandle" style="margin-right:5px;">删除</a-button>
          </div>
        </a-col>
      </a-row>
      <a-table
        :customRow="onClickRow"
        :scroll="{ x: 'max-content'}"
        v-show="showTable"
        :bordered="false"
        :pagination="pagination"
        :rowSelection="rowSelection"
        :dataSource="pageData.data"
        :columns="columns"
        :rowKey="record => record.id"
        :indentSize="0"
        :loading="loading"
      >
        <a slot="productname" @click="showRecordInfo(record)" slot-scope="text, record">{{(text)}}</a>
      </a-table>
    </a-card>
    <VipProductEdit ref="vipProductEdit" @callback="loadPageData" />
  </a-card>
</template>
<script>
import api from "@/api/api-vip"
import DicSelect from "@/components/dic-select"
import VipProductEdit from "./vip-product-edit"
import moment from "moment"
import { formatMoney } from "@/libs/util"
import { Promise } from "q"
export default {
	name: "vip-product-list",
	components: { DicSelect, VipProductEdit },
	// inject: ["reload"], //注入reload方法    TODO: reload方法位置？
	props: {
		iscom: {
			type: Boolean,
			default () {
				return true
			}
		}
	},
	data () {
		return {
			// 查询条件
			filterForm: this.$form.createForm(this),
			filterFormLayout: {
				labelCol: { span: 9 },
				wrapperCol: { span: 15 }
			},
			loading: false,
			showTable: true,
			iconType: "down",
			rowSelection: {
				type: "radio",
				selectedRows: [],
				selectedRowKeys: [],
				onChange: this.radioChange
			},
			pageData: {
				dataCount: 0,
				data: []
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
			},
			columns: [
				{
					align: "left",
					dataIndex: "productcode",
					title: "产品编码"
				},
				{
					align: "left",
					dataIndex: "productname",
					title: "产品名称",
					scopedSlots: { customRender: "productname" }
				},
				{
					align: "left",
					dataIndex: "productcostprice",
					title: "产品成本价格",
					customRender: text => {
						return text ? "￥" + formatMoney(text) : ""
					}
				},
				{
					align: "left",
					dataIndex: "productprice",
					title: "产品销售价格",
					customRender: text => {
						return text ? "￥" + formatMoney(text) : ""
					}
				},
				{
					align: "left",
					dataIndex: "userrange",
					title: "使用期限",
					customRender: text => {
						return text ? text + "个月" : ""
					}
				},
				{
					align: "left",
					dataIndex: "cardtypecodeName",
					title: "会员卡类型"
				},
				{
					align: "left",
					dataIndex: "productinfo",
					title: "产品描述"
				}
			]
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
		loadPageData () {
			let query = this.filterForm.getFieldsValue()
			let data = {
				page: this.pagination.current,
				limit: this.pagination.pageSize
			}
			this.loading = true
			api
				.queryProductInfo(Object.assign(data, query))
				.then(res => {
					this.pageData = res.data || { totalCount: 0, data: [] }
					this.pageData.data.forEach((item, index) => {
						item.recordIndex = index + 1
					})
					this.pagination.total = this.pageData.totalCount
					this.rowSelection.selectedRows=[]
					this.rowSelection.selectedRowKeys=[]
				})
				.finally(() => {
					this.loading = false
				})
		},
		resetFilterForm () {
			this.filterForm.resetFields()
			// this.searchHandle()
		},
		// 点击单选框实现选中效果
		radioChange (selectedRowKeys, selectedRows) {
			console.log("数据1：", selectedRowKeys)
			console.log("数据2：", selectedRows)
			this.rowSelection.selectedRows = []
			this.rowSelection.selectedRowKeys = []
			this.rowSelection.selectedRows = selectedRows
			this.rowSelection.selectedRowKeys = selectedRowKeys
		},
		// 点击一行实现选中
		onClickRow (record, index) {
			return {
				on: {
					click: () => {
						console.log("行事件", record, index)
						this.rowSelection.selectedRows = []
						this.rowSelection.selectedRowKeys = []
						this.rowSelection.selectedRows.push(this.pageData.data[index])
						this.rowSelection.selectedRowKeys.push(
							this.pageData.data[index].id
						)
					}
				}
			}
		},
		swithTableShow () {
			this.showTable = !this.showTable
			this.iconType = this.showTable ? "down" : "up"
		},
		showRecordInfo (record) {
			// 获取产品详细信息
			api.getVipProductbaseById(record.id).then(res => {
				let data = Object.assign({ editable: "view" }, res.data)
				this.$refs.vipProductEdit.show(data)
			})
		},
		addHandle () {
			this.$refs.vipProductEdit.show({ editable: "add" })
		},
		editHandle () {
			let self = this
			let arr = this.rowSelection.selectedRows
			if (!arr.length) {
				this.$message.warning("请选择记录!")
				return
			} else if (arr.length > 1) {
				this.$message.warning(
					"此操作不能选择多条数据，请选择一条记录进行此操作!"
				)
				return
			}
			// 获取产品详细信息
			api
				.getVipProductbaseById(this.rowSelection.selectedRows[0].id)
				.then(res => {
					let data = Object.assign({ editable: "edit" }, res.data)
					this.$refs.vipProductEdit.show(data)
				})
		},
		delHandle () {
			let self = this
			let arr = this.rowSelection.selectedRows
			if (!arr.length) {
				this.$message.warning("请选择记录!")
				return
			} else if (arr.length > 1) {
				this.$message.warning(
					"此操作不能选择多条数据，请选择一条记录进行此操作!"
				)
				return
			}
			this.$confirm({
				title: "确认提示",
				content: `确定删除当前选中的${self.rowSelection.selectedRows[0].productname}项记录吗？`,
				okType: "danger",
				onOk () {
					return new Promise((resolve, reject) => {
						let data = {
							productcode: self.rowSelection.selectedRows[0].productcode,
							productsoncode: self.rowSelection.selectedRows[0].productsoncode,
							unitCode: self.rowSelection.selectedRows[0].unitCode
						}
						api
							.deleteVipProductbase(data)
							.then(res => {
								if (res.status === 0) {
									let index = self.pageData.data.findIndex(
										item => item.id === self.rowSelection.selectedRows[0].id
									)
									self.pageData.data.splice(index, 1)
									self.rowSelection.selectedRows = []
									self.$message.success("删除成功")
									self.loadPageData()
									self.$fouceUpdate()
								} else {
									self.$message.error("删除失败")
								}
							})
							.finally(() => {
								resolve()
							})
					})
				}
			})
		}
	}
}
</script>
