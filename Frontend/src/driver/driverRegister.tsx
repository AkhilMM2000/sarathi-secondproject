import { useState, ChangeEvent, FormEvent} from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
interface FormData {
  name: string;
  email: string;
  mobile: string;
  password: string;
  confirmPassword: string;
}

export default function DriverRegister() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>(() => {
    const savedData = localStorage.getItem("driverRegisterData");
    return savedData ? JSON.parse(savedData) : {
      name: "",
      email: "",
      mobile: "",
      password: "",
      confirmPassword: "",
    };
  });

  const [error, setError] = useState<string>("");

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const validateForm = () => {
    const nameRegex = /^[A-Za-z\s]{3,}$/;
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const mobileRegex = /^[6-9]\d{9}$/; // Ensures starts with 6-9 and 10 digits
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%^&*()!]).{6,}$/;
  
  
    if (!nameRegex.test(formData.name)) {
      toast.error("Invalid name! Must be at least 3 letters.", { position: "top-center" });
      return false;
    }
    if (!emailRegex.test(formData.email)) {
      toast.error("Invalid email format!", { position: "top-center" });
      return false;
    }
    if (!mobileRegex.test(formData.mobile)) {
      toast.error("Invalid mobile number! Must be 10 digits.", { position: "top-center" });
      return false;
    }
    if (!passwordRegex.test(formData.password)) {
      toast.error(
        "Weak password! Min 6 chars, include uppercase, lowercase, number & special character (@#$%^&*()!)",
        { position: "top-center" }
      );
      return false;
    }
   
  
    return true;
  };
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    setError("");
    const { confirmPassword, ...dataToSend } = formData;
    // Store in localStorage before navigating
    localStorage.setItem("driverRegisterData", JSON.stringify(dataToSend));
    
    // Navigate to next step
    navigate("/driver-location");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-sky-500">
      <div className="w-full max-w-md bg-white p-6 rounded-2xl shadow-md">
        <h2 className="text-3xl font-bold text-center text-sky-600 mb-4">
          Sarathi Driver Register
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg focus:ring focus:ring-sky-300"
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg focus:ring focus:ring-sky-300"
            required
          />
          <input
            type="text"
            name="mobile"
            placeholder="Mobile Number"
            value={formData.mobile}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg focus:ring focus:ring-sky-300"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg focus:ring focus:ring-sky-300"
            required
          />
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg focus:ring focus:ring-sky-300"
            required
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            className="w-full bg-sky-600 text-white py-3 rounded-lg hover:bg-sky-700 transition"
          >
            Register
          </button>
        </form>

        <div className="mt-4 text-center">
        
        </div>
      </div>
      <ToastContainer/>
    </div>
  );
}
