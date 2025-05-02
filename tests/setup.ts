import dotenv from 'dotenv';

// Carregar variáveis de ambiente do arquivo .env.test
dotenv.config({ path: '.env.test' });

// Aumentar timeout para testes assíncronos
jest.setTimeout(10000);

// Limpar todos os mocks após cada teste
afterEach(() => {
  jest.clearAllMocks();
});

// Desligar logs durante os testes
console.log = jest.fn();
console.error = jest.fn();
console.warn = jest.fn();

afterAll(async () => {
  // Clear all timers
  jest.clearAllTimers();
});
