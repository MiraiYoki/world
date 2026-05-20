/**
 * 任务系统
 *
 * 每个章节有若干任务，阅读完正文后自动解锁。
 * 任务状态持久化到 localStorage。
 */

(function(global) {
  'use strict';

  const TASK_STATE_KEY = 'task_states';

  /**
   * 任务状态结构（按 charId + chapterId 存储）：
   * { 'charId|chapterId': { taskId: 'locked'|'unlocked'|'done' } }
   */
  let taskStates = Storage.get(TASK_STATE_KEY, {});

  function stateKey(charId, chapterId) {
    return charId + '|' + chapterId;
  }

  const Tasks = {
    STATUS: { LOCKED: 'locked', UNLOCKED: 'unlocked', DONE: 'done' },

    /** 初始化章节任务状态 */
    initChapter(charId, chapterId, taskIds) {
      const key = stateKey(charId, chapterId);
      if (!taskStates[key]) {
        taskStates[key] = {};
        taskIds.forEach(id => {
          taskStates[key][id] = 'unlocked'; // 默认解锁
        });
        Storage.set(TASK_STATE_KEY, taskStates);
      }
    },

    /** 解锁章节所有任务（阅读完成时调用） */
    unlockChapter(charId, chapterId) {
      const key = stateKey(charId, chapterId);
      if (!taskStates[key]) return;
      let changed = false;
      Object.keys(taskStates[key]).forEach(taskId => {
        if (taskStates[key][taskId] === 'locked') {
          taskStates[key][taskId] = 'unlocked';
          changed = true;
        }
      });
      if (changed) {
        Storage.set(TASK_STATE_KEY, taskStates);
        Debug.info('Tasks unlocked', { charId, chapterId });
      }
    },

    /** 标记任务完成 */
    markDone(charId, chapterId, taskId) {
      const key = stateKey(charId, chapterId);
      if (!taskStates[key]) return;
      taskStates[key][taskId] = 'done';
      Storage.set(TASK_STATE_KEY, taskStates);
      Debug.info('Task marked done', { charId, chapterId, taskId });
    },

    /** 获取章节任务状态 */
    getStates(charId, chapterId) {
      const key = stateKey(charId, chapterId);
      return taskStates[key] || {};
    },

    /** 章节是否全部完成 */
    isChapterDone(charId, chapterId) {
      const states = this.getStates(charId, chapterId);
      const ids = Object.keys(states);
      return ids.length > 0 && ids.every(id => states[id] === 'done');
    },

    /** 是否已解锁 */
    isUnlocked(charId, chapterId) {
      const states = this.getStates(charId, chapterId);
      const ids = Object.keys(states);
      return ids.length > 0 && ids.every(id => states[id] !== 'locked');
    },

    /** 重置全部 */
    resetAll() {
      taskStates = {};
      Storage.remove(TASK_STATE_KEY);
      Debug.info('All tasks reset');
    }
  };

  global.Tasks = Tasks;
  Debug.info('Tasks module initialized');
})(window);
