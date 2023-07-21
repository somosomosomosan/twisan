export function getRankingData(dirName: string) {
	//fetch() は Promise を返す（返り値を変数に代入する場合）
	const promise = fetch('');

	//fetch() のレスポンス（リクエストの結果）を then() メソッドで処理
	promise
		.then((response) => {
			return response.json();
		})
		.then((data) => {
			console.log(data);
		});
}
