// pages/cart/cart.js - 购物车页
var app = getApp();
var util = require('../../utils/util.js');
var mockData = require('../../mock/data.js');

Page({
  data: {
    cartList: [],
    isAllSelected: false,
    totalPrice: 0,
    totalCount: 0,
    isEmpty: true,
    isEditing: false,
    isLogin: false
  },

  onLoad: function() {},

  onShow: function() {
    this.checkLoginStatus();
  },

  // 检查登录状态
  checkLoginStatus: function() {
    var isLogin = app.globalData.isLogin;
    this.setData({ isLogin: isLogin });
    
    if (isLogin) {
      this.loadCartData();
    } else {
      this.setData({
        cartList: [],
        isEmpty: true,
        totalPrice: 0,
        totalCount: 0
      });
      this.updateCartBadge();
    }
  },

  // 去登录 - 直接调用登录弹窗
  onGoLogin: function() {
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
          app.showToast('登录成功', 'success');
        }
      }
    });
  },

  // 加载购物车数据
  loadCartData: function() {
    try {
      var cartList = wx.getStorageSync('cart') || [];
      var isEmpty = cartList.length === 0;
      
      this.setData({ cartList: cartList, isEmpty: isEmpty });
      this.calculateTotal();
      this.updateCartBadge();
    } catch (error) {
      console.error('加载购物车失败:', error);
      app.showToast('加载失败');
    }
  },

  // 计算总价
  calculateTotal: function() {
    var cartList = this.data.cartList;
    var totalPrice = 0;
    var totalCount = 0;
    var selectedCount = 0;
    
    cartList.forEach(function(item) {
      if (item.selected) {
        totalPrice += item.price * item.quantity;
        totalCount += item.quantity;
        selectedCount++;
      }
    });
    
    var isAllSelected = cartList.length > 0 && selectedCount === cartList.length;
    
    this.setData({
      totalPrice: util.formatPrice(totalPrice),
      totalCount: totalCount,
      isAllSelected: isAllSelected
    });
  },

  // 更新购物车角标
  updateCartBadge: function() {
    app.updateCartCount(this.data.cartList.length);
  },

  // 保存购物车数据
  saveCartData: function() {
    try {
      wx.setStorageSync('cart', this.data.cartList);
    } catch (error) {
      console.error('保存购物车失败:', error);
    }
  },

  // 选择/取消选择商品
  onSelectItem: function(e) {
    var index = e.currentTarget.dataset.index;
    var key = 'cartList[' + index + '].selected';
    var selected = !this.data.cartList[index].selected;
    var data = {};
    data[key] = selected;
    
    this.setData(data);
    this.calculateTotal();
    this.saveCartData();
  },

  // 全选/取消全选
  onSelectAll: function() {
    var isAllSelected = !this.data.isAllSelected;
    var cartList = this.data.cartList.map(function(item) {
      return Object.assign({}, item, { selected: isAllSelected });
    });
    
    this.setData({ cartList: cartList, isAllSelected: isAllSelected });
    this.calculateTotal();
    this.saveCartData();
  },

  // 增加数量
  onIncrease: function(e) {
    var index = e.currentTarget.dataset.index;
    var item = this.data.cartList[index];
    
    if (item.quantity >= item.stock) {
      app.showToast('库存不足');
      return;
    }
    
    var key = 'cartList[' + index + '].quantity';
    var data = {};
    data[key] = item.quantity + 1;
    this.setData(data);
    this.calculateTotal();
    this.saveCartData();
  },

  // 减少数量
  onDecrease: function(e) {
    var index = e.currentTarget.dataset.index;
    var item = this.data.cartList[index];
    
    if (item.quantity <= 1) {
      this.onDeleteItem(e);
      return;
    }
    
    var key = 'cartList[' + index + '].quantity';
    var data = {};
    data[key] = item.quantity - 1;
    this.setData(data);
    this.calculateTotal();
    this.saveCartData();
  },

  // 删除商品
  onDeleteItem: function(e) {
    var that = this;
    var index = e.currentTarget.dataset.index;
    var item = that.data.cartList[index];
    
    wx.showModal({
      title: '提示',
      content: '确定要删除"' + item.name + '"吗？',
      confirmColor: '#E91E63',
      success: function(res) {
        if (res.confirm) {
          var cartList = that.data.cartList.filter(function(_, i) {
            return i !== index;
          });
          that.setData({ cartList: cartList, isEmpty: cartList.length === 0 });
          that.calculateTotal();
          that.saveCartData();
          that.updateCartBadge();
          app.showToast('已删除');
        }
      }
    });
  },

  // 清空购物车
  onClearCart: function() {
    var that = this;
    if (that.data.cartList.length === 0) return;
    
    wx.showModal({
      title: '提示',
      content: '确定要清空购物车吗？',
      confirmColor: '#E91E63',
      success: function(res) {
        if (res.confirm) {
          that.setData({
            cartList: [],
            isEmpty: true,
            totalPrice: '0.00',
            totalCount: 0,
            isAllSelected: false
          });
          that.saveCartData();
          that.updateCartBadge();
          app.showToast('已清空');
        }
      }
    });
  },

  // 删除选中商品
  onDeleteSelected: function() {
    var that = this;
    var selectedItems = that.data.cartList.filter(function(item) {
      return item.selected;
    });
    
    if (selectedItems.length === 0) {
      app.showToast('请先选择商品');
      return;
    }
    
    wx.showModal({
      title: '提示',
      content: '确定要删除选中的' + selectedItems.length + '件商品吗？',
      confirmColor: '#E91E63',
      success: function(res) {
        if (res.confirm) {
          var cartList = that.data.cartList.filter(function(item) {
            return !item.selected;
          });
          that.setData({ cartList: cartList, isEmpty: cartList.length === 0 });
          that.calculateTotal();
          that.saveCartData();
          that.updateCartBadge();
          app.showToast('已删除');
        }
      }
    });
  },

  // 切换编辑模式
  onToggleEdit: function() {
    this.setData({ isEditing: !this.data.isEditing });
  },

  // 点击商品
  onProductTap: function(e) {
    var item = e.currentTarget.dataset.item;
    wx.navigateTo({
      url: '/pages/product-detail/product-detail?id=' + item.id
    });
  },

  // 去结算
  onCheckout: function() {
    var that = this;
    var selectedItems = that.data.cartList.filter(function(item) {
      return item.selected;
    });
    
    if (selectedItems.length === 0) {
      app.showToast('请先选择商品');
      return;
    }
    
    if (!app.globalData.isLogin) {
      wx.showModal({
        title: '提示',
        content: '请先登录后再结算',
        confirmText: '去登录',
        confirmColor: '#E91E63',
        success: function(res) {
          if (res.confirm) {
            wx.switchTab({ url: '/pages/mine/mine' });
          }
        }
      });
      return;
    }
    
    wx.navigateTo({
      url: '/pages/order-confirm/order-confirm?fromCart=true'
    });
  },

  // 去逛逛
  onGoShopping: function() {
    wx.switchTab({ url: '/pages/index/index' });
  }
});
