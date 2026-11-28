import React, { useEffect, useMemo, useState } from 'react';
import { MapPin, Search, ExternalLink, Compass, RefreshCw } from 'lucide-react';
import { indiaDirectory } from './indiaDirectory';

export default function IndiaExplorer(){
  const [stateName,setStateName]=useState('Madhya Pradesh');
  const [cityName,setCityName]=useState('Bhopal');
  const [query,setQuery]=useState('');
  const [photos,setPhotos]=useState({});
  const [placeDetails,setPlaceDetails]=useState({});
  const [photoStatus,setPhotoStatus]=useState({});
  const state=indiaDirectory.find(s=>s.state===stateName)||indiaDirectory[0];
  const city=state.cities.find(c=>c.name===cityName)||state.cities[0];
  const places=useMemo(()=>city.places.filter(p=>p.toLowerCase().includes(query.toLowerCase())),[city,query]);

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
          const response=await fetch('https://en.wikipedia.org/api/rest_v1/page/summary/'+encodeURIComponent(place));
          if(!response.ok) throw new Error('No article image');
          const data=await response.json();
          const image=data.originalimage?.source||data.thumbnail?.source||'';
          if(!cancelled){
            setPlaceDetails(old=>({...old,[place]:data.extract||''}));
            if(image){
              setPhotos(old=>({...old,[place]:{image,imageSource:'Wikipedia article'}}));
              setPhotoStatus(old=>({...old,[place]:'ready'}));
            }else{
              setPhotoStatus(old=>({...old,[place]:'unavailable'}));
            }
          }
        }catch{
          if(!cancelled) setPhotoStatus(old=>({...old,[place]:'unavailable'}));
        }
      }));
    }
    if(pending.length) load();
    return ()=>{cancelled=true;};
  },[places]);

  const retryPhoto=async place=>{
    setPhotoStatus(old=>({...old,[place]:'loading'}));
    try{
      const response=await fetch('https://en.wikipedia.org/api/rest_v1/page/summary/'+encodeURIComponent(place));
      if(!response.ok) throw new Error('No image');
      const data=await response.json();
      const image=data.originalimage?.source||data.thumbnail?.source||'';
      setPlaceDetails(old=>({...old,[place]:data.extract||''}));
      if(!image) throw new Error('No image');
      setPhotos(old=>({...old,[place]:{image,imageSource:'Wikipedia article'}}));
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
    <div className="india-place-grid">{places.map(place=>{
      const photo=photos[place];
      const status=photoStatus[place]||'loading';
      const mapUrl='https://www.google.com/maps/search/?api=1&query='+encodeURIComponent(place+', '+cityName+', '+stateName);
      const description=placeDetails[place];
      return <article className="india-place-card" key={place}>
        <a className="india-place-photo" href={mapUrl} target="_blank" rel="noreferrer">
          {photo?.image?<img src={photo.image} alt={place} loading="lazy" onError={()=>{setPhotos(old=>{const next={...old};delete next[place];return next;});setPhotoStatus(old=>({...old,[place]:'unavailable'}));}}/>:
            <div className={'india-photo-placeholder '+(status==='unavailable'?'is-unavailable':'')}>
              <Compass size={30}/><span>{status==='unavailable'?'PHOTO NOT AVAILABLE':'LOADING PHOTO'}</span>
              {status==='unavailable'&&<small>Place details are still available</small>}
            </div>}
          <span className="india-photo-open"><ExternalLink size={14}/></span>
        </a>
        <div className="india-place-info"><h4>{place}</h4><span>{cityName}, {stateName}</span>
          <a href={detailsUrl} target="_blank" rel="noreferrer">Place details ↗</a>
          {status==='unavailable'&&<button className="india-photo-retry" type="button" onClick={()=>retryPhoto(place)}><RefreshCw size={12}/> Try photo again</button>}
        </div>
      </article>;
    })}</div>
    {!places.length&&<p className="india-no-results">No matching places in this city yet.</p>}
    <p className="india-data-note">Place names and location links are provided directly on this website. Photo and short-summary suggestions may load from a public Wikipedia service; no Wikipedia account is needed. If a photo or summary is unavailable, the place card still works and map directions remain available.</p>
  </section>;
}
