import React, { use, useEffect, useState } from 'react'
import './Weatherpage.css'
import axios from 'axios';
import { FaTemperatureHalf } from "react-icons/fa6";
import { FaWind } from "react-icons/fa";
import { WiHumidity } from "react-icons/wi";
import { GiWindsock } from "react-icons/gi";





function Weatherpage() {
  const [inputvalue,setInputvalue]=useState('');
const[data,setData]=useState();
const[futuredata,setFuturedata]=useState('');



useEffect(()=>{
  const fectchdata=async()=>{
  try {
    const response=await axios.get('https://api.openweathermap.org/data/2.5/weather?q=chennai&appid=8b33822d9aba521fab8d2fea8265453b')
    setData(response.data);
  } catch (error) {
    console.log(error)
  }
}
fectchdata();

},[inputvalue])






  const handlesubmit=async()=>{

    try{


  const response= await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${inputvalue}&appid=8b33822d9aba521fab8d2fea8265453b`)
setData(response.data);

}
catch(error){
  console.error(error);
}

  }


 //future weather api call
  const fetchapi=async()=>{
    try{
       const res=await axios.get(`https://api.openweathermap.org/data/2.5/forecast?q=${inputvalue}&appid=8b33822d9aba521fab8d2fea8265453b`)
      setFuturedata(res?.data);
        console.log(res?.data);
      
    }
    catch(error){
      console.log(error)
     }
   }
  


  const handlekeydown=(event)=>{
    if(event.key==="Enter")
    {
      handlesubmit();
      fetchapi();
    }
  };
  const date=new Date();
  const currentdate=date.toLocaleDateString("en-US",{
    month:"long",
    day:"numeric",
    year:"numeric",
  })


  






  return (
    <div>
      <div className='main'>
        <div className='text-white text-center p-3 mb-3 nav-bar'>
           <div className="title">
             <h6>Weather App</h6>
           </div>
           <div className="search-bar">
            <input type="text"  value={inputvalue} onKeyDown={handlekeydown}  placeholder='Search' onChange={(e)=>{setInputvalue(e.target.value)}} />
            <button onClick={handlesubmit} className='px-2 py-1 search-btn'>Search</button>
           </div>
            
        </div>
        
        <div className='city-main'>
          <img  src={`https://openweathermap.org/img/wn/${data?.weather[0].icon}@2x.png`} alt=""  

   />
          <h3 className='city-name'>{data?.name}</h3>
         
          <p>{currentdate}</p>
      
        </div>
        
       
          <div className="weather-report">
            
            <div className='temp'>
              <h5><FaTemperatureHalf /></h5>
             <div className='temp1'> 
              <h5 className='temp2'>temp</h5>
              <h4>
                {Math.round(data?.main?.temp-273.15) ??'--'}°C</h4></div>
              </div>

               <div className='temp'>
              <h5><FaWind /></h5>
             <div className='temp1'> 
              <h5 className='temp2'>Wind</h5>
              <h4>
                {data?.wind?.speed ?? '--'} km/h</h4></div>
              </div>

               <div className='temp'>
              <h5><WiHumidity /></h5>
             <div className='temp1'> 
              <h5 className='temp2'>Humidity</h5>
              <h4>
                {data?.main?.humidity ?? '--'} %</h4></div>
              </div>

               <div className='temp'>
              <h5><GiWindsock /></h5>
             <div className='temp1'> 
              <h5 className='temp2'>Wind Direction</h5>
              <h4>
                {data?.wind?.deg ?? '--'}°</h4></div>
              </div>
          </div>
           

          {/* future weather data */}
          {futuredata.list &&(
            <div className='future-data'>
            <h3 className='text-white'>Future Forecast</h3>
              <ul>
            {futuredata.list.slice(0,5).map((item, index) => (
              <li >
                <img 
  src={`https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`} 
  alt={item.weather[0].description} 
/>

                <strong>{new Date(item.dt*1000).toLocaleString()}</strong>
                
                <div className='future-card'> 
                  <h4 className='text'><strong>temp:</strong>{Math.round(item.main.temp-273.15)} °C <br /></h4>
                <h4 className='text'><strong>Weather:</strong> {item.weather[0].description} <br /></h4>
                <h4 className='text'><strong>Humidity:</strong>{item.main.humidity}%</h4></div>
              </li>
            ))}
          </ul> 

            

          </div>

          )}
          



      </div>
    </div>
  )
}

export default Weatherpage
