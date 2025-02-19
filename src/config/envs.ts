import 'dotenv/config';
import * as joi from 'joi';

interface EnvVars {
    PORT: number;
    
    USERS_MICROSERVICE_HOST: string;
    USERS_MICROSERVICE_PORT: number;

    EMPRESAS_MICROSERVICE_HOST: string;
    EMPRESAS_MICROSERVICE_PORT: number;
}

const envsSchema = joi.object({
    PORT: joi.number().required(),
    

    USERS_MICROSERVICE_HOST: joi.string().required(),
    USERS_MICROSERVICE_PORT: joi.number().required(),

    EMPRESAS_MICROSERVICE_HOST: joi.string().required(),
    EMPRESAS_MICROSERVICE_PORT: joi.number().required(),
})
.unknown(true);

const { error, value } = envsSchema.validate(process.env);

if (error) {
    throw new Error(`Config validation error: ${error.message}`);
}

const envVars: EnvVars = value;

export const envs = {
    port: envVars.PORT,
    
    usersMicroservicesHost: envVars.USERS_MICROSERVICE_HOST,
    usersMicroservicesPort: envVars.USERS_MICROSERVICE_PORT,

    empresasMicroservicesHost: envVars.EMPRESAS_MICROSERVICE_HOST,
    empresasMicroservicesPort: envVars.EMPRESAS_MICROSERVICE_PORT,
};