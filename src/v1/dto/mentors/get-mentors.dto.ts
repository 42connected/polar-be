import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsOptional, IsString } from "class-validator"

export class GetMentorsQueryDto {
    @IsOptional()
    @IsArray()
    @ApiProperty({
      description: "keywordId",
      required: false,
      type : Array
    })
    keywordsId?: string[];

    @IsOptional()
    @IsString()
    @ApiProperty({
        description: "mentorName",
        required: false,
        type: String
    })
    mentorName?: string;
}