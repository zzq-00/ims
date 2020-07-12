<template>
  <a-modal
    centered
    :width="900"
    destroyOnClose
    :visible="true"
    title="骨密度检测信息"
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
                <td>{{info.name}}</td>
                <td>性别：</td>
                <td>{{info.sex}}</td>
                <td>出生日期：</td>
                <td>{{info.birthday}}</td>
              </tr>
              <tr>
                <td>联系方式：</td>
                <td>{{info.phone}}</td>
                <td>住址：</td>
                <td>{{info.address}}</td>
                <td>测量日期：</td>
                <td>{{info.mdate}}</td>
              </tr>
          </table>

          <div class="discriptions">检测信息</div>
          <div class="deviceno">设备编号： {{info.deviceCode}} </div>
          <table class="small">
            <tr>
              <td>身高(cm)：</td>
              <td>{{info.height}}</td>
              <td>体重(kg)：</td>
              <td>{{info.weight}}</td>
              <td>SOS值：</td>
              <td>{{info.sosValue}}</td>
            </tr>
            <tr>
              <td>T值：</td>
              <td>{{info.tvalue}}</td>
              <td>Z值：</td>
              <td>{{info.zvalue}}</td>
              <td>标准值：</td>
              <td>{{info.svalue}}</td>
            </tr>
            <tr>
              <td>测量值/峰值：</td>
              <td>{{info.spvale}}</td>
              <td>Z值相对年龄：</td>
              <td>{{info.xdnl}}</td>
              <td>相对骨折风险(%)：</td>
              <td>{{info.gzfx}}</td>
            </tr>
          </table>
        </div>
        
        <div class="discriptions">骨密度图</div>
        <div class="gmd-graph">
          <highcharts ref="gmdInstance" :options="chartOptions"></highcharts>
        </div>

        <div class="discriptions">医师结论</div>
        <a-row :gutter="0">
          <a-col :span="24">
            <a-form-item  
            :label-col="formItemLayout.labelCol"
            :wrapper-col="formItemLayout.wrapperCol"
            label="医师">
              <a-select v-decorator="['doctor']" allowClear>
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
  import Highcharts from 'highcharts'
  import exportingInit from 'highcharts/modules/exporting'
  import {Chart} from 'highcharts-vue'
  // 引入导出模块
  exportingInit(Highcharts)

  export default {
    props: ['k', 'name', 'sex', 'sexcode', 'birthday', 'idno', 'phone', 'physicalno', 'doctor','conclusion', 'imgname'],
    components: {
      highcharts: Chart
    },
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
        inputPhysicalNo: '',
        form: this.$form.createForm(this),
        info: {},
        doctors: [],
        // 骨密度图(highcharts)
        chartOptions: {
          lang: {
            contextButtonTitle:"图表导出菜单",
            downloadJPEG:"下载JPEG图片",
            downloadPDF:"下载PDF文件",
            downloadPNG:"下载PNG文件",
            downloadSVG:"下载SVG文件",
            loading:"加载中",
            noData:"没有数据",
            printChart:"打印图表",
            resetZoom:"恢复缩放",
            resetZoomTitle:"恢复图表",
          },
          title : {
            text: '暂无数据'
          },
          legend :{
            align: 'center',
            verticalAlign: 'top',
          　x: 0, //间隔x轴的间隔
            y: 20 //间隔Y轴的间隔
            },
          xAxis : {
            title: {
                text: '年龄（岁）'
            },
            data : ['17','18','19','20','21','22','23','24','25','26','27','28','29',
                            '30','31','32','33','34','35','36','37','38','39','40','41','42',
                            '43','44','45','46','47','48','49','50','51','52','53','54','55',
                            '56','57','58','59','60','61','62','63','64','65','66','67','68',
                            '69','70','71','72','73','74','75','76','77','78','79','80','81',
                            '82','83','84','85','86','87','88','89','90','91','92','93','94',
                            '95','96','97','98','99','100']
          },
          yAxis : {
            title: {
                text: ''
              },
            plotLines: [{
                  value: 0,
                  width: 1,
                  color: '#808080'
                }]
          },
          plotOptions: {
            series: {
              // 数据点标记
              marker: {
                enabled: false
              }
            }
          },
          series : [
              {
                  name:'偏高密度',
                  data:[4089,4105,4120,4135,4147,4169,4186,4205,4221,4243,4262,4276,4295,4314,
                          4333,4354,4373,4392,4413,4429,4438,4450,4453,4457,4457,4457,4453,4452,
                          4444,4438,4430,4425,4418,4408,4401,4393,4384,4375,4369,4363,4357,4351,
                          4345,4339,4333,4327,4321,4315,4309,4303,4297,4291,4280,4275,4268,4262,
                          4255,4250,4244,4239,4233,4228,4221,4216,4213,4207,4201,4195,4189,4183,
                          4177,4171,4163,4155,4140,4131,4122,4115,4106,4098,4090,4079,4070,4065
                          ]
              },
              {
                  name:'正常密度',
                  data:[3839,3855,3870,3885,3897,3919,3936,3955,3971,3993,4012,4026,4045,4064,
                          4083,4104,4123,4142,4163,4179,4188,4200,4203,4207,4207,4207,4203,4202,
                          4194,4188,4180,4175,4168,4158,4151,4143,4134,4125,4119,4113,4107,4101,
                          4095,4089,4083,4077,4071,4065,4059,4053,4047,4041,4030,4025,4018,4012,
                          4005,4000,3994,3989,3983,3978,3971,3966,3963,3957,3951,3945,3939,3933,
                          3927,3921,3913,3905,3890,3881,3872,3865,3856,3848,3840,3829,3820,3815
                          ]
              },
              // {
              //     name:'您的测量值',
              //    // data:[{x:0,y:0}],
              //     marker: {
              //       enabled: true
              //     },
              // },
              {
                  name:'偏低密度',
                  data:[3589,3605,3620,3635,3647,3669,3686,3705,3721,3743,3762,3776,3795,3814,
                          3833,3854,3873,3892,3913,3929,3938,3950,3953,3957,3957,3957,3953,3952,
                          3944,3938,3930,3925,3918,3908,3901,3893,3884,3875,3869,3863,3857,3851,
                          3845,3839,3833,3827,3821,3815,3809,3803,3797,3791,3780,3775,3768,3762,
                          3755,3750,3744,3739,3733,3728,3721,3716,3713,3707,3701,3695,3689,3683,
                          3677,3671,3663,3655,3640,3631,3622,3615,3606,3598,3590,3579,3570,3565
                          ]
              }],
          credits: {
              text: '',
              href: ''
          },
          // 导出
          // exporting: {
          //   enabled: true,
          // }
        },
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
        let url = this.$apiList.getGMDDetailInfo;
        this.$axios.post(url,{
          chid: this.k,
          birthday: this.birthday
        }).then((res) => {
          if (res.status === 0) {
            let data = res.data;
            if (data) {
              let info = {
                name: data.selfname,
                phone: data.tel,
                address: data.address,
                mdate: data.mdate ? this.$moment(data.mdate).format("YYYY-MM-DD") : "", // 测量日期
                deviceCode: data.deviceNo,
                height: data.height,
                weight: data.weight,
                sosValue: data.sos,
                tvalue: data.tvalue,
                zvalue: data.zvalue,
                svalue: data.svalue, // 标准值
                xdnl: data.xdnl, // z值相对年龄
                spvale: data.spvale, // 测量值、峰值
                gzfx: data.gzfx, // 骨折风险
                physicalNo: data.cid,
                doctor: data.doc,
                conclusion: data.docadvice,
                ageString: data.ageString,
                ageMonth: data.ageMonth,

                sex: this.sex,
                sexcode: this.sexcode,
                birthday: this.birthday,
              }
              this.info = info;
              // 更新骨密度信息
              this.getTrendCharts2(info.sosValue, info.zvalue, info.tvalue, info.ageString, info.ageMonth);

              this.$nextTick(() => {
                this.form.setFieldsValue({
                  physicalno: info.physicalNo,
                  conclusion: info.conclusion,
                  doctor: info.doctor
                });
                // 上传图片
                if (this.imgname === '无') {
                  this.uploadSVG();
                }
              })
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
      // 骨密度图
      getTrendCharts2 (sosValue, zValue, tValue, age, months){
        var gmdAge, ageBiger, ZTValue;
        //年龄转化
        if (months < 36) {
          gmdAge = months + "月";
        } else if (months%12 != 0) {
          gmdAge = parseInt(months/12) +"岁" + months%12 +"月";
        } else if (months%12 == 0){
          gmdAge = parseInt(months/12) +"岁";
        }
        //chars里的年龄
        ageBiger = Math.round(months/12).toString(); 
        
        //z值和T值判断
        if (zValue && zValue != "") {
            ZTValue = zValue;
        } else if (tValue && tValue != "") {
            ZTValue = tValue;
        }
        sosValue = parseInt(sosValue);
        ageBiger = parseInt(ageBiger);
        
        //幼儿的
        var option11 = {
            title : {
                text: ''   
            },
            legend :{
              align: 'center',
              verticalAlign: 'top',
            　x: 0, //间隔x轴的间隔
              y: 20 //间隔Y轴的间隔
              },
            xAxis : {
              title: {
                  text: '年龄（月）'
              },
              data : ['1','2','3','4','5','6','7','8','9','10','11','12',
                      '13','14','15','16','17','18','19','20','21','22','23',
                        '24','25','26','27','28','29','30','31','32','33','34','35','36']
            },
            yAxis : {
              title: {
                  text: ''
                },
            plotLines: [{
                    value: 0,
                    width: 1,
                    color: '#808080'
                  }]
            },
            series : [
                {
                    name:'偏高密度',
                    data:[3234,3245,3259,3273,3287,3302,3315,3331,3343,3357,3371,3380,
                          3399,3409,3417,3428,3441,3455,3473,3498,3522,3553,3580,3605,
                          3620,3631,3642,3652,3661,3668,3677,3683,3692,3700,3709,3717]
                },
                {
                    name:'正常密度',
                    data:[2984,2995,3009,3023,3037,3052,3065,3081,3093,3107,3121,3130,
                          3149,3159,3167,3178,3191,3205,3223,3248,3272,3303,3330,3355,
                          3370,3381,3392,3402,3411,3418,3427,3433,3442,3450,3459,3467]
                },
                {
                    name:'您的测量值',
                    data:[{x:months,y:sosValue}],
                    marker: {
                      enabled: true
                    },
                },
                {
                    name:'偏低密度',
                    data:[2734,2745,2759,2773,2787,2802,2815,2831,2843,2857,2871,2880,
                          2899,2909,2917,2928,2941,2955,2973,2998,3022,3053,3080,3105,
                          3120,3131,3142,3152,3161,3168,3177,3183,3192,3200,3209,3217]
                }],
            credits: {
                  text: '',
                  href: ''
              }
          };
      
          //小学生的
          var option12 = {
            title : {
                text: ''   
            },
            legend :{
              align: 'center',
              verticalAlign: 'top',
            　x: 0, //间隔x轴的间隔
              y: 20 //间隔Y轴的间隔
            },
            xAxis : {
              title: {
                  text: '年龄（岁）'
              },
              data : ['3','4','5','6','7','8','9','10','11','12','13','14','15','16']
            },
            yAxis : {
              title: {
                  text: ''
                },
              plotLines: [{
                    value: 0,
                    width: 1,
                    color: '#808080'
                  }]
            },
            series : [
                {
                    name:'偏高密度',
                    data:[3717,3770,3812,3850,3874,3895,3910,3925,3935,3945,3964,3991,4018,4045]
                },
                {
                    name:'正常密度',
                    data:[3467,3520,3562,3600,3624,3645,3660,3675,3685,3695,3714,3741,3768,3795]
                },
                {
                    name:'您的测量值',
                    data:[{x:ageBiger,y:sosValue}],
                    marker: {
                      enabled: true
                    },
                },
                {
                    name:'偏低密度',
                    data:[3217,3270,3312,3350,3374,3395,3410,3425,3435,3445,3464,3491,3518,3545]
                }],
            credits: {
                text: '',
                href: ''
            }
          };
          
          //青年和老年人的
          var option13 = {
            title : {
                text: ''   
            },
            legend :{
              align: 'center',
              verticalAlign: 'top',
              x: 0, //间隔x轴的间隔
              y: 20 //间隔Y轴的间隔
            },
            xAxis : {
              title: {
                  text: '年龄（岁）'
              },
              data : ['17','18','19','20','21','22','23','24','25','26','27','28','29',
                              '30','31','32','33','34','35','36','37','38','39','40','41','42',
                              '43','44','45','46','47','48','49','50','51','52','53','54','55',
                              '56','57','58','59','60','61','62','63','64','65','66','67','68',
                              '69','70','71','72','73','74','75','76','77','78','79','80','81',
                              '82','83','84','85','86','87','88','89','90','91','92','93','94',
                              '95','96','97','98','99','100']
            },
            yAxis : {
              title: {
                  text: ''
                },
              plotLines: [{
                    value: 0,
                    width: 1,
                    color: '#808080'
                  }]
            },
            series : [
                {
                    name:'偏高密度',
                    data:[4089,4105,4120,4135,4147,4169,4186,4205,4221,4243,4262,4276,4295,4314,
                            4333,4354,4373,4392,4413,4429,4438,4450,4453,4457,4457,4457,4453,4452,
                            4444,4438,4430,4425,4418,4408,4401,4393,4384,4375,4369,4363,4357,4351,
                            4345,4339,4333,4327,4321,4315,4309,4303,4297,4291,4280,4275,4268,4262,
                            4255,4250,4244,4239,4233,4228,4221,4216,4213,4207,4201,4195,4189,4183,
                            4177,4171,4163,4155,4140,4131,4122,4115,4106,4098,4090,4079,4070,4065
                            ]
                },
                {
                    name:'正常密度',
                    data:[3839,3855,3870,3885,3897,3919,3936,3955,3971,3993,4012,4026,4045,4064,
                            4083,4104,4123,4142,4163,4179,4188,4200,4203,4207,4207,4207,4203,4202,
                            4194,4188,4180,4175,4168,4158,4151,4143,4134,4125,4119,4113,4107,4101,
                            4095,4089,4083,4077,4071,4065,4059,4053,4047,4041,4030,4025,4018,4012,
                            4005,4000,3994,3989,3983,3978,3971,3966,3963,3957,3951,3945,3939,3933,
                            3927,3921,3913,3905,3890,3881,3872,3865,3856,3848,3840,3829,3820,3815
                            ]
                },
                {
                    name:'您的测量值',
                    data:[{x:ageBiger,y:sosValue}],
                    marker: {
                      enabled: true
                    },
                },
                {
                    name:'偏低密度',
                    data:[3589,3605,3620,3635,3647,3669,3686,3705,3721,3743,3762,3776,3795,3814,
                            3833,3854,3873,3892,3913,3929,3938,3950,3953,3957,3957,3957,3953,3952,
                            3944,3938,3930,3925,3918,3908,3901,3893,3884,3875,3869,3863,3857,3851,
                            3845,3839,3833,3827,3821,3815,3809,3803,3797,3791,3780,3775,3768,3762,
                            3755,3750,3744,3739,3733,3728,3721,3716,3713,3707,3701,3695,3689,3683,
                            3677,3671,3663,3655,3640,3631,3622,3615,3606,3598,3590,3579,3570,3565
                            ]
                }],
            credits: {
                text: '',
                href: ''
            }
          };
          var lang = {
            contextButtonTitle:"图表导出菜单",
            downloadJPEG:"下载JPEG图片",
            downloadPDF:"下载PDF文件",
            downloadPNG:"下载PNG文件",
            downloadSVG:"下载SVG文件",
            loading:"加载中",
            noData:"没有数据",
            printChart:"打印图表",
            resetZoom:"恢复缩放",
            resetZoomTitle:"恢复图表",
          };
          
          var plotOptions = {
            series: {
              // 数据点标记
              marker: {
                enabled: false
              }
            }
          };

          if (months < 36) {
            option11.lang = lang;
            option11.plotOptions = plotOptions;
            this.chartOptions = option11;
          } else if (36 <= months && months < 204) {
            option12.lang = lang;
            option12.plotOptions = plotOptions;
            this.chartOptions = option12;
          } else if (months >= 204) {
            option13.lang = lang;
            option13.plotOptions = plotOptions;
            this.chartOptions = option13;
          }
      },
      // 确认
      handleSubmit() {
        this.form.validateFields((err, values) => {
          if (!err) {
            if (this.info.physicalNo) {
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
          "instrumentType": "A", // 源码里面中卫双佳都传的C
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
              this.$message.error("该健管中心不存在此体检号下的骨密度仪服务！");
            }
          } else {
            this.$message.error("提交失败");
          }
        }).catch((err) => {
          console.log(err);
        });
      },
      handleConfirm(values) {
        let url = this.$apiList.saveHinsGmdExamination;
        this.$axios.post(url,{
          "inputPhysicalNo": values.inputPhysicalNo,
          "conclusion": values.conclusion,
          "doctor": values.doctor,
          "id": this.k,
          "instrumentType": "A",
          "physicalNo": values.physicalno,
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
      uploadSVG(values) {
        let url = this.$apiList.setGmdChart;
        let gmdsvg = this.$refs.gmdInstance.chart.getSVG();
        this.$axios.post(url,{
          "chartData": gmdsvg,
          "chid": this.k,
        }).then((res) => {
          if (res.status !== 0) {
            this.$message.error("骨密度图保存失败");
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
      width: 6.25%;
      height: 53px;
      padding: 6px;
    }
  }
  table.small td {
    height: 38px!important;
  }
}
</style>