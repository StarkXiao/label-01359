// components/product-card/product-card.js
Component({
  properties: {
    product: {
      type: Object,
      value: {}
    },
    mode: {
      type: String,
      value: 'grid' // grid | list
    },
    showCart: {
      type: Boolean,
      value: true
    }
  },

  data: {},

  methods: {
    onTap() {
      this.triggerEvent('tap', { product: this.properties.product });
    },

    onAddCart(e) {
      this.triggerEvent('addcart', { product: this.properties.product });
    }
  }
});
