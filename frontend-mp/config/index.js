// config/index.js - 环境配置

/**
 * 环境类型
 */
var ENV = {
  DEV: 'development',
  TEST: 'test',
  PROD: 'production'
};

/**
 * 当前环境
 */
var currentEnv = ENV.DEV;

/**
 * 环境配置
 */
var envConfig = {
  development: {
    baseUrl: 'http://localhost:3000/api',
    uploadUrl: 'http://localhost:3000/upload',
    wsUrl: 'ws://localhost:3000',
    debug: true
  },
  test: {
    baseUrl: 'https://test-api.example.com/api',
    uploadUrl: 'https://test-api.example.com/upload',
    wsUrl: 'wss://test-api.example.com',
    debug: true
  },
  production: {
    baseUrl: 'https://api.example.com/api',
    uploadUrl: 'https://api.example.com/upload',
    wsUrl: 'wss://api.example.com',
    debug: false
  }
};

/**
 * 存储键名
 */
var STORAGE_KEYS = {
  TOKEN: 'token',
  USER_INFO: 'userInfo',
  CART: 'cart',
  ORDERS: 'orders',
  SEARCH_HISTORY: 'searchHistory',
  ADDRESS_LIST: 'addressList'
};

/**
 * 获取当前环境配置
 */
function getEnvConfig() {
  return envConfig[currentEnv] || envConfig.development;
}

/**
 * 设置当前环境
 */
function setEnv(env) {
  if (envConfig[env]) {
    currentEnv = env;
  }
}

/**
 * 获取当前环境
 */
function getEnv() {
  return currentEnv;
}

/**
 * 是否为开发环境
 */
function isDev() {
  return currentEnv === ENV.DEV;
}

/**
 * 是否为生产环境
 */
function isProd() {
  return currentEnv === ENV.PROD;
}

/**
 * 应用配置
 */
var APP_CONFIG = {
  appName: '鲜花商城',
  version: '1.0.0',
  copyright: '© 2024 鲜花商城'
};

/**
 * 分页配置
 */
var PAGE_CONFIG = {
  pageSize: 10,
  defaultPage: 1
};

module.exports = {
  ENV: ENV,
  STORAGE_KEYS: STORAGE_KEYS,
  APP_CONFIG: APP_CONFIG,
  PAGE_CONFIG: PAGE_CONFIG,
  getEnvConfig: getEnvConfig,
  setEnv: setEnv,
  getEnv: getEnv,
  isDev: isDev,
  isProd: isProd
};
