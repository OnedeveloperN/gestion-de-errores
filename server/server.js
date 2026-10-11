import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 4000

app.use(cors())
app.use(express.json())

// Ejemplo de Endpoint con try/catch explícito
app.get('/api/data', async (req, res, next) => {
    try {
        // Simulación de búsqueda o lógica de negocio
        const data = { id: 1, mensaje: 'Datos obtenidos correctamente' }

        if (!data) {
            const error = new Error('No se encontraron los datos requeridos')
            error.status = 404
            throw error
        }

        res.json(data)
    } catch (error) {
        // Pasamos el error al middleware global
        next(error)
    }
})

// Endpoint para probar fallo del servidor
app.get('/api/error-test', (req, res, next) => {
    try {
        throw new Error('Error simulado en el servidor')
    } catch (error) {
        next(error)
    }
})

// Middleware 404 para rutas no existentes
app.use((req, res, next) => {
    res.status(404).json({
        success: false,
        message: 'Ruta no encontrada'
    })
})

// Middleware Global de Manejo de Errores (Express)
app.use((err, req, res, next) => {
    console.error(`[SERVER ERROR]: ${err.message}`)
    const statusCode = err.status || 500

    res.status(statusCode).json({
        success: false,
        error: {
            message: err.message || 'Error interno del servidor',
            status: statusCode
        }
    })
})

app.listen(PORT, () => {
    console.log(`Servidor ejecutándose en http://localhost:${PORT}`)
})