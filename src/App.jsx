import React, { useMemo, useState } from 'react';
import { ArrowDown, ArrowRight, Search, MapPin, Menu, X, Play, Camera, Compass, Star, Download, Heart, Instagram, Youtube, Music2, Clock3, Wallet, Route, Send, ChevronRight, Globe2, Mountain, ShieldCheck } from 'lucide-react';
import { supabase, supabaseConfigured } from './supabase';
import IndiaExplorer from './IndiaExplorer';

const destinations = [
  { name:'Varanasi', state:'Uttar Pradesh', type:'Heritage & Culture', days:'2–3 days', cost:'₹3,500–6,000', image:'https://commons.wikimedia.org/wiki/Special:FilePath/View_of_the_ghats_at_Varanasi.jpg?width=1600', imageCredit:'Photo: Vimalinarc · CC BY 4.0', imageSource:'https://commons.wikimedia.org/wiki/File:View_of_the_ghats_at_Varanasi.jpg', description:'A city of ancient ghats, quiet dawns and timeless stories.' },
  { name:'Ujjain', state:'Madhya Pradesh', type:'Spiritual Escape', days:'1–2 days', cost:'₹2,000–4,000', image:'https://commons.wikimedia.org/wiki/Special:FilePath/Mahakaleshwar_Temple%2C_Ujjain.jpg?width=1600', imageCredit:'Photo: Ashverse · CC BY-SA 4.0', imageSource:'https://commons.wikimedia.org/wiki/File:Mahakaleshwar_Temple,_Ujjain.jpg', description:'Temple trails, riverside evenings and a slower rhythm.' },
  { name:'Manali', state:'Himachal Pradesh', type:'Mountains', days:'4–5 days', cost:'₹8,000–14,000', image:'https://commons.wikimedia.org/wiki/Special:FilePath/Mountains%2C_Manali%2C_Himachal_Pradesh.jpg?width=1600', imageCredit:'Photo: Shameer Thajudeen · CC BY-SA 4.0', imageSource:'https://commons.wikimedia.org/wiki/File:Mountains,_Manali,_Himachal_Pradesh.jpg', description:'Mountain air, winding roads and wide-open Himalayan views.' },
  { name:'Goa', state:'Goa', type:'Coast & Slow Travel', days:'3–4 days', cost:'₹6,000–10,000', image:'https://commons.wikimedia.org/wiki/Special:FilePath/Goa-sea-beach.jpg?width=1600', imageCredit:'Photo: Chetanmca10 · CC BY-SA 4.0', imageSource:'https://commons.wikimedia.org/wiki/File:Goa-sea-beach.jpg', description:'Coastal lanes, golden-hour beaches and easy-going days.' },
  { name:'Pench', state:'Madhya Pradesh', type:'Wildlife & Nature', days:'2–3 days', cost:'₹5,000–9,000', image:'https://commons.wikimedia.org/wiki/Special:FilePath/Tiger_at_Pench_National_Park.jpg?width=1600', imageCredit:'Photo: Ranjan Ghosal · CC BY-SA 4.0', imageSource:'https://commons.wikimedia.org/wiki/File:Tiger_at_Pench_National_Park.jpg', description:'Forest trails, wildlife landscapes and a closer look at nature.' },
  { name:'Kashmir', state:'Jammu & Kashmir', type:'Mountains & Lakes', days:'5–7 days', cost:'₹12,000–20,000', image:'https://commons.wikimedia.org/wiki/Special:FilePath/DalLake.jpeg?width=1600', imageCredit:'Wikimedia Commons · CC0 (public domain dedication)', imageSource:'https://commons.wikimedia.org/wiki/File:DalLake.jpeg', description:'Still lakes, dramatic valleys and unforgettable scenery.' }
];

const stories = [
  { title:'Chasing the first light in Varanasi', category:'TRAVEL JOURNAL', read:'6 min read', image:destinations[0].image },
  { title:'A quiet day in the heart of Ujjain', category:'PERSONAL EXPERIENCE', read:'4 min read', image:destinations[1].image },
  { title:'The road is part of the destination', category:'ROAD NOTES', read:'5 min read', image:destinations[2].image }
];

