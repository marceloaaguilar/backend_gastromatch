const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const util = require('util');

jest.mock('../../utils/catchAsync', () => (fn) => fn);
// Mock das dependências
jest.mock('../../models/user');
jest.mock('jsonwebtoken');
jest.mock('bcryptjs');

const authController = require('../authController');
const User = require('../../models/user');

describe('Auth Controller', () => {
  let mockReq;
  let mockRes;
  let mockNext;

  beforeEach(() => {
    mockReq = {
      body: {},
      file: null,
      headers: {},
      cookies: {}
    };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      cookie: jest.fn()
    };
    mockNext = jest.fn();
  });

  describe('signup', () => {
    it('deve criar um novo usuário com sucesso', async () => {
      // Arrange
      const mockUser = {
        id: 1,
        name: 'Test User',
        email: 'test@example.com',
        role: 'user',
        get: () => ({
          id: 1,
          name: 'Test User',
          email: 'test@example.com',
          role: 'user'
        })
      };

      mockReq.body = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        role: 'user'
      };

      User.create.mockResolvedValue(mockUser);
      jwt.sign.mockReturnValue('mock-token');

      // Act
      await authController.signup(mockReq, mockRes);

      // Assert
      expect(User.create).toHaveBeenCalledWith(expect.objectContaining({
        name: 'Test User',
        email: 'test@example.com',
        role: 'user'
      }));
      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith(expect.objectContaining({
        status: 'success',
        token: 'mock-token'
      }));
    });

    it('deve retornar erro quando faltam campos obrigatórios', async () => {
      // Arrange
      mockReq.body = {
        name: 'Test User'
        // email e password faltando
      };

      User.create.mockRejectedValue(new Error('Validation error'));

      // Act
      await authController.signup(mockReq, mockRes);

      // Assert
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith(expect.objectContaining({
        mensagem: "Ocorreu um erro ao realizar o cadastro"
      }));
    });
  });

  describe('signin', () => {
    it('deve autenticar usuário com credenciais válidas', async () => {
      // Arrange
      const mockUser = {
        id: 1,
        name: 'Test User',
        email: 'test@example.com',
        password: 'hashedPassword',
        role: 'user',
        get: () => ({
          id: 1,
          name: 'Test User',
          email: 'test@example.com',
          role: 'user'
        })
      };

      mockReq.body = {
        email: 'test@example.com',
        password: 'password123'
      };

      User.findOne.mockResolvedValue(mockUser);
      bcrypt.compare.mockResolvedValue(true);
      jwt.sign.mockReturnValue('mock-token');

      // Act
      await authController.signin(mockReq, mockRes);

      // Assert
      expect(User.findOne).toHaveBeenCalledWith({ where: { email: 'test@example.com' } });
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(expect.objectContaining({
        message: "Usuário autenticado com sucesso!",
        token: 'mock-token'
      }));
      expect(mockRes.cookie).toHaveBeenCalledWith('token', 'mock-token', expect.any(Object));
    });

    it('deve retornar erro quando faltam credenciais', async () => {
      // Arrange
      mockReq.body = {
        email: 'test@example.com'
        // password faltando
      };

      // Act
      await authController.signin(mockReq, mockRes);

      // Assert
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith(expect.objectContaining({
        error: true,
        message: "Por favor, forneça um e-mail e uma senha!'"
      }));
    });

    it('deve retornar erro com credenciais inválidas', async () => {
      // Arrange
      mockReq.body = {
        email: 'test@example.com',
        password: 'wrongpassword'
      };

      User.findOne.mockResolvedValue(null);

      // Act
      await authController.signin(mockReq, mockRes);

      // Assert
      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith(expect.objectContaining({
        error: true,
        message: "Credenciais inválidas!"
      }));
    });
  });

  describe('protect', () => {
    beforeEach(() => {
      jest.clearAllMocks();
      jest.restoreAllMocks();
    });

    it('deve permitir acesso com token válido no header', async () => {
      jwt.verify.mockReturnValue({ id: 1 });
      mockReq.headers.authorization = 'Bearer valid-token';
      await authController.protect(mockReq, mockRes, mockNext);
      expect(mockNext).toHaveBeenCalled();
    }, 10000);

    it('deve permitir acesso com token válido nos cookies', async () => {
      jwt.verify.mockReturnValue({ id: 1 });
      mockReq.cookies.token = 'valid-token';
      await authController.protect(mockReq, mockRes, mockNext);
      expect(mockNext).toHaveBeenCalled();
    }, 10000);

    it('deve retornar erro quando não há token', async () => {
      await authController.protect(mockReq, mockRes, mockNext);
      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith(expect.objectContaining({
        error: true,
        message: "Você precisa se autenticar primeiro!"
      }));
    }, 10000);

    it('deve retornar erro com token inválido', async () => {
      jwt.verify.mockImplementation(() => {
        throw new Error('Invalid token');
      });
      mockReq.headers.authorization = 'Bearer invalid-token';
      await authController.protect(mockReq, mockRes, mockNext);
      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith(expect.objectContaining({
        error: true,
        message: "Você precisa se autenticar primeiro!"
      }));
    }, 10000);
  });
}); 