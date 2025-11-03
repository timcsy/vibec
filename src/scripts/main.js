/**
 * 摩斯密碼應用程式 - 主入點
 * 管理應用程式狀態和事件處理
 */

import { morseToCharacter, characterToMorse, getMorseTable } from './morse-codec.js';
import { DOT_THRESHOLD, PAUSE_THRESHOLD } from './constants.js';
import {
  updateMorseDisplay,
  updateCharacterDisplay,
  updateMessageDisplay,
  showError,
  hideError,
  getMainButton,
  getUndoButton,
  getClearButton,
  initializeMorseTable
} from './ui.js';

// 應用程式狀態
const state = {
  currentSequence: '',         // 當前摩斯序列 (標準格式: ".-")
  outputMessage: '',            // 已解碼的文字訊息
  history: [],                  // 歷史記錄 (每個點/線或分隔)
  isButtonPressed: false,       // 按鈕是否被按下
  pressStartTime: 0,            // 按鈕按下的時間戳
  lastReleaseTime: 0,           // 上次按鈕釋放的時間戳
  wordSeparated: false          // 是否已檢查單詞分隔
};

/**
 * 初始化應用程式
 */
function initialize() {
  initializeMorseTable(getMorseTable());
  setupEventListeners();
  
  // 初始顯示
  updateMorseDisplay('');
  updateCharacterDisplay(null);
  updateMessageDisplay('');
}

/**
 * 設定事件監聽器
 */
function setupEventListeners() {
  const mainButton = getMainButton();
  const undoButton = getUndoButton();
  const clearButton = getClearButton();

  // 主按鈕事件
  mainButton.addEventListener('pointerdown', handleButtonDown);
  mainButton.addEventListener('pointerup', handleButtonUp);
  mainButton.addEventListener('pointercancel', handleButtonUp);

  // 鍵盤快捷鍵 (Space 鍵)
  document.addEventListener('keydown', (e) => {
    if (e.code === 'Space' && !state.isButtonPressed) {
      e.preventDefault();
      handleButtonDown();
    }
  });

  document.addEventListener('keyup', (e) => {
    if (e.code === 'Space' && state.isButtonPressed) {
      e.preventDefault();
      handleButtonUp();
    }
  });

  // 撤銷和清除按鈕
  undoButton.addEventListener('click', handleUndo);
  clearButton.addEventListener('click', handleClear);

  // 禁用鼠標右鍵菜單 (可選)
  mainButton.addEventListener('contextmenu', (e) => e.preventDefault());
}

/**
 * 按鈕按下事件處理器
 */
function handleButtonDown() {
  state.isButtonPressed = true;
  state.pressStartTime = Date.now();

  const mainButton = getMainButton();
  mainButton.classList.add('active');
  mainButton.setAttribute('aria-pressed', 'true');
  mainButton.textContent = '保持按住...';

  // 隱藏錯誤訊息
  hideError();
}

/**
 * 按鈕釋放事件處理器
 */
function handleButtonUp() {
  if (!state.isButtonPressed) return;

  state.isButtonPressed = false;
  const mainButton = getMainButton();
  mainButton.classList.remove('active');
  mainButton.setAttribute('aria-pressed', 'false');
  mainButton.textContent = '按住輸入摩斯密碼';

  // 計算按下時間
  const pressDuration = Date.now() - state.pressStartTime;
  const currentTime = Date.now();

  // 檢測是否需要分隔單詞 (停頓 > 1000ms)
  if (state.lastReleaseTime && (state.pressStartTime - state.lastReleaseTime) > PAUSE_THRESHOLD) {
    if (state.currentSequence) {
      // 完成當前字符並添加空格
      finalizeCharacter();
      state.outputMessage += ' ';
      updateMessageDisplay(state.outputMessage);
    }
  }

  state.lastReleaseTime = currentTime;

  // 根據按下時間判斷是點還是線
  if (pressDuration < DOT_THRESHOLD) {
    // 點 (.)
    state.currentSequence += '.';
    state.history.push('.');
  } else {
    // 線 (-)
    state.currentSequence += '-';
    state.history.push('-');
  }

  // 更新顯示
  updateMorseDisplay(state.currentSequence);

  // 嘗試將當前序列轉換為字符並顯示
  const character = morseToCharacter(state.currentSequence);
  if (character) {
    updateCharacterDisplay(character);
  } else if (state.currentSequence) {
    // 無效序列，顯示占位符
    updateCharacterDisplay('?');
  }
}

/**
 * 完成當前字符
 */
function finalizeCharacter() {
  if (!state.currentSequence) return;

  const character = morseToCharacter(state.currentSequence);
  
  if (character) {
    state.outputMessage += character;
  } else {
    // 無效序列，使用占位符
    state.outputMessage += '?';
  }

  // 記錄到歷史
  state.history.push(' '); // 字符分隔符

  // 重置當前序列
  state.currentSequence = '';
  updateMorseDisplay('');
  updateCharacterDisplay(null);
}

/**
 * 按下 Enter/Return 鍵時分隔字符
 */
function handleCharacterSeparation() {
  if (state.currentSequence) {
    finalizeCharacter();
    updateMessageDisplay(state.outputMessage);
  }
}

/**
 * 撤銷最後一個點或線
 */
function handleUndo() {
  if (state.history.length === 0) {
    showError('沒有可撤銷的操作', 2000);
    return;
  }

  const lastAction = state.history.pop();

  if (lastAction === ' ') {
    // 撤銷字符分隔
    // 恢復上一個字符的摩斯序列
    let reversedSequence = '';
    for (let i = state.history.length - 1; i >= 0; i--) {
      if (state.history[i] === ' ') {
        break;
      }
      reversedSequence = state.history[i] + reversedSequence;
    }
    state.currentSequence = reversedSequence;
  } else {
    // 撤銷點或線
    state.currentSequence = state.currentSequence.slice(0, -1);
  }

  // 從訊息中移除最後字符
  if (state.outputMessage.length > 0) {
    state.outputMessage = state.outputMessage.slice(0, -1);
  }

  // 更新顯示
  updateMorseDisplay(state.currentSequence);
  updateMessageDisplay(state.outputMessage);

  const character = morseToCharacter(state.currentSequence);
  if (character) {
    updateCharacterDisplay(character);
  } else if (state.currentSequence) {
    updateCharacterDisplay('?');
  } else {
    updateCharacterDisplay(null);
  }
}

/**
 * 清除所有內容
 */
function handleClear() {
  if (!state.outputMessage && !state.currentSequence) {
    showError('已經是空的', 1500);
    return;
  }

  // 重置狀態
  state.currentSequence = '';
  state.outputMessage = '';
  state.history = [];
  state.lastReleaseTime = 0;

  // 更新顯示
  updateMorseDisplay('');
  updateCharacterDisplay(null);
  updateMessageDisplay('');

  hideError();
}

/**
 * 按 Enter 鍵分隔字符
 */
document.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && state.currentSequence) {
    e.preventDefault();
    handleCharacterSeparation();
  }
});

// 應用程式啟動
initialize();
