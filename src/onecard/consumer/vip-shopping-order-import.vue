<template>
  <a-card :bordered="false">
    <a-card>
      <a-divider orientation="left"><a-icon type="bank" /> 查询条件</a-divider>
      <a-form :form="filterForm" :labelCol="filterFormLayout.labelCol" :wrapperCol="filterFormLayout.wrapperCol">
        <a-row :gutter="16">
          <a-col :span="6">
            <a-form-item label="文件名">
              <a-input v-decorator="['fileName', {initialValue: ''}]" />
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="上传日期">
              <a-week-picker format="YYYY-MM-DD" v-decorator="['uploadtime']"/>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :span="12" :offset="11">
            <a-button type="" class="editable-add-btn" @click="resetFilterForm" style="float:right;margin-right:10px;">重置</a-button>
            <a-button type="" class="editable-add-btn" @click="searchHandle" style="float:right;margin-right:10px;">查询</a-button>
          </a-col>
        </a-row>
      </a-form>
    </a-card>
    <a-card style="margin-top:24px;">
      <span href="#" slot="title" style="float:left;">
        <a-icon type="bank" />购买上传列表</span>
      <a href="#" slot="extra">
        <a-icon :type="iconType" @click="swithTableShow" />
      </a>
      <a-row :gutter="16" style="margin-bottom:12px;">
        <a-col :span="12" :offset="12">
          <div style="float:right">
            <a-button type="primary" class="editable-add-btn" @click="doErrDownload" style="margin-right:5px;">错误下载</a-button>
            <a-button type="primary" class="editable-add-btn" @click="doImport" style="margin-right:5px;">导入</a-button>
          </div>
        </a-col>
      </a-row>
      <a-table @rowClick="selectRowClick" :scroll="{ x: 'max-content'}" v-show="showTable" :bordered="false" :pagination="pagination" :rowSelection="rowSelection" :dataSource="pageData.data" :columns="columns" :rowKey="index => index.index" :indentSize=0 :loading="loading">

      </a-table>
    </a-card>

    <a-card style="margin-top:24px;">
      <span href="#" slot="title" style="float:left;">
        <a-icon type="bank" />团体购买上传</span>
      <div slot="extra" style="float:right">
        <a-button type="primary" class="editable-add-btn" @click="doUpload" style="margin-right:5px;">上传</a-button>
      </div>
      <a-row :gutter="16">
        <a-col :span="6">
          <a-upload
            name="file"
            accept=".xlsx,.xls"
            :multiple="false"
            :headers="headers"
            :file-list="fileList"
            :remove="handleRemove"
            :before-upload="beforeUpload">
            <a-button type=""> 添加文件 </a-button>
          </a-upload>
        </a-col>
      </a-row>
    </a-card>
  </a-card>
