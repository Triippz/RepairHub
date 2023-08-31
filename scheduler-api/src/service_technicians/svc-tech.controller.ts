import {ApiTags} from "@nestjs/swagger";
import {Controller, Get, Param, ParseIntPipe, UseGuards} from "@nestjs/common";
import {SvcTechService} from "./svc-tech.service";
import {ApiKeyGuard} from "../auth/guards/api-key.guard";

@ApiTags('Service Technicians')
@Controller('svc-techs')
export class SvcTechController {
    constructor(
        private readonly svcTechService: SvcTechService
        ) {}

    @Get()
    @UseGuards(ApiKeyGuard)
    async getTechs() {
        return this.svcTechService.getTechs();
    }

    @Get(':id')
    @UseGuards(ApiKeyGuard)
    async getTech(@Param("id", ParseIntPipe) id: number) {
        return this.svcTechService.getTech(id);
    }
}
