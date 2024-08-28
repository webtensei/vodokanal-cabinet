import { Link } from '@nextui-org/react';

export function FullPageError({ error }: { error: any | JSX.IntrinsicAttributes }) {
  return <div className='h-[80vh] w-full flex justify-center items-center gap-2 flex-col'>
    <h1 className='text-2xl'>Упс, ошибка</h1>
  <Link href='/profile' size='lg'>На главную</Link>

    <div className='px-2 py-1 h-fit font-mono font-normal inline-block whitespace-nowrap bg-warning/20 text-warning-600 dark:text-warning text-small rounded-small max-w-[100vw] overflow-y-auto'>
      <h5>Stack trace</h5>
      <p className=' max-w-[100vw] overflow-y-auto'>
        {JSON.stringify(error, null, 0)}
      </p>
    </div>
  </div>;
}
