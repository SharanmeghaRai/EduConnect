import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import { ENV } from './config/env.js';
import apiRouter from './routes/index.js';
import { errorHandler } from './middleware/errorHandler.js';

export const app = express();

// Security Headers
app.use(
  helmet({
    contentSecurityPolicy: false, // allow flexible dev assets & font loads
    crossOriginEmbedderPolicy: false,
  })
);

// CORS configuration
app.use(
  cors({
    origin: [ENV.CLIENT_URL, 'http://localhost:5173', 'http://127.0.0.1:5173'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  })
);

// Request Parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// HTTP Request Logging
if (ENV.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// Rate Limiting (100 requests per 15 minutes for standard routes)
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: {
      code: 'TOO_MANY_REQUESTS',
      message: 'Too many requests from this IP, please try again after 15 minutes.',
    },
  },
});
app.use('/api', globalLimiter);

import path from 'path';
import fs from 'fs';

const sahyadriDir = fs.existsSync(path.resolve(process.cwd(), 'sahyari aptitude'))
  ? path.resolve(process.cwd(), 'sahyari aptitude')
  : fs.existsSync(path.resolve(process.cwd(), '../sahyari aptitude'))
  ? path.resolve(process.cwd(), '../sahyari aptitude')
  : 'd:\\EduConnect\\sahyari aptitude';

// Serve Sahyadri Aptitude Reference PDFs statically
app.use('/reference-materials', express.static(sahyadriDir));
app.use('/api/reference-materials', express.static(sahyadriDir));

// Endpoint to list all Sahyadri reference material PDFs
app.get('/api/reference-resources', (req, res) => {
  try {
    if (!fs.existsSync(sahyadriDir)) {
      return res.status(200).json({ success: true, data: { resources: [] } });
    }
    const files = fs.readdirSync(sahyadriDir).filter((f) => f.endsWith('.pdf'));
    const resources = files.map((file) => {
      const stats = fs.statSync(path.join(sahyadriDir, file));
      const company = file.split('_')[0];
      const testName = file.replace('.pdf', '').replace(/_/g, ' ');
      return {
        id: file,
        title: `${company} Placement Aptitude Paper (${testName})`,
        filename: file,
        company,
        size: `${(stats.size / 1024).toFixed(1)} KB`,
        category: 'Sahyadri Aptitude Archive',
        url: `/reference-materials/${file}`,
      };
    });
    return res.status(200).json({ success: true, data: { resources } });
  } catch (err) {
    return res.status(500).json({ success: false, error: { message: 'Failed to read reference materials' } });
  }
});

// Mount API Master Routers
app.use('/api/v1', apiRouter);
app.use('/api', apiRouter); // Alias for convenience

// Root endpoint info
app.get('/', (req, res) => {
  res.status(200).json({
    name: 'EduConnect Campus Placement Preparation Portal',
    tier: 'Tier 2 Application & Logic Layer',
    status: 'ONLINE',
    docs: '/api/v1/health',
  });
});

// Centralized Error Handling
app.use(errorHandler);
