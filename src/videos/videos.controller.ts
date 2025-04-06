import { Controller, Post, Put, Delete, Get, Param, Body, Query, Req, HttpStatus, HttpException, Res } from '@nestjs/common';
import { VideosService } from './videos.service';
import { Video } from 'src/entities/video.entity';
import { CreateVideoDto } from '../DTO/createVideoDto';
import { ChangeVideoDataDto } from '../DTO/changeVideoDataDto';
import { VideoDataDto } from '../DTO/videoDataDto';
import { Request, Response } from 'express';
import { JwtService } from '@nestjs/jwt';

@Controller('videos')
export class VideosController {

    constructor(
        private readonly videosService: VideosService,
        private readonly jwtService: JwtService,
    ) {}

    @Post()
    async uploadVideo(@Req() req: Request, @Body() createVideoDto: CreateVideoDto, @Res() res: Response) {
        const timestamp = new Date().toISOString();

        try {
            const token = this.extractToken(req)
            const decodedToken = this.jwtService.verify(token);

            if (decodedToken.role !== 'Administrador') {
                throw new HttpException('Acceso denegado. Se necesita iniciar sesión como Administrador.', HttpStatus.FORBIDDEN)
            }

            const newVideo = await this.videosService.createVideo(createVideoDto);
            return res.status(HttpStatus.OK).json({
                success: true,
                message: 'Se ha subido el video correctamente.',
                data: newVideo,
                code: HttpStatus.OK,
                timestamp,
                errors: []
            });
        } catch(error) {
            return res.status(error.status || HttpStatus.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: error.message || 'Error al subir el video.',
                data: null,
                code: error.status || HttpStatus.INTERNAL_SERVER_ERROR,
                timestamp,
                errors: error.response?.errors || [error.message || 'Ocurrió un error']
              });
        }
    }
    
    @Get(':id')
    async getVideo(@Req() req: Request, @Param('id') id: string, @Res() res: Response) {  
        const timestamp = new Date().toISOString();

        try {
            const token = this.extractToken(req);
            const decodedToken = this.jwtService.verify(token);

            if (!decodedToken) {
                throw new HttpException('Acceso denegado. Debe iniciar sesión.', HttpStatus.UNAUTHORIZED);
            }

            const videoDto = await this.videosService.getVideoById(id);

            return res.status(HttpStatus.OK).json({
                success: true,
                message: 'Video obtenido con éxito.',
                data: videoDto,
                code: HttpStatus.OK,
                timestamp,
                errors: []
            })
        }  catch (error) { 
            return res.status(error.status || HttpStatus.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: error.message || 'Error al obtener el video.',
                data: null,
                code: error.status || HttpStatus.INTERNAL_SERVER_ERROR,
                timestamp,
                errors: error.response?.errors || [error.message || 'Ocurrió un error']
              });
        }
    }

    @Put(':id')
    async updateVideo(@Req() req: Request,@Param('id') id: string, @Body() changeVideoDataDto: ChangeVideoDataDto, @Res() res: Response) {
        const timestamp = new Date().toISOString();

        try {
            const token = this.extractToken(req);
            const decodedToken = this.jwtService.verify(token);

            if(decodedToken.role !== 'Administrador') {
                throw new HttpException('Acceso denegado. Solo los administradores pueden actualizar videos.', HttpStatus.FORBIDDEN);
            }

            const updatedVideoDto = await this.videosService.updateVideoData(id, changeVideoDataDto);

            return res.status(HttpStatus.OK).json({
                success: true,
                message: 'Video actualizado con éxito',
                data: { video: updatedVideoDto },
                code: HttpStatus.OK,
                timestamp,
                errors: []
            });
        } catch (error) { 
            return res.status(error.status || HttpStatus.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: error.message || 'Error al actualizar el video',
                data: null,
                code: error.status || HttpStatus.INTERNAL_SERVER_ERROR,
                timestamp,
                errors: error.response?.errors || [error.message || 'Ocurrió un error'],
            });
        }
    }

    @Delete(':id')
    async deleteVideo(@Req() req: Request, @Param('id') id: string, @Res() res: Response): Promise <null> {
        const timestamp = new Date().toISOString();

        try {
            const token = this.extractToken(req);
            const decodedToken = this.jwtService.verify(token);

            if(decodedToken.role !== 'Administrador') {
                throw new HttpException('Acceso denegado. Solo los administradores pueden eliminar videos.', HttpStatus.FORBIDDEN);
            }

            return this.videosService.deleteVideo(id);
        } catch (error) { 
            throw new HttpException({
                success: false,
                message: 'Error al eliminar el video',
                data: null,
                code: error.status || HttpStatus.INTERNAL_SERVER_ERROR,
                timestamp,
                errors: error.response?.errors || [error.message || 'Ocurrió un error'],
            }, error.status || HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Get()
    async getAllVideos(@Res() res: Response, @Query('query') query?: string) {
        const timestamp = new Date().toISOString();

        const videos = await this.videosService.getAllVideos(query);
        return res.status(HttpStatus.OK).json({
            success: true,
            message: 'Datos del usuario obtenidos con éxito',
            data: videos,
            code: HttpStatus.OK,
            timestamp,
            errors: []
          });
    }

    private extractToken(req: Request): string {
        const authHeader = req.headers['authorization'];
        if (!authHeader) {
          throw new HttpException('Token no proporcionado.', HttpStatus.UNAUTHORIZED);
        }
    
        const tokenParts = authHeader.split(' ');
        if (tokenParts.length !== 2 || tokenParts[0] !== 'Bearer') {
          throw new HttpException('Formato de token inválido.', HttpStatus.UNAUTHORIZED);
        }
    
        return tokenParts[1];
    }
}
