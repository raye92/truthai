import type { Schema } from '../../data/resource';

export const handler: Schema['testMonkey']['functionHandler'] = async (event, context) => {
    //function code
    const { name } = event.arguments;
    return `TESTICLES, ${name}`;
}