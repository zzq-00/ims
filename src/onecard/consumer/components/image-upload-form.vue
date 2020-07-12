<template>
  <a-card :bordered="false">
    <a-modal v-model="formModal" style="top: 30px;" :width="1150" title="上传影印件" :footer="null">
      <a-card style="margin-top:24px;">
      <span href="#" slot="title" style="float:left;">
        <a-icon type="bank"/>影印件上传列表</span>
        <a href="#" slot="extra">
          <a-icon :type="iconType" @click="swithTableShow"/>
        </a>
        <a-row :gutter="16" style="margin-bottom:12px;">
          <a-col :span="12" :offset="12">
            <div style="float:right">
              <a-button type="" class="editable-add-btn" @click="queryImage" style="margin-right:5px;">查看图片</a-button>
              <a-button type="primary" class="editable-add-btn" @click="doUploadToHx" style="margin-right:5px;">上传到核心
              </a-button>
              <a-button type="" class="editable-add-btn" @click="doDelete" style="margin-right:5px;">删除</a-button>
            </div>
          </a-col>
        </a-row>
        <a-table @rowClick="selectRowClick" :scroll="{ x: 'max-content'}" v-show="showTable" :bordered="false"
                 :pagination="pagination" :rowSelection="rowSelection" :dataSource="pageData.data" :columns="columns"
                 :rowKey="index => index.index" :indentSize=0 :loading="loading">

        </a-table>
      </a-card>
      <a-card style="margin-top:24px;">
      <span href="#" slot="title" style="float:left;">
        <a-icon type="bank"/>影印件上传</span>
        <div slot="extra" style="float:right">
          <a-button type="primary" class="editable-add-btn" @click="doUpload" style="margin-right:5px;">上传</a-button>
        </div>
        <a-row :gutter="16">
          <a-col :span="6">
            <a-upload
              name="file"
							accept=".jpg,JPG"
              :multiple="false"
              :headers="headers"
              :file-list="fileList"
              :remove="handleRemove"
              :before-upload="beforeUpload">
              <a-button type=""> 添加文件</a-button>
            </a-upload>
          </a-col>
        </a-row>
      </a-card>
    </a-modal>
  </a-card>
