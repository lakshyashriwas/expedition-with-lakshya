import React, { useEffect, useMemo, useState } from 'react';
import { MapPin, Search, ExternalLink, Compass } from 'lucide-react';
import { indiaDirectory } from './indiaDirectory';
import { cityGuides } from './cityGuides';

const makeFallbackGuide = (city, state) => ({
  overview: `${city} is a destination in ${state}, India. Explore the notable places listed in this guide and use the linked map and reference searches to check current visitor information before travelling.`,
  bestTime: `The best season depends on local weather, rainfall and festivals in ${city}. Check the current forecast and local tourism advisories before choosing travel dates; seasonal conditions can change.`,
  howToReach: [
    `Open the map directions for ${city} to compare current road routes and travel time from your starting point.`,
    `Search current train connections to the nearest railway station serving ${city}; schedules and services may change.`,
    `Check the nearest operational airport and onward road transfer before booking flights.`
  ],
  highlights: [],
  nearby: []
});

const attractionPhotos = {
  "Mahakaleshwar Jyotirlinga": {
    src: "https://www.mptourism.com/images/point-of-interest/Mahakaleshwar%20Temple.webp",
    credit: "Madhya Pradesh Tourism",
    source: "https://www.mptourism.com/destination-ujjain.php"
  },
  "Ram Ghat": {
    src: "https://upload.wikimedia.org/wikipedia/commons/4/45/Ram_Ghat_ujjain.jpg",
    credit: "Puneet Neeraj 024 · CC BY-SA 4.0",
    source: "https://commons.wikimedia.org/wiki/File:Ram_Ghat_ujjain.jpg"
  },
  "Kal Bhairav Temple": {
    src: "https://upload.wikimedia.org/wikipedia/commons/9/96/Kalabhairava_Temple_Ujjain.JPG",
    credit: "LRBurdak · CC BY-SA 4.0",
    source: "https://commons.wikimedia.org/wiki/File:Kalabhairava_Temple_Ujjain.JPG"
  }
};

