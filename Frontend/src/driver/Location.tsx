import { useState, useRef, useEffect } from "react";
import { Button, Typography, Card, TextField} from "@mui/material";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";

const ProfileLocation = () => {
  const navigate = useNavigate();
  const [location, setLocation] = useState<google.maps.LatLngLiteral | null>(null);
  const [address, setAddress] = useState("");
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const mapRef = useRef<HTMLDivElement | null>(null);


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
      if (!place.geometry || !place.geometry.location) {
        toast.error("Invalid location");
        return;
      }
      const lat = place.geometry.location.lat();
      const lng = place.geometry.location.lng();
      const placeName = place.name || place.formatted_address || "Unknown Place"; 
      setLocation({ lat: lat, lng: lng });
      setAddress(place.formatted_address || "");
     
      
      localStorage.setItem("driverLocation", JSON.stringify({ latitude: lat, longitude: lng }));
      localStorage.setItem('place',placeName)
    });
  }, []);

  useEffect(() => {
    if (location && mapRef.current) {
      const map = new google.maps.Map(mapRef.current, {
        center: location,
        zoom: 14,
      });
      new google.maps.Marker({ position: location, map });
    }
  }, [location]);

  return (
    <div className="flex flex-col items-center min-h-screen bg-gradient-to-r from-purple-600 to-indigo-800 p-4 sm:p-6 md:p-8">
    <ToastContainer />
    <Card className="p-6 sm:p-8 shadow-2xl w-full max-w-md bg-white rounded-xl border-0">
      <div className="space-y-6">
        <Typography variant="h5" className="text-center font-bold text-gray-800">
          Select Your Location
        </Typography>
        
        <div className="relative">
          <TextField
            id="autocomplete"
            label="Enter location"
            variant="outlined"
            fullWidth
            className="mb-2"
            InputProps={{
              startAdornment: (
                <span className="text-gray-400 mr-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                </span>
              ),
            }}
          />
          
          {location && (
            <div className="flex items-center mt-2 px-3 py-2 bg-green-50 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <Typography className="text-sm text-green-700 font-medium">
                Selected: {address}
              </Typography>
            </div>
          )}
        </div>
        
        {/* Enhanced Map Container */}
        <div className="rounded-xl overflow-hidden shadow-lg border border-gray-200">
          <div ref={mapRef} className="h-72 sm:h-80 w-full" />
        </div>
        
        <Button
          variant="contained"
          fullWidth
          onClick={() => navigate("/verify-documents")}
          disabled={!location}
          sx={{ 
            py: "10px",
            backgroundColor: "#4f46e5", 
            color: "white",
            borderRadius: "0.75rem",
            fontWeight: "600",
            boxShadow: "0 10px 15px -3px rgba(79, 70, 229, 0.3)",
            "&:hover": {
              backgroundColor: "#4338ca"
            },
            "&:disabled": {
              backgroundColor: "#9ca3af",
              color: "white"
            }
          }}
        >
          Continue to Document Verification
        </Button>
      </div>
    </Card>
  </div>
  
  );
};

export default ProfileLocation;