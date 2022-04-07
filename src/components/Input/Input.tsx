import React, { FC, useEffect, useRef, useState } from "react";
import { GifPicker } from "../GifPicker/GifPicker";
import { highlight } from "../../helpers/highlight";
import { restoreCaretPosition, saveCaretPosition } from "../../helpers/caret";
import { useMessagesContext } from "../../hooks/useMessagesContext";

import "./Input.css";

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
      setTabIndex(-1); // Необходимо, чтобы фокус сразу перемещался на гифки
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

  const focusHandler = (event: React.FocusEvent<HTMLDivElement>) => {
    restoreCaretPosition(event.currentTarget, caretPosition);
  };

  const blurHandler = (event: React.FocusEvent<HTMLDivElement>) => {
    const savedPosition = saveCaretPosition(event.currentTarget);
    setCaretPosition(savedPosition);
  };

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }

    const escapeHandler = (event: KeyboardEvent) => {
      if (event.code === "Escape") {
        setSearchQuery(undefined);
      }
    };
    document.addEventListener("keydown", escapeHandler);

    return () => {
      document.removeEventListener("keydown", escapeHandler);
    };
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
        onFocus={focusHandler}
        onBlur={blurHandler}
        onKeyDown={keyDownHandler}
        onInput={inputHandler}
      />
    </div>
  );
};
