/**
 * 摩斯密碼對應表常數
 * ITU 標準摩斯密碼表
 * 點 (·) 用 "." 表示，線 (—) 用 "-" 表示
 */

export const MORSE_CODE_TABLE = {
  // 英文字母
  'A': '.-',
  'B': '-...',
  'C': '-.-.',
  'D': '-..',
  'E': '.',
  'F': '..-.',
  'G': '--.',
  'H': '....',
  'I': '..',
  'J': '.---',
  'K': '-.-',
  'L': '.-..',
  'M': '--',
  'N': '-.',
  'O': '---',
  'P': '.--.',
  'Q': '--.-',
  'R': '.-.',
  'S': '...',
  'T': '-',
  'U': '..-',
  'V': '...-',
  'W': '.--',
  'X': '-..-',
  'Y': '-.--',
  'Z': '--..',
  
  // 數字
  '0': '-----',
  '1': '.----',
  '2': '..---',
  '3': '...--',
  '4': '....-',
  '5': '.....',
  '6': '-....',
  '7': '--...',
  '8': '---..',
  '9': '----.',
  
  // 標點符號
  '.': '.-.-.-',
  ',': '--..--',
  '?': '..--..',
  "'": '.----.',
  '!': '-.-.--',
  '/': '-..-.',
  '(': '-.--.-',
  ')': '-.--.-',
  '&': '.-...',
  ':': '---...',
  ';': '-.-.-.',
  '=': '-...-',
  '+': '.-.-.',
  '-': '-....-',
  '_': '..--.-',
  '"': '.-..-.',
  '$': '...-..-',
  '@': '.--.-.'
};

// 反向對應表（摩斯 → 字符）
export const REVERSE_MORSE_TABLE = {};
Object.entries(MORSE_CODE_TABLE).forEach(([char, morse]) => {
  REVERSE_MORSE_TABLE[morse] = char;
});

// 視覺表示
export const DOT_SYMBOL = '·';
export const DASH_SYMBOL = '—';

// 轉換標準摩斯 (.-) 為視覺符號 (·—)
export function standardToVisual(standardMorse) {
  if (!standardMorse) return '';
  return standardMorse
    .replace(/\./g, DOT_SYMBOL)
    .replace(/-/g, DASH_SYMBOL);
}

// 時間閾值 (毫秒)
export const DOT_THRESHOLD = 500;    // <500ms = 點
export const PAUSE_THRESHOLD = 1000; // >1000ms = 單詞分隔
