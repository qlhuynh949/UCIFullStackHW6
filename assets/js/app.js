
let uvIndex
let weatherItem = document.getElementById('weatherItem')
let weatherHistoryCache = document.getElementById('weatherHistory')
let day = new moment().format('MM/DD/YYYY')
let uvValue = 0.0
let currentName
let currentSpeed
let currentTemp
let currentHumidity
let currentIcon
let weatherCityCache = []

document.getElementById('searchCityWeather').addEventListener('click', (event) => {
  event.preventDefault()
  let city = document.getElementById('searchCityCriteria').value
  let urlWeather = `http://api.openweathermap.org/data/2.5/weather?q=${city}&APPID=3c181a9afca27b382c5754bb9706b06f`

  searchByCity(city, urlWeather)

})

const displayWeatherItem = () => {
  let uvClass = "uvLow"
  if (uvValue > 3 && uvValue < 6) {
    uvClass = "uvModerate"
  }
  else if (uvValue > 6) {
    uvClass = "uvHigh"
  }
  weatherItem.innerHTML = `<div class="card">
  <div class="card-body">
  <div class="card-title"><h1>${currentName} (${day})  </h1> <img src='http://openweathermap.org/img/wn/${currentIcon}@2x.png'> </div>
      <br> Temperature: ${currentTemp} &#8457;
      <br>Humidity: ${currentHumidity}% 
      <br>Wind Speed: ${currentSpeed} MPH 
      <br><label>UV Index:</label> 
      <div class='${uvClass}'>${uvValue}</div>
      </div>
      </div>`

}


const getUVIndex = (lat, long) => {
  uvURL = `http://api.openweathermap.org/data/2.5/uvi?appid=3c181a9afca27b382c5754bb9706b06f&lat=${lat}&lon=${long}`
  fetch(uvURL)
    .then(r => r.json())
    .then(response => {

      if (response !== undefined || response != null) {
        uvIndex = response
      }
    })
    .catch(e => { console.error(e) })
}
const searchByCity = (city, urlWeather) => {
  fetch(urlWeather)
    .then(r => r.json())
    .then(response => {
      let { coord, weather, base, main, visibility, wind, clouds, dt, sys, timezone, id, name, cod } = response
      let { temp, pressure, humidity } = main
      let { speed } = wind
      currentSpeed = speed
      currentTemp = temp
      currentHumidity = humidity
      currentName = name
      currentIcon = weather[0].icon
      console.log(coord, weather, base, main, visibility, wind, clouds, dt, sys, timezone, id, name, cod)

      getUVIndex(coord.lat, coord.lon)

      uvValue = (uvIndex === undefined) || (uvIndex.value === undefined) || (uvIndex.value === null) ? 0.0 : uvIndex.value

      displayWeatherItem()

      if (!weatherCityCache.includes(name)) {
        let weatherHistoryItem = document.createElement('button')
        let lineBreak1 = document.createElement('br')
        let lineBreak2 = document.createElement('br')

        weatherHistoryItem.classList.add('btn')
        weatherHistoryItem.classList.add('btn-secondary')
        weatherHistoryItem.classList.add('weatherHistory')
        weatherHistoryItem.value = name
        weatherHistoryItem.textContent = name
        weatherCityCache.push(name)
        weatherHistoryCache.append(lineBreak1)
        weatherHistoryCache.append(weatherHistoryItem)
        weatherHistoryCache.append(lineBreak2)
      }
    })
    .catch(e => { console.error(e) })

}

document.addEventListener('click', (event) => {
  event.preventDefault()
  if (event.target.classList.contains('weatherHistory')) {
    document.getElementById('searchCityCriteria').value = event.target.value
    let city = document.getElementById('searchCityCriteria').value
    let urlWeather = `http://api.openweathermap.org/data/2.5/weather?q=${city}&APPID=3c181a9afca27b382c5754bb9706b06f`

    searchByCity(city, urlWeather)

  }
})