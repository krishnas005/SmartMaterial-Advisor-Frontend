"use client";

import React, { useState } from "react";
import Select from "react-select";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const AlloyGenerator = () => {
  const [selectedProperties, setSelectedProperties] = useState([]);
  const [propertyRanges, setPropertyRanges] = useState({});
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const propertyConstraints = {
    tensile_strength: { min: 50, max: 2200, unit: "MPa" },
    yield_strength: { min: 40, max: 1750, unit: "MPa" },
    weldability: { min: 1, max: 100, unit: "%" },
    impact_resistance: { min: 10, max: 290, unit: "J/m²" },
    hardness: { min: 25, max: 3400, unit: "HV" },
    thermal_conductivity: { min: 6.5, max: 380, unit: "W/(m·K)" },
    density: { min: 0, max: 21500, unit: "kg/m³" },
    sustainability_rating: { min: 1, max: 10, unit: "Range(1-10)" },
    cost_per_unit: { min: 45, max: 20000, unit: "Rs/Unit" },
    carbon_footprint: { min: 0.85, max: 50, unit: "kg CO₂/kg" },
    recyclability: { min: 1, max: 100, unit: "%" },
    ductility: { min: 1, max: 100, unit: "%" },
    fatigue_resistance: { min: 1, max: 100, unit: "%" },
    youngs_modulus: { min: 16, max: 490, unit: "GPa" },
    heat_resistance: { min: 1, max: 100, unit: "%" },
    corrosion_resistance: { min: 1, max: 100, unit: "%" }
  };
  
  const materialProperties = Object.keys(propertyConstraints).map((key) => ({
    value: key,
    label: `${key.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())} (${propertyConstraints[key].unit})`,
  }));

  const handlePropertyChange = (selectedOptions) => {
    setSelectedProperties(selectedOptions || []);
    const newPropertyRanges = {};
    (selectedOptions || []).forEach(({ value }) => {
      newPropertyRanges[value] = newPropertyRanges[value] || { min: "", max: "" };
    });
    setPropertyRanges(newPropertyRanges);
  };

  const handleRangeChange = (property, rangeType, value) => {
    setPropertyRanges({
      ...propertyRanges,
      [property]: { ...propertyRanges[property], [rangeType]: value },
    });
  };

  const validateInput = () => {
    if (selectedProperties.length < 3) {
      toast.error("⚠️ Please select at least 3 properties and provide their values for better results.");
      return false;
    }

    for (const property of selectedProperties) {
      const { min, max } = propertyRanges[property.value] || {};
      if (!min || !max) {
        toast.error(`⚠️ Please enter both min and max values for ${property.label}.`);
        return false;
      }
      if (min < 0 || max < 0) {
        toast.error(`⚠️ Negative values are not allowed for ${property.label}.`);
        return false;
      }
      const constraints = propertyConstraints[property.value];
      if (min < constraints.min || max > constraints.max) {
        toast.error(
          `⚠️ ${property.label} must be between ${constraints.min} - ${constraints.max} ${constraints.unit}.`
        );
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setResult(null);

    if (!validateInput()) {
      return;
    }

    setLoading(true);

    try {
      const inputText = selectedProperties
        .map((prop) => {
          const { min, max } = propertyRanges[prop.value];
          return `${prop.label}: ${min}-${max} ${propertyConstraints[prop.value].unit}`;
        })
        .join(", ");

      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ input_text: inputText }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();

      if (data.error) {
        toast.error(`⚠️ ${data.error}`);
      } else {
        setResult(data.response);
      }
    } catch (error) {
      toast.error(`⚠️ Failed to generate alloy: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen bg-gradient-to-br from-orange-500 via-blue-400 to-teal-700 text-white font-sans">
      <div className="bg-white"><Header /></div>
      <div className="max-w-5xl mx-auto px-6 py-12 min-h-screen mt-12">
        <h1 className="md:text-6xl text-3xl text-black font-bold text-center mb-4 font-sans">
          Create With - Generative AI
        </h1>
        <p className="text-lg mb-8 text-center md:px-14 text-black">
          Experience the power of Gen AI in material design. Specify your desired property ranges, and let it craft alloys tailored to your needs, considering material chemistry and reactivity.
        </p>
        <div className="bg-white bg-opacity-10 backdrop-blur-lg shadow-2xl rounded-3xl p-8 space-y-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <h3 className="text-2xl font-semibold">Select Material Properties</h3>
            <Select
              options={materialProperties}
              isMulti
              onChange={handlePropertyChange}
              placeholder="Select Material Properties"
              className="mt-2 text-black"
            />
            {selectedProperties.map((filter) => (
              <div key={filter.value} className="flex flex-col space-y-2">
                <label className="text-lg font-medium">{filter.label}</label>
                <div className="flex space-x-4">
                  <input
                    type="number"
                    placeholder={`Min (${propertyConstraints[filter.value].unit})`}
                    value={propertyRanges[filter.value]?.min || ""}
                    onChange={(e) => handleRangeChange(filter.value, "min", e.target.value)}
                    className="w-1/2 p-3 rounded-lg border border-gray-300 text-gray-900"
                  />
                  <input
                    type="number"
                    placeholder={`Max (${propertyConstraints[filter.value].unit})`}
                    value={propertyRanges[filter.value]?.max || ""}
                    onChange={(e) => handleRangeChange(filter.value, "max", e.target.value)}
                    className="w-1/2 p-3 rounded-lg border border-gray-300 text-gray-900"
                  />
                </div>
              </div>
            ))}
            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-blue-500 to-teal-500 rounded-lg font-semibold text-white hover:opacity-90 transform hover:scale-105 transition-transform"
            >
              {loading ? "Generating..." : "Generate Alloy"}
            </button>
          </form>
          {result && (
            <div className="mt-8 shadow-lg p-8 rounded-2xl">
              <h2 className="text-3xl font-bold text-center text-gray-800">🔍 Generated Alloy Result</h2>
              <pre className="text-gray-700 bg-gray-100 p-4 rounded-lg">{JSON.stringify(result, null, 2)}</pre>
            </div>
          )}
        </div>
      </div>
      <Footer />
      <ToastContainer />
    </section>
  );
};

export default AlloyGenerator;
