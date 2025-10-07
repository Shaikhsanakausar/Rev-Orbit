// Debug utility for Products Table: log all products to help diagnose join/mapping issues
import React, { useEffect, useState, useCallback } from "react";
import { supabase } from "../../utils/supabaseClient";

const ProductsDebug = () => {
  const [rawData, setRawData] = useState(null);
  const [error, setError] = useState(null);

  const fetchRawProducts = useCallback(async () => {
    const { data, error } = await supabase
      .from("product")
      .select("*");
    setRawData(data);
    setError(error);
  }, []);

  useEffect(() => {
    fetchRawProducts();
  }, [fetchRawProducts]);

  return (
    <div style={{ padding: 20 }}>
      <h2>Raw Product Table Data</h2>
      {error && <div style={{ color: 'red' }}>Error: {error.message}</div>}
      <pre style={{ background: '#eee', padding: 10, borderRadius: 4 }}>
        {JSON.stringify(rawData, null, 2)}
      </pre>
    </div>
  );
};

export default ProductsDebug;
