import React, { useEffect, useMemo, useState } from 'react';
import { MapPin, Search, ExternalLink, Compass, RefreshCw } from 'lucide-react';
import { indiaDirectory } from './indiaDirectory';
import { cityGuides } from './cityGuides';

const commonsApi = 'https://commons.wikimedia.org/w/api.php';

async function findCommonsPhoto(place, cityName, stateName) {
  const params = new URLSearchParams({
    action: 'query',
    generator: 'search',
    gsrsearch: `filetype:bitmap "${place}" "${cityName}" "${stateName}"`,
    gsrnamespace: '6',
    gsrlimit: '1',
    prop: 'imageinfo',
    iiprop: 'url',
    iiurlwidth: '900',
    format: 'json',
    formatversion: '2',
    origin: '*'
  });
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 12000);
  try {
    const response = await fetch(`${commonsApi}?${params.toString()}`, {
      signal: controller.signal,
      headers: { Accept: 'application/json' }
    });
    if (!response.ok) throw new Error('Commons image search failed');
    const data = await response.json();
    const page = data.query?.pages?.find(item => item.imageinfo?.[0]?.thumburl || item.imageinfo?.[0]?.url);
    const image = page?.imageinfo?.[0]?.thumburl || page?.imageinfo?.[0]?.url;
    if (!image) throw new Error('No matching Commons photo');
    return image;
  } finally {
    clearTimeout(timeout);
  }
}

export default function IndiaExplorer(){
  const [stateName,setStateName]=useState('Madhya Pradesh');
  const [cityName,setCityName]=useState('Bhopal');
  const [query,setQuery]=useState('');
  const [photos,setPhotos]=useState({});
  const [photoStatus,setPhotoStatus]=useState({});
  const state=indiaDirectory.find(s=>s.state===stateName)||indiaDirectory[0];
  const city=state.cities.find(c=>c.name===cityName)||state.cities[0];
  const places=useMemo(()=>city.places.filter(p=>p.toLowerCase().includes(query.toLowerCase())),[city,query]);
  const guide=cityGuides[cityName];

  useEffect(()=>{
    setCityName(state.cities[0].name);
    setQuery('');
  },[stateName]);

  useEffect(()=>{
    let cancelled=false;
    const pending=places.filter(place=>!photos[place] && photoStatus[place]!=='unavailable');
    pending.forEach(place=>setPhotoStatus(old=>({...old,[place]:'loading'})));
    async function load(){
      await Promise.allSettled(pending.map(async place=>{
        try{
          const image=await findCommonsPhoto(place,cityName,stateName);
          if(!cancelled){
            setPhotos(old=>({...old,[place]:{image}}));
            setPhotoStatus(old=>({...old,[place]:'ready'}));
          }
        }catch{
          if(!cancelled) setPhotoStatus(old=>({...old,[place]:'unavailable'}));
        }
      }));
    }
    if(pending.length) load();
    return ()=>{cancelled=true;};
  },[places,cityName,stateName]);

  const retryPhoto=async place=>{
    setPhotoStatus(old=>({...old,[place]:'loading'}));
    try{
      const image=await findCommonsPhoto(place,cityName,stateName);
      setPhotos(old=>({...old,[place]:{image}}));
      setPhotoStatus(old=>({...old,[place]:'ready'}));
    }catch{setPhotoStatus(old=>({...old,[place]:'unavailable'}));}
  };

  return <section className="india-explorer section-wrap" id="india-explorer">
    <div className="section-heading"><div><div className="eyebrow"><span/> EXPLORE THE COUNTRY</div><h2>Discover <em>India.</em></h2></div><p>Choose a state, explore its cities<br/>and find places worth visiting.</p></div>
    <div className="india-explorer-controls">
      <label>SELECT STATE / UNION TERRITORY<select value={stateName} onChange={e=>setStateName(e.target.value)}>{indiaDirectory.map(s=><option key={s.state} value={s.state}>{s.state}</option>)}</select></label>
      <label>SELECT CITY / REGION<select value={cityName} onChange={e=>setCityName(e.target.value)}>{state.cities.map(c=><option key={c.name} value={c.name}>{c.name}</option>)}</select></label>
      <div className="india-search"><Search size={17}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search tourist places..."/></div>
    </div>
    <div className="india-location-heading"><div><span><MapPin size={15}/>{stateName}</span><h3>{cityName}</h3></div><small>{places.length} featured places</small></div>
    {guide?<div className="india-city-guide">
      <p className="india-guide-overview">{guide.overview}</p>
      <div className="india-guide-columns">
        <div><h4>Best time to visit</h4><p>{guide.bestTime}</p></div>
        <div><h4>How to reach</h4><ul>{guide.howToReach.map(item=><li key={item}>{item}</li>)}</ul></div>
        <div><h4>Top attractions</h4><ul>{guide.highlights.map(item=><li key={item}>{item}</li>)}</ul></div>
        <div><h4>Nearby places</h4><p>{guide.nearby.join(" · ")}</p></div>
      </div>
      <a className="india-guide-source" href={guide.source} target="_blank" rel="noreferrer">Source: Madhya Pradesh Tourism ↗</a>
    </div>:<p className="india-guide-pending">Detailed travel guide for {cityName} is being researched and will be added here. Place listings and map links are already available.</p>}
    <div className="india-place-grid">{places.map(place=>{
      const photo=photos[place];
      const status=photoStatus[place]||'loading';
      const mapUrl='https://www.google.com/maps/search/?api=1&query='+encodeURIComponent(place+', '+cityName+', '+stateName);
      return <article className="india-place-card" key={place}>
        <a className="india-place-photo" href={mapUrl} target="_blank" rel="noreferrer">
          {photo?.image?<img src={photo.image} alt={place} loading="lazy" onError={()=>{setPhotos(old=>{const next={...old};delete next[place];return next;});setPhotoStatus(old=>({...old,[place]:'unavailable'}));}}/>:
            <div className={'india-photo-placeholder '+(status==='unavailable'?'is-unavailable':'')}>
              <Compass size={30}/><span>{status==='unavailable'?'PHOTO NOT AVAILABLE':'SEARCHING FOR PHOTO'}</span>
              {status==='unavailable'&&<small>No matching public photo found. Map details are still available.</small>}
            </div>}
          <span className="india-photo-open"><ExternalLink size={14}/></span>
        </a>
        <div className="india-place-info"><h4>{place}</h4><span>{cityName}, {stateName}</span>
          <a href={mapUrl} target="_blank" rel="noreferrer">Map & directions ↗</a>
          {status==='unavailable'&&<button className="india-photo-retry" type="button" onClick={()=>retryPhoto(place)}><RefreshCw size={12}/> Search photo again</button>}
        </div>
      </article>;
    })}</div>
    {!places.length&&<p className="india-no-results">No matching places in this city yet.</p>}
    <p className="india-data-note">Photos are searched from Wikimedia Commons, not Wikipedia articles. A matching image is shown only when one is found; otherwise the destination and map links remain available. Always confirm local timings, transport and access rules before travelling.</p>
  </section>;
}
