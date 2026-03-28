// pages/mine/mine.js - 我的页面
var app = getApp();
var mockData = require('../../mock/data.js');

Page({
  data: {
    userInfo: null,
    isLogin: false,
    orderMenus: [
      { id: 'unpaid', name: '待付款', icon: '💳', count: 0 },
      { id: 'unshipped', name: '待发货', icon: '📦', count: 0 },
      { id: 'unreceived', name: '待收货', icon: '🚚', count: 0 },
      { id: 'completed', name: '已完成', icon: '✅', count: 0 }
    ]
  },

  onLoad: function() {
    this.checkLoginStatus();
  },

  onShow: function() {
    this.checkLoginStatus();
    this.updateCartBadge();
    this.updateOrderCounts();
  },

  // 检查登录状态
  checkLoginStatus: function() {
    var isLogin = app.globalData.isLogin;
    
    if (isLogin) {
      var userInfo = mockData.userInfo;
      this.setData({ userInfo: userInfo, isLogin: true });
      this.updateOrderCounts();
    } else {
      this.setData({ userInfo: null, isLogin: false });
    }
  },

  // 更新订单数量
  updateOrderCounts: function() {
    var that = this;
    var orders = wx.getStorageSync('orders') || [];
    var counts = { unpaid: 0, unshipped: 0, unreceived: 0, completed: 0 };
    
    orders.forEach(function(order) {
      if (counts[order.status] !== undefined) {
        counts[order.status]++;
      }
    });
    
    var orderMenus = that.data.orderMenus.map(function(menu) {
      return Object.assign({}, menu, { count: counts[menu.id] || 0 });
    });
    
    that.setData({ orderMenus: orderMenus });
  },

  // 更新购物车角标
  updateCartBadge: function() {
    try {
      var cart = wx.getStorageSync('cart') || [];
      app.updateCartCount(cart.length);
    } catch (e) {
      console.error('更新购物车角标失败:', e);
    }
  },

  // 执行登录
  doLogin: function() {
    var that = this;
    wx.showModal({
      title: '登录',
      content: '是否使用测试账号登录？',
      confirmText: '确定',
      confirmColor: '#E91E63',
      success: function(res) {
        if (res.confirm) {
          var userInfo = mockData.userInfo;
          wx.setStorageSync('userInfo', userInfo);
          wx.setStorageSync('token', 'mock_token_' + Date.now());
          
          app.globalData.isLogin = true;
          app.globalData.userInfo = userInfo;
          
          that.checkLoginStatus();
          that.updateCartBadge();
          app.showToast('登录成功', 'success');
        }
      }
    });
  },

  // 点击订单菜单
  onOrderMenuTap: function(e) {
    var item = e.currentTarget.dataset.item;
    
    if (!this.data.isLogin) {
      this.doLogin();
      return;
    }
    
    wx.navigateTo({
      url: '/pages/order-list/order-list?tab=' + item.id
    });
  },

  // 查看全部订单
  onViewAllOrders: function() {
    if (!this.data.isLogin) {
      this.doLogin();
      return;
    }
    
    wx.navigateTo({
      url: '/pages/order-list/order-list?tab=all'
    });
  },

  // 退出登录
  onLogout: function() {
    var that = this;
    if (!that.data.isLogin) return;
    
    wx.showModal({
      title: '提示',
      content: '确定要退出登录吗？',
      confirmColor: '#E91E63',
      success: function(res) {
        if (res.confirm) {
          wx.removeStorageSync('userInfo');
          wx.removeStorageSync('token');
          
          app.globalData.isLogin = false;
          app.globalData.userInfo = null;
          
          that.setData({ userInfo: null, isLogin: false });
          // 退出登录后隐藏购物车角标
          app.updateCartCount(0);
          app.showToast('已退出登录');
        }
      }
    });
  }
});
