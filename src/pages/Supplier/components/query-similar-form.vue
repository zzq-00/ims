<template>
  <a-card :bordered="false">
    <a-modal v-model="formModal" style="top: 30px;" :width="modalWidth" :title="modalTitle" footer="">
      <a-form :form="filterForm" :labelCol="filterFormLayout.labelCol" :wrapperCol="filterFormLayout.wrapperCol" >
        <a-row :gutter="16">
          <a-col :span="12" :offset="11">
            <a-button type="primary" class="editable-add-btn" style="float:right;margin-right:10px;" @click="confirm">跳过提醒</a-button>
            <a-button type="" @click="formModal=false" style="float:right;margin-right:10px;">关闭</a-button>
          </a-col>
        </a-row>
      </a-form>
      <a-table v-show="showTable" :bordered="false" :pagination="false" :dataSource="pageData.data" :columns="columns" :rowKey="record => record.sorgCode" :indentSize=0 :loading="loading">
        <a slot="sorgName" @click="querySimilarEditable(record)" slot-scope="text, record">{{text}}</a>
      </a-table>
    </a-modal>
  </a-card>
</template>
<script>
import supApi from '@/api/api-supplier'
import api from "@/api/api-serve-apply"
import DicSelect from '@/components/dic-select'
import AddressSelect from '@/components/address-select'
import OrgSelect from '@/components/org-select'
import { Promise } from 'q'
export default {
	components: {DicSelect, AddressSelect, OrgSelect},
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
			formModal: false,
			modalWidth: 970,
			modalTitle: '',
			iconType: 'down',
			queryCondition: {},
			columns: [
				{
					align: "center",
					title: "序号",
					dataIndex: "recordIndex"
				},
				{
					align: "left",
					title: "机构名称",
					dataIndex: "sorgName",
					scopedSlots: { customRender: 'sorgName' }
				},
				{
					align: "left",
					title: "机构编码",
					dataIndex: "sorgCode"
				},
				{
					align: "left",
					title: "所在省",
					dataIndex: "sorgProvinceDesc"
				},
				{
					align: "left",
					title: "所在市",
					dataIndex: "sorgCityDesc"
				},
				{
					align: "left",
					title: "地址",
					dataIndex: "sorgAdderss"
				},
				{
					align: "left",
					title: "经度",
					dataIndex: "sorgLongitude"
				},
				{
					align: "left",
					title: "纬度",
					dataIndex: "sorgLatitude"
				}
			]
		}
	},
	mounted () {},
	methods: {
		initSimilarForm (obj) {
		  // 先这样拼接了……
			let sorgCode = obj.sorgCode ? "(" + obj.sorgCode + ")" : ''
		  this.modalTitle = obj.sorgName + sorgCode + "--可能重复的机构"
		  this.formModal = true
			this.pageData = obj.res.data
			this.pageData.data.forEach((item, index) => { item.recordIndex = index + 1 })
		},
		confirm () {
			let self = this
			this.$confirm({
				title: '确认提示',
				content: '新建机构可能已经存在，是否跳过此验证？',
				okType: 'danger',
				onOk () {
					return new Promise((resolve, reject) => {
						self.formModal = false
						self.$emit("on-update", false)
						resolve()
					})
				}
			})
		},
		querySimilarEditable (record) {
			// 获取当前登录用户的管理机构
			api.getLoginInfo().then(res => {
				if (res.status === 0) {
					let queryParam = {
						orgCode: record.orgCode,
						sorgCode: record.sorgCode,
						city: record.sorgCity,
						loginOrgCode: res.data.orgCode
					}
					// 相似机构校验是否可编辑
					supApi.querySimilarEditable(queryParam).then(res => {
						if (res.status === 0) {
							let data = {
								sorgCode: record.sorgCode,
								sorgName: record.sorgName,
								currentStatus: record.currentStatus,
								orgType: record.orgType
							}
							if (record.currentStatus === '02' || res.data === 'no') {
							  Object.assign(data, {verify: true})
								this.$emit("showOrgInfo", data)
							} else {
								this.$emit("showOrgInfo", data)
							}
							this.formModal = false
						}
					})
				}
			})
		}
	}
}
</script>
<style>
.editable-cell {
  position: relative;
}

.editable-cell-input-wrapper,
.editable-cell-text-wrapper {
  padding-right: 24px;
}

.editable-cell-text-wrapper {
  padding: 5px 24px 5px 5px;
}

.editable-cell-icon,
.editable-cell-icon-check {
  position: absolute;
  right: 0;
  width: 20px;
  cursor: pointer;
}

.editable-cell-icon {
  line-height: 18px;
  display: none;
}

.editable-cell-icon-check {
  line-height: 28px;
}

.editable-cell:hover .editable-cell-icon {
  display: inline-block;
}

.editable-cell-icon:hover,
.editable-cell-icon-check:hover {
  color: #108ee9;
}

.editable-add-btn {
  margin-bottom: 8px;
}
</style>
