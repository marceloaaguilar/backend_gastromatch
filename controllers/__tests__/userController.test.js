jest.mock('../../utils/catchAsync', () => (fn) => fn);

jest.mock('../../models/user', () => ({
  findAll: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
  destroy: jest.fn(),
}));

jest.mock('jsonwebtoken', () => ({
  verify: jest.fn(),
}));

jest.mock('bcryptjs', () => ({
  hash: jest.fn().mockResolvedValue('hashedPassword'),
}));

const userController = require('../userController');
const User = require('../../models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

describe('User Controller', () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      params: {},
      body: {},
      cookies: {},
      file: null
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      clearCookie: jest.fn()
    };
    next = jest.fn();
  });

  describe('getAllUsers', () => {
    it('deve retornar todos os usuários com status 200', async () => {
      const mockUsers = [
        { id: 1, name: 'User 1' },
        { id: 2, name: 'User 2' }
      ];
      User.findAll.mockResolvedValue(mockUsers);

      await userController.getAllUsers(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        status: 'success',
        results: mockUsers.length,
        data: { users: mockUsers }
      });
    });
  });

  describe('getUser', () => {
    it('deve retornar o usuário com status 200', async () => {
      const mockUser = { id: 1, name: 'User 1' };
      User.findOne.mockResolvedValue(mockUser);
      req.params.id = 1;

      await userController.getUser(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        status: 'success',
        data: { user: mockUser }
      });
    });

    it('deve retornar 404 quando usuário não encontrado', async () => {
      User.findOne.mockResolvedValue(null);
      req.params.id = 999;

      await userController.getUser(req, res, next);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        status: 'fail',
        message: 'Usuário não encontrado'
      });
    });
  });

  describe('updateUser', () => {
    it('deve atualizar usuário com sucesso', async () => {
      const mockUser = { id: 1, name: 'Updated User' };
      User.update.mockResolvedValue([1]);
      User.findOne.mockResolvedValue(mockUser);
      req.params.id = 1;
      req.body = { name: 'Updated User', phone: '123456789' };

      await userController.updateUser(req, res, next);

      expect(User.update).toHaveBeenCalledWith(
        { name: 'Updated User', phone: '123456789', password: undefined, address: undefined, profile_photo: null },
        { where: { id: 1 } }
      );
      expect(User.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        status: 'success',
        data: { updatedUser: mockUser }
      });
    });

    it('deve atualizar senha quando fornecida', async () => {
      const mockUser = { id: 1, name: 'Updated User' };
      User.update.mockResolvedValue([1]);
      User.findOne.mockResolvedValue(mockUser);
      req.params.id = 1;
      req.body = { password: 'newPassword' };

      await userController.updateUser(req, res, next);

      expect(bcrypt.hash).toHaveBeenCalledWith('newPassword', 12);
    });

    it('deve retornar 404 quando usuário não encontrado', async () => {
      User.update.mockResolvedValue([0]);
      req.params.id = 999;

      await userController.updateUser(req, res, next);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        status: 'fail',
        message: 'Usuário não encontrado ou nenhuma alteração realizada'
      });
    });
  });

  describe('deleteUser', () => {
    it('deve deletar usuário com sucesso', async () => {
      User.destroy.mockResolvedValue(1);
      req.params.id = 1;

      await userController.deleteUser(req, res, next);

      expect(res.status).toHaveBeenCalledWith(204);
      expect(res.json).toHaveBeenCalledWith({
        status: 'success',
        data: null
      });
    });

    it('deve retornar 404 quando usuário não encontrado', async () => {
      User.destroy.mockResolvedValue(0);
      req.params.id = 999;

      await userController.deleteUser(req, res, next);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        status: 'fail',
        message: 'Usuário não encontrado'
      });
    });
  });

  describe('verifyToken', () => {
    it('deve verificar token válido', async () => {
      const mockUser = { id: 1, name: 'User 1' };
      const mockToken = 'valid-token';
      jwt.verify.mockReturnValue({ id: 1 });
      User.findOne.mockResolvedValue(mockUser);
      req.cookies.token = mockToken;

      await userController.verifyToken(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        user: mockUser
      });
    });

    it('deve retornar 401 quando token ausente', async () => {
      await userController.verifyToken(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Token ausente'
      });
    });

    it('deve retornar 401 quando token inválido', async () => {
      req.cookies.token = 'invalid-token';
      jwt.verify.mockImplementation(() => {
        throw new Error('Invalid token');
      });

      await userController.verifyToken(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Token inválido ou expirado'
      });
    });
  });

  describe('logoutUser', () => {
    it('deve realizar logout com sucesso', async () => {
      await userController.logoutUser(req, res, next);

      expect(res.clearCookie).toHaveBeenCalledWith('token', {
        httpOnly: true,
        secure: true,
        sameSite: 'Strict'
      });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Logout realizado com sucesso'
      });
    });
  });
}); 