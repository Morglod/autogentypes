
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
    "createdAt": number,
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
    "endedAt": number,
    "failedOutputLog": string,
};

export type YandexParserJobCache = {
    "entries": ({
        "searchText"?: string,
        "productUrl"?: string,
    })[],
};
