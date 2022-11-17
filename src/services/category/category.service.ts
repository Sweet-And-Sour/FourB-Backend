import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { ConnectionService } from 'src/services/connection/connection.service';
import { CategoryData } from 'src/interfaces/category-data.interface';
import { getEnvironmentData } from 'worker_threads';

@Injectable()
export class CategoryService {
  private readonly logger = new Logger(CategoryService.name);
  constructor(private connectionService: ConnectionService) {}

  async categoryExist(categoryname: string): Promise<boolean> {
    try {
      const [rows] = await this.connectionService.pool.execute(
        'SELECT categoryname FROM Categories WHERE categoryname=?',
        [categoryname],
      );
  return (rows as any).length === 1;
    } catch (e) {
      this.logger.error(e);
    }

    return false;
  }

    async get(categoryname :string): Promise<boolean> {
    try {
      const [rows] = await this.connectionService.pool.execute(
        'SELECT categoryname FROM Cartegories WHERE categoryname=?',
        [categoryname],
      );

      return (rows as any).length === 1;

      if ((rows as any).length === 1) {
        return rows as any;
      } else {
        return undefined;
      }
    } catch (e) {
      this.logger.error(e);
      return false;
    }
  }

    async create(data: CategoryData) {
    try {
      this.connectionService.pool.execute(
        'INSERT INTO Categoies (categoryname) VALUES (?)',
        [data.name],
      );
    } catch (e) {
      this.logger.error(e);
      return false;
    }

    return true;
  }

   async update(data: CategoryData) {
    if (!(await this.categoryExist(data.name))) {
      this.logger.warn('CategoryService.update: the categoryname is not exists');
      return false;
    }

   try {
      this.connectionService.pool.execute(
        'UPDATE Categories SET email=?, password=? WHERE Categoryname=?',
        [data.name],
      );
       } catch (e) {
      return false;
    }

    return true;
  }

   async delete(categoryname: string) {
    if (!(await this.categoryExist(categoryname))) {
      this.logger.warn('CategoryService.delete: the categoryname is not exists');
      return false;
    }

    try {
      this.connectionService.pool.execute(
        'DELETE FROM Categories WHERE categoryname=?',
        [categoryname],
      );
    } catch (e) {
      this.logger.error(e);
      return false;
    }

    return true;
  }
}
