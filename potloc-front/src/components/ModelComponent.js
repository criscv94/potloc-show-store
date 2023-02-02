import ListGroup from 'react-bootstrap/ListGroup';


const  StoreComponent = ({ name, inventory }) => {
  let className = 'primary';
  if (inventory < 10) {
    className = 'danger'
  } else if (inventory > 50) {
    className = 'warning'
  }
  return (
    <ListGroup.Item variant={className}>
      {name}: {inventory}
    </ListGroup.Item>
  );
}

export default StoreComponent;
