const { AuthenticationError } = require('apollo-server-errors');

const Story = require('../../models/Story');
const checkAuth = require('../../util/check-auth');

async function toggleApprove(scenario, username) {
    if(scenario.approvals.find(approval => approval.username === username)) {
        scenario.approvals = scenario.approvals.filter(approval => approval.username !== username)
    } else {
        await scenario.approvals.push({
            username,
            createdAt: new Date().toISOString()
        });
        // if approved, then remove disapproval if set        
        if(scenario.disapprovals.find(disapproval => disapproval.username === username)) {
            scenario.disapprovals = scenario.disapprovals.filter(disapproval => disapproval.username !== username)
        }
    }    
}

async function toggleDisapprove(scenario, username) {
    if(scenario.disapprovals.find(disapproval => disapproval.username === username)) {
        scenario.disapprovals = scenario.disapprovals.filter(disapproval => disapproval.username !== username)
    } else {
        // approve
        await scenario.disapprovals.push({
            username,
            createdAt: new Date().toISOString()
        });
        // if disapproved, then remove approval if set
        if(scenario.approvals.find(approval => approval.username === username)) {
            scenario.approvals = scenario.approvals.filter(approval => approval.username !== username)
        }
    }
}

module.exports = {     
    Mutation: {
        async createTestScenario(_, { storyId, scenario  }, context) {            
            const {username} = checkAuth(context);            
            
            if (scenario.trim() === '') {
                throw new Error('Scenario must not be empty');
            }
            
            const story = await Story.findById(storyId);

            if(story) {
                story.testScenarios.unshift({
                        scenario,
                        username,
                        createdAt: new Date().toISOString()
                });
                await story.save();                                                     
                return story;
            } else {
                throw new Error("Story not found");
            }            
        },
        async approveScenario(_, { storyId, scenarioId }, context) {
            const {username} = checkAuth(context);                                    
            const story = await Story.findById(storyId);
            const scenario = story.testScenarios.find(scenario => scenario.id === scenarioId);
            if(story) {
                toggleApprove(scenario, username);                                
                await story.save();
                return story;
            } else {
                throw new Error("Story not found");
            }
        },
        async disapproveScenario(_, { storyId, scenarioId }, context) {
            const {username} = checkAuth(context);                                    
            const story = await Story.findById(storyId);
            const scenario = story.testScenarios.find(scenario => scenario.id === scenarioId);
            if(story) {                
                toggleDisapprove(scenario, username);                            
                await story.save();
                return story;
            } else {
                throw new Error("Story not found");
            }
        },
        async deleteScenario(_, { storyId, scenarioId }, context) {            
            const { username } = checkAuth(context);
            const story = await Story.findById(storyId);
            if (story) {                
                const scenarioIndex = story.testScenarios.findIndex(c => c.id === scenarioId);
                if(story.testScenarios[scenarioIndex].username === username) {
                    story.testScenarios.splice(scenarioIndex, 1);
                    await story.save();
                    return story;
                } else {
                    throw new AuthenticationError('Action not allowed');
                }
            }
        } 
       
    }
}