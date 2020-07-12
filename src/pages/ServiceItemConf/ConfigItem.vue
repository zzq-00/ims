<template>
  <a-modal
    centered
    :width="800"
    destroyOnClose
    :visible="visible"
    title="配置项目"
    @ok="handleSubmit"
    @cancel="handleCancel">
    <a-form :form="form">
      <a-row :gutter="16" v-if="!disabled">
        <a-col :span="12">
          <a-form-item 
          :label-col="formItemLayout.labelCol"
          :wrapper-col="formItemLayout.wrapperCol"
          label="健管中心">
            <a-select 
              :disabled="disabled"
              showSearch
              :dropdownMatchSelectWidth="false"
              optionFilterProp="children"
              :filterOption="filterOption"
              v-decorator="['mecno', config.mecno]">
              <a-select-option 
                v-for="mec in mecList"
                :key="mec.id"
                :value="mec.mecNo">{{mec.mecName}}</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item  
          :label-col="formItemLayout.labelCol"
          :wrapper-col="formItemLayout.wrapperCol"
          label="服务项目">
            <a-select 
              labelInValue
              :dropdownMatchSelectWidth="false"
              @change="servItemChange"
              :disabled="disabled"
              v-decorator="['servitemno', config.servitemno]">
              <a-select-option 
                v-for="(value, key) in servitemMap"
                :key="key"
                :value="key">{{value}}</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
      </a-row>
      <a-row :gutter="16" v-if="!disabled">
        <a-col :span="12">
          <a-form-item  
          :label-col="formItemLayout.labelCol"
          :wrapper-col="formItemLayout.wrapperCol"
          label="服务类型">
            <a-select :disabled="disabled" v-decorator="['instrumentflag', config.instrumentflag]">
              <a-select-option 
                v-for="(value, key) in instrumentflagMap"
                :key="key"
                :value="key">{{value}}</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item  
          :dropdownMatchSelectWidth="false"
          :label-col="formItemLayout.labelCol"
          :wrapper-col="formItemLayout.wrapperCol"
          label="项目明细">
            <a-select 
            labelInValue
            :disabled="disabled" 
            v-decorator="['servitemsubno']" 
            allowClear>
            <a-select-option 
                v-for="(value, key) in servItemSubList"
                :key="value.codeValue"
                :value="value.codeValue">{{value.codeName}}</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
      </a-row>
      <a-row :gutter="16">
        <a-col :span="12">
          <a-form-item  
          :label-col="formItemLayout.labelCol"
          :wrapper-col="formItemLayout.wrapperCol"
          label="总部指导价(¥)">
            <a-input v-decorator="['guidanceprice', config.price]" allowClear></a-input>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item  
          :label-col="formItemLayout.labelCol"
          :wrapper-col="formItemLayout.wrapperCol"
          label="市场价(¥)">
            <a-input v-decorator="['price', config.price]" allowClear></a-input>
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
  </a-modal>
</template>

<script>
  export default {
    // props: ['t'],
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
    
    watch: {
      visible(val) {
        if (val) {
          if (this.modalType === "edit") {
            let ef = this.editInfo;
            this.$nextTick(() => {
              this.form.setFieldsValue({
                // mecno: ef.mecno,
                // servitemno: ef.servitemname,
                // servitemsubno: ef.servitemsubname,
                // instrumentflag: ef.instrumentflag,
                guidanceprice: ef.guidanceprice,
                price: ef.price
              });
            });
          } else { // 新增
            this.queryMecName();
          }
        }
      }
    },
    data() {
      return {
        // 服务明细渲染列表
        servItemSubList: [],
        // 健管中心列表
        mecList: [],
        formItemLayout: {
          labelCol: { span: 7 },
          wrapperCol: { span: 17 },
        },
        config: {
          mecno: { rules: [{ required: true, message: '健管中心不能为空' }] },
          servitemno: { rules: [{ required: true, message: '服务项目不能为空' }] },
          instrumentflag: { rules: [{ required: true, message: '服务类型不能为空' }] },
          price: { rules: [{ validator: this.priceValitor }] },
        },
        form: this.$form.createForm(this),
      }
    },
    computed: {
      disabled() {
        return this.modalType === "edit";
      },
      instrumentflagMap () {
        return this.$store.getters['hins/cInstrumentFlag'];
      },
      servitemMap () {
        return this.$store.getters['hins/cServItem'];
      },
      servitemsubMap () {
        return this.$store.getters['hins/cServItemSub'];
      }
    },
    methods: {
      // 价格校验
      priceValitor(rule, value, callback) {
        // let reg = /^(0{1}|[1-9]\d*(.\d{0,2})?)+$/;
        let reg = /^(0?|[1-9]\d*)(\.\d{0,2})?$/;
        if (value !== undefined && value.trim() !== '' && reg.test(value) === false) {
          callback('只能输入数字,小数点后最多允许2位');
        } else {
          callback();
        }
      },
      // 查询健管中心
      queryMecName() {
        let url = this.$apiList.queryMecName;
        this.$axios.post(url).then((res) => {
          if (res.status === 0) {
            let { data } = res;
            this.mecList = data;
          } else {
            this.$message.error('健管中心列表获取失败');
          }
        }).catch((err) => {
          console.log(err);
        });
      },
      // 过滤健管中心
      filterOption(input, option) {
        return (
          option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
        );
      },
      // 服务项目改变
      servItemChange(value, option) {
        let url = this.$apiList.getServItemNameAndServItemSubName;
        this.$axios.post(url, {
          "codeKind": "HINS_SERV_ITME",
          "codeValue": value.key
        }).then(res => {
          if (res.status === 0) {
            this.servItemSubList = res.data;
            // 设置项目明细值
            this.form.setFieldsValue({
              servitemsubno: {
                key: this.servItemSubList[0].codeValue,
                label: this.servItemSubList[0].codeName,
              }
            });
          } else {
            this.$message.error('对应项目明细获取失败');
          }
        }).catch(err => {
          console.log(err);
        });
      },
      // 新增或编辑提交
      handleSubmit() {
        this.form.validateFields((err, values) => {
          if (!err) {
            if (this.modalType==="add") { // 新增
              this.handleAdd(values);
            } else {
              this.handleEdit(values);
            }
          }
        });
      },
      // 新增
      handleAdd(values) {
        let url = this.$apiList.addHinsServItem;
        this.$axios.post(url, {
          mecNo: values.mecno,
          servItemNo: values.servitemno.key,
          servItemName:  values.servitemno.label,
          instrumentFlag: values.instrumentflag,
          servItemSubNo: values.servitemsubno.key,
          servItemSubName:  values.servitemsubno.label,
          guidancePrice: values.guidanceprice,
          price: values.price
        }).then(res => {
          if (res.status === 0) {
            this.$message.success('保存成功');
            this.$emit("close", 'success')
          } else if (res.status === -1) {
            this.$message.error(res.statusText);
          } else {
            this.$message.error('保存失败');
          }
        }).catch(err => {
          console.log(err);
        });
      },
      handleEdit(values) {
        let url = this.$apiList.updateHinsServItem;
        this.$axios.post(url, {
          id: this.editInfo.id,
          guidancePrice: values.guidanceprice,
          price: values.price
        }).then(res => {
          if (res.status === 0) {
            this.$message.success('保存成功');
            this.$emit("close", 'success')
          } else if (res.status === -1) {
            this.$message.error(res.statusText);
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