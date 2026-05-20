/**
 * 收藏夹 & 高亮管理
 *
 * 收藏：选中文本后添加至收藏夹，可从收藏夹跳转回原文位置。
 * 高亮：选中文本后高亮标记，持久化存储。
 */

(function(global) {
  'use strict';

  const FAV_KEY = 'favorites';
  const HIGHLIGHT_KEY = 'highlights';

  /**
   * 收藏条目结构：
   * { id, text, charId, chapterId, sectionId, offset, createdAt }
   *
   * 高亮条目结构：
   * { id, text, charId, chapterId, sectionId, startOffset, endOffset, createdAt }
   */

  let favorites = Storage.get(FAV_KEY, []);
  let highlights = Storage.get(HIGHLIGHT_KEY, []);

  function uid() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
  }

  const Favorites = {
    /** 添加收藏 */
    add(text, charId, chapterId, sectionId, offset) {
      if (!text || text.length > AppConfig.favoriteMaxLength) {
        text = (text || '').slice(0, AppConfig.favoriteMaxLength);
      }
      // 去重
      const dup = favorites.find(f => f.text === text && f.charId === charId && f.chapterId === chapterId);
      if (dup) {
        Debug.info('Duplicate favorite ignored');
        return null;
      }
      const item = {
        id: uid(),
        text,
        charId,
        chapterId,
        sectionId,
        offset,
        createdAt: new Date().toISOString()
      };
      favorites.unshift(item);
      Storage.set(FAV_KEY, favorites);
      Debug.info('Favorite added', { id: item.id, len: text.length });
      return item;
    },

    /** 删除收藏 */
    remove(id) {
      const idx = favorites.findIndex(f => f.id === id);
      if (idx >= 0) {
        favorites.splice(idx, 1);
        Storage.set(FAV_KEY, favorites);
      }
    },

    /** 获取所有收藏 */
    getAll() { return favorites.slice(); },

    /** 按角色过滤 */
    getByCharacter(charId) {
      return favorites.filter(f => f.charId === charId);
    },

    /** 搜索收藏 */
    search(query) {
      const q = String(query).toLowerCase();
      return favorites.filter(f => f.text.toLowerCase().includes(q));
    },

    // === 高亮 ===

    /** 添加高亮 */
    addHighlight(text, charId, chapterId, sectionId, startOffset, endOffset) {
      const item = {
        id: uid(),
        text,
        charId,
        chapterId,
        sectionId,
        startOffset,
        endOffset,
        createdAt: new Date().toISOString()
      };
      highlights.push(item);
      Storage.set(HIGHLIGHT_KEY, highlights);
      Debug.info('Highlight added', { id: item.id });
      return item;
    },

    /** 移除高亮 */
    removeHighlight(id) {
      const idx = highlights.findIndex(h => h.id === id);
      if (idx >= 0) {
        highlights.splice(idx, 1);
        Storage.set(HIGHLIGHT_KEY, highlights);
      }
    },

    /** 获取当前章节的高亮 */
    getHighlights(charId, chapterId) {
      return highlights.filter(h => h.charId === charId && h.chapterId === chapterId);
    },

    /** 获取所有高亮 */
    getAllHighlights() { return highlights.slice(); },

    /** 清除某章节高亮 */
    clearHighlights(charId, chapterId) {
      highlights = highlights.filter(h => !(h.charId === charId && h.chapterId === chapterId));
      Storage.set(HIGHLIGHT_KEY, highlights);
    },

    /** 导出 */
    exportAll() { return { favorites: favorites.slice(), highlights: highlights.slice() }; }
  };

  global.Favorites = Favorites;
  Debug.info('Favorites module initialized', { favs: favorites.length, highlights: highlights.length });
})(window);
