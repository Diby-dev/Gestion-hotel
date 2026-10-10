import React, { useEffect, useState } from 'react';
import axios from 'axios';

function App() {
  const [hotels, setHotels] = useState([]);
  const [message, setMessage] = useState("Chargement des hôtels...");

  useEffect(() => {
    const API_URL = import.meta.env.VITE_API_URL; 

    // On récupère la liste des hôtels (route publique)
    axios.get(`${API_URL}/api/hotel`)
      .then((response) => {
        console.log("SUCCÈS ! Voici les hôtels :", response.data);
        setHotels(response.data); // On met les données dans le state
        setMessage("Connexion réussie ! Regarde la console.");
      })
      .catch((error) => {
        console.error("ERREUR :", error);
        setMessage("Erreur de connexion.");
      });
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h1>Liste des Hôtels</h1>
      <p>{message}</p>
      
      {/* On affiche la liste des hôtels */}
      <ul>
        {hotels.map((hotel) => (
          <li key={hotel.id}>
            <strong>{hotel.nom}</strong> - {hotel.ville}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;