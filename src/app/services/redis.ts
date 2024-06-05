import redisClient from '@/redisClient';

export async function setValue(key: string, value: string): Promise<boolean> {
   try {

     await redisClient.set(key, value);
     return true;
   } catch (error) {

     console.error('Error setting key in Redis:', error);
     return false;
   }
}

export async function getValue(key: string): Promise<string | null> {
   try {

      const value = await redisClient.get(key);
      return value;
   } catch (error) {

      console.error('Error getting value from Redis:', error);
      throw error;
   }
}

export async function checkKey(key: string): Promise<boolean> {
   try {

      const result = await redisClient.exists(key);
      return result === 1;
   } catch (error) {

      console.error('Error checking key existence in Redis:', error);
      return false;
   }
}