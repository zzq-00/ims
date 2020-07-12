<template>
  <div style="padding: 20px; background-color: #fff">
    <a-card title="排班管理" :bordered="false" style="width: 100%">
  		<a-form :form="form">
        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item 
            :label-col="formItemLayout.labelCol"
            :wrapper-col="formItemLayout.wrapperCol"
            label="健管中心">
              <a-select 
                showSearch
                placeholder="选择健管中心"
                :dropdownMatchSelectWidth="false"
                optionFilterProp="children"
                :filterOption="filterOption"
                v-decorator="['mecno', config.mecno]"
                @change="queryServItems"
                allowClear>
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
            label="服务项目">
              <a-select
                mode="multiple"
                style="width: 100%"
                placeholder="选择服务项目"
                @change='servItemChange'
                v-decorator="['servitemno', config.servitemno]"
                :maxTagCount="1"
                allowClear>
                <div slot="dropdownRender" slot-scope="menu">
                    <div
                      style="padding: 4px 8px; cursor: pointer;"
                      @mousedown="e => e.preventDefault()"
                    >
                      <div style="display:flex;justify-content: space-around;">
                        <div>服务项目</div>
                        <div>
                          <span>全选</span>
                          <a-checkbox :checked="checkAll" @change="selectAllItems"></a-checkbox>
                        </div>
                      </div>
                    </div>
                    <a-divider style="margin: 4px 0;" />
                    <v-nodes :vnodes="menu" />
                  </div>
                <a-select-option 
                  v-for="(value) in servItemList"
                  :key="value.servItemNo"
                  :value="value.servItemNo">{{value.servItemName}}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item 
            :label-col="formItemLayout.labelCol"
            :wrapper-col="formItemLayout.wrapperCol"
            label="日期管理">
              <!-- a-input占位 -->
              <a-input 
                v-show="false"
                v-decorator="['scheDate', config.scheDate]"
              ></a-input>
              <DatePicker 
                type="date" 
                multiple 
                placeholder="选择排班日期"
                @on-change="dateChange"
                v-model="scheDate"
                style="display:block;"></DatePicker>
                <div style="height:3px;"></div>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item>
              <div style="text-align: right;">
                <a-button type="primary" icon="plus" @click="addItem">添加排班</a-button>
              </div>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
  	</a-card>
    <a-card title="排班列表" :bordered="false" style="width: 100%">
        <add-modal
          @close="closeModal"
          :visible="modalVisible"
          :editInfo="editInfo"
          ></add-modal>
      <a-table
        :loading="loading"
        :pagination="false"
        :columns="columns" 
        :dataSource="listData">
        <template slot="handle" slot-scope="text,record">
          <a-popconfirm
              title="确认删除?"
              @confirm="() => handleDel(record)"
            >
            <a href="javascript:;">删除</a>
          </a-popconfirm>
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
  	</a-card>
  </div>
</template>

