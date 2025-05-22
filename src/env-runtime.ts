import { parseEnv } from "@/env";
import { config } from "dotenv";
config();

export default parseEnv(Object.assign(process.env));
