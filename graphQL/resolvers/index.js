const storiesResolvers = require('./stories');
const usersResolvers = require('./users');
const commentsResolvers = require('./comments');
const testScenariosResolvers = require('./testScenarios');
const epicsResolvers = require('./epics');
const organizationsResolvers = require('./organizations');
const resolversJira = require('./resolversJira');

// each query, mutation or sub, it has a resolver to process the logic


module.exports = {
    Epic: {                
        storyCount: epicsResolvers.StoryCountInEpic.getStoryCountByEpic,
        scenarioCount: epicsResolvers.ScenarioCountInEpic.getScenarioCountByEpic
    },
    Story: {
        likeCount: (parent) => parent.likes.length,
        commentCount: (parent) => parent.comments.length, 
        testScenarioCount: (parent) => parent.testScenarios.length          
    },
    TestScenario: {        
        approvalCount: (parent) => parent.approvals.length,
        disapprovalCount: (parent) => parent.disapprovals.length,
        commentCount: (parent) => parent.comments.length             
        // questionCount: (parent) => parent.questions.length,
        // viewerCount: (parent) => parent.viewers.length
    },
    JiraIssue: {
        epicImported: resolversJira.HasEpicBeenImported.hasEpicBeenImported,    
        storyImported: resolversJira.HasStoryBeenImported.hasStoryBeenImported    
    },
    Query: {
        ...storiesResolvers.Query,
        ...usersResolvers.Query,
        ...epicsResolvers.Query,
        ...organizationsResolvers.Query,
        ...resolversJira.Query
    },
    Mutation: {
        ...epicsResolvers.Mutation,
        ...usersResolvers.Mutation,
        ...storiesResolvers.Mutation,
        ...commentsResolvers.Mutation,
        ...testScenariosResolvers.Mutation,        
    },    
    
    // Subscription: {
    //     ...storiesResolvers.Subscription
    // }
};