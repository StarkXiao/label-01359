// pages/index/index.js - 首页
var app = getApp();
var mockData = require('../../mock/data.js');
var util = require('../../utils/util.js');

Page({
  data: {
    bannerList: [],
    currentBanner: 0,
    categoryEntries: [],
    romanticProducts: [],
    birthdayProducts: [],
    openingProducts: [],
    blessingProducts: [],
    hotProducts: [],
    loading: true,
    refreshing: false,
    error: null
  },

  onLoad: function() {
    this.loadPageData();
  },

  onShow: function() {
    this.updateCartBadge();
  },

  onPullDownRefresh: function() {
    var that = this;
    that.setData({ refreshing: true, error: null });
    that.loadPageData().then(function() {
      wx.stopPullDownRefresh();
      that.setData({ refreshing: false });
    }).catch(function() {
      wx.stopPullDownRefresh();
      that.setData({ refreshing: false });
    });
  },

  onShareAppMessage: function() {
    return {
      title: '鲜花商城 - 用心传递每一份美好',
      path: '/pages/index/index',
      imageUrl: '/images/share/share-cover.png'
    };
  },

  // 加载页面数据
  loadPageData: function() {
    var that = this;
    return new Promise(function(resolve, reject) {
      that.setData({ loading: true, error: null });
      
      setTimeout(function() {
        try {
          var bannerList = mockData.bannerList;
          var categoryEntries = mockData.categoryEntries;
          var hotProducts = mockData.hotProducts.map(function(p) {
            return Object.assign({}, p, {
              salesText: util.formatSales(p.sales)
            });
          });
          
          that.setData({
            bannerList: bannerList,
            categoryEntries: categoryEntries,
            hotProducts: hotProducts,
            romanticProducts: mockData.getProductsByCategory('romantic').slice(0, 3),
            birthdayProducts: mockData.getProductsByCategory('birthday').slice(0, 3),
            openingProducts: mockData.getProductsByCategory('opening').slice(0, 2),
            blessingProducts: mockData.getProductsByCategory('blessing').slice(0, 2),
            loading: false
          });
          resolve();
        } catch (error) {
          console.error('加载数据失败:', error);
          that.setData({ loading: false, error: '加载失败，请重试' });
          reject(error);
        }
      }, 300);
    });
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

  // 重试加载
  onRetry: function() {
    this.loadPageData();
  },

  // 轮播图切换
  onBannerChange: function(e) {
    this.setData({ currentBanner: e.detail.current });
  },

  // 点击轮播图
  onBannerTap: function(e) {
    var item = e.currentTarget.dataset.item;
    if (item.linkUrl) {
      wx.navigateTo({ url: item.linkUrl });
    }
  },

  // 点击搜索框
  onSearchTap: function() {
    wx.navigateTo({ url: '/pages/search/search' });
  },

  // 点击分类入口
  onCategoryTap: function(e) {
    var item = e.currentTarget.dataset.item;
    wx.navigateTo({
      url: '/pages/product-list/product-list?category=' + item.id + '&title=' + item.name
    });
  },

  // 查看更多
  onViewMore: function(e) {
    var category = e.currentTarget.dataset.category;
    var title = e.currentTarget.dataset.title;
    wx.navigateTo({
      url: '/pages/product-list/product-list?category=' + category + '&title=' + title
    });
  },

  // 点击商品
  onProductTap: function(e) {
    var item = e.currentTarget.dataset.item;
    wx.navigateTo({
      url: '/pages/product-detail/product-detail?id=' + item.id
    });
  },

  // 添加到购物车
  onAddToCart: function(e) {
    var item = e.currentTarget.dataset.item;
    var that = this;
    
    if (!item) return;
    
    // 检查库存
    if (item.stock <= 0) {
      app.showToast('商品已售罄');
      return;
    }
    
    // 检查登录状态
    if (!app.globalData.isLogin) {
      that.showLoginModal();
      return;
    }
    
    try {
      var cart = wx.getStorageSync('cart') || [];
      var existIndex = -1;
      for (var i = 0; i < cart.length; i++) {
        if (cart[i].id === item.id) {
          existIndex = i;
          break;
        }
      }
      
      if (existIndex > -1) {
        // 检查加购后是否超过库存
        if (cart[existIndex].quantity + 1 > item.stock) {
          app.showToast('库存不足');
          return;
        }
        cart[existIndex].quantity += 1;
      } else {
        cart.push(Object.assign({}, item, { quantity: 1, selected: true }));
      }
      
      wx.setStorageSync('cart', cart);
      that.updateCartBadge();
      
      wx.showToast({
        title: '加入购物车成功',
        icon: 'success',
        duration: 1500
      });
    } catch (error) {
      console.error('添加购物车失败:', error);
      app.showToast('添加失败，请重试');
    }
  },

  // 显示登录弹窗
  showLoginModal: function() {
    var that = this;
    wx.showModal({
      title: '提示',
      content: '请先登录后再加入购物车',
      confirmText: '去登录',
      confirmColor: '#E91E63',
      success: function(res) {
        if (res.confirm) {
          wx.showModal({
            title: '登录',
            content: '是否使用测试账号登录？',
            confirmText: '确定',
            confirmColor: '#E91E63',
            success: function(loginRes) {
              if (loginRes.confirm) {
                var userInfo = mockData.userInfo;
                wx.setStorageSync('userInfo', userInfo);
                wx.setStorageSync('token', 'mock_token_' + Date.now());
                
                app.globalData.isLogin = true;
                app.globalData.userInfo = userInfo;
                
                that.updateCartBadge();
                app.showToast('登录成功', 'success');
              }
            }
          });
        }
      }
    });
  }
});
