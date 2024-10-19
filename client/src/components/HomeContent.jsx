import { useContext, useEffect, useState } from "react";
import { IoIosArrowForward } from "react-icons/io";
import { GlobalContext } from "../context/createContext";
import { Link } from "react-router-dom";

const HomeContent = () => {
  const { themeMode } = useContext(GlobalContext);
  const [invoices, setInvoices] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

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
  if (loading) {
    return (
      <div className="flex items-center flex-col min-h-screen justify-center flex-grow">
        <div
          className={`w-16 h-16 animate-ping rounded-full ${
            themeMode === "light" ? "bg-white" : "bg-[#303553]"
          } `}
        ></div>
      </div>
    );
  }
  return (
    <div>
      <div>
        {invoices.map((invoice) => {
          const {
            _id,
            clientName,
            date,
            paymentTerm,
            status,
            itemPrice,
          } = invoice;

          // Convert date string to Date object for the created date
          const createdAt = new Date(date);

          // Add the payment term (days) to the created date using milliseconds conversion
          const dueDate = new Date(
            createdAt.getTime() + paymentTerm * 24 * 60 * 60 * 1000
          );

          // Format the due date as a full date string
          const formattedDueDate = dueDate.toLocaleDateString("en-US", {
            year: "numeric",
            month: "numeric",
            day: "numeric",
          });
          return (
            <Link
              to={`/invoice-info/${_id}`}
              key={_id}
              className={`flex items-center justify-between mb-3 ${
                themeMode === "light" ? "bg-[#1c2138]" : "bg-white"
              } py-3 sm:px-4 px-3 rounded-md shadow-md`}
            >
              <h1
                className={`md:font-bold font-semibold flex-1 ${
                  themeMode === "light" ? "text-white" : "text-black"
                }`}
              >
                #{_id.substring(0, 5)}
              </h1>
              <h1 className="md:inline hidden text-gray-500 flex-1">
                Due {formattedDueDate}
              </h1>
              <h1 className="text-gray-500 flex-1">{clientName}</h1>
              <h1
                className={`flex-1 ${
                  themeMode === "light" ? "text-white" : "text-black"
                }`}
              >
                #{itemPrice}
              </h1>
              <span className="flex-1 capitalize md:mr-10 rounded-md">
                {status === "pending" ? (
                  <p className="bg-orange-400 text-center bg-opacity-20 p-2 rounded-lg text-orange-400">
                    pending
                  </p>
                ) : status === "paid" ? (
                  <p className="bg-green-400 text-center bg-opacity-20 py-2 px-2 rounded-lg text-green-400">
                    paid
                  </p>
                ) : null}
              </span>
              <span className="md:inline hidden text-[#9884fc] md:font-bold font-semibold ">
                {<IoIosArrowForward size={20} />}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default HomeContent;
