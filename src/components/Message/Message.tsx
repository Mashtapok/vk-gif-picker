import React, { useEffect, useMemo, useRef } from "react";
import { getRandomColor } from "../../helpers/gifs";
import { IMessage, useMessagesContext } from "../../hooks/useMessagesContext";

import "./Message.css";

export const Message: React.FC<IMessage> = ({ gif, text, created, id }) => {
  const { selectedMessages, toggleSelection } = useMessagesContext();
  const ref = useRef<any>();

  const formatedDate = useMemo(() => created.toLocaleTimeString([], { timeStyle: "short" }), [created]);
  const isSelected = useMemo(() => Boolean(selectedMessages.find((selected) => id === selected.id)), [selectedMessages, id]);

  const onClickHandler = () => {
    toggleSelection({ gif, text, created, id });
  };


  // Скролл до нового сообщения, чтобы оно было видно сразу после появления
  useEffect(() => {
    console.log("scroll");
    ref.current.scrollIntoView({ behavior: "smooth" });
  }, []);


  return (
    <div ref={ref} className={isSelected ? "message message--selected" : "message"} onClick={onClickHandler}>
      <SelectedIcon isSelected={isSelected} />
      {gif ? <div className="message__content"
                  area-label="Фотография">
          <img src={gif.images.fixed_height.webp} alt={gif.title}
               style={{
                 background: getRandomColor(),
                 width: Number(gif.images.fixed_height.width),
                 height: Number(gif.images.fixed_height.height),
               }} draggable="false" />
        </div>
        : null}
      <div className="message__timestamp">
        {formatedDate}
      </div>
    </div>
  );
};

type SelectedIconProps = {
  isSelected: boolean
}

const SelectedIcon: React.FC<SelectedIconProps> = ({ isSelected }) => <svg
  className={isSelected ? "message__check message__check--selected" : "message__check"}
  xmlns="http://www.w3.org/2000/svg"
  width="16"
  height="16"
  viewBox="0 0 16 16">
  <path fill="currentColor" fillRule="evenodd"
        d="M8 15A7 7 0 118 1a7 7 0 010 14zM6 7.94a.75.75 0 10-1 1.12l1.46 1.3c.44.38 1.1.33 1.49-.1l.04-.05 2.9-3.75a.75.75 0 10-1.19-.92L7.1 8.91 6 7.94z">

  </path>
</svg>;

