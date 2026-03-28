// app.js - 小程序入口文件
App({
  globalData: {
    userInfo: null,
    isLogin: false,
    cartCount: 0,
    systemInfo: null,
    statusBarHeight: 0,
    windowHeight: 0,
    windowWidth: 0,
    theme: {
      primaryColor: '#E91E63',
      secondaryColor: '#FF4081',
      backgroundColor: '#FFF8F9',
      textColor: '#333333',
      subTextColor: '#999999'
    }
  },

  onLaunch: function() {
    console.log('🌸 鲜花商城小程序启动');
    this.initStorage();
    this.checkLoginStatus();
    this.getSystemInfo();
  },

  // 初始化本地存储
  initStorage: function() {
    try {
      var cart = wx.getStorageSync('cart');
      if (!cart) {
        wx.setStorageSync('cart', []);
      } else {
        this.globalData.cartCount = cart.length;
      }
    } catch (e) {
      console.error('初始化存储失败:', e);
    }
  },

  // 检查登录状态
  checkLoginStatus: function() {
    try {
      var userInfo = wx.getStorageSync('userInfo');
      var token = wx.getStorageSync('token');
      if (userInfo && token) {
        this.globalData.userInfo = userInfo;
        this.globalData.isLogin = true;
      }
    } catch (e) {
      console.error('检查登录状态失败:', e);
    }
  },

  // 获取系统信息
  getSystemInfo: function() {
    try {
      var systemInfo = wx.getSystemInfoSync();
      this.globalData.systemInfo = systemInfo;
      this.globalData.statusBarHeight = systemInfo.statusBarHeight;
      this.globalData.windowHeight = systemInfo.windowHeight;
      this.globalData.windowWidth = systemInfo.windowWidth;
    } catch (e) {
      console.error('获取系统信息失败:', e);
    }
  },

  // 更新购物车数量
  updateCartCount: function(count) {
    this.globalData.cartCount = count;
    
    // 未登录时不显示角标
    if (!this.globalData.isLogin) {
      wx.removeTabBarBadge({ index: 2 });
      return;
    }
    
    if (count > 0) {
      wx.setTabBarBadge({
        index: 2,
        text: count > 99 ? '99+' : String(count)
      });
    } else {
      wx.removeTabBarBadge({ index: 2 });
    }
  },

  // 显示 Toast 提示
  showToast: function(title, icon, duration) {
    wx.showToast({
      title: title,
      icon: icon || 'none',
      duration: duration || 2000
    });
  },

  // 显示 Loading
  showLoading: function(title) {
    wx.showLoading({
      title: title || '加载中...',
      mask: true
    });
  },

  // 隐藏 Loading
  hideLoading: function() {
    wx.hideLoading();
  }
});
