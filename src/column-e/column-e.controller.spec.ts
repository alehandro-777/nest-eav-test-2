import { Test, TestingModule } from '@nestjs/testing';
import { ColumnEController } from './column-e.controller';
import { ColumnEService } from './column-e.service';

describe('ColumnEController', () => {
  let controller: ColumnEController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ColumnEController],
      providers: [ColumnEService],
    }).compile();

    controller = module.get<ColumnEController>(ColumnEController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
