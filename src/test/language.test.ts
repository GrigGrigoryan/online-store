import { Database } from '../database';
import { DatabaseConnection } from '../database/connection';
import { Language } from '../database/entity';
import { dbConfig } from '../config';

describe('/languages', () => {
  beforeAll(async () => {
    await Database.init(dbConfig);
  });

  afterAll(async () => {
    await DatabaseConnection.closeConnection('test');
    await DatabaseConnection.clearConnection('test');
  });

  it('should create a new language', async () => {
    const language: Language = await Database.languageRepository.createAndSave({
      code: 'string',
      shortCode: 'string',
      label: 'label',
      isDefault: false,
    });
    expect(language.id).toBeDefined();
    expect(language.code).toBe('string');
    expect(language.shortCode).toBe('string');
    expect(language.label).toBe('label');
    expect(language.isDefault).toBeFalsy();
  });
});
