import { useState, useEffect } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";

const C = {
  bg: "#000000", card: "#0a0a0f", cardBorder: "#1a1a2e",
  cyan: "#00c8ff", blue: "#2b7fff", ring: "#3a4a6b",
  green: "#00e89d", amber: "#ffb800", red: "#ff4458", purple: "#b47aff",
  text: "#ffffff", textSec: "#8a9bb5", textMuted: "#4a5568",
};

// ─── THINGSPEAK CONFIG ─────────────────────────────────────
const THINGSPEAK_UNITS = [
  {
    channelId: 3014020,
    readKey: "YOUR_READ_API_KEY_HERE",
    meta: { id: "HP-A1B2C3", name: "Kitchen", site: "Applegreen, Balbriggan M1", operator: "Applegreen", country: "IE", product: "Aquaflow 1 GPM" },
  },
];

// ─── USAGE DATA ───────────────────────────────────────────
// Hierarchy: Sanzonate → Country → Operator → Site → Unit
// Phase 2 replaces this with live database-driven data.
const DEMO_UNITS = [
  // ── IRELAND ───────────────────────────────────────────
  { id: "HP-A1B2C3", name: "Kitchen",       site: "Applegreen, Balbriggan M1",  operator: "Applegreen", country: "IE", status: "active",  totalLitres: 18420, todayLitres: 145, currentFlow: 2.4, lastSeen: new Date(), product: "Aquaflow 1 GPM", live: false },
  { id: "HP-D4E5F6", name: "Food Court",    site: "Applegreen, Balbriggan M1",  operator: "Applegreen", country: "IE", status: "active",  totalLitres: 12350, todayLitres: 98,  currentFlow: 1.8, lastSeen: new Date(), product: "Aquaflow Mini",  live: false },
  { id: "HP-G7H8I9", name: "Back of House", site: "Applegreen, Enfield M4",     operator: "Applegreen", country: "IE", status: "active",  totalLitres: 22100, todayLitres: 167, currentFlow: 3.1, lastSeen: new Date(), product: "Aquaflow 1 GPM", live: false },
  { id: "HP-B2C3D4", name: "Deli Counter",  site: "Applegreen, Enfield M4",     operator: "Applegreen", country: "IE", status: "active",  totalLitres: 9800,  todayLitres: 78,  currentFlow: 1.6, lastSeen: new Date(), product: "Aquaflow Mini",  live: false },
  { id: "HP-K3L4M5", name: "Kitchen",       site: "Applegreen, Lusk N1",        operator: "Applegreen", country: "IE", status: "active",  totalLitres: 15600, todayLitres: 122, currentFlow: 2.1, lastSeen: new Date(), product: "Aquaflow 1 GPM", live: false },
  { id: "HP-N6O7P8", name: "Forecourt Café",site: "Applegreen, Lusk N1",        operator: "Applegreen", country: "IE", status: "active",  totalLitres: 8900,  todayLitres: 65,  currentFlow: 1.2, lastSeen: new Date(), product: "Aquaflow Mini",  live: false },
  { id: "HP-Q9R1S2", name: "Main Kitchen",  site: "Applegreen, Gorey N11",      operator: "Applegreen", country: "IE", status: "active",  totalLitres: 11200, todayLitres: 88,  currentFlow: 1.9, lastSeen: new Date(), product: "Aquaflow 1 GPM", live: false },
  { id: "HP-T3U4V5", name: "Prep Area",     site: "Applegreen, Gorey N11",      operator: "Applegreen", country: "IE", status: "active",  totalLitres: 6400,  todayLitres: 52,  currentFlow: 0.9, lastSeen: new Date(), product: "Aquaflow Mini",  live: false },

  // ── FRANCE ────────────────────────────────────────────
  { id: "HP-J1K2L3", name: "Staff Canteen",    site: "Musée du Louvre, Paris",      operator: "Sodexo", country: "FR", status: "active",  totalLitres: 34200, todayLitres: 210, currentFlow: 3.8, lastSeen: new Date(), product: "Aquaflow 3 GPM", live: false },
  { id: "HP-M4N5O6", name: "Visitor Café",     site: "Musée du Louvre, Paris",      operator: "Sodexo", country: "FR", status: "active",  totalLitres: 28100, todayLitres: 175, currentFlow: 3.4, lastSeen: new Date(), product: "Aquaflow 1 GPM", live: false },
  { id: "HP-W6X7Y8", name: "Kitchen West Wing",site: "Musée du Louvre, Paris",      operator: "Sodexo", country: "FR", status: "active",  totalLitres: 19500, todayLitres: 148, currentFlow: 2.6, lastSeen: new Date(), product: "Aquaflow 1 GPM", live: false },
  { id: "HP-Z9A1B2", name: "Central Kitchen",  site: "Gare de Lyon, Paris",         operator: "Sodexo", country: "FR", status: "active",  totalLitres: 26800, todayLitres: 195, currentFlow: 3.5, lastSeen: new Date(), product: "Aquaflow 3 GPM", live: false },
  { id: "HP-C3D4E5", name: "Platform Café",    site: "Gare de Lyon, Paris",         operator: "Sodexo", country: "FR", status: "active",  totalLitres: 14300, todayLitres: 112, currentFlow: 2.0, lastSeen: new Date(), product: "Aquaflow 1 GPM", live: false },
  { id: "HP-F6G7H8", name: "Brasserie",        site: "Gare de Lyon, Paris",         operator: "Sodexo", country: "FR", status: "offline", totalLitres: 11200, todayLitres: 0,   currentFlow: 0,   lastSeen: new Date(Date.now() - 7200000), product: "Aquaflow Mini", live: false },

  // ── UNITED KINGDOM ────────────────────────────────────
  { id: "HP-P7Q8R9", name: "Concourse Kitchen",site: "Waterloo Station, London",    operator: "ISS", country: "GB", status: "active",  totalLitres: 28600, todayLitres: 185, currentFlow: 3.2, lastSeen: new Date(), product: "Aquaflow 3 GPM", live: false },
  { id: "HP-S1T2U3", name: "Retail Outlets",   site: "Waterloo Station, London",    operator: "ISS", country: "GB", status: "active",  totalLitres: 15200, todayLitres: 92,  currentFlow: 1.9, lastSeen: new Date(), product: "Aquaflow Mini",  live: false },
  { id: "HP-I9J1K2", name: "Staff Restaurant", site: "Waterloo Station, London",    operator: "ISS", country: "GB", status: "active",  totalLitres: 21400, todayLitres: 160, currentFlow: 2.9, lastSeen: new Date(), product: "Aquaflow 1 GPM", live: false },
  { id: "HP-L3M4N5", name: "Main Kitchen",     site: "Barclays, Canary Wharf",      operator: "ISS", country: "GB", status: "active",  totalLitres: 31200, todayLitres: 205, currentFlow: 3.6, lastSeen: new Date(), product: "Aquaflow 3 GPM", live: false },
  { id: "HP-O6P7Q8", name: "Executive Floor",  site: "Barclays, Canary Wharf",      operator: "ISS", country: "GB", status: "active",  totalLitres: 12800, todayLitres: 95,  currentFlow: 1.7, lastSeen: new Date(), product: "Aquaflow 1 GPM", live: false },
  { id: "HP-R9S1T2", name: "Food Hall",        site: "Manchester Arndale",           operator: "ISS", country: "GB", status: "active",  totalLitres: 17600, todayLitres: 138, currentFlow: 2.4, lastSeen: new Date(), product: "Aquaflow 1 GPM", live: false },
  { id: "HP-U3V4W5", name: "Back of House",    site: "Manchester Arndale",           operator: "ISS", country: "GB", status: "active",  totalLitres: 9400,  todayLitres: 72,  currentFlow: 1.3, lastSeen: new Date(), product: "Aquaflow Mini",  live: false },

  { id: "HP-V4W5X6", name: "Main Kitchen",     site: "Hilton Glasgow",              operator: "Mitchells & Butlers", country: "GB", status: "active",  totalLitres: 19800, todayLitres: 156, currentFlow: 2.8, lastSeen: new Date(), product: "Aquaflow Maxi", live: false },
  { id: "HP-X7Y8Z9", name: "Banqueting",       site: "Hilton Glasgow",              operator: "Mitchells & Butlers", country: "GB", status: "active",  totalLitres: 13500, todayLitres: 105, currentFlow: 1.8, lastSeen: new Date(), product: "Aquaflow 1 GPM", live: false },
  { id: "HP-E7F2A1", name: "Bar Area",         site: "Edinburgh Royal Mile",        operator: "Mitchells & Butlers", country: "GB", status: "offline", totalLitres: 8400,  todayLitres: 0,   currentFlow: 0,   lastSeen: new Date(Date.now() - 14400000), product: "Aquaflow 1 GPM", live: false },
  { id: "HP-A2B3C4", name: "Restaurant",       site: "Edinburgh Royal Mile",        operator: "Mitchells & Butlers", country: "GB", status: "active",  totalLitres: 10200, todayLitres: 82,  currentFlow: 1.5, lastSeen: new Date(), product: "Aquaflow 1 GPM", live: false },
  { id: "HP-D5E6F7", name: "Central Kitchen",  site: "All Bar One, Birmingham",     operator: "Mitchells & Butlers", country: "GB", status: "active",  totalLitres: 16400, todayLitres: 128, currentFlow: 2.3, lastSeen: new Date(), product: "Aquaflow 1 GPM", live: false },
];

