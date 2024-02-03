import { registerAs } from "@nestjs/config";

export default registerAs("database", () => {
    const host = process.env.DATABASE_HOST;
    const port = process.env.DATABASE_PORT;
    const name = process.env.DATABASE_NAME;
    const username = process.env.DATABASE_USER;
    const password = process.env.DATABASE_PASSWORD;

    return {
        uri: `mongodb://${host}:${port}/${name}`
    }
});