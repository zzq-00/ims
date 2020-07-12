<template>
  <a-card :bordered="false">
    <a-card>
      <a-form :form="filterForm" :labelCol="filterFormLayout.labelCol" :wrapperCol="filterFormLayout.wrapperCol">
        <a-row :gutter="16">
          <a-col :span="6">
            <a-form-item label="健管卡代码">
              <HealthCardSelect ref="healthCardSelect" :allowClear="true" @change="searchHandle" v-decorator="['docDefId', {initialValue: ''}]" />
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="产品代码">
              <HealthProductSelect ref="healthProductSelect" :allowClear="true" @change="searchHandle" :docDefId="filterForm.getFieldValue('docDefId')" v-decorator="['productCode', {initialValue: ''}]" />
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="操作日期起期">
              <a-date-picker v-decorator="['insertTime',{initialValue: null}]" format="YYYY/MM/DD" />
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="操作日期止期">
              <a-date-picker v-decorator="['endInsertTime',{initialValue: null}]" format="YYYY/MM/DD" />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :span="12" :offset="11">
            <a-button type="" class="editable-add-btn" @click="generateNoPass" style="float:right;margin-right:10px;">生成卡号密码</a-button>
            <a-button type="" class="editable-add-btn" :disabled="selectedRows.length === 0" @click="exportNoPass" style="float:right;margin-right:10px;">导出选中卡密</a-button>
            <a-button type="" class="editable-add-btn" @click="resetFilterForm" style="float:right;margin-right:10px;">重置</a-button>
            <a-button type="" class="editable-add-btn" @click="searchHandle" style="float:right;margin-right:10px;">查询</a-button>
          </a-col>
        </a-row>
      </a-form>
    </a-card>
    <a-card style="margin-top:24px;">
			<span href="#" slot="title" style="float:left;">
				<a-icon type="bank" /> 自定义健管卡生成入库</span>
      <a href="#" slot="extra">
        <a-icon :type="iconType" @click="swithTableShow" />
      </a>
      <a-table
        :scroll="{ x: 'max-content'}"
        v-show="showTable"
        :customRow="customRow"
        :bordered="false"
        :pagination="pagination"
        :rowSelection="{type: 'radio',selectedRowKeys: selectedRowKeys, onChange: radioChange}"
        :dataSource="pageData.data"
        :columns="columns"
        :rowKey="record => record.recordIndex"
        :indentSize=0
        :loading="loading">
        <a slot="docCode" slot-scope="text, record">{{(text)}}</a>
        <a-tag slot="yesNo" slot-scope="text, record" :color="text=== 'Y' ? 'green' : 'orange'">{{text === 'Y' ? '是' : '否'}}</a-tag>
      </a-table>
    </a-card>
    <CardStockGenerateForm ref="cardStockGenerateForm" @on-update="loadPageData" />
  </a-card>
