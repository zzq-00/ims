<template>
  <a-modal
    centered
    :width="800"
    destroyOnClose
    :visible="visible"
    title="客户基础信息"
    @ok="handleSubmit"
    @cancel="handleCancel">
    <div class="wrap">
      <a-form :form="form">
        <a-row :gutter="0">
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
              <a-select v-decorator="['sex',config.sex]" allowClear>
                <a-select-option value="1">男</a-select-option>
                <a-select-option value="0">女</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="0">
          <a-col :span="12">
            <a-form-item 
            :label-col="formItemLayout.labelCol"
            :wrapper-col="formItemLayout.wrapperCol"
            label="证件类型">
              <a-select v-decorator="['idtype',config.idtype]" allowClear>
                <a-select-option value="0">身份证</a-select-option>
                <a-select-option value="1">护照</a-select-option>
                <a-select-option value="2">军官证</a-select-option>
                <a-select-option value="3">工作证</a-select-option>
                <a-select-option value="4">其他</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item  
            :label-col="formItemLayout.labelCol"
            :wrapper-col="formItemLayout.wrapperCol"
            label="证件号码">
              <a-input v-decorator="['idno',config.idno]" allowClear></a-input>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="0">
          <a-col :span="12">
            <a-form-item 
            :label-col="formItemLayout.labelCol"
            :wrapper-col="formItemLayout.wrapperCol"
            label="出生日期">
              <a-date-picker v-decorator="['birthday',config.birthday]" allowClear />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item  
            :label-col="formItemLayout.labelCol"
            :wrapper-col="formItemLayout.wrapperCol"
            label="国家">
              <a-input v-decorator="['country']" allowClear></a-input>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="0">
          <a-col :span="12">
            <a-form-item 
            :label-col="formItemLayout.labelCol"
            :wrapper-col="formItemLayout.wrapperCol"
            label="民族">
              <a-input v-decorator="['nationality']" allowClear></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item  
            :label-col="formItemLayout.labelCol"
            :wrapper-col="formItemLayout.wrapperCol"
            label="婚姻状况">
              <a-select v-decorator="['marriage']" allowClear>
                <a-select-option value="0">未婚</a-select-option>
                <a-select-option value="1">已婚</a-select-option>
                <a-select-option value="3">离异</a-select-option>
                <a-select-option value="4">丧偶</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="0">
          <a-col :span="12">
            <a-form-item 
            :label-col="formItemLayout.labelCol"
            :wrapper-col="formItemLayout.wrapperCol"
            label="职业">
              <a-select v-decorator="['occupation']" allowClear>
                <a-select-option value="1">职员</a-select-option>
                <a-select-option value="2">教师</a-select-option>
                <a-select-option value="3">销售</a-select-option>
                <a-select-option value="4">技师</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item  
            :label-col="formItemLayout.labelCol"
            :wrapper-col="formItemLayout.wrapperCol"
            label="学历">
              <a-select v-decorator="['degree']" allowClear>
                <a-select-option value="0">博士以上</a-select-option>
                <a-select-option value="1">博士</a-select-option>
                <a-select-option value="2">本科</a-select-option>
                <a-select-option value="3">大专</a-select-option>
                <a-select-option value="4">中专</a-select-option>
                <a-select-option value="5">高中</a-select-option>
                <a-select-option value="6">初中</a-select-option>
                <a-select-option value="7">其他</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="0">
          <a-col :span="12">
            <a-form-item 
            :label-col="formItemLayout.labelCol"
            :wrapper-col="formItemLayout.wrapperCol"
            label="联系方式">
              <a-input v-decorator="['phone']" allowClear></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item  
            :label-col="formItemLayout.labelCol"
            :wrapper-col="formItemLayout.wrapperCol"
            label="电子邮件">
              <a-input v-decorator="['email']" allowClear></a-input>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="0">
          <a-col :span="12">
            <a-form-item 
            :label-col="formItemLayout.labelCol"
            :wrapper-col="formItemLayout.wrapperCol"
            label="单位名称">
              <a-input v-decorator="['company']" allowClear></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item  
            :label-col="formItemLayout.labelCol"
            :wrapper-col="formItemLayout.wrapperCol"
            label="家庭住址">
              <a-input v-decorator="['homeaddress']" allowClear></a-input>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="0">
          <a-col :span="12">
            <a-form-item 
            :label-col="formItemLayout.labelCol"
            :wrapper-col="formItemLayout.wrapperCol"
            label="家庭邮编">
              <a-input v-decorator="['homezipcode']" allowClear></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item  
            :label-col="formItemLayout.labelCol"
            :wrapper-col="formItemLayout.wrapperCol"
            label="邮寄地址">
              <a-input v-decorator="['shipaddress']" allowClear></a-input>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="0">
          <a-col :span="12">
            <a-form-item 
            :label-col="formItemLayout.labelCol"
            :wrapper-col="formItemLayout.wrapperCol"
            label="邮寄邮编">
              <a-input v-decorator="['shipzipcode']" allowClear></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item  
            :label-col="formItemLayout.labelCol"
            :wrapper-col="formItemLayout.wrapperCol"
            label="监护人姓名">
              <a-input v-decorator="['guardianname']" allowClear></a-input>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="0">
          <a-col :span="12">
            <a-form-item 
            :label-col="formItemLayout.labelCol"
            :wrapper-col="formItemLayout.wrapperCol"
            label="监护人证件类型">
              <a-select v-decorator="['guardianidtype']" allowClear>
                <a-select-option value="0">身份证</a-select-option>
                <a-select-option value="1">护照</a-select-option>
                <a-select-option value="2">军官证</a-select-option>
                <a-select-option value="3">工作证</a-select-option>
                <a-select-option value="4">其他</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item  
            :label-col="formItemLayout.labelCol"
            :wrapper-col="formItemLayout.wrapperCol"
            label="监护人证件号码">
              <a-input v-decorator="['guardianidno']" allowClear></a-input>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="0">
          <a-col :span="24">
            <a-form-item 
            :label-col="{ span: 4}"
            :wrapper-col="{ span: 20 }"
            label="备注信息">
              <a-textarea v-decorator="['remarks']" :rows="3" />
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </div>
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
          return {}
        }
      }
    },
    data() {
      return {
        sexMap: ["女","男"],
        idtypeMap: ["身份证","护照","军官证","工作证","其他"],
        marriageMap: ["未婚","已婚", "", "离异","丧偶"],
        occupationMap: ["", "职员","教师","销售","技师"],
        degreeMap: ["博士以上","博士","本科","大专","中专","高中","初中","其他"],
        // 查询条件
        formItemLayout: {
          labelCol: { span: 8 },
          wrapperCol: { span: 16 },
        },
        config: {
          name: { rules: [{ required: true, message: '姓名不能为空' }] },
          sex: { rules: [{ required: true, message: '请选择性别' }] },
          birthday: { rules: [{ required: true, message: '请选择出生日期' }] },
          idtype: { rules: [{ required: true, message: '请选择证件类型' }] },
          idno: { rules: [{ required: true, message: '证件号码不能为空'}, {validator: this.idnoValidate}] },
        },
        form: this.$form.createForm(this),

      }
    },
    watch: {
      visible(val) {
        if (!val) return;
        if (this.modalType === "edit") {
          let ef = this.editInfo;
          this.$nextTick(() => {
            this.form.setFieldsValue({
              birthday: this.$moment(ef.birthday), // 出生日期
              company: ef.company, // 公司
              country: ef.country, // 国家
              degree: ef.degree, // 学位
              email: ef.email, // 邮箱
              homeaddress: ef.homeAddress, // 地址
              homezipcode: ef.homeZipcode, // 邮政编码
              idno: ef.idno, // 证件号

              idtype: ef.idtypeRaw, // 证件类型
              marriage: ef.marriage, // 婚姻状况
              name: ef.name, // 姓名
              nationality: ef.nationality, // 民族
              occupation: ef.occupation, // 职业
              phone: ef.phone,
              guardianidno: ef.guardianIdno, // 监护人证件号
              guardianidtype: ef.guardianIdtype, // 监护人证件类型
              guardianname: ef.guardianName, // 监护人姓名
              remarks: ef.remarks, // 备注

              sex: ef.sexRaw, // 性别
              shipaddress: ef.shipAddress, // 邮寄地址
              shipzipcode: ef.shipZipcode, // 邮寄邮编
             });
          });
        }
      }
    },
    methods: {
      // 自定义身份证校验逻辑
      idnoValidate(rule, value, callback) {
        if (this.form.getFieldValue('idtype') == "0") {
          // 证件类型为身份证时判断，
          // 身份证号码为15位或者18位，15位时全为数字，18位前17位为数字，最后一位是校验位，可能为数字或字符X 
          var reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/; 
          if(value.length !== 0 && reg.test(value) === false) 
          { 
            callback("身份证输入不合法"); 
          } else {
            callback();
          }
        } else {
          callback();
        }
      },
      // 检查出生日期和性别
      checkBirSex(idno){
        var sex = "";
        var xingbie = "";
        var year = "";
        var month = "";
        var day = "";
        
        // 出生日期，性别
         var obj = idno;
        
        if(obj.length == 15){
          year = obj.substr(6,2);
          month = obj.substr(8,2);
          day = obj.substr(10,2);
          xingbie = obj.substr(14,1);
          if(xingbie%2 == 0)
            sex="2";//"女性";
          else
            sex="1";//"男性";
          year = "19" + year;
        }
        else if(obj.length == 18){
          year = obj.substr(6,4);
          month = obj.substr(10,2);
          day = obj.substr(12,2);
          xingbie = obj.substr(16,1);
        
          if(xingbie%2 == 0)
            sex="0";//"女性";
          else
            sex="1";//"男性";
        }
        this.form.setFieldsValue({"sex": sex});
        this.form.setFieldsValue({"birthday": this.$moment(new Date(year,month-1,day))});
      },
      handleSubmit() {
        this.form.validateFields((err, values) => {
          if (!err) {
            if (values.idtype == '0') {
              // 根据身份证号设置性别和生日
              this.checkBirSex(values.idno);
            }
            this.addSubmit(this.form.getFieldsValue());
          }
        });
      },
      // 新增和编辑同一个接口
      addSubmit(va) {
        let url = this.$apiList.saveOrUpdateCustListByInfo;
        let payload = {
          // 编辑时用到前3个属性
          id: this.editInfo.id,
          customerNo: this.editInfo.customerNo,
          
          birthday: va.birthday && this.$moment(va.birthday).format("YYYY-MM-DD"), // 出生日期
          company: va.company, // 公司
          country: va.country, // 国家
          degree: va.degree, // 学位
          email: va.email, // 邮箱
          guardianNo: va.guardianidno, // 监护人编码
          homeAddress: va.homeaddress, // 地址
          homeZipcode: va.homezipcode, // 邮政编码
          idno: va.idno, // 证件号
          idtype: va.idtype, // 证件类型
          marriage: va.marriage, // 婚姻状况
          name: va.name, // 姓名
          nationality: va.nationality, // 民族
          occupation: va.occupation, // 职业
          phone: va.phone,
          guardianIdno: va.guardianidno, // 监护人证件号
          guardianIdtype: va.guardianidtype, // 监护人证件类型
          guardianName: va.guardianname, // 监护人姓名
          remarks: va.remarks, // 备注
          sex: va.sex, // 性别
          shipAddress: va.shipaddress, // 邮寄地址
          shipZipcode: va.shipzipcode, // 邮寄邮编
        }
        this.$axios.post(url,payload).then((res) => {
          if (res.data.statusText && res.data.statusText === "Success") {
            this.$message.success("保存成功！");
            this.$emit("close", 'success')
          } else {
            this.$message.error("保存失败！");
          }
        }).catch((err) => {
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

.wrap {
  margin: -24px;
  padding: 24px;
  max-height: 400px;
  overflow-y: auto;
}
</style>