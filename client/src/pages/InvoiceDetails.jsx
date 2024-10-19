import React, { useContext, useEffect, useState } from "react";
import { GlobalContext } from "../context/createContext";
import { Link, useNavigate, useParams } from "react-router-dom";
import { IoIosArrowBack } from "react-icons/io";
import { MdOutlineDone } from "react-icons/md";

const InvoiceDetails = () => {
  const { themeMode } = useContext(GlobalContext);
  const { invoiceId } = useParams();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [invoiceInfo, setInvoiceInfo] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchInvoiceDetails = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/invoice/fetch/${invoiceId}`);
        if (!res.ok) {
          const erroData = await res.json();
          setError(erroData.message || "unable to fetch invoice details");
          setTimeout(() => setError(null), 3000);
          setLoading(false);
          return;
        }
        const data = await res.json();
        if (data.success === true) {
          setError(data.message);
          setTimeout(() => setError(null), 3000);
          setLoading(false);
          return;
        }
        setInvoiceInfo(data);
        setError(null);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setTimeout(() => setError(null), 3000);
        setLoading(false);
      }
    };
    fetchInvoiceDetails();
  }, [invoiceId]);

  const handleDelete = async () => {
    try {
      const res = await fetch(`/api/invoice/delete/${invoiceId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const errorData = await res.json();
        setError(errorData.message || "Unable to delete the invoice");
        setTimeout(() => setError(null), 3000);
        return;
      }

      const data = await res.json();
      navigate("/");
    } catch (error) {
      setError("Server error. Please try again.");
      setTimeout(() => setError(null), 3000);
    }
  };

  const handleStatus = async (invoiceId) => {
    try {
      const res = await fetch(`/api/invoice/update-status/${invoiceId}`, {
        method: "PUT",
      });
      const data = await res.json();
      if (res.ok) {
        setSuccessMsg("invoice status updated");
        setTimeout(() => setSuccessMsg(null), 3000);
        setInvoiceInfo((prevInfo) => ({ ...prevInfo, status: "paid" }));
      } else {
        setError("error while updating invoice status");
        setTimeout(() => setError(null), 3000);
      }
    } catch (error) {
      console.error("Error marking invoice as paid:", error);
    }
  };

  // Function to calculate and format the due date
  const calculateDueDate = (dateString, paymentTerm) => {
    const invoiceDate = new Date(dateString);
    const dueDate = new Date(invoiceDate);
    dueDate.setDate(invoiceDate.getDate() + paymentTerm);
    return dueDate.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleGoBack = () => {
    navigate(-1);
  };

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
    <div
      className={`min-h-screen md:pl-20 pl-0 sm:px-2 px-1 ${
        themeMode === "light" ? "bg-[#0e122b]" : "bg-gray-50"
      }`}
    >
      <div className="max-w-4xl md:pt-10 pt-20 sm:px-0 px-2 mx-auto">
        <h1
          onClick={handleGoBack}
          className="flex cursor-pointer items-center gap-1 mb-2"
        >
          {" "}
          <IoIosArrowBack className="text-gray-600" />{" "}
          <span
            className={`${themeMode === "light" ? "text-white" : "text-black"}`}
          >
            Go back
          </span>
        </h1>
        {invoiceInfo ? (
          <>
            <header
              className={`flex items-center justify-between shadow-lg my-4 rounded-md ${
                themeMode === "light" ? "bg-[#303553]" : "bg-white"
              } py-2 md:px-5 px-2`}
            >
              <div className="capitalize justify-between flex items-center gap-2">
                <h1 className="text-gray-400 md:inline hidden">status :</h1>{" "}
                {invoiceInfo.status === "pending" ? (
                  <p className=" bg-orange-400 text-center bg-opacity-20 p-2  rounded-lg text-orange-400">
                    pending
                  </p>
                ) : invoiceInfo.status === "paid" ? (
                  <p className=" bg-green-400 text-center bg-opacity-20 py-2 px-2 rounded-lg text-green-400">
                    paid
                  </p>
                ) : null}
              </div>

              <div className="flex   items-center gap-2 ">
                {invoiceInfo.status === "pending" && (
                  <button
                    onClick={() => handleStatus(invoiceInfo._id)}
                    className="capitalize text-white bg-[#9884fc] sm:p-3 p-2 rounded-full"
                  >
                    mark as paid
                  </button>
                )}
                {invoiceInfo.status === "pending" && (
                  <Link
                    to={`/edit-invoice/${invoiceId}`}
                    className={`md:inline hidden capitalize text-gray-400 rounded-full sm:p-3 p-2 ${
                      themeMode === "light" ? "bg-[#4f567e]" : "bg-gray-300"
                    }`}
                  >
                    edit
                  </Link>
                )}

                <button
                  onClick={handleDelete}
                  className="md:inline hidden capitalize bg-red-600 text-white rounded-full sm:p-3 p-2"
                >
                  delete
                </button>
              </div>
            </header>
            {error && (
              <h1 className="bg-red-300 text-red-700 p-2 rounded-md">
                {error}
              </h1>
            )}
            {successMsg && (
              <p className="flex text-nowrap items-center justify-between gap-3 text-white bg-green-500 rounded-md px-2 p-1">
                <span>
                  <MdOutlineDone className="bg-white rounded-full p-1 text-3xl text-green-600" />
                </span>{" "}
                <span>{successMsg}</span>
              </p>
            )}
            <div
              className={`shadow-lg my-4 rounded-md capitalize ${
                themeMode === "light"
                  ? "bg-[#303553] text-white"
                  : "bg-white text-black"
              }  md:p-5 p-2`}
            >
              <div className="flex flex-col md:flex-row gap-3 justify-between">
                <div>
                  <h1>#{invoiceInfo._id.substring(0, 5)}</h1>
                  <h1>{invoiceInfo.projectDescription}</h1>
                </div>
                <div>
                  <h1>{invoiceInfo.StreetAddress}</h1>
                  <h1>{invoiceInfo.ownersCity}</h1>
                  <h1>{invoiceInfo.ownersPostcode}</h1>
                  <h1>{invoiceInfo.ownersCountry}</h1>
                </div>
              </div>

              <div className="flex sm:flex-row flex-col gap-3 mt-6 justify-between">
                <div className="flex flex-col gap-4">
                  <div>
                    <span className="text-gray-500">Invoice Date</span>
                    <h1>
                      {new Date(invoiceInfo.date).toLocaleDateString("en-US")}
                    </h1>
                  </div>
                  <div>
                    <span className="text-gray-500">Payment Date</span>
                    <h1>
                      {calculateDueDate(
                        invoiceInfo.date,
                        invoiceInfo.paymentTerm
                      )}
                    </h1>
                  </div>
                </div>

                <div>
                  <h1 className="text-gray-500">bill to </h1>
                  <div className="flex gap-1 flex-col">
                    <span>{invoiceInfo.clientName}</span>
                    <span>{invoiceInfo.clientAddress}</span>
                    <span>{invoiceInfo.clientAddress}</span>
                    <span>{invoiceInfo.clientPostcode}</span>
                    <span>{invoiceInfo.clientCountry}</span>
                  </div>
                </div>

                <div>
                  <h1 className="text-gray-500">send to</h1>
                  <span className="lowercase">{invoiceInfo.clientEmail}</span>
                </div>
              </div>

              <div
                className={`my-2 md:p-3 p-2 rounded-md ${
                  themeMode === "light"
                    ? "bg-[#212847]"
                    : "bg-gray-700 text-gray-300"
                }`}
              >
                <div className="flex items-center sm:flex-wrap justify-between capitalize">
                  <div className="flex items-center flex-col gap-1">
                    <h1 className="text-gray-500">item name</h1>
                    <span>{invoiceInfo.itemName}</span>
                  </div>
                  <div className="flex items-center flex-col gap-1">
                    <h1 className="text-gray-500">quantity</h1>
                    <span>{invoiceInfo.itemQuantity}</span>
                  </div>
                  <div className="flex items-center flex-col gap-1">
                    <h1 className="text-gray-500">price</h1>
                    <span>${invoiceInfo.itemPrice}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex pt-2 pb-4 md:hidden  items-center gap-8 ">
              {invoiceInfo.status === "pending" && (
                <Link
                  to={`/edit-invoice/${invoiceId}`}
                  className={` capitalize text-gray-400 rounded-md sm:p-3 p-2 w-full ${
                    themeMode === "light" ? "bg-[#4f567e]" : "bg-gray-300"
                  }`}
                >
                  edit
                </Link>
              )}

              <button
                onClick={handleDelete}
                className=" capitalize bg-red-600 text-white rounded-md sm:p-3 p-2 w-full"
              >
                delete
              </button>
            </div>
          </>
        ) : (
          <h1
            className={`${
              themeMode === "light" ? "text-white" : "text-black"
            } mt-20 md:text-3xl text-2xl ms:font-semibold font-normal flex items-center justify-center `}
          >
            No details for invoice
          </h1>
        )}
      </div>
    </div>
  );
};

export default InvoiceDetails;
