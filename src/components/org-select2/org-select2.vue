<template>
  <a-select v-model="selectedVal" :dicType="dicType" :disabled="disabled" :mode="mode" :showSearch="showSearch" :filterOption="filterOption"  optionFilterProp="children" :allowClear="allowClear" :placeholder="placeholder" @change="onChange" @select="onSelect" :dropdownMatchSelectWidth="false">
    <a-select-option v-for="(item, index) in dataList" :value="item.value" :key="index">{{ item.label }}</a-select-option>
  </a-select>
</template>

<script>
import api from '@/api/api-common'

export default {
	name: 'OrgSelect',
	props: {
		placeholder: {
			type: String,
			default () {
				return '请选择'
			}
		},
		value: {
			type: [Number, Array, String],
			default () {
				return undefined
			}
		},
		dicType: {
			type: String,
			default () {
				return ''
			}
		},
		mode: {
			type: String,
			default () {
				return 'default'
			}
		},
		showSearch: {
			type: Boolean,
			default () {
				return true
			}
		},
		filterOption: {
			type: Boolean,
			default () {
				return true
			}
		},
		allowClear: {
			type: Boolean,
			default () {
				return false
			}
		},
		disabled: {
			type: Boolean,
			default () {
				return false
			}
		},
		dataType: {
			type: Array
		},
		ischeck: {
			type: Array
		},
		isSalary: {
			type: Array
		},
		Attach_86_1: {
			type: Array
		}
	},
	data () {
		return {
			dataList: [],
			selectedVal: ''
		}
	},
	watch: {
		value (newVal, oldVal) {
			this.selectedVal = newVal
		},
		dicType (newVal, oldVal) {
			this.loadList()
		}
	},
	mounted () {
		this.loadList()
		if (this.value) {
			this.selectedVal = this.value
		}
	},
	methods: {
    getName (name) {
      console.log('this.dataList:',this.dataList)
      let item = this.dataList.find(item => item.value === name)
      return item ? item.name : ''
    },
		// getClassNames (ids) {
		// 	let items = this.dataList.filter(item =>
		// 		ids.findIndex((value, index, arr) => {
		// 			return item.id === value
		// 		}) >= 0
		// 	)
		// 	let classNames = items.map(item => {
		// 		return item.className
		// 	})
		// 	return classNames
		// },
		loadList (callback) {
			if (!this.dicType) return
			if (this.dicType === 'datatype') {
				return this.dataType.map(item => {
					this.dataList.push({value: item.type, label: item.value})
				})
			}
			if (this.dicType === 'ischeck') {
				return this.ischeck.map(item => {
					this.dataList.push({value: item.type, label: item.value})
				})
			}
			if (this.dicType === 'BUFF') {
				return this.isSalary.map(item => {
					this.dataList.push({value: item.type, label: item.value})
				})
			}
			if (this.dicType === 'Attach_86_1') {
				api.getAllQueryAble('86').then(res => {
					res.map(item => {
						this.dataList.push({ value: item.orgCode,name:item.orgName,label: item.orgCode + '-' + item.orgName })
					})
				})
				return this.Attach_86_1.map(item => {
					this.dataList.push({value: item.type, label: item.type + '-' + item.value})
				})
			}

			if (this.dicType === 'orgCode_4') {
				api.getorgCode('4').then(res => {
					res.map(item => {
						this.dataList.push({ value: item.orgCode, label: item.orgCode + '-' + item.orgName,name:item.orgName })
					})
					let OrgCode = this.$store.state.userOrgCode
					if (OrgCode === '' || OrgCode == null || OrgCode === '86') {
						this.dataList.push({ value: '9001', label: 9001 + '-' + '总部健管中心' })
						this.dataList.push({ value: '9002', label: 9002 + '-' + '集团健管中心' })
					} else if (OrgCode === '9001') {
						this.dataList.push({ value: '9001', label: 9001 + '-' + '总部健管中心' })
					} else if (OrgCode === '9002') {
						this.dataList.push({ value: '9002', label: 9002 + '-' + '集团健管中心' })
					}
				})
			}

			api.getAllQueryAble(this.dicType).then(res => {
				console.log(res, "result")
				this.dataList = []
				res.map(item => {
					this.dataList.push({ value: item.orgCode, label: item.orgCode + '-' + item.orgName })
				})
				console.log(this.dataList)
				callback && callback()
			})
		},
		onChange (value, option) {
			this.$emit('input', value, option)
			this.$emit('change', value, option)
		},
		onSelect (value, opiton) {
			this.$emit('select', value, opiton)
		}
	}
}
</script>

<style >

</style>
