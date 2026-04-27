import { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
}

export function Card({ children, className = "" }: CardProps) {
  return <div className={`card ${className}`}>{children}</div>;
}

export function CardElevated({ children, className = "" }: CardProps) {
  return <div className={`card-elevated ${className}`}>{children}</div>;
}
