import { httpServer } from "./infrastructure/confiq/app";
import { connectDB } from "./infrastructure/confiq/connectDB";

const PORT = process.env.PORT || 3000

const startServer = async(): Promise<void> =>{
    
    await connectDB()
    const app = httpServer;

    app.listen(PORT, ()=>{
        console.log(`Server is running on port https://127.0.0.1:${PORT}`);
    });
}

startServer();