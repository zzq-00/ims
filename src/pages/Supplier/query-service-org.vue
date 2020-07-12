<template>
  <a-modal v-model="orgformModal" style="top: 30px;" :width="modalWidth" :title="modalTitle" footer="">
    <div>
      <a-form :form="orgForm" :label-col="formItemLayout.labelCol" :wrapper-col="formItemLayout.wrapperCol">
        <a-card style="margin-top: 24px;">
          <a-row :gutter="16">
            <a-col :span="2">
              <a-avatar :size="64" icon="user" />
            </a-col>
            <a-col :span="6">
              <a-form-item label="编码" >
                <a-input v-decorator="['sorgCode']" disabled />
              </a-form-item>
            </a-col>
            <a-col :span="6">
              <a-form-item label="名称">
                <a-input v-decorator="['sorgName',]">
                </a-input>
              </a-form-item>
            </a-col>
            <a-col :span="6">
              <a-form-item label="电话">
                <a-input v-decorator="['orgTel']"></a-input>
              </a-form-item>
            </a-col>
            <a-col :span="6">
              <a-form-item label="管理机构">
                <a-input v-decorator="['orgName']"></a-input>
              </a-form-item>
            </a-col>
            <a-col :span="15">
              <a-form-item label="详细地址" :label-col="{ span: 4 }" :wrapper-col="{ span: 15 }">
                <a-input v-decorator="['address']">
                </a-input>
              </a-form-item>
            </a-col>
          </a-row>
        </a-card>
        <a-card style="margin-top: 24px;">
          <a-divider orientation="left">
            <a-icon type="folder-open" /> 机构基础信息</a-divider>
          <a-row :gutter="16">
            <a-col :span="6">
              <a-form-item label="机构编码" >
                <a-input v-decorator="['sorgCode']" disabled />
              </a-form-item>
            </a-col>
            <a-col :span="6">
              <a-form-item label="机构名称">
                <a-input v-decorator="['sorgName',]">
                </a-input>
              </a-form-item>
            </a-col>
            <a-col :span="6">
              <a-form-item label="机构类型">
                <DicSelect dicType="SUPPLIER_SUB_TYPE" v-decorator="['orgType',{initialValue:''}]" placeholder="请选择机构类型"></DicSelect>
              </a-form-item>
            </a-col>
            <a-col :span="6">
              <a-form-item label="机构电话">
                <a-input v-decorator="['orgTel']"></a-input>
              </a-form-item>
            </a-col>
          </a-row>
          <a-row :gutter="16">
            <a-col :span="6">
              <a-form-item label="联系人">
                <a-input v-decorator="['linkMan']">
                </a-input>
              </a-form-item>
            </a-col>
            <a-col :span="6">
              <a-form-item label="联系人手机">
                <a-input v-decorator="['moblie']">
                </a-input>
              </a-form-item>
            </a-col>
            <a-col :span="6">
              <a-form-item label="网址">
                <a-input v-decorator="['webUrl']"></a-input>
              </a-form-item>
            </a-col>
            <a-col :span="6">
              <a-form-item label="E-mail">
                <a-input v-decorator="['sorgEmail']" />
              </a-form-item>
            </a-col>
            <a-col :span="6">
              <a-form-item label="所在省">
                <AddressSelect dicType="0" v-decorator="['province', { initialValue: ''} ]" />
              </a-form-item>
            </a-col>
            <a-col :span="6">
              <a-form-item label="所在市">
                <AddressSelect :dicType="this.orgForm.getFieldValue('province')" v-decorator="['city',{ initialValue: ''}]" />
              </a-form-item>
            </a-col>
            <a-col :span="6">
              <a-form-item label="所在区">
                <AddressSelect :dicType="this.orgForm.getFieldValue('city')" v-decorator="['county',{ initialValue: ''}]" />
              </a-form-item>
            </a-col>
            <a-col :span="6">
              <a-form-item label="邮编">
                <a-input v-decorator="['zipcode']"></a-input>
              </a-form-item>
            </a-col>
            <a-col :span="18">
              <a-form-item label="详细地址" :label-col="{ span: 3 }" :wrapper-col="{ span: 18 }">
                <a-input v-decorator="['address']">
                </a-input>
              </a-form-item>
            </a-col>
            <a-col :span="6">
              <a-form-item label="经度">
                <a-input-number :precision="6" v-decorator="['longitude']" />
              </a-form-item>
            </a-col>
            <a-col :span="6">
              <a-form-item label="纬度">
                <a-input-number :precision="6" v-decorator="['latitude']" />
              </a-form-item>
            </a-col>
          </a-row>
          <a-divider orientation="left" v-if="orgForm.getFieldValue('orgType')=='02'">
            <a-icon type="folder-open" /> 机构类别属性</a-divider>
          <a-row :gutter="16" v-if="orgForm.getFieldValue('orgType')=='02'">
            <a-col :span="6">
              <a-form-item label="医院等级">
                <DicSelect dicType="HOSPITAL_LEVEL" v-decorator="['hospitalLevel', { initialValue: ''}]"></DicSelect>
              </a-form-item>
            </a-col>
            <a-col :span="6">
              <a-form-item label="医院类型">
                <DicSelect dicType="HOSPITAL_TYPE" v-decorator="['hospitalType', { initialValue: ''}]"></DicSelect>
              </a-form-item>
            </a-col>
            <a-col :span="6">
              <a-form-item label="社保类型">
                <DicSelect dicType="SOCIAL_SECUR_TYPE" v-decorator="['socialSecurType', { initialValue: ''}]"></DicSelect>
              </a-form-item>
            </a-col>
            <a-col :span="6">
              <a-form-item label="机构性质">
                <DicSelect dicType="PROPERTY_CODE" v-decorator="['propertyCode', { initialValue: ''}]"></DicSelect>
              </a-form-item>
            </a-col>
            <a-col :span="6">
              <a-form-item label="所属国家机构">
                <DicSelect dicType="SUBJECTION" v-decorator="['subjection', { initialValue: ''}]"></DicSelect>
              </a-form-item>
            </a-col>
            <a-col :span="6">
              <a-form-item label="机构属性">
                <DicSelect dicType="SORG_PROPERTY" v-decorator="['sorgProperty', { initialValue: ''}]"></DicSelect>
              </a-form-item>
            </a-col>
          </a-row>
          <a-divider orientation="left">
            <a-icon type="folder-open" /> 机构其他信息</a-divider>
          <a-row :gutter="16">
            <a-col :span="6">
              <a-form-item label="日均门诊量">
                <a-input-number :precision="0" :min='1' v-decorator="['outPatientNum']" />
              </a-form-item>
            </a-col>
            <a-col :span="24">
              <a-form-item label="特色科室" :label-col="{span:2}" :wrapper-col="{span:15}">
                <a-input v-decorator="['cisticDept']" />
              </a-form-item>
            </a-col>
            <a-col :span="24">
              <a-form-item label="乘车路线" :label-col="{span:2}" :wrapper-col="{span:15}">
                <a-input v-decorator="['busLine']" />
              </a-form-item>
            </a-col>
            <a-col :span="24">
              <a-form-item label="机构简介" :label-col="{ span: 2 }" :wrapper-col="{ span: 20 }">
                <a-textarea v-decorator="['sorgInfo']" placeholder="机构简介" :rows="3" />
              </a-form-item>
            </a-col>
          </a-row>
        </a-card>
        <QueryDoctorTable ref="doctor" :param="getSearchDoc()">
          <div slot="search">
            <a-form :form="doctorForm" :label-col="formItemLayout.labelCol" :wrapper-col="formItemLayout.wrapperCol">
              <a-row :gutter="16">
                <a-col :span="16">
                  <a-row :gutter="16">
                    <a-col :span="12">
                      <a-form-item label="成员类型">
                        <DicSelect dicType="MEMBER_TYPE" :disabled="orgForm.getFieldValue('orgType')!='03'" v-decorator="['memberType',{initialValue:'19'}]"></DicSelect>
                      </a-form-item>
                    </a-col>
                    <a-col :span="12">
                      <a-form-item label="名称">
                        <a-input v-decorator="['name']" />
                      </a-form-item>
                    </a-col>
                    <a-col :span="12">
                      <a-form-item label="编码">
                        <a-input v-decorator="['code']" />
                      </a-form-item>
                    </a-col>
                    <a-col :span="12">
                      <a-form-item label="所在部门/科室">
                        <a-input v-decorator="['fromDept']" />
                      </a-form-item>
                    </a-col>
                  </a-row>
                </a-col>
                <a-col :span="8">
                  <a-button type="primary" class="editable-add-btn" @click="exportDortor" style="float:right;margin-right:10px;">导出</a-button>
                  <a-button type="" class="editable-add-btn" @click="searchDortor" style="float:right;margin-right:10px;">查询</a-button>
                </a-col>
              </a-row>
            </a-form>
          </div>
        </QueryDoctorTable>
        <QueryDepartmentTable ref="department" :param="getSearchDepart()">
          <div slot="search">
            <a-form :form="departmentForm" :label-col="formItemLayout.labelCol" :wrapper-col="formItemLayout.wrapperCol">
              <a-row :gutter="16">
                <a-col :span="8">
                  <a-form-item label="名称">
                    <a-input v-decorator="['name']" />
                  </a-form-item>
                </a-col>
                <a-col :span="8">
                  <a-form-item label="编码">
                    <a-input v-decorator="['code']" />
                  </a-form-item>
                </a-col>
                <a-col :span="8">
                  <a-button type="primary" class="editable-add-btn" @click="exportDepart" style="float:right;margin-right:10px;">导出</a-button>
                  <a-button type="" class="editable-add-btn" @click="searchDepart" style="float:right;margin-right:10px;">查询</a-button>
                </a-col>
              </a-row>
            </a-form>
          </div>
        </QueryDepartmentTable>
        <QueryServiceTable ref="service" :param="getSearchService()">
          <div slot="search">
            <a-form :form="serviceForm" :label-col="formItemLayout.labelCol" :wrapper-col="formItemLayout.wrapperCol">
              <a-row :gutter="16">
                <a-col :span="8">
                  <a-form-item label="名称">
                    <a-input v-decorator="['name']" />
                  </a-form-item>
                </a-col>
                <a-col :span="8">
                  <a-form-item label="编码">
                    <a-input v-decorator="['code']" />
                  </a-form-item>
                </a-col>
                <a-col :span="8">
                  <a-button type="primary" class="editable-add-btn"@click="exportService" style="float:right;margin-right:10px;">导出</a-button>
                  <a-button type="" class="editable-add-btn" @click="searchService" style="float:right;margin-right:10px;">查询</a-button>
                </a-col>
              </a-row>
            </a-form>
          </div>
        </QueryServiceTable>
        <a-row :gutter="16">
          <a-col :span="12" :offset="12">
            <a-button type="primary" class="editable-add-btn" @click="returnQuery" style="float:right;margin-right:10px;">返回</a-button>
          </a-col>
        </a-row>
      </a-form>
    </div>
  </a-modal>
