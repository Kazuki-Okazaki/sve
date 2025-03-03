document.addEventListener("DOMContentLoaded", () => {
    const dropArea = document.getElementById("dropArea");
    const deckContainer = document.getElementById("deckContainer");
    const saveButton = document.getElementById("saveDeck");
    const loadButton = document.getElementById("loadDeck");

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
                const img = document.createElement("img");
                img.src = e.target.result;
                img.classList.add("card-image");

                const cardData = { imgSrc: e.target.result, count: 1 };
                deck.push(cardData);

                const cardContainer = document.createElement("div");
                cardContainer.classList.add("card-container");

                const countInput = document.createElement("input");
                countInput.type = "number";
                countInput.value = 1;
                countInput.min = 1;
                countInput.addEventListener("input", (e) => {
                    cardData.count = parseInt(e.target.value, 10);
                });

                cardContainer.appendChild(img);
                cardContainer.appendChild(countInput);
                deckContainer.appendChild(cardContainer);
            };
            reader.readAsDataURL(file);
        }
    }

    // デッキをローカルストレージに保存
    saveButton.addEventListener("click", () => {
        localStorage.setItem("deckData", JSON.stringify(deck));
        alert("デッキを保存しました！");
    });

    // ローカルストレージからデッキを読み込む
    loadButton.addEventListener("click", () => {
        deckContainer.innerHTML = "";
        const savedData = localStorage.getItem("deckData");
        if (savedData) {
            deck = JSON.parse(savedData);
            deck.forEach((cardData) => {
                const img = document.createElement("img");
                img.src = cardData.imgSrc;
                img.classList.add("card-image");

                const cardContainer = document.createElement("div");
                cardContainer.classList.add("card-container");

                const countInput = document.createElement("input");
                countInput.type = "number";
                countInput.value = cardData.count;
                countInput.min = 1;
                countInput.addEventListener("input", (e) => {
                    cardData.count = parseInt(e.target.value, 10);
                });

                cardContainer.appendChild(img);
                cardContainer.appendChild(countInput);
                deckContainer.appendChild(cardContainer);
            });
        } else {
            alert("保存されたデッキがありません！");
        }
    });
});
