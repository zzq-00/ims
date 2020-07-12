<template>
  <a-card style="padding: 0px;">
    <a-tabs defaultActiveKey="1" v-model="activeKey" tabPosition="top">
      <a-tab-pane tab="机构列表" key="1">
        <SupplierList @showOrgInfo="showOrgInfo" @getCode="getCode" :verify="true" :disabledStatus="true" />
      </a-tab-pane>
	  <a-tab-pane tab="机构" key="2" :disabled="!showTabServiceOrg">
		<ServiceOrg @showTabs="showTabs" @getOrgCode="getOrgCode" :serviceOrgData="serviceOrgData" :verify="true" />
	</a-tab-pane>
      <!-- <a-tab-pane tab="科室" key = "3" :disabled="!showTabDept" v-show="showTabDept">
                <Department @showTabs="showTabs" />
            </a-tab-pane>
            <a-tab-pane tab="医生" key = "4" :disabled="!showTabDoctor" v-show="showTabDoctor">
                <Doctor @showTabs="showTabs" />
            </a-tab-pane> -->
      <a-tab-pane tab="药店" key="5" :disabled="!showTabPhar">
        <Pharmacy @showTabs="showTabs" @getOrgCode="getOrgCode" :pharmacyData="pharmacyData" :verify="true" />
      </a-tab-pane>
      <a-tab-pane tab="供应商" key="6" :disabled="!showTabSupplier">
        <Supplier @showTabs="showTabs" :supplierData="supplierData" :verify="true" :param="sorgParam()" />
      </a-tab-pane>
      <a-tab-pane tab="机构关联" key="7" :disabled="!showTabOrgRela" :verify="true">
        <OrgRela @showTabs="showTabs" :param="sorgParam()" :verify="true" :similar="false"/>
      </a-tab-pane>
    </a-tabs>
  </a-card>
</template>
<script>
import supApi from "@/api/api-supplier"
import SupplierList from "./components/supplier-list"
import ServiceOrg from "./components/service-org"
import Pharmacy from "./components/pharmacy"
import Supplier from "./components/supplier"
import OrgRela from "./components/org-rela"
export default {
	name: "supplierVerify",
	components: { Pharmacy, ServiceOrg, Supplier, SupplierList, OrgRela },
	data () {
		return {
			activeKey: "1",
			formLayout: "horizontal",
			pageSize: 20, // 每页显示多少条
			dataCount: 0, // 总条数
			page: 1, // 当前页
			serviceOrgData: {},
			pharmacyData: {},
			supplierData: {},
			showTabSupplier: false,
			showTabProvider: false,
			showTabDept: false,
			showTabDoctor: false,
			showTabPhar: false,
			showTabOrgRela: false,
			sorgCode: undefined,
			pharmacyCode: undefined,
			isNewFlag: false,
			showValidState: false
		}
	},
	created () {
		// 取出权限串和token，存入data
		console.log(this.$route.query, "============")
		if (this.$route.query.power) { this.power = JSON.parse(this.$route.query.power) }
		if (this.$route.query.token) this.token = this.$route.query.token
	},
	mounted () {},
	methods: {
		showOrgInfo (param) {
			if (param && param.sorgCode) {
				supApi.queryBaseInfo(param).then(res => {
					if (param.orgType === "18") {
						this.pharmacyData = res.data.pharmacy
						this.pharmacyData.isSelfSign = false
						this.type = param.orgType
						this.sorgCode = param.sorgCode
						this.sorgName = param.sorgName
						console.log('pharmacyData', this.pharmacyData)
						this.showTabPhar = true
						this.showTabServiceOrg = false
						this.activeKey = "5"
					} else {
						this.serviceOrgData = res.data.serviceOrg
						this.serviceOrgData.isSelfSign = false
						this.sorgCode = param.sorgCode
						this.sorgName = param.sorgName
						this.type = param.orgType
						this.showTabServiceOrg = true
						this.showTabPhar = false
						this.activeKey = "2"
						this.serviceOrgData.showValidState = true
					}
					if (res.data.isOneselfFlag === "Y") {
						if (param.orgType === "18") {
							this.pharmacyData.isSelfSign = true
						} else {
							this.serviceOrgData.isSelfSign = true
						}
						this.showTabSupplier = true
						this.supplierData = res.data.supplier
						this.supplierCode = this.supplierData.supplierCode
					} else {
						this.showTabSupplier = false
					}
					this.showTabOrgRela = true
					this.isNewFlag = res.data.isNewFlag
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
				this.orgType = undefined
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
		getCode (obj) {
			if (obj.type === "sorg") {
				this.sorgCode = obj.code
				this.activeKey = "2"
				console.log(obj, "getCode", this.activeKey)
			} else {
				this.pharmacyCode = obj.code
			}
		},
		sorgParam () {
			return {
				sorgCode: this.sorgCode,
				sorgName: this.sorgName,
				supplierCode: this.supplierCode,
				orgType: this.type,
				isNewFlag: this.isNewFlag,
				showValidState: this.showValidState
			}
		},
		// 新建机构和药店后调用
		getOrgCode (obj) {
			this.sorgCode = obj.sorgCode
			this.sorgName = obj.sorgName
			// 获取保存的供应商信息
			this.supplierCode = obj.supplierCode
			this.type = obj.type
			let param = {sorgCode: obj.sorgCode}
			supApi.queryBaseInfo(param).then(res => {
				if (res.data.isOneselfFlag === 'Y') {
					this.showTabSupplier = true
					this.supplierData = res.data.supplier
					this.supplierCode = this.supplierData.supplierCode
				} else {
					this.showTabSupplier = false
				}
			})
		}
	}
}
</script>
<style>
</style>
