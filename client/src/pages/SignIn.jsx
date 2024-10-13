import { useContext, useState } from "react";
import { GlobalContext } from "../context/createContext";
import { Link, useNavigate } from "react-router-dom";
import { MdErrorOutline } from "react-icons/md";
import { LiaTimesSolid } from "react-icons/lia";

const SignIn = () => {
  const { themeMode, signInUser } = useContext(GlobalContext);
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({ email: "", password: "" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, password } = formData;

    // Check for empty fields
    if (!email || !password) {
      setError("All fields are required");
      setTimeout(() => setError(null), 3000);
      return; // Return early to prevent further execution
    }

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      // Handle unsuccessful response
      if (!res.ok) {
        const errorData = await res.json(); // await parsing of error response
        setError(errorData.message || "Sign in failed");
        setFormData({ email: "", password: "" }); // Reset the form

        setTimeout(() => setError(null), 3000);
        return;
      }

      // Parse the success response
      const data = await res.json();

      if (data.success === false) {
        setError(data.message);
        setTimeout(() => setError(null), 3000);
        return;
      }

      // Handle successful login
      signInUser(data.user); // Update the user context with signed-in user data
      navigate("/"); // Redirect user after sign-in
      setError(null); // Clear errors
      setFormData({ email: "", password: "" }); // Reset the form
    } catch (error) {
      setError("Network error: " + error.message);
    }
  };

  return (
    <div
      className={`min-h-screen  ${
        themeMode === "light" ? "bg-[#181D31]" : "bg-white"
      }`}
    >
      <div className="max-w-6xl mx-auto  ">
        <div className="px-2 md:py-10 py-32">
          <h1
            className={`text-center font-semibold text-2xl mb-4 ${
              themeMode === "light" ? "text-white" : "text-[#181D31]"
            }`}
          >
            sign in
          </h1>
          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-3 justify-center items-center "
          >
            <input
              className="p-2 w-80 border border-gray-800 focus:outline-none rounded-md"
              type="text"
              autoComplete="off"
              id="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="email"
            />
            <input
              className="p-2 w-80 border border-gray-800 focus:outline-none rounded-md"
              type="text"
              autoComplete="off"
              id="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="password"
            />
            <button className="capitalize text-white w-80 text-1xl md:font-semibold font-normal bg-purple-700 p-2 rounded-md">
              submit
            </button>
          </form>
          <p
            className={` flex justify-center gap-3 capitalize mt-4 text-gray-400`}
          >
            don't have an account?{" "}
            <Link to={"/sign-up"} className="text-purple-700 cursor-pointer">
              sign up
            </Link>
          </p>
          {error && (
            <p className="flex items-center justify-between text-nowrap text-[15px] bg-red-100 text-red-600 rounded-md p-2">
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

export default SignIn;
