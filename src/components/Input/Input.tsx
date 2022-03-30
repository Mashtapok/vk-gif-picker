import React, { FC, useEffect, useRef, useState } from 'react';
import { GifPicker } from '../GifPicker/GifPicker';
import { highlight } from '../../helpers/highlight';

import './Input.css';
import { restoreCaretPosition, saveCaretPosition } from '../../helpers/caret';

export const Input: FC = () => {
  const inputRef = useRef<HTMLDivElement>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [html, setHtml] = useState('');
  // Сохраняем позицию курсора на onBlur и восстанавливаем на onFocus
  const [caretPosition, setCaretPosition] = useState(0);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus(); // FIXME: КУРСОР при TAB ставится в начало, а надо в нужное место
    }
  }, []);

  return (
    <div className='input'>
      <GifPicker searchQuery={searchQuery} />
      <div
        ref={inputRef}
        contentEditable
        className='input__field'
        placeholder='Напишите сообщение...'
        role='textbox'
        tabIndex={0}
        onKeyPress={(e) => {
          if (e.code === 'NumpadAdd') {
            e.preventDefault();
            if (inputRef.current) {
              inputRef.current.innerHTML = '';
              setSearchQuery('');
            }
          }
        }}
        onPaste={e => console.log(e.clipboardData.getData('text'))}
        // dangerouslySetInnerHTML={{ __html: html }}
        onFocus={({ currentTarget }) => {
          restoreCaretPosition(currentTarget, caretPosition);
        }}
        onBlur={({ currentTarget }) => {
          const savedPosition = saveCaretPosition(currentTarget);
          setCaretPosition(savedPosition);
        }}
        onInput={e => {
          const nodes = highlight(e.currentTarget);

          // //
          // setHtml(nodes.map(({ outerHTML, nodeName, textContent }) => {
          //   if (nodeName === '#text') return textContent;
          //   return outerHTML;
          // }).join(''));
          // //

          if (nodes.find(({ nodeName }) => nodeName === 'SPAN')) {
            const searchText = nodes.find(({ nodeName }) => nodeName === '#text')?.textContent;
            if (searchText && searchText.trim()) {
              setSearchQuery(searchText.trim());
            } else {
              setSearchQuery('');
            }
          } else {
            setSearchQuery('');
          }
        }}
      />
    </div>
  );
};
