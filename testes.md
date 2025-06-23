# Guia de Testes - GastroMatch Backend

Este documento fornece instruções sobre como executar e entender os testes do projeto GastroMatch Backend.

## Configuração do Ambiente

O projeto utiliza as seguintes ferramentas de teste:
- Jest: Framework de teste
- Supertest: Biblioteca para testar APIs HTTP
- Jest Mock: Para mockar dependências (como modelos Sequelize)

## Acesse a pasta no diretório
Se você está na raiz do projeto, ou seja, em `\plf-es-2025-1-ti5-0492100-gastromatch`, rode o comando:
```bash
cd code\back
```

## Scripts Disponíveis

No `package.json`, temos o seguinte script para testes:

```bash
npm test           # Executa todos os testes uma vez
```

## Onde rodar os testes?

Abra o terminal e navegue até a pasta do backend antes de rodar os comandos de teste:

```bash
cd code/back
```

Depois disso, execute o comando de teste mostrado acima.

## Estrutura dos Testes

Os testes estão organizados da seguinte forma:
- `controllers/__tests__/`: Testes dos controllers
- `__mocks__/`: Arquivos de mock para recursos estáticos (opcional)
- `jest.config.js`: Configuração global dos testes (se necessário)

## Exemplo de Teste

Aqui está um exemplo de como os testes são estruturados:

```javascript
// Exemplo do userController.test.js
jest.mock('../../models/user', () => ({
  findAll: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
  destroy: jest.fn(),
}));

const userController = require('../userController');
const User = require('../../models/user');

describe('User Controller', () => {
  describe('getAllUsers', () => {
    it('deve retornar todos os usuários com status 200', async () => {
      // Arrange
      const mockUsers = [
        { id: 1, name: 'User 1' },
        { id: 2, name: 'User 2' }
      ];
      User.findAll.mockResolvedValue(mockUsers);
      const req = {};
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };
      const next = jest.fn();

      // Act
      await userController.getAllUsers(req, res, next);

      // Assert
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        status: 'success',
        results: mockUsers.length,
        data: { users: mockUsers }
      });
    });
  });
});
```

## Tipos de Testes Implementados

1. **Testes de Controllers**
   - Verifica se os controllers retornam as respostas esperadas
   - Exemplo: Teste do método `getAllUsers` do `userController`

2. **Testes de Interação**
   - Verifica se as interações com o banco de dados (via mocks) funcionam
   - Exemplo: Teste de atualização de usuário

3. **Testes Assíncronos**
   - Verifica comportamentos assíncronos
   - Exemplo: Teste de carregamento de usuários

## Como Adicionar Novos Testes

1. Crie um arquivo `.test.js` no diretório `__tests__` correspondente
2. Importe as dependências necessárias:
   ```javascript
   const userController = require('../userController');
   const User = require('../../models/user');
   ```
3. Use `jest.mock` para mockar o modelo:
   ```javascript
   jest.mock('../../models/user', () => ({
     findAll: jest.fn(),
     findOne: jest.fn(),
     update: jest.fn(),
     destroy: jest.fn(),
   }));
   ```
4. Escreva seus testes usando o padrão:
   ```javascript
   describe('Nome do Controller', () => {
     test('descrição do teste', async () => {
       // Arrange
       // Act
       // Assert
     });
   });
   ```

## Boas Práticas

1. **Organização**
   - Mantenha os testes próximos aos controllers que testam
   - Use nomes descritivos para os testes
   - Agrupe testes relacionados em blocos `describe`

2. **Mocking**
   - Use mocks para dependências externas (como modelos Sequelize)
   - Mock de APIs e recursos estáticos
   - Exemplo: `jest.mock('../../models/user', () => ({ ... }));`

3. **Assertions**
   - Use assertions específicas e descritivas
   - Prefira testar comportamentos em vez de implementações
   - Exemplo: `expect(res.status).toHaveBeenCalledWith(200);`

## Solução de Problemas

Se encontrar erros ao rodar os testes:

1. Verifique se todas as dependências estão instaladas:
   ```bash
   npm install
   ```

2. Limpe o cache do Jest:
   ```bash
   npm test -- --clearCache
   ```

3. Verifique se o arquivo `jest.config.js` está configurado corretamente

4. Certifique-se de que o arquivo `setupTests.js` está importando todas as extensões necessárias

## Cobertura de Testes

Para verificar a cobertura de testes e gerar um relatório HTML:
```bash
npm run test:coverage
```

Isso gerará um relatório detalhado mostrando:
- Porcentagem de código coberto
- Arquivos testados
- Linhas não cobertas

O relatório HTML será gerado na pasta `coverage`. Para visualizar o relatório, abra o arquivo `index.html` em seu navegador:

```bash
start coverage/index.html
```

Ou rode o teste e já abra o relatório pelo comando:
```bash
npm run test:coverage && start coverage/lcov-report/index.html
```