<script>
  import AddModal from './AddModal';
  export default {
    components: {
      AddModal,
      VNodes: {
        functional: true,
        render: (h, ctx) => ctx.props.vnodes,
      },
    },
    data() {
      return {
        // 查询条件
        formItemLayout: {
          labelCol: { span: 5 },
          wrapperCol: { span: 19 },
        },
        config: {
          mecno: { rules: [{ required: true, message: '请选择健管中心' }] },
          servitemno: { rules: [{ required: true, message: '请选择服务项目' }] },
          scheDate: { rules: [{ required: true, message: '请选择排班日期' }] },
        },
        form: this.$form.createForm(this),
        mecList: [],
        // 服务项目列表
        servItemList: [],
        checkAll: false,
        scheDate: [], // 排班日期
        // 表格
        loading: false,
        columns: [
          {
            title: "序号",
            customRender: (value, row, index) => `${(this.page-1)*this.pageSize+index+1}`
          },
          {
              title: '健管中心',
              dataIndex: 'mecname',
              customRender: (text, row, index) => {
                return <span title={text}>{text}</span>;
              }
          },
          {
              title: '服务项目',
              dataIndex: 'servitemname',
          },
          {
              title: '开始时间',
              dataIndex: 'starttime',
          },
          {
              title: '结束时间',
              dataIndex: 'endtime',
          },
          {
              title: '最大限额人数',
              dataIndex: 'maxpeoplestr',
          },
          {
              title: '操作',
              width: 120,
              scopedSlots: {customRender: 'handle'}
          },
        ],
        listData: [],
        modalVisible: false,
        editInfo: {},
        // 分页
        pageSize: 10,
        page: 1,
        total: 0,
      }
    },
    created() {
      this.queryMecName();
    },
    methods: {
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
      // 查询健管中心下的服务项目
      queryServItems(mecno) {
        this.checkAll = false;

        this.form.setFieldsValue({
          servitemno: undefined
        });
        this.servItemList = [];
        if (mecno == undefined) return;

        let url = this.$apiList.getServiceInfoByMecNo;
        this.$axios.post(url, {
          mecNo: mecno
        }).then((res) => {
          if (res.status === 0) {
            let { data } = res;
            this.servItemList = data;
          } else {
            this.$message.error('健管中心下服务项目获取失败');
          }
        }).catch((err) => {
          console.log(err);
        });
      },
      // 服务项目全选
      selectAllItems(e) {
        if (e.target.checked) { // 全选
          let itemCollect = this.servItemList.map((item) => {
            return item.servItemNo;
          });
          this.checkAll = true;
          this.form.setFieldsValue({
            servitemno: itemCollect
          });

          this.$nextTick(this.queryData);
        } else {
          this.checkAll = false;
          this.form.setFieldsValue({
            servitemno: undefined
          });
        }
      },
      // 服务项目改变
      servItemChange(values) {
        // 全选按钮设置
        if ((values.length === this.servItemList.length) && (values.length !== 0)) {
          this.checkAll = true;
        } else {
          this.checkAll = false;
        }
        
        if (values.length) {
          this.$nextTick(this.queryData);
        }
      },
      // 日期改变
      dateChange(dates) {
        this.setDateForm();
        this.$nextTick(this.queryData);
      },
      // 查询排班
      queryData() {
        this.page = 1;
        this.submit();
      },
      submit() {
        this.form.validateFields((err, values) => { 
          if (!err) {
            this.fetchDataList(values);
          }
        });
      },
      // 排班列表
      fetchDataList(values) {
        this.loading = true
        let dates = [];
        this.scheDate.forEach((date) => {
          let dateVal = this.$moment(date).format("YYYY-MM-DD");
          dates.push(dateVal);
        });

        let url = this.$apiList.getWorkplanList;
        this.$axios.post(url, {
          page: this.page,
          limit: this.pageSize,
          mecNo : values.mecno,
          servItemNo: values.servitemno,
          workPlanDate: dates
        }).then(res => {
          this.loading = false
          if (res.status === 0) {
            let { data, totalCount } = res.data;
            let tempData = [];
            this.total = totalCount;

            data.forEach((ele, index) => {
              tempData.push({
                key: index,
                id: ele.id,
                mecno: ele.mecNo,
                mecname: ele.mecName,
                servitemno: ele.servItemNo,
                servitemname: ele.servItemName,
                starttime: ele.startTime && this.$moment(ele.startTime).format('YYYY-MM-DD HH:mm'),
                endtime: ele.endTime && this.$moment(ele.endTime).format('YYYY-MM-DD HH:mm'),
                maxpeoplestr: ele.maxPeople < 1 ? "" : ele.maxPeople,
                workplanNo: ele.workplanNo
              });
            });
            this.listData = tempData;
          } else {
            this.$message.error('查询失败');
          }
        }).catch(err => {
          console.log(err);
        });
      },
      reset() {
        this.form.resetFields();
      },
      // 两个日期绑定
      setDateForm() {
        // 控制日期校验文字显示隐藏
        var flag;
        flag = this.scheDate.every(item => {
          return item == false;
        });

        if (this.scheDate.length == 0 || flag) {
          this.form.setFieldsValue({
            scheDate: undefined
          });
        } else {
          this.form.setFieldsValue({
            scheDate: '0'
          });
        }
      },
      // 添加排班操作
      addItem() {
        this.form.validateFields((err, values) => {
          if (!err) {
            // 格式化日期
            let dates = [];
            this.scheDate.forEach((date) => {
              let dateVal = this.$moment(date).format("YYYY-MM-DD");
              dates.push(dateVal);
            });
                
            this.modalVisible = true;
            this.editInfo = {
              mecno: values.mecno,
              servitemno: values.servitemno,
              scheDate: dates
            };
          }
        });
      },
      // 删除
      handleDel(record) {
        let url = this.$apiList.delWorkPlan;
        this.$axios.post(url, {
          id: record.id,
	        workplanNo: record.workplanNo
        }).then(res => {
          if (res.status === 0) {
            this.$message.success('删除成功');
            this.submit();
          } else if (res.status === -1) {
            this.$message.error(res.data);
          } else {
            this.$message.error('删除失败');
          }
        }).catch(err => {
          console.log(err);
        });
      },
      closeModal(flag) {
        this.modalVisible = false;
        // 新增或修改成功，重新获取列表数据
        if (flag==='success') {
          this.queryData();
        }
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
.add-btn {
  margin-bottom: 8px;
}
// 表格
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

.tab-pagination {
  margin-top: 15px;
  text-align: right;
  .ant-pagination {
    display: inline-block;
  }
}
</style>