# autogentypes

Generate types & schemas from types & schemas.

Currently supports:
* joi -> typescript
* joi -> schema4 (through [json-joi-converter](https://github.com/siavashg87/json-joi-converter))

Check example project in [src/example](./src/example)

If you use joi: `npm i joi @hapi/joi@npm:joi`  
If you use schema4 `npm i json-joi-converter`

## Idea

Keep single source of truth for all types & schemas.  
Currently based on joi.

### Example

from:
```js
import * as Joi from 'joi';

export const WorkerData = Joi.object({
    uuid: Joi.string(),
    workingDir: Joi.string(),
    currentJobUUID: Joi.alternatives(
        Joi.string(),
        Joi.valid(false)
    ),
}).options({
    presence: 'required'
});
```

to:
```ts
import * as Joi from 'joi';

export const WorkerData = Joi.object({
    uuid: Joi.string(),
    workingDir: Joi.string(),
    currentJobUUID: Joi.alternatives(
        Joi.string(),
        Joi.valid(false)
    ),
}).options({
    presence: 'required'
});

export type WorkerData = {
    "uuid": string,
    "workingDir": string,
    "currentJobUUID": (string | false),
};

export const WorkerDataSchema4 = {
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
```

## Api

Create script file in your project:

```ts
import { convertGlobSync } from "autogentypes/lib/cli";

convertGlobSync('src/**/*.gen.js', {
    outputFilePath: (orig, prefer) => prefer.replace('.gen.ts', '.ts')
});
```

Options of `convertGlobSync`:
```ts
{
    outputFilePath?: (originalFilePath: string, preferedFilePath: string) => string,

    // true by default
    prettyFmt?: boolean,

    // 'append' by default
    // append - append original file with generated code
    // export - output only generated code
    convertMode?: 'append' | 'export',

    // [ 'joi' ] by default
    convertFrom?: 'joi'[] | 'joi',

    // [ 'ts', 'schema4' ] by default
    convertTo?: ('ts' | 'schema4')[] | 'ts' | 'schema4',

    // by default:  
    // joi->ts does not change name  
    // joi->schema4 append 'Schema4' to name  
    exportedSymbolNameTransform?: (originalName: string, params: {
        from: string // eg 'joi'
        to: string // eg 'ts'
    }) => string,
}
```