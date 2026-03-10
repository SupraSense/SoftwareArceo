import 'dotenv/config'
import express, { Request, Response } from 'express';
import cors from 'cors';
import { errorHandler } from './middleware/errorHandler';

// Routes
import tipoTareaRoutes from './routes/tipoTareaRoutes';
import authRoutes from './routes/authRoutes';
import clientRoutes from './routes/clientRoutes';
import personalRoutes from './routes/personalRoutes';
import userRoutes from './routes/userRoutes';

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

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/tipo-tarea', tipoTareaRoutes);
app.use('/api/clients', clientRoutes);
app.use('/api/personal', personalRoutes);
app.use('/api/users', userRoutes);

app.get('/', (_req: Request, res: Response) => {
    res.send('Hello world');
});

// Centralized error handler (must be LAST middleware)
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

export default app;
