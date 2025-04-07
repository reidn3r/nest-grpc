import { NotificationResponseDTO } from "dto/notification-response.dto";
import { UserDTO } from "dto/user.dto";
import { Observable } from "rxjs";

export interface GRPCNotificationInterface {
  run (user: UserDTO): Observable<NotificationResponseDTO>;
}