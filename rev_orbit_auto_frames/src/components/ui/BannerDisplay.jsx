import React, { useEffect, useState } from "react";
import { supabase } from "../../utils/supabaseClient";

export default function BannerDisplay({ className = "" }) {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBanners = async () => {
      const { data, error } = await supabase.storage.from("banners").list("", { limit: 20 });
      if (data) {
        const urls = await Promise.all(
          data.filter(f => f.name).map(async f => {
            const { data: urlData } = await supabase.storage.from("banners").getPublicUrl(f.name);
            return { url: urlData.publicUrl, name: f.name };
          })
        );
        setBanners(urls);
      }
      setLoading(false);
    };
    fetchBanners();
  }, []);

  if (loading) return <div className="py-8 text-center">Loading banners…</div>;
  if (!banners.length) return null;

  return (
    <div className={`w-full flex flex-row gap-4 overflow-x-auto py-4 ${className}`}>
      {banners.map((banner, idx) => (
        <img
          key={banner.name || idx}
          src={banner.url}
          alt="Banner"
          className="h-40 rounded-xl shadow-lg object-cover"
          style={{ minWidth: 320 }}
        />
      ))}
    </div>
  );
}
