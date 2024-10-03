// Importation de la fonction 'put' de Vercel Blob pour l'upload de fichiers
import { put } from '@vercel/blob';
// Importation de NextResponse pour gérer les réponses HTTP dans Next.js
import { NextResponse } from 'next/server';

// Définition de la fonction POST pour gérer les requêtes d'upload
export async function POST(request: Request): Promise<NextResponse> {
  try {
    // Extraction des données du formulaire à partir de la requête
    const formData = await request.formData();
    // Récupération du fichier depuis les données du formulaire
    const file = formData.get('file') as File | null;

    // Vérification de la présence d'un fichier
    if (!file) {
      // Retourne une erreur 400 si aucun fichier n'est présent
      return NextResponse.json(
        { error: 'Aucun fichier n\'a été uploadé' },
        { status: 400 }
      );
    }

    // Vérification du type de fichier (doit être une image)
    if (!file.type.startsWith('image/')) {
      // Retourne une erreur 400 si le fichier n'est pas une image
      return NextResponse.json(
        { error: 'Le fichier doit être une image' },
        { status: 400 }
      );
    }

    // Définition de la taille maximale du fichier (5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    // Vérification de la taille du fichier
    if (file.size > maxSize) {
      // Retourne une erreur 400 si le fichier est trop volumineux
      return NextResponse.json(
        { error: 'Le fichier est trop volumineux (max 5MB)' },
        { status: 400 }
      );
    }

    // Génération d'un nom de fichier unique basé sur la date et le nom original
    const uniqueFilename = `avatar-${Date.now()}-${file.name}`;

    // Upload du fichier vers Vercel Blob Storage
    const blob = await put(uniqueFilename, file, {
      access: 'public', // Rend le fichier accessible publiquement
      addRandomSuffix: false // Désactive l'ajout d'un suffixe aléatoire au nom du fichier
    });

    // Retourne les informations du blob en cas de succès
    return NextResponse.json(blob);
  } catch (error) {
    // Log de l'erreur en cas de problème
    console.error('Erreur lors de l\'upload du fichier:', error);
    // Retourne une erreur 500 en cas d'échec de l'upload
    return NextResponse.json(
      { error: 'Erreur lors de l\'upload du fichier' },
      { status: 500 }
    );
  }
}
