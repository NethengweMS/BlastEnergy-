// ---------- Users ----------
let users = JSON.parse(localStorage.getItem("users")) || [];
let currentUser = JSON.parse(localStorage.getItem("currentUser")) || null;

// ---------- Products ----------
const products = [
  {id:1,name:"Red Bull 473ml",price:33.99,img:"images/redbull.png",stock:50},
  {id:2,name:"Monster 500ml",price:18.99,img:"images/monster.png",stock:40},
  {id:3,name:"Dragon Energy 500ml",price:10.99,img:"images/dragon.png",stock:30},
  {id:4,name:"Switch Energy 500ml",price:11.90,img:"images/switch.png",stock:25},
  {id:5,name:"Score Energy 500ml",price:12.99,img:"images/score.png",stock:30},
  {id:6,name:"It's the Qhush 500ml",price:20.00,img:"images/qhush.png",stock:20},
  {id:7,name:"Super C 500ml",price:9.90,img:"images/superc.png",stock:35},
  {id:8,name:"Energade Naartjie 500ml",price:12.00,img:"images/energade.png",stock:40}
];

// ---------- Cart ----------
let cart = [];

// ---------- Orders ----------
let orders = JSON.parse(localStorage.getItem("orders")) || [];

// ---------- Display Products ----------
function displayProducts() {
  const container = document.getElementById("product-list");
  if(!container) return;
  container.innerHTML = "";
  products.forEach(p => {
    container.innerHTML += `
      <div class="product">
        <img src="${p.img}" alt="${p.name}">
        <h3>${p.name}</h3>
        <p>R${p.price.toFixed(2)}</p>
        <p>Stock: ${p.stock}</p>
        <button onclick="addToCart(${p.id})"${p.stock===0 ? " disabled" : ""}>Add to Cart</button>
      </div>
    `;
  });
}

// ---------- Add to Cart ----------
function addToCart(id) {
  if(!currentUser){
    alert("Please login or register to order.");
    window.location.href="login.html";
    return;
  }

  const product = products.find(p=>p.id===id);
  if(!product || product.stock <= 0){
    alert("Product out of stock!");
    return;
  }

  cart.push(product);
  product.stock -= 1; // reduce stock immediately
  document.getElementById("cart-count").innerText = cart.length;
  displayProducts(); // update stock display
  displayCart(); // update cart view if open
}

// ---------- Toggle Cart ----------
function toggleCart() {
  if(document.getElementById("hero")) document.getElementById("hero").style.display="none";
  if(document.getElementById("product-list")) document.getElementById("product-list").style.display="none";
  if(document.getElementById("cart-page")) document.getElementById("cart-page").style.display="block";
  if(document.getElementById("checkout-page")) document.getElementById("checkout-page").style.display="none";
  displayCart();
}

// ---------- Display Cart ----------
function displayCart() {
  const container = document.getElementById("cart-items");
  if(!container) return;
  container.innerHTML="";
  let total = 0;
  cart.forEach((item,index)=>{
    total += item.price;
    container.innerHTML += `
      <div class="cart-item">
        <span>${item.name} - R${item.price.toFixed(2)}</span>
        <button onclick="removeFromCart(${index})">Remove</button>
      </div>
    `;
  });
  if(document.getElementById("total-price"))
    document.getElementById("total-price").innerText = "Total: R" + total.toFixed(2);
}

// ---------- Remove from Cart ----------
function removeFromCart(index){
  const item = cart[index];
  if(item){
    const product = products.find(p=>p.id===item.id);
    if(product) product.stock += 1; // return stock
  }
  cart.splice(index,1);
  document.getElementById("cart-count").innerText = cart.length;
  displayProducts(); // update stock
  displayCart(); // update cart
}

// ---------- Open Checkout ----------
function openCheckout() {
  if(document.getElementById("cart-page")) document.getElementById("cart-page").style.display="none";
  if(document.getElementById("checkout-page")) document.getElementById("checkout-page").style.display="block";
}

// ---------- Submit Order ----------
function submitOrder(event) {
  event.preventDefault();
  const name = document.getElementById("name").value;
  const address = document.getElementById("address").value;
  const payment = document.getElementById("payment").value;

  if(cart.length === 0){
    alert("Your cart is empty!");
    return;
  }

  const order = {
    name, address, payment,
    items:[...cart],
    total: cart.reduce((a,b)=>a+b.price,0),
    date: new Date().toLocaleString()
  };
  orders.push(order);
  localStorage.setItem("orders",JSON.stringify(orders));

  alert(`Thank you ${name}! Your order has been placed.`);
  cart = [];
  document.getElementById("cart-count").innerText = 0;
  goHome();
  displayProducts();
}

// ---------- Go Home ----------
function goHome() {
  if(document.getElementById("hero")) document.getElementById("hero").style.display="block";
  if(document.getElementById("product-list")) document.getElementById("product-list").style.display="grid";
  if(document.getElementById("cart-page")) document.getElementById("cart-page").style.display="none";
  if(document.getElementById("checkout-page")) document.getElementById("checkout-page").style.display="none";
}

// ---------- Initialize ----------
displayProducts();
if(document.getElementById("cart-count")) document.getElementById("cart-count").innerText = cart.length;
