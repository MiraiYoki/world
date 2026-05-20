/**
 * 全文搜索
 *
 * 在所有已加载的剧本内容中搜索关键词，返回匹配结果。
 */

(function(global) {
  'use strict';

  /**
   * 搜索结果结构：
   * { charId, chapterId, sectionId, text, matchPos, context }
   */

  const Search = {
    /**
     * 在剧本数据中搜索
     * @param {string} query - 搜索关键词
     * @param {object} scriptData - 剧本数据（SCRIPT_DATA）
     * @param {object} opts - { maxResults, charFilter, chapterFilter }
     */
    execute(query, scriptData, opts = {}) {
      if (!query || !scriptData) return [];

      const q = String(query).toLowerCase();
      const max = opts.maxResults || AppConfig.searchMaxResults;
      const results = [];
      const chars = opts.charFilter
        ? [opts.charFilter].flat().filter(c => scriptData[c])
        : Object.keys(scriptData);

      for (const charId of chars) {
        if (results.length >= max) break;
        const charData = scriptData[charId];
        if (!charData) continue;

        const chapters = opts.chapterFilter
          ? [opts.chapterFilter].flat().filter(ch => charData[ch])
          : Object.keys(charData);

        for (const chapterId of chapters) {
          if (results.length >= max) break;
          const chapter = charData[chapterId];
          if (!chapter || !chapter.sections) continue;

          for (const section of chapter.sections) {
            if (results.length >= max) break;
            const text = section.content || '';
            const lower = text.toLowerCase();
            let pos = 0;

            while ((pos = lower.indexOf(q, pos)) >= 0 && results.length < max) {
              const start = Math.max(0, pos - 20);
              const end = Math.min(text.length, pos + q.length + 30);
              results.push({
                charId,
                chapterId,
                chapterTitle: chapter.title || '',
                sectionId: section.id,
                speaker: section.speaker || '',
                type: section.type,
                matchPos: pos,
                context: (start > 0 ? '...' : '') + text.slice(start, end) + (end < text.length ? '...' : ''),
                highlightStart: pos - start + (start > 0 ? 3 : 0)
              });
              pos++;
            }
          }
        }
      }

      Debug.info('Search executed', { query, results: results.length });
      return results;
    },

    /**
     * 在收藏夹中搜索
     */
    searchFavorites(query) {
      return Favorites.search(query);
    }
  };

  global.Search = Search;
  Debug.info('Search module initialized');
})(window);
