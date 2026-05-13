/* ══════════════════════════════════════════
   DINER 66 — CSS responsive complet
   Base: mobile-first
   ══════════════════════════════════════════ */

/* ── Reset & base ── */
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

html {
  font-size: 16px;          /* base pour rem */
  -webkit-text-size-adjust: 100%;  /* évite zoom auto iOS */
}

body {
  background: #070707;
  color: #fff;
  font-family: Arial, Helvetica, sans-serif;
  line-height: 1.4;
  overflow-x: hidden;
}

/* ── App shell ── */
.app {
  max-width: 1400px;
  margin: 0 auto;
  padding: 16px 16px 100px; /* bottom = place pour la barre mobile */
}

/* ══════════════════════════════════════════
   HEADER
   ══════════════════════════════════════════ */
header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.brand {
  color: #ff5a00;
  font-weight: 900;
  font-size: 1rem;
  text-transform: uppercase;
  letter-spacing: 2px;
}

h1 {
  font-size: clamp(1.4rem, 5vw, 2.6rem);
  font-weight: 900;
  color: #fff;
  margin: 4px 0 2px;
}

header p {
  color: #888;
  font-size: 0.85rem;
}

.stat {
  background: #171717;
  border: 1px solid #333;
  border-radius: 18px;
  padding: 14px 18px;
  display: flex;
  gap: 10px;
  align-items: center;
  white-space: nowrap;
  flex-shrink: 0;
}

.stat b {
  font-size: clamp(1.4rem, 4vw, 2rem);
  color: #ff5a00;
  display: block;
}

.stat small {
  color: #888;
  font-size: 0.75rem;
}

/* ══════════════════════════════════════════
   LAYOUT DESKTOP : menu + panier côte à côte
   ══════════════════════════════════════════ */
.layout {
  display: grid;
  grid-template-columns: 1fr 400px;
  gap: 24px;
  align-items: start;
}

/* ══════════════════════════════════════════
   MENU — catégories & items
   ══════════════════════════════════════════ */
h2 {
  color: #ff5a00;
  font-weight: 900;
  text-transform: uppercase;
  font-size: clamp(0.85rem, 2.5vw, 1rem);
  letter-spacing: 1px;
  margin: 20px 0 10px;
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: 10px;
}

.item {
  background: #171717;
  color: #fff;
  border: 1px solid #2a2a2a;
  border-radius: 16px;
  padding: 14px;
  text-align: left;
  width: 100%;
  min-height: 80px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  cursor: pointer;
  transition: border-color .15s, transform .1s;
}

