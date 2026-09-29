"use client";

import { useState } from "react";

import {
  TestimonialCard,
  type TestimonialPosition,
} from "@/components/ui/testimonial-cards";
import { testimonials } from "@/lib/portfolio-data";
import { trackEvent } from "@/lib/analytics";

const initialPositions: TestimonialPosition[] = ["front", "middle", "back"];

export function TestimonialStack() {
  const [positions, setPositions] = useState<TestimonialPosition[]>(initialPositions);

  const handleShuffle = () => {
    trackEvent("testimonial_shuffled");
    setPositions((currentPositions) => {
      const nextPositions = [...currentPositions];
      const lastPosition = nextPositions.pop();

      if (lastPosition) {
        nextPositions.unshift(lastPosition);
      }

      return nextPositions;
    });
  };

  return (
    <section className="panel testimonial-panel" aria-label="Testimonials">
      <div className="section-title">
        <h2>Testimonials</h2>
        <button onClick={handleShuffle} type="button">
          Shuffle
        </button>
      </div>
      <div className="testimonial-stack">
        {testimonials.map((testimonial, index) => (
          <TestimonialCard
            handleShuffle={handleShuffle}
            key={testimonial.id}
            position={positions[index]}
            {...testimonial}
          />
        ))}
      </div>
      <p className="testimonial-hint">Drag the front card left or use shuffle.</p>
    </section>
  );
}
