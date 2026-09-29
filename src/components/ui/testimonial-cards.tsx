"use client";

import * as React from "react";
import { motion } from "framer-motion";
import Image from "next/image";

import { cn } from "@/lib/utils";

export type TestimonialPosition = "front" | "middle" | "back";

export type TestimonialCardProps = {
  author: string;
  avatar: string;
  background: string;
  handleShuffle: () => void;
  id: number;
  position: TestimonialPosition;
  testimonial: string;
};

export function TestimonialCard({
  handleShuffle,
  testimonial,
  position,
  id,
  author,
  avatar,
  background,
}: TestimonialCardProps) {
  const dragRef = React.useRef(0);
  const isFront = position === "front";

  return (
    <motion.div
      animate={{
        rotate: position === "front" ? "-4deg" : position === "middle" ? "0deg" : "4deg",
        x: position === "front" ? "0%" : position === "middle" ? "8%" : "16%",
      }}
      className={cn("testimonial-card", isFront && "is-front")}
      drag={isFront}
      dragConstraints={{ bottom: 0, left: 0, right: 0, top: 0 }}
      dragElastic={0.35}
      onDragEnd={(_, info) => {
        if (dragRef.current - info.point.x > 80) {
          handleShuffle();
        }
        dragRef.current = 0;
      }}
      onDragStart={(_, info) => {
        dragRef.current = info.point.x;
      }}
      style={{
        zIndex: position === "front" ? 2 : position === "middle" ? 1 : 0,
      }}
      transition={{ duration: 0.35 }}
    >
      <Image
        alt=""
        className="testimonial-bg"
        fill
        sizes="260px"
        src={background}
      />
      <div className="testimonial-scrim" />
      <div className="testimonial-avatar" aria-hidden="true">
        <Image
          alt=""
          fill
          sizes="44px"
          src={avatar}
        />
      </div>
      <span className="testimonial-index">{String(id).padStart(2, "0")}</span>
      <p>&ldquo;{testimonial}&rdquo;</p>
      <strong>{author}</strong>
    </motion.div>
  );
}
