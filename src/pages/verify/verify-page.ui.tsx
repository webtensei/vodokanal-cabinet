import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { userService } from '@entities/user/user.queries';
import { routes } from '@shared/lib/react-router';
import { VerifyPhoneForm, VerifyEmailForm } from '@widgets/verify-forms';

export function VerifyPage() {
  const user = userService.getCache();
  const navigate = useNavigate();

  const createVerificationUI = () => {
    if (!user?.contacts.phone_activated) return <VerifyPhoneForm />;
    if (!user?.contacts.email_activated) return <VerifyEmailForm />;
  };

  useEffect(() => {
    if (user?.contacts.phone_activated && user?.contacts.email_activated) return navigate(routes.profile.root());
  }, [user]);
  return (
    <div className="absolute bottom-0 left-0 right-0 top-0 flex h-screen w-screen items-center justify-center">
      {createVerificationUI()}
    </div>
  );
}
