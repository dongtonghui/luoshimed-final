/**
 * ===============================================
 * 骆氏健康官网 - 配置文件加载器
 * 用于从 website-config.json 加载配置并渲染页面
 * ===============================================
 */

// 全局配置对象
window.WebsiteConfig = window.WebsiteConfig || {};

/**
 * 加载配置文件
 * @returns {Promise<Object>} 配置对象
 */
async function loadConfig() {
  try {
    const response = await fetch('website-config.json');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const config = await response.json();
    window.WebsiteConfig = config;
    return config;
  } catch (error) {
    console.error('加载配置文件失败:', error);
    return null;
  }
}

/**
 * 获取全局配置
 * @returns {Object} 全局配置
 */
function getGlobalConfig() {
  return window.WebsiteConfig?.global || {};
}

/**
 * 获取页面配置
 * @param {string} pageName - 页面名称 (home, about, products, cases, research, clinic, contact, downloads, news, product-detail)
 * @returns {Object} 页面配置
 */
function getPageConfig(pageName) {
  return window.WebsiteConfig?.[pageName] || {};
}

/**
 * 替换模板字符串中的变量
 * @param {string} template - 模板字符串，如 "共 {count} 款产品"
 * @param {Object} variables - 变量对象，如 {count: 6}
 * @returns {string} 替换后的字符串
 */
function renderTemplate(template, variables = {}) {
  if (!template) return '';
  return template.replace(/\{(\w+)\}/g, (match, key) => {
    return variables[key] !== undefined ? variables[key] : match;
  });
}

/**
 * 根据选择器设置元素文本内容
 * @param {string} selector - CSS选择器
 * @param {string} content - 文本内容
 */
function setText(selector, content) {
  if (!content) return;
  const elements = document.querySelectorAll(selector);
  elements.forEach(el => {
    if (el) el.textContent = content;
  });
}

/**
 * 根据选择器设置元素HTML内容
 * @param {string} selector - CSS选择器
 * @param {string} html - HTML内容
 */
function setHTML(selector, html) {
  if (!html) return;
  const elements = document.querySelectorAll(selector);
  elements.forEach(el => {
    if (el) el.innerHTML = html;
  });
}

/**
 * 更新页面标题和SEO信息
 * @param {Object} seoConfig - SEO配置对象
 */
function updateSEO(seoConfig) {
  if (!seoConfig) return;
  
  if (seoConfig.title) {
    document.title = seoConfig.title;
  }
  if (seoConfig.description) {
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.name = 'description';
      document.head.appendChild(metaDesc);
    }
    metaDesc.content = seoConfig.description;
  }
}

/**
 * 更新页面横幅 (Banner)
 * @param {Object} bannerConfig - 横幅配置对象
 */
function updateBanner(bannerConfig) {
  if (!bannerConfig) return;
  
  // 更新标题
  if (bannerConfig.title) {
    const titleEl = document.querySelector('.page-banner-title');
    if (titleEl) titleEl.textContent = bannerConfig.title;
  }
  
  // 更新副标题
  if (bannerConfig.subtitle) {
    const subEl = document.querySelector('.page-banner-sub');
    if (subEl) subEl.textContent = bannerConfig.subtitle;
  }
  
  // 更新面包屑
  if (bannerConfig.breadcrumb && Array.isArray(bannerConfig.breadcrumb)) {
    const breadcrumbEl = document.querySelector('.page-banner-breadcrumb');
    if (breadcrumbEl) {
      const breadcrumbHTML = bannerConfig.breadcrumb.map((item, index) => {
        const isLast = index === bannerConfig.breadcrumb.length - 1;
        return isLast ? `<span>${item}</span>` : `<a href="index.html">${item}</a>`;
      }).join(' <span class="breadcrumb-sep">/</span> ');
      breadcrumbEl.innerHTML = breadcrumbHTML;
    }
  }
}

