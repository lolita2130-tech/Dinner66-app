import React, { useState, useEffect, useMemo } from 'react';
import { createRoot } from 'react-dom/client';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, query, orderBy, onSnapshot, deleteDoc, doc, writeBatch } from 'firebase/firestore';
import * as XLSX from 'xlsx';
import './style.css';

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

const euro = v => v.toLocaleString('fr-BE', { style: 'currency', currency: 'EUR' });
const PASSWORD = 'Florian1802@';

// ── Export Excel ───────────────────────────────────────────────────────────
function exportExcel(orders) {
  const wb = XLSX.utils.book_new();

  // 1. Feuille : Toutes les commandes détaillées
  const detailRows = [];
  orders.forEach(o => {
    o.items.forEach(i => {
      detailRows.push({
        'Date': o.date,
        'Heure': o.time,
        'Commande #': o.number,
        'Article': i.name,
        'Quantité': i.qty,
        'Prix unitaire (€)': i.price,
        'Total article (€)': parseFloat((i.price * i.qty).toFixed(2)),
        'Total commande (€)': parseFloat(o.total.toFixed(2)),
        'Statut': o.status,
      });
    });
  });
  const ws1 = XLSX.utils.json_to_sheet(detailRows);
  ws1['!cols'] = [16,8,12,24,10,18,18,18,12].map(w => ({ wch: w }));
  XLSX.utils.book_append_sheet(wb, ws1, 'Commandes détaillées');

  // 2. Feuille : CA par jour
  const byDay = {};
  orders.forEach(o => {
    if (!byDay[o.date]) byDay[o.date] = { date: o.date, commandes: 0, ca: 0, panier_moyen: 0 };
    byDay[o.date].commandes++;
    byDay[o.date].ca += o.total;
  });
  const dayRows = Object.values(byDay)
    .sort((a, b) => a.date.localeCompare(b.date))
    .map(d => ({
      'Date': d.date,
      'Nb commandes': d.commandes,
      'CA (€)': parseFloat(d.ca.toFixed(2)),
      'Panier moyen (€)': parseFloat((d.ca / d.commandes).toFixed(2)),
    }));
  const ws2 = XLSX.utils.json_to_sheet(dayRows);
  ws2['!cols'] = [14, 14, 12, 16].map(w => ({ wch: w }));
  XLSX.utils.book_append_sheet(wb, ws2, 'CA par jour');

  // 3. Feuille : Articles vendus
  const byItem = {};
  orders.forEach(o => {
    o.items.forEach(i => {
      if (!byItem[i.name]) byItem[i.name] = { article: i.name, quantite: 0, ca: 0 };
      byItem[i.name].quantite += i.qty;
      byItem[i.name].ca += i.price * i.qty;
    });
  });
  const itemRows = Object.values(byItem)
    .sort((a, b) => b.quantite - a.quantite)
    .map(i => ({
      'Article': i.article,
      'Quantité vendue': i.quantite,
      'CA généré (€)': parseFloat(i.ca.toFixed(2)),
    }));
  const ws3 = XLSX.utils.json_to_sheet(itemRows);
  ws3['!cols'] = [28, 16, 16].map(w => ({ wch: w }));
  XLSX.utils.book_append_sheet(wb, ws3, 'Articles vendus');

  const now = new Date().toLocaleDateString('fr-BE').replace(/\//g, '-');
  XLSX.writeFile(wb, `Diner66_Stats_${now}.xlsx`);
}


// ── Supprimer tout l'historique ────────────────────────────────────────────
async function deleteAllOrders(orders, db) {
  if (!window.confirm(`Supprimer TOUTES les ${orders.length} commandes ? Cette action est irréversible.`)) return;
  const batch = writeBatch(db);
  orders.forEach(o => batch.delete(doc(db, 'orders', o._id)));
  await batch.commit();
  alert('Historique supprimé ✅');
}
// ──────────────────────────────────────────────────────────────────────────
// ── Composant principal ────────────────────────────────────────────────────
export default function Admin() {
  const [pwd, setPwd] = useState('');
  const [auth, setAuth] = useState(false);
  const [error, setError] = useState('');
  const [orders, setOrders] = useState([]);
  const [period, setPeriod] = useState('mois'); // jour | semaine | mois | tout

  useEffect(() => {
    if (!auth) return;
    const q = query(collection(db, 'orders'), orderBy('timestamp', 'desc'));
    return onSnapshot(q, snap => setOrders(snap.docs.map(d => ({ ...d.data(), _id: d.id }))));
  }, [auth]);

  const login = () => {
    if (pwd === PASSWORD) { setAuth(true); setError(''); }
    else setError('Mot de passe incorrect ❌');
  };

  // Filtrer selon la période
  const now = Date.now();
  const filtered = useMemo(() => {
    if (period === 'jour') return orders.filter(o => o.date === new Date().toLocaleDateString('fr-BE'));
    if (period === 'semaine') return orders.filter(o => now - o.timestamp < 6048e5);
    if (period === 'mois') return orders.filter(o => now - o.timestamp < 2592e6);
    return orders;
  }, [orders, period]);

  // Stats globales
  const ca = filtered.reduce((s, o) => s + o.total, 0);
  const nbCommandes = filtered.length;
  const panierMoyen = nbCommandes ? ca / nbCommandes : 0;

  // CA par jour
  const caParJour = useMemo(() => {
    const m = {};
    filtered.forEach(o => {
      if (!m[o.date]) m[o.date] = { date: o.date, ca: 0, nb: 0 };
      m[o.date].ca += o.total;
      m[o.date].nb++;
    });
    return Object.values(m).sort((a, b) => b.date.localeCompare(a.date));
  }, [filtered]);

  // Articles vendus
  const articlesVendus = useMemo(() => {
    const m = {};
    filtered.forEach(o => o.items.forEach(i => {
      if (!m[i.name]) m[i.name] = { name: i.name, qty: 0, ca: 0 };
      m[i.name].qty += i.qty;
      m[i.name].ca += i.price * i.qty;
    }));
    return Object.values(m).sort((a, b) => b.qty - a.qty);
  }, [filtered]);

  // ── Login ──
  if (!auth) return (
    <div className="app" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
      <div style={{ background: '#171717', border: '1px solid #333', borderRadius: 22, padding: 36, width: '100%', maxWidth: 380 }}>
        <div className="brand" style={{ textAlign: 'center', fontSize: '1.5rem', marginBottom: 8 }}>DINER 66</div>
        <h2 style={{ textAlign: 'center', marginBottom: 24, color: '#fff', textTransform: 'none', fontSize: '1rem', fontWeight: 400 }}>Espace Admin</h2>
        <input
          type="password"
          placeholder="Mot de passe"
          value={pwd}
          onChange={e => setPwd(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && login()}
          style={{ width: '100%', background: '#0d0d0d', color: '#fff', border: '1px solid #444', borderRadius: 12, padding: '14px 16px', fontSize: '1rem', marginBottom: 12 }}
        />
        {error && <div style={{ color: '#ff4444', fontSize: '0.85rem', marginBottom: 10 }}>{error}</div>}
        <button onClick={login} style={{ width: '100%', background: '#ff5a00', border: 0, borderRadius: 12, color: '#fff', padding: 15, fontSize: '1rem', fontWeight: 900, cursor: 'pointer' }}>
          Connexion
        </button>
        <div style={{ textAlign: 'center', marginTop: 16 }}>
          <a href="/" style={{ color: '#888', fontSize: '0.85rem' }}>← Retour à la caisse</a>
        </div>
      </div>
    </div>
  );

  // ── Dashboard ──
  return (
    <div className="app">
      <header>
        <div>
          <div className="brand">DINER 66</div>
          <h1>Administration</h1>
          <p>Statistiques & exports</p>
        </div>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
          <button onClick={() => exportExcel(orders)} style={{ background: '#1a6e2e', border: 0, borderRadius: 12, color: '#fff', padding: '12px 18px', fontWeight: 900, cursor: 'pointer', fontSize: '0.9rem' }}>
            📥 Exporter Excel
          </button>
          <button onClick={() => deleteAllOrders(orders, db)} style={{ background: '#3a0a0a', border: '1px solid #ff4444', borderRadius: 12, color: '#ff4444', padding: '12px 18px', fontWeight: 900, cursor: 'pointer', fontSize: '0.9rem' }}>
            🗑 Supprimer l'historique
          </button>
          <a href="/" style={{ background: '#222', border: '1px solid #444', borderRadius: 12, color: '#aaa', padding: '12px 18px', fontWeight: 700, fontSize: '0.9rem', textDecoration: 'none' }}>
            ← Caisse
          </a>
        </div>
      </header>

      {/* Filtre période */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
        {[['jour', "Aujourd'hui"], ['semaine', 'Cette semaine'], ['mois', 'Ce mois'], ['tout', 'Tout']].map(([v, l]) => (
          <button key={v} onClick={() => setPeriod(v)} style={{
            background: period === v ? '#ff5a00' : '#171717',
            border: period === v ? '1px solid #ff5a00' : '1px solid #333',
            borderRadius: 10, color: '#fff', padding: '9px 16px',
            fontWeight: 700, cursor: 'pointer', fontSize: '0.85rem'
          }}>{l}</button>
        ))}
      </div>

      {/* Cartes stats principales */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 14, marginBottom: 28 }}>
        {[
          ['💰', "Chiffre d'affaires", euro(ca)],
          ['🧾', 'Commandes', nbCommandes],
          ['🛒', 'Panier moyen', euro(panierMoyen)],
          ['📅', 'Jours actifs', caParJour.length],
        ].map(([icon, label, val]) => (
          <div key={label} style={{ background: '#171717', border: '1px solid #333', borderRadius: 18, padding: '18px 16px' }}>
            <div style={{ fontSize: '1.5rem', marginBottom: 6 }}>{icon}</div>
            <div style={{ color: '#888', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{label}</div>
            <div style={{ color: '#ff5a00', fontSize: 'clamp(1.2rem, 3vw, 1.6rem)', fontWeight: 900, marginTop: 4 }}>{val}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>

        {/* CA par jour */}
        <div style={{ background: '#171717', border: '1px solid #333', borderRadius: 18, padding: 18 }}>
          <h2 style={{ marginTop: 0, marginBottom: 14 }}>📅 CA par jour</h2>
          {caParJour.length === 0 && <p className="empty">Aucune donnée</p>}
          <div style={{ maxHeight: 320, overflowY: 'auto' }}>
            {caParJour.map(d => (
              <div key={d.date} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid #222' }}>
                <div>
                  <div style={{ fontWeight: 700 }}>{d.date}</div>
                  <div style={{ color: '#888', fontSize: '0.8rem' }}>{d.nb} commande{d.nb > 1 ? 's' : ''}</div>
                </div>
                <div style={{ color: '#ff5a00', fontWeight: 900, fontSize: '1.1rem' }}>{euro(d.ca)}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Articles vendus */}
        <div style={{ background: '#171717', border: '1px solid #333', borderRadius: 18, padding: 18 }}>
          <h2 style={{ marginTop: 0, marginBottom: 14 }}>🍔 Articles vendus</h2>
          {articlesVendus.length === 0 && <p className="empty">Aucune donnée</p>}
          <div style={{ maxHeight: 320, overflowY: 'auto' }}>
            {articlesVendus.map((a, idx) => (
              <div key={a.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '9px 0', borderBottom: '1px solid #222', gap: 8 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1, minWidth: 0 }}>
                  <span style={{ background: idx < 3 ? '#ff5a00' : '#222', color: '#fff', borderRadius: 6, padding: '2px 7px', fontSize: '0.75rem', fontWeight: 900, flexShrink: 0 }}>
                    #{idx + 1}
                  </span>
                  <span style={{ fontSize: '0.88rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{a.name}</span>
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <div style={{ fontWeight: 900, color: '#ff5a00' }}>{a.qty}x</div>
                  <div style={{ color: '#888', fontSize: '0.75rem' }}>{euro(a.ca)}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tableau récap complet commandes */}
      <div style={{ background: '#171717', border: '1px solid #333', borderRadius: 18, padding: 18, marginTop: 20 }}>
        <h2 style={{ marginTop: 0, marginBottom: 14 }}>📋 Toutes les commandes</h2>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #333' }}>
                {['#', 'Date', 'Heure', 'Articles', 'Total', 'Statut'].map(h => (
                  <th key={h} style={{ padding: '10px 12px', color: '#ff5a00', textAlign: 'left', fontWeight: 900, textTransform: 'uppercase', fontSize: '0.75rem', whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(o => (
                <tr key={o._id} style={{ borderBottom: '1px solid #1a1a1a' }}>
                  <td style={{ padding: '10px 12px', fontWeight: 700 }}>#{o.number}</td>
                  <td style={{ padding: '10px 12px', color: '#aaa' }}>{o.date}</td>
                  <td style={{ padding: '10px 12px', color: '#aaa' }}>{o.time}</td>
                  <td style={{ padding: '10px 12px' }}>{o.items.map(i => `${i.qty}× ${i.name}`).join(', ')}</td>
                  <td style={{ padding: '10px 12px', color: '#ff5a00', fontWeight: 900, whiteSpace: 'nowrap' }}>{euro(o.total)}</td>
                  <td style={{ padding: '10px 12px' }}>
                    <span style={{
                      background: o.status === 'À préparer' ? '#3a0a0a' : o.status === 'Prêt' ? '#0a3a0a' : '#1a1a1a',
                      color: o.status === 'À préparer' ? '#ff4444' : o.status === 'Prêt' ? '#44cc44' : '#888',
                      borderRadius: 8, padding: '3px 10px', fontSize: '0.75rem', fontWeight: 700
                    }}>{o.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && <p className="empty">Aucune commande sur cette période</p>}
        </div>
      </div>

      {/* Mobile responsive fixes */}
      <style>{`
        @media(max-width:700px){
          div[style*="grid-template-columns: 1fr 1fr"]{
            grid-template-columns:1fr !important;
          }
        }
      `}</style>
    </div>
  );
}

createRoot(document.getElementById('root')).render(<Admin />);
