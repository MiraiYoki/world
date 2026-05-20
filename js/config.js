/**
 * 全局配置
 *
 * 所有可调参数集中管理，便于调试和修改。
 * 复用此框架时，只需修改此文件中的配置项。
 */

(function(global) {
  'use strict';

  global.AppConfig = {
    /** ========== 项目基本信息 ========== */
    /** 应用名称（显示在标题栏、首页等处） */
    name: '致新世界',

    /** 英文名称/副标题 */
    subtitle: 'TO NEW WORLD',

    /** 品牌标语（首页显示） */
    tagline: '当最后一颗星辰坠落，我们将在废墟中，找到通往新世界的路。',

    /** 版本号 */
    version: '1.0.0',

    /** ========== 特殊内容设置 ========== */
    /** 特殊章节解锁码 */
    specialCode: '0000',

    /** ========== 界面设置 ========== */
    /** 默认主题：default | white | dawn | green | yellow | celestial | wasteland */
    defaultTheme: 'default',

    /** 默认字体大小：small | medium | large | xlarge */
    defaultFontSize: 'medium',

    /** ========== 功能设置 ========== */
    /** 章节阅读完成阈值：滚动到距底部多少px以内算读完 */
    readThreshold: 200,

    /** Toast 显示时长(ms) */
    toastDuration: 2000,

    /** 收藏文本最大字符数 */
    favoriteMaxLength: 300,

    /** 搜索结果显示上限 */
    searchMaxResults: 50,

    /** ========== 技术设置 ========== */
    /** 数据路径前缀 */
    dataPath: 'data/',

    /** 调试模式（通过 URL 参数 ?debug=1 开启） */
    debug: /[?&]debug=1/.test(location.search)
  };

  Debug.info('Config initialized', AppConfig);
})(window);
