import { getTextContent } from './highlight';

export const saveCaretPosition = input => {
  const range = window.getSelection().getRangeAt(0);
  const preCaretRange = range.cloneRange();

  preCaretRange.selectNodeContents(input);
  preCaretRange.setEnd(range.endContainer, range.endOffset);

  const nodes = [...preCaretRange.cloneContents().childNodes];

  return nodes.map(getTextContent).join('').length;
};

const getCaretNodeAndOffset = (input, caretPosition) => {
  const nodes = Array.from(input.childNodes);
  let spanLength = 0;

  for (const node of nodes) {
    const textLength = getTextContent(node).length;

    if (spanLength + textLength >= caretPosition) {
      return [node, caretPosition - spanLength];
    }

    spanLength += textLength;
  }

  return [];
};

export const restoreCaretPosition = (input, caretPosition) => {
  const [node, offset] = getCaretNodeAndOffset(input, caretPosition);

  if (node) {
    const range = window.getSelection().getRangeAt(0);

    if (node.nodeName === 'IMG') {
      range.setStartAfter(node, offset);
    } else if (node.nodeType === Node.TEXT_NODE) {
      range.setStart(node, offset);
    } else {
      range.setStart(node.childNodes[0], offset);
    }

    range.collapse(true);
  }
};
