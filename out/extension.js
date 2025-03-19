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
exports.activate = activate;
exports.deactivate = deactivate;
const vscode = __importStar(require("vscode"));
const iconv = require('iconv-lite');
function activate(context) {
    const disposable = vscode.commands.registerCommand('normtostandardjapanchar.normalize', () => {
        normToStandardJapanChar();
    });
    context.subscriptions.push(disposable);
}
function deactivate() { }
// 正規化
function normToStandardJapanChar() {
    // 編集中のテキストを取得
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
        return;
    }
    const text = getSelectedText() || getAllText();
    if (!text) {
        return;
    }
    const textArray = text.split('\n');
    const normalizedTextArray = textArray.map(normalizeLine);
    const joinedText = normalizedTextArray.join('\n');
    // 置換前後で変化がない場合は何もしない
    if (text === joinedText) {
        return;
    }
    // 選択している時は、その範囲をjonedTextで置き換える
    if (getSelectedText()) {
        editor.edit(editBuilder => {
            editBuilder.replace(editor.selection, joinedText);
        });
    }
    // 選択していない時は、全体をjoinedTextで置き換える
    else {
        editor.edit(editBuilder => {
            editBuilder.replace(new vscode.Range(new vscode.Position(0, 0), new vscode.Position(editor.document.lineCount, 0)), joinedText);
        });
    }
}
function getSelectedText() {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
        return;
    }
    const selection = editor.selection;
    const text = editor.document.getText(selection);
    return text;
}
function getAllText() {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
        return;
    }
    const document = editor.document;
    const text = document.getText();
    return text;
}
// セグメンター
const segmenter = new Intl.Segmenter('ja', { granularity: 'grapheme' }); // 'ja' は言語タグ、'grapheme' はテキスト要素（字）を分割する単位
// グラフェムイテレータ
function* graphemeIterator(text) {
    for (const segment of segmenter.segment(text)) {
        yield segment.segment; // 各segmentのsegmentプロパティには字が含まれる
    }
}
// 行を正規化
function normalizeLine(lineText) {
    // SJIS に変換可能な文字列はそのまま返す
    if (canConvertSJIS(lineText)) {
        return lineText;
    }
    // 行のテキストを１文字ずつカスタム正規化
    let normalizedLineText = '';
    for (const grapheme of graphemeIterator(lineText)) {
        normalizedLineText += normalizeChar(grapheme);
    }
    return normalizedLineText;
}
// １文字を正規化
function normalizeChar(char) {
    // SJIS に変換可能な文字列はそのまま返す
    if (canConvertSJIS(char)) {
        return char;
    }
    // NFC に変換出来た文字列はそのまま返す
    let normalizeNFC = char.normalize('NFC');
    if (char !== normalizeNFC) {
        return normalizeNFC;
    }
    // NFKC でトライ
    let normalizeNFKC = char.normalize('NFKC');
    // 変換した結果、１文字だったものが逆に分解されたり、といったことをしていない限りにおいては、それを返す
    if (normalizeNFKC.length <= char.length) {
        return normalizeNFKC;
    }
    // それでも変換できない場合はそのまま返す
    return char;
}
// SJIS に変換可能かどうかを判定
function canConvertSJIS(text) {
    try {
        // CP932に変換
        const cp932Buffer = iconv.encode(text, 'shift_jis');
        const utf16String = iconv.decode(cp932Buffer, 'shift_jis');
        // 元のテキストと再変換したテキストを比較
        return text === utf16String;
    }
    catch (error) {
        // CP932で表現できない文字が含まれている場合、変換に失敗する
        return false;
    }
}
//# sourceMappingURL=extension.js.map