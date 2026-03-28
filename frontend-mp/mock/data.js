// mock/data.js - 模拟数据

/**
 * 轮播图数据
 */
const bannerList = [
  {
    id: 1,
    imageUrl: '/images/banner/banner1.png',
    linkUrl: '/pages/product-list/product-list?category=romantic',
    title: '浪漫告白季'
  },
  {
    id: 2,
    imageUrl: '/images/banner/banner2.png',
    linkUrl: '/pages/product-list/product-list?category=birthday',
    title: '生日特惠'
  },
  {
    id: 3,
    imageUrl: '/images/banner/banner3.png',
    linkUrl: '/pages/product-list/product-list?category=opening',
    title: '开业大吉'
  }
];

/**
 * 分类入口数据
 */
const categoryEntries = [
  {
    id: 'romantic',
    name: '浪漫告白',
    icon: '/images/icons/romantic.png',
    color: '#FF6B9D',
    bgColor: '#FFF0F5'
  },
  {
    id: 'birthday',
    name: '生日热荐',
    icon: '/images/icons/birthday.png',
    color: '#FF9F43',
    bgColor: '#FFF8F0'
  },
  {
    id: 'opening',
    name: '开业花篮',
    icon: '/images/icons/opening.png',
    color: '#FF6B6B',
    bgColor: '#FFF5F5'
  },
  {
    id: 'blessing',
    name: '祝福恭贺',
    icon: '/images/icons/blessing.png',
    color: '#A66CFF',
    bgColor: '#F8F5FF'
  }
];

/**
 * 分类列表数据
 */
const categoryList = [
  {
    id: 'romantic',
    name: '浪漫告白',
    icon: '/images/category/romantic.png',
    children: [
      { id: 'rose', name: '玫瑰花束', icon: '/images/category/rose.png' },
      { id: 'mix', name: '混搭花束', icon: '/images/category/mix.png' },
      { id: 'box', name: '礼盒花艺', icon: '/images/category/box.png' },
      { id: 'eternal', name: '永生花', icon: '/images/category/eternal.png' }
    ]
  },
  {
    id: 'birthday',
    name: '生日热荐',
    icon: '/images/category/birthday.png',
    children: [
      { id: 'sunflower', name: '向日葵', icon: '/images/category/sunflower.png' },
      { id: 'lily', name: '百合花', icon: '/images/category/lily.png' },
      { id: 'carnation', name: '康乃馨', icon: '/images/category/carnation.png' },
      { id: 'tulip', name: '郁金香', icon: '/images/category/tulip.png' }
    ]
  },
  {
    id: 'opening',
    name: '开业花篮',
    icon: '/images/category/opening.png',
    children: [
      { id: 'basket-single', name: '单层花篮', icon: '/images/category/basket1.png' },
      { id: 'basket-double', name: '双层花篮', icon: '/images/category/basket2.png' },
      { id: 'basket-triple', name: '三层花篮', icon: '/images/category/basket3.png' }
    ]
  },
  {
    id: 'blessing',
    name: '祝福恭贺',
    icon: '/images/category/blessing.png',
    children: [
      { id: 'get-well', name: '探病慰问', icon: '/images/category/getwell.png' },
      { id: 'congrats', name: '恭贺新禧', icon: '/images/category/congrats.png' },
      { id: 'thanks', name: '感恩致谢', icon: '/images/category/thanks.png' }
    ]
  },
  {
    id: 'plant',
    name: '绿植盆栽',
    icon: '/images/category/plant.png',
    children: [
      { id: 'small-plant', name: '小型绿植', icon: '/images/category/small.png' },
      { id: 'medium-plant', name: '中型绿植', icon: '/images/category/medium.png' },
      { id: 'large-plant', name: '大型绿植', icon: '/images/category/large.png' }
    ]
  }
];

/**
 * 商品列表数据
 */
