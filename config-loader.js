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
    // 添加时间戳绕过缓存
    const cacheBuster = '?_t=' + new Date().getTime();
    const response = await fetch('website-config.json' + cacheBuster);
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
    
    // 核心数据区域（右侧蓝色面板）
    if (hero.stats) {
      // 标题
      if (hero.stats.title) {
        const statsTitleEl = document.querySelector('.hero-stats-title');
        if (statsTitleEl) statsTitleEl.textContent = hero.stats.title;
      }
      
      // 数据项
      if (hero.stats.items && Array.isArray(hero.stats.items)) {
        const statCards = document.querySelectorAll('.hero-stats .stat-card');
        hero.stats.items.forEach((item, index) => {
          if (statCards[index]) {
            const iconEl = statCards[index].querySelector('.stat-icon');
            const numEl = statCards[index].querySelector('.stat-num');
            const labelEl = statCards[index].querySelector('.stat-label');
            
            if (iconEl) iconEl.textContent = item.icon || '';
            if (numEl) {
              // 处理带单位的数值，如 92% 或 10+
              const value = item.value || '';
              const supMatch = value.match(/^(\d+)([+%])$/);
              if (supMatch) {
                numEl.innerHTML = `${supMatch[1]}<sup>${supMatch[2]}</sup>`;
              } else {
                numEl.innerHTML = value;
              }
            }
            if (labelEl) labelEl.textContent = item.label || '';
          }
        });
      }
    }
    
    // 品牌条
    if (hero.brandStrip) {
      const brandStripEl = document.querySelector('.hero-brand-strip p');
      if (brandStripEl && hero.brandStrip.company && hero.brandStrip.slogan) {
        brandStripEl.innerHTML = `<strong>${hero.brandStrip.company}</strong><br>${hero.brandStrip.slogan}`;
      }
    }
    
    // 双品牌展示
    if (hero.brands && Array.isArray(hero.brands) && hero.brands.length >= 2) {
      const brandItems = document.querySelectorAll('.hero-brand-item');
      hero.brands.forEach((brand, index) => {
        if (brandItems[index]) {
          const nameEl = brandItems[index].querySelector('.hero-brand-name');
          const subEl = brandItems[index].querySelector('.hero-brand-sub');
          if (nameEl) nameEl.textContent = brand.name || '';
          if (subEl) subEl.textContent = brand.subtitle || '';
        }
      });
    }
    
    // 按钮
    if (hero.buttons && Array.isArray(hero.buttons) && hero.buttons.length >= 2) {
      const btnEls = document.querySelectorAll('.hero-btns a');
      hero.buttons.forEach((btn, index) => {
        if (btnEls[index]) {
          btnEls[index].textContent = btn.label || '';
          btnEls[index].href = btn.url || '#';
        }
      });
    }
    
    // 底部信任条
    if (hero.trustBar && Array.isArray(hero.trustBar) && hero.trustBar.length >= 3) {
      const trustItems = document.querySelectorAll('.hero-trust-bar .trust-item span');
      hero.trustBar.forEach((item, index) => {
        if (trustItems[index]) {
          trustItems[index].innerHTML = `<strong>${item.highlight}</strong> ${item.text}`;
        }
      });
    }
    
    // 滚动提示
    if (hero.scrollHint) {
      const scrollHintEl = document.querySelector('.hero-scroll-hint');
      if (scrollHintEl) {
        const textNode = scrollHintEl.lastChild;
        if (textNode && textNode.nodeType === Node.TEXT_NODE) {
          textNode.textContent = ' ' + hero.scrollHint;
        }
      }
    }
  }
  
  // 核心优势区
  const advantages = config.advantages;
  if (advantages) {
    const advSection = document.getElementById('advantages');
    if (advSection) {
      // 区域标签
      if (advantages.sectionTag) {
        const eyebrowEl = advSection.querySelector('.sec-eyebrow');
        if (eyebrowEl) eyebrowEl.textContent = advantages.sectionTag;
      }
      
      // 标题
      if (advantages.title) {
        const titleEl = advSection.querySelector('.sec-title');
        if (titleEl) titleEl.textContent = advantages.title;
      }
      
      // 描述
      if (advantages.description) {
        const descEl = advSection.querySelector('.sec-desc');
        if (descEl) descEl.textContent = advantages.description;
      }
      
      // 链接文字
      if (advantages.linkText) {
        const linkEl = advSection.querySelector('.adv-link');
        if (linkEl) linkEl.textContent = advantages.linkText;
      }
      
      // 卡片
      if (advantages.cards && Array.isArray(advantages.cards) && advantages.cards.length > 0) {
        const cardEls = advSection.querySelectorAll('.adv-card');
        advantages.cards.forEach((card, index) => {
          if (cardEls[index]) {
            const iconEl = cardEls[index].querySelector('.adv-icon-wrap');
            const titleEl = cardEls[index].querySelector('h3');
            const descEl = cardEls[index].querySelector('p');
            const tagEl = cardEls[index].querySelector('.adv-tag');
            
            if (iconEl) iconEl.textContent = card.icon || '';
            if (titleEl) titleEl.textContent = card.title || '';
            if (descEl) descEl.textContent = card.description || '';
            if (tagEl) tagEl.textContent = card.tag || '';
          }
        });
      }
      
      // 认证面板
      if (advantages.certPanel) {
        const certPanelEl = advSection.querySelector('.cert-panel');
        if (certPanelEl) {
          // 面板标题
          if (advantages.certPanel.title) {
            const panelTitleEl = certPanelEl.querySelector('.cert-panel-title');
            if (panelTitleEl) panelTitleEl.textContent = advantages.certPanel.title;
          }
          
          // 认证项
          if (advantages.certPanel.items && Array.isArray(advantages.certPanel.items)) {
            const certRows = certPanelEl.querySelectorAll('.cert-row');
            advantages.certPanel.items.forEach((item, index) => {
              if (certRows[index]) {
                const iconEl = certRows[index].querySelector('.cert-row-icon');
                const nameEl = certRows[index].querySelector('.cert-row-name');
                const subEl = certRows[index].querySelector('.cert-row-sub');
                
                if (iconEl) iconEl.textContent = item.icon || '';
                if (nameEl) nameEl.textContent = item.name || '';
                if (subEl) subEl.textContent = item.sub || '';
              }
            });
          }
          
          // 提示文字
          if (advantages.certPanel.hint) {
            const hintEl = certPanelEl.querySelector('.cert-panel-hint');
            if (hintEl) hintEl.textContent = advantages.certPanel.hint;
          }
        }
      }
    }
  }
  
  // 产品展示区域
  const products = config.products;
  if (products) {
    const productsSection = document.getElementById('products');
    if (productsSection) {
      // 区域标签
      if (products.sectionTag) {
        const eyebrowEl = productsSection.querySelector('.sec-eyebrow');
        if (eyebrowEl) eyebrowEl.textContent = products.sectionTag;
      }
      
      // 标题
      if (products.title) {
        const titleEl = productsSection.querySelector('.sec-title');
        if (titleEl) titleEl.textContent = products.title;
      }
      
      // 按钮文字
      if (products.buttonText) {
        const btnEl = productsSection.querySelector('.btn-outline-blue');
        if (btnEl) btnEl.textContent = products.buttonText;
      }
      
      // 产品卡片
      if (products.items && Array.isArray(products.items) && products.items.length > 0) {
        const gridEl = productsSection.querySelector('.products-grid');
        if (gridEl) {
          gridEl.innerHTML = products.items.map(item => {
            const badgeClass = item.badgeType === 'green' ? 'pb-green' : 
                              item.badgeType === 'teal' ? 'pb-teal' : 'pb-blue';
            const kpisHTML = item.kpis ? item.kpis.map(kpi => 
              `<div><p class="product-kpi-val">${kpi.value}</p><p class="product-kpi-key">${kpi.label}</p></div>`
            ).join('') : '';
            
            return `
              <div class="product-card">
                <div class="product-thumb">
                  <img src="${item.image || ''}" alt="${item.name || ''}" loading="lazy"/>
                  <span class="product-badge ${badgeClass}">${item.badge || ''}</span>
                </div>
                <div class="product-body">
                  <h3 class="product-name">${item.name || ''}</h3>
                  <p class="product-desc">${item.description || ''}</p>
                  <div class="product-cert-tag"><span class="cert-dot-sm"></span>${item.cert || ''}</div>
                  <div class="product-foot">
                    <div class="product-kpis">${kpisHTML}</div>
                    <a href="product-detail.html?id=${item.id || 1}" class="btn-card-link">了解详情 →</a>
                  </div>
                </div>
              </div>
            `;
          }).join('');
        }
      }
    }
  }
  
  // 合作案例区域
  const cases = config.cases;
  if (cases) {
    const casesSection = document.getElementById('cases');
    if (casesSection) {
      // 区域标签
      if (cases.sectionTag) {
        const eyebrowEl = casesSection.querySelector('.sec-eyebrow');
        if (eyebrowEl) eyebrowEl.textContent = cases.sectionTag;
      }
      
      // 标题
      if (cases.title) {
        const titleEl = casesSection.querySelector('.sec-title');
        if (titleEl) titleEl.textContent = cases.title;
      }
      
      // 描述
      if (cases.description) {
        const descEl = casesSection.querySelector('.sec-desc');
        if (descEl) descEl.textContent = cases.description;
      }
      
      // 合作伙伴大数字
      if (cases.partnerBig) {
        const bigEl = casesSection.querySelector('.cases-partner-big');
        if (bigEl) bigEl.innerHTML = cases.partnerBig + '<sup>+</sup>';
      }
      
      // 合作伙伴标签
      if (cases.partnerLabel) {
        const labelEl = casesSection.querySelector('.cases-partner-label');
        if (labelEl) labelEl.textContent = cases.partnerLabel;
      }
      
      // 查看全部链接
      if (cases.seeAllText) {
        const seeAllEl = casesSection.querySelector('.cases-see-all');
        if (seeAllEl) seeAllEl.textContent = cases.seeAllText;
      }
      
      // 案例卡片 - 如果有配置项则重新渲染
      if (cases.items && Array.isArray(cases.items) && cases.items.length > 0) {
        const gridEl = casesSection.querySelector('.cases-grid');
        if (gridEl) {
          // 只渲染前6个案例
          const itemsToRender = cases.items.slice(0, 6);
          gridEl.innerHTML = itemsToRender.map(item => {
            const metricsHTML = item.metrics ? item.metrics.map(m => 
              `<div><p class="case-metric-val">${m.value}</p><p class="case-metric-key">${m.label}</p></div>`
            ).join('') : '';
            
            return `
              <div class="case-card">
                <div class="case-thumb">
                  <div class="case-thumb-overlay" style="background:linear-gradient(135deg,#1e3a5f,#2563eb);"></div>
                  <img src="${item.image || ''}" alt="${item.name || ''}" loading="lazy" style="opacity:0.6;"/>
                  <span class="case-type-pill ${item.typeClass || 'ctp-blue'}">${item.type || ''}</span>
                </div>
                <div class="case-body">
                  <h3 class="case-name">${item.name || ''}</h3>
                  <p class="case-desc">${item.description || ''}</p>
                  <div class="case-metrics">${metricsHTML}</div>
                </div>
              </div>
            `;
          }).join('');
        }
      }
    }
  }
  
  // 表单区域
  const form = config.form;
  if (form) {
    const formSection = document.getElementById('form-section');
    if (formSection) {
      // 区域标签
      if (form.sectionTag) {
        const eyebrowEl = formSection.querySelector('.form-eyebrow');
        if (eyebrowEl) eyebrowEl.textContent = form.sectionTag;
      }
      
      // 标题
      if (form.title) {
        const titleEl = formSection.querySelector('.form-heading');
        if (titleEl) titleEl.innerHTML = form.title.replace(/\n/g, '<br>');
      }
      
      // 描述
      if (form.description) {
        const descEl = formSection.querySelector('.form-sub');
        if (descEl) descEl.textContent = form.description;
      }
      
      // 优势项
      if (form.perks && Array.isArray(form.perks)) {
        const perkEls = formSection.querySelectorAll('.form-perk');
        form.perks.forEach((perk, index) => {
          if (perkEls[index]) {
            const iconEl = perkEls[index].querySelector('.form-perk-icon');
            const textNode = perkEls[index].lastChild;
            if (iconEl) iconEl.textContent = perk.icon || '';
            if (textNode && textNode.nodeType === Node.TEXT_NODE) {
              textNode.textContent = perk.text || '';
            }
          }
        });
      }
      
      // 表单卡片
      if (form.formCard) {
        // 卡片标题
        if (form.formCard.title) {
          const cardTitleEl = formSection.querySelector('.form-card-title');
          if (cardTitleEl) cardTitleEl.textContent = form.formCard.title;
        }
        
        // 表单字段
        if (form.formCard.fields) {
          const fields = form.formCard.fields;
          
          // 姓名字段
          if (fields.name) {
            const nameLabel = formSection.querySelector('.form-group:nth-child(1) .form-label');
            const nameInput = formSection.querySelector('.form-group:nth-child(1) input');
            if (nameLabel) {
              nameLabel.innerHTML = fields.name.label + (fields.name.required ? '<span>*</span>' : '');
            }
            if (nameInput && fields.name.placeholder) nameInput.placeholder = fields.name.placeholder;
          }
          
          // 公司字段
          if (fields.company) {
            const companyLabel = formSection.querySelector('.form-group:nth-child(2) .form-label');
            const companyInput = formSection.querySelector('.form-group:nth-child(2) input');
            if (companyLabel) {
              companyLabel.innerHTML = fields.company.label + (fields.company.required ? '<span>*</span>' : '');
            }
            if (companyInput && fields.company.placeholder) companyInput.placeholder = fields.company.placeholder;
          }
          
          // 电话字段
          if (fields.phone) {
            const phoneLabel = formSection.querySelector('.form-row-2:nth-of-type(2) .form-group:nth-child(1) .form-label');
            const phoneInput = formSection.querySelector('.form-row-2:nth-of-type(2) .form-group:nth-child(1) input');
            if (phoneLabel) {
              phoneLabel.innerHTML = fields.phone.label + (fields.phone.required ? '<span>*</span>' : '');
            }
            if (phoneInput && fields.phone.placeholder) phoneInput.placeholder = fields.phone.placeholder;
          }
          
          // 合作意向下拉框
          if (fields.type) {
            const typeLabel = formSection.querySelector('.form-row-2:nth-of-type(2) .form-group:nth-child(2) .form-label');
            const typeSelect = formSection.querySelector('.form-row-2:nth-of-type(2) .form-group:nth-child(2) select');
            if (typeLabel) {
              typeLabel.innerHTML = fields.type.label + (fields.type.required ? '<span>*</span>' : '');
            }
            if (typeSelect && fields.type.options) {
              const optionsHTML = `<option value="" disabled selected>${fields.type.placeholder || '请选择'}</option>` +
                fields.type.options.map(opt => `<option>${opt}</option>`).join('');
              typeSelect.innerHTML = optionsHTML;
            }
          }
          
          // 留言字段
          if (fields.message) {
            const messageLabel = formSection.querySelector('.form-group:has(textarea) .form-label');
            const messageTextarea = formSection.querySelector('.form-group textarea');
            if (messageLabel) {
              messageLabel.innerHTML = fields.message.label + (fields.message.required ? '<span>*</span>' : '');
            }
            if (messageTextarea && fields.message.placeholder) messageTextarea.placeholder = fields.message.placeholder;
          }
        }
        
        // 提交按钮
        if (form.formCard.submitButton) {
          const submitBtn = formSection.querySelector('.form-submit');
          if (submitBtn) submitBtn.textContent = form.formCard.submitButton;
        }
        
        // 隐私声明
        if (form.formCard.privacyText) {
          const privacyEl = formSection.querySelector('.form-privacy');
          if (privacyEl) privacyEl.innerHTML = `<em>${form.formCard.privacyText}</em>`;
        }
      }
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
