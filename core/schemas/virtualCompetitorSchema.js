import {schema,Schema} from 'normalizr';

/*const virtualCompetitionGroupSchema = new schema.Entity('groups');
const virtualCompetitionSchema = new schema.Entity('virtualCompetitions');
const subscribersSchema = new schema.Entity('subscribers');
const virtualCompetitor = new schema.Entity('competitors');

const virtualCompetitorsSchema = new schema.Array('virtualCompetitors');

virtualCompetitorsSchema.define({
    subscriber: subscribersSchema,
    competition: virtualCompetitionSchema,
    group: virtualCompetitionGroupSchema
});

virtualCompetitor.define(
    data: virtualCompetitorsSchema
)
*/
const virtualCompetitorSchema = new schema.Entity('competitors');
const virtualCompetitionGroupSchema = new schema.Entity('groups');
const virtualCompetitionSchema = new schema.Entity('virtualCompetitions');
const subscribersSchema = new schema.Entity('subscribers');

virtualCompetitorSchema.define({
    subscriber: subscribersSchema,
    competition: virtualCompetitionSchema,
    group: virtualCompetitionGroupSchema
});

const virtualCompetitorsSchema = new schema.Array(virtualCompetitorSchema);

export {virtualCompetitorsSchema};