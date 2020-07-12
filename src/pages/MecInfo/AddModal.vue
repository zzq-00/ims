<template>
  <a-modal
    centered
    :width="800"
    destroyOnClose
    :visible="visible"
    title="健管中心基础信息"
    @ok="handleSubmit"
    @cancel="handleCancel">
    <a-form :form="form">
      <a-row :gutter="16">
        <a-col :span="12">
          <a-form-item 
          :label-col="formItemLayout.labelCol"
          :wrapper-col="formItemLayout.wrapperCol"
          label="健管中心编码">
            <a-input v-decorator="['mecno',config.mecno]" allowClear></a-input>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item  
          :label-col="formItemLayout.labelCol"
          :wrapper-col="formItemLayout.wrapperCol"
          label="健管中心名称">
            <a-input v-decorator="['mecname',config.mecname]" allowClear></a-input>
          </a-form-item>
        </a-col>
      </a-row>
      <a-row :gutter="16">
        <a-col :span="12">
          <a-form-item 
          :label-col="formItemLayout.labelCol"
          :wrapper-col="formItemLayout.wrapperCol"
          label="负责人">
            <a-input v-decorator="['headname']" allowClear></a-input>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item  
          :label-col="formItemLayout.labelCol"
          :wrapper-col="formItemLayout.wrapperCol"
          label="预约电话">
            <a-input v-decorator="['emcappointphone']" allowClear></a-input>
          </a-form-item>
        </a-col>
      </a-row>
      <a-row :gutter="16">
        <a-col :span="12">
          <a-form-item 
          :label-col="formItemLayout.labelCol"
          :wrapper-col="formItemLayout.wrapperCol"
          label="详细地址">
            <a-input v-decorator="['address']" allowClear></a-input>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item  
          :label-col="formItemLayout.labelCol"
          :wrapper-col="formItemLayout.wrapperCol"
          label="所在地区">
            <a-select v-decorator="['city']" allowClear>
              <a-select-option 
              v-for="(city, code) in cityMap"
              :key="code"
              :value="code">{{city}}</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
      </a-row>
      <a-row :gutter="16">
        <a-col :span="12">
          <a-form-item  
          :label-col="formItemLayout.labelCol"
          :wrapper-col="formItemLayout.wrapperCol"
          label="健管中心等级">
            <a-select v-decorator="['meclevel']" allowClear>
              <a-select-option 
                    v-for="(value,key) in hoslevelMap"
                    :key="key"
                    :value="key">{{value}}</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
  </a-modal>
</template>

<script>
  export default {
    props: {
      visible: false,
      modalType: {
        validator: function(value) {
          return ['add','edit'].indexOf(value) !== -1;
        }
      },
      editInfo: {
        type: Object,
        default: function() {
          return {};
        }
      }
    },
    data() {
      return {
        // 查询条件
        formItemLayout: {
          labelCol: { span: 8 },
          wrapperCol: { span: 16 },
        },
        config: {
          mecno: { rules: [{ required: true, message: '健管中心编码不能为空' }] },
          mecname: { rules: [{ required: true, message: '健管中心名称不能为空' }] },
        },
        form: this.$form.createForm(this),
      }
    },
    computed: {
      cityMap() {
        return this.$store.getters['hins/cProvinces']
      },
      hoslevelMap() {
        return this.$store.getters['hins/cHosLevel']
      }
    },
    watch: {
      visible(val) {
        if (val) {
          if (this.modalType === "edit") {
            let ef = this.editInfo;
            this.$nextTick(() => {
              this.form.setFieldsValue({
                mecno: ef.mecno,
                mecname: ef.mecname,
                headname: ef.headname,
                emcappointphone: ef.emcappointphone,
                address: ef.address,
                city: ef.cityRaw,
                meclevel: ef.mecLevelRaw,
              });
            });
          }
        }
      }
    },
    methods: {
      // 新增或编辑提交
      handleSubmit() {
        this.form.validateFields((err, values) => {
          if (!err) {
            let url;
            if (this.modalType==="add") { // 新增
              url = this.$apiList.saveMecInfo;
            } else {
              url = this.$apiList.updateMecInfo;
            }
            this.addOrEditSubmit(values, url);
          }
        });
      },
      addOrEditSubmit(va, url) {
        this.$axios.post(url, {
          id: this.editInfo.id,
          mecName: va.mecname,
          address: va.address,
          headName: va.headname,
          emcAppointPhone: va.emcappointphone,
          city: va.city,
          mecLevel: va.meclevel,
          mecNo: va.mecno,
          remarks: "",
        }).then(res => {
          if (res.status === 0) {
            this.$message.success('保存成功');
            this.$emit("close", 'success')
          } else {
            this.$message.error('保存失败');
          }
        }).catch(err => {
          console.log(err);
        });
      },
      handleCancel() {
        this.$emit("close")
      },
    },
  }
</script>

<style lang="less" scoped>
.ant-calendar-picker {
  width: 100%;
}
</style>