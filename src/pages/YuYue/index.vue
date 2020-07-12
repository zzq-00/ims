<template>
  <div style="padding: 20px; background-color: #fff">
    <a-card title="查询条件" :bordered="false" style="width: 100%">
      <a-form :form="form">
        <a-row :gutter="16">
          <a-col :span="6">
            <a-form-item
              :label-col="formItemLayout.labelCol"
              :wrapper-col="formItemLayout.wrapperCol"
              label="姓名">
              <a-input v-decorator="['name']" allowClear></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item
              :label-col="formItemLayout.labelCol"
              :wrapper-col="formItemLayout.wrapperCol"
              label="联系方式">
              <a-input v-decorator="['phone']" allowClear />
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item
              :label-col="formItemLayout.labelCol"
              :wrapper-col="formItemLayout.wrapperCol"
              label="证件号">
              <a-input v-decorator="['id']" allowClear />
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item
              :label-col="formItemLayout.labelCol"
              :wrapper-col="formItemLayout.wrapperCol"
              label="性别">
              <a-select v-decorator="['gender']" allowClear>
                <a-select-option
                  v-for="(value,key) in genderMap"
                  :key="key"
                  :value="key">{{value}}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :span="6">
            <a-form-item
              :label-col="formItemLayout.labelCol"
              :wrapper-col="formItemLayout.wrapperCol"
              label="预约日">
              <a-date-picker placeholder="选择日期" v-decorator="['yStart']" />
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item
              :label-col="formItemLayout.labelCol"
              :wrapper-col="formItemLayout.wrapperCol"
              label="至">
              <a-date-picker placeholder="选择日期" v-decorator="['yEnd']" />
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item
              :label-col="formItemLayout.labelCol"
              :wrapper-col="formItemLayout.wrapperCol"
              label="预约受理日">
              <a-date-picker placeholder="选择日期" v-decorator="['sStart']" />
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item
              :label-col="formItemLayout.labelCol"
              :wrapper-col="formItemLayout.wrapperCol"
              label="至">
              <a-date-picker placeholder="选择日期"  v-decorator="['sEnd']" />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :span="24">
            <a-form-item>
              <div style="text-align: right;">
                <a-button type="primary" @click="queryData">查询</a-button>
                <a-button @click="reset">重置</a-button>
              </div>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </a-card>
    <a-card title="预约查询列表" :bordered="false" style="width: 100%">
      <custom-info
        @close="confirmSuccess"
        :Info="confirmInfo"
        v-if="confirmModal"></custom-info>
      <a-table
        :loading="loading"
        :pagination="false"
        :customRow="rowclick"
        :columns="columns"
        :dataSource="listData">
        <template slot="operation" slot-scope="text,record">
          <a @click="() => fetchUserData(record)">确认客户信息</a>
        </template>
      </a-table>
      <div class="tab-pagination">
        <a-pagination
          v-model="page"
          showQuickJumper
          showSizeChanger
          :pageSizeOptions="['10', '20', '50']"
          :showTotal="(total) => `共${total} 条数据`"
          @change="onPageChange"
          @showSizeChange="onShowSizeChange"
          :total="total" />
      </div>
      <!-- 预约确认 -->
      <a-modal
        :afterClose="()=>{selectedRowKeys=[]}"
        v-model="yuyueConfirm"
        destroyOnClose
        style="top: 20px;"
        :width="900"
        title="预约确认">
        <div class="yyqr-info">
          <strong style="color: #254161;font-weight: bold;">客户信息</strong>
          <a-row :gutter="16">
            <a-col :span="8">
              <a-row type="flex" justify="space-around" align="middle">
                <a-col :span="8">
                  <div style="text-align:right;padding: 10px;">姓名:</div>
                </a-col>
                <a-col :span="16"><a-input v-model="yyCusInfo.name" disabled/></a-col>
              </a-row>
            </a-col>
            <a-col :span="8">
              <a-row type="flex" justify="space-around" align="middle">
                <a-col :span="8">
                  <div style="text-align:right;padding: 10px;">性别:</div>
                </a-col>
                <a-col :span="16"><a-input v-model="yyCusInfo.gender" disabled/></a-col>
              </a-row>
            </a-col>
            <a-col :span="8">
              <a-row type="flex" justify="space-around" align="middle">
                <a-col :span="8">
                  <div style="text-align:right;padding: 10px;">出生日期:</div>
                </a-col>
                <a-col :span="16"><a-input v-model="yyCusInfo.birthday" disabled/></a-col>
              </a-row>
            </a-col>
          </a-row>
          <a-row :gutter="16">
            <a-col :span="8">
              <a-row type="flex" justify="space-around" align="middle">
                <a-col :span="8">
                  <div style="text-align:right;padding: 10px;">证件类型:</div>
                </a-col>
                <a-col :span="16"><a-input v-model="yyCusInfo.cardtype" disabled/></a-col>
              </a-row>
            </a-col>
            <a-col :span="8">
              <a-row type="flex" justify="space-around" align="middle">
                <a-col :span="8">
                  <div style="text-align:right;padding: 10px;">证件号码:</div>
                </a-col>
                <a-col :span="16"><a-input v-model="yyCusInfo.idno" disabled/></a-col>
              </a-row>
            </a-col>
          </a-row>
        </div>
        <div style="margin-top: 14px;">
          <strong style="color: #254161;font-weight: bold;">服务项目列表</strong>
          <div style="height:6px;"></div>
          <!-- 预约确认列表 -->
          <a-table
            :pagination="false"
            :customRow="itemClick"
            :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
            :columns="yycolumns"
            :dataSource="yydata">
            <template
              slot="yhPrice"
              slot-scope="text, record, index">
              <div :key="record.key">
                <a-input
                  auto-focus
                  v-if="record.editable"
                  style="margin: -5px 0"
                  :value="text"
                  @blur="e => hiddenInput(e.target.value, record.key)"
                  @change="e => handleChange(e.target.value, record.key)"
                />
                <template v-else>
                  <div style="min-height:1em;" @click="edit(record.key)">{{text}}</div>
                </template>
              </div>
            </template>
          </a-table>
        </div>
        <div slot="footer">
          <a-button key="confirm" type="primary" @click="yyConfirm">预约确认</a-button>
          <a-button key="print" type="primary" @click="yyPrint">打印</a-button>
        </div>
      </a-modal>
      <!-- 预约时间选择 -->
      <a-modal
        :width="880"
        destroyOnClose
        style="top: 50px;"
        title="预约时间选择"
        :footer="null"
        v-model="timeSelect">
        <a-table
          style="word-break:break-all;"
          :pagination="tspagination"
          :scroll="{y: 240 }"
          :columns="tscolumns"
          :dataSource="tsdata">
          <template slot="tsselect" slot-scope="text,record">
            <a @click="() => tsModalPop(record)">选择</a>
          </template>
        </a-table>
      </a-modal>
    </a-card>
  </div>
