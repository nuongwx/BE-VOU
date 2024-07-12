import { Test, TestingModule } from '@nestjs/testing';
import { AGraphSpecService } from './a-graph-spec.service';

describe('AGraphSpecService', () => {
  let service: AGraphSpecService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AGraphSpecService],
    }).compile();

    service = module.get<AGraphSpecService>(AGraphSpecService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
