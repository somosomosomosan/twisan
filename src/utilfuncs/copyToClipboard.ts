/**
 * https://qiita.com/kumanobori/items/25c1b49617c61b5ef4cd
 * クリップボードにコピー
 * @param string value コピーする文字列
 */
export default function copyToClipboard(value: string) {
	// モダンブラウザ
	if (typeof navigator.clipboard === 'object') {
		navigator.clipboard.writeText(value).then(
			function () {
				// 成功
				//console.log('clipboard.writeText OK');
			},
			function () {
				// 失敗（アプリ内蔵ブラウザの一部はここを通る）
				let result = copyToClipboard2(value);
				//console.log('writeText NG, copy ' + (result !== false ? 'OK' : 'NG'));
			},
		);
		return;
	}

	// IE
	/* @ts-ignore */
	if (typeof window.clipboardData === 'object') {
		/* @ts-ignore */
		window.clipboardData.setData('Text', value);
		// 結果の確認方法は不明
		//console.log('clipboardData.setData DONE');
		return;
	}

	// 旧来の汎用的なやり方（？）
	let result = copyToClipboard2(value);
	//console.log('copy ' + (result !== false ? 'OK' : 'NG'));
}

/**
 * クリップボードにコピーを、body末尾にdomを追加する方法で行う
 * @param string value コピーする文字列
 * @return 失敗した場合はfalse
 */
function copyToClipboard2(value: string) {
	// 旧来の汎用的なやり方（？）
	const CLASS_NAME = 'temp_class_name_for_clipboard_copy';

	const inputElement = document.createElement('input');
	inputElement.setAttribute('type', 'text');
	inputElement.setAttribute('class', CLASS_NAME);
	inputElement.setAttribute('value', value);
	document.body.appendChild(inputElement);

	inputElement.select();
	const result = document.execCommand('copy');

	document.body.removeChild(inputElement);
	return result;
}
