import { sessionStore } from '@entities/session/session.model';
import { userService } from '@entities/user/user.queries';

export function ProfilePage() {
  const data = sessionStore.getState();
  const user = userService.getCache();


  return (
    <div>
      страничка профиля
      {
        JSON.stringify(data)
      }
      <br/>
    сам юзер:
      {
        JSON.stringify(user)
      }
    </div>
  );
}
