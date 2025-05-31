import React, { useState, useRef, useEffect } from "react";
import { Box, TextField, Typography } from "@mui/material";

interface LocationSelectorProps {
  onLocationSelect: (data: { from: string; to: string; distance: string; duration: string }) => void;
}

const LocationSelector: React.FC<LocationSelectorProps> = ({ onLocationSelect }) => {
  const [from, setFrom] = useState<string>("");
  const [to, setTo] = useState<string>("");
  const [distance, setDistance] = useState<string>("");
  const [duration, setDuration] = useState<string>("");

  const fromRef = useRef<HTMLInputElement | null>(null);
  const toRef = useRef<HTMLInputElement | null>(null);


  useEffect(() => {
    if (!window.google) {
      console.error("Google Maps API not loaded.");
      return;
    }

    const autocompleteFrom = new google.maps.places.Autocomplete(
      fromRef.current as HTMLInputElement,
      { componentRestrictions: { country: "IN" } }

    );
    autocompleteFrom.addListener("place_changed", () => {
      const place = autocompleteFrom.getPlace();
      
      
      if (place.formatted_address) {
        setFrom(place.formatted_address);
      }
    });

    const autocompleteTo = new google.maps.places.Autocomplete(
      toRef.current as HTMLInputElement,
      {componentRestrictions:{country:"IN"}}
    
    );
    autocompleteTo.addListener("place_changed", () => {
      const place = autocompleteTo.getPlace();
      if (place.formatted_address) {
        setTo(place.formatted_address);
      }
    });
  }, []);

  useEffect(() => {
    if (from && to) {
      const service = new google.maps.DistanceMatrixService();
      service.getDistanceMatrix(
        {
          origins: [from],
          destinations: [to],
          travelMode: google.maps.TravelMode.DRIVING,
        },
        (response, status) => {
          if (status === "OK" && response?.rows[0].elements[0].status === "OK") {
          
            setDistance(response.rows[0].elements[0].distance.text);
            setDuration(response.rows[0].elements[0].duration.text);
            

            onLocationSelect({
              from,
              to,
              distance: response.rows[0].elements[0].distance.text,
              duration: response.rows[0].elements[0].duration.text,
            });
          }
        }
      );
    }
  }, [from, to, onLocationSelect]);

  return (
    <Box className="w-full max-w-md">
    
      <TextField  
        inputRef={fromRef} 
        label="From" 
        variant="outlined" 
        fullWidth 
        className="mb-3 w-full" 
        placeholder="Enter starting location"
      />
      
      <TextField 
        inputRef={toRef} 
        label="To" 
        variant="outlined" 
        fullWidth 
        className="mb-3 w-full"
        placeholder="Enter destination" 
      />

      {distance && duration && (
        <Box className="mb-4 p-3 bg-blue-50 rounded">
          <Typography variant="body1" className="flex flex-wrap items-center">
            <span className="mr-2 flex items-center">
              <span className="mr-1">📏</span> Distance: {distance}
            </span> 
            <span className="mx-2 text-gray-400">|</span>
            <span className="flex items-center">
              <span className="mr-1">⏳</span> Time: {duration}
            </span>
          </Typography>
        </Box>
      )}
      
    
    </Box>
  );
};

export default LocationSelector;
