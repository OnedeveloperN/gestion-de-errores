import React, { useState, useEffect } from 'react'
import './App.css'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api'

export default function App() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Función asíncrona con try / catch
  async function fetchData(endpoint = '/data') {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch(`${API_URL}${endpoint}`)

      // Verificamos si la respuesta HTTP no fue ok (ej. status 400, 404, 500)
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error?.message || `Error HTTP: ${response.status}`)
      }

      const result = await response.json()
      setData(result)
    } catch (err) {
      console.error('Error al realizar la petición:', err.message)
      setError(err.message)
      setData(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData('/data')
  }, [])

  return (
    <div className="container">
      <header className="header">
        <h1>Gestión de Errores - React & Express</h1>
      </header>

      <main className="content">
        <div className="button-group">
          <button onClick={() => fetchData('/data')} className="btn">
            Petición Exitosa (200)
          </button>
          <button onClick={() => fetchData('/error-test')} className="btn btn-outline">
            Probar Error Servidor (500)
          </button>
          <button onClick={() => fetchData('/ruta-inexistente')} className="btn btn-outline">
            Probar Ruta Inexistente (404)
          </button>
        </div>

        <section className="card">
          {loading && <p className="status-text">Cargando...</p>}

          {error && (
            <div className="error-box">
              <span className="error-title">Error Detectado:</span>
              <p>{error}</p>
            </div>
          )}

          {!loading && !error && data && (
            <div className="success-box">
              <p><strong>Respuesta del Servidor:</strong></p>
              <pre>{JSON.stringify(data, null, 2)}</pre>
            </div>
          )}
        </section>
      </main>
    </div>
  )
}