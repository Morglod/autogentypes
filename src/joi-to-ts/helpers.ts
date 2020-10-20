import * as Joi from 'joi';
import { JoiTypeContext } from './types';

export function fmtDebugTypeName(j: Joi.AnySchema) {
    return `${j.type}`;
}

export function createJoiTypeCtx(j: Joi.AnySchema) {
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

export function createJoiTypeSubCtx(parent: JoiTypeContext, childJ: Joi.AnySchema) {
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

export function getJoiFlag(j: Joi.AnySchema, flagName: string, defaultValue?: any) {
    const {
        _flags,
        _preferences,
    } = (j as any);
    if (_flags && flagName in _flags) return _flags[flagName];
    if (_preferences && flagName in _preferences) return _preferences[flagName];
    return defaultValue;
}

export function getJoiPreferenceFlag(j: Joi.AnySchema, flagName: string, defaultValue?: any) {
    const {
        _preferences,
    } = (j as any);
    if (_preferences && flagName in _preferences) return _preferences[flagName];
    return defaultValue;
}