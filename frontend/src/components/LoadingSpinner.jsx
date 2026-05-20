import { Loader2 } from "lucide-react";
function LoadingSpinner({ size = "md", fullScreen = false }) {
  const sizes = {
    sm: "h-4 w-4 border-2",
    md: "h-8 w-8 border-2",
    lg: "h-12 w-12 border-4",
  };

  if (fullScreen) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className={`animate-spin text-gray-500 ${sizes[size]}`} />
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center p-8">
      <Loader2 className={`animate-spin text-gray-500 ${sizes[size]}`} />
    </div>
  );
}

export default LoadingSpinner;
