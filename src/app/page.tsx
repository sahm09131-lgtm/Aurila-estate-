"use client";

import Link from "next/link";
import { FormEvent, useMemo, useState } from "react";
import { properties } from "@/lib/properties";

export default function Home() {
  const [query, setQuery] = useState("");
  const [intent, setIntent] = useState("All");
  const [type, setType] = useState("All types");
  const [maxPrice, setMaxPrice] = useState("");
  const [sort, setSort] = useState("featured");
  const [saved, setSaved] = useState<string[]>([]);
  const [compare, setCompare] = useState<string[]>([]);
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState(false);
  const filtered = useMemo(() => properties.filter((p) => {
    const matchesText = `${p.title} ${p.location} ${p.region}`.toLowerCase().includes(query.toLowerCase());
    return matchesText && (intent === "All" || p.intent === intent) && (type === "All types" || p.type === type) && (!maxPrice || p.price <= Number(maxPrice));
  }).sort((a, b) => sort === "price-low" ? a.price - b.price : sort === "price-high" ? b.price - a.price : 0), [query, intent, type, maxPrice, sort]);

  async function submitInquiry(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true); setNotice("");
    const form = new FormData(event.currentTarget);
    try {
      const response = await fetch("/api/inquiries", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(Object.fromEntries(form)) });
      const result = await response.json(); setNotice(result.message || result.error);
      if (response.status === 202) event.currentTarget.reset();
    } catch { setNotice("Could not reach the demo server. Please try again."); }
    finally { setBusy(false); }
  }
  const toggle = (list: string[], slug: string, setter: (next: string[]) => void, limit?: number) => {
    if (list.includes(slug)) setter(list.filter((item) => item !== slug));
    else if (!limit || list.length < limit) setter([...list, slug]);
    else setNotice(`You can compare up to ${limit} properties.`);
  };

  return <>
    <header className="site-header"><Link className="brand" href="/">AURELIA <span>ESTATES</span></Link><nav className="desktop-nav"><a href="#properties">Properties</a><a href="#story">Our perspective</a><a href="#enquire">Enquire</a></nav><a className="header-cta" href="#enquire">Private consultation <span>↗</span></a><a className="mobile-cta" href="#properties" aria-label="Explore properties">Explore ↓</a></header>
    <main>
      <section className="hero"><div className="hero-image"/><div className="hero-shade"/><div className="hero-copy"><p className="eyebrow light">A MORE CONSIDERED WAY TO FIND HOME</p><h1>Property,<br/><em>considered.</em></h1><p className="hero-text">A considered collection of distinctive homes in places worth knowing.</p><a className="hero-link" href="#properties">Discover the collection <span>↓</span></a></div><div className="hero-index"><span>01</span><i/> AURELIA / INTERNATIONAL</div><div className="demo-ribbon">DEMO EXPERIENCE · SAMPLE LISTINGS</div></section>
      <section id="properties" className="collection section-wrap"><div className="section-heading"><div><p className="eyebrow">A CURATED COLLECTION</p><h2>Places with <em>presence.</em></h2></div><p className="section-intro">Explore illustrative properties chosen to show how the Aurelia collection can be experienced. All listings below are fictional demo content.</p></div>
        <div className="search-panel"><label className="search-field"><span>LOCATION OR PROPERTY</span><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Try Lisbon, Capri…" aria-label="Search location or property"/></label><label><span>INTENT</span><select value={intent} onChange={(e) => setIntent(e.target.value)}><option>All</option><option>Buy</option><option>Rent</option></select></label><label><span>PROPERTY TYPE</span><select value={type} onChange={(e) => setType(e.target.value)}><option>All types</option><option>Villa</option><option>Apartment</option><option>Townhouse</option></select></label><label><span>MAX PRICE (€)</span><input type="number" min="0" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} placeholder="No limit" aria-label="Maximum price in euros"/></label><button className="search-button" onClick={() => document.getElementById("listing-grid")?.scrollIntoView({ behavior: "smooth" })}>Explore <span>↗</span></button></div>
        <div className="results-tools"><p>{filtered.length} illustrative {filtered.length === 1 ? "property" : "properties"}</p><div>{compare.length > 0 && <span className="compare-count">Comparing {compare.length}</span>}<label className="sort-label">SORT <select value={sort} onChange={(e) => setSort(e.target.value)}><option value="featured">Featured</option><option value="price-low">Price: low to high</option><option value="price-high">Price: high to low</option></select></label></div></div>
        <div id="listing-grid" className="property-grid">{filtered.map((p, index) => <article className="property-card" key={p.slug}><Link className="property-image" href={`/properties/${p.slug}`} style={{ backgroundImage: `url('${p.image}')` }} aria-label={`View ${p.title}`}><span className="property-tag">{p.tag}</span></Link><button className={`save-button ${saved.includes(p.slug) ? "is-saved" : ""}`} onClick={() => toggle(saved, p.slug, setSaved)} aria-label={saved.includes(p.slug) ? "Remove saved property" : "Save property"}>{saved.includes(p.slug) ? "♥" : "♡"}</button><div className="card-info"><div className="card-kicker"><span>{p.location}</span><span>{p.intent}</span></div><Link href={`/properties/${p.slug}`} className="property-title">{p.title}</Link><div className="property-specs"><span>{p.beds} BED</span><span>{p.baths} BATH</span><span>{p.area} M²</span></div><div className="card-bottom"><strong>{p.priceLabel}</strong><button className={`compare-button ${compare.includes(p.slug) ? "active" : ""}`} onClick={() => toggle(compare, p.slug, setCompare, 3)}>{compare.includes(p.slug) ? "✓ Added" : "+ Compare"}</button></div></div></article>)}</div>
        {filtered.length === 0 && <div className="empty-state"><span>○</span><h3>No matching demo properties</h3><p>Try a different location or adjust your filters.</p><button className="text-button" onClick={() => {setQuery("");setIntent("All");setType("All types");setMaxPrice("");}}>Clear filters ↗</button></div>}
        {compare.length > 0 && <aside className="compare-tray"><span><b>{compare.length}</b> selected to compare <small>{compare.map((s) => properties.find((p) => p.slug === s)?.title).join(" · ")}</small></span><button onClick={() => setCompare([])}>Clear comparison ×</button></aside>}
      </section>
      <section className="manifesto" id="story"><div className="manifesto-image"/><div className="manifesto-copy"><p className="eyebrow light">AURELIA ESTATES · INTRODUCTION</p><h2>Good property<br/>is about <em>belonging.</em></h2><p>Finding the right address takes more than a search. It asks for local understanding, thoughtful advice and a clear sense of what matters to you.</p><a href="#enquire" className="hero-link">Start a conversation <span>↗</span></a></div></section>
      <section className="enquire section-wrap" id="enquire"><div><p className="eyebrow">BEGIN A CONVERSATION</p><h2>Tell us what<br/><em>you have in mind.</em></h2><p className="form-note">This demo form validates submissions locally and does not send or store information.</p></div><form className="inquiry-form" onSubmit={submitInquiry}><label>Your name<input name="name" required minLength={2} maxLength={100} placeholder="Full name"/></label><label>Email address<input name="email" required type="email" maxLength={254} placeholder="you@example.com"/></label><label>What are you looking for?<textarea name="message" required minLength={10} maxLength={2000} rows={4} placeholder="A little about the property or place you have in mind…"/></label><button className="button button-dark" disabled={busy}>{busy ? "Sending…" : "Send enquiry"} <span>↗</span></button>{notice && <p className="form-feedback" role="status">{notice}</p>}</form></section>
    </main>
    <footer className="footer"><Link className="brand" href="/">AURELIA <span>ESTATES</span></Link><p>Property, considered.</p><span>DEMO SITE · SAMPLE LISTINGS ONLY</span><a href="mailto:hello@example.com">Contact ↗</a></footer>
  </>;
}
