import { Injectable, Logger } from '@nestjs/common';
import { writeFileSync, accessSync, unlinkSync, constants, createReadStream } from 'fs';
import { join } from 'path';
import { ConnectionService } from '../connection/connection.service';
import * as crypto from 'crypto';

@Injectable()
export class FileService {
  private readonly logger = new Logger(FileService.name);
  constructor(private connectionService: ConnectionService) {}

  async isFileExist(filename: string) {
    return (await this.getFile(filename) as any).length > 0;
  }

  async isHashExist(hash: string) {
    try {
      const [rows] = await this.connectionService.pool.execute(
        'SELECT * FROM Files WHERE hash_id=?',
        [hash],
      );

      return (rows as any).length > 0;
    } catch (e) {
      this.logger.error(e);
    }

    return undefined;
  }

  async getFile(filename: string) {
    try {
      const [rows] = await this.connectionService.pool.execute(
        'SELECT * FROM Files WHERE filename=?',
        [filename],
      );

      return rows;
    } catch (e) {
      this.logger.error(e);
    }

    return undefined;
  }

  async getFileFromHash(hash: string) {
    try {
      const [rows] = await this.connectionService.pool.execute(
        'SELECT * FROM Files WHERE hash_id=?',
        [hash],
      );

      return rows;
    } catch (e) {
      this.logger.error(e);
    }

    return undefined;
  }

  getHash(data: any) {
    return crypto.createHash('sha512').update(data).digest('base64');
  }

  async createFile(file: Express.Multer.File) {
    const originalname = Buffer.from(file.originalname, 'latin1').toString('utf-8');
    const hash = this.getHash(file.buffer);

    if (await this.isHashExist(hash)) {
      const result = await this.getFileFromHash(hash) as any;

      if (result !== undefined && result.length >= 1) {
        const file = result[0];

        return {
          message: '이미 해당 파일은 등록되어 있습니다',
          success: true,
          filename: file.filename,
          url: `/api/static/${file.filename}`,
        }
      } else {
        this.logger.error('FileService.createFile: 이미 존재하는 파일의 데이터를 확인할 수 없습니다');
        
        return {
          message: '알 수 없는 오류가 발생했습니다',
          success: false,
        }
      }
    }

    const uploadLimit = parseInt(process.env['BACKEND_UPLOAD_LIMIT']);
    if (file.size == uploadLimit) {
      return {
        message: `최대 파일 용량을 초과했습니다. (제한 용량: ${uploadLimit})`,
        success: false,
        size: file.size,
      }
    }

    try {
      const now = new Date;
      const utcTimestamp = Date.UTC(
        now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), now.getUTCHours(),
        now.getUTCMinutes(), now.getUTCSeconds(), now.getUTCMilliseconds()
      );

      const filename = utcTimestamp.toString();
      const filepath = join(process.env['BACKEND_STATIC_FILES'], filename);

      writeFileSync(filepath, file.buffer, {});

      await this.connectionService.pool.execute(
        'INSERT INTO Files (hash_id, originalname, filename, mime) VALUES (?, ?, ?, ?)',
        [hash, originalname, filename, file.mimetype],
      );

      this.logger.log(`FileService.createFile: 새로운 파일 추가 (filename: ${filename})`);

      return {
        message: '파일 업로드 (새로운 파일 추가)',
        success: true,
        filename: filename,
        url: `/api/static/${filename}`,
      }

    } catch (e) {
      console.error(e);
      this.logger.error(e);

      // TODO: rollback

      return {
        message: '오류가 발생했습니다.',
        error: e.code,
        success: false,
      }
    }
  }

  async streamFile(filename: string) {
    const file = await this.getFile(filename) as any;

    if (file.length == 0) {
      return {
        message: '파일이 존재하지 않습니다.',
        success: false,
        filename: filename,
      }
    }

    try {
      const filepath = join(process.env['BACKEND_STATIC_FILES'], filename);
      await accessSync(filepath, constants.F_OK);
      const stream = createReadStream(filepath);
      const fileInfo = file[0];

      return {
        message: '파일 스트리밍',
        success: true,
        hash: fileInfo.hash_id,
        originalname: fileInfo.originalname,
        mime: fileInfo.mime,
        stream: stream,
      };

    } catch (e) {
      console.error(e);
      this.logger.error(e);

      return {
        message: '오류가 발생했습니다.',
        error: e.code,
        success: false,
      }
    }
  }

  async deleteFile(filename: string) {
    const file = await this.getFile(filename) as any;

    if (file.length == 0) {
      return {
        message: '파일이 존재하지 않습니다.',
        success: false,
        filename: filename,
      }
    }

    try {
      const filepath = join(process.env['BACKEND_STATIC_FILES'], filename);
      await accessSync(filepath, constants.F_OK);
      await unlinkSync(filepath);

      await this.connectionService.pool.execute(
        'DELETE FROM Files WHERE filename=?',
        [filename],
      );
  
      this.logger.log(`FileService.deleteFile: 파일 삭제 (filename: ${filename})`);

      return {
        message: '파일 삭제 완료',
        success: true,
        filename: filename,
      }

    } catch (e) {
      console.error(e);
      this.logger.error(e);

      return {
        message: '오류가 발생했습니다.',
        error: e.code,
        success: false,
      }
    }
  }
}
