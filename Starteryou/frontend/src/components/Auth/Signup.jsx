import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useUserContext } from "../../context/UserContext";
import { API_CONFIG } from "../../config/api";
import axios from "axios";

const Signup = () => {
  const { loginUser } = useUserContext();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        `${API_CONFIG.baseURL}${API_CONFIG.endpoints.userLogin}`,
        {
          email,
          password,
        }
      );
      loginUser({ authenticatedUser: data.users, token: data.tokens.accessToken });
      toast.success(data.msg);
      navigate("/jobfeeds");
    } catch (error) {
      setError(error.response.data.msg);
      toast.error(error.response.data.msg);
      console.log("Failed", error.response.data.error);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-blue-500">
      <div className="text-center p-6 ">
        <form
          onSubmit={handleLogin}
          className="form-styling space-y-4 flex flex-col"
        >
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="input-fields"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="input-fields"
          />
          {error && <p className="display-error">{error}</p>}
          <button type="submit" className="ui-btn ui-wb w-[360px]">
            <span>Login</span>
          </button>
          <button className="ui-btn ui-wob">
            <span>Close</span>
          </button>
        </form>
      </div>
    </div>
  );
};

export default Signup;
