import { Deserializable } from './deserializable.model';

export class Developer implements Deserializable {
  developer?: { logo: string; url: string; name: string; location: string };
  projects?: string[];

  deserialize(input: any) {
    Object.assign(this, input);
    return this;
  }
}
