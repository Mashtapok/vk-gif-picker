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
        contentEditable
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

          // if(searchQuery) {
          //   const firstGifElement = document.querySelector('.gif-container') as HTMLDivElement;
          //   console.log(firstGifElement, 'firstGifElement');
          //   firstGifElement.focus();
          // }
        }}
        // onInput={e => {
        //   const nodes = highlight(e.currentTarget);
        //
        //   console.log(nodes, 'NODES');
        //
        //   if (nodes.find(({ nodeName }) => nodeName === "SPAN")) {
        //     const searchText = nodes.find(({ nodeName }) => nodeName === "#text")?.textContent;
        //
        //     if (searchText && searchText.trim()) {
        //       setSearchQuery(searchText.trim());
        //
        //       //if(inputRef.current) {
        //       //  inputRef.current.tabIndex = -1;
        //       // }
        //     } else {
        //       setSearchQuery("");
        //     }
        //   } else {
        //     setSearchQuery(''); // TODO: тут можно undefined
        //   }
        // }}
        onInput={e => {
          const nodes = highlight(e.currentTarget);

          if (nodes[0]?.nodeName === "SPAN") {
            setTabIndex(-1);
            setSearchQuery(nodes[1] === undefined ? "" : nodes[1].textContent);
          } else {
            setSearchQuery(undefined);
            setTabIndex(0);
          }

          // if (nodes.find(({ nodeName }) => nodeName === "SPAN")) {
          //   const searchText = nodes.find(({ nodeName }) => nodeName === "#text")?.textContent;
          //
          //   if (searchText && searchText.trim()) {
          //     setSearchQuery(searchText.trim());
          //
          //     //if(inputRef.current) {
          //     //  inputRef.current.tabIndex = -1;
          //     // }
          //   } else {
          //     setSearchQuery("");
          //   }
          // } else {
          //   setSearchQuery('');
          // }
        }}
      />
    </div>
  );
};
