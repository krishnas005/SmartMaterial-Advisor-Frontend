"use client";

import React, { useState } from 'react';
import Select from 'react-select';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
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
    label: `${key.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())} (${propertyConstraints[key].unit})`,
  }));

  const handlePropertyChange = (selectedOptions) => {
    setSelectedProperties(selectedOptions || []);
    const newPropertyRanges = {};
    (selectedOptions || []).forEach(({ value }) => {
      newPropertyRanges[value] = newPropertyRanges[value] || { min: '', max: '' };
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

  const handleSubmit = (e) => {
    e.preventDefault();
    setResult(null);

    if (!validateInput()) {
      return;
    }

    setLoading(true);

    // Hardcoding the result for demonstration purposes
    setTimeout(() => {
      const hardcodedResult = {
        alloy_name: "Fe65Cr18Ni8Mn2Si1",
        composition: {
          Iron: "65%",
          Chromium: "18%",
          Nickel: "8%",
          Manganese: "2%",
          Silicon: "1%",
        },
        achieved_properties: {
          tensile_strength: "520 MPa",
          hardness: "170 HV",
          density: "3125 kg/m³",
          corrosion_resistance: "80%",
        },
        similarity_score: 78,
        explanations: {
          Iron: "Contributes to tensile strength and malleability.",
          Chromium: "Enhances corrosion resistance and hardness.",
          Nickel: "Improves ductility and toughness.",
          Manganese: "Increases strength and wear resistance.",
          Silicon: "Adds to hardness and improves heat resistance.",
        },
      };
      setResult(hardcodedResult);
      setLoading(false);
    }, 5000);
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
                    value={propertyRanges[filter.value]?.min || ''}
                    onChange={(e) => handleRangeChange(filter.value, 'min', e.target.value)}
                    className="w-1/2 p-3 rounded-lg border border-gray-300 text-gray-900"
                  />
                  <input
                    type="number"
                    placeholder={`Max (${propertyConstraints[filter.value].unit})`}
                    value={propertyRanges[filter.value]?.max || ''}
                    onChange={(e) => handleRangeChange(filter.value, 'max', e.target.value)}
                    className="w-1/2 p-3 rounded-lg border border-gray-300 text-gray-900"
                  />
                </div>
              </div>
            ))}
            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-blue-500 to-teal-500 rounded-lg font-semibold text-white hover:opacity-90 transform hover:scale-105 transition-transform"
            >
              {loading ? 'Generating...' : 'Generate Alloy'}
            </button>
          </form>
          {result && (
            <div className="mt-8 shadow-lg p-8 rounded-2xl space-y-8">
              <h2 className="text-3xl font-bold text-center text-gray-800">
                🔍 Generated Alloy Result
              </h2>

              <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-8">
                {/* Left Section - Composition & Properties */}
                <div className="md:w-3/4 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Composition */}
                    <div>
                      <h4 className="text-xl font-bold text-black mb-2">🧪 Composition</h4>
                      <ul className="space-y-2 list-disc list-inside">
                        {Object.entries(result.composition).map(([element, percentage]) => (
                          <li key={element} className="text-lg text-gray-700 leading-relaxed">
                            <span className="font-semibold text-slate-900">{element}:</span> {percentage}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Achieved Properties */}
                    <div>
                      <h4 className="text-xl font-bold text-black mb-2">📊 Achieved Properties</h4>
                      <ul className="space-y-2 list-disc list-inside">
                        {Object.entries(result.achieved_properties).map(([property, value]) => (
                          <li key={property} className="text-lg text-gray-700 leading-relaxed">
                            <span className="font-semibold text-gray-900">
                              {property.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())}:
                            </span> {value}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Explanation */}
                  <div>
                    <h4 className="text-xl font-bold text-black mb-2">📝 Explanation</h4>
                    <ol className="space-y-2 list-decimal list-inside">
                      {Object.entries(result.explanations).map(([metal, explanation]) => (
                        <li key={metal} className="text-lg text-gray-700 leading-relaxed">
                          <span className="font-semibold text-gray-900">{metal}:</span> {explanation}
                        </li>
                      ))}
                    </ol>
                  </div>
                </div>


                {/* Right Section - Similarity Score */}
                <div className="flex relative flex-col right-8 top-16 items-center justify-center">
                  <p className="text-xl text-black font-bold mb-3">Similarity Score</p>
                  <div
                    className={`w-32 h-32 rounded-full flex items-center justify-center text-3xl font-extrabold text-white shadow-lg 
            ${result.similarity_score > 75 ? 'bg-green-500'
                        : result.similarity_score > 50 ? 'bg-yellow-400'
                          : 'bg-red-500'}`}
                  >
                    {result.similarity_score}%
                  </div>
                  <p className="text-sm text-gray-600 mt-2">
                    {result.similarity_score > 75
                      ? "Excellent Match ✅"
                      : result.similarity_score > 50
                        ? "Moderate Match ⚠️"
                        : "Low Match ❌"}
                  </p>
                </div>
              </div>

              {/* Download Button */}
              <div className="flex justify-center">
                <button className="py-3 px-6 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 hover:scale-105 transition-transform">
                  ⬇️ Download Report
                </button>
              </div>
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