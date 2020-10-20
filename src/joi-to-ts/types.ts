import type * as Joi from 'joi';

export type JoiRuleDesc = { name: string, args: any, [x: string]: any };

export type JoiRuleTransformerParams = {
    rule: JoiRuleDesc,
};

export type JoiRuleTransformer = (ctx: JoiTypeContext, params: JoiRuleTransformerParams) => void;

export type JoiTypeContext = {
    j: Joi.AnySchema,
    typeTsStr: string,
    debugTypeName: string,
    processedRules: string[],
    warningMessages: string[],

    pushWarning: (message: string) => void,
};
