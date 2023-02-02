import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import ModelComponent from './ModelComponent'


const  StoreComponent = ({ name, products = [] }) => (
  <Card>
    <Card.Header>{name}</Card.Header>
    <ListGroup>
      {products.map(model => (
        <ModelComponent key={model.id} name={model.attributes.modelName} inventory={model.attributes.inventory} />
      ))}
    </ListGroup>
  </Card>
);

export default StoreComponent;
