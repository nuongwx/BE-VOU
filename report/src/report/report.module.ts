import { Module } from '@nestjs/common';
import { ReportService } from './report.service';
import { ReportResolver } from './report.resolver';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  providers: [ReportService, ReportResolver, PrismaService],
})
export class ReportModule {}
