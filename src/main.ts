import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { TaskExcelService } from './excel/excel.service';

async function bootstrap() {
  const PORT = process.env.PORT || 5000;
  const app = await NestFactory.create(AppModule);

  (await app).listen(PORT, () => console.log(`Server started on port ${PORT}`));

  const path = require('path');
  const filePath = path.join(__dirname, '../', 'src', 'excel', 'table.xlsx');
  await TaskExcelService.importTasksFromExcel(filePath);

  (async () => {
    const result = await fetch('https://api.pinterest.com/v5/user_account', {
      method: 'GET',
      headers: {
        'Authorization': 'Bearer <access_token>',
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });
    console.log(await result.json());
  })();
}
bootstrap();
