import { authService } from "./services/auth.service.js";
import { pool } from "./config/db.js";

async function testRegister() {
    try {
        console.log("Testing authService.register...");
        const result = await authService.register({
            name: "Bhanu",
            email: "bhanu.developer@example.com",
            password: "supersecretpassword123"
        });
        console.log("REGISTER SUCCESS:", result);
    } catch (err) {
        console.error("REGISTER ERROR:", err);
    } finally {
        await pool.end();
    }
}

testRegister();
