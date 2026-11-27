import React, { useEffect, useMemo, useState } from 'react';
import { MapPin, Search, ExternalLink, Compass } from 'lucide-react';
import { indiaDirectory } from './indiaDirectory';

export default function IndiaExplorer(){
  const [stateName,setStateName]=useState('Madhya Pradesh');
  const [cityName,setCityName]=useState('Bhopal');
  const [query,setQuery]=useState('');
  const [photos,setPhotos]=useState({});
  const state=indiaDirectory.find(s=>s.state===stateName)||indiaDirectory[0];
  const city=state.cities.find(c=>c.name===cityName)||state.cities[0];
  const places=useMemo(()=>city.places.filter(p=>p.toLowerCase().includes(query.toLowerCase())),[city,query]);

  useEffect(()=>{
    setCityName(state.cities[0].name);
    setQuery('');
  },[stateName]);

  useEffect(()=>{
    let cancelled=false;
    async function load(){
      const missing=places.filter(p=>!photos[p]);
      for(const place of missing){
        try{
          const response=await fetch('https://en.wikipedia.org/api/rest_v1/page/summary/'+encodeURIComponent(place));
          if(!response.ok) continue;
          const data=await response.json();
          if(!cancelled) setPhotos(old=>({...old,[place]:{image:data.originalimage?.source||data.thumbnail?.source||'',url:data.content_urls?.desktop?.page||'https://en.wikipedia.org/wiki/'+encodeURIComponent(place),description:data.extract||'',imageSource:'Wikipedia article'}}));
        }catch(e){ /* Keep the clean fallback card if Wikipedia is unavailable. */ }
      }
    }
    if(places.length) load();
    return ()=>{cancelled=true;};
  },[places]);

  return <section className="india-explorer section-wrap" id="india-explorer">
    <div className="section-heading"><div><div className="eyebrow"><span/> EXPLORE THE COUNTRY</div><h2>Discover <em>India.</em></h2></div><p>Choose a state, explore its cities<br/>and find places worth visiting.</p></div>
    <div className="india-explorer-controls">
      <label>SELECT STATE / UNION TERRITORY<select value={stateName} onChange={e=>setStateName(e.target.value)}>{indiaDirectory.map(s=><option key={s.state} value={s.state}>{s.state}</option>)}</select></label>
      <label>SELECT CITY / REGION<select value={cityName} onChange={e=>setCityName(e.target.value)}>{state.cities.map(c=><option key={c.name} value={c.name}>{c.name}</option>)}</select></label>
      <div className="india-search"><Search size={17}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search tourist places..."/></div>
    </div>
    <div className="india-location-heading"><div><span><MapPin size={15}/>{stateName}</span><h3>{cityName}</h3></div><small>{places.length} featured places</small></div>
    <div className="india-place-grid">{places.map(place=>{
      const photo=photos[place];
      return <article className="india-place-card" key={place}>
        <a className="india-place-photo" href={photo?.url||'https://en.wikipedia.org/wiki/'+encodeURIComponent(place)} target="_blank" rel="noreferrer">
          {photo?.image?<img src={photo.image} alt={place} loading="lazy"/>:<div className="india-photo-placeholder"><Compass size={30}/><span>PHOTO LOADING</span></div>}
          <span className="india-photo-open"><ExternalLink size={14}/></span>
        </a>
        <div className="india-place-info"><h4>{place}</h4><span>{cityName}, {stateName}</span><a href={photo?.url||'https://en.wikipedia.org/wiki/'+encodeURIComponent(place)} target="_blank" rel="noreferrer">Photo source & place details ↗</a></div>
      </article>;
    })}</div>
    {!places.length&&<p className="india-no-results">No matching places in this city yet.</p>}
    <p className="india-data-note">This is the first curated directory release, covering all 36 States and Union Territories with featured cities and attractions. More cities and local places can be added continuously. Photos load from matching Wikipedia place pages when an image is available.</p>
  </section>;
}