function App(){
  const [query,setQuery] = useState('');
  const [active,setActive] = useState('All');
  const [mobileOpen,setMobileOpen] = useState(false);
  const [review,setReview] = useState({name:'',place:'Varanasi',rating:5,text:''});
  const [submitted,setSubmitted] = useState(false);
  const [localReviews,setLocalReviews] = useState(()=>JSON.parse(localStorage.getItem('ewl-reviews')||'[]'));
  const [toast,setToast] = useState('');
  const [selected,setSelected] = useState(null);

  const categories = ['All','Mountains','Heritage & Culture','Spiritual Escape','Coast & Slow Travel','Wildlife & Nature'];
  const filtered = useMemo(()=>destinations.filter(d=>(active==='All'||d.type===active)&&(`${d.name} ${d.state} ${d.type}`).toLowerCase().includes(query.toLowerCase())),[active,query]);

  const notify = (msg)=>{setToast(msg); setTimeout(()=>setToast(''),2600)};
  const saveReview = async (e)=>{
    e.preventDefault();
    if(!review.name.trim()||!review.text.trim()){notify('Please add your name and review.');return;}
    const item={...review,id:Date.now(),created_at:new Date().toISOString(),status:'pending'};
    if(supabaseConfigured){
      const {error}=await supabase.from('reviews').insert([{name:item.name,destination:item.place,rating:item.rating,body:item.text,status:'pending'}]);
      if(error){notify('Could not submit review. Please try again.');return;}
    } else {
      const next=[item,...localReviews]; setLocalReviews(next); localStorage.setItem('ewl-reviews',JSON.stringify(next));
    }
    setSubmitted(true); setReview({name:'',place:'Varanasi',rating:5,text:''});
    notify('Thanks! Your review has been sent for approval.');
  };
  const downloadPhoto=(d)=>{
    const a=document.createElement('a'); a.href=d.image; a.target='_blank'; a.rel='noreferrer'; a.click();
    notify('Image opened in a new tab. Download availability depends on the image source.');
  };
  const scrollTo=(id)=>{document.getElementById(id)?.scrollIntoView({behavior:'smooth'});setMobileOpen(false)};

  return <div className="site-shell">
    <header className="topbar">
      <a className="brand" href="#"><span className="brand-mark"><img src="/lakshya-compass-logo.svg" alt="Lakshya Travel logo"/></span><span>EXPEDITION <i>WITH LAKSHYA</i></span></a>
      <nav className={mobileOpen?'nav nav-open':'nav'}>
        <button onClick={()=>scrollTo('destinations')}>Destinations</button><button onClick={()=>scrollTo('journal')}>Travel Journal</button><button onClick={()=>scrollTo('gallery')}>Gallery</button><button onClick={()=>scrollTo('community')}>Community</button>
      </nav>
      <button className="nav-cta" onClick={()=>scrollTo('destinations')}>Start exploring <ArrowUpRightIcon/></button>
      <button className="mobile-toggle" aria-label="Toggle menu" onClick={()=>setMobileOpen(!mobileOpen)}>{mobileOpen?<X/>:<Menu/>}</button>
    </header>

    <main>
      <section className="hero">
        <div className="hero-bg"></div><img className="hero-poster" src="/travel-more-worry-less.jpg" alt="Travel more, worry less — Expedition with Lakshya"/><div className="hero-shade"></div>
        <div className="hero-content">
          <div className="eyebrow light"><span></span> A PERSONAL TRAVEL UNIVERSE</div>
          <h1>Go beyond<br/><em>the ordinary.</em></h1>
          <p>Stories from the road, places worth finding, and moments worth keeping. Come explore the world with me.</p>
          <div className="hero-actions"><button className="btn btn-light" onClick={()=>scrollTo('destinations')}>Explore destinations <ArrowRight size={17}/></button><button className="text-link light-link" onClick={()=>scrollTo('journal')}><Play size={15}/> Read my stories</button></div>
          <div className="hero-meta"><span><MapPin size={14}/> Based in India</span><span className="meta-line"></span><span>REAL PLACES. REAL EXPERIENCES.</span></div>
        </div>
        <div className="hero-index"><span>01</span><span className="index-line"></span><span>EXPLORE</span></div>
        <button className="scroll-cue" onClick={()=>scrollTo('intro')}><ArrowDown size={16}/> SCROLL TO DISCOVER</button>
      </section>

      <section className="intro section-wrap" id="intro">
        <div className="intro-label">THE JOURNEY IS YOURS</div>
        <div className="intro-copy"><h2>Not just places.<br/><em>Stories that stay.</em></h2><p>Expedition with Lakshya is my corner of the internet to document journeys, share practical travel guides, and help you plan your own escape. Find inspiration, explore real itineraries and take a little piece of the journey with you.</p><button className="under-link" onClick={()=>scrollTo('about')}>A little about this journey <ArrowRight size={16}/></button></div>
        <div className="intro-stats"><div><strong>01</strong><span>ONE PLANET<br/>TO EXPLORE</span></div><div><strong>∞</strong><span>STORIES<br/>TO DISCOVER</span></div></div>
      </section>

      <IndiaExplorer />

      <section className="dest-section section-wrap" id="destinations">
        <div className="section-heading"><div><div className="eyebrow"><span></span> FIND YOUR NEXT ESCAPE</div><h2>Explore <em>destinations.</em></h2></div><p>From hidden corners to iconic horizons —<br/>where will your curiosity take you?</p></div>
        <div className="search-row"><div className="search-box"><Search size={19}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search a place, state or experience..."/></div><div className="filter-list">{categories.map(c=><button key={c} className={active===c?'filter active':'filter'} onClick={()=>setActive(c)}>{c}</button>)}</div></div>
        <div className="destination-grid">{filtered.map((d,i)=><article className="destination-card" key={d.name} onClick={()=>setSelected(d)}><div className="destination-image"><img src={d.image} alt={`${d.name} travel landscape`} loading="lazy"/><span className="card-number">0{i+1}</span><button className="save-btn" aria-label={`Save ${d.name}`} onClick={e=>{e.stopPropagation();notify(`${d.name} added to your local favourites.`)}}><Heart size={17}/></button><span className="image-caption">{d.type.toUpperCase()}</span>{d.imageCredit&&<a className="photo-credit" href={d.imageSource} target="_blank" rel="noreferrer" onClick={e=>e.stopPropagation()}>{d.imageCredit} · Source</a>}</div><div className="destination-info"><div><h3>{d.name}</h3><span className="place-state"><MapPin size={13}/>{d.state}</span></div><ArrowUpRightIcon/></div><p>{d.description}</p><div className="destination-foot"><span><Clock3 size={13}/>{d.days}</span><span><Wallet size={13}/>{d.cost} approx.</span></div></article>)}</div>
        {filtered.length===0&&<div className="empty-state">No destinations match that search yet. Try another place.</div>}
        <div className="center-action"><span>MORE DESTINATIONS WILL BE ADDED AS THE JOURNEY GROWS</span></div>
      </section>

      <section className="feature-band" id="gallery"><div className="feature-image"></div><div className="feature-content"><div className="eyebrow light"><span></span> THE VISUAL DIARY</div><h2>Every frame<br/>has a <em>feeling.</em></h2><p>A growing collection of travel photographs and videos, organised by destination. Browse the moments, revisit the places and discover a new perspective.</p><button className="btn btn-outline-light" onClick={()=>notify('The full photo and video library will be connected in the next build phase.')}>Explore the gallery <ArrowRight size={16}/></button></div></section>

      <section className="journal-section section-wrap" id="journal"><div className="section-heading"><div><div className="eyebrow"><span></span> NOTES FROM THE ROAD</div><h2>The travel <em>journal.</em></h2></div><p>Honest experiences, useful details<br/>and stories behind the photographs.</p></div><div className="story-grid">{stories.map((s,i)=><article className="story-card" key={s.title}><div className="story-img"><img src={s.image} alt="" loading="lazy"/><span>0{i+1}</span></div><div className="story-meta">{s.category}<span>{s.read}</span></div><h3>{s.title}</h3><button className="under-link" onClick={()=>notify('Travel stories will be managed from the admin content dashboard.')}>Read story <ArrowRight size={15}/></button></article>)}</div></section>

      <section className="planner-band"><div className="planner-icon"><Route size={26}/></div><div><div className="eyebrow light"><span></span> PLAN WITH CONFIDENCE</div><h2>Your next trip,<br/><em>thoughtfully planned.</em></h2><p>Destination guides, day-wise itineraries, budget notes, local recommendations and map links — practical details from a traveller's point of view.</p></div><button className="btn btn-light" onClick={()=>scrollTo('destinations')}>Find a destination <ArrowRight size={16}/></button></section>

      <section className="community-section section-wrap" id="community"><div className="community-intro"><div className="eyebrow"><span></span> THE TRAVELLER COMMUNITY</div><h2>Been there?<br/><em>Tell your story.</em></h2><p>Good travel advice comes from people who've been there. Share a tip, leave a rating or help another traveller see a place differently.</p><div className="community-points"><span><ShieldCheck size={17}/> Reviews are moderated</span><span><Star size={17}/> Rate your experience</span></div></div>
        <form className="review-form" onSubmit={saveReview}><div className="form-head"><div><span>COMMUNITY VOICE</span><h3>Write a review</h3></div><MessageIcon/></div><label>Your name<input value={review.name} onChange={e=>setReview({...review,name:e.target.value})} placeholder="Enter your name" required maxLength="60"/></label><div className="form-split"><label>Destination<select value={review.place} onChange={e=>setReview({...review,place:e.target.value})}>{destinations.map(d=><option key={d.name}>{d.name}</option>)}</select></label><label>Your rating<select value={review.rating} onChange={e=>setReview({...review,rating:Number(e.target.value)})}>{[5,4,3,2,1].map(n=><option value={n}>{n} stars</option>)}</select></label></div><label>Your experience<textarea value={review.text} onChange={e=>setReview({...review,text:e.target.value})} placeholder="What should other travellers know?" rows="4" maxLength="1200" required/></label><button className="btn btn-dark" type="submit">Submit for review <Send size={15}/></button><small>Your review will be visible publicly only after moderation. Please don't share private contact details.</small></form>
      </section>

      {localReviews.length>0&&<section className="recent-reviews section-wrap"><div className="eyebrow"><span></span> YOUR LOCAL PREVIEW</div><h2>Recently <em>submitted.</em></h2><p className="muted">Demo submissions are saved only in this browser until Supabase is configured.</p><div className="review-preview-grid">{localReviews.slice(0,3).map(r=><div className="review-preview" key={r.id}><div className="stars">{'★'.repeat(r.rating)}{'☆'.repeat(5-r.rating)}</div><p>“{r.text}”</p><strong>{r.name}</strong><span>{r.place} · Pending approval</span></div>)}</div></section>}

      <section className="about-strip" id="about"><div className="about-mark"><img src="/lakshya-compass-logo.svg" alt="Lakshya Travel logo"/></div><div><div className="eyebrow light"><span></span> THE PERSON BEHIND THE PASSPORT</div><h2>Hey, I'm <em>Lakshya Shriwas.</em></h2><p>Traveller, storyteller and collector of moments. This is where I share the roads I've taken and help you find your own.</p><div className="owner-contact"><a href="tel:+918602591615">Phone: +91 86025 91615</a><a href="mailto:lakshyashriwas92@gmail.com">Email: lakshyashriwas92@gmail.com</a></div></div><div className="about-social"><span className="instagram-pending">Instagram link coming soon</span></div></section>

      <section className="newsletter section-wrap"><div><div className="eyebrow"><span></span> POSTCARDS FROM THE ROAD</div><h2>Stay close to the <em>journey.</em></h2><p>New destinations, stories and travel inspiration — whenever there's something worth sharing.</p></div><button className="btn btn-dark" onClick={()=>notify('Newsletter signup will be enabled in a later phase.')}>Coming soon <ArrowRight size={16}/></button></section>
    </main>
    <footer><a className="brand footer-brand" href="#"><span className="brand-mark"><img src="/lakshya-compass-logo.svg" alt="Lakshya Travel logo"/></span><span>EXPEDITION <i>WITH LAKSHYA</i></span></a><span>© {new Date().getFullYear()} Expedition with Lakshya · Owner: Lakshya Shriwas · <a href="tel:+918602591615">8602591615</a> · <a href="mailto:lakshyashriwas92@gmail.com">Email</a></span><button onClick={()=>window.scrollTo({top:0,behavior:'smooth'})}>BACK TO TOP ↑</button></footer>

    {selected&&<div className="modal-backdrop" onClick={()=>setSelected(null)}><div className="destination-modal" onClick={e=>e.stopPropagation()}><button className="modal-close" onClick={()=>setSelected(null)}><X/></button><img src={selected.image} alt={selected.name}/><div className="modal-body"><div className="eyebrow"><span></span>{selected.type}</div><h2>{selected.name}</h2><p>{selected.description}</p><div className="modal-facts"><span><Clock3 size={15}/>{selected.days}</span><span><Wallet size={15}/>{selected.cost}</span></div><p className="muted">This destination page will be expanded with Lakshya's own photos, verified itinerary, local tips and community reviews.</p><button className="btn btn-dark" onClick={()=>{setSelected(null);scrollTo('community')}}>Share your experience <ArrowRight size={15}/></button></div></div></div>}
    {toast&&<div className="toast">{toast}</div>}
  </div>
}

function ArrowUpRightIcon(){return <ArrowRight size={17} className="arrow-up-right"/>}
function MessageIcon(){return <span className="message-icon">“</span>}
export default App;