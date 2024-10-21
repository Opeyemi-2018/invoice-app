import { useContext, useState } from "react";
import { GlobalContext } from "../context/createContext";
import { FaFileInvoiceDollar } from "react-icons/fa";
import { IoSunny } from "react-icons/io5";
import { IoMoonSharp } from "react-icons/io5";
import { Link } from "react-router-dom";
import { PiSignOutBold } from "react-icons/pi";
import { RiDeleteBin6Line, RiH1 } from "react-icons/ri";
import { LiaTimesSolid } from "react-icons/lia";

const Header = () => {
  const { themeMode, toggleThemeMode, user, signOutUser } = useContext(
    GlobalContext
  );
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState(null);

  // signout functionality
  const handleSignOut = async () => {
    try {
      const res = await fetch("/api/auth/signout", { credentials: "include" });
      const data = res.json();
      if (data.success === false) {
        setError(data.message);
        return;
      }
      signOutUser();
      setShowModal(!showModal);
    } catch (error) {
      setError(error.message);
    }
  };

  // delete functionality
  const handleDelete = async () => {
    try {
      const res = await fetch(`/api/auth/delete/${user._id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success === false) {
        setError(data.message);
        return;
      }
      signOutUser();
      setShowModal(!showModal);
    } catch (error) {
      setError(error.message);
    }
  };
  return (
    <>
      <header className="fixed z-20 top-0 w-16 bottom-0  bg-[#303553] md:flex hidden flex-col justify-between items-center rounded-br-md rounded-tr-md">
        <div className="flex  justify-center items-center w-full">
          <Link
            to={"/"}
            className="bg-[#9884fc] rounded-tr-md rounded-br-md   w-16 h-14 flex items-center justify-center"
          >
            {" "}
            <FaFileInvoiceDollar size={30} className=" text-white  " />
          </Link>
        </div>
        <div className="flex flex-col items-center gap-6 mb-4">
          <button onClick={toggleThemeMode}>
            {themeMode === "light" ? (
              <IoSunny size={25} className="text-gray-400" />
            ) : (
              <IoMoonSharp size={25} className="text-gray-400" />
            )}
          </button>
          {user ? (
            user.image ? (
              <img
                onClick={() => setShowModal(!showModal)}
                src={user.image}
                alt=""
                className="h-8 w-8 rounded-full cursor-pointer"
              />
            ) : (
              <h1
                onClick={() => setShowModal(!showModal)}
                className="cursor-pointer font-semibold sm:text-2xl text-1xl text-white"
              >
                {user.name}
              </h1>
            )
          ) : (
            <Link
              to={"/sign-in"}
              className="text-white py-1 px-1 text-nowrap rounded-sm font-semibold"
            >
              sign in
            </Link>
          )}
        </div>
        {showModal && (
          <div className="fixed left-20 bottom-4 z-50 bg-[#303553] p-3 rounded-md text-gray-400">
            <LiaTimesSolid
              size={20}
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-white"
            />
            <div className="flex flex-col gap-3 capitalize mt-6">
              <div
                onClick={handleSignOut}
                className="flex cursor-pointer p-1 items-center gap-1 hover:text-red-600 hover:bg-white rounded-md transition-all duration-300"
              >
                <span>
                  <PiSignOutBold size={20} />
                </span>
                <h1>sign out account</h1>
              </div>
              <div
                onClick={handleDelete}
                className="flex cursor-pointer p-1 items-center gap-1 hover:text-red-600 hover:bg-white rounded-md transition-all duration-300"
              >
                <span>
                  <RiDeleteBin6Line size={20} />
                </span>
                <h1>delete account</h1>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* header for mobile design */}
      <header className="fixed z-20 top-0 h-14 w-full bg-[#303553] md:hidden flex  justify-between items-center ">
        <div className="flex  justify-center items-center ">
          <Link
            to={"/"}
            className="bg-[#9884fc] rounded-tr-md rounded-br-md   w-14 h-14 flex items-center justify-center"
          >
            {" "}
            <FaFileInvoiceDollar size={30} className=" text-white  " />
          </Link>
        </div>
        <div className="flex  items-center gap-4 mr-2">
          <button onClick={toggleThemeMode}>
            {themeMode === "light" ? (
              <IoSunny size={25} className="text-gray-400" />
            ) : (
              <IoMoonSharp size={25} className="text-gray-400" />
            )}
          </button>
          {user ? (
            user.image ? (
              <img
                onClick={() => setShowModal(!showModal)}
                src={user.image}
                alt=""
                className="h-8 w-8 rounded-full cursor-pointer"
              />
            ) : (
              <h1
                onClick={() => setShowModal(!showModal)}
                className="cursor-pointer font-semibold sm:text-2xl text-1xl text-white"
              >
                {user.name}
              </h1>
            )
          ) : (
            <Link
              to={"/sign-in"}
              className="text-white py-1 px-2 rounded-lg font-semibold"
            >
              sign in
            </Link>
          )}
        </div>
        {showModal && (
          <div className="fixed right-2 top-16 bg-[#303553] z-10 p-3 rounded-md text-gray-400">
            <LiaTimesSolid
              size={20}
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-white"
            />
            <div className="flex flex-col gap-3 capitalize mt-6">
              <div
                onClick={handleSignOut}
                className="flex cursor-pointer p-1 items-center gap-1 hover:text-red-600 hover:bg-white rounded-md transition-all duration-300"
              >
                <span>
                  <PiSignOutBold size={20} />
                </span>
                <h1>sign out account</h1>
              </div>
              <div
                onClick={handleDelete}
                className="flex cursor-pointer p-1 items-center gap-1 hover:text-red-600 hover:bg-white rounded-md transition-all duration-300"
              >
                <span>
                  <RiDeleteBin6Line size={20} />
                </span>
                <h1>delete account</h1>
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  );
};

export default Header;
