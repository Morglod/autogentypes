import * as Joi from 'joi';
import { createJoiTypeSubCtx, getJoiFlag, getJoiPreferenceFlag } from "../helpers";
import { _joiType_ToTS } from '../joi-to-ts';
import { joiRule_length } from "../rules";
import { JoiRuleTransformer, JoiTypeContext } from "../types";

export function joiObject_toTs(ctx: JoiTypeContext) {
    ctx.typeTsStr = 'object';

    const postRules: {
        [joiRuleName: string]: JoiRuleTransformer,
    } = {
    };

    const { j } = ctx;

    if ((j as any)._rules) {
        const regexRule = (j as any)._rules.find((x:any) => x.name === 'regex');
        if (regexRule) {
            return '(RegExp)';
        }
    }

    if (j.$_terms.keys && j.$_terms.keys.length !== 0) {
        const outFields = [] as {
            key: string,
            fieldCtx: JoiTypeContext,
            optional: boolean,
            modificatorsCode: string,
        }[];

        const overridePresence = getJoiPreferenceFlag(j, 'presence');

        for (const k of j.$_terms.keys) {
            const schemaKey = k as {
                key: string,
                schema: Joi.AnySchema
            };
    
            const fieldCtx = createJoiTypeSubCtx(ctx, schemaKey.schema);
            _joiType_ToTS(fieldCtx);

            let modificatorsCode = '';

            const comment = getJoiFlag(schemaKey.schema, 'description');
            if (comment) {
                modificatorsCode += `/** ${comment} */`;
            }

            outFields.push({
                key: schemaKey.key,
                fieldCtx,
                optional: getJoiFlag(schemaKey.schema, 'presence', overridePresence || 'optional') !== 'required',
                modificatorsCode,
            });
        }

        ctx.typeTsStr = `{ ${outFields.map(f => {
            return `${f.modificatorsCode} "${f.key}"${f.optional ? '?' : ''}: ${f.fieldCtx.typeTsStr}`;
        }).join(', ')}, }`;
    }
}