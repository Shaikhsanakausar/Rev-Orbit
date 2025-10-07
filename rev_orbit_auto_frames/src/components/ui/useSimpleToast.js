import { useState } from 'react';

export default function useSimpleToast(timeout = 2500) {
  const [toast, setToast] = useState(null);
  function showToast(message) {
    setToast(message);
    setTimeout(() => setToast(null), timeout);
  }
  function ToastComponent() {
    if (!toast) return null;
    return (
      <div style={{position:'fixed',bottom:24,left:'50%',transform:'translateX(-50%)',background:'#222',color:'#fff',padding:'12px 24px',borderRadius:8,zIndex:9999,boxShadow:'0 2px 8px #0003',fontSize:16}}>
        {toast}
      </div>
    );
  }
  return [ToastComponent, showToast];
}
