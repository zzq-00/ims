<template>
  <a-modal
    centered
    :width="800"
    destroyOnClose
    :visible="visible"
    title="添加排班"
    okText="保存"
    @ok="handleSubmit"
    @cancel="handleCancel">
    <strong style="color: #254161;font-weight: bold;">添加排班</strong>
    <a-form :form="form">
      <a-row :gutter="16">
        <a-col :span="8">
          <a-form-item 
          :label-col="formItemLayout.labelCol"
          :wrapper-col="formItemLayout.wrapperCol"
          label="最大限额人数">
            <a-input-number 
              style="width:100%;"
              :min="1" 
              v-decorator="['maxpeoplestr']" allowClear></a-input-number>
          </a-form-item>
        </a-col>
        <a-col :span="8">
          <a-form-item  
          :label-col="formItemLayout.labelCol"
          :wrapper-col="formItemLayout.wrapperCol"
          label="开始时间">
            <a-time-picker 
              @change="(val,dateStrings)=>changeTime(val,dateStrings,'startTime')"
              v-decorator="['starttime', {initialValue: $moment(startTime, 'HH:mm')}]"
              :allowClear="false"
              format="HH:mm" />
          </a-form-item>
        </a-col>
        <a-col :span="8">
          <a-form-item  
          :label-col="formItemLayout.labelCol"
          :wrapper-col="formItemLayout.wrapperCol"
          label="结束时间">
            <a-time-picker 
              :disabledHours="getDisabledHours"
              :disabledMinutes="getDisabledMinutes"
              @change="(val,dateStrings)=>changeTime(val,dateStrings,'endTime')"
              v-decorator="['endtime', {initialValue: $moment(endTime, 'HH:mm')}]"
              :allowClear="false"
              format="HH:mm" />
          </a-form-item>
        </a-col>
      </a-row>
      <a-row :gutter="16">
        <a-col :span="24">
          <a-form-item>
            <div style="text-align: right;">
              <a-button type="primary" @click="addSchedule">添加</a-button>
              <a-button @click="reset">重置</a-button>
            </div>
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>

    <strong style="color: #254161;font-weight: bold;">排班列表</strong>
    <a-table
      :pagination="false"
      :columns="columns"
      :dataSource="listData">
      <template slot="handle" slot-scope="text,record">
          <a href="javascript:;" @click="() => handleDel(record.key)">删除</a>
      </template>
    </a-table>
  </a-modal>
</template>

<script>
  export default {
    props: {
      visible: false,
      editInfo: {
        type: Object,
        default: function() {
          return {};
        }
      }
    },
    data() {
      return {
        // 查询条件
        startTime: '08:00',
        endTime: '08:00',
        mecList: [],
        formItemLayout: {
          labelCol: { span: 10 },
          wrapperCol: { span: 14 },
        },
        form: this.$form.createForm(this),
        // 表格
        columns: [
          {
            title: "序号",
            customRender: (value, row, index) => `${index+1}`
          },
          {
              title: '最大限额人数',
              dataIndex: 'maxPeople',
          },
          {
              title: '开始时间',
              dataIndex: 'startTimeFrom',
          },
          {
              title: '结束时间',
              dataIndex: 'endTimeTo',
          },
          {
              title: '操作',
              width: 120,
              scopedSlots: {customRender: 'handle'}
          },
        ],
        listData: [],
      }
    },
    watch: {
      visible(newVal, oldVal) {
        if (!newVal) {
          this.reset();
          this.listData = [];
        }
      }
    },
    methods: {
      changeTime (val, dateStrings, type) {
        if (type === 'startTime') {
          this.startTime = dateStrings;
        } else {
          this.endTime = dateStrings;
        }
      },
      getDisabledHours () {
        let hours = []
        let time = this.startTime
        let timeArr = time.split(':')
        for (var i = 0; i < parseInt(timeArr[0]); i++) {
          hours.push(i)
        }
        return hours
      },
      getDisabledMinutes (selectedHour) {
        let time = this.startTime
        let timeArr = time.split(':')
        let minutes = []
        if (selectedHour == parseInt(timeArr[0])) {
          for(var i = 0; i < parseInt(timeArr[1]); i++) {
            minutes.push(i)
          }
        }
        return minutes
      },
      // 添加
      addSchedule() {
        // 开始时间大于结束时间，交换开始结束时间
        let startTime = this.form.getFieldValue('starttime').format('HH:mm'),
            endTime = this.form.getFieldValue('endtime').format('HH:mm'),
            startArr = startTime.split(':'),
            endArr = endTime.split(':');
        if (parseInt(startArr[0]) == parseInt(endArr[0])) {
          if (parseInt(startArr[1]) > parseInt(endArr[1])) {
            endTime = this.form.getFieldValue('starttime').format('HH:mm');
            startTime = this.form.getFieldValue('endtime').format('HH:mm');
          }
        } else if (parseInt(startArr[0]) > parseInt(endArr[0])) {
          endTime = this.form.getFieldValue('starttime').format('HH:mm');
          startTime = this.form.getFieldValue('endtime').format('HH:mm');
        }
        
        this.listData.push({
          key: +new Date(),
          maxPeople: this.form.getFieldValue('maxpeoplestr'),
          startTimeFrom: startTime,
          endTimeTo: endTime
        });
      },
      reset() {
        this.startTime = '08:00';
        this.endTime= '08:00';
        this.form.resetFields();
      },
      handleDel(key) {
        const listData = [...this.listData];
        this.listData = listData.filter(item => item.key !== key);
      },
      // 提交
      handleSubmit() {
        let {mecno, servitemno, scheDate} = this.editInfo;
        let payload = {
          "mecNo": mecno,
          "servItemNo": servitemno,
          "workPlanDate": scheDate,
          "ServTimeWorkplan": this.listData
        }

        let url = this.$apiList.saveWorkPlans;
        this.$axios.post(url, payload).then(res => {
          if (res.status === 0) {
            this.$message.success('保存成功');
            this.$emit("close", 'success')
          } else {
            this.$message.error('保存失败');
          }
        }).catch(err => {
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
.ant-time-picker {
  width: 100%;
}
</style>