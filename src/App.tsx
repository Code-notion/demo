import React, { useState } from 'react';
import './App.css';
import LoadingButton from '@mui/lab/LoadingButton';
import AddLocationIcon from '@mui/icons-material/AddLocation';
function App() {
  const [lat, setLat] = useState("");
  const [long, setLong] = useState("");
  const [address, setAddress] = useState<any>(null);
  const [isShownAddress, setIsShownAddress] = useState(false);
  const [isLoading, setisLoading] = useState(false);
  const [isBlocked, setisBlocked] = useState(false);
  const getLocation = () => {
    setisLoading(true);
    var geoOps = {
      enableHighAccuracy: true,
      timeout: 10000 //10 seconds
    }
    navigator.geolocation.getCurrentPosition(successCallback, errorCallback, geoOps);
  }
  const successCallback = (pos: any) => {
    setisBlocked(false);
    var _lat = pos.coords.latitude;
    var _long = pos.coords.longitude;
    const options = {
      method: 'GET',
    };
    fetch(`https://api.opencagedata.com/geocode/v1/json?key=bb08e60798df43eab80b248880e02f7b&q=${_lat}%2C${_long}&pretty=1`, options)
      .then(response => response.json())
      .then(response => setAddress(response?.results[0]?.components))
      .catch(err => errorCallback(err));
    setLat(_lat);
    setLong(_long);
    setIsShownAddress(true);
    setisLoading(false)
  }
  const errorCallback = (e: any) => {
    console.log("error", e)
    setisBlocked(true);
    setIsShownAddress(false);
    setisLoading(false)
  }
  return (
    <div className="App">
      {
        isBlocked ? <p>Please allow the location permission to proceed further.</p> :
          <>
            <LoadingButton
              loading={isLoading}
              loadingPosition="start"
              startIcon={!isShownAddress && <AddLocationIcon />}
              variant="contained"
              onClick={() => isShownAddress ? setIsShownAddress(false) : getLocation()}
            >
              {isShownAddress ? "Hide" : "Show"} Location
            </LoadingButton>
            {
              isShownAddress && <>
                <p>You are currnetly at Lat: {lat} , Long: {long}</p>
                {
                  address && <>
                    <p>Country : {address?.country}</p>
                    <p>State : {address?.state}</p>
                    <p>District : {address?.state_district}</p>
                    <p>Address : {address?.road}, {address?.hamlet}, {address?.neighbourhood}, {address?.county}</p>
                    <p>Pincode / ZipCode : {address.postcode}</p>
                  </>
                }
              </>
            }
          </>
      }

    </div>
  );
}

export default App;
