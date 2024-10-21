import { useContext, useState } from "react";
import { GlobalContext } from "../context/createContext";
import { Link, useNavigate } from "react-router-dom";
import { MdErrorOutline } from "react-icons/md";
import { LiaTimesSolid } from "react-icons/lia";
import FileBase from "react-file-base64";

const SignUp = () => {
  const { themeMode } = useContext(GlobalContext);
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { value, id } = e.target;
    const formattedValue =
      id === "email" || id === "name" ? value.toLowerCase() : value;

    setFormData({ ...formData, [id]: formattedValue });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, password } = formData;
    if (!name || !email || !password) {
      setError("all fields are required");
      setTimeout(() => setError(null), 3000);
      return;
    }
    try {
      setLoading(true);
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!res.ok) {
        const errorData = await res.json();
        setError(errorData.message || "Signup failed");
        setLoading(false);
        return;
      }
      const data = await res.json();
      if (data.success === false) {
        setError(data.message);
        setLoading(false);

        setTimeout(() => setError(null), 3000);
        return;
      }
      navigate("/sign-in");
      setLoading(false);
      setError(null);
      setFormData({
        name: "",
        email: "",
        password: "",
      });
    } catch (error) {
      setError(error.message);
      setLoading(true);
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
            className={`text-center font-semibold text-2xl mb-4 capitalize ${
              themeMode === "light" ? "text-white" : "text-[#181D31]"
            }`}
          >
            sign up
          </h1>
          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-3 justify-center items-center "
          >
            <input
              className="p-2 w-80 border text-black border-gray-800 focus:outline-none rounded-md"
              type="text"
              autoComplete="off"
              placeholder="name"
              id="name"
              value={formData.name}
              onChange={handleChange}
            />
            <input
              className="p-2 w-80 border text-black border-gray-800 focus:outline-none rounded-md"
              type="text"
              autoComplete="off"
              placeholder="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
            />
            <input
              className="p-2 w-80 border text-black border-gray-800 focus:outline-none rounded-md"
              type="text"
              autoComplete="off"
              placeholder="password"
              id="password"
              value={formData.password}
              onChange={handleChange}
            />
            <div className="bg-[#303553] text-white">
              <FileBase
                type="file"
                multiple={false}
                onDone={({ base64 }) =>
                  setFormData({ ...formData, image: base64 })
                }
              />
            </div>
            <button
              disabled={loading}
              className="capitalize text-white w-80 text-1xl md:font-semibold font-normal bg-purple-700 p-2 rounded-md"
            >
              submit
            </button>
          </form>
          <p
            className={` flex justify-center gap-3 capitalize mt-4 text-gray-400`}
          >
            already have an account?{" "}
            <Link to={"/sign-in"} className="text-purple-700 cursor-pointer">
              sign in
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

export default SignUp;
