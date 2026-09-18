// api/verify-apporteur.js
// Fonction serverless Vercel : vérifie le mot de passe côté serveur uniquement.
// Le mot de passe n'apparaît JAMAIS dans le code envoyé au navigateur.
//
// ⚠️ CONFIGURATION REQUISE AVANT MISE EN LIGNE :
// Sur Vercel, va dans Project Settings > Environment Variables et crée :
//   Nom  : APPORTEUR_PASSWORD
//   Valeur : (ton mot de passe, celui que toi seul connais)
// Redéploie ensuite le projet pour que la variable soit prise en compte.

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ ok: false, error: 'Méthode non autorisée' });
  }

  try {
    const { password } = req.body || {};
    const correctPassword = process.env.APPORTEUR_PASSWORD;

    if (!correctPassword) {
      // Variable d'environnement non configurée côté Vercel
      return res.status(500).json({ ok: false, error: 'Configuration serveur manquante' });
    }

    if (typeof password === 'string' && password === correctPassword) {
      // On renvoie un token très simple, valable uniquement pour cette session navigateur,
      // pour éviter de renvoyer le mot de passe en clair dans la réponse.
      return res.status(200).json({ ok: true });
    }

    // Volontairement peu de détails dans la réponse d'échec
    return res.status(401).json({ ok: false });
  } catch (err) {
    return res.status(500).json({ ok: false, error: 'Erreur serveur' });
  }
}
