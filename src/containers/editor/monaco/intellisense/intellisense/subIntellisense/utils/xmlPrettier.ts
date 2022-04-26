// Stolen LUL
export const formatXML = (text: string) => {
    const shift = ['\n'];
    const step = '    '; // 4 spaces
    let i = 0;

    // initialize array with shifts; nesting level == 100 //
    for (i = 0; i < 100; i++) {
        shift.push(shift[i] + step);
    }
    const ar = text
        .replace(/>\s{0,}</g, '><')
        .replace(/</g, '~::~<')
        .replace(/xmlns\:/g, '~::~xmlns:')
        .replace(/xmlns\=/g, '~::~xmlns=')
        .split('~::~');
    const len = ar.length;
    let inComment = false;
    let deep = 0;
    let str = '';

    for (let ix = 0; ix < len; ix++) {
        // start comment or <![CDATA[...]]> or <!DOCTYPE //
        if (ar[ix].search(/<!/) > -1) {
            str += shift[deep] + ar[ix];
            inComment = true;
            // end comment  or <![CDATA[...]]> //
            if (ar[ix].search(/-->/) > -1 || ar[ix].search(/\]>/) > -1 || ar[ix].search(/!DOCTYPE/) > -1) {
                inComment = false;
            }
        }
        // end comment  or <![CDATA[...]]> //
        else if (ar[ix].search(/-->/) > -1 || ar[ix].search(/\]>/) > -1) {
            str += ar[ix];
            inComment = false;
        }
        // <elm></elm> //
        else if (
            /^<\w/.exec(ar[ix - 1]) &&
            /^<\/\w/.exec(ar[ix]) &&
            /^<[\w:\-\.\,]+/.exec(ar[ix - 1])?.toString() === /^<\/[\w:\-\.\,]+/.exec(ar[ix])?.[0].replace('/', '')
        ) {
            str += ar[ix];
            if (!inComment) deep--;
        }
        // <elm> //
        else if (ar[ix].search(/<\w/) > -1 && ar[ix].search(/<\//) === -1 && ar[ix].search(/\/>/) === -1) {
            str = !inComment ? (str += shift[deep++] + ar[ix]) : (str += ar[ix]);
        }
        // <elm>...</elm> //
        else if (ar[ix].search(/<\w/) > -1 && ar[ix].search(/<\//) > -1) {
            str = !inComment ? (str += shift[deep] + ar[ix]) : (str += ar[ix]);
        }
        // </elm> //
        else if (ar[ix].search(/<\//) > -1) {
            str = !inComment ? (str += shift[--deep] + ar[ix]) : (str += ar[ix]);
        }
        // <elm/> //
        else if (ar[ix].search(/\/>/) > -1) {
            str = !inComment ? (str += shift[deep] + ar[ix]) : (str += ar[ix]);
        }
        // <? xml ... ?> //
        else if (ar[ix].search(/<\?/) > -1) {
            str += shift[deep] + ar[ix];
        }
        // xmlns //
        else if (ar[ix].search(/xmlns\:/) > -1 || ar[ix].search(/xmlns\=/) > -1) {
            str += shift[deep] + ar[ix];
        } else {
            str += ar[ix];
        }
    }

    return str[0] === '\n' ? str.slice(1) : str;
};
