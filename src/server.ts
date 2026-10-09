import app from "./app.js";
import { env } from "./config/env.js";

const PORT = env.PORT;
app.listen(PORT, () => {
    console.log(`🚀 TaskForge API server running on http://localhost:${PORT}`);
    console.log(`📡 Health check: http://localhost:${PORT}/health`);
    console.log(`🔐 Auth routes: http://localhost:${PORT}/api/auth`);
});
