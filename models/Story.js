const { model, Schema } = require('mongoose');

const storySchema = new Schema({
    epic: {
        type: Schema.Types.ObjectId,
        ref: 'Epic'
    },
    epicName: String,
    body: String,
    acceptanceCriteria: String,
    username: String,
    createdAt: String,  
    jiraKey: String,
    jiraId: String, 
    testScenarios: [
            {
                scenario: String,
                risk: String,
                testType: String,
                executionType: String,
                username: String,
                createdAt: String, 
                approvals: [
                    {
                        username: String,
                        createdAt: String
                    }
                ],
                disapprovals: [
                    {
                        username: String,
                        createdAt: String
                    }
                ],
                comments: [
                    {
                        body: String,
                        username: String,
                        createdAt: String
                    }
                ],
            }
        ],
    comments: [
        {
            body: String,
            username: String,
            createdAt: String
        }
    ],
    likes: [
        {
            username: String,
            createdAt: String
        }
    ],
    user: {
        type: Schema.Types.ObjectId,
        ref: 'users'
    }
});

module.exports = model('Story', storySchema);