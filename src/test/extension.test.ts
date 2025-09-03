	test('NFC変換でSJIS内に収まる例（合成文字→正規化）', () => {
		// 例: 合成文字「が」（U+304B U+3099）→NFCで「が」（U+304C）
		const combined = 'か\u3099'; // 正しいUnicode
		const expected = 'が';
		assert.strictEqual(normalizeLine(combined), expected);
		assert.strictEqual(canConvertSJIS(expected), true);
	});

import * as assert from 'assert';
import * as vscode from 'vscode';
import { normalizeLine, normalizeChar, canConvertSJIS } from '../extension';

suite('日本語正規化ロジックのテスト', () => {
	test('SJISで変換可能な文字（変更されないこと）', () => {
		const sjisText = 'あいうえおABC123';
		assert.strictEqual(normalizeLine(sjisText), sjisText);
		assert.strictEqual(canConvertSJIS(sjisText), true);
	});

	test('NFC/NFKCで正規化されるべき文字（正しく変換されること）', () => {
		// 例: 半角カタカナはSJISで表現可能なのでそのまま返す
		const hankaku = 'ｶﾀｶﾅ';
		const expected = 'ｶﾀｶﾅ';
		assert.strictEqual(normalizeLine(hankaku), expected);
	});

	test('cp932固有の文字（(株)、①など）', () => {
		const kabu = '(株)';
		const maruichi = '①';
		assert.strictEqual(normalizeLine(kabu), kabu);
		assert.strictEqual(normalizeLine(maruichi), maruichi);
	});

	test('NFKCで複数文字に分解されるが、文字長が長くなるため採用されないケース', () => {
		// 例: ローマ数字Ⅲ（U+2162）はNFKCで"III"に分解される
		const roman3 = 'Ⅲ';
		// normalizeCharは分解後の長さが元より長い場合は元の文字を返す
		assert.strictEqual(normalizeChar(roman3), roman3);
	});

	test('サロゲートペアで表現される絵文字など', () => {
		const emoji = '🦄'; // U+1F984 ユニコード絵文字
		assert.strictEqual(normalizeChar(emoji), emoji);
	});
});
