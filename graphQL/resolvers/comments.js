const { AuthenticationError, UserInputError } = require('apollo-server-errors');

const Story = require('../../models/Story');
const checkAuth = require('../../util/check-auth');

module.exports = {
    Mutation: {  
        async createScenarioComment(_, { storyId, scenarioId, body }, context) {
            const { username } = checkAuth(context);
            
            if(body.trim() === '') {
                throw new UserInputError('Empty comments not allowed', {
                    errors: {
                        body: 'Comment body must not be empty'
                    }
                })
            }
            
            const story = await Story.findById(storyId);
            if (story) {
                const scenario = story.testScenarios.find(c => c.id === scenarioId);                                        
                if(scenario) {
                    scenario.comments.unshift({
                        body,
                        username,
                        createdAt: new Date().toISOString()
                    });                    
                    await story.save();
                    return scenario;
                } else {
                    throw new UserInputError('Scenario not found');
                }
            }            
        },      
        async createComment(_, { storyId, body }, context) {            
            const { username } = checkAuth(context);
            if(body.trim() === ''){
                throw new UserInputError('Empty comments not allowed', {
                    errors: {
                        body: 'comment body must not be empty'
                    }
                })
            }
            const story = await Story.findById(storyId);

            if(story) {
                story.comments.unshift({
                    body,
                    username,
                    createdAt: new Date().toISOString()
                });
                await story.save();
                return story;
            
            } else {
                throw new UserInputError('Story not found');
            }                            
        },
        async deleteComment(_, { storyId, commentId }, context) {
            const { username } = checkAuth(context);
            const story = await Story.findById(storyId);
            if (story) {
                const commentIndex = story.comments.findIndex(c => c.id === commentId);                                        
                if(story.comments[commentIndex].username === username) {
                    story.comments.splice(commentIndex, 1);
                    await story.save();
                    return story;
                } else {
                    throw new AuthenticationError('Action not allowed');
                }
                    
            }
        }        
    }
}