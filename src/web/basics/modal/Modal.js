import React, { useEffect, useRef } from "react";
import styled, { ThemeProvider } from "styled-components";

import { customScrollbar, PALETTE, toREM, Z_INDEX } from "constants/styles";

import { closeModal } from "helpers/modal";

import { BlankButton } from "basics";

import Cross30Icon from "assets/icons/cross30.svg";
import { KEY_CODES } from "constants/keyCodes";

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100%;

  z-index: ${Z_INDEX.overlay};
  overflow: auto;
  color: ${PALETTE.getText};
  transition: transform 0.5s ease;

  display: flex;
  justify-content: center;
  align-items: center;

  background-color: ${({ theme }) =>
    `rgba(0, 0, 0, ${theme.isDarkMode ? "0.7" : "0.2"})`};
`;

const Wrapper = styled.div`
  margin 0 5vw 10vh 5vw;
  width: 800px;
  height: 450px;
  max-height: 450px;
  background-color: ${PALETTE.getPageBackground};
  color: ${PALETTE.getText};

  border-radius: 15px;
  border: 2px solid ${PALETTE.getBorderColor};
  box-shadow: 0 5px 30px rgba(0, 0, 0, 0.3);
  
  overflow: hidden;
`;

// TODO: move to constants MODAL_HEADER_HEIGHT
const MODAL_HEADER_HEIGHT = 87;
const ScrollWrapper = styled.div`
  height: calc(100% - ${MODAL_HEADER_HEIGHT}px);
  width: 100%;

  overflow-y: auto;
  ${customScrollbar};
`;

const Header = styled.div`
  width: 100%;
  padding: 15px 30px;

  display: flex;
  justify-content: space-between;
  align-items: center;

  // border-bottom: 2px solid ${PALETTE.getBorderColor};
`;

const Title = styled.h2`
  font-size: ${toREM(20)};
  font-weight: 500;
  white-space: nowrap;
`;

const CloseButton = styled(BlankButton)`
  margin-right: 10px;
  width: 35px;
  height: 35px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: ${PALETTE.getText};
  opacity: 0.5;

  &:focus {
    opacity: 1;
    border: 2px solid ${PALETTE.blue};
  }
`;

const Modal = ({
  children,
  id,
  className,
  title,
  isCloseOnOverlayClick = true,
}) => {
  // TODO: move to constants
  const MODAL_WRAPPER_ID = "modal_wrapper";

  const overlayRef = useRef(null);

  const onKeyDown = e => {
    if (e.keyCode === KEY_CODES.esc) {
      closeModal(id);
    }
  };

  const onCloseOverlay = e => {
    if (!e.target.closest(`#${MODAL_WRAPPER_ID}`)) {
      closeModal(id);
    }
  };

  const onCloseButton = () => {
    closeModal(id);
  };

  useEffect(() => {
    // autoFocus for onKeyDown
    overlayRef.current.focus();
  }, []);

  const conditionalOverlayProps = isCloseOnOverlayClick && {
    onClick: onCloseOverlay,
    onKeyDown,
  };

  return (
    <ThemeProvider theme={th => ({ ...th, isDarkMode: true })}>
      <Overlay
        ref={overlayRef}
        role="button"
        id={id}
        tabIndex={0}
        {...conditionalOverlayProps}
      >
        <Wrapper id={MODAL_WRAPPER_ID} className={className}>
          <Header>
            <Title>{title}</Title>
            <CloseButton onClick={onCloseButton}>
              <Cross30Icon />
            </CloseButton>
          </Header>
          <ScrollWrapper>{children}</ScrollWrapper>
        </Wrapper>
      </Overlay>
    </ThemeProvider>
  );
};

export default Modal;
