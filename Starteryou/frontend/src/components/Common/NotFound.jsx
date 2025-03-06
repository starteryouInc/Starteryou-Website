import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen text-center">
      <h1 className="text-4xl font-extrabold">Oops!</h1>
      <p className="text-lg text-black mt-2">
        The page you are looking for cannot be found.
      </p>
      <img
        src="/notfound.svg"
        alt="Not Found"
        className="w-[400px] h-80 mt-6"
      />
      <Link
        to="/"
        className="mt-10 flex items-center gap-2 px-6 py-3 text-white text-lg font-medium rounded-md bg-[#7950F2] hover:bg-[#6A44D9] transition"
      >
        <img src="/notarrow.svg" alt="Home Icon" className="w-6 h-6" />
        Go to Home
      </Link>
    </div>
  );
};

export default NotFound;
