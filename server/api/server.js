import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 4000

app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'API Express funcionando correctamente en Vercel'
    })
})

app.get('/api', (req, res) => {
    res.json({ status: 'ok' })
})

// Endpoint con try/catch explícito
app.get('/api/data', async (req, res, next) => {
    try {
        const data = { id: 1, mensaje: 'Datos obtenidos correctamente' }

        if (!data) {
            const error = new Error('No se encontraron los datos requeridos')
            error.status = 404
            throw error
        }

        res.json(data)
    } catch (error) {
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

// Middleware Global de Manejo de Errores 
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

if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`Servidor ejecutándose en http://localhost:${PORT}`)
    })
}

export default app