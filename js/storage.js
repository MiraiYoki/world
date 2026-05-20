/**
 * localStorage 封装
 *
 * 所有用户数据（设置、收藏、高亮、阅读进度、线索、任务状态）
 * 统一通过此模块存取，便于调试和迁移。
 *
 * 键名前缀 _px_ 避免冲突。
 */

(function(global) {
  'use strict';

  const PREFIX = '_px_';

  const Storage = {
    /** 读取 */
    get(key, fallback) {
      try {
        const raw = localStorage.getItem(PREFIX + key);
        if (raw === null) return fallback !== undefined ? fallback : null;
        return JSON.parse(raw);
      } catch (e) {
        Debug.warn('Storage.get failed', { key, error: e.message });
        return fallback !== undefined ? fallback : null;
      }
    },

    /** 写入 */
    set(key, value) {
      try {
        localStorage.setItem(PREFIX + key, JSON.stringify(value));
        return true;
      } catch (e) {
        Debug.error('Storage.set failed', { key, error: e.message });
        return false;
      }
    },

    /** 删除 */
    remove(key) {
      try {
        localStorage.removeItem(PREFIX + key);
      } catch (e) {
        Debug.error('Storage.remove failed', { key, error: e.message });
      }
    },

    /** 是否存在 */
    has(key) {
      return localStorage.getItem(PREFIX + key) !== null;
    },

    /** 获取所有本应用键名 */
    keys() {
      const result = [];
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (k && k.startsWith(PREFIX)) result.push(k.slice(PREFIX.length));
      }
      return result;
    },

    /** 导出所有数据 */
    exportAll() {
      const data = {};
      this.keys().forEach(k => {
        data[k] = this.get(k);
      });
      return data;
    },

    /** 清除所有应用数据 */
    clearAll() {
      this.keys().forEach(k => this.remove(k));
    },

    /** 占用空间估算（字节） */
    usage() {
      let bytes = 0;
      this.keys().forEach(k => {
        bytes += (PREFIX + k).length * 2;
        const raw = localStorage.getItem(PREFIX + k);
        if (raw) bytes += raw.length * 2;
      });
      return bytes;
    }
  };

  global.Storage = Storage;
  Debug.info('Storage module initialized');
})(window);
