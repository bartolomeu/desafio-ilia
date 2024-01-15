import dtDatasource from './database.datasource';

export const databaseProviders = [
  {
    provide: 'DATA_SOURCE',
    useFactory: async () => {
      const dataSource = dtDatasource;
      return dataSource.initialize();
    },
  },
];
