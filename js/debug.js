/**
 * 调试日志系统
 *
 * 使用方式：
 *   Debug.log('message', data)     - 普通日志
 *   Debug.warn('message', data)    - 警告
 *   Debug.error('message', data)   - 错误
 *   Debug.info('message', data)    - 信息
 *
 * 所有日志存储在 localStorage 中，可在调试面板查看。
 * 行内调试：在URL后加 ?debug=1 开启调试面板显示。
 * 控制台同步：默认开启，可通过 Debug.syncConsole(false) 关闭。
 */

(function(global) {
  'use strict';

  const STORAGE_KEY = '_px_debug_logs';
  const MAX_ENTRIES = 500;
  const LEVELS = { DEBUG: 0, INFO: 1, WARN: 2, ERROR: 3 };

  let entries = [];
  let syncConsole = true;
  let showPanel = false;

  // 从 localStorage 恢复
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) entries = JSON.parse(saved);
  } catch (e) { /* ignore */ }

  // 检查 URL 参数
  if (/[?&]debug=1/.test(location.search)) {
    showPanel = true;
  }

  function save() {
    if (entries.length > MAX_ENTRIES) {
      entries = entries.slice(-MAX_ENTRIES);
    }
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
    } catch (e) { /* quota exceeded, ignore */ }
  }

  function add(level, message, data) {
    const entry = {
      ts: new Date().toISOString(),
      level: level,
      msg: String(message),
      data: data !== undefined ? JSON.parse(JSON.stringify(data)) : undefined
    };
    entries.push(entry);
    save();

    if (syncConsole) {
      const fn = level === 'ERROR' ? console.error
        : level === 'WARN' ? console.warn
        : console.log;
      fn(`[PX:${level}] ${message}`, data || '');
    }

    // 实时更新调试面板
    updatePanelUI();
  }

  function updatePanelUI() {
    const body = document.getElementById('debug-log-body');
    if (!body) return;
    const recent = entries.slice(-100);
    body.innerHTML = recent.map(e => {
      const cls = e.level === 'ERROR' ? 'error' : e.level === 'WARN' ? 'warn' : '';
      return `<div class="debug-entry ${cls}">`
        + `<span class="ts">${e.ts.slice(11, 19)}</span> `
        + `[${e.level}] ${e.msg}`
        + (e.data ? ` <span style="color:#aaa">${JSON.stringify(e.data).slice(0, 100)}</span>` : '')
        + `</div>`;
    }).join('');
    body.scrollTop = body.scrollHeight;
  }

  const Debug = {
    log(msg, data)   { add('DEBUG', msg, data); },
    info(msg, data)  { add('INFO', msg, data); },
    warn(msg, data)  { add('WARN', msg, data); },
    error(msg, data) { add('ERROR', msg, data); },

    /** 获取所有日志 */
    getAll() { return entries.slice(); },

    /** 按级别过滤 */
    getByLevel(level) { return entries.filter(e => e.level === level); },

    /** 搜索日志 */
    search(query) {
      const q = String(query).toLowerCase();
      return entries.filter(e => e.msg.toLowerCase().includes(q));
    },

    /** 清除日志 */
    clear() {
      entries = [];
      try { localStorage.removeItem(STORAGE_KEY); } catch (e) {}
      updatePanelUI();
    },

    /** 导出日志为文本 */
    exportText() {
      return entries.map(e =>
        `[${e.ts}] [${e.level}] ${e.msg}` +
        (e.data ? ' ' + JSON.stringify(e.data) : '')
      ).join('\n');
    },

    /** 开启/关闭控制台同步 */
    syncConsole(v) { syncConsole = !!v; },

    /** 日志条数 */
    get count() { return entries.length; },

    /** 是否显示调试面板 */
    get panelVisible() { return showPanel; },
    set panelVisible(v) {
      showPanel = !!v;
      const panel = document.getElementById('debug-panel');
      const trigger = document.getElementById('debug-trigger');
      if (panel) panel.classList.toggle('visible', showPanel);
      if (trigger) trigger.style.display = showPanel ? 'block' : 'none';
      if (showPanel) updatePanelUI();
    }
  };

  global.Debug = Debug;

  // 调试面板仅在 URL 参数 ?debug=1 时显示
  if (showPanel) {
    document.addEventListener('DOMContentLoaded', () => {
      if (!document.getElementById('debug-panel')) {
        const panel = document.createElement('div');
        panel.id = 'debug-panel';
        panel.className = 'debug-panel visible';
        panel.innerHTML = `
          <div class="debug-header">
            <span>调试日志</span>
            <small id="debug-count">${entries.length}条</small>
          </div>
          <div class="debug-body" id="debug-log-body"></div>
          <div class="debug-actions">
            <button onclick="Debug.clear()">清除</button>
            <button onclick="Debug.panelVisible=false">关闭</button>
            <button onclick="navigator.clipboard.writeText(Debug.exportText())">复制</button>
          </div>`;
        document.body.appendChild(panel);

        const trigger = document.createElement('button');
        trigger.id = 'debug-trigger';
        trigger.className = 'debug-trigger';
        trigger.style.display = 'block';
        trigger.textContent = 'DBG';
        trigger.onclick = () => { Debug.panelVisible = !Debug.panelVisible; };
        document.body.appendChild(trigger);
      }
      updatePanelUI();
    });
  }

})(window);
