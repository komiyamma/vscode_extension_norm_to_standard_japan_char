"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
test('NFC変換でSJIS内に収まる例（合成文字→正規化）', () => {
    // 例: 合成文字「が」（U+304B U+3099）→NFCで「が」（U+304C）
    const combined = 'か\u3099'; // 正しいUnicode
    const expected = 'が';
    assert.strictEqual((0, extension_1.normalizeLine)(combined), expected);
    assert.strictEqual((0, extension_1.canConvertSJIS)(expected), true);
});
const assert = __importStar(require("assert"));
const extension_1 = require("../extension");
suite('日本語正規化ロジックのテスト', () => {
    test('SJISで変換可能な文字（変更されないこと）', () => {
        const sjisText = 'あいうえおABC123';
        assert.strictEqual((0, extension_1.normalizeLine)(sjisText), sjisText);
        assert.strictEqual((0, extension_1.canConvertSJIS)(sjisText), true);
    });
    test('NFC/NFKCで正規化されるべき文字（正しく変換されること）', () => {
        // 例: 半角カタカナはSJISで表現可能なのでそのまま返す
        const hankaku = 'ｶﾀｶﾅ';
        const expected = 'ｶﾀｶﾅ';
        assert.strictEqual((0, extension_1.normalizeLine)(hankaku), expected);
    });
    test('cp932固有の文字（(株)、①など）', () => {
        const kabu = '(株)';
        const maruichi = '①';
        assert.strictEqual((0, extension_1.normalizeLine)(kabu), kabu);
        assert.strictEqual((0, extension_1.normalizeLine)(maruichi), maruichi);
    });
    test('NFKCで複数文字に分解されるが、文字長が長くなるため採用されないケース', () => {
        // 例: ローマ数字Ⅲ（U+2162）はNFKCで"III"に分解される
        const roman3 = 'Ⅲ';
        // normalizeCharは分解後の長さが元より長い場合は元の文字を返す
        assert.strictEqual((0, extension_1.normalizeChar)(roman3), roman3);
    });
    test('サロゲートペアで表現される絵文字など', () => {
        const emoji = '🦄'; // U+1F984 ユニコード絵文字
        assert.strictEqual((0, extension_1.normalizeChar)(emoji), emoji);
    });
});
//# sourceMappingURL=extension.test.js.map