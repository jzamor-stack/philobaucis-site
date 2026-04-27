import { Resend } from 'resend';
import { createClient } from '@supabase/supabase-js';

const resend = new Resend(process.env.RESEND_API_KEY);
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Méthode non autorisée' });

  const { companyName, contactName, role, email, phone, details, bookingType, city } = req.body;

  try {
    // 1. On sauvegarde dans Supabase
    const { error: dbError } = await supabase
      .from('reservations')
      .insert([{ 
        company_name: companyName, contact_name: contactName, role: role, 
        email: email, phone: phone, details: details, 
        booking_type: bookingType, city: city 
      }]);

    if (dbError) throw dbError;

    // 2. On t'envoie l'email d'alerte
    await resend.emails.send({
      from: 'Philobaucis <onboarding@resend.dev>', 
      to: ['j.zamor@philobaucis.fr'],
      subject: `🚨 Nouvelle Demande de Mécénat : ${companyName}`,
      html: `<div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eaeaea; border-radius: 10px; overflow: hidden;"><div style="background: #c41919; color: white; padding: 20px; text-align: center;"><h2 style="margin: 0;">Nouvelle demande de partenariat</h2></div><div style="padding: 20px;"><p>Une entreprise souhaite s'engager pour les maraudes Philobaucis !</p><div style="background: #f9f9f9; padding: 15px; border-radius: 8px; margin: 20px 0;"><h3 style="margin-top: 0; color: #333; border-bottom: 2px solid #eaeaea; padding-bottom: 5px;">Informations du contact</h3><p><strong>Entreprise :</strong> ${companyName}</p><p><strong>Contact :</strong> ${contactName} (${role})</p><p><strong>Email :</strong> <a href="mailto:${email}">${email}</a></p><p><strong>Téléphone :</strong> ${phone}</p></div><div style="background: #f9f9f9; padding: 15px; border-radius: 8px;"><h3 style="margin-top: 0; color: #333; border-bottom: 2px solid #eaeaea; padding-bottom: 5px;">Détails du créneau</h3><p><strong>Type de réservation :</strong> ${bookingType}</p><p><strong>Ville(s) :</strong> ${city}</p><pre style="background: #fff; border: 1px solid #ddd; padding: 15px; border-radius: 5px; font-family: inherit; white-space: pre-wrap;">${details}</pre></div></div></div>`
    });
    
    return res.status(200).json({ success: true });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
