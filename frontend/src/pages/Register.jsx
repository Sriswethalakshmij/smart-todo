import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserPlus, Eye, EyeOff, CheckSquare } from "lucide-react";
import api from "../services/api";
import ThemeToggle from "../components/ThemeToggle";

function Register() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!username.trim() || !email.trim() || !password) {
      setError("Please fill in all fields.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    try {
      setLoading(true);

      const response = await api.post(
       "/controllers/register.php",
        {
          username: username.trim(),
          email: email.trim(),
          password: password
        }
      );

      if (response.data.success) {
        setSuccess(
          "Account created successfully. Redirecting to login..."
        );

        setTimeout(() => {
          navigate("/login");
        }, 1200);
      } else {
        setError(
          response.data.message || "Registration failed."
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

          <p className="auth-label">
            GET STARTED
          </p>

          <h1>
            Make your
            <br />
            <span>move.</span>
          </h1>

          <p className="auth-description">
            Create your account and start turning
            everyday plans into completed goals.
          </p>

        </div>

        <form onSubmit={handleRegister}>

          <div className="form-group">

            <label>
              Username
            </label>

            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Choose a username"
              autoComplete="username"
            />

          </div>

          <div className="form-group">

            <label>
              Email
            </label>

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              autoComplete="email"
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
                placeholder="Create a password"
                autoComplete="new-password"
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
                {showPassword ? (
                  <EyeOff size={19} />
                ) : (
                  <Eye size={19} />
                )}
              </button>

            </div>

          </div>

          {error && (
            <div className="auth-error">
              {error}
            </div>
          )}

          {success && (
            <div className="auth-success">
              {success}
            </div>
          )}

          <button
            type="submit"
            className="auth-button"
            disabled={loading}
          >
            {loading ? (
              "Creating account..."
            ) : (
              <>
                Create Account
                <UserPlus size={19} />
              </>
            )}
          </button>

        </form>

        <div className="auth-footer">

          <span>
            Already have an account?
          </span>

          <Link to="/login">
            Sign in
          </Link>

        </div>

      </div>

    </div>
  );
}

export default Register;