<template>
  <a-modal
    centered
    :width="800"
    destroyOnClose
    :visible="visible"
    title="健管中心设备基础信息"
    @ok="handleSubmit"
    @cancel="handleCancel">
    <a-form :form="form">
      <a-row :gutter="16">
        <a-col :span="12">
          <a-form-item 
          :label-col="formItemLayout.labelCol"
          :wrapper-col="formItemLayout.wrapperCol"
          label="设备编码">
            <a-input v-decorator="['devicecode', config.devicecode]" allowClear></a-input>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item  
          :label-col="formItemLayout.labelCol"
          :wrapper-col="formItemLayout.wrapperCol"
          label="仪器类型">
            <a-select v-decorator="['instrumenttype', config.instrumenttype]" allowClear>
              <a-select-option 
                  v-for="(ins, key) in instrumentType"
                  :key="key"
                  :value="key">{{ins}}</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
      </a-row>
      <a-row :gutter="16">
        <a-col :span="12">
          <a-form-item  
          :label-col="formItemLayout.labelCol"
          :wrapper-col="formItemLayout.wrapperCol"
          label="健管中心">
            <a-select 
                showSearch
                :dropdownMatchSelectWidth="false"
                optionFilterProp="children"
                :filterOption="filterOption"
                v-decorator="['mecno', config.mecno]"
                allowClear>
                <a-select-option 
                  v-for="mec in mecList"
                  :key="mec.id"
                  :value="mec.mecNo">{{mec.mecName}}</a-select-option>
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
    computed: {
      // instrumenttypeMap () {
      //   return this.$store.getters['hins/cInstrumentType']
      // }
    },
    data() {
      return {
        // 查询条件
        mecList: [],
        formItemLayout: {
          labelCol: { span: 8 },
          wrapperCol: { span: 16 },
        },
        config: {
          devicecode: { rules: [{ required: true, message: '不能为空' }] },
          instrumenttype: { rules: [{ required: true, message: '不能为空' }] },
          mecno: { rules: [{ required: true, message: '不能为空' }] },
        },
        form: this.$form.createForm(this),
        instrumentType: {
          "A": "骨密度仪",
          "B": "脉象仪",
          "C": "鹰演",
          "D": "中卫一体机",
          "E": "双佳一体机"
        },
      }
    },
    watch: {
      visible(val) {
        if (val) {
          this.queryMecName();
          if (this.modalType === "edit") {
            let ef = this.editInfo;
            this.$nextTick(() => {
              this.form.setFieldsValue({
                devicecode: ef.devicecode,
                mecno: ef.mecno,
                instrumenttype: ef.instrumenttype,
              });
            });
          }
        }
      }
    },
    methods: {
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
      // 新增或编辑提交
      handleSubmit() {
        this.form.validateFields((err, values) => {
          if (!err) {
            let url;
            if (this.modalType==="add") { // 新增
              url = this.$apiList.saveEquipmentInfo;
            } else {
              url = this.$apiList.updateEquipmentInfo;
            }
            this.addOrEditSubmit(values, url);
          }
        });
      },
      addOrEditSubmit(va, url) {
        this.$axios.post(url, {
          id: this.editInfo.id,
          deviceCode: va.devicecode,
          mecNo: va.mecno,
          instrumentType: va.instrumenttype,
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