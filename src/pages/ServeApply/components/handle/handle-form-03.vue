<template>
  <div>
    <a-form :form="filterForm" :labelCol="dataFormLayout.labelCol" :wrapperCol="dataFormLayout.wrapperCol">
      <a-card style="margin: 24px;">
        <a-divider orientation="left">服务信息</a-divider>
        <a-row>
          <a-col :span="6">
            <a-form-item label="来源">
              <a-input :value="taskInfo.channelTypeDesc" :disabled="true" />
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="申请服务">
              <a-input :value="taskInfo.serviceName" :disabled="true" />
            </a-form-item>
          </a-col>
        </a-row>
      </a-card>

      <a-card style="margin: 24px;">
        <a-divider orientation="left">使用人信息</a-divider>
        <a-row>
          <a-col :span="6">
            <a-form-item label="使用人姓名">
              <a-input :value="taskInfo.patientName" :disabled="true" />
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="性别">
              <!-- ==='01'?'男':'' -->
              <a-input :value="taskInfo.patientGenderDesc" :disabled="true" />
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="证件类型">
              <a-input :value="taskInfo.patientCerttypeDesc" :disabled="true" />
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="证件号码">
              <a-input :value="taskInfo.patientCertno" :disabled="true" />
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="手机号码">
              <a-input :value="taskInfo.patientTelephone" :disabled="true" />
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="出生日期">
              <a-input :value="taskInfo.patientBirthDate" :disabled="true" />
            </a-form-item>
          </a-col>
        </a-row>
      </a-card>

      <a-card style="margin: 24px;">
        <a-divider orientation="left">联系人信息</a-divider>
        <a-row>
          <a-col :span="6">
            <a-form-item label="人姓名">
              <a-input  :value="taskInfo.linkmanName" :disabled="true" />
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="证件类型">
              <a-input  :value="taskInfo.linkmanCerttypeDesc" :disabled="true" />
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="证件号码">
              <a-input  :value="taskInfo.linkmanCertno" :disabled="true" />
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="手机号码">
              <a-input :value="taskInfo.linkmanPhone" :disabled="true" />
            </a-form-item>
          </a-col>
        </a-row>
      </a-card>

      <a-card style="margin: 24px;">
        <a-divider orientation="left">预约信息</a-divider>
        <a-row>
          <a-col :span="12">
            <a-form-item label="主要疾病或症状" :labelCol="{span: 4}" :wrapperCol="{span: 20}">
              <a-input :disabled="status"  v-decorator="['disease']"/>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="24">
            <a-form-item label="具体描述" :labelCol="{span: 2}" :wrapperCol="{span: 22}">
              <a-textarea  :disabled="status" v-decorator="['detailedDescription']"  :autoSize="{ minRows: 4, maxRows: 6 }" placeholder="1.客户因为该疾病或症状去过哪些，什么科室就诊?什么诊断?2.本次服务预约希望解决的问题是什么?3.其他需要备注的信息" />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="16">
            <a-form-item label="医疗机构" :labelCol="{span: 3}" :wrapperCol="{span: 20}">
              <a-input-search :readOnly="true"  v-decorator="['merchantName', {rules: [{ required: true, message: '医疗机构不能为空!' }]}]" enter-button @search="onSearchSorg" :disabled="status" />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="6">
            <a-form-item label="期望医生">
              <a-input :disabled="status" v-decorator="['resmedDoctorName']" />
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="是否需要特需门诊">
              <DicSelect dicType="YES_NO" :disabled="status" v-decorator="['specialFlag', {rules: [{ required: true, message: '不能为空!' }]}]" />
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="是否有所在地医保卡">
              <DicSelect dicType="YES_NO" :disabled="status" v-decorator="['medicareFlag', {rules: [{ required: true, message: '不能为空!' }]}]" />
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="期望就诊时间">
              <DicSelect dicType="RESMED_DATE_TYPE" v-decorator="['resmedDateType', {rules: [{ required: true, message: '不能为空!' }]}]" :disabled="true"/>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <!-- 期望就诊时间选定会出现不方便就诊时间可以点击指定就诊时间不可以点击，当期望就诊时间为空时不方便就怎时间不可以点击和指定就诊时间可以点击 -->
          <a-col :span="8">
            <a-form-item label="指定就诊时间" :labelCol="{span: 6}">
              <a-select v-decorator="['resmedDates']" v-model="resmedDates" mode="multiple" :disabled="filterForm.getFieldsValue().resmedDateType === '1'||true">
                <a-select-option v-for="item in applyDateList" :key="item" :value="item">{{item}}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="不方便就诊时间" :labelCol="{span: 7}">
              <a-select v-decorator="['notResmedDates']" v-model="notResmedDates" mode="multiple" :maxLength="2" :disabled="filterForm.getFieldsValue().resmedDateType === '2'||true">
                <a-select-option v-for="item in applyDateList" :key="item" :value="item">{{item}}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="8" v-show="contTypeflag">
            <a-form-item label="健管中心预约时间">
              <a-select v-decorator="['jgResmedDates']" v-model="jgResmedDates" mode="multiple" :maxLength="1" :disabled="true">
                <a-select-option v-for="item in applyDateList" :key="item" :value="item">{{item}}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>
          <a-row>
              <a-col :span="16">
                  <a-form-item label="就诊卡号" :labelCol="{span: 3}">
                      <a-input v-decorator="['medredCardno', {rules: [{ required: false, message: '保单号不能为空!' }]}]"/>
                  </a-form-item>
              </a-col>
          </a-row>
        <a-row>
          <a-col :span="24" :push="2" style="text-align:left;font-weight:bold;">
            <span>1）特需门诊挂号费在150-800元间，每个机构每个医生不同。2）儿研所只有特需门诊,儿童机构需要提前自行办理机构就诊卡</span>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="24">
            <a-form-item label="备注" :labelCol="{span: 2}" :wrapperCol="{span: 22}">
              <a-textarea :disabled="true" v-decorator="['remark', {}]" :autoSize="{ minRows: 4, maxRows: 6 }" />
            </a-form-item>
          </a-col>
        </a-row>
      </a-card>

      <a-card style="margin: 24px;">
        <a-divider orientation="left">自建签约</a-divider>
        <a-table :bordered="false" :pagination="pagination" :dataSource="pageData.data" :columns="columns" :rowKey="record => record.recordIndex" :indentSize="0" :loading="loading"
          :row-selection="{ type: 'checkbox', selectedRowKeys: selectedRowKeys, onChange: onRowChange }">
		  <!-- <a slot="serviceName" @click="showRecordInfo(record)" slot-scope="text, record">{{ text }}</a> -->
		  <template slot="price" slot-scope="text, record">
            <editable-cell :text="text" @change="onCellChange(record.recordIndex, 'price', $event)" />
          </template>

        </a-table>
      </a-card>

      <a-card style="margin: 24px;">
        <a-divider orientation="left">第三方签约</a-divider>
         <a-table :scroll="{ x: 'max-content'}"  :bordered="false" :pagination="pagination1" :dataSource="pageData1.data" :columns="columns1" :rowKey="record => record.recordIndex" :indentSize="0" :loading="loading1"
						:row-selection="{ type: 'checkbox', selectedRowKeys: selectedRowKeys1, onChange: onRowChange1 }">
              <template slot="ordinaryPrice" slot-scope="text, record">
                <editable-cell :text="text+''" @change="onCellChange1(record.recordIndex, 'ordinaryPrice', $event)" />
              </template>
              <template slot="specialPrice" slot-scope="text, record">
                <editable-cell :text="text+''" @change="onCellChange1(record.recordIndex, 'specialPrice', $event)" />
              </template>
              <template slot="internationalPrice" slot-scope="text, record">
                <editable-cell :text="text+''" @change="onCellChange1(record.recordIndex, 'internationalPrice', $event)" />
              </template>
              <template slot="enquiryTimeDay" slot-scope="text, record">
                <editable-cell-select :text="text" :arr="arrDate" @change="onCellChange1(record.recordIndex, 'enquiryTimeDay', $event)" />
                <!-- <editable-cell :text="text" @change="onCellChange1(record.recordIndex, 'enquiryTimeDay', $event)" /> -->
              </template>
              <template slot="enquiryTimeDesc" slot-scope="text, record">
                <!-- <editable-cell :text="text" @change="onCellChange1(record.recordIndex, 'enquiryTimeDesc', $event)" /> -->
                <editable-cell-select :text="text" :arr="arrTime" @change="onCellChange1(record.recordIndex, 'enquiryTimeDesc', $event)" />
              </template>
              <template slot="feedbackTimeDay" slot-scope="text, record">
               <editable-cell-select :text="text" :arr="arrDate" @change="onCellChange1(record.recordIndex, 'feedbackTimeDay', $event)" />
                <!-- <editable-cell :text="text" @change="onCellChange1(record.recordIndex, 'feedbackTimeDay', $event)" /> -->
              </template>
               <template slot="feedbackTimeDesc" slot-scope="text, record">
                <editable-cell-select :text="text" :arr="arrTime1" @change="onCellChange1(record.recordIndex, 'feedbackTimeDesc', $event)" />
              </template>
					</a-table>
          <br>
        <a-button type="primary" :disabled="status" style="float:right;margin-right:10px;" @click="onSearchThree">添加第三方询价</a-button>
      </a-card>

      <a-card style="margin: 24px;">
        <a-divider orientation="left">分公司自行解决号源</a-divider>
          <a-table :bordered="false" :pagination="pagination2" :dataSource="pageData2.data" :columns="columns2" :rowKey="record => record.recordIndex" :indentSize="0" :loading="loading2"
						:row-selection="{ type: 'checkbox', selectedRowKeys: selectedRowKeys2, onChange: onRowChange2 }">

          <template slot="price2" slot-scope="text, record">
            <editable-cell :text="text" @change="onCellChange2(record.recordIndex, 'price', $event)" />
          </template>

					</a-table>
          <br>
          <a-button type="primary" :disabled="status" style="float:right;margin-right:10px;" @click="onSearchHins">添加号源</a-button>
          <br><br>
	  </a-card>
		<a-card style="margin: 24px;">
		  <a-row type="flex" justify="space-around" align="middle">
			<a-col :span="8">
				<a-form-item label="预约就诊时间" :labelCol="{span: 8}">
					<a-date-picker style="width:300px;" show-time :disabled="status" v-decorator="['payDateStr',{rules: [{ required: true, message: '不能为空!' }]}]" format="YYYY-MM-DD HH:mm"/>
				</a-form-item>
		   </a-col>
           <a-col :span="16">
            <a-form-item label="选择第三方原因" :labelCol="{span: 8}" >
              <a-select :allowClear="true" placeholder="请选择" :disabled="status"  v-decorator="['reason']">
                <a-select-option value="整体服务最好（包括分诊、陪诊、诊后指导等）">
					整体服务最好（包括分诊、陪诊、诊后指导等）
                </a-select-option>
                <a-select-option value="服务价格最优">
					服务价格最优
                </a-select-option>
                <a-select-option value="整体服务最好（包括分诊、陪诊、诊后指导等）且服务价格最优">
					整体服务最好（包括分诊、陪诊、诊后指导等）且服务价格最优
                </a-select-option>
                <a-select-option value="号源为普通专家门诊" >
                  号源为普通专家门诊
                </a-select-option>
                <a-select-option value="看诊日期或时间较其他第三方靠前" >
                  看诊日期或时间较其他第三方靠前
                </a-select-option>
                <a-select-option value="反馈号源预约成功最及时" >
                  反馈号源预约成功最及时
                </a-select-option>
                <a-select-option value="只有该第三方能够提供本次服务">
                  只有该第三方能够提供本次服务
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="24">
            <a-form-item label="备注" :labelCol="{span: 2}" :wrapperCol="{span: 22}">
              <a-textarea :disabled="status" v-model="remark2" :autoSize="{ minRows: 4, maxRows: 6 }" />
            </a-form-item>
          </a-col>
        </a-row>
      </a-card>
    </a-form>

    <div style="margin: 0 0 10px 0">
      <a-button type=""  @click="onSearchOldApply" :disabled="status">查看历史记录</a-button>
      <a-button type="primary" @click="submitForm('01')" :disabled="status">保存</a-button>
      <a-popconfirm title="是否确认提交，提交后不可修改" @confirm="submitForm('02')" ok-text="确认" cancel-text="取消">
        <a-button type="primary" :disabled="status">提交</a-button>
      </a-popconfirm>
      <a-button type="" :disabled ="status" @click="cancelApplyInfo">撤销申请</a-button>
    </div>
    <!-- 医疗机构 查询模态 -->
    <SorgSelectModal ref="sorgSelectModal" @on-update="onSelectSorgHandle" />
    <!-- 第三方询价签约 -->
    <ThreeSelectModal ref="threeSelectModal" @on-update="onSelectThreeHandle" />
    <!-- 第三方询价下一步弹窗 -->
    <ThreeChooseModal ref="threeChooseModal" @on-update="onChooseThreeHandle" />
    <!-- 添加号源弹窗 -->
    <HinsSelectModal ref="hinsSelectModal" @on-update="onSelectHinsHandle" />
    <!-- 历史记录弹窗弹窗 -->
    <OldApplyModal ref="oldapplyModal" @on-update="onOldApplyHandle" />
    <!-- 撤销申请 要进行短信发送的框 -->
    <MassTextMessageSingle ref="massTextMessageSingle" @on-update="closeForm"/>
    <MassTextMessages ref="massTextMessages" @on-update="stepNext"/>
    <ApplyInfoForm ref="applyInfoForm" />
  </div>
