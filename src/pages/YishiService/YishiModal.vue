<template>
  <a-modal
    centered
    :visible="visible"
    title="医师服务"
    @cancel="handleCancel">
    <a-form :form="form">
      <a-row>
        <a-col :span="24">
          <a-form-item 
          :label-col="formItemLayout.labelCol"
          :wrapper-col="formItemLayout.wrapperCol"
          label="客户">
            <a-input disabled v-decorator="['name1']"></a-input>
          </a-form-item>
        </a-col>
      </a-row>
      <a-row>
        <a-col :span="24">
          <a-form-item 
          :label-col="formItemLayout.labelCol"
          :wrapper-col="formItemLayout.wrapperCol"
          label="体检号">
            <a-input disabled v-decorator="['physicalno1']" allowClear></a-input>
          </a-form-item>
        </a-col>
      </a-row>
      <a-row>
        <a-col :span="24">
          <a-form-item 
          :label-col="formItemLayout.labelCol"
          :wrapper-col="formItemLayout.wrapperCol"
          label="医师">
            <a-select v-decorator="['doctor']" :disabled="setGrey" allowClear>
              <a-select-option 
                v-for="(doc) in doctors" 
                v-if="doc.name"
                :key="doc.id"
                :value="doc.name">{{doc.name}}</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
      </a-row>
      <a-row>
        <a-col :span="24">
          <a-form-item 
          :label-col="formItemLayout.labelCol"
          :wrapper-col="formItemLayout.wrapperCol"
          label="医师结论">
            <a-select @change="handleChange" v-decorator="['conclusionSel']" :disabled="setGrey" allowClear>
              <a-select-option 
                v-for="(value,key) in docconclusionsMap"
                :key="value">{{value}}</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
      </a-row>
      <a-row>
        <a-col :offset="4" :span="24">
          <a-form-item 
          :wrapper-col="formItemLayout.wrapperCol"
          label="">
            <a-textarea v-decorator="['conclusion']" :disabled="setGrey" :rows="3" />
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
    <template slot="footer">
        <a-button key="back" @click="handleCancel">取消</a-button>
        <a-button 
          v-if="!setGrey"
          key="submit" 
          type="primary" 
          :loading="loading" 
          @click="handleSubmit">
          确定
        </a-button>
        <!-- <a-button 
          v-if="info.servitemno==='FW_JYFW00019'"
          key="remote" 
          type="primary" 
          @click="handleRemote">远程视频咨询</a-button> -->
      </template>
  </a-modal>
</template>

<script>
  export default {
    props: {
      visible: false,
      servstatus: {
        type: [String, Number],
        default: ''
      },
      info: {
        type: Object,
        default: function () {
          return {
            name: '',
            physicalno: '',
            endbirthday: '',
            startbirthday: '',
            sex: '',
            idno: '',
            phone: '',
            id: '',
            servitemno: '',
            servitemsubno: '',
            mecno: '',
            doctor: '',
            conclusion: ''
          }
        }
      }
    },
    data() {
      return {
        formItemLayout: {
          labelCol: { span: 4 },
          wrapperCol: { span: 16 },
        },
        form: this.$form.createForm(this),
        loading: false,
        doctors: [],
      }
    },
    computed: {
      setGrey() {
        return this.servstatus == '5' || this.servstatus == '6';
      },
      docconclusionsMap () {
        return this.$store.getters['hins/cDocConclusions'];
      },
    },
    watch: {
      visible(val) {
        // 打开modal
        if (val) {
          let {name, physicalno} = this.info;
          this.$nextTick(() => {
            this.form.setFieldsValue({  name1: name, 
                                        physicalno1: physicalno, 
                                        doctor: this.info.doctor,
                                        conclusionSel: "",
                                        conclusion: this.info.conclusion
                                      });
          });

          this.queryDoctor();
        }
      }
    },
    methods: {
      queryDoctor() {
        let url = this.$apiList.queryHinsDocList;
        this.$axios.post(url, {}).then((res) => {
          let {data} = res.data;
          let doctors = [];
          data.forEach((doc) => {
            doctors.push(doc);
          });

          this.doctors = doctors;
        })
        .catch((err) => {
          console.log(err);
        });
      },
      handleChange(value) {
        this.form.setFieldsValue({
          conclusion: value,
        });
      },
      handleSubmit() {
        let url = this.$apiList.saveDocConclusion;
        let info = this.info;
        this.$axios.post(url, {
          id: info.id,
          servStatus: this.servstatus,
          physicalNo: info.physicalno,
          mecNo: info.mecno,
          servItemNo: info.servitemno,
          doctor: this.form.getFieldValue("doctor"),
          conclusion: this.form.getFieldValue("conclusion"),
          servItemSubNo: info.servitemsubno
        }).then((res) => {
          if (res.status === 0) {
            this.$message.success('提交成功！');
            this.handleCancel('success');
          } else {
            this.$message.error('提交失败！');
            this.handleCancel();
          }
        })
        .catch((err) => {
          this.$message.error('提交失败！');
          console.log(err);
        });
      },
      handleCancel(flag) {
        this.$emit("close", flag)
      },
      handleRemote() {

      }
    },
  }
</script>

<style lang="less" scoped>
.ant-row.ant-form-item {
  margin-bottom: 20px;
}
</style>