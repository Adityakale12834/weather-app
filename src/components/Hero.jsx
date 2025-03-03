import React, { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import WeatherChart from "./Chart";
import { setLocation } from "./app/slices/currentLocationSlice";

const API_KEY = "f48818daebfd6448d6f8c20b7cae5d4e"; // Replace with your OpenWeatherMap API key

function Hero() {
    const [searchLocation, setSearchLocation] = useState("");
    const [cityWeather, setCityWeather] = useState(null);
    const [weatherIcon, setWeatherIcon] = useState("");
    const [cities, setCities] = useState([]);
    const [localCities, setLocalCities] = useState([]);
    const [selectedCity, setSelectedCity] = useState("");
    const dispatch = useDispatch();
    const theme = useSelector((state) => state.theme.value);
    const location1 = useSelector((state) => state.location);

    console.log(location1);

    const fetchCities = async (city) => {
        if (!city) return;
        try {
            const response = await fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=5&appid=${API_KEY}`);
            const data = await response.json();
            setCities(data);
        } catch (error) {
            console.error("Error fetching cities:", error);
        }
    };

    const fetchWeatherData = async (city) => {
        try {
            let response;
            if (location1.location.lng && location1.location.lat) {
                response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${location1.location.lat}&lon=${location1.location.lng}&units=metric&appid=${API_KEY}`)
            } else {
                response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`);
            }
            const data = await response.json();
            console.log("Weather data:", data);
            if (data.cod !== 200) {
                console.error("Error fetching weather data:", data.message);
                return;
            }
            setCityWeather(data);
            setWeatherIcon(`https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`);
        } catch (error) {
            console.error("Error fetching weather data:", error);
        }
    };

    const handleCitySelect = (city) => {
        fetchWeatherData(city);
        let storedCities = JSON.parse(localStorage.getItem("cities")) || [];
        if (!storedCities.includes(city)) {
            storedCities.unshift(city);
            setLocalCities(storedCities);
            localStorage.setItem("cities", JSON.stringify(storedCities));
        }
        setCities([]);
    };

    const fetchLocalCities = useCallback(() => {
        const storedCities = localStorage.getItem("cities");
        if (storedCities) {
            setLocalCities(JSON.parse(storedCities));
        }
    }, []);

    const handleUseCurrentLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    dispatch(setLocation({ lat: latitude, lng: longitude }));
                    fetchWeatherData(null); // Use lat/lng to fetch the weather data
                },
                (error) => {
                    console.error("Error getting location:", error);
                }
            );
        } else {
            alert("Geolocation is not supported by this browser.");
        }
    };

    useEffect(() => {
        if (location1.location.lat && location1.location.lng) {
            fetchWeatherData(null); // Use current location if available
        } else {
            fetchWeatherData(selectedCity); // Use selected city if no location available
        }
        fetchLocalCities();
    }, [selectedCity, fetchLocalCities, location1]);

    useEffect(() => {
        fetchWeatherData('wardha');
    }, []);

    return (
        // <div className= "text-white h-fit p-5">
        //     <div className="flex flex-wrap gap-4 md:grid md:grid-cols-3 md:grid-rows-2">
        //         <div className="relative w-full h-full md:row-span-2 p-5 border-r border-gray-700">
        //             <form onSubmit={(e) => { e.preventDefault(); if (searchLocation) handleCitySelect(searchLocation); }}>
        //                 <label htmlFor="search" className="sr-only">Search</label>
        //                 <div className="relative">
        //                     <input
        //                         type="text"
        //                         id="search"
        //                         className="block w-full p-4 pl-10 text-sm text-gray-200 border border-gray-600 rounded-lg bg-gray-800 focus:ring-blue-500 focus:border-blue-500"
        //                         placeholder="Search City"
        //                         onChange={(e) => fetchCities(e.target.value)}
        //                     />
        //                     <button type="submit" className="text-white absolute right-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 font-medium rounded-lg text-sm px-4 py-2">Search</button>
        //                 </div>
        //                 {cities.length > 0 && (
        //                     <div className="absolute w-full bg-gray-800 mt-2 rounded-lg shadow-lg z-10">
        //                         {cities.map((city, index) => (
        //                             <div key={index} className="p-3 hover:bg-gray-700 cursor-pointer" onClick={() => {
        //                                 dispatch(setLocation({lat:null, lng: null}))
        //                                 handleCitySelect(city.name);
        //                             }}>
        //                                 {city.name}, {city.state ? city.state + ", " : ""}{city.country}
        //                             </div>
        //                         ))}
        //                     </div>
        //                 )}
        //             </form>
        //             <button
        //                 onClick={handleUseCurrentLocation}
        //                 className="w-full text-white bg-blue-700 hover:bg-blue-800 font-medium rounded-lg text-sm px-4 py-2 mt-5"
        //             >
        //                 Use My Current Location
        //             </button>
        //             <div className="mt-10">
        //                 <h3 className="text-lg font-semibold mb-3">Recent Searches</h3>
        //                 <div className="space-y-2">
        //                     {localCities.map((city, index) => (
        //                         <button key={index} className='block w-full text-left p-3 bg-gray-800 rounded-lg hover:bg-gray-700 transition duration-300 ease-in-out hover:-translate-y-1 hover:scale-105' id={theme !== 'dark' ?  'white' : "dark"} style={{backgroundColor : theme === 'whilte' ? 'oklch(0.21 0.034 264.665)' : ''}} onClick={() => handleCitySelect(city)}>
        //                             {city}
        //                         </button>
        //                     ))}
        //                 </div>
        //             </div>
        //         </div>

        //         {cityWeather && (
        //             <div className="w-full h-[90vh] md:col-span-2 md:row-span-2 overflow-y-auto">
        //                 <h1 className="px-10 text-3xl font-bold">{cityWeather.name}</h1>
        //                 <div className="grid grid-cols-3 grid-rows-4 gap-4 p-5">
        //                     <div className="h-52 p-3 flex items-center justify-center border border-gray-700 bg-gray-800 rounded-xl transition duration-300 ease-in-out hover:-translate-y-1 hover:scale-110">
        //                         <div className="text-center font-bold">
        //                             <h1 className="text-md sm:text-4xl">{cityWeather.main.temp}°C</h1>
        //                             <p className="text-gray-400">Feels like: {cityWeather.main.feels_like}°C</p>
        //                         </div>
        //                     </div>
        //                     <div className="p-3 flex items-center justify-center border border-gray-700 bg-gray-800 rounded-xl transition duration-300 ease-in-out hover:-translate-y-1 hover:scale-110">
        //                         <div className="text-center font-bold">
        //                             <h1 className="text-2xl">{cityWeather.main.pressure} hPa</h1>
        //                             <p className="text-gray-400">Pressure</p>
        //                         </div>
        //                     </div>
        //                     <div className="p-3 flex items-center justify-center border border-gray-700 bg-gray-800 rounded-xl transition duration-300 ease-in-out hover:-translate-y-1 hover:scale-110">
        //                         <div className="text-center font-bold">
        //                             <h1 className="text-2xl">{cityWeather.main.humidity}%</h1>
        //                             <p className="text-gray-400">Humidity</p>
        //                         </div>
        //                     </div>
        //                     <div className="col-span-3 p-3 flex flex-col items-center justify-center border border-gray-700 bg-gray-800 rounded-xl">
        //                         <img src={weatherIcon} alt="Weather icon" className="w-24" />
        //                         <h1 className="text-2xl">{cityWeather.weather[0].description}</h1>
        //                     </div>
        //                     <div className="col-span-3 row-span-2 row-start-3 p-5">
        //                         <WeatherChart data={cityWeather.name} />
        //                     </div>
        //                 </div>
        //             </div>
        //         )}
        //     </div>
        // </div>
        <div className={`${theme === "dark" ? "dark bg-gray-900 text-white" : "bg-gray-100 text-gray-900"} h-[91vh] p-5`}>
            <div className="flex flex-wrap gap-4 md:grid md:grid-cols-3 md:grid-rows-2">
                {/* Search Box */}
                <div className="relative w-full h-full md:row-span-2 p-5 border-r border-gray-700">
                    <form onSubmit={(e) => { e.preventDefault(); if (searchLocation) handleCitySelect(searchLocation); }}>
                        <label htmlFor="search" className="sr-only">Search</label>
                        <div className="relative">
                            <input
                                type="text"
                                id="search"
                                className="block w-full p-4 pl-10 text-sm border rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Search City"
                                onChange={(e) => fetchCities(e.target.value)}
                                style={{ backgroundColor: theme === "dark" ? "#1f2937" : "#ffffff", color: theme === "dark" ? "#f1f1f1" : "#000000" }}
                            />
                            <button type="submit" className="absolute right-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 font-medium rounded-lg text-sm px-4 py-2">
                                Search
                            </button>
                        </div>
                        {cities.length > 0 && (
                            <div className="absolute w-full">
                                <div className=" bg-gray-800 mt-2 rounded-lg shadow-lg z-10 text-white">
                                    {cities.map((city, index) => (
                                        <div key={index} className="p-3 hover:bg-gray-700 cursor-pointer" onClick={() => {
                                            dispatch(setLocation({ lat: null, lng: null }))
                                            handleCitySelect(city.name);
                                        }}>
                                            {city.name}, {city.state ? city.state + ", " : ""}{city.country}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </form>
                    <button
                        onClick={handleUseCurrentLocation}
                        className="w-full text-white bg-blue-700 hover:bg-blue-800 font-medium rounded-lg text-sm px-4 py-2 mt-5"
                    >
                        Use My Current Location
                    </button>
                    {/* Recent Searches */}
                    <div className="mt-10">
                        <h3 className="text-lg font-semibold mb-3">Recent Searches</h3>
                        <div className="space-y-2 h-[58vh] overflow-y-auto">
                            {localCities.map((city, index) => (
                                <button
                                    key={index}
                                    className={`block w-full text-left p-3 rounded-lg transition duration-300 ease-in-out hover:-translate-y-1 hover:scale-105'
                                                ${theme === "dark" ? "bg-gray-800 hover:bg-gray-700" : "bg-gray-300 hover:bg-gray-600 border border-gray-500"}`}
                                    onClick={() => handleCitySelect(city)}
                                >
                                    {city}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Weather Details */}
                {cityWeather && (
                    <div className="w-full h-[90vh] md:col-span-2 md:row-span-2 overflow-y-auto">
                        <h1 className="px-10 text-3xl font-bold">{cityWeather.name}</h1>
                        <div className="grid grid-cols-3 grid-rows-4 gap-4 p-5">
                            {/* Temperature */}
                            <div className={`h-52 p-3 flex items-center justify-center border rounded-xl transition duration-300 ease-in-out hover:-translate-y-1 hover:scale-105' 
                                            ${theme === "dark" ? "border-gray-700 bg-gray-800 hover:bg-gray-700" : "border-gray-500 bg-gray-200 hover:bg-gray-300 "}`}>
                                <div className="text-center font-bold">
                                    <h1 className="text-md sm:text-4xl">{cityWeather.main.temp}°C</h1>
                                    <p className="text-gray-400">Feels like: {cityWeather.main.feels_like}°C</p>
                                </div>
                            </div>

                            {/* Pressure */}
                            <div className={`p-3 flex items-center justify-center border rounded-xl transition duration-300 ease-in-out hover:-translate-y-1 hover:scale-105' 
                                            ${theme === "dark" ? "border-gray-700 bg-gray-800 hover:bg-gray-700" : "border-gray-500 bg-gray-200 hover:bg-gray-300"}`}>
                                <div className="text-center font-bold">
                                    <h1 className="text-2xl">{cityWeather.main.pressure} hPa</h1>
                                    <p className="text-gray-400">Pressure</p>
                                </div>
                            </div>

                            {/* Humidity */}
                            <div className={`p-3 flex items-center justify-center border rounded-xl transition duration-300 ease-in-out hover:-translate-y-1 hover:scale-105' 
                                            ${theme === "dark" ? "border-gray-700 bg-gray-800 hover:bg-gray-700" : "border-gray-500 bg-gray-200 hover:bg-gray-300"}`}>
                                <div className="text-center font-bold">
                                    <h1 className="text-2xl">{cityWeather.main.humidity}%</h1>
                                    <p className="text-gray-400">Humidity</p>
                                </div>
                            </div>

                            {/* Weather Icon */}
                            <div className={`col-span-3 p-3 flex flex-col items-center justify-center border rounded-xl 
                                            ${theme === "dark" ? "border-gray-700 bg-gray-800" : "border-gray-500 bg-gray-200"}`}>
                                <img src={weatherIcon} alt="Weather icon" className="w-24" />
                                <h1 className="text-2xl">{cityWeather.weather[0].description}</h1>
                            </div>

                            {/* Weather Chart */}
                            <div className={`col-span-3 row-span-2 row-start-3 p-5 border border-gray-500 rounded-xl 
                                ${theme === "dark" ? "border-gray-700 bg-gray-800" : "border-gray-500 bg-gray-200"}`}>
                                <WeatherChart data={cityWeather.name} />
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>

    );
}

export default Hero;
