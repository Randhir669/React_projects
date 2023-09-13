import 'bootstrap/dist/css/bootstrap.min.css'
import './App.css';
import { useEffect, useState } from 'react';
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { faLocationCrosshairs} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

function App() {
  const [city, setcity] = useState('Delhi')
  const [weather, setWeatherData] = useState('')
  const [cityresult, setcityresult] = useState('')
  const [bgview, setbgview] = useState('weatherbg')
  const [weatherdesc, setweatherdesc] = useState('')
  const [showsearchbutton, setshowsearchbutton] = useState(true)
  const [showloadingbutton, setshowloadingbutton] = useState(false)
  const [humidity, sethumidity] = useState('')
  const [wind, setwind] = useState('')
  const MySwal = withReactContent(Swal)



  useEffect(() => {
    getweatherinfo('Delhi')
    setTimeout(() => {
      setcity('')
    }, 10);
   
  }, []);// eslint-disable-line react-hooks/exhaustive-deps


  function handleOnLocation() {
    getcurrentlocation()
    
  }
  

  function getcurrentlocation() {

    if ("geolocation" in navigator) {
      // Geolocation is available
      navigator.geolocation.getCurrentPosition(function (position) {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);
        getlocationName(latitude, longitude)

        // You can use the latitude and longitude for various purposes here
      }, function (error) {
        // Handle any errors that may occur when retrieving the location
        
        switch (error.code) {// eslint-disable-line
          case error.PERMISSION_DENIED:
            console.log("User denied the request for Geolocation.");
            break;
          case error.POSITION_UNAVAILABLE:
            console.log("Location information is unavailable.");
            break;
          case error.TIMEOUT:
            console.log("The request to get user location timed out.");
            break;
          case error.UNKNOWN_ERROR:
            console.log("An unknown error occurred.");
            break;
        }
      });
    } else {
      // Geolocation is not available in this browser
      console.log("Geolocation is not available in this browser.");
    }

  }

  function getlocationName(lat, long) {
    const apiKey = 'bb4a3332a5dd4176b1d4071d05b892de'

    const apiUrl = `https://api.opencagedata.com/geocode/v1/json?key=${apiKey}&q=${lat}+${long}`;

    fetch(apiUrl)
      .then((response) => response.json())
      .then((data) => {
        if (data.results.length > 0) {
          const components = data.results[0].components;
          let district = components.county || components.state_district;
          console.log(`District: ${district}`);
          district = district.split(' ')[0]
         // getweatherinfo(district);
          setcity(district)         
        } else {
          console.error('Location not found.');
        }
      })
      .catch((error) => {
        console.error('Error fetching location data:', error);
      });
  }

  function searchweather() {
    setshowsearchbutton(false)
    setshowloadingbutton(true)
    getweatherinfo(city)

  }

  function getweatherinfo(location) {
   console.log("Inside weatherinfo",city)
         var locationName = city===''?location:city
    var apiKey = '04fca501ffafa1da85c4c2954f3df73b'
    if (locationName !== '') {
      fetch(`https://api.openweathermap.org/data/2.5/weather?q=${locationName}&appid=${apiKey}`)
        .then((response) => response.json())
        .then((data) => {
          console.log(data)
          if (data.cod !== '404') {
            const tempreature = data.main.temp;
            const tempIncelcius = Math.floor(tempreature - 273.15) + "°C"
            const humid = "Humidity: " + data.main.humidity + " %"
            const wind = "Wind: " + data.wind.speed + " mph"
            let sky = data.weather[0].main
            if (sky !== 'Rain' && sky !== 'Haze' && sky !== 'Clouds' && sky !== 'Thunderstorm') {
              sky = 'Haze'
            }
            setbgview(sky)
            sethumidity(humid)
            setwind(wind)
            setcityresult(data.name)
            setWeatherData(tempIncelcius)
            setweatherdesc(data.weather[0].description.toUpperCase())
            setshowloadingbutton(false)
            setshowsearchbutton(true)
          } else {
            MySwal.fire({
              title: <strong>City not found!</strong>,
              html: <i>please search other city</i>,
              icon: 'warning'
          })

            setshowloadingbutton(false)
            setshowsearchbutton(true)
          }
        })
    }else{
      alert("City Not found!!")
    }
  }


  return (
    <div className="col-md-12">

      <div className={bgview}>
        
        <div className='row col-6 d-grid'>
          <div className='row' style={{ width: '100%' }}>
            <div className='col-md-6 offset-md-3' style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
              <div className='d-grid'>               
              <FontAwesomeIcon icon={faLocationCrosshairs}  title="Click to get current location" className="ml-1 btn icons" onClick={handleOnLocation} />

               <h6 className='weatherdesc'> {weatherdesc}</h6>
                <input value={city} type='text' placeholder='Search City' className='form-control' onChange={(e) => setcity(e.target.value)}></input>
                {showsearchbutton && <button className='btn btn-dark my-3' type="button" onClick={searchweather}>Search</button>}
                {showloadingbutton && <button className="btn btn-dark my-3" type="button" disabled>
                  <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                  &nbsp;Search
                </button>}
                <h5 className='city align'>{cityresult} IN</h5>
                <hr></hr>
                <h6 className='city align'>Temperature  {weather} ({weatherdesc})</h6>
                <hr></hr>
                <h5 className='city align'>{humidity}</h5>
                <hr></hr>
                <h6 className='city align'>{wind}</h6>
                <hr></hr>

              </div>

            </div>
          </div>









        </div>






      </div>
    </div>
  );
}

export default App;
