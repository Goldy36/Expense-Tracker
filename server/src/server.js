import app from './app.js';
import connectDB from './config/db.js';

const PORT = process.env.PORT || 5000;

// Connect Database and start Express Server
const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`====================================================`);
      console.log(`[ExpenseFlow Server] Running on http://localhost:${PORT}`);
      console.log(`[API Environment] ${process.env.NODE_ENV || 'development'}`);
      console.log(`====================================================`);
    });
  } catch (error) {
    console.error('[Server Startup Error]', error.message);
  }
};

startServer();
