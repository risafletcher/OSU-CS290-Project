const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const app = express();
const cookieParser = require('cookie-parser');
const { dollarFormatter } = require('./js/utils');
const { products } = require('./data/products.json');

const port = process.env.PORT || 6969;
const handlebars = require('express-handlebars').create({
    defaultLayout: 'main',
    helpers: {
        stringify: (context) => JSON.stringify(context),
    }
});

app.set('view engine', 'handlebars');
app.engine('handlebars', handlebars.engine);

//BODY PARSER SET-UP
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '/')));

app.use(cookieParser());

app.get('/', (req, res) => {
    res.render('home', { products });
});

app.get('/products', (req, res) =>
    res.render('products', { products }));

app.get('/product', (req, res) => {
    const { id } = req.query;
    const product = products.find((item) => item.id == id);
    res.render('product', { product });
});

app.get('/cart', (req, res) => {
    let cartProducts = [];
    for (let productId in req.cookies.cart) {
        const queryParams = req.query;
        const shouldRemove = queryParams.action === 'remove' && queryParams.id == productId;
        if (shouldRemove) {
            const cart = req.cookies['cart'] || {};
            const newCart = { ...cart };
            delete newCart[queryParams.id];
            res.cookie('cart', newCart);
        } else {
            const cartProduct = products.find(({ id }) => id == productId);
            cartProduct.quantity = req.cookies.cart[productId].quantity;
            cartProduct && cartProducts.push(cartProduct)
        }
    }
    let totalPrice = 0;
    cartProducts.forEach(({ price, quantity }) => totalPrice += (parseFloat(price)) * quantity);

    res.render('cart', {
        products: cartProducts,
        totalPrice: dollarFormatter.format(totalPrice),
    });
});

app.post('/addToCart', (req, res) => {
    const { id } = req.body;
    const product = products.find((item) => item.id == id);
    const cart = req.cookies['cart'] || {};
    const quantity = cart[product.id] ? cart[product.id].quantity + 1 : 1;
    const newCart = {
        ...cart,
        [product.id] : { quantity },
    };
    res.cookie('cart', newCart);
    res.end();
})

app.get('/contact', (req, res) => {
    res.render('contact');
})

app.use((req, res) => {
    res.status(404);
    res.render('404');
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.type('plain/text');
    res.status(500);
    res.render('500');
});

app.listen(port, () => {
    console.log('Express started on ' + port + '; press Ctrl-C to terminate.');
});