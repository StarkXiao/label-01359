// pages/category/category.js - 分类页
var app = getApp();
var mockData = require('../../mock/data.js');

Page({
  data: {
    categoryList: [],
    currentCategoryIndex: 0,
    currentCategory: null,
    subCategories: [],
    loading: true,
    error: null
  },

  onLoad: function() {
    this.loadCategoryData();
  },

  onShow: function() {
    this.updateCartBadge();
  },

  // 加载分类数据
  loadCategoryData: function() {
    var that = this;
    that.setData({ loading: true, error: null });
    
    setTimeout(function() {
      try {
        var categoryList = mockData.categoryList;
        var currentCategory = categoryList[0];
        var subCategories = currentCategory ? currentCategory.children : [];
        
        that.setData({
          categoryList: categoryList,
          currentCategory: currentCategory,
          subCategories: subCategories,
          loading: false
        });
      } catch (error) {
        console.error('加载分类失败:', error);
        that.setData({ loading: false, error: '加载失败，请重试' });
      }
    }, 200);
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
    this.loadCategoryData();
  },

  // 切换一级分类
  onCategoryTap: function(e) {
    var index = e.currentTarget.dataset.index;
    var currentCategory = this.data.categoryList[index];
    var subCategories = currentCategory ? currentCategory.children : [];
    
    this.setData({
      currentCategoryIndex: index,
      currentCategory: currentCategory,
      subCategories: subCategories
    });
  },

  // 点击二级分类
  onSubCategoryTap: function(e) {
    var item = e.currentTarget.dataset.item;
    var parentCategory = this.data.currentCategory;
    
    wx.navigateTo({
      url: '/pages/product-list/product-list?category=' + parentCategory.id + '&subCategory=' + item.id + '&title=' + item.name
    });
  },

  // 点击搜索
  onSearchTap: function() {
    wx.navigateTo({ url: '/pages/search/search' });
  }
});
