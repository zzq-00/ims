<template>
  <a-modal
    centered
    :width="900"
    destroyOnClose
    :visible="true"
    title="中卫一体机检测信息"
    @ok="handleSubmit"
    @cancel="handleCancel">
    <div class="wrap">
      <a-form :form="form">
        <a-row :gutter="0">
          <a-col :span="24">
            <a-form-item 
            :label-col="formItemLayout.labelCol"
            :wrapper-col="formItemLayout.wrapperCol"
            label="体检号">
              <a-input :disabled="!!info.physicalno" v-decorator="['physicalno',config.physicalno]" allowClear></a-input>
            </a-form-item>
          </a-col>
        </a-row>

        <div>
          <div class="discriptions">基础信息</div>
          <table class="small">
              <tr>
                <td>姓名：</td>
                <td>{{info.name}}</td>
                <td>性别：</td>
                <td>{{info.sex}}</td>
                <td>年龄：</td>
                <td>{{info.age}}</td>
              </tr>
              <tr>
                <td>证件号码：</td>
                <td colspan="3">{{info.idno}}</td>
                <td>体检日期：</td>
                <td>{{info.checkTime}}</td>
              </tr>
          </table>

          <div class="discriptions">检测信息</div>
          <div class="deviceno">设备编号： {{info.devicecode}}</div>
          <table class="dection-info small">
            <tr>
              <th>项目名称</th>
              <th>结果</th>
              <th>单位</th>
              <th>参考范围</th>
              <th>状况</th>
            </tr>
            <tr>
              <td>身高</td>
              <td>{{info.heightcheckresult}}</td>
              <td>{{info.heightunit}}</td>
              <td>{{info.heightrefrange}}</td>
              <td>{{info.heightcheckstatus}}</td>
            </tr>
            <tr>
              <td>体重</td>
              <td>{{info.weightcheckresult}}</td>
              <td>{{info.weightunit}}</td>
              <td>{{info.weightrefrange}}</td>
              <td>{{info.weightcheckstatus}}</td>
            </tr>
            <tr>
              <td>血压</td>
              <td>{{info.bloodprecheckresult}}</td>
              <td>{{info.bloodpreunit}}</td>
              <td>{{info.bloodprerefrange}}</td>
              <td>{{info.bloodprecheckstatus}}</td>
            </tr>
            <tr>
              <td>体温</td>
              <td>{{info.bodytemperatcheckresult}}</td>
              <td>{{info.bodytemperatunit}}</td>
              <td>{{info.bodytemperatrefrange}}</td>
              <td>{{info.bodytemperatcheckstatus}}</td>
            </tr>
            <tr>
              <td>BMI</td>
              <td>{{info.bmicheckresult}}</td>
              <td>{{info.bmiunit}}</td>
              <td>{{info.bmirefrange}}</td>
              <td>{{info.bmicheckstatus}}</td>
            </tr>
            <tr>
              <td>血氧饱和度</td>
              <td>{{info.oxygencheckresult}}</td>
              <td>{{info.oxygenunit}}</td>
              <td>{{info.oxygenrefrange}}</td>
              <td>{{info.oxygencheckstatus}}</td>
            </tr>
            <tr>
              <td>心率数</td>
              <td>{{info.heartratecheckresult}}</td>
              <td>{{info.heartrateunit}}</td>
              <td>{{info.heartraterefrange}}</td>
              <td>{{info.heartratecheckstatus}}</td>
            </tr>
            <tr>
              <td>甘油三酯</td>
              <td>{{info.tgcheckresult}}</td>
              <td>{{info.tgunit}}</td>
              <td>{{info.tgrefrange}}</td>
              <td>{{info.tgcheckstatus}}</td>
            </tr>
            <tr>
              <td>总胆固醇</td>
              <td>{{info.cholcheckresult}}</td>
              <td>{{info.cholunit}}</td>
              <td>{{info.cholrefrange}}</td>
              <td>{{info.cholcheckstatus}}</td>
            </tr>
            <tr>
              <td>高密度脂蛋白</td>
              <td>{{info.hdlcheckresult}}</td>
              <td>{{info.hdlunit}}</td>
              <td>{{info.hdlrefrange}}</td>
              <td>{{info.hdlcheckstatus}}</td>
            </tr>
            <tr>
              <td>低密度脂蛋白</td>
              <td>{{info.oxldlcheckresult}}</td>
              <td>{{info.oxldlunit}}</td>
              <td>{{info.oxldlrefrange}}</td>
              <td>{{info.oxldlcheckstatus}}</td>
            </tr>
            <tr>
              <td>空腹血糖</td>
              <td>{{info.glucheckresult}}</td>
              <td>{{info.gluunit}}</td>
              <td>{{info.glurefrange}}</td>
              <td>{{info.glucheckstatus}}</td>
            </tr>
            <tr>
              <td>血尿酸</td>
              <td>{{info.buacheckresult}}</td>
              <td>{{info.buaunit}}</td>
              <td>{{info.buarefrange}}</td>
              <td>{{info.buacheckstatus}}</td>
            </tr>
            <tr>
              <td>基础代谢量</td>
              <td>{{info.bmrcheckresult}}</td>
              <td>{{info.bmrunit}}</td>
              <td>{{info.bmrrefrange}}</td>
              <td>{{info.bmrcheckstatus}}</td>
            </tr>
            <tr>
              <td>体脂肪率</td>
              <td>{{info.bfrcheckresult}}</td>
              <td>{{info.bfrunit}}</td>
              <td>{{info.bfrrefrange}}</td>
              <td>{{info.bfrcheckstatus}}</td>
            </tr>
            <tr>
              <td>身体水分</td>
              <td>{{info.tbwcheckresult}}</td>
              <td>{{info.tbwunit}}</td>
              <td>{{info.tbwrefrange}}</td>
              <td>{{info.tbwcheckstatus}}</td>
            </tr>
          </table>
        </div>
        
        <div class="discriptions">医师结论</div>
        <a-row :gutter="0">
          <a-col :span="24">
            <a-form-item  
            :label-col="formItemLayout.labelCol"
            :wrapper-col="formItemLayout.wrapperCol"
            label="医师">
              <a-select v-decorator="['loginname']" allowClear>
                 <a-select-option 
                  v-for="(doc) in doctors" 
                  :key="doc.id"
                  :value="doc.name">{{doc.name}}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="0">
          <a-col :span="24">
            <a-form-item  
            :label-col="formItemLayout.labelCol"
            :wrapper-col="formItemLayout.wrapperCol"
            label="医师结论">
              <a-select 
                @change="conclusionChange"
                v-decorator="['conclusionSel']" allowClear>
                 <a-select-option 
                  v-for="(value,key) in conclusionsMap"
                  :key="value">{{value}}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="24">
            <a-form-item  
            :label-col="formItemLayout.labelCol"
            :wrapper-col="{span: 10}"
            label="系统建议">
              <a-textarea disabled v-decorator="['healthsuggestdetail']" :rows="3" />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="24">
            <a-form-item  
            :label-col="formItemLayout.labelCol"
            :wrapper-col="{span: 10}"
            label="医师建议">
              <a-textarea v-decorator="['healthsuggestvary']" :rows="3" />
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </div>
  </a-modal>
