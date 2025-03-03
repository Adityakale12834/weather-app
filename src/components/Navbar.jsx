import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
// import { setLocation, setError } from './app/slices/currentLocationSlice';
import { changeTheme } from './app/slices/themeSlice';
function Navbar() {
  // const [location, setLocation] = useState(null);
  const theme = useSelector((state) => state.theme.value);
  console.log(theme);
  // console.log(location1);

  const dispatch = useDispatch()

  // const handleClick = () => {
  //   const data = navigator.geolocation.getCurrentPosition((position) => {
  //     // setLocation({
  //     //   latitude: position.coords.latitude,
  //     //   longitude: position.coords.longitude
  //     // });
  //     console.log(position);
  //     dispatch(setLocation({ lat: position.coords.latitude, lng: position.coords.longitude }));
  //   }
  //   );
  // }

  return (
    <div className=' font-bold text-gray-100 flex justify-start gap-10 items-center px-4 sm:px-10 bg-gray-600 py-5'>
      <div className='text-2xl'>
        Weather App
      </div>
      <div>
        <button className='cursor-pointer' onClick={() => {
          dispatch(changeTheme(theme === 'light' ? 'dark' : 'light'))
        }}>{ (theme === 'dark') ? "Light Mode" : "Dark Mode"}</button>
      </div>
    </div>
  )
}

export default Navbar