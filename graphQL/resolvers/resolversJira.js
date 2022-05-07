const Epic = require('../../models/Epic');
const Story = require('../../models/Story');
const mongoose = require('mongoose');


async function findEpic(summary) {
  let epic = await Epic.find({epicName: summary});
  return true ? epic.length > 0 : false;
}

async function findJiraKeyByEpicId(epicId) {
  let epic = await Epic.find({_id:mongoose.Types.ObjectId(epicId)});
  return epic[0]?.jiraKey ? epic[0]?.jiraKey : undefined
}

async function findStory(jiraKey) {
  let story = await Story.find({jiraKey: jiraKey});
  return true ? story.length > 0 : false;  
}


module.exports = {
  HasEpicBeenImported: {
    async hasEpicBeenImported(parent, { }, context) {
      // TODO: Update to search for Jira epic Key, using summary can be too generic
      const addedToOrg = await findEpic(parent.fields.summary);
      return addedToOrg;
    }
  },
  HasStoryBeenImported: {
    async hasStoryBeenImported(parent, { }, context) {
      const addedToOrg = await findStory(parent.key);
      return addedToOrg;
    }
  },
  Query: {
    async getJiraEpics(_, { projectKey }, { dataSources }) {          
        return await dataSources.jiraAPI.getEpics({ projectKey });    
    },
    async getJiraStories(_, { projectKey, epicId }, { dataSources }) {
      const epicJiraKey = await findJiraKeyByEpicId(epicId);
      let jiraStories = await dataSources.jiraAPI.getStories({ projectKey, epicJiraKey });
      return jiraStories;
      // return await dataSources.jiraAPI.getStories({ projectKey, epicJiraKey });
    }
  }
}