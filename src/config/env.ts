import { z } from "zod";
import "dotenv/config";

const envSchema = z.object({
    PORT: z.string().default("3000"),
    DATABASE_URL: z.string().min(1, "database url is required in .env"),
    JWT_SECRET: z.string().min(10, "jwt_secret must be atleast 10 characters long")

});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
    console.error("Invalid environment variables", parsed.error.issues);
    process.exit(1);
}

export const env = parsed.data;