</template>
<script>
  import api from '@/api/api-vip'
  import DicSelect from '@/components/dic-select'
  import DicSwitch from '@/components/dic-switch'
  import AddressSelect from '@/components/address-select'
  import moment from 'moment'

  export default {
    name: 'image-upload-form',
    components: {DicSelect, DicSwitch, AddressSelect},
    data() {
      return {
        formModal: false,
        accountData: {},
        fileList: [],
        headers: {},
        pageData: {
          dataCount: 0,
          data: []
        },
        loading: false,
        showTable: true,
        iconType: 'down',
        rowSelection: {
          selectedRowKeys: [],
          onChange: (selectedRowKeys, selectedRows) => {
            this.rowSelection.selectedRowKeys = selectedRowKeys
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
			currRowIndex: -1,
			columns: [
				{
					align: "left",
					dataIndex: "prtno",
					title: "印刷号"
				},
				{
					align: "left",
					dataIndex: "fileName",
					title: "图片名称"
				},
				{
					align: "left",
					dataIndex: "statusName",
					title: "状态"
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
					dataIndex: "modifiername",
					title: "操作人"
				}
			]
		}
	},
	mounted () {

	},
	methods: {
    show(obj) {
      this.$nextTick(() => {
        this.formModal = true;
        this.accountData = Object.assign({}, obj);
        this.searchHandle()
      })
    },
    searchHandle() {
      this.pagination.current = 1;
      this.loadPageData()
    },
    loadPageData() {
      this.rowSelection.selectedRowKeys = [];
      let data = {
        accountid: this.accountData.accountid,
        flowid: this.accountData.flowid,
        prtno: this.accountData.prtno,
        dr: 0,
        page: this.pagination.current,
        limit: this.pagination.pageSize
      };
      this.loading = true;
      api.queryImageUpload(data).then(res => {
        this.pageData = res.data || {totalCount: 0, data: []};
        this.pageData.data.forEach((item, index) => {
          item.recordIndex = index + 1
        });
        this.pagination.total = this.pageData.totalCount
      }).finally(() => {
        this.loading = false
      })
    },
    onPageChange(page, pageSize) {
      this.pagination.current = page;
      this.loadPageData()
    },
    onPageSizeChange(current, size) {
      this.pagination.pageSize = size;
      this.searchHandle()
    },
    selectRowClick(record, index) {
      if (this.currRowIndex === index) {
        this.currRowIndex = -1;
        this.rowSelection.selectedRowKeys = []
      } else {
        this.currRowIndex = index;
        this.rowSelection.selectedRowKeys = [];
        this.rowSelection.selectedRowKeys.push(index)
      }
    },
    swithTableShow() {
      this.showTable = !this.showTable;
      this.iconType = this.showTable ? 'down' : 'up'
    },
    doUpload() {
      let that = this;

      if (this.fileList[0] && this.fileList[0].name) {
        let data = new FormData();
        this.fileList.map((item, index) => {
          data.append('multipartFile', item)
        });
        data.set('accountid', that.accountData.accountid);
        data.set('flowid', that.accountData.flowid);
        data.set('prtno', that.accountData.prtno);
        var index = this.fileList[0].name.lastIndexOf(".");
        var suffix = this.fileList[0].name.substr(index + 1);
        if (suffix !== "jpg") {
          that.$message.error('只允许上传文件后缀名为jpg.jpg的文件！');
          return
        }
        api.uploadImageUploadVipImagepath(data).then(res => {
          if (res.status === 0) {
            that.loadPageData();
            that.$message.success('上传成功');
            this.fileList = []
          } else {
            that.$message.error('上传失败')
          }
        })
      } else {
        this.$message.warning('未指定文件路径！')
      }
    },
    queryImage() {
      let self = this;
      let arr = this.rowSelection.selectedRowKeys;
      if (!arr.length) {
        this.$message.warning('请选择记录!');
        return
      } else if (arr.length > 1) {
        this.$message.warning('此操作不能选择多条数据，请选择一条记录进行此操作!');
        return
      }
      let selectedRecords = self.rowSelection.selectedRowKeys.map(val => {
        return this.pageData.data[val]
      });
      api.queryImageUploadImage(selectedRecords[0].id).then(res => {
        if (res.status === 0) {
          // base64内容，文件名
          this.$downloadFileByBase64(res.data, '图片.jpg')
        } else {
          this.$message.error('文件下载失败,请重试')
        }
      })
    },
    doUploadToHx() {
      let self = this;
      let arr = this.rowSelection.selectedRowKeys;
      if (!arr.length) {
        this.$message.warning('请选择记录!');
        return
      }
      // else if (arr.length > 1) {
      // 	this.$message.warning('此操作不能选择多条数据，请选择一条记录进行此操作!')
      // 	return
      // }
      for (let i = 0; i < this.pageData.data.length; i++) {
        if (this.pageData.data[i].status === '1') {
          this.$message.warning('影印件已上传商保系统，如需修改请在商保系统修改！');
          return
        }
      }
      let selectedRecords = self.rowSelection.selectedRowKeys.map(val => {
        return this.pageData.data[val]
      });
      let ids = '';
      for (let i = 0; i < selectedRecords.length; i++) {
        if (i !== selectedRecords.length - 1) ids += selectedRecords[i].id + ',';
        else ids += selectedRecords[i].id
      }
      self.accountData.ids = ids;
      this.$confirm({
        title: "确认提示",
        content: `上传商保系统后不允许在本系统修改，请确认是否上传?`,
        okType: "danger",
        onOk() {
          return new Promise((resolve, reject) => {
            api.uploadImageUploadToHx(self.accountData).then(res => {
              if (res.status === 0) {
                self.$message.info('上传成功');
                self.loadPageData()
              } else {
                self.$message.error('上传失败')
              }
            }).finally(() => {
              resolve()
            })
          })
        }
      })
    },
    doDelete() {
      let self = this;
      let arr = this.rowSelection.selectedRowKeys;
      if (!arr.length) {
        this.$message.warning('请选择记录!');
        return
      }
      let selectedRecords = self.rowSelection.selectedRowKeys.map(val => {
        return this.pageData.data[val]
      });
      let ids = '';
      for (let i = 0; i < selectedRecords.length; i++) {
        if (selectedRecords[i].status === '1') {
          this.$message.warning('影印件已上传商保系统，不能进行删除');
          return
        }
        if (i !== selectedRecords.length - 1) ids += selectedRecords[i].id + ',';
        else ids += selectedRecords[i].id
      }
      api.deleteImageUploadVipImagepath(ids).then(res => {
        if (res.status === 0) {
          self.$message.error('删除成功');
          self.searchHandle()
        } else {
          self.$message.error('删除失败')
        }
      })
    },
    beforeUpload(file) {
      this.fileList = [];
      this.fileList = [...this.fileList, file];
      return false
    },
    handleRemove(file) {
      const index = this.fileList.indexOf(file);
      const newFileList = this.fileList.slice();
      newFileList.splice(index, 1);
      this.fileList = newFileList
    }
  }
}
</script>
