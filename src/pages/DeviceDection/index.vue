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
              label="手机">
                <a-input v-decorator="['phone']" allowClear />
              </a-form-item>
            </a-col>
            <a-col :span="6">
              <a-form-item  
              :label-col="formItemLayout.labelCol"
              :wrapper-col="formItemLayout.wrapperCol"
              label="性别">
                <a-select v-decorator="['sex']" allowClear>
                  <a-select-option value="1">男性</a-select-option>
                  <a-select-option value="2">女性</a-select-option>
                  <!-- <a-select-option 
                  v-for="(value,key) in genderMap"
                  :key="key"
                  :value="key">{{value}}</a-select-option> -->
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :span="6">
              <a-form-item 
              :label-col="formItemLayout.labelCol"
              :wrapper-col="formItemLayout.wrapperCol"
              label="体检号">
                <a-input v-decorator="['physicalno']" allowClear></a-input>
              </a-form-item>
            </a-col>
          </a-row>
          <a-row :gutter="16">
            <a-col :span="6">
              <a-form-item 
              :label-col="formItemLayout.labelCol"
              :wrapper-col="formItemLayout.wrapperCol"
              label="设备">
                <a-select @change="instrumenttypeChange" v-decorator="['instrumenttype', { initialValue: initialValue }]" >
                  <a-select-option 
                    v-for="(value,key) in instrumenttypeMap"
                    :key="key"
                    :value="key">{{value}}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :span="6">
              <a-form-item  
              :label-col="formItemLayout.labelCol"
              :wrapper-col="formItemLayout.wrapperCol"
              label="测量日期">
                <a-date-picker placeholder="选择日期" v-decorator="['startchecktime']" />
              </a-form-item>
            </a-col>
            <a-col :span="6">
              <a-form-item  
              :label-col="formItemLayout.labelCol"
              :wrapper-col="formItemLayout.wrapperCol"
              label="至">
                <a-date-picker placeholder="选择日期" v-decorator="['endchecktime']" />
              </a-form-item>
            </a-col>
            <a-col :span="6">
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
    <a-card title="设备检测列表" :bordered="false" style="width: 100%">
      <a-table
        :loading="loading"
        :pagination="false"
        :customRow="rowclick"
        :columns="columns" 
        :dataSource="listData">
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
  	</a-card>
    <!-- 展示弹窗用 -->
    <router-view></router-view>
  </div>
</template>

