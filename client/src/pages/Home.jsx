import { useContext, useState } from "react";
import { GlobalContext } from "../context/createContext";
import HomeHeader from "../components/HomeHeader";
import HomeContent from "../components/HomeContent";

const Home = () => {
  const { themeMode } = useContext(GlobalContext);
  const [filter, setFilter] = useState("all");
  return (
    <div
      className={`min-h-screen ${
        themeMode === "light" ? "bg-[#0e122b]" : "bg-gray-50"
      }`}
    >
      <div className="max-w-4xl md:pt-10 pt-20 sm:px-0 px-2 mx-auto">
        <HomeHeader setFilter={setFilter} />
        <HomeContent filter={filter} />
      </div>
    </div>
  );
};

export default Home;

// 181D31
// 313552
