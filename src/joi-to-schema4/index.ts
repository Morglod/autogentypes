import * as Joi from 'joi';
import { InFileConfig } from '../in-file-config';
import * as jts from 'json-joi-converter';

export function joiToSchema4(joi: Joi.AnySchema): {
    outputCode: string,
    warningMessages?: string[],
} {
    const outputSchemaCode = JSON.stringify(jts.toJson(joi), null, 2);

    return {
        outputCode: outputSchemaCode,
    };
}

export function joiJsModuleToSchema4Code(jsModule: any, opts?: Partial<InFileConfig>): {
    outputCode: string,
    warningMessages?: string[],
} {
    const {
        exportedSymbolNameTransform = (x: string) => x + 'Schema4',
    } = opts || {};

    let outputCode = '';
    const warningMessages: string[] = [];

    for (const exportKey in jsModule) {
        const exportVar = jsModule[exportKey];
        if (Joi.isSchema(exportVar)) {
            const typeCodeResult = joiToSchema4(exportVar);
            if (typeCodeResult.warningMessages) warningMessages.push(...typeCodeResult.warningMessages);
            outputCode += `\nexport const ${exportedSymbolNameTransform(exportKey, { from: 'joi', to: 'schema4' })} = ${typeCodeResult.outputCode};\n`;
        }
    }

    return {
        outputCode,
        warningMessages: warningMessages.length !== 0 ? warningMessages : undefined
    };
}