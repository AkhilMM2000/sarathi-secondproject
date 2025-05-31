import { useState, useRef, useEffect } from "react";
import { TextField, Typography } from "@mui/material";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
interface LocationPickerProps {
  onLocationSelect: (location: { lat: number; lng: number; address: string }) => void;
  defaultAddress?: string;
}

const LocationPicker: React.FC<LocationPickerProps> = ({ onLocationSelect,defaultAddress}) => {
  const [location, setLocation] = useState<google.maps.LatLngLiteral | null>(null);
  const [address, setAddress] = useState(defaultAddress || "");
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const mapRef = useRef<HTMLDivElement | null>(null);
  
  // Adding a toast ID ref to prevent duplicate toasts
  const toastIdRef = useRef<string | number | null>(null);

  useEffect(() => {
    if (!window.google) {
      toast.error("Google Maps API is not loaded");
      return;
    }

    const autocomplete = new google.maps.places.Autocomplete(
      document.getElementById("autocomplete") as HTMLInputElement,
      { types: ["geocode"], componentRestrictions: { country: "IN" } }
    );
    autocompleteRef.current = autocomplete;

    autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace();
      
      // Check if we have a valid place with geometry
      if (!place.geometry || !place.geometry.location) {
        // Dismiss any existing toast before showing a new one
        if (toastIdRef.current) {
          toast.dismiss(toastIdRef.current);
        }
        
        // Store the toast ID for potential future dismissal
        toastIdRef.current = toast.error("Invalid location", {
          onClose: () => {
            toastIdRef.current = null;
          }
        });
        return;
      }
      
      const lat = place.geometry.location.lat();
      const lng = place.geometry.location.lng();
      const newAddress = place.formatted_address || "";
      
      setLocation({ lat, lng });
      setAddress(newAddress);
   
      // Pass the selected location data to the parent component
      onLocationSelect({ lat, lng, address: newAddress });
           // Show success toast
           toast.success(`📍 Location updated to: ${newAddress}`, {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
            
          });

    });
    
    // Clean up listener when component unmounts
    return () => {
      if (autocompleteRef.current) {
        google.maps.event.clearInstanceListeners(autocompleteRef.current);
      }
    };
  }, [onLocationSelect]);

  useEffect(() => {
    if (location && mapRef.current) {
      const map = new google.maps.Map(mapRef.current, {
        center: location,
        zoom: 14,
      });
      new google.maps.Marker({ position: location, map });
    }
  }, [location]);

  // Handler for manual text changes
  const handleInputChange = (_e: React.ChangeEvent<HTMLInputElement>) => {
    // If user is typing, don't show errors for incomplete inputs
    if (toastIdRef.current) {
      toast.dismiss(toastIdRef.current);
      toastIdRef.current = null;
    }
  };

  return (
    <div>
      <ToastContainer limit={1} />
      <TextField
        id="autocomplete"
        label="Enter location"
        variant="outlined"
        fullWidth
        className="mb-2"
        onChange={handleInputChange}
        defaultValue={address}
      />
      
      {location && (
        <div className="flex items-center mt-2 px-3 py-2 bg-green-50 rounded-lg">
          <Typography className="text-sm text-green-700 font-medium">
            Selected: {address}
          </Typography>
        </div>
      )}

      {/* Map Display */}
      <div className="rounded-xl overflow-hidden shadow-lg border border-gray-200 mt-3">
        <div ref={mapRef} className="h-60 w-full" />
      </div>
    </div>
  );
};

export default LocationPicker;