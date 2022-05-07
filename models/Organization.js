const { model, Schema } = require('mongoose');

const organizationSchema = new Schema({
    orgName: String,    
    createdAt: String,           
    adminUser: String,
    users: [{
        type: Schema.Types.ObjectId,
        ref: 'users'
    }],
    epics: [{
        type: Schema.Types.ObjectId,
        ref: 'epics'
    }]
});

module.exports = model('Organization', organizationSchema);