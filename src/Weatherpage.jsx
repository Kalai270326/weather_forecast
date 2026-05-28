import React, { useEffect, useState } from 'react'
import './Weatherpage.css'
import axios from 'axios'
import { FaTemperatureHalf } from 'react-icons/fa6'
import { FaWind } from 'react-icons/fa'
import { WiHumidity } from 'react-icons/wi'
import { GiWindsock } from 'react-icons/gi'

function Weatherpage() {
  const [inputvalue, setInputvalue] = useState('')
  const [data, setData] = useState(null)
  const [futuredata, setFuturedata] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          'https://api.openweathermap.org/data/2.5/weather?q=chennai&appid=8b33822d9aba521fab8d2fea8265453b'
        )
        setData(response.data)
      } catch (error) {
        console.log(error)
      }
    }

    fetchData()
  }, [])

  const searchWeather = async () => {
    if (!inputvalue.trim()) return

    try {
      const [currentResponse, forecastResponse] = await Promise.all([
        axios.get(
          `https://api.openweathermap.org/data/2.5/weather?q=${inputvalue}&appid=8b33822d9aba521fab8d2fea8265453b`
        ),
        axios.get(
          `https://api.openweathermap.org/data/2.5/forecast?q=${inputvalue}&appid=8b33822d9aba521fab8d2fea8265453b`
        ),
      ])

      setData(currentResponse.data)
      setFuturedata(forecastResponse.data)
    } catch (error) {
      console.error(error)
    }
  }

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      searchWeather()
    }
  }

  const date = new Date()
  const currentdate = date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })

  return (
    <div className='main'>
      <div className='container py-4'>
        <div className='d-flex flex-column flex-md-row justify-content-between align-items-center gap-3 mb-4'>
          <div className='title'>
            <h6 className='mb-0'>Weather App</h6>
          </div>

          <div className='input-group shadow-sm w-100 w-md-auto'>
            <input
              type='text'
              value={inputvalue}
              onKeyDown={handleKeyDown}
              onChange={(e) => setInputvalue(e.target.value)}
              placeholder='Search city'
              className='form-control rounded-start'
              aria-label='Search city'
            />
            <button type='button' className='btn btn-light rounded-end' onClick={searchWeather}>
              Search
            </button>
          </div>
        </div>

        <div className='text-center text-white mb-4'>
          <img
            src={`https://openweathermap.org/img/wn/${data?.weather?.[0]?.icon}@2x.png`}
            alt={data?.weather?.[0]?.description || 'Weather icon'}
            className='weather-icon mx-auto mb-2'
          />
          <h3 className='city-name mb-1'>{data?.name || 'Chennai'}</h3>
          <p className='small opacity-75 mb-0'>{currentdate}</p>
        </div>

        <div className='row g-3'>
          <div className='col-12 col-sm-6 col-lg-3'>
            <div className='card weather-card h-100 text-center'>
              <div className='card-body'>
                <h5 className='mb-3 text-primary'>
                  <FaTemperatureHalf />
                </h5>
                <h6 className='card-title'>Temperature</h6>
                <p className='card-text display-6 mb-0'>
                  {data ? Math.round(data.main.temp - 273.15) : '--'} C
                </p>
              </div>
            </div>
          </div>

          <div className='col-12 col-sm-6 col-lg-3'>
            <div className='card weather-card h-100 text-center'>
              <div className='card-body'>
                <h5 className='mb-3 text-primary'>
                  <FaWind />
                </h5>
                <h6 className='card-title'>Wind</h6>
                <p className='card-text display-6 mb-0'>
                  {data?.wind?.speed ?? '--'} km/h
                </p>
              </div>
            </div>
          </div>

          <div className='col-12 col-sm-6 col-lg-3'>
            <div className='card weather-card h-100 text-center'>
              <div className='card-body'>
                <h5 className='mb-3 text-primary'>
                  <WiHumidity />
                </h5>
                <h6 className='card-title'>Humidity</h6>
                <p className='card-text display-6 mb-0'>
                  {data?.main?.humidity ?? '--'}%
                </p>
              </div>
            </div>
          </div>

          <div className='col-12 col-sm-6 col-lg-3'>
            <div className='card weather-card h-100 text-center'>
              <div className='card-body'>
                <h5 className='mb-3 text-primary'>
                  <GiWindsock />
                </h5>
                <h6 className='card-title'>Wind Direction</h6>
                <p className='card-text display-6 mb-0'>
                  {data?.wind?.deg ?? '--'} deg
                </p>
              </div>
            </div>
          </div>
        </div>

        {futuredata?.list && (
          <div className='mt-4'>
            <h3 className='text-white mb-3'>Future Forecast</h3>
            <div className='row row-cols-1 row-cols-sm-2 row-cols-lg-5 g-3'>
              {futuredata.list.slice(0, 5).map((item, index) => (
                <div className='col' key={index}>
                  <div className='card future-item h-100 text-center'>
                    <div className='card-body'>
                      <img
                        src={`https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`}
                        alt={item.weather[0].description}
                        className='future-icon mb-2'
                      />
                      <p className='small text-muted'>
                        {new Date(item.dt * 1000).toLocaleString()}
                      </p>
                      <p className='mb-1'>Temp: {Math.round(item.main.temp - 273.15)} C</p>
                      <p className='mb-1 text-capitalize'>Weather: {item.weather[0].description}</p>
                      <p className='mb-0'>Humidity: {item.main.humidity}%</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Weatherpage
