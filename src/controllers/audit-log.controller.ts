import auditLogModel from '../models/audit-log.model';

export default class AuditLogController {

    public static saveLog(route: string, source: string, describe: string, response: any = null, 
        data: any = null, id: string = '', updated_by: string = '') {

        try {
            auditLogModel.create({
                route: route,
                source: source,
                describe: describe,
                response: response,
                id: id,
                data: data,
                updated_by: updated_by
            });
        } catch (err) {
            auditLogModel.create({
                route: route,
                source: source,
                describe: 'ERROR ADD LOG',
                response: response.toString(),
                id: id,
                data: data,
                updated_by: updated_by
            });
        }
    }
}