</template>
<script>
import api from '@/api/api-serve-apply'
import DicSelect from '@/components/dic-select'
import SorgSelectModal from '../sorg-select-modal'
import ThreeSelectModal from '../three-select-modal'
import ThreeChooseModal from '../three-choose-modal'
import HinsSelectModal from '../hins-select-modal'
import OldApplyModal from '../old-apply-modal'
import EditableCell from '../editable-cell'
import EditableCellSelect from '../editable-cell-select'
import MassTextMessageSingle from '../../mass-text-message-single'
import MassTextMessages from '../../mass-text-messages'
import ApplyInfoForm from "../apply-info-form"
import moment from 'moment'
export default {
	components: {
		SorgSelectModal,
		DicSelect,
		ThreeSelectModal,
		HinsSelectModal,
		OldApplyModal,
		ThreeChooseModal,
		EditableCell,
		EditableCellSelect,
		MassTextMessageSingle,
		MassTextMessages,
		ApplyInfoForm
	},
	props: {
		taskInfo: {
			type: Object,
			default () {
				return {}
			}
		}
	},
	data () {
		return {
			dataFormLayout: {
				labelCol: { span: 8 },
				wrapperCol: { span: 16 }
			},
			spinning: false,
			submitLoading: false,
			contTypeflag: false, // 控制健康中心预约时间字段是否出现
			resmedDates: [],
			notResmedDates: [],
			jgResmedDates: [],
			applyDateList: [], // 获取初始化时间
			remark2: '',
			status: false, // 是否可点击 控制预约的全局
			filterForm: this.$form.createForm(this),
			// 自建签约
			pageData: {
				dataCount: 0,
				data: []
			},
			selectedRows: [],
			selectedRowKeys: [],
			loading: false,
			columns: [
				{ title: "序号", dataIndex: "recordIndex" },
				{ title: "供应商名称", dataIndex: "supplierName" },
				{ title: "管理机构", dataIndex: "orgName" },
				{ title: "签约方式", dataIndex: "contType" },
				{ title: "价格", dataIndex: "price", scopedSlots: { customRender: 'price' } }
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
			},
			// 第三方签约
			pageData1: {
				dataCount: 0,
				data: []
			},
			selectedRows1: [],
			selectedRowKeys1: [],
			loading1: false,
			columns1: [
				{ title: "序号", dataIndex: "recordIndex" },
				{ title: "供应商名称", dataIndex: "supplierName" },
				{ title: "管理机构", dataIndex: "orgName" },
				{ title: "联系人", dataIndex: "supplierLinkman" },
				{ title: "联系电话", dataIndex: "supplierTel" },
				{ title: "邮箱", dataIndex: "supplierZipcode" },
				{ title: "询价日期", dataIndex: "enquiryTimeDay", scopedSlots: { customRender: 'enquiryTimeDay' } },
				{ title: "询价时间", dataIndex: "enquiryTimeDesc", scopedSlots: { customRender: 'enquiryTimeDesc' } },
				{ title: "普通价格", dataIndex: "ordinaryPrice", scopedSlots: { customRender: 'ordinaryPrice' } },
				{ title: "特需价格", dataIndex: "specialPrice", scopedSlots: { customRender: 'specialPrice' } },
				{ title: "国际价格", dataIndex: "internationalPrice", scopedSlots: { customRender: 'internationalPrice' } },
				{ title: "反馈日期", dataIndex: "feedbackTimeDay", scopedSlots: { customRender: 'feedbackTimeDay' } },
				{ title: "反馈时间", dataIndex: "feedbackTimeDesc", scopedSlots: { customRender: 'feedbackTimeDesc' }, width: 200 }
			],
			pagination1: {
				// pageSize: 10,
				// current: 1,
				// total: 0,
				// showTotal: total => `共 ${total} 条数据`,
				// showSizeChanger: true,
				// pageSizeOptions: ["10", "20", "35", "50"],
				// onShowSizeChange: (current, pageSize) => this.onPageSizeChange1(current, pageSize),
				// onChange: (page, pageSize) => this.onPageChange1(page, pageSize)
			},
			// 分公司自行解决号源
			pageData2: {
				dataCount: 0,
				data: []
			},
			selectedRows2: [],
			selectedRowKeys2: [],
			loading2: false,
			columns2: [
				{ title: "序号", dataIndex: "recordIndex" },
				{ title: "供应商名称", dataIndex: "supplierName" },
				{ title: "管理机构", dataIndex: "orgName" },
				{ title: "省", dataIndex: "orgPrivinceDesc" },
				{ title: "市", dataIndex: "orgCityDesc" },
				{ title: "价格", dataIndex: "price", scopedSlots: { customRender: 'price2' } }
			],
			pagination2: {
				pageSize: 10,
				current: 1,
				total: 0,
				showTotal: total => `共 ${total} 条数据`,
				showSizeChanger: true,
				pageSizeOptions: ["10", "20", "35", "50"],
				onShowSizeChange: (current, pageSize) => this.onPageSizeChange2(current, pageSize),
				onChange: (page, pageSize) => this.onPageChange2(page, pageSize)
			},
			// 当日时间
			arrTime: {
				type: 'time',
				arr: []
			},
			arrTime1: {
				type: 'time',
				arr: []
			},
			arrDate: {
				type: 'date',
				arr: []
			}

		}
	},
	mounted () {
		this.initLoad()
	},
	methods: {
		initLoad () {
			console.log('03页面数据', this.taskInfo)
			this.taskInfo.accompanyRemark = 'Aikes'
			this.status = parseInt(this.taskInfo.status) > 3// 判断是否已过了该步骤
			this.amountTime()// 获取当日时间
			if (this.taskInfo.orgType === "04") {
				this.checkHinsService()
				this.contTypeflag = true
			} else {
				this.contTypeflag = false
			}

			if (this.taskInfo.status !== "03") {
				this.getApplyTrace()
			}
			// console.log("页面的初始化值",this.taskInfo)
			this.$nextTick(() => {
			    this.initValue(this.taskInfo)// 初始化页面值
			})
			this.initTable()
		},
		initTable () {
			this.searchHandle()// 第三方机构签约
			this.searchHandle1()// 自建签约、已选询价机构
			this.searchHandle2()// 分公司自行解决号源
		},
		// 初始化赋值
		initValue (data) {
			this.filterForm.setFieldsValue({
				disease: data.disease,
				detailedDescription: data.detailedDescription,
				merchantName: data.sorgName + data.deptName,
				resmedDoctorName: data.resmedDoctorName,
				specialFlag: data.specialFlag,
				medicareFlag: data.medicareFlag,
				resmedDateType: data.resmedDateType,
				remark: this.getRemark(data.remark, 1), // 1代表服务分诊
				reason: this.reason ? this.reason : data.reason,
			    remark2: this.getRemark(data.remark, 2),
			    resmedDates: this.getAarray(data.resmedDates),
			    notResmedDates: this.getAarray(data.notResmedDates),
			    jgResmedDates: this.getAarray(data.jgResmedDates),
				medredCardno: data.medredCardno
			})
			if (data.payDateStr || data.payDate) {
			    this.filterForm.setFieldsValue({
				    payDateStr: moment(data.payDateStr || data.payDate, 'YYYY-MM-DD HH:mm')
			    })
			}
			this.remark2 = this.getRemark(data.remark, 2)
			this.resmedDates = this.getAarray(data.resmedDates)
			this.notResmedDates = this.getAarray(data.notResmedDates)
			this.jgResmedDates = this.getAarray(data.jgResmedDates)
		},

		// 数字验证
		isNumber (val) {
			var regPos = /^\d+(\.\d+)?$/ // 非负浮点数
			var regNeg = /^(-(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*)))$/ // 负浮点数
			if (val) {
				if (regPos.test(val) || regNeg.test(val)) {
					return true
				} else {
					return false
				}
			} else {
				return true
			}
			// let n = val
			// if(typeof val ==== 'string')n = parseFloat(val)
			// return !isNaN(n);
		},

		// 验证浮点数小数大于两位的
		isFloatBig (num) {
			let str = num.toString()
			if (str.indexOf(".") > -1 && str.split(".")[1].length > 2) {
				return true
			} else {
				return false
			}
		},
		format (m) {
			return m < 10 ? '0' + m : m
		},
		// 保存提交--主要进行入参的处理
		submitForm (addType) { // addType 01保存 02提交
			let taskInfo = this.taskInfo
			let ThirdPartyEnquiryLists = {}
			// console.log('第三方表格数据',JSON.stringify(this.selectedRows1))
			this.filterForm.validateFields((error, values) => {
				if (error) {
					this.$message.error("表单填写不完整！")
					return
				}
				let data = this.filterForm.getFieldsValue()
				// 字段验证
				if (this.contTypeflag) {
					if (this.jgResmedDates && this.jgResmedDates.length > 0) {
						data.jgResmedDates = this.jgResmedDates.join(',')
					} else {
						return this.$message.error("健管中心预约时间不可为空！")
					}
				}
				if (!values.payDateStr) {
					this.$message.error("请检查预约就诊时间是否填写完整!")
					return
				}
				// console.log(moment(values.payDateStr).format('YYYY-MM-DD HH:mm'))
				// format="YYYY-MM-DD HH:mm"
				data.payDateStr = moment(values.payDateStr).format('YYYY-MM-DD HH:mm')

				// 其他机构预约的验证
				if (this.selectedRows.length + this.selectedRows1.length + this.selectedRows2.length > 1) {
					this.$message.warning('自建签约机构,第三方机构,分公司自行解决号源只可选择一个!')
					return
				}
				if (addType === '02') {
					if (this.selectedRows.length === 0 && this.selectedRows1.length === 0 && this.selectedRows2.length === 0) {
						this.$message.error("请选择自建签约供应商或第三方供应商或者分公司自行解决号源!")
						return
					}
				}
				// 自建价格判断
				if (this.selectedRows.length === 1) {
					if (values.reason) {
						this.$message.warning('自建签约机构不可选择第三方原因!')
						return
					}
					let n = this.selectedRows[0].price
					if (!this.isNumber(n)) {
						this.$message.error("价格格式录入错误!")
						return
					}
					if (this.isFloatBig(n)) {
						this.$message.error("价格小数点后最多可保留两位!")
						return
					}
				}
				// 第三方价格判断
				if (this.selectedRows1.length === 1) {
					if (!values.reason) {
						this.$message.warning('第三方供应商必须选择第三方原因!')
						return
					}
					var n1 = this.selectedRows1[0].ordinaryPrice// ThirdPartyInfo
					var n2 = this.selectedRows1[0].specialPrice
					var n3 = this.selectedRows1[0].internationalPrice
					var n4 = this.selectedRows1[0].feedbackTimeDay
					var n5 = this.selectedRows1[0].feedbackTimeDesc
					if (!this.isNumber(n1)) {
						this.$message.error("普通价格格式录入错误!")
						return
					}
					if (!this.isNumber(n2)) {
						this.$message.error("特需价格格式录入错误!")
						return
					}
					if (!this.isNumber(n3)) {
						this.$message.error("国际价格格式录入错误!")
						return
					}
					if (this.isFloatBig(n1)) {
						this.$message.error("普通价格小数点后最多可保留两位!")
						return
					}
					if (this.isFloatBig(n2)) {
						this.$message.error("特需价格小数点后最多可保留两位!")
						return
					}
					if (this.isFloatBig(n3)) {
						this.$message.error("国际价格小数点后最多可保留两位!")
						return
					}
					if (n1 > 0) {
						if (n2 > 0 || n3 > 0) {
							this.$message.error("只可录入一个价格!")
							return
						}
						this.selectedRows1[0].price = n1
						this.selectedRows1[0].specialPrice = 0
						this.selectedRows1[0].internationalPrice = 0
					}
					if (n2 > 0) {
						if (n1 > 0 || n3 > 0) {
							this.$message.error("只可录入一个价格!")
							return
						}
						this.selectedRows1[0].price = n2
						this.selectedRows1[0].ordinaryPrice = 0
						this.selectedRows1[0].internationalPrice = 0
					}
					if (n3 > 0) {
						if (n2 > 0 || n1 > 0) {
							this.$message.error("只可录入一个价格!")
							return
						}
						this.selectedRows1[0].price = n3
						this.selectedRows1[0].ordinaryPrice = 0
						this.selectedRows1[0].specialPrice = 0
					}
					if (!this.selectedRows1[0].price || this.selectedRows1[0].price === 0) {
						this.$message.error("请录入一个第三方价格!")
						return
					}
					if (!n4) {
						this.$message.error("反馈日期不能为空!")
						return
					}
					if (!n5) {
						this.$message.error("反馈时间不能为空!", 6)
						return
					}
				}
				// 分公司自行解决号源
				if (this.selectedRows2.length === 1) {
					if (values.reason) {
						this.$message.warning('分公司自行解决号源不可选择第三方原因!')
						return
					}
					// list.price = hinsTableInfo[0].price;
					let n = this.selectedRows2[0].price// hinsTableInfo
					if (!this.isNumber(n)) {
						this.$message.error("价格格式录入错误!")
						return
					}
					if (this.isFloatBig(n)) {
						this.$message.error("价格小数点后最多可保留两位!")
						return
					}
				}

				// 途径判断
				if (this.selectedRows.length) {
					data.cooWay = this.selectedRows[0].contType === "自建签约" ? "1" : "3"
				} else if (this.selectedRows1.length) {
					data.cooWay = '2'
				} else if (this.selectedRows2.length) {
					data.cooWay = '4'
				}
				// -------------------taskInfo补充更新参数--------------------------
				// 佛系，供应商名称，有哪个算哪个系列
				let selectedOrgrow = (this.selectedRows.length > 0 && this.selectedRows[0]) ||
                    (this.selectedRows1.length > 0 && this.selectedRows1[0]) ||
                    (this.selectedRows2.length > 0 && this.selectedRows2[0])
				// -------------------------------------------------------------
				data.remark = this.addRemark(taskInfo.remark, 2, this.remark2)
				data.saveType = addType
				let ServiceApplication = {
					"disease": data.disease || taskInfo.disease,
					"detailedDescription": data.detailedDescription || taskInfo.detailedDescription,
					"resmedDoctorName": data.resmedDoctorName || taskInfo.resmedDoctorName,
					"specialFlag": data.specialFlag || taskInfo.specialFlag,
					"medicareFlag": data.medicareFlag || taskInfo.medicareFlag,
					"medredCardno": data.medredCardno || taskInfo.medredCardno,
					"merchantcode": data.merchantcode || taskInfo.merchantcode,
					"sorgName": data.sorgName || taskInfo.sorgName,
					"deptName": data.deptName || taskInfo.deptName,
					"deptCode": data.deptCode || taskInfo.deptCode,
					"sorgProvince": data.sorgProvince || taskInfo.sorgProvince,
					"sorgCity": data.sorgCity || taskInfo.sorgCity,
					"orgType": data.orgType || taskInfo.orgType,
					"cooWay": data.cooWay,
					"remark": data.remark || taskInfo.remark,
					"payDateStr": data.payDateStr || taskInfo.payDateStr,
					"saveType": data.saveType || taskInfo.saveType,
					"serviceReservationId": data.serviceReservationId || taskInfo.serviceReservationId
				}
				// 选择第三方原因
				ThirdPartyEnquiryLists.reason = values.reason ? values.reason : ""
				ThirdPartyEnquiryLists.serviceReservationId = taskInfo.serviceReservationId
				ThirdPartyEnquiryLists.thirdPartyEnquiryList = this.selectedRows1
				ThirdPartyEnquiryLists.hinsTableInfo = this.selectedRows2[0]
				ThirdPartyEnquiryLists.serviceApplication2 = ServiceApplication
				ThirdPartyEnquiryLists.selfTableInfo = this.selectedRows[0]
				ThirdPartyEnquiryLists.thirdPartyInfo = this.selectedRows1[0]
				// console.log('传递的参数',JSON.stringify(ThirdPartyEnquiryLists));
				api.insertThree(ThirdPartyEnquiryLists).then(res => {
					// console.log('result',res)
					if (res.status === 0) {
						if (res.data.result === 1) {
							// 为taskInfo更新数据   放到请求成功之后是避免  taskInfo的watch事件导致页面刷新数据丢失
							this.taskInfo.payDateStr = data.payDateStr
							this.taskInfo.payDate = data.payDateStr
							this.taskInfo.reason = data.reason
							this.taskInfo.supplierCode = selectedOrgrow.supplierCode
							this.taskInfo.supplierName = selectedOrgrow.supplierName
							let serviceData = res.data.serviceApplication
							// console.log(JSON.stringify(data));
							// var dealStatusFlag = window.parent.dealStatus(serviceData.nextStatus,serviceData.status);
							// 如果判断可以进入下一步，并且保存成功则进行跳转
							if (addType === '02') {
								this.status = true
								serviceData.lastStatus = '03'
								if (serviceData.status === '03') {
									this.$message.success("提交成功! 此服务流程已结束！")
								}
								if (serviceData.status !== '03') {
									this.$message.success('保存成功! 即将进入下一步!') // .nextStatus[0] status
									// 处理短信
									let messageData = {
										taskInfo: taskInfo,
										serviceData: serviceData
									}
									this.$refs.massTextMessages.showForm(messageData)
									// this.$emit("stepNext", serviceData)
								}
							} else {
								this.$message.success('保存成功!')
							}
						} else {
							this.$message.error("添加失败!")
							this.status = true
						}
					}
				})
			})
		},

		// 取消预约
		cancelApplyInfo () {
			if (!confirm("是否确认撤销？")) return
			let {serviceReservationId, serviceCode, cardNo} = this.taskInfo
			let params = {serviceReservationId, serviceCode, cardNo}
			api.cancelApplyInfo(params).then(res => {
				if (res.status === 0) {
					this.$message.success('撤销成功!')
					this.$emit('on-update')
					// 撤销成功后执行短信提醒服务
					// this.$emit('stepNext',res.data)
					this.$refs.massTextMessageSingle.show(res.data)
				} else {
					this.$message.error("撤销失败!")
				}
			}).finally(() => {
			})
		},

		// 自建签约单元格修改
		onCellChange (key, dataIndex, value) {
			let pageData = [...this.pageData.data]
			let target = pageData.find(item => item.recordIndex === key)
			if (target) {
				target[dataIndex] = value
				this.pageData.data = pageData
			}
		},
		onRowChange (selectedRowKeys, selectedRows) {
			this.selectedRowKeys = selectedRowKeys || []
			this.selectedRows = selectedRows
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
			let data = {
				page: this.pagination.current,
				limit: this.pagination.pageSize,
				sorgCode: this.taskInfo.merchantcode,
				serviceCode: this.taskInfo.serviceCode,
				productCode: this.taskInfo.productCode,
				supplierCode: this.taskInfo.supplierCode,
				price: this.taskInfo.price
			}
			// let data = {
			//   "page": "1",
			//   "limit": "10",
			//   "sorgCode": "H11000011",
			//   "serviceCode": "FW_HYB00001",
			//   "productCode": "CP_JYFW00018",
			//   "supplierCode": "",
			//   "price": ""
			// };
			this.loading = true
			api.queryOrg(data).then(res => {
				// console.log(res, "自建签约")
				let pageData = {
					totalCount: res.data.total,
					data: res.data.rows
				}
				this.pageData = pageData
				this.pageData.data.forEach((item, index) => {
					item.recordIndex = index + 1
				})
				this.pagination.total = this.pageData.totalCount
			}).finally(() => {
				this.loading = false
			})
		},

		// 第三方表格修改
		onCellChange1 (key, dataIndex, value) {
			// console.log('日期',key, dataIndex, value)
			let pageData1 = [...this.pageData1.data]
			let target = pageData1.find(item => item.recordIndex === key)
			if (target) {
				target[dataIndex] = value
				this.pageData1.data = pageData1
			}
		},

		onRowChange1 (selectedRowKeys, selectedRows) {
			this.selectedRowKeys1 = selectedRowKeys || []
			this.selectedRows1 = selectedRows
		},
		searchHandle1 () {
			this.$nextTick(() => {
				this.pagination1.current = 1
				this.loadPageData1()
			})
		},
		onPageChange1 (page, pageSize) {
			this.pagination1.current = page
			this.loadPageData1()
		},
		onPageSizeChange1 (current, size) {
			this.pagination1.pageSize = size
			this.searchHandle1()
		},

		loadPageData1 () {
			// let data =  {
			//   "page":1,
			//   "limit":10,
			//   "supplierCode":null,
			//   "serviceReservationId":"8361"
			// }
			let data = {
				page: this.pagination1.current,
				limit: this.pagination1.pageSize,
				supplierCode: this.taskInfo.supplierCode,
				serviceReservationId: this.taskInfo.serviceReservationId
			}
			this.loading1 = true
			api.selThreeModshow(data).then(res => {
				let pageData = {
					totalCount: res.data.total,
					data: res.data.rows
				}
				if (res.data.total !== 0) {
					this.filterForm.setFieldsValue({reason: pageData.data[0].reason})
				}
				this.pageData1 = pageData || { totalCount: 0, data: [] }
				this.pageData1.data.forEach((item, index) => {
					item.recordIndex = index + 1
				})

				this.pagination1.total = this.pageData1.totalCount
			}).finally(() => {
				this.loading1 = false
			})
		},

		// 号源表格修改
		onCellChange2 (key, dataIndex, value) {
			let pageData2 = [...this.pageData2.data]
			let target = pageData2.find(item => item.recordIndex === key)
			if (target) {
				target[dataIndex] = value
				this.pageData2.data = pageData2
			}
		},
		onRowChange2 (selectedRowKeys, selectedRows) {
			this.selectedRowKeys2 = selectedRowKeys || []
			this.selectedRows2 = selectedRows
		},
		searchHandle2 () {
			this.$nextTick(() => {
				this.pagination2.current = 1
				this.loadPageData2()
			})
		},
		onPageChange2 (page, pageSize) {
			this.pagination1.current = page
			this.loadPageData2()
		},
		onPageSizeChange2 (current, size) {
			this.pagination2.pageSize = size
			this.searchHandle2()
		},
		loadPageData2 () {
			let data = {
				page: this.pagination.current,
				limit: this.pagination.pageSize,
				// 只需要供应商编码
				supplierCode: this.taskInfo.supplierCode
				// sorgCode: this.taskInfo.merchantcode,
				// sorgName: this.taskInfo.sorgName,
				// sorgProvince: this.taskInfo.sorgProvince,
				// sorgCity: this.taskInfo.sorgCity
			}
			if (data.supplierCode) {
				this.loading2 = true
				api.queryHinsSorg(data).then(res => {
				// console.log(res, "result loadPageData2")
					let pageData = {
						totalCount: res.data.total,
						data: res.data.rows
					}
					this.pageData2 = pageData || { totalCount: 0, data: [] }
					this.pageData2.data.forEach((item, index) => {
						item.recordIndex = index + 1
					})
					this.pagination2.total = Number(this.pageData2.totalCount)
				}).finally(() => {
					this.loading2 = false
				})
			}
		},
		// 添加第三方询价弹窗
		onSearchThree () {
			this.getHandleTel(this.taskInfo.handleCode)
			this.$refs.threeSelectModal.show(this.taskInfo)
		},
		// 第三方询价下一步弹窗
		onSelectThreeHandle (item) {
			this.$refs.threeChooseModal.show(item, this.taskInfo)
		},
		onChooseThreeHandle (item) {
			// console.log('添加的',item);
			let pageData = {
				totalCount: item.total + this.pageData1.dataCount,
				data: item.rows.concat(this.pageData1.data)
			}
			this.pageData1 = pageData || { totalCount: 0, data: [] }
			this.pageData1.data.forEach((item, index) => {
				item.recordIndex = index + 1
			})
			this.pagination1.total = Number(this.pageData1.totalCount)
		},

		// 添加号源弹窗
		onSearchHins () {
			this.$refs.hinsSelectModal.show(this.taskInfo)
		},
		onSelectHinsHandle (item) {
			// console.log(item)
			let pageData = {
				totalCount: item.total,
				data: item.rows
			}
			this.pageData2 = pageData || { totalCount: 0, data: [] }
			this.pageData2.data.forEach((item, index) => {
				item.recordIndex = index + 1
			})
			this.pagination2.total = Number(this.pageData2.totalCount)
		},

		// 历史记录弹窗弹窗
		onSearchOldApply () {
			this.$refs.oldapplyModal.show(this.taskInfo.cardNo)
		},
		onOldApplyHandle (item) {
			console.log(item)
		},

		// 医疗机构弹窗
		onSearchSorg () {
			let params = {
				productName: this.taskInfo.productName,
				serviceName: this.taskInfo.serviceName,
				serviceCode: this.taskInfo.serviceCode,
				productCode: this.taskInfo.productCode
			}
			this.$refs.sorgSelectModal.show(params)
		},
		onSelectSorgHandle (item) {
			// console.log('医疗机构',item);
			this.filterForm.setFieldsValue({
				merchantName: item.sorgName + item.deptName
			})
			// 预约节点改变医疗机构需要重新给数据驱动赋值，用于自建签约查询
			this.taskInfo.merchantcode = item.sorgCode
			this.taskInfo.deptName = item.deptName
			this.taskInfo.deptCode = item.deptCode
			this.taskInfo.sorgName = item.sorgName
			this.taskInfo.supplierCode = null
			this.taskInfo.supplierName = null
			// 判断是否需要推送健管中心
			if (item.orgType === "04") {
				this.checkHinsService()
			}
		},
		// 获取当日时间信息
		amountTime () {
			// params
			// var orderList=[];
			api.amountTime().then(res => {
				// console.log('获取当日时间信息',res)
				if (res.status === 0) {
					this.arrTime.arr = res.data.list
					// console.log(111, this.arrTime.arr.filter(item => item >= '08:00'))  业务要求反馈时间从八点开始展示
					this.arrTime1.arr = this.arrTime.arr.filter(item => item >= '08:00')
					// console.log(res.data.list);
				}
			})
		},

		/*
    *该方法自需要在父组件使用就可以
    *获取每个节点的操作轨迹
    */
		getApplyTrace () {
			let {serviceReservationId} = this.taskInfo
			let params = {serviceReservationId, status: '03'}
			api.getApplyTrace(params).then(res => {
				// 获取该节点的轨迹进行页面回显
				if (res.status === 0) {
					this.initValue(res.data)
				}
			})
		},
		// 判断是否需要推送健管中心
		checkHinsService () {
			let params = {"serviceCode": this.taskInfo.serviceCode}
			api.checkHinsService(params).then(res => {
				// console.log('res',res)
				this.contTypeflag = res.data.flag
				if (res.data.flag) {
					this.getHinsWorkPlan()// 获取健管中心排班日期
				}
			}).finally(() => {
			})
		},
		// 获取健管中心排班日期
		getHinsWorkPlan () {
			let params = {
				serviceCode: this.taskInfo.serviceCode,
				merchantCode: this.taskInfo.merchantcode
			}
			api.getHinsWorkPlan(params).then(res => {
				if (res.status === 0) {
					this.jgResmedDates = res.data
				}
			}).finally(() => {
			})
		},
		/**
     * 处理时间字符串转换成数组
     * data 当前备注所在节点
     */
		getAarray (data) {
			let str = []
			if (data && typeof data === "string") {
				str = data.split(',')
			}
			return str
		},
		/**
     * 获取备注的调用方法
     * node 当前备注所在节点
     */
		getRemark (remarks, node) {
			if (!node) return "{}"
			if (!remarks) remarks = "{}"
			var key = this.getRemarkKey(node)
			var obj = JSON.parse(remarks)
			var remark = obj[key]
			if (remark) return remark
			return ""
		},
		/**
     * 添加备注的调用方法
     * remarks 备注字符的内容Json格式
     * node 当前备注所在节点
     * remark 当前节点的备注内容
     */
		addRemark (remarks, node, remark) {
			if (!remarks) remarks = "{}"
			var obj = JSON.parse(remarks)
			var key = this.getRemarkKey(node)
			obj[key] = remark
			return JSON.stringify(obj)
		},
		/**
     * 获取备注节点的key值
     * node 备注所在节点
     */
		getRemarkKey (node) {
			if (node === 1) {
				return '分诊阶段'
			} else if (node === 2) {
				return '预约阶段'
			} else if (node === 3) {
				return '陪诊阶段'
			} else if (node === 4) {
				return '次日就诊阶段'
			} else if (node === 5) {
				return '服务实施阶段'
			} else {
				return ''
			}
		},
		// 获取手机号
		getHandleTel (handleCode) {
			api.getHandleTel({handleCode: handleCode}).then(res => {
				this.taskInfo.handleTel = res.data
			})
		},
		stepNext (serviceData) {
			if (serviceData.status === '00') {
				this.$refs.applyInfoForm.addForm()
			} else {
				this.$emit("stepNext", serviceData)
			}
		},
		closeForm () {
			this.$emit("on-update")
		}
	},
	watch: {
		taskInfo: {
			handler (newName, oldName) {
				this.initLoad()
			},
			// immediate: true,
			deep: true
		}
	}
}
</script>
