import express, { Request, Response } from 'express';
import cors from 'cors';
// Routes
import tipoTareaRoutes from './routes/tipoTareaRoutes';

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use('/api/tipo-tarea', tipoTareaRoutes);
app.get('/', (_req: Request, res: Response) => {
    res.send('Hello world');
});

// Error Handler for Auth
app.use((err: any, _req: Request, res: Response, next: express.NextFunction) => {
    if (err.name === 'UnauthorizedError') {
        res.status(401).json({ message: 'Invalid token or No authorization header' });
    } else {
        next(err);
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

export default app;
