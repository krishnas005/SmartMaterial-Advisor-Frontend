"use client";

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ReportInfo from "@/components/ReportInfo";
import { Loader2 } from "lucide-react";

export default function ReportPage() {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [materialName, setMaterialName] = useState(null);
  const searchParams = useSearchParams();

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const materialParam = searchParams.get('material');
        if (!materialParam) {
          throw new Error('No material specified');
        }

        const material = JSON.parse(decodeURIComponent(materialParam));
        setMaterialName(material);
        
        const response = await fetch('/api/generate-report', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            materialName: material,
            applicationArea: 'Automotive'
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to generate report');
        }

        const data = await response.json();
        setReport(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, [searchParams]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Header />
        <main className="container mx-auto p-8">
          <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <Loader2 className="h-12 w-12 animate-spin text-blue-500" />
            <p className="mt-4 text-lg text-gray-600">Generating comprehensive material report...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Header />
        <main className="container mx-auto p-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h2 className="text-red-800 text-xl font-semibold">Error</h2>
            <p className="text-red-600 mt-2">{error}</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <main className="container mx-auto p-8">
        <div className="max-w-4xl mx-auto space-y-8">
          <h1 className="text-4xl font-bold text-gray-900">Material Analysis Report</h1>
          
          {materialName && <ReportInfo materialName={materialName} />}
          
          {report && (
            <>
              {/* Widely Used Material Section */}
              <section className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">Currently Used Material</h2>
                <div className="space-y-4">
                  <h3 className="text-xl font-medium text-gray-700">{report.widelyUsedMaterial.name}</h3>
                  <p className="text-gray-600">{report.widelyUsedMaterial.details}</p>
                </div>
              </section>

              {/* Performance Comparison */}
              <section className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">Performance Comparison</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(report.comparison.performance).map(([key, value]) => (
                    <div key={key} className="border rounded-lg p-4">
                      <h4 className="font-medium text-gray-700 capitalize">{key.replace(/_/g, ' ')}</h4>
                      <p className="text-gray-600">{value}</p>
                    </div>
                  ))}
                </div>
              </section>

              {/* Sustainability Metrics */}
              <section className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">Sustainability Analysis</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(report.comparison.sustainability).map(([key, value]) => (
                    <div key={key} className="border rounded-lg p-4">
                      <h4 className="font-medium text-gray-700 capitalize">{key.replace(/_/g, ' ')}</h4>
                      <p className="text-gray-600">{value}</p>
                    </div>
                  ))}
                </div>
              </section>

              {/* Cost Analysis */}
              <section className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">Cost Analysis</h2>
                <div className="space-y-4">
                  {Object.entries(report.comparison.costAnalysis).map(([key, value]) => (
                    <div key={key} className="border rounded-lg p-4">
                      <h4 className="font-medium text-gray-700 capitalize">{key.replace(/_/g, ' ')}</h4>
                      <p className="text-gray-600">{value}</p>
                    </div>
                  ))}
                </div>
              </section>

              {/* Final Recommendation */}
              <section className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg shadow-lg p-6 text-white">
                <h2 className="text-2xl font-semibold mb-4">Final Recommendation</h2>
                <p className="text-lg">{report.recommendation}</p>
              </section>
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}