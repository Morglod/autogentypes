import * as Joi from 'joi';
import { createJoiTypeSubCtx } from "../helpers";
import { _joiType_ToTS } from '../joi-to-ts';
import { joiRule_length } from "../rules";
import { JoiRuleTransformer, JoiTypeContext } from "../types";

export function joiArray_toTs(ctx: JoiTypeContext) {
    ctx.typeTsStr = 'any[]';

    const postRules: {
        [joiRuleName: string]: JoiRuleTransformer,
    } = {
        'length': joiRule_length,
        'items': (ctx, params) => {},
    };

    const { j } = ctx;

    if (j.$_terms.items) {
        const itemTypes: JoiTypeContext[] = j.$_terms.items.map((x: Joi.AnySchema) => {
            const subCtx = createJoiTypeSubCtx(ctx, x);
            _joiType_ToTS(subCtx);
            return subCtx;
        });
        if (itemTypes.length === 1) {
            ctx.typeTsStr = `(${itemTypes[0].typeTsStr})[]`;
        }
        else {
            ctx.typeTsStr = `[ ${itemTypes.map(x => x.typeTsStr).join(', ')} ]`;
        }
    }

    if ((j as any)._rules) {
        for (const _rule of ((j as any)._rules)) {
            if (_rule.name in postRules) {
                const ruleTr = postRules[_rule.name];
                ruleTr(ctx, { rule: _rule });
            }
            ctx.processedRules.push(_rule.name);
        }
    }
}