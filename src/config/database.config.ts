import { registerAs } from "@nestjs/config";

export default registerAs("database", () => {
    const host = process.env.DATABASE_HOST || "127.0.0.1";
    const port = process.env.DATABASE_HOST || 27017;
    const name = process.env.DATABASE_NAME || "find_rest";
    const username = process.env.DATABASE_USER;
    const password = process.env.DATABASE_PASSWORD;

    return {
        uri: `mongodb://${host}:${port}/${name}`
    }
});