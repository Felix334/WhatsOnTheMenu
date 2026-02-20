"use client"
import React, { useState, useEffect } from "react";

const PermControleLocation = ({ children }) => {
  const [permission, setPermission] = useState(null);

  const handlePermission = (permission) => {
    setPermission(permission);
  };


  const requestLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => console.log("Latitude: " + position.coords.latitude),
        (error) => console.log("Error occurred. Error code: " + error.code),
        {
          timeout: 10000,
        }
      );
    } else {
      console.log("Geolocation is not supported by this browser.");
    }
  };


  useEffect(() => {
    if (navigator.permissions) {
      navigator.permissions.query({ name: "geolocation" }).then((result) => {
        if (result.state === "prompt" || result.state === "granted") {
          requestLocation();
        }
        handlePermission(result.state);
      });
    } else {
      requestLocation();
    }

  }, []);

  return (
    <>
      {permission === "denied" ? (
        <div>Location access is denied</div>
      ) : (
        children
      )}
    </>
  );
};

export default PermControleLocation;