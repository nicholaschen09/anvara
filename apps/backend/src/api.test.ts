import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import request from 'supertest';
import express from 'express';

// Mock prisma before importing routes
vi.mock('./db.js', () => ({
  prisma: {
    $queryRaw: vi.fn(),
    adSlot: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
    },
    sponsor: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
    },
    publisher: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
    },
  },
}));

// Import after mocking
import { prisma } from './db.js';
import healthRoutes from './routes/health.js';
import adSlotsRoutes from './routes/adSlots.js';
import sponsorsRoutes from './routes/sponsors.js';
import publishersRoutes from './routes/publishers.js';

// Create test app
function createTestApp() {
  const app = express();
  app.use(express.json());
  app.use('/api/health', healthRoutes);
  app.use('/api/ad-slots', adSlotsRoutes);
  app.use('/api/sponsors', sponsorsRoutes);
  app.use('/api/publishers', publishersRoutes);
  return app;
}

describe('Health API', () => {
  let app: express.Application;

  beforeEach(() => {
    app = createTestApp();
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe('GET /api/health', () => {
    it('returns health status when database is connected', async () => {
      vi.mocked(prisma.$queryRaw).mockResolvedValue([{ '?column?': 1 }]);

      const response = await request(app).get('/api/health');

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('ok');
      expect(response.body.database).toBe('connected');
      expect(response.body).toHaveProperty('timestamp');
    });

    it('returns error status when database is disconnected', async () => {
      vi.mocked(prisma.$queryRaw).mockRejectedValue(new Error('Connection failed'));

      const response = await request(app).get('/api/health');

      expect(response.status).toBe(503);
      expect(response.body.status).toBe('error');
      expect(response.body.database).toBe('disconnected');
    });
  });
});

describe('Ad Slots API', () => {
  let app: express.Application;

  beforeEach(() => {
    app = createTestApp();
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe('GET /api/ad-slots', () => {
    it('returns an array of ad slots', async () => {
      const mockAdSlots = [
        {
          id: '1',
          name: 'Banner Ad',
          type: 'DISPLAY',
          basePrice: 100,
          isAvailable: true,
          publisher: { id: 'p1', name: 'Tech Blog', category: 'tech', monthlyViews: 50000 },
          _count: { placements: 2 },
        },
        {
          id: '2',
          name: 'Sidebar Ad',
          type: 'DISPLAY',
          basePrice: 50,
          isAvailable: true,
          publisher: { id: 'p2', name: 'News Site', category: 'news', monthlyViews: 100000 },
          _count: { placements: 5 },
        },
      ];
      vi.mocked(prisma.adSlot.findMany).mockResolvedValue(mockAdSlots as never);

      const response = await request(app).get('/api/ad-slots');

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body).toHaveLength(2);
      expect(response.body[0].name).toBe('Banner Ad');
    });

    it('returns empty array when no ad slots exist', async () => {
      vi.mocked(prisma.adSlot.findMany).mockResolvedValue([]);

      const response = await request(app).get('/api/ad-slots');

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body).toHaveLength(0);
    });

    it('filters ad slots by availability', async () => {
      vi.mocked(prisma.adSlot.findMany).mockResolvedValue([]);

      await request(app).get('/api/ad-slots?available=true');

      expect(prisma.adSlot.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ isAvailable: true }),
        })
      );
    });

    it('filters ad slots by type', async () => {
      vi.mocked(prisma.adSlot.findMany).mockResolvedValue([]);

      await request(app).get('/api/ad-slots?type=VIDEO');

      expect(prisma.adSlot.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ type: 'VIDEO' }),
        })
      );
    });
  });

  describe('GET /api/ad-slots/:id', () => {
    it('returns a single ad slot by ID', async () => {
      const mockAdSlot = {
        id: '1',
        name: 'Banner Ad',
        type: 'DISPLAY',
        basePrice: 100,
        isAvailable: true,
        publisher: { id: 'p1', name: 'Tech Blog' },
        placements: [],
      };
      vi.mocked(prisma.adSlot.findUnique).mockResolvedValue(mockAdSlot as never);

      const response = await request(app).get('/api/ad-slots/1');

      expect(response.status).toBe(200);
      expect(response.body.id).toBe('1');
      expect(response.body.name).toBe('Banner Ad');
    });

    it('returns 404 for non-existent ad slot', async () => {
      vi.mocked(prisma.adSlot.findUnique).mockResolvedValue(null);

      const response = await request(app).get('/api/ad-slots/nonexistent');

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('Ad slot not found');
    });
  });
});

describe('Sponsors API', () => {
  let app: express.Application;

  beforeEach(() => {
    app = createTestApp();
    vi.clearAllMocks();
  });

  describe('GET /api/sponsors', () => {
    it('returns an array of sponsors', async () => {
      const mockSponsors = [
        { id: '1', name: 'Acme Corp', logo: 'https://example.com/logo.png' },
        { id: '2', name: 'Beta Inc', logo: null },
      ];
      vi.mocked(prisma.sponsor.findMany).mockResolvedValue(mockSponsors as never);

      const response = await request(app).get('/api/sponsors');

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body).toHaveLength(2);
    });
  });

  describe('GET /api/sponsors/:id', () => {
    it('returns a single sponsor by ID', async () => {
      const mockSponsor = {
        id: '1',
        name: 'Acme Corp',
        logo: 'https://example.com/logo.png',
        campaigns: [],
        _count: { campaigns: 0 },
      };
      vi.mocked(prisma.sponsor.findUnique).mockResolvedValue(mockSponsor as never);

      const response = await request(app).get('/api/sponsors/1');

      expect(response.status).toBe(200);
      expect(response.body.id).toBe('1');
      expect(response.body.name).toBe('Acme Corp');
    });

    it('returns 404 for non-existent sponsor', async () => {
      vi.mocked(prisma.sponsor.findUnique).mockResolvedValue(null);

      const response = await request(app).get('/api/sponsors/nonexistent');

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('Sponsor not found');
    });
  });
});

describe('Publishers API', () => {
  let app: express.Application;

  beforeEach(() => {
    app = createTestApp();
    vi.clearAllMocks();
  });

  describe('GET /api/publishers', () => {
    it('returns an array of publishers', async () => {
      const mockPublishers = [
        { id: '1', name: 'Tech Blog', category: 'tech', monthlyViews: 50000 },
        { id: '2', name: 'News Site', category: 'news', monthlyViews: 100000 },
      ];
      vi.mocked(prisma.publisher.findMany).mockResolvedValue(mockPublishers as never);

      const response = await request(app).get('/api/publishers');

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body).toHaveLength(2);
    });
  });

  describe('GET /api/publishers/:id', () => {
    it('returns a single publisher by ID', async () => {
      const mockPublisher = {
        id: '1',
        name: 'Tech Blog',
        category: 'tech',
        monthlyViews: 50000,
        adSlots: [],
        _count: { adSlots: 0 },
      };
      vi.mocked(prisma.publisher.findUnique).mockResolvedValue(mockPublisher as never);

      const response = await request(app).get('/api/publishers/1');

      expect(response.status).toBe(200);
      expect(response.body.id).toBe('1');
      expect(response.body.name).toBe('Tech Blog');
    });

    it('returns 404 for non-existent publisher', async () => {
      vi.mocked(prisma.publisher.findUnique).mockResolvedValue(null);

      const response = await request(app).get('/api/publishers/nonexistent');

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('Publisher not found');
    });
  });
});
