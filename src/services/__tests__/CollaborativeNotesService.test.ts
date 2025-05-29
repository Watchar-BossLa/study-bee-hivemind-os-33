
import { CollaborativeNotesService } from '../CollaborativeNotesService';

jest.mock('../base/BaseService');

describe('CollaborativeNotesService', () => {
  let service: CollaborativeNotesService;

  beforeEach(() => {
    service = new CollaborativeNotesService();
  });

  describe('getNotes', () => {
    it('should return collaborative notes', async () => {
      const mockNotes = [
        { id: '1', title: 'Physics Notes', content: 'Newton laws' },
        { id: '2', title: 'Math Notes', content: 'Calculus basics' }
      ];

      const executeSpy = jest.spyOn(service as any, 'executeWithRetry');
      executeSpy.mockResolvedValue(mockNotes);

      const result = await service.getNotes();

      expect(result).toEqual(mockNotes);
      expect(executeSpy).toHaveBeenCalledWith(
        expect.any(Function),
        'notes-fetching'
      );
    });
  });

  describe('createNote', () => {
    it('should create a note successfully', async () => {
      const noteData = {
        title: 'New Note',
        content: 'Note content'
      };

      const mockResponse = { id: '3', ...noteData };

      const executeSpy = jest.spyOn(service as any, 'executeWithRetry');
      executeSpy.mockResolvedValue(mockResponse);

      const result = await service.createNote(noteData);

      expect(result).toEqual(mockResponse);
      expect(executeSpy).toHaveBeenCalledWith(
        expect.any(Function),
        'note-creation'
      );
    });
  });
});
