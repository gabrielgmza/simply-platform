import type { Config } from "tailwindcss";
import simplyPreset from "@simply/ui/tailwind-preset";

const config: Config = {
  presets: [simplyPreset],
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "../../packages/ui/src/**/*.{ts,tsx}",
  ],
};

export default config;
