import React, { useState, ChangeEvent, MouseEvent } from "react";
import { toast, ToastContainer } from "react-toastify";
import Api from "../Api/ApiService";
import { useNavigate } from "react-router-dom";

const DocumentsVerify = () => {
  const MAX_FILE_SIZE = 3 * 1024 * 1024; // 3MB
const ALLOWED_FILE_TYPES = ["image/jpeg", "image/png", "application/pdf"];
  const [aadhaarFile, setAadhaarFile] = useState<File | null>(null);
  const [aadhaarPreview, setAadhaarPreview] = useState<string | null>(null);
  const [licenseFile, setLicenseFile] = useState<File | null>(null);
  const [licensePreview, setLicensePreview] = useState<string | null>(null);
  const [aadhaarNumber, setAadhaarNumber] = useState<string>("");
  const [licenseNumber, setLicenseNumber] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  // Handle input changes for Aadhaar & License Number
  const handleInputChange = (
    event: ChangeEvent<HTMLInputElement>,
    setValue: React.Dispatch<React.SetStateAction<string>>
  ) => {
    setValue(event.target.value);
  };

  const handleFileChange = (
    event: ChangeEvent<HTMLInputElement>,
    setFile: React.Dispatch<React.SetStateAction<File | null>>,
    setPreview: React.Dispatch<React.SetStateAction<string | null>>,
    fileType: string
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;
  
    // Validate file type
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      toast.error(`${fileType} must be a JPEG, PNG, or PDF file.`,{autoClose:1000});
      setFile(null);
      setPreview(null);
      return;
    }
  
    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      toast.error(`${fileType} must be smaller than 3MB.`,{autoClose:1000});
      setFile(null);
      setPreview(null); // Prevent preview from being set
      return;
    }
  
    setFile(file);
  
    // Set preview only for images within allowed size
    if (file.type.startsWith("image/")) {
      setPreview(URL.createObjectURL(file));
    } else {
      setPreview(null); // No preview for PDFs
    }
  };
  // Retrieve driver details from localStorage
  const getDriverData = () => {
    const driverProfileImage = localStorage.getItem("driverProfileImage") || "";
    const driverLocation = JSON.parse(localStorage.getItem("driverLocation") || "{}");
    const driverRegisterData = JSON.parse(localStorage.getItem("driverRegisterData") || "{}");
const place=localStorage.getItem('place')
    if (driverRegisterData.email) {
      localStorage.setItem("Driveremail", driverRegisterData.email);
    }

    return {
      ...driverRegisterData,
      profileImage: driverProfileImage,
      location: driverLocation,
      aadhaarNumber,
      licenseNumber,
      place
    };
  };

  // Handle form submission
  const handleSubmit = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    
    if (!aadhaarFile || !licenseFile || !aadhaarNumber || !licenseNumber) {
      toast.error("Please fill in all fields and upload documents.");
      return;
    }

    try {
      setIsLoading(true);
      // Step 1: Request signed URLs for both documents
      const aadhaarSignedUrl = await Api.getSignedUrls("image/png", "aadhaar");
      const licenseSignedUrl= await Api.getSignedUrls("image/png", "license");
    
    
      


      if (!aadhaarSignedUrl || !licenseSignedUrl) {
        throw new Error("Failed to retrieve signed upload URLs.");
      }

      // Step 2: Upload files to Cloudinary using the signed URLs
      const [aadhaarImageUrl, licenseImageUrl] = await Promise.all([
        Api.uploadFile(aadhaarFile, aadhaarSignedUrl.signedUrl),
        Api.uploadFile(licenseFile, licenseSignedUrl.signedUrl),
      ]);
      
     console.log(aadhaarImageUrl,licenseImageUrl);
     
    
      
      // Step 3: Send uploaded file URLs along with other data to backend
      const driverData = {
        ...getDriverData(),
        aadhaarImage: aadhaarImageUrl,
        licenseImage: licenseImageUrl,
      };

   

      const response = await Api.registerUser(driverData, "drivers");

      if (response.success) {
        toast.success("Registration successful! Awaiting admin verification.");

        // Clear local storage
        localStorage.removeItem("driverProfileImage");
        localStorage.removeItem("driverLocation");
        localStorage.removeItem("driverRegisterData");
        localStorage.removeItem('place')
        // Navigate after a short delay
        setTimeout(() => {
          navigate("/otp-verification?role=drivers");
        }, 2000);
      } else {
        throw new Error(response.message || "Registration failed");
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "An error occurred during registration");
    }
  };
 
  return (
    <div className=" bg-gradient-to-r from-blue-200 to-blue-400 min-h-screen flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-md p-8 max-w-3xl w-full flex flex-col md:flex-row gap-8">
        <div className="md:w-2/5 flex items-center">
          <h1 className="text-3xl font-bold text-blue-700 leading-tight">
            Please verify your identification details!
          </h1>
        </div>
        
        <div className="md:w-3/5">
          <div className="border border-gray-300 rounded-lg p-6 bg-gray-50">
            <div className="mb-6">
              <label className="block text-blue-700 font-medium mb-2">
                Enter your Aadhaar ID
              </label>
              <input
                type="text"
                className="w-full border-b-2 border-gray-300 pb-2 focus:outline-none focus:border-blue-700"
                placeholder="Enter Aadhaar Number"
                onChange={(e)=> handleInputChange(e,setAadhaarNumber) }
              />
              <div className="mt-3">
                <label className="text-blue-700 font-medium mb-2 block">Upload Aadhaar Image</label>
                <input
                  type="file"
                  className="hidden"
                  id="aadhaar-upload"
                  accept="image/jpeg, image/png, application/pdf"
  onChange={(e) => handleFileChange(e, setAadhaarFile, setAadhaarPreview, "Aadhaar Card")}
                />
                <label
                  htmlFor="aadhaar-upload"
                  className="cursor-pointer bg-gray-200 hover:bg-gray-300 transition p-2 rounded-md text-center block"
                >
                  Choose File
                </label>
                {aadhaarFile && (
                  <img
                  src={aadhaarPreview || "/default-placeholder.png"}
                    alt="Aadhaar Preview"
                    className="mt-3 w-full max-h-40 object-cover rounded-md shadow-md"
                  />
                )}
              </div>
            </div>
            
            <div className="mb-6">
              <label className="block text-blue-700 font-medium mb-2">
                Enter your License ID
              </label>
              <input
                type="text"
                className="w-full border-b-2 border-gray-300 pb-2 focus:outline-none focus:border-blue-700"
                placeholder="Enter License Number"
                onChange={(e)=> handleInputChange(e,setLicenseNumber) }
              />
              <div className="mt-3">
                <label className="text-blue-700 font-medium mb-2 block">Upload License Image</label>
                <input
                  type="file"
                  className="hidden"
                  id="license-upload"
                  
                  accept="image/jpeg, image/png, application/pdf"
  onChange={(e) => handleFileChange(e, setLicenseFile, setLicensePreview, "License")} 
                />
                <label
                  htmlFor="license-upload"
                  className="cursor-pointer bg-gray-200 hover:bg-gray-300 transition p-2 rounded-md text-center block"
                >
                  Choose File
                </label>
                {licenseFile && (
                  <img
                  src={licensePreview || "/default-placeholder.png"}
                    alt="License Preview"
                    className="mt-3 w-full max-h-40 object-cover rounded-md shadow-md"
                  />
                )}
              </div>
            </div>
            
            <button className="w-full bg-blue-700 hover:bg-blue-800 text-white py-3 rounded-md mt-4 font-medium transition"
            onClick={ handleSubmit}
            disabled={isLoading}
            >
          {isLoading ? "Loading..." : "Verify"}
            </button>
          </div>
        </div>
      </div>
      <ToastContainer/>
    </div>
  );
};

export default DocumentsVerify;
