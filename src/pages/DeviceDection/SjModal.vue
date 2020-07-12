<template>
  <a-modal
    centered
    :width="900"
    destroyOnClose
    :visible="true"
    title="双佳一体机检测信息"
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
                <td>民族：</td>
                <!-- <td>{{info.nation}}</td> -->
                <td>--</td>
                <td>出生日期：</td>
                <td>{{info.birthday}}</td>
                <td>联系方式：</td>
                <td>{{info.phone}}</td>
              </tr>
              <tr>
                <td>证件号码：</td>
                <td colspan="3">{{info.idno}}</td>
                <td>体检日期：</td>
                <td>{{info.measureTime}}</td>
              </tr>
          </table>

          <div class="discriptions">检测信息</div>
          <div class="deviceno">设备编号：{{info.deviceCode}}</div>
          <table class="dection-info small">
            <tr>
              <th>项目分类</th>
              <th>项目名称</th>
              <th>检查结果</th>
              <th>正常参考范围</th>
            </tr>
            <tr>
              <td rowspan="4">身高/体重</td>
            </tr>
            <tr>
              <td>身高(cm)</td>
              <td>{{info.height}}</td>
              <td></td>
            </tr>
            <tr>
              <td>体重(kg)</td>
              <td>{{info.weight}}</td>
              <td></td>
            </tr>
            <tr>
              <td>体重指数</td>
              <td>{{info.bmi}}</td>
              <td>18.5-23.9</td>
            </tr>
            
            <tr>
              <td rowspan="4">腰臀比</td>
            </tr>
            <tr>
              <td>腰围(cm)</td>
              <td>{{info.waistline}}</td>
              <td></td>
            </tr>
            <tr>
              <td>臀围(cm)</td>
              <td>{{info.hipline}}</td>
              <td></td>
            </tr>
            <tr>
              <td>腰臀比</td>
              <td>{{info.whr}}</td>
              <td>≤90%</td>
            </tr>

            <tr>
              <td rowspan="5">血压/血氧</td>
            </tr>
            <tr>
              <td>收缩压(mmHg)</td>
              <td>{{info.highpressure}}</td>
              <td>90-139</td>
            </tr>
            <tr>
              <td>舒张压(mmHg)</td>
              <td>{{info.lowpressure}}</td>
              <td>60-89</td>
            </tr>
            <tr>
              <td>脉搏(次/分)</td>
              <td>{{info.bppulse}}</td>
              <td>60-100</td>
            </tr>
            <tr>
              <td>血氧</td>
              <td>{{info.oxygen}}</td>
              <td>≥95%</td>
            </tr>

            <tr>
              <td rowspan="4">血糖/尿酸/总胆固醇</td>
            </tr>
            <tr>
              <td>随机血糖 (mmol/L)</td>
              <td>{{info.bloodsugar}}</td>
              <td>＜11.1</td>
            </tr>
            <tr>
              <td>尿酸(mmol/L)</td>
              <td>{{info.ua}}</td>
              <td>2.86-5.98</td>
            </tr>
            <tr>
              <td>总胆固醇(mmol/L)</td>
              <td>{{info.chol}}</td>
              <td>0.21-0.43</td>
            </tr>

            <tr>
              <td rowspan="3">体温/心电</td>
            </tr>
            <tr>
              <td>体温(℃)</td>
              <td>{{info.temperature}}</td>
              <td>36-37℃</td>
            </tr>
            <tr>
              <td>心率(次/分)</td>
              <td>{{info.peecghr}}</td>
              <td>50-95</td>
            </tr>

            <tr>
              <td rowspan="10">人体成分</td>
            </tr>
            <tr>
              <td>体脂肪量(kg)</td>
              <td>{{info.fat}}</td>
              <td>6.4-12.9</td>
            </tr>
            <tr>
              <td>体脂肪率</td>
              <td>{{info.minfatrate}}</td>
              <td>11-22%</td>
            </tr>
            <tr>
              <td>肌肉量(kg)</td>
              <td>{{info.muscle}}</td>
              <td>44-52.4</td>
            </tr>
            <tr>
              <td>体水分率</td>
              <td>{{info.waterrate}}</td>
              <td></td>
            </tr>
            <tr>
              <td>基础代谢(kcal)</td>
              <td>{{info.basicmetabolism}}</td>
              <td></td>
            </tr>
            <tr>
              <td>细胞内液(kg)</td>
              <td>{{info.fic}}</td>
              <td></td>
            </tr>
            <tr>
              <td>细胞外液(kg)</td>
              <td>{{info.foc}}</td>
              <td></td>
            </tr>
            <tr>
              <td>蛋白质(kg)</td>
              <td>{{info.protein}}</td>
              <td></td>
            </tr>
            <tr>
              <td>骨骼量(kg)</td>
              <td>{{info.bmc}}</td>
              <td></td>
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
              <a-select v-decorator="['docname']" allowClear>
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
          <a-col :span="3"></a-col>
          <a-col :span="10">
            <a-form-item >
              <a-textarea v-decorator="['conclusion']" :rows="3" />
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
        doctors: [],
      }
    },
    created() {
      this.$store.dispatch('hins/fetchSelectCode', {
        codename: 'HINS_DES_DOC_CONCLUSIONS'
      });
      this.fetchDetail();
      this.queryDoctor();
    },
    computed: {
      conclusionsMap () {
        return this.$store.getters['hins/cDesDocConclusions'];
      },
    },
    methods: {
      // 根据id获取详情
      fetchDetail() {
        let url = this.$apiList.getSjcheckoneDetailInfo;
        this.$axios.post(url,{
          chid: this.k
        }).then((res) => {
          if (res.status === 0) {
            let data = res.data;
            if (data) {
              let temp;
              temp = { ...data };
              temp.measureTime = (temp.checktime? this.$moment(temp.checktime).format("YYYY-MM-DD") : ""),
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
                docname: temp.doctor,
                conclusion: temp.conclusion,
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
          conclusion: value,
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
                  || row["birthday"] != this.info.birthday) {
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
              this.$message.error("该健管中心不存在此体检号下的双佳一体机服务！");
            }
          } else {
            this.$message.error("提交失败");
          }
        }).catch((err) => {
          console.log(err);
        });
      },
      handleConfirm(values) {
        let url = this.$apiList.saveHinsSjcheckoneExamination;
        this.$axios.post(url,{
          "inputPhysicalNo": values.inputPhysicalNo,
          "conclusion": values.conclusion,
          "doctor": values.docname,
          "id": this.k,
          "instrumentType": "E",
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
      width: 25%;
      font-weight: bold;
      background-color: #fafafa;
    }
    tr td {
      width: 25%;
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