/**
 * 初始化全局元素（导航、footer等）
 */
function initGlobalElements() {
  const global = getGlobalConfig();
  if (!global) return;
  
  // 公司名称
  if (global.company?.name) {
    setText('.nav-logo-name', global.company.name);
    setText('.footer-logo-name', global.company.name);
  }
  
  // 公司描述
  if (global.company?.description) {
    setText('.footer-brand-desc', global.company.description);
  }
  
  // 联系方式
  if (global.contact) {
    // 电话
    const phoneEl = document.querySelector('.footer-contact-item:nth-child(1) span:last-child, .footer-phone');
    if (phoneEl && global.contact.phone) phoneEl.textContent = global.contact.phone;
    
    // 邮箱
    const emailEl = document.querySelector('.footer-contact-item:nth-child(2) span:last-child, .footer-email');
    if (emailEl && global.contact.email) emailEl.textContent = global.contact.email;
    
    // 地址
    const addrEl = document.querySelector('.footer-contact-item:nth-child(3) span:last-child, .footer-address');
    if (addrEl && global.contact.address) addrEl.textContent = global.contact.address;
    
    // 工作时间
    const workTimeEl = document.querySelector('.footer-worktime');
    if (workTimeEl && global.contact.workTime) workTimeEl.textContent = global.contact.workTime;
  }
  
  // ICP备案和公安备案
  if (global.certifications) {
    const icpEl = document.querySelector('.footer-icp');
    if (icpEl && global.certifications.icp) icpEl.textContent = global.certifications.icp;
    
    const beianEl = document.querySelector('.footer-beian');
    if (beianEl && global.certifications.beian) beianEl.textContent = global.certifications.beian;
  }
}

/**
 * 渲染首页
 */
function renderHomePage() {
  const config = getPageConfig('home');
  if (!config) return;
  
  // SEO
  updateSEO(config.seo);
  
  // Hero区域
  const hero = config.hero;
  if (hero) {
    // 徽章
    if (hero.badge) {
      const badgeEl = document.querySelector('.hero-badge');
      if (badgeEl) badgeEl.innerHTML = '<span class="hero-badge-dot"></span>' + hero.badge;
    }
    
    // 主标题
    if (hero.title) {
      const titleEl = document.querySelector('.hero-title');
      if (titleEl) {
        const line1 = hero.title.line1 || '';
        const line2 = hero.title.line2 || '';
        const accent = hero.title.accent ? `<span class="hero-title-accent">${hero.title.accent}</span>` : '';
        titleEl.innerHTML = `${line1}<br>${accent || line2}`;
      }
    }
    
    // 英文标题
    if (hero.englishTitle) {
      const enEl = document.querySelector('.hero-en');
      if (enEl) enEl.textContent = hero.englishTitle;
    }
    
    // 副标题
    if (hero.subtitle) {
      const subEl = document.querySelector('.hero-sub');
      if (subEl) subEl.innerHTML = hero.subtitle.replace(/\n/g, '<br>');
    }
  }
  
  console.log('✅ 首页配置已应用');
}

/**
 * 渲染关于页面
 */
function renderAboutPage() {
  const config = getPageConfig('about');
  if (!config) return;
  
  // SEO
  updateSEO(config.seo);
  
  // Banner
  updateBanner(config.banner);
  
  console.log('✅ 关于页面配置已应用');
}

/**
 * 渲染产品页面
 */
function renderProductsPage() {
  const config = getPageConfig('products');
  if (!config) return;
  
  // SEO
  updateSEO(config.seo);
  
  // Banner
  updateBanner(config.banner);
  
  console.log('✅ 产品页面配置已应用');
}

/**
 * 渲染案例页面
 */
function renderCasesPage() {
  const config = getPageConfig('cases');
  if (!config) return;
  
  // SEO
  updateSEO(config.seo);
  
  // Banner
  updateBanner(config.banner);
  
  console.log('✅ 案例页面配置已应用');
}

