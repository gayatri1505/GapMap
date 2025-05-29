
import { MapPin } from "lucide-react";

const Logo = ({ className = "" }: { className?: string }) => {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="relative w-7 h-7 bg-gradient-to-br from-gapmap-purple to-gapmap-purple-dark rounded-lg flex items-center justify-center">
        <MapPin size={18} className="text-white" />
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-gapmap-orange rounded-full animate-pulse-slow" />
      </div>
      <span className="font-bold text-xl text-gradient">GapMap</span>
    </div>
  );
};

export default Logo;
