/**
 * User Story 1 - 集成測試
 * 測試單按鈕摩斯密碼輸入完整工作流程
 */

import { describe, it, expect, beforeEach } from 'vitest';
import {
  morseToCharacter,
  characterToMorse,
  isValidMorse,
  standardToVisual
} from '../../src/scripts/morse-codec.js';

/**
 * 模擬按鈕輸入的輔助函數
 */
class MorseInputSimulator {
  constructor() {
    this.sequence = '';
    this.message = '';
    this.history = [];
  }

  // 模擬快速點擊 (< 500ms)
  simulateDot() {
    this.sequence += '.';
    this.history.push('.');
    return morseToCharacter(this.sequence);
  }

  // 模擬按住 (>= 500ms)
  simulateDash() {
    this.sequence += '-';
    this.history.push('-');
    return morseToCharacter(this.sequence);
  }

  // 模擬釋放按鈕 (分隔字符)
  finalizeCharacter() {
    if (!this.sequence) return null;

    const character = morseToCharacter(this.sequence);
    if (character) {
      this.message += character;
    } else {
      this.message += '?'; // 無效序列占位符
    }

    this.history.push(' '); // 字符分隔符
    const result = character;
    this.sequence = ''; // 重置
    return result;
  }

  // 模擬停頓 > 1 秒 (單詞分隔)
  simulatePause() {
    if (this.sequence) {
      this.finalizeCharacter();
    }
    this.message += ' ';
  }

  // 撤銷最後一個點或線
  undo() {
    if (this.history.length === 0) return false;

    const lastAction = this.history.pop();
    if (lastAction === ' ') {
      // 撤銷已完成的字符 - 移除該字符的所有點/線
      while (this.history.length > 0 && this.history[this.history.length - 1] !== ' ') {
        this.history.pop();
      }
      this.sequence = '';
      // 移除已完成的字符
      if (this.message.length > 0) {
        this.message = this.message.slice(0, -1);
      }
    } else {
      // 撤銷未完成序列中的點或線
      this.sequence = this.sequence.slice(0, -1);
    }

    return true;
  }

  // 清除所有
  clear() {
    this.sequence = '';
    this.message = '';
    this.history = [];
  }

  getState() {
    return {
      currentSequence: this.sequence,
      outputMessage: this.message,
      currentCharacter: morseToCharacter(this.sequence),
      visualSequence: standardToVisual(this.sequence)
    };
  }
}

