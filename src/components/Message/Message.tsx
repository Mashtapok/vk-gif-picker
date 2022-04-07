import React, { useEffect, useMemo, useRef } from "react";
import { getRandomColor } from "../../helpers/gifs";
import { IMessage, useMessagesContext } from "../../hooks/useMessagesContext";
import { IconSelected } from "../../icons";

import "./Message.css";

export const Message: React.FC<IMessage> = ({ gif, text, created, id }) => {
  const { selectedMessages, toggleSelection } = useMessagesContext();
  const ref = useRef<any>();

  const formatedDate = useMemo(
    () => created.toLocaleTimeString([], { timeStyle: "short" }),
    [created],
  );
  const isSelected = useMemo(
    () => Boolean(selectedMessages.find(selected => id === selected.id)),
    [selectedMessages, id],
  );

  const onClickHandler = () => {
    toggleSelection({ gif, text, created, id });
  };

  // Скролл к новому сообщению после его добавления
  useEffect(() => {
    ref.current.scrollIntoView({ behavior: "smooth" });
  }, []);

  const classNames = useMemo(() => {
    let result = "message";

    if (gif) {
      result += " message--gif";
    }
    if (isSelected) {
      result += " message--selected";
    }
    return result;
  }, [gif, isSelected]);

  return (
    <div ref={ref} className={classNames} onClick={onClickHandler}>
      <IconSelected
        className={isSelected ? "message__check message__check--selected" : "message__check"}
      />
      <div className="message__content">
        {text && <span>{text}</span>}
        {gif && (
          <img
            src={gif.images.fixed_height.webp || gif.images.fixed_height.url}
            alt={gif.title}
            style={{
              background: getRandomColor(),
              width: Number(gif.images.fixed_height.width),
              height: Number(gif.images.fixed_height.height),
            }}
            draggable="false"
          />
        )}
      </div>
      <div className="message__timestamp">{formatedDate}</div>
    </div>
  );
};
