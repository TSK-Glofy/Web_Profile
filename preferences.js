// 内容在 index.html 的 data-zh / data-en 中填写，这里只处理切换。
(() => {
  const root = document.documentElement;
  const read = key => { try { return localStorage.getItem(key); } catch { return null; } };
  const save = (key, value) => { try { localStorage.setItem(key, value); } catch { /* 禁用存储时仍可切换。 */ } };
  let language = read('homepage-language') === 'zh' ? 'zh' : 'en';
  let theme = read('homepage-theme') === 'dark' ? 'dark' : 'light';
  // 在加载样式前应用主题，减少刷新时的白色闪烁。
  root.dataset.theme = theme;
  root.lang = language === 'zh' ? 'zh-CN' : 'en';

  document.addEventListener('DOMContentLoaded', () => {
    const languageButton = document.getElementById('language-toggle');
    const themeButton = document.getElementById('theme-toggle');
    const iconShape = document.getElementById('theme-icon-shape');
    const labels = { zh: { light: '白天', dark: '夜晚' }, en: { light: 'Light', dark: 'Dark' } };
    // 静态 SVG 图形，不依赖外部图标库。
    const icons = {
      light: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42"/>',
      dark: '<path d="M20.9 13.1A9 9 0 0 1 10.9 3.1 9 9 0 1 0 20.9 13.1Z"/>'
    };

    function renderButtons() {
      languageButton.textContent = language === 'zh' ? 'En' : '中';
      languageButton.lang = language === 'zh' ? 'en' : 'zh-CN';
      languageButton.setAttribute('aria-label', language === 'zh' ? 'Switch to English' : '切换为中文');
      languageButton.title = languageButton.getAttribute('aria-label');
      const nextMode = theme === 'light' ? 'dark' : 'light';
      iconShape.innerHTML = icons[theme];
      themeButton.dataset.mode = theme;
      const currentName = labels[language][theme];
      const nextName = labels[language][nextMode];
      themeButton.title = language === 'zh'
        ? `主题：${currentName}；点击切换为${nextName}`
        : `Theme: ${currentName}; switch to ${nextName}`;
      themeButton.setAttribute('aria-label', themeButton.title);
    }

    function renderLanguage() {
      root.lang = language === 'zh' ? 'zh-CN' : 'en';
      document.querySelectorAll('[data-zh][data-en]').forEach(element => {
        element.textContent = element.getAttribute(`data-${language}`);
      });
      for (const [suffix, attribute] of [['alt', 'alt'], ['aria', 'aria-label'], ['content', 'content'], ['href', 'href']]) {
        document.querySelectorAll(`[data-zh-${suffix}][data-en-${suffix}]`).forEach(element => {
          element.setAttribute(attribute, element.getAttribute(`data-${language}-${suffix}`));
        });
      }
      renderButtons();
    }

    languageButton.addEventListener('click', () => {
      language = language === 'zh' ? 'en' : 'zh';
      save('homepage-language', language);
      renderLanguage();
    });
    themeButton.addEventListener('click', () => {
      theme = theme === 'light' ? 'dark' : 'light';
      root.dataset.theme = theme;
      save('homepage-theme', theme);
      renderButtons();
    });
    renderLanguage();
    document.querySelector('.preferences').hidden = false;
  });
})();
