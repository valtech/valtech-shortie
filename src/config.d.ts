declare module config {
  interface DbConfig {
    type: string;
    options: any;
  }

  interface Config {
    db: DbConfig;
  }

  function current(): Config;
}