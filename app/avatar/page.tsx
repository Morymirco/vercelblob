'use client'; // Indique que ce composant est un composant client

import type { PutBlobResult } from '@vercel/blob'; // Importe le type PutBlobResult pour typer le résultat de l'upload
import { useState, useRef } from 'react'; // Importe les hooks useState et useRef de React

export default function AvatarUploadPage() { // Définit le composant principal AvatarUploadPage
  const [blob, setBlob] = useState<PutBlobResult | null>(null); // État pour stocker les informations du blob uploadé
  const [isUploading, setIsUploading] = useState(false); // État pour gérer l'état de chargement pendant l'upload

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => { // Fonction pour gérer la soumission du formulaire
    event.preventDefault(); // Empêche le comportement par défaut du formulaire
    setIsUploading(true); // Active l'état de chargement

    const formData = new FormData(event.currentTarget); // Crée un objet FormData à partir du formulaire soumis

    try {
      const response = await fetch('/api/avatar/upload', { // Envoie une requête POST à l'API d'upload
        method: 'POST',
        body: formData,
      });

      if (!response.ok) { // Vérifie si la réponse est OK
        throw new Error('Erreur lors de l\'upload');
      }

      const newBlob = await response.json() as PutBlobResult; // Récupère les données du blob depuis la réponse
      setBlob(newBlob); // Met à jour l'état avec les nouvelles informations du blob
    } catch (error) {
      console.error('Erreur:', error); // Log l'erreur dans la console
      alert('Une erreur est survenue lors de l\'upload'); // Affiche une alerte à l'utilisateur
    } finally {
      setIsUploading(false); // Désactive l'état de chargement, que l'upload ait réussi ou échoué
    }
  };

  return (
    <>
      <h1>Uploadez Votre Avatar</h1>

      <form onSubmit={handleSubmit}> {/* Formulaire d'upload */}
        <input name="file" type="file" required /> {/* Champ de sélection de fichier */}
        <button type="submit" disabled={isUploading}> {/* Bouton de soumission, désactivé pendant l'upload */}
          {isUploading ? 'Upload en cours...' : 'Upload'}
        </button>
      </form>
      {blob && ( // Affiche l'URL du blob si un upload a été effectué
        <div>
          URL du Blob: <a href={blob.url}>{blob.url}</a>
        </div>
      )}
    </>
  );
}