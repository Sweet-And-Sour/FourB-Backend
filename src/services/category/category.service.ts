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

  async categoryCount() {
    const [rows] = await this.connectionService.pool.execute(
      'select category, count(id) as count from contents group by category;',
      []
    );

    const result = rows as any;
    const converted = {};

    for (let index = 0; index < result.length; index++) {
      const title = result[index].category;
      const value = result[index].count;

      converted[title] = value;
    }

    return converted;
  }

  async getAll(): Promise<any> {
    try {
      const [rows] = await this.connectionService.pool.execute(
        `SELECT name, thumbnail, ifnull(count, 0) as count FROM Categories
        LEFT JOIN (SELECT category, count(id) AS count FROM contents GROUP BY category) AS A
        ON Categories.name = A.category
        ORDER BY count DESC`,
        [],
      );

      return rows;
    } catch (e) {
      console.error(e);
      this.logger.error(e);
      return undefined;
    }
  }

  async create(categoryname: string) {
    if (await this.categoryExist(categoryname)) {
      this.logger.warn(
        `CategoryService.create: the categoryname is not exists (name: ${categoryname})`,
      );
      return false;
    }

    try {
      this.connectionService.pool.execute(
        'INSERT INTO Categories (name) VALUES (?)',
        [categoryname],
      );
    } catch (e) {
      this.logger.error(e);
      return false;
    }

    return true;
  }

  async update(oldname: string, newname: string) {
    if (!(await this.categoryExist(oldname))) {
      this.logger.warn(
        `CategoryService.update: the categoryname is not exists (newname: ${newname}, oldname: ${oldname})`,
      );
      return false;
    }

    try {
      console.log(newname, oldname);
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
      this.logger.warn(
        'CategoryService.delete: the categoryname is not exists',
      );
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
