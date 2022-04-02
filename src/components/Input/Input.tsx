import React, { FC, useEffect, useRef, useState } from "react";
import { GifPicker } from "../GifPicker/GifPicker";
import { highlight } from "../../helpers/highlight";
import { restoreCaretPosition, saveCaretPosition } from "../../helpers/caret";

import "./Input.css";
export const Input: FC = () => {
  const inputRef = useRef<HTMLDivElement>(null);
  const [searchQuery, setSearchQuery] = useState("");
  // Сохраняем позицию курсора на onBlur и восстанавливаем на onFocus
  const [caretPosition, setCaretPosition] = useState(0);
  // TODO:  сделать ограничение на клоичество символов

  const clearInput = () => {
    if (inputRef.current) {
      inputRef.current.innerHTML = "";
      setSearchQuery("");
    }
  };

  // const keyDownHandler = (e: React.KeyboardEvent<HTMLDivElement>) => {
  //   if (e.code === "Enter" && inputRef.current && inputRef.current.innerHTML) {
  //     console.log(inputRef);
  //     addMessage({ text: inputRef.current.innerHTML, created: new Date(), id: Date.now() });
  //     clearInput();
  //   }
  // };

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  return (
    <div className="input">
      <GifPicker searchQuery={searchQuery} clearInput={clearInput} />
      <div
        ref={inputRef}
        contentEditable
        className="input__field"
        placeholder="Напишите сообщение..."
        role="textbox"
        tabIndex={0}
        onFocus={({ currentTarget }) => {
          restoreCaretPosition(currentTarget, caretPosition);
        }}
        onBlur={({ currentTarget }) => {
          const savedPosition = saveCaretPosition(currentTarget);
          setCaretPosition(savedPosition);
        }}
        onInput={e => {
          const nodes = highlight(e.currentTarget);

          if (nodes.find(({ nodeName }) => nodeName === "SPAN")) {
            const searchText = nodes.find(({ nodeName }) => nodeName === "#text")?.textContent;

            if (searchText && searchText.trim()) {
              setSearchQuery(searchText.trim());
            } else {
              setSearchQuery("");
            }
          } else {
            setSearchQuery("");
          }
        }}
      />
    </div>
  );
};
