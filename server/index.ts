import express from "express"
import session from "express-session"
import path from "path"
import usersController from "./controllers/users.js"
import userExerciseController from "./controllers/UserExercise.js"
import exerciseBankController from "./controllers/ExerciseBank.js"

const PORT = process.env.PORT ?? 3000
const SERVER = process.env.SERVER ?? "localhost"
const STATIC_DIR = process.env.STATIC_DIR ?? "client/dist"
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN ?? "http://localhost:5173"
const SESSION_SECRET = process.env.SESSION_SECRET ?? "dev-session-secret"
import { config } from "dotenv"
config()



const app = express()

//middleware
app.use((req, res, next) => {
  const origin = req.headers.origin
  if (!origin || origin === CLIENT_ORIGIN) {
    res.setHeader("Access-Control-Allow-Origin", origin ?? CLIENT_ORIGIN)
  }
  res.setHeader("Vary", "Origin")
  res.setHeader("Access-Control-Allow-Credentials", "true")
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PATCH,DELETE,OPTIONS")
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization")
  if (req.method === "OPTIONS") {
    res.status(204).end()
    return
  }
  next()
})

app.use(express.json())

app.use(
  session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 1000 * 60 * 60 * 24,
    },
  }),
)

// Serve static files from the client/dist directory
app.use(express.static(path.join(__dirname, "../client/dist")))

    .use("/users", usersController)
  .use("/api/users", usersController)
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
