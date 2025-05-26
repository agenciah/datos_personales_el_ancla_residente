import { useState, useEffect } from "react";
import { TextField, Button, Container, FormControl, Snackbar, Alert, FormLabel } from "@mui/material";
import { jsPDF } from "jspdf";
import background from "./assets/el_ancla_first.jpg";
import CropImage from "./componentes/crop/cropimage";
import page2Background from "./assets/el_ancla_empty.jpg"

function MudanzasForm() {
  const [formData, setFormData] = useState({
    nombrePropietario: "",
    telefono: "",
    email: "",
    marcaVehiculo: "",
    tarjetaCirculacion: "",
    departamento: "",
    mascotas: "",
    usoDepto: "",
  });

  const [imageSrc, setImageSrc] = useState(null);
  const [croppedImages, setCroppedImages] = useState([]);
  const [backgroundImage, setBackgroundImage] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false); // Estado para el Snackbar
  const [snackbarMessage, setSnackbarMessage] = useState(""); // Mensaje del Snackbar
  const [snackbarSeverity, setSnackbarSeverity] = useState("success"); // Severidad del Snackbar


  useEffect(() => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = 595;
      canvas.height = 842;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, 595, 842);
      setBackgroundImage(canvas.toDataURL("image/jpeg"));
    };
    img.src = background;
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setImageSrc(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleCropComplete = (croppedImage) => {
    setCroppedImages((prevImages) => [...prevImages, croppedImage]);
    setImageSrc(null);
    setSnackbarMessage("Imagen agregada correctamente."); // Mensaje de éxito
    setSnackbarSeverity("success");
    setSnackbarOpen(true); // Abre el Snackbar
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbarOpen(false); // Cierra el Snackbar
  };

  const generatePDF = () => {
    const pdf = new jsPDF({ orientation: "portrait", unit: "px", format: "a4" });

    if (backgroundImage) {
      pdf.addImage(backgroundImage, "JPEG", 0, 0, 446, 631);
    }

    pdf.text(formData.nombrePropietario, 70, 170);
    pdf.text(formData.telefono, 70, 230);
    pdf.text(formData.email, 70, 295);
    pdf.text(formData.marcaVehiculo, 70, 480);
    pdf.text(formData.tarjetaCirculacion, 70, 540);
    pdf.text(formData.departamento, 70, 420);
    pdf.text(formData.mascotas, 70, 350);
    if (formData.usoDepto === "alojamientos_temporales") {
      pdf.text("X", 377, 581); // Coordenadas donde irá la "X" en la casilla de "Alojamientos Temporales"
    }
    
    if (formData.usoDepto === "habitar") {
      pdf.text("X", 377, 564); // Coordenadas donde irá la "X" en la casilla de "Habitar"
    }

    croppedImages.forEach((img) => {
      pdf.addPage();
      pdf.addImage(page2Background, "JPEG", 0, 0, 446, 631);
      pdf.addImage(img, "PNG", 50, 150, 295, 202);
    });


    pdf.save(`Autorizacion_${formData.nombreCompleto}.pdf`);

    //Limpiar los campos
    setFormData({
      nombrePropietario: "",
      telefono: "",
      nombreCompleto: "",
      email: "",
      marcaVehiculo: "",
      tarjetaCirculacion: "",
      departamento: "",
      mascotas: "",
      notas: "",
      usoDepto: "",
    });

    setCroppedImages([]); // Limpiar las imágenes cargadas
  };

  return (
    <Container>
      <form>
        <FormControl fullWidth margin="normal">
          <TextField
            label="Nombre del Propietario"
            name="nombrePropietario"
            value={formData.nombrePropietario}
            onChange={handleChange}
          />
        </FormControl>
        <FormControl fullWidth margin="normal">
          <TextField
            label="Telefono/s de contacto"
            name="telefono"
            value={formData.telefono}
            onChange={handleChange}
          />
        </FormControl>
        <FormControl fullWidth margin="normal">
          <TextField
            label="Email/s de contacto"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
        </FormControl>
        <FormControl fullWidth margin="normal">
          <TextField
            label="Departamento"
            name="departamento"
            value={formData.departamento}
            onChange={handleChange}
          />
        </FormControl>
        <FormControl fullWidth margin="normal">
          <TextField
            label="Mascotas (nombre, raza, color)"
            name="mascotas"
            value={formData.mascotas}
            onChange={handleChange}
          />
        </FormControl>
        <FormControl fullWidth margin="normal">
          <TextField
            label="Marca de Vehículo y placas"
            name="marcaVehiculo"
            value={formData.marcaVehiculo}
            onChange={handleChange}
          />
        </FormControl>
        <FormControl fullWidth margin="normal">
          <TextField
            label="Tarjeta de Circulación (Debe coincidir con placas)"
            name="tarjetaCirculacion"
            value={formData.tarjetaCirculacion}
            onChange={handleChange}
          />
          </FormControl>
          <FormControl component="fieldset" fullWidth margin="normal">
            <FormLabel sx={{ color: 'text.primary' }} >Por favor especifique el uso que dará a la propiedad:</FormLabel>
            <div>
              <input
                type="checkbox"
                name="usoDepto"
                value="alojamientos_temporales"
                checked={formData.usoDepto === "alojamientos_temporales"}
                onChange={() => setFormData({ ...formData, usoDepto: "alojamientos_temporales" })}
              />
              <FormLabel >Alojamientos Temporales</FormLabel>
            </div>
            <div>
              <input
                type="checkbox"
                name="usoDepto"
                value="habitar"
                checked={formData.usoDepto === "habitar"}
                onChange={() => setFormData({ ...formData, usoDepto: "habitar" })}
              />
              <FormLabel sx={{ '.MuiFormControlLabel-label': { color: 'text.primary' } }}>Habitar</FormLabel>
            </div>
          </FormControl>

        <input type="file"  accept="image/*" onChange={handleImageUpload}/>
        {imageSrc && (
          <CropImage
            imageSrc={imageSrc}
            onCropCompleteCallback={handleCropComplete}
            onClose={() => setImageSrc(null)}
          />
        )}
        <Button variant="contained" style={{ marginTop: "20px" }} onClick={generatePDF}>
          Generar PDF
        </Button > 
        {/* Snackbar para la confirmación */}
        <Snackbar open={snackbarOpen} autoHideDuration={3000} onClose={handleSnackbarClose}>
          <Alert onClose={handleSnackbarClose} severity={snackbarSeverity}>
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </form>
    </Container>
  );
}

export default MudanzasForm;