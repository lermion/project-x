describe('Groups factory', function () {
    var Users;
    beforeEach(module('ui.router'));
    // Before each test load our api.users module
    beforeEach(angular.mock.module('app.groups'));


    // Before each test set our injected Users factory (_Users_) to our local Users variable
    beforeEach(inject(function(_groupsService_){
        groupsService = _groupsService_;
    }));
    //
    //// A simple test to verify the Users factory exists
    it('should exist', function () {
        expect(groupsService).toBeDefined();
    });
});