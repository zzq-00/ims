<template>
  <a-modal
    centered
    :width="900"
    destroyOnClose
    :visible="true"
    title="脉象仪检测信息"
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
              <a-input :disabled="!!info.physicalNo" v-decorator="['physicalno',config.physicalno]" allowClear></a-input>
            </a-form-item>
          </a-col>
        </a-row>

        <div>
          <div class="discriptions">基础信息</div>
          <table class="small">
              <tr>
                <td>姓名：</td>
                <td>{{info.patname}}</td>
                <td>性别：</td>
                <td>{{info.sexname}}</td>
                <td>婚姻状况：</td>
                <td>{{info.married}}</td>
              </tr>
              <tr>
                <td>民族：</td>
                <td>{{info.nation}}</td>
                <td>证件号：</td>
                <td>{{info.paperno}}</td>
                <td>邮箱：</td>
                <td>{{info.email}}</td>
              </tr>
              <tr>
                <td>身高(cm)：</td>
                <td>{{info.height}}</td>
                <td>体重(kg)：</td>
                <td>{{info.weight}}</td>
                <td>测量日期：</td>
                <td>{{info.visitdate}}</td>
              </tr>
              <tr>
                <td>职业：</td>
                <td colspan="5">{{info.profession}}</td>
              </tr>
              <tr>
                <td>工作单位：</td>
                <td colspan="5">{{info.workunit}}</td>
              </tr>
              <tr>
                <td>现住址：</td>
                <td colspan="5">{{info.address}}</td>
              </tr>
          </table>

          <div class="discriptions">检测信息</div>
          <div class="deviceno">设备编号：{{info.deviceCode}} </div>
          <table class="small">
            <tr>
              <td>医院名称：</td>
              <td>{{info.hospitalname}}</td>
              <td>流水号：</td>
              <td>{{info.patno}}</td>
              <td>医院电话：</td>
              <td>{{info.hospitaltel}}</td>
            </tr>
            <tr>
              <td>检测次数：</td>
              <td>{{info.testcount}}</td>
              <td>血压低压：</td>
              <td>{{info.bloodhigh}}</td>
              <td>血压高压：</td>
              <td>{{info.bloodlow}}</td>
            </tr>
            <tr>
              <td>血糖：</td>
              <td>{{info.bloodsugar}}</td>
              <td>血型：</td>
              <td>{{info.bloodtype}}</td>
              <td>左寸：</td>
              <td>{{info.leftcun}}</td>
            </tr>
            <tr>
              <td>梯度：</td>
              <td>{{info.tidu}}</td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
            </tr>
            <tr>
              <td>既往病史：</td>
              <td colspan="5">{{info.jiwangbingshi}}</td>
            </tr>
            <tr>
              <td>既往病史其他：</td>
              <td colspan="5">{{info.jiwangbingshiqita}}</td>
            </tr>
            <tr>
              <td>过敏史：</td>
              <td colspan="5">{{info.guominshi}}</td>
            </tr>
            <tr>
              <td>过敏源：</td>
              <td colspan="5">{{info.guominyuan}}</td>
            </tr>
            <tr>
              <td>体质类型：</td>
              <td colspan="5">{{info.phytype}}</td>
            </tr>
            <tr>
              <td>辨证结果：</td>
              <td colspan="5">{{info.bianzhengjieguo}}</td>
            </tr>
            <tr>
              <td>现症状表现：</td>
              <td colspan="5">{{info.xianzhengzhuang}}</td>
            </tr>
            <tr>
              <td>发病倾向：</td>
              <td colspan="5">{{info.fabingqingxiang}}</td>
            </tr>
            <tr>
              <td>季节调养：</td>
              <td colspan="5">{{info.jijietiaoyang}}</td>
            </tr>
            <tr>
              <td>饮食建议：</td>
              <td colspan="5">{{info.yinshijianyi}}</td>
            </tr>
            <tr>
              <td>食疗方案：</td>
              <td colspan="5">{{info.shiliaofangan}}</td>
            </tr>
            <tr>
              <td>起居调养：</td>
              <td colspan="5">{{info.qijutiaoyang}}</td>
            </tr>
            <tr>
              <td>精神修养：</td>
              <td colspan="5">{{info.jingshenxiuyang}}</td>
            </tr>
            <tr>
              <td>运动养生：</td>
              <td colspan="5">{{info.yundongyangsheng}}</td>
            </tr>
            <tr>
              <td>药物调养：</td>
              <td colspan="5">{{info.yaowutiaoyang}}</td>
            </tr>
            <tr>
              <td>经穴养生：</td>
              <td colspan="5">{{info.jingxueyangsheng}}</td>
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
              <a-select v-decorator="['docname',config.sex]" allowClear>
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
              v-decorator="['conclusionSel',config.sex]" allowClear>
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
        doctors: []
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
      fetchDetail() {
        let url = this.$apiList.getPulseDetailInfo;
        this.$axios.post(url,{
          id: this.k
        }).then((res) => {
          if (res.status === 0) {
            let data = res.data;
            if (data) {
              let temp;
              temp = { ...data };
              temp.birthday = temp.birth?this.$moment(temp.birth).format("YYYY-MM-DD"):"";
              temp.sexname = temp.sexName;
              temp.visitdate = (temp.visitdate? this.$moment(temp.visitdate).format("YYYY-MM-DD") : ""),

              this.info = temp;

              this.form.setFieldsValue({
                physicalno: temp.physicalNo,
                conclusion: temp.conclusion,
                docname: temp.docname
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
            if (this.info.physicalNo) {
              values.inputPhysicalNo = ''
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
          "instrumentType": "B", // 源码里面
          "physicalNo": values.physicalno
        }).then((res) => {
          if (res.status === 0) {
            if (res.data && res.data.length > 0) {
              let {data} = res;
              let row = data[0];

              if (row["name"] != this.info.patname
                  || row["sex"] != this.info.sex
                  || row["birthday"] != this.info.birthday
                  || row["idType"] != this.info.papertype
                  || row["idNo"] != this.info.paperno) {
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
              this.$message.error("该健管中心不存在此体检号下的脉象仪服务！");
            }
          } else {
            this.$message.error("提交失败");
          }
        }).catch((err) => {
          console.log(err);
        });
      },
      handleConfirm(values) {
        let url = this.$apiList.saveHinsPulseExamination;
        this.$axios.post(url,{
          "inputPhysicalNo": values.inputPhysicalNo,
          "zhuanjiajianyi": values.conclusion,
          "docname": values.docname,
          "id": this.k,
          "instrumentType": "B", // 源码里面中卫双佳都传的C
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
    td {
      border:1px solid #e8e8e8;
      width: 16.66%;
      height: 53px;
      padding: 6px;
    }
  }
  table.small td {
    height: 38px!important;
  }
}
</style>