"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import { User, Mail, IdCard, LogOut, Settings, ChevronDown, ChevronUp } from "lucide-react";

export default function ProfilePage() {
  const [userData, setUserData] = useState(null);
  const [weights, setWeights] = useState({
    carbonFootprint: 30,
    recyclability: 25,
    energyIntensity: 15,
    costEffectiveness: 10,
    toxicity: 10,
    durability: 10,
  });
  const defaultWeights = {
    carbonFootprint: 30,
    recyclability: 25,
    energyIntensity: 15,
    costEffectiveness: 10,
    toxicity: 10,
    durability: 10,
  };
  const [isEditing, setIsEditing] = useState(false);
  const [isOpen, setIsOpen] = useState(false); // For dropdown toggle
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const router = useRouter();

  useEffect(() => {
    const user = localStorage.getItem("user_token");
    if (!user) {
      router.push("/login");
      return;
    }
    setUserData(JSON.parse(user));

    const savedWeights = localStorage.getItem("custom_weights");
    if (savedWeights) {
      setWeights(JSON.parse(savedWeights));
    }
  }, []);

  const handleWeightChange = (e, factor) => {
    setWeights((prev) => ({
      ...prev,
      [factor]: Number(e.target.value),
    }));
    setErrorMessage(""); // Clear any previous error messages while editing
  };

  const validateWeights = () => {
    const total = Object.values(weights).reduce((sum, val) => sum + val, 0);
    if (total !== 100) {
      setErrorMessage("The sum of all weightages must equal 100%.");
      return false;
    }
    return true;
  };

  const saveWeights = () => {
    if (!validateWeights()) return;

    localStorage.setItem("custom_weights", JSON.stringify(weights));
    setIsEditing(false);
    setErrorMessage("");
    setSuccessMessage("Weightages updated successfully!");
    setTimeout(() => setSuccessMessage(""), 3000); // Hide success message after 3 seconds
  };

  const handleLogout = () => {
    localStorage.removeItem("user_token");
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    router.push("/");
  };

  if (!userData) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-4xl mx-auto p-6 mt-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-purple-500 h-32 flex items-center justify-center">
            <div className="bg-white p-4 rounded-full shadow-lg">
              <User size={64} className="text-blue-500" />
            </div>
          </div>

          <div className="p-8">
            <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
              Profile Information
            </h1>

            <div className="grid gap-6 max-w-2xl mx-auto">
              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                <User className="text-blue-500" />
                <div>
                  <p className="text-sm text-gray-500">Name</p>
                  <p className="font-medium text-black">{userData.user?.name}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                <Mail className="text-blue-500" />
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium text-black">{userData.user?.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                <IdCard className="text-blue-500" />
                <div>
                  <p className="text-sm text-gray-500">Employee ID</p>
                  <p className="font-medium text-black">{userData.user?.employeeId}</p>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <button
                  onClick={() => setIsOpen(!isOpen)}
                  className="w-full flex items-center justify-between text-lg font-bold text-gray-800 focus:outline-none"
                >
                  <div className="flex items-center gap-2 text-left">
                    <Settings size={30} className="text-blue-500 pr-2" />
                    Customize Sustainability Parameters
                  </div>
                  {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </button>

                {isOpen && (
                  <div className="mt-4">
                    <p className="text-sm text-gray-500">
                      Adjust the weightage for each parameter to personalize your sustainability scoring.
                    </p>

                    {errorMessage && (
                      <p className="text-red-500 text-sm mt-2">{errorMessage}</p>
                    )}
                    {successMessage && (
                      <p className="text-green-500 text-sm mt-2">{successMessage}</p>
                    )}

                    <form className="mt-4 space-y-4">
                      {Object.entries(weights).map(([key, value]) => (
                        <div key={key} className="flex flex-col gap-2">
                          <label className="capitalize text-gray-700 flex justify-between">
                            <span>{key.replace(/([A-Z])/g, " $1")}</span>
                            <span className="text-sm text-gray-500">
                              Default: {defaultWeights[key]}%
                            </span>
                          </label>
                          <div className="flex items-center gap-4">
                            <input
                              type="number"
                              value={value}
                              min="0"
                              max="100"
                              onChange={(e) => handleWeightChange(e, key)}
                              disabled={!isEditing}
                              className={`w-20 p-2 border text-black rounded-lg ${
                                isEditing ? "bg-white" : "bg-gray-100"
                              }`}
                            />
                            <span className="text-gray-500">%</span>
                          </div>
                        </div>
                      ))}
                    </form>

                    <div className="flex justify-end gap-4 mt-4">
                      {isEditing ? (
                        <>
                          <button
                            onClick={() => setIsEditing(false)}
                            className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={saveWeights}
                            className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
                          >
                            Save
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => setIsEditing(true)}
                          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                        >
                          Edit Weights
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>

              <button
                onClick={handleLogout}
                className="flex items-center justify-center gap-2 w-full p-4 mt-4 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                <LogOut size={20} />
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}