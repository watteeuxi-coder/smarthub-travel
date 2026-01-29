import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import apiRoutes from './routes/api.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api', apiRoutes);

// Health check
app.get('/health', (req, res) => {
    res.json({
        status: 'ok',
        service: 'SmartHub Travel API',
        version: '1.0.0',
        timestamp: new Date().toISOString()
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        error: 'Endpoint not found'
    });
});

// Error handler
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({
        success: false,
        error: 'Internal server error'
    });
});

// Start server
if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
    app.listen(PORT, () => {
        console.log(`
╔═══════════════════════════════════════════════════╗
║                                                   ║
║   🛫 SmartHub Travel API Server                   ║
║                                                   ║
║   Running on: http://localhost:${PORT}             ║
║                                                   ║
║   Endpoints:                                      ║
║   • GET /api/airports      - All airports         ║
║   • GET /api/hubs          - Hub airports         ║
║   • GET /api/hubs/ranked   - Ranked hubs          ║
║   • GET /api/hub/:id       - Hub details          ║
║   • GET /api/routes        - All routes           ║
║   • GET /api/search        - Search routes        ║
║   • GET /api/compare       - Compare prices       ║
║   • GET /health            - Health check         ║
║                                                   ║
╚═══════════════════════════════════════════════════╝
      `);
    });
}

export default app;
