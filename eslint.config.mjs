import type { Config } from "eslint/config";
import next from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const config: Config[] = [...next, ...nextTs];
export default config;
