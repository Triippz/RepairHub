import {Injectable} from "@nestjs/common";
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
        return this.prisma.serviceTechnician.findUnique({
            where: {id},
            include: {
                workingHours: true,
            }
        });
    }
}
