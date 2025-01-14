'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Progress } from "@/components/ui/progress"

const skinTypes = ['dark', 'light']

export default function SunscreenApp() {
  const [skinType, setSkinType] = useState(skinTypes[0])
  const [uv_index, setUvIndex] = useState('')
  const [isRunning, setIsRunning] = useState(false)
  const [progress, setProgress] = useState(0)
  const [location, setLocation] = useState<{lat: number; lon: number} | null>(null)
  const [locationError, setLocationError] = useState<string>('')
  const [timeRemaining, setTimeRemaining] = useState(0)

  const fetchUVIndex = async (lat: number, lon: number) => {
    try {
      const response = await fetch(
        `https://api.openuv.io/api/v1/uv?lat=${lat}&lng=${lon}`,
        {
          headers: {
            'x-access-token': process.env.NEXT_PUBLIC_OPENUV_API_KEY || ''
          }
        }
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch UV data');
      }

      const data = await response.json();
      setUvIndex(data.result.uv.toString());
    } catch (error) {
      console.error('Error fetching UV data:', error);
      setUvIndex('Error fetching UV data');
    }
  };

  useEffect(() => {
    // Get user's location when component mounts
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        // Success callback
        (position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          setLocation({ lat, lon });
          setLocationError('');
          // Fetch UV index when we get the location
          fetchUVIndex(lat, lon);
        },
        // Error callback
        (error) => {
          setLocationError('Unable to get location: ' + error.message);
        }
      );
    } else {
      setLocationError('Geolocation is not supported by your browser');
    }
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isRunning) {
      interval = setInterval(() => {
        setProgress((prevProgress) => {
          if (prevProgress >= 100) {
            clearInterval(interval)
            setIsRunning(false)
            return 100
          }
          return prevProgress + 1
        })
      }, 100) // Adjust this value to change the speed of the progress bar
    }
    return () => clearInterval(interval)
  }, [isRunning])

  const getTimerDuration = (uvIndex: number, skinType: string): number | null => {
    if (uvIndex < 3 || uvIndex > 8) {
      return null;
    }
    
    if (uvIndex >= 3 && uvIndex <= 5) {
      return skinType === 'light' ? 15 : 30;
    }
    
    if (uvIndex > 5 && uvIndex <= 8) {
      return skinType === 'light' ? 9 : 17;
    }
    
    return null;
  };

  const handleStartTimer = () => {
    const duration = getTimerDuration(uvIndex, skinType);
    
    if (duration === null) {
      setIsRunning(false);
      return;
    }

    setTimeRemaining(duration * 60); // Convert minutes to seconds
    setIsRunning(true);
  };

  const handleStart = () => setIsRunning(true)
  const handleStop = () => setIsRunning(false)

  return (
    <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl">
      <div className="md:flex">
        <div className="md:shrink-0">
          <Image
            className="h-48 w-full object-cover md:h-full md:w-48"
            src="/sun_1.jpg?height=200&width=10"
            alt="Sun with cooling glasses"
            width={200}
            height={200}
          />
        </div>
        <div className="p-8">
          {location && (
            <div className="mb-4">
              <p className="text-sm text-gray-600">Your location:</p>
              <p className="text-sm">Latitude: {location.lat.toFixed(4)}</p>
              <p className="text-sm">Longitude: {location.lon.toFixed(4)}</p>
            </div>
          )}
          {locationError && (
            <div className="mb-4 text-red-500 text-sm">
              {locationError}
            </div>
          )}
          <div className="mb-4">
            <label htmlFor="skinType" className="block text-sm font-medium text-gray-700">Skin Type</label>
            <select
              id="skinType"
              value={skinType}
              onChange={(e) => setSkinType(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            >
              {skinTypes.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label htmlFor="uv_index" className="block text-sm font-medium text-gray-700">UV Index</label>
            <input
              type="text"
              id="uv_index"
              value={uv_index}
              readOnly
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-gray-100"
            />
          </div>
          {uv_index < 3 && (
            <p className="text-yellow-600 mt-2">
              UV index is too low. Please try again when UV index is higher.
            </p>
          )}

          {uv_index > 8 && (
            <p className="text-red-600 mt-2">
              UV index is too high. Please wait for safer conditions.
            </p>
          )}

          {uv_index >= 3 && uv_index <= 8 && (
            <div className="mt-4">
              <div className="relative pt-1">
                <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-200">
                  <div
                    style={{ width: `${(timeRemaining / (getTimerDuration(Number(uv_index), skinType)! * 60)) * 100}%` }}
                    className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500"
                  ></div>
                </div>
              </div>
              <button
                onClick={handleStartTimer}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                {isRunning ? 'Reset' : 'Start Timer'}
              </button>
              <p className="mt-2">
                Time Remaining: {Math.floor(timeRemaining / 60)}:{(timeRemaining % 60).toString().padStart(2, '0')}
              </p>
              <div className="mt-6 flex justify-center">
                <button
                  onClick={isRunning ? handleStop : handleStart}
                  className={`px-4 py-2 rounded-md text-white font-semibold ${
                    isRunning ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'
                  }`}
                >
                  {isRunning ? 'Stop' : 'Start'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
