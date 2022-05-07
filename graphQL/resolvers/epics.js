const { AuthenticationError } = require('apollo-server-errors');
const Epic = require('../../models/Epic');
const User = require('../../models/User');
const Organization = require('../../models/Organization');
const checkAuth = require('../../util/check-auth');
const Story = require('../../models/Story');


module.exports = {
    StoryCountInEpic: {
        async getStoryCountByEpic(parent, { }, context) { 
            const storyCount = await Story.find({epic: parent.id});             
            return storyCount.length;    
        }
    },
    ScenarioCountInEpic: {
        async getScenarioCountByEpic(parent, { }, context) {                        
            const story = await Story.find({epic: parent.id});    
            let scenarioCount = 0;
            for (let i=0; i<story.length; i++){            
                scenarioCount += story[i].testScenarios.length;
            }            
            return scenarioCount;
        }
    },
    Query: {
        async getEpics(_, { orgName }, context) {    
            const {username} = checkAuth(context);
            try { 
                const org = await Organization.find({orgName});
                if (org) {
                    const epics = await Epic.find({organization: org})                    
                    .limit(10)                    
                    .populate('owner')
                    .populate('users')
                    .populate('organization')                    
                    .sort({ createdAt: -1 });
                
                // By enabling this, only users that are in the users list will see the epics
                // For the MVP, users will see all epics for their org
                // if (epics.find(epic => 
                //     epic.users.find(user => 
                //         user.username === username)
                //     )
                // )                              

                return epics;
                
                }                
            } catch (err) {
                throw new Error(err);
            }
        },            
        async getEpic(_, { epicId }, context) {            
            try {                                 
                const epic = await Epic.findById(epicId)                    
                    .populate('users');
                return epic;
            } catch (err) {
                throw new Error(err);
            }
        },        
    },   
    Mutation: {
        async createEpic(_, { epicName, description, jiraKey=null, jiraId=null }, context) {              
            const user = checkAuth(context);
            const userFull = await User.findOne(user);
            console.log(`creating epic what are Jira params? ${jiraKey} ${jiraId} `);
            if (epicName.trim() === '') {
                throw new Error('Epic name must not be empty');
            }
                
            const userOrg = await Organization.findOne({users:user.id});
            const newEpic = new Epic({
                epicName, 
                description,                    
                createdAt: new Date().toISOString(),                
                owner: userFull,    
                organization: userOrg,
                users: [userFull],                
                jiraKey,
                jiraId
            });            
            const epic = await newEpic.save();            
            return epic;
        },
        async deleteEpic(_, { epicId }, context) {
            const user = checkAuth(context);
            try {
                const epic = await Epic.findById(epicId).populate('owner');
                if (user.username === epic.owner.username) {
                    await epic.delete();
                    return 'Epic deleted';
                } else {
                    throw new AuthenticationError("Operation not allowed");
                }
            } catch (err) {
                throw new Error(err);
            }
        }
    }
};

                