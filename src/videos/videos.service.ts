import { Injectable, HttpException, HttpStatus, NotFoundException, Delete } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Video } from 'src/entities/video.entity';
import { VideoDataDto } from 'src/DTO/videoDataDto';
import { ChangeVideoDataDto } from 'src/DTO/changeVideoDataDto';
import { CreateVideoDto } from 'src/DTO/createVideoDto';
import { Model, NullExpression, Types } from 'mongoose';

@Injectable()
export class VideosService {
    constructor(
        @InjectModel(Video.name) private readonly videoModel: Model<Video>,

    ) {}

    async createVideo(videoData: CreateVideoDto): Promise<Video> {
        try {
            const newVideoData = {
                title: videoData.title,
                description: videoData.description,
                genre: videoData.genre,
                status: true,
            }
            const newVideo = new this.videoModel(newVideoData);
            return await newVideo.save();
        } catch (error) {
            throw new HttpException('Error creating video', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async getVideoById(id: string): Promise<VideoDataDto> {
        if(!Types.ObjectId.isValid(id)) throw new NotFoundException('ID no válido');
        const video = await this.videoModel.findById(id).exec();
        if (!video) throw new NotFoundException('Video no encontrado');
        if (!video.status) throw new NotFoundException('Video no encontrado');
        return {
            id: video._id as string,
            title: video.title,
            description: video.description,
            genre: video.genre,
        };
    }

    async updateVideoData(id: string, updatedVideo: ChangeVideoDataDto): Promise<ChangeVideoDataDto> {
        if(!Types.ObjectId.isValid(id)) throw new NotFoundException('ID no válido');
        const video = await this.videoModel.findByIdAndUpdate(id, updatedVideo, { new: true }).exec();
        if (!video) throw new NotFoundException('Video no encontrado');
        if (!video.status) throw new NotFoundException('Video no encontrado');
        const updatedVideoData = {
            title: updatedVideo.title ? updatedVideo.title : undefined,
            description: updatedVideo.description ? updatedVideo.description : undefined,
            genre: updatedVideo.genre ? updatedVideo.genre : undefined,
        };

        return updatedVideoData;
    }

    async deleteVideo(id: string): Promise<void> { 
        if(!Types.ObjectId.isValid(id)) throw new NotFoundException('ID no válido');
        const video = await this.videoModel.findByIdAndUpdate(
            {_id: id, status: true}, { status: false }, { new: true }
        ).exec();
        if (!video) throw new NotFoundException('Video no encontrado');
        return;
    }

    async getAllVideos(query?: string): Promise<Video[]> {
        if (query) {
            return this.videoModel.find({
                $or: [
                    { title: { $regex: query, $options: 'i' }, status: true },
                    { description: { $regex: query, $options: 'i' }, status: true },
                    { genre: { $regex: query, $options: 'i' }, status: true },
                ]
            }).exec();
        }
        return this.videoModel.find({ status: true }).exec();
    }
}