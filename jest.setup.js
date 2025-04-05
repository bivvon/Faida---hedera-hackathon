process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-secret';
process.env.MONGODB_URI = 'mongodb://localhost:27017/faida-test';
process.env.REDIS_URL = 'redis://localhost:6379';
process.env.COINGECKO_API_KEY = 'test-api-key';
process.env.MORALIS_API_KEY = 'test-api-key';

// Mock external services
jest.mock('redis', () => ({
  createClient: jest.fn().mockReturnValue({
    connect: jest.fn(),
    get: jest.fn(),
    set: jest.fn(),
    del: jest.fn(),
    on: jest.fn()
  })
}));

jest.mock('axios', () => ({
  get: jest.fn(),
  post: jest.fn()
}));

// Mock mongoose
jest.mock('mongoose', () => {
  const mongoose = jest.requireActual('mongoose');
  return {
    ...mongoose,
    connect: jest.fn(),
    model: jest.fn().mockReturnValue({
      find: jest.fn().mockReturnThis(),
      findOne: jest.fn().mockReturnThis(),
      findById: jest.fn().mockReturnThis(),
      create: jest.fn(),
      save: jest.fn(),
      updateOne: jest.fn(),
      deleteOne: jest.fn(),
      exec: jest.fn(),
      sort: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      populate: jest.fn().mockReturnThis()
    })
  };
}); 