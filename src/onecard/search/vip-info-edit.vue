<template>
  <div>
    <a-modal footer="" style="top: 30px; left: 30px;" title="编辑会员信息" v-model="formModal" width="1150px">
      <a-form
        :form="dataForm"
        :labelCol="dataFormLayout.labelCol"
        :wrapperCol="dataFormLayout.wrapperCol"
      >
        <a-card>
          <a-row :gutter="16">
            <a-col :span="12" :offset="12">
              <div style="float:right">
                <!--<a-button v-if="(editable != 'view')" :loading="submitLoading" type="primary"-->
                <!--class="editable-add-btn"-->
                <!--style="float:right;margin-right:10px;" @click="saveInsure">提交-->
                <!--</a-button>-->
                <a-button type="primary" @click="submitForm">提交</a-button>
              </div>
            </a-col>
          </a-row>
          <a-divider orientation="left">
            <a-icon type="bank" />购买人信息
          </a-divider>
          <a-row :gutter="16">
            <a-col :span="8">
              <a-form-item class="form-item-label-long" label="姓名">
                <a-input
                  :disabled="(editable == 'view')"
                  v-decorator="['name',{rules: [{ required: true, message: '姓名不能为空!' }]}]"
                />
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item class="form-item-label-long" label="证件类型" style="width: auto">
                <DicSelect
                  :disabled="(editable == 'view')"
                  dicType="CERTI_TYPE"
                  :certiTypeFlag='false'
                  placeholder="请选择证件类型"
                  v-decorator="[ 'idcardtype',{rules: [{ required: true, message: '请选择证件类型!' }]}]"
                  @blur="checkIdCard"
                  style="width: 200px"
                />
                <a-input type="hidden" v-decorator="['idcardtype']"/>
              <a-input type="hidden" v-decorator="['idcardtypeName']"/>
            </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item class="form-item-label-long" label="证件号码">
                <a-input
                  :disabled="(editable == 'view')"
                  v-decorator="['idcard',{rules: [{ required: true, message: '证件号码不能为空!' }]}]"
                  @blur="checkIdCard"
                />
              </a-form-item>
            </a-col>
          </a-row>
          <a-row :gutter="16">
            <a-col :span="8">
              <a-form-item class="form-item-label-long" label="出生日期">
                <a-week-picker :disabled="(editable === 'view')"
                               v-decorator="['birthday',{rules: [{ required: true, message: '出生日期不能为空!' }]}]"
                               format="YYYY-MM-DD"/>
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item class="form-item-label-long" label="性别">
                <DicSwitch
                  :disabled="(editable == 'view')"
                  dicType="VIP_SEX"
                  :value="dataForm.getFieldsValue(['sex']).sex"
                  v-decorator="['sex', {initialValue: inputCompact.sexValue}]"
                />
                <a-input type="hidden" v-decorator="['sexName']"/>
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item class="form-item-label-long" label="移动电话">
                <a-input
                  :disabled="(editable == 'view')"
                  v-decorator="['mobile',{rules: [{ required: true, message: '移动电话不能为空!' }]}]"
                />
              </a-form-item>
            </a-col>
          </a-row>
          <a-row :gutter="16">
            <a-col :span="8">
              <a-form-item class="form-item-label-long" label="电子邮箱">
                <a-input
                  :disabled="(editable == 'view')"
                  v-decorator="['email', {initialValue: ''}]"
                />
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item class="form-item-label-long" label="紧急联系人">
                <a-input
                  :disabled="(editable == 'view')"
                  v-decorator="['emercontact', {initialValue: ''}]"
                />
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item class="form-item-label-long" label="紧急联系方式" style="width: auto">
                <a-input
                  :disabled="(editable == 'view')"
                  v-decorator="['emermobile', {initialValue: ''}]"
                />
              </a-form-item>
            </a-col>
          </a-row>
          <a-row :gutter="16">
            <a-col :span="8">
              <a-form-item class="form-item-label-long" label="省份">
                <AddressSelect
                  :disabled="(editable === 'view')"
                  dicType="0"
                  placeholder="请选择省份"
                  v-decorator="['province',{initialValue: '',rules: [{ required: true, message: '请选择省份!' }]}]"
                  @change="hasCascadeDefaultProvince = true"
                ></AddressSelect>
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item class="form-item-label-long" label="城市">
                <AddressSelect
                  :hasCascadeDefault="hasCascadeDefaultProvince"
                  :disabled="(editable === 'view')"
                  :dicType="dataForm.getFieldValue('province')"
                  placeholder="请选择"
                  v-decorator="['city',{initialValue: '',rules: [{ required: true, message: '请选择城市!' }]}]"
                  @change="hasCascadeDefaultCity=true"
                ></AddressSelect>
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item class="form-item-label-long" label="区县">
                <AddressSelect
                  :hasCascadeDefault="hasCascadeDefaultProvince || hasCascadeDefaultCity"
                  :disabled="(editable === 'view')"
                  :dicType="dataForm.getFieldValue('city')"
                  placeholder="请选择区县"
                  v-decorator="['district',{initialValue: ''}]"
                ></AddressSelect>
              </a-form-item>
            </a-col>
          </a-row>
          <a-row :gutter="16">
            <a-col :span="8">
              <a-form-item class="form-item-label-long" label="街道">
                <a-input
                  :disabled="(editable == 'view')"
                  v-decorator="['street', {initialValue: ''}]"
                />
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item class="form-item-label-long" label="地址">
                <a-input
                  :disabled="(editable == 'view')"
                  v-decorator="['address', {initialValue: ''}]"
                />
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item class="form-item-label-long" label="保全生效日期" style="width: 390px">
                <a-week-picker
                  style="width:200px"
                  :disabled="(editable == 'view')"
                  v-decorator="['edorvalidate',{rules: [{ required: true, message: '保全生效日期不能为空!' }]}]"
                  format="YYYY-MM-DD"
                />
              </a-form-item>
            </a-col>
          </a-row>
          <a-form-item>
            <a-input type="hidden" v-decorator="['accountid']" />
            <a-input type="hidden" v-decorator="['vipid']" />
            <a-input type="hidden" v-decorator="['id']" />
		    <a-input type="hidden" v-decorator="['insuretype']"/>
          </a-form-item>
        </a-card>
      </a-form>

      <a-card style="margin-top:24px;">
        <span href="#" slot="title" style="float:left;">
          <a-icon type="bank" />约定使用人一览
        </span>
        <a href="#" slot="extra">
          <a-icon :type="iconType" @click="swithTableShow" />
        </a>
        <a-row :gutter="16" style="margin-bottom:12px;">
          <a-col :span="12" :offset="12">
            <div style="float:right;">
              <a-button
                v-if="editable !== 'view' && this.dataForm.getFieldsValue().insuretype !==3"
                type="primary"
                class="editable-add-btn"
                style="margin-right:10px;"
                @click="addRelated"
              >新建</a-button>
            </div>
          </a-col>
        </a-row>
        <a-table
          :scroll="{ x: 'max-content'}"
          v-show="showTable"
          :bordered="false"
          :dataSource="relatedList"
          :columns="columns"
        >
          <span slot="relatednameTitle" class="requireColumn">姓名</span>
          <div slot="relatedname" slot-scope="text, record, index">
            <a-input v-if="record.editable" v-model="record.relatedname" />
            <span v-if="!record.editable">{{text}}</span>
          </div>
          <span slot="relatedcodeTitle" class="requireColumn">与会员本人关系</span>
          <div slot="relatedcode" slot-scope="text, record, index">
            <DicSelect
              v-if="record.editable"
              :value="{key:record.relatedcode}"
              dicType="VIP_RELATIONSHIP"
              :labelInValue="true"
              @select="value => itemSetting(value, {rowindex:index, rowrecord:record, rowkey:'relatedcode'} )"
            ></DicSelect>
            <span v-if="!record.editable">{{record.relatedcodeName}}</span>
          </div>
          <!--<div slot="relatedother" slot-scope="text, record, index"><a-input v-if="record.editable" v-model="record.relatedother"/><span v-if="!record.editable">{{text}}</span></div>-->
          <span slot="relatedcodeTitle" class="requireColumn">性别</span>
          <div slot="relatedsex" slot-scope="text, record, index">
            <DicSelect
              v-if="record.editable"
              :value="{key:record.relatedsex}"
              dicType="VIP_SEX"
              :labelInValue="true"
              @select="value => itemSetting(value, {rowindex:index, rowrecord:record, rowkey:'relatedsex'})"
            />
            <span v-if="!record.editable">{{record.relatedsexName}}</span>
          </div>
          <span slot="relatedmobileTitle" class="requireColumn">移动电话</span>
          <div slot="relatedmobile" slot-scope="text, record, index">
            <a-input v-if="record.editable" v-model="record.relatedmobile" />
            <span v-if="!record.editable">{{text}}</span>
          </div>
          <span slot="relatedidcardtypeTitle" class="requireColumn">证件类型</span>
          <div slot="relatedidcardtype" slot-scope="text, record, index">
            <DicSelect
              v-if="record.editable"
              :value="{key:record.relatedidcardtype}"
              dicType="VIP_IDCARDTYPE"
              :labelInValue="true"
              @select="value => itemSetting(value, {rowindex:index, rowrecord:record, rowkey:'relatedidcardtype'})"
            />
            <span v-if="!record.editable">{{record.relatedidcardtypeName}}</span>
          </div>
          <span slot="relatedidcardTitle" class="requireColumn">证件号</span>
          <div slot="relatedidcard" slot-scope="text, record, index">
            <a-input
              v-if="record.editable"
              v-model="record.relatedidcard"
              @blur="checkRelatedIdCard(index, record)"
            />
            <span v-if="!record.editable">{{text}}</span>
          </div>
          <span slot="relatedbirthdayTitle" class="requireColumn">生日</span>
          <div slot="relatedbirthday" slot-scope="text, record, index">
            <a-week-picker
              v-if="record.editable"
              v-model="record.relatedbirthday"
              format="YYYY-MM-DD"
            />
            <span v-if="!record.editable">{{dateRender(text)}}</span>
          </div>
          <!--<div slot="idcardislong" slot-scope="text, record, index">-->
          <!--<DicSelect v-if="record.editable" v-model="record.idcardislong" dicType="VIP_IDCARDISLONG" :labelInValue="true"-->
          <!--@select="value => itemSetting(value, {rowindex:index, rowrecord:record, rowkey:'idcardislong'})"/>-->
          <!--<span v-if="!record.editable">{{record.idcardislongName}}</span></div>-->
          <!--<div slot="idcardstart" slot-scope="text, record, index"><a-date-picker v-if="record.editable" v-model="record.idcardstart"/><span v-if="!record.editable">{{dateRender(text)}}</span></div>-->
          <!--<div slot="idcardend" slot-scope="text, record, index"><a-date-picker v-if="record.editable" :disabled="(inputCompact.idcardislongValue == record.idcardislong.key)" v-model="record.idcardend"/><span v-if="!record.editable">{{dateRender(text)}}</span></div>-->
          <div slot="operation" slot-scope="text, record, index" style="display:inline-block;">
            <a v-if="record.editable && editable != 'view'" @click="saveRelated(index, record)">保存</a>
            <a v-if="record.editable && editable != 'view'" @click="cancelRelated(index, record)">取消</a>
            <a v-if="!record.editable && editable != 'view' && isneed" @click="editRelated(index, record)">编辑</a>
            <a v-if="!record.editable && editable != 'view' && isneed" @click="delRelated(index, record)">删除</a>
          </div>
        </a-table>
      </a-card>
      <!--<div slot="footer">-->
      <!--<a-button type="" @click="formModal=false">取消</a-button>-->
      <!--<a-button :loading="submitLoading" type="primary" @click="submitForm">保存</a-button>-->
      <!--</div>-->
    </a-modal>
  </div>
