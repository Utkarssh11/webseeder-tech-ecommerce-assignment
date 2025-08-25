const $=s=>document.querySelector(s);const $$=s=>document.querySelectorAll(s);
const state={cart:JSON.parse(localStorage.getItem("ws_cart")||"{}"),orders:JSON.parse(localStorage.getItem("ws_orders")||"[]")};
const data=[
{id:"p1",name:"MacBook Air 13",price:89990,tag:"laptop",img:"https://www.apple.com/v/macbook-air/u/images/overview/hero/hero_static__c9sislzzicq6_large.png"},
{id:"p2",name:"MSI Laptop 15",price:129990,tag:"laptop",img:"https://storage-asset.msi.com/event/2024/NB/msi-laptop-holiday-sales/images/kv-pd.png"},
{id:"p3",name:"Samsung Galaxy Z Fold ",price:49990,tag:"phone",img:"https://cdn.fastpixel.io/fp/ret_img+v_8df5+w_1124+h_750+q_lossless+to_webp/www.bosshunting.com.au/wp-content/uploads/2025/07/029_SamsungGalaxyUnpacked_Galaxy-Z-Fold7_All-Colours_back-scaled.jpg"},
{id:"p4",name:"Samsung Galaxy S24 Ultra",price:69990,tag:"phone",img:"https://m.media-amazon.com/images/I/51SqYltf+2L._SX350_.jpg"},
{id:"p5",name:"Boat Headphones",price:9990,tag:"audio",img:"https://cdn.thewirecutter.com/wp-content/media/2023/07/bluetoothheadphones-2048px-6109-2x1-1.jpg?width=2048&quality=75&crop=2:1&auto=webp"},
{id:"p6",name:"Realme NoiseCancel Pro",price:14990,tag:"audio",img:"https://rukminim2.flixcart.com/image/850/1000/xif0q/headphone/f/y/f/-original-imahy3uqgtzmdsge.jpeg?q=20&crop=false"}
];
function fmt(n) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  }).format(n);
}

function save() {
  localStorage.setItem("ws_cart", JSON.stringify(state.cart));
  localStorage.setItem("ws_orders", JSON.stringify(state.orders));
}

function cartCount() {
  return Object.values(state.cart).reduce((s, x) => s + x.qty, 0);
}

function cartTotal() {
  return Object.values(state.cart).reduce((s, x) => s + x.qty * x.item.price, 0);
}

function addToCart(p) {
  state.cart[p.id] ??= { item: p, qty: 0 };
  state.cart[p.id].qty += 1;
  save();
  renderNav();
}

function decFromCart(id) {
  if (!state.cart[id]) return;
  state.cart[id].qty -= 1;
  if (state.cart[id].qty <= 0) delete state.cart[id];
  save();
  render();
}

function delFromCart(id) {
  delete state.cart[id];
  save();
  render();
}

function clearCart() {
  state.cart = {};
  save();
  render();
}

function checkout() {
  if (cartCount() === 0) return;
  const snapshot = Object.values(state.cart).map(x => ({
    id: x.item.id,
    name: x.item.name,
    qty: x.qty,
    price: x.item.price
  }));
  state.orders.unshift({
    id: "ORD-" + Date.now(),
    items: snapshot,
    total: cartTotal(),
    date: new Date().toISOString()
  });
  state.cart = {};
  save();
  location.hash = "#/history";
}

function icon(n) {
  const s = document.createElement("i");
  s.setAttribute("data-lucide", n);
  return s;
}

function mountIcons() {
  lucide.createIcons();
}

function navLink(h, t, i) {
  const a = document.createElement("a");
  a.href = h;
  a.className = "subnav-link";
  a.append(i, document.createTextNode(t));
  return a;
}

