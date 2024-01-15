import { DataSource } from 'typeorm';

export default new DataSource({
  // PUT THIS DATA IN .env FILE
  type: 'mysql',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  
  entities: [process.cwd() + '/src/**/*.entity.ts'],
  migrations: [process.cwd() + '/migrations/*.ts'],
});