</template>
<script>
  import api from '@/api/api-vip'
  import DicSelect from '@/components/dic-select'
  import DicSwitch from '@/components/dic-switch'
  import AddressSelect from '@/components/address-select'
  import moment from 'moment'

  export default {
    name: 'vip-shopping-order-import',
    components: {DicSelect, DicSwitch, AddressSelect},
    data() {
      const self = this;
      return {
        inputCompact: {
          dealtypeValue: 1,
          receivetypeValue: 1
        },
        // 查询条件
        filterFormLayout: {
          labelCol: {span: 9},
          wrapperCol: {span: 15}
        },
			filterForm: this.$form.createForm(this),
			formData: {},
			headers: {},
			isuploadFile: true,
			fileList: [],
			pageData: {
				dataCount: 0,
				data: []
			},
			loading: false,
			showTable: true,
			iconType: 'down',
			rowSelection: {
       		type: 'radio',
				  selectedRowKeys: [],
				  selectedRows: [],
				  onChange: (selectedRowKeys, selectedRows) => {
            self.rowSelection.selectedRows = [];
            self.rowSelection.selectedRowKeys = [];
            self.rowSelection.selectedRows = selectedRows;
            self.rowSelection.selectedRowKeys = selectedRowKeys
          }
			},
			pagination: {
				pageSize: 10,
				current: 1,
				total: 0,
				showTotal: total => `共 ${total} 条数据`,
				showSizeChanger: true,
				pageSizeOptions: ["10", "20", "35", "50"],
				onShowSizeChange: (current, pageSize) => this.onPageSizeChange(current, pageSize),
				onChange: (page, pageSize) => this.onPageChange(page, pageSize)
			},
			// currRowIndex: -1,
			columns: [
				{
					align: "left",
					dataIndex: "fileName",
					title: "文件名称"
				},
				{
					align: "left",
					dataIndex: "importstatusName",
					title: "导入状态"
				},
				{
					align: "left",
					dataIndex: "uploadtime",
					title: "上传日期",
					customRender: (text) => {
						return text ? moment(text).format('YYYY-MM-DD') : ''
					}
				},
				{
					align: "left",
					dataIndex: "importtime",
					title: "导入日期",
					customRender: (text) => {
						return text ? moment(text).format('YYYY-MM-DD') : ''
					}
				},
				{
					align: "left",
					dataIndex: "importmessage",
					title: "导入信息"
				},
				{
					align: "left",
					dataIndex: "modifiername",
					title: "操作人"
				}
			]
		}
	},
	mounted () {
		this.searchHandle()
	},
	methods: {
		resetFilterForm () {
			this.filterForm.resetFields()
			// this.searchHandle()
		},
		searchHandle () {
			this.$nextTick(() => {
				// this.pagination.current = 1;
				this.loadPageData()
			})
		},
		loadPageData () {
      let query = this.filterForm.getFieldsValue();
      if (query.uploadtime) {
        query.uploadtime = moment(query.uploadtime).format('YYYY-MM-DD')
      } else {
        query.uploadtime = ''
      }
      let data = {
        page: this.pagination.current,
        limit: this.pagination.pageSize
      };
      Object.assign(data, query);
      this.loading = true;
      api.querySOUploadInfo(data).then(res => {
        this.pageData = res.data || {totalCount: 0, data: []};
        this.pageData.data.forEach((item, index) => {
          item.recordIndex = index + 1
        });
        this.pagination.total = this.pageData.totalCount;
        this.rowSelection.selectedRows = [];
        this.rowSelection.selectedRowKeys = []
      }).finally(() => {
        this.loading = false
			})
		},
		onPageChange (page, pageSize) {
      this.pagination.current = page;
      this.loadPageData()
    },
		onPageSizeChange (current, size) {
			this.pagination.pageSize = size
			/* this.searchHandle() */
		},
		selectRowClick (record, index) {
			// if (this.currRowIndex === index) {
			//   this.currRowIndex = -1;
			//   this.rowSelection.selectedRowKeys = []
			// } else {
			//   this.currRowIndex = index;
			//   this.rowSelection.selectedRowKeys = [];
			//   this.rowSelection.selectedRowKeys.push(index)
			// }
		},
		swithTableShow () {
      this.showTable = !this.showTable;
      this.iconType = this.showTable ? 'down' : 'up'
    },
		doUpload () {
      let that = this;
      if (that.fileList.length > 1) {
        this.$message.warning('每次只允许上传一个文件！');
        return
      }

      if (this.fileList[0] && this.fileList[0].name) {
        let data = new FormData();
        this.fileList.map((item, index) => {
          data.append('excelFile', item)
        });
        let hz = this.fileList[0].name.substring(this.fileList[0].name.lastIndexOf("."));
        if (hz === '.xls' || hz === '.xlsx') {
          api.uploadSOFile(data).then(res => {
            if (res.status === 0) {
              that.loadPageData();
              that.$message.success('上传成功');
              // 上传成功后，清空
              this.fileList = []
            } else {
              that.$message.error('上传失败')
            }
					})
				} else {
					this.$message.warning('只允许上传文件后缀名为xls,xlsx的文件!')
				}
			} else {
				this.$message.warning('未指定文件路径！')
			}
		},
		doErrDownload () {
      if (this.rowSelection.selectedRows.length === 0) {
        this.$message.warning('请选择一条记录!');
        return
      }
      let that = this;
      if (that.rowSelection.selectedRows[0].importstatus != '2') {
        this.$message.warning('没有错误文件，无法下载!');
        return
      }
      // let vipFilepathId = this.pageData.data[this.currRowIndex].id;
      // let fileName = this.pageData.data[this.currRowIndex].fileName;
      let vipFilepathId = this.rowSelection.selectedRows[0].id;
      let fileName = this.rowSelection.selectedRows[0].fileName;
      api.downloadErrorFromServer(vipFilepathId).then(res => {
        if (res.status === undefined) {
          this.$downloadFileByBase64(res, fileName)
        } else {
          that.$message.error('下载失败')
        }
      })
    },
		doImport () {
      // 确认已经选择一行作为导入的对象
      if (this.rowSelection.selectedRows.length === 0) {
        this.$message.warning('请选择一条记录!');
        return false
      }
      // 禁止重复导入
      if (this.rowSelection.selectedRows[0].importstatus !== '0') {
        this.$message.warning('不能重复导入!');
        return false
      }
      let self = this;
      api.importSOFile(this.rowSelection.selectedRows[0]).then(res => {
        debugger
        if (res.status === 0) {
          if (res.data.importmessage === '导入失败，数据模板不正确！') {
            self.$message.error('导入失败')
          } else {
            self.$message.success('导入成功')
          }
          self.loadPageData()
        } else {
					self.$message.error('导入失败')
				}
			})
		},
		handleChange () {
			this.isuploadFile = false
		},
		beforeUpload (file) {
      // 添加第二个文件，清空
      this.fileList = [];
      this.fileList = [...this.fileList, file];
      return false
    },
		handleRemove (file) {
      const index = this.fileList.indexOf(file);
      const newFileList = this.fileList.slice();
      newFileList.splice(index, 1);
      this.fileList = newFileList
    }
	}
}
</script>
