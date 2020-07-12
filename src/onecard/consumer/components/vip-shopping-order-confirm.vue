<template>
  <a-modal v-model="formModal" style="top: 30px;" :width="1200" title="购买产品列表" footer="" :destroyOnClose=true >
    <a-card style="margin-top:24px;">
      <span href="#" slot="title" style="float:left;"><a-icon type="bank"/>购买产品列表</span>
      <a-table :bordered="false" :dataSource="listData" :columns="columns" :rowKey="record => record.id" :indentSize=0>

      </a-table>
      <a-card style="margin-top:24px;">
        <span href="#" slot="title" style="float:left;"><a-icon type="bank"/>确认购买</span>
        <div slot="extra">
          <a-button type="primary" class="editable-add-btn" @click="doSave" style="margin-right:5px;">确认</a-button>
        </div>
        <a-form :form="saveForm" :labelCol="filterFormLayout.labelCol" :wrapperCol="filterFormLayout.wrapperCol">
          <a-row :gutter="16">
            <a-col :span="6">
              <a-form-item label="总价">
                <a-input :disabled="true" v-decorator="['totalmoney']"/>
              </a-form-item>
            </a-col>
          </a-row>
          <a-row :gutter="16">
            <a-col :span="6">
              <a-form-item label="交易密码">
                <a-input type="password"
                         v-decorator="['password',{rules: [{ required: true, message: '交易密码不能为空!' }]}]"/>
              </a-form-item>
            </a-col>
          </a-row>
        </a-form>
      </a-card>
    </a-card>
  </a-modal>
</template>
<script>
  import api from '@/api/api-vip'
  import {formatMoney} from '@/libs/util'
  import crypto from 'crypto'

  export default {
    name: 'vip-shopping-order-confirm',
    data() {
      return {
        formModal: false,
        parentData: {},
        listData: [],
        saveForm: this.$form.createForm(this),
        filterFormLayout: {
          labelCol: {span: 9},
          wrapperCol: {span: 15}
			},
			columns: [
				{
					align: "left",
					dataIndex: "producttypename",
					title: "产品类型"
				},
				{
					align: "left",
					dataIndex: "productcode",
					title: "服务编码"
				},
				{
					align: "left",
					dataIndex: "productname",
					title: "服务名称"
				},
				{
					align: "left",
					dataIndex: "price",
					title: "市场价",
					customRender: (text) => {
            return text ? '￥' + formatMoney(text, 2) : ''
          }
				},
				{
					align: "left",
					dataIndex: "servicecount",
					title: "服务数量"
				},
				{
					align: "left",
					dataIndex: "serviceunit",
					title: "服务单位"
				},
				{
					align: "left",
					dataIndex: "lowPrice",
					title: "最低售价",
					customRender: (text) => {
            return text ? '￥' + formatMoney(text, 2) : ''
          }
				},
				{
					align: "left",
					dataIndex: "discounttypeName",
					title: "折扣信息"
				},
				{
					align: "left",
					dataIndex: "payprice",
					title: "服务单价",
					customRender: (text) => {
            return text ? '￥' + formatMoney(text, 2) : ''
          }
				},
				{
					align: "left",
					dataIndex: "num",
					title: "购买数量"
				},
				{
					align: "left",
					dataIndex: "totalmoney",
					title: "总价",
					customRender: (text) => {
            return text ? '￥' + formatMoney(text, 2) : ''
          }
				}
			]
		}
	},
	methods: {
		show (obj) {
      debugger
      this.formModal = true;
      this.listData = obj.selectedRecords;
      this.parentData = obj.selectedPostRec;
      this.$nextTick(() => {
        let total = 0;
        if (this.listData.length) {
          this.listData.forEach(item => {
            total = parseFloat(item.totalmoney) + parseFloat(total)
          })
        }
        this.saveForm.setFieldsValue({totalmoney: total.toFixed(2)})
      })
    },
		doSave () {
      let self = this;
      this.saveForm.validateFields((error, values) => { // TODO
        if (error) {
          return
        }
        let data = {vipShoppingOrders: self.listData};
        const md5 = crypto.createHash('md5');
        md5.update(values.password);
        let md5password = md5.digest('HEX');
        values.password = md5password.toUpperCase();
        api.saveVipShoppingOrder(Object.assign({}, values, self.parentData, data)).then(res => {
          if (res.status === 0) {
            self.$message.success('保存成功');
            self.formModal = false;
            self.$emit('on-update')
          } else {
            self.$message.error('保存失败')
          }
        })
      })
		}
	}
}
</script>
<style>

</style>
