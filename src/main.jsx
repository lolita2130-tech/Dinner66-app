import React, { useMemo, useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, onSnapshot, updateDoc, doc, query, orderBy } from 'firebase/firestore';
import './style.css';

// ── Config Firebase ────────────────────────────────────────────────────────
const firebaseConfig = {
  apiKey: "AIzaSyAtht8RaQYIsyv06BeLPHFQkVVnbF1N638",
  authDomain: "dinner-66.firebaseapp.com",
  projectId: "dinner-66",
  storageBucket: "dinner-66.firebasestorage.app",
  messagingSenderId: "342668511804",
  appId: "1:342668511804:web:eb58fa149a5e5db2051139",
  measurementId: "G-F6EQHNPH53"
};
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
// ──────────────────────────────────────────────────────────────────────────

const MENU=[
  {category:'Frites',items:[
    ['frites','Frites',3],
    ['frites-sauce','Frites + sauce',4],
    ['cheesy-frites','Frites Cheese / Spéciale / Cheesy Onions',5],
    ['cheesy-bacon','Cheesy Bacon',5],
    ['bolognaise-frite','Frites Bolognaise',5],
  ]},
  {category:'Burgers',items:[
    ['diner66','Le Diner 66',12],
    ['montagnard','Le Montagnard',12],
    ['texas','Le Texas',12],
    ['coyote','Le Coyote',10],
    ['bacon-burger','Le Bacon Burger',10],
    ['cheeseburger','Cheeseburger',6],
    ['bicky-burger','Bicky Burger',5],
    ['hamburger','Hamburger',5],
  ]},
  {category:'Snacks',items:[
    ['fricadelle','Fricadelle',3],
    ['fricadelle-speciale','Fricadelle spéciale',3],
    ['viandelle','Viandelle',3],
    ['poulycroc','Poulycroc',3],
    ['lucifer','Lucifer',3],
    ['mexicanos','Mexicanos',3],
    ['cervelas','Cervelas brun',3],
    ['mini-loempia','Mini Loempia',3],
    ['chix','Chix Fingers',4.5],
    ['brochette','Brochette ardennaise',5],
    ['grizly','Grizly',5],
  ]},
  {category:'Boulets',items:[
    ['boulet-roti','Boulet rôti',3],
    ['boulet-lapin','Boulet lapin maison',4.5],
  ]},
  {category:'Sauces',items:[
    ['mayo','Mayonnaise',1],
    ['ketchup','Ketchup',1],
    ['curry','Ketchup Curry',1],
    ['poivre','Poivre',1],
    ['algerienne','Algérienne',1],
    ['brasil','Brasil',1],
    ['samourai','Samouraï',1],
    ['barbecue','Barbecue sucrée',1],
    ['moutarde','Moutarde',1],
    ['triple','Triple Hamburger',1],
    ['andalouse','Andalouse',1.5],
    ['tartare','Tartare maison',1.5],
    ['lapin','Sauce lapin',1.5],
    ['bolognaise','Sauce bolognaise',1.5],
  ]},
  {category:'Menus',items:[
    ['menu-classic','Menu Classique',9],
    ['menu-gourmand','Menu Gourmand',15],
    ['menu-enfant','Menu Enfant',8],
    ['routier','Routier (prix selon viande)',6],
  ]},
  {category:'Boissons',items:[
    ['coca','Coca-Cola',2],
    ['coca-zero','Coca Zero',2],
    ['fanta','Fanta',2],
    ['sprite','Sprite',2],
    ['ice-tea','Ice Tea',2],
    ['eau','Eau',2],
    ['biere','Bière',3],
  ]},
].map(s=>({...s,items:s.items.map(([id,name,price])=>({id,name,price}))}));

const euro = v => v.toLocaleString('fr-BE', { style: 'currency', currency: 'EUR' });
const todayStr = () => new Date().toLocaleDateString('fr-BE');

