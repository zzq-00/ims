<template>
  <a-modal
    :visible="true"
    title="客户信息"
    @cancel="handleCancel"
    @ok="handleSubmit">
    <a-form :form="form" layout="horizontal">
      <a-row>
        <a-col :span="12">
          <a-form-item
            :label-col="formItemLayout.labelCol"
            :wrapper-col="formItemLayout.wrapperCol"
            label="姓名">
            <a-input v-decorator="['name',config.name]" allowClear></a-input>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item
            :label-col="formItemLayout.labelCol"
            :wrapper-col="formItemLayout.wrapperCol"
            label="性别">
            <a-select v-decorator="['gender',config.gender]" allowClear>
              <a-select-option
                v-for="(value,key) in genderMap"
                :key="key"
                :value="key">{{value}}</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
      </a-row>
      <a-row>
        <a-col :span="12">
          <a-form-item
            :label-col="formItemLayout.labelCol"
            :wrapper-col="formItemLayout.wrapperCol"
            label="出生日期">
            <a-date-picker  v-decorator="['birthday',config.birthday]" allowClear />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item
            :label-col="formItemLayout.labelCol"
            :wrapper-col="formItemLayout.wrapperCol"
            label="证件类型">
            <a-select v-decorator="['idtype',config.idtype]" allowClear>
              <a-select-option
                v-for="(value,key) in idtypeMap"
                :key="key"
                :value="key">{{value}}</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
      </a-row>
      <a-row>
        <a-col :span="12">
          <a-form-item
            :label-col="formItemLayout.labelCol"
            :wrapper-col="formItemLayout.wrapperCol"
            label="证件号码">
            <a-input v-decorator="['idno',config.idno]" allowClear></a-input>
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
  </a-modal>
</template>

<script>
  export default {
    props: {
      Info: {
        type: Object,
        default: function () {
          return {
            id: '',
            name: '',
            gender: '',
            birthday: '',
            idtype: '',
            idno: ''
          }
        }
      }
    },
    data() {
      return {
        formItemLayout: {
          labelCol: { span: 8 },
          wrapperCol: { span: 16 },
        },
        config: {
          name: { rules: [{ required: true, message: '姓名不能为空' }] },
          gender: { rules: [{ required: true, message: '请选择性别' }] },
          birthday: { rules: [{ required: true, message: '请选择出生日期' }] },
          idtype: { rules: [{ required: true, message: '请选择证件类型' }] },
          idno: { rules: [{ required: true, message: '证件号码不能为空' }] },
        },
        form: this.$form.createForm(this),
      }
    },
    computed: {
      genderMap () {
        return this.$store.getters['hins/cGender'];
      },
      idtypeMap () {
        return this.$store.getters['hins/cIdType'];
      },
    },
    mounted() {
      let {name, sex, birthday, idType, idNo} = this.Info;
      this.$nextTick(() => {
        this.form.setFieldsValue({name, gender: sex, birthday: this.$moment(birthday), idtype: idType, idno: idNo});
      })
    },
    methods: {
      handleSubmit() {
        this.form.validateFields((err, values) => {
          if (!err) {
            console.log("提交成功!");
            this.submit(values);
          }
        });
      },
      async submit(values) {
        let url = this.$apiList.submitAppointCustInfo;
        await this.$axios.post(url, {
          // id: this.Info.id,
          ...this.Info,
          name: values.name,
          birthday: this.$moment(values.birthday).format("YYYY-MM-DD"),
          sex: values.gender,
          idNo: values.idno,
          idType: values.idtype
        }).then((res) => {
          if (res.status === 0) {
            this.$message.success('提交成功');
            this.handleCancel(true);
          } else {
            this.$message.error('提交失败');
            this.handleCancel(false);
          }
        }).catch(error => {
          console.log(error, "error");
        });
      },
      handleCancel(flag) {
        this.$emit("close", flag)
      },
    },
  }
</script>

<style lang="less" scoped>
  .ant-calendar-picker {
    width: 100%;
  }
</style>
