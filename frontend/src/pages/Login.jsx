import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LogIn, Eye, EyeOff, CheckSquare } from "lucide-react";
import api from "../services/api";
import ThemeToggle from "../components/ThemeToggle";
function Login() {
  const navigate = useNavigate();

  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    setError("");

    if (!login.trim() || !password) {
      setError("Please enter your login details.");
      return;
    }

    try {
      setLoading(true);

      const response = await api.post(
        "/controllers/login.php",
        {
          login: login.trim(),
          password: password
        }
      );

      if (response.data.success) {
        localStorage.setItem(
          "smart_todo_token",
          response.data.token
        );

        localStorage.setItem(
          "smart_todo_user",
          JSON.stringify(response.data.user)
        );

        navigate("/dashboard");
      } else {
        setError(
          response.data.message || "Login failed."
        );
      }

    } catch (error) {

      console.error(error);

      setError(
        error.response?.data?.message ||
        "Unable to connect to the server."
      );

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <ThemeToggle />

      <div className="auth-card">

        <div className="auth-logo">
          <div className="logo-icon">
            <CheckSquare size={26} />
          </div>

          <span>SMART TODO</span>
        </div>

        <div className="auth-heading">
          <p className="auth-label">WELCOME BACK</p>

          <h1>
            Get things
            <br />
            <span>done.</span>
          </h1>

          <p className="auth-description">
            Sign in to continue managing your tasks,
            plans and everyday goals.
          </p>
        </div>

        <form onSubmit={handleLogin}>

          <div className="form-group">

            <label>
              Username or Email
            </label>

            <input
              type="text"
              value={login}
              onChange={(e) => setLogin(e.target.value)}
              placeholder="Enter your username or email"
              autoComplete="username"
            />

          </div>

          <div className="form-group">

            <label>
              Password
            </label>

            <div className="password-wrapper">

              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                autoComplete="current-password"
              />

              <button
                type="button"
                className="password-toggle"
                onClick={() =>
                  setShowPassword(!showPassword)
                }
                aria-label={
                  showPassword
                    ? "Hide password"
                    : "Show password"
                }
              >
                {showPassword
                  ? <EyeOff size={19} />
                  : <Eye size={19} />
                }
              </button>

            </div>

          </div>

          {error && (
            <div className="auth-error">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="auth-button"
            disabled={loading}
          >
            {loading ? (
              "Signing in..."
            ) : (
              <>
                Sign In
                <LogIn size={19} />
              </>
            )}
          </button>

        </form>

        <div className="auth-footer">
          <span>
            Don't have an account?
          </span>

          <Link to="/register">
            Create one
          </Link>
        </div>

      </div>

    </div>
  );
}

export default Login;