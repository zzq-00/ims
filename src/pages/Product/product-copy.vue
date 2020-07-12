<template>
  <div style="padding:24px;text-align:left;" @click="clearMenu">
    <a-alert type="info" message="操作提示!" description="添加服务包或服务请右键左侧菜单的节点！" showIcon/>
    <a-row>
      <a-col :span="24">
        <a-button type="primary" class="editable-add-btn" style="float:left;margin:10px 10px 0 0;"
                  @click="$router.go(-1)">返回
        </a-button>
      </a-col>
      <a-col :span="4"
             style="width:16.6%; overflow: auto; height: 500px;border:1px solid #e8e8e8;margin-top:12px;margin-bottom:12px">
        <a-tree showIcon showLine :defaultExpandAll="true" :autoExpandParent="true" @select="onSelect" :selectedKeys="selectedKeys"
                :defaultSelectedKeys="defaultSelectedKeys" :treeData="treeData" @rightClick="onRightClick">
          <a-icon slot="product" type="folder"/>
          <a-icon slot="service" type="customer-service"/>
          <a-icon slot="service2" type="heart"/>
          <a-icon slot="package" type="gift"/>
        </a-tree>
      </a-col>
      <a-col :span="20">
        <ProductForm ref="productForm" v-show="productType==1" @on-save="addProduct"/>
        <ServiceForm ref="serviceForm" v-show="productType==2 || productType==3" :dataRef="dataRef"
                     serviceType="serviceType" @on-save="saveEditProduct"/>
        <ServicePackageForm ref="servicePackageForm" v-show="productType==4" @on-save="saveEditProduct"/>
        <RateForm ref="RateForm" v-show="productType==5" :dataRef="dataRef" @on-save="saveEditProductForRate"/>
        <relationForm ref="RelationForm" v-show="productType==6" :dataRef="dataRef" @on-save="saveEditProductRela"/>
      </a-col>
      <a-menu :style="tmpStyle" mode="vertical" style="border-right:0;border:1px solid #e8e8e8;">
        <a-menu-item key="1" v-show="NodeTreeItem.type=='product'||NodeTreeItem.type=='package'"
                     @click="addNode('service')">添加服务
        </a-menu-item>
        <a-menu-item key="4" v-show="NodeTreeItem.type=='product'" @click="addNode('package')">添加服务包</a-menu-item>
        <a-menu-item key="3" v-show="NodeTreeItem.type=='service'" @click="addNode('service2')">添加附加服务</a-menu-item>
        <a-menu-item key="2" v-show="NodeTreeItem.type=='product' && checkProduct()" @click="setFee">配置手续费率</a-menu-item>
        <a-menu-item key="6" v-show="(NodeTreeItem.type=='product'||NodeTreeItem.type=='package') && checkMulProduct() " @click="serverRelat">服务关系配置</a-menu-item>
        <a-menu-item key="5" v-show="NodeTreeItem.type!=='product'" @click="deleteNodeConfirm">删除</a-menu-item>
      </a-menu>
    </a-row>
    <a-card style="margin-right: 12px;">
      <p>提示：产品设定完成后，才能点击该“提交”按钮，提交后，将进入产品审核流程</p>
      <a-button type="primary" class="editable-add-btn" style="float:right;margin:10px 10px 0 0;" @click="commitAll">
        全部提交
      </a-button>
    </a-card>
  </div>
