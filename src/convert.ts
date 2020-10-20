import * as FS from 'fs';
import { InFileConfig } from './in-file-config';
import { prettyFormat } from './pretty-format';

export type ConvertFromVariants = 'joi';
export type ConvertToVariants = 'ts' | 'schema4';

export type ConvertFileStrOpts = {
    prettyFmt: boolean,
    convertMode: 'append' | 'export',
    convertFrom: ConvertFromVariants[] | ConvertFromVariants,
    convertTo: ConvertToVariants[] | ConvertToVariants,
};

export function convertFileStr(inputPath: string, opts?: Partial<ConvertFileStrOpts & InFileConfig>): string {
    let {
        prettyFmt = true,
        convertMode = 'append',
        convertFrom = [ 'joi' ],
        convertTo = [ 'ts', 'schema4' ],
    } = opts || {};

    if (typeof convertFrom === 'string') convertFrom = [ convertFrom ];
    if (typeof convertTo === 'string') convertTo = [ convertTo ];

    const inputModule = require(inputPath);
    let appendTo = '';

    if (convertMode === 'append') {
        appendTo = FS.readFileSync(inputPath, 'utf8');
    }

    const outputResults = [
        appendTo,
    ];

    if (convertFrom.includes('joi') && convertTo.includes('ts')) {
        // lazy import coz of optional dependencies
        const jtot = require('./joi-to-ts/joi-to-ts');
        const result = jtot.joiJsModuleToTsTypesCode(inputModule, opts);
        if (result.warningMessages) {
            console.warn(result.warningMessages.join('\n'));
        }
    
        let joiTypes = result.outputCode;
        if (prettyFmt) joiTypes = prettyFormat(joiTypes);

        outputResults.push(joiTypes);
    }

    if (convertFrom.includes('joi') && convertTo.includes('schema4')) {
        // lazy import coz of optional dependencies
        const jtoschema = require('./joi-to-schema4');
        const result = jtoschema.joiJsModuleToSchema4Code(inputModule, opts);
        if (result.warningMessages) {
            console.warn(result.warningMessages.join('\n'));
        }
    
        let joiTypes = result.outputCode;
        if (prettyFmt) joiTypes = prettyFormat(joiTypes);

        outputResults.push(joiTypes);
    }

    const outputCode = outputResults.join('\n\n');

    return outputCode;
}

export function convertFileSync(inputPath: string, outputPath: string, opts?: Partial<ConvertFileStrOpts>) {
    const outputCode = convertFileStr(inputPath, opts);
    FS.writeFileSync(outputPath, outputCode);
}
