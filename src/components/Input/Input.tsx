import React, { FC, useEffect, useRef, useState } from "react";
import { GifPicker } from "../GifPicker/GifPicker";
import { highlight } from "../../helpers/highlight";
import { restoreCaretPosition, saveCaretPosition } from "../../helpers/caret";

import "./Input.css";
import { useMessagesContext } from "../../hooks/useMessagesContext";


export const Input: FC = () => {
  const inputRef = useRef<HTMLDivElement>(null);
  const [searchQuery, setSearchQuery] = useState<string | undefined>(undefined);
  const [caretPosition, setCaretPosition] = useState(0);
  const [tabIndex, setTabIndex] = useState(0);

  const { addMessage } = useMessagesContext();

  const inputHandler = (event: React.FormEvent<HTMLDivElement>) => {
    const nodes = highlight(event.currentTarget);
    if (!nodes) return;

    if (nodes[0]?.nodeName === "SPAN") {
      setTabIndex(-1);
      setSearchQuery(nodes[1] === undefined ? "" : nodes[1].textContent);
    } else {
      setSearchQuery(undefined);
      setTabIndex(0);
    }
  };

  const keyDownHandler = (event: React.KeyboardEvent) => {
    if (inputRef.current && event.code === "Enter") {
      if (inputRef.current.textContent) {
        addMessage({ text: inputRef.current.textContent, created: new Date(), id: Date.now() });
        clearInput();
      }
    }
  };

  const clearInput = () => {
    if (inputRef.current) {
      inputRef.current.innerHTML = "";
      setSearchQuery(undefined);
      setTabIndex(0);
    }
  };

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }

  }, []);

  return (
    <div className="input" aria-haspopup="true">
      <GifPicker searchQuery={searchQuery} clearInput={clearInput} />
      <div
        ref={inputRef}
        contentEditable={"plaintext-only" as any} // Предотвращает вставку некоторыми браузерами различных ненужных тэгов внутрь contentEditable
        className="input__field"
        placeholder="Напишите сообщение..."
        role="textbox"
        tabIndex={tabIndex}
        aria-label="Поле ввода для сообщения"
        onFocus={({ currentTarget }) => {
          restoreCaretPosition(currentTarget, caretPosition);
        }}
        onBlur={({ currentTarget }) => {
          const savedPosition = saveCaretPosition(currentTarget);
          setCaretPosition(savedPosition);
        }}
        onKeyDown={keyDownHandler}
        onInput={inputHandler}
      />
    </div>
  );
};
