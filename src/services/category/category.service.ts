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
        'SELECT name FROM Categories WHERE name=?',
        [categoryname],
      );
  return (rows as any).length > 0;
    } catch (e) {
      this.logger.error(e);
    }

    return false;
  }

    async getAll(): Promise<any> {
    try {
      const [rows] = await this.connectionService.pool.execute(
        'SELECT name FROM Categories',
        [],
      );

      return rows;

    } catch (e) {
        console.error(e);
        this.logger.error(e);
        return undefined;
    }
  }

    async create(data: CategoryData) {
    try {
      this.connectionService.pool.execute(
        'INSERT INTO Categories (name) VALUES (?)',
        [data.name],
      );
    } catch (e) {
      this.logger.error(e);
      return false;
    }

    return true;
  }

   async update(oldname: string, newname: string) {
    if (!(await this.categoryExist(oldname))) {
      this.logger.warn('CategoryService.update: the categoryname is not exists');
      return false;
    }

   try {
      this.connectionService.pool.execute(
        'UPDATE Categories SET name=? WHERE name=?',
        [newname, oldname],
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
        'DELETE FROM Categories WHERE name=?',
        [categoryname],
      );
    } catch (e) {
        console.error(e);
      this.logger.error(e);
      return false;
    }

    return true;
  }
}
