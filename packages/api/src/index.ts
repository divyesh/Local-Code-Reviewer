import Fastify from 'fastify';
import cors from '@fastify/cors';
import multipart from '@fastify/multipart';
import { OllamaClient, ReviewEngine } from '@local-reviewer/core';
import chalk from 'chalk';

const fastify = Fastify({ logger: true });

await fastify.register(cors);
await fastify.register(multipart);

fastify.post('/api/review', async (request, reply) => {
  const parts = request.parts();
  let diff = '';
  let model = 'qwen';

  for await (const part of parts) {
    if (part.type === 'file') {
      const buffer = await part.toBuffer();
      diff = buffer.toString('utf-8');
    } else {
      if (part.fieldname === 'model') {
        model = (part.value as string) || 'qwen';
      }
    }
  }

  if (!diff) {
    return reply.status(400).send({ error: 'No diff content provided' });
  }

  try {
    const client = new OllamaClient({ model });
    const engine = new ReviewEngine(client);
    
    console.log(chalk.blue(`Processing review with model: ${model}`));
    const result = await engine.runMultiPassReview(diff);
    
    return result;
  } catch (error) {
    fastify.log.error(error);
    return reply.status(500).send({ error: 'Review failed', details: error instanceof Error ? error.message : String(error) });
  }
});

const start = async () => {
  try {
    await fastify.listen({ port: 3001, host: '0.0.0.0' });
    console.log(chalk.green('\n🚀 Backend API running at http://localhost:3001'));
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