</template>
<script>
  import api from '@/api/api-health-card'
  import DicSelect from '@/components/dic-select'
  import HealthCardSelect from '@/components/health-card-select'
  import HealthProductSelect from '@/components/health-card-product-select'
  import CardStockGenerateForm from '@/pages/HealthCard/components/card-stock-generate-form'
  import { Promise } from 'q'
  export default {
    name: 'health-card-stock-generate',
    components: { DicSelect, HealthCardSelect, HealthProductSelect, CardStockGenerateForm },
    data () {
      return {
        // 查询条件
        filterFormLayout: {
          labelCol: { span: 9 },
          wrapperCol: { span: 15 }
        },
        pageData: {
          dataCount: 0,
          data: []
        },
        filterForm: this.$form.createForm(this),
        formModal: false,
        selectedRows: [],
        selectedRowKeys: [],
        loading: false,
        showTable: true,
        iconType: 'down',
        columns: [
          {
            title: "序号",
            customRender: (value, row, index) => this.tableIndex(index)
          },
          {
            align: "left",
            title: "健管卡代码",
            dataIndex: "docCode",
            scopedSlots: { customRender: 'docCode' }
          },
          {
            align: "left",
            title: "健管卡名称",
            dataIndex: "docName"
          },
          {
            align: "left",
            title: "产品代码",
            dataIndex: "productCode"
          },
          {
            align: "left",
            title: "产品名称",
            dataIndex: "productName"
          },
          {
            align: "left",
            title: "生成数量",
            dataIndex: "showNums"
          },
          {
            align: "left",
            title: "操作日期",
            dataIndex: "insertTime"
          }
        ],
        pagination: {
          pageSize: 10,
          current: 1,
          total: 0,
          showTotal: total => `共 ${total} 条数据`,
          showSizeChanger: true,
          pageSizeOptions: ["10", "20", "35", "50"],
          onShowSizeChange: (current, pageSize) => this.onPageSizeChange(current, pageSize),
          onChange: (page, pageSize) => this.onPageChange(page, pageSize)
        }
      }
    },
    mounted () {
      this.searchHandle()
    },
    methods: {
      // 序号
      tableIndex (indexInPerPage) {
        return `${(this.pagination.current - 1) * this.pagination.pageSize + indexInPerPage + 1}`
      },
      radioChange (selectedRowKeys, selectedRows) {
        this.selectedRows = selectedRows
        this.selectedRowKeys = selectedRowKeys
      },
      // 点击表格行选中/反选
      customRow (record, index) {
        return {
          on: {
            click: (e) => {
              let rowKeys = this.selectedRowKeys
              if (rowKeys.length > 0 && rowKeys.includes(record.recordIndex)) { // 反选
                this.selectedRowKeys = []
                this.selectedRows = []
              } else { // 选中
                this.radioChange([record.recordIndex], [record])
              }
            }
          }
        }
      },
      searchHandle () {
        this.$nextTick(() => {
          this.pagination.current = 1
          this.loadPageData()
        })
      },
      onPageChange (page, pageSize) {
        this.pagination.current = page
        this.loadPageData()
      },
      onPageSizeChange (current, size) {
        this.pagination.pageSize = size
        this.searchHandle()
      },
      loadPageData () {
        let query = this.filterForm.getFieldsValue()
        let data = {
          page: this.pagination.current,
          limit: this.pagination.pageSize
        }
        Object.assign(data, query)
        this.loading = true
        api.custCardQuery(data).then(res => {
          console.log(res, 'result')
          this.pageData = res.data || { totalCount: 0, data: [] }
          this.pageData.data.forEach((item, index) => {
            item.recordIndex = this.tableIndex(index) // 设置为序号值
          })
          this.pagination.total = this.pageData.totalCount
        }).finally(() => {
          this.loading = false
        })
      },
      resetFilterForm () {
        this.filterForm.resetFields()
        this.searchHandle()
      },
      showRecordInfo (obj) {

      },
      generateNoPass () {
        this.$refs.cardStockGenerateForm.addForm()
      },
      exportNoPass () {
        if (this.selectedRows.length) {
          this.submitLoading = true
          /* api.custCardExport(this.selectedRows[0]).then(res => {
            let blob = new Blob([res.data], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'})
            let objectUrl = URL.createObjectURL(blob)
            window.open(objectUrl, '_blank')
          }).finally(() => {
            this.submitLoading = false
          }) */

          api.custCardExport(this.selectedRows[0]).then(res => {
            if (res.status === undefined) {
              // base64内容，文件名
              this.$downloadFileByBase64(res, `卡密.xls`)
            } else {
              this.$message.error('文件下载失败,请重试')
            }
          }).finally(() => {
            this.submitLoading = false
          })
        }
      },
      swithTableShow () {
        this.showTable = !this.showTable
        this.iconType = this.showTable ? 'down' : 'up'
      }
    }
  }
</script>
