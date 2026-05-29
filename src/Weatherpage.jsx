import React, { useEffect, useState } from 'react'
import './Weatherpage.css'
import axios from 'axios'
import { FaTemperatureHalf } from 'react-icons/fa6'
import { FaWind } from 'react-icons/fa'
import { WiHumidity, WiSunrise, WiSunset } from 'react-icons/wi'
import { GiWindsock } from 'react-icons/gi'

const API_KEY = '8b33822d9aba521fab8d2fea8265453b'

function Weatherpage() {
  const [inputvalue, setInputvalue] = useState('')
  const [data, setData] = useState(null)
  const [futuredata, setFuturedata] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [unit, setUnit] = useState('metric')

  const tempLabel = unit === 'metric' ? '°C' : '°F'
  const windLabel = unit === 'metric' ? 'm/s' : 'mph'

  const formatTime = (timestamp) => {
    if (!timestamp) return '--'
    return new Date(timestamp * 1000).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const fetchWeather = async ({ city, lat, lon }) => {
    const query = city ? `q=${city}` : `lat=${lat}&lon=${lon}`
    if (!query) return

    setIsLoading(true)
    setError('')

    try {
      const [currentResponse, forecastResponse] = await Promise.all([
        axios.get(
          `https://api.openweathermap.org/data/2.5/weather?${query}&appid=${API_KEY}&units=${unit}`
        ),
        axios.get(
          `https://api.openweathermap.org/data/2.5/forecast?${query}&appid=${API_KEY}&units=${unit}`
        ),
      ])

      setData(currentResponse.data)
      setFuturedata(forecastResponse.data)
    } catch (fetchError) {
      console.error(fetchError)
      if (fetchError.response?.status === 404) {
        setError('City not found. Please try again.')
      } else {
        setError('Unable to load weather data. Please try again later.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  const searchWeather = async (city = inputvalue) => {
    if (!city.trim()) return
    await fetchWeather({ city })
  }

  const getCurrentLocationWeather = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser.')
      return
    }

    setError('')
    setIsLoading(true)

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords
        await fetchWeather({ lat: latitude, lon: longitude })
      },
      () => {
        setError('Unable to access location. Please allow location access.')
        setIsLoading(false)
      }
    )
  }

  useEffect(() => {
    fetchWeather({ city: 'Chennai' })
  }, [])

  useEffect(() => {
    if (data?.name) {
      fetchWeather({ city: data.name })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [unit])

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      searchWeather()
    }
  }

  const currentdate = new Date().toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })

  return (
    <div className='main'>
      <div className='container py-4'>
        <div className='d-flex flex-column flex-md-row justify-content-between align-items-center gap-3 mb-4 top-controls'>
          <div className='title'>
            <h6 className='mb-0'>Weather App</h6>
          </div>

          <div className='search-actions w-100 w-md-auto'>
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

            <div className='action-buttons d-flex flex-wrap gap-2 mt-2 mt-md-0'>
              <button type='button' className='btn btn-outline-light' onClick={getCurrentLocationWeather}>
                Current location
              </button>
              <div className='btn-group unit-toggle' role='group' aria-label='Temperature units'>
                <button
                  type='button'
                  className={`btn btn-outline-light ${unit === 'metric' ? 'active' : ''}`}
                  onClick={() => setUnit('metric')}
                >
                  °C
                </button>
                <button
                  type='button'
                  className={`btn btn-outline-light ${unit === 'imperial' ? 'active' : ''}`}
                  onClick={() => setUnit('imperial')}
                >
                  °F
                </button>
              </div>
            </div>
          </div>
        </div>

        {isLoading && <div className='status-message'>Loading weather data...</div>}
        {error && <div className='status-message error'>{error}</div>}

        <div className='text-center text-white mb-3'>
          <img
            src={`https://openweathermap.org/img/wn/${data?.weather?.[0]?.icon}@2x.png`}
            alt={data?.weather?.[0]?.description || 'Weather icon'}
            className='weather-icon mx-auto mb-2'
          />
          <h3 className='city-name mb-1'>{data?.name || 'Chennai'}</h3>
          <p className='small opacity-75 mb-1'>{currentdate}</p>
          <p className='small text-capitalize mb-2'>{data?.weather?.[0]?.description || 'Clear sky'}</p>
          <div className='d-flex justify-content-center gap-4 small text-white weather-times'>
            <span>
              <WiSunrise /> {formatTime(data?.sys?.sunrise)}
            </span>
            <span>
              <WiSunset /> {formatTime(data?.sys?.sunset)}
            </span>
          </div>
        </div>

        <div className='row row-cols-1 row-cols-sm-2 row-cols-lg-3 g-3'>
          <div className='col'>
            <div className='card weather-card h-100 text-center'>
              <div className='card-body'>
                <h5 className='mb-3 text-primary'>
                  <FaTemperatureHalf />
                </h5>
                <h6 className='card-title'>Temperature</h6>
                <p className='card-text display-6 mb-0'>
                  {data ? Math.round(data.main.temp) : '--'} {tempLabel}
                </p>
              </div>
            </div>
          </div>

          <div className='col'>
            <div className='card weather-card h-100 text-center'>
              <div className='card-body'>
                <h5 className='mb-3 text-primary'>
                  <FaTemperatureHalf />
                </h5>
                <h6 className='card-title'>Feels Like</h6>
                <p className='card-text display-6 mb-0'>
                  {data ? Math.round(data.main.feels_like) : '--'} {tempLabel}
                </p>
              </div>
            </div>
          </div>

          <div className='col'>
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

          <div className='col'>
            <div className='card weather-card h-100 text-center'>
              <div className='card-body'>
                <h5 className='mb-3 text-primary'>
                  <FaWind />
                </h5>
                <h6 className='card-title'>Wind</h6>
                <p className='card-text display-6 mb-0'>
                  {data?.wind?.speed ?? '--'} {windLabel}
                </p>
              </div>
            </div>
          </div>

          <div className='col'>
            <div className='card weather-card h-100 text-center'>
              <div className='card-body'>
                <h5 className='mb-3 text-primary'>
                  <GiWindsock />
                </h5>
                <h6 className='card-title'>Wind Direction</h6>
                <p className='card-text display-6 mb-0'>
                  {data?.wind?.deg ?? '--'} °
                </p>
              </div>
            </div>
          </div>

          <div className='col'>
            <div className='card weather-card h-100 text-center'>
              <div className='card-body'>
                <h5 className='mb-3 text-primary'>
                  <WiSunrise />
                </h5>
                <h6 className='card-title'>Pressure</h6>
                <p className='card-text display-6 mb-0'>
                  {data?.main?.pressure ?? '--'} hPa
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
                      <p className='mb-1'>Temp: {Math.round(item.main.temp)} {tempLabel}</p>
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
