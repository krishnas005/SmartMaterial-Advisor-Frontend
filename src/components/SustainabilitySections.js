"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";

const SustainabilitySection = () => {
  const imageRef = useRef(null);
  const contentRef = useRef(null);

  useEffect(() => {
    gsap.fromTo(
      imageRef.current,
      { opacity: 0, x: -50 },
      { opacity: 1, x: 0, duration: 1.2, ease: "power3.out" }
    );
    gsap.fromTo(
      contentRef.current,
      { opacity: 0, x: 50 },
      { opacity: 1, x: 0, duration: 1.2, ease: "power3.out", delay: 0.2 }
    );
  }, []);

  return (
    <section className="px-6 py-16 bg-white flex flex-col lg:flex-row items-center gap-8 lg:gap-12"> 
      <div
        ref={imageRef}
        className="w-full lg:w-1/2 overflow-hidden rounded-lg shadow-lg"
      >
        <img
          src="/img.jpg"
          alt="Sustainability Impact"
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105 hover:cursor-pointer"
        />
      </div>
 
      <div
        ref={contentRef}
        className="flex flex-col w-full lg:w-1/2 text-left space-y-6"
      >
        <h2 className="text-[#0d151c] text-3xl md:text-5xl font-bold">
          Driving Sustainability with Key Metrics
        </h2>
        <p className="text-gray-600 text-lg leading-relaxed">
        Our sustainability framework evaluates materials using six critical factors: Carbon Footprint, Recyclability, Energy Intensity, Cost-Effectiveness, Toxicity, and Durability. These factors are weighted and analyzed through a Weighted Multi-Criteria Scoring System (WMCS), designed to address industry-specific sustainability needs in the automotive sector.

        </p>
        <ul className="list-disc pl-6 space-y-2 text-gray-700">
          <li>
            <strong>Carbon Footprint:</strong> Reduces greenhouse gas emissions, supporting global climate goals.

          </li>
          <li>
            <strong>Recyclability:</strong> Encourages reuse and recycling to promote a circular economy.
          </li>
          <li>
            <strong>Energy Intensity:</strong> Lowers energy requirements for material production, reducing environmental impact.
          </li>
          <li>
            <strong>Cost-Effectiveness:</strong> Balances sustainability with economic viability for widespread adoption.
          </li>
          <li>
            <strong>Toxicity :</strong> Ensures compliance with health and environmental regulations like REACH.

          </li>
          <li>
            <strong>Durability :</strong> Enhances material longevity, minimizing waste and replacements.
          </li>
        </ul>
      </div>
    </section>
  );
};

export default SustainabilitySection;
