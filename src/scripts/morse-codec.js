/**
 * 摩斯密碼編解碼核心模組
 * 提供摩斯密碼轉換和驗證功能
 */

import { MORSE_CODE_TABLE, REVERSE_MORSE_TABLE, DOT_SYMBOL, DASH_SYMBOL } from './constants.js';

/**
 * 將摩斯密碼序列轉換為對應字符
 * @param {string} sequence - 摩斯序列 (如 ".-" 或 ".·—")
 * @returns {string|null} - 轉換後的字符，或 null 如果無效
 */
export function morseToCharacter(sequence) {
  if (!sequence) return null;
  
  // 標準化序列：將視覺符號轉換為標準符號
  const normalized = sequence
    .replace(/·/g, '.')
    .replace(/—/g, '-')
    .trim();
  
  return REVERSE_MORSE_TABLE[normalized] || null;
}

/**
 * 將字符轉換為摩斯密碼序列（標準符號）
 * @param {string} char - 單個字符
 * @returns {string|null} - 摩斯序列 (如 ".-") 或 null 如果無效
 */
export function characterToMorse(char) {
  if (!char || char.length !== 1) return null;
  
  const upperChar = char.toUpperCase();
  return MORSE_CODE_TABLE[upperChar] || null;
}

/**
 * 驗證摩斯密碼序列是否有效
 * @param {string} sequence - 摩斯序列 (如 ".-" 或 ".·—")
 * @returns {boolean} - 序列是否有效
 */
export function isValidMorse(sequence) {
  return morseToCharacter(sequence) !== null;
}

/**
 * 將視覺摩斯符號轉換為標準符號
 * @param {string} visualSequence - 視覺序列 (如 "·—")
 * @returns {string} - 標準序列 (如 ".-")
 */
export function visualToStandard(visualSequence) {
  return visualSequence
    .replace(/·/g, '.')
    .replace(/—/g, '-');
}

/**
 * 將標準摩斯符號轉換為視覺符號
 * @param {string} standardSequence - 標準序列 (如 ".-")
 * @returns {string} - 視覺序列 (如 "·—")
 */
export function standardToVisual(standardSequence) {
  return standardSequence
    .replace(/\./g, DOT_SYMBOL)
    .replace(/-/g, DASH_SYMBOL);
}

/**
 * 解碼完整摩斯密碼訊息
 * @param {string} message - 摩斯訊息，字符以空格分隔，單詞以三個空格分隔
 * @returns {string} - 解碼後的文字
 */
export function decodeMorseMessage(message) {
  if (!message) return '';
  
  // 處理單詞分隔
  const words = message.split('   ');
  
  return words.map(word => {
    // 處理字符分隔
    const characters = word.split(' ');
    return characters
      .map(char => morseToCharacter(char) || '?')
      .join('');
  }).join(' ');
}

/**
 * 編碼文字訊息為摩斯密碼
 * @param {string} message - 文字訊息
 * @returns {string} - 摩斯編碼訊息
 */
export function encodeMorseMessage(message) {
  if (!message) return '';
  
  return message
    .split(' ')
    .map(word => {
      return word
        .split('')
        .map(char => characterToMorse(char) || '?')
        .join(' ');
    })
    .join('   ');
}

/**
 * 獲取所有支援的字符集
 * @returns {string} - 所有支援的字符 (字母、數字、標點)
 */
export function getSupportedCharacters() {
  return Object.keys(MORSE_CODE_TABLE).sort();
}

/**
 * 取得摩斯密碼對照表（用於顯示幫助）
 * @returns {object} - 摩斯密碼表
 */
export function getMorseTable() {
  return { ...MORSE_CODE_TABLE };
}
