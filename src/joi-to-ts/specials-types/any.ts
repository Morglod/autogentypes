import { getJoiFlag } from "../helpers";
import { JoiRuleTransformer, JoiTypeContext } from "../types";

export function joiAny_toTs(ctx: JoiTypeContext) {
    const postRules: {
        [joiRuleName: string]: JoiRuleTransformer,
    } = {
    };

    const { j } = ctx;

    if ('_valids' in j) {
        let outCode = Array.from((j as any)._valids._values).map(x => JSON.stringify(x)).join(' | ');

        if (!getJoiFlag(j, 'only')) {
            outCode += ' | any';
        }

        ctx.typeTsStr = outCode;
    }
}
