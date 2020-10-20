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


export type YaWorkerData = {
    "uuid": string,
    "workingDir": string,
    "currentJobUUID": (string | false),
};

export type YandexParserJob_Status = string;

export type YandexParserJob = {
    "jobUUID": string,
    "status": string,
    "useCache": boolean,
    /** utc ms date */ "createdAt": number,
    "importXLS": ({
        "filePath"?: string,
        "searchTextColumnIndex"?: (number | false),
        "productUrlColumnIndex"?: (number | false),
    } | false),
    "searchTextJsonFilePath": (string | false),
    "productUrlJsonFilePath": (string | false),
    "testSearchEntries": (string)[],
    "testProductUrlEntries": (string)[],
    "parseTimeSpentSec": number,
    "entriesProcessed": number,
    "stats": {
        "captchas"?: number,
        "captchasSolved"?: number,
        "captchasUnsolvable"?: number,
        "itemSearches"?: number,
        "foundItemSearches"?: number,
        "offerPagesParsed"?: number,
        "offersParsed"?: number,
    },
    "builtOutputTimeSpentSec": number,
    "builtOutputFilePath": string,
    /** utc ms date */ "endedAt": number,
    "failedOutputLog": string,
};

export type YandexParserJobCache = {
    "entries": ({
        "searchText"?: string,
        "productUrl"?: string,
    })[],
};



export const YaWorkerDataSchema4 = {
    "type": "object",
    "properties": {
        "uuid": {
            "type": "string"
        },
        "workingDir": {
            "type": "string"
        },
        "currentJobUUID": {
            "type": "alternatives"
        }
    }
};

export const YandexParserJob_StatusSchema4 = {
    "type": "string"
};

export const YandexParserJobSchema4 = {
    "type": "object",
    "properties": {
        "jobUUID": {
            "type": "string"
        },
        "status": {
            "type": "string"
        },
        "useCache": {
            "type": "boolean"
        },
        "createdAt": {
            "type": "number"
        },
        "importXLS": {
            "type": "alternatives"
        },
        "searchTextJsonFilePath": {
            "type": "alternatives"
        },
        "productUrlJsonFilePath": {
            "type": "alternatives"
        },
        "testSearchEntries": {
            "type": "array",
            "items": {
                "type": "string"
            }
        },
        "testProductUrlEntries": {
            "type": "array",
            "items": {
                "type": "string"
            }
        },
        "parseTimeSpentSec": {
            "type": "number"
        },
        "entriesProcessed": {
            "type": "number"
        },
        "stats": {
            "type": "object",
            "properties": {
                "captchas": {
                    "type": "number"
                },
                "captchasSolved": {
                    "type": "number"
                },
                "captchasUnsolvable": {
                    "type": "number"
                },
                "itemSearches": {
                    "type": "number"
                },
                "foundItemSearches": {
                    "type": "number"
                },
                "offerPagesParsed": {
                    "type": "number"
                },
                "offersParsed": {
                    "type": "number"
                }
            }
        },
        "builtOutputTimeSpentSec": {
            "type": "number"
        },
        "builtOutputFilePath": {
            "type": "string"
        },
        "endedAt": {
            "type": "number"
        },
        "failedOutputLog": {
            "type": "string"
        }
    }
};

export const YandexParserJobCacheSchema4 = {
    "type": "object",
    "properties": {
        "entries": {
            "type": "array",
            "items": {
                "type": "object",
                "properties": {
                    "searchText": {
                        "type": "string"
                    },
                    "productUrl": {
                        "type": "string"
                    }
                }
            }
        }
    }
};
