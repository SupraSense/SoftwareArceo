import express, { Request, Response } from 'express';
import cors from 'cors';
// Routes
import tipoTareaRoutes from './routes/tipoTareaRoutes';
import authRoutes from './routes/authRoutes';
import clientRoutes from './routes/clientRoutes';

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(require('cookie-parser')());


app.use('/api/auth', authRoutes);
app.use('/api/tipo-tarea', tipoTareaRoutes);
app.use('/api/clients', clientRoutes);
app.get('/', (_req: Request, res: Response) => {
    res.send('Hello world');
});

// Error Handler for Auth
app.use((err: any, _req: Request, res: Response, next: express.NextFunction) => {
    if (err.name === 'UnauthorizedError') {
        res.status(401).json({ message: 'Invalid token or No authorization header' });
    } else if (err.code === 'P2002') {
        res.status(400).json({ message: 'El CUIT ingresado ya existe.' });
    } else {
        next(err);
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

export default app;