<script>
  import GmdModal from './GmdModal';
  export default {
    data() {
      return {
        // 查询条件
        formItemLayout: {
          labelCol: { span: 9 },
          wrapperCol: { span: 15 },
        },
        form: this.$form.createForm(this),
        // 设备默认类型
        initialValue: "A",
        // 表格
        loading: false,
        columns: [
          {
            title: "序号",
            customRender: (value, row, index) => `${(this.page-1)*this.pageSize+index+1}`,
          },
          {
              title: '体检号',
              dataIndex: 'physicalno',
              customRender: (text, row, index) => {
                return <span title={text}>{text}</span>;
              }
          },
          {
              title: '推送体检号',
              dataIndex: 'inputphysicalno',
              customRender: (text, row, index) => {
                return <span title={text}>{text}</span>;
              }
          },
          {
              title: '客户姓名',
              dataIndex: 'name',
              customRender: (text, row, index) => {
                return <span title={text}>{text}</span>;
              }
          },
          {
              title: '证件号码',
              dataIndex: 'idno',
              customRender: (text, row, index) => {
                return <span title={text}>{text}</span>;
              }
          },
          {
              title: '性别',
              dataIndex: 'sex',
              customRender: (text, row, index) => {
                return <span title={text}>{text}</span>;
              }
          },
          {
              title: '出生日期',
              dataIndex: 'birthday',
              customRender: (text, row, index) => {
                return <span title={text}>{text}</span>;
              }
          },
          {
              title: '手机号',
              dataIndex: 'phone',
              customRender: (text, row, index) => {
                return <span title={text}>{text}</span>;
              }
          },
          {
              title: '测量日期',
              dataIndex: 'checktime',
              customRender: (text, row, index) => {
                return <span title={text}>{text}</span>;
              }
          },
          {
              title: '医师/技师',
              dataIndex: 'doctor',
              customRender: (text, row, index) => {
                return <span title={text}>{text}</span>;
              }
          },
          {
              title: '医师结论',
              dataIndex: 'conclusion',
              customRender: (text, row, index) => {
                return <span title={text}>{text}</span>;
              }
          },
          // {
          //     title: '备注信息',
          //     dataIndex: 'remarks',
          //     customRender: (text, row, index) => {
          //       return <span title={text}>{text}</span>;
          //     }
          // },
          {
              title: '图片',
              dataIndex: 'imgname',
              customRender: (text, row, index) => {
                return <span title={text}>{text}</span>;
              }
          },
        ],
        columnsCopy: [],
        listData: [],
        modalInfo: {
          name: '',
          physicalno: '',
          sex: '',
          idno: '',
          phone: '',
          startbirthday: '',
          endbirthday: '',
          id: '',
          servitemno: '',
          servitemsubno: '',
          mecno: '',
          doctor: '',
          conclusion: ''
        },
        modalVisible: false,
        // 分页
        pageSize: 10,
        page: 1,
        total: 0,
      }
    },
    computed: {
      genderMap () {
        return this.$store.getters['hins/cGender'];
      },
      instrumenttypeMap () {
        // return this.$store.getters['hins/cInstrumentType'];
        // 仪器类型(A-骨密度仪；B-脉象仪；C-鹰演；D-中卫一体机；E-双佳一体机)
        return {
          "A": "骨密度仪",
          "B": "脉象仪",
          "C": "鹰演",
          "D": "中卫一体机",
          "E": "双佳一体机"
        };
      },
    },
    created() {
      this.fetchDropDown('VIP_SEX');
      this.fetchDropDown('HINS_INSTRUMENT_TYPE');
      this.copyColumnsHandle();
      this.instrumenttypeChange(this.initialValue);
    },
    beforeRouteUpdate (to, from, next) {
      if (to.name === "devicedection") { // 回到查询页刷新数据
      let type = this.form.getFieldValue("instrumenttype");
        this.instrumenttypeChange(type);
      }
      next();
    },
    methods: {
      fetchDropDown(codename) {
        this.$store.dispatch('hins/fetchSelectCode', {
          codename,
        });
      },
      // copy表头
      copyColumnsHandle() {
        let tempArr = [];
        this.columns.forEach(item => {
          tempArr.push({...item});
        });

        this.columnsCopy = tempArr;
      },
      // 根据设备类型不同，生成新的表头
      genColumns(type) {
        let columns = [];
        this.columnsCopy.forEach(ele => {
          if (ele.title == "图片") {
            if (type == "A") {
              columns.push({...ele});
            }
          } else if (ele.title == "推送体检号") {
            if (type == "B") {
              columns.push({...ele});
            }
          } else if (ele.title == "手机号") {
            if (type !== "D") {
              columns.push({...ele});
            }
          } else {
            columns.push({...ele});
          }
        });
        return columns;
      },
      // 设备类型改变,重新生成新的表头
      instrumenttypeChange(type) {
        // 类型改变
        this.$nextTick(() => {
          this.listData = [];
          this.columns = this.genColumns(type);
          if (type !== 'B' && type !== 'C') {
            this.submit();
          }
        });
      },

      queryData() {
        this.page = 1;
        this.submit();
      },
      // 查询获取列表数据
      submit() {
        this.loading = true
        let url = this.$apiList.queryDeviceHsItem;
        this.form.validateFields((err, values) => {
          this.$axios.post(url, {
            instrumentType: values.instrumenttype,
            page: this.page, 
            limit: this.pageSize,
            // name: values.name,
            // phone: values.phone,
            // sex: values.sex,
            // physicalNo: values.physicalno,
            // startchecktime: values.startchecktime,
            // endchecktime: values.endchecktime
            selfname: values.name,
            tel: values.phone,
            gender: values.sex,
            cid: values.physicalno,
            mdatefrom: values.startchecktime && values.startchecktime.format("YYYY-MM-DD"),
            mdateto: values.endchecktime && values.endchecktime.format("YYYY-MM-DD")
          }).then((res) => {
            this.loading = false
            if (res.status === 0) {
              let {data, totalCount} = res.data;
              let listData = [];

              this.total = totalCount;
              data.forEach((item, index) => {
                let row = {
                  key: index,
                  // id: item.id,
                  // physicalno: item.physicalNo,
                  // inputphysicalno: item.inputPhysicalNo,
                  // name: item.name,
                  // idno: item.idno,
                  // sex: item.sexName,
                  // sexcode: item.sex,
                  // birthday: item.birthday?this.$moment(item.birthday).format("YYYY-MM-DD"):"",
                  // phone: item.phone,
                  // doctor: item.doctor,
                  // conclusion: item.conclusion,
                  // remarks: item.remarks,
                  // checktime: item.checktime?this.$moment(item.checktime).format("YYYY-MM-DD"):"",
                  // imgname: item.imgname?"有":"无"
                  id: item.chid,
                  physicalno: item.cid,
                  inputphysicalno: item.inputPhysicalNo,
                  name: item.selfname,
                  idno: item.idnumber,
                  sex: item.gender === "1" ? "男性" :(item.gender === "2" ? "女性": ""),
                  sexcode: item.gender,
                  birthday: item.birthday?this.$moment(item.birthday).format("YYYY-MM-DD"):"",
                  phone: item.tel,
                  doctor: item.doc,
                  conclusion: item.docadvice,
                  // remarks: item.remarks,
                  checktime: item.mdate?this.$moment(item.mdate).format("YYYY-MM-DD"):"",
                  imgname: item.imgname?"有":"无"
                };
                if (values.instrumenttype === 'A') {
                  row.deviceno = item.deviceNo;
                } else if (values.instrumenttype === 'D') { // 中卫一体机
                  row.deviceno = item.devicecode;
                  row.checktime = item.checktime?this.$moment(item.checktime).format("YYYY-MM-DD"):""
                } else if (values.instrumenttype === 'E') {
                  row.phone = item.mobile,
                  row.checktime = item.measuretime?this.$moment(item.measuretime).format("YYYY-MM-DD"):""
                }
                listData.push(row);
              });
              this.listData = listData;
            } else {
              this.$message.error("数据获取失败");
            }
          })
          .catch((err) => {
            console.log(err);
          });

        });
       
      },
      reset() {
        this.form.resetFields();
      },
      // 表格
      closeModal(flag) {
        this.modalVisible = false;
        if (flag==='success') {
          this.submit();
        }
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
        let type = this.form.getFieldValue("instrumenttype");
        // 鹰演
        if (type === "C") return;
        let path = {
          "A": "gmd",
          "B": "pulse",
          "D": "zw",
          "E": "sj",
        };
        this.$router.push({
          name: path[type],
          // 根据id查询详情
          query: {
            k: rowData.id,
            name: rowData.name,
            sexcode: rowData.sexcode,
            sex: rowData.sex,
            birthday: rowData.birthday,
            idno: rowData.idno,
            phone: rowData.phone,
            physicalno: rowData.physicalno,
            doctor: rowData.doctor,
            conclusion: rowData.conclusion,
            imgname: rowData.imgname
          }
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
    },
  }
</script>

<style lang="less" scoped>
.ant-calendar-picker {
  width: 100%;
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

.tab-pagination {
  margin-top: 15px;
  text-align: right;
  .ant-pagination {
    display: inline-block;
  }
}
</style>