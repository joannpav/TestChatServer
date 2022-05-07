const { AuthenticationError, UserInputError } = require('apollo-server-errors');
const Story = require('../../models/Story');
const Epic = require('../../models/Epic');
const checkAuth = require('../../util/check-auth');


module.exports = {    
    Query: {
        async getStories(_, { epicId }){
            try{
                const epic = await Epic.findById(epicId);                    
                const stories = await Story.find({epic})
                    .populate('epic')
                    .sort({ createdAt: -1 });                                
                return stories;
            } catch(err) {
                throw new Error(err);
            }
        },
        async getStory(_, { storyId }){
            try{                
                const story = await Story.findById(storyId)
                    .populate('epic');                                
                if(story){
                    return story;
                } else {
                    throw new Error("Story not found");
                }
                
            } catch(err) {
                throw new Error(err);
            }
        }

    },
    Mutation: {
        async createStory(_, { epicId, body, acceptanceCriteria, jiraKey=null, jiraId=null }, context) {            
            // TODO: Need to make epic mandatory
            const user = checkAuth(context);
            
            
            const epic = await Epic.findById(epicId);
            
            if (body.trim() === '') {
                throw new Error('Story body must not be empty');
            }
            // THIS IS DUMB! Why isn't the comparison working??
            // console.log(`users in here? ${JSON.stringify(epic.users[0])}`);
            // console.log(`users in here? ${JSON.stringify(user.id)}`);
            // console.log(`users in here? ${JSON.stringify(user.username)}`);
            // if (epic.users.find(epicUser => {
            //         console.log(`blah ${JSON.stringify(epicUser)}`);
            //         console.log(`blah2 ${JSON.stringify(user.id)}`);
            //         epicUser.toString() === user.id.toString()
            //     }
            //     )) {
                const newStory = new Story({
                    epic: epic, 
                    body,
                    acceptanceCriteria,
                    user: user.id,
                    username: user.username,                
                    createdAt: new Date().toISOString(),
                    jiraKey,
                    jiraId
                });
    
                const story = await newStory.save();
                
                return story;
            // } else {
            //     throw new Error("User not authorized");
            // }
            
        },

        async deleteStory(_, { storyId }, context) {
            const user = checkAuth(context);            
            try {
                const story = await Story.findById(storyId);
                
                if (user.username === story.username){
                    await story.delete();
                    return 'Story deleted successfully';
                } else {
                    throw new AuthenticationError("Operation not allowed");
                }
            } catch(err) {
                throw new Error(err);
            }           
        },
        async likeStory(_, { storyId }, context) {
            const { username } = checkAuth(context);                      
            const story = await Story.findById(storyId);
            
            if(story){
                if (story.likes.find(like => like.username === username )){
                    // story already liked, unlike ti
                    story.likes = story.likes.filter(like => like.username !== username)                        
                } else {
                    // not liked, so like it
                    await story.likes.push({
                        username,
                        createdAt: new Date().toISOString()
                    })
                }
                await story.save();
                return story;
            } else {
                throw new UserInputError("Story not found");
            }                            
        }
    },
 
};