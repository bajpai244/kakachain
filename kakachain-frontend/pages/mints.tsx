import { Container } from "theme-ui";
import { Hero } from "../components/hero";
import { useEffect, useState } from "react";
import { getCurrentPrompt, getHeaderData, getMints } from "../lib/api";
import { LastMints } from "../components/lastMints";

export default function Home() {
  const [headerData, setHeaderData] = useState({currentPrompt:"loading", currentBlock:"loading", totalMints:"loading"});
  const [recentMints, setRecentMints] = useState([]);

  useEffect(()=>{
    
    getHeaderData().then((d)=>{
      setHeaderData(d)
    })

    getMints().then((d)=>{
      setRecentMints(d);
    })

    
    const interval = setInterval(async ()=>{
    const d = await getHeaderData();
    setHeaderData(d);
    
    }, 5000);

    // every 2 minutes
    setInterval(async ()=>{

    // TODO: Put in a different interval
    const rm = await getMints();
    let hasChanged = false;
    if(recentMints.length !== 0){
    Object.keys(rm).forEach((key)=>{
      //@ts-ignore
      if(rm[key].prompt !== recentMints[key].prompt){
        hasChanged = true;
      }
    });
    if(hasChanged){
      setRecentMints(rm);
    }
  }
  else {
    setRecentMints(rm);
  }

    },120000)

  });

  return (
    <>
      <Hero headerData={headerData} />
      <LastMints recentMints={recentMints} showAll={true} />
    </>
  )
}
