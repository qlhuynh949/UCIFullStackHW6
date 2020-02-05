
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
let fiveDayForecast
let fiveDay = []

document.getElementById('searchCityWeather').addEventListener('click', (event) => {
  event.preventDefault()
  let city = document.getElementById('searchCityCriteria').value
  let urlWeather = `http://api.openweathermap.org/data/2.5/weather?q=${city}&APPID=3c181a9afca27b382c5754bb9706b06f`

  searchByCity(city, urlWeather)

})

const displayForecast = () => {
  if (fiveDayForecast !== undefined) {
    fiveDay = []
    let { list: items } = fiveDayForecast
    for (let i = 0; i < items.length; i++) {
      let dayTime = items[i].dt_txt
      let currentHour = moment(dayTime).format('HH')
      // since its a 5 day hourly forecast we will look at the weather at 12noon

      if (currentHour === '12') {
        fiveDay.push(items[i])
      }

    }
    let container = document.getElementById
      ('weatherForecast')
    container.innerHTML = ""

    let cardHTML = "<div class='forecastLabel'>5-day forecast</div>: <br>"
    for (let j = 0; j < fiveDay.length; j++) {
      let newCard = renderForecastCard(fiveDay[j])
      cardHTML += newCard.innerHTML
    }
    container.innerHTML = cardHTML
  }
}

const renderForecastCard = (cardData) => {
  let newForecastCard = document.createElement('div')

  let { dt, main, weather, clouds, wind, sys, dt_txt } = cardData
  let forecastDay = moment(dt_txt).format('MM/DD/YYYY')

  newForecastCard.innerHTML = `<div class="card forecastCard">
  <div class="card-body">
  <div class="card-title"><h1>${forecastDay}  </h1> <img src='http://openweathermap.org/img/wn/${weather[0].icon}@2x.png'> </div>
      <br> Temperature: ${main.temp} &#8457;
      <br>Humidity: ${main.humidity}% 
      <br>Wind Speed: ${wind.speed} MPH 
      </div>
      </div>`
  return newForecastCard
  //container.append(newForecastCard)
}

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

const getFiveDayForecastByCity = (lat, long) => {
  let forecastURL = `http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${long}&appid=3c181a9afca27b382c5754bb9706b06f`
  fetch(forecastURL)
    .then(r => r.json())
    .then(response => {

      if (response !== undefined || response != null) {
        fiveDayForecast = response
        displayForecast()

      }
    })
    .catch(e => { console.error(e) })

}

const getUVIndex = (lat, long) => {
  uvURL = `http://api.openweathermap.org/data/2.5/uvi?appid=3c181a9afca27b382c5754bb9706b06f&lat=${lat}&lon=${long}`
  fetch(uvURL)
    .then(r => r.json())
    .then(response => {

      if (response !== undefined || response != null) {
        uvIndex = response
        displayWeatherItem()

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

      getUVIndex(coord.lat, coord.lon)
      getFiveDayForecastByCity(coord.lat, coord.lon)


      uvValue = (uvIndex === undefined) || (uvIndex.value === undefined) || (uvIndex.value === null) ? 0.0 : uvIndex.value


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