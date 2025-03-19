import * as vscode from 'vscode';

const iconv = require('iconv-lite');

export function activate(context: vscode.ExtensionContext) {

	const disposable = vscode.commands.registerCommand('normtostandardjapanchar.normalize', () => {
		normToStandardJapanChar();
	});

	context.subscriptions.push(disposable);
}

export function deactivate() { }

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
function* graphemeIterator(text: string) {
	for (const segment of segmenter.segment(text)) {
		yield segment.segment; // 各segmentのsegmentプロパティには字が含まれる
	}
}

// 行を正規化
function normalizeLine(lineText: string): string {
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
function normalizeChar(char: string): string {
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
function canConvertSJIS(text: string): boolean {]
	return true;
	try {
        // CP932に変換
        const cp932Buffer = iconv.encode(text, 'cp932');

        // CP932からUTF-16LEに変換
        const utf16leString = iconv.decode(cp932Buffer, 'utf16le');

        // 元のテキストと再変換したテキストを比較
        return text === utf16leString;

    } catch (error) {
        // CP932で表現できない文字が含まれている場合、変換に失敗する
        return false;
    }
}
