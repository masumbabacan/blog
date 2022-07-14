require('dotenv').config();
require("express-async-errors");

const express = require("express");
const app = express();

//rest of the package
const morgan = require("morgan");
const cookieParser = require("cookie-parser");

//database
const connectDB = require("./db/connect");

//allow origin
app.use(function (req, res, next) {
    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3001');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
    // Request headers you wish to allow
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);
    // Pass to next layer of middleware
    res.header('Content-Type', 'application/json;charset=UTF-8')

    next();
});

//routers
const authRouter = require("./routes/authRoutes");
const userRouter = require("./routes/userRoutes");
const blogRouter = require("./routes/blogRoutes");


//middleware
const notFoundMiddleware = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/error-handler");

app.use(morgan("tiny"));
app.use(express.json());
app.use(cookieParser(process.env.JWT_SECRET));

//apples
app.use("/api/v1/auth",authRouter);
app.use("/api/v1/users",userRouter);
app.use("/api/v1/blogs",blogRouter);


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