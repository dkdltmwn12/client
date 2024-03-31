import  { useEffect } from 'react'
import { createPortal } from 'react-dom';

export default function Modal({children}) {
  const modalRoot = document.getElementById('modal-root');
  const el = document.createElement('div');

  useEffect(() => {
    modalRoot.appendChild(el);
    return () => modalRoot.removeChild(el);
  }, [el, modalRoot]);

  return createPortal(children, el)
}
