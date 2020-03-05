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

    let carouselAutoScroll = setInterval(() => carouselBody.scrollLeft += carouselImages[0].width + 10, 2500);
    carouselBody.addEventListener('scroll', () => {
        const endReached = carouselBody.scrollLeft >= carouselBody.scrollWidth - carouselBody.clientWidth;
        const startReached = carouselBody.scrollLeft === 0;
        if (endReached) {
            clearInterval(carouselAutoScroll);
            carouselAutoScroll = setInterval(() => carouselBody.scrollLeft -= carouselImages[0].width + 10, 2500);
        }
        if (startReached) {
            clearInterval(carouselAutoScroll);
        }
    });
    leftArrow.addEventListener('click', () => {
        carouselBody.scrollLeft -= (carouselImages[0].width + 10);
        clearInterval(carouselAutoScroll);
    });
    rightArrow.addEventListener('click', () => {
        carouselBody.scrollLeft += (carouselImages[0].width + 10);
        clearInterval(carouselAutoScroll);
    });
};

const registerAddToCartHandler = () => {
    const addToCartButton = document.getElementsByClassName('add-to-cart-btn')[0];
    const params = new URL(document.location).searchParams;
    const id = params.get('id');
    addToCartButton.addEventListener('click', (e) => {
        e.preventDefault();
        fetch('/addToCart', {
            method: 'POST',
            headers: new Headers({ 'Content-Type': 'application/json' }),
            mode: 'same-origin',
            body: JSON.stringify({ id })
        })
        .catch(err => console.error(err));
    })
};

function removeFromCartHandler(id) {
    fetch('/removeFromCart', {
        method: 'DELETE',
        headers: new Headers({ 'Content-Type': 'application/json' }),
        mode: 'same-origin',
        body: JSON.stringify({ id })
    })
    .then(() => location.reload())  // not ideal, but I need to learn more about partial rerendinrg in vanilla js
    .catch(err => console.error(err));
}

(function() {
    const { pathname } = window.location;
    switch(pathname) {
        case '/':
            registerCarouselScrolling();
            break;
        case '/product':
            registerAddToCartHandler();
            registerCartSuccessMessage();
            break;
        default:
            break;
    }
})();