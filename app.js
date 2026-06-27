require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const {isLoggedIn} = require("./middleware");
const authRoutes = require("./routes/auth.routes");
const userRoutes = require("./routes/user.routes");

const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect(process.env.MONGO_URL)
    .then(() => console.log("Database connected successfully"))
    .catch((err) => console.log(err));



app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);


app.get('/', (req, res) => {
    res.json({ message: "Welcome to the Civic Trace API" });
});





app.get("/api/protected", isLoggedIn, (req,res)=>{
    res.json({message:"You are protected"})
})


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