function renderNav() {
  const root = document.createElement("div");
  root.className = "nav";

  const top = document.createElement("div");
  top.className = "nav-row container";

  const brand = document.createElement("div");
  brand.className = "brand";
  brand.append(icon("store"), document.createTextNode("WebSeeder Tech"));

  const grow = document.createElement("div");
  grow.className = "grow";

  const search = document.createElement("div");
  search.className = "search";
  const si = document.createElement("input");
  si.placeholder = "Search products";
  search.append(icon("search"), si);

  const actions = document.createElement("div");
  actions.className = "topbar-actions";

  const cartBtn = document.createElement("button");
  cartBtn.className = "icon-btn";
  cartBtn.onclick = () => location.hash = "#/cart";

  const cartIcon = icon("shopping-cart");
  cartBtn.append(cartIcon);
  if (cartCount() > 0) {
    const b = document.createElement("span");
    b.className = "badge";
    b.textContent = cartCount();
    cartBtn.append(b);
  }

  const userBtn = document.createElement("button");
  userBtn.className = "icon-btn";
  userBtn.append(icon("user"));

  actions.append(cartBtn, userBtn);
  top.append(brand, grow, search, actions);

  const sub = document.createElement("div");
  sub.className = "subnav container";
  function link(h, t, i) {
    const a = document.createElement("a");
    a.href = h;
    a.append(icon(i), document.createTextNode(" " + t));
    if (location.hash === h || (h === "#/" && location.hash === ""))
      a.className = "active";
    return a;
  }

  sub.append(
    link("#/", "Home", "home"),
    link("#/shop", "Shop", "store"),
    link("#/history", "History", "history"),
    link("#/cart", "Cart", "shopping-cart")
  );

  root.append(top, sub);
  return root;
}

function Home() {
  const root = document.createElement("div");
  root.className = "container";

  const hero = document.createElement("div");
  hero.className = "hero";

  const h1 = document.createElement("h1");
  h1.textContent = "Electronics that move at your speed";

  const p = document.createElement("p");
  p.textContent = "Discover laptops, phones, and audio gear picked for performance and value.";

  const cta = document.createElement("div");
  cta.className = "cta";

  const s1 = document.createElement("a");
  s1.className = "btn dark";
  s1.href = "#/shop";
  s1.textContent = "Shop Now";

  const s2 = document.createElement("a");
  s2.className = "btn light";
  s2.href = "#/history";
  s2.textContent = "Order History";

  const heroImg = document.createElement("img");
  heroImg.src = "home4.png";
  heroImg.alt = "hero";
  heroImg.style.borderRadius = "16px";

  hero.append(h1, p, cta, heroImg);
  cta.append(s1, s2);

  const kpis = document.createElement("div");
  kpis.className = "kpis";
  const cats = [
    { n: "Laptops", d: "Work and play", i: "laptop" },
    { n: "Phones", d: "Flagship & budget", i: "smartphone" },
    { n: "Audio", d: "Clear and loud", i: "headphones" }
  ];
  cats.forEach(c => {
    const k = document.createElement("div");
    k.className = "kpi";

    const pill = document.createElement("div");
    pill.className = "pill";
    pill.append(icon(c.i));

    const t = document.createElement("div");
    const n = document.createElement("div");
    n.textContent = c.n;
    n.style.fontWeight = "600";

    const d = document.createElement("div");
    d.textContent = c.d;
    d.style.color = "#666";
    d.style.fontSize = "13px";

    t.append(n, d);

    const go = document.createElement("a");
    go.href = "#/shop";
    go.className = "btn";
    go.textContent = "Explore";

    k.append(pill, t, go);
    kpis.append(k);
  });

  root.append(hero, document.createElement("div"), kpis);
  return root;
}

function Shop() {
  const root = document.createElement("div");
  root.className = "container";

  const bar = document.createElement("div");
  bar.className = "toolbar";

  const title = document.createElement("div");
  title.style.fontWeight = "600";
  title.textContent = "Shop";

  const right = document.createElement("div");
  right.style.display = "flex";
  right.style.gap = "8px";

  const q = document.createElement("input");
  q.className = "input";
  q.placeholder = "Search";

  const cat = document.createElement("select");
  cat.className = "select";
  ["all", "laptop", "phone", "audio"].forEach(x => {
    const o = document.createElement("option");
    o.value = x;
    o.textContent = x.toUpperCase();
    cat.append(o);
  });

  right.append(q, cat);
  bar.append(title, right);

  const grid = document.createElement("div");
  grid.className = "grid";

  function draw() {
    grid.innerHTML = "";
    const items = data.filter(d =>
      (cat.value === "all" || d.tag === cat.value) &&
      d.name.toLowerCase().includes(q.value.toLowerCase())
    );

    items.forEach(p => {
      const card = document.createElement("div");
      card.className = "card";

      const im = document.createElement("img");
      im.src = p.img;
      im.alt = p.name;

      const pad = document.createElement("div");
      pad.className = "p";

      const h = document.createElement("h3");
      h.textContent = p.name;

      const sub = document.createElement("div");
      sub.className = "sub";

      const bc = document.createElement("span");
      bc.className = "badge-cat";
      bc.textContent = p.tag;
      sub.append(bc);

      const row = document.createElement("div");
      row.className = "row";

      const price = document.createElement("div");
      price.style.fontWeight = "700";
      price.textContent = fmt(p.price);

      const act = document.createElement("button");
      act.className = "btn";
      act.textContent = "Add to cart";
      act.onclick = () => {
        addToCart(p);
      };

      row.append(price, act);
      pad.append(h, sub, row);
      card.append(im, pad);
      grid.append(card);
    });
  }

  q.oninput = draw;
  cat.onchange = draw;
  draw();

  root.append(bar, grid);
  return root;
}