</template>
<script>
import supApi from '@/api/api-supplier-query'
import DicSelect from '@/components/dic-select'
import OrgSelect from '@/components/org-select'
import AddressSelect from '@/components/address-select'
import QueryDepartmentTable from '@/pages/Supplier/query-department-table'
import QueryDoctorTable from '@/pages/Supplier/query-doctor-table'
import QueryServiceTable from './query-service-table'
export default {
	name: 'query-service-org',
	components: { DicSelect, AddressSelect, QueryDepartmentTable, QueryDoctorTable, QueryServiceTable },
	props: {
		params: {
			type: Object,
			default () {
				return {}
			}
		}
	},
	data () {
		return {
			// 查询条件
			formItemLayout: {
				labelCol: { span: 10 },
				wrapperCol: { span: 14 }
			},
			orgForm: this.$form.createForm(this),
			serviceForm: this.$form.createForm(this),
			doctorForm: this.$form.createForm(this),
			departmentForm: this.$form.createForm(this),
			orgformModal: false,
			modalWidth: 1400,
			modalTitle: ''
		}
	},
	watch: {

	},
	mounted () {
		// 初始化根据机构编码查询机构基础信息
		// 根据机构编码直接查询人员、科室和服务信息
		// 通过Slot显示人员、科室、服务信息的查询条件和功能按钮
		// 通过$refs调用子组件实现查询和导出
		// 复用组件用于其他页面
	},
	methods: {
		searchDortor () {
			this.$refs.doctor.searchData()
		},
		getSearchDoc () {
			let obj = {
				cooperateWay: this.params.cooperateWay,
				orgType: this.params.orgType,
				serverOrgCode: this.params.sorgCode,
				sorgName: this.orgForm.getFieldValue('sorgName')
			}
			return Object.assign(obj, this.doctorForm.getFieldsValue())
		},
		getSearchDepart () {
			let obj = {
				cooperateWay: this.params.cooperateWay,
				orgType: this.params.orgType,
				serverOrgCode: this.params.sorgCode
			}
			return Object.assign(obj, this.departmentForm.getFieldsValue())
		},
		exportDortor () {
			this.$refs.doctor.exportData()
		},
		searchDepart () {
			this.$refs.department.searchData()
		},
		exportDepart () {
			this.$refs.department.exportData()
		},
		getSearchService () {
			let obj = {
				cooperateWay: this.params.cooperateWay,
				orgType: this.params.orgType,
				serverOrgCode: this.params.cooperateWay === '1' ? this.params.sorgCode : this.params.orgCode,
        sorgCode: this.orgForm.getFieldValue('sorgCode'),
        serverOrgName: this.orgForm.getFieldValue('sorgName')
			}
			console.log('supplierParam', this.params)
			return Object.assign(obj, this.serviceForm.getFieldsValue())
		},
		searchService () {
			this.$refs.service.searchHandle()
		},
		exportService () {
			this.$refs.service.exportData()
		},
		showOrgInfo (param) {
			this.orgformModal = true
			console.log('showOrgInfo', param)
			supApi.getOrgBasicInfos(param).then(res => {
				this.orgForm.resetFields()
				let data = res.data
				if (param.orgType != '03') {
					data.memberType = '19'
				}
				this.orgForm.setFieldsValue(data)
			}).finally(() => {

			})
		},
		returnQuery () {
			this.orgformModal = false
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
.ant-form-item {
  margin-bottom:8px;
}
</style>
