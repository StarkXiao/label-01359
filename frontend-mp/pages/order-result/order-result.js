// pages/order-result/order-result.js - 支付结果页
var app = getApp();

Page({
  data: {
    order: null,
    status: 'success',
    payTimeText: ''
  },

  onLoad: function(options) {
    var orderId = options.orderId;
    var status = options.status || 'success';
    
    this.setData({ status: status });
    this.loadOrder(orderId);
  },

  // 加载订单
  loadOrder: function(orderId) {
    var that = this;
    var orders = wx.getStorageSync('orders') || [];
    var order = null;
    for (var i = 0; i < orders.length; i++) {
      if (orders[i].id === orderId) {
        order = orders[i];
        break;
      }
    }
    
    if (order) {
      var payTimeText = '';
      if (order.payTime) {
        var date = new Date(order.payTime);
        var pad = function(n) {
          return n < 10 ? '0' + n : String(n);
        };
        payTimeText = date.getFullYear() + '-' + pad(date.getMonth() + 1) + '-' + pad(date.getDate()) + ' ' + pad(date.getHours()) + ':' + pad(date.getMinutes());
      }
      
      that.setData({ order: order, payTimeText: payTimeText });
    }
  },

  // 查看订单
  onViewOrder: function() {
    wx.redirectTo({
      url: '/pages/order-detail/order-detail?orderId=' + this.data.order.id
    });
  },

  // 返回首页
  onBackHome: function() {
    wx.switchTab({ url: '/pages/index/index' });
  }
});
