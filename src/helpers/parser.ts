export type ParsedNodeType = {
  type: string;
  value: string;
};

type ParserTypes = {
  regexp: RegExp;
  parseText: (text: string) => ParsedNodeType[];
  parseElement: (text: string) => ParsedNodeType[];
};

/**
 * Creates a text parser that splits input into blocks using a regular expression.
 * parseText is called for text that does not match the regexp
 * parseElement is called for text that matches the regexp
 * Both functions must return an array that is appended to the result
 */
const createParser = ({
  regexp,
  parseText,
  parseElement,
}: ParserTypes): ((text: string) => ParsedNodeType[]) => {
  return text => {
    const blocks = [];
    let offset = 0;

    for (const match of text.matchAll(regexp) as any) {
      const { 0: marker, index } = match;

      if (index !== offset) {
        blocks.push(...parseText(text.slice(offset, index)));
      }

      blocks.push(...parseElement(marker));

      offset = index + marker.length;
    }

    if (text.length !== offset) {
      blocks.push(...parseText(text.slice(offset, text.length)));
    }

    return blocks;
  };
};

export const gifMarkerParser = createParser({
  regexp: /\/gif\s/giy,
  parseText: value => [{ type: "text", value }],
  parseElement: value => [{ type: "marker", value }],
});
