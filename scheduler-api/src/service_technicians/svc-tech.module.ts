import {Module} from "@nestjs/common";
import {SvcTechService} from "./svc-tech.service";
import {SvcTechController} from "./svc-tech.controller";

@Module({
    imports: [],
    controllers: [SvcTechController],
    providers: [SvcTechService],
})
export class SvcTechModule {}
