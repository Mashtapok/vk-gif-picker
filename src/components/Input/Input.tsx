import React, { FC, useEffect, useRef, useState } from "react";
import { GifPicker } from "../GifPicker/GifPicker";
import { highlight } from "../../helpers/highlight";
import { restoreCaretPosition, saveCaretPosition } from "../../helpers/caret";

import "./Input.css";


export const Input: FC = () => {
  const inputRef = useRef<HTMLDivElement>(null);
  const [searchQuery, setSearchQuery] = useState<string | undefined>(undefined);
  // Сохраняем позицию курсора на onBlur и восстанавливаем на onFocus
  const [caretPosition, setCaretPosition] = useState(0);
  const [tabIndex, setTabIndex] = useState(0);
  // TODO:  сделать ограничение на клоичество символов

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
        contentEditable={"plaintext-only" as any} // Предотвращает вставку браузерами различных ненужных тэгов
        className="input__field"
        placeholder="Напишите сообщение..."
        role="textbox"
        tabIndex={tabIndex}
        aria-label="Сообщение."
        onFocus={({ currentTarget }) => {
          restoreCaretPosition(currentTarget, caretPosition);
        }}
        onBlur={({ currentTarget }) => {
          const savedPosition = saveCaretPosition(currentTarget);
          setCaretPosition(savedPosition);
        }}
        onInput={e => {
          const nodes = highlight(e.currentTarget);
          if(!nodes) return;

          if (nodes[0]?.nodeName === "SPAN") {
            setTabIndex(-1);
            setSearchQuery(nodes[1] === undefined ? "" : nodes[1].textContent);
          } else {
            setSearchQuery(undefined);
            setTabIndex(0);
          }
        }}
      />
    </div>
  );
};
