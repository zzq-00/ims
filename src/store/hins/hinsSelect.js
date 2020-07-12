// 健管中心下拉列表, 后期需要改为调接口获取
import axios from '@/libs/axios';
import {apiList} from '@/api/apiList';

export default {
  namespaced: true,
  state: {
    'VIP_SEX': [], // 性别
    'HINS_SERV_ITME': [], // 服务项目
    'HINS_SERV_ITME_SUB': [], // 服务项目明细
    'HINS_INSTRUMENT_TYPE': [], // 仪器类型
    'HOS_LEVEL_CODE': [], // 健管中心等级（center）
    'HINS_MEC_PROVINCE': [], // 健管中心所在地区
    'HINS_INSTRUMENT_FLAG': [], // 服务类型
    'HINS_SERV_STATUS': [], // 部分服务状态（医师技师服务查询条件）
    'HINS_SERV_ALL_STATUS': [], // 所有服务状态
    'HINS_DOC_CONCLUSIONS': [], // 医师结论（医师技师服务）
    'DOCTOR_TITLE_CODE': [], // 医师级别
    'VIP_IDCARDTYPE': [], // 证件类型
    'HINS_QUALIFICATION_TYPE': [], // 学历
    'VIP_MARRIAGE': [], // 婚姻状况
    'HINS_DES_DOC_CONCLUSIONS': [], // 医生结论（设备检测）
    'HINS_PAY_TYPE': [], // 支付类型（检测服务结算）
    'FHC_YESNO': [], // 是否支付成功（检测服务结算）
    'HINS_DOC_ORDERS': [] // 医生建议（检测服务结算）
  },
  getters: {
    cGender(state) {
      return Object.assign({}, ...state.VIP_SEX);
    },
    cServItem(state) {
      return Object.assign({}, ...state.HINS_SERV_ITME);
    },
    cServItemSub(state) {
      return Object.assign({}, ...state.HINS_SERV_ITME_SUB);
    },
    cInstrumentType(state) {
      return Object.assign({}, ...state.HINS_INSTRUMENT_TYPE);
    },
    cHosLevel(state) {
      return Object.assign({}, ...state.HOS_LEVEL_CODE);
    },
    cProvinces(state) {
      return Object.assign({}, ...state.HINS_MEC_PROVINCE);
    },
    cInstrumentFlag(state) {
      return Object.assign({}, ...state.HINS_INSTRUMENT_FLAG);
    },
    cServStatus(state) {
      return Object.assign({}, ...state.HINS_SERV_STATUS);
    },
    cDocConclusions(state) {
      return Object.assign({}, ...state.HINS_DOC_CONCLUSIONS);
    },
    cDocClass(state) {
      return Object.assign({}, ...state.DOCTOR_TITLE_CODE);
    },
    cIdType(state) {
      return Object.assign({}, ...state.VIP_IDCARDTYPE);
    },
    cDegree(state) {
      return Object.assign({}, ...state.HINS_QUALIFICATION_TYPE);
    },
    cMarriage(state) {
      return Object.assign({}, ...state.VIP_MARRIAGE);
    },
    cDesDocConclusions(state) {
      return Object.assign({}, ...state.HINS_DES_DOC_CONCLUSIONS);
    },
    cPayType(state) {
      return Object.assign({}, ...state.HINS_PAY_TYPE);
    },
    cYesNo(state) {
      return Object.assign({}, ...state.FHC_YESNO);
    },
    cDocOrders(state) {
      return Object.assign({}, ...state.HINS_DOC_ORDERS);
    },
  },
  mutations: {
    // 更新下拉列表
    updateCode(state, payload) {
      state[payload.key] = payload.value;
    }
  },
  actions: {
    // 获取码值
    fetchSelectCode({ state, commit, rootState }, {codename}) {
      
      let url = apiList.getSelectOptions(codename);
      axios.post(url).then((result) => {
          if (result == null || result === undefined) {
            result = [];
          }
          // 更新状态
          commit("updateCode", {
            key: codename,
            value: result
          });
      }).catch((err) => {
        console.log(err);
      });
    }
  }
}