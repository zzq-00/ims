<template>
  <div>
		<a-modal v-model="formModal" style="top: 30px;" :width="modalWidth" :title="modalTitle">
      <a-spin :spinning="spinning"/>

			<a-form :label-col="{ span: 4 }" :wrapper-col="{ span: 18 }">
      <a-card style="margin: 24px;">
        <a-divider orientation="left"><a-icon type="shop"/> 供应商服务</a-divider>
        <a-row :gutter="16">
          <a-col :span="24">
            <a-row>
              <a-col :span="12">
                <a-form-item label="服务编码">
                  <a-input :readonly="true" :value="relationData.supplierServiceName" />
                </a-form-item>
              </a-col>
              <a-col :span="12">
                <a-form-item label="服务名称">
                   <a-input :readonly="true" :value="relationData.supplierServiceCode" />
                </a-form-item>
              </a-col>
            </a-row>
          </a-col>
        </a-row>
      </a-card>

      <a-card style="margin: 24px;">
        <a-divider orientation="left"><a-icon type="team"/> 产品服务</a-divider>
        <a-row>
          <a-col :span="12">
            <a-form-item label="服务编码">
              <a-input :readonly="true" :value="relationData.serviceName" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="服务名称">
                <a-input :readonly="true" :value="relationData.serviceCode" />
            </a-form-item>
          </a-col>
        </a-row>
      </a-card>
			</a-form>

			<div slot="footer">
				<a-button type="" @click="formModal=false">关闭</a-button>
				<a-button :loading="submitLoading" type="primary" @click="deleteRelation">删除</a-button>
			</div>
    </a-modal>
  </div>
</template>
<script>
import api from '@/api/api-product-network'
export default {
	name: 'product-network-relation-view',
	data () {
		return {
			dataFormLayout: {
				labelCol: { span: 9 },
				wrapperCol: { span: 15 }
			},
			spinning: false,
			extraParam: {},
			isAdd: true,
			modalWidth: 1170,
			modalTitle: '',
			submitLoading: false,
			formModal: false,
			relationData: {}
		}
	},
	mounted () {

	 },
	methods: {
		show (obj) {
			this.extraParam = obj || {}
			this.isAdd = true
			this.modalTitle = '供应商服务关系查看'
			this.formModal = true
			this.loadRelationData()
		},
		loadRelationData () {
			let params = {
				supplierServiceCode: this.extraParam.supplierServiceCode
			}
			this.spinning = true
			api.supservRelaQueryList(params).then(res => {
				this.relationData = res.data[0] || {}
			}).finally(() => {
				this.spinning = false
			})
		},
		deleteRelation () {
			if (!this.relationData.supplierServicesRelaId) return
			this.submitLoading = true
			api.supservRelaDelete(this.relationData.supplierServicesRelaId).then(res => {
				this.$message.success('删除成功!')
				this.formModal = false
			}).finally(() => {
				this.submitLoading = false
			})
		}
	}
}
</script>
<style>

</style>
