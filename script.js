async function fetchDeckData(deckCode) {
    const apiUrl = `https://decklog.bushiroad.com/system/app/api/view/${deckCode}`;

    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error(`HTTPエラー: ${response.status}`);
        }

        const data = await response.json();
        console.log(data); // 取得したデータを確認
        displayDeck(data);
    } catch (error) {
        console.error("データ取得エラー:", error);
    }
}

function displayDeck(deckData) {
    const container = document.getElementById("deck-container");
    container.innerHTML = ""; // 以前の内容をクリア

    // カードリストを取得（データ構造によって適宜変更）
    const cardList = deckData.c_list || [];

    cardList.forEach(card => {
        const cardImg = document.createElement("img");
        cardImg.src = `https://decklog.bushiroad.com/image/${card.img}`; // 画像URL（適宜変更）
        cardImg.alt = card.name;
        cardImg.style.width = "150px"; // 画像サイズ調整
        container.appendChild(cardImg);
    });
}

// デッキコードの入力と取得処理
document.getElementById("fetch-button").addEventListener("click", () => {
    const deckCode = document.getElementById("deck-code").value.trim();
    if (deckCode) {
        fetchDeckData(deckCode);
    }
});
