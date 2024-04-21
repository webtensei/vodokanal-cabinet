import { Button } from '@nextui-org/react';
import { Link } from 'react-router-dom';

export function NeHomePage() {

  return (
    <div className="flex flex-col gap-4">
      nehome
      <div>
        <Button as={Link} to='/home' color='secondary'>home</Button>
      </div>
    </div>
  );
}

