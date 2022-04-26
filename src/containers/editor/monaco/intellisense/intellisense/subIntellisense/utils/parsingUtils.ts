export const getLastOpenedTag = (text: string) => {
    // get all tags inside of the content
    const tags = text.match(/<\/*(?=\S*)([a-zA-Z-]+)/g);
    if (!tags) {
        return undefined;
    }
    // we need to know which tags are closed
    const closedTags = [];
    let textToProcess = text;
    for (let i = tags.length - 1; i >= 0; i--) {
        if (tags[i].indexOf('</') === 0) {
            closedTags.push(tags[i].substring('</'.length));
        } else {
            // get the last position of the tag
            const tagPosition = textToProcess.lastIndexOf(tags[i]);
            const tag = tags[i].substring('<'.length);
            const closingBracketIdx = textToProcess.indexOf('/>', tagPosition);
            // if the tag wasn't closed
            if (closingBracketIdx === -1) {
                // if there are no closing tags or the current tag wasn't closed
                if (!closedTags.length || closedTags[closedTags.length - 1] !== tag) {
                    return tag;
                }
                // remove the last closed tag
                closedTags.splice(closedTags.length - 1, 1);
            }
            // remove the last checked tag and continue processing the rest of the content
            textToProcess = textToProcess.substring(0, tagPosition);
        }
    }
    return undefined;
};

export class TokenTag {
    public level: number;

    constructor(
        public tag: string,
        public attr: AttributeToken[],
        public content: string,
        public closingTag: boolean,
        public selfClosing: boolean,
    ) {
        this.level = 0;
    }

    isClosed = (): boolean => {
        return this.closingTag || this.selfClosing;
    };

    getAttribute = (name: string): AttributeToken | undefined => {
        return this.attr.find((a) => a.name === name);
    };

    getParent = (tags: TokenTag[]): TokenTag | undefined => {
        const index = tags.indexOf(this);
        return tags.find((t, i) => i > index && t.level === this.level - 1 && !t.isClosed());
    };
}

interface AttributeToken {
    name: string;
    value?: string;
}

export const tokenizeTag = (tagString: string): TokenTag => {
    const contentSplit = tagString.split('>');
    const parts = contentSplit[0].split(' ');
    const tag = parts.shift() ?? '';

    const filtered = parts.map((p) => p.replace('/', '')).filter((p) => p);

    const closingTag = tagString.includes('</');
    const selfClosing = tagString.includes('/>');

    return new TokenTag(
        tag.replace('<', ''),
        filtered.map((p) => {
            const attrParts = p.split('=');
            return { name: attrParts[0], value: attrParts[1]?.replace(/"/g, '') };
        }),
        contentSplit[1] ?? '',
        closingTag,
        selfClosing,
    );
};

export const tokenizeText = (text: string): TokenTag[] => {
    const tags: TokenTag[] = [];
    let textToProcess = text.replace(/<!--([\s\S]*?)-->/gm, '').replace(/<\?xml([\s\S]*?)\?>/gm, ''); // remove comments
    let i = 1;

    while (i > -1) {
        i = textToProcess.lastIndexOf('<');
        if (i > -1) {
            const tag = textToProcess.substring(i).trim();
            textToProcess = textToProcess.substring(0, i);
            if (tag) {
                tags.push(tokenizeTag(tag)); // intentionally inverted, current tag is 0, First tag is last
            }
        }
    }

    calculateNesting(tags);
    return tags;
};

const calculateNesting = (tags: TokenTag[]) => {
    tags.reverse();
    let level = -1;
    tags.forEach((t) => {
        if (t.selfClosing) {
            t.level = level + 1; // increment since it's a child, but decrement since it has no child
        } else if (!t.closingTag) {
            level += 1;
            t.level = level;
        } else {
            t.level = level;
            level -= 1;
        }
    });
    tags.reverse();
};
