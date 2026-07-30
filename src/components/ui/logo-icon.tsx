import logoJr from "@/assets/logo.png";

interface LogoIconProps {
  size?: number;
  className?: string;
}

/**
 * Logo icon component for AI chat bubbles and other UI elements
 * Simple logo without animation effects
 */
export function LogoIcon({ size = 20, className = "" }: LogoIconProps) {
  return (
    <img
      src={logoJr}
      alt="JobReady AI"
      className={className}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        objectFit: "contain",
      }}
    />
  );
}
