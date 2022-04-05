import { gifMarkerParser, ParsedNodeType } from "./parser";
import { restoreCaretPosition, saveCaretPosition } from "./caret";

let parsedValues = [];

export const highlight = (input: HTMLDivElement) => {
  const nodes = Array.from(input.childNodes).filter(node => node.nodeName !== "BR");

  const transformedNodes = [];

  for (const node of nodes) {
    parsedValues = gifMarkerParser(getTextContent(node));
    const fragment = document.createDocumentFragment();

    for (const block of parsedValues) {
      // @ts-ignore
      const element = createHtmlElement[block.type](block);
      fragment.append(element);
      transformedNodes.push(element);
    }

    const position = saveCaretPosition(input);
    node.replaceWith(fragment);
    restoreCaretPosition(input, position);
  }

  return transformedNodes;
};

export const getTextContent = (node: any): string => {
  if (node.nodeName === "#text") return node.data.replace(/\n/g, "");
  if (node.nodeName === "BR") return "\n";
  if (node.nodeName === "IMG") return node.alt;

  return [...node.childNodes].map(getTextContent).join("");
};

const createSpan = (content: string): HTMLSpanElement => {
  const span = document.createElement("span");

  span.innerText = content;
  span.classList.add("input__marker");

  return span;
};

const createHtmlElement = {
  marker: (block: ParsedNodeType) => createSpan(block.value),
  text: (block: ParsedNodeType) => document.createTextNode(block.value),
};
