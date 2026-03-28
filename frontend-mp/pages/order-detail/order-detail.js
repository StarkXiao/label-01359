// pages/order-detail/order-detail.js - 订单详情页
var app = getApp();

Page({
  data: {
    order: null,
    statusDesc: '',
    createTimeText: '',
    payTimeText: ''
  },

  onLoad: function(options) {
    var orderId = options.orderId;
    this.loadOrder(orderId);
  },

  onShow: function() {
    if (this.data.order) {
      this.loadOrder(this.data.order.id);
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
      var statusDesc = '';
      switch (order.status) {
        case 'unpaid':
          statusDesc = '请在15分钟内完成支付';
          break;
        case 'unshipped':
          statusDesc = '商家正在准备发货';
          break;
        case 'unreceived':
          statusDesc = '商品正在配送中';
          break;
        case 'completed':
          statusDesc = '订单已完成，感谢您的购买';
          break;
        case 'cancelled':
          statusDesc = '订单已取消';
          break;
      }
      
      that.setData({
        order: order,
        statusDesc: statusDesc,
        createTimeText: that.formatTime(order.createTime),
        payTimeText: order.payTime ? that.formatTime(order.payTime) : ''
      });
    } else {
      app.showToast('订单不存在');
      setTimeout(function() {
        wx.navigateBack();
      }, 1500);
    }
  },

  // 格式化时间
  formatTime: function(timeStr) {
    var date = new Date(timeStr);
    var pad = function(n) {
      return n < 10 ? '0' + n : String(n);
    };
    return date.getFullYear() + '-' + pad(date.getMonth() + 1) + '-' + pad(date.getDate()) + ' ' + pad(date.getHours()) + ':' + pad(date.getMinutes());
  },

  // 点击商品
  onGoodsTap: function(e) {
    var item = e.currentTarget.dataset.item;
    wx.navigateTo({
      url: '/pages/product-detail/product-detail?id=' + item.id
    });
  },

  // 取消订单
  onCancelOrder: function() {
    var that = this;
    wx.showModal({
      title: '提示',
      content: '确定要取消该订单吗？',
      confirmColor: '#E91E63',
      success: function(res) {
        if (res.confirm) {
          that.updateOrderStatus('cancelled', '已取消');
          app.showToast('订单已取消');
        }
      }
    });
  },

  // 去支付
  onPayOrder: function() {
    wx.navigateTo({
      url: '/pages/order-pay/order-pay?orderId=' + this.data.order.id
    });
  },

  // 确认收货
  onConfirmReceive: function() {
    var that = this;
    wx.showModal({
      title: '确认收货',
      content: '请确认已收到商品',
      confirmColor: '#E91E63',
      success: function(res) {
        if (res.confirm) {
          that.updateOrderStatus('completed', '已完成');
          app.showToast('收货成功');
        }
      }
    });
  },

  // 更新订单状态
  updateOrderStatus: function(status, statusText) {
    var that = this;
    var orders = wx.getStorageSync('orders') || [];
    for (var i = 0; i < orders.length; i++) {
      if (orders[i].id === that.data.order.id) {
        orders[i].status = status;
        orders[i].statusText = statusText;
        break;
      }
    }
    wx.setStorageSync('orders', orders);
    that.loadOrder(that.data.order.id);
  }
});
