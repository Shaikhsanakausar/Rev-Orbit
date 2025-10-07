import React, { useState } from 'react';
import { supabase } from '../../utils/supabaseClient';
import { useEffect } from 'react';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Switch from "../../components/ui/Switch.jsx";
// import BannerUpload from "../../components/ui/BannerUpload.jsx";

export default function AdminSettings() {
  const [bannerTexts, setBannerTexts] = useState([]);
  const [newBannerText, setNewBannerText] = useState("");
  const [adminEmail, setAdminEmail] = useState('patelsuraj32104@gmail.com');
  const [siteTitle, setSiteTitle] = useState('REV-orbit Auto Frames');
    const [settings, setSettings] = useState({ maintenance_mode: false, site_title: "" });
    const [loading, setLoading] = useState(true);

    // Fetch settings and banners on mount
    useEffect(() => {
      const fetchSettings = async () => {
        const { data, error } = await supabase.from("settings").select("*").single();
        if (error || !data) {
          setSettings(null);
        } else {
          setSettings(data);
        }
        setLoading(false);
      };
      fetchSettings();

      // Fetch banner texts from Supabase table
      const fetchBannerTexts = async () => {
        const { data, error } = await supabase.from("banner_texts").select("*");
        if (data) setBannerTexts(data);
      };
      fetchBannerTexts();

      // Real-time subscription
      const channel = supabase
        .channel("settings")
        .on("postgres_changes", { event: "*", schema: "public", table: "settings" }, (payload) => {
          if (payload.new) setSettings(payload.new);
        })
        .subscribe();

      return () => supabase.removeChannel(channel);
    }, []);
    // Add new banner text
    const handleAddBannerText = async () => {
      if (!newBannerText.trim()) return;
      const { data, error } = await supabase.from("banner_texts").insert({ text: newBannerText }).select();
      if (!error && data) {
        setBannerTexts(b => [...b, data[0]]);
        setNewBannerText("");
      }
    };

    // Delete banner text
    const handleDeleteBannerText = async (id) => {
      await supabase.from("banner_texts").delete().eq("id", id);
      setBannerTexts(b => b.filter(x => x.id !== id));
    };

    // Update maintenance mode
    const handleToggle = async (value) => {
      if (!settings || !settings.id) return;
      setSettings((s) => ({ ...s, maintenance_mode: value }));
      await supabase.from("settings").update({ maintenance_mode: value }).eq("id", settings.id);
    };

    // Update site title
    const handleTitleSave = async () => {
      if (!settings || !settings.id) return;
      await supabase.from("settings").update({ site_title: settings.site_title }).eq("id", settings.id);
    };

    if (loading) return <div className="p-8">Loading settings…</div>;
    if (!settings || !settings.id) {
      return (
        <div className="max-w-xl mx-auto py-10 px-4">
          <h2 className="font-headline text-2xl font-bold mb-8 text-indigo-700">Admin Settings</h2>
          <div className="text-red-600 font-bold">No settings found. Please add a row in Supabase settings table.</div>
        </div>
      );
    }

    return (
      <div className="max-w-xl mx-auto py-10 px-4">
        <h2 className="font-headline text-2xl font-bold mb-8 text-indigo-700">Admin Settings</h2>
        <div className="mb-8 flex items-center gap-4">
          <span className="font-semibold text-lg">Maintenance Mode:</span>
          <Switch checked={settings.maintenance_mode} onChange={handleToggle} />
          <span className={settings.maintenance_mode ? "text-red-600 font-bold" : "text-green-600 font-bold"}>
            {settings.maintenance_mode ? "ON" : "OFF"}
          </span>
        </div>
        <div className="mb-8">
          <label className="block font-semibold mb-2">Site Title:</label>
          <input
            type="text"
            value={settings.site_title}
            onChange={e => setSettings(s => ({ ...s, site_title: e.target.value }))}
            className="w-full px-4 py-2 border rounded-lg mb-2"
          />
          <Button onClick={handleTitleSave}>Save Title</Button>
        </div>
        <div className="mb-8">
          <label className="block font-semibold mb-2">Banner Texts (Marquee):</label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={newBannerText}
              onChange={e => setNewBannerText(e.target.value)}
              className="px-4 py-2 border rounded-lg w-full"
              placeholder="Enter banner text..."
            />
            <Button onClick={handleAddBannerText}>Add</Button>
          </div>
          <ul className="space-y-2">
            {bannerTexts.map(banner => (
              <li key={banner.id} className="flex items-center gap-2">
                <span className="bg-indigo-100 px-3 py-1 rounded text-indigo-700">{banner.text}</span>
                <Button variant="danger" size="sm" onClick={() => handleDeleteBannerText(banner.id)}>Delete</Button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    );

  return (
    <div className="bg-gradient-to-br from-indigo-50 via-blue-50 to-cyan-50 
                    min-h-screen p-8 flex flex-col items-center justify-center">
      <div className="w-full max-w-xl bg-white/80 backdrop-blur-lg 
                      rounded-2xl shadow-xl border border-blue-200 p-8 
                      transition-all duration-1000 ease-in-out 
                      hover:shadow-blue-200 hover:scale-[1.01]">
        
        <h1 className="text-3xl font-bold mb-8 text-gray-800 drop-shadow-sm">
          Admin Settings
        </h1>

        <form onSubmit={handleSave} className="space-y-6">
          {/* Admin Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Admin Email
            </label>
            <Input
              type="email"
              value={adminEmail}
              onChange={e => setAdminEmail(e.target.value)}
              required
              className="w-full rounded-lg border-gray-300 focus:ring-2 
                         focus:ring-blue-400 focus:border-blue-400 transition"
            />
          </div>

          {/* Site Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Site Title
            </label>
            <Input
              value={siteTitle}
              onChange={e => setSiteTitle(e.target.value)}
              required
              className="w-full rounded-lg border-gray-300 focus:ring-2 
                         focus:ring-blue-400 focus:border-blue-400 transition"
            />
          </div>

          {/* Save Button */}
          <div className="pt-2">
            <Button 
              type="submit" 
              loading={loading} 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 
                         rounded-lg shadow-md transition-all duration-700 ease-in-out 
                         hover:scale-105 hover:shadow-lg"
            >
              Save Settings
            </Button>
          </div>

          {/* Messages */}
          {success && <div className="text-green-600 mt-4 font-semibold">{success}</div>}
          {error && <div className="text-red-500 mt-4 font-semibold">{error}</div>}
        </form>
      </div>
    </div>
  );
}
