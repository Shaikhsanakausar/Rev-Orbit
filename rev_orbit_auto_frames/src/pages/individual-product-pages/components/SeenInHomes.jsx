import React, { useState, useEffect } from "react";
import Image from "../../../components/AppImage";
import Icon from "../../../components/AppIcon";
import Button from "../../../components/ui/Button";
import { supabase } from "../../../utils/supabaseClient";

// ✅ Import background PNG
import LogoBg from "../../../assets/Vintage Automotive Logo Design.png";

const SeenInHomes = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedInstallation, setSelectedInstallation] = useState(null);
  const [showSubmitModal, setShowSubmitModal] = useState(false);

  // ✅ Supabase se data
  const [installations, setInstallations] = useState([]);

  const [uploading, setUploading] = useState(false);

  const [formData, setFormData] = useState({
    customerName: "",
    location: "",
    carModel: "",
    installDate: "",
    roomType: "living-room",
    story: "",
    image: null,
  });

  const categories = [
    { id: "all", label: "All Rooms", icon: "Home" },
    { id: "living-room", label: "Living Room", icon: "Sofa" },
    { id: "office", label: "Home Office", icon: "Briefcase" },
    { id: "garage", label: "Garage", icon: "Car" },
    { id: "bedroom", label: "Bedroom", icon: "Bed" },
  ];

  // ✅ Fetch installations from Supabase
  const fetchInstallations = async () => {
    const { data, error } = await supabase
      .from("installations")
      .select("*")
      .order("id", { ascending: false });

    if (error) {
      console.error("Fetch error:", error);
    } else {
      setInstallations(data);
    }
  };

  useEffect(() => {
    fetchInstallations();
  }, []);

  const filteredInstallations =
    installations?.filter(
      (installation) =>
        selectedCategory === "all" ||
        installation?.roomType === selectedCategory
    ) || [];

  // ✅ Handle file change
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, image: file });
    }
  };

  // ✅ Handle form submit (upload to Supabase)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);

    let imageUrl = null;

    if (formData.image) {
      const fileExt = formData.image.name.split(".").pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `uploads/${fileName}`;

      // Upload image to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from("uploads")
        .upload(filePath, formData.image);

      if (uploadError) {
        console.error("Upload error:", uploadError);
        setUploading(false);
        return;
      }

      // Get public URL
      const { data: publicUrlData } = supabase.storage
        .from("uploads")
        .getPublicUrl(filePath);

      imageUrl = publicUrlData.publicUrl;
    }

    // Insert record into Supabase table
    const { error } = await supabase.from("installations").insert([
      {
        customerName: formData.customerName,
        location: formData.location,
        carModel: formData.carModel,
        installDate: formData.installDate,
        roomType: formData.roomType,
        story: formData.story,
        imageUrl,
      },
    ]);

    if (error) {
      console.error("Insert error:", error);
    } else {
      fetchInstallations(); // Refresh list
      setShowSubmitModal(false);
      setFormData({
        customerName: "",
        location: "",
        carModel: "",
        installDate: "",
        roomType: "living-room",
        story: "",
        image: null,
      });
    }

    setUploading(false);
  };

  return (
    <div className="bg-card p-6 rounded-xl automotive-shadow">
      {/* Section Header */}
      <div className="flex items-center space-x-2 mb-6">
        <Icon name="Home" className="text-accent" />
        <h2 className="font-headline text-2xl font-bold">Seen in Homes</h2>
      </div>

      {/* Gallery */}
      {filteredInstallations.length > 0 ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredInstallations.map((installation) => (
            <div
              key={installation.id}
              className="group cursor-pointer"
              onClick={() => setSelectedInstallation(installation)}
            >
              <div className="relative rounded-lg overflow-hidden automotive-shadow">
                <Image
                  src={installation.imageUrl}
                  alt={`${installation.customerName}'s ${installation.roomType}`}
                  className="w-full h-64 object-cover"
                />
              </div>

              <div className="mt-3">
                <h4 className="font-medium">
                  {installation.customerName}'s Setup
                </h4>
                <p className="text-sm text-muted-foreground">
                  {installation.location}
                </p>

                {installation.story && (
                  <p className="text-xs text-muted-foreground italic line-clamp-2 mt-1">
                    {installation.story}
                  </p>
                )}

                <div className="flex items-center space-x-4 text-xs text-muted-foreground mt-2">
                  <div className="flex items-center space-x-1">
                    <Icon name="Car" size={12} />
                    <span>{installation.carModel}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Icon name="Calendar" size={12} />
                    <span>{installation.installDate}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-muted-foreground">
          No uploads yet. Be the first!
        </p>
      )}

      {/* Upload Button */}
      <div className="mt-8 pt-6 border-t border-border text-center">
        <h3 className="font-headline text-lg font-semibold mb-2">
          Show Off Your Setup
        </h3>
        <p className="text-muted-foreground mb-4">
          Share your installation and inspire other car enthusiasts
        </p>
        <Button
          variant="outline"
          iconName="Camera"
          iconPosition="left"
          onClick={() => setShowSubmitModal(true)}
        >
          Submit Your Photos
        </Button>
      </div>

      {/* Upload Modal */}
      {showSubmitModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card rounded-2xl shadow-2xl max-w-lg w-full p-6 relative overflow-hidden">
            {/* Background watermark */}
            <div
              className="absolute inset-0 opacity-10 blur-sm"
              style={{
                backgroundImage: `url(${LogoBg})`,
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center",
                backgroundSize: "200px",
              }}
            ></div>

            <div className="relative z-10">
              {/* Modal Header */}
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-headline text-xl font-bold">
                  Upload Your Setup
                </h3>
                <button
                  onClick={() => setShowSubmitModal(false)}
                  className="w-8 h-8 rounded-full bg-surface hover:bg-muted flex items-center justify-center"
                >
                  <Icon name="X" size={16} />
                </button>
              </div>

              {/* Form */}
              <form className="space-y-4" onSubmit={handleSubmit}>
                <input
                  type="text"
                  placeholder="Your Name"
                  value={formData.customerName}
                  onChange={(e) =>
                    setFormData({ ...formData, customerName: e.target.value })
                  }
                  className="w-full border rounded-lg px-3 py-2"
                  required
                />

                <input
                  type="text"
                  placeholder="Location"
                  value={formData.location}
                  onChange={(e) =>
                    setFormData({ ...formData, location: e.target.value })
                  }
                  className="w-full border rounded-lg px-3 py-2"
                  required
                />

                <input
                  type="text"
                  placeholder="Car Model"
                  value={formData.carModel}
                  onChange={(e) =>
                    setFormData({ ...formData, carModel: e.target.value })
                  }
                  className="w-full border rounded-lg px-3 py-2"
                  required
                />

                <input
                  type="month"
                  value={formData.installDate}
                  onChange={(e) =>
                    setFormData({ ...formData, installDate: e.target.value })
                  }
                  className="w-full border rounded-lg px-3 py-2"
                  required
                />

                <select
                  value={formData.roomType}
                  onChange={(e) =>
                    setFormData({ ...formData, roomType: e.target.value })
                  }
                  className="w-full border rounded-lg px-3 py-2"
                >
                  {categories
                    .filter((c) => c.id !== "all")
                    .map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.label}
                      </option>
                    ))}
                </select>

                <textarea
                  placeholder="Write your story..."
                  value={formData.story}
                  onChange={(e) =>
                    setFormData({ ...formData, story: e.target.value })
                  }
                  className="w-full border rounded-lg px-3 py-2"
                  rows="3"
                ></textarea>

                <input type="file" onChange={handleFileChange} />
                {formData.image && (
                  <p className="text-xs text-muted-foreground mt-1">
                    File selected: {formData.image.name}
                  </p>
                )}

                <Button
                  type="submit"
                  variant="default"
                  iconName="Upload"
                  iconPosition="left"
                  className="w-full"
                  disabled={uploading}
                >
                  {uploading ? "Uploading..." : "Submit"}
                </Button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SeenInHomes;
