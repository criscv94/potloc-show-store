import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import ModelComponent from './ModelComponent'


const  StoreComponent = ({ name, store = {} }) => {
  return (
    <Card>
      <Card.Header>{name}</Card.Header>
      <ListGroup>
        {Object.keys(store).map(model => (
          <ModelComponent key={model} model={model} inventory={store[model]} />
        ))}
      </ListGroup>
    </Card>
  );
}

export default StoreComponent;
