import React, { useEffect, useMemo, useState } from 'react';
import { MapPin, Search, ExternalLink, Compass } from 'lucide-react';
import { indiaDirectory } from './indiaDirectory';
import { cityGuides } from './cityGuides';

export default function IndiaExplorer(){
  const [stateName,setStateName]=useState('Madhya Pradesh');
  const [cityName,setCityName]=useState('Bhopal');
  const [query,setQuery]=useState('');
  const state=indiaDirectory.find(s=>s.state===stateName)||indiaDirectory[0];
  const city=state.cities.find(c=>c.name===cityName)||state.cities[0];
  const places=useMemo(()=>city.places.filter(p=>p.toLowerCase().includes(query.toLowerCase())),[city,query]);
  const guide=cityGuides[cityName];

  useEffect(()=>{
    setCityName(state.cities[0].name);
    setQuery('');
  },[stateName]);

  return <section className="india-explorer section-wrap" id="india-explorer">
    <div className="section-heading"><div><div className="eyebrow"><span/> EXPLORE THE COUNTRY</div><h2>Discover <em>India.</em></h2></div><p>Choose a state, explore its cities<br/>and find places worth visiting.</p></div>
    <div className="india-explorer-controls">
      <label>SELECT STATE / UNION TERRITORY<select value={stateName} onChange={e=>setStateName(e.target.value)}>{indiaDirectory.map(s=><option key={s.state} value={s.state}>{s.state}</option>)}</select></label>
      <label>SELECT CITY / REGION<select value={cityName} onChange={e=>setCityName(e.target.value)}>{state.cities.map(c=><option key={c.name} value={c.name}>{c.name}</option>)}</select></label>
      <div className="india-search"><Search size={17}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search tourist places..."/></div>
    </div>
    <div className="india-location-heading"><div><span><MapPin size={15}/>{stateName}</span><h3>{cityName}</h3></div><small>{places.length} featured places</small></div>
    {guide?<div className="india-city-guide">
      {guide.image&&<figure className="india-guide-visual"><img src={guide.image} alt={guide.imageAlt||cityName} loading="lazy"/><figcaption>Photo: Madhya Pradesh Tourism · <a href={guide.imageSource||guide.source} target="_blank" rel="noreferrer">Source ↗</a></figcaption></figure>}
      <p className="india-guide-overview">{guide.overview}</p>
      <div className="india-guide-columns">
        <div><h4>Best time to visit</h4><p>{guide.bestTime}</p></div>
        <div><h4>How to reach</h4><ul>{guide.howToReach.map(item=><li key={item}>{item}</li>)}</ul></div>
        <div><h4>Top attractions</h4><ul>{guide.highlights.map(item=><li key={item}>{item}</li>)}</ul></div>
        <div><h4>Nearby places</h4><p>{guide.nearby.join(" · ")}</p></div>
      </div>
      <a className="india-guide-source" href={guide.source} target="_blank" rel="noreferrer">Read official Madhya Pradesh Tourism guide ↗</a>
    </div>:<p className="india-guide-pending">Detailed guide and verified photo for {cityName} are being added. The place list and map links are available below.</p>}
    <div className="india-place-grid">{places.map(place=>{
      const mapUrl='https://www.google.com/maps/search/?api=1&query='+encodeURIComponent(place+', '+cityName+', '+stateName);
      return <article className="india-place-card" key={place}>
        <div className="india-place-icon"><Compass size={25}/></div>
        <div className="india-place-info"><h4>{place}</h4><span>{cityName}, {stateName}</span>
          <a href={mapUrl} target="_blank" rel="noreferrer">Map & directions ↗ <ExternalLink size={12}/></a>
        </div>
      </article>;
    })}</div>
    {!places.length&&<p className="india-no-results">No matching places in this city yet.</p>}
    <p className="india-data-note">Location photos and travel details are saved as website content when verified. This guide section does not search Wikipedia or load photos dynamically. More destinations are being researched and added in batches.</p>
  </section>;
}
