import express from 'express';
import NewsletterSubscriber from '../models/NewsletterSubscriber.js';
import { sendMail } from '../helper/sendMail.js';

const router = express.Router();

router.post('/subscribe', async (req, res) => {
  const email = String(req.body?.email || '').trim().toLowerCase();

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ success: false, message: 'Please enter a valid email address.' });
  }

  try {
    let subscriber = await NewsletterSubscriber.findOne({ email });

    if (subscriber?.welcomeEmailSentAt) {
      return res.status(200).json({
        success: true,
        alreadySubscribed: true,
        message: 'This email is already subscribed.',
      });
    }

    if (!subscriber) {
      subscriber = await NewsletterSubscriber.create({ email });
    }

    const subject = 'Welcome to the SandBox Newsletter';
    const text = 'Welcome to SandBox! You are now subscribed to platform updates, new features, funding opportunities, and community stories.';
    const html = `
      <div style="font-family:Arial,sans-serif;max-width:620px;margin:auto;padding:32px;border:1px solid #eee;border-radius:16px">
        <h1 style="color:#d98512;margin-top:0">Welcome to SandBox</h1>
        <p>Thank you for joining our newsletter.</p>
        <p>You will now receive occasional updates about new platform features, funding opportunities, student and startup stories, and events across the SandBox community.</p>
        <p>We are glad to have you with us.</p>
        <p style="margin-top:28px"><strong>The SandBox Team</strong></p>
      </div>
    `;

    await sendMail(email, subject, text, html);
    subscriber.welcomeEmailSentAt = new Date();
    await subscriber.save();

    return res.status(201).json({
      success: true,
      alreadySubscribed: false,
      message: 'Welcome email sent. You are subscribed.',
    });
  } catch (error) {
    console.error('Newsletter subscription failed:', error);
    return res.status(500).json({
      success: false,
      message: 'Could not complete your subscription. Please try again.',
    });
  }
});

export default router;
