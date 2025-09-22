import { Spinner } from '@material-tailwind/react';
import { useContext } from 'react';
import { Context } from '../../context/Context';

export default function AppLoader() {
  const { isChatHistoryLoading } = useContext(Context);

  const isLoaderActive = isChatHistoryLoading;

  const loader = isLoaderActive ? (
    <div className="flex fixed w-full h-full justify-center items-center backdrop-brightness-80 z-50 ">
      <Spinner className="h-8 w-8 animate-spin" />
    </div>
  ) : null;

  return loader;
}
