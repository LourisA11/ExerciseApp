import express from "express"
import path from "path"
import usersController from "./controllers/users"
import userExerciseController from "./controllers/UserExercise"
import exerciseBankController from "./controllers/ExerciseBank"

const PORT = process.env.PORT ?? 3000
const SERVER = process.env.SERVER ?? "localhost"
const STATIC_DIR = process.env.STATIC_DIR ?? "client/dist"


const app = express()

//middleware
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*")
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PATCH,DELETE,OPTIONS")
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization")
    next()
}).use(express.json())

// Serve static files from the client/dist directory
app.use(express.static(path.join(__dirname, "../client/dist")))

    .use("/users", usersController)
    .use("/api/user-exercises", userExerciseController)
    .use("/api/exercise-bank", exerciseBankController)

// Handle SPA routing - send all other requests to index.html
app.all('/{*any}', (req, res) => {
  res.status(404).json({ isSuccess: false, message: 'Route not found' })
})

app.listen(PORT, () => {
    console.log(`Server is running on http://${SERVER}:${PORT}`)
})

console.log("Listening for requests...")
