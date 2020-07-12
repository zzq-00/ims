<template>
  <a-card bordered>
    <a-form :form="dataForm" :labelCol="dataFormLayout.labelCol" :wrapperCol="dataFormLayout.wrapperCol">
      <a-divider orientation="left">模板信息</a-divider>
      <!-- 模板基本信息-->
      <a-row :gutter="16">
        <a-col :span="8">
          <a-form-item label="模板编码" :labelCol="{span: 7}" :wrapperCol="{span:17}">
            <a-input :disabled="templetCodeDisabled" v-decorator="['templetCode', {initialValue: '',rules: [{ required: true, message: '请录入!' }]}]" />
          </a-form-item>
        </a-col>
        <a-col :span="8">
          <a-form-item label="模板名称" :labelCol="{span: 7}" :wrapperCol="{span:17}">
            <a-input :disabled="templetNameDisabled" v-decorator="['templetName', {initialValue: '',rules: [{ required: true, message: '请录入!' }]}]" />
          </a-form-item>
        </a-col>
        <a-col :span="8">
          <a-button v-show="showExportRecord" type="primary" class="editable-add-btn" @click="exportRecord" :loading="uploading" style="float:right;margin-right:10px;">导出</a-button>
          <a-button type="" class="editable-add-btn" @click="backProductTemplate" style="float:right;margin-right:10px;">返回</a-button>
        </a-col>
      </a-row>
      <a-row :gutter="1">
        <a-form-item label="模板描述" :labelCol="{span: 3}" :wrapperCol="{span:21}">
          <a-textarea :disabled="templetRemarkDisabled" v-decorator="['templetRemark', {initialValue: '', rules: [{ required: true, message: '请录入!' }]}]" />
        </a-form-item>
      </a-row>

      <a-divider orientation="left">服务信息</a-divider>

      <!-- 应用的服务-->
      <a-row :gutter="1">
        <a-col :span="12">
          <a-form-item label="应用的服务">
            <a-input disabled="disabled" v-decorator="['serviceName', {rules: [{ required: true, message: '应用的服务不能为空!' }]}]"/>
<!--            <a-input-search disabled="true" placeholder="请选择应用的服务" @search="selectService" enterButton="查询" size="default" v-decorator="['serviceName', {rules: [{ required: true, message: '应用的服务不能为空!' }]}]" />-->
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-button v-show="showButton" type="" class="editable-add-btn" @click="delSelectedService" style="float:right;margin-right:10px;">删除</a-button>
          <a-button v-show="showButton" type="" class="editable-add-btn" @click="submitForm" style="float:right;margin-right:10px;">保存</a-button>
          <a-button v-show="showButton" type="" class="editable-add-btn" @click="selectService" style="float:right;margin-right:10px;">选择</a-button>
        </a-col>
      </a-row>
      <!-- 已选择的服务商列表-->
      <a-table :bordered="false" :pagination="false" :rowSelection="rowSelection" :dataSource="pageData.data" :columns="columns" :rowKey="record => record.providerId" :indentSize=0 :loading="loading"></a-table>
    </a-form>
    <!-- 应用的服务选择框 -->
    <ProductTemplateDetailService ref="ProductTemplateDetailService" @on-update="onUpdate"/>

    <!-- 待选择的服务商信息列表 -->
    <ProductTemplateDetailSupplier v-show="showSupplier" ref="ProductTemplateDetailSupplier" @on-add-rows="addRows" @on-add-allrows="addAllRows" />
    <NetworkAddForm ref="networkAddForm" />
  </a-card>
</template>
<script>
import api from "@/api/api-product-network"
import OrgSelect from "@/components/org-select"
import DicSelect from '@/components/dic-select'
import ProservSelect from '@/components/proserv-select'
import ProductTemplateDetailService from '@/pages/ProductNetwork/product-template-detail-service'
import ProductTemplateDetailSupplier from '@/pages/ProductNetwork/product-template-detail-supplier'
import NetworkAddForm from './components/network-add-form'

