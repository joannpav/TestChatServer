const Organization = require('../../models/Organization');
const checkAuth = require('../../util/check-auth');

module.exports = {
    Query: {
        async getOrgId(_, { orgName }, context) {
            try {
                const orgId = await Organization.find(orgName);
                return orgId;
            } catch (err) {
                throw new Error(err);
            }
        }
    }
}