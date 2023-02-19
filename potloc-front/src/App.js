import { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import consumer from './cable';
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
      if (inventory[storeItem.attributes.storeId]) {
        inventory[storeItem.attributes.storeId].push(storeItem)
      } else {
        inventory[storeItem.attributes.storeId] = [storeItem]
      }
    })
    return inventory
  }

  const updateToasts = ({ inventory, id, title, model, storeId }) => {
    if (inventory > 10 && inventory < 50) return;

    let subtitle = 'Low inventory';
    let variant = 'danger';
    const message = `The current inventory for ${model} in this store is at ${inventory}`
    if (inventory > 50) {
      variant = 'warning';
      subtitle = 'High inventory';
    }

    setToasts(prevToasts => [
      ...prevToasts.filter(toast => toast.id !== id),
      { id, title, storeId, subtitle, variant, message }
    ])
  } 

  const updateProducts = useCallback( ({ store, model, inventory }) => {
    setProducts(prevProducts => {
      if (!prevProducts[store.id]) return prevProducts;
      const storeProducts = prevProducts[store.id]
      const productIndex = storeProducts.findIndex(item => item.attributes.modelName === model)
      if (!productIndex) return prevProducts;      
      updateToasts({ title: store.attributes.name, inventory, id: `${store.id}_${model}`, model, storeId: store.id })
      storeProducts[productIndex].attributes.inventory = inventory
      return {
        ...prevProducts,
        [store]: storeProducts
      }
    })
  }, [])

  const addRecommendation = useCallback( ({ originalStore, store, model }) => {
    const id = 'test';
    const message = `Request transfer of ${model} from ${store.attributes.name}`
    setToasts(prevToasts => [
      ...prevToasts.filter(toast => toast.id !== id),
      {
        id,
        title: originalStore.name,
        storeId: originalStore.id,
        subtitle: 'Transfer suggestion',
        variant: 'info',
        message,
      }
    ])
  }, [])

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
    if (stores.length === 0) return;
    stores.forEach(store => {
      consumer.subscriptions.create({
        channel: 'StoresChannel',
        store_id: store.id,
      }, {
        received: ({ body, type: eventType }) => {
          const { data } = body;
          if (eventType === 'inventory') {
            const { inventory, modelName: model } = data.attributes
            const store = stores.find(st => parseInt(st.id) === data.attributes.storeId)
            updateProducts({ store, model, inventory })
          } else if (eventType === 'recommend') {
            const { inventory, modelName: model, storeId } = data.data.attributes
            const { original_store: originalStore } = body;
            const store = stores.find(st => parseInt(st.id) === storeId)
            addRecommendation({ originalStore, store, model, inventory })
          }
        }
      })  
    })
  
    return () => {
      consumer.disconnect()
    }
  }, [stores, updateProducts, addRecommendation])

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
                products={products[store.id]}
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
