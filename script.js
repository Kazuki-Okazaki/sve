document.addEventListener("DOMContentLoaded", () => {
    const dropArea = document.getElementById("dropArea");
    const deckContainer = document.getElementById("deckContainer");
    const saveButton = document.getElementById("saveDeck");
    const loadButton = document.getElementById("loadDeck");
    const deckSelect = document.getElementById("deckSelect");
    const deleteAllButton = document.getElementById("deleteAll");

    let deck = [];

    // ドラッグ&ドロップのイベントリスナー
    dropArea.addEventListener("dragover", (event) => {
        event.preventDefault();
        dropArea.classList.add("highlight");
    });

    dropArea.addEventListener("dragleave", () => {
        dropArea.classList.remove("highlight");
    });

    dropArea.addEventListener("drop", (event) => {
        event.preventDefault();
        dropArea.classList.remove("highlight");
        handleFiles(event.dataTransfer.files);
    });

    function handleFiles(files) {
        for (const file of files) {
            if (!file.type.startsWith("image/")) continue;

            const reader = new FileReader();
            reader.onload = (e) => {
                const cardData = { imgSrc: e.target.result, count: 1 };
                deck.push(cardData);
                updateDeckDisplay();
            };
            reader.readAsDataURL(file);
        }
    }

    function updateDeckDisplay() {
        deckContainer.innerHTML = "";
        deck.forEach((cardData, index) => {
            const cardContainer = document.createElement("div");
            cardContainer.classList.add("card-container");

            const img = document.createElement("img");
            img.src = cardData.imgSrc;
            img.classList.add("card-image");

            const countInput = document.createElement("input");
            countInput.type = "number";
            countInput.value = cardData.count;
            countInput.min = 1;
            countInput.classList.add("card-count-input");
            countInput.addEventListener("input", (e) => {
                cardData.count = parseInt(e.target.value, 10);
            });

            const deleteButton = document.createElement("button");
            deleteButton.textContent = "削除";
            deleteButton.classList.add("delete-button");
            deleteButton.addEventListener("click", () => {
                deck.splice(index, 1);
                updateDeckDisplay();
            });

            cardContainer.appendChild(img);
            cardContainer.appendChild(countInput);
            cardContainer.appendChild(deleteButton);
            deckContainer.appendChild(cardContainer);
        });
    }

    // デッキをローカルストレージに保存
    saveButton.addEventListener("click", () => {
        const deckName = prompt("デッキ名を入力してください:");
        if (deckName) {
            localStorage.setItem(`deckData_${deckName}`, JSON.stringify(deck));
            updateDeckList();
            alert(`デッキ '${deckName}' を保存しました！`);
        }
    });

    // ローカルストレージからデッキを読み込む
    loadButton.addEventListener("click", () => {
        const selectedDeck = deckSelect.value;
        if (!selectedDeck) {
            alert("デッキを選択してください！");
            return;
        }

        const savedData = localStorage.getItem(`deckData_${selectedDeck}`);
        if (savedData) {
            deck = JSON.parse(savedData);
            updateDeckDisplay();
        } else {
            alert("選択したデッキが見つかりません！");
        }
    });

    // デッキ一覧を更新
    function updateDeckList() {
        deckSelect.innerHTML = "";
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key.startsWith("deckData_")) {
                const option = document.createElement("option");
                option.value = key.replace("deckData_", "");
                option.textContent = key.replace("deckData_", "");
                deckSelect.appendChild(option);
            }
        }
    }

    // すべてのデッキを削除
    deleteAllButton.addEventListener("click", () => {
        if (confirm("すべてのデッキを削除しますか？")) {
            localStorage.clear();
            deck = [];
            updateDeckDisplay();
            updateDeckList();
            alert("すべてのデッキを削除しました！");
        }
    });

    // 初回読み込み時にデッキリストを更新
    updateDeckList();
});
