<template>
  <a-modal
    centered
    :width="800"
    destroyOnClose
    :visible="true"
    title="医师基础信息"
    @ok="handleSubmit"
    @cancel="handleCancel">
    <div class="modal-wrap">
      <a-form :form="form">
        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item 
            :label-col="formItemLayout.labelCol"
            :wrapper-col="formItemLayout.wrapperCol"
            label="姓名">
              <a-input v-decorator="['name', config.name]" allowClear></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item  
            :label-col="formItemLayout.labelCol"
            :wrapper-col="formItemLayout.wrapperCol"
            label="性别">
              <a-select v-decorator="['sex', config.sex]">
                <a-select-option 
                  v-for="(value,key) in genderMap"
                  :key="key"
                  :value="key">{{value}}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item 
            :label-col="formItemLayout.labelCol"
            :wrapper-col="formItemLayout.wrapperCol"
            label="出生日期">
              <a-date-picker v-decorator="['birthday']" allowClear />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item  
            :label-col="formItemLayout.labelCol"
            :wrapper-col="formItemLayout.wrapperCol"
            label="所属科室">
              <a-input v-decorator="['department']" allowClear></a-input>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item 
            :label-col="formItemLayout.labelCol"
            :wrapper-col="formItemLayout.wrapperCol"
            label="证件类型">
              <a-select v-decorator="['idtype']" allowClear>
                <a-select-option 
                  v-for="(value,key) in idtypeMap"
                  :key="key"
                  :value="key">{{value}}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item  
            :label-col="formItemLayout.labelCol"
            :wrapper-col="formItemLayout.wrapperCol"
            label="证件号">
              <a-input v-decorator="['idno']" allowClear></a-input>
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
            label="医师级别">
              <a-select v-decorator="['docclass']" allowClear>
                <a-select-option 
                  v-for="(value,key) in docclassMap"
                  :key="key"
                  :value="key">{{value}}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item 
            :label-col="formItemLayout.labelCol"
            :wrapper-col="formItemLayout.wrapperCol"
            label="学历">
              <a-select v-decorator="['degree']" allowClear>
                <a-select-option 
                  v-for="(value,key) in degreeMap"
                  :key="key"
                  :value="key">{{value}}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item  
            :label-col="formItemLayout.labelCol"
            :wrapper-col="formItemLayout.wrapperCol"
            label="民族">
              <a-input v-decorator="['nationality']" allowClear></a-input>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item 
            :label-col="formItemLayout.labelCol"
            :wrapper-col="formItemLayout.wrapperCol"
            label="婚姻状况">
              <a-select v-decorator="['marriage']" allowClear>
                <a-select-option 
                  v-for="(value,key) in marriageMap"
                  :key="key"
                  :value="key">{{value}}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item  
            :label-col="formItemLayout.labelCol"
            :wrapper-col="formItemLayout.wrapperCol"
            label="电话">
              <a-input v-decorator="['phone']" allowClear></a-input>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item 
            :label-col="formItemLayout.labelCol"
            :wrapper-col="formItemLayout.wrapperCol"
            label="电子邮件">
              <a-input v-decorator="['email', config.devicecode]" allowClear></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item  
            :label-col="formItemLayout.labelCol"
            :wrapper-col="formItemLayout.wrapperCol"
            label="单位名称">
              <a-input v-decorator="['company']" allowClear></a-input>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :span="24">
            <a-form-item  
            :label-col="{span: 4}"
            :wrapper-col="{span: 20}"
            label="家庭住址">
              <a-input v-decorator="['homeaddress']" allowClear></a-input>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </div>
  </a-modal>
</template>

