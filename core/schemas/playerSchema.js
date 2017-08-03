import {schema,Schema} from 'normalizr';

const playerSchema = new schema.Entity('players');
const countrySchema = new schema.Entity('countries');
const realCompetitorSchema = new schema.Entity('realCompetitors');

realCompetitorSchema.define({
    country:countrySchema
});

playerSchema.define({
    competitor: realCompetitorSchema,
    country: countrySchema
});

const playersSchema = new schema.Array(playerSchema);

export {playersSchema};