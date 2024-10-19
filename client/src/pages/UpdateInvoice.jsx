import { useContext, useEffect, useState } from "react";
import { GlobalContext } from "../context/createContext";
import { IoIosArrowBack } from "react-icons/io";
import { LiaTimesSolid } from "react-icons/lia";
import { MdErrorOutline } from "react-icons/md";
import { Link, useNavigate, useParams } from "react-router-dom";

const UpdateInvoice = () => {
  const { themeMode } = useContext(GlobalContext);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { invoiceId } = useParams();
  const [formData, setFormData] = useState({
    StreetAddress: "",
    ownersCity: "",
    ownersPostcode: "",
    ownersCountry: "",
    clientName: "",
    clientEmail: "",
    clientAddress: "",
    clientCity: "",
    clientPostcode: "",
    clientCountry: "",
    paymentTerm: "",
    date: "",
    projectDescription: "",
    itemName: "",
    itemQuantity: "",
    itemPrice: "",
  });
  console.log(formData);

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
        setFormData(data);
        setError(null);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setTimeout(() => setError(null), 3000);
        setLoading(false);
      }
    };
    fetchInvoiceDetails();
  }, []);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [id]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const requiredFields = [
      "StreetAddress",
      "ownersCity",
      "ownersPostcode",
      "ownersCountry",
      "clientName",
      "clientEmail",
      "clientAddress",
      "clientCity",
      "clientPostcode",
      "clientCountry",
      "paymentTerm",
      "date",
      "projectDescription",
      "itemName",
      "itemQuantity",
      "itemPrice",
    ];

    const isEmpty = requiredFields.some((field) => !formData[field]);
    if (isEmpty) {
      setError("All fields are required");
      setTimeout(() => setError(null), 3000);
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(`/api/invoice/edit/${invoiceId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      // Log the entire response to check if it's returning HTML
      const text = await res.text();
      console.log(text); // Log response in plain text for debugging

      if (!res.ok) {
        setError("Unable to edit the invoice");
        setTimeout(() => setError(null), 3000);
        setLoading(false);
        return;
      }

      const data = JSON.parse(text); // Only parse if the response is valid JSON
      if (data.success === false) {
        setError(data.message);
        setTimeout(() => setError(null), 3000);
        setLoading(false);
        return;
      }
      setLoading(false);
      navigate(-1);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div
      className={`md:pt-10 pt-20 md:py-4 py-2 md:px-1 px-2 ${
        themeMode === "light" ? "bg-[#0e122b]" : "bg-white"
      }`}
    >
      <div
        className={`max-w-4xl relative p-4 pb-10 mx-auto shadow-lg ${
          themeMode === "light" ? "bg-[#242535]" : "bg-white"
        } `}
      >
        <h1
          onClick={handleGoBack}
          className="flex justify-end cursor-pointer items-center gap-1 mb-2"
        >
          {" "}
          <IoIosArrowBack className="text-gray-600" />{" "}
          <span
            className={`capitalize ${
              themeMode === "light" ? "text-white" : "text-black"
            }`}
          >
            Go back
          </span>
        </h1>
        <div className="">
          <h1
            className={`capitalize mb-4 ${
              themeMode === "light" ? "text-white" : "text-black"
            }`}
          >
            edit Invoice
          </h1>{" "}
          <form onSubmit={handleSubmit}>
            <div>
              {/* div for bill form start */}
              <h1 className="text-[#917cfa] mb-2 ">Bill form</h1>
              <div className="flex flex-col">
                <label className="text-gray-400 capitalize">
                  street address
                </label>
                <input
                  type="text"
                  onChange={handleChange}
                  value={formData.StreetAddress}
                  id="StreetAddress"
                  className={`py-1 px-3 rounded-md focus:outline-none ${
                    themeMode === "light"
                      ? "bg-[#303553] text-white"
                      : 'bg-"" border border-gray-400 text-""'
                  }`}
                />
              </div>
              <div className="flex md:flex-row flex-col md:gap-4 gap-2 my-3 ">
                <div className="flex-1">
                  <label className="text-gray-400 capitalize">city</label>
                  <input
                    type="text"
                    id="ownersCity"
                    onChange={handleChange}
                    value={formData.ownersCity}
                    className={`py-1 px-3 rounded-md w-full focus:outline-none ${
                      themeMode === "light"
                        ? "bg-[#303553] text-white"
                        : 'bg-"" border border-gray-400 text-""'
                    }`}
                  />
                </div>
                <div className="flex-1">
                  <label className="text-gray-400 capitalize">post code</label>
                  <input
                    type="number"
                    id="ownersPostcode"
                    onChange={handleChange}
                    value={formData.ownersPostcode}
                    className={`py-1 px-3 rounded-md w-full focus:outline-none ${
                      themeMode === "light"
                        ? "bg-[#303553] text-white"
                        : 'bg-"" border border-gray-400 text-""'
                    }`}
                  />
                </div>
                <div className="flex-1">
                  <label className="text-gray-400 capitalize">country</label>
                  <input
                    type="text"
                    id="ownersCountry"
                    onChange={handleChange}
                    value={formData.ownersCountry}
                    className={`py-1 px-3 rounded-md w-full focus:outline-none ${
                      themeMode === "light"
                        ? "bg-[#303553] text-white"
                        : 'bg-"" border border-gray-400 text-""'
                    }`}
                  />{" "}
                </div>
              </div>
              {/* div for bill form end */}

              {/* div for bill to start */}
              <h1 className="text-[#917cfa] mt-8 ">Bill to</h1>
              <div className="flex flex-col gap-4 my-3">
                <div className="flex flex-col ">
                  <label className="text-gray-400 capitalize">
                    client name
                  </label>
                  <input
                    type="text"
                    id="clientName"
                    onChange={handleChange}
                    value={formData.clientName}
                    className={`py-1 px-3 rounded-md focus:outline-none ${
                      themeMode === "light"
                        ? "bg-[#303553] text-white"
                        : 'bg-"" border border-gray-400 text-""'
                    }`}
                  />
                </div>
                <div className="flex flex-col">
                  <label className="text-gray-400 capitalize">
                    client email
                  </label>
                  <input
                    type="email"
                    id="clientEmail"
                    onChange={handleChange}
                    value={formData.clientEmail}
                    className={`py-1 px-3 rounded-md focus:outline-none ${
                      themeMode === "light"
                        ? "bg-[#303553] text-white"
                        : 'bg-"" border border-gray-400 text-""'
                    }`}
                  />
                </div>
                <div className="flex flex-col">
                  <label className="text-gray-400 capitalize">
                    street address
                  </label>
                  <input
                    type="text"
                    id="clientAddress"
                    onChange={handleChange}
                    value={formData.clientAddress}
                    className={`py-1 px-3 rounded-md focus:outline-none ${
                      themeMode === "light"
                        ? "bg-[#303553] text-white"
                        : 'bg-"" border border-gray-400 text-""'
                    }`}
                  />
                </div>

                <div className="flex md:flex-row flex-col md:gap-4 gap-2 mb-3">
                  <div className="flex-1">
                    <label className="text-gray-400 capitalize">city</label>
                    <input
                      type="text"
                      id="clientCity"
                      onChange={handleChange}
                      value={formData.clientCity}
                      className={`py-1 px-3 rounded-md w-full focus:outline-none ${
                        themeMode === "light"
                          ? "bg-[#303553] text-white"
                          : 'bg-"" border border-gray-400 text-""'
                      }`}
                    />
                  </div>
                  <div className="flex-1">
                    <label className="text-gray-400 capitalize">
                      post code
                    </label>
                    <input
                      type="number"
                      id="clientPostcode"
                      onChange={handleChange}
                      value={formData.clientPostcode}
                      className={`py-1 px-3 rounded-md w-full focus:outline-none ${
                        themeMode === "light"
                          ? "bg-[#303553] text-white"
                          : 'bg-"" border border-gray-400 text-""'
                      }`}
                    />
                  </div>
                  <div className="flex-1">
                    <label className="text-gray-400 capitalize">country</label>
                    <input
                      type="text"
                      id="clientCountry"
                      onChange={handleChange}
                      value={formData.clientCountry}
                      className={`py-1 px-3 rounded-md w-full focus:outline-none ${
                        themeMode === "light"
                          ? "bg-[#303553] text-white"
                          : 'bg-"" border border-gray-400 text-""'
                      }`}
                    />{" "}
                  </div>
                </div>
              </div>
            </div>

            {/* div for date and payment terms */}

            <div className="flex gap-3 mb-3">
              <div className="flex-1">
                <label className="text-gray-400 block capitalize">date</label>
                <input
                  type="date"
                  id="date"
                  value={formData.date}
                  onChange={handleChange}
                  className={`py-1 px-3 rounded-md w-full focus:outline-none ${
                    themeMode === "light"
                      ? "bg-[#303553] text-white"
                      : 'bg-"" border border-gray-400 text-""'
                  }`}
                />
              </div>
              <div className="flex-1">
                <label className="text-gray-400 capitalize">payment term</label>
                <select
                  value={formData.paymentTerm}
                  id="paymentTerm"
                  className={`py-1 px-3 rounded-md w-full focus:outline-none ${
                    themeMode === "light"
                      ? "bg-[#303553] text-white"
                      : 'bg-"" border border-gray-400 text-""'
                  }`}
                  type="text"
                  onChange={handleChange}
                >
                  <option value="" disabled>
                    select payment term
                  </option>
                  <option value="7">7 Days</option>
                  <option value="14">14 Days</option>
                  <option value="21">21 Days</option>
                </select>
              </div>{" "}
            </div>

            {/* project description div */}
            <div className="flex flex-col mt-6">
              <label className="text-gray-400 capitalize">
                project description
              </label>
              <input
                type="text"
                onChange={handleChange}
                value={formData.projectDescription}
                id="projectDescription"
                className={`py-1 px-3 rounded-md focus:outline-none ${
                  themeMode === "light"
                    ? "bg-[#303553] text-white"
                    : 'bg-"" border border-gray-400 text-""'
                }`}
              />
            </div>

            {/* div for listing items */}
            <h1 className="capitalize text-[#917cfa] mt-4 mb2">item info</h1>
            <div className="flex md:flex-row flex-col md:gap-4 gap-2 mb-3">
              <div className="">
                <label className="text-gray-400 capitalize">Item name</label>
                <input
                  type="text"
                  id="itemName"
                  onChange={handleChange}
                  value={formData.itemName}
                  className={`py-1 px-3 rounded-md w-full focus:outline-none ${
                    themeMode === "light"
                      ? "bg-[#303553] text-white"
                      : 'bg-"" border border-gray-400 text-""'
                  }`}
                />
              </div>
              <div className="">
                <label className="text-gray-400 capitalize">quantity</label>
                <input
                  type="number"
                  id="itemQuantity"
                  onChange={handleChange}
                  value={formData.itemQuantity}
                  className={`py-1 px-3 rounded-md w-full focus:outline-none ${
                    themeMode === "light"
                      ? "bg-[#303553] text-white"
                      : 'bg-"" border border-gray-400 text-""'
                  }`}
                />
              </div>
              <div className="">
                <label className="text-gray-400 capitalize">price</label>
                <input
                  type="number"
                  id="itemPrice"
                  onChange={handleChange}
                  value={formData.itemPrice}
                  className={`py-1 px-3 rounded-md w-full focus:outline-none ${
                    themeMode === "light"
                      ? "bg-[#303553] text-white"
                      : 'bg-"" border border-gray-400 text-""'
                  }`}
                />{" "}
              </div>
            </div>

            <button
              disabled={loading}
              className="mt-4 w-full capitalize sm:p-3 p-2 text-white bg-[#917cfa] rounded-lg"
            >
              edit
            </button>
          </form>
          {/* div for error message  */}
          {error && (
            <p className="max-w-2xl mx-auto flex items-center justify-between text-nowrap text-[15px] bg-red-100 text-red-600 rounded-md p-2">
              <span className="flex items-center gap-2">
                <MdErrorOutline size={20} /> {error}
              </span>
              <LiaTimesSolid
                size={20}
                onClick={() => setError(null)}
                className=" text-nowrap cursor-pointer"
              />
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default UpdateInvoice;