</template>
<script>
  import DicSelect from '@/components/dic-select'
  import ProductSelect from '@/components/product-select'
  import ProductForm from '@/pages/Product/components/product-form'
  import ServiceForm from '@/pages/Product/components/service-form'
  import ServicePackageForm from '@/pages/Product/components/service-package-form'
  import productApi from '@/api/api-product'
  import RateForm from '@/pages/Product/components/product-handingrate-form'
  import RelationForm from '@/pages/Product/components/service-relation-form'

  export default {
	name: 'product-add',
	components: {DicSelect, ProductSelect, ProductForm, ServiceForm, ServicePackageForm, RateForm, RelationForm},
	data () {
		return {
			// 查询条件
			formItemLayout: {
				labelCol: {span: 9},
				wrapperCol: {span: 15}
			},
			filterForm: this.$form.createForm(this),
			pageData: {
				dataCount: 0,
				data: []
			},
			loading: false,
			selectedKeys: [],
			defaultSelectedKeys: [],
			treeData: [],
			tmpStyle: {display: 'none'},
			NodeTreeItem: {},
			selectedTreeItem: {},
			productType: 1,
			serviceType: '01',
			nodeCount: 0,
			productId: undefined,
			productServiceId: undefined,
			operatorType: undefined,
			submitData: {},
			initData: {},
			dataRef: {},
			relation: [],
			order: [],
			oldProductCode: '',
			oldProductName: ''
		}
	},
	mounted () {
		this.$nextTick(() => {
			this.queryByEdit(this.$route.params.productCode)
			this.operatorType = 'add'
		})
	},
	methods: {
		initTreeData (productData) {
			this.treeData = []
			let tempData = {}
			Object.assign(tempData, this.initData)
			tempData.psList = []
			productData.map((item, index) => {
				if (index === 0) {
					// 这里默认第一个产品必须是根结点，否则就会出错
					this.productServiceId = item.productServiceId
					tempData.psList.push(item)
					this.treeData.push({
						title: item.serviceCode + '-' + item.serviceName,
						key: item.productServiceId,
						type: 'product',
						slots: {icon: 'product'},
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
						slots: {icon: item.serviceType === '02' ? 'service' : item.serviceType === '03' ? 'service2' : 'package'},
						children: [],
						value: item
					})
				}
			})
			this.selectedKeys = []
			this.selectedKeys.push(this.productServiceId)
			this.$refs.productForm.editForm(this.treeData[0])
		},
		queryByEdit (productCode) {
			productApi.productQueryByCopy({productCode: productCode}).then(res => {
				this.initData = res.data
				this.initData.isAble = "N";	
				this.initTreeData(this.initData.psList)
			})
		},
		onSelect (selectedKeys, info) {
			let type = info.node.dataRef.type
			console.log(info.node.dataRef)
			if (type === 'product') {
				this.productType = 1
				this.$refs.productForm.editForm(info.node.dataRef)
			} else if (type === 'service') {
				this.productType = 2

				this.$refs.serviceForm.editForm(info.node.dataRef.value, false, type)
			} else if (type === 'service2') {
				this.productType = 3

				this.$refs.serviceForm.editForm(info.node.dataRef.value, false, type, this.traverseSearchNode(this.treeData, info.node.dataRef.parentServiceId).value.serviceName)
			} else {
				this.productType = '4'
				this.$refs.servicePackageForm.editForm(info.node.dataRef)
			}
			this.dataRef = info.node.dataRef
			this.selectedKeys = selectedKeys
			this.selectedTreeItem = {
				productServiceId: info.node.dataRef.key,
				parentServiceId: info.node.dataRef.parentServiceId || null
			}
		},
		onRightClick ({event, node}) {
			event.stopPropagation()
			const x = event.currentTarget.offsetLeft + event.currentTarget.clientWidth
			const y = event.currentTarget.offsetTop
			this.NodeTreeItem = {
				pageX: x,
				pageY: y,
				productServiceId: node.dataRef.key,
				title: node.dataRef.title,
				type: node.dataRef.type,
				parentServiceId: node.dataRef.parentServiceId || null
			}
			this.tmpStyle = {
				position: 'absolute',
				maxHeight: 40,
				width: '160px',
				textAlign: 'left',
				left: `${x + 10 - 0}px`,
				top: `${y + 20 - 0}px`,
				display: 'block',
				zIndex: 100,
				border: 1,
				boxShadow: '2px 2px 10px #888888'
			}
			this.dataRef = node.dataRef
			// this.selectedKeys = [node.dataRef.key]
			// this.selectedTreeItem = {
			// 	productServiceId: node.dataRef.key,
			// 	parentServiceId: node.dataRef.parentServiceId || null
			// }
		},
		clearMenu () {
			this.NodeTreeItem = {}
			this.tmpStyle = {display: 'none'}
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
		traverseForData (node, includeUnsave) {
			if (node && node.length) {
				node.map(item => {
					// console.log(item, 'traverseForData--item----')
					if (includeUnsave) {
						this.submitData.psList.push(item.value)
					} else {
						// 只存储保存过的父节点，未保存的节点暂时不存储(只有提交时需要过滤未保存的数据)
						if (item.saveStatus) this.submitData.psList.push(item.value)
					}
					if (item.children && item.children.length) {
						this.traverseForData(item.children, includeUnsave)
					}
				})
			}
		},
		addNode (type) {
			let treeNode = this.traverseSearchNode(this.treeData, this.NodeTreeItem.productServiceId)
			let nodeItem = {}
			if (type === 'service') {
				nodeItem.title = '填写服务信息'
			} else if (type === 'service2') {
				nodeItem.title = '填写附加服务信息'
			} else if (type === 'package') {
				nodeItem.title = '填写服务包信息'
			}
			productApi.getNextId().then(res => {
				nodeItem.key = res.data
			})
			nodeItem.type = type
			nodeItem.saveStatus = false
			// 设置父节点ID，方便删除
			nodeItem.parentServiceId = treeNode.key
			// nodeItem.productId = this.productServiceId
			nodeItem.productId = this.productId
			nodeItem.slots = {icon: type}
			nodeItem.value = {}
			if (treeNode.children) {
				treeNode.children.push(nodeItem)
			} else {
				treeNode.children = []
				treeNode.children.push(nodeItem)
			}
		},
		deleteNodeConfirm () {
			// 找到当前节点的父亲节点
			let parentNode = this.traverseSearchNode(this.treeData, this.NodeTreeItem.parentServiceId)
			// 过节点过滤掉当前节点
			let itemLeft = parentNode.children.filter(node => this.NodeTreeItem.productServiceId !== node.key)
			let self = this
			this.$confirm({
				title: '确定执行删除操作吗?',
				content: '服务或服务包下的服务将全部被删除，确认继续吗？',
				okType: 'danger',
				onOk () {
					return new Promise((resolve, reject) => {
						// 更新父节点的children
						parentNode.children = itemLeft
						resolve()
					})
				}
			})
		},
		// 配置feilv
		setFee () {
			this.productType = 5
			this.$refs.RateForm.editForm(this.treeData[0])
		},
		// 服务相关配置
		serverRelat () {
			this.productType = 6
			this.$refs.RelationForm.editForm(this.NodeTreeItem.value)
		},
		addProduct (FormData) {
			// 产品需要考虑两种情况：首次添加还是编辑后保存，这里处理productId和changeType两个字段
			this.submitLoading = true
			if (!this.productId) {
				// 首次新增使用productAdd
				productApi.checkCode(FormData.productCode).then(res => {
					if (res.data === false) {
						this.$message.warn('同一产品编码，不可重复录入')
					} else {
						productApi.checkName(FormData.productName).then(res => {
							if (res.data === false) {
								this.$message.warn('同一产品名称，不能重复录入')
							} else {
								productApi.productAdd(FormData).then(res => {
									let data = FormData
									this.initData.psList.forEach((item, index) => {
										if(item.parentServiceId){
											data.psList.push(item)
										}
									})
                 					productApi.productSaveEdit(FormData)
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
							}
						})
					}
				})
			} else {
				// console.log('是新增还是编辑')
				FormData.changeType = 'edit'
				this.submitData = {}
				Object.assign(this.submitData, FormData)
				this.traverseForData(this.treeData[0].children, true) // 带上其他服务的数据一起提交
        		this.submitData.productId = this.productId
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
			if (this.selectedTreeItem.parentServiceId == null) {
				if (!this.treeData[0].saveStatus) {
					this.$message.error('父节点尚未保存，请先保存所有的父节点!')
					return
				}
			} else {
				let parentTreeNode = this.traverseSearchNode(this.treeData, this.selectedTreeItem.parentServiceId)
				// console.log(parentTreeNode, this.selectedTreeItem, 'abc')
				if (!parentTreeNode.saveStatus) {
					this.$message.error('父节点尚未保存，请先保存所有的父节点!')
					return
				}
				parentTreeNode.changeType = 'edit' // 父节点状态修改为编辑
			}

			// let childrenTitle = this.treeData[0].children
      let childrenTitle = this.traverseSearchNode(this.treeData, this.selectedTreeItem.parentServiceId)
			var num = childrenTitle.children.length
			childrenTitle.children.forEach((item, index) => {
				if (item.title == (FormData.serviceCode + '-' + FormData.serviceName) && FormData.productServiceId != item.key && item.value.serviceType === FormData.serviceType) {
					--num
          if(childrenTitle.type === 'package'){
            this.$message.warn('同一服务包编码不能重复')
          }else{
            this.$message.warn('同一服务编码不能重复')
          }
				}
			})

			if (num == childrenTitle.children.length) {
				// 更新节点自己的数据
				let treeNode = this.traverseSearchNode(this.treeData, this.selectedTreeItem.productServiceId)
				treeNode.title = FormData.serviceCode + '-' + FormData.serviceName
				FormData.productServiceId = treeNode.key
				FormData.parentServiceId = treeNode.parentServiceId
				// console.log(FormData, FormData.serviceType, 'FormData.serviceTypes')
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
				this.submitData.psList.splice(1, this.submitData.psList.length - 1)
				this.traverseForData(this.treeData[0].children, true)

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
			}
		},
		saveEditProductForRate (FormData) {
			// 处理逻辑：首先判断父节点是否已经保存过（父节点存储的时候会校验自己的父节点的），如果存在未提交过的父节点，需要先保存父节点；
			// 通过$emit传递过来的表单数据，更新treeData中的结点value
			// 递归遍历整颗树上的数据进行更新。
			// 由于费率没有菜单挂载，所以保存分开处理
			// 遍历树，生成最新的提交数据
			Object.assign(this.treeData[0].value, FormData)
			this.submitData = {}
			Object.assign(this.submitData, this.treeData[0].value)
			this.submitData.psList.splice(1, this.submitData.psList.length - 1)
			this.traverseForData(this.treeData[0].children, true)
			this.submitLoading = true
			productApi.productSaveEdit(this.submitData).then(res => {
				if (res.data) {
					this.$message.success('保存成功!')
				} else {
					this.$message.error('保存失败，请联系管理员!')
				}
			}).finally(() => {
				this.submitLoading = false
			})
		},
		traverseForRelation (FormData) {
			FormData.rela.forEach(re => {
			    // 获取节点，排除product节点
				let treeNode = this.traverseSearchNode(this.treeData, re.productServiceId)
				if (treeNode.type === 'product') {
					Object.assign(treeNode.value.psList[0], re)
				} else {
					Object.assign(treeNode.value, re)
				}
			})
		},
		traverseForOrder (FormData) {
			FormData.order.forEach(re => {
				let treeNode = this.traverseSearchNode(this.treeData, re.productServiceId)
				Object.assign(treeNode.value, re)
			})
		},
		mergeArray (arr1, arr2) {
			for (let i = 1; i <= arr1.length; i++) {
				for (var j = 1; j <= arr2.length; j++) {
					if (arr1[i - 1].productServiceId === arr2[j - 1].productServiceId) {
						arr1.splice(i - 1, 1) // 利用splice函数删除元素，从第i个位置，截取长度为1的元素
					}
				}
			}
			// alert(arr1.length)
			for (let i = 1; i <= arr2.length; i++) {
				arr1.push(arr2[i - 1])
			}
			return arr1
		},
		saveEditProductRela (FormData) {
			// 处理逻辑：首先判断父节点是否已经保存过（父节点存储的时候会校验自己的父节点的），如果存在未提交过的父节点，需要先保存父节点；
			// 通过$emit传递过来的表单数据，更新treeData中的结点value
			// 递归遍历整颗树上的数据进行更新。
			// 由于费率没有菜单挂载，所以保存分开处理
			// 遍历树，生成最新的提交数据

			// 去重数组
			// if (this.relation.length > 0) {
			// 	this.relation.forEach(item => {
			// 	  if (item.productServiceId === FormData.rela.productServiceId) {
			// 			item.prodServeRela = FormData.rela.prodServeRela
			// 		}
			// 	})
			// } else {
			// 	this.relation.push(FormData.rela)
			// }
			this.submitData = {}
			// 更新节点数据
			// this.order = this.mergeArray(this.order, FormData.order)
			this.traverseForRelation(FormData)
			this.traverseForOrder(FormData)
			Object.assign(this.submitData, this.treeData[0].value)
			this.submitData.psList.splice(1, this.submitData.psList.length - 1)
			this.traverseForData(this.treeData[0].children, true)

			this.submitLoading = true
			productApi.productSaveEdit(this.submitData).then(res => {
				if (res.data) {
					this.$message.success('保存成功!')
				} else {
					this.$message.error('保存失败，请联系管理员!')
				}
			}).finally(() => {
				this.submitLoading = false
			})
		},
		// 检查是否存在产品
		checkProduct () {
			let self = this
			return (self.treeData[0].children.length > 0)
		},

		checkMulProduct () {
			let self = this
			let parentNode = this.traverseSearchNode(this.treeData, self.NodeTreeItem.productServiceId)
		  return (parentNode.hasOwnProperty('children') && parentNode.children.filter(row => {
				return row.saveStatus
			}).length > 1)
		},

		commitAll () {
			if (!this.treeData[0].saveStatus) {
				this.$message.error('当前产品未保存,请保存后提交')
				return
			}
			this.submitData = {}
			Object.assign(this.submitData, this.treeData[0].value)
			this.submitData.psList.splice(1, this.submitData.psList.length - 1)
			this.traverseForData(this.treeData[0].children, false)
			let self = this
			this.$confirm({
				title: '全部提交?',
				content: '提交后将进入审核流程，确认提交吗？',
				okType: 'danger',
				onOk () {
					// 是否添加了产品服务
					let childrenArr = self.treeData[0].children
					if (childrenArr.length === 0) {
						return self.$message.warn('节点数据未全部保存,请核对后再全部提交!')
					}
					let isHaveService = false
					self.treeData[0].value.psList.forEach(item => {
						isHaveService = isHaveService || item.serviceType === '02'
					})
					if (!isHaveService) {
						return self.$message.warn('节点数据未全部保存,请核对后再全部提交!')
					}

					childrenArr.find((values, index) => {
						if (values.saveStatus != true) {
							return self.$message.warn('节点数据未全部保存,请核对后再全部提交!')
						} else {
							return new Promise((resolve, reject) => {
								// 更新父节点的children
								self.submitLoading = true
								if (self.operatorType === 'add') {
									productApi.commitAdd(self.submitData).then(res => {
										if (res.data) {
											self.$message.success('保存成功!')
											self.$router.push({name: 'ProductMaintain'})
										} else {
											self.$message.error('保存失败，请联系管理员!')
										}
									}).finally(() => {
										self.submitLoading = false
									})
								} else {
									productApi.commitUpdate(self.submitData).then(res => {
										if (res.data) {
											self.$message.success('保存成功!')
											self.$router.push({name: 'ProductMaintain'})
										} else {
											self.$message.error('保存失败，请联系管理员!')
										}
									}).finally(() => {
										self.submitLoading = false
									})
								}
								resolve()
							})
						}
					})
				}
			})
		}
	}
}
</script>
