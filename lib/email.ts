import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'localhost',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: process.env.SMTP_USER ? {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  } : undefined,
})

const FROM = `Art Rabic <${process.env.SMTP_FROM || process.env.SMTP_USER || 'info@artrabic.ba'}>`
const ADMIN = process.env.ADMIN_EMAIL || process.env.SMTP_USER || 'info@artrabic.ba'

type OrderData = {
  id: number
  firstName: string
  lastName: string
  email: string
  phone: string
  address: string
  city: string
  zip: string
  bookPrice: number
  deliveryFee: number
  totalPrice: number
  note?: string | null
}

type BookData = {
  title: string
  author: string
}

type ContactData = {
  name: string
  email: string
  subject: string
  message: string
}

export async function sendOrderConfirmation(order: OrderData, book: BookData) {
  await transporter.sendMail({
    from: FROM,
    to: order.email,
    subject: `Potvrda narudžbe #${order.id} — Art Rabic`,
    html: `
      <div style="font-family:Georgia,serif;max-width:600px;margin:0 auto;color:#1a1a1a">
        <h2 style="border-bottom:2px solid #c41e3a;padding-bottom:12px">Hvala na narudžbi, ${order.firstName}!</h2>
        <p>Vaša narudžba je primljena i bit će obrađena u najkraćem roku.</p>
        <table style="width:100%;border-collapse:collapse;margin:20px 0">
          <tr><td style="padding:8px 0;color:#666">Knjiga:</td><td style="padding:8px 0"><strong>${book.title}</strong> — ${book.author}</td></tr>
          <tr><td style="padding:8px 0;color:#666">Cijena knjige:</td><td style="padding:8px 0">${Number(order.bookPrice).toFixed(2)} KM</td></tr>
          <tr><td style="padding:8px 0;color:#666">Dostava:</td><td style="padding:8px 0">${Number(order.deliveryFee).toFixed(2)} KM</td></tr>
          <tr style="border-top:1px solid #eee"><td style="padding:8px 0;font-weight:bold">Ukupno:</td><td style="padding:8px 0;font-weight:bold">${Number(order.totalPrice).toFixed(2)} KM</td></tr>
        </table>
        <h3 style="margin-top:24px">Adresa dostave</h3>
        <p>${order.firstName} ${order.lastName}<br>${order.address}<br>${order.zip} ${order.city}<br>Tel: ${order.phone}</p>
        ${order.note ? `<p><strong>Napomena:</strong> ${order.note}</p>` : ''}
        <p style="margin-top:24px;color:#666;font-size:14px">Plaćanje: pouzećem pri preuzimanju</p>
        <hr style="border:none;border-top:1px solid #eee;margin:24px 0">
        <p style="color:#999;font-size:12px">Art Rabic — Zmaja od Bosne 4, Sarajevo | mikulicknjige.com</p>
      </div>
    `,
  })
}

export async function sendOrderNotification(order: OrderData, book: BookData) {
  await transporter.sendMail({
    from: FROM,
    to: ADMIN,
    subject: `Nova narudžba #${order.id}: ${book.title}`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;color:#1a1a1a">
        <h2>Nova narudžba #${order.id}</h2>
        <table style="width:100%;border-collapse:collapse">
          <tr><td style="padding:6px 0;color:#666">Knjiga:</td><td><strong>${book.title}</strong> — ${book.author}</td></tr>
          <tr><td style="padding:6px 0;color:#666">Kupac:</td><td>${order.firstName} ${order.lastName}</td></tr>
          <tr><td style="padding:6px 0;color:#666">Email:</td><td><a href="mailto:${order.email}">${order.email}</a></td></tr>
          <tr><td style="padding:6px 0;color:#666">Telefon:</td><td>${order.phone}</td></tr>
          <tr><td style="padding:6px 0;color:#666">Adresa:</td><td>${order.address}, ${order.zip} ${order.city}</td></tr>
          <tr><td style="padding:6px 0;color:#666">Ukupno:</td><td><strong>${Number(order.totalPrice).toFixed(2)} KM</strong></td></tr>
          ${order.note ? `<tr><td style="padding:6px 0;color:#666">Napomena:</td><td>${order.note}</td></tr>` : ''}
        </table>
      </div>
    `,
  })
}

export async function sendContactNotification(data: ContactData) {
  await transporter.sendMail({
    from: FROM,
    to: ADMIN,
    replyTo: data.email,
    subject: `Kontakt forma: ${data.subject}`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;color:#1a1a1a">
        <h2>Nova poruka s kontakt forme</h2>
        <table style="width:100%;border-collapse:collapse">
          <tr><td style="padding:6px 0;color:#666">Ime:</td><td>${data.name}</td></tr>
          <tr><td style="padding:6px 0;color:#666">Email:</td><td><a href="mailto:${data.email}">${data.email}</a></td></tr>
          <tr><td style="padding:6px 0;color:#666">Tema:</td><td>${data.subject}</td></tr>
        </table>
        <h3 style="margin-top:20px">Poruka:</h3>
        <p style="background:#f5f5f5;padding:16px;border-left:3px solid #c41e3a;white-space:pre-wrap">${data.message}</p>
        <p style="color:#999;font-size:12px">Odgovorite direktno na ovaj email — Reply-To je postavljen na adresu pošiljaoca.</p>
      </div>
    `,
  })
}
