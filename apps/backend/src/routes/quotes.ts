import { Router, type Request, type Response, type IRouter } from 'express';
import { prisma } from '../db.js';
import { getParam } from '../utils/helpers.js';

const router: IRouter = Router();

// Simple email validation
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// POST /api/quotes/request - Request a quote for an ad slot
router.post('/request', async (req: Request, res: Response) => {
  try {
    const { email, companyName, phone, budget, timeline, message, adSlotId } = req.body;

    // Validation
    const errors: Record<string, string> = {};

    if (!email) {
      errors.email = 'Email is required';
    } else if (!isValidEmail(email)) {
      errors.email = 'Please enter a valid email address';
    }

    if (!companyName?.trim()) {
      errors.companyName = 'Company name is required';
    }

    if (!adSlotId) {
      errors.adSlotId = 'Ad slot ID is required';
    }

    if (Object.keys(errors).length > 0) {
      res.status(400).json({ error: 'Validation failed', fieldErrors: errors });
      return;
    }

    // Verify ad slot exists
    const adSlot = await prisma.adSlot.findUnique({
      where: { id: getParam(adSlotId) },
      select: { id: true, name: true, publisher: { select: { name: true } } },
    });

    if (!adSlot) {
      res.status(404).json({ error: 'Ad slot not found' });
      return;
    }

    // In a real app, this would:
    // 1. Save the quote request to database
    // 2. Send email notification to publisher
    // 3. Send confirmation email to requester
    // For now, just log and return success

    console.log('Quote request received:', {
      email,
      companyName,
      phone,
      budget,
      timeline,
      message,
      adSlotId,
      adSlotName: adSlot.name,
      publisherName: adSlot.publisher?.name,
    });

    // Generate a fake quote ID for demo
    const quoteId = `QR-${Date.now().toString(36).toUpperCase()}`;

    res.json({
      success: true,
      quoteId,
      message: `Thanks for your interest! We've received your quote request for "${adSlot.name}". A representative will contact you within 24-48 hours.`,
    });
  } catch (error) {
    console.error('Error processing quote request:', error);
    res.status(500).json({ error: 'Failed to submit quote request' });
  }
});

export default router;
