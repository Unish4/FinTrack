import { Loader } from "lucide-react";
function LoadingSpinner({ size = "md", fullScreen = false }) {
  const sizes = {
    sm: "h-4 w-4",
    md: "h-8 w-8",
    lg: "h-12 w-12",
  };

  if (fullScreen) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <Loader className={`${sizes[size]} animate-spin text-white`} />
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center p-8">
      <Loader className={`${sizes[size]} animate-spin text-white`} />
    </div>
  );
}

export default LoadingSpinner;
