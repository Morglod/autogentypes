import * as Joi from 'joi';

export const YaWorkerData = Joi.object({
    uuid: Joi.string(),
    workingDir: Joi.string(),
    currentJobUUID: Joi.alternatives(
        Joi.string(),
        Joi.valid(false)
    ),
}).options({
    presence: 'required'
});

export const YandexParserJob_Status = Joi.string();

export const YandexParserJob = Joi.object().keys({
    jobUUID: Joi.string(),

    status: YandexParserJob_Status,
    useCache: Joi.boolean(),

    // new
    createdAt: Joi.number().description('utc ms date'),
    importXLS: Joi.alternatives(
        Joi.object({
            filePath: Joi.string(),
            searchTextColumnIndex: Joi.alternatives(Joi.number(), Joi.valid(false)),
            productUrlColumnIndex: Joi.alternatives(Joi.number(), Joi.valid(false)),
        }),
        Joi.valid(false)
    ),
    searchTextJsonFilePath: Joi.alternatives(Joi.string(), Joi.valid(false)),
    productUrlJsonFilePath: Joi.alternatives(Joi.string(), Joi.valid(false)),

    testSearchEntries: Joi.array().items(Joi.string()),
    testProductUrlEntries: Joi.array().items(Joi.string()),

    // progress
    parseTimeSpentSec: Joi.number(),
    entriesProcessed: Joi.number(),
    stats: Joi.object({
        captchas: Joi.number(),
        captchasSolved: Joi.number(),
        captchasUnsolvable: Joi.number(),
        itemSearches: Joi.number(),
        foundItemSearches: Joi.number(),
        offerPagesParsed: Joi.number(),
        offersParsed: Joi.number(),
    }),

    builtOutputTimeSpentSec: Joi.number(),
    builtOutputFilePath: Joi.string().empty(),

    // finished or failed
    endedAt: Joi.number().empty().description('utc ms date'),

    failedOutputLog: Joi.string(),
}).options({
    presence: 'required'
});

export const YandexParserJobCache = Joi.object({
    entries: Joi.array().items(Joi.object({
        searchText: Joi.string(),
        productUrl: Joi.string(),
    })),
}).options({
    presence: 'required'
});