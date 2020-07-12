<template>
  <div>
    <a-select v-model="selectedVal"   :disabled="disabled" :mode="mode" :showSearch="showSearch" :filterOption="filterOption"  optionFilterProp="children" :allowClear="allowClear" :placeholder="placeholder" @change="onChange" @select="onSelect" :dropdownMatchSelectWidth="false">
      <a-select-option v-for="(item, index) in dataList" :value="item.value" :key="index">{{ item.label }}</a-select-option>
    </a-select>
  </div>
</template>

<script>

export default {
	name: 'health-card-select',
	props: {
		dataList: {
			type: Array,
			default () {
				return [
			       {label: '请选择',
						value: ''
					},
					{label: '财务单证',
						value: '0'
					},
					{label: '自定义单证',
						value: '1'
					},
					{label: '第三方单证',
						value: '2'
					}

				]
			}
		},
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
		}
	},
	data () {
		return {
			dataLists: [],
			selectedVal: ''
		}
	},
	mounted () {
	},
	watch: {
		dataList (newV, oldV) {
			this.dataLists = newV
		},
		value (newV, oldV) {
			this.selectedVal = newV
		}
	},
	methods: {
		getCode (id) {
			let item = this.dataList.find(item => item.value === id)
			if (item && item.code) return item.code
			return ''
		},
		loadList (callback) {
		},
		onChange (value, option) {
			this.$emit('input', value, option)
			this.$emit('change', value, option)
		},
		onSelect (value, opiton) {
			this.$emit('select', value, opiton)
		}
	},
	created () {
	  this.dataLists = this.dataList
		this.selectedVal = this.value
		// alert(this.value)
	}
}
</script>

<style>

</style>