</template>
<script>
  import api from "@/api/api-vip"
  import DicSelect from "@/components/dic-select"
  import DicSwitch from "@/components/dic-switch"
  import AddressSelect from "@/components/address-select"
  import moment from "moment"

  export default {
    name: "vip-info-edit",
    components: {DicSelect, DicSwitch, AddressSelect},
    data() {
      return {
        checkRelated: false,
        isneed: true,
        accountid: "",
        formModal: false,
        relatedCount: 3,
        editable: "",
        dataFormLayout: {
          labelCol: {span: 5},
          wrapperCol: {span: 15}
        },
        //   submitLoading: false,
        dataForm: this.$form.createForm(this, {onFieldsChange: this.fieldsChanges}),
        inputCompact: {
          sexValue: 0
        },
        showTable: true,
        iconType: "down",
        related: {
          id: "",
          vipid: "",
          insureid: "",
          relatedname: "",
          relatedcode: "",
          relatedother: "",
          relatedmobile: "",
          relatedidcardtype: "",
          relatedidcard: "",
          relatedbirthday: "",
          idcardislong: "",
          idcardstart: "",
          idcardend: "",
          relatedsexName: "",
          relatedsex: ""
        },
        relatedList: [],
        columns: [
				{
					align: "left",
					title: "姓名",
					dataIndex: "relatedname",
					scopedSlots: { customRender: "relatedname" }
				},
				{
					align: "left",
					title: "与会员本人关系",
					dataIndex: "relatedcode",
					scopedSlots: { customRender: "relatedcode" }
				},
				{
					align: "left",
					title: "性别",
					dataIndex: "relatedsexName",
					scopedSlots: { customRender: "relatedsex" }
				},
				{
					align: "left",
					title: "移动电话",
					dataIndex: "relatedmobile",
					scopedSlots: { customRender: "relatedmobile" }
				},
				{
					align: "left",
					title: "证件类型",
					dataIndex: "relatedidcardtypeName",
					scopedSlots: { customRender: "relatedidcardtype" }
				},
				{
					align: "left",
					title: "证件号",
					dataIndex: "relatedidcard",
					scopedSlots: { customRender: "relatedidcard" }
				},
				{
					align: "left",
					title: "生日",
					dataIndex: "relatedbirthday",
					scopedSlots: { customRender: "relatedbirthday" }
				},
				{
					align: "left",
					title: "操作",
					fixed: "right",
					dataIndex: "operation",
          scopedSlots: {customRender: "operation"}
        }

          // {
          // 	align: "left",
          // 	title: "证件有效期始",
          // 	dataIndex: "idcardstart",
          // 	scopedSlots: { customRender: 'idcardstart' }
          // },
          // {
          // 	align: "left",
          // 	title: "证件有效期止",
          // 	dataIndex: "idcardend",
          // 	scopedSlots: { customRender: 'idcardend' }
          // },
          // {
          // 	align: "left",
          // 	title: "操作",
          // 	dataIndex: "operation",
          // 	scopedSlots: { customRender: 'operation' }
          // }
        ],
        hasCascadeDefaultProvince: false,
        hasCascadeDefaultCity: false,
        sysParamList: [],
        cardcode: '',
        isshow: true
      }
    },
    mounted() {
      this.hasCascadeDefaultProvince = false;
      this.hasCascadeDefaultCity = false;
      this.syncMainRelated()
    },
    methods: {
      show(obj) {
        this.isneed = true;
        this.accountid = obj.accountid;
        this.formModal = true;
        this.getSysparam();
        this.cardcode = obj.cardcode;
        if (this.cardcode === "01") {
          this.relatedCount = this.getSysparamString("ZHISHANGUSEPPL")
        } else if (this.cardcode === "02") {
          this.relatedCount = this.getSysparamString("ZHIZHENUSEPPL")
        } else if (this.cardcode === "03") {
          this.relatedCount = this.getSysparamString("ZHIXIANGUSEPPL")
        } else if (this.cardcode === "04") {
          this.relatedCount = this.getSysparamString("ZHIZUNUSEPPL")
        }
        let insuretype = obj.vipInfoStore.insuretype;
        if (insuretype === 3) {
          this.insuretype = insuretype;
          this.isneed = false
        }
        this.$nextTick(() => {
          this.editable = obj.editable;
          this.relatedList = obj.vipInfoGridStore;
          this.$nextTick(() => {
            // 排序-本人排在第一位
            if (this.relatedList.length > 1) {
              let findex = this.relatedList.findIndex(
                item => parseInt(item.personType) === 1
              );
              if (findex >= 0) {
                let fperson = Object.assign({}, this.relatedList[findex]);
                this.relatedList.splice(findex, 1);
                this.relatedList.unshift(fperson)
              }
            }
            this.dataForm.setFieldsValue(Object.assign({}, obj.vipInfoStore))
          })
        })
      },
      formSetting(LabeledValue, option) {
        let item = {};
        this.$set(item, option.rowkey, LabeledValue.key);
        this.$set(item, option.rowkey + 'Name', LabeledValue.label);
        this.dataForm.setFieldsValue(item)
      },
      getSysparam() {
        api.getVipSysparam().then(res => {
            debugger
            if (res.status === 0) {
              this.sysParamList = res.data
            } else {
              this.$message.error(res.statusText)
            }
          }
        )
      },
      getSysparamString(sysParamId) {
        let res = 3;
        this.sysParamList.forEach(p => {
          if (p.id === sysParamId) res = parseInt(p.paramvalue)
        });
        return res
      },
      fieldsChanges(props, fields) {
        // 约定使用人数据同步
        this.syncMainRelated()
      },
      submitForm() {
        let self = this;
        debugger
        if (self.cardcode === "01") {
          self.relatedCount = this.getSysparamString("ZHISHANGUSEPPL")
        } else if (self.cardcode === "02") {
          self.relatedCount = this.getSysparamString("ZHIZHENUSEPPL")
        } else if (self.cardcode === "03") {
          self.relatedCount = this.getSysparamString("ZHIXIANGUSEPPL")
        } else if (self.cardcode === "04") {
          self.relatedCount = this.getSysparamString("ZHIZUNUSEPPL")
        }
        this.dataForm.validateFields((error, values) => {
          if (error) {
            self.$message.error("您填写的数据有误或者必填项没填！");
            return
          }
          debugger
          if (self.checkRelated && self.relatedList.length < 3) {
            self.$message.error("约定使用人至少输入3人！");
            return
          }
          if (self.checkRelated && self.relatedList.length > self.relatedCount) {
            self.$message.error("约定使用人人数超过限定人数!");
            return
          }
          if (!self.checkIdCard()) {
            return
          }
          if (parseInt(this.dataForm.getFieldValue("insuretype")) === 3) {
            let idCardType = this.dataForm.getFieldValue("idcardtype");
            let idCard = this.dataForm.getFieldValue("idcard");
            if (parseInt(idCardType) === 9 && idCard.length != 18) {
              self.$message.error("社会统一信用代码应为18位!");
              return
            }
          }
          // if (!self.checkRelatedIdCard(index, record)) {
          //   return;
          // }
          let value = value;
          // let vipInsure = Object.assign({ insuretype: 4.0 }, values);
          let data = {
            vipInfo: self.dataForm.getFieldsValue(),
            insureRelatedList: self.relatedList,
            accountid: self.accountid
          };
          this.$confirm({
            title: "确认提示",
            content: `会员信息有变更，确认提交吗？`,
            okType: "danger",
            onOk() {
              // self.submitLoading = true;
              // return new Promise((resolve, reject) => {
              api.updateVipInfo(data).then(res => {
                if (res.status === 0) {
                  // 更新列表数据
                  self.$message.success('提交成功');
                  self.$emit("callback");
                  self.formModal = false
                } else {
                  self.$message.error(res.statusText)
                }
              })
              // });
            }
          })
        })
      },
      addRelated() {
        this.checkRelated = true;
        this.$nextTick(() => {
          debugger
          if (this.relatedList.length < this.relatedCount) {
            let newRelated = Object.assign(
              {newrow: true, editable: true},
              this.related
            );
            newRelated.personType = "2";
            newRelated.idcardislong = "2";
            newRelated.relatedidcardtype = "";
            newRelated.relatedcode = "";
            this.relatedList.push(newRelated)
          } else {
            this.$message.warning(
              "约定使用人最多添加" + this.relatedCount + "条信息！"
            )
          }
        })
      },
      saveRelated(index, record) {
        if (
          !record.relatedname ||
          !record.relatedmobile ||
          !record.relatedidcardtype ||
          !record.relatedidcard ||
          !record.relatedbirthday
        ) {
          this.$message.error("必录项不能为空！");
          return
        }
        if (record.newrow) {
          this.$delete(record, "newrow")
        }
        record.editable = false;
        this.$delete(record, "oldvalue");
        this.relatedList[index] = record
      },
      cancelRelated(index, record) {
        if (record.newrow) {
          this.relatedList.splice(index, 1)
        } else {
          this.relatedList[index] = record.oldvalue;
          this.$delete(record, "oldvalue");
          this.relatedList[index].editable = false
        }
      },
      editRelated(index, record) {
        if (record.cardholderflag === "0") {
          this.$message.warning("投保人不能修改!");
          return
        }
        this.$set(record, 'editable', true);
        record.oldvalue = Object.assign({editable: false}, record)
      },
      delRelated(index, record) {
        if (record.cardholderflag === "0") {
          this.$message.warning("投保人不能删除!");
          return
        }
        this.relatedList.splice(index, 1)
      },
      itemSetting(LabeledValue, option) {
        this.$set(
          this.relatedList[option.rowindex],
          option.rowkey,
          LabeledValue.key
        );
        this.$set(
          this.relatedList[option.rowindex],
          option.rowkey + "Name",
          LabeledValue.label
        )
      },
      dateRender(text) {
        return text ? moment(text).format("YYYY-MM-DD") : ""
      },
      swithTableShow() {
        this.showTable = !this.showTable;
        this.iconType = this.showTable ? "down" : "up"
      },
      syncMainRelated() {
        // this.related = {}
        this.relatedList[0].relatedsexName = this.dataForm.getFieldsValue([
          "sexName"
        ]).sexName;
        console.log(this.dataForm.getFieldsValue());
        this.relatedList[0].relatedname = this.dataForm.getFieldsValue([
          "name"
        ]).name;
        this.relatedList[0].relatedmobile = this.dataForm.getFieldsValue([
          "mobile"
        ]).mobile;
        this.relatedList[0].relatedidcardtype = this.dataForm.getFieldsValue([
          "idcardtype"
        ]).idcardtype;
        this.relatedList[0].relatedidcardtypeName = this.dataForm.getFieldsValue([
          "idcardtypeName"
        ]).idcardtypeName;
        this.relatedList[0].relatedidcard = this.dataForm.getFieldsValue([
          "idcard"
        ]).idcard;
        this.relatedList[0].relatedbirthday = this.dataForm.getFieldsValue([
          "birthday"
        ]).birthday;
        this.relatedList[0].idcardislong = this.dataForm.getFieldsValue([
          "idcardislong"
        ]).idcardislong;
        this.relatedList[0].idcardislongName =
          this.dataForm.getFieldsValue(["idcardislong"]).idcardislong === "1"
            ? "是"
            : "否";
        this.relatedList[0].idcardstart = this.dataForm.getFieldsValue([
          "idcardstart"
        ]).idcardstart;
        this.relatedList[0].idcardend = this.dataForm.getFieldsValue([
          "idcardend"
        ]).idcardend
      },
      checkIdCard() {
        let idCardType = this.dataForm.getFieldValue("idcardtype");
        let idCard = this.dataForm.getFieldValue("idcard");
        if (idCard === "" || idCard === undefined) return false;
        if (parseInt(idCardType) !== 0) return true;

        idCard = idCard.toUpperCase();
        this.dataForm.setFieldsValue({idcard: idCard});
        // 身份证号校验
        let idcardFlag = this.checkIdNumberLogic(idCardType, idCard);
        if (idcardFlag) {
          // 根据身份证号取得性别和出生日期
          this.addBirthdayAndSex()
        }
        return idcardFlag
      },
      checkRelatedIdCard(index, record) {
        let idCardType = record.relatedidcardtype;
        let idCard = record.relatedidcard;
        if (idCard === "" || idCard === undefined) return false;
        if (parseInt(idCardType) !== 0) return true;
        idCard = idCard.toUpperCase();
        this.relatedList[index].relatedidcard = idCard;
        // 身份证号校验
        let idcardFlag = this.checkIdNumberLogic(idCardType, idCard);
        if (idcardFlag) {
          // 根据身份证号取得性别和出生日期
          this.addRelatedBirthdayAndSex(index, record, idCard)
        }
        return idcardFlag
      },
      addBirthdayAndSex() {
        let sex = "";
        let xingbie = "";
        let year = "";
        let month = "";
        let day = "";
        // 出生日期，性别
        let obj = this.dataForm.getFieldValue("idcard");
        if (obj.length === 15) {
          year = obj.substr(6, 2);
          month = obj.substr(8, 2);
          day = obj.substr(10, 2);
          xingbie = obj.substr(14, 1);
          if (xingbie % 2 === 0) {
            sex = "1" // "女性";
          } else {
            sex = "0" // "男性";
          }
          year = "19" + year
        } else if (obj.length === 18) {
          year = obj.substr(6, 4);
          month = obj.substr(10, 2);
          day = obj.substr(12, 2);
          xingbie = obj.substr(16, 1);
          if (xingbie % 2 === 0) {
            sex = "1" // "女性";
          } else {
            sex = "0" // "男性";
          }
        }
        let birthday = year.toString() + "-" + month + "-" + day.toString();
        this.dataForm.setFieldsValue({sex: sex, birthday: birthday})
      },
      addRelatedBirthdayAndSex(index, record, idCard) {
        let sex = "";
        let xingbie = "";
        let year = "";
        let month = "";
        let day = "";
        // 出生日期，性别
        let obj = idCard;
        if (obj.length === 15) {
          year = obj.substr(6, 2);
          month = obj.substr(8, 2);
          day = obj.substr(10, 2);
          xingbie = obj.substr(14, 1);
          if (xingbie % 2 === 0) {
            sex = "1" // "女性";
          } else {
            sex = "0" // "男性";
          }
          year = "19" + year
        } else if (obj.length === 18) {
          year = obj.substr(6, 4);
          month = obj.substr(10, 2);
          day = obj.substr(12, 2);
          xingbie = obj.substr(16, 1);
          if (xingbie % 2 === 0) {
            sex = "1" // "女性";
          } else {
            sex = "0" // "男性";
          }
        }
        let birthday = year.toString() + "-" + month + "-" + day.toString();
        this.relatedList[index].relatedbirthday = birthday;
        this.relatedList[index].relatedsex = sex;
        record.relatedbirthday = birthday
      },
      checkIdNumberLogic(idCardType, idCard) {
        if (parseInt(idCardType) !== 0) {
          return true
        }

        // 身份证号Check标记:0-正常，非0-错误信息
        let idcardFlag = true;

        let idCardTemp = idCard;
        if (idCardTemp.length === 0) {
          return true
        }

        if (idCardTemp.length !== 15 && idCardTemp.length !== 18) {
          let idcardMsg = "请输入正确的身份证号(15位/18位)";
          this.$message.error(idcardMsg);
          return false
        }

        // 身份号逻辑判断
        let strMessage = this.commonCheckIdNumberLogic(idCardTemp);
        if (strMessage !== "true") {
          this.$message.error(strMessage);
          idcardFlag = false
        } else {
          idcardFlag = true
        }
        return idcardFlag
      },
      commonCheckIdNumberLogic(idcard) {
        let Errors = [
          "true",
          "身份证号码位数不对！",
          "身份证号码出生日期超出范围或含有非法字符！",
          "身份证号码校验错误！",
          "身份证号码中地区编码不正确！"
        ];
        let area = {
          11: "北京",
          12: "天津",
          13: "河北",
          14: "山西",
          15: "内蒙古",
          21: "辽宁",
          22: "吉林",
          23: "黑龙江",
          31: "上海",
          32: "江苏",
          33: "浙江",
          34: "安徽",
          35: "福建",
          36: "江西",
          37: "山东",
          41: "河南",
          42: "湖北",
          43: "湖南",
          44: "广东",
          45: "广西",
          46: "海南",
          50: "重庆",
          51: "四川",
          52: "贵州",
          53: "云南",
          54: "西藏",
          61: "陕西",
          62: "甘肃",
          63: "青海",
          64: "宁夏",
          65: "新疆",
          71: "台湾",
          81: "香港",
          82: "澳门",
          91: "国外"
        };
        let Y, JYM, ereg;
        let S, M;
        let idcardArray = [];
        idcardArray = idcard.split("");
        if (idcard.length !== 15 && idcard.length !== 18) return Errors[1];
        if (
          idcard.substr(0, 6) === "000000" ||
          idcard.substr(0, 6) === "111111" ||
          idcard.substr(0, 6) === "222222" ||
          idcard.substr(0, 6) === "333333" ||
          idcard.substr(0, 6) === "444444" ||
          idcard.substr(0, 6) === "555555" ||
          idcard.substr(0, 6) === "666666" ||
          idcard.substr(0, 6) === "777777" ||
          idcard.substr(0, 6) === "888888" ||
          idcard.substr(0, 6) === "999999"
        ) {
          return Errors[4]
        }
        if (
          idcard.substr(0, 6) === "123456" ||
          idcard.substr(0, 6) === "234567" ||
          idcard.substr(0, 6) === "345678" ||
          idcard.substr(0, 6) === "456789" ||
          idcard.substr(0, 6) === "567890" ||
          idcard.substr(0, 6) === "012345" ||
          idcard.substr(0, 6) === "543210" ||
          idcard.substr(0, 6) === "432109" ||
          idcard.substr(0, 6) === "321098" ||
          idcard.substr(0, 6) === "210987" ||
          idcard.substr(0, 6) === "109876" ||
        idcard.substr(0, 6) === "098765" ||
        idcard.substr(0, 6) === "987654" ||
        idcard.substr(0, 6) === "876543" ||
        idcard.substr(0, 6) === "765432"
			) { return Errors[4] }
			if (
				idcard.substr(0, 6) === "121212" ||
        idcard.substr(0, 6) === "131313" ||
        idcard.substr(0, 6) === "141414" ||
        idcard.substr(0, 6) === "151515" ||
        idcard.substr(0, 6) === "161616" ||
        idcard.substr(0, 6) === "171717" ||
        idcard.substr(0, 6) === "181818" ||
        idcard.substr(0, 6) === "191919" ||
        idcard.substr(0, 6) === "101010"
			) { return Errors[4] }
			if (
				idcard.substr(0, 6) === "212121" ||
        idcard.substr(0, 6) === "232323" ||
        idcard.substr(0, 6) === "242424" ||
        idcard.substr(0, 6) === "252525" ||
        idcard.substr(0, 6) === "262626" ||
        idcard.substr(0, 6) === "272727" ||
        idcard.substr(0, 6) === "282828" ||
        idcard.substr(0, 6) === "292929" ||
        idcard.substr(0, 6) === "202020"
			) { return Errors[4] }
			if (
				idcard.substr(0, 6) === "313131" ||
        idcard.substr(0, 6) === "323232" ||
        idcard.substr(0, 6) === "343434" ||
        idcard.substr(0, 6) === "353535" ||
        idcard.substr(0, 6) === "363636" ||
        idcard.substr(0, 6) === "373737" ||
        idcard.substr(0, 6) === "383838" ||
        idcard.substr(0, 6) === "393939" ||
        idcard.substr(0, 6) === "303030"
			) { return Errors[4] }
			if (
				idcard.substr(0, 6) === "414141" ||
        idcard.substr(0, 6) === "424242" ||
        idcard.substr(0, 6) === "434343" ||
        idcard.substr(0, 6) === "454545" ||
        idcard.substr(0, 6) === "464646" ||
        idcard.substr(0, 6) === "474747" ||
        idcard.substr(0, 6) === "484848" ||
        idcard.substr(0, 6) === "494949" ||
        idcard.substr(0, 6) === "404040"
			) { return Errors[4] }
			if (
				idcard.substr(0, 6) === "515151" ||
        idcard.substr(0, 6) === "525252" ||
        idcard.substr(0, 6) === "535353" ||
        idcard.substr(0, 6) === "545454" ||
        idcard.substr(0, 6) === "565656" ||
        idcard.substr(0, 6) === "575757" ||
        idcard.substr(0, 6) === "585858" ||
        idcard.substr(0, 6) === "595959" ||
        idcard.substr(0, 6) === "505050"
			) { return Errors[4] }
			if (
				idcard.substr(0, 6) === "616161" ||
        idcard.substr(0, 6) === "626262" ||
        idcard.substr(0, 6) === "636363" ||
        idcard.substr(0, 6) === "646464" ||
        idcard.substr(0, 6) === "656565" ||
        idcard.substr(0, 6) === "676767" ||
        idcard.substr(0, 6) === "686868" ||
        idcard.substr(0, 6) === "696969" ||
        idcard.substr(0, 6) === "606060"
			) { return Errors[4] }
			if (
				idcard.substr(0, 6) === "717171" ||
        idcard.substr(0, 6) === "727272" ||
        idcard.substr(0, 6) === "737373" ||
        idcard.substr(0, 6) === "747474" ||
        idcard.substr(0, 6) === "757575" ||
        idcard.substr(0, 6) === "767676" ||
        idcard.substr(0, 6) === "787878" ||
        idcard.substr(0, 6) === "797979" ||
        idcard.substr(0, 6) === "707070"
      ) {
        return Errors[4]
      }
        if (
          idcard.substr(0, 6) === "818181" ||
          idcard.substr(0, 6) === "828282" ||
          idcard.substr(0, 6) === "838383" ||
          idcard.substr(0, 6) === "848484" ||
          idcard.substr(0, 6) === "858585" ||
          idcard.substr(0, 6) === "868686" ||
          idcard.substr(0, 6) === "878787" ||
          idcard.substr(0, 6) === "898989" ||
          idcard.substr(0, 6) === "808080"
        ) {
          return Errors[4]
        }
        if (
          idcard.substr(0, 6) === "919191" ||
          idcard.substr(0, 6) === "929292" ||
          idcard.substr(0, 6) === "939393" ||
          idcard.substr(0, 6) === "949494" ||
          idcard.substr(0, 6) === "959595" ||
          idcard.substr(0, 6) === "969696" ||
          idcard.substr(0, 6) === "979797" ||
          idcard.substr(0, 6) === "989898" ||
          idcard.substr(0, 6) === "909090"
        ) {
          return Errors[4]
        }

        if (area[parseInt(idcard.substr(0, 2))] === null) return Errors[4];
        switch (idcard.length) {
          case 15:
            if (
              (parseInt(idcard.substr(6, 2)) + 1900) % 4 === 0 ||
              ((parseInt(idcard.substr(6, 2)) + 1900) % 100 === 0 &&
                (parseInt(idcard.substr(6, 2)) + 1900) % 4 === 0)
            ) {
              ereg = /^[1-9][0-9]{5}[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|[1-2][0-9]))[0-9]{3}$/ // 测试出生日期的合法性
            } else {
              ereg = /^[1-9][0-9]{5}[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|1[0-9]|2[0-8]))[0-9]{3}$/ // 测试出生日期的合法性
            }
            if (ereg.test(idcard)) {
              return Errors[0]
            } else {
              return Errors[2]
            }
          case 18:
            if (
              parseInt(idcard.substr(6, 4)) % 4 === 0 ||
              (parseInt(idcard.substr(6, 4)) % 100 === 0 &&
                parseInt(idcard.substr(6, 4)) % 4 === 0)
            ) {
              ereg = /^[1-9][0-9]{5}(19|20)[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|[1-2][0-9]))[0-9]{3}[0-9Xx]$/ // 闰年出生日期的合法性正则表达式
            } else {
              ereg = /^[1-9][0-9]{5}(19|20)[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|1[0-9]|2[0-8]))[0-9]{3}[0-9Xx]$/ // 平年出生日期的合法性正则表达式
            }
            if (ereg.test(idcard)) {
              S =
                (parseInt(idcardArray[0]) + parseInt(idcardArray[10])) * 7 +
                (parseInt(idcardArray[1]) + parseInt(idcardArray[11])) * 9 +
                (parseInt(idcardArray[2]) + parseInt(idcardArray[12])) * 10 +
                (parseInt(idcardArray[3]) + parseInt(idcardArray[13])) * 5 +
                (parseInt(idcardArray[4]) + parseInt(idcardArray[14])) * 8 +
                (parseInt(idcardArray[5]) + parseInt(idcardArray[15])) * 4 +
                (parseInt(idcardArray[6]) + parseInt(idcardArray[16])) * 2 +
                parseInt(idcardArray[7]) * 1 +
                parseInt(idcardArray[8]) * 6 +
                parseInt(idcardArray[9]) * 3;
              Y = S % 11;
              M = "F";
              JYM = "10X98765432";
              M = JYM.substr(Y, 1);
              if (M === idcardArray[17]) {
                return Errors[0]
              } else {
                return Errors[3]
              }
            } else {
              return Errors[2]
            }
			default:
				return Errors[1]
			}
		}
	}
}
</script>
<style>
</style>
