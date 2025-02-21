import React, { useState } from "react";

const DocumentsVerify = () => {
    const [aadhaarFile, setAadhaarFile] = useState<string | null>(null);

  const [licenseFile, setLicenseFile] = useState<string|null>(null);
  
  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    setFile: React.Dispatch<React.SetStateAction<string | null>>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      setFile(URL.createObjectURL(file));
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
              />
              <div className="mt-3">
                <label className="text-blue-700 font-medium mb-2 block">Upload Aadhaar Image</label>
                <input
                  type="file"
                  className="hidden"
                  id="aadhaar-upload"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, setAadhaarFile)}
                />
                <label
                  htmlFor="aadhaar-upload"
                  className="cursor-pointer bg-gray-200 hover:bg-gray-300 transition p-2 rounded-md text-center block"
                >
                  Choose File
                </label>
                {aadhaarFile && (
                  <img
                    src={aadhaarFile}
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
              />
              <div className="mt-3">
                <label className="text-blue-700 font-medium mb-2 block">Upload License Image</label>
                <input
                  type="file"
                  className="hidden"
                  id="license-upload"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, setLicenseFile)}
                />
                <label
                  htmlFor="license-upload"
                  className="cursor-pointer bg-gray-200 hover:bg-gray-300 transition p-2 rounded-md text-center block"
                >
                  Choose File
                </label>
                {licenseFile && (
                  <img
                    src={licenseFile}
                    alt="License Preview"
                    className="mt-3 w-full max-h-40 object-cover rounded-md shadow-md"
                  />
                )}
              </div>
            </div>
            
            <button className="w-full bg-blue-700 hover:bg-blue-800 text-white py-3 rounded-md mt-4 font-medium transition">
              Verify
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentsVerify;
