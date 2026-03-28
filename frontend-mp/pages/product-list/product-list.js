// pages/product-list/product-list.js - 商品列表页
var app = getApp();
var mockData = require('../../mock/data.js');
var util = require('../../utils/util.js');

Page({
  data: {
    category: '',
    title: '',
    productList: [],
    sortType: 'default',
    loading: true,
    isEmpty: false,
    error: null
  },

  onLoad: function(options) {
    var category = options.category;
    var title = options.title;
    this.setData({ category: category, title: title });
    
    if (title) {
      wx.setNavigationBarTitle({ title: title });
    }
    
    this.loadProducts();
  },

  onShow: function() {
    this.updateCartBadge();
  },

  onPullDownRefresh: function() {
    var that = this;
    that.loadProducts().then(function() {
      wx.stopPullDownRefresh();
    }).catch(function() {
      wx.stopPullDownRefresh();
    });
  },

  // 加载商品列表
  loadProducts: function() {
    var that = this;
    return new Promise(function(resolve, reject) {
      that.setData({ loading: true, error: null });
      
      setTimeout(function() {
        try {
          var products = mockData.getProductsByCategory(that.data.category);
          products = products.map(function(p) {
            return Object.assign({}, p, {
              salesText: util.formatSales(p.sales),
              image: p.imageUrl || p.image
            });
          });
          
          products = that.sortProducts(products, that.data.sortType);
          
          that.setData({
            productList: products,
            isEmpty: products.length === 0,
            loading: false
          });
          resolve();
        } catch (error) {
          console.error('加载商品失败:', error);
          that.setData({ loading: false, error: '加载失败' });
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
    this.loadProducts();
  },

  // 排序商品
  sortProducts: function(products, sortType) {
    var sorted = products.slice();
    switch (sortType) {
      case 'sales':
        sorted.sort(function(a, b) { return b.sales - a.sales; });
        break;
      case 'price-asc':
        sorted.sort(function(a, b) { return a.price - b.price; });
        break;
      case 'price-desc':
        sorted.sort(function(a, b) { return b.price - a.price; });
        break;
    }
    return sorted;
  },

  // 切换排序
  onSortChange: function(e) {
    var type = e.currentTarget.dataset.type;
    var sortType = type;
    
    if (type === 'price') {
      sortType = this.data.sortType === 'price-asc' ? 'price-desc' : 'price-asc';
    }
    
    var products = this.sortProducts(this.data.productList, sortType);
    this.setData({ sortType: sortType, productList: products });
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
        cart[existIndex].quantity += 1;
      } else {
        cart.push(Object.assign({}, item, { quantity: 1, selected: true }));
      }
      
      wx.setStorageSync('cart', cart);
      that.updateCartBadge();
      
      wx.showToast({ title: '加入购物车成功', icon: 'success' });
    } catch (error) {
      console.error('添加购物车失败:', error);
      app.showToast('添加失败');
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
