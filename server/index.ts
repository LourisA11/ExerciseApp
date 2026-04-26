import express from "express"
import path from "path"
import { config } from "dotenv"
config()


const PORT = 3000
const SERVER = "localhost"

const app = express()

app.use(express.static(path.join(__dirname, "../client/dist")))



   

// Handle SPA routing - send all other requests to index.html
app.get(/.*/, (_req, res) => {
    res.sendFile(path.join(__dirname, "../client/dist/index.html"))
})

app.listen(PORT, () => {
    console.log(`Server is running on http://${SERVER}:${PORT}`)
})

console.log("Listening for requests...")

