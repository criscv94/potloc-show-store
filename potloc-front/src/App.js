import { useEffect, useState } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import StoreComponent from './components/StoreComponent'
import ToastComponent from './components/Toast'
import './App.css';

const  App = () => {
  const [products, setProducts] = useState({});
  const [toasts, setToasts] = useState([])

  const closeToast = (storeId) => {
    setToasts(prevToasts => prevToasts.filter(toast => toast.id !== storeId))
  }

  useEffect(() => {
    const websocket = new WebSocket('ws://localhost:8080/');

    websocket.onopen = () => {
      console.log('connected');
    }

    websocket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      const { store, model, inventory } = data
      setProducts(prevProducts => ({
        ...prevProducts,
        [store]: {
          ...prevProducts[store],
          [model]: inventory,
        }
      }))
      const id = `${store}_${model}_${inventory}`
      if (inventory < 10) {
        setToasts(prevToasts => [
          ...prevToasts,
          { id, title: store, subtitle: 'Low inventory', inventory, variant: 'danger' }
        ])
      } else if (inventory > 90) {
        setToasts(prevToasts => [
          ...prevToasts,
          { id, title: store, subtitle: 'High inventory', inventory, variant: 'warning' }
        ])
      }
    }
  
    return () => {
      websocket.close()
    }
  }, [setProducts, setToasts])

  return (
    <Container>
      <Row >
        <Col md={8}>
          <Row>
            <Col md={12}>
              <Row>
                <Col md={6}>
                  {Object.keys(products).map(store => (
                    <StoreComponent key={store} name={store} store={products[store]} />
                  ))}
                </Col>
              </Row>
            </Col>
          </Row>
        </Col>
        <Col md={4}>
          {toasts.map(toast => <ToastComponent key={toast.id} {...toast} onClose={closeToast} />)}
        </Col>
      </Row>
    </Container>
  );
}

export default App;
