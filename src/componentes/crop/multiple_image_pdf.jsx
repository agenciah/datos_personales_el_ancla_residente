import { useState } from "react";
import { jsPDF } from "jspdf";
import { Button } from "@mui/material";

const ImageToPDF = () => {
  const [images, setImages] = useState([]);

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    const newImages = files.map((file) => ({
      url: URL.createObjectURL(file),
      file: file,
    }));
    setImages((prevImages) => [...prevImages, ...newImages].slice(0, 10));
  };

  const handleDeleteImage = (index) => {
    setImages((prevImages) => prevImages.filter((_, i) => i !== index));
  };

  const generatePDF = () => {
    if (images.length === 0) return;
    const pdf = new jsPDF();

    images.forEach((image, index) => {
      const img = new Image();
      img.src = image.url;
      img.onload = () => {
        const imgWidth = 210; // A4 width in mm
        const imgHeight = (img.height * imgWidth) / img.width;
        pdf.addImage(img, "JPEG", 0, 0, imgWidth, imgHeight);
        if (index < images.length - 1) pdf.addPage();
        if (index === images.length - 1) pdf.save("images.pdf");
      };
    });
  };

  return (
    <div>
      <input type="file" accept="image/*" multiple onChange={handleFileChange} />
      <div style={{ display: "flex", flexWrap: "wrap", marginTop: "10px" }}>
        {images.map((image, index) => (
          <div key={index} style={{ position: "relative", margin: "5px" }}>
            <img src={image.url} alt={`uploaded ${index}`} width={100} height={100} />
            <button
              onClick={() => handleDeleteImage(index)}
              style={{
                position: "absolute",
                top: 0,
                right: 0,
                background: "red",
                color: "white",
                border: "none",
                cursor: "pointer",
              }}
            >
              X
            </button>
          </div>
        ))}
      </div>
      <Button variant="contained" onClick={generatePDF} disabled={images.length === 0}>
        Generar PDF
      </Button>
    </div>
  );
};

export default ImageToPDF;
