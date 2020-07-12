
let mockData = {
	demand: {
		list: [],
		total: 11,
	},
	contract: {
		list: [],
		total: 11,
	},
	pay: {
		list: [],
		total: 0,
	},
	//付款记账 是否需要记账标识
	isAccountList: [
		{name: "是", value: 1},
		{name: "否", value: 0},
	],
	signDefault: "app_sec=c9412c6c7e31a1e378481a342ae8bdf6",  //详情页加密的缺省参数
  meanuList:[
    {
      name:'指标维护'
    }
  ]
};

export default mockData;
