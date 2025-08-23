"use client"

import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"

const ShortUrlRedirect = () => {
  const { shortCode } = useParams()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000"

  useEffect(() => {
    const redirectToUrl = async () => {
      try {
        // First try to resolve the short URL through the API
        const response = await fetch(`${API_BASE_URL}/api/resolve/${shortCode}`)
        
        if (response.ok) {
          const data = await response.json()
          if (data.originalUrl) {
            // Redirect to the original URL
            window.location.href = data.originalUrl
            return
          }
        }
        
        // If not found via API, try the direct redirect endpoint
        window.location.href = `${API_BASE_URL}/${shortCode}`
      } catch (err) {
        setError("Failed to redirect")
        setLoading(false)
      }
    }

    if (shortCode) {
      redirectToUrl()
    }
  }, [shortCode, API_BASE_URL])

  if (loading) {
    return (
      <div style={{ textAlign: "center", marginTop: "100px" }}>
        <h2>Redirecting...</h2>
        <p>Please wait while we redirect you to your destination.</p>
      </div>
    )
  }

  if (error) {
    return (
      <div style={{ textAlign: "center", marginTop: "100px" }}>
        <h2>Error</h2>
        <p>{error}</p>
        <button onClick={() => (window.location.href = "/")}>Go to Homepage</button>
      </div>
    )
  }

  return null
}

export default ShortUrlRedirect