export default function IndiaExplorer(){
  const [stateName,setStateName]=useState('Madhya Pradesh');
  const [cityName,setCityName]=useState('Bhopal');
  const [query,setQuery]=useState('');
  const [guidePhotoFailed,setGuidePhotoFailed]=useState(false);
  const state=indiaDirectory.find(s=>s.state===stateName)||indiaDirectory[0];
  const city=state.cities.find(c=>c.name===cityName)||state.cities[0];
  const places=useMemo(()=>city.places.filter(p=>p.toLowerCase().includes(query.toLowerCase())),[city,query]);
  const savedGuide=cityGuides[cityName];
  const guide=savedGuide||makeFallbackGuide(cityName,stateName);
  const mapQuery=encodeURIComponent(cityName+', '+stateName+', India');
  const mapUrl='https://www.google.com/maps/search/?api=1&query='+mapQuery;
  const mapEmbedUrl='https://www.google.com/maps?q='+mapQuery+'&output=embed';
  const tourismSearch='https://www.google.com/search?q='+encodeURIComponent(cityName+' '+stateName+' official tourism');

  useEffect(()=>{
    setCityName(state.cities[0].name);
    setQuery('');
    setGuidePhotoFailed(false);
  },[stateName]);

  const highlights=(guide.highlights?.length?guide.highlights:city.places);
  const stateDestinationCount=state.cities.length;
  const statePlaceCount=state.cities.reduce((sum,item)=>sum+item.places.length,0);

  return <section className="india-explorer section-wrap" id="india-explorer">
    <div className="section-heading"><div><div className="eyebrow"><span/> EXPLORE THE COUNTRY</div><h2>Discover <em>India.</em></h2></div><p>Choose a state, explore its cities<br/>and find places worth visiting.</p></div>
    <div className="india-explorer-controls">
      <label>SELECT STATE / UNION TERRITORY<select value={stateName} onChange={e=>setStateName(e.target.value)}>{indiaDirectory.map(s=><option key={s.state} value={s.state}>{s.state}</option>)}</select></label>
      <label>SELECT CITY / REGION<select value={cityName} onChange={e=>setCityName(e.target.value)}>{state.cities.map(c=><option key={c.name} value={c.name}>{c.name}</option>)}</select></label>
      <div className="india-search"><Search size={17}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search tourist places..."/></div>
    </div>
    <div className="india-location-heading"><div><span><MapPin size={15}/>{stateName}</span><h3>{cityName}</h3></div><small>{places.length} featured places · {stateDestinationCount} regions · {statePlaceCount} listed attractions</small></div>
    <div className="india-city-guide">
      {savedGuide?.image&&!guidePhotoFailed?<figure className="india-guide-visual"><img src={savedGuide.image} alt={savedGuide.imageAlt||cityName} loading="lazy" onError={()=>setGuidePhotoFailed(true)}/><figcaption>Photo source: <a href={savedGuide.imageSource||savedGuide.source} target="_blank" rel="noreferrer">Madhya Pradesh Tourism ↗</a></figcaption></figure>
      :<figure className="india-guide-visual india-guide-map"><iframe title={cityName+' map preview'} src={mapEmbedUrl} loading="lazy" referrerPolicy="no-referrer-when-downgrade"/><figcaption>Interactive map preview · <a href={mapUrl} target="_blank" rel="noreferrer">Open Google Maps ↗</a></figcaption></figure>}
      <p className="india-guide-overview">{guide.overview}</p>
      <div className="india-guide-columns">
        <div><h4>Best time to visit</h4><p>{guide.bestTime}</p></div>
        <div><h4>How to reach</h4><ul>{guide.howToReach.map(item=><li key={item}>{item}</li>)}</ul></div>
        <div><h4>Top attractions</h4><ul>{highlights.map(item=><li key={item}>{item}</li>)}</ul></div>
        <div><h4>Nearby places & exploration</h4><p>{guide.nearby?.length?guide.nearby.join(' · '):'Use the nearby-places map search to discover other destinations around '+cityName+'.'}</p><a href={'https://www.google.com/maps/search/tourist+places+near+'+mapQuery} target="_blank" rel="noreferrer">Explore nearby places ↗</a></div>
      </div>
      <div className="india-guide-links">
        <a href={mapUrl} target="_blank" rel="noreferrer">Google Maps & directions ↗</a>
        <a href={tourismSearch} target="_blank" rel="noreferrer">Official tourism information search ↗</a>
        {savedGuide?.source&&<a href={savedGuide.source} target="_blank" rel="noreferrer">Official destination guide ↗</a>}
      </div>
      {!savedGuide&&<p className="india-data-note">This is a starter guide assembled from the destination directory and live map/reference links. It is not yet a fully researched, source-verified guide. Exact destination photos and locally verified details are being added in batches; no unrelated photo is shown as if it belongs to this place.</p>}
    </div>
    <div className="india-place-grid">{places.map(place=>{
      const placeMapUrl='https://www.google.com/maps/search/?api=1&query='+encodeURIComponent(place+', '+cityName+', '+stateName);
      const photo=stateName==="Madhya Pradesh"&&cityName==="Ujjain"?attractionPhotos[place]:null;
      return <article className="india-place-card" key={place}>
        {photo?<a className="india-place-photo" href={photo.source} target="_blank" rel="noreferrer" aria-label={'Photo source for '+place}>
          <img src={photo.src} alt={place+', '+cityName} loading="lazy" onError={e=>{e.currentTarget.style.display='none';e.currentTarget.parentElement.classList.add('photo-unavailable')}}/>
          <span className="india-photo-credit">{photo.credit}</span>
        </a>:<div className="india-place-photo india-place-photo-empty"><Compass size={25}/><span>Photo not yet verified</span></div>}
        <div className="india-place-info"><h4>{place}</h4><span>{cityName}, {stateName}</span>
          {photo&&<a className="india-photo-source" href={photo.source} target="_blank" rel="noreferrer">Photo & licence ↗</a>}
          <a href={placeMapUrl} target="_blank" rel="noreferrer">Map & directions ↗ <ExternalLink size={12}/></a>
        </div>
      </article>;
    })}</div>
    {!places.length&&<p className="india-no-results">No matching places in this city yet.</p>}
    <div className="india-source-panel"><div><strong>Keep exploring {stateName}</strong><p>This directory now includes {stateDestinationCount} city/region entries and {statePlaceCount} named attractions for this state or UT. It is a curated discovery index, not a complete list of every settlement or a substitute for checking current local conditions.</p></div><div className="india-source-links"><a href="https://www.incredibleindia.gov.in/en/destinations/states" target="_blank" rel="noreferrer">Official Incredible India state & UT directory ↗</a><a href="https://icpb.in/indian-state-tourism" target="_blank" rel="noreferrer">State tourism board links ↗</a></div></div><p className="india-data-note">Destination names are a curated discovery shortlist. Exact photos and full source-verified city guides are still being expanded; no unrelated image is presented as a location photo.</p>
  </section>;
}