async function fetchThingSpeakUnit(cfg) {
  try {
    const url = `https://api.thingspeak.com/channels/${cfg.channelId}/feeds/last.json?api_key=${cfg.readKey}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    const totalLitres = parseFloat(data.field1) || 0;
    const currentFlow = parseFloat(data.field2) || 0;
    const todayLitres = parseFloat(data.field3) || 0;
    const statusVal   = parseInt(data.field4) || 0;
    const lastSeen    = new Date(data.created_at);
    const isOnline = statusVal === 1 && (Date.now() - lastSeen.getTime()) < 300000;
    return { ...cfg.meta, totalLitres, currentFlow, todayLitres, status: isOnline ? "active" : "offline", lastSeen, live: true };
  } catch (err) {
    console.warn(`ThingSpeak fetch failed for ${cfg.meta.id}:`, err);
    return { ...cfg.meta, totalLitres: 0, currentFlow: 0, todayLitres: 0, status: "offline", lastSeen: new Date(), live: true };
  }
}

function genDaily(days=30) { const d=[]; for(let i=days;i>=0;i--){ const t=new Date(Date.now()-i*86400000); d.push({date:t.toLocaleDateString("en-GB",{day:"numeric",month:"short"}),litres:Math.round(2200+Math.random()*800+(t.getDay()===0||t.getDay()===6?-400:200))}); } return d; }
function genHourly() { const d=[]; for(let h=0;h<24;h++) d.push({hour:`${h.toString().padStart(2,"0")}:00`,litres:Math.round((h>=7&&h<=22?60+Math.random()*90:3+Math.random()*10)*10)/10}); return d; }
function timeAgo(d) { const diff=Date.now()-new Date(d).getTime(); if(diff<60000)return"now"; if(diff<3600000)return Math.floor(diff/60000)+"m"; return Math.floor(diff/3600000)+"h"; }

function Ripple({size=200,opacity=0.06,animate=false}) {
  const rings=[0.18,0.30,0.42,0.56,0.72,0.90];
  return (<svg width={size} height={size} viewBox="0 0 200 200" style={{position:"absolute",opacity,pointerEvents:"none"}}>
    {rings.map((r,i)=>(<circle key={i} cx="100" cy="100" r={r*100} fill="none" stroke={i<2?C.cyan:i<4?C.blue:C.ring} strokeWidth={i<2?2:1.5} opacity={1-i*0.15}>{animate&&<animate attributeName="r" values={`${r*100};${r*100+4};${r*100}`} dur={`${3+i*0.5}s`} repeatCount="indefinite"/>}</circle>))}
    <circle cx="100" cy="100" r="12" fill={C.cyan} opacity="0.8"/>
  </svg>);
}

const FL={IE:"\u{1F1EE}\u{1F1EA}",FR:"\u{1F1EB}\u{1F1F7}",GB:"\u{1F1EC}\u{1F1E7}",US:"\u{1F1FA}\u{1F1F8}"};
const panel={background:"#0a0a0f",borderRadius:14,border:"1px solid #1a1a2e",padding:"20px 22px"};
const hd={fontSize:14,fontWeight:600,color:"#fff",margin:"0 0 14px 0",letterSpacing:"-0.01em"};
const hdSub={fontSize:11,color:"#4a5568",fontWeight:400,marginLeft:8};
const tdS={padding:"11px 12px",color:"#8a9bb5"};
const thS={padding:"9px 12px",textAlign:"left",color:"#4a5568",fontWeight:600,fontSize:9.5,textTransform:"uppercase",letterSpacing:"0.1em",borderBottom:"1px solid #1a1a2e"};
const ttS={background:"#0a0a0f",border:"1px solid #1a1a2e",borderRadius:8,fontSize:11,color:"#fff"};

export default function SanzonateDashboard() {
  const [units,setUnits]=useState(DEMO_UNITS);
  const [dailyData]=useState(genDaily());
  const [hourlyData]=useState(genHourly());

  useEffect(()=>{
    async function fetchLive() {
      if (THINGSPEAK_UNITS.length === 0) return;
      const liveUnits = await Promise.all(THINGSPEAK_UNITS.map(fetchThingSpeakUnit));
      setUnits(prev => {
        const demoOnly = prev.filter(u => !u.live && !liveUnits.find(lu => lu.id === u.id));
        return [...liveUnits, ...demoOnly];
      });
    }
    fetchLive();
    const liveIv = setInterval(fetchLive, 16000);
    const simIv = setInterval(()=>{
      setUnits(p=>p.map(u=> {
        if (u.live) return u;
        if (u.status==="offline") return u;
        return {...u,
          currentFlow:Math.max(0,+(u.currentFlow+(Math.random()-0.3)*0.4).toFixed(2)),
          todayLitres:u.todayLitres+Math.round(u.currentFlow/12),
          totalLitres:u.totalLitres+Math.round(u.currentFlow/12),
          lastSeen:new Date(),
        };
      }));
    },4000);
    return()=>{clearInterval(liveIv);clearInterval(simIv)};
  },[]);

  const totalL=units.reduce((s,u)=>s+u.totalLitres,0);
  const todayL=units.reduce((s,u)=>s+u.todayLitres,0);
  const active=units.filter(u=>u.status==="active").length;

  const ops={};
  units.forEach(u=>{if(!ops[u.operator])ops[u.operator]={litres:0,today:0,units:0,sites:new Set(),country:u.country};ops[u.operator].litres+=u.totalLitres;ops[u.operator].today+=u.todayLitres;ops[u.operator].units+=1;ops[u.operator].sites.add(u.site);});
  const opS=Object.entries(ops).sort((a,b)=>b[1].litres-a[1].litres);

  const siteMap={};
  units.forEach(u=>{if(!siteMap[u.site])siteMap[u.site]={litres:0,today:0,units:0,operator:u.operator,country:u.country,sts:[]};siteMap[u.site].litres+=u.totalLitres;siteMap[u.site].today+=u.todayLitres;siteMap[u.site].units+=1;siteMap[u.site].sts.push(u.status);});
  const siteS=Object.entries(siteMap).sort((a,b)=>b[1].litres-a[1].litres);

  return (
    <div style={{minHeight:"100vh",background:C.bg,color:C.text,fontFamily:"'Outfit','Helvetica Neue',sans-serif"}}>
      <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet"/>
      <style>{`
        @keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:.3}}
        .fi{animation:fadeUp .5s ease-out both}
        .ch:hover{border-color:${C.cyan}!important;transform:translateY(-1px);box-shadow:0 0 40px rgba(0,200,255,.06)}
        .rh:hover{background:rgba(0,200,255,.03)!important}
      `}</style>

      {/* HEADER */}
      <header style={{height:60,padding:"0 28px",display:"flex",alignItems:"center",justifyContent:"space-between",borderBottom:`1px solid ${C.cardBorder}`,background:"linear-gradient(180deg,#080810 0%,#000 100%)"}}>
        <div style={{display:"flex",alignItems:"center",gap:14}}>
          <img src="https://www.sanzonate.com/wp-content/uploads/2020/12/cropped-SANZONATE-Logo-scaled-1-270x270.jpg" alt="Sanzonate" style={{width:36,height:36,borderRadius:8,objectFit:"cover"}} onError={(e)=>{e.target.style.display="none"}}/>
          <svg width="30" height="30" viewBox="0 0 34 34">
            <circle cx="17" cy="17" r="16" fill="none" stroke={C.ring} strokeWidth="0.7" opacity="0.4"/>
            <circle cx="17" cy="17" r="12" fill="none" stroke={C.blue} strokeWidth="0.8" opacity="0.5"/>
            <circle cx="17" cy="17" r="8.5" fill="none" stroke={C.cyan} strokeWidth="1" opacity="0.7"/>
            <circle cx="17" cy="17" r="5" fill="none" stroke={C.cyan} strokeWidth="1.2"/>
            <circle cx="17" cy="17" r="2.5" fill={C.cyan}/>
          </svg>
          <span style={{fontSize:17,fontWeight:700,letterSpacing:"0.18em",textTransform:"uppercase"}}>SANZ<span style={{color:C.cyan}}>O</span>NATE</span>
          <span style={{fontSize:9,color:C.textMuted,letterSpacing:"0.1em",textTransform:"uppercase",paddingLeft:14,borderLeft:`1px solid ${C.cardBorder}`}}>Aquaflow Impact Portal</span>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:8,padding:"5px 14px",borderRadius:20,border:`1px solid ${C.cardBorder}`,background:"#0a0a0f"}}>
          <span style={{width:6,height:6,borderRadius:"50%",background:C.green,animation:"pulse 2s ease-in-out infinite"}}/>
          <span style={{fontSize:11,color:C.textSec}}>{active}/{units.length} Online</span>
        </div>
      </header>

      <main style={{maxWidth:1340,margin:"0 auto",padding:"32px 24px"}}>

        {/* ── TOTAL AQUEOUS OZONE ── */}
        <div className="fi" style={{position:"relative",overflow:"hidden",background:"linear-gradient(135deg,#060612 0%,#0a0a18 50%,#000 100%)",borderRadius:16,padding:"36px",marginBottom:24,border:`1px solid ${C.cardBorder}`}}>
          <div style={{position:"absolute",right:-40,top:-40}}><Ripple size={280} opacity={0.05} animate/></div>
          <div style={{position:"absolute",left:-60,bottom:-60}}><Ripple size={180} opacity={0.03}/></div>
          <div style={{position:"relative",zIndex:1}}>
            <div style={{fontSize:10,color:C.textMuted,textTransform:"uppercase",letterSpacing:"0.15em",fontWeight:600,marginBottom:12}}>Total Aqueous Ozone Produced · Sanzonate Aquaflow Fleet</div>
            <div style={{display:"flex",alignItems:"baseline",gap:8,flexWrap:"wrap"}}>
              <span style={{fontSize:64,fontWeight:900,lineHeight:1,letterSpacing:"-0.04em",background:`linear-gradient(135deg,${C.cyan},${C.blue})`,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>{(totalL/1000).toFixed(1)}</span>
              <span style={{fontSize:28,fontWeight:400,color:C.textSec}}>m³</span>
              <span style={{fontSize:15,color:C.textMuted,marginLeft:8}}>({totalL.toLocaleString()} litres)</span>
            </div>
            <div style={{marginTop:16,display:"flex",gap:32,flexWrap:"wrap"}}>
              <div><span style={{fontSize:24,fontWeight:700,color:C.cyan}}>{todayL.toLocaleString()}L</span><span style={{fontSize:12,color:C.textMuted,marginLeft:8}}>today</span></div>
              <div style={{borderLeft:`1px solid ${C.cardBorder}`,paddingLeft:32}}><span style={{fontSize:24,fontWeight:700,color:C.text}}>{active}</span><span style={{fontSize:12,color:C.textMuted,marginLeft:8}}>units active</span></div>
              <div style={{borderLeft:`1px solid ${C.cardBorder}`,paddingLeft:32}}><span style={{fontSize:24,fontWeight:700,color:C.green}}>{siteS.length}</span><span style={{fontSize:12,color:C.textMuted,marginLeft:8}}>sites</span></div>
              <div style={{borderLeft:`1px solid ${C.cardBorder}`,paddingLeft:32}}><span style={{fontSize:24,fontWeight:700,color:C.amber}}>{opS.length}</span><span style={{fontSize:12,color:C.textMuted,marginLeft:8}}>operators</span></div>
            </div>
          </div>
        </div>

        {/* ── DAILY AQUAFLOW PRODUCTION + TODAY'S PATTERN ── */}
        <div className="fi" style={{display:"flex",gap:14,marginBottom:24,flexWrap:"wrap",animationDelay:".15s"}}>
          <div style={{...panel,flex:"2 1 500px"}}>
            <h3 style={hd}>Daily Aquaflow Production <span style={hdSub}>30 days · all sites</span></h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={dailyData} barSize={6}>
                <CartesianGrid strokeDasharray="3 3" stroke="#111122" vertical={false}/>
                <XAxis dataKey="date" tick={{fill:C.textMuted,fontSize:9}} interval={4} axisLine={false} tickLine={false}/>
                <YAxis tick={{fill:C.textMuted,fontSize:9}} axisLine={false} tickLine={false} width={36} tickFormatter={v=>`${v}L`}/>
                <Tooltip contentStyle={ttS} cursor={{fill:"rgba(0,200,255,.03)"}} formatter={v=>[`${v}L`,"Produced"]} labelStyle={{color:C.textSec}}/>
                <Bar dataKey="litres" fill={C.cyan} radius={[3,3,0,0]} opacity={0.85}/>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div style={{...panel,flex:"1 1 300px"}}>
            <h3 style={hd}>Today's Pattern <span style={hdSub}>hourly</span></h3>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={hourlyData}>
                <defs><linearGradient id="aGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={C.cyan} stopOpacity={0.15}/><stop offset="100%" stopColor={C.cyan} stopOpacity={0}/></linearGradient></defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#111122" vertical={false}/>
                <XAxis dataKey="hour" tick={{fill:C.textMuted,fontSize:9}} interval={3} axisLine={false} tickLine={false}/>
                <YAxis tick={{fill:C.textMuted,fontSize:9}} axisLine={false} tickLine={false} width={28} tickFormatter={v=>`${v}L`}/>
                <Tooltip contentStyle={ttS} labelStyle={{color:C.textSec}} formatter={v=>[`${v}L`,"Flow"]}/>
                <Area type="monotone" dataKey="litres" stroke={C.cyan} fill="url(#aGrad)" strokeWidth={1.5} dot={false} name="Litres"/>
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* ── OPERATOR LEADERBOARD ── */}
        <div className="fi" style={{...panel,marginBottom:24,animationDelay:".25s"}}>
          <h3 style={hd}>Operator Leaderboard <span style={hdSub}>by total production</span></h3>
          {opS.map(([name,data],i)=>{
            const mL=opS[0][1].litres;
            return (
              <div key={name} className="rh" style={{display:"flex",alignItems:"center",gap:12,padding:"14px 16px",borderRadius:8,marginBottom:4,transition:"background .15s"}}>
                <span style={{fontSize:18,width:28,textAlign:"center"}}>{i===0?"\u{1F947}":i===1?"\u{1F948}":i===2?"\u{1F949}":`${i+1}.`}</span>
                <span style={{fontSize:16}}>{FL[data.country]||""}</span>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{display:"flex",alignItems:"baseline",gap:8}}>
                    <span style={{fontSize:14,fontWeight:600}}>{name}</span>
                    <span style={{fontSize:11,color:C.textMuted}}>{data.sites.size} sites · {data.units} units</span>
                  </div>
                  <div style={{height:4,borderRadius:2,background:"#111122",marginTop:6}}>
                    <div style={{height:"100%",borderRadius:2,background:`linear-gradient(90deg,${C.cyan}88,${C.cyan})`,width:`${(data.litres/mL)*100}%`,transition:"width .6s"}}/>
                  </div>
                </div>
                <div style={{textAlign:"right",minWidth:100}}>
                  <div style={{fontSize:16,fontWeight:700,color:C.cyan}}>{(data.litres/1000).toFixed(1)}k L</div>
                  <div style={{fontSize:11,color:C.textMuted}}>+{data.today.toLocaleString()}L today</div>
                </div>
              </div>
            );
          })}
        </div>

        {/* ── SITE COMPARISON ── */}
        <div className="fi" style={{...panel,marginBottom:24,animationDelay:".3s"}}>
          <h3 style={hd}>Site Comparison <span style={hdSub}>{siteS.length} sites</span></h3>
          <div style={{overflowX:"auto"}}>
            <table style={{width:"100%",borderCollapse:"collapse",fontSize:12.5}}>
              <thead><tr>{["","Site","Operator","Units","Today","All Time","Status"].map(h=><th key={h} style={thS}>{h}</th>)}</tr></thead>
              <tbody>
                {siteS.map(([name,data])=>{
                  const allOn=data.sts.every(s=>s==="active");
                  const anyOff=data.sts.some(s=>s==="offline");
                  return (
                    <tr key={name} className="rh" style={{borderBottom:"1px solid #0a0a14",transition:"background .15s"}}>
                      <td style={tdS}><span style={{fontSize:14}}>{FL[data.country]}</span></td>
                      <td style={{...tdS,fontWeight:600,color:C.text}}>{name}</td>
                      <td style={{...tdS,color:C.textMuted,fontSize:11}}>{data.operator}</td>
                      <td style={{...tdS,color:C.textSec}}>{data.units}</td>
                      <td style={{...tdS,color:C.cyan,fontWeight:600}}>{data.today.toLocaleString()}L</td>
                      <td style={{...tdS,color:C.textSec}}>{data.litres.toLocaleString()}L</td>
                      <td style={tdS}>
                        <span style={{display:"inline-flex",alignItems:"center",gap:5}}>
                          <span style={{width:7,height:7,borderRadius:"50%",background:anyOff?C.red:C.green,boxShadow:`0 0 8px ${anyOff?"rgba(255,68,88,.3)":"rgba(0,232,157,.35)"}`}}/>
                          <span style={{fontSize:11,color:allOn?C.green:C.red}}>{allOn?"All online":`${data.sts.filter(s=>s==="offline").length} offline`}</span>
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* ── AQUAFLOW FLEET ── */}
        <div className="fi" style={{...panel,animationDelay:".35s"}}>
          <h3 style={hd}>Aquaflow Fleet <span style={hdSub}>{units.length} units · {siteS.length} sites · {opS.length} operators</span></h3>
          <div style={{overflowX:"auto"}}>
            <table style={{width:"100%",borderCollapse:"collapse",fontSize:12.5}}>
              <thead><tr>{["","Serial","Unit","Site","Product","Today","All Time","Flow / Status"].map(h=><th key={h} style={thS}>{h}</th>)}</tr></thead>
              <tbody>
                {units.map(u=>{
                  const prodColor=u.product.includes("3 GPM")?C.cyan:u.product.includes("Maxi")?C.purple:u.product.includes("Mini")?C.amber:C.textMuted;
                  const prodBg=u.product.includes("3 GPM")?"rgba(0,200,255,.08)":u.product.includes("Maxi")?"rgba(180,122,255,.08)":u.product.includes("Mini")?"rgba(255,184,0,.08)":"rgba(255,255,255,.04)";
                  return (
                    <tr key={u.id} className="rh" style={{borderBottom:"1px solid #0a0a14",transition:"background .15s"}}>
                      <td style={tdS}><span style={{display:"inline-block",width:7,height:7,borderRadius:"50%",background:u.status==="active"?C.green:C.red,boxShadow:`0 0 8px ${u.status==="active"?"rgba(0,232,157,.35)":"rgba(255,68,88,.3)"}`}}/></td>
                      <td style={{...tdS,fontFamily:"monospace",fontSize:10,color:C.textMuted}}>{u.id}{u.live&&<span style={{marginLeft:6,fontSize:8,padding:"1px 5px",borderRadius:4,background:"rgba(0,232,157,.12)",color:C.green,fontWeight:700,fontFamily:"inherit",letterSpacing:"0.05em"}}>LIVE</span>}</td>
                      <td style={{...tdS,fontWeight:600,color:C.text}}>{u.name}</td>
                      <td style={tdS}><span style={{fontSize:12}}>{FL[u.country]} </span><span style={{color:C.textSec}}>{u.site}</span></td>
                      <td style={tdS}><span style={{fontSize:10,padding:"2px 8px",borderRadius:6,background:prodBg,color:prodColor,fontWeight:500}}>{u.product}</span></td>
                      <td style={{...tdS,color:C.cyan,fontWeight:600}}>{u.todayLitres}L</td>
                      <td style={{...tdS,color:C.textSec}}>{u.totalLitres.toLocaleString()}L</td>
                      <td style={tdS}>
                        {u.status==="active"?(
                          <span style={{display:"flex",alignItems:"center",gap:5}}>
                            <span style={{color:C.cyan,fontWeight:600}}>{u.currentFlow.toFixed(1)}</span>
                            <span style={{color:C.textMuted,fontSize:10}}>L/min</span>
                          </span>
                        ):(
                          <span style={{padding:"2px 10px",borderRadius:10,fontSize:9.5,background:"rgba(255,68,88,.08)",color:C.red,fontWeight:600,textTransform:"uppercase",letterSpacing:"0.06em"}}>Offline · {timeAgo(u.lastSeen)}</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* FOOTER */}
        <footer style={{marginTop:28,paddingTop:18,borderTop:`1px solid ${C.cardBorder}`,display:"flex",justifyContent:"space-between",alignItems:"center",fontSize:10.5,color:C.textMuted,flexWrap:"wrap",gap:8}}>
          <span>© {new Date().getFullYear()} Sanzonate Global Inc. · Aqueous Ozone On Demand</span>
          <span style={{display:"flex",alignItems:"center",gap:10}}>
            <span style={{display:"flex",alignItems:"center",gap:5}}>
              <span style={{width:5,height:5,borderRadius:"50%",background:C.cyan,display:"inline-block"}}/>
              Powered by HydroPulse
            </span>
            
          </span>
        </footer>
      </main>
    </div>
  );
}
