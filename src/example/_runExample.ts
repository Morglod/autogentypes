import { convertGlobSync } from "../cli";

convertGlobSync('src/**/*.gen.js', {
    outputFilePath: (orig, prefer) => prefer.replace('.gen.ts', '.ts')
});
