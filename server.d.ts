declare namespace Server {

  interface IServerFeatureEndpoint {
    data: IServerFeature[];
  }

  interface IServerFeature {
    name: string;
    currentValue: 'true' | 'false';
  }
}