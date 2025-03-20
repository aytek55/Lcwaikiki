(async function () {
    const PRODUCT_CONTAINER_SELECTOR = ".product-detail";
    const STORAGE_KEY = "recommended_products";
    const FAVORITES_KEY = "favorite_products";
    const DATA_URL = "https://gist.githubusercontent.com/sevindi/5765c5812bbc8238a38b3cf52f233651/raw/56261d81af8561bf0a7cf692fe572f9e1e91f372/products.json";

    if (!document.querySelector(PRODUCT_CONTAINER_SELECTOR)) return;

    let favorites = JSON.parse(localStorage.getItem(FAVORITES_KEY)) || [];
    let products = JSON.parse(localStorage.getItem(STORAGE_KEY));

    if (!products) {
        try {
            const response = await fetch(DATA_URL);
            products = await response.json();
            localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
        } catch (error) {
            console.error("Ürün listesi yüklenirken hata oluştu:", error);
            return;
        }
    }


    const carouselContainer = document.createElement("div");
    carouselContainer.id = "product-carousel";
    carouselContainer.innerHTML = `
        <h2 style="font-size: 20px; margin-bottom: 10px;">You Might Also Like</h2>
        <div class="carousel-wrapper" style="display: flex; overflow-x: auto; gap: 15px; padding-bottom: 10px;"></div>
    `;

    document.querySelector(PRODUCT_CONTAINER_SELECTOR).after(carouselContainer);
    const carouselWrapper = carouselContainer.querySelector(".carousel-wrapper");

    products.forEach(product => {
        const isFavorite = favorites.includes(product.id);

        const productCard = document.createElement("div");
        productCard.style.cssText = "width: 150px; flex: 0 0 auto; text-align: center; border: 1px solid #ddd; padding: 10px; border-radius: 10px;";

        productCard.innerHTML = `
            <img src="${product.img}" alt="${product.name}" style="width: 100%; height: auto; border-radius: 5px; cursor: pointer;"> 
            <p style="font-size: 14px; margin: 5px 0;">${product.name}</p>
            <p style="font-weight: bold;">${product.price} ₺</p>
            <span class="heart-icon" data-id="${product.id}" style="cursor: pointer; font-size: 20px; color: ${isFavorite ? 'blue' : 'gray'};">♥</span>
        `;

        productCard.querySelector("img").addEventListener("click", () => {
            window.open(product.url, "_blank");
        });

        productCard.querySelector(".heart-icon").addEventListener("click", function () {
            const productId = this.getAttribute("data-id");
            if (favorites.includes(productId)) {
                favorites = favorites.filter(id => id !== productId);
                this.style.color = "gray";
            } else {
                favorites.push(productId);
                this.style.color = "blue";
            }
            localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
        });

        carouselWrapper.appendChild(productCard);
    });

})();
