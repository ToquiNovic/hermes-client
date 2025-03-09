"use client";
import { TypewriterEffectSmooth } from "@/components/ui/typewriter-effect";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

type Word = {
  text: string;
  className?: string;
};

export function TypewriterEffectSmoothDemo() {
  const words: Word[] = [
    { text: "Conviértete" },
    { text: "en el Hokage" },
    { text: "de tus sensores." },
    { text: "Conéctalos con la" },
    {
      text: "NUBE",
      className:
        "text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl font-bold " +
        "px-2 py-0.5 rounded-md " +
        "text-red-600 dark:text-white bg-black dark:bg-red-600 " +
        "border border-red-600 dark:border-white shadow-md",
    },
  ];

  return (
    <div className="flex flex-col items-center justify-center h-[40rem] space-y-4">
      <p className="text-neutral-600 dark:text-neutral-200 text-sm sm:text-lg font-medium">
        "Los datos no te hacen fuerte… ¡la conexión con ellos sí!"
      </p>
      <TypewriterEffectSmooth words={words} />
      <p className="text-neutral-500 dark:text-neutral-400 text-xs sm:text-sm text-center">
        Da el primer paso como un verdadero ninja y lleva tus sensores al
        siguiente nivel.
      </p>
      <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
        <Button>
          <Link to="/register">¡Despierta tu Chakra!</Link>
        </Button>
        <Button variant="secondary">
          <Link to="/login">Modo Sabio</Link>
        </Button>
      </div>
    </div>
  );
}
