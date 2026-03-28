// pages/order-list/order-list.js - 订单列表页
var app = getApp();

Page({
  data: {
    tabs: [
      { id: 'all', name: '全部', count: 0 },
      { id: 'unpaid', name: '待付款', count: 0 },
      { id: 'unshipped', name: '待发货', count: 0 },
      { id: 'unreceived', name: '待收货', count: 0 },
      { id: 'completed', name: '已完成', count: 0 }
    ],
    currentTab: 'all',
    orderList: [],
    allOrders: []
  },

  onLoad: function(options) {
    var tab = options.tab || 'all';
    this.setData({ currentTab: tab });
  },

  onShow: function() {
    this.loadOrders();
  },

  // 加载订单
  loadOrders: function() {
    var that = this;
    var orders = wx.getStorageSync('orders') || [];
    
    // 统计各状态数量
    var counts = { all: orders.length, unpaid: 0, unshipped: 0, unreceived: 0, completed: 0 };
    orders.forEach(function(order) {
      if (counts[order.status] !== undefined) {
        counts[order.status]++;
      }
    });
    
    var tabs = that.data.tabs.map(function(tab) {
      return Object.assign({}, tab, { count: counts[tab.id] || 0 });
    });
    
    // 筛选当前标签的订单
    var filteredOrders = orders;
    if (that.data.currentTab !== 'all') {
      filteredOrders = orders.filter(function(order) {
        return order.status === that.data.currentTab;
      });
    }
    
    that.setData({ tabs: tabs, allOrders: orders, orderList: filteredOrders });
  },

  // 切换标签
  onTabChange: function(e) {
    var tabId = e.currentTarget.dataset.id;
    var that = this;
    
    var filteredOrders = that.data.allOrders;
    if (tabId !== 'all') {
      filteredOrders = that.data.allOrders.filter(function(order) {
        return order.status === tabId;
      });
    }
    
    that.setData({ currentTab: tabId, orderList: filteredOrders });
  },

  // 点击订单
  onOrderTap: function(e) {
    var order = e.currentTarget.dataset.order;
    wx.navigateTo({
      url: '/pages/order-detail/order-detail?orderId=' + order.id
    });
  },

  // 取消订单
  onCancelOrder: function(e) {
    var that = this;
    var order = e.currentTarget.dataset.order;
    
    wx.showModal({
      title: '提示',
      content: '确定要取消该订单吗？',
      confirmColor: '#E91E63',
      success: function(res) {
        if (res.confirm) {
          that.updateOrderStatus(order.id, 'cancelled', '已取消');
          app.showToast('订单已取消');
        }
      }
    });
  },

  // 去支付
  onPayOrder: function(e) {
    var order = e.currentTarget.dataset.order;
    wx.navigateTo({
      url: '/pages/order-pay/order-pay?orderId=' + order.id
    });
  },

  // 确认收货
  onConfirmReceive: function(e) {
    var that = this;
    var order = e.currentTarget.dataset.order;
    
    wx.showModal({
      title: '确认收货',
      content: '请确认已收到商品',
      confirmColor: '#E91E63',
      success: function(res) {
        if (res.confirm) {
          that.updateOrderStatus(order.id, 'completed', '已完成');
          app.showToast('收货成功');
        }
      }
    });
  },

  // 再次购买
  onBuyAgain: function(e) {
    var order = e.currentTarget.dataset.order;
    if (order.items && order.items.length > 0) {
      wx.navigateTo({
        url: '/pages/product-detail/product-detail?id=' + order.items[0].id
      });
    }
  },

  // 更新订单状态
  updateOrderStatus: function(orderId, status, statusText) {
    var orders = wx.getStorageSync('orders') || [];
    for (var i = 0; i < orders.length; i++) {
      if (orders[i].id === orderId) {
        orders[i].status = status;
        orders[i].statusText = statusText;
        break;
      }
    }
    wx.setStorageSync('orders', orders);
    this.loadOrders();
  },

  // 去逛逛
  onGoShopping: function() {
    wx.switchTab({ url: '/pages/index/index' });
  }
});
