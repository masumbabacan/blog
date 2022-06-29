require('dotenv').config();
require("express-async-errors");

const express = require("express");
const app = express();

//rest of the package
const morgan = require("morgan");

//database
const connectDB = require("./db/connect");


//routers
const authRouter = require("./routes/authRoutes");


//middleware
const notFoundMiddleware = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/error-handler");

app.use(morgan("tiny"));
app.use(express.json());

//apples
app.use("/api/v1/auth",authRouter);


app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);





const port = process.env.PORT || 3000;

const start = async (req,res) => {
    try {
        await connectDB(process.env.MONGO_URL);
        app.listen(port,console.log(`Server ${port} portunda başlatıldı`));
    } catch (error) {
        console.log(error);
    }
}
start();