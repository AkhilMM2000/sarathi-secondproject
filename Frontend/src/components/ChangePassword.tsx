import { useState } from "react";
import { useMutation } from "@tanstack/react-query";


import { toast } from "react-toastify"; 

import { getApiInstance } from "../constant/Api";
import { validatePassword } from "../constant/validationUtils";

interface ChangePasswordProps {
  role: "user" | "driver";
  onClose: () => void; // Function to close the modal
}

const ChangePassword: React.FC<ChangePasswordProps> = ({ role, onClose }) => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
const userAPI=getApiInstance('user')
const driverAPI=getApiInstance('driver')
  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      
      if(oldPassword==newPassword){
        throw new Error("old and new password cannot be the same");
      }
      const errorMessage = validatePassword(newPassword);
      if (errorMessage) {
        throw new Error(errorMessage);
      }
      if (newPassword !== confirmPassword) {
        throw new Error("New passwords do not match.");
      }
      const apiInstance = role === "user" ? userAPI : driverAPI;

      // Make API request
      await apiInstance.patch("/auth/change-password", { oldPassword, newPassword,role });
      
    },
    onSuccess: () => {
      toast.success("Password changed successfully!");
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
      onClose(); // Close the modal on success
    },
    onError: (error: any) => {
     console.log(error);
     
    
      setErrorMessage(error.response?.data?.message||error.response?.data?.error || error.message || "Something went wrong.");
    },

  });

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 p-4 backdrop-blur-sm z-50">
    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-xl w-full max-w-md transform transition-all">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Change Password</h2>
      {errorMessage && (
      <div className="mb-4 p-3 text-sm text-red-600 bg-red-100 border border-red-400 rounded-lg dark:bg-red-900 dark:text-red-300">
        {errorMessage}
      </div>
    )}
      <div className="space-y-5">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Current Password</label>
          <input 
            type="password" 
            className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            placeholder="Enter current password" 
            value={oldPassword} 
            onChange={(e) => setOldPassword(e.target.value)} 
          />
        </div>
        
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">New Password</label>
          <input 
            type="password" 
            className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            placeholder="Enter new password" 
            value={newPassword} 
            onChange={(e) => setNewPassword(e.target.value)} 
          />
        </div>
        
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Confirm New Password</label>
          <input 
            type="password" 
            className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            placeholder="Confirm new password" 
            value={confirmPassword} 
            onChange={(e) => setConfirmPassword(e.target.value)} 
          />
        </div>
        
        <div className="flex justify-end space-x-3 mt-8">
          <button 
            onClick={onClose}
            className="px-5 py-2.5 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white rounded-lg font-medium transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={() => mutate()}
            disabled={isPending}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPending ? "Updating..." : "Change Password"}
          </button>
        </div>
      </div>
    </div>
  </div>
  );
};

export default ChangePassword;
