import * as FS from 'fs';
import { joiJsModuleToTsTypesCode } from './joi-to-ts';
import { prettyFormat } from './pretty-format';

export type ConvertFileStrOpts = {
    prettyFmt: boolean,
};

export function convertFileStr(inputPath: string, opts?: Partial<ConvertFileStrOpts>): string {
    const {
        prettyFmt = true,
    } = opts || {};

    const inputModule = require(inputPath);

    let joiTypes = joiJsModuleToTsTypesCode(inputModule);
    if (prettyFmt) joiTypes = prettyFormat(joiTypes);

    const outputCode = [
        joiTypes
    ].join('\n\n');

    return outputCode;
}

export function convertFileSync(inputPath: string, outputPath: string, opts?: Partial<ConvertFileStrOpts>) {
    const outputCode = convertFileStr(inputPath, opts);
    FS.writeFileSync(outputPath, outputCode);
}
