import { useRouter } from 'next/router';

export default function BackButton() {
  const router = useRouter();

  const handleClick = () => {
    router.push('/');
  };

  return (
    <button
      onClick={handleClick}
      className="px-3 py-2 rounded-md text-sm font-medium bg-text-black text-background hover:bg-gray-700 hover:text-background"
    >
      Domů
    </button>
  );
}