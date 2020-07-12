<template>
  <div>
    <a-modal v-model="formModal" style="top: 30px;" :width="1170" title="产品详细信息" footer="">
      <a-card :bordered="false">
        <a-form :form="dataForm" :labelCol="dataFormLayout.labelCol" :wrapperCol="dataFormLayout.wrapperCol">
          <a-card>
            <span href="#" slot="title" style="float:left;">
              <a-icon type="bank" /> 产品基本信息</span>
            <div slot="extra">
              <a-button v-if="editable != 'view'" :loading="submitLoading" type="primary" class="editable-add-btn" style="float:right;margin-right:10px;" @click="saveHandle">保存</a-button>
            </div>
            <a-row :gutter="16">
              <a-col :span="8">
                <a-form-item label="产品编码">
                  <a-input :disabled="editable === 'edit'" v-decorator="[
                      'productcode',
                      {
                        rules: [
                          { required: true, message: '产品编码不能为空!' }
                        ]
                      }
                    ]" />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item label="产品名称">
                  <a-input  v-decorator="[
                      'productname',
                      {
                        rules: [
                          { required: true, message: '产品名称不能为空!' }
                        ]
                      }
                    ]" />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item label="使用期限(月)">
                  <a-input-number  :min="1" :max="9999" v-decorator="[
                      'userrange',
                      {
                        rules: [
                          { required: true, message: '使用期限不能为空!' }
                        ]
                      }
                    ]" />
                </a-form-item>
              </a-col>
            </a-row>
            <a-row :gutter="16">
              <a-col :span="8">
                <a-form-item label="是否可扩展">
                  <DicSelect style="width: 90px"  dicType="ISEXTEND_FLAG" v-decorator="['isextendflag',{}]" />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item label="产品成本价格">
                  <a-input-number  :min="0" :max="9999" :precision="2" :formatter="
                      value =>
                        `￥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                    " :parser="value => value.replace(/\￥\s?|(,*)/g, '')" v-decorator="[
                      'productcostprice',
                      {
                        rules: [
                          { required: true, message: '产品成本价格不能为空!' }
                        ]
                      }
                    ]" />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item label="产品销售价格">
                  <a-input-number  :min="0" :max="9999" :precision="2" :formatter="
                      value =>
                        `￥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                    " :parser="value => value.replace(/\￥\s?|(,*)/g, '')" v-decorator="[
                      'productprice',
                      {
                        rules: [
                          { required: true, message: '产品销售价格不能为空!' }
                        ]
                      }
                    ]" />
                </a-form-item>
              </a-col>
            </a-row>
            <a-row :gutter="16">
              <a-col :span="16">
                <a-form-item label="产品描述" :labelCol="{ span: 6 }" :wrapperCol="{ span: 10 }">
                  <a-input type="textarea"  v-decorator="['productinfo']" />
                </a-form-item>
                <a-form-item>
                  <a-input type="hidden" v-decorator="['flag', { initialValue: '0' }]" />
                </a-form-item>
              </a-col>
            </a-row>
          </a-card>
        </a-form>
        <a-card style="margin-top:24px;">
          <span href="#" slot="title" style="float:left;">
            <a-icon type="bank" /> 服务信息一览</span>
          <a href="#" slot="extra">
            <a-icon :type="iconType" @click="swithTableShow" />
          </a>
          <a-row :gutter="16" style="margin-bottom:12px;">
            <a-col :span="12" :offset="12">
              <div style="float:right;">
                <a-button v-if="editable != 'view'" type="primary" class="editable-add-btn" style="margin-right:10px;" @click="addItem">新建</a-button>
              </div>
            </a-col>
          </a-row>
          <a-table :scroll="{ x: 'max-content'}" v-show="showTable" :bordered="false" :dataSource="objList" :columns="columns">
						<span slot="servicecodeTitle" class="requireColumn">服务编码</span>
						<span slot="servicenameTitle" class="requireColumn">服务名称</span>
						<span slot="servicepriceTitle" class="requireColumn">服务价格</span>
						<span slot="servicecountTitle" class="requireColumn">服务数量</span>
						<span slot="unitTitle" class="requireColumn">服务单位</span>
						<span class="requireColumn" slot="publicflagTitle">服务类型</span>
            <div slot="servicecode" slot-scope="text, record, index">
              <a-select v-if="record.editable" :default-value="{key:item.servicecode}"  :value="{key:record.servicecode}" style="width: 150px"  :dropdownMatchSelectWidth="false"
                        v-decorator="['servicecode',{rules: [{ required: true, message: '服务编码不能为空!' }]}]"
                        :labelInValue="true" @select="value =>serviceSetting(value, {rowindex: index,rowrecord: record,rowkey: 'servicecode'})">
                <a-select-option v-for="(item, index) in inputCompact.serviceList" :value="item.value" :key="index">{{ item.label }}</a-select-option>
              </a-select>
              <span v-if="!record.editable">{{ record.servicecode }}</span>
            </div>
            <div slot="servicename" slot-scope="text, record, index">
              <a-input v-if="record.editable" v-model="record.servicename" v-decorator="['servicename',{rules: [{ required: true, message: '服务编码不能为空!' }]}]" />
              <span v-if="!record.editable">{{ text }}</span>
            </div>
            <div slot="serviceprice" slot-scope="text, record, index">
              <a-input-number v-if="record.editable" v-model="record.serviceprice" :min="0" :formatter="
                  value => `￥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                " :parser="value => value.replace(/\￥\s?|(,*)/g, '')" />
              <span v-if="!record.editable">{{ text }}</span>
            </div>
            <div slot="servicecount" slot-scope="text, record, index">
              <a-input-number v-if="record.editable" v-model="record.servicecount" :min="0" />
              <span v-if="!record.editable">{{ text }}</span>
            </div>
            <div slot="unit" slot-scope="text, record, index">
              <DicSelect v-if="record.editable" :value="{key:record.unit}" dicType="VIP_UNIT" :labelInValue="true"
                         @select="value =>itemSetting(value, {rowindex: index,rowrecord: record,rowkey: 'unit'})" />
              <span v-if="!record.editable">{{ record.unit }}</span>
            </div>
            <div slot="publicflag" slot-scope="text, record, index">
              <DicSelect v-if="record.editable" :value="{key:record.publicflag}" dicType="VIP_PUBLIC_FLAG" :labelInValue="true"
                         @select="value =>itemSetting(value, {rowindex: index,rowrecord: record,rowkey: 'publicflag'})" />
              <span v-if="!record.editable">{{ record.publicflagName }}</span>
            </div>
            <div slot="operation" slot-scope="text, record, index" style="display:inline-block;">
              <a v-if="record.editable" @click="saveItem(index, record)">保存</a>
              <a v-if="record.editable" @click="cancelItem(index, record)">取消</a>
              <a v-if="!record.editable" @click="editItem(index, record)">编辑</a>
              <a v-if="!record.editable" @click="delItem(index, record)">删除</a>
            </div>
          </a-table>
        </a-card>
      </a-card>
    </a-modal>
  </div>
</template>
<script>
import api from "@/api/api-vip"
import DicSelect from "@/components/dic-select"
import moment from "moment"
export default {
	name: "vip-product-edit",
	components: { DicSelect },
	data () {
		return {
			formModal: false,
			editable: '',
			dataFormLayout: {
				labelCol: { span: 12 },
				wrapperCol: { span: 12 }
			},
			inputCompact: {
				serviceList: []
			},
			submitLoading: false,
			dataForm: this.$form.createForm(this),
			showTable: true,
			iconType: "down",
			item: {
				servicecode: "",
				servicename: "",
				serviceprice: "",
				servicecount: "",
				unit: "",
				publicflag: ""
			},
			objBase: {},
			objList: [],
			columns: [
				{
					align: "left",
					slots: { title: "servicecodeTitle" },
					width: 160,
					dataIndex: "servicecode",
					scopedSlots: { customRender: "servicecode" }
				},
				{
					align: "left",
					slots: { title: "servicenameTitle" },
					dataIndex: "servicename",
					scopedSlots: { customRender: "servicename" }
				},
				{
					align: "left",
					slots: { title: "servicepriceTitle" },
					dataIndex: "serviceprice",
					scopedSlots: { customRender: "serviceprice" }
				},
				{
					align: "left",
					slots: { title: "servicecountTitle" },
					dataIndex: "servicecount",
					scopedSlots: { customRender: "servicecount" }
				},
				{
					align: "left",
					slots: { title: "unitTitle" },
					dataIndex: "unit",
					scopedSlots: { customRender: "unit" }
				},
				{
					align: "left",
					slots: { title: "publicflagTitle" },
					dataIndex: "publicflag",
					scopedSlots: { customRender: "publicflag" }
				},
				{
					align: "left",
					title: "操作",
					dataIndex: "operation",
					fixed: "right",
					scopedSlots: { customRender: "operation" }
				}
			]
		}
	},
	mounted () {
		this.initServiceList()
	},
	methods: {
		show (obj) {
			this.formModal = true
			this.$nextTick(() => {
				this.editable = obj.editable
				this.objList = obj.list ? obj.list : []
				if (this.editable === "add") {
					this.dataForm.resetFields()
				} else {
					this.objBase = Object.assign(
						{},
						obj.vipProductbase ? obj.vipProductbase : {}
					)
					this.objBase.isextendflag = this.objBase.isextendflag + ''
					if (this.objBase.isextendflag === 'null') {
					  delete this.objBase.isextendflag
					}
					this.dataForm.setFieldsValue(
						Object.assign({}, this.objBase)
					)
				}
			})
		},
		hidden () {
			this.formModal = false
		},
		saveHandle () {
			let that = this
			this.submitLoading = true
			// 校验表单
			this.dataForm.validateFields((error, values) => {
				if (error) {
					that.submitLoading = false
					that.$message.error("您填写的数据有误或者必填项没填！")
					return
				}
				let vipProductbase = Object.assign(
					this.objBase,
					that.dataForm.getFieldsValue()
				)
				let canSave = true
				that.objList.forEach(p => { if (p.editable) { canSave = false } })
				if (!canSave) {
					that.submitLoading = false
					that.$message.error("您填写的数据有误或者必填项没填！")
					return
				}
				let data = {
					status: this.editable === "edit" ? 3 : 1,
					list: that.objList,
					vipProductbase: vipProductbase
				}
				api
					.saveVipProductbase(data)
					.then(res => {
						if (res.status === 0) {
							// 更新列表数据
							that.$emit("callback")
							that.formModal = false
							that.$message.success("保存成功")
						} else {
							that.$message.error(data.data)
						}
					})
					.finally(() => {
						that.submitLoading = false
					})
			})
		},
		// 子信息操作
		addItem () {
			let newObj = Object.assign({ newrow: true, editable: true }, this.item)
			this.objList.unshift(newObj)
		},
		saveItem (index, record) {
			let stopFlag = false
			let needList = ['servicecode', 'servicename', 'servicecount', 'unit', 'publicflag']
			needList.map(item => {
				if (!record[item]) stopFlag = true
			})
			if (stopFlag) {
				this.$message.error('必录项不能为空！')
				return
			}
			if (record.newrow) {
				this.$delete(record, "newrow")
			}
			record.editable = false
			this.$delete(record, "oldvalue")
			this.objList[index] = record
		},
		cancelItem (index, record) {
			if (record.newrow) {
				this.objList.splice(index, 1)
			} else {
				this.objList[index] = record.oldvalue
				this.$delete(record, "oldvalue")
				this.objList[index].editable = false
			}
		},
		editItem (index, record) {
			this.$set(record, "editable", true)
			this.$set(record, "oldvalue", Object.assign({}, record))
		},
		delItem (index, record) {
			this.objList.splice(index, 1)
		},
		itemSetting (LabeledValue, option) {
			this.$set(this.objList[option.rowindex], option.rowkey, LabeledValue.key)
			this.$set(
				this.objList[option.rowindex],
				option.rowkey + "Name",
				LabeledValue.label
			)
		},
		serviceSetting (LabeledValue, option) {
			this.$set(this.objList[option.rowindex], option.rowkey, LabeledValue.key)
			// 设置初始值
			let index = this.inputCompact.serviceList.findIndex(item => item.value === LabeledValue.key)
			let serviceData = this.inputCompact.serviceList[index].data
			this.$set(this.objList[option.rowindex], "servicename", serviceData.servicename)
			this.$set(this.objList[option.rowindex], "serviceprice", serviceData.serviceprice)
			this.$set(this.objList[option.rowindex], "servicecount", serviceData.servicecount)
			this.$set(this.objList[option.rowindex], "unit", serviceData.unit)
			this.$set(this.objList[option.rowindex], "publicflagName", serviceData.publicflagName)
		},
		dateRender (text) {
			return text ? moment(text).format("YYYY-MM-DD") : ""
		},
		initServiceList () {
			let self = this
			api.queryServiceInfo().then(res => {
				self.inputCompact.serviceList = []
				if (res.data && res.data.length > 0) {
					res.data.map(item => {
						self.inputCompact.serviceList.push({
							value: item.servicecode,
							label: item.servicecode + "-" + item.servicename,
							data: item
						})
					})
				}
			})
		},
		swithTableShow () {
			this.showTable = !this.showTable
			this.iconType = this.showTable ? "down" : "up"
		}
	}
}
</script>
<style>
	.ant-select{
		min-width: 50px;
	}
	.requireColumn::before{
		display: inline-block;
    margin-right: 4px;
    color: #f5222d;
    font-size: 14px;
    font-family: SimSun, sans-serif;
    line-height: 1;
    content: '*';
	}
</style>>
