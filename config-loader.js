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
  
  // 品牌故事区域
  const story = config.story;
  if (story) {
    const storySections = document.querySelectorAll('.story-section');
    
    // Section 1
    if (story.section1 && storySections[0]) {
      const s1 = story.section1;
      const grid = storySections[0].querySelector('.story-grid');
      if (grid) {
        // 图片
        const imgEl = grid.querySelector('.story-img-wrap img');
        if (imgEl) {
          imgEl.src = s1.image || '';
          imgEl.alt = s1.imageAlt || s1.title || '';
        }
        
        // 标签
        const eyebrowEl = grid.querySelector('.story-text-eyebrow');
        if (eyebrowEl) eyebrowEl.textContent = s1.tag || '';
        
        // 标题
        const titleEl = grid.querySelector('.story-text h2');
        if (titleEl) titleEl.textContent = s1.title || '';
        
        // 段落
        const paragraphs = grid.querySelectorAll('.story-text > p:not(.story-text-eyebrow)');
        if (s1.paragraphs && Array.isArray(s1.paragraphs)) {
          paragraphs.forEach((p, index) => {
            if (s1.paragraphs[index]) p.textContent = s1.paragraphs[index];
          });
        }
        
        // 统计数据
        if (s1.stats && Array.isArray(s1.stats) && s1.stats.length >= 3) {
          const shItems = grid.querySelectorAll('.story-highlight .sh-item');
          s1.stats.forEach((stat, index) => {
            if (shItems[index]) {
              const numEl = shItems[index].querySelector('.sh-num');
              const labelEl = shItems[index].querySelector('.sh-label');
              if (numEl) {
                // 处理带单位/符号的数值，如 100+ 或 92%
                const value = stat.value || '';
                const supMatch = value.match(/^(\d+)([+%])$/);
                if (supMatch) {
                  numEl.innerHTML = `${supMatch[1]}<sup>${supMatch[2]}</sup>`;
                } else {
                  numEl.innerHTML = value;
                }
              }
              if (labelEl) labelEl.textContent = stat.label || '';
            }
          });
        }
      }
    }
    
    // Section 2
    if (story.section2 && storySections[1]) {
      const s2 = story.section2;
      const grid = storySections[1].querySelector('.story-grid');
      if (grid) {
        // 图片
        const imgEl = grid.querySelector('.story-img-wrap img');
        if (imgEl) {
          imgEl.src = s2.image || '';
          imgEl.alt = s2.imageAlt || s2.title || '';
        }
        
        // 标签
        const eyebrowEl = grid.querySelector('.story-text-eyebrow');
        if (eyebrowEl) eyebrowEl.textContent = s2.tag || '';
        
        // 标题
        const titleEl = grid.querySelector('.story-text h2');
        if (titleEl) titleEl.textContent = s2.title || '';
        
        // 段落
        const paragraphs = grid.querySelectorAll('.story-text > p:not(.story-text-eyebrow)');
        if (s2.paragraphs && Array.isArray(s2.paragraphs)) {
          paragraphs.forEach((p, index) => {
            if (s2.paragraphs[index]) p.textContent = s2.paragraphs[index];
          });
        }
        
        // 统计数据
        if (s2.stats && Array.isArray(s2.stats) && s2.stats.length >= 3) {
          const shItems = grid.querySelectorAll('.story-highlight .sh-item');
          s2.stats.forEach((stat, index) => {
            if (shItems[index]) {
              const numEl = shItems[index].querySelector('.sh-num');
              const labelEl = shItems[index].querySelector('.sh-label');
              if (numEl) {
                const value = stat.value || '';
                const supMatch = value.match(/^(\d+)([+%])$/);
                if (supMatch) {
                  numEl.innerHTML = `${supMatch[1]}<sup>${supMatch[2]}</sup>`;
                } else {
                  numEl.innerHTML = value;
                }
              }
              if (labelEl) labelEl.textContent = stat.label || '';
            }
          });
        }
      }
    }
  }
  
  // 发展历程时间轴
  const timeline = config.timeline;
  if (timeline) {
    const timelineSection = document.querySelector('.timeline-section');
    if (timelineSection) {
      // 区域标题
      const sectionHeader = timelineSection.querySelector('.section-header');
      if (sectionHeader) {
        const eyebrowEl = sectionHeader.querySelector('.sec-eyebrow');
        const titleEl = sectionHeader.querySelector('.sec-title');
        const descEl = sectionHeader.querySelector('.sec-desc');
        
        if (eyebrowEl) eyebrowEl.textContent = timeline.sectionTag || '';
        if (titleEl) titleEl.textContent = timeline.title || '';
        if (descEl) descEl.textContent = timeline.description || '';
      }
      
      // 时间轴项目 - 重新渲染
      if (timeline.items && Array.isArray(timeline.items) && timeline.items.length > 0) {
        const timelineEl = timelineSection.querySelector('.timeline');
        if (timelineEl) {
          timelineEl.innerHTML = timeline.items.map(item => `
            <div class="tl-item">
              <div class="tl-dot"></div>
              <p class="tl-year">${item.year || ''}</p>
              <h3 class="tl-title">${item.title || ''}</h3>
              <p class="tl-desc">${item.description || ''}</p>
            </div>
          `).join('');
        }
      }
    }
  }
  
  // 资质荣誉墙
  const certifications = config.certifications;
  if (certifications) {
    const certSection = document.querySelector('.cert-wall');
    if (certSection) {
      // 区域标题
      const sectionHeader = certSection.querySelector('.section-header');
      if (sectionHeader) {
        const eyebrowEl = sectionHeader.querySelector('.sec-eyebrow');
        const titleEl = sectionHeader.querySelector('.sec-title');
        const descEl = sectionHeader.querySelector('.sec-desc');
        
        if (eyebrowEl) eyebrowEl.textContent = certifications.sectionTag || '';
        if (titleEl) titleEl.textContent = certifications.title || '';
        if (descEl) descEl.textContent = certifications.description || '';
      }
      
      // 证书卡片 - 重新渲染
      if (certifications.items && Array.isArray(certifications.items) && certifications.items.length > 0) {
        const certGrid = certSection.querySelector('.cert-grid');
        if (certGrid) {
          certGrid.innerHTML = certifications.items.map(item => `
            <div class="cert-card">
              <div class="cert-card-icon">${item.icon || ''}</div>
              <p class="cert-card-name">${item.name || ''}</p>
              <p class="cert-card-num">${item.num || ''}</p>
              <span class="cert-badge">${item.badge || ''}</span>
            </div>
          `).join('');
        }
      }
    }
  }
  
  // 核心团队
  const team = config.team;
  if (team) {
    const teamSection = document.querySelector('.team-section');
    if (teamSection) {
      // 区域标题
      const sectionHeader = teamSection.querySelector('.section-header');
      if (sectionHeader) {
        const eyebrowEl = sectionHeader.querySelector('.sec-eyebrow');
        const titleEl = sectionHeader.querySelector('.sec-title');
        const descEl = sectionHeader.querySelector('.sec-desc');
        
        if (eyebrowEl) eyebrowEl.textContent = team.sectionTag || '';
        if (titleEl) titleEl.textContent = team.title || '';
        if (descEl) descEl.textContent = team.description || '';
      }
      
      // 团队成员卡片 - 重新渲染
      if (team.members && Array.isArray(team.members) && team.members.length > 0) {
        const teamGrid = teamSection.querySelector('.team-grid');
        if (teamGrid) {
          teamGrid.innerHTML = team.members.map(member => {
            const avatar = member.avatar || '';
            const isImg = /^https?:\/\//.test(avatar) || /^\//.test(avatar) || /\.(jpg|jpeg|png|webp|gif|svg)(\?.*)?$/i.test(avatar);
            const avatarHTML = isImg
              ? `<img src="${avatar}" alt="${member.name || ''}" class="team-avatar-img" loading="lazy"/>`
              : avatar;
            return `
            <div class="team-card">
              <div class="team-avatar">${avatarHTML}</div>
              <h3 class="team-name">${member.name || ''}</h3>
              <p class="team-title">${member.title || ''}</p>
              <p class="team-desc">${member.description || ''}</p>
            </div>
          `;
          }).join('');
        }
      }
    }
  }
  
  // CTA 区域
  const cta = config.cta;
  if (cta) {
    const ctaBanner = document.querySelector('.cta-banner');
    if (ctaBanner) {
      const titleEl = ctaBanner.querySelector('.cta-banner-title');
      const descEl = ctaBanner.querySelector('.cta-banner-sub');
      const btnEl = ctaBanner.querySelector('.btn-white');
      
      if (titleEl) titleEl.textContent = cta.title || '';
      if (descEl) descEl.textContent = cta.description || '';
      if (btnEl) btnEl.textContent = cta.buttonText || '';
    }
  }
  
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
  
  // 筛选标签
  if (config.filter && config.filter.tabs) {
    const filterInner = document.querySelector('.filter-inner');
    if (filterInner) {
      // 保留现有的筛选标签，更新文本
      const tabs = filterInner.querySelectorAll('.filter-tab');
      config.filter.tabs.forEach((tab, index) => {
        if (tabs[index]) {
          tabs[index].textContent = tab.label || '';
          tabs[index].dataset.cat = tab.id || '';
        }
      });
      
      // 更新产品数量文本
      if (config.filter.countText) {
        const productList = config.productList || [];
        const countText = renderTemplate(config.filter.countText, { count: productList.length });
        const countEl = document.getElementById('product-count');
        if (countEl) countEl.textContent = countText;
      }
    }
  }
  
  // 产品列表
  if (config.productList && Array.isArray(config.productList)) {
    const productsGrid = document.getElementById('products-grid');
    if (productsGrid) {
      productsGrid.innerHTML = config.productList.map(product => {
        // 生成参数HTML
        const paramsHTML = product.params ? product.params.map(param => 
          `<span class="param-chip">${param}</span>`
        ).join('') : '';
        
        // 生成KPIs HTML
        const kpisHTML = product.kpis ? product.kpis.map(kpi => {
          const value = kpi.value || '';
          const supMatch = value.match(/^(\d+)([%+°]?)$/);
          const valueHTML = supMatch ? `${supMatch[1]}<sup>${supMatch[2]}</sup>` : value;
          return `<div><p class="product-kpi-val">${valueHTML}</p><p class="product-kpi-key">${kpi.label || ''}</p></div>`;
        }).join('') : '';
        
        return `
          <div class="product-card card-hover" data-category="${product.category || ''}">
            <div class="product-thumb">
              <img src="${product.image || ''}" alt="${product.name || ''}" loading="lazy"/>
              <span class="product-badge ${product.badgeClass || 'pb-blue'}">${product.badge || ''}</span>
            </div>
            <div class="product-body">
              <h3 class="product-name">${product.name || ''}</h3>
              <p class="product-desc">${product.description || ''}</p>
              <div class="product-cert-tag"><span class="cert-dot-sm"></span>${product.cert || ''}</div>
              <div class="product-params">${paramsHTML}</div>
              <div class="product-foot">
                <div class="product-kpis">${kpisHTML}</div>
                <a href="product-detail.html?id=${product.id || 1}" class="btn-card-link">了解详情 →</a>
              </div>
            </div>
          </div>
        `;
      }).join('');
    }
  }
  
  // CTA区域
  if (config.cta) {
    const ctaBanner = document.querySelector('.cta-banner');
    if (ctaBanner) {
      // 更新CTA标题
      if (config.cta.title) {
        const titleEl = ctaBanner.querySelector('.cta-banner-title');
        if (titleEl) titleEl.textContent = config.cta.title;
      }
      
      // 更新CTA描述
      if (config.cta.description) {
        const descEl = ctaBanner.querySelector('.cta-banner-sub');
        if (descEl) descEl.textContent = config.cta.description;
      }
      
      // 更新CTA按钮文本
      if (config.cta.buttonText) {
        const btnEl = ctaBanner.querySelector('.btn-white');
        if (btnEl) btnEl.textContent = config.cta.buttonText;
      }
    }
  }
  
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
  
  // 1. 筛选标签 (cases.filter.tabs)
  if (config.filter && Array.isArray(config.filter.tabs)) {
    const filterContainer = document.querySelector('.cases-filter-inner, .filter-inner, .filter-tabs');
    if (filterContainer) {
      filterContainer.innerHTML = config.filter.tabs.map((tab, index) => {
        const activeClass = index === 0 ? 'active' : '';
        return `<button class="filter-tab ${activeClass}" data-filter="${tab.id}">${tab.label}</button>`;
      }).join('');
    }
  }
  
  // 2. 案例列表 (cases.caseList)
  if (config.caseList && Array.isArray(config.caseList)) {
    const casesGrid = document.querySelector('.cases-grid');
    if (casesGrid) {
      casesGrid.innerHTML = config.caseList.map(item => {
        const metricsHTML = item.metrics ? item.metrics.map(m => 
          `<div><p class="case-metric-val">${m.value}</p><p class="case-metric-key">${m.label}</p></div>`
        ).join('') : '';
        
        return `
          <div class="case-card" data-category="${item.category || 'all'}">
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
  
  // 3. 深度案例 (cases.featuredCase)
  if (config.featuredCase) {
    const featuredCase = config.featuredCase;
    const featuredSection = document.querySelector('.featured-case, .feature-case-section');
    
    if (featuredSection) {
      // 区域标签
      const sectionTagEl = featuredSection.querySelector('.sec-eyebrow, .feature-case-eyebrow');
      if (sectionTagEl && featuredCase.sectionTag) {
        sectionTagEl.textContent = featuredCase.sectionTag;
      }
      
      // 标题
      const titleEl = featuredSection.querySelector('.sec-title, .feature-case-title');
      if (titleEl && featuredCase.title) {
        titleEl.textContent = featuredCase.title;
      }
      
      // 深度案例卡片内容
      const caseCard = featuredSection.querySelector('.feature-case-card, .featured-case-card');
      if (caseCard) {
        // eyebrow 标签
        const eyebrowEl = caseCard.querySelector('.feature-case-eyebrow, .fck-eyebrow');
        if (eyebrowEl && featuredCase.eyebrow) {
          eyebrowEl.textContent = featuredCase.eyebrow;
        }
        
        // 案例标题
        const caseTitleEl = caseCard.querySelector('.feature-case-case-title, .fck-case-title');
        if (caseTitleEl && featuredCase.caseTitle) {
          caseTitleEl.textContent = featuredCase.caseTitle;
        }
        
        // 描述
        const descEl = caseCard.querySelector('.feature-case-desc, .fck-desc');
        if (descEl && featuredCase.description) {
          descEl.textContent = featuredCase.description;
        }
        
        // 图片
        const imgEl = caseCard.querySelector('.feature-case-img img, .featured-case-img img');
        if (imgEl && featuredCase.image) {
          imgEl.src = featuredCase.image;
          imgEl.alt = featuredCase.caseTitle || '';
        }
        
        // KPIs
        if (featuredCase.kpis && Array.isArray(featuredCase.kpis)) {
          const kpisContainer = caseCard.querySelector('.feature-case-kpis, .fck-kpis');
          if (kpisContainer) {
            kpisContainer.innerHTML = featuredCase.kpis.map(kpi => `
              <div class="fck-kpi">
                <p class="fck-val">${kpi.value}</p>
                <p class="fck-label">${kpi.label}</p>
              </div>
            `).join('');
          }
        }
        
        // Tags
        if (featuredCase.tags && Array.isArray(featuredCase.tags)) {
          const tagsContainer = caseCard.querySelector('.feature-case-tags, .fck-tags');
          if (tagsContainer) {
            tagsContainer.innerHTML = featuredCase.tags.map(tag => 
              `<span class="fck-tag">${tag}</span>`
            ).join('');
          }
        }
      }
    }
  }
  
  // 4. 合作伙伴 (cases.partners)
  if (config.partners) {
    const partnersSection = document.querySelector('.partners-section, .partners');
    
    if (partnersSection) {
      // 区域标签
      const sectionTagEl = partnersSection.querySelector('.sec-eyebrow, .partners-eyebrow');
      if (sectionTagEl && config.partners.sectionTag) {
        sectionTagEl.textContent = config.partners.sectionTag;
      }
      
      // 标题
      const titleEl = partnersSection.querySelector('.sec-title, .partners-title');
      if (titleEl && config.partners.title) {
        titleEl.textContent = config.partners.title;
      }
      
      // Logo 网格
      if (config.partners.logos && Array.isArray(config.partners.logos)) {
        const logosGrid = partnersSection.querySelector('.partners-grid, .logo-grid');
        if (logosGrid) {
          logosGrid.innerHTML = config.partners.logos.map(logo => `
            <div class="partner-logo">
              <span>${logo}</span>
            </div>
          `).join('');
        }
      }
    }
  }
  
  // 5. CTA区域 (cases.cta)
  if (config.cta) {
    const ctaSection = document.querySelector('.cta-section, .cta-banner');
    
    if (ctaSection) {
      // 标题
      const titleEl = ctaSection.querySelector('.cta-banner-title, .cta-title');
      if (titleEl && config.cta.title) {
        titleEl.textContent = config.cta.title;
      }
      
      // 描述
      const descEl = ctaSection.querySelector('.cta-banner-sub, .cta-desc');
      if (descEl && config.cta.description) {
        descEl.textContent = config.cta.description;
      }
      
      // 按钮文字
      const btnEl = ctaSection.querySelector('.btn-white, .cta-btn');
      if (btnEl && config.cta.buttonText) {
        btnEl.textContent = config.cta.buttonText;
      }
    }
  }
  
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
  
  // 研发数据区域
  const stats = config.stats;
  if (stats) {
    const statsSection = document.querySelector('.research-overview');
    if (statsSection) {
      // sectionTag
      if (stats.sectionTag) {
        const eyebrowEl = statsSection.querySelector('.sec-eyebrow');
        if (eyebrowEl) eyebrowEl.textContent = stats.sectionTag;
      }
      // title
      if (stats.title) {
        const titleEl = statsSection.querySelector('.sec-title');
        if (titleEl) titleEl.textContent = stats.title;
      }
      // description
      if (stats.description) {
        const descEl = statsSection.querySelector('.sec-desc');
        if (descEl) descEl.textContent = stats.description;
      }
      // items - 统计卡片
      if (stats.items && Array.isArray(stats.items)) {
        const gridEl = statsSection.querySelector('.research-stats-grid');
        if (gridEl) {
          gridEl.innerHTML = stats.items.map(item => {
            const value = item.value || '';
            const supMatch = value.match(/^(\d+)([+%])$/);
            const numHTML = supMatch ? `${supMatch[1]}<sup>${supMatch[2]}</sup>` : value;
            return `
              <div class="rs-card">
                <div class="rs-icon">${item.icon || ''}</div>
                <p class="rs-num">${numHTML}</p>
                <p class="rs-label">${item.label || ''}</p>
              </div>
            `;
          }).join('');
        }
      }
    }
  }
  
  // 技术专利区域
  const patents = config.patents;
  if (patents) {
    const patentSection = document.querySelector('.patent-section');
    if (patentSection) {
      // sectionTag
      if (patents.sectionTag) {
        const eyebrowEl = patentSection.querySelector('.sec-eyebrow');
        if (eyebrowEl) eyebrowEl.textContent = patents.sectionTag;
      }
      // title
      if (patents.title) {
        const titleEl = patentSection.querySelector('.sec-title');
        if (titleEl) titleEl.textContent = patents.title;
      }
      // description
      if (patents.description) {
        const descEl = patentSection.querySelector('.sec-desc');
        if (descEl) descEl.textContent = patents.description;
      }
      // items - 专利卡片
      if (patents.items && Array.isArray(patents.items)) {
        const gridEl = patentSection.querySelector('.patent-grid');
        if (gridEl) {
          gridEl.innerHTML = patents.items.map(item => {
            const typeClass = item.type === 'invention' ? 'pt-invention' : 'pt-utility';
            return `
              <div class="patent-card">
                <span class="patent-type-tag ${typeClass}">${item.typeName || ''}</span>
                <h3 class="patent-name">${item.name || ''}</h3>
                <p class="patent-num">${item.num || ''}</p>
                <span class="patent-year">${item.year || ''}</span>
              </div>
            `;
          }).join('');
        }
      }
    }
  }
  
  // 研发流程区域
  const process = config.process;
  if (process) {
    const processSection = document.querySelector('.rd-process');
    if (processSection) {
      // sectionTag
      if (process.sectionTag) {
        const eyebrowEl = processSection.querySelector('.sec-eyebrow');
        if (eyebrowEl) eyebrowEl.textContent = process.sectionTag;
      }
      // title
      if (process.title) {
        const titleEl = processSection.querySelector('.sec-title');
        if (titleEl) titleEl.textContent = process.title;
      }
      // steps - 流程步骤
      if (process.steps && Array.isArray(process.steps)) {
        const stepsEl = processSection.querySelector('.process-steps');
        if (stepsEl) {
          stepsEl.innerHTML = process.steps.map(step => `
            <div class="process-step">
              <div class="process-num">${step.num || ''}</div>
              <p class="process-title">${step.title || ''}</p>
              <p class="process-desc">${step.description || ''}</p>
            </div>
          `).join('');
        }
      }
    }
  }
  
  // 产学研合作区域
  const collaborations = config.collaborations;
  if (collaborations) {
    const collabSection = document.querySelector('.collab-section');
    if (collabSection) {
      // sectionTag
      if (collaborations.sectionTag) {
        const eyebrowEl = collabSection.querySelector('.sec-eyebrow');
        if (eyebrowEl) eyebrowEl.textContent = collaborations.sectionTag;
      }
      // title
      if (collaborations.title) {
        const titleEl = collabSection.querySelector('.sec-title');
        if (titleEl) titleEl.textContent = collaborations.title;
      }
      // items - 合作机构卡片
      if (collaborations.items && Array.isArray(collaborations.items)) {
        const gridEl = collabSection.querySelector('.collab-grid');
        if (gridEl) {
          gridEl.innerHTML = collaborations.items.map(item => `
            <div class="collab-card">
              <div class="collab-icon">${item.icon || ''}</div>
              <p class="collab-type">${item.type || ''}</p>
              <h3 class="collab-name">${item.name || ''}</h3>
              <p class="collab-desc">${item.description || ''}</p>
            </div>
          `).join('');
        }
      }
    }
  }
  
  // CTA区域
  const cta = config.cta;
  if (cta) {
    const ctaBanner = document.querySelector('.cta-banner');
    if (ctaBanner) {
      // title
      if (cta.title) {
        const titleEl = ctaBanner.querySelector('.cta-banner-title');
        if (titleEl) titleEl.textContent = cta.title;
      }
      // description
      if (cta.description) {
        const descEl = ctaBanner.querySelector('.cta-banner-sub');
        if (descEl) descEl.textContent = cta.description;
      }
      // buttonText
      if (cta.buttonText) {
        const btnEl = ctaBanner.querySelector('.btn-white');
        if (btnEl) btnEl.textContent = cta.buttonText;
      }
    }
  }
  
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
  
  // 价值模块 (clinic.value)
  const value = config.value;
  if (value) {
    const valueSection = document.querySelector('.clinic-value');
    if (valueSection) {
      // sectionTag
      if (value.sectionTag) {
        const eyebrowEl = valueSection.querySelector('.sec-eyebrow');
        if (eyebrowEl) eyebrowEl.textContent = value.sectionTag;
      }
      
      // title
      if (value.title) {
        const titleEl = valueSection.querySelector('.sec-title');
        if (titleEl) titleEl.textContent = value.title;
      }
      
      // description
      if (value.description) {
        const descEl = valueSection.querySelector('.sec-desc');
        if (descEl) descEl.textContent = value.description;
      }
      
      // cards (3个卡片)
      if (value.cards && Array.isArray(value.cards) && value.cards.length > 0) {
        const cardEls = valueSection.querySelectorAll('.cv-card');
        value.cards.forEach((card, index) => {
          if (cardEls[index]) {
            // icon
            const iconEl = cardEls[index].querySelector('.cv-icon');
            if (iconEl && card.icon) iconEl.textContent = card.icon;
            
            // title
            const titleEl = cardEls[index].querySelector('.cv-title');
            if (titleEl && card.title) titleEl.textContent = card.title;
            
            // description
            const descEl = cardEls[index].querySelector('.cv-desc');
            if (descEl && card.description) descEl.textContent = card.description;
            
            // points (4个要点)
            if (card.points && Array.isArray(card.points) && card.points.length > 0) {
              const pointsContainer = cardEls[index].querySelector('.cv-points');
              if (pointsContainer) {
                pointsContainer.innerHTML = card.points.map(point => 
                  `<div class="cv-point">${point}</div>`
                ).join('');
              }
            }
          }
        });
      }
    }
  }
  
  // 合作流程 (clinic.flow)
  const flow = config.flow;
  if (flow) {
    const flowSection = document.querySelector('.flow-section');
    if (flowSection) {
      // sectionTag
      if (flow.sectionTag) {
        const eyebrowEl = flowSection.querySelector('.sec-eyebrow');
        if (eyebrowEl) eyebrowEl.textContent = flow.sectionTag;
      }
      
      // title
      if (flow.title) {
        const titleEl = flowSection.querySelector('.sec-title');
        if (titleEl) titleEl.textContent = flow.title;
      }
      
      // steps (6个步骤)
      if (flow.steps && Array.isArray(flow.steps) && flow.steps.length > 0) {
        const stepsContainer = flowSection.querySelector('.flow-steps');
        if (stepsContainer) {
          stepsContainer.innerHTML = flow.steps.map(step => `
            <div class="flow-step">
              <div class="flow-num">${step.num || ''}</div>
              <p class="flow-title">${step.title || ''}</p>
              <p class="flow-desc">${step.description || ''}</p>
            </div>
          `).join('');
        }
      }
    }
  }
  
  // 支持体系 (clinic.support)
  const support = config.support;
  if (support) {
    const supportSection = document.querySelector('.support-section');
    if (supportSection) {
      // sectionTag
      if (support.sectionTag) {
        const eyebrowEl = supportSection.querySelector('.sec-eyebrow');
        if (eyebrowEl) eyebrowEl.textContent = support.sectionTag;
      }
      
      // title
      if (support.title) {
        const titleEl = supportSection.querySelector('.sec-title');
        if (titleEl) titleEl.textContent = support.title;
      }
      
      // items (4个支持项)
      if (support.items && Array.isArray(support.items) && support.items.length > 0) {
        const gridContainer = supportSection.querySelector('.support-grid');
        if (gridContainer) {
          gridContainer.innerHTML = support.items.map(item => `
            <div class="support-item">
              <div class="support-icon">${item.icon || ''}</div>
              <div>
                <h3 class="support-title">${item.title || ''}</h3>
                <p class="support-desc">${item.description || ''}</p>
              </div>
            </div>
          `).join('');
        }
      }
    }
  }
  
  // 合作案例 (clinic.cases)
  const cases = config.cases;
  if (cases) {
    const casesSection = document.querySelector('.cases-highlight');
    if (casesSection) {
      // sectionTag
      if (cases.sectionTag) {
        const eyebrowEl = casesSection.querySelector('.sec-eyebrow');
        if (eyebrowEl) eyebrowEl.textContent = cases.sectionTag;
      }
      
      // title
      if (cases.title) {
        const titleEl = casesSection.querySelector('.sec-title');
        if (titleEl) titleEl.textContent = cases.title;
      }
      
      // items (3个案例)
      if (cases.items && Array.isArray(cases.items) && cases.items.length > 0) {
        const gridContainer = casesSection.querySelector('.cases-hl-grid');
        if (gridContainer) {
          gridContainer.innerHTML = cases.items.map(item => {
            const metricsHTML = item.metrics ? item.metrics.map(m => 
              `<div><p class="hl-mv">${m.value || ''}</p><p class="hl-mk">${m.label || ''}</p></div>`
            ).join('') : '';
            
            return `
              <div class="hl-card">
                <div class="hl-thumb">
                  <img src="${item.image || ''}" alt="${item.name || ''}"/>
                </div>
                <div class="hl-body">
                  <h3 class="hl-name">${item.name || ''}</h3>
                  <p class="hl-open">${item.location || ''}</p>
                  <div class="hl-metrics">${metricsHTML}</div>
                </div>
              </div>
            `;
          }).join('');
        }
      }
    }
  }
  
  // 表单区域 (clinic.form)
  const form = config.form;
  if (form) {
    const formSection = document.getElementById('clinic-consult');
    if (formSection) {
      // sectionTag
      if (form.sectionTag) {
        const eyebrowEl = formSection.querySelector('.sec-eyebrow');
        if (eyebrowEl) eyebrowEl.textContent = form.sectionTag;
      }
      
      // title
      if (form.title) {
        const titleEl = formSection.querySelector('.sec-title');
        if (titleEl) titleEl.textContent = form.title;
      }
      
      // description
      if (form.description) {
        const descEl = formSection.querySelector('.sec-desc');
        if (descEl) descEl.textContent = form.description;
      }
      
      // 表单字段
      if (form.fields) {
        const fields = form.fields;
        
        // 姓名字段 (第一个输入框)
        if (fields.name) {
          const nameGroup = formSection.querySelector('.form-row-2:nth-of-type(1) .form-group:nth-child(1)');
          if (nameGroup) {
            const labelEl = nameGroup.querySelector('.form-label');
            const inputEl = nameGroup.querySelector('input');
            if (labelEl) {
              labelEl.innerHTML = fields.name.label + (fields.name.required ? '<span>*</span>' : '');
            }
            if (inputEl && fields.name.placeholder) inputEl.placeholder = fields.name.placeholder;
          }
        }
        
        // 电话字段 (第二个输入框)
        if (fields.phone) {
          const phoneGroup = formSection.querySelector('.form-row-2:nth-of-type(1) .form-group:nth-child(2)');
          if (phoneGroup) {
            const labelEl = phoneGroup.querySelector('.form-label');
            const inputEl = phoneGroup.querySelector('input');
            if (labelEl) {
              labelEl.innerHTML = fields.phone.label + (fields.phone.required ? '<span>*</span>' : '');
            }
            if (inputEl && fields.phone.placeholder) inputEl.placeholder = fields.phone.placeholder;
          }
        }
        
        // 城市字段 (第三个输入框)
        if (fields.city) {
          const cityGroup = formSection.querySelector('.form-row-2:nth-of-type(2) .form-group:nth-child(1)');
          if (cityGroup) {
            const labelEl = cityGroup.querySelector('.form-label');
            const inputEl = cityGroup.querySelector('input');
            if (labelEl) {
              labelEl.innerHTML = fields.city.label + (fields.city.required ? '<span>*</span>' : '');
            }
            if (inputEl && fields.city.placeholder) inputEl.placeholder = fields.city.placeholder;
          }
        }
        
        // 预算下拉框
        if (fields.budget) {
          const budgetGroup = formSection.querySelector('.form-row-2:nth-of-type(2) .form-group:nth-child(2)');
          if (budgetGroup) {
            const labelEl = budgetGroup.querySelector('.form-label');
            const selectEl = budgetGroup.querySelector('select');
            if (labelEl) {
              labelEl.innerHTML = fields.budget.label + (fields.budget.required ? '<span>*</span>' : '');
            }
            if (selectEl && fields.budget.options) {
              const optionsHTML = `<option value="" disabled selected>请选择</option>` +
                fields.budget.options.map(opt => `<option>${opt}</option>`).join('');
              selectEl.innerHTML = optionsHTML;
            }
          }
        }
        
        // 留言字段
        if (fields.message) {
          const messageGroup = formSection.querySelector('.form-group:has(textarea)');
          if (messageGroup) {
            const labelEl = messageGroup.querySelector('.form-label');
            const textareaEl = messageGroup.querySelector('textarea');
            if (labelEl) {
              labelEl.innerHTML = fields.message.label + (fields.message.required ? '<span>*</span>' : '');
            }
            if (textareaEl && fields.message.placeholder) textareaEl.placeholder = fields.message.placeholder;
          }
        }
      }
      
      // 提交按钮
      if (form.submitButton) {
        const submitBtn = formSection.querySelector('.form-submit');
        if (submitBtn) submitBtn.textContent = form.submitButton;
      }
      
      // 隐私声明
      if (form.privacyText) {
        const privacyEl = formSection.querySelector('.clinic-form-card > p:last-child');
        if (privacyEl) privacyEl.innerHTML = form.privacyText;
      }
    }
  }
  
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
    const contactCards = document.querySelectorAll('.contact-cards-grid .contact-card');
    config.contactCards.forEach((card, index) => {
      if (contactCards[index]) {
        const iconEl = contactCards[index].querySelector('.contact-card-icon');
        const labelEl = contactCards[index].querySelector('.contact-card-label');
        const valueEl = contactCards[index].querySelector('.contact-card-value');
        const subEl = contactCards[index].querySelector('.contact-card-sub');
        
        if (iconEl && card.icon) iconEl.textContent = card.icon;
        if (labelEl && card.label) labelEl.textContent = card.label;
        if (valueEl && card.value) {
          // 如果 value 是电话或邮箱链接格式，保留 a 标签
          const linkEl = valueEl.querySelector('a');
          if (linkEl) {
            linkEl.textContent = card.value;
            if (card.tel) linkEl.href = `tel:${card.tel}`;
            if (card.email) linkEl.href = `mailto:${card.email}`;
          } else {
            valueEl.textContent = card.value;
          }
        }
        if (subEl && card.sub) subEl.textContent = card.sub;
      }
    });
  }
  
  // 地图区域
  if (config.map) {
    const mapPlaceholder = document.querySelector('.map-placeholder');
    if (mapPlaceholder) {
      const iconEl = mapPlaceholder.querySelector('.map-icon');
      const addrEl = mapPlaceholder.querySelector('.map-addr');
      const hintEl = mapPlaceholder.querySelector('span:last-child');
      
      if (iconEl && config.map.icon) iconEl.textContent = config.map.icon;
      if (addrEl && config.map.address) addrEl.textContent = config.map.address;
      if (hintEl && config.map.hint) {
        // 确保不是 map-icon 或 map-addr
        if (!hintEl.classList.contains('map-icon') && !hintEl.classList.contains('map-addr')) {
          hintEl.textContent = config.map.hint;
        }
      }
    }
  }
  
  // 表单区域
  if (config.form) {
    const formSection = document.querySelector('.form-section');
    if (formSection) {
      // 表单标题
      if (config.form.title) {
        const titleEl = formSection.querySelector('.form-info h2');
        if (titleEl) titleEl.textContent = config.form.title;
      }
      
      // 表单描述
      if (config.form.description) {
        const descEl = formSection.querySelector('.form-info p');
        if (descEl) descEl.textContent = config.form.description;
      }
      
      // 优势项 (perks)
      if (config.form.perks && Array.isArray(config.form.perks)) {
        const perkItems = formSection.querySelectorAll('.form-info-item');
        config.form.perks.forEach((perk, index) => {
          if (perkItems[index]) {
            const iconEl = perkItems[index].querySelector('.fii-icon');
            const textEl = perkItems[index].querySelector('.fii-text');
            
            if (iconEl && perk.icon) iconEl.textContent = perk.icon;
            if (textEl && perk.text) {
              // 如果 text 包含换行或 strong 标签，使用 innerHTML
              if (perk.text.includes('<') || perk.text.includes('\n')) {
                textEl.innerHTML = perk.text.replace(/\n/g, '<br>');
              } else {
                textEl.textContent = perk.text;
              }
            }
            // 支持 title 和 description 分开配置
            if (perk.title || perk.description) {
              const title = perk.title || '';
              const description = perk.description || '';
              textEl.innerHTML = `<strong>${title}</strong><br>${description}`;
            }
          }
        });
      }
      
      // 表单卡片
      if (config.form.formCard) {
        const formCard = formSection.querySelector('.form-card');
        if (formCard) {
          // 卡片标题
          if (config.form.formCard.title) {
            const cardTitleEl = formCard.querySelector('.form-card-title');
            if (cardTitleEl) cardTitleEl.textContent = config.form.formCard.title;
          }
          
          // 表单字段
          if (config.form.formCard.fields) {
            const fields = config.form.formCard.fields;
            const formRows = formCard.querySelectorAll('.form-row-2');
            
            // 第一行：姓名、电话
            if (formRows[0]) {
              const nameGroup = formRows[0].querySelector('.form-group:nth-child(1)');
              const phoneGroup = formRows[0].querySelector('.form-group:nth-child(2)');
              
              if (nameGroup && fields.name) {
                const labelEl = nameGroup.querySelector('.form-label');
                const inputEl = nameGroup.querySelector('input');
                if (labelEl) {
                  labelEl.innerHTML = fields.name.label + (fields.name.required ? '<span>*</span>' : '');
                }
                if (inputEl && fields.name.placeholder) {
                  inputEl.placeholder = fields.name.placeholder;
                }
              }
              
              if (phoneGroup && fields.phone) {
                const labelEl = phoneGroup.querySelector('.form-label');
                const inputEl = phoneGroup.querySelector('input');
                if (labelEl) {
                  labelEl.innerHTML = fields.phone.label + (fields.phone.required ? '<span>*</span>' : '');
                }
                if (inputEl && fields.phone.placeholder) {
                  inputEl.placeholder = fields.phone.placeholder;
                }
              }
            }
            
            // 第二行：公司、咨询类型
            if (formRows[1]) {
              const companyGroup = formRows[1].querySelector('.form-group:nth-child(1)');
              const typeGroup = formRows[1].querySelector('.form-group:nth-child(2)');
              
              if (companyGroup && fields.company) {
                const labelEl = companyGroup.querySelector('.form-label');
                const inputEl = companyGroup.querySelector('input');
                if (labelEl) {
                  labelEl.innerHTML = fields.company.label + (fields.company.required ? '<span>*</span>' : '');
                }
                if (inputEl && fields.company.placeholder) {
                  inputEl.placeholder = fields.company.placeholder;
                }
              }
              
              if (typeGroup && fields.type) {
                const labelEl = typeGroup.querySelector('.form-label');
                const selectEl = typeGroup.querySelector('select');
                if (labelEl) {
                  labelEl.innerHTML = fields.type.label + (fields.type.required ? '<span>*</span>' : '');
                }
                if (selectEl && fields.type.options && Array.isArray(fields.type.options)) {
                  const placeholder = fields.type.placeholder || '请选择';
                  let optionsHTML = `<option value="" disabled selected>${placeholder}</option>`;
                  fields.type.options.forEach(opt => {
                    optionsHTML += `<option>${opt}</option>`;
                  });
                  selectEl.innerHTML = optionsHTML;
                }
              }
            }
            
            // 留言内容（textarea）
            if (fields.message) {
              const textareaGroup = formCard.querySelector('.form-group:has(textarea)');
              if (textareaGroup) {
                const labelEl = textareaGroup.querySelector('.form-label');
                const textareaEl = textareaGroup.querySelector('textarea');
                if (labelEl) {
                  labelEl.innerHTML = fields.message.label + (fields.message.required ? '<span>*</span>' : '');
                }
                if (textareaEl && fields.message.placeholder) {
                  textareaEl.placeholder = fields.message.placeholder;
                }
              }
            }
          }
          
          // 提交按钮
          if (config.form.formCard.submitButton) {
            const submitBtn = formCard.querySelector('.form-submit');
            if (submitBtn) submitBtn.textContent = config.form.formCard.submitButton;
          }
          
          // 隐私声明
          if (config.form.formCard.privacyText) {
            const privacyEl = formCard.querySelector('p[style*="text-align:center"]');
            if (privacyEl) {
              privacyEl.innerHTML = `🔒 ${config.form.formCard.privacyText}`;
            }
          }
        }
      }
    }
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
  
  // 分类筛选
  if (config.categories && Array.isArray(config.categories)) {
    const filterTabsEl = document.querySelector('.filter-tabs');
    if (filterTabsEl) {
      filterTabsEl.innerHTML = config.categories.map((cat, index) => {
        const isActive = index === 0 ? 'active' : '';
        return `<button class="filter-tab ${isActive}" data-category="${cat.id}">${cat.label}</button>`;
      }).join('');
    }
  }
  
  // 文件列表
  if (config.files && Array.isArray(config.files)) {
    // 按 category 分组文件
    const filesByCategory = {};
    config.files.forEach(file => {
      const cat = file.category || 'other';
      if (!filesByCategory[cat]) {
        filesByCategory[cat] = [];
      }
      filesByCategory[cat].push(file);
    });
    
    // 分类映射：配置category -> 页面section（根据实际HTML结构调整）
    const categoryMapping = {
      'manual': 'manual',
      'guide': 'manual',      // 快速指南归入产品手册
      'cert': 'cert',
      'tech': 'tech',
      'research': 'research'
    };
    
    // 分类标题映射
    const categoryTitles = {
      'manual': '产品手册',
      'cert': '合规证书 & 注册文件',
      'tech': '技术手册',
      'research': '学术研究资料',
      'guide': '使用说明书'
    };
    
    // 获取文件类型对应的图标类和标签类
    function getFileTypeClasses(category) {
      const typeMap = {
        'manual': { icon: 'dl-icon-pdf', tag: 'dl-tag-pdf', tagLabel: 'PDF' },
        'cert': { icon: 'dl-icon-pdf', tag: 'dl-tag-pdf', tagLabel: 'PDF' },
        'tech': { icon: 'dl-icon-word', tag: 'dl-tag-word', tagLabel: 'DOC' },
        'research': { icon: 'dl-icon-pdf', tag: 'dl-tag-pdf', tagLabel: 'PDF' },
        'guide': { icon: 'dl-icon-word', tag: 'dl-tag-word', tagLabel: 'DOC' }
      };
      return typeMap[category] || { icon: 'dl-icon-pdf', tag: 'dl-tag-pdf', tagLabel: 'PDF' };
    }
    
    // 获取文件类型对应的SVG图标
    function getFileIcon(category) {
      const iconMap = {
        'manual': '<svg viewBox="0 0 24 24" fill="#e11d48"><path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20M10.92,12.31C10.68,11.54 10.15,9.08 11.55,9.08C12.95,9.08 12.34,11.55 12.1,12.31C12.41,13.28 12.95,14 13.54,14C14.69,14 15,12.58 15,12.58C15.21,12.75 15.38,13 15.37,13.15C15.37,13.15 14.89,15 13.54,15C12.66,15 12,14.58 11.5,13.89C11.05,14.04 10.5,14.15 9.97,14.15C8.53,14.15 8,13.46 8,12.65C8,11.65 9.12,11.21 10.06,11.2L10.5,11.2C10.65,11.68 10.79,12.04 10.92,12.31M9.56,12.88C9.56,12.88 9.51,13.46 9.97,13.46C10.37,13.46 10.67,13.35 10.95,13.19C10.71,12.67 10.5,12.07 10.35,11.5L10.06,11.5C9.64,11.5 9.56,12.18 9.56,12.88Z"/></svg>',
        'cert': '<svg viewBox="0 0 24 24" fill="#e11d48"><path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20M10.92,12.31C10.68,11.54 10.15,9.08 11.55,9.08C12.95,9.08 12.34,11.55 12.1,12.31C12.41,13.28 12.95,14 13.54,14C14.69,14 15,12.58 15,12.58C15.21,12.75 15.38,13 15.37,13.15C15.37,13.15 14.89,15 13.54,15C12.66,15 12,14.58 11.5,13.89C11.05,14.04 10.5,14.15 9.97,14.15C8.53,14.15 8,13.46 8,12.65C8,11.65 9.12,11.21 10.06,11.2L10.5,11.2C10.65,11.68 10.79,12.04 10.92,12.31M9.56,12.88C9.56,12.88 9.51,13.46 9.97,13.46C10.37,13.46 10.67,13.35 10.95,13.19C10.71,12.67 10.5,12.07 10.35,11.5L10.06,11.5C9.64,11.5 9.56,12.18 9.56,12.88Z"/></svg>',
        'tech': '<svg viewBox="0 0 24 24" fill="#1d4ed8"><path d="M21,17A2,2 0 0,1 19,19H5A2,2 0 0,1 3,17V7A2,2 0 0,1 5,5H10L12,7H19A2,2 0 0,1 21,9V17M5,7V17H19V9H11.17L9.17,7H5Z"/></svg>',
        'research': '<svg viewBox="0 0 24 24" fill="#e11d48"><path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20M10.92,12.31C10.68,11.54 10.15,9.08 11.55,9.08C12.95,9.08 12.34,11.55 12.1,12.31C12.41,13.28 12.95,14 13.54,14C14.69,14 15,12.58 15,12.58C15.21,12.75 15.38,13 15.37,13.15C15.37,13.15 14.89,15 13.54,15C12.66,15 12,14.58 11.5,13.89C11.05,14.04 10.5,14.15 9.97,14.15C8.53,14.15 8,13.46 8,12.65C8,11.65 9.12,11.21 10.06,11.2L10.5,11.2C10.65,11.68 10.79,12.04 10.92,12.31M9.56,12.88C9.56,12.88 9.51,13.46 9.97,13.46C10.37,13.46 10.67,13.35 10.95,13.19C10.71,12.67 10.5,12.07 10.35,11.5L10.06,11.5C9.64,11.5 9.56,12.18 9.56,12.88Z"/></svg>',
        'guide': '<svg viewBox="0 0 24 24" fill="#1d4ed8"><path d="M21,17A2,2 0 0,1 19,19H5A2,2 0 0,1 3,17V7A2,2 0 0,1 5,5H10L12,7H19A2,2 0 0,1 21,9V17M5,7V17H19V9H11.17L9.17,7H5Z"/></svg>'
      };
      return iconMap[category] || iconMap['manual'];
    }
    
    // 下载按钮SVG
    const downloadSvg = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>';
    
    // 生成文件卡片HTML
    function generateFileCard(file) {
      const typeClasses = getFileTypeClasses(file.category);
      const iconSvg = getFileIcon(file.category);
      const fileIcon = file.icon || '📄';
      const description = file.description || `${file.name}相关资料文档`;
      const downloads = file.downloads || Math.floor(Math.random() * 1000) + 100;
      const dateLabel = file.date ? `更新：${file.date}` : '';
      const btnClass = file.requireAuth ? 'dl-btn dl-btn-secondary' : 'dl-btn';
      const btnText = file.requireAuth ? '申请下载' : '下载';
      
      return `
        <div class="dl-card" data-category="${file.category}">
          <div class="dl-card-top">
            <div class="dl-icon ${typeClasses.icon}">
              ${iconSvg}
            </div>
            <div class="dl-info">
              <div class="dl-name">${file.name}</div>
              <div class="dl-desc">${description}</div>
            </div>
          </div>
          <div class="dl-card-meta">
            <div class="dl-tags"><span class="dl-tag ${typeClasses.tag}">${typeClasses.tagLabel}</span></div>
            <span class="dl-size">${file.size || '未知大小'}</span>
          </div>
          <div class="dl-card-footer">
            <span class="dl-date">${dateLabel}</span>
            <span class="dl-downloads">${downloads} 次下载</span>
            <a href="${file.fileUrl || '#'}" class="${btnClass}" download>
              ${downloadSvg}
              ${btnText}
            </a>
          </div>
        </div>
      `;
    }
    
    // 重新组织main-wrap内容：按分类渲染section
    const mainWrap = document.querySelector('.main-wrap');
    if (mainWrap) {
      // 保留notice-box和search-filter-bar
      const noticeBox = mainWrap.querySelector('.notice-box');
      const searchFilterBar = mainWrap.querySelector('.search-filter-bar');
      const applySection = mainWrap.querySelector('.apply-section');
      
      // 构建新的内容HTML
      let contentHTML = '';
      
      // 添加notice-box
      if (noticeBox) {
        contentHTML += noticeBox.outerHTML;
      }
      
      // 添加search-filter-bar
      if (searchFilterBar) {
        contentHTML += searchFilterBar.outerHTML;
      }
      
      // 按分类顺序渲染（manual, guide, cert, tech, research）
      const categoryOrder = ['manual', 'guide', 'cert', 'tech', 'research'];
      
      categoryOrder.forEach(catKey => {
        const files = filesByCategory[catKey];
        if (files && files.length > 0) {
          const title = categoryTitles[catKey] || '其他资料';
          const cardsHTML = files.map(file => generateFileCard(file)).join('');
          
          contentHTML += `
            <div class="section-title">
              <div class="section-bar"></div>
              <h2>${title}</h2>
              <span class="section-count">（共 ${files.length} 份）</span>
            </div>
            <div class="dl-grid" data-category="${catKey}">
              ${cardsHTML}
            </div>
          `;
        }
      });
      
      // 添加apply-section
      if (applySection) {
        contentHTML += applySection.outerHTML;
      }
      
      // 更新main-wrap内容
      mainWrap.innerHTML = contentHTML;
    }
  }
  
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
  
  // 1. 筛选标签 (filters)
  if (config.filters && Array.isArray(config.filters)) {
    const filterBar = document.querySelector('.filter-bar');
    if (filterBar) {
      filterBar.innerHTML = config.filters.map((filter, index) => {
        const isActive = index === 0 ? 'active' : '';
        return `<button class="filter-btn ${isActive}" data-cat="${filter.id}">${filter.label}</button>`;
      }).join('');
      
      // 重新绑定筛选按钮点击事件
      document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
        });
      });
    }
  }
  
  // 2. 新闻列表 (articles)
  if (config.articles && Array.isArray(config.articles)) {
    const newsList = document.querySelector('.news-list');
    if (newsList) {
      // 获取分类标签样式类名
      const getTagClass = (category) => {
        const tagClasses = {
          'company': 'tag-company',
          'product': 'tag-product',
          'research': 'tag-research',
          'industry': 'tag-industry',
          'award': 'tag-award'
        };
        return tagClasses[category] || 'tag-company';
      };
      
      newsList.innerHTML = config.articles.map(article => {
        const tagClass = getTagClass(article.category);
        // featured 为 true 的文章可以添加特殊样式（如果需要）
        const featuredAttr = article.featured ? ' data-featured="true"' : '';
        
        return `
          <div class="news-item"${featuredAttr}>
            <div class="date-block">
              <div class="date-day">${article.day || ''}</div>
              <div class="date-my">${article.monthYear || ''}</div>
            </div>
            <div class="news-body">
              <div class="news-meta"><span class="news-tag ${tagClass}">${article.categoryLabel || ''}</span></div>
              <h3>${article.title || ''}</h3>
              <p>${article.summary || ''}</p>
              <a href="case-detail.html?id=${article.id}" class="read-more">阅读全文 <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg></a>
            </div>
          </div>
        `;
      }).join('');
    }
  }
  
  // 3. 热门资讯 (hotArticles)
  if (config.hotArticles && Array.isArray(config.hotArticles)) {
    const hotList = document.querySelector('.hot-list');
    if (hotList) {
      hotList.innerHTML = config.hotArticles.map((article, index) => {
        return `
          <div class="hot-item" onclick="window.location.href='case-detail.html?id=${article.id}'">
            <span class="hot-num">${index + 1}</span>
            <span class="hot-title">${article.title || ''}</span>
          </div>
        `;
      }).join('');
    }
  }
  
  // 4. 分类统计 (categoryStats)
  if (config.categoryStats && Array.isArray(config.categoryStats)) {
    const catList = document.querySelector('.cat-list');
    if (catList) {
      // 分类颜色映射
      const catColors = {
        'company': '',  // 默认蓝色
        'product': '#b45309',
        'research': '#4338ca',
        'industry': '#be185d',
        'award': '#15803d'
      };
      
      catList.innerHTML = config.categoryStats.map(cat => {
        const dotStyle = catColors[cat.id] ? ` style="background:${catColors[cat.id]}"` : '';
        return `
          <div class="cat-item">
            <div class="cat-left"><div class="cat-dot"${dotStyle}></div><span>${cat.label || ''}</span></div>
            <span class="cat-count">${cat.count || 0}</span>
          </div>
        `;
      }).join('');
    }
  }
  
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