.item:active { transform: scale(.97); border-color: #ff5a00; }

.item strong {
  font-size: clamp(0.8rem, 2vw, 0.95rem);
  line-height: 1.3;
  color: #fff;
}

.item span {
  display: block;
  color: #ff5a00;
  font-size: clamp(1rem, 2.5vw, 1.25rem);
  font-weight: 900;
  margin-top: 8px;
}

/* ══════════════════════════════════════════
   PANIER (aside)
   ══════════════════════════════════════════ */
aside {
  position: sticky;
  top: 16px;
  background: #171717;
  border: 1px solid #333;
  border-radius: 20px;
  padding: 18px;
}

.cart { margin: 10px 0; }

.row {
  display: grid;
  grid-template-columns: 1fr 42px 28px 42px;
  gap: 8px;
  align-items: center;
  background: #0d0d0d;
  border-radius: 12px;
  padding: 10px 12px;
  margin: 6px 0;
}

.row b { font-size: 0.9rem; }
.row small { display: block; color: #888; font-size: 0.75rem; margin-top: 2px; }

.row button {
  border: 0;
  border-radius: 10px;
  padding: 0;
  width: 42px;
  height: 42px;
  font-weight: 900;
  background: #2a2a2a;
  color: #fff;
  font-size: 1.2rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.row button:active { background: #ff5a00; }

.total {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top: 1px solid #333;
  margin-top: 12px;
  padding-top: 14px;
}

.total span { font-size: 1rem; color: #aaa; }
.total b { font-size: clamp(1.5rem, 4vw, 2rem); color: #ff5a00; }

.validate {
  width: 100%;
  border: 0;
  border-radius: 14px;
  background: #ff5a00;
  color: #fff;
  padding: 16px;
  font-size: clamp(1rem, 3vw, 1.1rem);
  font-weight: 900;
  margin-top: 12px;
  cursor: pointer;
  transition: opacity .15s;
}

.validate:active { opacity: .85; }

.clear {
  width: 100%;
  border: 1px solid #333;
  border-radius: 14px;
  background: #111;
  color: #aaa;
  padding: 12px;
  margin-top: 8px;
  font-size: 0.9rem;
  cursor: pointer;
}

.empty { color: #555; text-align: center; padding: 20px; font-size: 0.9rem; }

/* ══════════════════════════════════════════
   ARTICLE PERSONNALISÉ
   ══════════════════════════════════════════ */
.custom-item {
  background: #0d0d0d;
  border: 1px dashed #ff5a00;
  border-radius: 14px;
  padding: 12px;
  margin: 12px 0;
}

.custom-title {
  color: #ff5a00;
  font-weight: 900;
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 10px;
}

.custom-row {
  display: grid;
  grid-template-columns: 1fr 90px 46px;
  gap: 8px;
  align-items: center;
}

.custom-input {
  background: #050505;
  color: #fff;
  border: 1px solid #444;
  border-radius: 10px;
  padding: 11px 10px;
  font-size: 0.9rem;
  width: 100%;
}

.custom-input::placeholder { color: #555; }

.custom-add-btn {
  background: #ff5a00;
  color: #fff;
  border: 0;
  border-radius: 10px;
  font-size: 1.4rem;
  font-weight: 900;
  width: 46px;
  height: 46px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.custom-add-btn:active { transform: scale(.95); }

/* ══════════════════════════════════════════
   RECAP CA
   ══════════════════════════════════════════ */
.recap {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 14px;
  margin: 24px 0;
}

.recap div {
  background: #171717;
  border: 1px solid #333;
  border-radius: 18px;
  padding: 16px;
}

.recap span { color: #888; font-size: 0.85rem; }

.recap b {
  display: block;
  color: #ff5a00;
  font-size: clamp(1.2rem, 3vw, 1.8rem);
  font-weight: 900;
  margin-top: 6px;
}

/* ══════════════════════════════════════════
   COMMANDES / HISTORIQUE
   ══════════════════════════════════════════ */
.order {
  background: #171717;
  border: 1px solid #2a2a2a;
  border-radius: 18px;
  padding: 16px;
  display: flex;
  justify-content: space-between;
  gap: 14px;
  margin: 10px 0;
}

.order b { font-size: 1.1rem; }
.order p { color: #888; font-size: 0.82rem; margin: 4px 0; }
.order small { color: #ccc; font-size: 0.85rem; line-height: 1.6; }

/* ── Statuts ── */
.status-btn {
  border-radius: 10px;
  padding: 10px 14px;
  font-weight: 900;
  font-size: 0.85rem;
  white-space: nowrap;
  cursor: pointer;
  display: inline-block;
  border: 0;
}

.status-preparer { background: #3a0a0a; color: #ff4444; border: 1px solid #ff4444 !important; }
.status-pret     { background: #0a3a0a; color: #44cc44; border: 1px solid #44cc44 !important; }
.status-archive  { background: #1a1a1a; color: #666;    border: 1px solid #333 !important; }

/* ── Bouton impression ── */
.print-btn {
  background: #1e1e1e;
  border: 1px solid #444;
  border-radius: 10px;
  color: #ccc;
  padding: 8px 14px;
  font-size: 0.85rem;
  font-weight: 700;
  cursor: pointer;
  white-space: nowrap;
}

.print-btn:active { background: #333; }

/* ── Badge onglet ── */
.tab-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: #ff5a00;
  color: #fff;
  border-radius: 999px;
  font-size: 0.65rem;
  font-weight: 900;
  min-width: 16px;
  height: 16px;
  padding: 0 4px;
  margin-left: 4px;
  vertical-align: middle;
}

/* ── Barre onglets mobile (cachée sur desktop) ── */
.mobile-tabs { display: none; }

/* ══════════════════════════════════════════
   TABLETTE  768px – 1100px
   ══════════════════════════════════════════ */
@media (max-width: 1100px) {
  .layout {
    grid-template-columns: 1fr;
  }

  aside {
    position: static;
  }

  .grid {
    grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  }

  .recap {
    grid-template-columns: repeat(3, 1fr);
  }
}

/* ══════════════════════════════════════════
   MOBILE  ≤ 700px
   ══════════════════════════════════════════ */
@media (max-width: 700px) {

  /* ── App shell ── */
  .app {
    padding: 12px 12px 90px;
  }

  /* ── Header compact ── */
  header {
    flex-direction: row;
    flex-wrap: wrap;
    align-items: center;
    gap: 10px;
    margin-bottom: 14px;
  }

  header > div:first-child { flex: 1; min-width: 0; }

  h1 { font-size: 1.5rem; }

  .stat {
    padding: 10px 14px;
    border-radius: 14px;
  }

  .stat b { font-size: 1.4rem; }

  /* ── Barre d'onglets fixée en bas ── */
  .mobile-tabs {
    display: flex;
    position: fixed;
    bottom: 0; left: 0; right: 0;
    background: #111;
    border-top: 2px solid #ff5a00;
    z-index: 200;
    safe-area-inset-bottom: env(safe-area-inset-bottom);
    padding-bottom: env(safe-area-inset-bottom, 0px);
  }

  .mobile-tabs button {
    flex: 1;
    background: none;
    border: 0;
    color: #555;
    padding: 10px 4px 8px;
    font-size: 0.62rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.3px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 3px;
    transition: color .15s;
    cursor: pointer;
    -webkit-tap-highlight-color: transparent;
  }

  .mobile-tabs button .tab-icon { font-size: 1.3rem; }
  .mobile-tabs button.active { color: #ff5a00; }
  .mobile-tabs button.active .tab-icon { transform: scale(1.15); }

  /* ── Sections : tout caché par défaut, affiché selon onglet ── */
  .section-menu,
  .section-panier,
  .section-commandes,
  .section-recap,
  .section-historique { display: none !important; }

  .show-menu       .section-menu       { display: block !important; }
  .show-panier     .section-panier     { display: block !important; }
  .show-commandes  .section-commandes  { display: block !important; }
  .show-historique .section-recap      { display: block !important; }
  .show-historique .section-historique { display: block !important; }

  /* ── Layout ── */
  .layout { grid-template-columns: 1fr; gap: 0; }
  aside { position: static; border-radius: 0; border: none; padding: 0; background: transparent; }

  /* ── Grille items : 2 colonnes bien remplies ── */
  .grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 8px;
  }

  .item {
    min-height: 72px;
    padding: 12px;
    border-radius: 14px;
  }

  .item strong { font-size: 0.82rem; }
  .item span   { font-size: 1rem; margin-top: 6px; }

  /* ── h2 sections ── */
  h2 { font-size: 0.8rem; margin: 16px 0 8px; }

  /* ── Panier rows ── */
  .row {
    grid-template-columns: 1fr 40px 26px 40px;
    gap: 6px;
    padding: 10px;
  }

  .row b    { font-size: 0.85rem; }
  .row button { width: 40px; height: 40px; font-size: 1.1rem; border-radius: 8px; }

  .total b  { font-size: 1.6rem; }
  .validate { padding: 15px; font-size: 1rem; border-radius: 12px; }
  .clear    { padding: 11px; font-size: 0.85rem; }

  /* ── Recap CA : 1 colonne ── */
  .recap {
    grid-template-columns: 1fr;
    gap: 8px;
    margin: 14px 0;
  }

  .recap div  { padding: 14px; border-radius: 14px; }
  .recap b    { font-size: 1.4rem; }
  .recap span { font-size: 0.8rem; }

  /* ── Commandes / historique ── */
  .order {
    flex-direction: column;
    gap: 10px;
    padding: 14px;
    border-radius: 14px;
    margin: 8px 0;
  }

  .order > div:last-child {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 8px;
  }

  .order b    { font-size: 1rem; }
  .order small { font-size: 0.82rem; }

  .status-btn { padding: 9px 12px; font-size: 0.8rem; }
  .print-btn  { padding: 9px 12px; font-size: 0.8rem; }

  /* ── Article personnalisé ── */
  .custom-row {
    grid-template-columns: 1fr 80px 42px;
    gap: 6px;
  }

  .custom-input { padding: 10px 8px; font-size: 0.85rem; }
  .custom-add-btn { width: 42px; height: 42px; font-size: 1.2rem; }
}

/* ══════════════════════════════════════════
   TRÈS PETIT MOBILE  ≤ 380px  (iPhone SE…)
   ══════════════════════════════════════════ */
@media (max-width: 380px) {
  h1 { font-size: 1.25rem; }

  .grid { grid-template-columns: repeat(2, 1fr); gap: 6px; }

  .item { min-height: 64px; padding: 10px; }
  .item strong { font-size: 0.75rem; }
  .item span   { font-size: 0.9rem; }

  .row { grid-template-columns: 1fr 36px 24px 36px; gap: 5px; padding: 8px; }
  .row button { width: 36px; height: 36px; }

  .mobile-tabs button { font-size: 0.55rem; padding: 8px 2px 6px; }
  .mobile-tabs button .tab-icon { font-size: 1.15rem; }
}

/* ══════════════════════════════════════════
   IMPRESSION
   ══════════════════════════════════════════ */
@media print {
  body * { visibility: hidden; }
  .ticket, .ticket * { visibility: visible; }
  .ticket { position: absolute; left: 0; top: 0; }
}
