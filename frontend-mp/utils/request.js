// utils/request.js - 请求封装
const config = require('../config/index.js');
const getEnvConfig = config.getEnvConfig;
const STORAGE_KEYS = config.STORAGE_KEYS;

/**
 * 请求配置
 */
const defaultConfig = {
  timeout: 15000,
  header: {
    'Content-Type': 'application/json'
  }
};

/**
 * 错误类型枚举
 */
const ErrorType = {
  NETWORK: 'NETWORK_ERROR',
  TIMEOUT: 'TIMEOUT_ERROR',
  SERVER: 'SERVER_ERROR',
  AUTH: 'AUTH_ERROR',
  BUSINESS: 'BUSINESS_ERROR'
};

/**
 * 错误消息映射
 */
const ErrorMessages = {
  [ErrorType.NETWORK]: '网络连接失败，请检查网络设置',
  [ErrorType.TIMEOUT]: '请求超时，请稍后重试',
  [ErrorType.SERVER]: '服务器错误，请稍后重试',
  [ErrorType.AUTH]: '登录已过期，请重新登录'
};

/**
 * 创建自定义错误
 */
class RequestError extends Error {
  constructor(message, type, code, data) {
    super(message);
    this.name = 'RequestError';
    this.type = type;
    this.code = code;
    this.data = data;
  }
}

/**
 * 请求拦截器
 */
const requestInterceptor = (options) => {
  // 添加 token
  const token = wx.getStorageSync(STORAGE_KEYS.TOKEN);
  if (token) {
    options.header = {
      ...options.header,
      'Authorization': `Bearer ${token}`
    };
  }
  
  // GET 请求添加时间戳防止缓存
  if (options.method === 'GET') {
    options.data = {
      ...options.data,
      _t: Date.now()
    };
  }
  
  return options;
};

/**
 * 响应拦截器
 */
const responseInterceptor = (response) => {
  const { statusCode, data } = response;
  
  // HTTP 状态码处理
  if (statusCode >= 200 && statusCode < 300) {
    // 业务状态码处理
    if (data.code === 0 || data.code === 200 || data.success) {
      return data.data !== undefined ? data.data : data;
    }
    // 业务错误
    throw new RequestError(
      data.message || '请求失败',
      ErrorType.BUSINESS,
      data.code,
      data
    );
  }
  
  // HTTP 错误处理
  if (statusCode === 401) {
    handleAuthError();
    throw new RequestError(
      ErrorMessages[ErrorType.AUTH],
      ErrorType.AUTH,
      statusCode
    );
  }
  
  if (statusCode === 404) {
    throw new RequestError(
      '请求的资源不存在',
      ErrorType.SERVER,
      statusCode
    );
  }
  
  if (statusCode >= 500) {
    throw new RequestError(
      ErrorMessages[ErrorType.SERVER],
      ErrorType.SERVER,
      statusCode
    );
  }
  
  throw new RequestError(
    `请求失败: ${statusCode}`,
    ErrorType.SERVER,
    statusCode
  );
};

/**
 * 处理认证错误
 */
const handleAuthError = () => {
  wx.removeStorageSync(STORAGE_KEYS.TOKEN);
  wx.removeStorageSync(STORAGE_KEYS.USER_INFO);
  
  const app = getApp();
  if (app) {
    app.globalData.isLogin = false;
    app.globalData.userInfo = null;
  }
  
  wx.showToast({
    title: ErrorMessages[ErrorType.AUTH],
    icon: 'none',
    duration: 2000
  });
};

/**
 * 错误处理
 */
const errorHandler = (error, showToast = true) => {
  console.error('请求错误:', error);
  
  let message = error.message || '请求失败';
  
  // 网络错误
  if (error.errMsg) {
    if (error.errMsg.includes('timeout')) {
      message = ErrorMessages[ErrorType.TIMEOUT];
    } else if (error.errMsg.includes('fail')) {
      message = ErrorMessages[ErrorType.NETWORK];
    }
  }
  
  if (showToast) {
    wx.showToast({
      title: message,
      icon: 'none',
      duration: 2000
    });
  }
  
  return error;
};

/**
 * 发起请求
 */
const request = (options) => {
  return new Promise((resolve, reject) => {
    const envConfig = getEnvConfig();
    
    // 合并配置
    const mergedOptions = {
      ...defaultConfig,
      ...options,
      url: envConfig.baseUrl + options.url,
      header: {
        ...defaultConfig.header,
        ...options.header
      }
    };
    
    // 请求拦截
    const finalOptions = requestInterceptor(mergedOptions);
    
    // 发起请求
    const requestTask = wx.request({
      ...finalOptions,
      success: (response) => {
        try {
          const result = responseInterceptor(response);
          resolve(result);
        } catch (error) {
          const showToast = options.showErrorToast !== false;
          errorHandler(error, showToast);
          reject(error);
        }
      },
      fail: (error) => {
        const showToast = options.showErrorToast !== false;
        const handledError = errorHandler(error, showToast);
        reject(new RequestError(
          handledError.message || ErrorMessages[ErrorType.NETWORK],
          ErrorType.NETWORK
        ));
      }
    });
    
    // 超时处理
    if (options.timeout) {
      setTimeout(() => {
        requestTask.abort();
      }, options.timeout);
    }
  });
};

/**
 * GET 请求
 */
const get = (url, data = {}, options = {}) => {
  return request({
    url,
    data,
    method: 'GET',
    ...options
  });
};

/**
 * POST 请求
 */
const post = (url, data = {}, options = {}) => {
  return request({
    url,
    data,
    method: 'POST',
    ...options
  });
};

/**
 * PUT 请求
 */
const put = (url, data = {}, options = {}) => {
  return request({
    url,
    data,
    method: 'PUT',
    ...options
  });
};

/**
 * DELETE 请求
 */
const del = (url, data = {}, options = {}) => {
  return request({
    url,
    data,
    method: 'DELETE',
    ...options
  });
};

/**
 * 上传文件
 */
const upload = (url, filePath, options = {}) => {
  return new Promise((resolve, reject) => {
    const envConfig = getEnvConfig();
    const token = wx.getStorageSync(STORAGE_KEYS.TOKEN);
    
    wx.uploadFile({
      url: envConfig.baseUrl + url,
      filePath,
      name: options.name || 'file',
      formData: options.formData || {},
      header: {
        'Authorization': token ? `Bearer ${token}` : ''
      },
      success: (res) => {
        try {
          const data = JSON.parse(res.data);
          if (data.code === 0 || data.code === 200 || data.success) {
            resolve(data.data || data);
          } else {
            reject(new RequestError(data.message, ErrorType.BUSINESS, data.code));
          }
        } catch (e) {
          reject(new RequestError('解析响应失败', ErrorType.SERVER));
        }
      },
      fail: (error) => {
        errorHandler(error);
        reject(new RequestError(ErrorMessages[ErrorType.NETWORK], ErrorType.NETWORK));
      }
    });
  });
};

module.exports = {
  request,
  get,
  post,
  put,
  del,
  upload,
  ErrorType,
  RequestError
};
