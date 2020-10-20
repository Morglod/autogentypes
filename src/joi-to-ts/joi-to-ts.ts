import * as Joi from 'joi';
import { InFileConfig } from '../in-file-config';
import { createJoiTypeCtx, createJoiTypeSubCtx, fmtDebugTypeName, getJoiFlag, getJoiPreferenceFlag } from './helpers';
import { joiRule_length, processRestSchemaRules } from './rules';
import { joiAlternatives_toTs } from './specials-types/alternatives';
import { joiAny_toTs } from './specials-types/any';
import { joiArray_toTs } from './specials-types/array';
import { joiObject_toTs } from './specials-types/object';

import {
    JoiRuleDesc,
    JoiRuleTransformerParams,
    JoiRuleTransformer,
    JoiTypeContext,
} from './types';

export function _joiType_ToTS(ctx: JoiTypeContext): void {
    const { j } = ctx;

    const joiPod: {
        [joiTypeName: string]: string
    } = {
        'boolean': 'boolean',
        'binary': 'Buffer',
        'date': 'Date',
        'function': 'Function',
        'number': 'number',
        'string': 'string',
        'symbol': 'symbol',
    };

    const joiSpecial: {
        [joiTypeName: string]: (ctx: JoiTypeContext) => void,
    } = {
        'any': joiAny_toTs,
        'array': joiArray_toTs,
        'object': joiObject_toTs,
        'alternatives': joiAlternatives_toTs,
    };

    if (j.type) {
        if (j.type in joiSpecial) {
            const jt = joiSpecial[j.type];
            jt(ctx);
            return;
        }
        if (j.type in joiPod) {
            const podT = joiPod[j.type];
            ctx.typeTsStr = podT;
            return;
        }
        processRestSchemaRules(ctx);
    }

    ctx.pushWarning('unknown type');
}

export function joiToTs(joi: Joi.AnySchema): {
    outputCode: string,
    warningMessages?: string[],
} {
    const ctx = createJoiTypeCtx(joi);
    _joiType_ToTS(ctx);
    const warningMessages = ctx.warningMessages.length !== 0 ? Array.from(ctx.warningMessages) : undefined;
    ctx.warningMessages = [];

    return {
        outputCode: ctx.typeTsStr,
        warningMessages,
    };
}

export function joiJsModuleToTsTypesCode(jsModule: any, opts?: Partial<InFileConfig>): {
    outputCode: string,
    warningMessages?: string[],
} {
    const {
        exportedSymbolNameTransform = (x: string) => x,
    } = opts || {};

    let outputCode = '';
    const warningMessages: string[] = [];

    for (const exportKey in jsModule) {
        const exportVar = jsModule[exportKey];
        if (Joi.isSchema(exportVar)) {
            const typeCodeResult = joiToTs(exportVar);
            if (typeCodeResult.warningMessages) warningMessages.push(...typeCodeResult.warningMessages);
            outputCode += `\nexport type ${exportedSymbolNameTransform(exportKey, { from: 'joi', to: 'ts' })} = ${typeCodeResult.outputCode};\n`;
        }
    }

    return {
        outputCode: outputCode,
        warningMessages: warningMessages.length !== 0 ? warningMessages : undefined
    };
}