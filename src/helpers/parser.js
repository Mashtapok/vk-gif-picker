// Создает парсер текста, который делит текст на блоки с помощью регулярки.
// parseText вызывается если кусок текста не входит в регулярку
// parseText(value (кусок текста)) {}
// parseElement вызывается если кусок текста уже входит в регулярку
// parseElement(value, match (вывод регулярки)) {}
// Эти функции обязательны и должны вернуть массив, который затем добавится к ответу
// Пример:
// const parser = createParser({
//   regexp: /element/g,
//   parseText: (value) => [{ type: 'text', value }],
//   parseElement: (value, match) => [{ type: 'el', value }]
// });
// const result = parser('text element');
// result = [{ type: 'text', value: 'text ' }, { type: 'el', value: 'element' }];
const createParser = ({ regexp, parseText, parseElement }) => {
  return text => {
    const blocks = [];
    let offset = 0;

    for (const match of text.matchAll(regexp)) {
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

export const commandParser = createParser({
  regexp: /\/gif+/giy,
  parseText: value => [{ type: 'text', value }],
  parseElement: value => [{ type: 'marker', value }],
});
