"use client"

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../../contexts/AuthContext"
import "./Login.css"

const Login_SignUp = () => {
  const [loginData, setLoginData] = useState({ identifier: "", password: "" })
  const [registerData, setRegisterData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    referralCode: "",
  })

  const [isLoginMode, setIsLoginMode] = useState(true)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const auth = useAuth()
  const navigate = useNavigate()

  const handleLoginChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value })
    setError("")
  }

  const handleRegisterChange = (e) => {
    setRegisterData({ ...registerData, [e.target.name]: e.target.value })
    setError("")
  }

  const handleLoginSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    try {
      const result = await auth.login(loginData.identifier, loginData.password)
      if (result.success) {
        navigate("/admin/dashboard")
      } else {
        setError(result.error)
      }
    } catch (err) {
      setError(err.message || "Login failed")
    } finally {
      setLoading(false)
    }
  }

  const handleRegisterSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    try {
      if (registerData.password !== registerData.confirmPassword) {
        throw new Error("Passwords do not match")
      }
      const result = await auth.register(
        registerData.username,
        registerData.email,
        registerData.password,
        registerData.referralCode,
      )
      if (result.success) {
        navigate("/admin/dashboard")
      } else {
        setError(result.error)
      }
    } catch (err) {
      setError(err.message || "Registration failed")
    } finally {
      setLoading(false)
    }
  }

  // Robust social login: works whether REACT_APP_API_URL includes "/api" or not.
  const handleSocialLogin = (provider) => {
    const base = (process.env.REACT_APP_API_URL || "http://localhost:5000").replace(/\/+$/, "")
    const origin = base.endsWith("/api") ? base.replace(/\/api$/, "") : base
    window.location.href = `${origin}/auth/${provider}`
  }

  return (
    <div className="auth-page-wrapper">
      <div
        className={`auth-container ${!isLoginMode ? "right-panel-active" : ""}`}
        aria-live="polite"
        aria-busy={loading ? "true" : "false"}
      >
        {/* Mobile Toggle */}
        <div className="mobile-toggle" role="tablist" aria-label="Authentication mode">
          <button
            type="button"
            role="tab"
            aria-selected={isLoginMode ? "true" : "false"}
            className={`mobile-toggle-btn ${isLoginMode ? "active" : ""}`}
            onClick={() => setIsLoginMode(true)}
          >
            Sign In
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={!isLoginMode ? "true" : "false"}
            className={`mobile-toggle-btn ${!isLoginMode ? "active" : ""}`}
            onClick={() => setIsLoginMode(false)}
          >
            Sign Up
          </button>
        </div>

        {/* Sign Up */}
        <div className="form-panel sign-up-container">
          <form className="auth-form" onSubmit={handleRegisterSubmit} noValidate>
            <h3 className="form-title">Create Account</h3>

            <div className="social-container" aria-label="Sign up with">
              <button type="button" className="social-icon" onClick={() => handleSocialLogin("google")} aria-label="Google">
                <i className="fab fa-google" aria-hidden="true"></i>
              </button>
              <button type="button" className="social-icon" onClick={() => handleSocialLogin("facebook")} aria-label="Facebook">
                <i className="fab fa-facebook-f" aria-hidden="true"></i>
              </button>
              <button type="button" className="social-icon" onClick={() => handleSocialLogin("linkedin")} aria-label="LinkedIn">
                <i className="fab fa-linkedin-in" aria-hidden="true"></i>
              </button>
            </div>

            <span className="form-subtitle">or use your email for registration</span>

            <label className="sr-only" htmlFor="reg-username">Username</label>
            <input
              id="reg-username"
              type="text"
              placeholder="Username"
              name="username"
              value={registerData.username}
              onChange={handleRegisterChange}
              className="auth-input"
              autoComplete="username"
              required
            />

            <label className="sr-only" htmlFor="reg-email">Email</label>
            <input
              id="reg-email"
              type="email"
              placeholder="Email"
              name="email"
              value={registerData.email}
              onChange={handleRegisterChange}
              className="auth-input"
              autoComplete="email"
              required
            />

            <label className="sr-only" htmlFor="reg-password">Password</label>
            <input
              id="reg-password"
              type="password"
              placeholder="Password"
              name="password"
              value={registerData.password}
              onChange={handleRegisterChange}
              className="auth-input"
              autoComplete="new-password"
              required
              minLength={6}
            />

            <label className="sr-only" htmlFor="reg-confirm">Confirm Password</label>
            <input
              id="reg-confirm"
              type="password"
              placeholder="Confirm Password"
              name="confirmPassword"
              value={registerData.confirmPassword}
              onChange={handleRegisterChange}
              className="auth-input"
              autoComplete="new-password"
              required
              minLength={6}
            />

            <label className="sr-only" htmlFor="reg-referral">Referral Code</label>
            <input
              id="reg-referral"
              type="text"
              placeholder="Referral Code (Optional)"
              name="referralCode"
              value={registerData.referralCode}
              onChange={handleRegisterChange}
              className="auth-input"
              autoComplete="off"
            />

            <button type="submit" className="auth-button" disabled={loading} aria-busy={loading ? "true" : "false"}>
              {loading ? (
                <>
                  <i className="fas fa-spinner fa-spin me-2" aria-hidden="true"></i>
                  <span role="status">Creating Account...</span>
                </>
              ) : (
                "Sign Up"
              )}
            </button>

            {error && <p className="error-message" role="alert">{error}</p>}
          </form>
        </div>

        {/* Sign In */}
        <div className="form-panel sign-in-container">
          <form className="auth-form" onSubmit={handleLoginSubmit} noValidate>
            <h3 className="form-title">Sign in</h3>

            <div className="social-container" aria-label="Sign in with">
              <button type="button" className="social-icon" onClick={() => handleSocialLogin("google")} aria-label="Google">
                <i className="fab fa-google" aria-hidden="true"></i>
              </button>
              <button type="button" className="social-icon" onClick={() => handleSocialLogin("facebook")} aria-label="Facebook">
                <i className="fab fa-facebook-f" aria-hidden="true"></i>
              </button>
              <button type="button" className="social-icon" onClick={() => handleSocialLogin("linkedin")} aria-label="LinkedIn">
                <i className="fab fa-linkedin-in" aria-hidden="true"></i>
              </button>
            </div>

            <span className="form-subtitle">or use your account</span>

            <label className="sr-only" htmlFor="login-id">Username or Email</label>
            <input
              id="login-id"
              type="text"
              placeholder="Username or Email"
              name="identifier"
              value={loginData.identifier}
              onChange={handleLoginChange}
              className="auth-input"
              autoComplete="username"
              required
            />

            <label className="sr-only" htmlFor="login-password">Password</label>
            <input
              id="login-password"
              type="password"
              placeholder="Password"
              name="password"
              value={loginData.password}
              onChange={handleLoginChange}
              className="auth-input"
              autoComplete="current-password"
              required
            />

            <Link to="/forgot-password" className="forgot-password-link">Forgot your password?</Link>

            <button type="submit" className="auth-button" disabled={loading} aria-busy={loading ? "true" : "false"}>
              {loading ? (
                <>
                  <i className="fas fa-spinner fa-spin me-2" aria-hidden="true"></i>
                  <span role="status">Authenticating...</span>
                </>
              ) : (
                "Sign In"
              )}
            </button>

            {error && <p className="error-message" role="alert">{error}</p>}
          </form>
        </div>

        {/* Overlay */}
        <div className="overlay-container" aria-hidden={true}>
          <div className="overlay">
            <div className="overlay-panel overlay-left">
              <h1 className="overlay-title">Welcome Back!</h1>
              <p className="overlay-text">To keep connected with us please login with your personal info</p>
              <button className="auth-button ghost" onClick={() => setIsLoginMode(true)}>Sign In</button>
            </div>
            <div className="overlay-panel overlay-right">
              <h1 className="overlay-title">Hello, Friend!</h1>
              <p className="overlay-text">Enter your personal details and start journey with us</p>
              <button className="auth-button ghost" onClick={() => setIsLoginMode(false)}>Sign Up</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login_SignUp
