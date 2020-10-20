import * as Glob from 'glob';
import * as Path from 'path';
import { ConvertFileStrOpts, convertFileSync } from './convert';

export type ConvertGlobSyncOpts = {
    outputFilePath?: (originalFilePath: string, preferedFilePath: string) => string,
};

export function convertGlobSync(globPattern: string, opts?: Partial<ConvertFileStrOpts & ConvertGlobSyncOpts>) {
    const preferFilePath = (originalFilePath: string) => {
        const ext = Path.extname(originalFilePath);
        const basename = Path.basename(originalFilePath, ext);
        const dirpath = Path.dirname(originalFilePath);
        return Path.join(dirpath, basename + '.ts');
    };

    const {
        outputFilePath = preferFilePath,
        ...restOpts
    } = opts || {};

    const filePaths = Glob.sync(globPattern);
    for (let fp of filePaths) {
        fp = Path.resolve(fp);
        const outputPath = preferFilePath !== outputFilePath ? outputFilePath(fp, preferFilePath(fp)) : preferFilePath(fp);
        convertFileSync(fp, outputPath, restOpts);
    }
}