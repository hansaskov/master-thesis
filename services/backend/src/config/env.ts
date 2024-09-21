import { Type } from '@sinclair/typebox';
import { envious } from '@pitininja/envious';

const schema = Type.Object({
    DATABASE_URL: Type.String({ minLength: 10 }),
    GITHUB_CLIENT_ID: Type.String({ minLength: 10 }),
    GITHUB_CLIENT_SECRET: Type.String({ minLength: 10 }),
    IS_PRODUCTION: Type.Boolean()
});

export const env = envious(schema);