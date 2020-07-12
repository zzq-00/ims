<template>
  <div style="margin-top: 10px">
    <a-row type="flex" justify="center">
      <a-col :span="22">
        <a-button class="editable-add-btn" @click="showDrawer" v-if="addState()">新增</a-button>
        <a-table bordered :dataSource="userData" :columns="columns" :rowKey="record => record.userId"
                 :indentSize=0 :loading="loading">
          <template slot="operation" slot-scope="text, record">
            <a-popconfirm
              v-if="deleteState()"
              title="Sure to delete?"
              @confirm="() => onDelete(record)">
              <span style="color: red;cursor: pointer">删除</span>
            </a-popconfirm>
            <span style="color: #1890ff;cursor: pointer" @click="editMenu(record)" v-if="editState()">修改</span>
          </template>
        </a-table>
      </a-col>
    </a-row>
    <a-drawer
      :title="addTitle"
      :width="720"
      @close="onClose"
      :visible="visible"
      v-if="visible"
      :wrapStyle="{height: 'calc(100% - 108px)',overflow: 'auto',paddingBottom: '108px'}"
    >
      <a-form layout="vertical" hideRequiredMark :form="form" ref="formValidate">
        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item label="账号">
              <a-input
                v-decorator="['userName', {
                  rules: [{ required: true, message: '请输入账号' }]
                }]"
                placeholder="请输入账号"
              />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="密码">
              <a-input
                v-decorator="['password', {
                  rules: [{ required: true, message: '请输入密码' }]
                }]"
                style="width: 100%"
                placeholder="请输入密码"
              />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item label="姓名">
              <a-input
                v-decorator="['chnName', {
                  rules: [{ required: true, message: '请输入姓名' }]
                }]"
                placeholder="请输入姓名"
              />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="性别">
              <a-input
                v-decorator="['sex', {
                  rules: [{ required: true, message: '请输入性别' }]
                }]"
                style="width: 100%"
                placeholder="请输入性别"
              />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item label="年龄">
              <a-input
                v-decorator="['age', {
                  rules: [{ required: true, message: '请输入年龄' }]
                }]"
                placeholder="请输入年龄"
              />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="电话">
              <a-input
                v-decorator="['phone', {
                  rules: [{ required: true, message: '请输入电话' }]
                }]"
                style="width: 100%"
                placeholder="请输入电话"
              />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item label="手机号">
              <a-input
                v-decorator="['phone', {
                  rules: [{ required: true, message: '请输入手机号' }]
                }]"
                placeholder="请输入手机号"
              />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="状态">
              <a-input
                v-decorator="['status', {
                  rules: [{ required: true, message: '请输入状态' }]
                }]"
                style="width: 100%"
                placeholder="请输入状态"
              />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item label="出生日期">
              <a-input
                v-decorator="['birthday', {
                  rules: [{ required: true, message: '请输入出生日期' }]
                }]"
                placeholder="请输入出生日期"
              />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="身份证">
              <a-input
                v-decorator="['identityCard', {
                  rules: [{ required: true, message: '请输入身份证' }]
                }]"
                style="width: 100%"
                placeholder="请输入身份证"
              />
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
      <div
        :style="{
          position: 'absolute',
          left: 0,
          bottom: 0,
          width: '100%',
          borderTop: '1px solid #e9e9e9',
          padding: '10px 16px',
          background: '#fff',
          textAlign: 'right',
        }"
      >
        <a-button
          :style="{marginRight: '8px'}"
          @click="onClose"
        >
          取消
        </a-button>
        <a-button @click="addItem" type="primary">提交</a-button>
      </div>
    </a-drawer>
  </div>

</template>
<script>
export default {
	components: {},
	data () {
		return {
			loading: false,
			editData: null,
			addTitle: "新增用户",
			visible: false,
			count: 2,
			power:[],
			userData: [
				{
					"userId": "用户ID",
					"chnName": "中文名",
					"engName": "英文名",
					"age": "年龄",
					"sex": "性别",
					"phone": "电话",
					"email": "邮箱",
					"address": "地址",
					"maritalStatus": "婚姻状况",
					"birthday": "生日",
					"identityCard": "身份证号",
					"highestEducation": "最高学历",
					"institute": "毕业学院",
					"major": "专业",
					"graduationTime": "毕业时间",
					"entryTime": "入职时间",
					"status": "状态",
					"type": "类型"
				}
			],
			pageSize: 20,//每页显示多少条
			dataCount: 0,//总条数
			page: 1,//当前页
			columns: [{
				align: "center",
				title: "姓名",
				dataIndex: "chnName"
			}, {
				align: "center",
				title: "性别",
				dataIndex: "sex"
			}, {
				align: "center",
				title: "电话",
				dataIndex: "phone"
			}, {
				align: "center",
				title: "邮箱",
				dataIndex: "email"
			}, {
				align: "center",
				title: "身份证号码",
				dataIndex: "identityCard"
			}, {
				align: "center",
				title: "状态",
				dataIndex: "status"
			}, {
				align: "center",
				title: "操作",
				dataIndex: "operation",
				scopedSlots: { customRender: "operation" }
			}],
			form: this.$form.createForm(this)
		};
	},
  created(){
		// 取出权限串和token，存入data
    console.log(this.$route.query,'============')
		this.power = JSON.parse(this.$route.query.power);
		this.token = this.$route.query.token;
  },
	mounted () {
	},
	methods: {
		editMenu (data) {
			console.log(data);
			this.addTitle = "编辑用戶";
			this.editData = data;
			setTimeout(() => {
				this.form.setFieldsValue(data);
			}, 0);
			this.visible = true;
		},
		showDrawer () {
			this.form.resetFields();
			this.editData = null;
			this.visible = true;
		},
		addItem () {
			if (this.editData) {
				this.form.validateFields((error, values) => {
					values.userId = this.editData.userId;
					if (!error) {
						console.log('这是修改！！！')
					}
				});
			} else {
				this.form.validateFields((error, values) => {
					console.log("402", values);
					if (!error) {
						console.log("这是新增！！！！");
					}
				});
			}
		},
		onClose () {
			this.visible = false;
		},
		onDelete (data) {
			console.log('这是删除！！！！！')
		},
    addState(){
			return this.power.every(prod=>prod.actionValue === 'insert')
    },
		editState(){
			return this.power.every(prod=>prod.actionValue === 'update')
		},
		deleteState(){
			return this.power.every(prod=>prod.actionValue === 'delete')
		},
	},
};
</script>
<style>
  .editable-cell {
    position: relative;
  }

  .editable-cell-input-wrapper,
  .editable-cell-text-wrapper {
    padding-right: 24px;
  }

  .editable-cell-text-wrapper {
    padding: 5px 24px 5px 5px;
  }

  .editable-cell-icon,
  .editable-cell-icon-check {
    position: absolute;
    right: 0;
    width: 20px;
    cursor: pointer;
  }

  .editable-cell-icon {
    line-height: 18px;
    display: none;
  }

  .editable-cell-icon-check {
    line-height: 28px;
  }

  .editable-cell:hover .editable-cell-icon {
    display: inline-block;
  }

  .editable-cell-icon:hover,
  .editable-cell-icon-check:hover {
    color: #108ee9;
  }

  .editable-add-btn {
    margin-bottom: 8px;
  }
</style>
