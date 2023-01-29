import Toast from 'react-bootstrap/Toast';

const ToastComponent = ({ id, title, subtitle, inventory, onClose, variant }) => {
  let src = 'https://via.placeholder.com/20/cb444b?text='
  if (variant === 'warning') {
    src = 'https://via.placeholder.com/20/f6c444?text='
  } 
  return (
    <Toast bg={variant} onClose={() => onClose(id)}>
      <Toast.Header>
        <img src={src} className="rounded me-2" alt="" />
        <strong className="me-auto"> {title}</strong>
        <small>{subtitle}</small>
      </Toast.Header>
      <Toast.Body>The current inventory of this store is at {inventory}</Toast.Body>
    </Toast>
  );
}

export default ToastComponent;