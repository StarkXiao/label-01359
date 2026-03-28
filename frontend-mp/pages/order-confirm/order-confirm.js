// pages/order-confirm/order-confirm.js - 订单确认页
var app = getApp();
var mockData = require('../../mock/data.js');

Page({
  data: {
    orderItems: [],
    address: null,
    totalPrice: 0,
    totalCount: 0,
    freight: 0,
    remark: '',
    fromCart: false
  },

  onLoad: function(options) {
    var that = this;
    var fromCart = options.fromCart === 'true';
    that.setData({ fromCart: fromCart });
    
    if (fromCart) {
      that.loadCartItems();
    } else {
      var productId = options.productId;
      var quantity = parseInt(options.quantity) || 1;
      that.loadProductItem(productId, quantity);
    }
    
    that.loadDefaultAddress();
  },

  // 从购物车加载商品
  loadCartItems: function() {
    var cart = wx.getStorageSync('cart') || [];
    var selectedItems = cart.filter(function(item) {
      return item.selected;
    });
    
    var totalPrice = 0;
    var totalCount = 0;
    selectedItems.forEach(function(item) {
      totalPrice += item.price * item.quantity;
      totalCount += item.quantity;
    });
    
    this.setData({
      orderItems: selectedItems,
      totalPrice: totalPrice.toFixed(2),
      totalCount: totalCount
    });
  },

  // 加载单个商品
  loadProductItem: function(productId, quantity) {
    var product = mockData.getProductById(productId);
    if (product) {
      var item = Object.assign({}, product, { quantity: quantity });
      var totalPrice = product.price * quantity;
      
      this.setData({
        orderItems: [item],
        totalPrice: totalPrice.toFixed(2),
        totalCount: quantity
      });
    }
  },

  // 加载默认地址
  loadDefaultAddress: function() {
    var addressList = mockData.addressList;
    var defaultAddress = null;
    for (var i = 0; i < addressList.length; i++) {
      if (addressList[i].isDefault) {
        defaultAddress = addressList[i];
        break;
      }
    }
    if (!defaultAddress && addressList.length > 0) {
      defaultAddress = addressList[0];
    }
    this.setData({ address: defaultAddress });
  },

  // 输入备注
  onRemarkInput: function(e) {
    this.setData({ remark: e.detail.value });
  },

  // 提交订单
  onSubmitOrder: function() {
    var that = this;
    
    if (!that.data.address) {
      app.showToast('请选择收货地址');
      return;
    }
    
    if (that.data.orderItems.length === 0) {
      app.showToast('订单商品为空');
      return;
    }
    
    // 创建订单
    var order = {
      id: 'ORD' + Date.now(),
      createTime: new Date().toISOString(),
      status: 'unpaid',
      statusText: '待付款',
      items: that.data.orderItems,
      address: that.data.address,
      totalPrice: parseFloat(that.data.totalPrice),
      freight: that.data.freight,
      remark: that.data.remark,
      payAmount: parseFloat(that.data.totalPrice) + that.data.freight
    };
    
    // 保存订单
    var orders = wx.getStorageSync('orders') || [];
    orders.unshift(order);
    wx.setStorageSync('orders', orders);
    
    // 如果是从购物车下单，清除已选商品
    if (that.data.fromCart) {
      var cart = wx.getStorageSync('cart') || [];
      cart = cart.filter(function(item) {
        return !item.selected;
      });
      wx.setStorageSync('cart', cart);
      app.updateCartCount(cart.length);
    }
    
    // 跳转到支付页面
    wx.redirectTo({
      url: '/pages/order-pay/order-pay?orderId=' + order.id
    });
  }
});
