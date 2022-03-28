import { commandParser } from './parser';
import { restoreCaretPosition, saveCaretPosition } from './caret';

let parsedValues = [];

export const highlight = input => {
  const nodes = Array.from(input.childNodes).filter(node => node.nodeName !== 'BR');

  for (const node of nodes) {
    parsedValues = commandParser(getTextContent(node));
    const fragment = document.createDocumentFragment();

    for (const block of parsedValues) {
      const element = createHtmlElement[block.type](block);
      fragment.append(element);
    }

    const position = saveCaretPosition(input);
    node.replaceWith(fragment);
    restoreCaretPosition(input, position);
  }

  return nodes;
};

export const getTextContent = node => {
  if (node.nodeName === '#text') return node.data.replace(/\n/g, '');
  if (node.nodeName === 'BR') return '\n';
  if (node.nodeName === 'IMG') return node.alt;

  return [...node.childNodes].map(getTextContent).join('');
};

const createSpan = content => {
  const span = document.createElement('span');

  span.innerText = content;
  span.classList.add('input__marker');

  return span;
};

const createHtmlElement = {
  marker: block => createSpan(block.value),
  text: block => block.value,
};