describe('User Story 1 - 使用單一按鈕輸入摩斯密碼', () => {
  let simulator;

  beforeEach(() => {
    simulator = new MorseInputSimulator();
  });

  describe('基礎輸入 - 單個字符', () => {
    it('應能輸入字母 A (·—)', () => {
      simulator.simulateDot();    // 點
      simulator.simulateDash();   // 線
      const char = simulator.finalizeCharacter();

      expect(char).toBe('A');
      expect(simulator.message).toBe('A');
    });

    it('應能輸入字母 B (—···)', () => {
      simulator.simulateDash();   // 線
      simulator.simulateDot();    // 點
      simulator.simulateDot();    // 點
      simulator.simulateDot();    // 點
      const char = simulator.finalizeCharacter();

      expect(char).toBe('B');
      expect(simulator.message).toBe('B');
    });

    it('應能輸入數字 0 (—————)', () => {
      for (let i = 0; i < 5; i++) {
        simulator.simulateDash();
      }
      const char = simulator.finalizeCharacter();

      expect(char).toBe('0');
      expect(simulator.message).toBe('0');
    });

    it('應能輸入數字 1 (·————)', () => {
      simulator.simulateDot();
      for (let i = 0; i < 4; i++) {
        simulator.simulateDash();
      }
      const char = simulator.finalizeCharacter();

      expect(char).toBe('1');
    });

    it('應驗證無效序列並顯示占位符', () => {
      for (let i = 0; i < 8; i++) {
        simulator.simulateDot();
      }
      const char = simulator.finalizeCharacter();

      expect(char).toBeNull();
      expect(simulator.message).toBe('?');
    });
  });

  describe('多字符輸入', () => {
    it('應能連續輸入 3 個字符 (ABC)', () => {
      // A: ·—
      simulator.simulateDot();
      simulator.simulateDash();
      simulator.finalizeCharacter();

      // B: —···
      simulator.simulateDash();
      simulator.simulateDot();
      simulator.simulateDot();
      simulator.simulateDot();
      simulator.finalizeCharacter();

      // C: —·—·
      simulator.simulateDash();
      simulator.simulateDot();
      simulator.simulateDash();
      simulator.simulateDot();
      simulator.finalizeCharacter();

      expect(simulator.message).toBe('ABC');
    });

    it('應能輸入混合字母和數字 (A1B)', () => {
      // A: ·—
      simulator.simulateDot();
      simulator.simulateDash();
      simulator.finalizeCharacter();

      // 1: ·————
      simulator.simulateDot();
      for (let i = 0; i < 4; i++) {
        simulator.simulateDash();
      }
      simulator.finalizeCharacter();

      // B: —···
      simulator.simulateDash();
      simulator.simulateDot();
      simulator.simulateDot();
      simulator.simulateDot();
      simulator.finalizeCharacter();

      expect(simulator.message).toBe('A1B');
    });
  });

  describe('單詞分隔 - 停頓 > 1 秒', () => {
    it('應在停頓後自動分隔單詞', () => {
      // 第一個單詞: A
      simulator.simulateDot();
      simulator.simulateDash();
      simulator.finalizeCharacter();

      // 模擬停頓 > 1 秒
      simulator.simulatePause();

      // 第二個單詞: B
      simulator.simulateDash();
      simulator.simulateDot();
      simulator.simulateDot();
      simulator.simulateDot();
      simulator.finalizeCharacter();

      expect(simulator.message).toBe('A B');
    });

    it('應在多個單詞間保持間距', () => {
      // HI
      // H: ····
      for (let i = 0; i < 4; i++) {
        simulator.simulateDot();
      }
      simulator.finalizeCharacter();

      // I: ··
      simulator.simulateDot();
      simulator.simulateDot();
      simulator.finalizeCharacter();

      // 停頓
      simulator.simulatePause();

      // HELLO (示例: 簡化輸入)
      // E: ·
      simulator.simulateDot();
      simulator.finalizeCharacter();

      expect(simulator.message).toContain(' ');
      expect(simulator.message.startsWith('HI E')).toBe(true);
    });
  });

  describe('撤銷功能', () => {
    it('應能撤銷單個點或線', () => {
      simulator.simulateDot();
      simulator.simulateDash();
      
      const state1 = simulator.getState();
      expect(state1.currentSequence).toBe('.-');

      simulator.undo();
      const state2 = simulator.getState();
      expect(state2.currentSequence).toBe('.');
    });

    it('應能撤銷多個操作', () => {
      simulator.simulateDot();
      simulator.simulateDash();
      simulator.simulateDot();
      simulator.simulateDot();

      expect(simulator.getState().currentSequence).toBe('.-..'); // L

      simulator.undo();
      expect(simulator.getState().currentSequence).toBe('.-.'); // 移除最後點

      simulator.undo();
      expect(simulator.getState().currentSequence).toBe('.-');
    });

    it('應能撤銷已完成的字符', () => {
      simulator.simulateDot();
      simulator.simulateDash();
      simulator.finalizeCharacter(); // 完成 A

      expect(simulator.message).toBe('A');

      simulator.undo();
      expect(simulator.message).toBe('');
    });

    it('當沒有可撤銷的操作時應返回 false', () => {
      const result = simulator.undo();
      expect(result).toBe(false);
    });
  });

  describe('清除功能', () => {
    it('應清除所有當前序列和訊息', () => {
      simulator.simulateDot();
      simulator.simulateDash();
      simulator.finalizeCharacter();

      simulator.simulateDash();
      simulator.simulateDot();

      expect(simulator.message).toBe('A');
      expect(simulator.getState().currentSequence).toBe('-.'); // 未完成

      simulator.clear();

      expect(simulator.message).toBe('');
      expect(simulator.getState().currentSequence).toBe('');
      expect(simulator.history).toHaveLength(0);
    });

    it('應允許在清除後繼續輸入', () => {
      simulator.simulateDot();
      simulator.simulateDash();
      simulator.finalizeCharacter();
      simulator.clear();

      // 再次輸入
      simulator.simulateDash();
      simulator.simulateDash();
      simulator.simulateDash(); // O
      simulator.finalizeCharacter();

      expect(simulator.message).toBe('O');
    });
  });

  describe('實時 UI 更新驗證', () => {
    it('應顯示視覺摩斯符號 (·—)', () => {
      simulator.simulateDot();
      simulator.simulateDash();

      const state = simulator.getState();
      expect(state.visualSequence).toBe('·—');
    });

    it('應顯示對應字符', () => {
      simulator.simulateDot();
      simulator.simulateDash();

      const state = simulator.getState();
      expect(state.currentCharacter).toBe('A');
    });

    it('應在無效序列時顯示 null', () => {
      for (let i = 0; i < 8; i++) {
        simulator.simulateDot();
      }

      const state = simulator.getState();
      expect(state.currentCharacter).toBeNull();
    });

    it('應累積訊息到輸出顯示區', () => {
      // ABC
      simulator.simulateDot();
      simulator.simulateDash();
      simulator.finalizeCharacter();

      simulator.simulateDash();
      simulator.simulateDot();
      simulator.simulateDot();
      simulator.simulateDot();
      simulator.finalizeCharacter();

      simulator.simulateDash();
      simulator.simulateDot();
      simulator.simulateDash();
      simulator.simulateDot();
      simulator.finalizeCharacter();

      expect(simulator.getState().outputMessage).toBe('ABC');
    });
  });

  describe('完整使用場景', () => {
    it('應支援完整工作流: 輸入 → 顯示 → 撤銷 → 重新輸入', () => {
      // 輸入 HELLO
      const hello = 'HELLO';
      const morseSequences = {
        'H': ['.','.','.','.'],
        'E': ['.'],
        'L': ['.', '-', '.', '-'],
        'L': ['.', '-', '.', '-'],
        'O': ['-', '-', '-']
      };

      // 輸入 H
      for (const dot of ['.', '.', '.', '.']) {
        if (dot === '.') simulator.simulateDot();
        else simulator.simulateDash();
      }
      simulator.finalizeCharacter();
      expect(simulator.message).toBe('H');

      // 撤銷
      simulator.undo();
      expect(simulator.message).toBe('');

      // 重新輸入 H
      for (let i = 0; i < 4; i++) simulator.simulateDot();
      simulator.finalizeCharacter();
      expect(simulator.message).toBe('H');

      // 輸入 I
      simulator.simulateDot();
      simulator.simulateDot();
      simulator.finalizeCharacter();
      expect(simulator.message).toBe('HI');

      // 清除
      simulator.clear();
      expect(simulator.message).toBe('');
    });

    it('應能處理連續多次撤銷和重新輸入', () => {
      simulator.simulateDot();
      simulator.simulateDash();
      simulator.finalizeCharacter(); // A

      simulator.simulateDash();
      simulator.simulateDot();
      simulator.simulateDot();
      simulator.simulateDot();
      simulator.finalizeCharacter(); // B

      expect(simulator.message).toBe('AB');

      // 撤銷 B
      simulator.undo();
      expect(simulator.message).toBe('A');

      // 撤銷 A
      simulator.undo();
      expect(simulator.message).toBe('');

      // 重新輸入 C
      simulator.simulateDash();
      simulator.simulateDot();
      simulator.simulateDash();
      simulator.simulateDot();
      simulator.finalizeCharacter();

      expect(simulator.message).toBe('C');
    });
  });
});
