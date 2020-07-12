<template>
  <a-card :bordered="false">
    <a-form :form="dataForm" :labelCol="dataFormLayout.labelCol" :wrapperCol="dataFormLayout.wrapperCol">
      <a-card>
        <a-row :gutter="16">
          <a-col :span="12" :offset="12">
            <div style="float:right">
              <a-button v-if="(editable !== 'view' && editable !== 'edit')" class="editable-add-btn"
                        style="float:right;margin-right:10px;" @click="resetInsure">新建
              </a-button>
              <a-button v-if="(editable === 'edit')" class="editable-add-btn"
                        style="float:right;margin-right:10px;"
                        @click="printInsure">打印票据
              </a-button>
              <a-button v-if="(editable !== 'view')" :loading="submitLoading" type="primary"
                        class="editable-add-btn"
                        style="float:right;margin-right:10px;" @click="saveInsure">提交
              </a-button>
            </div>
          </a-col>
        </a-row>
        <a-divider orientation="left">
          <a-icon type="bank"/>
          购买人信息
        </a-divider>
        <a-row :gutter="16">
          <a-col :span="6">
            <a-form-item label="姓名">
              <a-input :disabled="(editable === 'view')"
                       v-decorator="['name',{rules: [{ required: true, message: '姓名不能为空!' }]}]"/>
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="证件类型">
              <DicSelect :disabled="(editable === 'view')" dicType="CERTI_TYPE" :labelInValue="true"
                         @select="value => formSetting(value, {rowkey:'idcardtype'})"
                         v-decorator="[ 'idcardtypeTemp',{rules: [{ required: true, message: '请选择证件类型!' }]}]" @blur="checkIdCard"/>
              <a-input type="hidden" v-decorator="['idcardtype']"/>
              <a-input type="hidden" v-decorator="['idcardtypeName']"/>
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="证件号码">
              <a-input :disabled="(editable === 'view')"
                       v-decorator="['idcard',{rules: [{ required: true, message: '证件号码不能为空!' }]}]"
                       @blur="checkIdCard"/>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :span="6">
            <a-form-item label="出生日期">
              <a-week-picker :disabled="(editable === 'view')"
                             v-decorator="['birthday',{rules: [{ required: true, message: '出生日期不能为空!' }]}]"
                             format="YYYY-MM-DD"/>
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="性别">
              <DicSwitch :disabled="(editable === 'view')" dicType="VIP_SEX"
                         :value="dataForm.getFieldsValue(['sex']).sex"
                         v-decorator="['sex', {initialValue: inputCompact.sexValue}]"/>
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="婚姻">
              <a-row>
                <a-col :span="12">
                  <a-form-item>
                    <DicSelect :disabled="(editable === 'view')" @change="change($event)" dicType="VIP_MARRIAGE"
                               v-decorator="[ 'maritalstatuscode',{initialValue:'1', rules: [{ required: true, message: '婚姻不能为空!' }]}]"/>
                  </a-form-item>
                </a-col>
                <a-col :span="12">
                  <a-form-item>
                    <a-input style="width: 90px"
                             :disabled="(editable === 'view' || inputCompact.maritalstatusValue !== dataForm.getFieldsValue(['maritalstatuscode']).maritalstatuscode)"
                             v-decorator="['maritalstatusother', (editable === 'view' || inputCompact.maritalstatusValue !== dataForm.getFieldsValue(['maritalstatuscode']).maritalstatuscode)?{rules:[{required: false, message: ''}]}:{rules: [{ required: true, message: '婚姻不能为空!' }]}]"/>
                  </a-form-item>
                </a-col>
              </a-row>
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="国籍">
              <a-row>
                <a-col :span="12">
                  <a-form-item>
                    <DicSelect :disabled="(editable === 'view')" @change="chan($event)" dicType="VIP_NATIONALITY"
                               v-decorator="[ 'nationalitycode',{initialValue: 'ML',rules: [{ required: true, message: '国籍不能为空!' }]}]"/>
                  </a-form-item>
                </a-col>
                <a-col :span="12">
                  <a-form-item>
                    <a-input style="width: 90px"
                             :disabled="(editable === 'view' || inputCompact.nationalityValue !== dataForm.getFieldsValue(['nationalitycode']).nationalitycode)"
                             v-decorator="['nationalityother', (editable === 'view' || inputCompact.nationalityValue !== dataForm.getFieldsValue(['nationalitycode']).nationalitycode)?{rules:[{required: false, message: ''}]}:{rules: [{ required: true, message: '国籍不能为空!' }]}]"/>
                  </a-form-item>
                </a-col>
              </a-row>
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="证件长期有效">
              <DicSwitch :disabled="(editable === 'view')" dicType="VIP_IDCARDISLONG"
                         :value="dataForm.getFieldsValue(['idcardislong']).idcardislong"
                         v-decorator="['idcardislong', {initialValue: inputCompact.idcardislongValue}]"
                         @change="changeIdcard(dataForm.getFieldsValue(['idcardislong']).idcardislong)"/>
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="证件有效期始">
              <a-week-picker :disabled="(editable === 'view')" format="YYYY-MM-DD" v-decorator="['idcardstart']"/>
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="证件有效期止">
              <a-week-picker :disabled="disabledCard||editable === 'view'" format="YYYY-MM-DD"
                             v-decorator="['idcardend']"/>
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="邮编">
              <a-input :disabled="(editable === 'view')"
                       v-decorator="['zip',{rules: [{ required: true, message: '邮编不能为空!' },{ pattern:new RegExp(/^[0-9]*$/),message: '只能录入数字!'}]}]"/>
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="省份">
              <AddressSelect :disabled="(editable === 'view')" dicType="0" placeholder="请选择省份"
                             v-decorator="['province',{initialValue: '',rules: [{ required: true, message: '请选择省份!' }]}]"
                             @change="hasCascadeDefaultProvince = true"></AddressSelect>
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="城市">
              <AddressSelect :hasCascadeDefault="hasCascadeDefaultProvince" :disabled="(editable === 'view')"
                             :dicType="dataForm.getFieldValue('province')" placeholder="请选择"
                             v-decorator="['city',{initialValue: '',rules: [{ required: true, message: '请选择城市!' }]}]"
                             @change="hasCascadeDefaultCity=true"></AddressSelect>
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="区县">
              <AddressSelect :hasCascadeDefault="hasCascadeDefaultProvince || hasCascadeDefaultCity"
                             :disabled="(editable === 'view')" :dicType="dataForm.getFieldValue('city')"
                             placeholder="请选择区县" v-decorator="['district',{initialValue: ''}]"></AddressSelect>
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="街道">
              <a-input :disabled="(editable === 'view')"
                       v-decorator="['street', {rules: [{ required: true, message: '街道不能为空!' }]}]"/>
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="地址">
              <a-input :disabled="(editable === 'view')"
                       v-decorator="['address', {rules: [{ required: true, message: '地址不能为空!' }]}]"/>
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="移动电话">
              <a-input :disabled="(editable === 'view')"
                       v-decorator="['mobile', {rules: [{ required: true, message: '移动电话不能为空!' },{ pattern:new RegExp(/^[0-9]*$/),message: '只能录入数字!'}]}]"/>
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="电子邮箱">
              <a-input :disabled="(editable === 'view')" v-decorator="['email', {initialValue: ''}]"/>
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="微信号">
              <a-input :disabled="(editable === 'view')" v-decorator="['wechat', {initialValue: ''}]"/>
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="紧急联系人">
              <a-input :disabled="(editable === 'view')"
                       v-decorator="['emercontact', {rules: [{ required: true, message: '紧急联系人不能为空!' }]}]"/>
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="紧急联系方式">
              <a-input :disabled="(editable === 'view')"
                       v-decorator="['emermobile', {rules: [{ required: true, message: '紧急联系方式不能为空!' },{ pattern:new RegExp(/^[0-9]*$/),message: '只能录入数字!'}]}]"/>
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item>
              <a-input type="hidden" v-decorator="['customercode', {initialValue: ''}]"/>
              <a-input type="hidden" v-decorator="['vipid']"/>
              <a-input type="hidden" v-decorator="['id']"/>
            </a-form-item>
          </a-col>
        </a-row>
      </a-card>
      <a-card>
        <a-divider orientation="left">
          <a-icon type="bank"/>
          购买信息
        </a-divider>
        <a-row>
          <a-col :span="6">
            <a-form-item label="购买产品">
              <DicSelect :disabled="(editable === 'view')" dicType="VIP_PRODUCT" placeholder="请选择购买产品"
                         v-decorator="[ 'productcode',{initialValue:'001', rules: [{ required: true, message: '请选择购买产品!' }]}]"/>
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="购买金额">
              <a-input-number :disabled="(inputCompact.sxtypeDisabled||editable === 'view')"
                              :min="100" :formatter="value => `￥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                              :parser="value => value.replace(/\￥\s?|(,*)/g, '')"
                              v-decorator="['money', {rules: [{ required: true, message: '请选择购买金额!' }]}]"
                              @blur="doCheckMoney"/>
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="试销计划">
              <DicSelect :disabled="(editable === 'view')" dicType="VIP_SX_TYPE" placeholder="请选择试销计划"
                         v-decorator="[ 'sxtype',{rules: [{ required: true, message: '请选择试销计划!' }]}]"
                         @select="doChecksxtype"/>
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="会员卡形式">
              <DicSwitch :disabled="(editable === 'view')" dicType="VIP_CARD_TYPE"
                         :value="dataForm.getFieldsValue(['type']).type"
                         v-decorator="['type', {initialValue: inputCompact.typeValue}]"/>
              <a-input type="hidden" v-decorator="['typeName', {initialValue: ''}]"/>
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="推荐人编号">
              <a-input :disabled="(editable === 'view')"
                       v-decorator="['refereecode', {rules: [{ required: true, message: '推荐人编号不能为空' }]}]"
                       @pressEnter="refereecodeCheck" @blur="refereecodeCheck"/>
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="销售渠道">
              <DicSelect :disabled="true" dicType="VIP_SALECHNL" v-decorator="[ 'agentchannel']"/>
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="推荐人姓名">
              <a-input :disabled="true" v-decorator="['refereename', {initialValue: ''}]"/>
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="推荐人电话">
              <a-input :disabled="true" v-decorator="['refereemobile', {initialValue: ''}]"/>
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="中介公司">
              <a-select :disabled="(inputCompact.agentcomcodeDisabled || editable === 'view')"
                        v-decorator="['agentcomcode', {initialValue: ''}]">
                <a-select-option v-for="(item, index) in inputCompact.agentComList" :value="item.value" :key="index">{{item.label }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="交叉销售渠道">
              <DicSelect :disabled="(inputCompact.unisaleschannelDisabled || editable === 'view')"
                         :labelInValue="true" @select="value => formSets(value,{rowkey:'unisaleschannel'})"
                         dicType="VIP_UNI_SALECHNL" v-decorator="[ 'unisaleschannelTemp']" />
              <a-input type="hidden" v-decorator="['unisaleschannel']"/>
              <a-input type="hidden" v-decorator="['unisaleschannelName']"/>
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="交叉销售业务类型">
              <DicSelect :disabled="(inputCompact.unisaleschannelDisabled || editable === 'view')"
                         :labelInValue="true"  @select="value => formSet(value,{rowkey:'unisalesbusitype'})"
                         dicType="VIP_UNI_SALEBUSI" v-decorator="[ 'unisalesbusitypeTemp']"/>
              <a-input type="hidden" v-decorator="['unisalesbusitype']"/>
              <a-input type="hidden" v-decorator="['unisalesbusitypeName']"/>
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="对方业务员编号">
              <a-input :disabled="(inputCompact.unisaleschannelDisabled || editable === 'view')"
                       v-decorator="['uniagentcode', {initialValue: ''}]" @pressEnter="uniagentcodeCheck"
                       @blur="uniagentcodeCheck"/>
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="对方业务员姓名">
              <a-input :disabled="true" v-decorator="['uniagentname', {initialValue: ''}]"/>
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="对方业务员身份证">
              <a-input :disabled="true" v-decorator="['uniagentidno', {initialValue: ''}]"/>
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="对方机构编码">
              <a-input :disabled="true" v-decorator="['uniagentunitcode', {initialValue: ''}]"/>
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="对方机构名称">
              <a-input :disabled="true" v-decorator="['uniagentunitname', {initialValue: ''}]"/>
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="领取方式">
              <DicSwitch
                :disabled="(inputCompact.typeValue === parseInt(dataForm.getFieldsValue(['type']).type))||(editable === 'view')"
                dicType="VIP_DEALTYPE" :value="dataForm.getFieldsValue(['dealtype']).dealtype"
                v-decorator="['dealtype',{initialValue: inputCompact.dealtypeValue}]"/>
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="代领人姓名">
              <a-input
                :disabled="inputCompact.typeValue === parseInt(dataForm.getFieldsValue(['type']).type)||inputCompact.dealtypeValue === parseInt(dataForm.getFieldsValue(['dealtype']).dealtype) || editable === 'view'"
                v-decorator="['agentName',{
                  initialValue: '',
                  rules: [(inputCompact.typeValue === parseInt(dataForm.getFieldsValue(['type']).type)||inputCompact.dealtypeValue === parseInt(dataForm.getFieldsValue(['dealtype']).dealtype) || editable === 'view')?{required: false, message: ''}:{ required: true, message: '请输入代领人姓名!' }]}
               ]"/>
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="代领人电话">
              <a-input
                :disabled="inputCompact.typeValue === parseInt(dataForm.getFieldsValue(['type']).type)|| inputCompact.dealtypeValue === parseInt(dataForm.getFieldsValue(['dealtype']).dealtype) ||editable === 'view'"
                v-decorator="['agentmobile',{
                  initialValue: '',
                  rules: [(inputCompact.typeValue === parseInt(dataForm.getFieldsValue(['type']).type)||inputCompact.dealtypeValue === parseInt(dataForm.getFieldsValue(['dealtype']).dealtype) || editable === 'view')?{required: false, message: ''}:{ required: true, message: '请输入代领人电话!' }]}]"/>
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="邮寄方式">
              <DicSwitch
                :disabled="(inputCompact.typeValue === parseInt(dataForm.getFieldsValue(['type']).type))||(editable === 'view')"
                dicType="VIP_RECEIVETYPE" :value="dataForm.getFieldsValue(['receivetype']).receivetype"
                v-decorator="['receivetype', {initialValue: inputCompact.receivetypeValue}]"
                @change="changeReceiveType"/>
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="邮寄省份">
              <AddressSelect
                :disabled="(inputCompact.typeValue === parseInt(dataForm.getFieldsValue(['type']).type))||(inputCompact.receivetypeValue === parseInt(dataForm.getFieldsValue(['receivetype']).receivetype) || editable === 'view')"
                dicType="0" placeholder="请选择邮寄省份"
                v-decorator="['receiveprovince',{
                  initialValue:'',
                  rules: [(inputCompact.typeValue === parseInt(dataForm.getFieldsValue(['type']).type)||inputCompact.receivetypeValue === parseInt(dataForm.getFieldsValue(['receivetype']).receivetype) || editable === 'view')?{required: false, message: ''}:{ required: true, message: '请选择省份!' }]}]"></AddressSelect>
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="邮寄城市">
              <AddressSelect
                :disabled="(inputCompact.typeValue === parseInt(dataForm.getFieldsValue(['type']).type))||(inputCompact.receivetypeValue === parseInt(dataForm.getFieldsValue(['receivetype']).receivetype) || editable === 'view')"
                :dicType="dataForm.getFieldValue('receiveprovince')" placeholder="请选择"
                v-decorator="['receivecity',{
                  initialValue:'',
                  rules: [(inputCompact.typeValue === parseInt(dataForm.getFieldsValue(['type']).type)||inputCompact.receivetypeValue === parseInt(dataForm.getFieldsValue(['receivetype']).receivetype) || editable === 'view')?{ required: false, message: '' }:{ required: true, message: '请选择邮寄城市!' }]}]"></AddressSelect>
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="邮寄区县">
              <AddressSelect
                :disabled="inputCompact.typeValue === parseInt(dataForm.getFieldsValue(['type']).type)||inputCompact.receivetypeValue === parseInt(dataForm.getFieldsValue(['receivetype']).receivetype) || editable === 'view'"
                :dicType="dataForm.getFieldValue('receivecity')" placeholder="请选择邮寄区县"
                v-decorator="['receivedistrict',{
                  initialValue:'',
                  rules: [(inputCompact.typeValue === parseInt(dataForm.getFieldsValue(['type']).type)||inputCompact.receivetypeValue === parseInt(dataForm.getFieldsValue(['receivetype']).receivetype) || editable === 'view')?{ required: false, message: '' }:{ required: true, message: '请选择邮寄区县!' }]}]"></AddressSelect>
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="邮寄地址">
              <a-input
                :disabled="inputCompact.typeValue === parseInt(dataForm.getFieldsValue(['type']).type)||inputCompact.receivetypeValue === parseInt(dataForm.getFieldsValue(['receivetype']).receivetype) || editable === 'view'"
                v-decorator="['receiveremark',{
                  initialValue:'',
                  rules: [(inputCompact.typeValue === parseInt(dataForm.getFieldsValue(['type']).type)||inputCompact.receivetypeValue === parseInt(dataForm.getFieldsValue(['receivetype']).receivetype) || editable === 'view')?{ required: false, message: '' }:{ required: true, message: '邮寄地址不能为空!' }]}]"/>
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="账户管理费(%)">
              <a-input-number :disabled="(editable === 'view')" :formatter="value => `${value}%`" :min="0"
                              :parser="value => value.replace('%', '')"
                              v-decorator="['accmanagefee', {initialValue: '0',rules: [{ required: true, message: '账户管理费必须大于0！' }]}]"/>
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="账户解约管理费(%)">
              <a-input-number :disabled="(editable === 'view')" :formatter="value => `${value}%`" :min="0"
                              :parser="value => value.replace('%', '')"
                              v-decorator="['accrelieffee', {initialValue: '0'}]"/>
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item>
              <a-input type="hidden" v-decorator="['unitcode', {initialValue: ''}]"/>
              <a-input type="hidden" v-decorator="['unitname', {initialValue: ''}]"/>
              <a-input type="hidden" v-decorator="['status', {initialValue: ''}]"/>
              <a-input type="hidden" v-decorator="['agentunit', {initialValue: ''}]"/>
              <a-input type="hidden" v-decorator="['sendpointsflag', {initialValue: 0}]" />
            </a-form-item>
          </a-col>
        </a-row>

      </a-card>
    </a-form>
    <a-card style="margin-top:24px;">
      <span href="#" slot="title" style="float:left;"><a-icon type="bank"/> 约定使用人一览</span>
      <a href="#" slot="extra">
        <a-icon :type="iconType" @click="swithTableShow"/>
      </a>
      <a-row :gutter="16" style="margin-bottom:12px;">
        <a-col :span="12" :offset="12">
          <div style="float:right;">
            <a-button v-if="editable !== 'view'" type="primary" class="editable-add-btn" style="margin-right:10px;"
                      @click="addRelated">新建
            </a-button>
          </div>
        </a-col>
      </a-row>
      <a-table :scroll="{ x: 'max-content'}" v-show="showTable" :bordered="false" :dataSource="relatedList" :columns="columns">
        <span slot="relatednameTitle" class="requireColumn">姓名</span>
        <div slot="relatedname" slot-scope="text, record, index">
          <a-input v-if="record.editable" v-model="record.relatedname"/>
          <span v-if="!record.editable">{{text}}</span></div>
        <span slot="relatedcodeTitle" class="requireColumn">与会员本人关系</span>
        <div slot="relatedcode" slot-scope="text, record, index">
          <DicSelect v-if="record.editable" :value="{key:record.relatedcode}" dicType="VIP_RELATIONSHIP"
                     :labelInValue="true" @select="value => itemSetting(value, {rowindex:index, rowrecord:record, rowkey:'relatedcode'} )"></DicSelect>
          <span v-if="!record.editable">{{record.relatedcodeName}}</span></div>
        <div slot="relatedother" slot-scope="text, record, index">
          <a-input v-if="record.editable" v-model="record.relatedother"/>
          <span v-if="!record.editable">{{text}}</span></div>
        <span slot="relatedmobileTitle" class="requireColumn">移动电话</span>
        <div slot="relatedmobile" slot-scope="text, record, index">
          <a-input v-if="record.editable" v-model="record.relatedmobile"/>
          <span v-if="!record.editable">{{text}}</span></div>
        <span slot="relatedidcardtypeTitle" class="requireColumn">证件类型</span>
        <div slot="relatedidcardtype" slot-scope="text, record, index">
          <DicSelect v-if="record.editable" :value="{key:record.relatedidcardtype}" dicType="VIP_IDCARDTYPE"
                     :labelInValue="true" @select="value => itemSetting(value, {rowindex:index, rowrecord:record, rowkey:'relatedidcardtype'})" />
          <span v-if="!record.editable">{{record.relatedidcardtypeName}}</span></div>
        <span slot="relatedidcardTitle" class="requireColumn">证件号</span>
        <div slot="relatedidcard" slot-scope="text, record, index">
          <a-input v-if="record.editable" v-model="record.relatedidcard"  @blur="checkRelatedIdCard(index, record)"/>
          <span v-if="!record.editable">{{text}}</span></div>
        <span slot="relatedbirthdayTitle" class="requireColumn">生日</span>
        <div slot="relatedbirthday" slot-scope="text, record, index">
          <a-week-picker format="YYYY-MM-DD" v-if="record.editable" v-model="record.relatedbirthday"/>
          <span v-if="!record.editable">{{dateRender(text)}}</span></div>
        <div slot="idcardislong" slot-scope="text, record, index">
          <DicSelect v-if="record.editable" :value="{key:record.idcardislong}" dicType="VIP_IDCARDISLONG"
                     :defaultVal="{key:'1',label: '是'}" :labelInValue="true" @select="value => itemSetting(value, {rowindex:index, rowrecord:record, rowkey:'idcardislong'})"/>
          <span v-if="!record.editable">{{record.idcardislongName}}</span></div>
        <div slot="idcardstart" slot-scope="text, record, index">
          <a-week-picker format="YYYY-MM-DD" v-if="record.editable" v-model="record.idcardstart"/>
          <span v-if="!record.editable">{{dateRender(text)}}</span></div>
        <div slot="idcardend" slot-scope="text, record, index">
          <a-week-picker :disabled="(record.idcardislong === '1')" format="YYYY-MM-DD" v-if="record.editable"
                         v-model="record.idcardend"/>
          <span v-if="!record.editable">{{dateRender(text)}}</span></div>
        <div slot="operation" slot-scope="text, record, index" style="display:inline-block;">
          <a v-if="record.editable && editable !== 'view' && parseInt(record.personType) === 2"
             @click="saveRelated(index, record)">保存</a>
          <a v-if="record.editable && editable !== 'view' && parseInt(record.personType) === 2"
             @click="cancelRelated(index, record)">取消</a>
          <a v-if="!record.editable && editable !== 'view' && index !== 0"
             @click="editRelated(index, record)">编辑</a>
          <a v-if="!record.editable && editable !== 'view'"
             @click="delRelated(index, record)">删除</a>
        </div>
      </a-table>
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
	name: 'vip-insure-add',
	components: {DicSelect, DicSwitch, AddressSelect},
	data () {
		return {
			editable: '',
			dataFormLayout: {
				labelCol: {span: 12},
				wrapperCol: {span: 12}
			},
			disabledCard: false,
			inputCompact: {
				sexValue: 0,
				typeValue: 2,
				maritalstatusValue: 6,
				nationalityValue: 'OS',
				agentcomcodeDisabled: true,
				idcardislongValue: 2,
				dealtypeValue: 1,
				receivetypeValue: 1,
				agentComList: [],
				unisaleschannelDisabled: true,
				sxtypeDisabled: false
			},
			submitLoading: false,
			dataForm: this.$form.createForm(this, {onFieldsChange: this.fieldsChanges}),
			showTable: true,
			iconType: 'down',
			relatedCount: 3,
			related: {
				id: '',
				vipid: '',
				insureid: '',
				personType: '2',
				relatedname: '',
				relatedcode: '',
				relatedcodeName: '',
				relatedother: '',
				relatedmobile: '',
				relatedidcardtype: '',
				relatedidcard: '',
				relatedbirthday: '',
				idcardislong: '1',
				idcardislongName: '',
				idcardstart: '',
				idcardend: '',
				relatedsex: ''
			},
			relatedList: [],
			cardTypeList: [],
			currentCard: '',
			currentCardCode: '',
			columns: [
				{
					align: "left",
					slots: {title: "relatednameTitle"},
					dataIndex: "relatedname",
					scopedSlots: {customRender: 'relatedname'}
				},
				{
					align: "left",
					width: 300,
					slots: {title: "relatedcodeTitle"},
					dataIndex: "relatedcode",
					scopedSlots: {customRender: 'relatedcode'}
				},
				{
					align: "left",
					title: "其他关系",
					dataIndex: "relatedother",
					scopedSlots: {customRender: 'relatedother'}
				},
				{
					align: "left",
					slots: {title: "relatedmobileTitle"},
					dataIndex: "relatedmobile",
					scopedSlots: {customRender: 'relatedmobile'}
				},
				{
					align: "left",
					slots: {title: "relatedidcardtypeTitle"},
					dataIndex: "relatedidcardtype",
					scopedSlots: {customRender: 'relatedidcardtype'}
				},
				{
					align: "left",
					slots: {title: "relatedidcardTitle"},
					dataIndex: "relatedidcard",
					scopedSlots: {customRender: 'relatedidcard'}
				},
				{
					align: "left",
					slots: {title: "relatedbirthdayTitle"},
					dataIndex: "relatedbirthday",
					scopedSlots: {customRender: 'relatedbirthday'}
				},
				{
					align: "left",
					title: "证件长期有效",
					dataIndex: "idcardislong",
					scopedSlots: {customRender: 'idcardislong'}
				},
				{
					align: "left",
					title: "证件有效期始",
					dataIndex: "idcardstart",
					scopedSlots: {customRender: 'idcardstart'}
				},
				{
					align: "left",
					title: "证件有效期止",
					dataIndex: "idcardend",
					scopedSlots: {customRender: 'idcardend'}
				},
				{
					align: "left",
					title: "操作",
					fixed: "right",
					dataIndex: "operation",
					scopedSlots: {customRender: 'operation'}
				}
			],
			printCardType: '',
			hasCascadeDefaultProvince: false,
			hasCascadeDefaultCity: false,
			sysParamList: []
		}
	},
	mounted () {
		this.hasCascadeDefaultProvince = false
		this.hasCascadeDefaultCity = false
		this.syncMainRelated()
		this.getCardTypeList()
		this.getSysparam()
	},
	methods: {
		chan (e) {
			if (e !== this.inputCompact.nationalityValue) {
				this.dataForm.setFieldsValue({nationalityother: ''})
			}
		},
		change (e) {
			if (e !== this.inputCompact.maritalstatusValue) {
				this.dataForm.setFieldsValue({maritalstatusother: ''})
			}
		},
		initFormValue (obj) {
			this.hasCascadeDefaultProvince = false
			this.hasCascadeDefaultCity = false
			this.editable = obj.editable
			debugger
			if (obj.vipInsure.status !== 1) this.editable = 'view'
			if (!obj.vipInsure.accmanagefee) obj.vipInsure.accmanagefee = 0
			if (!obj.vipInsure.accrelieffee) obj.vipInsure.accrelieffee = 0
			this.relatedList = obj.list
			this.$nextTick(() => {
				// 排序-本人排在第一位
				if (this.relatedList.length > 1) {
					let findex = this.relatedList.findIndex(item => parseInt(item.personType) === 1)
					if (findex >= 0) {
						let fperson = Object.assign({}, this.relatedList[findex])
						this.relatedList.splice(findex, 1)
						this.relatedList.unshift(fperson)
					}
				}
				debugger
				let formData = Object.assign({}, obj.vipInsure, obj.vipInsureOther)
				Object.assign(formData, {'idcardtypeTemp': {key: obj.vipInsure.idcardtype},
					'unisaleschannelTemp': {key: obj.vipInsure.unisaleschannel},
					'unisalesbusitypeTemp': {key: obj.vipInsure.unisalesbusitype}})
				this.disabledCard = parseInt(formData.idcardislong) === 1
				this.dataForm.setFieldsValue(formData)
				this.refereecodeCheck()
				this.doCheckMoney()
			})
		},
		fieldsChanges (props, fields) {
			// 切换会员卡联动
			if (fields.type) {
				this.cascadeType(props, fields)
			}
			// 约定使用人数据同步
			this.syncMainRelated()
		},
		cascadeType (props, typeField) {
			// 1-实物, 2-电子
			if (typeField.type.value === '2') {
				this.dataForm.setFieldsValue({dealtype: this.inputCompact.dealtypeValue})
				this.dataForm.setFieldsValue({receivetype: this.inputCompact.receivetypeValue})
				this.dataForm.setFieldsValue({agentName: ''})
				this.dataForm.setFieldsValue({agentmobile: ''})
				this.dataForm.setFieldsValue({receiveprovince: ''})
				this.dataForm.setFieldsValue({receivecity: ''})
				this.dataForm.setFieldsValue({receivedistrict: ''})
				this.dataForm.setFieldsValue({receiveremark: ''})
			}
		},
		syncMainRelated () {
			this.related = {}
			if (this.relatedList.length === 0) {
				this.relatedList.push(Object.assign(this.related, {personType: '1', relatedcode: '1', relatedcodeName: '本人'}))
			} else if (this.relatedList.length > 0 && this.relatedList.findIndex(item => parseInt(item.personType) === 1) < 0) {
				this.relatedList.unshift(Object.assign(this.related, {
					personType: '1',
					relatedcode: '1',
					relatedcodeName: '本人'
				}))
			}
			this.relatedList[0].relatedname = this.dataForm.getFieldsValue(['name']).name
			this.relatedList[0].relatedmobile = this.dataForm.getFieldsValue(['mobile']).mobile
			this.relatedList[0].relatedidcardtype = this.dataForm.getFieldsValue(['idcardtype']).idcardtype
			this.relatedList[0].relatedidcardtypeName = this.dataForm.getFieldsValue(['idcardtypeName']).idcardtypeName
			this.relatedList[0].relatedidcard = this.dataForm.getFieldsValue(['idcard']).idcard
			this.relatedList[0].relatedbirthday = this.dataForm.getFieldsValue(['birthday']).birthday
			this.relatedList[0].idcardislong = this.dataForm.getFieldsValue(['idcardislong']).idcardislong
			this.relatedList[0].idcardislongName = (this.dataForm.getFieldsValue(['idcardislong']).idcardislong === '1') ? '是' : '否'
			this.relatedList[0].idcardstart = this.dataForm.getFieldsValue(['idcardstart']).idcardstart
			this.relatedList[0].idcardend = this.dataForm.getFieldsValue(['idcardend']).idcardend
		},
		saveInsure () {
			let that = this
			// 校验表单
			this.dataForm.validateFields((error, values) => {
				if (error) {
					that.$message.error('您填写的数据有误或者必填项没填！')
					return
				}
				if (parseInt(that.dataForm.getFieldValue('accmanagefee')) <= 0) {
					that.$message.error('账户管理费必须大于0！')
					return
				}
				if (that.relatedList.length < 3) {
					that.$message.error('约定使用人至少输入3人！')
					return
				}
				if (!that.checkIdCard()) {
				 return
				}
				try {
					that.relatedList.forEach(record => {
						// eslint-disable-next-line no-throw-literal
						if (record.editable) throw '必录项不能为空！'
						// eslint-disable-next-line no-throw-literal
						if (!that.checkIdNumberLogic(record.relatedidcardtype, record.relatedidcard)) throw ''
					})
				} catch (e) {
				  if (e !== '')that.$message.error(e)
					return
				}
				let vipInsure = Object.assign({insuretype: 1.0, storetypecode: '2'}, that.dataForm.getFieldsValue())
				delete vipInsure.idcardtypeTemp
				let data = {list: that.relatedList, vipInsure: vipInsure, vipInsureOther: that.dataForm.getFieldsValue(['unisaleschannel', 'unisalesbusitype', 'uniagentcode', 'uniagentname', 'uniagentidno', 'uniagentunitcode', 'uniagentunitname', 'sendpointsflag'])}
				if (that.editable === 'edit') {
					this.submitLoading = true
					api.updateInsureInfo(data).then(res => {
						if (res.status === 0) {
							that.$message.success('提交成功')
						} else {
							that.$message.error(res.statusText)
						}
					}).finally(() => {
						that.submitLoading = false
					})
				} else {
					this.submitLoading = true
					api.saveInsureInfo(data).then(res => {
						if (res.status === 0) {
							that.$message.success('提交成功')
							that.dataForm.setFieldsValue({id: res.data.insureId})
							that.dataForm.setFieldsValue({vipid: res.data.vipId})
							that.printInsure()
							that.resetInsure()
						} else {
							that.$message.error(res.statusText)
						}
					}).finally(() => {
						that.submitLoading = false
					})
				}
			})
		},
		changeIdcard (checked) {
			this.disabledCard = parseInt(checked) === 2
			this.dataForm.setFieldsValue({idcardislong: checked})
		},
		resetInsure () {
			// 重置表单
			this.dataForm.resetFields()
			this.relatedList = []
			this.inputCompact.sxtypeDisabled = false
		},
		printInsure () {
		  debugger
			let data = {
				insureId: this.dataForm.getFieldValue('id'),
				vipId: this.dataForm.getFieldValue('vipid'),
				unitName: this.dataForm.getFieldValue('unitname'),
				unitCode: this.dataForm.getFieldValue('unitcode'),
				unisaleschannelName: this.dataForm.getFieldValue('unisaleschannelName'),
				unisalesbusitypeName: this.dataForm.getFieldValue('unisalesbusitypeName')
			}
			if (parseInt(this.dataForm.getFieldValue('type')) === 2) {
				data.printCardType = this.printCardType
			}
			api.vipInsurePrint(data).then(res => {
				if (res.status === undefined) {
					// base64内容，文件名
					this.$downloadFileByBase64(res, '贴心管家健康保障委托管理购买信息单')
				} else {
					this.$message.error('文件下载失败,请重试')
				}
			})
		},
		refereecodeCheck () {
			let that = this
			let refereeCode = this.dataForm.getFieldValue('refereecode')
			if (refereeCode === '' || refereeCode === undefined) return
			api.refereecodeCheck(refereeCode).then(res => {
			  if (res.status !== 0) {
					that.$message.warning(res.statusText)
				} else {
					if (res.data.flag) {
						let agentchannel = res.data.agentchannelcode
						if (agentchannel === "17") { // 如果是健管直销，可以选择中介公司，否则不可选择
							that.inputCompact.agentcomcodeDisabled = false
							let agentObj = {agentCode: res.data.agentCode, limit: 100000, page: 0}
							api.queryAgentCom(agentObj).then(rescom => {
								that.inputCompact.agentComList = []
								if (rescom.data.length > 0) {
									rescom.data.map(item => {
										that.inputCompact.agentComList.push({
											value: item.agencyunitcode,
											label: item.agencyunitname
										})
									})
								}
							})
						} else {
							that.inputCompact.agentcomcodeDisabled = true
							that.inputCompact.agentComList = []
							that.dataForm.setFieldsValue({agentcomcode: ''})
						}
						that.dataForm.setFieldsValue({
							refereename: res.data.agentName,
							refereemobile: res.data.agentmobile,
							agentchannel: res.data.agentchannelcode,
							unitcode: res.data.unitCode,
							unitname: res.data.unitName,
							agentunit: res.data.agentunit
						})
						// 查询交叉销售员
						if (agentchannel === "14" || agentchannel === "15") {
							that.inputCompact.unisaleschannelDisabled = false
						} else {
							that.inputCompact.unisaleschannelDisabled = true
							that.dataForm.setFieldsValue({unisaleschannel: '', unisalesbusitype: '', uniagentcode: '', uniagentname: '', uniagentidno: '', uniagentunitcode: '', uniagentunitname: ''})
						}
					} else {
						that.inputCompact.agentcomcodeDisabled = true
						that.inputCompact.agentComList = []
						that.inputCompact.unisaleschannelDisabled = true
						that.dataForm.setFieldsValue({
							unisaleschannel: '',
							unisalesbusitype: '',
							uniagentcode: '',
							uniagentname: '',
							uniagentidno: '',
							uniagentunitcode: '',
							uniagentunitname: '',
							refereecode: '',
							refereename: '',
							refereemobile: '',
							agentchannel: '',
							unitcode: '',
							unitname: '',
							agentcomcode: ''
						})
						that.$message.warning("无此工号")
					}
				}
			})
		},
		uniagentcodeCheck () {
			let that = this
			let uniagentObj = {uniagentCode: this.dataForm.getFieldValue('uniagentcode'), unitCode: this.dataForm.getFieldValue('unitcode')}
			api.uniagentcodeCheck(uniagentObj).then(res => {
				debugger
				if (res.flag) {
					that.dataForm.setFieldsValue({
						uniagentname: res.uniagentname,
						uniagentidno: res.uniagentidno,
						uniagentunitcode: res.uniagentunitcode,
						uniagentunitname: res.uniagentunitname
					})
				} else {
					that.dataForm.setFieldsValue({
						uniagentcode: '',
						uniagentname: '',
						uniagentidno: '',
						uniagentunitcode: '',
						uniagentunitname: ''
					})
					that.$message.warning('无此交叉工号，请重新填写')
				}
			})
		},
		formSets (LabeledValue, option) {
			let unisaleschannel = option.rowkey
			let unisaleschannelName = option.rowkey + 'Name'
			this.dataForm.setFieldsValue({unisaleschannel: LabeledValue.key, unisaleschannelName: LabeledValue.label})
		},
		formSet (LabeledValue, option) {
			let unisalesbusitype = option.rowkey
			let unisalesbusitypeName = option.rowkey + 'Name'
			this.dataForm.setFieldsValue({unisalesbusitype: LabeledValue.key, unisalesbusitypeName: LabeledValue.label})
		},
		addRelated () {
			this.$nextTick(() => {
				if (this.relatedList.length < this.relatedCount) {
					let newRelated = Object.assign({newrow: true, editable: true}, this.related)
					newRelated.personType = '2'
					newRelated.idcardislong = '2'
					newRelated.relatedidcardtype = ''
					newRelated.relatedcode = ''
					this.relatedList.push(newRelated)
				} else {
					this.$message.warning(this.currentCard + '约定使用人最多添加' + this.relatedCount + '条信息！')
				}
			})
		},
		saveRelated (index, record) {
			debugger
			if (!record.relatedname || !record.relatedcode || !record.relatedmobile || !record.relatedidcardtype || !record.relatedidcard || !record.relatedbirthday) {
				this.$message.error('必录项不能为空！')
				return
			}
			if (!this.checkRelatedIdCard(index, record)) {
				return
			}
			if (record.newrow) {
				this.$delete(record, 'newrow')
			}
			record.editable = false
			this.$delete(record, 'oldvalue')
			this.relatedList[index] = record
		},
		checkRelatedIdCard (index, record) {
			let idCardType = record.relatedidcardtype
			let idCard = record.relatedidcard
			if (idCard === '' || idCard === undefined) return false
			if (parseInt(idCardType) !== 0) return true
			idCard = idCard.toUpperCase()
			this.relatedList[index].relatedidcard = idCard
			// 身份证号校验
			let idcardFlag = this.checkIdNumberLogic(idCardType, idCard)
			if (idcardFlag) {
				// 根据身份证号取得性别和出生日期
				this.addRelatedBirthdayAndSex(index, record, idCard)
			}
			return idcardFlag
		},
		addRelatedBirthdayAndSex (index, record, idCard) {
			let sex = ''
			let xingbie = ''
			let year = ''
			let month = ''
			let day = ''
			// 出生日期，性别
			let obj = idCard
			if (obj.length === 15) {
				year = obj.substr(6, 2)
				month = obj.substr(8, 2)
				day = obj.substr(10, 2)
				xingbie = obj.substr(14, 1)
				if (xingbie % 2 === 0) {
					sex = "1"// "女性";
				} else {
					sex = "0"// "男性";
				}
				year = "19" + year
			} else if (obj.length === 18) {
				year = obj.substr(6, 4)
				month = obj.substr(10, 2)
				day = obj.substr(12, 2)
				xingbie = obj.substr(16, 1)
				if (xingbie % 2 === 0) {
					sex = "1"// "女性";
				} else {
					sex = "0"// "男性";
				}
			}
			let birthday = year.toString() + '-' + month + '-' + day.toString()
			this.relatedList[index].relatedbirthday = birthday
			this.relatedList[index].relatedsex = sex
			record.relatedbirthday = birthday
		},
		cancelRelated (index, record) {
			if (record.newrow) {
				this.relatedList.splice(index, 1)
			} else {
				this.relatedList[index] = record.oldvalue
				this.$delete(record, 'oldvalue')
				this.relatedList[index].editable = false
			}
		},
		editRelated (index, record) {
			this.$set(record, 'editable', true)
			record.oldvalue = Object.assign({editable: false}, record)
		},
		delRelated (index, record) {
		  debugger
		  if (index === 0) {
				this.$message.warning("投保人不能删除!")
				return
			}
			this.relatedList.splice(index, 1)
		},
		itemSetting (LabeledValue, option) {
			this.$set(this.relatedList[option.rowindex], option.rowkey, LabeledValue.key)
			this.$set(this.relatedList[option.rowindex], option.rowkey + 'Name', LabeledValue.label)
		},
		formSetting (LabeledValue, option) {
			let item = {}
			this.$set(item, option.rowkey, LabeledValue.key)
			this.$set(item, option.rowkey + 'Name', LabeledValue.label)
			this.dataForm.setFieldsValue(item)
		},
		dateRender (text) {
			return text ? moment(text).format('YYYY-MM-DD') : ''
		},
		swithTableShow () {
			this.showTable = !this.showTable
			this.iconType = this.showTable ? 'down' : 'up'
		},
		doChecksxtype (value) {
			let sxtype = value
			if (sxtype === '0') {
				this.inputCompact.sxtypeDisabled = false
				this.dataForm.setFieldsValue({money: ''})
			} else if (sxtype === '1') {
				this.inputCompact.sxtypeDisabled = true
				this.dataForm.setFieldsValue({money: '3000'})
				this.doCheckMoney()
			} else if (sxtype === '2') {
				this.inputCompact.sxtypeDisabled = true
				this.dataForm.setFieldsValue({money: '10000'})
				this.doCheckMoney()
			} else if (sxtype === '3') {
				this.inputCompact.sxtypeDisabled = true
				this.dataForm.setFieldsValue({money: '50000'})
				this.doCheckMoney()
			} else if (sxtype === '4') {
				this.inputCompact.sxtypeDisabled = true
				this.dataForm.setFieldsValue({money: '100000'})
				this.doCheckMoney()
			}
		},
		doCheckMoney () {
			let money = parseInt(this.dataForm.getFieldValue('money'))
			if (money > 99999999.99) {
				this.$message.error('数据不能超过99999999.99，请重新输入！')
				this.dataForm.setFieldsValue({money: ''})
				return
			}
			if (money < 100) {
				this.$message.error('储值金额必须大于等于100元')
				this.dataForm.setFieldsValue({money: ''})
				return
			}
			if (money === 3000) {
				this.dataForm.setFieldsValue({sxtype: '1'})
			} else if (money === 10000) {
				this.dataForm.setFieldsValue({sxtype: '2'})
			} else if (money === 50000) {
				this.dataForm.setFieldsValue({sxtype: '3'})
			} else if (money === 100000) {
				this.dataForm.setFieldsValue({sxtype: '4'})
			} else {
				this.dataForm.setFieldsValue({sxtype: '0'})
			}
			// 根据储值金额判断会员卡类别，设置预约使用人的最大数
			this.cardTypeList.forEach(p => {
				if (parseInt(p.moneystart) <= money && money <= parseInt(p.moneyend)) {
					this.currentCard = p.name
					this.currentCardCode = p.code
				}
			})
			if (this.currentCardCode === '01') {
				this.relatedCount = this.getSysparamString("ZHISHANGUSEPPL")
				this.printCardType = '至尚卡，首次购买金额1,000-10,000元（不含）'
			} else if (this.currentCardCode === '02') {
				this.relatedCount = this.getSysparamString("ZHIZHENUSEPPL")
				this.printCardType = '至珍卡，首次购买金额10,000-50,000元（不含）'
			} else if (this.currentCardCode === '03') {
				this.relatedCount = this.getSysparamString("ZHIXIANGUSEPPL")
				this.printCardType = '至享卡，首次购买金额50,000-100,000元（不含）'
			} else if (this.currentCardCode === '04') {
				this.relatedCount = this.getSysparamString("ZHIZUNUSEPPL")
				this.printCardType = '至尊卡，首次购买金额≥100,000元'
			}
		},
		getCardTypeList () {
			api.getCardTypeList().then(res => {
				this.cardTypeList = res.data
			}
			)
		},
		getSysparam () {
			api.getVipSysparam().then(res => {
				if (res.status === 0) {
					this.sysParamList = res.data
				} else {
					this.$message.error(res.statusText)
				}
			}
			)
		},
		getSysparamString (sysParamId) {
			let res = 3
			this.sysParamList.forEach(p => {
				if (p.id === sysParamId) res = parseInt(p.paramvalue)
			})
			return res
		},
		changeReceiveType () {
			let receiveType = this.dataForm.getFieldValue('receivetype')
			if (parseInt(receiveType) === 1) {
				this.dataForm.setFieldsValue(
					{
						receiveprovince: this.dataForm.getFieldValue('province'),
						receivecity: this.dataForm.getFieldValue('city'),
						receivedistrict: this.dataForm.getFieldValue('district'),
						receiveremark: this.dataForm.getFieldValue('street') === undefined ? '' : this.dataForm.getFieldValue('street') + this.dataForm.getFieldValue('address')
					})
			} else {
				this.dataForm.setFieldsValue(
					{
						receiveprovince: '',
						receivecity: '',
						receivedistrict: '',
						receiveremark: ''
					})
			}
		},
		checkIdCard () {
			let idCardType = this.dataForm.getFieldValue('idcardtype')
			let idCard = this.dataForm.getFieldValue('idcard')
			if (idCard === '' || idCard === undefined) return false
			if (parseInt(idCardType) !== 0) return true
			idCard = idCard.toUpperCase()
			this.dataForm.setFieldsValue({idcard: idCard})
			// 身份证号校验
			let idcardFlag = this.checkIdNumberLogic(idCardType, idCard)
			if (idcardFlag) {
				// 根据身份证号取得性别和出生日期
				this.addBirthdayAndSex()
			}
			return idcardFlag
		},
		addBirthdayAndSex () {
			let sex = ''
			let xingbie = ''
			let year = ''
			let month = ''
			let day = ''
			// 出生日期，性别
			let obj = this.dataForm.getFieldValue('idcard')
			if (obj.length === 15) {
				year = obj.substr(6, 2)
				month = obj.substr(8, 2)
				day = obj.substr(10, 2)
				xingbie = obj.substr(14, 1)
				if (xingbie % 2 === 0) {
					sex = "1"// "女性";
				} else {
					sex = "0"// "男性";
				}
				year = "19" + year
			} else if (obj.length === 18) {
				year = obj.substr(6, 4)
				month = obj.substr(10, 2)
				day = obj.substr(12, 2)
				xingbie = obj.substr(16, 1)
				if (xingbie % 2 === 0) {
					sex = "1"// "女性";
				} else {
					sex = "0"// "男性";
				}
			}
			let birthday = year.toString() + '-' + month + '-' + day.toString()
			this.dataForm.setFieldsValue({sex: sex, birthday: birthday})
		},
		checkIdNumberLogic (idCardType, idCard) {
			if (parseInt(idCardType) !== 0) {
				return true
			}

			// 身份证号Check标记:0-正常，非0-错误信息
			let idcardFlag = true

			let idCardTemp = idCard
			if (idCardTemp.length === 0) {
				return true
			}

			if (idCardTemp.length !== 15 && idCardTemp.length !== 18) {
				let idcardMsg = "请输入正确的身份证号(15位/18位)"
				this.$message.error(idcardMsg)
				return false
			}

			// 身份号逻辑判断
			let strMessage = this.commonCheckIdNumberLogic(idCardTemp)
			if (strMessage !== "true") {
				this.$message.error(strMessage)
				idcardFlag = false
			} else {
				idcardFlag = true
			}
			return idcardFlag
		},
		commonCheckIdNumberLogic (idcard) {
			let Errors = ["true", "身份证号码位数不对！", "身份证号码出生日期超出范围或含有非法字符！", "身份证号码校验错误！", "身份证号码中地区编码不正确！"]
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
			}
			let Y, JYM, ereg
			let S, M
			let idcardArray = []
			idcardArray = idcard.split('')
			if (idcard.length !== 15 && idcard.length !== 18) return Errors[1]
			if (idcard.substr(0, 6) === "000000" || idcard.substr(0, 6) === "111111" || idcard.substr(0, 6) === "222222" || idcard.substr(0, 6) === "333333" || idcard.substr(0, 6) === "444444" || idcard.substr(0, 6) === "555555" || idcard.substr(0, 6) === "666666" || idcard.substr(0, 6) === "777777" || idcard.substr(0, 6) === "888888" || idcard.substr(0, 6) === "999999") return Errors[4]
			if (idcard.substr(0, 6) === "123456" || idcard.substr(0, 6) === "234567" || idcard.substr(0, 6) === "345678" || idcard.substr(0, 6) === "456789" || idcard.substr(0, 6) === "567890" || idcard.substr(0, 6) === "012345" || idcard.substr(0, 6) === "543210" || idcard.substr(0, 6) === "432109" || idcard.substr(0, 6) === "321098" || idcard.substr(0, 6) === "210987" || idcard.substr(0, 6) === "109876" || idcard.substr(0, 6) === "098765" || idcard.substr(0, 6) === "987654" || idcard.substr(0, 6) === "876543" || idcard.substr(0, 6) === "765432") return Errors[4]
			if (idcard.substr(0, 6) === "121212" || idcard.substr(0, 6) === "131313" || idcard.substr(0, 6) === "141414" || idcard.substr(0, 6) === "151515" || idcard.substr(0, 6) === "161616" || idcard.substr(0, 6) === "171717" || idcard.substr(0, 6) === "181818" || idcard.substr(0, 6) === "191919" || idcard.substr(0, 6) === "101010") return Errors[4]
			if (idcard.substr(0, 6) === "212121" || idcard.substr(0, 6) === "232323" || idcard.substr(0, 6) === "242424" || idcard.substr(0, 6) === "252525" || idcard.substr(0, 6) === "262626" || idcard.substr(0, 6) === "272727" || idcard.substr(0, 6) === "282828" || idcard.substr(0, 6) === "292929" || idcard.substr(0, 6) === "202020") return Errors[4]
			if (idcard.substr(0, 6) === "313131" || idcard.substr(0, 6) === "323232" || idcard.substr(0, 6) === "343434" || idcard.substr(0, 6) === "353535" || idcard.substr(0, 6) === "363636" || idcard.substr(0, 6) === "373737" || idcard.substr(0, 6) === "383838" || idcard.substr(0, 6) === "393939" || idcard.substr(0, 6) === "303030") return Errors[4]
			if (idcard.substr(0, 6) === "414141" || idcard.substr(0, 6) === "424242" || idcard.substr(0, 6) === "434343" || idcard.substr(0, 6) === "454545" || idcard.substr(0, 6) === "464646" || idcard.substr(0, 6) === "474747" || idcard.substr(0, 6) === "484848" || idcard.substr(0, 6) === "494949" || idcard.substr(0, 6) === "404040") return Errors[4]
			if (idcard.substr(0, 6) === "515151" || idcard.substr(0, 6) === "525252" || idcard.substr(0, 6) === "535353" || idcard.substr(0, 6) === "545454" || idcard.substr(0, 6) === "565656" || idcard.substr(0, 6) === "575757" || idcard.substr(0, 6) === "585858" || idcard.substr(0, 6) === "595959" || idcard.substr(0, 6) === "505050") return Errors[4]
			if (idcard.substr(0, 6) === "616161" || idcard.substr(0, 6) === "626262" || idcard.substr(0, 6) === "636363" || idcard.substr(0, 6) === "646464" || idcard.substr(0, 6) === "656565" || idcard.substr(0, 6) === "676767" || idcard.substr(0, 6) === "686868" || idcard.substr(0, 6) === "696969" || idcard.substr(0, 6) === "606060") return Errors[4]
			if (idcard.substr(0, 6) === "717171" || idcard.substr(0, 6) === "727272" || idcard.substr(0, 6) === "737373" || idcard.substr(0, 6) === "747474" || idcard.substr(0, 6) === "757575" || idcard.substr(0, 6) === "767676" || idcard.substr(0, 6) === "787878" || idcard.substr(0, 6) === "797979" || idcard.substr(0, 6) === "707070") return Errors[4]
			if (idcard.substr(0, 6) === "818181" || idcard.substr(0, 6) === "828282" || idcard.substr(0, 6) === "838383" || idcard.substr(0, 6) === "848484" || idcard.substr(0, 6) === "858585" || idcard.substr(0, 6) === "868686" || idcard.substr(0, 6) === "878787" || idcard.substr(0, 6) === "898989" || idcard.substr(0, 6) === "808080") return Errors[4]
			if (idcard.substr(0, 6) === "919191" || idcard.substr(0, 6) === "929292" || idcard.substr(0, 6) === "939393" || idcard.substr(0, 6) === "949494" || idcard.substr(0, 6) === "959595" || idcard.substr(0, 6) === "969696" || idcard.substr(0, 6) === "979797" || idcard.substr(0, 6) === "989898" || idcard.substr(0, 6) === "909090") return Errors[4]

			if (area[parseInt(idcard.substr(0, 2))] === null) return Errors[4]
			switch (idcard.length) {
			case 15:
				if ((parseInt(idcard.substr(6, 2)) + 1900) % 4 === 0 || ((parseInt(idcard.substr(6, 2)) + 1900) % 100 === 0 && (parseInt(idcard.substr(6, 2)) + 1900) % 4 === 0)) {
					ereg = /^[1-9][0-9]{5}[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|[1-2][0-9]))[0-9]{3}$/// 测试出生日期的合法性
				} else {
					ereg = /^[1-9][0-9]{5}[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|1[0-9]|2[0-8]))[0-9]{3}$/// 测试出生日期的合法性
				}
				if (ereg.test(idcard)) {
					return Errors[0]
				} else {
					return Errors[2]
				}
			case 18:
				if (parseInt(idcard.substr(6, 4)) % 4 === 0 || (parseInt(idcard.substr(6, 4)) % 100 === 0 && parseInt(idcard.substr(6, 4)) % 4 === 0)) {
					ereg = /^[1-9][0-9]{5}(19|20)[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|[1-2][0-9]))[0-9]{3}[0-9Xx]$/// 闰年出生日期的合法性正则表达式
				} else {
					ereg = /^[1-9][0-9]{5}(19|20)[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|1[0-9]|2[0-8]))[0-9]{3}[0-9Xx]$/// 平年出生日期的合法性正则表达式
				}
				if (ereg.test(idcard)) {
					S = (parseInt(idcardArray[0]) + parseInt(idcardArray[10])) * 7 + (parseInt(idcardArray[1]) + parseInt(idcardArray[11])) * 9 + (parseInt(idcardArray[2]) + parseInt(idcardArray[12])) * 10 + (parseInt(idcardArray[3]) + parseInt(idcardArray[13])) * 5 + (parseInt(idcardArray[4]) + parseInt(idcardArray[14])) * 8 + (parseInt(idcardArray[5]) + parseInt(idcardArray[15])) * 4 + (parseInt(idcardArray[6]) + parseInt(idcardArray[16])) * 2 + parseInt(idcardArray[7]) * 1 + parseInt(idcardArray[8]) * 6 + parseInt(idcardArray[9]) * 3
					Y = S % 11
					M = "F"
					JYM = "10X98765432"
					M = JYM.substr(Y, 1)
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
  .ant-select {
    min-width: 50px;
  }

  .requireColumn::before {
    display: inline-block;
    margin-right: 4px;
    color: #f5222d;
    font-size: 14px;
    font-family: SimSun, sans-serif;
    line-height: 1;
    content: '*';
  }
</style>>
