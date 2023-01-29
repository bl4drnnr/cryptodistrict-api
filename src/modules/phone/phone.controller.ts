import { Controller, Post } from '@nestjs/common';
import { PhoneService } from './phone.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Phone')
@Controller('phone')
export class PhoneController {
  constructor(private readonly phoneService: PhoneService) {}

  @Post('confirm')
  confirm() {
    return 0;
  }
}
