/**
 * 摩斯密碼應用程式 - UI 更新模組
 * 負責頁面 UI 的所有更新邏輯
 */

import { standardToVisual } from './morse-codec.js';
import { DOT_SYMBOL, DASH_SYMBOL } from './constants.js';

/**
 * 更新摩斯序列顯示區
 * @param {string} sequence - 標準摩斯序列 (如 ".-")
 */
export function updateMorseDisplay(sequence) {
  const morseOutput = document.getElementById('morse-output');
  
  if (!sequence) {
    morseOutput.innerHTML = '<span class="empty-state">等待輸入...</span>';
    return;
  }
  
  // 轉換為視覺符號
  const visualSequence = standardToVisual(sequence);
  morseOutput.textContent = visualSequence;
}

/**
 * 更新字符顯示區
 * @param {string|null} character - 單個字符或 null
 */
export function updateCharacterDisplay(character) {
  const charOutput = document.getElementById('char-output');
  
  if (!character) {
    charOutput.innerHTML = '<span class="empty-state">-</span>';
  } else if (character === '?') {
    charOutput.innerHTML = '<span style="color: #ff9800;">?</span>';
    charOutput.title = '無效的摩斯密碼序列';
  } else {
    charOutput.textContent = character;
    charOutput.title = '';
  }
}

/**
 * 更新訊息顯示區
 * @param {string} message - 已解碼的訊息
 */
export function updateMessageDisplay(message) {
  const messageOutput = document.getElementById('message-output');
  
  if (!message || message.trim() === '') {
    messageOutput.innerHTML = '<span class="empty-state">訊息將顯示在此</span>';
  } else {
    messageOutput.textContent = message;
  }
}

/**
 * 顯示錯誤訊息
 * @param {string} message - 錯誤訊息
 * @param {number} duration - 顯示時間（毫秒，0 表示不自動隱藏）
 */
export function showError(message, duration = 3000) {
  const errorElement = document.getElementById('error-message');
  errorElement.textContent = message;
  errorElement.classList.add('show');
  
  if (duration > 0) {
    setTimeout(() => {
      errorElement.classList.remove('show');
    }, duration);
  }
}

/**
 * 隱藏錯誤訊息
 */
export function hideError() {
  const errorElement = document.getElementById('error-message');
  errorElement.classList.remove('show');
}

/**
 * 更新按鈕視覺狀態
 * @param {HTMLElement} button - 按鈕元素
 * @param {boolean} isPressed - 是否被按下
 */
export function updateButtonState(button, isPressed) {
  if (isPressed) {
    button.classList.add('active');
    button.setAttribute('aria-pressed', 'true');
  } else {
    button.classList.remove('active');
    button.setAttribute('aria-pressed', 'false');
  }
}

/**
 * 初始化摩斯密碼對照表
 * @param {object} morseTable - 摩斯密碼對應表
 */
export function initializeMorseTable(morseTable) {
  const tableBody = document.getElementById('morse-table-body');
  if (!tableBody) return;
  
  // 只顯示 A-Z 和 0-9 (共 36 項)
  const sortedKeys = Object.keys(morseTable)
    .filter(key => /^[A-Z0-9]$/.test(key))
    .sort();
  
  tableBody.innerHTML = sortedKeys.map(char => {
    const morse = morseTable[char];
    const visualMorse = standardToVisual(morse);
    return `
      <tr>
        <td>${char}</td>
        <td>${visualMorse}</td>
      </tr>
    `;
  }).join('');
}

/**
 * 禁用/啟用按鈕
 * @param {HTMLElement} button - 按鈕元素
 * @param {boolean} disabled - 是否禁用
 */
export function setButtonDisabled(button, disabled) {
  if (disabled) {
    button.setAttribute('disabled', 'disabled');
    button.style.opacity = '0.5';
    button.style.cursor = 'not-allowed';
  } else {
    button.removeAttribute('disabled');
    button.style.opacity = '1';
    button.style.cursor = 'pointer';
  }
}

/**
 * 獲取參考按鈕 (用於回車鍵等快捷操作)
 */
export function getMainButton() {
  return document.getElementById('main-button');
}

export function getUndoButton() {
  return document.getElementById('undo-button');
}

export function getClearButton() {
  return document.getElementById('clear-button');
}
