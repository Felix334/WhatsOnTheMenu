  import { Button } from "@/components/ui/button";
  const checkCoordinates = () => {
      if (!navigator.geolocation) {
          window.alert("Oops! \nWie es scheint, unterstützt Ihr Browser keine Standortermittlung! \nVerwenden Sie einen anderen Internetbrowser, um alle Funktionen unserer Seite nutzen zu können.");
          return;
      }

      // GEht nur in localhost oder mit https
      navigator.geolocation.getCurrentPosition((position) => {
          const lat = position.coords.latitude;
          const long = position.coords.longitude;
          console.log("Koordinaten:", lat, long);
      }, (error) => {
          switch (error.code) {
              case 1:
                  alert("Standortzugriff verweigert. Bitte erlauben Sie den Zugriff in Ihren Browsereinstellungen und laden Sie die Seite neu.");
                  break;
              case 2:
                  alert("Standort konnte nicht ermittelt werden. Überprüfen Sie Ihre GPS-Einstellungen.");
                  break;
              case 3:
                  alert("Zeitüberschreitung bei der Standortermittlung. Versuchen Sie es erneut.");
                  break;
              default:
                  console.error("Unbekannter Fehler:", error);
          }
      }, { timeout: 10000 });
  };

  const LoadCoordinates = () => {
              <div className="fixed right-2">
            <Button onClick={checkCoordinates}></Button>
          </div>
  }

  export { LoadCoordinates }

  /* 'use client'; // Ensures this runs on the client-side only

import { useState, useEffect } from 'react';

const DistanceCalculator = () => {
  const [userLat, setUserLat] = useState<number | null>(null);
  const [userLng, setUserLng] = useState<number | null>(null);
  const [distance, setDistance] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Predefined target location (e.g., a city or point of interest)
  // Replace these with your desired coordinates
  const targetLat = 40.7128; // Example: New York City latitude
  const targetLng = -74.0060; // Example: New York City longitude

  // Haversine formula to calculate distance between two points on Earth
  const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number): number => {
    const R = 6371; // Earth's radius in kilometers
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLng = (lng2 - lng1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in km
  };

  useEffect(() => {
    // Check if geolocation is supported
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by this browser.');
      setLoading(false);
      return;
    }

    // Request the user's position
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        setUserLat(lat);
        setUserLng(lng);

        // Calculate distance to target
        const dist = calculateDistance(lat, lng, targetLat, targetLng);
        setDistance(dist);
        setLoading(false);
      },
      (err) => {
        setError(`Error getting location: ${err.message}`);
        setLoading(false);
      },
      {
        enableHighAccuracy: true, // Request higher accuracy (e.g., GPS)
        timeout: 10000, // Timeout after 10 seconds
        maximumAge: 300000, // Accept cached position up to 5 minutes old
      }
    );
  }, []);

  if (loading) {
    return <div>Loading location and calculating distance...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h3>Distance Calculation</h3>
      <p>Your Location: Latitude {userLat?.toFixed(4)}, Longitude {userLng?.toFixed(4)}</p>
      <p>Target Location: Latitude {targetLat}, Longitude {targetLng}</p>
      <p>Distance: {distance?.toFixed(2)} km</p>
      {/* Optional: Convert to miles */}
      <p>Distance (miles): {(distance ? distance * 0.621371 : 0).toFixed(2)} miles</p>
    </div>
  );
};

export default DistanceCalculator;*/