/**
 * 渲染研发实力页面
 */
function renderResearchPage() {
  const config = getPageConfig('research');
  if (!config) return;
  
  // SEO
  updateSEO(config.seo);
  
  // Banner
  updateBanner(config.banner);
  
  console.log('✅ 研发实力页面配置已应用');
}

/**
 * 渲染诊所业务页面
 */
function renderClinicPage() {
  const config = getPageConfig('clinic');
  if (!config) return;
  
  // SEO
  updateSEO(config.seo);
  
  // Banner
  updateBanner(config.banner);
  
  console.log('✅ 诊所业务页面配置已应用');
}

/**
 * 渲染联系我们页面
 */
function renderContactPage() {
  const config = getPageConfig('contact');
  if (!config) return;
  
  // SEO
  updateSEO(config.seo);
  
  // Banner
  updateBanner(config.banner);
  
  // 联系卡片
  if (config.contactCards && Array.isArray(config.contactCards)) {
    const contactItems = document.querySelectorAll('.contact-card, .contact-info-item');
    contactItems.forEach((item, index) => {
      if (config.contactCards[index]) {
        const card = config.contactCards[index];
        const valueEl = item.querySelector('.contact-value, h4');
        if (valueEl && card.value) valueEl.textContent = card.value;
        
        const subEl = item.querySelector('.contact-sub, p');
        if (subEl && card.sub) subEl.textContent = card.sub;
      }
    });
  }
  
  console.log('✅ 联系我们页面配置已应用');
}

/**
 * 渲染下载中心页面
 */
function renderDownloadsPage() {
  const config = getPageConfig('downloads');
  if (!config) return;
  
  // SEO
  updateSEO(config.seo);
  
  // Banner
  updateBanner(config.banner);
  
  console.log('✅ 下载中心页面配置已应用');
}

/**
 * 渲染新闻中心页面
 */
function renderNewsPage() {
  const config = getPageConfig('news');
  if (!config) return;
  
  // SEO
  updateSEO(config.seo);
  
  // Banner
  updateBanner(config.banner);
  
  console.log('✅ 新闻中心页面配置已应用');
}

/**
 * 渲染产品详情页面
 */
function renderProductDetailPage() {
  // 产品详情页使用URL参数获取产品ID，使用 products 配置
  const config = getPageConfig('products');
  if (!config) return;
  
  // SEO
  updateSEO(config.seo);
  
  console.log('✅ 产品详情页面配置已应用');
}

/**
 * 根据当前页面自动初始化
 */
async function autoInit() {
  const config = await loadConfig();
  if (!config) {
    console.error('配置加载失败，使用默认内容');
    return;
  }
  
  // 初始化全局元素
  initGlobalElements();
  
  // 根据页面路径自动渲染
  const path = window.location.pathname;
  const pageName = path.split('/').pop() || 'index.html';
  
  if (pageName.includes('index') || pageName === '' || pageName === '/') {
    renderHomePage();
  } else if (pageName.includes('about')) {
    renderAboutPage();
  } else if (pageName.includes('products')) {
    renderProductsPage();
  } else if (pageName.includes('cases')) {
    renderCasesPage();
  } else if (pageName.includes('research')) {
    renderResearchPage();
  } else if (pageName.includes('clinic')) {
    renderClinicPage();
  } else if (pageName.includes('contact')) {
    renderContactPage();
  } else if (pageName.includes('downloads')) {
    renderDownloadsPage();
  } else if (pageName.includes('news')) {
    renderNewsPage();
  } else if (pageName.includes('product-detail')) {
    renderProductDetailPage();
  }
  
  console.log('✅ 网站配置已加载完成');
}

// DOM加载完成后自动初始化
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', autoInit);
} else {
  autoInit();
}

