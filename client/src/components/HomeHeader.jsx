import { IoIosArrowDown } from "react-icons/io";
import { FiPlus } from "react-icons/fi";
import { Link } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { GlobalContext } from "../context/createContext";
const HomeHeader = ({ setFilter }) => {
  const { themeMode } = useContext(GlobalContext);
  const [invoices, setInvoices] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showStatus, setShowStatus] = useState(false);

  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/invoice/fetch");
        if (!res.ok) {
          const errorMsg = await res.json();
          setError(errorMsg.message || "error while fetching data");
          setTimeout(() => setError(null), 300);
          setLoading(false);
          return;
        }
        const data = await res.json();
        if (data.success === false) {
          setError(data.message);
          setTimeout(() => setError(null), 300);
          setLoading(false);
          return;
        }
        setInvoices(data);
        setError(null);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
        setTimeout(() => setError(null), 300);
        return;
      }
    };
    fetchInvoice();
  }, []);

  const handleFilterChange = (status) => {
    setFilter(status);
  };
  return (
    <header className=" flex items-start justify-between mb-6">
      <div className={`${invoices.length === 0 ? "hidden" : "inline"}`}>
        <h1
          className={` font-semibold sm:text-2xl text-1xl capitalize ${
            themeMode === "light" ? "text-white" : "text-black"
          }`}
        >
          invoice
        </h1>
        <span className="text-gray-500">
          <span className="md:inline hidden">
            There {invoices.length <= 1 ? "is" : "are"} total
          </span>{" "}
          {invoices.length} {invoices.length <= 1 ? "invoice" : "invoices"}
        </span>
      </div>

      <div
        className={`flex items-center gap-2 relative ${
          themeMode === "light" ? "text-white" : "text-black"
        } ${invoices.length === 0 ? "hidden" : "inline"}`}
      >
        <h1>
          filter <span className="md:inline hidden">by status</span>
        </h1>
        <IoIosArrowDown
          onClick={() => setShowStatus(!showStatus)}
          size={20}
          className={`${
            showStatus ? "rotate-180" : "rotate-0"
          } transition-all duration-300 text-gray-500`}
        />
        {showStatus && (
          <div
            className={` flex-col flex gap-2 items-start absolute top-10 text-white rounded-md bg-[#9884fc] p-2 right-1`}
          >
            <button
              className=" capitalize"
              onClick={() => {
                handleFilterChange("all");
                setShowStatus(!showStatus);
              }}
            >
              All
            </button>
            <button
              className=" capitalize"
              onClick={() => {
                handleFilterChange("pending");
                setShowStatus(!showStatus);
              }}
            >
              pending
            </button>
            <button
              className=" capitalize"
              onClick={() => {
                handleFilterChange("paid");
                setShowStatus(!showStatus);
              }}
            >
              paid
            </button>
          </div>
        )}
      </div>

      <Link
        to={"/create-invoice"}
        className="flex items-center md:p-2 p-1 md:gap-2 gap-1 bg-[#9884fc] rounded-full"
      >
        {" "}
        <FiPlus
          size={25}
          className="rounded-full text-[#9884fc] bg-white p-1"
        />{" "}
        <h1 className="text-white capitalize">
          New <span className="md:inline hidden">invoice</span>
        </h1>
      </Link>
    </header>
  );
};

export default HomeHeader;
