import * as Glob from 'glob';
import * as Path from 'path';
import { ConvertFileStrOpts, convertFileSync } from './convert';

export function convertGlobSync(globPattern: string, opts?: Partial<ConvertFileStrOpts>) {
    // TODO: config

    const filePaths = Glob.sync(globPattern);
    for (let fp of filePaths) {
        fp = Path.resolve(fp);
        const ext = Path.extname(fp);
        const basename = Path.basename(fp, ext);
        const dirpath = Path.dirname(fp);
        convertFileSync(fp, Path.join(dirpath, basename + '.gen.ts'), opts);
    }
}