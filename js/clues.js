/**
 * 搜证 & 线索系统
 *
 * 管理线索的收集状态和查看。
 */

(function(global) {
  'use strict';

  const COLLECTED_KEY = 'collected_clues';

  let collected = Storage.get(COLLECTED_KEY, []);

  const Clues = {
    /** 搜集线索 */
    collect(clueId) {
      if (collected.includes(clueId)) {
        Debug.info('Clue already collected', { clueId });
        return false;
      }
      collected.push(clueId);
      Storage.set(COLLECTED_KEY, collected);
      Debug.info('Clue collected', { clueId, total: collected.length });
      return true;
    },

    /** 是否已搜集 */
    isCollected(clueId) {
      return collected.includes(clueId);
    },

    /** 获取所有已搜集线索ID */
    getCollected() {
      return collected.slice();
    },

    /** 获取已搜集线索详情 */
    getCollectedDetails(clueData) {
      if (!clueData) return [];
      return collected
        .map(id => {
          const clue = Object.values(clueData).find(c => c.id === id);
          return clue || null;
        })
        .filter(Boolean);
    },

    /** 重置所有线索 */
    reset() {
      collected = [];
      Storage.remove(COLLECTED_KEY);
      Debug.info('All clues reset');
    },

    /** 是否有新线索（用于提示） */
    get count() { return collected.length; }
  };

  global.Clues = Clues;
  Debug.info('Clues module initialized', { collected: collected.length });
})(window);