<script>
  export default {
    props: ['k', 't'],
    data() {
      return {
        // 查询条件
        formItemLayout: {
          labelCol: { span: 8 },
          wrapperCol: { span: 16 },
        },
        config: {
          name: { rules: [{ required: true, message: '姓名不能为空' }] },
          sex: { rules: [{ required: true, message: '性别不能为空' }] },
          mecno: { rules: [{ required: true, message: '健管中心不能为空' }] },
        },
        form: this.$form.createForm(this),
        mecList: [],
      }
    },
    computed: {
      genderMap () {
        return this.$store.getters['hins/cGender'];
      },
      degreeMap () {
        return this.$store.getters['hins/cDegree'];
      },
      idtypeMap () {
        return this.$store.getters['hins/cIdType'];
      },
      docclassMap () {
        return this.$store.getters['hins/cDocClass'];
      },
      marriageMap () {
        return this.$store.getters['hins/cMarriage'];
      },
    },
    created() {
      this.fetchDropDown('VIP_SEX');
      this.fetchDropDown('DOCTOR_TITLE_CODE'); // 医师级别
      this.fetchDropDown('VIP_IDCARDTYPE'); // 证件类型
      this.fetchDropDown('HINS_QUALIFICATION_TYPE'); // 学历
      this.fetchDropDown('VIP_MARRIAGE'); // 婚姻状况

      this.queryMecName();
      if (this.t === 'edit') {
        this.fetchDetail(this.k);
      }
    },
    methods: {
      fetchDropDown(codename) {
        this.$store.dispatch('hins/fetchSelectCode', {
          codename,
        });
      },
      getSelectOptions (codeName) {
        let url = this.$apiList.getSelectOptions(codeName);
        this.$axios.post(url).then(res => {
          let data = res;
          console.log(data);
        }).catch(err => {
          console.log(err);
        });
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
      // 编辑时,根据id查询详情
      fetchDetail(id) {
        let url = this.$apiList.getDocInfoByID;
        this.$axios.post(url, {
          id,
        }).then(res => {
          if (res.status === 0) {
            let data = res.data;
            this.form.setFieldsValue({
              name: data.name,
              sex: data.sex,
              birthday: data.birthday && this.$moment(data.birthday),
              department: data.department,
              idtype: data.idtype,
              idno: data.idno,
              mecno: data.mecNo,
              docclass: data.docClass,
              degree: data.degree,
              nationality: data.nationality,
              marriage: data.marriage,
              phone: data.phone,
              email: data.email,
              company: data.company,
              homeaddress: data.homeAddress
            });
          } else {
            this.$message.error('详细信息获取失败');
          }
        }).catch(err => {
          console.log(err);
        });
      },
      // 新增或编辑提交
      handleSubmit() {
        this.form.validateFields((err, values) => {
          if (!err) {
            console.log(values);
            if (this.t==="add") { // 新增
              this.addSubmit(values);
            } else { // 编辑
              this.editSubmit(values);
            }
          }
        });
      },
      addSubmit(va) {
        let url = this.$apiList.saveDocInfo;
        this.$axios.post(url, {
          id: this.k,
          name: va.name,
          sex: va.sex,
          birthday: va.birthday && this.$moment(va.birthday).format("YYYY-MM-DD"),
          department: va.department,
          idtype: va.idtype,
          idno: va.idno,
          mecNo: va.mecno,
          docClass: va.docclass,
          degree: va.degree,
          nationality: va.nationality,
          marriage: va.marriage,
          phone: va.phone,
          email: va.email,
          company: va.company,
          homeAddress: va.homeaddress
        }).then(res => {
          if (res.status === 0) {
            this.$message.success('保存成功');
            this.handleCancel();
          } else if (res.status === -1) {
            this.$message.error(res.statusText);
          } else {
            this.$message.error('保存失败');
          }
        }).catch(err => {
          console.log(err);
        });
      },
      editSubmit(va) {
        let url = this.$apiList.updateDocInfo;
        this.$axios.post(url, {
          id: this.k,
          name: va.name,
          sex: va.sex,
          birthday: va.birthday && this.$moment(va.birthday).format("YYYY-MM-DD"),
          department: va.department,
          idtype: va.idtype,
          idno: va.idno,
          mecNo: va.mecno,
          docClass: va.docclass,
          degree: va.degree,
          nationality: va.nationality,
          marriage: va.marriage,
          phone: va.phone,
          email: va.email,
          company: va.company,
          homeAddress: va.homeaddress
        }).then(res => {
          if (res.status === 0) {
            this.$message.success('保存成功');
            this.handleCancel();
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
        this.$router.push({
          name: "doctormanagement"
        })
      },
    },
  }
</script>

<style lang="less" scoped>
.modal-wrap {
  max-height: 400px;
  margin: -24px;
  padding: 24px;
  overflow-y: auto;
}

.ant-calendar-picker {
  width: 100%;
}
</style>