export default {
	name: 'product-template-detail',
	components: { DicSelect, OrgSelect, ProservSelect, ProductTemplateDetailService, ProductTemplateDetailSupplier, NetworkAddForm },
	data () {
		return {
			dataFormLayout: {
				labelCol: { span: 9 },
				wrapperCol: { span: 15 }
			},
			extraParam: {
				serviceCode: '',
				providerSorgs: []
			},
			submitLoading: false,
			formModal: false,
			dataForm: this.$form.createForm(this),
			// filterForm: this.$form.createForm(this),
			pageData: {
				data: []
			},
			loading: false,
			columns: [
				{
					align: "center",
					title: "序号",
					dataIndex: "recordIndex"
				},
				{
					align: "left",
					title: "服务商编码",
					dataIndex: "sorgCode"
				},
				{
					align: "left",
					title: "服务商名称",
					dataIndex: "sorgName"
				},
				{
					align: "left",
					title: "供应商名称",
					dataIndex: "supplierName"
				},
				{
					align: "left",
					title: "管理机构",
					dataIndex: "orgName"
				},
				{
					align: "left",
					title: "所在省",
					dataIndex: "provinceName"
				},
				{
					align: "left",
					title: "所在市",
					dataIndex: "cityName"
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
			},
			templetCodeDisabled: false,
			templetNameDisabled: false,
			templetRemarkDisabled: false,
			showSupplier: false,
			showButton: false,
			showExportRecord: false,
			uploading: false,
			params: {}
		}
	},
	mounted () {
		this.routerTemplate()
	 },
	methods: {
		routerTemplate () {
			if (this.$route.query.type === 'show') {
				// 页面赋值
				this.dataForm.setFieldsValue(this.$route.query.data)
				// 查询服务商信息列表
				this.searchHandle()
				// 隐藏按钮
				this.showButton = false
				// 隐藏服务商列表
				this.showSupplier = false
				// 模板三兄弟不可编辑
				this.templetCodeDisabled = true
				this.templetNameDisabled = true
				this.templetRemarkDisabled = true
				// 导出按钮
				this.showExportRecord = true
			}
			if (this.$route.query.type === 'add') {
				// 显示按钮
				this.showButton = true
				// 显示服务商列表
				this.showSupplier = true
				// 模板三兄弟可编辑
				this.templetCodeDisabled = false
				this.templetNameDisabled = false
				this.templetRemarkDisabled = false
			}
			if (this.$route.query.type === 'edit') {
				// 页面赋值
				this.dataForm.setFieldsValue(this.$route.query.data)
				// 查询服务商信息列表
				this.searchHandle()
				// 显示按钮
				this.showButton = true
				// 显示服务商列表
				this.showSupplier = true
				// 模板三兄弟设置编辑
				this.templetCodeDisabled = true
				this.templetNameDisabled = true
				this.templetRemarkDisabled = false
			}
			if (this.$route.query.type === 'select') {
				// 页面赋值
				this.params = this.$route.query.data.extraParams
				this.$route.query.data = this.$route.query.data.obj
				this.dataForm.setFieldsValue(this.$route.query.data)
				// 查询服务商信息列表
				this.searchHandle()
				// 隐藏按钮
				this.showButton = false
				// 隐藏服务商列表
				this.showSupplier = false
				// 模板三兄弟不可编辑
				this.templetCodeDisabled = true
				this.templetNameDisabled = true
				this.templetRemarkDisabled = true
				// 导出按钮
				this.showExportRecord = true
			}
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
			let data = {
				page: this.pagination.current,
				limit: this.pagination.pageSize,
				serviceCode: this.$route.query.data.serviceCode,
				serviceName: this.$route.query.data.serviceName,
				templetCode: this.$route.query.data.templetCode,
				templetName: this.$route.query.data.templetName
			}
			this.loading = true
			api.getProvidersTemplet(data).then(res => {
			  console.log("res", res)
				this.pageData = res.data || { totalCount: 0, data: [] }
				this.pageData.data.forEach((item, index) => {
					item.recordIndex = index + 1
				})
				this.pagination.total = this.pageData.totalCount
			}).finally(() => {
				this.loading = false
			})
		},
		selectService () {
			this.$refs.ProductTemplateDetailService.addForm()
		},
		onUpdate (obj) {
			this.dataForm.setFieldsValue({'serviceName': obj.serviceName})
			this.extraParam.serviceCode = obj.serviceCode
		},
		addRows (obj) {
			this.pageData.data = this.unique(this.pageData.data.concat(obj))
			this.extraParam.providerSorgs = this.pageData.data
		},
		addAllRows (obj) {
			this.pageData.data = this.unique(this.pageData.data.concat(obj))
			this.extraParam.providerSorgs = this.pageData.data
		},
		delSelectedService () {
			if (this.selectedRows) {
				console.log('this.selectedRows==', JSON.stringify(this.selectedRows))
				this.selectedRows.forEach(item => {
					this.pageData.data.forEach((row, index) => {
						if (item.providerId === row.providerId) {
							this.pageData.data.splice(index, 1)
						}
					})
				})
			} else {
				this.$message.info('请选择一条数据!')
			}
		},
		submitForm () {
			this.dataForm.validateFields((error, values) => {
				if (error) {
					return
				}
				console.log("保存条件：", values)
				let formData = Object.assign({}, values)
				let data = Object.assign(this.extraParam, formData)
				this.submitLoading = true
				if (this.$route.query.type === 'edit') {
					this.extraParam.providerSorgs = this.pageData.data
					api.updateTemplet(data).then(res => {
						this.$message.success('修改成功!')
						this.$router.push('ProductTemplate')
					}).finally(() => {
						this.submitLoading = false
					})
				} else {
					api.saveTemplet(data).then(res => {
						this.$message.success('保存成功!')
						this.$router.push('ProductTemplate')
					}).finally(() => {
						this.submitLoading = false
					})
				}
			})
		},
		backProductTemplate () {
		  if (this.$route.query.type === 'select') {
				this.$refs.networkAddForm.show(this.params)
			} else {
				this.$router.push('ProductTemplate')
			}
		},
		exportRecord () {
			let data = {
				templetCode: this.$route.query.data.templetCode,
				templetName: this.$route.query.data.templetName,
				serviceCode: this.$route.query.data.serviceCode,
				serviceName: this.$route.query.data.serviceName
			}
			this.uploading = true
			api.exportServiceNetDetail(data).then(res => {
				if (res.status === (undefined || '')) {
					this.$message.error('文件导出失败！')
				} else {
					this.$downloadFileByBase64(res, `产品服务网络模板明细.xlsx`)
				}
			}).finally(() => {
				this.uploading = false
			})
		},
		// 根据唯一标识no来对数组进行过滤
		unique (arr) {
			// 定义常量 res,值为一个Map对象实例
			const res = new Map()
			// 返回arr数组过滤后的结果，结果为一个数组   过滤条件是，如果res中没有某个键，就设置这个键的值
			return arr.filter((arr, index) => !res.has(arr.providerId) && res.set(arr.providerId, 1))
		}
	}
}
</script>
<style>

</style>
