import { Test, TestingModule } from '@nestjs/testing';
import { ColumnEService } from './column-e.service';

describe('ColumnEService', () => {
  let service: ColumnEService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ColumnEService],
    }).compile();

    service = module.get<ColumnEService>(ColumnEService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