// ── Impression ticket thermique ────────────────────────────────────────────
function printTicket(order) {
  const itemRows = order.items.map(i => `
    <div class="item-row">
      <span class="item-name">${i.qty}x ${i.name}</span>
      <span class="item-price">${euro(i.price * i.qty)}</span>
    </div>`).join('');

  const content = `
<html><head><style>
  @page { margin: 0; size: 58mm auto; }
  * { box-sizing: border-box; }
  body { font-family: 'Courier New', monospace; font-size: 12px; width: 58mm; margin: 0; padding: 4mm 3mm; color: #000; background: #fff; }
  .center { text-align: center; }
  .sep { border-top: 1px dashed #000; margin: 5px 0; }
  .row { display: flex; justify-content: space-between; align-items: center; }
  .total-line { font-size: 15px; font-weight: 900; }
  .item-row { display: flex; justify-content: space-between; align-items: baseline; margin: 2px 0; gap: 4px; }
  .item-name { flex: 1; word-break: break-word; font-size: 11px; }
  .item-price { white-space: nowrap; font-weight: bold; font-size: 11px; min-width: 45px; text-align: right; }
  .thanks-row { display: flex; justify-content: center; align-items: center; gap: 6px; font-size: 11px; margin-top: 6px; }
</style></head><body>
  <div class="center">
    <img src="/logo.png" alt="Diner 66" style="width:90px;height:90px;object-fit:contain;display:block;margin:0 auto 4px" />
    <div class="sep" style="margin-top:4px"></div>
  </div>
  <div class="row" style="font-weight:bold">
    <span>Commande #${order.number}</span><span>${order.date}</span>
  </div>
  <div style="font-size:11px;margin-bottom:4px">Heure : ${order.time}</div>
  <div class="sep"></div>
  ${itemRows}
  <div class="sep"></div>
  <div class="row total-line"><span>TOTAL</span><span>${euro(order.total)}</span></div>
  <div class="sep" style="margin-top:6px"></div>
  <div class="center" style="font-size:11px;margin-top:6px">&#9733; Merci ! &#9733;</div>
  <div class="center" style="font-size:11px;margin-top:2px">&#192; tr&#232;s bient&#244;t chez Diner 66</div>
</body></html>`;

  const win = window.open('', '_blank', 'width=300,height=600');
  win.document.write(content);
  win.document.close();
  win.focus();
  setTimeout(() => { win.print(); win.close(); }, 400);
}
// ──────────────────────────────────────────────────────────────────────────

