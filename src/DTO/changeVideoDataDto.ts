import { IsOptional, MinLength } from 'class-validator';
export class ChangeVideoDataDto {
    @IsOptional()
    @MinLength(3)
    title: string;

    @IsOptional()
    @MinLength(5)
    description: string;

    @IsOptional()
    @MinLength(5)
    genre: string;
}
