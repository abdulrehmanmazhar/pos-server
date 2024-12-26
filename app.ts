require("dotenv").config();
import express, { Request, Response, NextFunction } from "express";
export const app = express();
import cors from "cors";
import cookieParser from "cookie-parser";
import { errorMiddleware } from "./middleware/error";
import userRouter from "./routes/user.route";
import customerRouter from "./routes/customer.route"
import productRouter from "./routes/product.route"
import orderRouter from "./routes/order.route"
import transactionRouter from "./routes/transaction.route"
import analyticsRouter from "./routes/analytics.route"
import { PDFgenerator } from "./utils/puppeteer";
import path from "path"

// body parser
app.use(express.json({ limit: "50kb" }));

// cookie parser
app.use(cookieParser());

// cors
app.use(cors({
    origin: (origin, callback) => {
        console.log(origin)
      // Allow all origins dynamically
      callback(null, origin || '*');
    },
    credentials: true, // Enable credentials
  }));

app.use("/api/v1", userRouter);
app.use("/api/v1", customerRouter);
app.use("/api/v1", productRouter);
app.use("/api/v1", orderRouter);
app.use("/api/v1", transactionRouter);
app.use("/api/v1", analyticsRouter);

// Route to serve specific bill files
app.get('/api/v1/bills/:filename', (req, res) => {
    const filename = req.params.filename; 
    const filePath = path.join(__dirname, 'public/bills', filename);

    // Serve the file
    res.sendFile(filePath, (err) => {
        if (err) {
            console.error(err);
            res.status(404).send('File not found');
        }
    });
});

app.get("/test", PDFgenerator);

// unknown route 
app.all("*", (req: Request, res: Response, next: NextFunction) => {
    const err = new Error(`Can't find ${req.originalUrl} on this server`) as any;
    err.statusCode = 404;
    next(err);
});

app.use(errorMiddleware);
