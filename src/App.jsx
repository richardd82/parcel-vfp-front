import React, { useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [message, setMessage] = useState("");
  const [selectedEndpoint, setSelectedEndpoint] = useState("");
  const endpoints = [
    "http://localhost:3001/generate-file-repatha",
    "http://localhost:3001/generate-file-evenity",
    "http://localhost:3001/generate-file-prolia",
  ];
  const databases = ["FEDEX", "Evenity", "Prolia"];

  const handleStartDateChange = (e) => {
    setStartDate(e.target.value);
  };

  const handleEndDateChange = (e) => {
    setEndDate(e.target.value);
  };

  const handleEndpointChange = (index) => {
    const selected = endpoints[parseInt(index)];
    setSelectedEndpoint(selected);
    console.log("Selected index:", index);
    console.log("Selected endpoint:", selected);
  };

  const handleGenerateFile = async () => {
    let labName =
      selectedEndpoint === "http://localhost:3001/generate-file-repatha"
        ? "Repatha"
        : selectedEndpoint === "http://localhost:3001/generate-file-evenity"
        ? "Evenity"
        : selectedEndpoint === "http://localhost:3001/generate-file-prolia"
        ? "Prolia"
        : null;
    try {
      const response = await axios.post(
        selectedEndpoint,
        { startDate, endDate },
        { responseType: "blob" }
      );

      if (startDate > endDate) {
        setMessage("La fecha de inicio no puede ser mayor que la Fecha Fin");
        setTimeout(() => {
          setMessage("");
        }, 5000);
      } else if(startDate < endDate){
        // Crear una URL para el blob recibido
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute(
          "download",
          `Xultophy_${startDate}_to_${endDate}.txt`
        );
        document.body.appendChild(link);
        link.click();

        setMessage("Archivo generado y descargado satisfactoriamente");

        setTimeout(() => {
          setMessage("");
        }, 5000);
      }
    } catch (error) {
      if (startDate > endDate) {
        setMessage("La fecha de inicio no puede ser mayor que la Fecha Fin");
        setTimeout(() => {
          setMessage("");
        }, 5000);
      }
      setMessage("Ha ocurrido un error");
    }
  };

  return (
    <div className='flex flex-col items-center w-full mt-52 gap-9'>
      <header className='mb-10'>
        <h1 className='text-5xl font-bold'>Generar Archivos de Conciliación</h1>
      </header>
      <section className='flex gap-2 items-center' name='selectDatabase'>
        <label>Selecciona la base de datos</label>
        <select
          className='bg-zinc-800 border-white border-2 rounded-md p-1 pl-2 pr-2'
          onChange={(e) => handleEndpointChange(e.target.value)}
        >
          <option value=''></option>
          {databases.map((e, i) => (
            <option value={i} key={i}>
              {e}
            </option>
          ))}
        </select>
      </section>
      <section className='flex flex-col gap-5'>
        <div className='grid grid-cols-2 items-center'>
          <label>Fecha de Inicio:</label>
          <input
            type='date'
            value={startDate}
            onChange={handleStartDateChange}
            className='bg-zinc-800 border-white border-2 rounded-md p-2'
          />
        </div>
        <div className='grid grid-cols-2 items-center'>
          <label>Fecha de Fin:</label>
          <input
            type='date'
            value={endDate}
            onChange={handleEndDateChange}
            className='bg-zinc-800 border-white border-2 rounded-md p-2'
          />
        </div>
      </section>
      <div>
        <button
          className='border-2 border-transparent drop-shadow-lg shadow-lg p-2 rounded-lg bg-pink-700'
          onClick={handleGenerateFile}
        >
          Generar Archivo
        </button>
      </div>
      {message && <p>{message}</p>}
    </div>
  );
}

export default App;
