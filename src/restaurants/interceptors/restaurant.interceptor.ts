import { CallHandler, ExecutionContext, Injectable, NestInterceptor, RequestMethod } from "@nestjs/common";
import { map, Observable } from "rxjs";

@Injectable()
export class RestaurantInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
        return next
            .handle()
            .pipe(map((data) => {
                    if(Array.isArray(data)) {
                        return data.map(({ location, _id, _v, name, address}) => ({
                            id: _id,
                            name,
                            address,
                            longitude: location.coordinates[0],
                            latitude: location.coordinates[1],
                        }));
                    } else if(Object.prototype.toString.call(data) === "[object Object]") {
                        if(context.switchToHttp().getRequest().method === "DELETE") {
                            return data;
                        }

                        return {
                            id: data._id,
                            name:data.name,
                            address:data.address,
                            longitude: data.location.coordinates[0],
                            latitude: data.location.coordinates[1],
                        }                    }
                })
            );
    }

}