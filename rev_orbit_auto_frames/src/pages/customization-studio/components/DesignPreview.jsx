import React, { useState } from "react";
import Icon from "../../../components/AppIcon";
import Image from "../../../components/AppImage";
import Button from "../../../components/ui/Button";

const DesignPreview = ({
  frameStyle,
  material,
  selectedPhoto,
  personalization,
  features,
}) => {
  const [previewMode, setPreviewMode] = useState("frame");

  const getFrameStyle = () => {
    if (!frameStyle) return {};
    const styles = {
      classic: {
        border: "12px solid #8B4513",
        borderRadius: "4px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
        background: "linear-gradient(145deg, #A0522D, #8B4513)",
      },
      shadowbox: {
        border: "8px solid #2D2D2D",
        borderRadius: "2px",
        boxShadow:
          "0 8px 24px rgba(0,0,0,0.4), inset 0 0 20px rgba(255,255,255,0.1)",
        background: "linear-gradient(145deg, #3D3D3D, #2D2D2D)",
        padding: "20px",
      },
      custom: {
        border: "10px solid #C41E3A",
        borderRadius: "8px",
        boxShadow: "0 6px 20px rgba(196,30,58,0.3)",
        background: "linear-gradient(145deg, #E53E3E, #C41E3A)",
        position: "relative",
      },
    };
    return styles?.[frameStyle?.id] || styles?.classic;
  };

  const getMaterialOverlay = () => {
    if (!material) return {};
    const overlays = {
      carbon: {
        backgroundImage:
          "repeating-linear-gradient(45deg, transparent, transparent 2px, rgba(255,255,255,0.1) 2px, rgba(255,255,255,0.1) 4px)",
        border: "8px solid #1A1A1A",
      },
      aluminum: {
        background: "linear-gradient(145deg, #E8E8E8, #C0C0C0)",
        border: "8px solid #A0A0A0",
      },
      titanium: {
        background: "linear-gradient(145deg, #F0F0F0, #D0D0D0)",
        border: "8px solid #B0B0B0",
      },
    };
    return overlays?.[material?.id] || {};
  };

  const getBackgroundColor = () => {
    if (!features?.background) return "transparent";
    const colors = {
      white: "#FFFFFF",
      black: "#000000",
      "racing-red": "#C41E3A",
      carbon: "#2D2D2D",
      metallic: "#C0C0C0",
    };
    return colors?.[features?.background] || "transparent";
  };

  const getLightingEffect = () => {
    if (!features?.lighting || features?.lighting === "none") return {};
    const effects = {
      "warm-led": {
        boxShadow:
          "0 0 30px rgba(255, 200, 100, 0.6), inset 0 0 20px rgba(255, 200, 100, 0.2)",
      },
      "cool-led": {
        boxShadow:
          "0 0 30px rgba(100, 200, 255, 0.6), inset 0 0 20px rgba(100, 200, 255, 0.2)",
      },
      "rgb-led": {
        boxShadow:
          "0 0 30px rgba(255, 100, 255, 0.6), inset 0 0 20px rgba(255, 100, 255, 0.2)",
        animation: "rgb-glow 3s ease-in-out infinite alternate",
      },
      spotlight: {
        background:
          "radial-gradient(circle at center, rgba(255,255,255,0.3) 0%, transparent 70%)",
      },
    };
    return effects?.[features?.lighting] || {};
  };

  const getPersonalizationStyle = () => {
    if (!personalization?.text) return {};
    const positions = {
      "bottom-center": {
        bottom: "10px",
        left: "50%",
        transform: "translateX(-50%)",
      },
      "bottom-right": { bottom: "10px", right: "10px" },
      "bottom-left": { bottom: "10px", left: "10px" },
      "top-center": { top: "10px", left: "50%", transform: "translateX(-50%)" },
      center: { top: "50%", left: "50%", transform: "translate(-50%, -50%)" },
    };
    return {
      position: "absolute",
      fontSize: personalization?.size === "large" ? "20px" : "16px",
      color: personalization?.color || "#000",
      fontWeight: "600",
      zIndex: 10,
      ...positions?.[personalization?.position],
    };
  };

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex items-center justify-between">
        <h2 className="font-headline text-2xl font-bold text-primary">
          Live Preview
        </h2>
        <div className="flex items-center space-x-2">
          <Button
            variant="default"
            size="sm"
            onClick={() => setPreviewMode("frame")}
          >
            Frame
          </Button>
        </div>
      </div>

      {/* Preview */}
      <div className="bg-muted rounded-xl p-8 min-h-[500px] flex items-center justify-center">
        {previewMode === "frame" && (
          <div
            className="relative"
            style={{
              ...getFrameStyle(),
              ...getMaterialOverlay(),
              ...getLightingEffect(),
              width: "400px",
              height: "300px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              overflow: "hidden",
            }}
          >
            {/* Background Layer */}
            <div
              className="absolute inset-0 rounded-sm"
              style={{
                margin: frameStyle?.id === "shadowbox" ? "20px" : "8px",
                backgroundColor: getBackgroundColor(),
                backgroundImage:
                  features?.backgroundPreview
                    ? `url(${features.backgroundPreview})`
                    : "none",
                backgroundSize: "cover",
                backgroundPosition: "center",
                zIndex: 1,
              }}
            />

            {/* Car Image Layer */}
            {selectedPhoto ? (
              <div
                className="absolute inset-0 flex items-center justify-center"
                style={{ zIndex: 2 }}
              >
                <Image
                  src={selectedPhoto?.image}
                  alt={selectedPhoto?.name}
                  className="w-full h-full object-contain"
                  style={{ borderRadius: frameStyle?.id === "shadowbox" ? "8px" : "4px" }}
                />
              </div>
            ) : (
              <div
                className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground"
                style={{ zIndex: 2 }}
              >
                <Icon name="Image" size={48} />
                <p className="text-sm">Add your car photo</p>
              </div>
            )}

            {/* Personalization Layer */}
            {personalization?.text && (
              <div style={{ ...getPersonalizationStyle(), zIndex: 3 }}>
                {personalization?.text}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default DesignPreview;
