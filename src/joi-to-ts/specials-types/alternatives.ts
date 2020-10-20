import * as Joi from 'joi';
import { createJoiTypeSubCtx } from "../helpers";
import { _joiType_ToTS } from '../joi-to-ts';
import { joiRule_length } from "../rules";
import { JoiRuleTransformer, JoiTypeContext } from "../types";

export function joiAlternatives_toTs(ctx: JoiTypeContext) {
    const postRules: {
        [joiRuleName: string]: JoiRuleTransformer,
    } = {
    };

    const { j } = ctx;

    if (j.$_terms.matches && j.$_terms.matches.length !== 0) {
        const outVariants = [] as JoiTypeContext[];

        for (const m of j.$_terms.matches) {
            const schemaMatch = m as {
                schema: Joi.AnySchema
            };
    
            const fieldCtx = createJoiTypeSubCtx(ctx, schemaMatch.schema);
            _joiType_ToTS(fieldCtx);
    
            outVariants.push(fieldCtx);
        }

        ctx.typeTsStr = `(${outVariants.map(x => x.typeTsStr).join(' | ')})`;
    }
}