function Cart() {
  const root = document.createElement("div");
  root.className = "container";

  if (cartCount() === 0) {
    const e = document.createElement("div");
    e.className = "empty";
    e.textContent = "Your cart is empty";
    root.append(e);
    return root;
  }

  const table = document.createElement("table");
  table.className = "table";

  const thead = document.createElement("thead");
  thead.innerHTML = "<tr><th>Item</th><th>Qty</th><th>Price</th><th></th></tr>";

  const tbody = document.createElement("tbody");
  Object.values(state.cart).forEach(x => {
    const tr = document.createElement("tr");

    const td1 = document.createElement("td");
    td1.textContent = x.item.name;

    const td2 = document.createElement("td");
    const box = document.createElement("div");
    box.className = "qty";

    const b1 = document.createElement("button");
    b1.append(icon("minus"));
    b1.onclick = () => decFromCart(x.item.id);

    const m = document.createElement("span");
    m.textContent = x.qty;

    const b2 = document.createElement("button");
    b2.append(icon("plus"));
    b2.onclick = () => {
      addToCart(x.item);
      render();
    };

    box.append(b1, m, b2);
    td2.append(box);

    const td3 = document.createElement("td");
    td3.textContent = fmt(x.qty * x.item.price);

    const td4 = document.createElement("td");
    const rm = document.createElement("button");
    rm.className = "icon-btn";
    rm.append(icon("trash-2"));
    rm.onclick = () => delFromCart(x.item.id);
    td4.append(rm);

    tr.append(td1, td2, td3, td4);
    tbody.append(tr);
  });

  table.append(thead, tbody);

  const bar = document.createElement("div");
  bar.className = "row-between";
  bar.style.marginTop = "12px";

  const left = document.createElement("div");
  const clear = document.createElement("button");
  clear.className = "btn";
  clear.textContent = "Clear";
  clear.onclick = clearCart;
  left.append(clear);

  const right = document.createElement("div");
  right.style.display = "flex";
  right.style.gap = "8px";

  const tot = document.createElement("div");
  tot.className = "total";
  tot.textContent = fmt(cartTotal());

  const pay = document.createElement("button");
  pay.className = "btn";
  pay.textContent = "Checkout";
  pay.onclick = checkout;

  right.append(tot, pay);
  bar.append(left, right);

  root.append(table, bar);
  return root;
}

function History() {
  const root = document.createElement("div");
  root.className = "container";

  if (state.orders.length === 0) {
    const e = document.createElement("div");
    e.className = "empty";
    e.textContent = "No orders yet";
    root.append(e);
    return root;
  }

  const table = document.createElement("table");
  table.className = "table";

  const thead = document.createElement("thead");
  thead.innerHTML = "<tr><th>Order</th><th>Date</th><th>Items</th><th>Total</th></tr>";

  const tbody = document.createElement("tbody");
  state.orders.forEach(o => {
    const tr = document.createElement("tr");

    const td1 = document.createElement("td");
    td1.textContent = o.id;

    const td2 = document.createElement("td");
    td2.textContent = new Date(o.date).toLocaleString();

    const td3 = document.createElement("td");
    td3.textContent = o.items.map(i => i.name + "×" + i.qty).join(", ");

    const td4 = document.createElement("td");
    td4.textContent = fmt(o.total);

    tr.append(td1, td2, td3, td4);
    tbody.append(tr);
  });

  table.append(thead, tbody);
  root.append(table);
  return root;
}

function Footer() {
  const f = document.createElement("div");
  f.className = "footer";
  f.textContent = "© " + new Date().getFullYear() + " WebSeeder Tech";
  return f;
}

function render() {
  const app = document.getElementById("app");
  app.innerHTML = "";
  app.append(renderNav());

  const r = location.hash || "#/";

  if (r === "#/" || r === "#") app.append(Home());
  else if (r.startsWith("#/shop")) app.append(Shop());
  else if (r.startsWith("#/cart")) app.append(Cart());
  else if (r.startsWith("#/history")) app.append(History());

  app.append(Footer());
  mountIcons();
}

window.addEventListener("hashchange", render);
window.addEventListener("load", () => {
  renderNav();
  render();
});
