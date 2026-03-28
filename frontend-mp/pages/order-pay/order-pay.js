// pages/order-pay/order-pay.js - 支付页面
var app = getApp();

Page({
  data: {
    order: null,
    payMethods: [
      { id: 'wechat', name: '微信支付', icon: '💳', selected: true },
      { id: 'balance', name: '余额支付', icon: '💰', selected: false }
    ],
    selectedMethod: 'wechat',
    countdown: 900,
    countdownText: '15:00'
  },

  timer: null,

  onLoad: function(options) {
    var orderId = options.orderId;
    this.loadOrder(orderId);
    this.startCountdown();
  },

  onUnload: function() {
    if (this.timer) {
      clearInterval(this.timer);
    }
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
      that.setData({ order: order });
    } else {
      app.showToast('订单不存在');
      setTimeout(function() {
        wx.navigateBack();
      }, 1500);
    }
  },

  // 开始倒计时
  startCountdown: function() {
    var that = this;
    that.timer = setInterval(function() {
      var countdown = that.data.countdown - 1;
      
      if (countdown <= 0) {
        clearInterval(that.timer);
        that.cancelOrder();
        return;
      }
      
      var minutes = Math.floor(countdown / 60);
      var seconds = countdown % 60;
      var countdownText = (minutes < 10 ? '0' : '') + minutes + ':' + (seconds < 10 ? '0' : '') + seconds;
      
      that.setData({ countdown: countdown, countdownText: countdownText });
    }, 1000);
  },

  // 选择支付方式
  onSelectMethod: function(e) {
    var id = e.currentTarget.dataset.id;
    var payMethods = this.data.payMethods.map(function(m) {
      return Object.assign({}, m, { selected: m.id === id });
    });
    this.setData({ payMethods: payMethods, selectedMethod: id });
  },

  // 确认支付
  onConfirmPay: function() {
    var that = this;
    
    wx.showModal({
      title: '确认支付',
      content: '确定支付 ¥' + that.data.order.payAmount.toFixed(2) + ' 吗？',
      confirmColor: '#E91E63',
      success: function(res) {
        if (res.confirm) {
          that.doPayment();
        }
      }
    });
  },

  // 执行支付
  doPayment: function() {
    var that = this;
    
    wx.showLoading({ title: '支付中...', mask: true });
    
    setTimeout(function() {
      wx.hideLoading();
      
      // 更新订单状态
      var orders = wx.getStorageSync('orders') || [];
      for (var i = 0; i < orders.length; i++) {
        if (orders[i].id === that.data.order.id) {
          orders[i].status = 'unshipped';
          orders[i].statusText = '待发货';
          orders[i].payTime = new Date().toISOString();
          break;
        }
      }
      wx.setStorageSync('orders', orders);
      
      // 跳转到支付成功页
      wx.redirectTo({
        url: '/pages/order-result/order-result?orderId=' + that.data.order.id + '&status=success'
      });
    }, 1500);
  },

  // 取消订单
  cancelOrder: function() {
    var that = this;
    
    var orders = wx.getStorageSync('orders') || [];
    for (var i = 0; i < orders.length; i++) {
      if (orders[i].id === that.data.order.id) {
        orders[i].status = 'cancelled';
        orders[i].statusText = '已取消';
        break;
      }
    }
    wx.setStorageSync('orders', orders);
    
    app.showToast('订单已超时取消');
    setTimeout(function() {
      wx.redirectTo({ url: '/pages/order-list/order-list' });
    }, 1500);
  },

  // 返回
  onBack: function() {
    wx.showModal({
      title: '提示',
      content: '确定要放弃支付吗？',
      confirmColor: '#E91E63',
      success: function(res) {
        if (res.confirm) {
          wx.navigateBack();
        }
      }
    });
  }
});
