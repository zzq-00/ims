<template>
  <div style="padding:24px;text-align:left;">
    <a-alert type="info" message="操作提示!" description="点击节点即可查看节点详情！！" showIcon />
    <a-row>
      <a-col :span="24">
          <a-button type="primary" class="editable-add-btn" style="float:left;margin:10px 10px 0 0;" @click="$router.go(-1)">返回</a-button>
      </a-col>
      <a-col :span="4" style="width:16.6%; overflow: auto; height: 500px;border:1px solid #e8e8e8;margin-top:12px;margin-bottom:12px">
        <a-tree showIcon showLine defaultExpandAll autoExpandParent @select="onSelect" :selectedKeys="selectedKeys" :defaultSelectedKeys ="defaultSelectedKeys" :treeData="treeData">
          <a-icon slot="product" type="folder" />
          <a-icon slot="service" type="customer-service" />
          <a-icon slot="service2" type="heart" />
          <a-icon slot="package" type="gift" />
        </a-tree>
      </a-col>
      <a-col :span="20">
        <ProductForm ref="productForm" v-show="productType==1" @on-save="addProduct" />
        <ServiceForm ref="serviceForm" v-show="productType==2 || productType==3" :serviceType="serviceType" @on-save="saveEditProduct" />
        <ServicePackageForm ref="servicePackageForm" v-show="productType==4" @on-save="saveEditProduct" />
      </a-col>
    </a-row>
	
    <a-form :form="dataForm" :labelCol="dataFormLayout.labelCol" :wrapperCol="dataFormLayout.wrapperCol">
		<a-card style="margin-right: 12px;">
			<a-col :span="8">
				<a-form-item label="审核结论">
					<DicSelect dicType="TASK_RESULT" disabled v-model="taskResult"  placeholder="请选择审核结论" />
				</a-form-item>
			</a-col>
			<a-col :span="24">
				<a-form-item label="审核内容" :labelCol="{ span: 3 }">
					<a-textarea disabled v-model="taskResultDesc"  :rows="4"/>
				</a-form-item>
			</a-col>
		</a-card>
		<a-card style="margin-right: 12px;">
        <a-col :span="8">
          <a-form-item label="审批结论">
            <DicSelect dicType="TASK_RESULT" v-decorator="[
              'orderResult',
              {initialValue: [],rules: [{ required: true, message: '请选择审核结论!' }]}
              ]" placeholder="请选择审核结论" />
          </a-form-item>
        </a-col>
        <a-col :span="24">
          <a-form-item label="审批内容" :labelCol="{ span: 3 }">
            <a-textarea v-decorator="['approvalConclusion', {initialValue: '',rules: [{ required: true, message: '审核内容必填!' }]}]"  :rows="4"/>
          </a-form-item>
        </a-col>
        <a-button type="primary" class="editable-add-btn" style="float:right;margin:10px 10px 0 0;" @click="commitAll">提交</a-button>
      </a-card>
      <a-card style="margin-right: 12px;">
        <span href="#" slot="title" style="float:left;">
          <a-icon type="bank" /> 产品定义轨迹</span>
          <!-- <a href="#" slot="extra">
            <a-icon :type="iconType" @click="swithTableShow" />
          </a> -->
          <a-table bordered :dataSource="dataSource" :columns="columns" size="middle">
          </a-table>
      </a-card>
    </a-form>
  </div>
