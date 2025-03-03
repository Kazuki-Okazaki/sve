document.addEventListener("DOMContentLoaded", () => {
    const button = document.getElementById("fetchDeck");
    const statusText = document.getElementById("status"); // 状態表示用
    const deckCodeInput = document.getElementById("deckCode"); // 入力欄
    const imageContainer = document.getElementById("imageContainer"); // 画像表示用

    button.addEventListener("click", async () => {
        const deckCode = deckCodeInput.value.trim();
        if (!deckCode) {
            statusText.textContent = "デッキコードを入力してください";
            return;
        }

        const apiUrl = `https://decklog.bushiroad.com/system/app/api/view/${deckCode}`;
        statusText.textContent = "デッキを取得しています…"; // 読み込み中の表示
        imageContainer.innerHTML = ""; // 画像リセット

        try {
            const response = await fetch(apiUrl);
            if (!response.ok) {
                throw new Error(`デッキ取得に失敗しました: ${response.status}`);
            }

            const data = await response.json();
            statusText.textContent = "デッキ取得完了！画像を読み込んでいます…";

            // カード画像の表示
            data.s_list.forEach(card => {
                const img = document.createElement("img");
                img.src = `https://decklog.bushiroad.com/image/${card.img}`; // 画像のURL
                img.alt = card.name;
                img.width = 150;
                img.height = 210;
                imageContainer.appendChild(img);
            });

            statusText.textContent = "デッキ画像の読み込み完了！";
        } catch (error) {
            statusText.textContent = `エラー: ${error.message}`;
            console.error("デッキ取得エラー:", error);
        }
    });
});
