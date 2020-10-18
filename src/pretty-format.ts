export function prettyFormat(code: string) {
    // newlines
    code = code.replace(/((?:[{},][\s$^]+)|(?:};)|(?:},)|(?:\}\)\[\]))/g, (x) => {
        if (x === '};') return `\n${x}`;
        if (x === '},') return `\n${x}\n`;
        if (x[0] === '{') return `${x}\n`;
        if (x[0] === '}') return `\n${x}`;
        if (x === '})[]') return `\n${x}\n`;
        return `${x}\n`;
    });

    // tabs
    const oneTab = '    ';
    const lines = code.split('\n');
    let tabs = 0;

    for (let i = 0; i < lines.length; ++i) {
        lines[i] = lines[i].trim();
        if (lines[i] === '') {
            if (tabs > 0) {
                lines.splice(i, 1);
                --i;
            }
            continue;
        }

        if (
            [ '}', '},', '};' ].includes(lines[i]) ||
            (lines[i].startsWith('}') && lines[i].endsWith(',')) ||
            lines[i] === '})[]'
        ) --tabs;

        tabs = Math.max(tabs, 0);
        lines[i] = oneTab.repeat(tabs) + lines[i];

        if (lines[i].length > 1 && (
            lines[i].endsWith('};')
        )) --tabs;
        if (lines[i].endsWith('{')) ++tabs;
    }

    return lines.join('\n');
}