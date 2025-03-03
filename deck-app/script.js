// デッキコードからデッキデータを取得する関数（仮のデータを使用）
async function getDeckData(deckCode) {
    // 仮のデータ（本来はサーバーから取得）
    const mockData = {
        "1JB20": [
            { "img": "https://example.com/images/card1.png", "name": "カードA" },
            { "img": "https://example.com/images/card2.png", "name": "カードB" },
            { "img": "https://example.com/images/card3.png", "name": "カードC" }
        ]
    };

    return mockData[deckCode] || [];
}

// デッキを読み込んで表示する関数
async function loadDeck() {
    const deckCode = document.getElementById("deckCode").value.trim();
    if (!deckCode) {
        alert("デッキコードを入力してください");
        return;
    }

    const deckData = await getDeckData(deckCode);
    const container = document.getElementById("deckContainer");
    container.innerHTML = "";

    if (deckData.length === 0) {
        container.innerHTML = "<p>デッキが見つかりません。</p>";
        return;
    }

    deckData.forEach(card => {
        const imgElement = document.createElement("img");
        imgElement.src = card.img;
        imgElement.alt = card.name;
        imgElement.className = "card-img";
        container.appendChild(imgElement);
    });
}