// 导出API供手动调用
window.LuoshiConfig = {
  load: loadConfig,
  getGlobal: getGlobalConfig,
  getPage: getPageConfig,
  renderTemplate,
  setText,
  setHTML,
  updateSEO,
  updateBanner,
  initGlobalElements,
  renderHomePage,
  renderAboutPage,
  renderProductsPage,
  renderCasesPage,
  renderResearchPage,
  renderClinicPage,
  renderContactPage,
  renderDownloadsPage,
  renderNewsPage,
  renderProductDetailPage
};

/**
 * 快速测试配置是否生效
 * 在浏览器控制台输入: testConfig()
 */
window.testConfig = function() {
  console.clear();
  console.log('%c🔍 骆氏健康官网 - 配置测试', 'font-size:18px;font-weight:bold;color:#2563EB');
  console.log('');
  
  let passed = 0;
  let failed = 0;
  
  // 测试1: 配置对象
  console.log('%c测试 1: 配置对象加载', 'font-weight:bold');
  if (window.WebsiteConfig && Object.keys(window.WebsiteConfig).length > 0) {
    console.log('  ✅ WebsiteConfig 已加载');
    passed++;
  } else {
    console.log('  ❌ WebsiteConfig 未加载');
    failed++;
  }
  
  // 测试2: 全局配置
  console.log('');
  console.log('%c测试 2: 全局配置', 'font-weight:bold');
  const global = LuoshiConfig.getGlobal();
  if (global && global.company) {
    console.log('  ✅ 公司名称:', global.company.name);
    console.log('  ✅ 公司描述:', global.company.description?.substring(0, 30) + '...');
    passed++;
  } else {
    console.log('  ❌ 全局配置未加载');
    failed++;
  }
  
  // 测试3: 页面配置
  console.log('');
  console.log('%c测试 3: 页面特定配置', 'font-weight:bold');
  const path = window.location.pathname;
  const pageName = path.includes('index') ? 'home' : 
                   path.includes('about') ? 'about' :
                   path.includes('products') ? 'products' :
                   path.includes('cases') ? 'cases' :
                   path.includes('research') ? 'research' :
                   path.includes('clinic') ? 'clinic' :
                   path.includes('contact') ? 'contact' :
                   path.includes('downloads') ? 'downloads' :
                   path.includes('news') ? 'news' : 'home';
  
  const pageConfig = LuoshiConfig.getPage(pageName);
  if (pageConfig && pageConfig.seo) {
    console.log('  ✅ 当前页面:', pageName);
    console.log('  ✅ SEO标题:', pageConfig.seo.title);
    passed++;
  } else {
    console.log('  ⚠️  页面配置未找到（此页面可能无特定配置）');
  }
  
  // 测试4: DOM更新
  console.log('');
  console.log('%c测试 4: DOM元素更新', 'font-weight:bold');
  const logoEl = document.querySelector('.nav-logo-name');
  if (logoEl && logoEl.textContent) {
    console.log('  ✅ Logo文字:', logoEl.textContent);
    passed++;
  } else {
    console.log('  ⚠️  Logo元素未找到');
  }
  
  const titleEl = document.querySelector('title');
  if (titleEl && titleEl.textContent) {
    console.log('  ✅ 页面标题:', titleEl.textContent);
  }
  
  const bannerTitle = document.querySelector('.page-banner-title');
  if (bannerTitle) {
    console.log('  ✅ Banner标题:', bannerTitle.textContent);
  }
  
  // 汇总
  console.log('');
  console.log('%c========================================', 'color:#2563EB');
  console.log('%c测试完成 ✅ 通过: ' + passed + '  ⚠️ 忽略: ' + failed, 'font-size:14px');
  console.log('%c========================================', 'color:#2563EB');
  console.log('提示: 修改 website-config.json 后刷新页面即可看到变化');
  
  return { passed, failed };
};

// 页面加载完成后提示
console.log('%c💡 配置系统已加载，输入 testConfig() 运行测试', 'color:#10B981');