</template>

<script>
  import moment from "moment";
  import CustomInfo from './YCustomInfo';
  export default {
    components: {
      CustomInfo
    },
    data() {
      return {
        // 查询条件
        formItemLayout: {
          labelCol: { span: 9 },
          wrapperCol: { span: 15 },
        },
        /*
          state // 0-待取消，1-已取消，2-已预约,3-已登记，4-已实施，5-已结算，6-已推送
        */
        form: this.$form.createForm(this),
        // 查询列表数据
        loading: false,
        columns: [
          {
            align: "left",
            title: "序号",
            customRender: (value, row, index) => `${(this.page-1)*this.pageSize+index+1}`
          },
          {
            align: "left",
            title: '客户姓名',
            dataIndex: 'name',
            customRender: (text, row, index) => {
              return <span title={text}>{text}</span>;
            }
          },
          {
            align: "left",
            title: '性别',
            dataIndex: 'gender',
            customRender: (text, row, index) => {
              return <span title={text}>{text}</span>;
            }
          },
          {
            align: "left",
            title: '出生日期',
            dataIndex: 'birthday',
            customRender: (text, row, index) => {
              return <span title={text}>{text}</span>;
            }
          },
          {
            align: "left",
            title: '联系方式',
            dataIndex: 'phone',
            customRender: (text, row, index) => {
              return <span title={text}>{text}</span>;
            }
          },
          {
            align: "left",
            title: '证件类型',
            dataIndex: 'cardType',
            customRender: (text, row, index) => {
              return <span title={text}>{text}</span>;
            }
          },
          {
            align: "left",
            title: '证件号码',
            dataIndex: 'cardNum',
            customRender: (text, row, index) => {
              return <span title={text}>{text}</span>;
            }
          },
          {
            align: "left",
            title: "操作",
            width: 140,
            scopedSlots: { customRender: "operation" }
          }
        ],
        listData: [],
        pagination: {
          defaultPageSize: 10,
          showTotal: (total) => `共${total} 条数据`,
          total: 0,
          size: "default",
          showQuickJumper: true,
          showSizeChanger: true,
          pageSizeOptions: ['10', '20', '50'],
          onShowSizeChange: (current, pageSize) => {
            this.pageSize = pageSize;
            this.page = current;
            // 重新获取列表数据
            this.submit();
          },
          onChange: (page, pageSize) => {
            this.pageSize = pageSize;
            this.page = page;
            this.submit();
          }
        },

        // 确认客户信息
        confirmModal: false,
        confirmInfo: {
          name: '',
          gender: '',
          birthday: '',
          idtype: '',
          idno: ''
        },
        // 预约确认
        yuyueConfirm: false,
        yyCusInfo: {
          name: '',
          sex: '', // code
          gender: '', // name
          birthday: '',
          idtype: '', // code
          cardtype: '', // name
          idno: ''
        },
        selectedRowKeys: [], // 多选选中行
        selectedRows: [],
        yycolumns: [
          {
            align: "left",
            title: '体检号',
            dataIndex: 'tjNo',
            customRender: (text, row, index) => {
              return <span title={text}>{text}</span>;
            }
            // width: 160,
            // fixed: 'left'
          },
          {
            align: "left",
            title: '体检项目',
            dataIndex: 'tjItem',
            customRender: (text, row, index) => {
              return <span title={text}>{text}</span>;
            }
          },
          {
            align: "left",
            title: '项目明细',
            dataIndex: 'xmDetail',
            customRender: (text, row, index) => {
              return <span title={text}>{text}</span>;
            }
          },
          {
            align: "left",
            title: '预约时间',
            dataIndex: 'yyDate',
            customRender: (text, row, index) => {
              return <span title={text}>{text}</span>;
            }
          },
          {
            align: "left",
            title: '服务状态',
            dataIndex: 'ffState',
            customRender: (text, row, index) => {
              return <span title={text}>{text}</span>;
            }
          },
          {
            align: "left",
            title: '市场指导价',
            dataIndex: 'scPrice',
            customRender: (text, row, index) => {
              return <span title={text}>{text}</span>;
            }
          },
          {
            align: "left",
            title: '总部指导价',
            dataIndex: 'zbPrice',
            customRender: (text, row, index) => {
              return <span title={text}>{text}</span>;
            }
          },
          {
            align: "left",
            title: '优惠后价格',
            dataIndex: 'yhPrice',
            scopedSlots: { customRender: 'yhPrice' },
          },
          {
            align: "left",
            title: '预约受理日期',
            dataIndex: 'slDate',
            customRender: (text, row, index) => {
              return <span title={text}>{text}</span>;
            }
          }
        ],
        yydata: [],
        customerNo: "",
        // 分页
        pageSize: 10,
        page: 1,
        total: 0,
        // 预约时间选择
        timeSelect: false,
        tscolumns: [
          {
            title: '服务项目名称',
            dataIndex: 'item',
          },
          {
            title: '预约时间段',
            dataIndex: 'time',
            width: 320
          },
          {
            title: '剩余数量',
            dataIndex: 'last',
            width: 100
          },
          {
            title: '总数',
            dataIndex: 'total',
            width: 80
          },
          {
            title: "操作",
            scopedSlots: { customRender: "tsselect" },
            width: 80
          }
        ],
        tsdata: [],
        tspagination: {
          defaultPageSize: 10,
          showTotal: (total) => `共${total} 条数据`,
          total: 0,
          size: "default",
          showQuickJumper: true,
          showSizeChanger: true,
          pageSizeOptions: ['10', '20', '50'],
          onShowSizeChange: (current, pageSize) => {
            this.tspageSize = pageSize;
            this.tspage = current;
            // 重新获取列表数据
            this.tsModalList(this.tsrecord);
          },
          onChange: (page, pageSize) => {
            this.tspageSize = pageSize;
            this.tspage = page;
            this.tsModalList(this.tsrecord);
          }
        },
        tsrecord: {},
        tspage: 1,
        tspageSize: 10
      }
    },
    created() {
      //获取token放入请求头，固定写法
      // this.$axios.defaults.headers.common['Authorization'] = this.$route.query.token;
      //取出权限串，用于判断页面功能按钮权限，数据格式为:系统缩写_页面vue文件名_功能名
      //功能名规范：新增=add；编辑=edit；删除=del；导入=imp；导出=exp；
      //权限串值为：'uias_Module_add,uias_Module_edit,uias_Module_del'

      // this.power = this.$route.query.power;

      this.fetchDropDown('VIP_SEX');
      this.fetchDropDown('VIP_IDCARDTYPE'); // 证件类型
      this.submit();
    },
    computed: {
      genderMap () {
        return this.$store.getters['hins/cGender'];
      },
    },
    watch: {
      yuyueConfirm(newval) {
        if (!newval) {
          this.selectedRowKeys = [];
          this.selectedRows = [];
        }
      }
    },
    methods: {
      fetchDropDown(codename) {
        this.$store.dispatch('hins/fetchSelectCode', {
          codename,
        });
      },
      onShowSizeChange (current, pageSize) {
        this.pageSize = pageSize;
        this.page = current;
        // 重新获取列表数据
        this.submit();
      },
      onPageChange (page, pageSize) {
        this.pageSize = pageSize;
        this.page = page;
        this.submit();
      },
      queryData() {
        this.page = 1;
        this.submit();
      },
      // 条件查询接口
      submit() {
        this.loading = true
        this.form.validateFields((err, values) => {
          if (!err) {
            // 获取数据逻辑
            let url = this.$apiList.getAppointCustInfo;
            let {name, phone, id, gender, yStart, yEnd, sStart, sEnd} = values;
            this.$axios.post(url, {
              limit: this.pageSize,
              page: this.page,
              name: name,
              phone: phone,
              idNo: id,
              sex: gender,
              startappointdate: yStart && yStart.format("YYYY-MM-DD"), // 预约日
              endappointdate: yEnd && yEnd.format("YYYY-MM-DD"),
              startcreatedate: sStart && sStart.format("YYYY-MM-DD"), // 受理日
              endcreatedate: sEnd && sEnd.format("YYYY-MM-DD"),
            }).then(res => {
              this.loading = false
              if (res.status === 0) {
                let {pageNo, perPage, totalCount, data} = res.data;
                let listData = [];

                this.total = totalCount;
                data.forEach((item, index)=> {
                  listData.push({
                    key: index,
                    id: item.id,
                    name: item.name,
                    sex: item.sex,
                    gender: item.sexName,
                    birthday: this.$moment(item.birthday).format("YYYY-MM-DD"),
                    phone: item.appointPhone,
                    idType: item.idType,
                    cardType: item.idtypeName,
                    cardNum: item.idNo,
                    customerNo: item.customerNo
                  });
                });

                this.listData = listData;
              } else {
                this.$message.error("数据获取失败");
              }
            }).catch(error => {
              console.log(error, "error");
            });
          }
        });
      },
      reset() {
        this.form.resetFields();
      },
      // 确认客户信息
      confirmSuccess(flag) {
        this.confirmModal = false;
        if (flag) {
          this.submit();
        }
      },
      // 核实客户信息
      fetchUserData(record) {
        let url = this.$apiList.checkAppointCustInfo;
        let info = {
          name: record.name,
          idNo: record.cardNum,
          idType: record.idType,
          sex: record.sex,
          birthday: record.birthday
        };

        this.$axios.post(url, info).then(res => {
          if (res.status === 0) {
            let data = res.data;
            if (!data) {
              this.$info({
                title: "提示",
                content: "该客户无预约记录！"
              })
              return;
            }
            // 获取id
            this.confirmInfo = { ...data };
            this.confirmModal = true;
          } else {
            this.$message.error('信息获取失败');
          }
        }).catch(error => {
          console.log(error, "error");
        });

      },
      rowclick(rowData, index) {
        return {
          on: {
            dblclick: () => {
              this.dbclickRow(rowData, index);
            }
          }
        }
      },
      dbclickRow (rowData, index) {
        let rd = rowData;
        this.yuyueConfirm = true;
        this.yyCusInfo = {
          name: rd.name,
          sex: rd.sex, // code
          gender: rd.gender, // name
          birthday: rd.birthday,
          idtype: rd.idType, // code
          cardtype: rd.cardType, // name
          idno: rd.cardNum
        }
        // 获取预约确认和打印列表数据
        this.getAppointByService(rd);
      },
      // 预约项目列表
      edit(key) { // 表格编辑
        const newData = [...this.yydata];
        const target = newData.filter(item => key === item.key)[0];
        if (target) {
          target.editable = true;
          this.yydata = newData;
        }
      },
      handleChange(value, key) { // 表格编辑
        const newData = [...this.yydata];
        const target = newData.filter(item => key === item.key)[0];
        if (target) {
          target['yhPrice'] =value;
          this.yydata = newData;
        }
      },
      hiddenInput(value, key) {
        const newData = [...this.yydata];
        const target = newData.filter(item => key === item.key)[0];
        if (target) {
          delete target.editable;
          this.yydata = newData;
        }
      },
      // 预约项目列表查询
      getAppointByService (rd) {
        this.yydata = []; // 清空旧数据

        let url = this.$apiList.getAppointByService;
        this.$axios.post(url, {
          // "birthday": "1990-04-02",
          "birthday": rd.birthday,
          "idNo": rd.cardNum,
          "idType": rd.idType,
          "name": rd.name,
          "sex": rd.sex
        }).then(res => {
          if (res.status === 0) {
            let yydata = [];
            let { data } = res;

            data.forEach((item, index) => {
              yydata.push({
                key: index,
                id: item.id, // 编号
                tjNo: item.physicalNo, // 体检号
                tjItem: item.servItemName, // 服务项目名称
                xmDetail: item.servItemSubName, // 项目明细名称
                yyDate: item.appointTime, // 预约时间
                ffStateRaw: item.servStatus, // 服务状态
                ffState: item.servStatusName, // 服务状态
                scPrice: item.price?parseInt(item.price).toFixed(2):'',
                zbPrice:  item.guidancePrice?parseInt(item.guidancePrice).toFixed(2):'', // 总部指导价
                yhPrice: item.preferentialPrice, // 优惠后金额
                slDate: item.createDate?this.$moment(item.createDate).format("YYYY-MM-DD"):'', // 预约受理时间
                mecNo: item.mecNo, // 体检分部编码
                mecName: item.mecName,
                servItemNo: item.servItemNo, // 服务项目编码

                appFlag: item.appFlag, // 预约标记
                appointDate: item.appointDate, // 预约日期
                appointNo: item.appointNo, // 预约编号
                appointPhone: item.appointPhone, // 预约电话
                birthday: item.birthday, // 出生日期
                cardNo: item.cardNo, // 卡号
                createBy: item.createBy, // 创建者
                customerNo: item.customerNo, // 客户编码
                dalflag: item.dalflag, // 删除标记
                guardianIdNo: item.guardianIdNo, // 监护人证件号码
                guardianName: item.guardianName, // 监护人姓名
                idNo: item.idNo, // 证件类型号码
                idType: item.idType, // 证件类型
                idtypeName: item.idtypeName,
                instrumentType: item.instrumentType, // 仪器类型
                name: item.name, // 姓名
                remarks: item.remarks, // 备注信息
                servItemSubNo: item.servItemSubNo, // 项目明细编码
                sex: item.sex, // 性别
                sexName: item.sexName,
                teamAppointno: item.teamAppointno, // 团体预约编码
                updateBy: item.updateBy, // 更新者
                updateDate: item.updateDate, // 更新时间
                workplanNo: item.workplanNo, // 项目排班编码
                teamNames: item.teamNames, // 团体名称
                sysCode: item.sysCode, // 系统编码
                diseasedetail: item.diseasedetail, // 病例详细
              });
            });
            this.yydata = yydata;
          } else {
            this.$message.error('信息获取失败');
          }
        }).catch(error => {
          console.log(error, "error");
        });
      },

      // 预约确认多选
      onSelectChange(selectedRowKeys, selectedRows) {
        this.selectedRowKeys = selectedRowKeys;
        this.selectedRows = selectedRows;
      },
      itemClick(rowData, index) {
        return {
          on: {
            dblclick: () => {
              this.dbclickConfirmItem(rowData, index);
            }
          }
        }
      },
      dbclickConfirmItem(rowData, index) {
        if (rowData.ffStateRaw !=='2') { // 已预约除外
          this.$info({
            title: "提示",
            content: "已确认过的项目不能再次选择排班!"
          });
        } else {
          this.tspage = 1;
          this.tspageSize = 10;
          this.tsModalList(rowData);
          this.timeSelect = true;
        }
      },
      // 预约时间选择列表
      tsModalList(record) {
        let {mecNo, servItemNo} = record;
        let url = this.$apiList.getTimeWorkPlanByServItem;
        this.tsrecord = record;

        this.$axios.post(url, {
          servItemNo, // 服务项目编码
          mecNo, // 体检分部编码
          page: this.tspage,
          limit: this.tspageSize
        }).then(res => {
          if (res.status === 0) {
            let {data, totalCount} = res.data;
            let tsdata = [];

            this.tspagination.total = totalCount;
            data.forEach((item, index) => {
              tsdata.push({
                key: index,
                time: item.timeSlice, // 时间段
                item: item.servItemName,
                // last: item.maxPeople - item.numApp,
                last: item.surpluspeople,
                total: item.maxPeople,
                id: item.id,
                appointId: item.appointId,
                timeSlice: item.timeSlice,
                appointWorkplanNo: item.appointWorkplanNo,
                workplanNo: item.workplanNo,

              });
            });
            this.tsdata = tsdata;
          }
        }).catch(error => {
          console.log(error, "error");
        });

      },
      // 选择预约时间段
      tsModalPop(record) {
        let url = this.$apiList.updateWorkPlan;
        this.$axios.post(url, {
          workplanNo: record.workplanNo, //新项目排班编码
          appointWorkplanNo: this.tsrecord.workplanNo, //项目排班编码
          timeSlice: record.timeSlice, //时间段
          // 服务项目列表中的id和workplanNo
          appointId: this.tsrecord.id, //项目id
          id: record.id //编码
        }).then(res => {
          if (res.status === 0) {
            this.timeSelect = false;
            this.$message.success('选择成功！');
            this.getAppointByService({
              "birthday": this.yyCusInfo.birthday,
              "cardNum": this.yyCusInfo.idno,
              "idType": this.yyCusInfo.idtype,
              "name": this.yyCusInfo.name,
              "sex": this.yyCusInfo.sex
            });
          } else {
            this.$message.error('选择失败！');
          }
        }).catch(error => {
          console.log(error, "error");
        });
      },
      // 预约确认
      yyConfirm () {
        if (this.selectedRows.length === 0) {
          this.$info({
            title: "提示",
            content: "请选择一条记录!"
          });
          return;
        }

        let sFlag = this.selectedRows.some((row) => {
          return row.ffStateRaw !== "2";
        });
        if (sFlag) {
          this.$info({
            title: "提示",
            content: "已确认过的项目不能再次预约确认!"
          })
          return;
        }

        if(this.selectedRows.length > 1){
          let repeatflag = false;
          let mecnoflag = false;
          let sysflag = false;
          for(var i=0;i<this.selectedRows.length; i++){
            for(var j=i+1;j<this.selectedRows.length; j++){
              if(this.selectedRows[i]["xmDetail"] == this.selectedRows[j]["xmDetail"]){
                repeatflag = true;
                //break;
              }
              if(this.selectedRows[i]["mecNo"] != this.selectedRows[j]["mecNo"]){
                mecnoflag = true;
                //break;
              }
              if(this.selectedRows[i]["sysCode"] != this.selectedRows[j]["sysCode"]){
                sysflag = true;
                //break;
              }
            }
          }
          if(repeatflag){
            this.$info({
              title: "提示",
              content: "同一次检测服务中不允许存在两个及以上相同的服务项目！"
            })
            return;
          }
          if(mecnoflag){
            this.$info({
              title: "提示",
              content: "同一次检测服务中只允许预约相同的健管中心！"
            })
            return;
          }
          if(sysflag){
            this.$info({
              title: "提示",
              content: "同一次检测服务中只允许来自相同的预约渠道！"
            })
            return;
          }
        }

        var timeflag = false;
        for(var i=0;i<this.selectedRows.length; i++){
          if(!this.selectedRows[i]["yyDate"]){
            timeflag = true;
            break;
          }
        }
        if(timeflag){
          this.$info({
            title: "提示",
            content: "预约时间不能为空!"
          })
          return;
        }

        let url = this.$apiList.confirmHsAppointList;
        let itemList = [];
        this.selectedRows.forEach(item => {
          itemList.push({
            appFlag: item.appFlag, // 预约标记
            appointDate: item.appointDate, // 预约日期
            appointNo: item.appointNo, // 预约编号
            appointPhone: item.appointPhone, // 预约电话
            appointTime: item.yyDate, // 预约时间段
            birthday: item.birthday, // 出生日期
            cardNo: item.cardNo, // 卡号
            createBy: item.createBy, // 创建者
            createDate: item.slDate, // 创建时间
            customerNo: item.customerNo, // 客户编码
            delflag: item.delflag, // 删除标记
            guardianIdNo: item.guardianIdNo, // 监护人证件号码
            guardianIdType: item.guardianIdType, // 监护人证件类型
            guardianName: item.guardianName, // 监护人姓名
            id: item.id, // 编号
            idNo: item.idNo, // 证件号码
            idType: item.idType, // 证件类型
            instrumentType: item.instrumentType, // 仪器类型
            mecNo: item.mecNo, // 体检分部编码
            name: item.name,
            physicalNo: item.tjNo, // 体检号
            remarks: item.remarks, // 备注信息
            servItemNo: item.servItemNo, // 服务项目编码
            servItemSubNo: item.servItemSubNo, // 项目明细编码
            servStatus: item.ffStateRaw, // 服务状态
            sex: item.sex, // 性别
            teamAppointno: item.teamAppointno, // 团体预约编码
            temName: item.temName, // 团体名称
            updateBy: item.updateBy, // 更新者
            updateDate: item.updateDate, // 更新时间
            workplanNo: item.workplanNo, // 项目排班编码
            preferentialPrice: item.yhPrice, // 优惠后价格
          });
        });

        this.$axios.post(url, itemList).then(res => {
          if (res.status === 0) {
            this.$message.success('保存成功！');
            this.selectedRowKeys = [];
            this.selectedRows = [];
            this.getAppointByService({
              "birthday": this.yyCusInfo.birthday,
              "cardNum": this.yyCusInfo.idno,
              "idType": this.yyCusInfo.idtype,
              "name": this.yyCusInfo.name,
              "sex": this.yyCusInfo.sex
            });
          }
        }).catch(error => {
          console.log(error, "error");
        });
      },
      // 打印
      yyPrint () {
        if (this.selectedRowKeys.length === 0) {
          this.$info({
            title: "提示",
            content: "请选择打印记录!"
          })
          return;
        }

        let url = this.$apiList.printInfo;
        let payload = [];
        this.selectedRows.forEach(ele => {
          payload.push({
            mecName: ele.mecName,
            servItemSubName: ele.xmDetail,
            price: ele.scPrice,
            preferentialPrice: ele.yhPrice, // 优惠后价格
            idNo: ele.idNo,
            idtypeName: ele.idtypeName,
            birthday: ele.birthday,
            sexName: ele.sexName,
            name: ele.name,
            physicalNo: ele.tjNo,
            appointPhone: ele.appointPhone
          });
        });
        this.$axios.post(url, payload).then((res) => {
          if (res.status === undefined) {
            // base64内容，文件名
            this.$downloadFileByBase64(res, `${this.yyCusInfo.name}-体检打印单`);
          } else {
            this.$message.error('文件下载失败,请重试');
          }
        }).catch((err) => {
          console.log(err);
        });
      }
    }
  }
</script>
<style lang="less" scoped>
  .ant-calendar-picker {
    width: 100%;
  }
  .tab-pagination {
    position: relative;
    margin-top: 15px;
    .ant-pagination {
      position: absolute;
      right: 0;
    }
  }
  .ant-table-wrapper /deep/ thead.ant-table-thead tr th,
  .ant-table-wrapper /deep/ tbody.ant-table-tbody tr td {
    padding-left: 6px;
    padding-right: 6px;
  }
  .ant-table-wrapper /deep/ .ant-table{
    table-layout: fixed;
  }
  .ant-table-wrapper /deep/ .ant-table-tbody > tr > td:not(:last-child) {
    max-width: 80px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
</style>
