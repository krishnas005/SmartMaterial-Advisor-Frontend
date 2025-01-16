"use client";

import React, { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";

const ReportInfo = ({ materialName }) => {
  const [overview, setOverview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOverview = async () => {
      try {
        const response = await fetch('/api/generate-overview', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ materialName }),
        });

        if (!response.ok) {
          throw new Error('Failed to generate overview');
        }

        const data = await response.json();
        setOverview(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (materialName) {
      fetchOverview();
    }
  }, [materialName]);

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 min-h-[200px] flex items-center justify-center">
        <div className="flex flex-col items-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
          <p className="mt-4 text-gray-600">Generating material overview...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 rounded-lg shadow-md p-6 border border-red-200">
        <h2 className="text-red-800 text-xl font-semibold">Error</h2>
        <p className="text-red-600 mt-2">{error}</p>
      </div>
    );
  }

  if (!overview) {
    return null;
  }

  const sections = [
    { title: "About", content: overview.sections.about },
    { title: "Origin and Production", content: overview.sections.origin },
    { title: "Sustainability and Environmental Impact", content: overview.sections.sustainability },
    { title: "Regulations in India", content: overview.sections.regulations },
    { title: "Major Producers", content: overview.sections.producers },
    { title: "Corporate Sustainability Use", content: overview.sections.corporateUse },
    { title: "Recent Research and Developments", content: overview.sections.research }
  ];

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 space-y-4 px-12 py-10">
      <h2 className="text-xl font-bold text-center text-gray-800 mb-4 tracking-wide">
        {overview.title} Overview
      </h2>

      {sections.map((section, index) => (
        <section key={index}>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            {index + 1}. {section.title}
          </h3>
          <p className="text-sm text-gray-700 leading-snug text-justify">
            {section.content}
          </p>
        </section>
      ))}
    </div>
  );
};

export default ReportInfo;