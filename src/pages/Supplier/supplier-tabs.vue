<template>
	<a-card style="padding: 0px;">
		<a-tabs defaultActiveKey="1" v-model="activeKey" tabPosition="top">
			<a-tab-pane tab="机构列表" key= "1">
				<SupplierList @showOrgInfo="showOrgInfo" :verify="verify"/>
			</a-tab-pane>
			<a-tab-pane tab="机构" key="2" :disabled="!showTabServiceOrg">
				<ServiceOrg @showTabs="showTabs" @getOrgCode="getOrgCode" :serviceOrgData="serviceOrgData" @showOrgInfo="showOrgInfo" :verify="verify"/>
			</a-tab-pane>
			<a-tab-pane tab="药店" key="5" :disabled="!showTabPhar">
				<Pharmacy @showTabs="showTabs" @getOrgCode="getOrgCode" :pharmacyData="pharmacyData" :verify="verify"/>
			</a-tab-pane>
			<a-tab-pane tab="供应商" key="6" :disabled="!showTabSupplier">
				<Supplier @showTabs="showTabs" :supplierData="supplierData" :param="sorgParam()" :verify="verify"/>
			</a-tab-pane>
			<a-tab-pane tab="机构关联" key="7" :disabled="!showTabOrgRela">
				<OrgRela @showTabs="showTabs" :param="sorgParam()" :verify="verify" :similar="true"/>
			</a-tab-pane>
		</a-tabs>
	</a-card>
</template>
<script>
import supApi from '@/api/api-supplier'
import SupplierList from './components/supplier-list'
import ServiceOrg from './components/service-org'
import Pharmacy from './components/pharmacy'
import Supplier from './components/supplier'
import OrgRela from './components/org-rela'
export default {
	name: 'supplierTabs',
	components: {Pharmacy, ServiceOrg, Supplier, SupplierList, OrgRela},
	data () {
		return {
			activeKey: '1',
			formLayout: 'horizontal',
			pageSize: 10, // 每页显示多少条
			dataCount: 0, // 总条数
			page: 1, // 当前页
			serviceOrgData: {},
			pharmacyData: {},
			supplierData: {},

			showTabServiceOrg: false,
			showTabSupplier: false,
			showTabDept: false,
			showTabDoctor: false,
			showTabPhar: false,
			showTabOrgRela: false,

			sorgCode: undefined,
			sorgName: undefined,
			type: undefined,
			pharmacyCode: undefined,
			supplierCode: undefined,
			upSorgCode: undefined,
			isSelfSign: undefined,
			showValidState: false,
			verify: false
		}
	},
	created () {
		// 取出权限串和token，存入data
		console.log(this.$route.query, "============")
		if (this.$route.query.power) this.power = JSON.parse(this.$route.query.power)
		if (this.$route.query.token) this.token = this.$route.query.token
	},
	mounted () {},
	methods: {
		// 机构列表点击机构后打开相应的Tab，显示最新的数据
		showOrgInfo (param) {
			if (param && param.sorgCode) {
				supApi.queryBaseInfo(param).then(res => {
				  // 相似机构列表调用
					if (param.verify || param.currentStatus === '02') {
						this.verify = true
					} else {
						this.verify = false
					}
					if (param.orgType === '18') {
						this.pharmacyData = res.data.pharmacy
						this.pharmacyData.supplierCode = res.data.supplier.supplierCode
						this.pharmacyData.isSelfSign = false
						this.sorgCode = param.sorgCode
						this.sorgName = param.sorgName
						this.showTabPhar = true
						this.showTabServiceOrg = false
						this.activeKey = '5'
					} else {
						this.serviceOrgData = res.data.serviceOrg
						this.serviceOrgData.isSelfSign = false
						this.serviceOrgData.supplierCode = res.data.supplier.supplierCode
						this.sorgCode = param.sorgCode
						this.sorgName = param.sorgName
						this.upSorgCode = res.data.serviceOrg.upSorgCode
						this.showTabServiceOrg = true
						this.showTabPhar = false
						this.activeKey = '2'
						this.serviceOrgData.showValidState = true
					}
					if (res.data.isOneselfFlag === 'Y') {
						if (param.orgType === '18') {
							this.pharmacyData.isSelfSign = true
						} else {
							this.serviceOrgData.isSelfSign = true
							this.initSupplierTab(res.data)
						}
						this.showTabSupplier = true
						this.supplierData = res.data.supplier
						this.supplierCode = this.supplierData.supplierCode
					} else {
						this.showTabSupplier = false
					}
					// 是否自建
					this.isSelfSign = res.data.isOneselfFlag
					// 机构类型
					this.type = param.orgType
					this.showTabOrgRela = true
					// 供应商tab是否需要展示有效字段
					this.showValidState = true
				})
			} else {
				this.showTabServiceOrg = true
				this.showTabPhar = false
				this.showTabOrgRela = false

				this.serviceOrgData = {}
				this.pharmacyData = {}
				this.supplierData = {}
				this.sorgCode = undefined
				this.sorgName = undefined
				this.pharmacyCode = undefined
				this.supplierCode = undefined

				this.activeKey = '2'
			}
		},
		// 直接打开或者关闭相关的tab
		showTabs (tabnames, flag, activeTab) {
			tabnames.map(item => {
				this[item] = flag
			})
			if (activeTab) this.activeKey = activeTab
		},
		// 新建机构和药店后调用
		getOrgCode (obj) {
			this.sorgCode = obj.sorgCode
			this.sorgName = obj.sorgName
			// 上级机构用于校验是否可以新增下级机构
			this.upSorgCode = obj.upSorgCode
			// 是否自建用于校验是否添加关联关系
			this.isSelfSign = obj.isSelfSign
			// 获取保存的供应商信息
			this.supplierCode = obj.supplierCode
			// 供应商tab是否需要展示有效字段
			this.showValidState = false
			this.type = obj.type
			let param = {
				sorgCode: this.sorgCode,
				orgType: obj.type,
				currentStatus: '01'
			}
			supApi.queryBaseInfo(param).then(res => {
				if (res.data.isOneselfFlag === 'Y') {
					this.showTabSupplier = true
					this.supplierData = res.data.supplier
					this.supplierCode = this.supplierData.supplierCode
				} else {
					this.showTabSupplier = false
				}
			})
		},
		sorgParam () {
			return {
				sorgCode: this.sorgCode,
				sorgName: this.sorgName,
				supplierCode: this.supplierCode,
				orgType: this.type,
				upSorgCode: this.upSorgCode,
				isSelfSign: this.isSelfSign,
				showValidState: this.showValidState
			}
		},
		// 初始化供应商页面
		initSupplierTab (obj) {
		  // 供应商基础信息
			console.log("obj:", obj)
			// 供应商详细信息
			// 所在省
			this.supplierData.province = obj.serviceOrg.sorgProvince
			// 所在市
			this.supplierData.city = obj.serviceOrg.sorgCity
			// 所在区
			this.supplierData.county = obj.serviceOrg.sorgCounty
			// 联系人
			this.supplierData.supplierLinkman = obj.serviceOrg.sorgLinkman
			// 联系电话
			this.supplierData.supplierTel = obj.serviceOrg.sorgTel
			// 移动电话
			this.supplierData.supplierMobile = obj.serviceOrg.sorgMobile
			// 证书号
			// 营业执照编码
			// 详细地址
			this.supplierData.supplierAddress = obj.serviceOrg.sorgAdderss
			// 乘车路线
			this.supplierData.busLine = obj.serviceOrg.busLine
		}
	}
}
</script>
<style>
</style>
