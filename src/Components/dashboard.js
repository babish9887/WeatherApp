import React, { useEffect, useState } from 'react'
import './style.css';
import searchicon from './Assets/search.png';
import could from './Assets/cloud.png';
import clear from './Assets/clear.png';
import drizzle from './Assets/drizzle.png';
import rain from './Assets/rain.png';
import snow from './Assets/snow.png';
import windimg from './Assets/wind.png';
import humidityimg from './Assets/humidity.png';


const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const icons = new Map([
    [[0], "Clear"],
    [[1], "Partly Cloudy"],
    [[2], "Cloudy"],
    [[3], "Overcast"],
    [[45, 48], "Fog"],
    [[51, 56, 61, 66, 80], "Showers"],
    [[53, 55, 63, 65, 57, 67, 81, 82], "Rain"],
    [[71, 73, 75, 77, 85, 86], "Snow"],
    [[95], "Thunderstorm"],
    [[96, 99], "Heavy Thunderstorm"],
  ]);
  const getDayName = (dateString) => {
      const date = new Date(dateString);
      const dayNumber = date.getDay();
      return dayNames[dayNumber];
    };
function Dashboard() {
    const [days, setDays]=useState([]);
    const [maxTemp, setMaxTemp]=useState([]);
    const [minTemp, setMinTemp]=useState([]);
    const [weatherCode, setWeatherCode]=useState([]);
    const [wicon, setwicon]=useState();
    const[temp, setTemp]=useState("--");
    const[humidity, sethumidity]=useState("--");
    const[wind, setwind]=useState("--");
    const [status, setStatus]=useState("no");
    let apikey="0b75a0842ee402964c73520f85b4cf22";

    useEffect(()=>{
        setStatus("no");
      }, [])


    const handleSearch= async ()=>{
        setStatus("loading");
        const search=document.querySelector(".search").value;
        if(search==="")
          return;
         try{
          let url=`https://api.openweathermap.org/data/2.5/weather?q=${search}&units=Metric&appid=${apikey}`
          let response2 = await fetch(url);
          let data= await response2.json();
          console.log(data);
          setTemp(data.main.temp);
          sethumidity(data.main.humidity);
          setwind(data.wind.speed);
          let icon=data.weather[0].icon;
          console.log(icon);
    
          if(icon==="01d" || icon==="01n")
            setwicon(clear);
          else if(icon==="02d" || icon==="02n")
            setwicon(could);
          else if(icon==="03d" || icon==="03n" || icon==="04d" || icon==="04n")
            setwicon(could);
          else if( icon==="09d" || icon==="09n")
            setwicon(rain);
          else if(icon==="10d" || icon==="10n")
            setwicon(drizzle);
          else if(icon==="13d" || icon==="13n")
            setwicon(snow);
          else
            setwicon(clear);
  
          const getlocation = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${search}`);
            const geoData = await getlocation.json();
            console.log(geoData.results[0]);
              console.log(geoData.results[0].latitude);
              console.log(geoData.results[0].longitude);
              console.log(geoData.results[0].timezone);
              
            
  
            const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${geoData.results[0].latitude}&longitude=${geoData.results[0].longitude}&timezone=${geoData.results[0].timezone}&daily=weathercode,temperature_2m_max,temperature_2m_min`
            );
            const weatherData = await response.json();
              console.log(weatherData.daily);
               setMaxTemp(weatherData.daily.temperature_2m_max);
               setMinTemp(weatherData.daily.temperature_2m_min);
               setDays(weatherData.daily.time);
               setWeatherCode(weatherData.daily.weathercode);
                setStatus("");
         }catch(e){
            setStatus("notfound");
            setTemp("--");
            sethumidity("--");
            setwicon("--");
            setwind("--");
         }
    }
    
      return (
        <div className='container'>
          <div className='main'>
            <Top />
            <Middle />
            <Bottom />
          </div>
        </div>
      )



  function Top(){
    return(
      <div className='top'>
          <h1>Weather In</h1>
          <div className='searchbox'><input type='text' placeholder='Search from Location' className='search'  onKeyDown={(e)=>{
              if(e.key==='Enter')
              handleSearch();
          }}/>
          <button onClick={handleSearch}><img src={searchicon} alt="Search"/></button></div>
      </div>
    )
  }

  function Middle(){
    return(
      <div className='middle'>
          <h1>{temp}<sup>o</sup></h1>
          {temp!=="--"&& <img src={wicon} className='wicon' alt="No Data"/>}
          <div className='smalldetails'>
          <img src={windimg} className='detailimg' alt='wind'/><span>{wind} mph</span><p></p>
          <img src={humidityimg} className='detailimg' alt='humidity'/>  <span>{humidity} %</span>
          </div>
      </div>
    )
  }

  function Bottom(){
    return (

      <div className='bottom'>
        {status==="no" && <h1>No Results</h1>}
        {status==="loading" &&<h1>Loading...</h1>}
        {status==="notfound" && <h1>No Results found!</h1>}
        {status==="" && days.map((day, i)=>{
          return (
            <div className='day'>
                <h5>{getDayName(day)}</h5>
                <p>{minTemp[i]}<sup>o</sup> -  {maxTemp[i]}<sup>o</sup></p>
                <p> <GetWeatherstatus number={weatherCode[i]}/></p>
            </div>
          )
        })
        }
      </div>
    )
  }

  function GetWeatherstatus({number}){
    for (const [key, value] of icons) {
        if (key.includes(number)) {
          return value;
        }
      }
  }
}

export default Dashboard;