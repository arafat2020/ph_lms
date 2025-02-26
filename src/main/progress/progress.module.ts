import { Module } from '@nestjs/common';
import { ProgressService } from './progress.service';

@Module({
  providers: [ProgressService]
})
export class ProgressModule {}
