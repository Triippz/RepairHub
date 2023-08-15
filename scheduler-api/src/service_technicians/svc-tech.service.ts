import {Injectable, NotFoundException} from "@nestjs/common";
import {PrismaService} from "nestjs-prisma";

@Injectable()
export class SvcTechService {
    constructor(private readonly prisma: PrismaService) {
    }

    async getTechs() {
        return this.prisma.serviceTechnician.findMany({
            include: {
                workingHours: true,
            }
        });
    }

    async getTech(id: number) {
        const tech = await this.prisma.serviceTechnician.findUnique({
            where: {id},
            include: {
                workingHours: true,
            }
        });

        if (!tech) {
            throw new NotFoundException(`Service Tech with ID~${id} was not found`);
        }

        return tech;
    }
}
