'use client';

import * as Toast from '@radix-ui/react-toast';

export function Toaster() {
  return (
    <Toast.Provider swipeDirection="right">
      <Toast.Viewport className="fixed bottom-0 right-0 p-6 flex flex-col gap-3 w-[390px] max-w-[100vw] m-0 list-none z-[2147483647] outline-none" />
    </Toast.Provider>
  );
}