</template>

<script>
  export default {
    props: ['k', 'name', 'sex', 'sexcode', 'birthday', 'idno', 'phone', 'physicalno', 'doctor','conclusion'],
    data() {
      return {
        // 查询条件
        formItemLayout: {
          labelCol: { span: 3 },
          wrapperCol: { span: 7 },
        },
        config: {
          physicalno: { rules: [{ required: true, message: '请填写体检号' }] },
        },
        form: this.$form.createForm(this),
        info: {},
        // 医师列表
        doctors: []
      }
    },
    computed: {
      conclusionsMap () {
        return this.$store.getters['hins/cDesDocConclusions'];
      },
    },
    created() {
      this.$store.dispatch('hins/fetchSelectCode', {
        codename: 'HINS_DES_DOC_CONCLUSIONS'
      });
      this.fetchDetail();
      this.queryDoctor();
    },
    methods: {
      fetchDetail() {
        let url = this.$apiList.getZwcheckoneDetailInfo;
        this.$axios.post(url,{
          chid: this.k
        }).then((res) => {
          if (res.status === 0) {
            let data = res.data;
            if (data) {
              let temp;
              temp = { ...data };
              temp.checkTime = (temp.checktime? this.$moment(temp.checktime).format("YYYY-MM-DD") : ""),
              temp.name = this.name;
              temp.sex = this.sex;
              temp.sexcode = this.sexcode;
              temp.birthday = this.birthday,
              temp.idno = this.idno;
              temp.phone = this.phone;
              temp.physicalno = this.physicalno;
              temp.doctor = this.doctor;
              temp.conclusion = this.conclusion;

              this.info = temp;

              this.form.setFieldsValue({
                physicalno: temp.physicalno,
                loginname: temp.doctor,

                healthsuggestdetail: temp.healthsuggestdetail,
                healthsuggestvary: temp.conclusion
              });
            }

          } else {
            this.$message.error("数据获取失败");
          }
        }).catch((err) => {
          console.log(err);
        });
      },
      // 医师列表
      queryDoctor() {
        let url = this.$apiList.queryHinsDocList;
        this.$axios.post(url,{}).then((res) => {
          let {data} = res.data;
          let doctors = [];
          data.forEach((doc) => {
            if (doc.name) {
              doctors.push(doc);
            }
          });

          this.doctors = doctors;
        })
        .catch((err) => {
          console.log(err);
        });
      },
      // 医师结论改变
      conclusionChange(value) {
        if (value == undefined) return;
        this.form.setFieldsValue({
          healthsuggestvary: value,
        });
      },
      // 确认
      handleSubmit() {
        this.form.validateFields((err, values) => {
          if (!err) {
            if (this.info.physicalno) {
              values.inputPhysicalNo = '';
              this.handleConfirm(values);
            } else {
              values.inputPhysicalNo = values.physicalno;
              this.beforeConfirm(values);
            }
            return;
          }
        });
      },
      // 手动添加体检号校验
      beforeConfirm(values) {
        let url = this.$apiList.getHinsHsAppointByPhysicalno;
        this.$axios.post(url,{
          "instrumentType": "C", // 源码里面中卫双佳都传的C
          "physicalNo": values.physicalno
        }).then((res) => {
          if (res.status === 0) {
            if (res.data && res.data.length > 0) {
              let {data} = res;
              let row = data[0];
              if (row["name"] != this.info.name
                  || row["sex"] != this.info.sexcode
                  || row["idNo"] != this.info.idno) {
                    let _this = this;
                    this.$confirm({
                      content: '预约客户信息与检测客户信息不一致，确认绑定？',
                      onOk() {
                        _this.handleConfirm(values);
                      },
                    });
              } else {
                this.handleConfirm(values);
              }
            } else {
              this.$message.error("该健管中心不存在此体检号下的中卫一体机服务！");
            }
          } else {
            this.$message.error("提交失败");
          }
        }).catch((err) => {
          console.log(err);
        });
      },
      handleConfirm(values) {
        let url = this.$apiList.saveHinsZwcheckoneExamination;
        this.$axios.post(url,{
          "inputPhysicalNo": values.inputPhysicalNo,
          "conclusion": values.healthsuggestvary,
          "doctor": values.loginname,
          "id": this.k,
          "instrumentType": "D",
          "physicalNo": values.physicalno
        }).then((res) => {
          if (res.status === 0) {
            this.$message.success("提交成功");
            this.handleCancel();
          } else {
            this.$message.error("提交失败");
          }
        }).catch((err) => {
          console.log(err);
        });
      },
      handleCancel() {
        this.$router.push({
          name: 'devicedection'
        });
      },
    },
  }
</script>

<style lang="less" scoped>
.wrap {
  margin: -24px;
  padding: 24px;
  max-height: 400px;
  overflow-y: auto;
  .ant-form /deep/ .ant-form-item-label{
    text-align: left;
  }
  .discriptions {
    margin-bottom: 20px;
    color: rgba(0,0,0,.85);
    font-weight: 700;
    font-size: 16px;
    line-height: 1.5;
  }
  .deviceno {
    margin-bottom: 10px;
  }

  table {
    border-collapse:collapse;
    width: 100%;
    border-radius: 4px;
    margin-bottom: 20px;
    tr td:nth-child(odd) {
      background-color: #fafafa;
    }
    th,td {
      border:1px solid #e8e8e8;
      width: 16.66%;
      height: 53px;
      padding: 6px;
    }
  }
  table.dection-info {
    th {
      width: 20%;
      font-weight: bold;
      background-color: #fafafa;
    }
    tr td {
      width: 20%;
      background-color: #fff;
    }
  }
  
  table.small {
    th, td {
      height: 38px!important;
    }
  }
}
</style>