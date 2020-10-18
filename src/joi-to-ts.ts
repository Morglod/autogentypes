import * as Joi from 'joi';

function fmtDebugTypeName(j: Joi.AnySchema) {
    return `${j.type}`;
}

type JoiRuleDesc = { name: string, args: any, [x: string]: any };

type JoiRuleTransformerParams = {
    rule: JoiRuleDesc,
};

type JoiRuleTransformer = (ctx: JoiTypeContext, params: JoiRuleTransformerParams) => void;

type JoiTypeContext = {
    j: Joi.AnySchema,
    typeTsStr: string,
    debugTypeName: string,
    processedRules: string[],
    warningMessages: string[],

    pushWarning: (message: string) => void,
};

function createJoiTypeCtx(j: Joi.AnySchema) {
    const ctx: JoiTypeContext = {
        j: j,
        typeTsStr: 'unknown',
        debugTypeName: `"${fmtDebugTypeName(j)}"`,
        warningMessages: [],
        processedRules: [],

        pushWarning: undefined!,
    };

    ctx.pushWarning = msg => ctx.warningMessages.push(`${ctx.debugTypeName} - ${msg}`);
    return ctx;
}

function createJoiTypeSubCtx(parent: JoiTypeContext, childJ: Joi.AnySchema) {
    const ctx: JoiTypeContext = {
        j: childJ,
        typeTsStr: 'unknown',
        debugTypeName: `${parent.debugTypeName} > "${fmtDebugTypeName(childJ)}"`,
        warningMessages: parent.warningMessages,
        processedRules: [],
        
        pushWarning: undefined!,
    };
    ctx.pushWarning = msg => ctx.warningMessages.push(`${ctx.debugTypeName} - ${msg}`);
    return ctx;
}

function getJoiFlag(j: Joi.AnySchema, flagName: string, defaultValue?: any) {
    const {
        _flags,
        _preferences,
    } = (j as any);
    if (_flags && flagName in _flags) return _flags[flagName];
    if (_preferences && flagName in _preferences) return _preferences[flagName];
    return defaultValue;
}

function getJoiPreferenceFlag(j: Joi.AnySchema, flagName: string, defaultValue?: any) {
    const {
        _preferences,
    } = (j as any);
    if (_preferences && flagName in _preferences) return _preferences[flagName];
    return defaultValue;
}

function joiRule_length(ctx: JoiTypeContext, params: JoiRuleTransformerParams) {
    if (params.rule.operator === '=' && 'limit' in params.rule.args) {
        ctx.typeTsStr = `((${ctx.typeTsStr}) & { length: ${params.rule.args.limit} })`;
    } else {
        ctx.pushWarning('unsupported length rule signature; only supported length(number)');
    }
    return;
}

function joiArray_toTs(ctx: JoiTypeContext) {
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

function joiObject_toTs(ctx: JoiTypeContext) {
    ctx.typeTsStr = 'object';

    const postRules: {
        [joiRuleName: string]: JoiRuleTransformer,
    } = {
    };

    const { j } = ctx;

    if (j.$_terms.keys && j.$_terms.keys.length !== 0) {
        const outFields = [] as {
            key: string,
            fieldCtx: JoiTypeContext,
            optional: boolean,
        }[];

        const overridePresence = getJoiPreferenceFlag(j, 'presence');

        for (const k of j.$_terms.keys) {
            const schemaKey = k as {
                key: string,
                schema: Joi.AnySchema
            };
    
            const fieldCtx = createJoiTypeSubCtx(ctx, schemaKey.schema);
            _joiType_ToTS(fieldCtx);
    
            outFields.push({
                key: schemaKey.key,
                fieldCtx,
                optional: getJoiFlag(schemaKey.schema, 'presence', overridePresence || 'optional') !== 'required',
            });
        }

        ctx.typeTsStr = `{ ${outFields.map(f => {
            return `"${f.key}"${f.optional ? '?' : ''}: ${f.fieldCtx.typeTsStr}`;
        }).join(', ')}, }`;
    }
}

function joiAlternatives_toTs(ctx: JoiTypeContext) {
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

function joiAny_toTs(ctx: JoiTypeContext) {
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

function processRestSchemaRules(ctx: JoiTypeContext) {
    // TODO: process any rules

    // TODO: warn unprocessed rules
    // pushWarning(ctx.j, `unsupported rule "${_rule.name}"`, ctx.warningMessages);
}

function _joiType_ToTS(ctx: JoiTypeContext): void {
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

export function joiToTs(joi: Joi.AnySchema): string {
    const ctx = createJoiTypeCtx(joi);
    _joiType_ToTS(ctx);
    if (ctx.warningMessages.length !== 0) {
        console.log(ctx.warningMessages.join('\n'));
        ctx.warningMessages = [];
    }
    return ctx.typeTsStr;
}

export function joiJsModuleToTsTypesCode(jsModule: any): string {
    let outputCode = '';

    for (const exportKey in jsModule) {
        const exportVar = jsModule[exportKey];
        if (Joi.isSchema(exportVar)) {
            const typeCode = joiToTs(exportVar);
            outputCode += `\nexport type ${exportKey} = ${typeCode};\n`;
        }
    }

    return outputCode;
}