import { Link } from "react-router-dom";
import { MdLaptop } from "react-icons/md";

const Logo = ({ variant = "default" }) => {
  if (variant === "footer") {
    return (
      <Link to="/" className="flex items-center gap-2">
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-2 rounded-xl">
          <MdLaptop className="text-white text-2xl" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-white">
            LapHub<span className="text-blue-400">.pk</span>
          </h1>
          <p className="text-[9px] text-gray-400">Trusted Laptop Store</p>
        </div>
      </Link>
    );
  }

  if (variant === "small") {
    return (
      <Link to="/" className="flex items-center gap-1.5">
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-1.5 rounded-lg">
          <MdLaptop className="text-white text-sm" />
        </div>
        <span className="font-bold text-gray-900 text-sm">
          LapHub<span className="text-blue-600">.pk</span>
        </span>
      </Link>
    );
  }

  // Default logo
  return (
    <Link to="/" className="flex items-center gap-2 group">
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-2 rounded-xl shadow-lg group-hover:shadow-xl transition-all duration-300">
        <MdLaptop className="text-white text-2xl" />
      </div>
      <div>
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
          LapHub<span className="text-blue-600">.pk</span>
        </h1>
        <p className="text-[10px] text-gray-500 -mt-0.5">
          Trusted Laptops Store
        </p>
      </div>
    </Link>
  );
};

export default Logo;
