import PropTypes from 'prop-types';

import { createPortal } from 'react-dom';
import { useEffect } from 'react';

const modalRoot = document.querySelector('#modal-root');

export default function Modal({ modalImage, tags, onClose }) {
  const handleBackdropClick = e => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  useEffect(() => {
    const handleEsc = e => {
      if (e.code === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEsc);

    return window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  return createPortal(
    <div className="Overlay" onClick={handleBackdropClick}>
      <div className="Modal">
        <img src={modalImage} alt={tags} />
      </div>
    </div>,
    modalRoot
  );
}

Modal.propTypes = {
  modalImage: PropTypes.string,
  tags: PropTypes.string,
  onClose: PropTypes.func,
};
