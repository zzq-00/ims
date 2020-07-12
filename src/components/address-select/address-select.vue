<template>
  <div>
    <a-select v-model="selectedVal" :dicType="dicType" :disabled="disabled" :mode="mode" :showSearch="showSearch" :filterOption="filterOption"  optionFilterProp="children" :allowClear="allowClear" :placeholder="placeholder" @change="onChange" @select="onSelect">
      <a-select-option v-for="(item, index) in dataList" :value="item.value" :key="index">{{ item.label }}</a-select-option>
    </a-select>
  </div>
</template>

<script>
import api from '@/api/api-common'

export default {
	name: 'AddressSelect',
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
		hasCascadeDefault: {
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
			this.loadList(this.setDefault)
		}
	},
	mounted () {
		this.loadList()
		if (this.value) {
			this.selectedVal = this.value
		}
	},
	methods: {
		getNameList (ids) {
			if (ids instanceof String) ids = [ids]
			return this.dataList.filter(item => ids.includes(item.value))
		},
		setDefault () {
			// 默认不联动，当需要联动的时候，选择父亲节点后，watch 到dicType变化 然后默认选择第一个
			if (this.hasCascadeDefault && this.dataList.length > 0 && this.dicType !== '0') {
				this.selectedVal = this.dataList[0].value
				// this.selectedVal = ''
				this.$emit('input', this.selectedVal)
				this.$emit('change', this.selectedVal)
			}
		},
		loadList (callback) {
			if (!this.dicType) return
			api.getAddressValues(this.dicType).then(res => {
				// console.log(res, "result")
				this.dataList = []
				res.map(item => {
					this.dataList.push({ value: item.placeCode, label: item.placeName })
				})
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

<style>

</style>
