// Mock dependencies before importing modules
jest.mock('swagger-jsdoc', () => {
    return jest.fn().mockReturnValue({
      openapi: '3.0.0',
      info: {},
      paths: {}
    });
  });
  
  jest.mock('swagger-ui-express', () => ({
    serve: jest.fn(),
    setup: jest.fn().mockReturnValue((req, res, next) => next())
  }));
  
  jest.mock('fs');
  jest.mock('multer', () => {
    return () => ({
      single: () => (req, res, next) => {
        req.file = {
          path: 'mocked/file/path.jpg'
        };
        next();
      }
    });
  });
  
  jest.mock('../models/TeamMember');
  
  const mongoose = require('mongoose');
  const TeamMember = require('../models/TeamMember');
  const fs = require('fs');
  const teamRoutes = require('../routes/teamRoutes');
  
/**
 * Test suite for Team Member API Routes
 * Tests the CRUD operations for team members including error handling
 */
  describe('Team Member API Routes', () => {
    let mockRequest;
    let mockResponse;
    
    /**
     * Setup before each test
     * Resets mocks and initializes mock request and response objects
     */
    beforeEach(() => {
      // Need to reset mocks before each test
      jest.clearAllMocks();
      
      // Mock request and response
      mockRequest = {
        body: {},
        params: {},
        query: {},
        file: {
          path: 'mock/file/path.jpg'
        }
      };
      
      mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };
      
      // Mock fs.readFileSync to return a dummy buffer
      fs.readFileSync.mockReturnValue(Buffer.from('test-image-data'));
      
      // Mock fs unlinkSync
      fs.unlinkSync.mockImplementation(() => true);
    });
    
    /**
   * Cleanup after all tests
   * Disconnects from MongoDB to prevent connection leaks
   */
    afterAll(() => {
      mongoose.disconnect();
    });
  
    /**
     * Test group for POST /team endpoint
     * Tests creating new team members
     */
    describe('POST /team', () => {

      /**
       * Test case: Creating a new team member successfully
       * Verifies that a team member can be created with valid data
       * and the response contains the expected status and data
       */
        it('should create a new team member successfully', async () => {

            const teamMemberData = {
              name: 'Test Developer',
              position: 'Developer',
              about: 'About test developer',
              linkedin: 'https://linkedin.com/in/testdeveloper',
              team: 'Engineering'
            };
            
            mockRequest.body = teamMemberData;
            
            const savedTeamMember = { 
              ...teamMemberData, 
              _id: 'mock-id-123',
              image: 'data:image/jpeg;base64,dGVzdC1pbWFnZS1kYXRh'
            };
            
            // Mock the TeamMember.prototype.save method
            TeamMember.prototype.save = jest.fn().mockResolvedValue(savedTeamMember);
            
            // Extract the route handler function directly
            const postTeamHandler = extractRouteHandler(teamRoutes, '/team', 'post');
            
            await postTeamHandler(mockRequest, mockResponse);
            
            expect(TeamMember).toHaveBeenCalledWith(expect.objectContaining({
              name: teamMemberData.name,
              position: teamMemberData.position,
              about: teamMemberData.about,
              linkedin: teamMemberData.linkedin,
              team: teamMemberData.team
            }));
            
            expect(mockResponse.status).toHaveBeenCalledWith(200);
            
            // Check json was called with any parameter
            expect(mockResponse.json).toHaveBeenCalled();
            
            expect(fs.unlinkSync).toHaveBeenCalledWith(mockRequest.file.path);
          });
      
      /**
       * Test case: Error handling when creating a team member
       * Verifies that errors during team member creation are properly handled
       * and the appropriate error response is sent
       */
      it('should handle errors when creating a team member', async () => {

        const errorMessage = 'Database connection error';
        TeamMember.prototype.save = jest.fn().mockRejectedValue(new Error(errorMessage));
        
        // Extract the route handler function directly
        const postTeamHandler = extractRouteHandler(teamRoutes, '/team', 'post');
        
        await postTeamHandler(mockRequest, mockResponse);
        
        expect(mockResponse.status).toHaveBeenCalledWith(500);
        expect(mockResponse.json).toHaveBeenCalledWith({
          message: 'Error saving team member',
          error: errorMessage
        });
        expect(fs.unlinkSync).toHaveBeenCalledWith(mockRequest.file.path);
      });
    });
    
    /**
     * Test group for GET /team endpoint
     * Tests fetching team members with various query parameters
     */
    describe('GET /team', () => {

    /**
     * Test case: Fetching team members with pagination
     * Verifies that team members can be retrieved with pagination
     * and the response contains the expected data and pagination info
     */
      it('should fetch team members successfully with pagination', async () => {

        const mockTeamMembers = [
          { _id: 'id1', name: 'Jane Doe', position: 'Manager' },
          { _id: 'id2', name: 'John Smith', position: 'Developer' }
        ];
        
        mockRequest.query = { page: 2, limit: 5 };
        
        const mockFind = {
          skip: jest.fn().mockReturnThis(),
          limit: jest.fn().mockResolvedValue(mockTeamMembers)
        };
        
        TeamMember.find = jest.fn().mockReturnValue(mockFind);
        TeamMember.countDocuments = jest.fn().mockResolvedValue(15);
        
        // Extract the route handler function directly
        const getTeamHandler = extractRouteHandler(teamRoutes, '/team', 'get');
        
        await getTeamHandler(mockRequest, mockResponse);
        
        expect(TeamMember.find).toHaveBeenCalledWith({});
        expect(mockFind.skip).toHaveBeenCalledWith(5); // (page-1) * limit
        expect(mockFind.limit).toHaveBeenCalledWith(5);
        expect(TeamMember.countDocuments).toHaveBeenCalledWith({});
        expect(mockResponse.status).toHaveBeenCalledWith(200);
        expect(mockResponse.json).toHaveBeenCalledWith({
          data: mockTeamMembers,
          total: 15
        });
      });
      
      /**
       * Test case: Filtering team members by team
       * Verifies that team members can be filtered by team parameter
       * and the response contains only the members from the specified team
       */
      it('should filter team members by team parameter', async () => {
        // Arrange
        const mockTeamMembers = [
          { _id: 'id1', name: 'Jane Doe', position: 'Manager', team: 'Engineering' },
        ];
        
        mockRequest.query = { team: 'Engineering' };
        
        const mockFind = {
          skip: jest.fn().mockReturnThis(),
          limit: jest.fn().mockResolvedValue(mockTeamMembers)
        };
        
        TeamMember.find = jest.fn().mockReturnValue(mockFind);
        TeamMember.countDocuments = jest.fn().mockResolvedValue(1);
        
        // Extract the route handler function directly
        const getTeamHandler = extractRouteHandler(teamRoutes, '/team', 'get');
        
        await getTeamHandler(mockRequest, mockResponse);
        
        expect(TeamMember.find).toHaveBeenCalledWith({ team: 'Engineering' });
        expect(mockResponse.status).toHaveBeenCalledWith(200);
        expect(mockResponse.json).toHaveBeenCalledWith({
          data: mockTeamMembers,
          total: 1
        });
      });
    });
    
  /**
   * Test group for DELETE /team/:id endpoint
   * Tests deleting team members and error handling
   */
    describe('Delete Team Members', () => {

      /**
       * Test case: Deleting a team member successfully
       * Verifies that a team member can be deleted by ID
       * and the response contains the expected success message
       */
      it('should delete a team member successfully', async () => {
        // Arrange
        const memberId = 'mock-id-123';
        mockRequest.params = { id: memberId };
        
        const deletedMember = { 
          _id: memberId,
          name: 'John Doe',
          position: 'Developer'
        };
        
        TeamMember.findByIdAndDelete = jest.fn().mockResolvedValue(deletedMember);
        
        // Extract the route handler function directly
        const deleteTeamHandler = extractRouteHandler(teamRoutes, '/team/:id', 'delete');
        
        await deleteTeamHandler(mockRequest, mockResponse);
        
        expect(TeamMember.findByIdAndDelete).toHaveBeenCalledWith(memberId);
        expect(mockResponse.status).toHaveBeenCalledWith(200);
        expect(mockResponse.json).toHaveBeenCalledWith({
          message: 'Team member deleted successfully'
        });
      });
      
      /**
       * Test case: Attempting to delete a non-existent team member
       * Verifies that a 404 error is returned when trying to delete
       * a team member that doesn't exist
       */
      it('should return 404 when team member not found', async () => {

        const memberId = 'non-existent-id';
        mockRequest.params = { id: memberId };
        
        TeamMember.findByIdAndDelete = jest.fn().mockResolvedValue(null);
        
        const deleteTeamHandler = extractRouteHandler(teamRoutes, '/team/:id', 'delete');
        
        await deleteTeamHandler(mockRequest, mockResponse);
        
        expect(TeamMember.findByIdAndDelete).toHaveBeenCalledWith(memberId);
        expect(mockResponse.status).toHaveBeenCalledWith(404);
        expect(mockResponse.json).toHaveBeenCalledWith({
          message: 'Team member not found'
        });
      });
      
      /**
       * Test case: Error handling when deleting a team member
       * Verifies that errors during team member deletion are properly handled
       * and a 500 error response is sent with the appropriate error message
       */
      it('should handle errors when deleting a team member', async () => {

        const memberId = 'mock-id-123';
        mockRequest.params = { id: memberId };
        
        const errorMessage = 'Database deletion error';
        TeamMember.findByIdAndDelete = jest.fn().mockRejectedValue(new Error(errorMessage));
        
        // Extract the route handler function directly
        const deleteTeamHandler = extractRouteHandler(teamRoutes, '/team/:id', 'delete');
        
        await deleteTeamHandler(mockRequest, mockResponse);
        
        expect(TeamMember.findByIdAndDelete).toHaveBeenCalledWith(memberId);
        expect(mockResponse.status).toHaveBeenCalledWith(500);
        expect(mockResponse.json).toHaveBeenCalledWith({
          message: 'Error deleting team member',
          error: errorMessage
        });
      });
    });
  });
  
  /**
   * Helper function to extract a route handler from an Express router
   * @param {object} router - Express router object
   * @param {string} path - Route path
   * @param {string} method - HTTP method (get, post, etc.)
   * @returns {Function} The route handler function
   */
  function extractRouteHandler(router, path, method) {
    const route = router.stack.find(layer => 
      layer.route && 
      layer.route.path === path && 
      layer.route.methods[method]);
    
    if (!route) {
      throw new Error(`Route not found: ${method.toUpperCase()} ${path}`);
    }
    
    // For routes with multiple handlers find the last handler
    const lastHandlerIndex = route.route.stack.length - 1;
    
    // Special case for the POST /team route which has the multer middleware
    if (method === 'post' && path === '/team') {
      return route.route.stack[1].handle;
    }
    
    return route.route.stack[lastHandlerIndex].handle;
  }