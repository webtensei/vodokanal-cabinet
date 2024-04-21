export function FullPageError({ error }: { error: any | JSX.IntrinsicAttributes }) {
  console.log('Ошибка:', error);
  return <div>Произошла глобальная ошибка</div>;
}
