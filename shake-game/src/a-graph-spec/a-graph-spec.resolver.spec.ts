import { Test, TestingModule } from '@nestjs/testing';
import { AGraphSpecResolver } from './a-graph-spec.resolver';
import { AGraphSpecService } from './a-graph-spec.service';

describe('AGraphSpecResolver', () => {
  let resolver: AGraphSpecResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AGraphSpecResolver, AGraphSpecService],
    }).compile();

    resolver = module.get<AGraphSpecResolver>(AGraphSpecResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
