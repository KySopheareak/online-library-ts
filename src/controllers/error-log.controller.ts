import errorLogModel from "../models/error-log.model";


export default class ErrorLogController {

    public static saveLog(
        route: string,
        source: string,
        describe: string,
        error: any = null,
        data: any = null) {

        var err: any = error;
        if (typeof (err) !== 'string') {
            err = error.message
        } else if (error.response) {
            err = error.response.data;
        }


        try {
            errorLogModel.create({
                route: route,
                source: source,
                describe: describe,
                error: err,
                data: data
            });
        } catch (err) {
            errorLogModel.create({
                route: route,
                source: source,
                describe: 'ERROR ADD LOG',
                error: err,
                data: data
            });
        }
    }
}