</template>
<script>
import DicSelect from '@/components/dic-select'
import ProductSelect from '@/components/product-select'
import ProductForm from '@/pages/Product/components/product-form'
import ServiceForm from '@/pages/Product/components/service-form'
import ServicePackageForm from '@/pages/Product/components/service-package-form'
import productApi from '@/api/api-product'
export default {
	name: 'product-approval-detail',
	components: { DicSelect, ProductSelect, ProductForm, ServiceForm, ServicePackageForm },
	data () {
		return {
			// 查询条件
			dataFormLayout: {
				labelCol: { span: 9 },
				wrapperCol: { span: 15 }
			},
			dataForm: this.$form.createForm(this),
			pageData: {
				dataCount: 0,
				data: []
			},
			loading: false,
			selectedKeys: [],
			defaultSelectedKeys: [],
			treeData: [],
			tmpStyle: { display: 'none' },
			NodeTreeItem: {},
			selectedTreeItem: {},
			productType: 1,
			serviceType: '01',
			nodeCount: 0,
			taskCode: undefined,
			productId: undefined,
			productServiceId: undefined,
			submitData: {},
			initData: {},
			dataSource: [],
			columns: [
				{
					title: "序号",
					dataIndex: "recordIndex",
					width: "15%"
				},
				{
					title: "节点",
					dataIndex: "operNodeDesc",
					width: "15%"
				},
				{
					title: "结论",
					dataIndex: "operResultDesc",
					width: "25%"
				},
				{
					title: "操作人",
					dataIndex: "operName",
					width: "25%"
				},
				{
					title: "操作时间",
					dataIndex: "operTime"
				}
			],
			taskResult: undefined,
			taskResultDesc: undefined
		}
	},
	mounted () {
		this.taskCode = this.$route.params.taskCode
		if (this.taskCode) {
			this.busiCode = this.$route.params.busiCode
			this.queryByEdit()
		} else {
			this.$router.push({name: 'ProductApproval'})
		}
	},
	methods: {
		queryByEdit () {
			productApi.getExamineInfo({examineCode: this.taskCode}).then(res => {
				this.initData = res.data.productBo
				this.taskResult = res.data.taskResult
				this.taskResultDesc = res.data.taskResultDesc
				this.initTreeData(this.initData.psList)
			})
			productApi.examineTrace({productCode: this.$route.params.busiCode}).then(res => {
				this.dataSource = res.data
				this.dataSource.forEach((item, index) => { item.recordIndex = index + 1 })
			})
		},
		initTreeData (productData) {
			this.treeData = []
			let tempData = {}
			Object.assign(tempData, this.initData)
			tempData.psList = []
			productData.map((item, index) => {
				if (index === 0) {
					this.productServiceId = item.productServiceId
					tempData.psList.push(item)
					this.treeData.push({
						title: item.serviceCode + '-' + item.serviceName,
						key: item.productServiceId,
						type: 'product',
						slots: { icon: 'product' },
						saveStatus: true,
						value: tempData,
						children: []
					})
				} else {
					let parentNode = this.traverseSearchNode(this.treeData, item.parentServiceId)
					parentNode.children.push({
						title: item.serviceCode + '-' + item.serviceName,
						key: item.productServiceId,
						type: item.serviceType === '02' ? 'service' : item.serviceType === '03' ? 'service2' : 'package',
						saveStatus: true,
						parentServiceId: item.parentServiceId,
						slots: { icon: item.serviceType === '02' ? 'service' : item.serviceType === '03' ? 'service2' : 'package' },
						children: [],
						value: item
					})
				}
			})
			this.selectedKeys = []
			this.selectedKeys.push(this.productServiceId)
			this.$refs.productForm.editForm(this.treeData[0], 'readOnly')
		},

		onSelect (selectedKeys, info) {
			let type = info.node.dataRef.type
			if (type === 'product') {
				this.productType = 1
				this.$refs.productForm.editForm(info.node.dataRef, 'readOnly')
			} else if (type === 'service') {
				this.productType = 2
				this.serviceType = '01'
				this.$refs.serviceForm.editForm(info.node.dataRef.value, 'readOnly')
			} else if (type === 'service2') {
				this.productType = 3
				this.serviceType = '02'
				this.$refs.serviceForm.editForm(info.node.dataRef.value, 'readOnly')
			} else {
				this.productType = '4'
				this.$refs.servicePackageForm.editForm(info.node.dataRef, 'readOnly')
			}
			this.selectedKeys = selectedKeys
			this.selectedTreeItem = {
				productServiceId: info.node.dataRef.key,
				parentServiceId: info.node.dataRef.parentServiceId || null
			}
		},
		// 遍历树节点
		traverseSearchNode (treeDataArray, productServiceId) {
			if (treeDataArray) {
				let item = treeDataArray.find(node => productServiceId === node.key)
				if (item) {
					return item
				} else {
					let result = null
					treeDataArray.forEach(node => {
						if (node.children && node.children.length) {
							result = this.traverseSearchNode(node.children, productServiceId)
						}
					})
					return result
				}
			}
			return null
		},
		// 遍历树节点组织数据
		traverseForData (node) {
			if (node && node.length) {
				node.map(item => {
					// 只存储保存过的父节点，未保存的节点暂时不存储
					if (item.saveStatus) this.submitData.psList.push(item.value)
					if (item.children && item.children.length) {
					 this.traverseForData(node.children)
					}
				})
			}
		},
		addProduct (FormData) {
			// 产品需要考虑两种情况：首次添加还是编辑后保存，这里处理productId和changeType两个字段
			this.submitLoading = true
			if (!this.productId) {
				// 首次新增使用productAdd
				productApi.productAdd(FormData).then(res => {
					this.$message.success('保存成功!')
					FormData.productId = res.data
					FormData.changeType = 'add'
					this.productId = res.data
					this.treeData[0].title = FormData.productCode + '-' + FormData.productName
					this.treeData[0].saveStatus = true
					Object.assign(this.treeData[0].value, FormData) // 保存后节点将存储新的数据
				}).finally(() => {
					this.submitLoading = false
				})
			} else {
				FormData.changeType = 'edit'
				this.submitData = {}
				Object.assign(this.submitData, FormData)
				this.traverseForData(this.treeData[0].children) // 带上其他服务的数据一起提交

				productApi.productSaveEdit(this.submitData).then(res => {
					if (res.data) {
						this.$message.success('保存成功!')
						Object.assign(this.treeData[0].value, FormData) // 保存后节点将存储新的数据
					} else {
						this.$message.error('保存失败，请联系管理员!')
					}
				}).finally(() => {
					this.submitLoading = false
				})
			}
		},
		saveEditProduct (FormData) {
			// 处理逻辑：首先判断父节点是否已经保存过（父节点存储的时候会校验自己的父节点的），如果存在未提交过的父节点，需要先保存父节点；
			// 通过$emit传递过来的表单数据，更新treeData中的结点value
			// 递归遍历整颗树上的数据进行更新。
			let parentTreeNode = this.traverseSearchNode(this.treeData, this.selectedTreeItem.parentServiceId)
			if (!parentTreeNode.saveStatus) {
				this.$message.error('父节点尚未保存，请先保存所有的父节点!')
				return
			}
			parentTreeNode.changeType = 'edit' // 父节点状态修改为编辑
			// 更新节点自己的数据
			let treeNode = this.traverseSearchNode(this.treeData, this.selectedTreeItem.productServiceId)
			treeNode.title = FormData.serviceCode + '-' + FormData.serviceName
			FormData.productServiceId = treeNode.key
			FormData.parentServiceId = treeNode.parentServiceId
			if (FormData.serviceType === '02' || FormData.serviceType === '03') {
				FormData.productServicePrices.map(item => {
					item.productServiceId = treeNode.key
					item.productId = this.productId
				})
			}
			if (!treeNode.value) {
				treeNode.value = {}
			}
			Object.assign(treeNode.value, FormData) // 保存后节点将存储新的数据
			// 遍历树，生成最新的提交数据
			this.submitData = {}
			Object.assign(this.submitData, this.treeData[0].value)
			this.traverseForData(this.treeData[0].children)

			this.submitLoading = true
			productApi.productSaveEdit(this.submitData).then(res => {
				if (res.data) {
					treeNode.saveStatus = true
					this.$message.success('保存成功!')
				} else {
					this.$message.error('保存失败，请联系管理员!')
				}
			}).finally(() => {
				this.submitLoading = false
			})
		},
		commitAll () {
			this.dataForm.validateFields((error, values) => {
				if (error) {
					this.$message.error("表单请填写完整！")
					return
				}
				this.submitData = {}
				Object.assign(this.submitData, values)
				this.submitData.taskCode = this.taskCode
				this.submitData.busiCode = this.busiCode
				let self = this
				this.$confirm({
					title: '审批审批提交?',
					content: '确认提交吗？',
					okType: 'danger',
					onOk () {
						return new Promise((resolve, reject) => {
						// 更新父节点的children
							self.submitLoading = true
							productApi.examineOrderCheck(self.submitData).then(res => {
								if (res.data) {
									self.$message.success('保存成功!')
									self.$router.push({name: 'ProductApproval'})
								} else {
									self.$message.error('保存失败，请联系管理员!')
								}
							}).finally(() => {
								self.submitLoading = false
								resolve()
							})
						})
					}
				})
			})
		}
	}
}
</script>
