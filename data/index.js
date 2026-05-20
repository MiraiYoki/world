/**
 * 剧本内容注册表
 *
 * 所有剧本内容通过此文件注册到全局 SCRIPT_DATA 对象。
 * 结构：SCRIPT_DATA[角色ID][章节ID] = { title, sections[], tasks[] }
 *
 * 查找内容：按 data/scripts/<charId>/<chapterId>.js 路径
 * 修改内容：直接编辑对应 chapter 文件
 * 新增章节：创建新文件 + 在此注册
 *
 * 重要：此文件后面的 <script> 标签会依次加载各章节内容。
 */

var SCRIPT_DATA = {};
