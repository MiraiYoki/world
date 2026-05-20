/**
 * 用户设置管理
 *
 * 管理主题、字体大小等用户偏好，同步到 DOM 和 localStorage。
 */

(function(global) {
  'use strict';

  const STORE_KEY = 'settings';

  const defaults = {
    theme: AppConfig.defaultTheme,
    fontSize: AppConfig.defaultFontSize
  };

  let current = { ...defaults, ...Storage.get(STORE_KEY, {}) };

  function apply() {
    document.documentElement.setAttribute('data-theme', current.theme);
    document.documentElement.setAttribute('data-font', current.fontSize);
    document.documentElement.style.fontSize = '';
    Storage.set(STORE_KEY, current);
    Debug.info('Settings applied', current);
  }

  const Settings = {
    get theme() { return current.theme; },
    set theme(v) {
      current.theme = v;
      apply();
    },

    get fontSize() { return current.fontSize; },
    set fontSize(v) {
      current.fontSize = v;
      apply();
    },

    /** 获取所有设置 */
    getAll() { return { ...current }; },

    /** 重置为默认值 */
    reset() {
      current = { ...defaults };
      apply();
    },

    /** 初始化：同步到DOM */
    init() {
      apply();
      Debug.info('Settings module ready');
    }
  };

  global.Settings = Settings;
})(window);
