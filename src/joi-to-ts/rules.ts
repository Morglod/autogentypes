import { JoiRuleTransformerParams, JoiTypeContext } from "./types";

export function joiRule_length(ctx: JoiTypeContext, params: JoiRuleTransformerParams) {
    if (params.rule.operator === '=' && 'limit' in params.rule.args) {
        ctx.typeTsStr = `((${ctx.typeTsStr}) & { length: ${params.rule.args.limit} })`;
    } else {
        ctx.pushWarning('unsupported length rule signature; only supported length(number)');
    }
    return;
}

export function processRestSchemaRules(ctx: JoiTypeContext) {
    // TODO: process any rules

    // TODO: warn unprocessed rules
    // pushWarning(ctx.j, `unsupported rule "${_rule.name}"`, ctx.warningMessages);
}