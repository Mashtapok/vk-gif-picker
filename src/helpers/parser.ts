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
 * Создает парсер текста, который делит текст на блоки с помощью регулярки.
 * parseText вызывается если кусок текста не входит в регулярку
 * parseElement вызывается если кусок текста уже входит в регулярку
 * Эти функции обязательны и должны вернуть массив, который затем добавится к ответу
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
