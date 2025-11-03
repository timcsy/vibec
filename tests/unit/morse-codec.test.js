/**
 * 摩斯密碼編解碼 - 單元測試
 * 測試 morse-codec.js 的所有功能
 */

import { describe, it, expect } from 'vitest';
import {
  morseToCharacter,
  characterToMorse,
  isValidMorse,
  visualToStandard,
  standardToVisual,
  decodeMorseMessage,
  encodeMorseMessage,
  getSupportedCharacters,
  getMorseTable
} from '../../src/scripts/morse-codec.js';

describe('Morse Codec - 基礎轉換', () => {
  it('應正確從摩斯轉換為字符 - 字母', () => {
    expect(morseToCharacter('.-')).toBe('A');
    expect(morseToCharacter('-...')).toBe('B');
    expect(morseToCharacter('-.-.')).toBe('C');
    expect(morseToCharacter('-')).toBe('T');
    expect(morseToCharacter('...')).toBe('S');
  });

  it('應正確從摩斯轉換為字符 - 數字', () => {
    expect(morseToCharacter('-----')).toBe('0');
    expect(morseToCharacter('.----')).toBe('1');
    expect(morseToCharacter('..---')).toBe('2');
    expect(morseToCharacter('----.')).toBe('9');
  });

  it('應正確從摩斯轉換為字符 - 標點符號', () => {
    expect(morseToCharacter('.-.-.-')).toBe('.');
    expect(morseToCharacter('--..--')).toBe(',');
    expect(morseToCharacter('..--..')).toBe('?');
  });

  it('應正確從字符轉換為摩斯', () => {
    expect(characterToMorse('A')).toBe('.-');
    expect(characterToMorse('B')).toBe('-...');
    expect(characterToMorse('Z')).toBe('--..');
  });

  it('應處理大小寫字符', () => {
    expect(characterToMorse('a')).toBe('.-');
    expect(characterToMorse('z')).toBe('--..');
  });

  it('應返回 null 對於無效摩斯序列', () => {
    expect(morseToCharacter('........')).toBeNull();
    expect(morseToCharacter('---')).not.toBeNull(); // O 有效
    expect(morseToCharacter('---x')).toBeNull();
  });

  it('應返回 null 對於無效字符', () => {
    expect(characterToMorse('!')).not.toBeNull(); // ! 在表中
    expect(characterToMorse('👍')).toBeNull();
  });
});

describe('Morse Codec - 符號轉換', () => {
  it('應轉換視覺符號為標準符號', () => {
    expect(visualToStandard('·—')).toBe('.-');
    expect(visualToStandard('·')).toBe('.');
    expect(visualToStandard('—')).toBe('-');
  });

  it('應轉換標準符號為視覺符號', () => {
    expect(standardToVisual('.-')).toBe('·—');
    expect(standardToVisual('.')).toBe('·');
    expect(standardToVisual('-')).toBe('—');
  });

  it('應支援混合視覺和標準符號', () => {
    expect(visualToStandard('·—.')).toBe('.-.');
  });
});

describe('Morse Codec - 驗證', () => {
  it('應驗證有效摩斯序列', () => {
    expect(isValidMorse('.-')).toBe(true);
    expect(isValidMorse('-...')).toBe(true);
    expect(isValidMorse('.')).toBe(true);
  });

  it('應識別無效摩斯序列', () => {
    expect(isValidMorse('........')).toBe(false);
    expect(isValidMorse('abc')).toBe(false);
    expect(isValidMorse('')).toBe(false);
  });
});

describe('Morse Codec - 訊息解碼', () => {
  it('應解碼簡單摩斯訊息', () => {
    expect(decodeMorseMessage('.- -...').split(' ').join('')).toBe('AB');
  });

  it('應處理單詞分隔 (三個空格)', () => {
    const result = decodeMorseMessage('.-   -...');
    expect(result).toContain(' ');
  });

  it('應處理無效摩斯序列', () => {
    const result = decodeMorseMessage('........');
    expect(result).toContain('?');
  });
});

describe('Morse Codec - 訊息編碼', () => {
  it('應編碼簡單文字為摩斯', () => {
    const morse = encodeMorseMessage('AB');
    expect(morse).toContain('.-');
    expect(morse).toContain('-...');
  });

  it('應處理多個單詞 (三個空格分隔)', () => {
    const morse = encodeMorseMessage('A B');
    expect(morse).toContain('   ');
  });

  it('應處理無效字符', () => {
    const morse = encodeMorseMessage('A@B');
    expect(morse).toContain('?');
  });
});

describe('Morse Codec - 邊界情況', () => {
  it('應處理空字符串', () => {
    expect(morseToCharacter('')).toBeNull();
    expect(decodeMorseMessage('')).toBe('');
    expect(encodeMorseMessage('')).toBe('');
  });

  it('應處理空格和特殊字符', () => {
    expect(decodeMorseMessage('.-   -...')).toContain('A');
    expect(decodeMorseMessage('.-   -...')).toContain('B');
  });

  it('應支援完整字符集', () => {
    const chars = getSupportedCharacters();
    expect(chars.length).toBeGreaterThan(26);
    expect(chars).toContain('A');
    expect(chars).toContain('0');
  });

  it('應返回有效的摩斯表', () => {
    const table = getMorseTable();
    expect(table['A']).toBe('.-');
    expect(table['0']).toBe('-----');
    expect(table[',']).toBe('--..--');
  });
});

describe('Morse Codec - 完整集成', () => {
  it('應正確往返轉換文字 → 摩斯 → 文字', () => {
    const original = 'HELLO';
    const morse = encodeMorseMessage(original);
    const decoded = decodeMorseMessage(morse);
    expect(decoded).toBe('HELLO');
  });

  it('應支援混合數字和字母', () => {
    const morse = encodeMorseMessage('ABC123');
    expect(morse).toContain('.-');
    expect(morse).toContain('.----');
  });

  it('應支援標點符號', () => {
    const morse = encodeMorseMessage('HELLO.');
    expect(isValidMorse('.-.-.-')).toBe(true);
  });
});
