import {ApiBearerAuth, ApiTags} from "@nestjs/swagger";
import {Controller, Get, Param, ParseIntPipe, UseGuards} from "@nestjs/common";
import {SvcTechService} from "./svc-tech.service";
import {AuthGuard} from "@nestjs/passport";

@ApiTags('Service Technicians')
@Controller('svc-techs')
export class SvcTechController {
    constructor(
        private readonly svcTechService: SvcTechService
        ) {}

    @Get()
    @ApiBearerAuth()
    @UseGuards(AuthGuard('jwt'))
    async getTechs() {
        return this.svcTechService.getTechs();
    }

    @Get(':id')
    @ApiBearerAuth()
    @UseGuards(AuthGuard('jwt'))
    async getTech(@Param("id", ParseIntPipe) id: number) {
        return this.svcTechService.getTech(id);
    }
}
