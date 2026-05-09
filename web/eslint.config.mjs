import nextVitals from "eslint-config-next/core-web-vitals";
import nextTypeScript from "eslint-config-next/typescript";

const eslintConfig = [
  ...nextVitals,
  ...nextTypeScript,
  {
    ignores: [".next/**", "node_modules/**", "convex/_generated/**"]
  }
];

export default eslintConfig;
