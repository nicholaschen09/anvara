import { Router, type Request, type Response, type IRouter } from 'express';

const router: IRouter = Router();

// Simple email validation
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// POST /api/newsletter/subscribe - Subscribe to newsletter
router.post('/subscribe', async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    if (!email) {
      res.status(400).json({ error: 'Email is required' });
      return;
    }

    if (!isValidEmail(email)) {
      res.status(400).json({ error: 'Please enter a valid email address' });
      return;
    }

    // In a real app, this would save to database or send to email service
    // For now, just log and return success
    console.log(`Newsletter subscription: ${email}`);

    res.json({
      success: true,
      message: 'Thanks for subscribing! You\'ll receive updates about new opportunities.',
    });
  } catch (error) {
    console.error('Error subscribing to newsletter:', error);
    res.status(500).json({ error: 'Failed to subscribe' });
  }
});

export default router;
