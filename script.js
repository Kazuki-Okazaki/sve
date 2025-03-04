document.addEventListener("DOMContentLoaded", () => {
    const dropAreas = {
        leader: document.getElementById("leaderDropArea"),
        main: document.getElementById("mainDropArea"),
        evolve: document.getElementById("evolveDropArea")
    };
    const deckContainers = {
        leader: document.getElementById("leaderContainer"),
        main: document.getElementById("mainContainer"),
        evolve: document.getElementById("evolveContainer")
    };

    const saveButton = document.getElementById("saveDeck");
    const loadButton = document.getElementById("loadDeck");
    const clearButton = document.getElementById("clearDecks");
    const deckSelect = document.getElementById("deckSelect");

    let deck = {
        leader: [],
        main: [],
        evolve: []
    };

    // ドラッグ&ドロップのイベントリスナーを設定
    Object.keys(dropAreas).forEach(type => {
        dropAreas[type].addEventListener("dragover", (event) => {
            event.preventDefault();
            dropAreas[type].classList.add("highlight");
        });

        dropAreas[type].addEventListener("dragleave", () => {
            dropAreas[type].classList.remove("highlight");
        });

        dropAreas[type].addEventListener("drop", (event) => {
            event.preventDefault();
            dropAreas[type].classList.remove("highlight");
            handleFiles(event.dataTransfer.files, type);
        });
    });

    function handleFiles(files, type) {
        for (const file of files) {
            if (!file.type.startsWith("image/")) continue;

            const imageUrl = URL.createObjectURL(file); // ローカルURLを作成

            if (type === "leader" && deck.leader.length >= 1) {
                alert("リーダーカードは1枚のみです！");
                return;
            }
            deck[type].push({ imgSrc: imageUrl, count: 1 });
            updateDeckDisplay();
        }
    }

    function updateDeckDisplay() {
        Object.keys(deckContainers).forEach(type => {
            deckContainers[type].innerHTML = "";
            deck[type].forEach((cardData, index) => {
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
                    deck[type].splice(index, 1);
                    updateDeckDisplay();
                });

                cardContainer.appendChild(img);
                cardContainer.appendChild(countInput);
                cardContainer.appendChild(deleteButton);
                deckContainers[type].appendChild(cardContainer);
            });
        });
    }

    saveButton.addEventListener("click", () => {
        if (deck.leader.length !== 1) {
            alert("リーダーカードは1枚必要です！");
            return;
        }
        const mainCount = deck.main.reduce((sum, card) => sum + card.count, 0);
        if (mainCount < 40 || mainCount > 50) {
            alert("メインデッキは40~50枚である必要があります！");
            return;
        }
        const evolveCount = deck.evolve.reduce((sum, card) => sum + card.count, 0);
        if (evolveCount > 10) {
            alert("エボルヴデッキは最大10枚までです！");
            return;
        }

        const deckName = prompt("デッキ名を入力してください:");
        if (deckName) {
            localStorage.setItem(`deckData_${deckName}`, JSON.stringify(deck));
            updateDeckList();
            alert(`デッキ '${deckName}' を保存しました！`);
        }
    });

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

    clearButton.addEventListener("click", () => {
        if (confirm("本当に全てのデッキを削除しますか？")) {
            localStorage.clear();
            updateDeckList();
            alert("全デッキを削除しました！");
        }
    });

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

    updateDeckList();
});
