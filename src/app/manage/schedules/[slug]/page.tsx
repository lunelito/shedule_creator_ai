"use client";
import RenderAnimation from "@/animations/RenderAnimation";
import { useParams } from "next/navigation";

export default function SchedulePage() {
  const params = useParams();
  const slug = params.slug;

  return (
    <div>
      <RenderAnimation animationKey={slug as string}>
        <h1 className="text-3xl font-bold mb-4">Schedule: {slug}</h1>
      </RenderAnimation>
    </div>
  );
}
