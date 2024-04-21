import { useEffect, useState } from 'react';
import { Button } from '@nextui-org/react';
import { useTheme } from 'next-themes';
import { Link } from 'react-router-dom';

export function HomePage() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;
  return (
    <div className="flex flex-col gap-4">
      home
      <div>
        <Button color="primary" onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
          change
        </Button>
      </div>
     <div>
       <Link to="/" className="mt-2 rounded border-2 border-gray-100">
         startpage
       </Link>
     </div>

     <div>
       <Button as={Link} to='/nehome' color='secondary'>nehome</Button>
     </div>
    </div>
  );
}

