import React, { useState } from 'react';
import OrderItemsList from './components/OrderItemsList';

const OrderConfirmation = ({ orderData, customDesign }) => {
  const orderId = orderData?.id || orderData?.order_id;
  const [showDesign, setShowDesign] = useState(false);
  const isCustomOrder = !!customDesign || !!orderData?.design_json;
  const designData = customDesign || orderData?.design_json;
  const designImage = designData?.selectedPhoto?.url || orderData?.design_image_url;

  return (
    <div style={{textAlign: 'center', marginTop: 40}}>
      <h2>Order Confirmed!</h2>
      <p>Your payment was successful. Thank you for your order.</p>
      <div style={{marginTop: 24, marginBottom: 24}}>
        <strong>Order ID:</strong> {orderId}
      </div>
      {isCustomOrder && (
        <div style={{marginBottom: 32}}>
          <h3 style={{marginBottom: 8}}>Product Details</h3>
          <div><strong>Frame Style:</strong> {designData?.frameStyle?.name}</div>
          <div><strong>Material:</strong> {designData?.material?.name}</div>
          <div><strong>Personalization:</strong> {designData?.personalization?.text}</div>
          <div><strong>Price:</strong> ₹{designData?.frameStyle?.price}</div>
          <div style={{marginTop: 16}}>
            <button onClick={() => setShowDesign(v => !v)} style={{padding: '8px 16px', background: '#e11d48', color: 'white', border: 'none', borderRadius: 4, cursor: 'pointer'}}>
              {showDesign ? 'Hide Design' : 'View Design'}
            </button>
          </div>
          {showDesign && designImage && (
            <div style={{marginTop: 16}}>
              <img src={designImage} alt="Custom Design" style={{maxWidth: 400, borderRadius: 8, boxShadow: '0 2px 8px #0002'}} />
            </div>
          )}
          {showDesign && !designImage && (
            <div style={{marginTop: 16, color: '#888'}}>No design image available.</div>
          )}
        </div>
      )}
      {!isCustomOrder && orderId && (
        <div style={{marginTop: 32}}>
          <OrderItemsList order_id={orderId} />
        </div>
      )}
    </div>
  );
};

export default OrderConfirmation;
