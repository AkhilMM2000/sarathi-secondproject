import React, { useState, FormEvent } from 'react';
import ApiService from '../Api/ApiService';
import { ToastContainer,toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
interface LoginCredentials {
  email: string;
  password: string;
}

const SarathiAdminLogin = () => {
  const navigate=useNavigate()
  const [credentials, setCredentials] = useState<LoginCredentials>({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState<boolean>(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setCredentials(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async(e: FormEvent<HTMLFormElement>):Promise<void> => {
 e.preventDefault();
 
     if (!credentials.email || !credentials.password) {
       toast.info("Please fill in the credentials");
       return;
     }
   
     setLoading(true);
   
     try {
       
    
       // Call API Service for login
       const response = await ApiService.Login(credentials, 'admin');
   
       if (response?.accessToken&&response?.role=='admin') {
         // Store tokens and role
         localStorage.setItem(`${response.role}_accessToken`, response.accessToken);
       
   
         toast.success("Login successful!",{autoClose:1500});
         setTimeout(() => {
          navigate("/adminhome/users",{ replace: true });
        }, 1500); // Delay navigation for 1.5 seconds (same as toast duration)
      
        
     }} catch (error: any) {
       if (error.response && error.response.data) {
         toast.error(error.response.data.error || "Login failed!");
       } else {
         toast.error("Something went wrong. Please try again.");
       }
     } finally {
       setLoading(false);
     }

  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl overflow-hidden w-full max-w-md">
        <div className="bg-indigo-600 p-6 text-center">
          <h1 className="text-white text-3xl font-bold">SARATHI</h1>
          <p className="text-indigo-200 mt-2">Admin Portal</p>
        </div>
        
        <div className="p-6 md:p-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Admin Login</h2>
          
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={credentials.email}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="admin@sarathi.org"
                required
              />
            </div>
            
            <div className="mb-6">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                value={credentials.password}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="••••••••"
                required
              />
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-4 rounded-md transition duration-300 flex justify-center items-center"
            >
              {loading ? (
                <span className="inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
              ) : null}
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>
          
          <div className="mt-8 text-center text-sm text-gray-600">
            <p>Protected Administrative Area</p>
            <p className="mt-1">Authorized Personnel Only</p>
          </div>
        </div>
      </div>
      <ToastContainer/>
    </div>
  );
};

export default SarathiAdminLogin;