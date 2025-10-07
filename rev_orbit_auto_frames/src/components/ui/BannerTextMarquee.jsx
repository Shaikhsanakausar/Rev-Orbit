import React, { useEffect, useState } from "react";
import { supabase } from "../../utils/supabaseClient";

export default function BannerTextMarquee({ className = "" }) {
  const [texts, setTexts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTexts = async () => {
      const { data } = await supabase.from("banner_texts").select("*");
      setTexts(data || []);
      setLoading(false);
    };
    fetchTexts();
  }, []);

  if (loading) return <div className="py-4 text-center">Loading banners…</div>;
  if (!texts.length) return null;

  return (
    <div className={`w-full bg-indigo-50 py-2 overflow-hidden ${className}`}>
      <marquee behavior="scroll" direction="left" scrollamount="7" className="text-indigo-700 text-lg font-semibold">
        {texts.map((t, idx) => (
          <span key={t.id || idx} style={{ marginRight: 40 }}>{t.text}</span>
        ))}
      </marquee>
    </div>
  );
}
