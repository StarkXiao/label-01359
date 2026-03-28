// components/search-bar/search-bar.js
Component({
  properties: {
    placeholder: {
      type: String,
      value: '搜索商品'
    },
    value: {
      type: String,
      value: ''
    },
    disabled: {
      type: Boolean,
      value: true
    },
    showBack: {
      type: Boolean,
      value: false
    }
  },

  data: {
    inputValue: ''
  },

  observers: {
    'value': function(val) {
      this.setData({ inputValue: val });
    }
  },

  methods: {
    onTap() {
      if (this.properties.disabled) {
        this.triggerEvent('tap');
      }
    },

    onInput(e) {
      const value = e.detail.value;
      this.setData({ inputValue: value });
      this.triggerEvent('input', { value });
    },

    onFocus(e) {
      this.triggerEvent('focus', e.detail);
    },

    onBlur(e) {
      this.triggerEvent('blur', e.detail);
    },

    onConfirm(e) {
      this.triggerEvent('confirm', { value: this.data.inputValue });
    },

    onClear() {
      this.setData({ inputValue: '' });
      this.triggerEvent('clear');
      this.triggerEvent('input', { value: '' });
    },

    onBack() {
      this.triggerEvent('back');
    }
  }
});
