<template>
  <a-modal
    centered
    :width="900"
    destroyOnClose
    :visible="true"
    title="检测/服务结算信息"
    @cancel="handleCancel">
      <template slot="footer">
        <a-button 
          v-if="btnHide"
          key="save" type="primary" @click="handleSave">保存总检结果</a-button>
        <a-button 
          v-if="btnHide"
          key="confirm" type="primary" @click="handleConfirm">确认检查结束</a-button>
        <a-button key="print" type="primary" @click="handlePrint">打印报告单</a-button>
      </template>
    <div class="modal-wrap">
      <strong class="first-strong">服务信息一览</strong>
      <a-table
        :pagination="false"
        :customRow="rowclick"
        :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
        :columns="columns"
        :dataSource="listData">
        <template
          slot="preferentialprice"
          slot-scope="text, record, index">
          <div key="preferentialprice">
            <a-input
              v-if="record.editable"
              style="margin: -5px 0"
              :value="text"
              @change="e => handleChange(e.target.value, record.key, 'preferentialprice')"/>
            <template v-else>{{text}}</template>
          </div>
        </template>
        <template
          slot="paytype"
          slot-scope="text, record, index">
          <div key="paytype">
            <a-select 
            :dropdownMatchSelectWidth="false"
              v-if="record.editable"
              style="margin: -5px 0"
              :value="text"
              @change="val => handleChange(val, record.key, 'paytype')">
              <a-select-option 
                v-for="(value, key) in paytypeMap"
                :key="key"
                :value="key">{{value}}</a-select-option>
            </a-select>
            <template v-else >{{paytypeMap[text]}}</template>
          </div>
        </template>
        <template
          slot="issuccessed"
          slot-scope="text, record, index">
          <div key="issuccessed">
            <a-select 
              v-if="record.editable"
              style="margin: -5px 0"
              :value="text"
              @change="val => handleChange(val, record.key, 'issuccessed')">
              <a-select-option 
                v-for="(value, key) in issuccessedMap"
                :key="key"
                :value="key">{{value}}</a-select-option>
            </a-select>
            <template v-else>{{issuccessedMap[text]}}</template>
          </div>
        </template>
        <template slot="operation" slot-scope="text, record, index">
          <div>
            <span v-if="record.editable">
              <a @click="() => save(record.key)">保存</a>
              <a-popconfirm title="确定要取消?" @confirm="() => cancel(record.key)">
                <a>取消</a>
              </a-popconfirm>
            </span>
            <span v-else>
              <!-- <a :disabled="editingKey !== ''" @click="() => edit(record.key)">编辑</a> -->
              <a @click="() => edit(record.key)">编辑</a>
            </span>
          </div>
        </template>
      </a-table>

      <strong>医师建议</strong>
      <a-form :form="form">
        <a-row :gutter="16">
          <a-col :span="24">
            <a-form-item 
            :label-col="formItemLayout.labelCol"
            :wrapper-col="formItemLayout.wrapperCol"
            label="姓名">
              <a-input disabled v-decorator="['name']" allowClear></a-input>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :span="24">
            <a-form-item 
            :label-col="formItemLayout.labelCol"
            :wrapper-col="formItemLayout.wrapperCol"
            label="体检号">
              <a-input disabled v-decorator="['physicalno']" allowClear></a-input>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :span="24">
            <a-form-item  
            :label-col="formItemLayout.labelCol"
            :wrapper-col="formItemLayout.wrapperCol"
            label="医师建议">
              <a-select 
              labelInValue
              @change=docOrdersChange
              v-decorator="['conclusionSel']" allowClear>
                <a-select-option 
                  v-for="(value, key) in docordersMap"
                  :key="value">{{value}}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :span="3"></a-col>
          <a-col :span="12">
            <a-form-item  
            label="">
              <a-textarea v-decorator="['docorders']" :rows="3" />
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </div>
    <div style="display:none;">
      <highcharts ref="gmdInstance" :options="chartOptions"></highcharts>
    </div>
    <div style="display:none;">
      <highcharts 
        ref="lineInstance" 
        :options="lineOptions"></highcharts>
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
    props: ['k', 'no', 'uname', 'status', 'bir'],
    components: {
      highcharts: Chart
    },
    data() {
      return {
        // 查询条件
        formItemLayout: {
          labelCol: { span: 3 },
          wrapperCol: { span: 8 },
        },
        form: this.$form.createForm(this),
        // 表格
        columns: [
          {
            title: "序号",
            customRender: (value, row, index) => `${index+1}`,
          },
          {
              title: '服务项目',
              dataIndex: 'servitemname',
              customRender: (text, row, index) => {
                return <span title={text}>{text}</span>;
              }
          },
          {
              title: '项目明细',
              dataIndex: 'servitemsubname',
              customRender: (text, row, index) => {
                return <span title={text}>{text}</span>;
              }
          },
          {
              title: '市场指导价',
              dataIndex: 'guidanceprice',
              customRender: (text, row, index) => {
                return <span title={text}>{text}</span>;
              }
          },
          {
              title: '实际收费',
              dataIndex: 'preferentialprice',
              scopedSlots: { customRender: 'preferentialprice' },
          },
          {
              title: '医师结论',
              dataIndex: 'conclusion',
              customRender: (text, row, index) => {
                return <span title={text}>{text}</span>;
              }
          },
          {
              title: '收费方式',
              dataIndex: 'paytype',
              width: 160,
              scopedSlots: { customRender: 'paytype' },
          },
          {
              title: '实施是否成功',
              dataIndex: 'issuccessed',
              scopedSlots: { customRender: 'issuccessed' },
          },
          {
            title: '操作',
            dataIndex: 'operation',
            scopedSlots: { customRender: 'operation' },
          },
        ],
        listData: [],
        cacheData: [],
        editingKey: '',
        selectedRowKeys: [],
        selectedRows: [],
        // 打印需要信息
        customerNo:'',
        physicalNo: '',
        mecNo: '',
        birthday: '',
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
        },
        lineOptions: {}
      }
    },
    created() {
      this.fetchDropDown('HINS_PAY_TYPE');
      this.fetchDropDown('FHC_YESNO');
      this.fetchDropDown('HINS_DOC_ORDERS');
      this.fetchServDetail();
      this.fetchPhyDetail();
    },
    computed: {
      paytypeMap () {
        return this.$store.getters['hins/cPayType'];
      },
      issuccessedMap () {
        return this.$store.getters['hins/cYesNo'];
      },
      docordersMap () {
        return this.$store.getters['hins/cDocOrders'];
      },
      btnHide() {
        return (this.status == '3' || this.status == '4' || this.status == '5');
      }
    },
    methods: {
      fetchDropDown(codename) {
        this.$store.dispatch('hins/fetchSelectCode', {
          codename,
        });
      },
      // 表格编辑
      rowclick(rowData, index) {
        return {
          on: {
            click: () => {
              // this.edit(rowData.key);
            }
          }
        }
      },
      handleChange(value, key, column) {
        const newData = [...this.listData];
        const target = newData.filter(item => key === item.key)[0];
        if (target) {
          target[column] = value;
          this.listData = newData;
        }
      },
      edit(key) {
        const newData = [...this.listData];
        const target = newData.filter(item => key === item.key)[0];
        this.editingKey = key;
        if (target) {
          this.$set(target, 'editable', true)
          this.listData = newData;
        }
      },
      save(key) {
        const newData = [...this.listData];
        const newCacheData = [...this.cacheData];
        const target = newData.filter(item => key === item.key)[0];
        const targetCache = newCacheData.filter(item => key === item.key)[0];
        console.log(target, targetCache);
        if (target && targetCache) {
          this.$set(target, 'editable', false)
          Object.assign(
            targetCache,
            target
          );
          this.cacheData = newCacheData;
        }
      },
      cancel(key) {
        const newData = [...this.listData];
        const target = newData.filter(item => key === item.key)[0];
        this.editingKey = '';
        if (target) {
          Object.assign(target, this.cacheData.filter(item => key === item.key)[0]);
          delete target.editable;
          this.listData = newData;
        }
      },
      // 备份原数据
      copyData() {
        this.cacheData = this.listData.map(item => ({ ...item }));
      },
      // 服务信息一览查询
      fetchServDetail() {
        let url = this.$apiList.getServiceInfoByPhysicalNo;
          this.$axios.post(url, {
            physicalNo: this.no,
          }).then((res) => {
            if (res.status === 0) {
              let data = res.data;
              let listData = [];

              data.forEach((item, index) => {
                listData.push({
                  key: index,
                  id: item.id,
                  servitemno: item.servItemNo,
                  servitemname: item.servItemName,
                  servitemsubno: item.servItemSubNo,
                  servitemsubname: item.servItemSubName,
                  guidanceprice: item.guidancePrice,
                  preferentialprice: item.preferentialPrice,
                  conclusion: item.conclusion,
                  paytype: item.payType,
                  issuccessed: item.issuccessed,
                  // 仪器类型
                  instrumentType: item.instrumentType,
                  servStatus: item.servStatus,
                  instrumentFlag: item.instrumentFlag,
                });
              });
              this.listData = listData;
              this.copyData();
            } else {
              this.$message.error("数据获取失败");
            }
          })
          .catch((err) => {
            console.log(err);
          });
      },
      // 体检信息
      fetchPhyDetail() {
        let url = this.$apiList.getHsConclusionById;
          this.$axios.post(url, {
            id: this.k,
          }).then((res) => {
            if (res.status === 0) {
              let data = res.data;
              this.customerNo = data.customerNo;
              this.physicalNo = data.physicalNo;
              this.mecNo = data.mecNo;

              this.$nextTick(() => {
                this.form.setFieldsValue({
                  name: this.uname,
                  physicalno: data.physicalNo,
                  docorders: data.docOrders,
                });
              });
            } else {
              this.$message.error("数据获取失败");
            }
          })
          .catch((err) => {
            console.log(err);
          });
      },
      // 建议改变
      docOrdersChange(value) {
        if (value == undefined) {
          return;
        }
        this.form.setFieldsValue({
          docorders: value && value.label,
        });
      },
      onSelectChange(selectedRowKeys, selectedRows) {
        this.selectedRowKeys = selectedRowKeys;
        this.selectedRows = selectedRows;
      },
      // 保存总检结果
      handleSave() {
        let url = this.$apiList.saveCheckResult;
        let hinsHsItems = [];
        console.log(this.listData);
        this.listData.forEach(ele => {
          hinsHsItems.push({
              "payType": ele.paytype,
              "preferentialPrice": ele.preferentialprice,
              "issuccessed": ele.issuccessed,
              "id":ele.id
            });
        });
        var payload = {
          hinsHsConclusionVo:{
            docOrders: this.form.getFieldValue("docorders"),
            physicalNo: this.form.getFieldValue("physicalno")
          },
          hinsHsItems,
        };
        this.$axios.post(url, payload).then((res) => {
          if (res.status === 0) {
            this.$message.success("保存成功");
            this.handleCancel();
          } else {
            this.$message.error("保存失败");
          }
        })
        .catch((err) => {
          console.log(err);
        });
      },
      // 确认检查结束
      handleConfirm() {
        var _this = this;
        var confirmFlag = false;
        var remoteConfirmFlag = false;
        var issuccessedFlag = true;
        this.listData.forEach(ele => {
          if(ele.servStatus == '3' && ele.instrumentFlag == '1'){
            confirmFlag = true;
          }
          
          if(ele.issuccessed == '2' && ele.servitemno == 'FW_JYFW00019'){
            //远程健康咨询服务选择失败
            remoteConfirmFlag = true;
          }
          
          if(ele.issuccessed == '2' && ele.servitemno != 'FW_JYFW00019'){
            //远程健康咨询以外的服务选择失败
            issuccessedFlag = false;
          }
        });
        
        if(!issuccessedFlag){
          this.$message.error('目前只有【远程健康咨询】服务支持选择服务实施不成功!');
        }
        
        if(remoteConfirmFlag){
          this.$confirm({
            content: '服务实施不成功，提交后系统将自动撤销该服务及恢复客户服务权限，并且不计算管家绩效，是否确认提交？',
            onOk() {
              _this.confirmFinish();
            },
          });
        }else if(confirmFlag){
          this.$confirm({
            content: '存在未服务的项目，是否确认结算？',
            onOk() {
              _this.confirmFinish();
            },
          });
        } else {
          this.confirmFinish();
        }
      },
      confirmFinish() {
        let hinsHsItems = [];
        this.listData.forEach(ele => {
          hinsHsItems.push({
              "instrumentType": ele.instrumentType,
              "payType": ele.paytype,
              "preferentialPrice": ele.preferentialprice,
              "id":ele.id
            });
        });
        var payload = {
          hinsHsConclusionVo:{
            docOrders: this.form.getFieldValue("docorders"),
            physicalNo: this.form.getFieldValue("physicalno")
          },
          hinsHsItems,
        };
        
        let url = this.$apiList.confirmCheckFinish;
        this.$axios.post(url, payload).then((res) => {
          if (res.status === 0) {
            this.$message.success("确认成功");
          } else {
            this.$message.error("确认失败");
          }
        })
        .catch((err) => {
          console.log(err);
        });
      },
      // 打印报告单
      handlePrint() {
        if (this.selectedRowKeys.length === 0) {
          this.$info({
            title: "提示",
            content: "请选择打印记录!"
          })
          return;
        }
        let printItem = [];
        this.selectedRows.forEach(ele => {
          printItem.push(ele.instrumentType);
        });

        if (printItem.indexOf("A") !== -1) { // 获取信息，上传图片然后打印文件
          let url = this.$apiList.getGMDInfo;
          this.$axios.post(url, {
            "physicalNo": this.physicalNo,
          }).then((res) => {
            if (res.status === 0) {
              // 根据返回信息生成图片
              let {sosValue, zvalue, tvalue, ageString, ageMonth} = res.data;
              this.getTrendCharts2(sosValue, zvalue, tvalue, ageString, ageMonth);
              this.getLineCharts2(zvalue, tvalue);
              this.$nextTick(() => {
                let gmdsvg = this.$refs.gmdInstance.chart.getSVG();
                let linesvg = this.$refs.lineInstance.chart.getSVG();
                this.saveGMDImg(printItem, gmdsvg, linesvg)
              });
            }
          }).catch((err) => {
            console.log(err);
          });
        } else { // 直接打印
          this.startPrint(printItem);
        }
      },
      // 
      saveGMDImg(printItem, gmdsvg, linesvg) {
        let url = this.$apiList.saveGMDImg;
        this.$axios.post(url, {
          "physicalNo": this.physicalNo,
          "chartData": gmdsvg,
          "chartDataLine": linesvg,
        }).then((res) => {
            this.startPrint(printItem);
        }).catch((err) => {
          console.log(err);
        });
      },
      startPrint(printItem) {
        let url = this.$apiList.printPhysicalReportInfo;
        this.$axios.post(url, {
          "birthday": this.bir,
          "physicalNo": this.physicalNo,
          "mecNo": this.mecNo,
          "customerNo": this.customerNo,
          "printItem": printItem,
        }).then((res) => {
          if (res.status === undefined) {
            // base64内容，文件名
            this.$downloadFileByBase64(res, `${this.uname}-报告单`);
          } else {
            this.$message.error('文件下载失败,请重试');
          }
        }).catch((err) => {
          console.log(err);
        });
      },
      handleCancel() {
        this.$router.push("/servicesettlement");
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
      getLineCharts2(zValue, tValue){
        var ZTValue;
        
        //z值和T值判断
          if (zValue && zValue != "") {
              ZTValue = zValue;
          } else if (tValue && tValue != "") {
              ZTValue = tValue;
          }
          var option = {
            chart: {
              height: 56,
              width: 320,
            },
            title : {
                text: ''   
            },
            legend :{
                  enabled: false,
                  align: 'center',
                  verticalAlign: 'top',
                  　x: 0, //间隔x轴的间隔
                    y: 20 //间隔Y轴的间隔
              },
            xAxis : {
              tickInterval:1,
                min:-3,
                max:3
            },
            yAxis : {
              min: 0, 
              minPadding: 0, 
              startOnTick: true,
              gridLineWidth: 0,
              title: {
                  text: ''
                },
              labels: {
                      enabled: false
                  }  
            },
            plotOptions: {
              series: {
                // 数据点标记
                marker: {
                  enabled: true
                }
              }
            },
            series : [{
                      name:'',
                      data:[{x:ZTValue,y:0}],
                      marker: {
                        enabled: true
                      },
                  }],
            credits: {
                  text: '',
                  href: ''
              },
            exporting: {
              enabled: false
            }
          };
        
          this.lineOptions = option;
      }
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
strong {
  display: inline-block;
  padding: 16px 0;
  font-size: 16px;
  color: rgba(0, 0, 0, 0.85);
}
.first-strong {
  padding-top: 0;
}

.ant-table-wrapper /deep/ thead.ant-table-thead tr th,
.ant-table-wrapper /deep/ tbody.ant-table-tbody tr td {
  padding-left: 6px;
  padding-right: 6px;
}
.ant-table-wrapper /deep/ .ant-table{
  table-layout: fixed;
}
// .ant-table-wrapper /deep/ .ant-table-tbody > tr > td:not(:last-child) {
.ant-table-wrapper /deep/ .ant-table-tbody > tr > td:not(:first-child) {
  max-width: 80px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
// 表单
.ant-form /deep/ .ant-form-item-label{
    text-align: left;
  }
</style>