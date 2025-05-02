
import { rest } from 'msw';
import { mockCourses, mockModules } from './data-mocks';

// Define API mocking handlers
export const handlers = [
  // Get courses
  rest.get('/api/courses', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        courses: mockCourses
      })
    );
  }),

  // Get course by id
  rest.get('/api/courses/:courseId', (req, res, ctx) => {
    const { courseId } = req.params;
    const course = mockCourses.find(c => c.id === courseId);
    
    if (!course) {
      return res(
        ctx.status(404),
        ctx.json({ error: "Course not found" })
      );
    }
    
    return res(
      ctx.status(200),
      ctx.json(course)
    );
  }),

  // Get modules for a course
  rest.get('/api/courses/:courseId/modules', (req, res, ctx) => {
    const { courseId } = req.params;
    const modules = mockModules.filter(m => m.courseId === courseId);
    
    return res(
      ctx.status(200),
      ctx.json({
        modules
      })
    );
  }),
];
