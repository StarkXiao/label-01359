// pages/product-detail/product-detail.js - 商品详情页
var app = getApp();
var mockData = require('../../mock/data.js');

Page({
  data: {
    product: null,
    currentImageIndex: 0,
    quantity: 1,
    loading: true,
    error: null
  },

  onLoad: function(options) {
    var id = options.id;
    if (id) {
      this.loadProductDetail(id);
    } else {
      this.setData({ loading: false, error: '商品ID不存在' });
    }
  },

  onShow: function() {
    this.updateCartBadge();
  },

  onShareAppMessage: function() {
    var product = this.data.product;
    return {
      title: product ? product.name + ' - ' + product.subtitle : '鲜花商城',
      path: '/pages/product-detail/product-detail?id=' + (product ? product.id : ''),
      imageUrl: product ? product.imageUrl : ''
    };
  },

  // 加载商品详情
  loadProductDetail: function(id) {
    var that = this;
    that.setData({ loading: true, error: null });
    
    setTimeout(function() {
      var product = mockData.getProductById(id);
      
      if (product) {
        wx.setNavigationBarTitle({ title: product.name });
        that.setData({ product: product, loading: false });
      } else {
        that.setData({ loading: false, error: '商品不存在' });
        setTimeout(function() {
          wx.navigateBack();
        }, 1500);
      }
    }, 300);
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
    var pages = getCurrentPages();
    var currentPage = pages[pages.length - 1];
    var id = currentPage.options.id;
    if (id) {
      this.loadProductDetail(id);
    }
  },

  // 图片切换
  onImageChange: function(e) {
    this.setData({ currentImageIndex: e.detail.current });
  },

  // 预览图片
  onPreviewImage: function() {
    var product = this.data.product;
    var currentImageIndex = this.data.currentImageIndex;
    if (!product || !product.images || !product.images.length) return;
    
    wx.previewImage({
      current: product.images[currentImageIndex],
      urls: product.images
    });
  },

  // 减少数量
  onDecrease: function() {
    if (this.data.quantity > 1) {
      this.setData({ quantity: this.data.quantity - 1 });
    }
  },

  // 增加数量
  onIncrease: function() {
    var product = this.data.product;
    var quantity = this.data.quantity;
    if (quantity < product.stock) {
      this.setData({ quantity: quantity + 1 });
    } else {
      app.showToast('库存不足');
    }
  },

  // 添加到购物车
  onAddToCart: function() {
    var product = this.data.product;
    var quantity = this.data.quantity;
    var that = this;
    if (!product) return;
    
    // 检查库存
    if (product.stock <= 0) {
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
        if (cart[i].id === product.id) {
          existIndex = i;
          break;
        }
      }
      
      if (existIndex > -1) {
        // 检查加购后是否超过库存
        if (cart[existIndex].quantity + quantity > product.stock) {
          app.showToast('库存不足');
          return;
        }
        cart[existIndex].quantity += quantity;
      } else {
        cart.push(Object.assign({}, product, { quantity: quantity, selected: true }));
      }
      
      wx.setStorageSync('cart', cart);
      that.updateCartBadge();
      
      wx.showToast({ title: '添加成功', icon: 'success', duration: 1500 });
    } catch (error) {
      console.error('添加购物车失败:', error);
      app.showToast('添加失败，请重试');
    }
  },

  // 立即购买
  onBuyNow: function() {
    var product = this.data.product;
    var quantity = this.data.quantity;
    var that = this;
    if (!product) return;
    
    // 检查库存
    if (product.stock <= 0) {
      app.showToast('商品已售罄');
      return;
    }
    
    if (quantity > product.stock) {
      app.showToast('库存不足');
      return;
    }
    
    if (!app.globalData.isLogin) {
      that.showLoginModal();
      return;
    }
    
    wx.navigateTo({
      url: '/pages/order-confirm/order-confirm?productId=' + product.id + '&quantity=' + quantity
    });
  },

  // 显示登录弹窗
  showLoginModal: function() {
    var that = this;
    wx.showModal({
      title: '提示',
      content: '请先登录后再操作',
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
  },

  // 去购物车
  onGoCart: function() {
    wx.switchTab({ url: '/pages/cart/cart' });
  }
});
