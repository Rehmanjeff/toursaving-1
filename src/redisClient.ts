import Redis, { RedisOptions, Redis as RedisClient } from 'ioredis';

const redisClient: RedisClient = new Redis("rediss://default:a9125c69cd564e679d2272e8fada56b7@civil-heron-42015.upstash.io:42015");

export default redisClient;
