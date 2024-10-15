import React, { useState, useRef, useEffect } from "react";
import html2canvas from "html2canvas";

const VinylImageConverter = () => {
  const [borderWidth, setBorderWidth] = useState(10);
  const [vinylSize, setVinylSize] = useState(250);
  const [vinylColor, setVinylColor] = useState("#0000FF");
  const [uploadedImage, setUploadedImage] = useState(
    "/api/placeholder/300/300"
  );
  const [showProModal, setShowProModal] = useState(false);
  const [isSpinning, setIsSpinning] = useState(false);
  const [isGeneratingGif, setIsGeneratingGif] = useState(false);
  const vinylRef = useRef(null);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/gif.js/0.2.0/gif.js";
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setUploadedImage(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleDownload = () => {
    if (vinylRef.current) {
      const vinylElement = vinylRef.current;

      html2canvas(vinylElement).then((canvas) => {
        const link = document.createElement("a");
        link.download = "vinyl_art.png";
        link.href = canvas.toDataURL();
        link.click();
      });
    }
  };

  const handleGifDownload = async () => {
    if (vinylRef.current && window.GIF) {
      setIsGeneratingGif(true);
      const vinylElement = vinylRef.current;
      const gif = new window.GIF({
        workers: 2,
        quality: 10,
        width: vinylSize,
        height: vinylSize,
      });

      for (let i = 0; i < 36; i++) {
        vinylElement.style.transform = `rotate(${i * 10}deg)`;
        await new Promise((resolve) => setTimeout(resolve, 50));
        const canvas = await html2canvas(vinylElement);
        gif.addFrame(canvas, { delay: 50 });
      }

      gif.on("finished", (blob) => {
        const link = document.createElement("a");
        link.download = "vinyl_art.gif";
        link.href = URL.createObjectURL(blob);
        link.click();
        setIsGeneratingGif(false);
        vinylElement.style.transform = "rotate(0deg)";
      });

      gif.render();
    }
  };

  const toggleSpin = () => {
    setIsSpinning(!isSpinning);
  };

  const ProModal = () => (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.7)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
      }}
    >
      <div
        style={{
          backgroundColor: "white",
          padding: "20px",
          borderRadius: "10px",
          maxWidth: "500px",
          width: "90%",
        }}
      >
        <h2 style={{ color: "#4a4a4a" }}>Upgrade to Pro</h2>
        <ul style={{ color: "#4a4a4a", paddingLeft: "20px" }}>
          <li>Unlimited AI-generated vinyl art</li>
          <li>Advanced customization options</li>
          <li>Priority customer support</li>
          <li>Early access to new features</li>
        </ul>
        <p style={{ color: "#4a4a4a", fontWeight: "bold" }}>
          Price: $9.99/month
        </p>
        <button
          onClick={() =>
            alert(
              "This is a mock checkout. In a real app, this would process the payment."
            )
          }
          style={{
            padding: "10px 20px",
            fontSize: "1rem",
            backgroundColor: "#4CAF50",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            marginRight: "10px",
          }}
        >
          Checkout
        </button>
        <button
          onClick={() => setShowProModal(false)}
          style={{
            padding: "10px 20px",
            fontSize: "1rem",
            backgroundColor: "#f44336",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Close
        </button>
      </div>
    </div>
  );

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(to bottom right, #d15992, #e05c92)",
        fontFamily: "Arial, sans-serif",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "20px",
        boxSizing: "border-box",
        overflowY: "auto",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "500px",
          backgroundColor: "rgba(255, 255, 255, 0.9)",
          borderRadius: "15px",
          padding: "20px",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          marginBottom: "20px",
        }}
      >
        <h1
          style={{ fontSize: "2rem", color: "#4a4a4a", marginBottom: "10px" }}
        >
          Vinyl AI Art Generator
        </h1>
        <p style={{ fontSize: "1rem", color: "#888", marginBottom: "20px" }}>
          Create unique vinyl-style art
        </p>

        <button
          style={{
            width: "100%",
            padding: "10px",
            fontSize: "1rem",
            backgroundColor: "#4CAF50",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            marginBottom: "20px",
          }}
        >
          🖼️ Generate AI Art
        </button>

        <div style={{ marginBottom: "20px" }}>
          <label
            htmlFor="file-upload"
            style={{
              padding: "10px",
              backgroundColor: "#f0f0f0",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Browse...
          </label>
          <input
            id="file-upload"
            type="file"
            onChange={handleImageUpload}
            accept="image/*"
            style={{ display: "none" }}
          />
          <span style={{ marginLeft: "10px" }}>No file selected.</span>
        </div>

        {["Border Width", "Vinyl Size"].map((label, index) => (
          <div key={label} style={{ marginBottom: "20px" }}>
            <label style={{ display: "block", marginBottom: "5px" }}>
              {label}
            </label>
            <input
              type="range"
              min={index === 0 ? 0 : 100}
              max={index === 0 ? 50 : 400}
              value={index === 0 ? borderWidth : vinylSize}
              onChange={(e) =>
                index === 0
                  ? setBorderWidth(e.target.value)
                  : setVinylSize(e.target.value)
              }
              style={{ width: "100%" }}
            />
          </div>
        ))}

        <div style={{ marginBottom: "20px" }}>
          <label style={{ display: "block", marginBottom: "5px" }}>
            Vinyl Color
          </label>
          <input
            type="color"
            value={vinylColor}
            onChange={(e) => setVinylColor(e.target.value)}
            style={{ width: "100%", height: "40px" }}
          />
        </div>

        <div
          ref={vinylRef}
          style={{
            width: `${vinylSize}px`,
            height: `${vinylSize}px`,
            backgroundColor: vinylColor,
            margin: "0 auto",
            padding: `${borderWidth}px`,
            boxSizing: "border-box",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            transition: "transform 0.05s ease-out",
            animation: isSpinning ? "spin 2s linear infinite" : "none",
          }}
        >
          <div
            style={{
              width: "100%",
              height: "100%",
              overflow: "hidden",
              borderRadius: "50%",
            }}
          >
            <img
              src={uploadedImage}
              alt="Vinyl Art"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </div>
        </div>

        <button
          onClick={toggleSpin}
          style={{
            width: "100%",
            padding: "10px",
            fontSize: "1rem",
            backgroundColor: "#9b59b6",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            marginTop: "20px",
          }}
        >
          {isSpinning ? "Stop Spinning" : "Start Spinning"}
        </button>

        <button
          onClick={handleDownload}
          style={{
            width: "100%",
            padding: "10px",
            fontSize: "1rem",
            backgroundColor: "#4CAF50",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            marginTop: "10px",
          }}
        >
          Download Vinyl Art (PNG)
        </button>

        <button
          onClick={handleGifDownload}
          disabled={isGeneratingGif}
          style={{
            width: "100%",
            padding: "10px",
            fontSize: "1rem",
            backgroundColor: "#3498db",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: isGeneratingGif ? "not-allowed" : "pointer",
            marginTop: "10px",
            opacity: isGeneratingGif ? 0.7 : 1,
          }}
        >
          {isGeneratingGif ? "Generating GIF..." : "Download Vinyl Art (GIF)"}
        </button>
      </div>

      <button
        onClick={() => setShowProModal(true)}
        style={{
          padding: "10px 20px",
          fontSize: "1rem",
          backgroundColor: "#FFD700",
          color: "black",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
          marginBottom: "20px",
        }}
      >
        $ Go Pro
      </button>

      <div
        style={{
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          padding: "20px",
          borderRadius: "10px",
          textAlign: "center",
          marginBottom: "20px",
          maxWidth: "100%",
          overflow: "auto",
        }}
      >
        <pre style={{ color: "white", fontSize: "12px", margin: 0 }}>
          {`   ___________
  /           \\
 |  ^      ^   |
 |     <>      |
 |  \\_______/  |
  \\___________/

Made with love by anetrexic`}
        </pre>
      </div>

      <div
        style={{
          backgroundColor: "rgba(255, 255, 255, 0.2)",
          padding: "10px",
          borderRadius: "5px",
          textAlign: "center",
          marginBottom: "20px",
          width: "100%",
          maxWidth: "500px",
        }}
      >
        <p style={{ margin: "5px 0", color: "white" }}>Pro features locked</p>
        <p style={{ margin: "5px 0", color: "white" }}>
          Upgrade to Pro to unlock AI-generated vinyl art!
        </p>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginTop: "20px",
        }}
      >
        {["GitHub", "Twitter", "LinkedIn"].map((platform) => (
          <a
            key={platform}
            href={`https://${platform.toLowerCase()}.com`}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: "white",
              margin: "0 10px",
              textDecoration: "none",
              fontSize: "14px",
            }}
          >
            {platform}
          </a>
        ))}
      </div>

      {showProModal && <ProModal />}
    </div>
  );
};

export default VinylImageConverter;
