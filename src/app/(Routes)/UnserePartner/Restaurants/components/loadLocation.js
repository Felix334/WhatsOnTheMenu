'use client';

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
    return (
        <div className="fixed right-2">
            <Button onClick={checkCoordinates}></Button>
        </div>
    );
};

export { LoadCoordinates };