function App() {
  const [cart, setCart] = useState([]);
  const [orders, setOrders] = useState([]);
  const [mobileTab, setMobileTab] = useState('menu');
  const [tick, setTick] = useState(0);

  const total = useMemo(() => cart.reduce((s, i) => s + i.price * i.qty, 0), [cart]);
  const cartCount = useMemo(() => cart.reduce((s, i) => s + i.qty, 0), [cart]);

  // ── Écoute Firebase en temps réel ──
  useEffect(() => {
    const q = query(collection(db, 'orders'), orderBy('timestamp', 'desc'));
    const unsub = onSnapshot(q, snap => {
      setOrders(snap.docs.map(d => ({ ...d.data(), _firebaseId: d.id })));
    });
    return unsub;
  }, []);

  // ── Tick chaque seconde pour le compte à rebours ──
  useEffect(() => {
    const id = setInterval(() => setTick(t => t + 1), 1000);
    return () => clearInterval(id);
  }, []);

  // ── Archive auto les commandes "Prêt" depuis plus de 60s ──
  useEffect(() => {
    const now = Date.now();
    orders.forEach(o => {
      if (o.status === 'Prêt' && o.readyAt && now - o.readyAt >= 60000) {
        updateDoc(doc(db, 'orders', o._firebaseId), { status: 'Archivé' });
      }
    });
  }, [tick, orders]);

  // ── Valider une commande → ajout dans Firebase ──
  const validate = async () => {
    if (!cart.length) return;
    const now = new Date();
    const today = todayStr();
    const number = orders.filter(o => o.date === today).length + 1;
    const order = {
      number,
      items: cart,
      total,
      status: 'À préparer',
      date: today,
      time: now.toLocaleTimeString('fr-BE', { hour: '2-digit', minute: '2-digit' }),
      timestamp: now.getTime(),
      readyAt: null,
    };
    await addDoc(collection(db, 'orders'), order);
    setCart([]);
  };

  // ── Changer le statut d'une commande ──
  const changeStatus = async (firebaseId, currentStatus) => {
    if (currentStatus === 'Archivé') return;
    const newStatus = currentStatus === 'À préparer' ? 'Prêt' : 'À préparer';
    const update = newStatus === 'Prêt'
      ? { status: 'Prêt', readyAt: Date.now() }
      : { status: 'À préparer', readyAt: null };
    await updateDoc(doc(db, 'orders', firebaseId), update);
  };

  const [customName, setCustomName] = useState('');
  const [customPrice, setCustomPrice] = useState('');

  const add = item => setCart(p => {
    const f = p.find(x => x.id === item.id);
    return f ? p.map(x => x.id === item.id ? { ...x, qty: x.qty + 1 } : x) : [...p, { ...item, qty: 1 }];
  });
  const qty = (id, d) => setCart(p => p.map(x => x.id === id ? { ...x, qty: x.qty + d } : x).filter(x => x.qty > 0));

  const addCustom = () => {
    const price = parseFloat(customPrice.replace(',', '.'));
    if (!customName.trim() || isNaN(price) || price <= 0) return;
    const item = { id: 'custom_' + Date.now(), name: customName.trim(), price };
    add(item);
    setCustomName('');
    setCustomPrice('');
  };

  const today = todayStr();
  const nowTs = Date.now();
  const activeOrders  = orders.filter(o => o.date === today && o.status !== 'Archivé');
  const historyOrders = orders.filter(o => o.status === 'Archivé' || o.date !== today);
  const caDay   = orders.filter(o => o.date === today).reduce((s, o) => s + o.total, 0);
  const caWeek  = orders.filter(o => nowTs - o.timestamp < 6048e5).reduce((s, o) => s + o.total, 0);
  const caMonth = orders.filter(o => nowTs - o.timestamp < 2592e6).reduce((s, o) => s + o.total, 0);

  const countdown = o => {
    if (o.status !== 'Prêt' || !o.readyAt) return null;
    return Math.max(0, 60 - Math.floor((Date.now() - o.readyAt) / 1000));
  };

  const OrderCard = ({ o }) => {
    const cd = countdown(o);
    return (
      <div className="order">
        <div>
          <b style={{ fontSize: '20px' }}>#{o.number}</b>
          <p style={{ margin: '4px 0', color: '#aaa' }}>{o.date} · {o.time}</p>
          {o.items.map(i => <small key={i.id}>{i.qty} × {i.name}<br /></small>)}
        </div>
        <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>
          <button
            className={`status-btn ${o.status === 'À préparer' ? 'status-preparer' : o.status === 'Prêt' ? 'status-pret' : 'status-archive'}`}
            onClick={() => changeStatus(o._firebaseId, o.status)}
            disabled={o.status === 'Archivé'}
          >
            {o.status === 'À préparer' ? '🔴 À préparer' : o.status === 'Prêt' ? `🟢 Prêt${cd !== null ? ` (${cd}s)` : ''}` : '✅ Archivé'}
          </button>
          <strong style={{ color: '#ff5a00', fontSize: '22px' }}>{euro(o.total)}</strong>
          <button className="print-btn" onClick={() => printTicket(o)}>🖨 Ticket</button>
        </div>
      </div>
    );
  };

  return (
    <div className={`app show-${mobileTab}`}>

      <header>
        <div>
          <div className="brand">DINER 66</div>
          <h1>Prise de commandes</h1>
          <p>Foodtruck · caisse privée</p>
        </div>
        <div className="stat">
          <span>🧾</span><b>{activeOrders.length}</b><small>en cours</small>
        </div>
      </header>

      <div className="layout">
        <main className="section-menu">
          {MENU.map(sec => (
            <section key={sec.category}>
              <h2>{sec.category}</h2>
              <div className="grid">
                {sec.items.map(item => (
                  <button className="item" key={item.id} onClick={() => add(item)}>
                    <strong>{item.name}</strong>
                    <span>{euro(item.price)}</span>
                  </button>
                ))}
              </div>
            </section>
          ))}
        </main>

        <aside className="section-panier">
          <h2>🛒 Commande {cartCount > 0 && <span style={{ color: '#fff', fontWeight: 'normal', fontSize: '14px' }}>({cartCount} article{cartCount > 1 ? 's' : ''})</span>}</h2>
          <div className="cart">
            {cart.length ? cart.map(i => (
              <div className="row" key={i.id}>
                <div><b>{i.name}</b><small>{euro(i.price)} / pièce</small></div>
                <button onClick={() => qty(i.id, -1)}>−</button>
                <b style={{ textAlign: 'center' }}>{i.qty}</b>
                <button onClick={() => qty(i.id, 1)}>+</button>
              </div>
            )) : <p className="empty">Aucun article</p>}
          </div>
          {/* Article personnalisé */}
          <div className="custom-item">
            <div className="custom-title">✏️ Article personnalisé</div>
            <div className="custom-row">
              <input className="custom-input" value={customName} onChange={e=>setCustomName(e.target.value)} placeholder="Nom (ex: Burger du mois)" onKeyDown={e=>e.key==='Enter'&&addCustom()} />
              <input className="custom-input custom-price" value={customPrice} onChange={e=>setCustomPrice(e.target.value)} placeholder="Prix €" type="number" min="0" step="0.5" onKeyDown={e=>e.key==='Enter'&&addCustom()} />
              <button className="custom-add-btn" onClick={addCustom}>＋</button>
            </div>
          </div>
          <div className="total"><span>Total</span><b>{euro(total)}</b></div>
          <button className="validate" onClick={validate}>✅ Valider la commande</button>
          <button className="clear" onClick={() => setCart([])}>🗑 Vider le panier</button>
        </aside>
      </div>

      <div className="recap section-recap">
        <div><span>📅 Jour</span><b>{euro(caDay)}</b></div>
        <div><span>📆 Semaine</span><b>{euro(caWeek)}</b></div>
        <div><span>🗓 Mois</span><b>{euro(caMonth)}</b></div>
      </div>

      <div className="section-commandes">
        <h2>Commandes en cours — {today}</h2>
        {activeOrders.length === 0 && <p className="empty">Aucune commande en cours 🎉</p>}
        <div className="history">{activeOrders.map(o => <OrderCard key={o._firebaseId} o={o} />)}</div>
      </div>

      <div className="section-historique">
        <h2>Historique</h2>
        {historyOrders.length === 0 && <p className="empty">Aucune commande archivée</p>}
        <div className="history">{historyOrders.map(o => <OrderCard key={o._firebaseId} o={o} />)}</div>
      </div>

      <nav className="mobile-tabs">
        <button className={mobileTab === 'menu' ? 'active' : ''} onClick={() => setMobileTab('menu')}>
          <span className="tab-icon">🍔</span>Menu
        </button>
        <button className={mobileTab === 'panier' ? 'active' : ''} onClick={() => setMobileTab('panier')}>
          <span className="tab-icon">🛒</span>Panier{cartCount > 0 && ` (${cartCount})`}
        </button>
        <button className={mobileTab === 'commandes' ? 'active' : ''} onClick={() => setMobileTab('commandes')}>
          <span className="tab-icon">📋</span>
          Commandes{activeOrders.length > 0 && <span className="tab-badge">{activeOrders.length}</span>}
        </button>
        <button className={mobileTab === 'historique' ? 'active' : ''} onClick={() => setMobileTab('historique')}>
          <span className="tab-icon">📊</span>Historique
        </button>
      </nav>

      {/* Lien admin discret */}
      <div style={{textAlign:'center',marginTop:30,paddingBottom:10}}>
        <a href="/admin.html" style={{color:'#333',fontSize:'0.75rem',textDecoration:'none',letterSpacing:'1px'}}>⚙ admin</a>
      </div>

    </div>
  );
}

createRoot(document.getElementById('root')).render(<App />);