const productList = [
  // 浪漫告白系列
  {
    id: 1001,
    name: '挚爱一生',
    subtitle: '99朵红玫瑰花束',
    price: 999,
    originalPrice: 1299,
    sales: 2680,
    rating: 4.9,
    category: 'romantic',
    tags: ['热销', '包邮'],
    imageUrl: '/images/products/product1.png',
    images: ['/images/products/product1.png'],
    description: '99朵精选红玫瑰，代表天长地久的爱情承诺',
    stock: 100
  },
  {
    id: 1002,
    name: '初见倾心',
    subtitle: '33朵粉玫瑰花束',
    price: 399,
    originalPrice: 499,
    sales: 1890,
    rating: 4.8,
    category: 'romantic',
    tags: ['新品'],
    imageUrl: '/images/products/product2.png',
    images: ['/images/products/product2.png'],
    description: '33朵粉色玫瑰，诉说初恋般的心动',
    stock: 150
  },
  // 生日热荐系列
  {
    id: 2001,
    name: '阳光灿烂',
    subtitle: '向日葵混搭花束',
    price: 268,
    originalPrice: 328,
    sales: 1560,
    rating: 4.8,
    category: 'birthday',
    tags: ['热销', '生日推荐'],
    imageUrl: '/images/products/product3.png',
    images: ['/images/products/product3.png'],
    description: '向日葵搭配香槟玫瑰，送去温暖祝福',
    stock: 80
  },
  // 开业花篮系列
  {
    id: 3001,
    name: '开业大吉',
    subtitle: '豪华双层开业花篮',
    price: 688,
    originalPrice: 888,
    sales: 560,
    rating: 4.9,
    category: 'opening',
    tags: ['热销', '企业首选'],
    imageUrl: '/images/products/product4.png',
    images: ['/images/products/product4.png'],
    description: '双层豪华花篮，寓意生意兴隆',
    stock: 50
  },
  // 祝福恭贺系列
  {
    id: 4001,
    name: '温馨祝福',
    subtitle: '康乃馨百合花束',
    price: 258,
    originalPrice: 318,
    sales: 890,
    rating: 4.8,
    category: 'blessing',
    tags: ['热销', '探病首选'],
    imageUrl: '/images/products/product5.png',
    images: ['/images/products/product5.png'],
    description: '康乃馨与百合的温馨组合，送去真挚祝福',
    stock: 100
  }
];

/**
 * 热销商品
 */
const hotProducts = productList.filter(p => p.tags.includes('热销')).slice(0, 6);

/**
 * 新品推荐
 */
const newProducts = productList.filter(p => p.tags.includes('新品'));

/**
 * 根据分类获取商品
 */
const getProductsByCategory = (categoryId) => {
  return productList.filter(p => p.category === categoryId);
};

/**
 * 根据ID获取商品详情
 */
const getProductById = (id) => {
  return productList.find(p => p.id === parseInt(id));
};

/**
 * 搜索商品
 */
const searchProducts = (keyword) => {
  const lowerKeyword = keyword.toLowerCase();
  return productList.filter(p => 
    p.name.toLowerCase().includes(lowerKeyword) ||
    p.subtitle.toLowerCase().includes(lowerKeyword) ||
    p.description.toLowerCase().includes(lowerKeyword)
  );
};

/**
 * 用户信息
 */
const userInfo = {
  id: 1,
  nickname: '花粉用户',
  avatar: '/images/avatar/default.png',
  phone: '138****8000',
  level: 'VIP1',
  points: 1280,
  couponCount: 3,
  orderCount: {
    unpaid: 1,
    unshipped: 2,
    unreceived: 1,
    uncommented: 3
  }
};

/**
 * 地址列表
 */
const addressList = [
  {
    id: 1,
    name: '张三',
    phone: '13800138000',
    province: '广东省',
    city: '深圳市',
    district: '南山区',
    detail: '科技园南区A栋1001室',
    isDefault: true
  },
  {
    id: 2,
    name: '李四',
    phone: '13900139000',
    province: '广东省',
    city: '广州市',
    district: '天河区',
    detail: '天河路385号太古汇',
    isDefault: false
  }
];

module.exports = {
  bannerList,
  categoryEntries,
  categoryList,
  productList,
  hotProducts,
  newProducts,
  getProductsByCategory,
  getProductById,
  searchProducts,
  userInfo,
  addressList
};
