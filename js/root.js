const registerCartSuccessMessage = () => {
    const addToCartButton = document.getElementsByClassName('add-to-cart-btn')[0];
    addToCartButton.addEventListener('click', () => {
        const actionContainer = document.getElementsByClassName('product__action-col')[0];
        const addToListMessageContainer = document.createElement('div');
        const addToListMessage = document.createTextNode('Product added to cart.');
        addToListMessageContainer.appendChild(addToListMessage);
        addToListMessageContainer.className = 'product__action-col--message';
        actionContainer.appendChild(addToListMessageContainer);
        setTimeout(() => addToListMessageContainer.remove(), 1000);
    });
};

const registerCarouselScrolling = () => {
    const rightArrow = document.getElementsByClassName('carousel__right-arrow')[0];
    const leftArrow = document.getElementsByClassName('carousel__left-arrow')[0];
    const carouselBody = document.getElementsByClassName('carousel__body')[0];
    const carouselImages = document.getElementsByClassName('carousel__img');
    leftArrow.addEventListener('click', () => carouselBody.scrollLeft -= (carouselImages[0].width));
    rightArrow.addEventListener('click', () => carouselBody.scrollLeft += (carouselImages[0].width + 10));
    let offsetX = 2500;
    for (let i = 0; i < carouselImages.length; i++) {
        setTimeout(() => carouselBody.scrollLeft += carouselImages[0].width + 10, offsetX);
        offsetX += 2500;
    }
};

(function() {
    const { pathname } = window.location;
    switch(pathname) {
        case '/':
            registerCarouselScrolling();
            break;
        case '/product':
            registerCartSuccessMessage();
            break;
        default:
            break;
    }
})();