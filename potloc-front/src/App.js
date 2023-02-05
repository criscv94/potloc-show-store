import { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import StoreComponent from './components/StoreComponent'
import ToastComponent from './components/Toast'
import './App.css';

const  App = () => {
  const [products, setProducts] = useState({});
  const [activeKey, setActiveKey] = useState('1')
  const [stores, setStores] = useState([]);
  const [toasts, setToasts] = useState([])

  const closeToast = (toastId) => {
    setToasts(prevToasts => prevToasts.filter(toast => toast.id !== toastId))
  }

  const parseInventoryData = (storeItemsData) => {
    const inventory = {}
    storeItemsData.forEach((storeItem) => {
      if (inventory[storeItem.attributes.storeName]) {
        inventory[storeItem.attributes.storeName].push(storeItem)
      } else {
        inventory[storeItem.attributes.storeName] = [storeItem]
      }
    })
    return inventory
  }

  const updateToasts = ({ inventory, id, store, storeId, model }) => {
    if (inventory < 10) {
      setToasts(prevToasts => [
        ...prevToasts.filter(toast => toast.id !== id),
        { id, storeId, title: store, model, subtitle: 'Low inventory', inventory, variant: 'danger' }
      ]);
    } else if (inventory > 90) {
      setToasts(prevToasts => [
        ...prevToasts.filter(toast => toast.id !== id),
        { id, storeId, title: store, model, subtitle: 'High inventory', inventory, variant: 'warning' }
      ])
    }
  } 

  const updateProducts = useCallback( ({ store, model, inventory }) => {
    setProducts(prevProducts => {
      if (!prevProducts[store]) return prevProducts;
      const storeProducts = prevProducts[store]
      const productIndex = storeProducts.findIndex(item => item.attributes.modelName === model)
      if (!productIndex) return prevProducts;

      const storeId = stores.find(item => item.attributes.name === store).id
      updateToasts({ store, inventory, id: `${storeId}_${model}`, storeId, model })
      storeProducts[productIndex].attributes.inventory = inventory
      return {
        ...prevProducts,
        [store]: storeProducts
      }
    })
  }, [stores])

  const clickTab = (storeId) => {
    setActiveKey(storeId)
  }

  useEffect(() => {
    const fetchStores = async () => {
      await axios.get('http://127.0.0.1:3000/stores')
        .then(({ data }) => {
          const { data: storeResponse } = data;
          setStores(storeResponse)
        } )
    }
    fetchStores();
  }, [])

  useEffect(() => {
    const fetchProducts = async () => {
      await axios.get('http://127.0.0.1:3000/store_items')
        .then(({ data }) => {
          const { data: storeItems } = data;
          const parsedProducts = parseInventoryData(storeItems)
          setProducts(parsedProducts)
        } )
    }
    fetchProducts();
  }, [])

  useEffect(() => {
    const websocket = new WebSocket('ws://localhost:8080/');

    websocket.onopen = () => {
      console.log('connected');
    }

    websocket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      updateProducts(data)
    }
  
    return () => {
      websocket.close()
    }
  }, [updateProducts])

  return (
    <Row >
      <Col md={8} className='px-5'>
        <h3 className="my-5"> Stores </h3>
        <Tabs
          id="uncontrolled-tab-example"
          activeKey={activeKey}
          className="mb-3"
          variant='pills'
          onSelect={setActiveKey}
        >
          {stores.map(store => (
            <Tab eventKey={store.id} title={store.attributes.name}>
              <StoreComponent 
                key={store.id}
                name={store.attributes.name}
                products={products[store.attributes.name]}
              />
            </Tab>
          ))}            
        </Tabs>
      </Col>
      <Col md={4}>
        <h3 className="my-5"> Notifications </h3>
        {toasts.map(toast => (
          <ToastComponent
            key={toast.id}
            {...toast}
            onClose={closeToast}
            onClick={() => clickTab(toast.storeId)}
          />
        ))}
      </Col>
    </Row>
  );
}

export default App;
