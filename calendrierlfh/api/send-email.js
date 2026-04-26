import { Resend } from 'resend';

// Initialisation de Resend avec la clé API (sécurisée dans Vercel)
const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  // On bloque tout ce qui n'est pas une requête POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Méthode non autorisée' });
  }

  // On récupère les infos envoyées par ton formulaire HTML
  const { companyName, contactName, role, email, phone, details, bookingType, city } = req.body;

  try {
    // Envoi de l'email
    const data = await resend.emails.send({
      from: 'Philobaucis <onboarding@resend.dev>', // Par défaut chez Resend pour tester
      to: ['j.zamor@philobaucis.fr'], // TON adresse mail
      subject: `🚨 Nouvelle Demande de Mécénat : ${companyName}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #c41919;">Nouvelle demande de partenariat</h2>
          <p>Une entreprise souhaite s'engager pour les maraudes Philobaucis !</p>
          
          <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #333;">Informations du contact</h3>
            <p><strong>Entreprise :</strong> ${companyName}</p>
            <p><strong>Contact :</strong> ${contactName} (${role})</p>
            <p><strong>Email :</strong> <a href="mailto:${email}">${email}</a></p>
            <p><strong>Téléphone :</strong> ${phone}</p>
          </div>

          <div style="background: #f9f9f9; padding: 20px; border-radius: 8px;">
            <h3 style="margin-top: 0; color: #333;">Détails du créneau choisi</h3>
            <p><strong>Type de réservation :</strong> ${bookingType}</p>
            <p><strong>Ville(s) :</strong> ${city}</p>
            <hr style="border: 1px solid #eee; margin: 15px 0;" />
            <pre style="font-family: inherit; white-space: pre-wrap; margin: 0;">${details}</pre>
          </div>
        </div>
      `
    });

    return res.status(200).json({ success: true, data });
  } catch (error) {
    console.error("Erreur d'envoi d'email:", error);
    return res.status(500).json({ error: error.message });
  }
}
