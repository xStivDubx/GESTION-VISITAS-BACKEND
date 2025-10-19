import { RowDataPacket } from "mysql2";
import { db } from "../config/connection";
import { ConfigService } from "./config.service";


const configService = new ConfigService();
export class GraphService {


    async getDataForGraphAdmin(): Promise<any> {
        const queryVisitState = await configService.getConfig('GRAPH_STATE_VISIT_ADMIN');
        if (!queryVisitState) throw new Error('No se encontró la configuración para GRAPH_STATE_VISIT_ADMIN');
        const [visitState] = await db.query<RowDataPacket[]>(queryVisitState);


        const queryVisitMonth = await configService.getConfig('GRAPH_VISIT_MONTH_ADMIN');
        if (!queryVisitMonth) throw new Error('No se encontró la configuración para GRAPH_VISIT_MONTH_ADMIN');
        const [visitMonth] = await db.query<RowDataPacket[]>(queryVisitMonth);


        //VALIDAR SI APLICA
        const queryUsers = await configService.getConfig('GRAPH_USERS_ADMIN');
        if (!queryUsers) throw new Error('No se encontró la configuración para GRAPH_USERS_ADMIN');
        const [users] = await db.query<RowDataPacket[]>(queryUsers);



        const queryTopClients = await configService.getConfig('GRAPH_TOP_CLIENTS_ADMIN');
        if (!queryTopClients) throw new Error('No se encontró la configuración para GRAPH_TOP_CLIENTS_ADMIN');
        const [topClients] = await db.query<RowDataPacket[]>(queryTopClients);

        const queryVisitCancel = await configService.getConfig('GRAPH_VISIT_CANCEL_ADMIN');
        if (!queryVisitCancel) throw new Error('No se encontró la configuración para GRAPH_VISIT_CANCEL_ADMIN');
        const [visitCancel] = await db.query<RowDataPacket[]>(queryVisitCancel);

        const queryCardsVisits = await configService.getConfig('CARDS_VISITS_ADMIN');
        if (!queryCardsVisits) throw new Error('No se encontró la configuración para CARDS_VISITS_ADMIN');
        const [cardsVisits] = await db.query<RowDataPacket[]>(queryCardsVisits);



        let graphData={
            visitState:  visitState,
            visitMonth:  visitMonth,
            users:  users,
            topClients: topClients,
            visitCancel: visitCancel,
            cardsVisits: cardsVisits[0]
            
        }


        return graphData;
    }





 
}