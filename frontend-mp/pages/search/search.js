// pages/search/search.js - 搜索页
var app = getApp();
var mockData = require('../../mock/data.js');
var util = require('../../utils/util.js');

Page({
  data: {
    keyword: '',
    searchHistory: [],
    hotKeywords: ['玫瑰', '百合', '向日葵', '康乃馨', '生日花束', '开业花篮'],
    searchResults: [],
    isSearching: false,
    hasSearched: false,
    error: null
  },

  onLoad: function() {
    this.loadSearchHistory();
    var that = this;
    this.debouncedSearch = util.debounce(function(keyword) {
      that.doSearch(keyword);
    }, 300);
  },

  // 加载搜索历史
  loadSearchHistory: function() {
    try {
      var history = wx.getStorageSync('searchHistory') || [];
      this.setData({ searchHistory: history });
    } catch (e) {
      console.error('加载搜索历史失败:', e);
    }
  },

  // 保存搜索历史
  saveSearchHistory: function(keyword) {
    try {
      var history = wx.getStorageSync('searchHistory') || [];
      history = history.filter(function(item) {
        return item !== keyword;
      });
      history.unshift(keyword);
      history = history.slice(0, 10);
      wx.setStorageSync('searchHistory', history);
      this.setData({ searchHistory: history });
    } catch (e) {
      console.error('保存搜索历史失败:', e);
    }
  },

  // 输入关键词
  onInput: function(e) {
    var keyword = e.detail.value;
    this.setData({ keyword: keyword });
    
    if (keyword.trim()) {
      this.debouncedSearch(keyword);
    } else {
      this.setData({ searchResults: [], hasSearched: false, error: null });
    }
  },

  // 清除输入
  onClear: function() {
    this.setData({
      keyword: '',
      searchResults: [],
      hasSearched: false,
      error: null
    });
  },

  // 确认搜索
  onConfirm: function(e) {
    var keyword = e.detail.value || this.data.keyword;
    if (keyword.trim()) {
      this.doSearch(keyword);
      this.saveSearchHistory(keyword.trim());
    }
  },

  // 执行搜索
  doSearch: function(keyword) {
    var that = this;
    that.setData({ isSearching: true, error: null });
    
    setTimeout(function() {
      try {
        var results = mockData.searchProducts(keyword);
        that.setData({
          searchResults: results,
          isSearching: false,
          hasSearched: true
        });
      } catch (error) {
        console.error('搜索失败:', error);
        that.setData({
          isSearching: false,
          hasSearched: true,
          error: '搜索失败'
        });
      }
    }, 200);
  },

  // 点击热门关键词
  onHotKeywordTap: function(e) {
    var keyword = e.currentTarget.dataset.keyword;
    this.setData({ keyword: keyword });
    this.doSearch(keyword);
    this.saveSearchHistory(keyword);
  },

  // 点击历史记录
  onHistoryTap: function(e) {
    var keyword = e.currentTarget.dataset.keyword;
    this.setData({ keyword: keyword });
    this.doSearch(keyword);
  },

  // 清空历史记录
  onClearHistory: function() {
    var that = this;
    wx.showModal({
      title: '提示',
      content: '确定要清空搜索历史吗？',
      confirmColor: '#E91E63',
      success: function(res) {
        if (res.confirm) {
          wx.removeStorageSync('searchHistory');
          that.setData({ searchHistory: [] });
          app.showToast('已清空');
        }
      }
    });
  },

  // 点击商品
  onProductTap: function(e) {
    var item = e.currentTarget.dataset.item;
    wx.navigateTo({
      url: '/pages/product-detail/product-detail?id=' + item.id
    });
  },

  // 返回
  onBack: function() {
    wx.navigateBack();
  }
});
