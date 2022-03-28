import React, { useEffect, useRef, useState } from 'react';
import './Input.css';
import { GifPicker } from '../GifPicker/GifPicker';
import { highlight } from '../../helpers/highlight';

const DEFAULT_TEXT = "<span class='input__marker'>/gif</span> cat";

export const Input = () => {
  const inputRef = useRef<HTMLDivElement>(null);
  const [candidate, setCandidate] = useState('');

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus(); // FIXME: КУРСОР при TAB ставится в начало, а надо в нужное место
    }
  }, []);

  return (
    <div className="input">
      <GifPicker candidate={candidate} />
      <div
        ref={inputRef}
        contentEditable
        className="input__field"
        placeholder="Напишите сообщение..."
        role="textbox"
        aria-multiline="true"
        tabIndex={0}
        dangerouslySetInnerHTML={{ __html: '' }}
        onInput={e => {
          const nodes = highlight(e.currentTarget);
          if (nodes.find(({ nodeName }) => nodeName === 'SPAN')) {
            const searchText = nodes.find(({ nodeName }) => nodeName === '#text')?.textContent;
            if (searchText && searchText.trim()) {
              setCandidate(searchText.trim());
            } else {
              setCandidate('');
            }
          } else {
            setCandidate('');
          }
        }}
      />
    </div>
  );
};
