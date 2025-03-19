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
  const express = require('express');
  const TeamMember = require('../models/TeamMember');
  const fs = require('fs');
  const teamRoutes = require('../routes/teamRoutes');
  
  describe('Team Member API Routes', () => {
    let mockRequest;
    let mockResponse;
    
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
    
    afterAll(() => {
      mongoose.disconnect();
    });
  
    describe('POST /team', () => {
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
    
    describe('GET /team', () => {
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
    
    describe('Delete Team Members', () => {
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